import type { Traits } from './Racer';

/** Kleur van een keuzeknop, uit de huisstijl. */
export type ChoiceColor = 'groen' | 'blauw' | 'oranje';

/** Een tijdelijk effect op de snelheid van de racer van de speler. */
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
   * Bij welke eigenschappen de racer deze optie zelf vaker kiest, als de
   * speler binnen 12 uur niets kiest. Bijv. ['curious'].
   */
  prefers?: (keyof Traits)[];
}

/** Een keuze-event zoals het in src/content/choices/ staat. */
export interface Choice {
  id: string;
  /**
   * Gaat dit event over een andere racer (bijv. 'kevin')? Dan komt het
   * alleen voor als die racer meedoet en niet de racer van de speler is.
   */
  aboutRacer?: string;
  /** Grote kop bovenaan de pop-up. */
  heading: string;
  title: string;
  text: string;
  /** Journaalregel op het moment dat de racer het vindt. */
  announce: string;
  /** Afbeelding, relatief aan public/images/. */
  image: string;
  /** Andere afbeelding per route (route-id → afbeelding), bijv. het uitzicht. */
  imageByCourse?: Record<string, string>;
  imageAlt: string;
  options: ChoiceOption[];
}
