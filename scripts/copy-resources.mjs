import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src', 'assets', 'resource');
const destDir = path.join(rootDir, 'public', 'assets', 'resource');

async function copyResources() {
  await fs.rm(destDir, { recursive: true, force: true });
  await fs.mkdir(destDir, { recursive: true });
  await fs.cp(srcDir, destDir, { recursive: true });
  console.log('Resources copied.');
}

copyResources().catch((err) => {
  console.error(err);
  process.exit(1);
});
