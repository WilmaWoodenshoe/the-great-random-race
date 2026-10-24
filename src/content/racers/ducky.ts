import type { Racer } from '../../models/Racer';

const ducky: Racer = {
  id: 'ducky',
  name: 'Mr. M',
  species: 'Eend',
  speed: 1.3,
  traits: { curious: 60, stubborn: 30, chaotic: 90, lazy: 30 },
  title: 'Chaotic Excellence',
  tagline: 'Snel, maar weet zelden waarheen.',
  image: 'racers/eend.webp',
  // Waar hoed, bril en sjaal zitten (Collectie): punt boven op het hoofd,
  // midden tussen de ogen en de nek, in procenten van de afbeelding.
  wear: {
    aspect: 512 / 464,
    head: { x: 69, y: 4, w: 44, angle: 8 },
    eyes: { x: 84, y: 18, w: 32 },
    neck: { x: 62, y: 42, w: 30, angle: 10 },
  },
  facts: {
    favoriteFood: 'Broodkruimels',
    dislikes: 'Rechte lijnen',
    favoriteActivity: 'Kortere wegen',
    secretTalent: 'Weet nooit waar hij is',
  },
};

export default ducky;
