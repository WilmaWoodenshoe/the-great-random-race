import type { Accessory } from '../../models/Accessory';

const feesthoed: Accessory = {
  id: 'feesthoed',
  name: 'Feesthoed',
  withArticle: 'de feesthoed',
  kind: 'hoed',
  slot: 'hoofd',
  image: 'accessories/feesthoed.png',
  fit: { x: 50, y: 92, size: 0.55, aspect: 450 / 512 },
  tagline: 'Voor als {hij} ooit op het podium staat. Dat is nu.',
  unlock: { type: 'podium' },
};

export default feesthoed;
