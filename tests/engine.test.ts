import { describe, expect, it } from 'vitest';
import { choices, getCourse, racers } from '../src/content';
import {
  canDoAction,
  createRace,
  daysLeft,
  decideChoice,
  doAction,
  finalStandings,
  openChoice,
  racerMovement,
  standingsAt,
  todaysAction,
} from '../src/game/engine';
import { hasHat } from '../src/game/actions';
import { journalAt } from '../src/game/journal';
import { activityAt, statusText } from '../src/game/status';
import { finishStats } from '../src/game/stats';
import { DAY, HOUR, MINUTE } from '../src/utils/dates';
import { START, makeRace } from './helpers';

describe('race aanmaken', () => {
  it('legt start, einde (start + 7 dagen) en seed vast', () => {
    const race = makeRace(99);
    expect(race.startTime).toBe(START);
    expect(race.endTime).toBe(START + 7 * DAY);
    expect(race.seed).toBe(99);
    expect(race.racers).toHaveLength(5);
    expect(race.playerId).toBe('gerard');
  });

  it('is op te slaan als JSON en daarna precies hetzelfde', () => {
    const race = makeRace(3);
    const copy = JSON.parse(JSON.stringify(race));
    expect(standingsAt(copy, START + 3 * DAY)).toEqual(standingsAt(race, START + 3 * DAY));
  });

  it('nieuwe of gewijzigde inhoud verandert een lopende race niet', () => {
    const changed = racers.map((r) => (r.id === 'gerard' ? { ...r, speed: 5 } : r));
    const race = makeRace(8);
    const before = standingsAt(race, START + 2 * DAY);
    createRace({ now: START, seed: 8, number: 2, course: getCourse('grote-bosrace'), racers: changed, choices });
    expect(standingsAt(race, START + 2 * DAY)).toEqual(before);
    expect(race.racers.find((r) => r.id === 'gerard')!.speed).toBe(1);
  });
});

describe('positie en stand', () => {
  it('afstanden blijven tussen 0 en de lengte van het parcours', () => {
    const race = makeRace(11);
    for (let t = START; t <= race.endTime; t += 6 * HOUR) {
      for (const s of standingsAt(race, t)) {
        expect(s.km).toBeGreaterThanOrEqual(0);
        expect(s.km).toBeLessThanOrEqual(race.course.lengthKm);
      }
    }
  });

  it('finishers staan vooraan op finishtijd, de rest op afstand', () => {
    for (let seed = 0; seed < 20; seed++) {
      const s = finalStandings(makeRace(seed));
      const finished = s.filter((x) => x.finishTime !== null);
      const rest = s.filter((x) => x.finishTime === null);
      expect(s.slice(0, finished.length)).toEqual(finished);
      for (let i = 1; i < finished.length; i++) expect(finished[i].finishTime!).toBeGreaterThanOrEqual(finished[i - 1].finishTime!);
      for (let i = 1; i < rest.length; i++) expect(rest[i].km).toBeLessThanOrEqual(rest[i - 1].km);
      expect(s.map((x) => x.position)).toEqual([1, 2, 3, 4, 5]);
    }
  });

  it('na precies 7 dagen verandert er niets meer', () => {
    const race = makeRace(21);
    expect(standingsAt(race, race.endTime + 3 * DAY)).toEqual(finalStandings(race));
    expect(daysLeft(race, race.endTime)).toBe(0);
    expect(daysLeft(race, START)).toBe(7);
  });
});

describe('keuze-events', () => {
  const race = makeRace(4);
  const sc = race.choices[0];

  it('staan open van het moment zelf tot 12 uur later', () => {
    expect(openChoice(race, sc.time - MINUTE)?.id).not.toBe(sc.id);
    expect(openChoice(race, sc.time)?.id).toBe(sc.id);
    expect(openChoice(race, sc.deadline)?.id).not.toBe(sc.id);
  });

  it('de gekozen optie telt vanaf het moment van kiezen, het verleden blijft gelijk', () => {
    const at = sc.time + HOUR;
    const stop = sc.choice.options.find((o) => o.effects[0]?.speed === 0)!;
    const decided = decideChoice(race, sc.id, stop.id, at);
    expect(racerMovement(decided, 'gerard', at).km).toBe(racerMovement(race, 'gerard', at).km);
    expect(racerMovement(decided, 'gerard', at + 10 * MINUTE).km).toBe(racerMovement(decided, 'gerard', at).km);
    expect(openChoice(decided, at + MINUTE)?.id).not.toBe(sc.id);
  });

  it('na de deadline kan de speler niet meer kiezen; Gerard koos zelf', () => {
    expect(() => decideChoice(race, sc.id, sc.choice.options[0].id, sc.deadline)).toThrow();
    const entry = journalAt(race, sc.deadline).find((e) => e.id === `${sc.id}-gekozen`);
    const auto = sc.choice.options.find((o) => o.id === sc.autoOptionId)!;
    expect(auto.journal).toContain(entry!.text);
  });

  it('tijdens een open keuze is Gerard aan het nadenken', () => {
    expect(activityAt(race, 'gerard', sc.time + MINUTE)).toBe('choice');
  });
});

describe('dagelijkse actie', () => {
  const race = makeRace(5);
  const morning = START + 2 * HOUR; // woensdag 11:00

  it('kan één keer per kalenderdag', () => {
    expect(canDoAction(race, morning)).toBe(true);
    const done = doAction(race, 'voeren', morning);
    expect(canDoAction(done, morning + 5 * HOUR)).toBe(false);
    expect(() => doAction(done, 'aanmoedigen', morning + 5 * HOUR)).toThrow();
    expect(todaysAction(done, morning + HOUR)?.actionId).toBe('voeren');
    // Donderdag 00:30 is een nieuwe dag.
    expect(canDoAction(done, START + 15 * HOUR + 30 * MINUTE)).toBe(true);
  });

  it('voeren maakt Gerard iets sneller, maar verandert niets aan het verleden', () => {
    const fed = doAction(race, 'voeren', morning);
    expect(racerMovement(fed, 'gerard', morning).km).toBe(racerMovement(race, 'gerard', morning).km);
    expect(racerMovement(fed, 'gerard', morning + 12 * HOUR).km).toBeGreaterThanOrEqual(
      racerMovement(race, 'gerard', morning + 12 * HOUR).km,
    );
    // Het eventschema blijft hetzelfde.
    expect(fed.events).toEqual(race.events);
  });

  it('een hoed blijft de rest van de race op', () => {
    const hat = doAction(race, 'hoed', morning);
    expect(hasHat(hat, morning - 1)).toBe(false);
    expect(hasHat(hat, race.endTime)).toBe(true);
  });

  it('kan niet meer na het einde van de race', () => {
    expect(canDoAction(race, race.endTime + HOUR)).toBe(false);
  });
});

describe('journaal', () => {
  const race = makeRace(12);

  it('toont alleen wat al gebeurd is, nieuwste bovenaan', () => {
    const now = START + 3 * DAY + 5 * HOUR;
    const j = journalAt(race, now);
    expect(j.at(-1)!.kind).toBe('start');
    for (const e of j) {
      expect(e.time).toBeLessThanOrEqual(now);
      expect(e.text.length).toBeGreaterThan(5);
    }
    for (let i = 1; i < j.length; i++) expect(j[i].time).toBeLessThanOrEqual(j[i - 1].time);
  });

  it('is leeg voor de start en heeft een slotregel na het einde', () => {
    expect(journalAt(race, START - HOUR)).toEqual([]);
    expect(journalAt(race, race.endTime)[0].kind).toBe('end');
  });

  it('meldt geen events meer van een racer na zijn finish', () => {
    const j = journalAt(race, race.endTime);
    for (const s of finalStandings(race).filter((x) => x.finishTime !== null)) {
      const late = j.filter((e) => e.kind === 'event' && e.racerId === s.racerId && e.time >= s.finishTime!);
      expect(late).toEqual([]);
      expect(j.some((e) => e.kind === 'finish' && e.racerId === s.racerId)).toBe(true);
    }
  });

  it('geeft een status voor "Gerard is momenteel…"', () => {
    expect(statusText(race, 'gerard', START + DAY).length).toBeGreaterThan(3);
    expect(activityAt(race, 'gerard', race.endTime)).toBe('raceOver');
  });
});

describe('tijd vooruitspoelen: een hele race van 7 dagen', () => {
  it('verloopt goed van start tot finish', () => {
    let race = makeRace(2026);
    let journalLength = 0;
    let previous = standingsAt(race, START);
    expect(previous.every((s) => s.km === 0)).toBe(true);

    // Elk uur 'opent de speler de app'; om 10:00 doet hij de actie,
    // en een open keuze-event beantwoordt hij met de eerste optie.
    for (let t = START; t <= race.endTime + DAY; t += HOUR) {
      const choice = openChoice(race, t);
      if (choice) race = decideChoice(race, choice.id, choice.choice.options[0].id, t);
      if (new Date(t).getHours() === 10 && canDoAction(race, t)) race = doAction(race, 'aanmoedigen', t);

      const standings = standingsAt(race, t);
      for (const s of standings) {
        const before = previous.find((p) => p.racerId === s.racerId)!;
        // Wie gefinisht is, blijft gefinisht op dezelfde tijd.
        if (before.finishTime !== null) expect(s.finishTime).toBe(before.finishTime);
      }
      previous = standings;

      const journal = journalAt(race, t);
      expect(journal.length).toBeGreaterThanOrEqual(journalLength);
      journalLength = journal.length;
    }

    const final = finalStandings(race);
    expect(final).toHaveLength(5);
    for (const s of final) if (s.finishTime !== null) expect(s.finishTime).toBeLessThanOrEqual(race.endTime);
    expect(race.actions.length).toBeGreaterThanOrEqual(6);
    expect(race.decisions.length).toBe(race.choices.length);
    expect(finishStats(race).length).toBeGreaterThanOrEqual(2);
  });

  it('openen of niet openen maakt niet uit: de stand is hetzelfde', () => {
    const race = makeRace(77);
    const t = START + 4 * DAY + 7 * HOUR;
    // Eerst heel vaak 'kijken', dan één keer: geen verschil.
    for (let x = START; x < t; x += 17 * MINUTE) standingsAt(race, x);
    expect(standingsAt(race, t)).toEqual(standingsAt(makeRace(77), t));
  });
});
