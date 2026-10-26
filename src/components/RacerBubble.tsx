import type { Racer } from '../models/Racer';
import { img } from '../utils/images';

/** De racer klein links, met een tekstwolkje ernaast (Picknickkleed). */
export function RacerBubble({ racer, text }: { racer: Racer; text?: string }) {
  return (
    <div className="pk-bubble">
      <img className="pk-bubble__racer" src={img(racer.image)} alt={racer.name} />
      <p className="pk-bubble__text" aria-live="polite">
        {text ?? '…'}
      </p>
    </div>
  );
}
