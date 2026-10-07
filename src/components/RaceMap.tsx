import type { Course, MapPoint } from '../models/Course';
import { nl } from '../content/nl';
import { img } from '../utils/images';

interface Props {
  course: Course;
  /** De racer van de speler op de kaart. */
  marker: { point: MapPoint; image: string; label: string };
  alt: string;
}

/** Geïllustreerde kaart met bordjes en de positie van Gerard. */
export function RaceMap({ course, marker, alt }: Props) {
  const { width, height } = course.map;
  const pos = (p: MapPoint) => ({ left: `${(p.x / width) * 100}%`, top: `${(p.y / height) * 100}%` });
  const finishIndex = course.segments.length;
  const last = course.segments[finishIndex - 1];

  return (
    <div className="race-map" style={{ aspectRatio: `${width} / ${height}` }}>
      <img className="race-map__img" src={img(course.map.image)} alt={alt} />
      {course.segments.slice(0, -1).map((s, i) => (
        <div key={s.id} className="race-map__sign" style={pos(s.sign)}>
          {i + 1}. {s.name}
        </div>
      ))}
      <div className="race-map__finish" style={pos(course.map.finish)}>
        {finishIndex}. {last.name} · {nl.race.finish}
      </div>
      <div className="race-map__marker" style={pos(marker.point)}>
        <div className="race-map__ping grr-ping" />
        <img className="race-map__racer" src={img(marker.image)} alt="" />
        <div className="race-map__label">{marker.label}</div>
      </div>
    </div>
  );
}
