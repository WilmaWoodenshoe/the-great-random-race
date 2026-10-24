import { describe, expect, it } from 'vitest';
import { choices, getCourse, getRacer } from '../src/content';
import { canDoAction, createRace, decideChoice, doAction, openChoice, racerMovement, standingsAt } from '../src/game/engine';
import { journalAt } from '../src/game/journal';
import { runBalance } from '../src/game/balance';
import { courseForDays } from '../src/game/course';
import { DAY, HOUR } from '../src/utils/dates';
import { START } from './helpers';

const lineup = ['gerard', 'isabelle', 'ducky', 'turbo', 'kevin', 'roger'].map(getRacer);
const humans = ['gerard', 'isabelle'];
const shared = (playerId: string, days = 7) =>
  createRace({
    now: START,
    seed: 99,
    number: 1,
    course: courseForDays(getCourse('grote-bosrace'), days),
    racers: lineup,
    choices,
    playerId,
    humanIds: humans,
  });

describe('gedeelde race met meerdere spelers', () => {
  it('is voor elke speler precies dezelfde race', () => {
    const a = shared('gerard');
    const b = shared('isabelle');
    expect({ ...a, playerId: '' }).toEqual({ ...b, playerId: '' });
    const at = START + 3 * DAY;
    const pos = (r: typeof a) => standingsAt(r, at).map((s) => `${s.racerId}:${s.km.toFixed(3)}`);
    expect(pos(a).sort()).toEqual(pos(b).sort());
  });

  it('elke speler krijgt eigen keuze-events', () => {
    const race = shared('gerard');
    const owners = new Set(race.choices.map((c) => c.racerId));
    expect(owners).toEqual(new Set(humans));
  });

  it('een keuze van de ene speler raakt de andere racer niet', () => {
    const race = shared('gerard');
    const sc = race.choices.find((c) => c.racerId === 'isabelle')!;
    expect(openChoice(race, sc.time, 'gerard')?.id).not.toBe(sc.id);
    const slow = sc.choice.options.find((o) => o.effects.some((e) => e.speed === 0)) ?? sc.choice.options[0];
    const decided = decideChoice(race, sc.id, slow.id, sc.time, 'isabelle');
    const later = sc.time + 2 * HOUR;
    expect(racerMovement(decided, 'gerard', later).km).toBe(racerMovement(race, 'gerard', later).km);
  });

  it('elke speler mag zelf één actie per dag doen', () => {
    let race = shared('gerard');
    const t = START + 2 * HOUR;
    race = doAction(race, 'voeren', t, 'gerard');
    expect(canDoAction(race, t, 'gerard')).toBe(false);
    expect(canDoAction(race, t, 'isabelle')).toBe(true);
    race = doAction(race, 'hoed', t, 'isabelle');
    const texts = journalAt(race, t + HOUR).filter((e) => e.kind === 'action').map((e) => e.text);
    expect(texts.some((x) => x.includes('Isabelle'))).toBe(true);
    expect(texts.some((x) => x.includes('Gerard'))).toBe(true);
  });

  it('een computerracer krijgt geen keuzes en geen acties', () => {
    const race = shared('gerard');
    expect(race.choices.some((c) => c.racerId === 'ducky')).toBe(false);
    expect(canDoAction(race, START + HOUR, 'ducky')).toBe(true); // de engine verbiedt het niet, de server wel
  });
});

describe('raceduur 7, 14 of 21 dagen', () => {
  it('een race van 21 dagen eindigt na 21 dagen en is drie keer zo lang', () => {
    const race = shared('gerard', 21);
    expect(race.endTime - race.startTime).toBe(21 * DAY);
    expect(race.course.lengthKm).toBeCloseTo(3 * getCourse('grote-bosrace').lengthKm, 1);
    expect(courseForDays(getCourse('grote-bosrace'), 14).lengthKm).toBeCloseTo(85.4, 1);
  });

  it('in een langere race finisht Gerard naar verhouding op hetzelfde moment', () => {
    const week = runBalance(300, 1, null, undefined, 7).perRacer.gerard;
    for (const days of [14, 21]) {
      const long = runBalance(300, 1, null, undefined, days).perRacer.gerard;
      expect(long.finishes / 300, `${days} dagen`).toBeGreaterThan(0.75);
      const ratio = long.medianFinishDay! / days - week.medianFinishDay! / 7;
      expect(Math.abs(ratio), `${days} dagen`).toBeLessThan(0.06);
      expect(Math.abs(long.wins - week.wins) / 300, `${days} dagen`).toBeLessThan(0.15);
    }
  });
});
