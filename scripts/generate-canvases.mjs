import { promises as fs } from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const require = createRequire(import.meta.url);

const { buildContent, renderSVG, writePNG, exportJSON } = require('canvascreator/node-export');
const canvasData = require('apiops-cycles-method-data/canvasData.json');
const localizedData = require('apiops-cycles-method-data/localizedData.json');
const resourcesData = require('apiops-cycles-method-data/method/resources.json');

const locales = ['en', 'de', 'fi', 'fr', 'pt'];

function getOutputDir(locale) {
  return locale === 'en'
    ? path.join(rootDir, 'src/assets/resource')
    : path.join(rootDir, 'src/assets/resource', locale);
}

function getOutputBaseName(canvasId) {
  return `Canvas_${canvasId}`;
}

function getExampleInputPath(canvasId, locale) {
  const localizedPath = path.join(rootDir, 'src/assets/resource', locale, `${canvasId}.example.json`);
  const defaultPath = path.join(rootDir, 'src/assets/resource', `${canvasId}.example.json`);
  return locale !== 'en' ? [localizedPath, defaultPath] : [defaultPath];
}

async function readExampleContent(canvasId, locale) {
  for (const candidate of getExampleInputPath(canvasId, locale)) {
    try {
      const raw = await fs.readFile(candidate, 'utf8');
      return JSON.parse(raw);
    } catch {
      // try next candidate
    }
  }
  return null;
}

async function generate() {
  const canvases = resourcesData.resources.filter((resource) => resource.category === 'canvas' && resource.canvas);

  if (!canvases.length) {
    console.log('No canvases found to generate.');
    return;
  }

  for (const locale of locales) {
    const destDir = getOutputDir(locale);
    await fs.mkdir(destDir, { recursive: true });

    for (const canvas of canvases) {
      const content = buildContent(canvasData, canvas.canvas, locale, false, null, true);
      const svg = renderSVG(canvasData[canvas.canvas], localizedData, content);
      const outputBaseName = getOutputBaseName(canvas.canvas);

      await fs.writeFile(path.join(destDir, `${outputBaseName}.svg`), svg);
      await fs.writeFile(
        path.join(destDir, `${outputBaseName}.json`),
        exportJSON(content)
      );
      await writePNG(svg, path.join(destDir, `${outputBaseName}.png`));

      const exampleContent = await readExampleContent(canvas.canvas, locale);
      if (exampleContent) {
        const exampleRenderContent = buildContent(canvasData, canvas.canvas, locale, false, exampleContent, true);
        const exampleSvg = renderSVG(canvasData[canvas.canvas], localizedData, exampleRenderContent);

        await fs.writeFile(path.join(destDir, `${outputBaseName}.example.svg`), exampleSvg);
        await fs.writeFile(
          path.join(destDir, `${outputBaseName}.example.json`),
          exportJSON(exampleRenderContent)
        );
        await writePNG(exampleSvg, path.join(destDir, `${outputBaseName}.example.png`));
      }
    }
  }

  console.log('Canvases generated.');
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
