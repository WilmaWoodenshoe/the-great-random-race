import type { Racer } from '../../models/Racer';

const turbo: Racer = {
  id: 'turbo',
  name: 'Turbo',
  species: 'Schildpad',
  speed: 0.85,
  traits: { curious: 30, stubborn: 90, chaotic: 15, lazy: 50 },
  title: 'The Relentless',
  tagline: 'Laat zich door niets afleiden.',
  image: 'racers/schildpad.webp',
  hatSpot: { left: 63, top: -15, width: 24, rotate: 8, aspect: 512 / 363 },
  facts: {
    favoriteFood: 'Paardenbloemen',
    dislikes: 'Haast',
    favoriteActivity: 'Doorlopen',
    secretTalent: 'Geeft nooit op',
  },
};

export default turbo;
