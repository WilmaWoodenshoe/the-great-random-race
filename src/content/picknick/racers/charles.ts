import type { PicknickRacer } from '../../../models/Picknick';

const charles: PicknickRacer = {
  id: 'charles',
  remarks: {
    'boter-kaas-en-eieren': {
      start: ['Charles won dit spel in 1987 drie keer. Dat zegt hij.', 'Charles legt eerst even uit hoe het vroeger ging.'],
      playerWins: ['Jij wint. In 1987 was het bord groter, zegt Charles.'],
    },
    'steen-papier-schaar': {
      hint: ['Charles koos vroeger altijd papier. Of was het steen?', 'Charles weet nog precies hoe het moet. Ongeveer.'],
      racerWins: ['Charles wint. Net als in 1987.'],
    },
    memory: {
      pointKnown: ['Charles weet het nog precies. Net als in 1987.'],
      miss: ['Mis. In 1987 lagen de kaarten anders, zegt Charles.'],
    },
    'bekertje-schuiven': {
      shuffle: ['Charles schuift zoals vroeger. Met veel gebaren.'],
      playerWins: ['Gevonden. Charles zegt dat hij het expres deed.'],
    },
    'mini-sudoku': {
      tipDoubt: ['Vroeger hoorde daar altijd {plaatje}, zegt Charles.'],
      finished: ['Opgelost! Charles had dit in 1987 sneller gedaan. Zegt hij.'],
    },
  },
};

export default charles;
