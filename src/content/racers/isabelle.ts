import type { Racer } from '../../models/Racer';

// Een knuffel. Wordt onderweg steeds geknuffeld, en dat kost tijd.
const isabelle: Racer = {
  id: 'isabelle',
  name: 'Isabelle',
  species: 'Knuffel',
  pronoun: 'zij',
  speed: 1.1,
  traits: { curious: 85, stubborn: 30, chaotic: 45, lazy: 45 },
  title: 'The Huggable',
  tagline: 'Wordt overal geknuffeld. Dat kost tijd.',
  image: 'racers/knuffel.webp',
  // Waar hoed, bril en sjaal zitten (Collectie): punt boven op het hoofd,
  // midden tussen de ogen en de nek, in procenten van de afbeelding.
  wear: {
    aspect: 488 / 512,
    head: { x: 55, y: 9, w: 58 },
    eyes: { x: 69, y: 36, w: 36, angle: -3 },
    neck: { x: 62, y: 63, w: 44 },
  },
  facts: {
    favoriteFood: 'Thee met koekjes',
    dislikes: 'De wasmachine',
    favoriteActivity: 'Geknuffeld worden',
    secretTalent: 'Kan heel lief kijken',
  },
};

export default isabelle;
