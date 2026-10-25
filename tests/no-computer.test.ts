import { describe, expect, it } from 'vitest';
import { buildRace, contentSnapshot } from '../src/account/buildRace';
import type { RaceDetail } from '../src/account/api';
import { finalStandings, standingsAt } from '../src/game/engine';
import { journalAt } from '../src/game/journal';
import { placeRacers } from '../src/game/mapPosition';
import { finishStats } from '../src/game/stats';
import { activityAt, statusText } from '../src/game/status';
import { DAY, HOUR } from '../src/utils/dates';
import { START } from './helpers';

function detail(racerIds: string[], computerFill: boolean): RaceDetail {
  return {
    id: 3,
    name: 'Bunny Kingdom',
    courseId: 'kasteelrace',
    days: 7,
    startTime: START,
    endTime: START + 7 * DAY,
    status: 'running',
    createdBy: 'Wilma',
    computerFill,
    participants: racerIds.map((racerId, i) => ({ racerId, nickname: `Speler ${i + 1}`, userId: i + 1, joinedAt: i })),
    seed: 777,
    snapshot: JSON.parse(JSON.stringify(contentSnapshot('kasteelrace'))),
    moves: [],
    now: START + DAY,
  };
}

describe('race zonder computerracers', () => {
  it('alleen de spelers doen mee', () => {
    expect(buildRace(detail(['charles', 'isabelle'], false), 1).racers.map((r) => r.id)).toEqual(['charles', 'isabelle']);
    expect(buildRace(detail(['charles', 'isabelle'], true), 1).racers).toHaveLength(6);
  });

  for (const ids of [['charles'], ['charles', 'isabelle']]) {
    it(`loopt de hele race zonder fouten met ${ids.length} racer(s)`, () => {
      const race = buildRace(detail(ids, false), 1);
      for (let t = START; t <= race.endTime + DAY; t += 3 * HOUR) {
        const s = standingsAt(race, t);
        expect(s).toHaveLength(ids.length);
        placeRacers(race.course, s);
        for (const id of ids) {
          activityAt(race, id, t);
          expect(statusText(race, id, t)).not.toMatch(/undefined|\{/);
        }
        for (const e of journalAt(race, t)) expect(e.text).not.toMatch(/undefined|\{/);
      }
      expect(finalStandings(race)).toHaveLength(ids.length);
      finishStats(race);
    });
  }
});
