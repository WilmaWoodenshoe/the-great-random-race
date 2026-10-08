import { useMemo } from 'react';
import { nl } from '../content/nl';
import { hasHat } from '../game/actions';
import { canDoAction, daysLeft, getRaceRacer, isFinished, openChoice, standingsAt, todaysAction } from '../game/engine';
import { journalAt } from '../game/journal';
import { activityAt, statusText } from '../game/status';
import { HOUR, DAY } from '../utils/dates';
import { useGame } from './GameProvider';

/**
 * Alles wat de schermen over de huidige race willen weten, op het moment
 * `now` van de app. Null als er geen race is.
 */
export function useRaceView() {
  const { race, now } = useGame();

  return useMemo(() => {
    if (!race) return null;
    const player = getRaceRacer(race, race.playerId);
    const standings = standingsAt(race, now);
    const me = standings.find((s) => s.racerId === race.playerId)!;

    // Positie nu tegenover een dag geleden (of het eerste uur van de race).
    const compareAt = Math.max(now - DAY, race.startTime + HOUR);
    const before = now > compareAt ? standingsAt(race, compareAt).find((s) => s.racerId === race.playerId)! : me;

    return {
      race,
      now,
      player,
      standings,
      me,
      /** Positief = plekken gestegen. */
      positionChange: before.position - me.position,
      progress: me.km / race.course.lengthKm,
      activity: activityAt(race, race.playerId, now),
      status: statusText(race, race.playerId, now),
      daysLeft: daysLeft(race, now),
      finished: isFinished(race, now),
      openChoice: openChoice(race, now),
      journal: journalAt(race, now),
      /** Mag de speler vandaag nog een actie doen? */
      canAct: canDoAction(race, now),
      todaysAction: todaysAction(race, now),
      /** De hoed voor Gerard, als hij die heeft gekregen (en een hoed past). */
      hat:
        hasHat(race, now) && player.hatSpot
          ? { image: 'accessories/hoed.png', alt: nl.action.hatAlt, spot: player.hatSpot }
          : undefined,
    };
  }, [race, now]);
}

export type RaceView = NonNullable<ReturnType<typeof useRaceView>>;
