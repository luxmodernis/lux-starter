# {{TITLE}}

{{DESCRIPTION}}

Dépôt GitHub (privé) : `{{GITHUB_REPO}}` · branche `main` · site de test Vercel : {{VERCEL_URL}}

Type : {{TYPE}} · Écrans : {{ECRANS}} · Textes : {{TEXTES}}

<!-- Les sections marquées [SCORM], [TEXTES], [MOBILE] ou [MULTI] ne restent que si elles s'appliquent (le brief d'installation les élague). -->

## Organisation en conversations parallèles

Le travail est découpé en **une conversation par chapitre / partie**, plus **une conversation « hub déploiement »** qui est la conversation maître. Tout se passe sur `main`, dans le même dossier : un réglage commun est visible partout immédiatement. La propreté vient de règles de propriété, pas de branches.

| Conversation | Possède | Ne fait pas |
|---|---|---|
| **Hub déploiement** | styles et composants communs (boutons, textes, couleurs, polices, transitions), `main.ts`, `state.ts`, `scorm.ts`, routage, `tools/`, déploiement, jalons, `CLAUDE.md`, `docs/` | le contenu d'un chapitre |
| **Chapitre N** | `chapterN*.ts`, ses assets (`src/assets/chN/`, `public/Chap-N/`), ses règles CSS préfixées `.cN-…`, ses clés `chN.*` dans `texts/en.json` | tout style global, composant commun, `main.ts`, `state.ts`, `tools/`, push, déploiement |

- Un chapitre qui a besoin d'un réglage commun **ne le fabrique pas** : il écrit au hub.
- Chaque conversation de chapitre commite **uniquement ses fichiers** (`git add <ses fichiers>`, jamais `git add -A`), message « Chapitre N : … ». Elle ne pousse pas et ne déploie pas.
- Avant de modifier un fichier qui n'est pas le sien, une conversation s'arrête et écrit au hub.
- **Les conversations se parlent** avec `SendMessage` (`to` = identifiant de session `local_…`). Le hub est le point central : les chapitres lui écrivent, il relaie et tranche. Message court : ce qui manque ou a changé, les fichiers concernés, le commit. Identifiant du hub : `{{HUB_ID}}`.
- Le texte à coller dans une nouvelle conversation de chapitre est `docs/REGLES-CHAPITRES.md`.

## Publier

- **« pousse »** = commit + push GitHub seulement.
- **« pousse et déploie »** (ou « déploie sur Vercel ») = lancer directement `npm run deploy -- "message"`, sans demander de confirmation, puis donner l'adresse du site. Si des fichiers d'autres conversations ne sont pas committés, la commande s'arrête et les liste : demander au hub / à l'utilisateur avant d'utiliser `--all`.
- Le dépôt GitHub reste **toujours privé**. Le déploiement Vercel se fait depuis un dossier hors git (`../deploy-{{SLUG}}`), voir `tools/README-deploy.md`.
- `npm run check` = contrôles sans déployer. `npm run jalon -- nom "description"` = étiquette sur un état validé.
- **Version** : un petit texte en bas à gauche (`commit · date`) s'affiche sur `*.vercel.app` uniquement, jamais dans un package SCORM. Il permet de vérifier qu'on regarde la bonne version : « + » après le commit = fichiers modifiés non committés.

## [TEXTES] Textes et traduction

- Aucun texte affiché n'est écrit en dur : tout passe par `t('cle')` (`src/i18n.ts`) et vit dans **un seul fichier**, `texts/en.json` (référence, clés plates préfixées `ui.*`, `chN.*`).
- Une clé n'est jamais renommée une fois envoyée en traduction. Une conversation n'ajoute que ses propres clés.
- Une autre langue = `public/texts/<code>.json` (mêmes clés, mêmes balises et variables) + une ligne dans `LANGUAGES` (`i18n.ts`). `npm run check` vérifie la cohérence.
- Envoyer `texts/en.json` à la traduction ; ajouter `"_partial": true` dans un fichier de langue incomplet.

## [SCORM] Module SCORM

- `src/scorm.ts` (SCORM 1.2 et 2004) n'est appelé que par `src/state.ts` : les chapitres utilisent `markSeen()` / `setBest()`, jamais SCORM directement.
- `base: './'` dans `vite.config.ts` (chemins relatifs) est indispensable.
- `npm run scorm` produit `scorm/<projet>-scorm12.zip`. À tester sur SCORM Cloud puis sur le LMS réel (l'état est limité à 4096 caractères en SCORM 1.2).

## [MOBILE] Responsive : mobile uniquement

Le contenu est conçu pour mobile. Sur tablette et desktop : mise en page mobile (`--col`, 430 px max) centrée sur fond noir, sans colonne visible. Tester sur iPhone réel ou simulateur.

## [MULTI] Responsive : mobile, tablette, desktop

Mobile d'abord (`--col` = 100vw), puis media queries `min-width: 768px` (tablette) et `min-width: 1100px` (desktop). Tester les trois tailles à chaque chapitre.

## Poids, fluidité et autonomie du package

Le contenu est livré dans un LMS : package léger, fluide sur des téléphones peu puissants, **sans aucun appel vers l'extérieur**. `npm run check` et `npm run deploy` échouent si ces règles sont violées (`tools/check-assets.mjs`).

- **Images** : déposer les originaux dans `assets-src/` (même arborescence que `src/assets/`), lancer `npm run images` (WebP, 1080 px de large max), n'importer que les `.webp` de `src/assets/`. Jamais d'image de plus de 200 Ko sans raison ; au-delà de 400 Ko le contrôle échoue. Pas de PNG/JPG brut dans `public/` ni `src/assets/`.
- **Vidéo et son** : vidéo MP4 H.264, 720 px max, 1 à 2 Mo/min si possible, avec image d'aperçu (`poster`) ; son AAC/MP3 96 kbit/s ; ne jamais lancer automatiquement. Jamais de lecteur en ligne (YouTube, Vimeo).
- **Polices** : **intégrées au package**, jamais Google Fonts ni CDN. Format `.woff2` uniquement, uniquement les graisses utilisées (2 maximum), `font-display: swap`, chargées par `@font-face` avec un chemin relatif (`src/assets/fonts/…`). Texte hors latin (ja, ar…) : sous-ensemble de la police, sinon le fichier pèse plusieurs Mo.
- **Autonomie** : pas de CDN, pas d'icônes en ligne, pas d'analytics, pas de `fetch` vers un autre domaine. Tout (JS, CSS, polices, médias, textes JSON) est dans le package et en chemins relatifs.
- **Téléphones peu puissants** (cible : iOS 15+ et Android avec Chrome/WebView 96+, réglée dans `vite.config.ts`, à ajuster par projet) : animer uniquement `transform` et `opacity` ; pas de `filter: blur`, ombres portées ou `backdrop-filter` sur de grandes surfaces ; pas de bibliothèque lourde (React, GSAP…) sans validation du hub ; peu d'éléments animés en même temps ; respecter `prefers-reduced-motion`. Le module est téléchargé en local par le LMS avant d'être joué : le réseau n'est pas le problème, la mémoire et le processeur du téléphone le sont. Le premier écran doit s'afficher tout de suite ; les chapitres suivants et leurs médias se chargent petit à petit en arrière-plan (import dynamique `import('./chapterN')` lancé pendant que la personne lit le chapitre en cours, `requestIdleCallback` si présent, sinon `setTimeout` : Safari ne l'a pas), sans bloquer l'affichage ni l'animation.
- **Tester** : dans Chrome, outils de développement → Performance → ralentir le processeur (×4 ou ×6) ; viser un premier écran immédiat, des transitions fluides et aucune saccade au défilement. Idéalement, un vrai téléphone d'entrée de gamme ou de 3-4 ans.
- **Cibles de poids** : package SCORM autour de 50 Mo au maximum. C'est une **indication, jamais bloquante** : `npm run check` et `npm run scorm` affichent seulement un avertissement au-delà. On affine projet par projet.

## Pièges connus

- **iOS** : `position: sticky` dans un conteneur qui défile (`#app`) est repositionné avec retard (cadre noir qui grandit pendant le scroll). Utiliser `position: fixed`.
- `100dvh` peut dépasser de quelques px sur iOS : utiliser `var(--vh)` mesuré par `main.ts`.
