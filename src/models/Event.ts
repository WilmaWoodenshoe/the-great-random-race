/** De soorten gewone events (briefing hoofdstuk 11). */
export const EVENT_TYPES = [
  'flower',
  'rain',
  'food',
  'bird',
  'mud',
  'nap',
  'shortcut',
  'wrong_turn',
  'worm',
  'rock',
  'butterfly',
  'puddle',
  'snack',
  'strange_noise',
  'nothing',
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

/** Een periode waarin de snelheid van een racer met `speed` wordt vermenigvuldigd. */
export interface SpeedPhase {
  start: number;
  end: number;
  speed: number;
}

/**
 * Een vooraf berekend event. Alles ligt vast bij het aanmaken van de race:
 * tijdstip, duur en effect. `racerId` is null voor weer (regen), dat
 * iedereen tegelijk treft.
 */
export interface RaceEvent {
  id: string;
  type: EventType;
  racerId: string | null;
  time: number;
  /** Snelheidseffecten. Bij regen: per racer apart. */
  phases: SpeedPhase[];
  /** Alleen bij regen: effect per racer. */
  phasesByRacer?: Record<string, SpeedPhase[]>;
  /** Directe sprong vooruit (+) of terug (−), in km. */
  jumpKm?: number;
  /** Welke journaaltekst (index in de lijst met varianten). */
  variant: number;
  /** Andere tekstsoort dan het type, bijv. 'puddle_duck' of 'rock_family'. */
  textKey?: string;
}
