import type { Traits } from './Racer';

/** Kleur van een keuzeknop, uit de huisstijl. */
export type ChoiceColor = 'groen' | 'blauw' | 'oranje';

/** Een tijdelijk effect op Gerards snelheid. */
export interface SpeedEffect {
  /** Hoe lang het effect duurt, in minuten. */
  minutes: number;
  /** Vermenigvuldiging van de snelheid (0 = stilstaan, 1,15 = 15% sneller). */
  speed: number;
}

export interface ChoiceOption {
  id: string;
  /** Tekst op de knop. */
  label: string;
  color: ChoiceColor;
  /** Effecten na elkaar, vanaf het moment van kiezen. Leeg = geen effect. */
  effects: SpeedEffect[];
  /** Journaalteksten; de app kiest er willekeurig één. */
  journal: string[];
  /**
   * Bij welke eigenschappen Gerard deze optie zelf vaker kiest, als de
   * speler binnen 12 uur niets kiest. Bijv. ['curious'].
   */
  prefers?: (keyof Traits)[];
}

/** Een keuze-event zoals het in src/content/choices/ staat. */
export interface Choice {
  id: string;
  /** Grote kop bovenaan de pop-up. */
  heading: string;
  title: string;
  text: string;
  /** Journaalregel op het moment dat Gerard het vindt. */
  announce: string;
  /** Afbeelding, relatief aan public/images/. */
  image: string;
  imageAlt: string;
  options: ChoiceOption[];
}
