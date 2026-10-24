import { Navigate, useNavigate } from 'react-router-dom';
import { nl } from '../content/nl';
import { getChoice, getCourse, getRacer } from '../content';
import { fill, who } from '../utils/text';
import { useGame } from '../state/GameProvider';
import { useRaceView } from '../state/useRaceView';
import { isTestVersion } from '../utils/env';
import type { ChoiceColor } from '../models/Choice';
import { PrimaryButton } from '../components/PrimaryButton';
import { AppleIcon, CloseIcon, SitIcon, SkipIcon } from '../components/Icons';
import { img } from '../utils/images';
import { mapImageOf } from '../game/course';

const ICONS: Record<ChoiceColor, JSX.Element> = {
  groen: <AppleIcon />,
  blauw: <SkipIcon />,
  oranje: <SitIcon />,
};

/**
 * Keuze-event als pop-up (Event.html). Staat er een keuze open, dan telt
 * de gekozen optie meteen mee. Zonder open keuze tonen we de aardbei als
 * voorbeeld (testversie); dan gebeurt er niets.
 */
export function Event() {
  const navigate = useNavigate();
  const { decide } = useGame();
  const view = useRaceView();
  const open = view?.openChoice ?? null;
  const choice = open?.choice ?? getChoice('aardbei');
  const course = view?.race.course ?? getCourse('grote-bosrace');
  const say = (s: string) => fill(s, who(view?.player ?? getRacer('gerard')));
  const close = () => navigate('/home');
  // Zonder open keuze alleen in de testversie een voorbeeld tonen.
  if (!open && !isTestVersion) return <Navigate to="/home" replace />;
  const pick = async (optionId: string) => {
    if (open) await decide(open.id, optionId);
    close();
  };

  return (
    <div className="screen event">
      <img className="event__bg" src={img(view ? mapImageOf(view.race) : course.map.image)} alt="" />
      <div className="event__shade" />

      <section className="event__dialog grr-pop" role="dialog" aria-modal="true" aria-labelledby="event-kop">
        <div className="badge badge--event">{nl.event.badge}</div>
        <button type="button" className="event__close" aria-label={nl.event.close} onClick={close}>
          <CloseIcon />
        </button>
        <h1 id="event-kop" className="kop kop--32 event__heading">
          {say(choice.heading)}
        </h1>
        <img className="event__img" src={img(choice.imageByCourse?.[course.id] ?? choice.image)} alt={say(choice.imageAlt)} />
        <h2 className="kop kop--26">{say(choice.title)}</h2>
        <p className="event__text">{say(choice.text)}</p>
        <div className="event__options">
          {choice.options.map((o) => (
            <PrimaryButton key={o.id} color={o.color} size="keuze" icon={ICONS[o.color]} onClick={() => pick(o.id)}>
              {say(o.label)}
            </PrimaryButton>
          ))}
        </div>
      </section>
    </div>
  );
}
