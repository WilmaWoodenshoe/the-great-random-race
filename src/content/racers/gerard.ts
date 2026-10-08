import type { Racer } from '../../models/Racer';

const gerard: Racer = {
  id: 'gerard',
  name: 'Gerard',
  species: 'Slak',
  speed: 1.0,
  traits: { curious: 85, stubborn: 75, chaotic: 20, lazy: 60 },
  title: 'The Determined',
  image: 'racers/gerard.webp',
  playable: true,
  hatSpot: { left: 70.6, top: 17.6, width: 18.1, aspect: 720 / 519 },
  facts: {
    favoriteFood: 'Sla',
    dislikes: 'Kiezelstenen',
    favoriteActivity: 'Stilstaan',
    secretTalent: 'Verdwijnt soms',
  },
};

export default gerard;
