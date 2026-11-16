import type { ContinentId } from '../data/countries';
import type { RecordEntry, Settings } from '../game/types';

/**
 * Local-only persistence adapter. The factory build ships no key-value native
 * module, so this keeps the app-session store behind a tiny interface: swap the
 * body for a real adapter later without touching gameplay code.
 */

type Store = {
  settings: Settings;
  records: RecordEntry[];
  completed: ContinentId[];
};

const DEFAULT_SETTINGS: Settings = {
  mode: 'relaxed',
  sound: true,
  reducedMotion: false,
  placement: 'drag',
};

let store: Store = {
  settings: DEFAULT_SETTINGS,
  records: [],
  completed: [],
};

export function loadSettings(): Settings {
  return store.settings;
}

export function saveSettings(settings: Settings): void {
  store = { ...store, settings };
}

export function loadRecords(): RecordEntry[] {
  return store.records;
}

export function saveRecords(records: RecordEntry[]): void {
  store = { ...store, records };
}

export function loadCompleted(): ContinentId[] {
  return store.completed;
}

export function saveCompleted(completed: ContinentId[]): void {
  store = { ...store, completed };
}

export function resetProgress(): void {
  store = { settings: store.settings, records: [], completed: [] };
}
