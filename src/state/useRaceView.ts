import { useMemo } from 'react';
import { accessories } from '../content';
import { wearOn, worn } from '../game/collection';
import { hasHat } from '../game/actions';
import { canDoAction, daysLeft, getRaceRacer, isFinished, openChoice, standingsAt, todaysAction } from '../game/engine';
import { journalAt } from '../game/journal';
import { activityAt, statusText } from '../game/status';
import { HOUR, DAY } from '../utils/dates';
import { fill, who } from '../utils/text';
import { useGame } from './GameProvider';

/**
 * Alles wat de schermen over de huidige race willen weten, op het moment
 * `now` van de app. Null als er geen race is.
 */
export function useRaceView() {
  const { race, now, save } = useGame();

  return useMemo(() => {
    if (!race) return null;
    const player = getRaceRacer(race, race.playerId);
    const standings = standingsAt(race, now);
    const me = standings.find((s) => s.racerId === race.playerId)!;

    // Positie nu tegenover een dag geleden (of het eerste uur van de race).
    const compareAt = Math.max(now - DAY, race.startTime + HOUR);
    const before = now > compareAt ? standingsAt(race, compareAt).find((s) => s.racerId === race.playerId)! : me;

    const words = who(player);
    return {
      race,
      now,
      player,
      /** Vul {naam}, {hij}, {zijn} en {hem} in met de racer van de speler. */
      say: (template: string) => fill(template, words),
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
      journal: journalAt(race, now, worn(save, now)),
      /** Mag de speler vandaag nog een actie doen? */
      canAct: canDoAction(race, now),
      todaysAction: todaysAction(race, now),
      /**
       * Wat de racer van de speler draagt: de accessoires uit de Collectie,
       * en de hoed van de dagelijkse actie (die gaat voor op het hoofd).
       */
      wear: wearOn(player, [
        ...(hasHat(race, now) ? accessories.filter((a) => a.id === 'hoed') : []),
        ...worn(save, now),
      ]),
    };
  }, [race, now, save]);
}

export type RaceView = NonNullable<ReturnType<typeof useRaceView>>;
