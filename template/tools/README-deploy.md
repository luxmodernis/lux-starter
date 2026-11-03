# Déploiement Vercel

Une commande : `npm run deploy` (ou `npm run deploy -- "message de commit"`)
→ contrôles + build → commit + push GitHub (`{{GITHUB_REPO}}`) → déploiement Vercel en production.

## Première fois seulement (étapes manuelles : login et compte)
```bash
npx vercel login
mkdir ../deploy-{{SLUG}} && cd ../deploy-{{SLUG}}   # (sous Windows : mkdir puis cd, même chose)
npx vercel --prod      # crée/lie le projet dans l'équipe lux-modernis, enregistre .vercel
```
Réponses à donner : portée = équipe **lux-modernis** ; « Link to existing project ? » = non ; nom du projet = `{{SLUG}}`.
Ensuite `npm run deploy` suffit. Le dépôt GitHub n'est pas relié à Vercel (privé) : un push seul ne déploie rien.

## Pourquoi un dossier hors du dépôt
Vercel (offre gratuite) bloque un déploiement relié à un dépôt si l'e-mail de l'auteur du commit n'est pas celui d'un membre de l'équipe.
En déployant un dossier **hors git** (`../deploy-{{SLUG}}`, rempli avec `dist/`), le dépôt reste privé et rien ne bloque.

## Commandes
- `npm run deploy -- "message"` s'arrête s'il reste des fichiers non committés (il les liste). `--all` committe tout puis déploie.
- `npm run check` : contrôle des textes + typage + build, sans déployer.
- `npm run jalon -- nom "description"` : étiquette git sur un état validé (`git checkout nom` pour y revenir).
- `npm run scorm` : paquet SCORM dans `scorm/` (si le projet est un module SCORM).
