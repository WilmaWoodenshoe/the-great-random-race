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
  hatSpot: { left: 67, top: 0, width: 26, rotate: 8, aspect: 512 / 479 },
  eyeSpot: { left: 70, top: 39, width: 29, rotate: 5 },
  neckSpot: { left: 62, top: 52, width: 28 },
  facts: {
    favoriteFood: 'Bladeren',
    dislikes: 'Wekkers',
    favoriteActivity: 'Dutjes',
    secretTalent: 'Slaapt overal',
  },
};

export default kevin;
