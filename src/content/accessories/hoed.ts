import type { Accessory } from '../../models/Accessory';

const hoed: Accessory = {
  id: 'hoed',
  name: 'Hoed',
  withArticle: 'de hoed',
  kind: 'hoed',
  slot: 'hoofd',
  image: 'accessories/hoed.png',
  tagline: 'Een heer op weg naar de finish.',
  unlock: { type: 'raceStarted' },
};

export default hoed;
