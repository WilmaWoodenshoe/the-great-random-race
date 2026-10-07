import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import { EMPTY_SAVE } from '../src/models/Save';
import { startRace } from '../src/game/session';
import { standingsAt } from '../src/game/engine';
import { createIndexedDbStorage, createMemoryStorage, parseSave } from '../src/storage/storage';
import { DAY } from '../src/utils/dates';
import { START } from './helpers';

describe('opslag in IndexedDB', () => {
  it('is leeg bij de eerste keer', async () => {
    const storage = createIndexedDbStorage('test-leeg');
    expect(await storage.load()).toEqual(EMPTY_SAVE);
  });

  it('bewaart een race en geeft hem precies zo terug', async () => {
    const storage = createIndexedDbStorage('test-bewaren');
    const save = startRace(EMPTY_SAVE, START, 1234);
    await storage.save(save);

    // Alsof de app dicht ging en later weer open: een nieuwe verbinding.
    const reopened = createIndexedDbStorage('test-bewaren');
    const loaded = await reopened.load();
    expect(loaded).toEqual(save);
    expect(standingsAt(loaded.race!, START + 3 * DAY)).toEqual(standingsAt(save.race!, START + 3 * DAY));
  });

  it('kan alles wissen', async () => {
    const storage = createIndexedDbStorage('test-wissen');
    await storage.save(startRace(EMPTY_SAVE, START, 1));
    await storage.clear();
    expect((await storage.load()).race).toBeNull();
  });
});

describe('opslag controleren', () => {
  it('onbruikbare gegevens geven een lege start in plaats van een crash', () => {
    expect(parseSave(null)).toEqual(EMPTY_SAVE);
    expect(parseSave('rommel')).toEqual(EMPTY_SAVE);
    expect(parseSave({ version: 99 })).toEqual(EMPTY_SAVE);
    expect(parseSave({ version: 1, race: { version: 7 } }).race).toBeNull();
  });

  it('opslag in het geheugen werkt hetzelfde', async () => {
    const storage = createMemoryStorage();
    const save = startRace(EMPTY_SAVE, START, 5);
    await storage.save(save);
    expect(await storage.load()).toEqual(save);
  });
});
