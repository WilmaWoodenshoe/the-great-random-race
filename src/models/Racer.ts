/** De vier karaktereigenschappen, elk van 0 tot 100 (briefing hoofdstuk 7–8). */
export interface Traits {
  curious: number;
  stubborn: number;
  chaotic: number;
  lazy: number;
}

/** Een plek op de racer (zie Racer.wear): punt en breedte in procenten, schuine stand in graden. */
export interface WearAnchor {
  x: number;
  y: number;
  w: number;
  angle?: number;
}

/** Waar een accessoire op de afbeelding komt (uitgerekend), in procenten. */
export interface WearSpot {
  left: number;
  top: number;
  width: number;
  rotate?: number;
  /** Draaipunt, bijv. '50% 85%'. */
  origin?: string;
}

/** Een racer zoals hij in src/content/racers/ staat. */
export interface Racer {
  /** Korte, unieke code zonder spaties, bijv. 'gerard'. */
  id: string;
  name: string;
  /** Soort dier of ding, bijv. 'Slak'. */
  species: string;
  /** Snelheid ten opzichte van Gerard (Gerard = 1,00). */
  speed: number;
  traits: Traits;
  /** Engelse bijnaam, bijv. 'The Determined'. */
  title: string;
  /** Korte zin bij 'Kies je racer', bijv. 'Langzaam, maar met overtuiging.' */
  tagline?: string;
  /** Afbeelding, relatief aan public/images/. */
  image: string;
  /** Voornaamwoord in de teksten: 'hij' (standaard) of 'zij'. */
  pronoun?: 'hij' | 'zij';
  /** De racer die als eerste geselecteerd staat bij 'Kies je racer'. */
  playable?: boolean;
  /**
   * Waar accessoires zitten (Collectie), in procenten van de afbeelding:
   * het punt boven op het hoofd (bij Gerard: op het huisje), het midden
   * tussen de ogen en de nek, met de breedte (van het hoofd, van de ogen
   * van buitenkant tot buitenkant, van de nek) en een eventuele schuine
   * stand in graden. `aspect` is breedte ÷ hoogte van de afbeelding.
   * Zonder dit kan deze racer niets dragen.
   */
  wear?: {
    aspect: number;
    head: WearAnchor;
    eyes: WearAnchor;
    neck: WearAnchor;
  };
  /**
   * Getekende plaatjes van de racer mét een accessoire (accessoire-id →
   * plaatje en plek in procenten van de gewone afbeelding). Die zien er
   * mooier uit dan een accessoire dat erop gelegd wordt.
   */
  wornImages?: Partial<Record<string, { image: string; left: number; top: number; width: number }>>;
  /** Weetjes voor het racerprofiel (optioneel). */
  facts?: {
    favoriteFood?: string;
    dislikes?: string;
    favoriteActivity?: string;
    secretTalent?: string;
  };
}
