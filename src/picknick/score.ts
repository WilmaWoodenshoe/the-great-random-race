// De stand per spelletje en per racer, alleen op deze telefoon (eigen sleutel,
// los van de race-opslag). Wordt niet naar de server gestuurd.

const KEY = 'grr-picknick';

export interface Tally {
  player: number;
  racer: number;
  draw: number;
}

/** Bij spelletjes waarin de racer helpt: hoe vaak gespeeld en het beste resultaat (minste beurten). */
export interface Played {
  count: number;
  best?: number;
}

interface Stored {
  tallies: Record<string, Record<string, Tally>>;
  played?: Record<string, Record<string, Played>>;
  /** Hoe vaak Steve achter elkaar steen koos (steen-papier-schaar). */
  steveStreak: number;
}

function load(): Stored {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    if (raw && typeof raw === 'object' && raw.tallies)
      return { tallies: raw.tallies, played: raw.played ?? {}, steveStreak: Number(raw.steveStreak) || 0 };
  } catch {
    // Geen opslag of kapotte gegevens: opnieuw beginnen.
  }
  return { tallies: {}, played: {}, steveStreak: 0 };
}

function store(data: Stored) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // Geen opslag (privévenster): de stand geldt dan alleen nu.
  }
}

export function tally(gameId: string, racerId: string): Tally {
  return load().tallies[gameId]?.[racerId] ?? { player: 0, racer: 0, draw: 0 };
}

export function recordResult(gameId: string, racerId: string, result: 'player' | 'racer' | 'draw'): Tally {
  const data = load();
  const t = { ...tally(gameId, racerId) };
  t[result] += 1;
  data.tallies[gameId] = { ...data.tallies[gameId], [racerId]: t };
  store(data);
  return t;
}

/** Steve koos weer steen: hoe vaak nu achter elkaar? */
export function bumpSteveStreak(): number {
  const data = load();
  data.steveStreak += 1;
  store(data);
  return data.steveStreak;
}

export function played(gameId: string, racerId: string): Played {
  return load().played?.[gameId]?.[racerId] ?? { count: 0 };
}

/** Een potje uitgespeeld; `result` (bijv. aantal beurten) telt als record als het lager is. */
export function recordPlayed(gameId: string, racerId: string, result?: number): Played {
  const data = load();
  const now = played(gameId, racerId);
  const next: Played = {
    count: now.count + 1,
    best: result === undefined ? now.best : now.best === undefined ? result : Math.min(now.best, result),
  };
  data.played = { ...data.played, [gameId]: { ...data.played?.[gameId], [racerId]: next } };
  store(data);
  return next;
}
