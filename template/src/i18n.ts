// Textes : texts/en.json est la référence (clés plates, jamais renommées). Une autre langue = public/texts/<code>.json (mêmes clés,
// valeurs traduites), chargé à l'exécution ; une clé absente retombe sur l'anglais. Aucun texte affiché ne doit être écrit en dur.
import en from '../texts/en.json';

type Dict = Record<string, string>;

const base = en as Dict;
let dict: Dict = base;
let current = 'en';

/** Langues proposées. Ajouter une langue = déposer public/texts/<code>.json et ajouter une ligne ici. */
export const LANGUAGES: { code: string; label: string }[] = [
  { code: 'en', label: 'English' },
];

/** RTL : langues écrites de droite à gauche (le gabarit passe en dir="rtl"). */
const RTL = new Set(['ar', 'he', 'fa', 'ur']);

/** Texte pour une clé ; `{n}`, `{pct}`… sont remplacés par `vars`. */
export function t(key: string, vars?: Record<string, string | number>): string {
  let s = dict[key] ?? base[key];
  if (s === undefined) { console.warn(`[i18n] clé manquante : ${key}`); return key; }
  if (vars) for (const k in vars) s = s.split(`{${k}}`).join(String(vars[k]));
  return s;
}

export const getLanguage = (): string => current;

/** Charge et applique une langue. Retombe sur l'anglais si le fichier est introuvable. */
export async function setLanguage(code: string): Promise<void> {
  let next: Dict = base;
  if (code !== 'en') {
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}texts/${code}.json`);
      if (res.ok) next = (await res.json()) as Dict;
      else code = 'en';
    } catch { code = 'en'; }
  }
  dict = next;
  current = code;
  document.documentElement.lang = code;
  document.documentElement.dir = RTL.has(code) ? 'rtl' : 'ltr';
}
