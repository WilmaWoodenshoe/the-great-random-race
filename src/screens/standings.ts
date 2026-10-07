import { racers } from '../content';
import { demoRace } from '../demo/voorbeeld';

/** Tussenstand op basis van de voorbeeldgegevens (wordt in fase 2 de engine). */
export function standings() {
  return racers
    .map((racer) => ({ racer, km: demoRace.distances[racer.id] ?? 0 }))
    .sort((a, b) => b.km - a.km);
}
