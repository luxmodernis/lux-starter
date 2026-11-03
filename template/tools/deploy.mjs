// Contrôle, pousse sur GitHub puis déploie le build sur Vercel, en une commande (Mac et PC).
// Usage : npm run deploy -- "message"          déploie si tout est déjà committé ; sinon liste les fichiers en attente et s'arrête
//         npm run deploy -- "message" --all    committe d'abord TOUT ce qui est en attente (travail des autres conversations compris), puis déploie
// Prérequis (une seule fois) : voir tools/README-deploy.md (login + lien du projet Vercel).
//
// Le dossier déployé (../deploy-<projet>) est volontairement HORS du dépôt git : sinon Vercel lit l'auteur du dernier commit
// et bloque le déploiement si son e-mail n'est pas celui d'un membre de l'équipe. Le sous-dossier .vercel (lien projet) est conservé.
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const OUT = resolve(ROOT, '..', `deploy-${pkg.name}`);

const run = (cmd, args, cwd = ROOT, capture = false) => {
  const r = spawnSync(cmd, args, { cwd, shell: process.platform === 'win32', stdio: capture ? ['ignore', 'pipe', 'inherit'] : 'inherit', encoding: 'utf8' });
  if (r.status !== 0) { console.error(`\n✗ ${cmd} ${args.join(' ')} a échoué`); process.exit(r.status ?? 1); }
  return capture ? r.stdout.trim() : '';
};

let msg = '';
let all = false;
for (const a of process.argv.slice(2)) { if (a === '--all') all = true; else msg = a; }

// 0. Travail en attente : on ne committe jamais en silence le travail des autres conversations
const dirty = run('git', ['status', '--porcelain'], ROOT, true);
if (dirty && !all) {
  console.error("Des fichiers ne sont pas committés (travail en cours d'une conversation ?) :\n" + dirty.split('\n').slice(0, 30).join('\n'));
  console.error('\nRien n\'a été déployé. Faites committer la conversation concernée, ou relancez avec --all pour tout committer et déployer.');
  process.exit(2);
}

// 1. Garde-fous : textes cohérents, typage + build
if (existsSync(join(ROOT, 'tools/check-i18n.mjs'))) run('node', ['tools/check-i18n.mjs']);
run('npm', ['run', 'build']);
run('node', ['tools/check-assets.mjs']);

// 2. Git : commit (--all) + push
if (dirty) {
  run('git', ['add', '-A']);
  const now = new Date().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });
  run('git', ['commit', '-q', '-m', msg || `Mise à jour ${now}`]);
}
const remotes = run('git', ['remote'], ROOT, true);
if (!remotes) { console.error("Aucun dépôt GitHub relié (git remote). Voir tools/README-deploy.md."); process.exit(1); }
run('git', ['push', '-u', 'origin', 'HEAD']);

// 3. Dossier propre à déployer : build + noindex + version
mkdirSync(OUT, { recursive: true });
for (const f of readdirSync(OUT)) if (f !== '.vercel') rmSync(join(OUT, f), { recursive: true, force: true });
cpSync(join(ROOT, 'dist'), OUT, { recursive: true });
const sha = run('git', ['rev-parse', '--short', 'HEAD'], ROOT, true);
writeFileSync(join(OUT, 'version.txt'), `commit ${sha} · ${new Date().toLocaleString('fr-FR')}\n`);
writeFileSync(join(OUT, 'vercel.json'), JSON.stringify({ headers: [{ source: '/(.*)', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }] }, null, 2) + '\n');

// 4. Déploiement en production
if (!existsSync(join(OUT, '.vercel/project.json'))) {
  console.error(`Projet Vercel non lié : lance d'abord, une fois, « cd ${OUT} && npx vercel --prod » (voir tools/README-deploy.md).`);
  process.exit(1);
}
run('npx', ['--yes', 'vercel', '--prod', '--yes'], OUT);
