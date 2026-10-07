/** Kilometers in Nederlandse notatie: 38.7 → "38,7 km". */
export function formatKm(km: number): string {
  return `${km.toLocaleString('nl-NL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} km`;
}

/** Duur in dagen en uren: 166 uur → "6 d 22 u". */
export function formatDaysHours(totalHours: number): string {
  const d = Math.floor(totalHours / 24);
  const h = Math.round(totalHours % 24);
  return `${d} d ${h} u`;
}

/** Eigenschap 0–100 omzetten naar 0–8 blokjes (zoals in het ontwerp). */
export function traitToBlocks(value: number, blocks = 8): number {
  const clamped = Math.min(100, Math.max(0, value));
  return Math.max(clamped > 0 ? 1 : 0, Math.round((clamped / 100) * blocks));
}
