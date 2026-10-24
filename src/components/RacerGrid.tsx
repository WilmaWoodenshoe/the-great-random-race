import { nl } from '../content/nl';
import type { Racer } from '../models/Racer';
import { img } from '../utils/images';

interface Props {
  racers: Racer[];
  selectedId: string;
  onSelect(id: string): void;
  /** Racers die al door iemand anders gekozen zijn: racer-id → bijnaam. */
  taken?: Record<string, string>;
}

/** Het raster van 'Kies je racer' (KiesRacer.html). */
export function RacerGrid({ racers, selectedId, onSelect, taken = {} }: Props) {
  return (
    <div className="pick__grid" role="group" aria-label={nl.pick.listLabel}>
      {racers.map((r) => {
        const on = r.id === selectedId;
        const by = taken[r.id];
        return (
          <button
            key={r.id}
            type="button"
            aria-pressed={on}
            disabled={by !== undefined}
            className={`pick__tile${on ? ' pick__tile--on' : ''}${by !== undefined ? ' pick__tile--taken' : ''}`}
            onClick={() => onSelect(r.id)}
          >
            <img src={img(r.image)} alt="" className="pick__img" />
            <span className="pick__name">{r.name}</span>
            {by !== undefined && <span className="pick__by">{nl.pick.takenBy(by)}</span>}
          </button>
        );
      })}
    </div>
  );
}

/** De zin onder het raster: naam, bijnaam en karakter van de gekozen racer. */
export function RacerLine({ racer }: { racer: Racer }) {
  return (
    <p className="pick__line" aria-live="polite">
      <b>{racer.name}</b> · {racer.title}
      <br />
      {nl.pick.line(racer.species, racer.tagline ?? '')}
    </p>
  );
}
