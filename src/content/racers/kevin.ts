import type { Racer } from '../../models/Racer';

const kevin: Racer = {
  id: 'kevin',
  name: 'Kevin',
  species: 'Rups',
  speed: 1.0,
  traits: { curious: 70, stubborn: 20, chaotic: 60, lazy: 80 },
  title: 'Professional Napper',
  image: 'racers/rups.webp',
  facts: {
    favoriteFood: 'Bladeren',
    dislikes: 'Wekkers',
    favoriteActivity: 'Dutjes',
    secretTalent: 'Slaapt overal',
  },
};

export default kevin;
