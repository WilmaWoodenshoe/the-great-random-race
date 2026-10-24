import type { Accessory } from '../../models/Accessory';

const kroon: Accessory = {
  id: 'kroon',
  name: 'Kroon',
  withArticle: 'de kroon',
  kind: 'hoed',
  slot: 'hoofd',
  image: 'accessories/kroon.png',
  tagline: 'Niemand heeft gevraagd waarom. {Hij} heeft gewonnen.',
  unlock: { type: 'win' },
};

export default kroon;
