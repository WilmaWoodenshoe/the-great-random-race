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
  hatSpot: { left: 38, top: -15, width: 34, aspect: 488 / 512 },
  eyeSpot: { left: 47, top: 32, width: 32 },
  neckSpot: { left: 33, top: 42, width: 48 },
  facts: {
    favoriteFood: 'Thee met koekjes',
    dislikes: 'De wasmachine',
    favoriteActivity: 'Geknuffeld worden',
    secretTalent: 'Kan heel lief kijken',
  },
};

export default isabelle;
