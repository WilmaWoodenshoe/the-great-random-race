import { img } from '../utils/images';

interface Props {
  image: string;
  alt: string;
  className?: string;
  /** Af en toe het kopje bewegen (wiebelen) naast het ademen. */
  wobble?: boolean;
}

/**
 * Een racer die 'leeft': zacht ademen (3,2 s) en af en toe wiebelen.
 * Bij 'minder beweging' op de telefoon staat dit uit (zie theme.css).
 */
export function LivingRacer({ image, alt, className = '', wobble = false }: Props) {
  const picture = <img className={`living__img grr-breathe ${className}`} src={img(image)} alt={alt} />;
  return wobble ? <div className="living grr-wobble">{picture}</div> : picture;
}
