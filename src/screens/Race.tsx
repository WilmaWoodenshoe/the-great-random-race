import { Link, Navigate } from 'react-router-dom';
import { nl } from '../content/nl';
import { mapImageOf } from '../game/course';
import { BackHeader } from '../components/BackHeader';
import { BookIcon } from '../components/Icons';
import { img } from '../utils/images';
import { Pill } from '../components/Pill';
import { ProgressBar } from '../components/ProgressBar';
import { RaceMap } from '../components/RaceMap';
import { getRaceRacer } from '../game/engine';
import { placeRacers } from '../game/mapPosition';
import { useGame } from '../state/GameProvider';
import { useRaceView } from '../state/useRaceView';
import { formatKm } from '../utils/format';

/** Racekaart (Race.html) met de echte posities van alle racers. */
export function Race() {
  const { loading } = useGame();
  const view = useRaceView();
  if (loading) return <div className="screen" aria-busy="true" />;
  if (!view) return <Navigate to="/" replace />;

  const { race, standings, me, player } = view;
  const course = race.course;
  const places = placeRacers(course, standings);
  const markers = standings.map((s) => {
    const racer = getRaceRacer(race, s.racerId);
    return {
      racerId: s.racerId,
      point: places[s.racerId],
      image: racer.image,
      name: racer.name,
      isPlayer: s.racerId === race.playerId,
      owner: race.owners?.[s.racerId],
      position: s.position,
    };
  });

  return (
    <div className="screen screen--passend race-screen">
      {/* De kaart nog eens, vervaagd, als achtergrond: zo is het hele scherm gevuld. */}
      <img className="race-screen__bg" src={img(mapImageOf(view.race))} alt="" />
      <BackHeader
        title={nl.common.raceNumber(race.number)}
        subtitle={course.name}
        right={
          <Link to="/journaal" className="icon-btn icon-btn--vierkant" aria-label={nl.race.openJournal}>
            <BookIcon size={26} />
          </Link>
        }
      >
        <div className="back-header__pill">
          <Pill>{view.finished ? nl.home.raceOver : nl.common.daysLeft(view.daysLeft)}</Pill>
        </div>
      </BackHeader>

      <main className="race">
        <div className="race__map">
          <RaceMap course={course} image={mapImageOf(view.race)} alt={nl.race.mapAlt(course.name, player.name, me.position)} markers={markers} />
        </div>
        <Link to="/tussenstand" className="race__progress card">
          <ProgressBar value={view.progress} height={14} label={course.name} />
          <div className="race__km">
            {formatKm(me.km)} / {formatKm(course.lengthKm)}
          </div>
          <div className="race__more">{nl.race.standings} →</div>
        </Link>
      </main>
    </div>
  );
}
