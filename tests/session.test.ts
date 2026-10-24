import { describe, expect, it } from 'vitest';
import { EMPTY_SAVE } from '../src/models/Save';
import { archiveIfFinished, canStartRace, careerStats, defaultRacerId, pickLineup, RACERS_PER_RACE, startRace } from '../src/game/session';
import { racers } from '../src/content';
import { finalStandings } from '../src/game/engine';
import { DAY, HOUR } from '../src/utils/dates';
import { START } from './helpers';

describe('race starten', () => {
  it('maakt race #1 met start nu en einde over 7 dagen', () => {
    const save = startRace(EMPTY_SAVE, START, 'gerard', 1);
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
    const save = startRace(EMPTY_SAVE, START, 'gerard', 1);
    expect(canStartRace(save, START + 3 * DAY)).toBe(false);
    expect(() => startRace(save, START + 3 * DAY)).toThrow();
  });

  it('na afloop: uitslag in de geschiedenis en race #2 kan beginnen', () => {
    const first = startRace(EMPTY_SAVE, START, 'gerard', 1);
    const after = START + 7 * DAY + HOUR;
    expect(canStartRace(first, after)).toBe(true);
    const second = startRace(first, after, 'gerard', 2);
    expect(second.race!.number).toBe(2);
    expect(second.history).toHaveLength(1);
    const me = finalStandings(first.race!).find((s) => s.racerId === 'gerard')!;
    expect(second.history[0].position).toBe(me.position);
  });

  it('zet een uitslag maar één keer in de geschiedenis', () => {
    const first = startRace(EMPTY_SAVE, START, 'gerard', 1);
    const end = START + 8 * DAY;
    const once = archiveIfFinished(first, end);
    expect(archiveIfFinished(once, end)).toBe(once);
    expect(archiveIfFinished(first, START + DAY)).toBe(first);
  });

  it('houdt races, overwinningen en beste positie bij', () => {
    let save = startRace(EMPTY_SAVE, START, 'gerard', 1);
    expect(careerStats(save, START + DAY)).toEqual({ races: 1, wins: 0, best: null });
    for (let i = 1; i <= 4; i++) save = startRace(save, START + i * 8 * DAY, 'gerard', i + 1);
    const stats = careerStats(save, START + 4 * 8 * DAY + DAY);
    expect(stats.races).toBe(5);
    const positions = save.history.map((h) => h.position);
    expect(stats.best).toBe(Math.min(...positions));
    expect(stats.wins).toBe(positions.filter((p) => p === 1).length);
  });
});

describe('kies je racer', () => {
  it('speelt met de gekozen racer, plus vijf verschillende tegenstanders', () => {
    const save = startRace(EMPTY_SAVE, START, 'isabelle', 7);
    const race = save.race!;
    expect(race.playerId).toBe('isabelle');
    expect(race.racers).toHaveLength(RACERS_PER_RACE);
    expect(new Set(race.racers.map((r) => r.id)).size).toBe(RACERS_PER_RACE);
    expect(race.racers.map((r) => r.id)).toContain('isabelle');
  });

  it('kiest de tegenstanders willekeurig, maar vast per seed', () => {
    expect(pickLineup('gerard', 3)).toEqual(pickLineup('gerard', 3));
    const lineups = new Set(Array.from({ length: 20 }, (_, i) => pickLineup('gerard', i).map((r) => r.id).join(',')));
    expect(lineups.size).toBeGreaterThan(5);
  });

  it('elke racer kan meedoen als racer van de speler', () => {
    for (const r of racers) {
      const race = startRace(EMPTY_SAVE, START, r.id, 11).race!;
      expect(race.playerId).toBe(r.id);
      // Geen keuze-event over jezelf of over een racer die niet meedoet.
      for (const sc of race.choices) {
        if (!sc.choice.aboutRacer) continue;
        expect(sc.choice.aboutRacer).not.toBe(r.id);
        expect(race.racers.some((x) => x.id === sc.choice.aboutRacer)).toBe(true);
      }
    }
  });

  it('zet de racer van de vorige race weer klaar', () => {
    expect(defaultRacerId(EMPTY_SAVE)).toBe('gerard');
    expect(defaultRacerId(startRace(EMPTY_SAVE, START, 'roger', 1))).toBe('roger');
  });

  it('telt races en overwinningen per racer', () => {
    let save = startRace(EMPTY_SAVE, START, 'gerard', 1);
    save = startRace(save, START + 8 * DAY, 'roger', 2);
    const at = START + 9 * DAY;
    expect(careerStats(save, at, 'gerard').races).toBe(1);
    expect(careerStats(save, at, 'roger').races).toBe(1);
    expect(careerStats(save, at, 'steve').races).toBe(0);
    expect(careerStats(save, at).races).toBe(2);
  });
});
