// Met welke racer speel je op het Picknickkleed? Standaard je eigen racer uit
// je huidige race (zonder race: Gerard). Een andere keuze staat in het adres (?racer=…).
import { useSearchParams } from 'react-router-dom';
import { racers } from '../content';
import { useGame } from '../state/GameProvider';

export function usePicknickRacer() {
  const [params] = useSearchParams();
  const { race } = useGame();
  const chosen = params.get('racer');
  const fallback = race?.playerId ?? 'gerard';
  const racer = racers.find((r) => r.id === chosen) ?? racers.find((r) => r.id === fallback) ?? racers.find((r) => r.id === 'gerard')!;
  return racer;
}
