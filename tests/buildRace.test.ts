import { describe, expect, it } from 'vitest';
import { buildRace, contentSnapshot } from '../src/account/buildRace';
import type { RaceDetail } from '../src/account/api';
import { standingsAt } from '../src/game/engine';
import { journalAt } from '../src/game/journal';
import { DAY, HOUR } from '../src/utils/dates';
import { START } from './helpers';

function detail(moves: RaceDetail['moves'] = []): RaceDetail {
  return {
    id: 12,
    name: 'De Slakkenbeker',
    courseId: 'grote-bosrace',
    days: 14,
    startTime: START,
    endTime: START + 14 * DAY,
    status: 'running',
    createdBy: 'Wilma',
    participants: [
      { racerId: 'isabelle', nickname: 'Wilma', userId: 1, joinedAt: 1 },
      { racerId: 'philippe', nickname: 'Piet', userId: 2, joinedAt: 2 },
    ],
    seed: 4242,
    snapshot: JSON.parse(JSON.stringify(contentSnapshot())),
    moves,
    now: START + DAY,
  };
}

describe('gedeelde race narekenen', () => {
  it('geeft elke speler zijn eigen racer, in dezelfde race', () => {
    const wilma = buildRace(detail(), 1);
    const piet = buildRace(detail(), 2);
    expect(wilma.playerId).toBe('isabelle');
    expect(piet.playerId).toBe('philippe');
    expect(wilma.racers).toHaveLength(6);
    expect(wilma.racers.map((r) => r.id).sort()).toEqual(piet.racers.map((r) => r.id).sort());
    const at = START + 5 * DAY;
    const km = (r: typeof wilma) => Object.fromEntries(standingsAt(r, at).map((s) => [s.racerId, s.km]));
    expect(km(wilma)).toEqual(km(piet));
    expect(wilma.owners).toEqual({ isabelle: 'Wilma', philippe: 'Piet' });
    expect(wilma.endTime - wilma.startTime).toBe(14 * DAY);
    expect(wilma.number).toBe(12);
  });

  it('zetten van anderen tellen mee; wat niet kon, telt niet', () => {
    const base = buildRace(detail(), 1);
    const sc = base.choices.find((c) => c.racerId === 'philippe')!;
    const race = buildRace(
      detail([
        { racerId: 'philippe', kind: 'action', key: '', value: 'hoed', time: START + HOUR },
        { racerId: 'philippe', kind: 'action', key: '', value: 'voeren', time: START + 2 * HOUR }, // tweede op dezelfde dag
        { racerId: 'philippe', kind: 'decision', key: sc.id, value: sc.choice.options[0].id, time: sc.time + HOUR },
        { racerId: 'philippe', kind: 'decision', key: 'bestaat-niet', value: 'x', time: START + HOUR },
      ]),
      1,
    );
    expect(race.actions.map((a) => a.actionId)).toEqual(['hoed']);
    expect(race.decisions).toHaveLength(1);
    const texts = journalAt(race, sc.time + 2 * HOUR).map((e) => e.text);
    expect(texts.some((t) => t.includes('Philippe draagt nu een hoed') || (t.includes('Philippe') && t.includes('hoed')))).toBe(true);
  });

  it('een toeschouwer zonder racer ziet de race vanuit de eerste speler', () => {
    expect(buildRace(detail(), null).playerId).toBe('isabelle');
  });
});

describe('lopende race krijgt de nieuwste kaart', () => {
  it('oude kaart in de opgeslagen race: toch de kaart en achtergrond van nu', () => {
    const d = detail();
    d.snapshot.course = {
      ...d.snapshot.course,
      map: { ...d.snapshot.course.map, image: 'courses/grote-bosrace-kaart.webp', width: 1024, height: 1536 },
      background: 'backgrounds/bg-landschap.webp',
      backgroundTall: undefined,
    };
    const race = buildRace(d, 1);
    expect(race.course.map.image).toBe('courses/grote-bosrace-kaart-staand.webp');
    expect(race.course.map.height).toBe(1843);
    expect(race.course.backgroundTall).toBe('backgrounds/bg-bos-staand.webp');
  });
});
