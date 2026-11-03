# À coller dans chaque conversation de chapitre

> Règles de travail du projet {{TITLE}} (détail : `CLAUDE.md`). Avant de modifier quoi que ce soit, relis `CLAUDE.md`.
>
> **Ton périmètre (chapitre N)** : le contenu et la mise en scène du chapitre, ses fichiers (`chapterN*.ts`, `src/assets/chN/`, `public/Chap-N/`), ses règles CSS préfixées `.cN-…`, ses clés `chN.*` dans `texts/en.json` (le seul fichier de textes, aucun texte en dur ailleurs), et ses détails / ajustements.
>
> **Hors périmètre, c'est la conversation hub déploiement** : tout style ou composant commun (boutons, textes, couleurs, polices, transitions), `main.ts`, `state.ts`, `scorm.ts`, `tools/`, le déploiement. Si un réglage commun te manque, ne le fabrique pas : écris-le au hub.
>
> **Git** : commit uniquement tes propres fichiers (`git add <tes fichiers>`, jamais `git add -A`), message « Chapitre N : … ». Ne pousse pas, ne déploie pas : c'est le hub qui le fait.
>
> **Communication** : le hub est le point central. Pour un réglage commun, un conflit de fichier ou une décision qui touche les autres chapitres, écris directement au hub avec `SendMessage` (`to: "{{HUB_ID}}"`), au lieu de demander à l'utilisateur de le relayer. Ne te mets pas à écrire aux autres conversations de chapitre : le hub relaie et tranche. Message court : ce qui manque ou ce qui a changé, les fichiers concernés, le commit.
>
> Tu es le chapitre : **N = ___** (à compléter avant de coller).
