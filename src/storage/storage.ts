// Opslag op het toestel (IndexedDB, via idb-keyval). De rest van de app
// praat alleen met deze functies, zodat de opslag later vervangen kan
// worden door een server (API) zonder de app om te bouwen.

import { createStore, del, get, set, type UseStore } from 'idb-keyval';
import { EMPTY_SAVE, type SaveData } from '../models/Save';

export interface GameStorage {
  load(): Promise<SaveData>;
  save(data: SaveData): Promise<void>;
  clear(): Promise<void>;
}

const KEY = 'save';

/** Controleer of opgeslagen gegevens bruikbaar zijn; anders beginnen we opnieuw. */
export function parseSave(raw: unknown): SaveData {
  if (!raw || typeof raw !== 'object') return { ...EMPTY_SAVE };
  const data = raw as Partial<SaveData>;
  if (data.version !== 1) return { ...EMPTY_SAVE };
  const race = data.race && data.race.version === 1 ? data.race : null;
  return {
    version: 1,
    race,
    history: Array.isArray(data.history) ? data.history : [],
    raceCounter: typeof data.raceCounter === 'number' ? data.raceCounter : 0,
    clockOffset: typeof data.clockOffset === 'number' ? data.clockOffset : 0,
  };
}

/** Opslag in IndexedDB in de browser. */
export function createIndexedDbStorage(dbName = 'the-great-random-race'): GameStorage {
  let store: UseStore | null = null;
  const db = () => (store ??= createStore(dbName, 'game'));
  return {
    async load() {
      try {
        return parseSave(await get(KEY, db()));
      } catch {
        return { ...EMPTY_SAVE };
      }
    },
    save: (data) => set(KEY, data, db()),
    clear: () => del(KEY, db()),
  };
}

/** Opslag in het geheugen (voor tests, of als IndexedDB niet werkt). */
export function createMemoryStorage(initial?: SaveData): GameStorage {
  let data: unknown = initial ? structuredClone(initial) : undefined;
  return {
    load: async () => parseSave(structuredClone(data)),
    save: async (d) => void (data = structuredClone(d)),
    clear: async () => void (data = undefined),
  };
}

/**
 * Vraag de browser om de gegevens niet zomaar op te ruimen. Vooral op de
 * iPhone helpt dit (samen met de app op het beginscherm zetten).
 */
export async function requestPersistentStorage(): Promise<boolean> {
  try {
    if (navigator.storage?.persist) return await navigator.storage.persist();
  } catch {
    // Geen probleem: dan werkt het gewoon zonder.
  }
  return false;
}
