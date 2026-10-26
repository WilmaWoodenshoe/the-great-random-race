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
  },
};

export default roger;
