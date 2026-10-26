import type { PicknickRacer } from '../../../models/Picknick';

const roger: PicknickRacer = {
  id: 'roger',
  remarks: {
    'boter-kaas-en-eieren': {
      start: ['Roger heeft het bord opgeruimd. Dat was niet de bedoeling.', 'Roger speelt serieus. Roger doet alles serieus.'],
      racerWins: ['Roger wint. Hij gaat meteen weer aan het werk.'],
    },
    'steen-papier-schaar': {
      hint: ['Roger kiest schaar. Roger kiest altijd schaar.', 'Roger heeft zes poten en een plan.'],
      playerWins: ['Jij wint. Roger noteert het. Hij gaat trainen.'],
    },
    memory: {
      pointKnown: ['Roger heeft alles onthouden. Deze.'],
      finished: ['Klaar in {beurten} beurten. Roger schrijft het op.'],
    },
    'bekertje-schuiven': {
      shuffle: ['Roger schuift snel en precies. Roger doet alles precies.'],
      racerWins: ['Roger wint. Hij gaat meteen weer aan het werk.'],
    },
    'mini-sudoku': {
      tip: ['Roger weet het zeker: {plaatje}.'],
      checkBad: ['Roger heeft de fouten al gevonden. Hij wijst ze netjes aan.'],
    },
  },
};

export default roger;
