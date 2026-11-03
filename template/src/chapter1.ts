// Chapitre 1 : modèle de chapitre. Une conversation de chapitre ne touche que ses propres fichiers (chapterN.ts, ses styles .c1-…, ses clés ch1.*).
import { t } from './i18n';
import { markSeen } from './state';

export function mountChapter1(root: HTMLElement): void {
  root.innerHTML = `<section class="c1-section"><h1>${t('ch1.title')}</h1><p>${t('ch1.intro')}</p></section>`;
  markSeen(1);
}
