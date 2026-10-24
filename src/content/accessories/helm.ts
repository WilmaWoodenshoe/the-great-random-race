import type { Accessory } from '../../models/Accessory';

const helm: Accessory = {
  id: 'helm',
  name: 'Helm',
  withArticle: 'de helm',
  kind: 'hoed',
  slot: 'hoofd',
  image: 'accessories/helm.png',
  tagline: 'Veiligheid voorop, bij 0,3 km per uur.',
  unlock: { type: 'races', count: 3 },
};

export default helm;
