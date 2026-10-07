import type { Racer } from '../../models/Racer';

const turbo: Racer = {
  id: 'turbo',
  name: 'Turbo',
  species: 'Schildpad',
  speed: 0.85,
  traits: { curious: 30, stubborn: 90, chaotic: 15, lazy: 50 },
  title: 'The Relentless',
  image: 'racers/schildpad.webp',
  facts: {
    favoriteFood: 'Paardenbloemen',
    dislikes: 'Haast',
    favoriteActivity: 'Doorlopen',
    secretTalent: 'Geeft nooit op',
  },
};

export default turbo;
