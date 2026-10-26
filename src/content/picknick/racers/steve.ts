import type { PicknickRacer } from '../../../models/Picknick';

const steve: PicknickRacer = {
  id: 'steve',
  remarks: {
    'boter-kaas-en-eieren': {
      pass: ['Steve heeft gepast. Opnieuw.', 'Steve ligt naast het bord. Dat is zijn zet.'],
      playerWins: ['Jij wint. Steve heeft het niet gemerkt.'],
    },
    'steen-papier-schaar': {
      hint: ['Ik denk dat ik… steen neem.', 'Steve zegt niets. Steve is een steen.'],
      streak: ['Steve kiest voor de {aantal}e keer op rij steen. Hij is een steen.', 'Steen. Voor de {aantal}e keer op rij. Steve is consequent.'],
    },
  },
};

export default steve;
