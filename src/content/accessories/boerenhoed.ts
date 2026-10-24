import type { Accessory } from '../../models/Accessory';

const boerenhoed: Accessory = {
  id: 'boerenhoed',
  name: 'Boerenhoed',
  withArticle: 'de boerenhoed',
  kind: 'hoed',
  slot: 'hoofd',
  image: 'accessories/boerenhoed.png',
  fit: { x: 50, y: 78, size: 1.15, aspect: 512 / 508 },
  tagline: 'Tegen de zon op de Hijgheuvel.',
  unlock: { type: 'finished', count: 1 },
};

export default boerenhoed;
