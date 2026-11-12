# Brief d'installation d'un projet Lux Modernis

> Tu es Claude Code. Un collègue de Lux Modernis vient de te coller une phrase qui t'a envoyé ici. Tu es dans un **dossier local vide** (ou presque) qui deviendra un projet. Suis ce brief étape par étape : pose les questions, installe l'environnement, puis explique à la personne comment continuer. Parle français, simplement, sans jargon : la personne n'est pas forcément développeuse.
>
> **Cette conversation devient le « hub déploiement »**, la conversation maître du projet. Si tu as un outil pour renommer la session, appelle-la « Hub déploiement ».

Le kit complet (ce brief + le dossier `template/`) est dans le dépôt public `https://github.com/luxmodernis/unbox`. Ne recopie jamais un fichier du template de mémoire : clone le dépôt et copie-le.

## Ce que le projet aura à la fin

- Un projet **Vite + TypeScript** qui se lance en local (`npm run dev`).
- Un dépôt **GitHub privé** dans l'organisation `luxmodernis`.
- Un site de test **Vercel** (offre gratuite, équipe `lux-modernis`) déployé en une commande, avec le contournement « dossier hors git » qui permet de garder le dépôt privé.
- Le mot magique : quand la personne dit **« pousse et déploie »**, tu lances `npm run deploy` toi-même, sans redemander, et tu donnes l'adresse.
- Une **étiquette de version** en bas à gauche du site de test (commit + heure) pour vérifier qu'on regarde la bonne version.
- Une organisation en **conversations parallèles** (une par chapitre, plus le hub) qui se parlent pour ne pas s'écraser.
- Selon les réponses : paquet **SCORM**, fichier de **textes séparé** pour la traduction, **responsive** mobile ou mobile / tablette / desktop.

## Étape 0 : vérifier la machine

Lance ces vérifications (elles marchent sur Mac et PC) et corrige ce qui manque en expliquant simplement :

```bash
node -v
git --version
gh --version
```

- **Node 20 ou plus**, **git** et **`gh`** (GitHub CLI) sont nécessaires. **Installe toi-même ce qui manque**, sans renvoyer la personne vers des sites : annonce en une phrase ce que tu installes, puis lance la commande (la personne l'approuve dans l'application).
  - **Mac** : si `brew` manque, ne l'installe pas en silence : propose-le et, s'il faut un mot de passe administrateur, la personne le tape elle-même dans le terminal. Puis `brew install node git gh`. Pour git seul, `xcode-select --install` convient aussi.
  - **PC** : `winget install OpenJS.NodeJS.LTS Git.Git GitHub.cli` (une commande par paquet si besoin). Après l'installation, un terminal neuf est parfois nécessaire pour que les commandes soient trouvées : relance les vérifications, et demande de rouvrir l'application seulement si elles échouent encore.
  - Si une installation automatique échoue, explique l'erreur simplement et donne le site officiel (nodejs.org, git-scm.com, cli.github.com) en dernier recours.
- Ensuite la personne doit lancer `gh auth login` (compte GitHub membre de l'organisation `luxmodernis`). Tu ne saisis jamais de mot de passe ni de jeton à sa place : donne-lui la commande à lancer elle-même, dans l'onglet Terminal.
- Vérifie le dossier courant : s'il contient déjà un projet, arrête-toi et demande. S'il se trouve dans `.claude/worktrees/`, préviens que le hub doit travailler directement dans le dossier du projet (sans worktree) et demande de recréer l'environnement.

## Étape 1 : poser les questions

Utilise l'outil de questions (`AskUserQuestion`) pour poser **toutes** ces questions d'un coup (4 maximum par appel, donc deux appels si besoin). Les questions ouvertes (nom, description, chapitres) se posent en texte libre.

1. **Nom du projet** (affiché à l'écran, ex. « Precious ») et **une phrase de description**. Dérives-en un `slug` en minuscules sans accents ni espaces (ex. `precious`), qui sert de nom de dépôt et de projet Vercel.
2. **Type de livrable** : *Module SCORM* (livré dans un LMS, avec suivi de progression et score) ou *Site web simple* (pas de SCORM).
3. **Écrans** : *Mobile uniquement* (sur tablette et desktop : mise en page mobile centrée) ou *Responsive mobile / tablette / desktop*.
4. **Textes dans un fichier à part pour traduction** : *Oui* (un `texts/en.json`, anglais de référence, aucune phrase en dur dans le code) ou *Non* (textes écrits directement dans le code). Si oui, demande aussi les **langues cibles** (codes : fr, de, ja…) en texte libre.
5. **Découpage** : combien de chapitres / parties, et leurs noms (peut être « on verra plus tard » : tu crées alors un seul chapitre modèle).

Récapitule les réponses en quelques lignes et fais valider avant d'installer. Dans ce récapitulatif, indique le **nom du dépôt GitHub** proposé (`luxmodernis/<slug>`) et le **nom du projet Vercel** (`<slug>`), et laisse la personne les changer : ce sont eux qui forment l'adresse du site de test. Utilise le nom validé partout ensuite.

## Étape 2 : installer le socle

1. Clone le kit dans un dossier **temporaire** (hors du projet), copie le contenu de `template/` à la racine du dossier courant, puis supprime le clone :
   ```bash
   git clone --depth 1 https://github.com/luxmodernis/unbox.git <dossier-temporaire>
   ```
   Copie avec une commande qui marche sur le système de la personne (`cp -R <tmp>/template/. .` sur Mac, `Copy-Item -Recurse` ou `xcopy` sur PC). Pense aux fichiers cachés (`.gitignore`).
2. Remplace les marqueurs dans les fichiers copiés : `{{SLUG}}`, `{{TITLE}}`, `{{DESCRIPTION}}`, `{{GITHUB_REPO}}` (`luxmodernis/<slug>`), `{{VERCEL_URL}}` (à compléter à l'étape 4), `{{TYPE}}`, `{{ECRANS}}`, `{{TEXTES}}`. Fichiers concernés : `package.json`, `index.html`, `CLAUDE.md`, `docs/REGLES-CHAPITRES.md`, `tools/README-deploy.md`.
3. **Élague selon les réponses** :

   | Réponse | À faire |
   |---|---|
   | Site web simple | supprimer `src/scorm.ts`, `tools/package-scorm.mjs`, le script `scorm` et `adm-zip` de `package.json`, la section `[SCORM]` de `CLAUDE.md` ; dans `src/state.ts`, retirer les appels à `scorm*` (ne garder que le repli `localStorage`) |
   | Module SCORM | garder tout ; mettre à jour `TOTAL_CHAPTERS` dans `src/state.ts` selon le découpage |
   | Textes non séparés | supprimer `tools/check-i18n.mjs`, `texts/`, `src/i18n.ts`, la section `[TEXTES]` de `CLAUDE.md` ; remplacer les `t('…')` des fichiers d'exemple par le texte direct ; retirer `node tools/check-i18n.mjs &&` du script `check` et du `deploy.mjs` s'il y est référencé |
   | Textes séparés | garder ; ajouter chaque langue cible dans `LANGUAGES` (`src/i18n.ts`) ; créer `public/texts/<code>.json` avec `{ "_partial": true }` |
   | Mobile uniquement | garder la section `[MOBILE]`, supprimer `[MULTI]` |
   | Responsive 3 tailles | garder `[MULTI]`, supprimer `[MOBILE]` ; dans `style.css`, passer `--col` à `100vw` et ajouter les media queries `768px` et `1100px` |

   Supprime ensuite les lignes de marqueurs `[SCORM]`, `[TEXTES]`, `[MOBILE]`, `[MULTI]` dans les titres de `CLAUDE.md` et le commentaire HTML en tête.
4. **Chapitres** : crée un fichier `src/chapterN.ts` par chapitre à partir de `src/chapter1.ts` (et ses clés `chN.*` si les textes sont séparés), branche-les dans `main.ts` avec un routage minimal par `location.hash` (`#/ch/1`, `#/ch/2`…), et mets `TOTAL_CHAPTERS` à jour.
   Pour une expérience fluide sur des téléphones peu puissants, affiche le premier chapitre tout de suite et charge les suivants petit à petit en arrière-plan (`import('./chapterN')` dans le routage, préchargé pendant la lecture ; le module étant téléchargé en local par le LMS, le réseau n'est pas en cause).
5. `npm install`, puis `npm run check` : tout doit passer. Corrige avant de continuer. Ouvre `npm run dev` pour vérifier visuellement la page (utilise le navigateur intégré si tu en as un).

## Étape 3 : dépôt GitHub privé

```bash
git init -b main
git add -A
git commit -m "Socle du projet (kit Lux Modernis)"
gh repo create luxmodernis/<slug> --private --source . --remote origin --push
```

- Si `gh` n'est pas disponible ou refuse (droits sur l'organisation), demande à la personne de créer le dépôt **privé** `luxmodernis/<slug>` sur github.com (vide, sans README) et donne-lui les deux commandes `git remote add origin …` / `git push -u origin main`.
- **Le dépôt ne doit jamais être public** : le contenu des projets est souvent sous droits client. Vérifie : `gh repo view luxmodernis/<slug> --json visibility`.
- Si git refuse de committer faute d'identité (`user.name` / `user.email`), demande-les à la personne et configure-les en local (`git config user.name …`).

## Étape 4 : Vercel (la seule étape manuelle de la personne)

Je ne peux pas me connecter à la place de la personne. Guide-la, une commande à la fois, **dans le terminal de l'application** (onglet Terminal) ou le sien :

1. `npx vercel login` (connexion par e-mail ou GitHub dans le navigateur).
2. Création et liaison du projet, depuis le dossier **frère** du projet (jamais dans le dépôt). Une seule commande, sans question, testée :
   ```bash
   mkdir ../deploy-<slug>
   cd ../deploy-<slug>
   npx vercel link --yes --project <slug> --scope lux-modernis
   ```
   Elle crée le projet Vercel `<slug>` dans l'équipe `lux-modernis` et le lie au dossier (`.vercel/`). Si Vercel répond que l'équipe est introuvable, lance `npx vercel teams ls` et reprends l'identifiant affiché. Le premier `npm run deploy` fera le premier déploiement.
3. Si la personne n'est pas dans l'équipe Vercel `lux-modernis`, elle doit demander une invitation à Bertrand avant de continuer ; en attendant, saute à l'étape 5 et reviens ici plus tard.

Pourquoi ce détour : Vercel (offre gratuite) bloque les déploiements reliés à un dépôt quand l'e-mail du commit n'est pas celui d'un membre de l'équipe. En déployant un dossier hors git, le dépôt reste privé et rien ne bloque. `npm run deploy` remplit ce dossier avec le build, ajoute `noindex` et lance `vercel --prod`.

Quand c'est lié, lance `npm run deploy -- "Premier déploiement"`, récupère l'adresse (`https://<slug>.vercel.app` ou voisine), mets-la dans `{{VERCEL_URL}}` de `CLAUDE.md`, ouvre-la et vérifie que l'**étiquette de version** apparaît en bas à gauche.

## Étape 5 : le hub et les conversations de chapitre

1. Retrouve l'identifiant de **cette** conversation (`local_…`), par exemple avec l'outil `list_sessions` de l'application, ou demande à la personne de le copier. Remplace `{{HUB_ID}}` dans `CLAUDE.md` et `docs/REGLES-CHAPITRES.md`, puis committe (« Hub : identifiant »). Si tu n'arrives pas à le trouver, retire la phrase `SendMessage` des deux fichiers et écris que la personne relaie à la main.
2. Explique à la personne, en 6 lignes maximum, comment travailler :
   - **Cette conversation reste le hub** : on y règle ce qui est commun (styles, composants, déploiement) et on y dit « pousse et déploie ».
   - **Une conversation par chapitre** : dans l'application, nouvelle session **dans le même dossier du projet** (pas dans un worktree), puis coller le contenu de `docs/REGLES-CHAPITRES.md` en précisant le numéro du chapitre.
   - Les chapitres commitent leurs fichiers ; le hub pousse et déploie ; ils se parlent via le hub pour ne rien écraser.
3. Donne le **récapitulatif final** : adresse GitHub, adresse Vercel, commandes utiles (`npm run dev`, `npm run check`, `npm run deploy`, `npm run jalon`, et `npm run scorm` si SCORM), et la phrase « pousse et déploie ».
4. Sauvegarde dans ta mémoire de projet (si tu en as une) la règle : « pousse » = commit + push ; « pousse et déploie » = `npm run deploy` direct, sans demander, puis donner l'adresse.

## Qualité du livrable : léger, rapide, autonome

Le projet finit dans un LMS, sur des téléphones parfois anciens. Ces règles sont détaillées dans `CLAUDE.md` (section « Poids, fluidité et autonomie du package ») et contrôlées par `npm run check` :

- **Images optimisées** : originaux dans `assets-src/`, `npm run images` produit des WebP légers dans `src/assets/`. Applique-le toi-même à toute image que la personne te donne, sans qu'elle ait à le demander.
- **Polices intégrées au package** (`.woff2`, 2 graisses max, chemins relatifs), jamais de Google Fonts ni de CDN : les LMS bloquent souvent les appels vers l'extérieur. Si la personne donne un nom de police, cherche son fichier libre de droits (ou demande-le-lui) et intègre-le.
- **Code sobre pour les téléphones peu puissants** (cible iOS 15+ / Chrome 96+, réglée dans `vite.config.ts`) : pas de bibliothèque lourde, animations en `transform` / `opacity`, chapitres et médias chargés petit à petit en arrière-plan. Ces réglages sont des points de départ, à affiner projet par projet.
- **Aucun appel externe** (CDN, analytics, vidéos en ligne).
- Avant chaque livraison : `npm run scorm`, puis rappelle à la personne de tester le zip sur SCORM Cloud et de regarder le poids annoncé.

## Règles à respecter pendant tout le projet (elles sont aussi dans `CLAUDE.md`)

- Ne jamais rendre le dépôt public. Ne jamais committer de mot de passe, jeton ou clé.
- Ne jamais faire `git add -A` depuis une conversation de chapitre ; ne jamais pousser ni déployer depuis un chapitre.
- Ne jamais utiliser `--all` avec `npm run deploy` sans avoir vu la liste des fichiers en attente.
- Dans le doute sur la propriété d'un fichier, écrire au hub.
