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
    memory: {
      point: ['Isabelle wijst de kaart aan die het liefst kijkt.'],
      finished: ['Alle paren gevonden! Isabelle wil iedereen een knuffel geven.'],
    },
    'bekertje-schuiven': {
      shuffle: ['Isabelle schuift voorzichtig. Steve mag geen pijn doen.'],
      racerWins: ['Mis! Isabelle troost je met een knuffel.'],
    },
    'mini-sudoku': {
      tipDoubt: ['Isabelle vindt {plaatje} het liefst. Daarom zegt ze {plaatje}.'],
      checkGood: ['Alles klopt! Isabelle is zo blij voor je.'],
    },
  },
};

export default isabelle;
