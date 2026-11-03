// Optimise les images : convertit les originaux de assets-src/ en WebP léger dans src/assets/ (même arborescence).
// Usage : npm run images            traite les images nouvelles ou modifiées
//         npm run images -- --force retraite tout
// Les originaux (png, jpg) restent dans assets-src/ ; le code n'importe que les .webp de src/assets/.
// Réglages : largeur max 1080 px (suffisant pour un téléphone), qualité 78. Les PNG avec transparence restent transparents.
import sharp from 'sharp';
import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'assets-src');
const OUT = join(ROOT, 'src/assets');
const MAX_WIDTH = 1080;
const QUALITY = 78;
const force = process.argv.includes('--force');

if (!existsSync(SRC)) { console.log('Aucun dossier assets-src/ : déposez-y les images originales.'); process.exit(0); }

const files = [];
const walk = (d) => { for (const n of readdirSync(d)) { const p = join(d, n); statSync(p).isDirectory() ? walk(p) : files.push(p); } };
walk(SRC);

let done = 0;
for (const p of files) {
  if (!['.png', '.jpg', '.jpeg', '.tif', '.tiff'].includes(extname(p).toLowerCase())) continue;
  const out = join(OUT, relative(SRC, p)).replace(/\.[^.]+$/, '.webp');
  if (!force && existsSync(out) && statSync(out).mtimeMs >= statSync(p).mtimeMs) continue;
  mkdirSync(dirname(out), { recursive: true });
  await sharp(p).rotate().resize({ width: MAX_WIDTH, withoutEnlargement: true }).webp({ quality: QUALITY }).toFile(out);
  console.log(`${relative(ROOT, p)} (${Math.round(statSync(p).size / 1024)} Ko) → ${relative(ROOT, out)} (${Math.round(statSync(out).size / 1024)} Ko)`);
  done++;
}
console.log(done ? `${done} image(s) optimisée(s).` : 'Rien à faire : tout est à jour.');
