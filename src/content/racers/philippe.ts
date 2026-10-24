import type { Racer } from '../../models/Racer';

// Een stofzuiger. Erg snel, maar moet steeds terug naar het stopcontact
// (hoge luiheid: lange 'dutjes' om op te laden).
const philippe: Racer = {
  id: 'philippe',
  name: 'Philippe',
  species: 'Stofzuiger',
  speed: 1.12,
  traits: { curious: 20, stubborn: 55, chaotic: 35, lazy: 80 },
  title: 'The Clean Sweep',
  tagline: 'Moet steeds terug naar het stopcontact.',
  image: 'racers/stofzuiger.webp',
  hatSpot: { left: 22, top: 14, width: 27, rotate: -6, aspect: 498 / 512 },
  facts: {
    favoriteFood: 'Kruimels',
    dislikes: 'Verlengsnoeren die te kort zijn',
    favoriteActivity: 'Opladen',
    secretTalent: 'Maakt het parcours schoner',
  },
};

export default philippe;
