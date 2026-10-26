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
  },
};

export default bintje;
