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
  hatSpot: { left: 36, top: -19, width: 28, rotate: -5, aspect: 512 / 433 },
  eyeSpot: { left: 36, top: 54, width: 34 },
  neckSpot: { left: 28, top: 68, width: 44 },
  facts: {
    favoriteFood: 'Onbekend',
    dislikes: 'Niets',
    favoriteActivity: 'Liggen',
    secretTalent: 'Wordt aangezien voor decor',
  },
};

export default steve;
