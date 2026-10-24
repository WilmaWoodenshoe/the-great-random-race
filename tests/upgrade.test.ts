import { describe, expect, it } from 'vitest';
import { placeRacers } from '../src/game/mapPosition';
import { finalStandings, standingsAt } from '../src/game/engine';
import { journalAt } from '../src/game/journal';
import { parseSave } from '../src/storage/storage';
import { EMPTY_SAVE } from '../src/models/Save';
import { DAY } from '../src/utils/dates';
import { START, makeRace } from './helpers';

/** Een race zoals hij in fase 3 werd opgeslagen: zonder pad, hoedplek en nieuwe bijnaam. */
function oldRace() {
  const race = structuredClone(makeRace(7));
  for (const s of race.course.segments) delete (s as Partial<typeof s>).path;
  for (const r of race.racers) delete r.hatSpot;
  race.racers.find((r) => r.id === 'gerard')!.title = 'The Unreasonably Slow';
  return race;
}

describe('oude opgeslagen races', () => {
  it('worden aangevuld en werken weer op elk scherm', () => {
    const save = parseSave(JSON.parse(JSON.stringify({ ...EMPTY_SAVE, race: oldRace() })));
    const race = save.race!;
    expect(race.course.segments.every((s) => s.path.length >= 2)).toBe(true);
    expect(() => placeRacers(race.course, standingsAt(race, START + DAY))).not.toThrow();
    expect(race.racers.find((r) => r.id === 'gerard')!.title).toBe('The Determined');
    expect(race.racers.find((r) => r.id === 'gerard')!.hatSpot).toBeDefined();
    expect(journalAt(race, START + 2 * DAY).length).toBeGreaterThan(0);
  });

  it('de uitslag verandert niet door het aanvullen', () => {
    const before = oldRace();
    const after = parseSave({ ...EMPTY_SAVE, race: structuredClone(before) }).race!;
    expect(finalStandings(after)).toEqual(finalStandings(before));
  });
});
