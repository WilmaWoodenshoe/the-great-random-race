import { useNavigate } from 'react-router-dom';
import { nl } from '../content/nl';
import { getChoice, getCourse } from '../content';
import type { ChoiceColor } from '../models/Choice';
import { demoRace } from '../demo/voorbeeld';
import { PrimaryButton } from '../components/PrimaryButton';
import { AppleIcon, CloseIcon, SitIcon, SkipIcon } from '../components/Icons';
import { img } from '../utils/images';

const ICONS: Record<ChoiceColor, JSX.Element> = {
  groen: <AppleIcon />,
  blauw: <SkipIcon />,
  oranje: <SitIcon />,
};

/**
 * Keuze-event als pop-up (Event.html).
 * In fase 1 tonen we de aardbei als voorbeeld; de keuze telt nog niet mee.
 */
export function Event() {
  const navigate = useNavigate();
  const choice = getChoice('aardbei');
  const course = getCourse(demoRace.courseId);
  const close = () => navigate('/home');

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
            <PrimaryButton key={o.id} color={o.color} size="keuze" icon={ICONS[o.color]} onClick={close}>
              {o.label}
            </PrimaryButton>
          ))}
        </div>
      </section>
    </div>
  );
}
