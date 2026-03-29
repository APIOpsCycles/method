import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';
import { dump } from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const dataDir = path.join(rootDir, 'node_modules/apiops-cycles-method-data/src/data/method');
const methodDataPackage = 'apiops-cycles-method-data/method';
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
  see_example: 'See example',
  download: 'Download',
  use_with_ai: 'Use with AI',
  step: 'Step',
  of: 'of',
  previous_step: 'Previous step',
  continue_to: 'Continue to',
  start: 'Start',
  open: 'Open',
  category_canvas: 'Canvas',
  category_guideline: 'Guideline',
};

const customLocaleLabels = {
  fi: {
    see_example: 'Katso esimerkki',
    download: 'Lataa',
    use_with_ai: 'Käytä tekoälyn kanssa',
    step: 'Vaihe',
    of: '/',
    previous_step: 'Edellinen vaihe',
    continue_to: 'Jatka:',
    start: 'Aloita',
    open: 'Avaa',
    category_canvas: 'Canvas',
    category_guideline: 'Ohjeistus',
  },
  fr: {
    see_example: "Voir l'exemple",
    download: 'Télécharger',
    use_with_ai: "Utiliser avec l'IA",
    step: 'Étape',
    of: 'sur',
    previous_step: 'Étape précédente',
    continue_to: 'Continuer vers',
    start: 'Commencer',
    open: 'Ouvrir',
    category_canvas: 'Canvas',
    category_guideline: 'Guide',
  },
  de: {
    see_example: 'Beispiel ansehen',
    download: 'Download',
    use_with_ai: 'Mit KI nutzen',
    step: 'Schritt',
    of: 'von',
    previous_step: 'Vorheriger Schritt',
    continue_to: 'Weiter zu',
    start: 'Start',
    open: 'Öffnen',
    category_canvas: 'Canvas',
    category_guideline: 'Leitfaden',
  },
  pt: {
    see_example: 'Ver exemplo',
    download: 'Baixar',
    use_with_ai: 'Usar com IA',
    step: 'Etapa',
    of: 'de',
    previous_step: 'Etapa anterior',
    continue_to: 'Continuar para',
    start: 'Iniciar',
    open: 'Abrir',
    category_canvas: 'Canvas',
    category_guideline: 'Guia',
  },
};

const DEFAULT_NEW_API_JOURNEY_ORDER = [
  'api-product-strategy',
  'api-consumer-experience',
  'api-platform-architecture',
  'api-design',
  'api-delivery',
  'api-audit',
  'api-publishing',
  'monitoring-and-improving',
];

function buildDefaultJourneyOrder(coreStations = [], subStations = []) {
  const coreStationMap = new Map(coreStations.map((station) => [station.id, station]));
  const orderedCoreStationIds = DEFAULT_NEW_API_JOURNEY_ORDER.filter((stationId) =>
    coreStationMap.has(stationId)
  );

  const remainingCoreStationIds = coreStations
    .map((station) => station.id)
    .filter((stationId) => !orderedCoreStationIds.includes(stationId));

  const subStationIds = subStations.map((station) => station.id);

  return [...orderedCoreStationIds, ...remainingCoreStationIds, ...subStationIds];
}

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


async function resolveMethodDataPath(fileName) {
  const packageSpecifier = `${methodDataPackage}/${fileName}`;
  try {
    const resolved = import.meta.resolve(packageSpecifier);
    return fileURLToPath(resolved);
  } catch {
    return path.join(dataDir, fileName);
  }
}

function deriveStationRuntimeState(
  stationsData,
  stationCriteriaData,
  criteriaData,
  resourcesData,
  userProgress = {}
) {
  const coreStations = stationsData['core-stations']?.items || [];
  const subStations = stationsData['sub-stations']?.items || [];
  const orderedStations = [...coreStations, ...subStations];
  const stationIdsInOrder = buildDefaultJourneyOrder(coreStations, subStations);

  const criteriaLabelsById = {};
  for (const criterion of criteriaData || []) {
    criteriaLabelsById[criterion.id] = criterion.description;
  }

  const criteriaIds = new Set((criteriaData || []).map((criterion) => criterion.id));
  const requiredEntryChecksByStationId = {};
  for (const [stationId, criterionIdsForStation] of Object.entries(stationCriteriaData || {})) {
    requiredEntryChecksByStationId[stationId] = (criterionIdsForStation || []).filter((criterionId) =>
      criteriaIds.has(criterionId)
    );
  }

  const resourcesById = {};
  for (const resource of resourcesData.resources || []) {
    resourcesById[resource.id] = resource;
  }

  const stationStepArtifactActionsById = {};
  for (const station of orderedStations) {
    const howItWorksSteps = station.how_it_works || station['how-it-works'] || [];
    const stepArtifactActions = [];

    for (const [stepIndex, step] of howItWorksSteps.entries()) {
      if (!step?.resource) continue;
      const resource = resourcesById[step.resource];
      if (!resource) continue;

      if (resource.category === 'canvas' && resource.canvas) {
        stepArtifactActions.push({
          stepIndex,
          resourceId: resource.id,
          resourceCategory: resource.category,
          canvasId: resource.canvas,
          artifactActions: [
            { type: 'canvas-json', format: 'json', canvasId: resource.canvas },
            { type: 'canvas-svg', format: 'svg', canvasId: resource.canvas },
            { type: 'canvas-png', format: 'png', canvasId: resource.canvas },
          ],
        });
      } else if (resource.category === 'guideline') {
        stepArtifactActions.push({
          stepIndex,
          resourceId: resource.id,
          resourceCategory: resource.category,
          artifactActions: [{ type: 'guidance-read-and-acknowledge' }],
        });
      }
    }

    stationStepArtifactActionsById[station.id] = stepArtifactActions;
  }

  const completedCriteriaIds = new Set(
    (userProgress.completedCriteriaIds || []).filter((criterionId) => criteriaIds.has(criterionId))
  );
  const doneStationsById = userProgress.doneStationsById || {};
  const stationArtifactsById = userProgress.stationArtifactsById || {};

  const stationStateById = {};
  for (const stationId of stationIdsInOrder) {
    const requiredCriteriaIds = requiredEntryChecksByStationId[stationId] || [];
    const missingCriteriaIds = requiredCriteriaIds.filter((criterionId) => !completedCriteriaIds.has(criterionId));
    const allEntryCriteriaMet = missingCriteriaIds.length === 0;
    const artifacts = Array.isArray(stationArtifactsById[stationId]) ? stationArtifactsById[stationId] : [];
    const hasArtifacts = artifacts.length > 0;
    const isMarkedDone = Boolean(doneStationsById[stationId]);

    let status = 'blocked';
    if (allEntryCriteriaMet) status = 'ready';
    if (allEntryCriteriaMet && isMarkedDone && hasArtifacts) status = 'completed';

    stationStateById[stationId] = {
      status,
      requiredCriteriaIds,
      missingCriteriaIds,
      completedCriteriaIds: requiredCriteriaIds.filter((criterionId) => completedCriteriaIds.has(criterionId)),
      isMarkedDone,
      hasArtifacts,
      artifacts,
      stepArtifactActions: stationStepArtifactActionsById[stationId] || [],
    };
  }

  return {
    stationIdsInOrder,
    requiredEntryChecksByStationId,
    criteriaLabelsById,
    resourcesById,
    stationStepArtifactActionsById,
    stationStateById,
  };
}

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

function buildStationEyebrow(data, labels = baseLabels) {
  if (!Array.isArray(data.outcomes) || data.outcomes.length === 0) return undefined;
  const translated = expandTranslations(data.outcomes, labels)
    .map((item) => String(item).trim())
    .filter(Boolean);

  return translated.length ? translated.join(' · ') : undefined;
}

function normalizeForComparison(value = '') {
  return String(value)
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function buildResourceCategoryLabel(resource, labels = baseLabels) {
  if (!resource?.category) return undefined;
  const translated = translate(`category_${resource.category}`, labels);
  if (translated !== `category_${resource.category}`) return translated;
  return resource.category.charAt(0).toUpperCase() + resource.category.slice(1);
}

function buildCanvasDownloadPath(canvasId, locale = '') {
  const baseDir = locale ? `/assets/resource/${locale}` : '/assets/resource';
  return `${baseDir}/Canvas_${canvasId}.json`;
}

function buildCanvasDownloads(canvasId, locale = '') {
  const baseDir = locale ? `/assets/resource/${locale}` : '/assets/resource';
  return [
    { href: `${baseDir}/Canvas_${canvasId}.png`, label: 'PNG' },
    { href: `${baseDir}/Canvas_${canvasId}.svg`, label: 'SVG' },
    { href: `${baseDir}/Canvas_${canvasId}.json`, label: 'JSON' },
  ];
}

function buildStationStepItems(data, resources, labels = baseLabels, locale = '') {
  const how = data.how_it_works || data['how-it-works'];
  if (!Array.isArray(how) || how.length === 0) return [];

  const effectiveLocale = locale || defaultLocale;

  return how.map((step, index) => {
    const methodText = String(translateItem(step.step, index, labels) || '').trim();
    const resource = step.resource ? resources[step.resource] : undefined;
    const resourceTitle = resource ? String(translate(resource.title, labels) || '').trim() : '';
    const resourceDescription = resource
      ? String(translate(resource.description || '', labels) || '').trim()
      : '';
    const useResourceContent = Boolean(resourceTitle || resourceDescription);
    const title = useResourceContent ? resourceTitle || methodText : methodText;
    const description = useResourceContent ? resourceDescription || methodText : methodText;
    const methodNote =
      useResourceContent &&
      methodText &&
      normalizeForComparison(methodText) !== normalizeForComparison(description)
        ? methodText
        : undefined;

    const resourceHref = resource ? `/${locale ? `${locale}/` : ''}${resource.slug}/` : undefined;
    const isCanvas = Boolean(resource?.category === 'canvas' && resource?.canvas);

    return {
      title,
      description,
      methodNote,
      resourceTypeLabel: buildResourceCategoryLabel(resource, labels),
      resourceIcon: resource?.icon,
      primaryAction: resource
        ? {
            href: isCanvas
              ? `/canvas/?locale=${encodeURIComponent(effectiveLocale)}&canvas=${encodeURIComponent(resource.canvas)}`
              : resourceHref,
            label: `${t(isCanvas ? 'start' : 'open', labels)} ${title}`.trim(),
          }
        : undefined,
      exampleAction: resourceHref ? { href: resourceHref, label: t('see_example', labels) } : undefined,
      downloads: isCanvas && resource?.canvas ? buildCanvasDownloads(resource.canvas, locale) : undefined,
    };
  });
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
  lineMap = {},
  stationTitle = ''
) {
  const componentPrefix = locale ? '../../../../components' : '../../../components';
  let out = `import MaterialIcon from '${componentPrefix}/MaterialIcon.astro';\n`;
  out += `import StationStepWorkspace from '${componentPrefix}/StationStepWorkspace.astro';\n\n`;
  const hasLines = Array.isArray(lines) && lines.length;

  if (data.description || hasLines) {
    out += '<div class="station-summary">\n';
    out += '<div class="station-summary-copy">\n\n';
    if (data.description) out += `${translate(data.description, labels)}\n\n`;
    out += '</div>\n';
  }
  if (hasLines) {
    out += `<aside class="station-related-panel">\n<h2>${t('related_metrolines', labels)}</h2>\n\n`;
    out += '<ul class="related-metrolines-list">\n';
    lines.forEach((id) => {
      const line = lineMap[id];
      if (!line) return;
      const prefix = locale ? `/${locale}` : '';
      const title = translate(line.title, labels);
      const color = line.color || '#000';
      out += `<li style="--line-color: ${color}"><a href="${prefix}/lines/${line.slug}/"><MaterialIcon name="train-outline" class="related-metrolines-icon" size="1.05em" /><span>${title}</span></a></li>\n`;
    });
    out += '</ul>\n</aside>\n';
  }
  if (data.description || hasLines) {
    out += '</div>\n\n';
  }
  if (data.why_it_matters) {
    out += `<section class="why-it-matters-card">\n`;
    out += `<div class="why-it-matters"><h2>${t('why_it_matters', labels)}</h2></div>\n`;
    out += `<div class="why-it-matters-body">\n\n${translate(data.why_it_matters, labels)}\n\n</div>\n`;
    out += `</section>\n\n`;
  }
  if (data.apply_in_work) out += `## ${t('apply_in_work', labels)}\n\n${translate(data.apply_in_work, labels)}\n\n`;
  if (
    (Array.isArray(entryCriteria) && entryCriteria.length) ||
    (Array.isArray(exitCriteria) && exitCriteria.length)
  ) {
    out += `<div class="station-criteria-grid">\n`;
    if (Array.isArray(entryCriteria) && entryCriteria.length) {
      out += `<section class="station-criteria-card is-entry">\n`;
      out += `<div class="station-criteria-title"><MaterialIcon name="right-arrow" size="1.2em" /><h3>${t('entry_criteria_title', labels)}</h3><span class="station-criteria-subtitle">(${t('entry_criteria', labels)})</span></div>\n`;
      out += '<ul>\n';
      const items = entryCriteria.map((id) => {
        const tr = translate('criterion.' + id, labels);
        const text = tr === 'criterion.' + id ? criteriaMap[id] || id : tr;
        return `<li>${text}</li>`;
      });
      out += items.join('\n');
      out += '\n</ul>\n</section>\n';
    }
    if (Array.isArray(exitCriteria) && exitCriteria.length) {
      out += `<section class="station-criteria-card is-exit">\n`;
      out += `<div class="station-criteria-title"><MaterialIcon name="left-arrow" size="1.2em" /><h3>${t('exit_criteria_title', labels)}</h3><span class="station-criteria-subtitle">(${t('exit_criteria', labels)})</span></div>\n`;
      out += '<ul>\n';
      const items = exitCriteria.map((id) => {
        const tr = translate('criterion.' + id, labels);
        const text = tr === 'criterion.' + id ? criteriaMap[id] || id : tr;
        return `<li>${text}</li>`;
      });
      out += items.join('\n');
      out += '\n</ul>\n</section>\n';
    }
    out += '</div>\n\n';
  }
  const stepItems = buildStationStepItems(data, resources, labels, locale);
  if (stepItems.length) {
    out += `## ${t('how_it_works', labels)}\n\n`;
    const workspaceLabels = {
      step: t('step', labels),
      of: t('of', labels),
      previousStep: t('previous_step', labels),
      continueTo: t('continue_to', labels),
      useWithAi: t('use_with_ai', labels),
      download: t('download', labels),
    };
    out += `<StationStepWorkspace stationTitle=${JSON.stringify(
      stationTitle
    )} labels={${JSON.stringify(workspaceLabels)}} steps={${JSON.stringify(stepItems)}} />\n\n`;
  }
  return out.trim();
}

async function resourceBody(res, labels = baseLabels, locale = '') {
  let out = "import { Aside } from '@astrojs/starlight/components';\n";
  if (res.category === 'canvas') {
    const prefix = locale ? '../../../../components' : '../../../components';
    // out += `import CanvasCreator from '${prefix}/CanvasCreator.astro';\n`;
  }
  out += "\n";
  if (res.description) out += `${translate(res.description, labels)}\n\n`;
/*   if (Array.isArray(res.outcomes) && res.outcomes.length) {
    out += `## ${t('outcomes', labels)}\n\n`;
    const items = expandTranslations(res.outcomes, labels).map((i) => `- ${i}`);
    out += items.join('\n');
    out += '\n\n';
  } */
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
        `[JSON](${prefix}${path.posix.join(baseDir, fileBase + '.json')})`,
      ];
      const pngPath = path.join(rootDir, 'src', baseDir, fileBase + '.png');
      try {
        await fsPromises.access(pngPath);
        links.push(`[PNG](${prefix}${path.posix.join(baseDir, fileBase + '.png')})`);
      } catch {
        // PNG export depends on the optional canvas module; omit the link when unavailable.
      }
      out += links.join(' | ');
      out += '\n\n';
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
/*   if (res.category === 'canvas') {
    const id = res.canvas || res.id;
    out += locale
      ? `\n\n<CanvasCreator canvasId="${id}" locale="${locale}" />`
      : `\n\n<CanvasCreator canvasId="${id}" />`;
  } */
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
  const generatorSource = await fsPromises.readFile(fileURLToPath(import.meta.url), 'utf8');
  newCache['generate-method-pages.mjs'] = checksum(generatorSource);

  const stationsPath = await resolveMethodDataPath('stations.json');
  const linesPath = await resolveMethodDataPath('lines.json');
  const resourcesPath = await resolveMethodDataPath('resources.json');
  const criteriaPath = await resolveMethodDataPath('criteria.json');
  const stationCriteriaPath = await resolveMethodDataPath('station-criteria.json');
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

  const {
    stationIdsInOrder,
    requiredEntryChecksByStationId: stationCriteria,
    criteriaLabelsById: criteriaMap,
    resourcesById,
  } = deriveStationRuntimeState(stationsData, stationCriteriaData, criteriaData, resourcesData);

  const resourceMap = {};
  for (const [resourceId, resource] of Object.entries(resourcesById)) {
    const slug = resource.slug;
    let image = resource.image;
    const canvas = resource.canvas;
    if (image) {
      const imgPath = path.join(rootDir, 'src', image.replace(/^\//, ''));
      try {
        await fsPromises.access(imgPath);
      } catch {
        image = undefined;
      }
    }
    resourceMap[resourceId] = { ...resource, slug, image, canvas };
  }

  const lineMap = {};
  for (const ln of linesData.lines.items) {
    lineMap[ln.id] = ln;
  }

  const nextStationCriteria = {};
  const coreItems = stationsData['core-stations'].items;
  const coreStationOrder = buildDefaultJourneyOrder(coreItems, []).filter((stationId) =>
    coreItems.some((station) => station.id === stationId)
  );

  for (let i = 0; i < coreStationOrder.length; i++) {
    const currentId = coreStationOrder[i];
    const nextId = coreStationOrder[i + 1];
    nextStationCriteria[currentId] = nextId ? stationCriteria[nextId] || [] : [];
  }

  const stationMap = {};
  const orderedStations = [
    ...(stationsData['core-stations'].items || []),
    ...(stationsData['sub-stations'].items || []),
  ];
  for (const station of orderedStations) {
    stationMap[station.id] = station;
  }

  let regenerate = false;
  if (
    cache['stations.json'] !== newCache['stations.json'] ||
    cache['lines.json'] !== newCache['lines.json'] ||
    cache['resources.json'] !== newCache['resources.json'] ||
    cache['criteria.json'] !== newCache['criteria.json'] ||
    cache['station-criteria.json'] !== newCache['station-criteria.json'] ||
    cache['labels.json'] !== newCache['labels.json'] ||
    cache['generate-method-pages.mjs'] !== newCache['generate-method-pages.mjs']
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
      Object.assign(labelsLocales[locale], customLocaleLabels[locale] || {});
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
    icon: 'train-outline',
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
      icon: 'train-outline',
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
  const eyebrow = buildStationEyebrow(station, baseLabels);
  const baseTitle = translate(station.title, baseLabels).split(' - ')[0];
  const fm = {
    title: baseTitle,
    slug: baseSlug,
    sidebar: { order: station.order },
    icon: station.icon,
  };
  if (eyebrow) fm.eyebrow = eyebrow;
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
      lineMap,
      baseTitle
    )
  );
  for (const locale of Object.keys(labelsLocales)) {
    const labels = labelsLocales[locale] || baseLabels;
    const locEyebrow = buildStationEyebrow(station, labels);
    const localizedTitle = translate(station.title, labels).split(' - ')[0];
    const locFm = {
      title: localizedTitle,
      slug: `${locale}/${baseSlug}`,
      sidebar: { order: station.order },
      icon: station.icon,
    };
    if (locEyebrow) locFm.eyebrow = locEyebrow;
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
        lineMap,
        localizedTitle
      )
    );
  }
}

async function generateResource(resource, labelsLocales) {
  const baseSlug = resource.slug;
  const eyebrow = buildStationEyebrow(resource, baseLabels);
  const baseTitle = translate(resource.title, baseLabels).split(' - ')[0];
  const fileSlug = baseSlug.toLowerCase();
  const fm = {
    title: baseTitle,
    slug: baseSlug,
    sidebar: { order: resource.order },
    icon: resource.icon,
  };
  if (eyebrow) fm.eyebrow = eyebrow;
  if (resource.category) fm.category = resource.category;
  if (resource.canvas) {
    fm.canvasId = resource.canvas;
    fm.image = `/assets/resource/Canvas_${resource.canvas}.svg`;
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
      locFm.image = `/assets/resource/${locale}/Canvas_${resource.canvas}.svg`;
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
