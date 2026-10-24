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
  // Waar hoed, bril en sjaal zitten (Collectie): punt boven op het hoofd,
  // midden tussen de ogen en de nek, in procenten van de afbeelding.
  wear: {
    aspect: 720 / 519,
    head: { x: 45, y: 14, w: 30, angle: -10 },
    eyes: { x: 84.5, y: 13, w: 27, angle: 8 },
    neck: { x: 84, y: 66, w: 22 },
  },
  playable: true,
  facts: {
    favoriteFood: 'Sla',
    dislikes: 'Kiezelstenen',
    favoriteActivity: 'Stilstaan',
    secretTalent: 'Verdwijnt soms',
  },
};

export default gerard;
