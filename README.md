# unbox

Kit de démarrage Lux Modernis pour un projet web ou un module SCORM mené avec Claude Code.

## Avant de commencer

Rien à installer : Claude s'en charge au début de la conversation (Node, git, GitHub CLI). Il vous guidera pour vous connecter à GitHub et Vercel.

Il faut seulement avoir **un compte GitHub** et **un compte Vercel**, et avoir demandé à Bertrand de vous inviter dans l'organisation GitHub `luxmodernis` et l'équipe Vercel `lux-modernis`.

## Pour démarrer (collègues)

1. Dans Claude Code : créer un **nouvel environnement** qui pointe vers un **dossier vide** de votre ordinateur.
2. Ouvrir une session dans ce dossier, choisir le modèle **Sonnet 5.5** avec un effort **moyen** (sélecteur de modèle de l'application), et coller cette phrase :

```
Lis https://raw.githubusercontent.com/luxmodernis/unbox/main/BRIEF.md et suis-le à la lettre pour installer mon projet.
```

Claude vous pose quelques questions (SCORM ou site web, mobile ou responsive, textes à traduire), puis installe tout : projet, GitHub privé, Vercel, version en bas à gauche, organisation en conversations parallèles.

Le projet installé règle ensuite Sonnet avec un effort moyen pour toutes les conversations de ce dossier (`.claude/settings.json`) ; le sélecteur de l'application peut toujours passer outre.

Claude vous demandera votre accord avant chaque installation. Si votre ordinateur demande votre mot de passe, c'est normal : tapez-le vous-même.

## Contenu

- `BRIEF.md` : le brief que lit Claude Code (questions, installation, règles).
- `template/` : les fichiers copiés dans le projet (Vite + TypeScript, scripts Node `deploy`, `jalon`, `images`, `check-assets`, `check-i18n`, `package-scorm`, `CLAUDE.md`, règles des conversations de chapitre).

## Maintenir le kit

Ce dépôt est **public** : n'y mettre aucun contenu client. Les projets créés avec le kit sont toujours privés.
