import type { PicknickRacer } from '../../../models/Picknick';

const kevin: PicknickRacer = {
  id: 'kevin',
  remarks: {
    'boter-kaas-en-eieren': {
      nap: ['Kevin doet een dutje. Jij bent weer aan de beurt.'],
      think: ['Kevin was wakker voor deze zet. Dat telt.', 'Kevin kruipt over het bord. Alle pootjes tegelijk.'],
    },
    'steen-papier-schaar': {
      hint: ['Kevin heeft veel pootjes. Hij kan alles tegelijk kiezen.', 'Kevin gaapt. Hij kiest het eerste wat in hem opkomt.'],
      racerWins: ['Kevin wint. Hij was nog half aan het slapen.'],
    },
    memory: {
      noTip: ['Kevin doet een dutje op de kaarten. Voorzichtig.'],
      match: ['Een paar! Kevin werd er wakker van.'],
    },
    'bekertje-schuiven': {
      shuffle: ['Kevin schuift met al zijn pootjes tegelijk.'],
      racerWins: ['Kevin wint. Hij weet zelf niet hoe, hij sliep half.'],
    },
    'mini-sudoku': {
      noTip: ['Kevin is in slaap gevallen boven het rooster.'],
      tipDoubt: ['Kevin mompelt {plaatje}. Misschien droomt hij.'],
    },
  },
};

export default kevin;
