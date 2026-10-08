import type { JournalTone } from './journalLook';
import { img } from '../utils/images';

interface Props {
  time: string;
  tone: JournalTone;
  icon: string;
  text: string;
  /** Nieuw sinds de vorige keer kijken: schuift zacht in beeld. */
  isNew?: boolean;
  /** Gaat over de racer van de speler: iets nadrukkelijker. */
  isPlayer?: boolean;
}

export function JournalEntry({ time, tone, icon, text, isNew, isPlayer }: Props) {
  return (
    <li className={`journal-entry${isNew ? ' journal-entry--new grr-slide-in' : ''}${isPlayer ? ' journal-entry--player' : ''}`}>
      <span className={`journal-entry__dot journal-entry__dot--${tone}`} aria-hidden="true" />
      <time className="journal-entry__time">{time}</time>
      <img className="journal-entry__icon" src={img(icon)} alt="" />
      <span className="journal-entry__text">{text}</span>
    </li>
  );
}
