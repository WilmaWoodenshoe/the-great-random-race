import type { Racer } from '../../models/Racer';

const ducky: Racer = {
  id: 'ducky',
  name: 'Ducky',
  species: 'Eend',
  speed: 1.3,
  traits: { curious: 60, stubborn: 30, chaotic: 90, lazy: 30 },
  title: 'Chaotic Excellence',
  image: 'racers/eend.webp',
  facts: {
    favoriteFood: 'Broodkruimels',
    dislikes: 'Rechte lijnen',
    favoriteActivity: 'Kortere wegen',
    secretTalent: 'Weet nooit waar hij is',
  },
};

export default ducky;
