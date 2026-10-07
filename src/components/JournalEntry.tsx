import type { JournalTone } from '../demo/voorbeeld';
import { img } from '../utils/images';

interface Props {
  time: string;
  tone: JournalTone;
  icon: string;
  text: string;
  /** Nieuw bericht: schuift zacht in beeld. */
  isNew?: boolean;
}

export function JournalEntry({ time, tone, icon, text, isNew }: Props) {
  return (
    <li className={`journal-entry${isNew ? ' grr-slide-in' : ''}`}>
      <span className={`journal-entry__dot journal-entry__dot--${tone}`} aria-hidden="true" />
      <time className="journal-entry__time">{time}</time>
      <img className="journal-entry__icon" src={img(icon)} alt="" />
      <span className="journal-entry__text">{text}</span>
    </li>
  );
}
