import type { Accessory } from '../../models/Accessory';

const pet: Accessory = {
  id: 'pet',
  name: 'Pet',
  withArticle: 'de pet',
  kind: 'hoed',
  slot: 'hoofd',
  image: 'accessories/pet.png',
  fit: { x: 42, y: 74, size: 1.05, aspect: 512 / 501 },
  tagline: 'Sportief. Maakt {hem} niet sneller.',
  unlock: { type: 'start' },
};

export default pet;
