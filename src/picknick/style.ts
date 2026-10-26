// Hoe een racer speelt, uitgerekend uit zijn vier eigenschappen (0–100).
// Een hogere waarde = een grotere kans op dat gedrag, per beurt.
import type { Traits } from '../models/Racer';

export interface PlayStyle {
  /** Kans per beurt op een dutje of overslaan (lui). */
  nap: number;
  /** Kans per beurt op afgeleid zijn: een willekeurige zet (nieuwsgierig). */
  distracted: number;
  /** Kans per beurt op iets onvoorspelbaars (chaotisch). */
  chaos: number;
  /** Kans op steeds hetzelfde doen (koppig). */
  stubborn: number;
  /** Doet nooit iets (Steve): helemaal lui én helemaal koppig. */
  doesNothing: boolean;
}

// Ook een racer zonder afleiding maakt soms een foutje, zodat je van iedereen kunt winnen.
const MIN_SLIP = 0.12;

export function playStyle(t: Traits): PlayStyle {
  return {
    nap: (t.lazy / 100) * 0.18,
    distracted: Math.max(MIN_SLIP, (t.curious / 100) * 0.35),
    chaos: (t.chaotic / 100) * 0.3,
    stubborn: t.stubborn / 100,
    doesNothing: t.lazy >= 100 && t.stubborn >= 100,
  };
}

/** De sterkste eigenschap (voor algemene opmerkingen als een racer geen eigen tekst heeft). */
export function strongestTrait(t: Traits): keyof Traits {
  return (Object.keys(t) as (keyof Traits)[]).reduce((best, k) => (t[k] > t[best] ? k : best), 'curious');
}
