import { useCallback, useMemo } from 'react';
import { picknickRacer } from '../../content/picknick';
import type { PicknickGame, PicknickMoment } from '../../models/Picknick';
import type { Racer } from '../../models/Racer';
import { remark } from '../../picknick/remarks';
import { createRng } from '../../utils/random';

/** Toeval voor dit potje en een functie voor de opmerkingen van de racer. */
export function useSay(game: PicknickGame, racer: Racer) {
  const own = picknickRacer(racer.id);
  const rng = useMemo(() => createRng(Date.now() ^ Math.floor(Math.random() * 1e9)), []);
  const say = useCallback(
    (m: PicknickMoment, extra?: Record<string, string>) => remark(game, racer, own, m, rng, extra),
    [game, racer, own, rng],
  );
  return { rng, say, own };
}
