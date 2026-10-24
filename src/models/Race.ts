import type { Choice } from './Choice';
import type { Course } from './Course';
import type { RaceEvent } from './Event';
import type { Racer } from './Racer';

/** Keuze-event dat op een vast moment aan de racer van de speler wordt voorgelegd. */
export interface ScheduledChoice {
  id: string;
  /** Voor welke racer (ontbreekt in oude races: de racer van de speler). */
  racerId?: string;
  /** Kopie van het keuze-event zoals het was bij het aanmaken van de race. */
  choice: Choice;
  time: number;
  /** Tot dit moment mag de speler kiezen (12 uur na `time`). */
  deadline: number;
  /** Wat de racer zelf kiest als de speler niets doet (vooraf berekend). */
  autoOptionId: string;
  /** Welke journaaltekst bij de gekozen optie hoort. */
  variant: number;
}

/** Een keuze die de speler heeft gemaakt. */
export interface Decision {
  /** Wie koos (ontbreekt in oude races: de racer van de speler). */
  racerId?: string;
  scheduledId: string;
  optionId: string;
  time: number;
}

export type ActionId = 'voeren' | 'aanmoedigen' | 'hoed' | 'niets';

/** De dagelijkse actie die de speler heeft gedaan. */
export interface ActionRecord {
  /** Voor welke racer (ontbreekt in oude races: de racer van de speler). */
  racerId?: string;
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
  /** De racer van wie deze telefoon is (in een gedeelde race: van de kijker). */
  playerId: string;
  /** Racers die door mensen bestuurd worden (gedeelde race). Standaard alleen `playerId`. */
  humans?: string[];
  /** Bijnaam van de speler per racer (gedeelde race). */
  owners?: Record<string, string>;
  /** Nummer van de race op de server (alleen bij een gedeelde race). */
  serverId?: number;
  course: Course;
  racers: Racer[];
  events: RaceEvent[];
  choices: ScheduledChoice[];
  decisions: Decision[];
  actions: ActionRecord[];
}
