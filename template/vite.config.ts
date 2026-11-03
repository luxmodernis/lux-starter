import { execSync } from 'node:child_process';
import { defineConfig } from 'vite';

// version affichée en petit en bas à gauche du site de test : commit + heure du build ("+" = fichiers modifiés non committés)
const git = (c: string) => { try { return execSync(`git ${c}`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch { return ''; } };
const BUILD = `${git('rev-parse --short HEAD') || 'dev'}${git('status --porcelain') ? '+' : ''} · ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris', dateStyle: 'short', timeStyle: 'short' })}`;

// base './' : chemins relatifs, indispensable pour un package SCORM (le LMS sert le contenu depuis un sous-dossier).
export default defineConfig({
  base: './',
  define: { __BUILD__: JSON.stringify(BUILD) },
  // target : navigateurs d'anciens téléphones (iOS 12+, Android 7+ environ) ; assetsInlineLimit 0 : aucun média encodé dans le JS
  build: { target: ['es2018', 'safari12', 'chrome64'], assetsInlineLimit: 0, cssTarget: ['safari12', 'chrome64'] },
});
