import type { PicknickRacer } from '../../../models/Picknick';

const mrM: PicknickRacer = {
  id: 'ducky',
  remarks: {
    'boter-kaas-en-eieren': {
      start: ['Mr. M doet maar wat. Dat werkt soms.', 'Mr. M zit op het verkeerde bord. Hij gaat wel even goed zitten.'],
      racerWins: ['Mr. M heeft gewonnen. Hij weet niet hoe.'],
    },
    'steen-papier-schaar': {
      hint: ['Ik kies iets. Of niet.', 'Mr. M kwaakt drie keer. Dat betekent niets.'],
      racerWins: ['Mr. M wint. Hij koos papier, zegt hij. Het was schaar.'],
    },
    memory: {
      point: ['Mr. M wijst naar een kaart. Of naar een vlieg. Moeilijk te zeggen.'],
      match: ['Een paar! Mr. M kwaakt van blijdschap.'],
    },
    'bekertje-schuiven': {
      shuffle: ['Mr. M schuift alle kanten op. Ook een keer van de tafel.'],
      playerWins: ['Gevonden! Mr. M weet zelf niet meer waar Steve lag.'],
    },
    'mini-sudoku': {
      tipDoubt: ['{plaatje}! Zegt Mr. M. Hij zegt maar wat.'],
      start: ['Mr. M gaat helpen. Dat kan alle kanten op gaan.'],
    },
  },
};

export default mrM;
