import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Course, MapPoint } from '../models/Course';
import { nl } from '../content/nl';
import { img } from '../utils/images';

export interface MapMarker {
  racerId: string;
  point: MapPoint;
  image: string;
  name: string;
  /** De racer van de speler: groter, met een pulserende ring. */
  isPlayer?: boolean;
  /** Bijnaam van de speler die deze racer bestuurt (gedeelde race). */
  owner?: string;
  /** Plek in de tussenstand. */
  position: number;
}

interface Props {
  course: Course;
  markers: MapMarker[];
  alt: string;
  /** Andere kaartafbeelding (bijv. met paasei); standaard die van de route. */
  image?: string;
}

/**
 * Geïllustreerde kaart met bordjes, de finish en alle racers.
 * Racers staan er zonder naamkaartje op; één tik laat zien wie het is,
 * nog een tik opent de racerkaart.
 */
export function RaceMap({ course, markers, alt, image }: Props) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const { width, height } = course.map;
  const pos = (p: MapPoint) => ({ left: `${(p.x / width) * 100}%`, top: `${(p.y / height) * 100}%` });
  const finishIndex = course.segments.length;
  const last = course.segments[finishIndex - 1];
  // De speler en de gekozen racer als laatste tekenen, zodat ze bovenop liggen.
  const rank = (m: MapMarker) => (m.racerId === selected ? 2 : m.isPlayer ? 1 : 0);
  const ordered = [...markers].sort((a, b) => rank(a) - rank(b) || a.point.y - b.point.y);
  const chosen = markers.find((m) => m.racerId === selected);

  const openCard = (m: MapMarker) => navigate(m.isPlayer ? '/mijn-racer' : `/racer/${m.racerId}`);
  const tap = (m: MapMarker) => (selected === m.racerId ? openCard(m) : setSelected(m.racerId));
  const who = (m: MapMarker) => (m.isPlayer ? nl.race.yourRacer : m.owner ? nl.race.player(m.owner) : nl.race.computer);
  // Ballon links of rechts uitlijnen zodat hij niet buiten de kaart valt.
  const side = (m: MapMarker) => (m.point.x < width * 0.3 ? 'links' : m.point.x > width * 0.7 ? 'rechts' : 'midden');

  return (
    <div
      className="race-map"
      style={{
        aspectRatio: `${width} / ${height}`,
        // Zo groot mogelijk, maar nooit hoger dan de ruimte die er is.
        width: `min(100cqw, calc(100cqh * ${width / height}))`,
      }}
      onClick={() => setSelected(null)}
    >
      <img className="race-map__img" src={img(image ?? course.map.image)} alt={alt} />
      {course.segments.slice(0, -1).map((s, i) => (
        <div key={s.id} className="race-map__sign" style={pos(s.sign)}>
          {i + 1}. {s.name}
        </div>
      ))}
      <div className="race-map__finish" style={pos(course.map.finish)}>
        {finishIndex}. {last.name} · {nl.race.finish}
      </div>
      {ordered.map((m) => (
        <button
          key={m.racerId}
          type="button"
          className={[
            'race-map__marker',
            m.isPlayer ? 'race-map__marker--player' : 'race-map__marker--other',
            m.owner && !m.isPlayer ? 'race-map__marker--human' : '',
            m.racerId === selected ? 'race-map__marker--selected' : '',
          ].join(' ')}
          style={pos(m.point)}
          aria-label={selected === m.racerId ? nl.racer.open(m.name) : nl.race.who(m.name, m.position)}
          onClick={(e) => {
            e.stopPropagation();
            tap(m);
          }}
        >
          {m.isPlayer && <div className="race-map__ping grr-ping" />}
          <img className={`race-map__racer${m.isPlayer ? '' : ' race-map__racer--other'}`} src={img(m.image)} alt="" />
          <div className="race-map__pos" aria-hidden="true">
            {m.position}
          </div>
        </button>
      ))}
      {chosen && (
        <button
          type="button"
          className={`race-map__bubble race-map__bubble--${side(chosen)}${chosen.point.y < height * 0.3 ? ' race-map__bubble--onder' : ''}${chosen.isPlayer ? ' race-map__bubble--player' : ''}`}
          style={pos(chosen.point)}
          onClick={(e) => {
            e.stopPropagation();
            openCard(chosen);
          }}
        >
          <span className="race-map__bubble-name">{chosen.name}</span>
          <span className={`race-map__bubble-who${chosen.owner || chosen.isPlayer ? ' race-map__bubble-who--human' : ''}`}>
            {who(chosen)}
          </span>
          <span className="race-map__bubble-hint">{nl.race.cardHint} ›</span>
        </button>
      )}
    </div>
  );
}
