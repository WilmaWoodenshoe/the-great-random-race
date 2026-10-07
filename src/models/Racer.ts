/** De vier karaktereigenschappen, elk van 0 tot 100 (briefing hoofdstuk 7–8). */
export interface Traits {
  curious: number;
  stubborn: number;
  chaotic: number;
  lazy: number;
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
  /** Engelse bijnaam, bijv. 'The Unreasonably Slow'. */
  title: string;
  /** Afbeelding, relatief aan public/images/. */
  image: string;
  /** True voor de racer van de speler. In v0.1 alleen Gerard. */
  playable?: boolean;
  /** Weetjes voor het racerprofiel (optioneel). */
  facts?: {
    favoriteFood?: string;
    dislikes?: string;
    favoriteActivity?: string;
    secretTalent?: string;
  };
}
