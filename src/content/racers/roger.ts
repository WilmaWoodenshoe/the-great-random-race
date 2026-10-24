import type { Racer } from '../../models/Racer';

// Een mier. Klein, maar werkt keihard en stopt nooit.
const roger: Racer = {
  id: 'roger',
  name: 'Roger',
  species: 'Mier',
  speed: 0.9,
  traits: { curious: 30, stubborn: 95, chaotic: 20, lazy: 10 },
  title: 'The Hard Worker',
  tagline: 'Draagt onderweg dingen die niet van hem zijn.',
  image: 'racers/mier.webp',
  facts: {
    favoriteFood: 'Een kruimel, twintig keer zo groot als hij',
    dislikes: 'Pauzes',
    favoriteActivity: 'Sjouwen',
    secretTalent: 'Tilt alles op',
  },
};

export default roger;
