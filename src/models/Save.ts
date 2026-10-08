import type { Race } from './Race';

/** Uitslag van een afgelopen race, voor het racerprofiel (races, overwinningen, beste positie). */
export interface RaceResult {
  raceId: string;
  number: number;
  courseId: string;
  endTime: number;
  position: number;
  km: number;
  finishTime: number | null;
}

/** Alles wat de app op het toestel bewaart. */
export interface SaveData {
  /** Versie van de opslag, voor als de vorm later verandert. */
  version: 1;
  /** De huidige (of laatst afgelopen) race. */
  race: Race | null;
  /** Uitslagen van eerdere races. */
  history: RaceResult[];
  /** Hoeveel races er ooit gestart zijn (voor het racenummer). */
  raceCounter: number;
  /**
   * Alleen voor de testversie: zoveel milliseconden loopt de klok van de
   * app voor op de echte tijd ("tijd vooruitspoelen").
   */
  clockOffset: number;
  /** Tot welk moment de speler het journaal al gezien heeft (voor 'nieuw'). */
  journalSeenAt: number;
  /** Van welke race de speler de uitslag al gezien heeft. */
  finishSeenRaceId: string | null;
}

export const EMPTY_SAVE: SaveData = { version: 1, race: null, history: [], raceCounter: 0, clockOffset: 0, journalSeenAt: 0, finishSeenRaceId: null };
