import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFile } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const localeMap = {
  en: 'en',
  de: 'de',
  fi: 'fi',
  fr: 'fr',
  pt: 'pt',
};

function runExport(args) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(rootDir, 'node_modules/canvascreator/scripts/export.js');
    execFile('node', [scriptPath, ...args], { maxBuffer: 1024 * 1024 }, (err, stdout, stderr) => {
      if (stdout) process.stdout.write(stdout);
      if (stderr) process.stderr.write(stderr);
      if (err) reject(err);
      else resolve();
    });
  });
}

async function generate() {
  const data = JSON.parse(await fs.readFile(path.join(rootDir, 'node_modules/apiops-cycles-method-data/src/data/method/resources.json'), 'utf8'));
  const canvases = data.resources.filter((r) => r.category === 'canvas' && r.canvas);

for (const [loc, full] of Object.entries(localeMap)) {
  const destDir = loc === 'en'
    ? path.join(rootDir, 'src/assets/resource')
    : path.join(rootDir, 'src/assets/resource', loc);

  //for (const c of canvases) {
    // Always pass absolute path to --outdir
    await runExport(['--locale', full, '--format', 'svg', '--prefix', 'Canvas', '--all', '--outdir', destDir]);
    await runExport(['--locale', full, '--format', 'json', '--prefix', 'Canvas', '--all', '--outdir', destDir]);
    await runExport(['--locale', full, '--format', 'png', '--prefix', 'Canvas', '--all', '--outdir', destDir]);
}

  await fs.rm(exportDir, { recursive: true, force: true });
  console.log('Canvases generated.');
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
