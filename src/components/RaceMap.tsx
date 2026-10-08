import type { Course, MapPoint } from '../models/Course';
import { Link } from 'react-router-dom';
import { nl } from '../content/nl';
import { img } from '../utils/images';

export interface MapMarker {
  racerId: string;
  point: MapPoint;
  image: string;
  label: string;
  /** De racer van de speler: groter, met een pulserende ring. */
  isPlayer?: boolean;
}

interface Props {
  course: Course;
  markers: MapMarker[];
  alt: string;
}

/** Geïllustreerde kaart met bordjes, de finish en alle racers. */
export function RaceMap({ course, markers, alt }: Props) {
  const { width, height } = course.map;
  const pos = (p: MapPoint) => ({ left: `${(p.x / width) * 100}%`, top: `${(p.y / height) * 100}%` });
  const finishIndex = course.segments.length;
  const last = course.segments[finishIndex - 1];
  // De speler als laatste tekenen, zodat hij bovenop ligt.
  const ordered = [...markers].sort((a, b) => Number(!!a.isPlayer) - Number(!!b.isPlayer) || a.point.y - b.point.y);

  return (
    <div
      className="race-map"
      style={{
        aspectRatio: `${width} / ${height}`,
        // Zo groot mogelijk, maar nooit hoger dan de ruimte die er is.
        width: `min(100cqw, calc(100cqh * ${width / height}))`,
      }}
    >
      <img className="race-map__img" src={img(course.map.image)} alt={alt} />
      {course.segments.slice(0, -1).map((s, i) => (
        <div key={s.id} className="race-map__sign" style={pos(s.sign)}>
          {i + 1}. {s.name}
        </div>
      ))}
      <div className="race-map__finish" style={pos(course.map.finish)}>
        {finishIndex}. {last.name} · {nl.race.finish}
      </div>
      {ordered.map((m) =>
        m.isPlayer ? (
          <Link
            key={m.racerId}
            to="/gerard"
            className="race-map__marker race-map__marker--player"
            style={pos(m.point)}
            aria-label={nl.racer.open(m.label)}
          >
            <div className="race-map__ping grr-ping" />
            <img className="race-map__racer" src={img(m.image)} alt="" />
            <div className="race-map__label">{m.label}</div>
          </Link>
        ) : (
          <Link
            key={m.racerId}
            to={`/racer/${m.racerId}`}
            className="race-map__marker race-map__marker--other"
            style={pos(m.point)}
            aria-label={nl.racer.open(m.label)}
          >
            <img className="race-map__racer race-map__racer--other" src={img(m.image)} alt="" />
            <div className="race-map__tag">{m.label}</div>
          </Link>
        ),
      )}
    </div>
  );
}
