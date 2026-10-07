// Toeval met een seed (startgetal): dezelfde seed geeft altijd dezelfde
// reeks getallen. Zo is een race altijd hetzelfde, hoe vaak je hem ook
// opnieuw berekent.

export interface Rng {
  /** Getal van 0 (inclusief) tot 1 (exclusief). */
  next(): number;
  /** Kommagetal tussen min en max. */
  range(min: number, max: number): number;
  /** Geheel getal van min tot en met max. */
  int(min: number, max: number): number;
  /** Kans: true met waarschijnlijkheid p. */
  chance(p: number): boolean;
  pick<T>(list: readonly T[]): T;
  /** Kies een item; hoe hoger het gewicht, hoe vaker. */
  weighted<T>(items: readonly { item: T; weight: number }[]): T;
}

/** Mulberry32: klein, snel en goed genoeg voor een spel. */
export function createRng(seed: number): Rng {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const rng: Rng = {
    next,
    range: (min, max) => min + next() * (max - min),
    int: (min, max) => min + Math.floor(next() * (max - min + 1)),
    chance: (p) => next() < p,
    pick: (list) => list[Math.floor(next() * list.length)],
    weighted: (items) => {
      const total = items.reduce((s, i) => s + Math.max(0, i.weight), 0);
      let r = next() * total;
      for (const i of items) {
        r -= Math.max(0, i.weight);
        if (r < 0) return i.item;
      }
      return items[items.length - 1].item;
    },
  };
  return rng;
}

/**
 * Maak een eigen seed voor een onderdeel (bijv. per racer), zodat een
 * extra racer of extra regen de rest van de race niet verandert.
 */
export function deriveSeed(seed: number, label: string): number {
  let h = (seed ^ 0x9e3779b9) >>> 0;
  for (let i = 0; i < label.length; i++) {
    h = Math.imul(h ^ label.charCodeAt(i), 0x85ebca6b) >>> 0;
    h = (h ^ (h >>> 13)) >>> 0;
  }
  return Math.imul(h ^ (h >>> 16), 0xc2b2ae35) >>> 0;
}

/** Een nieuwe willekeurige seed voor een nieuwe race. */
export function randomSeed(): number {
  return Math.floor(Math.random() * 2 ** 32) >>> 0;
}
