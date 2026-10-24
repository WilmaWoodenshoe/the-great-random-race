import type { Accessory } from '../../models/Accessory';

const zonnebril: Accessory = {
  id: 'zonnebril',
  name: 'Zonnebril',
  withArticle: 'de zonnebril',
  kind: 'ogen',
  slot: 'ogen',
  image: 'accessories/zonnebril.png',
  fit: { x: 62, y: 52, size: 1.45, aspect: 512 / 186 },
  tagline: 'Cool. Ook als het regent.',
  unlock: { type: 'daysOpened', count: 7 },
};

export default zonnebril;
