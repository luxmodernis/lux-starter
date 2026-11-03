// Contrôle du build (dist/) : poids et autonomie. Usage : node tools/check-assets.mjs (après npm run build)
// - ERREUR : une adresse externe (http…) dans le code, le CSS ou le HTML : les LMS bloquent souvent les appels vers l'extérieur
//   (polices Google, CDN, vidéos en ligne…). Tout doit être dans le package.
// - ERREUR : image trop lourde (> 400 Ko) ou police au format lourd (.ttf, .otf) ; ATTENTION : image > 200 Ko, package > 30 Mo.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const KO = 1024;
const IMG_WARN = 200 * KO;
const IMG_MAX = 400 * KO;
const TOTAL_WARN = 30 * KO * KO;

const errors = [];
const warnings = [];
const files = [];
const walk = (d) => { for (const n of readdirSync(d)) { const p = join(d, n); statSync(p).isDirectory() ? walk(p) : files.push(p); } };
walk(DIST);

let total = 0;
const ko = (n) => `${Math.round(n / KO)} Ko`;
for (const p of files) {
  const rel = relative(DIST, p).split('\\').join('/');
  const size = statSync(p).size;
  total += size;
  const ext = extname(p).toLowerCase();
  if (['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif'].includes(ext)) {
    if (size > IMG_MAX) errors.push(`image trop lourde (${ko(size)}) : ${rel} → npm run images`);
    else if (size > IMG_WARN) warnings.push(`image lourde (${ko(size)}) : ${rel}`);
  }
  if (['.ttf', '.otf'].includes(ext)) errors.push(`police au format lourd : ${rel} → convertir en .woff2`);
  if (['.html', '.css', '.js', '.mjs', '.json', '.svg'].includes(ext)) {
    const text = readFileSync(p, 'utf8');
    const urls = new Set();
    for (const m of text.matchAll(/(?:https?:)?\/\/[a-z0-9.-]+\.[a-z]{2,}[^\s"'`)<>]*/gi)) {
      const u = m[0];
      if (/^(?:https?:)?\/\/(www\.)?w3\.org\//i.test(u)) continue; // espaces de noms XML/SVG, pas des appels réseau
      urls.add(u.slice(0, 80));
    }
    for (const u of urls) errors.push(`adresse externe dans ${rel} : ${u}`);
  }
}

console.log(`Package : ${files.length} fichiers, ${ko(total)}`);
if (total > TOTAL_WARN) warnings.push(`package lourd (${Math.round(total / KO / KO)} Mo) : vérifier images, vidéos et sons`);
for (const w of warnings) console.log(`⚠ ${w}`);
for (const e of errors) console.error(`✗ ${e}`);
process.exit(errors.length ? 1 : 0);
