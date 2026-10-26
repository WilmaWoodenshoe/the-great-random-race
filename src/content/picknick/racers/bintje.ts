import type { PicknickRacer } from '../../../models/Picknick';

const bintje: PicknickRacer = {
  id: 'bintje',
  remarks: {
    'boter-kaas-en-eieren': {
      start: ['Bintje ligt. Bintje blijft liggen.', 'Bintje speelt mee. Vanaf de bank.'],
      nap: ['Bintje doet even niets. Dat doet Bintje graag.'],
    },
    'steen-papier-schaar': {
      hint: ['Bintje kiest… aardappel. Dat bestaat niet, Bintje.', 'Bintje heeft geen handen. Bintje kiest toch.'],
      playerWins: ['Jij wint. Bintje vindt het best.'],
    },
    memory: {
      noTip: ['Bintje ligt. Bintje kijkt niet mee.'],
      match: ['Een paar! Bintje rolt een klein stukje opzij van blijdschap.'],
    },
    'bekertje-schuiven': {
      shuffle: ['Bintje schuift één keer. Dat was het.'],
      playerWins: ['Gevonden. Bintje vindt het best.'],
    },
    'mini-sudoku': {
      noTip: ['Bintje denkt liever niet na. Bintje ligt liever.'],
      tip: ['Bintje zegt {plaatje}. Bintje heeft gelijk. Bintje gaat weer liggen.'],
    },
  },
};

export default bintje;
