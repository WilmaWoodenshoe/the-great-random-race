// Oudere opgeslagen races aanvullen met onderdelen die later aan de inhoud
// zijn toegevoegd (bijv. het pad op de kaart in fase 5). Alleen uiterlijk
// en teksten worden aangevuld; snelheden en eigenschappen blijven zoals ze
// waren, zodat de uitslag van een lopende race niet verandert.

import { choices as allChoices, courses as allCourses, racers as allRacers } from '../content';
import type { Race } from '../models/Race';

export function upgradeRace(race: Race): Race {
  const course = allCourses.find((c) => c.id === race.course.id);
  // De kaart (afbeelding, bordjes, pad) is uiterlijk: altijd die van nu.
  // Afstanden en terrein blijven die van de race zelf.
  const upgradedCourse = course
    ? {
        ...race.course,
        map: course.map,
        segments: race.course.segments.map((s) => {
          const now = course.segments.find((x) => x.id === s.id);
          if (!now) return s;
          return { ...s, withArticle: now.withArticle, sign: now.sign, path: now.path };
        }),
      }
    : race.course;

  const racers = race.racers.map((r) => {
    const now = allRacers.find((x) => x.id === r.id);
    if (!now) return r;
    // Uiterlijk en teksten van nu; snelheid en eigenschappen van toen.
    return {
      ...r,
      name: now.name,
      title: now.title,
      tagline: now.tagline,
      pronoun: now.pronoun,
      image: now.image,
      facts: now.facts,
      hatSpot: now.hatSpot,
    };
  });

  // Teksten van keuze-events zijn ook uiterlijk; de effecten blijven die van toen.
  const choices = race.choices.map((sc) => {
    const now = allChoices.find((c) => c.id === sc.choice.id);
    if (!now) return sc;
    const options = sc.choice.options.map((o) => {
      const nowOption = now.options.find((x) => x.id === o.id);
      return nowOption ? { ...o, label: nowOption.label, journal: nowOption.journal } : o;
    });
    const { heading, title, text, announce, image, imageAlt } = now;
    return { ...sc, choice: { ...sc.choice, heading, title, text, announce, image, imageAlt, options } };
  });

  return { ...race, course: upgradedCourse, racers, choices };
}
