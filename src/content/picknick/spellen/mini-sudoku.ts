import type { PicknickGame } from '../../../models/Picknick';

const miniSudoku: PicknickGame = {
  id: 'mini-sudoku',
  name: 'Mini-sudoku',
  intro: 'Elk plaatje één keer in elke rij, kolom en vak. De racer geeft tips.',
  role: 'helper',
  order: 5,
  remarks: {
    start: [
      '{naam} kijkt naar het rooster. {Hij} heeft er zin in.',
      'Vier plaatjes, zestien vakjes. {naam} helpt.',
      '{naam} heeft een potlood gepakt. Dat is niet nodig.',
    ],
    tip: [
      'Daar hoort {plaatje}. Zeker weten.',
      '{naam} wijst: {plaatje}, daar.',
      'Volgens {naam} hoort daar {plaatje}. En {naam} heeft gelijk.',
    ],
    tipDoubt: [
      'Daar hoort {plaatje}. Denk ik. Misschien.',
      '{plaatje}? Of niet. {naam} twijfelt.',
      '{naam} gokt {plaatje}. {Hij} kijkt er zelf onzeker bij.',
    ],
    noTip: [
      '{naam} heeft geen idee. Eerlijk is eerlijk.',
      '{naam} kijkt naar het rooster en zegt niets.',
      'Alles is al ingevuld. {naam} kan niets meer zeggen.',
    ],
    checkGood: [
      'Tot nu toe klopt alles. {naam} knikt.',
      'Geen fouten! {naam} is onder de indruk.',
      'Alles goed. {naam} wist het. Natuurlijk.',
    ],
    checkBad: [
      'Een paar vakjes kloppen niet. {naam} zag het ook.',
      'Oei. De rode vakjes nog even bekijken.',
      'Bijna. {naam} wijst naar het rood.',
    ],
    finished: [
      'Opgelost! {naam} is trots. Op jou, en een beetje op zichzelf.',
      'Klaar! {naam} hangt het rooster aan de muur.',
      'Helemaal goed. {naam} vond het makkelijk. Achteraf.',
    ],
  },
  traitRemarks: {
    curious: { tipDoubt: ['{naam} raakte afgeleid, maar zegt toch {plaatje}.'] },
    chaotic: { tipDoubt: ['{plaatje}! Of een banaan. {naam} weet het niet zeker.'] },
    lazy: { noTip: ['{naam} denkt liever niet na. Probeer het zelf eens.'] },
    stubborn: { tip: ['{plaatje}. {naam} blijft erbij.'] },
  },
};

export default miniSudoku;
