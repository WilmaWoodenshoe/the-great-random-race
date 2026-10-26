// De stand per spelletje en per racer, alleen op deze telefoon (eigen sleutel,
// los van de race-opslag). Wordt niet naar de server gestuurd.

const KEY = 'grr-picknick';

export interface Tally {
  player: number;
  racer: number;
  draw: number;
}

interface Stored {
  tallies: Record<string, Record<string, Tally>>;
  /** Hoe vaak Steve achter elkaar steen koos (steen-papier-schaar). */
  steveStreak: number;
}

function load(): Stored {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    if (raw && typeof raw === 'object' && raw.tallies) return { tallies: raw.tallies, steveStreak: Number(raw.steveStreak) || 0 };
  } catch {
    // Geen opslag of kapotte gegevens: opnieuw beginnen.
  }
  return { tallies: {}, steveStreak: 0 };
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
