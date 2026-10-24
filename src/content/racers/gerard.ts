import type { Racer } from '../../models/Racer';

const gerard: Racer = {
  id: 'gerard',
  name: 'Gerard',
  species: 'Slak',
  speed: 1.0,
  traits: { curious: 85, stubborn: 75, chaotic: 20, lazy: 60 },
  title: 'The Determined',
  tagline: 'Langzaam, maar met overtuiging.',
  image: 'racers/gerard.webp',
  playable: true,
  hatSpot: { left: 27, top: -8, width: 26, rotate: -8, aspect: 720 / 519 }, // op het huisje
  eyeSpot: { left: 75, top: 13, width: 21, rotate: 5 },
  neckSpot: { left: 66, top: 45, width: 28 },
  facts: {
    favoriteFood: 'Sla',
    dislikes: 'Kiezelstenen',
    favoriteActivity: 'Stilstaan',
    secretTalent: 'Verdwijnt soms',
  },
};

export default gerard;
