// Tijd rekenen we in milliseconden (zoals Date.now()).

export const MINUTE = 60_000;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;

/** Kalenderdag in lokale tijd, bijv. "2026-10-08" (hoofdstuk 6: lokale tijd). */
export function localDateKey(time: number): string {
  const d = new Date(time);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Kloktijd in lokale tijd, bijv. "08:14". */
export function formatClock(time: number): string {
  const d = new Date(time);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/** Duur in uren en minuten, bijv. "4 uur en 12 minuten". */
export function formatDuration(ms: number): string {
  const totalMin = Math.round(ms / MINUTE);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  const uur = h === 1 ? '1 uur' : `${h} uur`;
  const min = m === 1 ? '1 minuut' : `${m} minuten`;
  if (h === 0) return min;
  if (m === 0) return uur;
  return `${uur} en ${min}`;
}
