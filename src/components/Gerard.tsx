import { img } from '../utils/images';

/** Hoe de racer erbij staat; past bij wat hij nu doet (hoofdstuk 15). */
export type Mood = 'gewoon' | 'slaapt' | 'kijkt' | 'schrikt';

interface Props {
  image: string;
  alt: string;
  /** Extra klasse voor het omhulsel (grootte en plek op het scherm). */
  className?: string;
  /** Af en toe het kopje bewegen (wiebelen) naast het ademen. */
  wobble?: boolean;
  mood?: Mood;
}

/** Zet wat de racer doet (een eventtype of status) om in een houding. */
export function moodFor(activity: string): Mood {
  if (activity === 'nap' || activity === 'raceOver') return 'slaapt';
  if (['flower', 'butterfly', 'worm', 'choice'].includes(activity)) return 'kijkt';
  if (activity === 'bird' || activity === 'strange_noise') return 'schrikt';
  return 'gewoon';
}

/**
 * Een racer die 'leeft': zacht ademen (3,2 s) en af en toe wiebelen.
 * Slaapt hij, dan ademt hij rustiger en komen er zzz'jes uit; kijkt hij
 * ergens naar, dan houdt hij zijn kopje schuin. Bij 'minder beweging' op de
 * telefoon staat dit allemaal uit (zie theme.css).
 */
export function LivingRacer({ image, alt, className = '', wobble = false, mood = 'gewoon' }: Props) {
  const breathe = mood === 'slaapt' ? 'grr-breathe-slow' : 'grr-breathe';
  const sway = wobble && mood === 'gewoon' ? ' grr-wobble' : '';
  return (
    <div className={`living living--${mood}${sway} ${className}`}>
      <img className={`living__img ${breathe}`} src={img(image)} alt={alt} />
      {mood === 'slaapt' && (
        <span className="living__zzz" aria-hidden="true">
          <span>z</span>
          <span>z</span>
          <span>z</span>
        </span>
      )}
    </div>
  );
}
