import type { Choice } from './Choice';
import type { Course } from './Course';
import type { RaceEvent } from './Event';
import type { Racer } from './Racer';

/** Keuze-event dat op een vast moment aan Gerard wordt voorgelegd. */
export interface ScheduledChoice {
  id: string;
  /** Kopie van het keuze-event zoals het was bij het aanmaken van de race. */
  choice: Choice;
  time: number;
  /** Tot dit moment mag de speler kiezen (12 uur na `time`). */
  deadline: number;
  /** Wat Gerard zelf kiest als de speler niets doet (vooraf berekend). */
  autoOptionId: string;
  /** Welke journaaltekst bij de gekozen optie hoort. */
  variant: number;
}

/** Een keuze die de speler heeft gemaakt. */
export interface Decision {
  scheduledId: string;
  optionId: string;
  time: number;
}

export type ActionId = 'voeren' | 'aanmoedigen' | 'hoed' | 'niets';

/** De dagelijkse actie die de speler heeft gedaan. */
export interface ActionRecord {
  actionId: ActionId;
  time: number;
  /** Lokale kalenderdag, bijv. "2026-10-08". Maximaal één actie per dag. */
  day: string;
  variant: number;
}

/**
 * Een race. Bevat kopieën van de racers, de route en de keuze-events, zodat
 * nieuwe of gewijzigde inhoud een lopende race niet beïnvloedt.
 */
export interface Race {
  /** Versie van de opslag, voor als de vorm later verandert. */
  version: 1;
  id: string;
  number: number;
  seed: number;
  startTime: number;
  endTime: number;
  playerId: string;
  course: Course;
  racers: Racer[];
  events: RaceEvent[];
  choices: ScheduledChoice[];
  decisions: Decision[];
  actions: ActionRecord[];
}
