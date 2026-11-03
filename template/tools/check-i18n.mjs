// Contrôle des textes. Usage : node tools/check-i18n.mjs
// - toute clé utilisée en dur dans le code (t('ma.cle')) existe dans texts/en.json ;
// - chaque public/texts/<langue>.json a les mêmes clés que l'anglais, les mêmes balises (<b>, <br>…), entités (&nbsp;…) et variables ({n}…).
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(readFileSync(p, 'utf8'));
const en = read(join(ROOT, 'texts/en.json'));
const errors = [];

const used = new Set();
const walk = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (p.endsWith('.ts')) for (const m of readFileSync(p, 'utf8').matchAll(/\bt\('([a-z0-9_.]+)'/g)) used.add(m[1]);
  }
};
walk(join(ROOT, 'src'));
for (const k of [...used].sort()) if (!(k in en)) errors.push(`clé utilisée mais absente de en.json : ${k}`);

const sig = (s) => (s.match(/<\/?[a-z]+\s*\/?>|&[a-z#0-9]+;|\{[a-zA-Z]+\}/g) ?? []).sort().join('|');
const dir = join(ROOT, 'public/texts');
for (const f of existsSync(dir) ? readdirSync(dir).filter((n) => n.endsWith('.json')).sort() : []) {
  const d = read(join(dir, f));
  for (const k of Object.keys(en)) {
    if (!(k in d)) { if (!d._partial) errors.push(`${f} : clé manquante ${k}`); } // "_partial": true = traduction en cours, le reste s'affiche en anglais
    else if (sig(d[k]) !== sig(en[k])) errors.push(`${f} : balises/variables différentes pour ${k}`);
  }
  for (const k of Object.keys(d)) if (!(k in en) && !k.startsWith('_')) errors.push(`${f} : clé inconnue ${k}`);
}
console.log(errors.length ? errors.join('\n') : `OK : ${Object.keys(en).length} clés, ${used.size} utilisées en dur`);
process.exit(errors.length ? 1 : 0);
