import { Link } from 'react-router-dom';
import { nl } from '../content/nl';
import { getCourse, playerRacer } from '../content';
import { demoRace } from '../demo/voorbeeld';
import { BackHeader } from '../components/BackHeader';
import { JournalIcon } from '../components/Icons';
import { Pill } from '../components/Pill';
import { ProgressBar } from '../components/ProgressBar';
import { RaceMap } from '../components/RaceMap';
import { formatKm } from '../utils/format';
import { standings } from './standings';

/** Racekaart (Race.html). */
export function Race() {
  const course = getCourse(demoRace.courseId);
  const me = playerRacer;
  const km = demoRace.distances[me.id] ?? 0;
  const position = standings().findIndex((s) => s.racer.id === me.id) + 1;

  return (
    <div className="screen">
      <BackHeader
        title={nl.common.raceNumber(demoRace.number)}
        subtitle={course.name}
        right={
          <Link to="/journaal" className="icon-btn icon-btn--vierkant" aria-label={nl.race.openJournal}>
            <JournalIcon />
          </Link>
        }
      >
        <div className="back-header__pill">
          <Pill>{nl.common.daysLeft(demoRace.daysLeft)}</Pill>
        </div>
      </BackHeader>

      <main className="race">
        <RaceMap
          course={course}
          alt={nl.race.mapAlt(me.name, position)}
          marker={{ point: demoRace.gerardOnMap, image: me.image, label: `${me.name} · #${position}` }}
        />
        <div className="race__progress card">
          <ProgressBar value={km / course.lengthKm} height={14} label={course.name} />
          <div className="race__km">
            {formatKm(km)} / {formatKm(course.lengthKm)}
          </div>
        </div>
      </main>
    </div>
  );
}
