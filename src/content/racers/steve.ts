import type { Racer } from '../../models/Racer';

const steve: Racer = {
  id: 'steve',
  name: 'Steve',
  species: 'Steen',
  speed: 0.15,
  traits: { curious: 5, stubborn: 100, chaotic: 1, lazy: 100 },
  title: 'Still Going',
  image: 'racers/steen.webp',
  facts: {
    favoriteFood: 'Onbekend',
    dislikes: 'Niets',
    favoriteActivity: 'Liggen',
    secretTalent: 'Wordt aangezien voor decor',
  },
};

export default steve;
