import './style.css';
import { mountChapter1 } from './chapter1';
import { setLanguage } from './i18n';
import { initState } from './state';

const app = document.getElementById('app')!;

// hauteur exacte de la zone visible, en px : les sections plein écran s'y calent sans dépasser (pas de micro-scroll)
const setVh = () => document.documentElement.style.setProperty('--vh', `${app.clientHeight}px`);
new ResizeObserver(setVh).observe(app);
setVh();

// numéro de version, uniquement sur le site de test Vercel (jamais dans un package SCORM)
if (location.hostname.endsWith('vercel.app')) {
  const v = document.createElement('div');
  v.className = 'build-tag';
  v.textContent = __BUILD__;
  document.body.append(v);
}

initState();
setLanguage('en').then(() => mountChapter1(app));
