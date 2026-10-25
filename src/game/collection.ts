// De Collectie: accessoires verdienen met prestaties en ze dragen.
// Alleen uiterlijk; ze veranderen niets aan de race. Wat verdiend is,
// volgt uit je uitslagen en hoe vaak je de app opende.

import { accessories as allAccessories } from '../content';
import type { Accessory, AccessorySlot, Unlock } from '../models/Accessory';
import type { Racer, WearSpot } from '../models/Racer';
import type { SaveData } from '../models/Save';
import type { Worn } from '../components/Gerard';
import { archiveIfFinished } from './session';

/** Zoveel dagen onthouden we (genoeg voor elke prestatie). */
export const MAX_OPENED_DAYS = 60;

/** Onthoud dat de app vandaag geopend is. */
export function markOpened(save: SaveData, day: string): SaveData {
  const days = save.openedDays ?? [];
  if (days.includes(day)) return save;
  return { ...save, openedDays: [...days, day].slice(-MAX_OPENED_DAYS) };
}

interface Progress {
  done: boolean;
  /** Hoe ver je bent, bijv. 2 van de 3. */
  have: number;
  need: number;
}

/** Hoe ver ben je met het verdienen van dit accessoire? */
export function progressOf(unlock: Unlock, save: SaveData, now: number): Progress {
  const history = archiveIfFinished(save, now).history;
  const count = (have: number, need: number): Progress => ({ done: have >= need, have: Math.min(have, need), need });
  switch (unlock.type) {
    case 'start':
      return count(1, 1);
    case 'raceStarted':
      return count(save.race || history.length ? 1 : 0, 1);
    case 'finished':
      return count(history.filter((h) => h.finishTime !== null).length, unlock.count);
    case 'podium':
      return count(history.some((h) => h.position <= 3) ? 1 : 0, 1);
    case 'win':
      return count(history.some((h) => h.position === 1) ? 1 : 0, 1);
    case 'races':
      return count(history.length, unlock.count);
    case 'daysOpened':
      return count((save.openedDays ?? []).length, unlock.count);
    case 'longRace':
      return count(history.some((h) => (h.days ?? 7) >= unlock.days) ? 1 : 0, 1);
  }
}

export function isUnlocked(acc: Accessory, save: SaveData, now: number): boolean {
  return progressOf(acc.unlock, save, now).done;
}

/** Verdiende accessoires die de speler nog niet gezien heeft. */
export function newlyUnlocked(save: SaveData, now: number, list: Accessory[] = allAccessories): Accessory[] {
  const seen = save.collectionSeen ?? [];
  return list.filter((a) => a.unlock.type !== 'start' && isUnlocked(a, save, now) && !seen.includes(a.id));
}

/** Wat de racer nu draagt (alleen wat ook echt verdiend is). */
export function worn(save: SaveData, now: number, list: Accessory[] = allAccessories): Accessory[] {
  return (Object.entries(save.wearing ?? {}) as [AccessorySlot, string][])
    .map(([, id]) => list.find((a) => a.id === id))
    .filter((a): a is Accessory => !!a && isUnlocked(a, save, now));
}

/** Iets aandoen (of met null die plek leeg maken). */
export function wear(save: SaveData, slot: AccessorySlot, id: string | null): SaveData {
  const wearing = { ...(save.wearing ?? {}) };
  if (id) wearing[slot] = id;
  else delete wearing[slot];
  return { ...save, wearing };
}

const SLOT_ORDER: AccessorySlot[] = ['nek', 'ogen', 'hoofd'];

/** Waar een accessoire op de afbeelding van deze racer komt. */
export function placeOn(racer: Racer, acc: Accessory): WearSpot | undefined {
  const wear = racer.wear;
  if (!wear) return undefined;
  const anchor = acc.slot === 'hoofd' ? wear.head : acc.slot === 'ogen' ? wear.eyes : wear.neck;
  const width = anchor.w * acc.fit.size;
  // Hoogte in procenten van de hoogte van de racerafbeelding.
  const height = (width * wear.aspect) / acc.fit.aspect;
  return {
    left: anchor.x - (acc.fit.x / 100) * width,
    top: anchor.y - (acc.fit.y / 100) * height,
    width,
    rotate: anchor.angle,
    origin: `${acc.fit.x}% ${acc.fit.y}%`,
  };
}

/** Wat er op de afbeelding van deze racer komt (nek, dan ogen, dan hoofd). */
export function wearOn(racer: Racer, items: Accessory[]): { items: Worn[]; aspect: number; base?: Worn } | undefined {
  if (!racer.wear) return undefined;
  const chosen = SLOT_ORDER.flatMap((slot) => {
    const acc = items.find((a) => a.slot === slot);
    return acc ? [acc] : [];
  });
  // Is er een getekend plaatje van de racer met een van deze accessoires?
  // Dan dat plaatje (hoofd gaat voor), en de rest erop leggen.
  const drawn = [...chosen].reverse().find((a) => racer.wornImages?.[a.id]);
  const variant = drawn && racer.wornImages![drawn.id]!;
  const placed = chosen
    .filter((a) => a !== drawn)
    .flatMap((acc) => {
      // Uitgeknipt uit een eigen tekening? Dan past het precies over het getekende plaatje.
      const cut = variant && racer.wornImages?.[acc.id];
      if (cut?.overlay) return [{ image: cut.overlay, alt: acc.name, spot: { left: cut.left, top: cut.top, width: cut.width } }];
      const spot = placeOn(racer, acc);
      return spot ? [{ image: acc.image, alt: acc.name, spot }] : [];
    });
  return {
    items: placed,
    aspect: racer.wear.aspect,
    base: variant
      ? { image: variant.image, alt: drawn!.name, spot: { left: variant.left, top: variant.top, width: variant.width } }
      : undefined,
  };
}
