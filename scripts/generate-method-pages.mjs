import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';
import { dump } from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const dataDir = path.join(rootDir, 'node_modules/apiops-cycles-method-data/src/data/method');
const snippetDir = path.join(rootDir, 'node_modules/apiops-cycles-method-data/src/snippets');
const defaultLocale = 'en';
const defaultLocaleDir = path.join(dataDir, defaultLocale);
const docsDir = path.join(rootDir, 'src/content/docs');
const cacheFile = path.join(__dirname, '.method-checksums.json');

const baseLabels = {
  stations: 'Stations',
  why_it_matters: 'Why it matters',
  outcomes: 'Outcomes',
  how_it_works: 'How it works',
  steps: 'Steps',
  apply_in_work: 'Apply in your work',
  entry_criteria: 'Entry criteria',
  exit_criteria: 'Exit criteria',
  related_metrolines: 'Related metrolines',
};

function flatten(obj, prefix = '', out = {}) {
  for (const [key, val] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${key}` : key;
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      flatten(val, full, out);
    } else {
      out[full] = val;
    }
  }
  return out;
}

function translate(value, labels) {
  if (!labels) return value;
  let result = labels[value];
  if (typeof result === 'undefined') {
    const m = value.match(/^(.*)\.(\d+)$/);
    if (m && Array.isArray(labels[m[1]])) {
      result = labels[m[1]][Number(m[2])];
    }
  }
  return typeof result === 'undefined' ? value : result;
}

function translateItem(key, index, labels) {
  if (!labels) return key;
  let val = labels[key];
  if (typeof val !== 'undefined') {
    if (Array.isArray(val)) return val[index] ?? val[0];
    return val;
  }
  const m = key.match(/^(.*)\.(\d+)$/);
  if (m && Array.isArray(labels[m[1]])) {
    return labels[m[1]][Number(m[2])] ?? key;
  }
  return key;
}

function expandTranslations(keys, labels) {
  const baseKeys = new Set();
  for (const k of keys) {
    const m = /^(.+)\.\d+$/.exec(k);
    if (!m) baseKeys.add(k);
  }
  const out = [];
  for (const k of keys) {
    const m = /^(.+)\.(\d+)$/.exec(k);
    if (m && baseKeys.has(m[1])) continue;
    const tr = translate(k, labels);
    if (Array.isArray(tr)) out.push(...tr);
    else out.push(tr);
  }
  return out;
}

const defaultBody = 'Content coming soon.';

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-)|(-$)/g, '');
}

function checksum(data) {
  return createHash('sha256').update(data).digest('hex');
}

async function loadCache() {
  try {
    const c = await fsPromises.readFile(cacheFile, 'utf8');
    return JSON.parse(c);
  } catch {
    return {};
  }
}

async function saveCache(cache) {
  await fsPromises.writeFile(cacheFile, JSON.stringify(cache, null, 2));
}

async function ensureDir(dir) {
  await fsPromises.mkdir(dir, { recursive: true });
}

function htmlEncode(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function t(key, localeLabels) {
  return (localeLabels && localeLabels[key]) || baseLabels[key] || key;
}

function frontmatter(obj) {
  return `---\n${dump(obj)}---\n`;
}

async function writeMarkdown(file, fm, body) {
  const content = frontmatter(fm) + '\n' + (body || defaultBody) + '\n';
  await ensureDir(path.dirname(file));
  await fsPromises.writeFile(file, content);
}

function stationBody(
  data,
  resources,
  labels = baseLabels,
  locale = '',
  entryCriteria = [],
  exitCriteria = [],
  criteriaMap = {},
  lines = [],
  lineMap = {}
) {
  let out = "import { Steps, LinkCard } from '@astrojs/starlight/components';\n\n";
  if (data.description) out += `${translate(data.description, labels)}\n\n`;
  if (Array.isArray(data.outcomes) && data.outcomes.length) {
    out += `## ${t('outcomes', labels)}\n\n`;
    const items = expandTranslations(data.outcomes, labels).map((i) => `- ${i}`);
    out += items.join('\n');
    out += '\n\n';
  }
  if (Array.isArray(lines) && lines.length) {
    out += `## ${t('related_metrolines', labels)}\n\n`;
    out += '<ul class="related-metrolines-list">\n';
    lines.forEach((id) => {
      const line = lineMap[id];
      if (!line) return;
      const prefix = locale ? `/${locale}` : '';
      const title = translate(line.title, labels);
      const color = line.color || '#000';
      out += `<li style="--line-color: ${color}"><a href="${prefix}/lines/${line.slug}/" style="text-decoration-color:${color};text-decoration-thickness:4px">${title}</a></li>\n`;
    });
    out += '</ul>\n\n';
  }
  if (data.why_it_matters) out += `## ${t('why_it_matters', labels)}\n\n${translate(data.why_it_matters, labels)}\n\n`;
  if (Array.isArray(entryCriteria) && entryCriteria.length) {
    out += `:::note[${t('entry_criteria', labels)}]{icon="right-arrow"}\n\n`;
    const items = entryCriteria.map((id) => {
      const tr = translate('criterion.' + id, labels);
      const text = tr === 'criterion.' + id ? criteriaMap[id] || id : tr;
      return `- ${text}`;
    });
    out += items.join('\n');
    out += '\n:::\n\n';
  }
  if (Array.isArray(exitCriteria) && exitCriteria.length) {
    out += `:::note[${t('exit_criteria', labels)}]{icon="left-arrow"}\n\n`;
    const items = exitCriteria.map((id) => {
      const tr = translate('criterion.' + id, labels);
      const text = tr === 'criterion.' + id ? criteriaMap[id] || id : tr;
      return `- ${text}`;
    });
    out += items.join('\n');
    out += '\n:::\n\n';
  }
  const how = data.how_it_works || data['how-it-works'];
  if (Array.isArray(how) && how.length) {
    out += `## ${t('how_it_works', labels)}\n\n`;
    out += '<Steps>\n';
    let stepNum = 1;
    how.forEach((step, i) => {
      const text = translateItem(step.step, i, labels);
      out += `${stepNum}. ${text}`;
      if (step.resource && resources[step.resource]) {
        const res = resources[step.resource];
        const prefix = locale ? `/${locale}` : '';
        const title = htmlEncode(translate(res.title, labels));
        const desc = htmlEncode(translate(res.description || '', labels));
        out += ` <LinkCard title="${title}" href="${prefix}/${res.slug}/" description="${desc}" />`;
      }
      out += '\n';
      stepNum += 1;
    });
    out += '</Steps>\n\n';
  }
  if (data.apply_in_work) out += `## ${t('apply_in_work', labels)}\n\n${translate(data.apply_in_work, labels)}\n`;
  return out.trim();
}

async function resourceBody(res, labels = baseLabels, locale = '') {
  let out = "import { Aside } from '@astrojs/starlight/components';\n";
  if (res.category === 'canvas') {
    const prefix = locale ? '../../../../components' : '../../../components';
    out += `import CanvasCreator from '${prefix}/CanvasCreator.astro';\n`;
  }
  out += "\n";
  if (res.description) out += `${translate(res.description, labels)}\n\n`;
  if (Array.isArray(res.outcomes) && res.outcomes.length) {
    out += `## ${t('outcomes', labels)}\n\n`;
    const items = expandTranslations(res.outcomes, labels).map((i) => `- ${i}`);
    out += items.join('\n');
    out += '\n\n';
  }
  if (res.how_it_works && (res.how_it_works.steps || res.how_it_works.tips)) {
    out += `## ${t('how_it_works', labels)}\n\n`;
    if (res.canvas) {
      const prefix = locale ? '../../../../' : '../../../';
      const baseDir = locale ? path.posix.join('assets/resource', locale) : 'assets/resource';
      const fileBase = `Canvas_${res.canvas}`;
      const alt = htmlEncode(translate(res.title, labels));
      const svg = `${prefix}${path.posix.join(baseDir, fileBase + '.svg')}`;
      out += `![${alt}](${svg})\n\n`;
      const links = [
        `[SVG](${svg})`,
        `[PNG](${prefix}${path.posix.join(baseDir, fileBase + '.png')})`,
        `[JSON](${prefix}${path.posix.join(baseDir, fileBase + '.json')})`,
      ].join(' | ');
      out += links + '\n\n';
    } else if (res.image) {
      let img = res.image.replace(/^\//, '');
      if (locale) {
        const baseImg = img.startsWith('assets/resource/')
          ? img.slice('assets/resource/'.length)
          : img;
        const locImgPath = path.join(rootDir, 'src/assets/resource', locale, baseImg);
        try {
          await fsPromises.access(locImgPath);
          img = path.posix.join('assets/resource', locale, baseImg);
        } catch {
          // use default image path
        }
      }
      const prefix = locale ? '../../../../' : '../../../';
      const alt = htmlEncode(res.title);
      out += `![${alt}](${prefix}${img})\n\n`;
    }
    if (Array.isArray(res.how_it_works.steps) && res.how_it_works.steps.length) {
      out += `### ${t('steps', labels)}\n\n`;
      let stepNum = 1;
      res.how_it_works.steps.forEach((s, i) => {
        const text = translateItem(s, i, labels);
        out += `${stepNum}. ${text}\n`;
        stepNum += 1;
      });
      out += '\n';
    }
    if (Array.isArray(res.how_it_works.tips) && res.how_it_works.tips.length) {
      out += '<Aside type="tip">\n\n';
      res.how_it_works.tips.forEach((t, i) => {
        const tip = translateItem(t, i, labels);
        out += `- ${tip}\n`;
      });
      out += '</Aside>\n\n';
    }
  }
  if (res.snippet) {
    const baseSnippet = res.snippet.replace(/^\//, '');
    let snippetPath = path.join(snippetDir, baseSnippet);
    if (locale) {
      const rel = baseSnippet.startsWith('snippets/')
        ? baseSnippet.slice('snippets/'.length)
        : baseSnippet;
      const locPath = path.join(snippetDir, locale, rel);
      try {
        await fsPromises.access(locPath);
        snippetPath = locPath;
      } catch {
        // fall back to default path
      }
    }
    try {
      const snippetContent = await fsPromises.readFile(snippetPath, 'utf8');
      out += '\n\n' + snippetContent.trim();
  } catch {
      console.warn(`Snippet file not found: ${snippetPath}`);
    }
  }
  if (res.category === 'canvas') {
    const id = res.canvas || res.id;
    out += `\n\n<CanvasCreator canvasId="${id}" />`;
  }
  return out.trim();
}

function lineBody(
  line,
  stationMap,
  stationCriteria,
  criteriaMap,
  labels = baseLabels,
  locale = ''
) {
  let out = "import { Steps } from '@astrojs/starlight/components';\n\n";
  if (line.description) out += `${translate(line.description, labels)}\n\n`;
  if (Array.isArray(line.stations) && line.stations.length) {
    out += `## ${t('stations', labels)}\n\n`;
    out += `<Steps>\n<ol class="line-steps" style="--line-color: ${line.color}">\n`;
    line.stations.forEach((id) => {
      const st = stationMap[id];
      const prefix = locale ? `/${locale}` : '';
      const link = st
        ? `[${translate(st.title, labels).split(' - ')[0]}](${prefix}/${st.slug}/)`
        : id;
      out += `<li>\n${link}`;
      const criteria = stationCriteria[id] || [];
      if (criteria.length) {
        out += `\n\n:::note[${t('entry_criteria', labels)}]{icon="right-arrow"}\n\n`;
        const items = criteria
          .map((c) => {
            const tr = translate('criterion.' + c, labels);
            const text = tr === 'criterion.' + c ? criteriaMap[c] || c : tr;
            return `- ${text}`;
          })
          .join('\n');
        out += items + '\n:::';
      }
      out += `\n</li>\n`;
    });
    out += '</ol>\n</Steps>';
  }
  return out.trim();
}

async function generateIndex(info, folder, locale, labels = baseLabels) {
  const fm = { title: translate(info.title, labels) };
  if (typeof info.order !== 'undefined') fm.sidebar = { order: info.order };
  if (info.image) fm.image = info.image;
  fm.slug = locale ? `${locale}/${folder}` : folder;
  const dir = locale ? path.join(docsDir, locale, folder) : path.join(docsDir, folder);
  const file = path.join(dir, 'index.mdx');
  let body = translate(info.description || '', labels);
  if (info.image) {
    const depth = locale ? 4 : 3;
    const rel = path.posix.join(...Array(depth).fill('..'), info.image.replace(/^\//, ''));
    body += `\n\n![Metro Map](${rel})`;
  }
  await writeMarkdown(file, fm, body);
}

async function generate() {
  const cache = await loadCache();
  const newCache = {};

  const stationsPath = path.join(dataDir, 'stations.json');
  const linesPath = path.join(dataDir, 'lines.json');
  const resourcesPath = path.join(dataDir, 'resources.json');
  const criteriaPath = path.join(dataDir, 'criteria.json');
  const stationCriteriaPath = path.join(dataDir, 'station-criteria.json');
  const baseLabelFiles = [
    'labels.json',
    'labels.lines.json',
    'labels.stations.json',
    'labels.resources.json',
    'labels.criteria.json',
  ];

  const stationsDataRaw = await fsPromises.readFile(stationsPath, 'utf8');
  const linesDataRaw = await fsPromises.readFile(linesPath, 'utf8');
  const resourcesDataRaw = await fsPromises.readFile(resourcesPath, 'utf8');
  const criteriaDataRaw = await fsPromises.readFile(criteriaPath, 'utf8');
  const stationCriteriaRaw = await fsPromises.readFile(stationCriteriaPath, 'utf8');

  for (const lf of baseLabelFiles) {
    const full = path.join(defaultLocaleDir, lf);
    try {
      const raw = await fsPromises.readFile(full, 'utf8');
      Object.assign(baseLabels, flatten(JSON.parse(raw)));
      newCache[lf] = checksum(raw);
    } catch {
      // ignore missing files
    }
  }

  newCache['stations.json'] = checksum(stationsDataRaw);
  newCache['lines.json'] = checksum(linesDataRaw);
  newCache['resources.json'] = checksum(resourcesDataRaw);
  newCache['criteria.json'] = checksum(criteriaDataRaw);
  newCache['station-criteria.json'] = checksum(stationCriteriaRaw);

  const linesData = JSON.parse(linesDataRaw);
  const stationsData = JSON.parse(stationsDataRaw);
  const resourcesData = JSON.parse(resourcesDataRaw);
  const criteriaData = JSON.parse(criteriaDataRaw);
  const stationCriteriaData = JSON.parse(stationCriteriaRaw);

  const resourceMap = {};
  if (Array.isArray(resourcesData.resources)) {
    for (const res of resourcesData.resources) {
      const slug = res.slug;
      let image = res.image;
      const canvas = res.canvas;
      if (image) {
        const imgPath = path.join(rootDir, 'src', image.replace(/^\//, ''));
        try {
          await fsPromises.access(imgPath);
        } catch {
          image = undefined;
        }
      }
      resourceMap[res.id] = { ...res, slug, image, canvas };
    }
  }

  const criteriaMap = {};
  for (const c of criteriaData) {
    criteriaMap[c.id] = c.description;
  }

  const lineMap = {};
  for (const ln of linesData.lines.items) {
    lineMap[ln.id] = ln;
  }

  const stationCriteria = stationCriteriaData || {};

  const nextStationCriteria = {};
  const coreItems = stationsData['core-stations'].items;
  for (let i = 0; i < coreItems.length; i++) {
    const currentId = coreItems[i].id;
    const nextId = coreItems[(i + 1) % coreItems.length].id;
    nextStationCriteria[currentId] = stationCriteria[nextId] || [];
  }

  const stationMap = {};
  for (const st of stationsData['core-stations'].items) {
    stationMap[st.id] = st;
  }
  for (const st of stationsData['sub-stations'].items) {
    stationMap[st.id] = st;
  }

  let regenerate = false;
  if (
    cache['stations.json'] !== newCache['stations.json'] ||
    cache['lines.json'] !== newCache['lines.json'] ||
    cache['resources.json'] !== newCache['resources.json'] ||
    cache['criteria.json'] !== newCache['criteria.json'] ||
    cache['station-criteria.json'] !== newCache['station-criteria.json'] ||
    cache['labels.json'] !== newCache['labels.json']
  ) {
    regenerate = true;
  }

  const entries = await fsPromises.readdir(dataDir, { withFileTypes: true });
  const locales = [];
  const labelsLocales = {};

  for (const entry of entries) {
    if (
      entry.isDirectory() &&
      /^[a-z]{2}(?:-[A-Z]{2})?$/.test(entry.name) &&
      entry.name !== defaultLocale
    ) {
      const locale = entry.name;
      const localeDir = path.join(dataDir, locale);
      const labelFiles = [
        'labels.json',
        'labels.lines.json',
        'labels.stations.json',
        'labels.resources.json',
        'labels.criteria.json',
      ];
      const labels = {};
      for (const lf of labelFiles) {
        const full = path.join(localeDir, lf);
        try {
          const content = await fsPromises.readFile(full, 'utf8');
          Object.assign(labels, flatten(JSON.parse(content)));
          const key = path.join(locale, lf);
          newCache[key] = checksum(content);
          if (cache[key] !== newCache[key]) regenerate = true;
        } catch {
          // ignore missing
        }
      }
      labelsLocales[locale] = labels;
      locales.push(locale);
    }
  }

  if (!regenerate) {
    console.log('No data changes. Skipping generation.');
    return;
  }

  const stationLines = {};
  for (const line of linesData.lines.items) {
    for (const stationId of line.stations) {
      if (!stationLines[stationId]) stationLines[stationId] = [];
      stationLines[stationId].push(line.id);
    }
  }

  await generateIndex(linesData.lines, 'lines');
  for (const locale of locales) {
    const labels = labelsLocales[locale];
    await generateIndex(linesData.lines, 'lines', locale, labels);
  }

  await generateIndex(stationsData['core-stations'], 'core-stations');
  for (const locale of locales) {
    const labels = labelsLocales[locale];
    await generateIndex(stationsData['core-stations'], 'core-stations', locale, labels);
  }

  await generateIndex(stationsData['sub-stations'], 'suburb-stations');
  for (const locale of locales) {
    const labels = labelsLocales[locale];
    await generateIndex(stationsData['sub-stations'], 'suburb-stations', locale, labels);
  }

  for (const line of linesData.lines.items) {
    await generateLine(line, stationMap, stationCriteria, criteriaMap, labelsLocales);
  }

  for (const station of stationsData['core-stations'].items) {
    await generateStation(
      station,
      'core-stations',
      stationLines[station.id],
      lineMap,
      resourceMap,
      stationCriteria[station.id],
      nextStationCriteria[station.id],
      criteriaMap,
      labelsLocales
    );
  }
  for (const station of stationsData['sub-stations'].items) {
    await generateStation(
      station,
      'suburb-stations',
      stationLines[station.id],
      lineMap,
      resourceMap,
      stationCriteria[station.id],
      [],
      criteriaMap,
      labelsLocales
    );
  }

  if (Array.isArray(resourcesData.resources)) {
    for (const res of resourcesData.resources) {
      const processed = resourceMap[res.id];
      await generateResource(processed, labelsLocales);
    }
  }

  await saveCache(newCache);
  console.log('Method pages generated.');
}

async function generateLine(line, stationMap, stationCriteria, criteriaMap, labelsLocales) {
  const baseSlug = `lines/${line.slug || line.id}`;
  const base = {
    title: translate(line.title, baseLabels),
    stations: line.stations,
    slug: baseSlug,
    color: line.color,
    sidebar: { order: line.order },
  };
  const file = path.join(docsDir, 'lines', `${line.id}.mdx`);
  await writeMarkdown(file, base, lineBody(line, stationMap, stationCriteria, criteriaMap, baseLabels));
  for (const locale of Object.keys(labelsLocales)) {
    const labels = labelsLocales[locale] || baseLabels;
    const fm = {
      title: translate(line.title, labels),
      stations: line.stations,
      slug: `${locale}/${baseSlug}`,
      color: line.color,
      sidebar: { order: line.order },
    };
    const dest = path.join(docsDir, locale, 'lines', `${line.id}.mdx`);
    await writeMarkdown(dest, fm, lineBody(line, stationMap, stationCriteria, criteriaMap, labels, locale));
  }
}

async function generateStation(
  station,
  folder,
  lines,
  lineMap,
  resources,
  entryCriteria,
  exitCriteria,
  criteriaMap,
  labelsLocales
) {
  const baseSlug = station.slug;
  const fm = {
    title: translate(station.title, baseLabels).split(' - ')[0],
    slug: baseSlug,
    sidebar: { order: station.order },
    icon: station.icon,
  };
  if (lines && lines.length) fm.metrolines = lines;
  const file = path.join(docsDir, folder, `${station.id}.mdx`);
  await writeMarkdown(
    file,
    fm,
    stationBody(
      station,
      resources,
      baseLabels,
      '',
      entryCriteria,
      exitCriteria,
      criteriaMap,
      lines,
      lineMap
    )
  );
  for (const locale of Object.keys(labelsLocales)) {
    const labels = labelsLocales[locale] || baseLabels;
    const locFm = {
      title: translate(station.title, labels).split(' - ')[0],
      slug: `${locale}/${baseSlug}`,
      sidebar: { order: station.order },
      icon: station.icon,
    };
    if (lines && lines.length) locFm.metrolines = lines;
    const dest = path.join(docsDir, locale, folder, `${station.id}.mdx`);
    await writeMarkdown(
      dest,
      locFm,
      stationBody(
        station,
        resources,
        labels,
        locale,
        entryCriteria,
        exitCriteria,
        criteriaMap,
        lines,
        lineMap
      )
    );
  }
}

async function generateResource(resource, labelsLocales) {
  const baseSlug = resource.slug;
  const fileSlug = baseSlug.toLowerCase();
  const fm = {
    title: translate(resource.title, baseLabels),
    slug: baseSlug,
    sidebar: { order: resource.order },
    icon: resource.icon,
  };
  if (resource.category) fm.category = resource.category;
  if (resource.canvas) {
    fm.canvasId = resource.canvas;
    fm.image = `/assets/resource/Canvas_${resource.canvas}.png`;
  } else if (resource.image) {
    fm.image = resource.image;
  }
  const file = path.join(docsDir, `${fileSlug}.mdx`);
  await writeMarkdown(file, fm, await resourceBody(resource, baseLabels));
  for (const locale of Object.keys(labelsLocales)) {
    const labels = labelsLocales[locale] || baseLabels;
    const locFm = {
      title: translate(resource.title, labels),
      slug: `${locale}/${baseSlug}`,
      sidebar: { order: resource.order },
      icon: resource.icon,
    };
    if (resource.category) locFm.category = resource.category;
    if (resource.canvas) {
      locFm.canvasId = resource.canvas;
      locFm.image = `/assets/resource/${locale}/Canvas_${resource.canvas}.png`;
    } else if (resource.image) {
      locFm.image = resource.image;
    }
    const dest = path.join(docsDir, locale, `${fileSlug}.mdx`);
    await writeMarkdown(dest, locFm, await resourceBody(resource, labels, locale));
  }
}

generate().catch((e) => {
  console.error(e);
  process.exit(1);
});