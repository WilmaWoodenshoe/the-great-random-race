export type AccessoryKind = 'hoed' | 'ogen' | 'rugzak' | 'speciaal';

/** Waar een accessoire zit: op het hoofd, voor de ogen of om de nek. */
export type AccessorySlot = 'hoofd' | 'ogen' | 'nek';

/**
 * Hoe je een accessoire verdient (Collectie). Alles wordt uitgerekend uit
 * je uitslagen en hoe vaak je de app opende; er wordt niets apart bewaard.
 */
export type Unlock =
  | { type: 'start' } // heb je meteen
  | { type: 'raceStarted' } // eerste race begonnen
  | { type: 'finished'; count: number } // zoveel races uitgereden
  | { type: 'podium' } // een keer bij de eerste drie
  | { type: 'win' } // een race gewonnen
  | { type: 'races'; count: number } // aan zoveel races meegedaan (afgelopen)
  | { type: 'daysOpened'; count: number } // de app op zoveel verschillende dagen geopend
  | { type: 'longRace'; days: number }; // een race van zoveel dagen uitgespeeld

/** Een accessoire zoals het in src/content/accessories/ staat. */
export interface Accessory {
  id: string;
  name: string;
  /** Naam in een zin, bijv. 'de pet' of 'het petje'. */
  withArticle: string;
  kind: AccessoryKind;
  slot: AccessorySlot;
  /** Afbeelding, relatief aan public/images/. */
  image: string;
  /**
   * Hoe het accessoire op een racer past: het punt in de eigen afbeelding
   * (procenten) dat op de plek van de racer komt (bijv. midden onder de
   * hoed, of de brug van de bril), hoe breed het is ten opzichte van die
   * plek (1 = even breed als het hoofd) en breedte ÷ hoogte van de afbeelding.
   */
  fit: { x: number; y: number; size: number; aspect: number };
  /** Grappig zinnetje in de Collectie. */
  tagline: string;
  unlock: Unlock;
}
