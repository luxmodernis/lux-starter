// Pose un jalon : une étiquette git sur l'état actuel (validé), poussée sur GitHub, pour pouvoir y revenir en une commande.
// Usage : npm run jalon -- nom-du-jalon "description courte"      ex. : npm run jalon -- jalon-1 "Chapitres 1 à 3 validés"
// Revenir à un jalon : git checkout <nom>   (puis git checkout main pour reprendre)
import { execFileSync } from 'node:child_process';

const [name, desc] = process.argv.slice(2);
if (!name) { console.error('Usage : npm run jalon -- nom "description"'); process.exit(1); }
const git = (...a) => execFileSync('git', a, { encoding: 'utf8' }).trim();
if (git('status', '--porcelain', '--untracked-files=no')) {
  console.error('Des fichiers suivis ne sont pas committés : committez d\'abord (ou npm run deploy -- "msg" --all).');
  process.exit(2);
}
git('tag', '-a', name, '-m', desc || name);
git('push', '-q', 'origin', name);
console.log(`Jalon posé : ${name} (${git('rev-parse', '--short', 'HEAD')})`);
