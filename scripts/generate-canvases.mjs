import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFile } from 'child_process';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const exportDir = path.join(rootDir, 'export');

const localeMap = {
  en: 'en-US',
  de: 'de-DE',
  fi: 'fi-FI',
  fr: 'fr-FR',
  pt: 'pt-BR',
};

function runExport(args) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(rootDir, 'node_modules/canvascreator/scripts/export.js');
    execFile('node', [scriptPath, ...args], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

async function generate() {
  await fs.rm(exportDir, { recursive: true, force: true });
  await fs.mkdir(exportDir, { recursive: true });

  const data = JSON.parse(await fs.readFile(path.join(rootDir, 'src/data/method/resources.json'), 'utf8'));
  const canvases = data.resources.filter((r) => r.category === 'canvas' && r.canvas);

  for (const [loc, full] of Object.entries(localeMap)) {
    for (const c of canvases) {
      await runExport(['--locale', full, '--format', 'svg', '--canvas', c.canvas]);
      await runExport(['--locale', full, '--format', 'json', '--canvas', c.canvas]);
      const base = `Canvas_${c.canvas}_${full}`;
      const svg = path.join(exportDir, `${base}.svg`);
      const pngTmp = path.join(exportDir, `${base}.png`);
      await sharp(svg).png().toFile(pngTmp);
      const json = path.join(exportDir, `${base}.json`);

      const destDir = loc === 'en' ? path.join(rootDir, 'src/assets/resource') : path.join(rootDir, 'src/assets/resource', loc);
      await fs.mkdir(destDir, { recursive: true });
      const destBase = path.join(destDir, `Canvas_${c.canvas}`);
      await fs.copyFile(svg, `${destBase}.svg`);
      await fs.copyFile(json, `${destBase}.json`);
      await fs.copyFile(pngTmp, `${destBase}.png`);
    }
  }

  await fs.rm(exportDir, { recursive: true, force: true });
  console.log('Canvases generated.');
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
