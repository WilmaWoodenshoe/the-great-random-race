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
  hatSpot: { left: 58, top: 10, width: 24, rotate: 10, aspect: 510 / 512 },
  eyeSpot: { left: 61, top: 40, width: 29, rotate: 8 },
  neckSpot: { left: 45, top: 50, width: 22 },
  facts: {
    favoriteFood: 'Een kruimel, twintig keer zo groot als hij',
    dislikes: 'Pauzes',
    favoriteActivity: 'Sjouwen',
    secretTalent: 'Tilt alles op',
  },
};

export default roger;
