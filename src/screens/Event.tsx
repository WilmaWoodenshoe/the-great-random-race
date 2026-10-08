import { useNavigate } from 'react-router-dom';
import { nl } from '../content/nl';
import { getChoice, getCourse } from '../content';
import { useGame } from '../state/GameProvider';
import { useRaceView } from '../state/useRaceView';
import type { ChoiceColor } from '../models/Choice';
import { PrimaryButton } from '../components/PrimaryButton';
import { AppleIcon, CloseIcon, SitIcon, SkipIcon } from '../components/Icons';
import { img } from '../utils/images';

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
  const close = () => navigate('/home');
  const pick = async (optionId: string) => {
    if (open) await decide(open.id, optionId);
    close();
  };

  return (
    <div className="screen event">
      <img className="event__bg" src={img(course.map.image)} alt="" />
      <div className="event__shade" />

      <section className="event__dialog grr-pop" role="dialog" aria-modal="true" aria-labelledby="event-kop">
        <div className="badge badge--event">{nl.event.badge}</div>
        <button type="button" className="event__close" aria-label={nl.event.close} onClick={close}>
          <CloseIcon />
        </button>
        <h1 id="event-kop" className="kop kop--32 event__heading">
          {choice.heading}
        </h1>
        <img className="event__img" src={img(choice.image)} alt={choice.imageAlt} />
        <h2 className="kop kop--26">{choice.title}</h2>
        <p className="event__text">{choice.text}</p>
        <div className="event__options">
          {choice.options.map((o) => (
            <PrimaryButton key={o.id} color={o.color} size="keuze" icon={ICONS[o.color]} onClick={() => pick(o.id)}>
              {o.label}
            </PrimaryButton>
          ))}
        </div>
      </section>
    </div>
  );
}
