import type { PicknickRacer } from '../../../models/Picknick';

const isabelle: PicknickRacer = {
  id: 'isabelle',
  remarks: {
    'boter-kaas-en-eieren': {
      start: ['Isabelle wil eerst een knuffel. Daarna pas spelen.', 'Isabelle vindt alle vakjes even lief.'],
      racerWins: ['Isabelle wint! Ze geeft je een troostknuffel.'],
    },
    'steen-papier-schaar': {
      hint: ['Isabelle kiest papier. Dan kan ze je een briefje schrijven.', 'Isabelle wil niet tegen je, ze wil met je.'],
      playerWins: ['Jij wint. Isabelle is er blij om. Voor jou.'],
    },
  },
};

export default isabelle;
