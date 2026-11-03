// Pont SCORM (1.2 et 2004). Sans LMS, tout est no-op : le contenu reste jouable en local (repli localStorage dans state.ts).
// Les chapitres ne parlent jamais à ce fichier : ils passent par state.ts, qui appelle scormSave / scormReport.

type Api = Record<string, (...a: string[]) => string>;

let api: Api | null = null;
let version: '12' | '2004' | null = null;

function find(win: Window, name: string): Api | null {
  for (let i = 0; win && i < 20; i++) {
    try {
      const found = (win as any)[name];
      if (found) return found;
      if (win.parent === win) break;
      win = win.parent;
    } catch {
      break;
    }
  }
  return null;
}

const v2004 = () => version === '2004';
const call = (fn: string, ...args: string[]): string => (api && api[fn] ? String(api[fn](...args)) : '');
const getValue = (key: string): string => call(v2004() ? 'GetValue' : 'LMSGetValue', key);
const setValue = (key: string, value: string): void => { call(v2004() ? 'SetValue' : 'LMSSetValue', key, value); };
const commit = (): void => { call(v2004() ? 'Commit' : 'LMSCommit', ''); };

export const scormAvailable = (): boolean => api !== null;

/** À appeler une fois au démarrage. */
export function scormInit(): void {
  const candidates: [string, '12' | '2004'][] = [['API_1484_11', '2004'], ['API', '12']];
  for (const [name, v] of candidates) {
    api = find(window, name) ?? (window.opener ? find(window.opener, name) : null);
    if (api) { version = v; break; }
  }
  if (!api) return;
  call(v2004() ? 'Initialize' : 'LMSInitialize', '');
  // à la reprise le LMS a déjà un statut : ne jamais repasser un module terminé à « incomplete »
  const status = getValue(v2004() ? 'cmi.completion_status' : 'cmi.core.lesson_status');
  if (!status || status === 'not attempted' || status === 'unknown') {
    setValue(v2004() ? 'cmi.completion_status' : 'cmi.core.lesson_status', 'incomplete');
  }
  window.addEventListener('pagehide', scormTerminate);
}

/** Données sauvegardées lors d'une session précédente (état du module en JSON), ou '' hors LMS. */
export const scormLoad = (): string => (api ? getValue('cmi.suspend_data') : '');

/** Sauvegarde l'état du module (JSON, limité à 4096 caractères en SCORM 1.2). */
export function scormSave(json: string): void {
  if (!api) return;
  setValue('cmi.suspend_data', json);
  commit();
}

export interface Report {
  /** progression globale, de 0 à 1 */
  progress: number;
  /** meilleur score du quiz en %, ou null s'il n'a pas encore été fait */
  best: number | null;
  /** module terminé (quiz fait) */
  completed: boolean;
}

/** Remonte progression, meilleur score et complétion au LMS. */
export function scormReport({ progress, best, completed }: Report): void {
  if (!api) return;
  if (v2004()) {
    setValue('cmi.progress_measure', progress.toFixed(2));
    if (best !== null) {
      setValue('cmi.score.min', '0');
      setValue('cmi.score.max', '100');
      setValue('cmi.score.raw', String(best));
      setValue('cmi.score.scaled', (best / 100).toFixed(2));
    }
    setValue('cmi.completion_status', completed ? 'completed' : 'incomplete');
  } else {
    if (best !== null) {
      setValue('cmi.core.score.min', '0');
      setValue('cmi.core.score.max', '100');
      setValue('cmi.core.score.raw', String(best));
    }
    setValue('cmi.core.lesson_status', completed ? 'completed' : 'incomplete');
  }
  commit();
}

function scormTerminate(): void {
  if (!api) return;
  setValue(v2004() ? 'cmi.exit' : 'cmi.core.exit', 'suspend'); // reprise possible au même endroit
  commit();
  call(v2004() ? 'Terminate' : 'LMSFinish', '');
  api = null;
}

/** Quitte le module : ferme la session SCORM puis tente de fermer la fenêtre. */
export function exitModule(): void {
  scormTerminate();
  window.close();
}
