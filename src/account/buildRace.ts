// Een gedeelde race op de telefoon narekenen uit wat de server bewaart.
// Elke telefoon krijgt zo precies dezelfde race: zelfde seed, zelfde
// racers, route en keuze-events (uit de 'snapshot' van het aanmaken).

import { choices as allChoices, getCourse, racers as allRacers } from '../content';
import { createRace, decideChoice, doAction } from '../game/engine';
import { fillLineup } from '../game/session';
import type { ActionId, Race } from '../models/Race';
import { upgradeRace } from '../storage/upgrade';
import type { RaceDetail, RaceSnapshot } from './api';

/** Wat er bij het aanmaken van een race wordt vastgelegd. */
export function contentSnapshot(courseId = 'grote-bosrace'): RaceSnapshot {
  return { course: getCourse(courseId), racers: allRacers, choices: allChoices };
}

export function buildRace(detail: RaceDetail, viewerUserId: number | null): Race {
  const { snapshot, participants } = detail;
  const humans = participants.map((p) => p.racerId);
  const viewer = participants.find((p) => p.userId !== null && p.userId === viewerUserId)?.racerId ?? humans[0];
  let race = createRace({
    now: detail.startTime,
    seed: detail.seed,
    number: detail.id,
    course: { ...snapshot.course, days: detail.days },
    racers: fillLineup(humans, detail.seed, snapshot.racers),
    choices: snapshot.choices,
    playerId: viewer,
    humanIds: humans,
  });
  race = {
    ...race,
    id: `gedeeld-${detail.id}`,
    serverId: detail.id,
    owners: Object.fromEntries(participants.filter((p) => p.nickname).map((p) => [p.racerId, p.nickname])),
  };
  // Keuzes en acties van alle spelers, in volgorde. Wat niet (meer) kon, telt niet.
  for (const m of detail.moves) {
    try {
      race =
        m.kind === 'decision'
          ? decideChoice(race, m.key, m.value, m.time, m.racerId)
          : doAction(race, m.value as ActionId, m.time, m.racerId);
    } catch {
      // Bijv. een keuze na de deadline: de racer koos al zelf.
    }
  }
  return upgradeRace(race);
}
