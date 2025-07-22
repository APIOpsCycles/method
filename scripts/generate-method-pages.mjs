import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';
import { dump } from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const dataDir = path.join(rootDir, 'src/data/method');
const docsDir = path.join(rootDir, 'src/content/docs');
const cacheFile = path.join(__dirname, '.method-checksums.json');

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

function frontmatter(obj) {
  return `---\n${dump(obj)}---\n`;
}

async function writeMarkdown(file, fm, body) {
  const content = frontmatter(fm) + '\n' + (body || defaultBody) + '\n';
  await ensureDir(path.dirname(file));
  await fsPromises.writeFile(file, content);
}

function stationBody(data, resources) {
  let out = "import { Steps, LinkCard } from '@astrojs/starlight/components';\n\n";
  if (data.description) out += `${data.description}\n\n`;
  if (data.why_it_matters) out += `## Why it matters\n\n${data.why_it_matters}\n\n`;
  if (Array.isArray(data.outcomes) && data.outcomes.length) {
    out += '## Outcomes\n\n';
    out += data.outcomes.map((o) => `- ${o}`).join('\n');
    out += '\n\n';
  }
  const how = data.how_it_works || data['how-it-works'];
  if (Array.isArray(how) && how.length) {
    out += '## How it works\n\n';
    out += '<Steps>\n';
    how.forEach((step, i) => {
      out += `${i + 1}. ${step.step}`;
      if (step.resource && resources[step.resource]) {
        const res = resources[step.resource];
        out += ` <LinkCard title="${res.title}" href="/${res.slug}/" description="${res.description || ''}" />`;
      }
      out += '\n';
    });
    out += '</Steps>\n\n';
  }
  if (data.apply_in_work) out += `## Apply in your work\n\n${data.apply_in_work}\n`;
  return out.trim();
}

async function resourceBody(res) {
  let out = "import { Aside } from '@astrojs/starlight/components';\n\n";
  if (res.description) out += `${res.description}\n\n`;
  if (Array.isArray(res.outcomes) && res.outcomes.length) {
    out += '## Outcomes\n\n';
    out += res.outcomes.map((o) => `- ${o}`).join('\n');
    out += '\n\n';
  }
  if (res.how_it_works && (res.how_it_works.steps || res.how_it_works.tips)) {
    out += '## How it works\n\n';
    if (res.image) {
      const img = res.image.replace(/^\/?/, '');
      out += `![${res.title}](../../../${img})\n\n`;
    }
    if (Array.isArray(res.how_it_works.steps) && res.how_it_works.steps.length) {
      out += '### Steps\n\n';
      res.how_it_works.steps.forEach((s, i) => {
        out += `${i + 1}. ${s}\n`;
      });
      out += '\n';
    }
    if (Array.isArray(res.how_it_works.tips) && res.how_it_works.tips.length) {
      out += '<Aside type="tip">\n\n';
      res.how_it_works.tips.forEach((t) => {
        out += `- ${t}\n`;
      });
      out += '</Aside>\n\n';
    }
  }
  if (res.snippet) {
    const snippetPath = path.join(rootDir, 'src', res.snippet.replace(/^\//, ''));
    try {
      const snippetContent = await fsPromises.readFile(snippetPath, 'utf8');
      out += '\n\n' + snippetContent.trim();
    } catch {
      console.warn(`Snippet file not found: ${snippetPath}`);
    }
  }
  return out.trim();
}

function lineBody(line, stationMap) {
  let out = "import { Steps } from '@astrojs/starlight/components';\n\n";
  if (line.description) out += `${line.description}\n\n`;
  if (Array.isArray(line.stations) && line.stations.length) {
    out += '## Stations\n\n';
    out += '<Steps>\n';
    line.stations.forEach((id, i) => {
      const st = stationMap[id];
      const link = st ? `[${st.title.split(' - ')[0]}](/${st.slug}/)` : id;
      out += `${i + 1}. ${link}\n`;
    });
    out += '</Steps>';
  }
  return out.trim();
}

async function generateIndex(info, folder) {
  const fm = { title: info.title };
  if (typeof info.order !== 'undefined') fm.sidebar = { order: info.order };
  const file = path.join(docsDir, folder, 'index.mdx');
  await writeMarkdown(file, fm, info.description || '');
}

async function generate() {
  const cache = await loadCache();
  const newCache = {};

  const stationsPath = path.join(dataDir, 'stations.json');
  const linesPath = path.join(dataDir, 'lines.json');
  const resourcesPath = path.join(dataDir, 'resources.json');

  const stationsDataRaw = await fsPromises.readFile(stationsPath, 'utf8');
  const linesDataRaw = await fsPromises.readFile(linesPath, 'utf8');
  const resourcesDataRaw = await fsPromises.readFile(resourcesPath, 'utf8');

  newCache['stations.json'] = checksum(stationsDataRaw);
  newCache['lines.json'] = checksum(linesDataRaw);
  newCache['resources.json'] = checksum(resourcesDataRaw);

  const linesData = JSON.parse(linesDataRaw);
  const stationsData = JSON.parse(stationsDataRaw);
  const resourcesData = JSON.parse(resourcesDataRaw);

  const resourceMap = {};
  if (Array.isArray(resourcesData.resources)) {
    for (const res of resourcesData.resources) {
      const slug = res.slug;
      let image = res.image;
      if (image) {
        const imgPath = path.join(rootDir, 'src', image.replace(/^\//, ''));
        try {
          await fsPromises.access(imgPath);
        } catch {
          image = undefined;
        }
      }
      resourceMap[res.id] = { ...res, slug, image };
    }
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
    cache['resources.json'] !== newCache['resources.json']
  ) {
    regenerate = true;
  }

  const files = await fsPromises.readdir(dataDir);
  const localizedData = {};
  for (const file of files) {
    if (!file.endsWith('.json') || file === 'stations.json' || file === 'lines.json' || file === 'resources.json') continue;
    const match = file.match(/^(.*)\.([a-z]{2}-[A-Z]{2})\.json$/);
    if (!match) continue;
    const [, id, locale] = match;
    const fullPath = path.join(dataDir, file);
    const content = await fsPromises.readFile(fullPath, 'utf8');
    newCache[file] = checksum(content);
    if (cache[file] !== newCache[file]) {
      regenerate = true;
    }
    if (!localizedData[id]) localizedData[id] = {};
    localizedData[id][locale] = JSON.parse(content);
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
  await generateIndex(stationsData['core-stations'], 'core-stations');
  await generateIndex(stationsData['sub-stations'], 'suburb-stations');

  for (const line of linesData.lines.items) {
    await generateLine(line, stationMap, localizedData[line.id]);
  }

  for (const station of stationsData['core-stations'].items) {
    await generateStation(station, 'core-stations', stationLines[station.id], resourceMap, localizedData[station.id]);
  }
  for (const station of stationsData['sub-stations'].items) {
    await generateStation(station, 'suburb-stations', stationLines[station.id], resourceMap, localizedData[station.id]);
  }

  if (Array.isArray(resourcesData.resources)) {
    for (const res of resourcesData.resources) {
      const processed = resourceMap[res.id];
      await generateResource(processed, localizedData[res.id]);
    }
  }

  await saveCache(newCache);
  console.log('Method pages generated.');
}

async function generateLine(line, stationMap, locales) {
  const base = {
    title: line.title,
    stations: line.stations,
  };
  const file = path.join(docsDir, 'lines', `${line.id}.mdx`);
  await writeMarkdown(file, base, lineBody(line, stationMap));
  if (locales) {
    for (const locale of Object.keys(locales)) {
      const data = locales[locale];
      const fm = {
        title: data.title || line.title,
        stations: data.stations || line.stations,
      };
      const dest = path.join(docsDir, locale, 'lines', `${line.id}.md`);
      await writeMarkdown(dest, fm, lineBody({ ...line, ...data }, stationMap));
    }
  }
}

async function generateStation(station, folder, lines, resources, locales) {
  const fm = {
    title: station.title.split(' - ')[0],
    slug: station.slug,
    sidebar: { order: station.order },
    icon: station.icon,
  };
  if (lines && lines.length) fm.metrolines = lines;
  const file = path.join(docsDir, folder, `${station.id}.mdx`);
  await writeMarkdown(file, fm, stationBody(station, resources));
  if (locales) {
    for (const locale of Object.keys(locales)) {
      const data = locales[locale];
      const locFm = {
        title: (data.title || station.title).split(' - ')[0],
        slug: station.slug,
        sidebar: { order: station.order },
        icon: station.icon,
      };
      if (lines && lines.length) locFm.metrolines = lines;
      const dest = path.join(docsDir, locale, folder, `${station.id}.mdx`);
      await writeMarkdown(dest, locFm, stationBody({ ...station, ...data }, resources));
    }
  }
}

async function generateResource(resource, locales) {
  const slug = resource.slug;
  const fileSlug = slug.toLowerCase();
  const fm = {
    title: resource.title,
    slug,
    sidebar: { order: resource.order },
    icon: resource.icon,
  };
  if (resource.category) fm.category = resource.category;
  if (resource.image) fm.image = resource.image;
  const file = path.join(docsDir, `${fileSlug}.mdx`);
  await writeMarkdown(file, fm, await resourceBody(resource));
  if (locales) {
    for (const locale of Object.keys(locales)) {
      const data = locales[locale];
      const locFm = {
        title: data.title || resource.title,
        slug,
        sidebar: { order: resource.order },
        icon: resource.icon,
      };
      if (resource.category) locFm.category = resource.category;
      if (resource.image) locFm.image = resource.image;
      const dest = path.join(docsDir, locale, `${fileSlug}.mdx`);
      await writeMarkdown(dest, locFm, await resourceBody({ ...resource, ...data }));
    }
  }
}

generate().catch((e) => {
  console.error(e);
  process.exit(1);
});
