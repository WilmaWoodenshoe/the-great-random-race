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
  facts: {
    favoriteFood: 'Thee met koekjes',
    dislikes: 'De wasmachine',
    favoriteActivity: 'Geknuffeld worden',
    secretTalent: 'Kan heel lief kijken',
  },
};

export default isabelle;
