// Het Picknickkleed: kleine spelletjes met de racers (alleen voor de lol).
import type { Traits } from './Racer';

/** Momenten waarop een racer iets zegt. */
export type PicknickMoment =
  // algemeen
  | 'start'
  | 'think'
  | 'playerWins'
  | 'racerWins'
  | 'draw'
  // boter-kaas-en-eieren
  | 'opening'
  | 'distracted'
  | 'nap'
  | 'pass'
  // steen-papier-schaar
  | 'hint'
  | 'playerRound'
  | 'racerRound'
  | 'tieRound'
  | 'streak'
  // memory
  | 'point'
  | 'pointKnown'
  | 'pointSame'
  | 'noTip'
  | 'match'
  | 'miss'
  | 'finished'
  // bekertje-schuiven
  | 'shuffle'
  | 'noShuffle'
  // mini-sudoku
  | 'tip'
  | 'tipDoubt'
  | 'checkGood'
  | 'checkBad';

/** Opmerkingen per moment. Invulplekken: {naam}, {hij}, {zijn}, {hem}, {aantal}. */
export type PicknickRemarks = Partial<Record<PicknickMoment, string[]>>;

/** Een spelletje zoals het in src/content/picknick/spellen/ staat. */
export interface PicknickGame {
  /** Korte code, ook in het adres: /picknick/<id>. */
  id: string;
  name: string;
  /** Uitleg van één regel op de tegel. */
  intro: string;
  /** Volgorde in het overzicht. */
  order: number;
  /** Tegenstander (stand Jij – racer) of helper (aantal keer gespeeld). */
  role: 'opponent' | 'helper';
  /** Plaatje op de tegel, relatief aan public/images/ (optioneel; anders een tijdelijk icoon). */
  image?: string;
  /** Algemene opmerkingen (voor elke racer), minstens 3 per moment. */
  remarks: PicknickRemarks;
  /** Algemene opmerkingen per sterkste eigenschap (terugval voor racers zonder eigen tekst). */
  traitRemarks?: Partial<Record<keyof Traits, PicknickRemarks>>;
}

/** De eigen opmerkingen van een racer, in src/content/picknick/racers/<racer-id>.ts. */
export interface PicknickRacer {
  /** Zelfde id als de racer in src/content/racers/. */
  id: string;
  /** Zo lang 'denkt' de racer na voor een zet (standaard 1 seconde). */
  thinkSeconds?: number;
  /** Per spelletje (id) de eigen opmerkingen. */
  remarks: Partial<Record<string, PicknickRemarks>>;
}
