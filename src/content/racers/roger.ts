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
  // Waar hoed, bril en sjaal zitten (Collectie): punt boven op het hoofd,
  // midden tussen de ogen en de nek, in procenten van de afbeelding.
  wear: {
    aspect: 510 / 512,
    head: { x: 70, y: 30, w: 42, angle: 10 },
    eyes: { x: 81, y: 45, w: 32, angle: -3 },
    neck: { x: 52, y: 60, w: 18, angle: 30 },
  },
  facts: {
    favoriteFood: 'Een kruimel, twintig keer zo groot als hij',
    dislikes: 'Pauzes',
    favoriteActivity: 'Sjouwen',
    secretTalent: 'Tilt alles op',
  },
};

export default roger;
