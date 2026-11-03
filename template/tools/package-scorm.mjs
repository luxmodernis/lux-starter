// Fabrique le paquet SCORM 1.2 (zip avec imsmanifest.xml) à partir de dist/. Usage : npm run scorm
// Le module parle SCORM 1.2 et 2004 (src/scorm.ts) ; le manifeste généré ici est en 1.2, accepté par la plupart des LMS.
// À tester sur SCORM Cloud (cloud.scorm.com, gratuit) puis sur le LMS réel avant livraison.
import AdmZip from 'adm-zip';
import { mkdirSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const title = pkg.title ?? pkg.name;

const files = [];
const walk = (d) => { for (const n of readdirSync(d)) { const p = join(d, n); statSync(p).isDirectory() ? walk(p) : files.push(relative(DIST, p).split('\\').join('/')); } };
walk(DIST);

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const manifest = `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="${esc(pkg.name)}" version="1.0" xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2" xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata><schema>ADL SCORM</schema><schemaversion>1.2</schemaversion></metadata>
  <organizations default="org">
    <organization identifier="org"><title>${esc(title)}</title>
      <item identifier="item1" identifierref="res1"><title>${esc(title)}</title></item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="res1" type="webcontent" adlcp:scormtype="sco" href="index.html">
${files.map((f) => `      <file href="${esc(f)}"/>`).join('\n')}
    </resource>
  </resources>
</manifest>
`;

const zip = new AdmZip();
zip.addLocalFolder(DIST);
zip.addFile('imsmanifest.xml', Buffer.from(manifest, 'utf8'));
mkdirSync(join(ROOT, 'scorm'), { recursive: true });
const out = join(ROOT, 'scorm', `${pkg.name}-scorm12.zip`);
zip.writeZip(out);
const mo = statSync(out).size / 1024 / 1024;
console.log(`Paquet SCORM : ${relative(ROOT, out)} (${files.length} fichiers, ${mo.toFixed(1)} Mo)`);
if (mo > 50) console.log('⚠ Au-dessus de 50 Mo : simple indication (pas bloquant), à vérifier selon le LMS visé.');
