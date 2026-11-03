// État central : seul fichier qui parle à scorm.ts. Les chapitres appellent markSeen() / setBest(), jamais SCORM directement.
// Hors LMS (test local, Vercel), l'état est gardé dans localStorage.
import { scormAvailable, scormInit, scormLoad, scormReport, scormSave } from './scorm';

interface State { seen: number[]; best: number | null; }

const KEY = 'module-state';
const TOTAL_CHAPTERS = 1; // à mettre à jour quand les chapitres sont créés
let state: State = { seen: [], best: null };

export function initState(): void {
  scormInit();
  try {
    const raw = scormAvailable() ? scormLoad() : localStorage.getItem(KEY) ?? '';
    if (raw) state = { ...state, ...JSON.parse(raw) };
  } catch { /* état illisible : on repart de zéro */ }
}

function persist(): void {
  const json = JSON.stringify(state);
  if (scormAvailable()) scormSave(json);
  else { try { localStorage.setItem(KEY, json); } catch { /* stockage indisponible */ } }
  scormReport({ progress: state.seen.length / TOTAL_CHAPTERS, best: state.best, completed: state.seen.length >= TOTAL_CHAPTERS });
}

export function markSeen(chapter: number): void {
  if (!state.seen.includes(chapter)) { state.seen.push(chapter); persist(); }
}

export function setBest(pct: number): void {
  if (state.best === null || pct > state.best) { state.best = pct; persist(); }
}

export const hasSeen = (chapter: number): boolean => state.seen.includes(chapter);
