import type { WearSpot } from '../models/Racer';
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
  /**
   * Wat de racer draagt (hoed, bril, sjaal), met de plek op de afbeelding
   * (zie Racer.wear) en de verhouding breedte/hoogte van de afbeelding.
   */
  wear?: { items: Worn[]; aspect: number; base?: Worn };
}

export interface Worn {
  image: string;
  alt: string;
  spot: WearSpot;
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
export function LivingRacer({ image, alt, className = '', wobble = false, mood = 'gewoon', wear }: Props) {
  const hat = wear && (wear.items.length > 0 || wear.base) ? wear : undefined;
  const breathe = mood === 'slaapt' ? 'grr-breathe-slow' : 'grr-breathe';
  const sway = wobble && mood === 'gewoon' ? ' grr-wobble' : '';
  // Met hoed: afbeelding en hoed samen in een vak met precies de verhouding
  // van de afbeelding, zodat de hoed altijd op dezelfde plek op het hoofd zit.
  const picture = hat ? (
    <span className={`living__fig ${breathe}`} style={{ width: `min(100cqw, calc(100cqh * ${hat.aspect}))`, aspectRatio: String(hat.aspect) }}>
      {/* Getekend plaatje mét accessoire: de gewone racer houdt alleen de ruimte vast. */}
      <img className="living__img" src={img(image)} alt={alt} style={hat.base ? { visibility: 'hidden' } : undefined} />
      {hat.base && (
        <img
          className="living__hat living__worn"
          src={img(hat.base.image)}
          alt=""
          style={{ left: `${hat.base.spot.left}%`, top: `${hat.base.spot.top}%`, width: `${hat.base.spot.width}%` }}
        />
      )}
      {hat.items.map((w) => (
        <img
          key={w.image}
          className="living__hat"
          src={img(w.image)}
          alt={w.alt}
          style={{
            left: `${w.spot.left}%`,
            top: `${w.spot.top}%`,
            width: `${w.spot.width}%`,
            transform: w.spot.rotate ? `rotate(${w.spot.rotate}deg)` : undefined,
            transformOrigin: w.spot.origin,
          }}
        />
      ))}
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
