// Een opmerking van de racer kiezen: eigen tekst, anders een algemene tekst
// bij zijn sterkste eigenschap, anders een algemene tekst voor iedereen.
import type { PicknickGame, PicknickMoment, PicknickRacer } from '../models/Picknick';
import type { Racer } from '../models/Racer';
import type { Rng } from '../utils/random';
import { fill, who } from '../utils/text';
import { strongestTrait } from './style';

export function remark(
  game: PicknickGame,
  racer: Racer,
  own: PicknickRacer | undefined,
  moment: PicknickMoment,
  rng: Rng,
  extra: Record<string, string> = {},
): string | undefined {
  const mine = own?.remarks[game.id]?.[moment] ?? [];
  const byTrait = game.traitRemarks?.[strongestTrait(racer.traits)]?.[moment] ?? [];
  const general = game.remarks[moment] ?? [];
  const fallback = byTrait.length && (rng.chance(0.5) || !general.length) ? byTrait : general;
  // Eigen teksten vaker, maar niet altijd: zo herhaalt het niet snel.
  const pool = mine.length && (rng.chance(0.6) || !fallback.length) ? mine : fallback;
  if (!pool.length) return undefined;
  const text = fill(rng.pick(pool), { ...who(racer), ...extra });
  // Een zin begint altijd met een hoofdletter (ook als hij begint met bijv. {plaatje}).
  return text.charAt(0).toUpperCase() + text.slice(1);
}
