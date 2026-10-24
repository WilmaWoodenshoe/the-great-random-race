import type { Racer } from '../../models/Racer';

const kevin: Racer = {
  id: 'kevin',
  name: 'Kevin',
  species: 'Rups',
  speed: 1.0,
  traits: { curious: 70, stubborn: 20, chaotic: 60, lazy: 80 },
  title: 'Professional Napper',
  tagline: 'Slaapt vooral.',
  image: 'racers/rups.webp',
  // Waar hoed, bril en sjaal zitten (Collectie): punt boven op het hoofd,
  // midden tussen de ogen en de nek, in procenten van de afbeelding.
  wear: {
    aspect: 512 / 479,
    head: { x: 77, y: 27, w: 42, angle: 5 },
    eyes: { x: 86, y: 40, w: 32, angle: -3 },
    neck: { x: 70, y: 66, w: 30 },
  },
  facts: {
    favoriteFood: 'Bladeren',
    dislikes: 'Wekkers',
    favoriteActivity: 'Dutjes',
    secretTalent: 'Slaapt overal',
  },
};

export default kevin;
