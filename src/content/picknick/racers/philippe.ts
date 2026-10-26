import type { PicknickRacer } from '../../../models/Picknick';

const philippe: PicknickRacer = {
  id: 'philippe',
  remarks: {
    'boter-kaas-en-eieren': {
      nap: ['Philippe moet even naar het stopcontact. Hij is zo terug.'],
      start: ['Philippe zuigt eerst het bord schoon.', 'Philippe zoemt. Hij is er klaar voor.'],
    },
    'steen-papier-schaar': {
      hint: ['Philippe kiest steen. Die zuigt hij daarna op.', 'Philippe heeft geen handen, alleen een slang. Hij doet zijn best.'],
      racerWins: ['Philippe wint. Hij maakt een tevreden zuiggeluid.'],
    },
    memory: {
      noTip: ['Philippe moet even naar het stopcontact. Hij is zo terug.'],
      miss: ['Mis. Philippe zuigt de kaarten even schoon.'],
    },
    'bekertje-schuiven': {
      shuffle: ['Philippe schuift met zijn slang. Er gaat bijna een bekertje in.'],
      playerWins: ['Gevonden! Philippe zoemt tevreden.'],
    },
    'mini-sudoku': {
      tip: ['Philippe wijst met zijn slang: {plaatje}.'],
      noTip: ['Philippe is even leeg. Hij moet aan de lader.'],
    },
  },
};

export default philippe;
