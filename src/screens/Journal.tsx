import { nl } from '../content/nl';
import { playerRacer } from '../content';
import { demoJournal, demoRace } from '../demo/voorbeeld';
import { BackHeader } from '../components/BackHeader';
import { BookIcon } from '../components/Icons';
import { JournalEntry } from '../components/JournalEntry';

/** Journaal (Journal.html), nieuwste bericht bovenaan. */
export function Journal() {
  return (
    <div className="screen">
      <BackHeader
        title={
          <span className="kop--met-icoon">
            <BookIcon />
            {nl.journal.title(playerRacer.name)}
          </span>
        }
      >
        <div className="journal__race">
          <span className="journal__race-label">{nl.common.raceNumber(demoRace.number)}</span>
        </div>
      </BackHeader>

      <main className="screen__main journal">
        <ol className="journal__list">
          {demoJournal.map((e, i) => (
            <JournalEntry key={`${e.time}-${i}`} {...e} isNew={i === 0} />
          ))}
        </ol>
      </main>
    </div>
  );
}
