import { nl } from '../content/nl';
import type { EventType } from '../models/Event';
import type { JournalEntry } from '../models/JournalEntry';
import type { Race } from '../models/Race';
import { createRng, deriveSeed } from '../utils/random';
import { fill, who } from '../utils/text';
import { hasHat } from './actions';
import { effectiveDecisions } from './choices';
import { getRaceRacer, racerMovement } from './engine';

const t = nl.engine;
type EventTextKey = keyof typeof t.events;

/** Kies een tekstvariant; met een vaste index blijft de tekst altijd dezelfde. */
const pickText = <T,>(list: readonly T[], variant: number): T => list[variant % list.length];

/** Variant voor afgeleide regels (aankomst, finish), vast per race. */
const variantFor = (race: Race, label: string) => createRng(deriveSeed(race.seed, label)).int(0, 99);

/**
 * Het journaal op moment `now`: alleen wat al gebeurd is, nieuwste bovenaan.
 * Events van een racer na zijn finish tellen niet meer mee.
 */
export function journalAt(race: Race, now: number): JournalEntry[] {
  const until = Math.min(now, race.endTime);
  const entries: JournalEntry[] = [];
  if (now < race.startTime) return entries;
  const player = who(getRaceRacer(race, race.playerId));

  entries.push({
    id: 'start',
    time: race.startTime,
    kind: 'start',
    racerId: null,
    text: fill(pickText(t.start, variantFor(race, 'start')), player),
  });

  const finishTimes = new Map<string, number | null>();
  for (const r of race.racers) {
    const m = racerMovement(race, r.id, until);
    finishTimes.set(r.id, m.finishTime);
    for (const a of m.arrivals) {
      const segment = race.course.segments[a.index];
      entries.push({
        id: `seg-${r.id}-${a.index}`,
        time: a.time,
        kind: 'segment',
        racerId: r.id,
        text: fill(pickText(t.segment, variantFor(race, `seg:${r.id}:${a.index}`)), { ...who(r), plek: segment.withArticle }),
      });
    }
    if (m.finishTime !== null) {
      entries.push({
        id: `finish-${r.id}`,
        time: m.finishTime,
        kind: 'finish',
        racerId: r.id,
        text: fill(pickText(t.finish, variantFor(race, `finish:${r.id}`)), who(r)),
      });
    }
  }

  for (const e of race.events) {
    if (e.time > until) continue;
    if (e.racerId) {
      const finished = finishTimes.get(e.racerId);
      if (finished != null && e.time >= finished) continue;
    }
    const racer = e.racerId ? who(getRaceRacer(race, e.racerId)) : {};
    const key = (e.textKey ?? e.type) as EventTextKey;
    let text = fill(pickText(t.events[key], e.variant), racer);
    // Met hoed op reageert het journaal er af en toe op.
    if (e.racerId === race.playerId && e.variant % 2 === 0 && hasHat(race, e.time)) {
      text += ` ${pickText(t.hatRemarks, e.variant >> 1)}`;
    }
    entries.push({
      id: e.id,
      time: e.time,
      kind: 'event',
      racerId: e.racerId,
      eventType: e.type as EventType,
      text,
    });
  }

  for (const sc of race.choices) {
    if (sc.time > until) continue;
    entries.push({ id: `${sc.id}-gevonden`, time: sc.time, kind: 'choice', racerId: race.playerId, text: fill(sc.choice.announce, player) });
  }
  for (const d of effectiveDecisions(race, until)) {
    const sc = race.choices.find((c) => c.id === d.scheduledId)!;
    const option = sc.choice.options.find((o) => o.id === d.optionId);
    if (!option) continue;
    entries.push({
      id: `${sc.id}-gekozen`,
      time: d.time,
      kind: 'decision',
      racerId: race.playerId,
      text: fill(pickText(option.journal, sc.variant), player),
    });
  }

  for (const a of race.actions) {
    if (a.time > until) continue;
    entries.push({
      id: `actie-${a.day}`,
      time: a.time,
      kind: 'action',
      racerId: race.playerId,
      text: fill(pickText(t.actions[a.actionId], a.variant), player),
    });
  }

  if (now >= race.endTime) {
    entries.push({ id: 'einde', time: race.endTime, kind: 'end', racerId: null, text: fill(pickText(t.end, variantFor(race, 'end')), player) });
  }

  // Nieuwste bovenaan; bij gelijke tijd blijft de logische volgorde staan.
  return entries.map((e, i) => ({ e, i })).sort((a, b) => b.e.time - a.e.time || b.i - a.i).map((x) => x.e);
}
