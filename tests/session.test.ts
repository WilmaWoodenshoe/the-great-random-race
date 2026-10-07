import { describe, expect, it } from 'vitest';
import { EMPTY_SAVE } from '../src/models/Save';
import { archiveIfFinished, canStartRace, careerStats, startRace } from '../src/game/session';
import { finalStandings } from '../src/game/engine';
import { DAY, HOUR } from '../src/utils/dates';
import { START } from './helpers';

describe('race starten', () => {
  it('maakt race #1 met start nu en einde over 7 dagen', () => {
    const save = startRace(EMPTY_SAVE, START, 1);
    expect(save.race!.number).toBe(1);
    expect(save.raceCounter).toBe(1);
    expect(save.race!.startTime).toBe(START);
    expect(save.race!.endTime).toBe(START + 7 * DAY);
  });

  it('geeft elke nieuwe race een eigen seed als je er geen opgeeft', () => {
    const a = startRace(EMPTY_SAVE, START);
    const b = startRace(EMPTY_SAVE, START);
    expect(a.race!.seed).not.toBe(b.race!.seed);
  });

  it('start geen tweede race zolang er een loopt', () => {
    const save = startRace(EMPTY_SAVE, START, 1);
    expect(canStartRace(save, START + 3 * DAY)).toBe(false);
    expect(() => startRace(save, START + 3 * DAY)).toThrow();
  });

  it('na afloop: uitslag in de geschiedenis en race #2 kan beginnen', () => {
    const first = startRace(EMPTY_SAVE, START, 1);
    const after = START + 7 * DAY + HOUR;
    expect(canStartRace(first, after)).toBe(true);
    const second = startRace(first, after, 2);
    expect(second.race!.number).toBe(2);
    expect(second.history).toHaveLength(1);
    const me = finalStandings(first.race!).find((s) => s.racerId === 'gerard')!;
    expect(second.history[0].position).toBe(me.position);
  });

  it('zet een uitslag maar één keer in de geschiedenis', () => {
    const first = startRace(EMPTY_SAVE, START, 1);
    const end = START + 8 * DAY;
    const once = archiveIfFinished(first, end);
    expect(archiveIfFinished(once, end)).toBe(once);
    expect(archiveIfFinished(first, START + DAY)).toBe(first);
  });

  it('houdt races, overwinningen en beste positie bij', () => {
    let save = startRace(EMPTY_SAVE, START, 1);
    expect(careerStats(save, START + DAY)).toEqual({ races: 1, wins: 0, best: null });
    for (let i = 1; i <= 4; i++) save = startRace(save, START + i * 8 * DAY, i + 1);
    const stats = careerStats(save, START + 4 * 8 * DAY + DAY);
    expect(stats.races).toBe(5);
    const positions = save.history.map((h) => h.position);
    expect(stats.best).toBe(Math.min(...positions));
    expect(stats.wins).toBe(positions.filter((p) => p === 1).length);
  });
});
