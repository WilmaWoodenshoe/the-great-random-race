// Oudere opgeslagen races aanvullen met onderdelen die later aan de inhoud
// zijn toegevoegd (bijv. het pad op de kaart in fase 5). Alleen uiterlijk
// en teksten worden aangevuld; snelheden en eigenschappen blijven zoals ze
// waren, zodat de uitslag van een lopende race niet verandert.

import { choices as allChoices, courses as allCourses, racers as allRacers } from '../content';
import type { Race } from '../models/Race';

export function upgradeRace(race: Race): Race {
  const course = allCourses.find((c) => c.id === race.course.id);
  const upgradedCourse = course
    ? {
        ...race.course,
        map: { ...course.map, ...race.course.map, finish: race.course.map?.finish ?? course.map.finish },
        segments: race.course.segments.map((s) => {
          const now = course.segments.find((x) => x.id === s.id);
          if (!now) return s;
          return {
            ...s,
            withArticle: s.withArticle ?? now.withArticle,
            sign: s.sign ?? now.sign,
            path: s.path?.length ? s.path : now.path,
          };
        }),
      }
    : race.course;

  const racers = race.racers.map((r) => {
    const now = allRacers.find((x) => x.id === r.id);
    if (!now) return r;
    // Uiterlijk en teksten van nu; snelheid en eigenschappen van toen.
    return { ...r, name: now.name, title: now.title, image: now.image, facts: now.facts, hatSpot: now.hatSpot };
  });

  const choices = race.choices.map((sc) => {
    const now = allChoices.find((c) => c.id === sc.choice.id);
    if (!now || sc.choice.announce) return sc;
    return { ...sc, choice: { ...sc.choice, announce: now.announce } };
  });

  return { ...race, course: upgradedCourse, racers, choices };
}
