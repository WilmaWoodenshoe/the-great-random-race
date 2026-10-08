import type { Racer } from '../models/Racer';
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
  /** Een hoed op het hoofd: afbeelding en plek (zie Racer.hatSpot). */
  hat?: { image: string; alt: string; spot: NonNullable<Racer['hatSpot']> };
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
export function LivingRacer({ image, alt, className = '', wobble = false, mood = 'gewoon', hat }: Props) {
  const breathe = mood === 'slaapt' ? 'grr-breathe-slow' : 'grr-breathe';
  const sway = wobble && mood === 'gewoon' ? ' grr-wobble' : '';
  // Met hoed: afbeelding en hoed samen in een vak met precies de verhouding
  // van de afbeelding, zodat de hoed altijd op dezelfde plek op het hoofd zit.
  const picture = hat ? (
    <span className={`living__fig ${breathe}`} style={{ width: `min(100cqw, calc(100cqh * ${hat.spot.aspect}))`, aspectRatio: String(hat.spot.aspect) }}>
      <img className="living__img" src={img(image)} alt={alt} />
      <img
        className="living__hat"
        src={img(hat.image)}
        alt={hat.alt}
        style={{
          left: `${hat.spot.left}%`,
          top: `${hat.spot.top}%`,
          width: `${hat.spot.width}%`,
          transform: hat.spot.rotate ? `rotate(${hat.spot.rotate}deg)` : undefined,
        }}
      />
    </span>
  ) : (
    <img className={`living__img ${breathe}`} src={img(image)} alt={alt} />
  );
  return (
    <div className={`living living--${mood}${sway}${hat ? ' living--hoed' : ''} ${className}`}>
      {picture}
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
