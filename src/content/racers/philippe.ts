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
  // Waar hoed, bril en sjaal zitten (Collectie): punt boven op het hoofd,
  // midden tussen de ogen en de nek, in procenten van de afbeelding.
  wear: {
    aspect: 498 / 512,
    head: { x: 42, y: 34, w: 28, angle: -6 },
    eyes: { x: 28, y: 56, w: 26 },
    neck: { x: 55, y: 62, w: 22 },
  },
  facts: {
    favoriteFood: 'Kruimels',
    dislikes: 'Verlengsnoeren die te kort zijn',
    favoriteActivity: 'Opladen',
    secretTalent: 'Maakt het parcours schoner',
  },
};

export default philippe;
