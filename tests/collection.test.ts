import { describe, expect, it } from 'vitest';
import { accessories, getRacer, racers } from '../src/content';
import { isUnlocked, markOpened, newlyUnlocked, progressOf, wear, wearOn, worn } from '../src/game/collection';
import { journalAt } from '../src/game/journal';
import { EMPTY_SAVE, type RaceResult, type SaveData } from '../src/models/Save';
import { DAY } from '../src/utils/dates';
import { START, makeRace } from './helpers';

const acc = (id: string) => accessories.find((a) => a.id === id)!;
const result = (over: Partial<RaceResult>): RaceResult => ({
  raceId: `r${Math.random()}`,
  number: 1,
  courseId: 'grote-bosrace',
  endTime: START,
  position: 4,
  km: 30,
  finishTime: null,
  ...over,
});
const withHistory = (history: RaceResult[]): SaveData => ({ ...EMPTY_SAVE, history });

describe('Collectie: verdienen', () => {
  it('de pet heb je meteen, de rest nog niet', () => {
    expect(isUnlocked(acc('pet'), EMPTY_SAVE, START)).toBe(true);
    for (const id of ['hoed', 'boerenhoed', 'feesthoed', 'kroon', 'helm', 'zonnebril', 'sjaal']) {
      expect(isUnlocked(acc(id), EMPTY_SAVE, START), id).toBe(false);
    }
  });

  it('finish, podium en winst', () => {
    const finished = withHistory([result({ finishTime: START, position: 5 })]);
    expect(isUnlocked(acc('boerenhoed'), finished, START)).toBe(true);
    expect(isUnlocked(acc('feesthoed'), finished, START)).toBe(false);
    const podium = withHistory([result({ finishTime: START, position: 3 })]);
    expect(isUnlocked(acc('feesthoed'), podium, START)).toBe(true);
    expect(isUnlocked(acc('kroon'), podium, START)).toBe(false);
    expect(isUnlocked(acc('kroon'), withHistory([result({ finishTime: START, position: 1 })]), START)).toBe(true);
  });

  it('helm na 3 races, met voortgang', () => {
    const two = withHistory([result({}), result({})]);
    expect(progressOf(acc('helm').unlock, two, START)).toEqual({ done: false, have: 2, need: 3 });
    expect(isUnlocked(acc('helm'), withHistory([result({}), result({}), result({})]), START)).toBe(true);
  });

  it('zonnebril na 7 verschillende dagen, sjaal na een race van 21 dagen', () => {
    let save = EMPTY_SAVE;
    for (let d = 1; d <= 7; d++) save = markOpened(save, `2026-10-0${d}`);
    expect(markOpened(save, '2026-10-01')).toBe(save); // dezelfde dag telt één keer
    expect(isUnlocked(acc('zonnebril'), save, START)).toBe(true);
    expect(isUnlocked(acc('sjaal'), withHistory([result({ days: 14 })]), START)).toBe(false);
    expect(isUnlocked(acc('sjaal'), withHistory([result({ days: 21 })]), START)).toBe(true);
  });

  it('hoed bij je eerste race; nieuw tot je het gezien hebt', () => {
    const save = { ...EMPTY_SAVE, race: makeRace() };
    expect(isUnlocked(acc('hoed'), save, START)).toBe(true);
    expect(newlyUnlocked(save, START).map((a) => a.id)).toEqual(['hoed']);
    expect(newlyUnlocked({ ...save, collectionSeen: ['hoed'] }, START)).toEqual([]);
  });
});

describe('Collectie: dragen', () => {
  it('één per plek, en alleen wat verdiend is', () => {
    let save: SaveData = { ...EMPTY_SAVE, race: makeRace() };
    save = wear(save, 'hoofd', 'pet');
    save = wear(save, 'hoofd', 'hoed');
    save = wear(save, 'nek', 'sjaal'); // nog niet verdiend
    expect(worn(save, START).map((a) => a.id)).toEqual(['hoed']);
    save = wear(save, 'hoofd', null);
    expect(worn(save, START)).toEqual([]);
  });

  it('elke racer heeft een plek voor hoed, bril en sjaal', () => {
    for (const r of racers) {
      // Zonder getekende plaatjes: alles wordt erop gelegd, nek eerst, hoofd bovenop.
      const placed = wearOn({ ...r, wornImages: undefined }, [acc('pet'), acc('zonnebril'), acc('sjaal')])!;
      expect(placed.items.map((w) => w.image), r.id).toEqual([acc('sjaal').image, acc('zonnebril').image, acc('pet').image]);
    }
  });

  it('het journaal reageert soms op wat je racer draagt', () => {
    const race = makeRace();
    const texts = journalAt(race, START + 7 * DAY, [acc('pet')]).map((e) => e.text).join(' ');
    expect(texts).toMatch(/pet/i);
    expect(journalAt(race, START + 7 * DAY).map((e) => e.text).join(' ')).not.toMatch(/de pet/i);
  });

  it('elk accessoire heeft een plaatje, zinnetje en manier om te verdienen', () => {
    for (const a of accessories) {
      expect(a.tagline, a.id).toBeTruthy();
      expect(a.unlock, a.id).toBeTruthy();
      expect(a.fit.size, a.id).toBeGreaterThan(0);
      expect(getRacer('gerard').wear).toBeDefined();
    }
  });

  it('een getekend plaatje van de racer met accessoire gaat voor', () => {
    const gerard = getRacer('gerard');
    const w = wearOn(gerard, [acc('kroon'), acc('zonnebril')])!;
    expect(w.base?.image).toContain('gerard-kroon');
    // De zonnebril heeft ook een eigen plaatje, maar het hoofd gaat voor: de bril wordt erop gelegd.
    expect(w.items.map((x) => x.image)).toEqual([acc('zonnebril').image]);
    const turbo = wearOn(getRacer('turbo'), [acc('kroon')])!;
    expect(turbo.base).toBeUndefined();
    expect(turbo.items).toHaveLength(1);
  });
});
