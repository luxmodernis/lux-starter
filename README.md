# lux-starter

Kit de démarrage Lux Modernis pour un projet web ou un module SCORM mené avec Claude Code.

## Avant de commencer

À faire une seule fois, avant de coller la phrase ci-dessous :

- **Node 20 ou plus** et **git** installés ([nodejs.org](https://nodejs.org), [git-scm.com](https://git-scm.com)).
- **GitHub** : un compte membre de l'organisation `luxmodernis` (demander l'invitation à Bertrand), puis installer la CLI (`brew install gh` sur Mac, `winget install GitHub.cli` sur PC) et lancer `gh auth login`.
- **Vercel** : être invité dans l'équipe `lux-modernis` (demander l'invitation à Bertrand), puis lancer `npx vercel login`.

Claude Code vérifie la machine au début de l'installation et vous dit ce qui manque, mais l'invitation aux deux organisations ne peut venir que de Bertrand.

## Pour démarrer (collègues)

1. Dans Claude Code : créer un **nouvel environnement** qui pointe vers un **dossier vide** de votre ordinateur.
2. Ouvrir une session dans ce dossier et coller cette phrase :

```
Lis https://raw.githubusercontent.com/luxmodernis/lux-starter/main/BRIEF.md et suis-le à la lettre pour installer mon projet.
```

Claude vous pose quelques questions (SCORM ou site web, mobile ou responsive, textes à traduire), puis installe tout : projet, GitHub privé, Vercel, version en bas à gauche, organisation en conversations parallèles.

Il faudra seulement : être membre de l'organisation GitHub `luxmodernis` (`gh auth login`), être invité dans l'équipe Vercel `lux-modernis` (`npx vercel login`).

## Contenu

- `BRIEF.md` : le brief que lit Claude Code (questions, installation, règles).
- `template/` : les fichiers copiés dans le projet (Vite + TypeScript, scripts Node `deploy`, `jalon`, `check-i18n`, `package-scorm`, `CLAUDE.md`, règles des conversations de chapitre).

## Maintenir le kit

Ce dépôt est **public** : n'y mettre aucun contenu client. Les projets créés avec le kit sont toujours privés.
