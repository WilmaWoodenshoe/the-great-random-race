import type { Accessory } from '../../models/Accessory';

const kroon: Accessory = {
  id: 'kroon',
  name: 'Kroon',
  withArticle: 'de kroon',
  kind: 'hoed',
  slot: 'hoofd',
  image: 'accessories/kroon.png',
  fit: { x: 50, y: 88, size: 0.8, aspect: 512 / 493 },
  tagline: 'Niemand heeft gevraagd waarom. {Hij} heeft gewonnen.',
  unlock: { type: 'win' },
};

export default kroon;
