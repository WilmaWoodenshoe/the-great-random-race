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
  // Waar hoed, bril en sjaal zitten (Collectie): punt boven op het hoofd,
  // midden tussen de ogen en de nek, in procenten van de afbeelding.
  wear: {
    aspect: 512 / 363,
    head: { x: 81, y: 5, w: 34, angle: 10 },
    eyes: { x: 82, y: 17, w: 26 },
    neck: { x: 73, y: 50, w: 22, angle: 20 },
  },
  facts: {
    favoriteFood: 'Paardenbloemen',
    dislikes: 'Haast',
    favoriteActivity: 'Doorlopen',
    secretTalent: 'Geeft nooit op',
  },
};

export default turbo;
