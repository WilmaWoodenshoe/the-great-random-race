import type { Racer } from '../../models/Racer';

const steve: Racer = {
  id: 'steve',
  name: 'Steve',
  species: 'Steen',
  speed: 0.15,
  traits: { curious: 5, stubborn: 100, chaotic: 1, lazy: 100 },
  title: 'Still Going',
  tagline: 'Still going.',
  image: 'racers/steen.webp',
  // Waar hoed, bril en sjaal zitten (Collectie): punt boven op het hoofd,
  // midden tussen de ogen en de nek, in procenten van de afbeelding.
  wear: {
    aspect: 512 / 433,
    head: { x: 48, y: 3, w: 38 },
    eyes: { x: 56, y: 48, w: 36, angle: -6 },
    neck: { x: 58, y: 73, w: 40 },
  },
  facts: {
    favoriteFood: 'Onbekend',
    dislikes: 'Niets',
    favoriteActivity: 'Liggen',
    secretTalent: 'Wordt aangezien voor decor',
  },
};

export default steve;
