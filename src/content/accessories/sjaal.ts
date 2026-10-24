import type { Accessory } from '../../models/Accessory';

const sjaal: Accessory = {
  id: 'sjaal',
  name: 'Sjaal',
  withArticle: 'de sjaal',
  kind: 'speciaal',
  slot: 'nek',
  image: 'accessories/sjaal.png',
  tagline: 'Voor koude ochtenden in week drie.',
  unlock: { type: 'longRace', days: 21 },
};

export default sjaal;
