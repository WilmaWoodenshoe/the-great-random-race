import type { Accessory } from '../../models/Accessory';

const pet: Accessory = {
  id: 'pet',
  name: 'Pet',
  withArticle: 'de pet',
  kind: 'hoed',
  slot: 'hoofd',
  image: 'accessories/pet.png',
  tagline: 'Sportief. Maakt {hem} niet sneller.',
  unlock: { type: 'start' },
};

export default pet;
