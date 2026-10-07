import type { Course } from '../models/Course';
import type { SpeedPhase } from '../models/Event';
import type { Racer } from '../models/Racer';
import { HOUR } from '../utils/dates';
import { segmentBounds } from './course';
import { baseKmh } from './racers';
import { terrainMultiplier } from './terrain';

/** Alles wat nodig is om de beweging van één racer uit te rekenen. */
export interface MovementInput {
  course: Course;
  racer: Racer;
  startTime: number;
  /** Alle snelheidseffecten voor deze racer (events, regen, keuzes, acties). */
  phases: SpeedPhase[];
  /** Directe sprongen (kortere weg, verkeerde afslag), in km. */
  jumps: { time: number; km: number }[];
}

export interface Movement {
  /** Afgelegde afstand in km (nooit onder 0, nooit meer dan de lengte). */
  km: number;
  /** Moment van finishen, of null als de racer nog onderweg is. */
  finishTime: number | null;
  /** Wanneer de racer voor het eerst bij elk volgend deel aankwam. */
  arrivals: { index: number; time: number }[];
}

/**
 * Rekent uit waar een racer is op moment `until`.
 *
 * Positie = de som van (effectieve snelheid × tijd) over alle tijdvakken.
 * Tussen twee 'breekpunten' (begin of eind van een effect, of een sprong)
 * is de snelheid constant, behalve dat het terrein verandert als de racer
 * een nieuw deel bereikt; dat rekenen we exact uit.
 */
export function simulate(input: MovementInput, until: number): Movement {
  const { course, racer, startTime } = input;
  const length = course.lengthKm;
  const bounds = segmentBounds(course);
  const base = baseKmh(racer);

  const phases = input.phases.filter((p) => p.start < until && p.end > startTime);
  const jumps = input.jumps.filter((j) => j.time >= startTime && j.time <= until).sort((a, b) => a.time - b.time);

  const points = new Set<number>([startTime, until]);
  for (const p of phases) {
    if (p.start > startTime) points.add(p.start);
    if (p.end < until) points.add(p.end);
  }
  for (const j of jumps) points.add(j.time);
  const breakpoints = [...points].filter((t) => t >= startTime && t <= until).sort((a, b) => a - b);

  let km = 0;
  let seg = 0;
  let maxSeg = 0;
  let finishTime: number | null = null;
  const arrivals: { index: number; time: number }[] = [];
  let jumpIndex = 0;

  const enterSegmentsUpTo = (time: number) => {
    while (seg < bounds.length - 1 && km >= bounds[seg].endKm) seg++;
    while (seg > 0 && km < bounds[seg].startKm) seg--;
    for (let i = maxSeg + 1; i <= seg; i++) arrivals.push({ index: i, time });
    maxSeg = Math.max(maxSeg, seg);
  };

  for (let i = 0; i < breakpoints.length && finishTime === null; i++) {
    const t0 = breakpoints[i];

    // Sprongen op dit moment.
    while (jumpIndex < jumps.length && jumps[jumpIndex].time <= t0) {
      km = Math.min(length, Math.max(0, km + jumps[jumpIndex].km));
      jumpIndex++;
      enterSegmentsUpTo(t0);
      if (km >= length) finishTime = t0;
    }
    if (finishTime !== null || i === breakpoints.length - 1) break;

    const t1 = breakpoints[i + 1];
    let multiplier = 1;
    for (const p of phases) {
      if (p.start <= t0 && p.end > t0) multiplier *= p.speed;
    }
    const kmPerMs = (base * multiplier) / HOUR;
    if (kmPerMs <= 0) continue;

    let t = t0;
    while (t < t1) {
      const b = bounds[seg];
      const v = kmPerMs * terrainMultiplier(b.terrain, racer.traits);
      const reach = t + (b.endKm - km) / v;
      if (reach <= t1) {
        km = b.endKm;
        t = reach;
        if (seg === bounds.length - 1) {
          km = length;
          finishTime = t;
          break;
        }
        enterSegmentsUpTo(t);
      } else {
        km += v * (t1 - t);
        t = t1;
      }
    }
  }

  return { km, finishTime, arrivals };
}
