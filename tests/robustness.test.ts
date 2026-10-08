import { describe, expect, it } from 'vitest';
import { nl } from '../src/content/nl';
import { canDoAction, daysLeft, decideChoice, doAction, openChoice } from '../src/game/engine';
import { journalAt } from '../src/game/journal';
import { activityAt, statusText } from '../src/game/status';
import { finishStats } from '../src/game/stats';
import { parseSave } from '../src/storage/storage';
import { DAY, HOUR } from '../src/utils/dates';
import { START, makeRace } from './helpers';

/** Een race waarin de speler alles doet: elke dag een actie, elke keuze zelf. */
function busyRace(seed: number) {
  let race = makeRace(seed);
  for (let t = START; t <= race.endTime; t += HOUR) {
    const c = openChoice(race, t);
    if (c) race = decideChoice(race, c.id, c.choice.options.at(-1)!.id, t);
    if (canDoAction(race, t)) race = doAction(race, (['voeren', 'aanmoedigen', 'hoed', 'niets'] as const)[(t / HOUR) % 4], t);
  }
  return race;
}

describe('randgevallen', () => {
  it('journaalregels hebben altijd een unieke code (anders raakt het scherm in de war)', () => {
    for (let seed = 0; seed < 15; seed++) {
      const race = busyRace(seed);
      for (const t of [START + DAY, START + 4 * DAY, race.endTime + DAY]) {
        const ids = journalAt(race, t).map((e) => e.id);
        expect(new Set(ids).size).toBe(ids.length);
      }
    }
  });

  it('er is altijd een statustekst, wat Gerard ook doet', () => {
    const race = busyRace(3);
    for (let t = START; t <= race.endTime + DAY; t += 3 * HOUR) {
      const key = activityAt(race, 'gerard', t);
      expect(nl.engine.status[key], key).toBeTruthy();
      expect(statusText(race, 'gerard', t).length).toBeGreaterThan(3);
    }
  });

  it('finishstatistieken zijn altijd ingevuld', () => {
    for (let seed = 0; seed < 30; seed++) {
      for (const s of finishStats(makeRace(seed))) {
        expect(s.label.length).toBeGreaterThan(3);
        expect(s.value.length).toBeGreaterThan(0);
        expect(s.value).not.toContain('NaN');
      }
    }
  });

  it('dagen te gaan blijft tussen 0 en 7, ook met een verzette klok', () => {
    const race = makeRace(1);
    expect(daysLeft(race, START - 3 * DAY)).toBe(7);
    expect(daysLeft(race, START + 6.5 * DAY)).toBe(1);
    expect(daysLeft(race, race.endTime + DAY)).toBe(0);
  });

  it('een oude opslag zonder nieuwe velden wordt netjes aangevuld', () => {
    const old = parseSave({ version: 1, race: null, history: [], raceCounter: 2, clockOffset: 0 });
    expect(old.raceCounter).toBe(2);
    expect(old.journalSeenAt).toBe(0);
    expect(old.finishSeenRaceId).toBeNull();
  });

  it('een keuze die net verlopen is kan niet meer, maar breekt niets', () => {
    const race = makeRace(4);
    const c = race.choices[0];
    expect(() => decideChoice(race, c.id, c.choice.options[0].id, c.deadline + 1)).toThrow();
    expect(journalAt(race, c.deadline + 1).length).toBeGreaterThan(0);
  });
});
