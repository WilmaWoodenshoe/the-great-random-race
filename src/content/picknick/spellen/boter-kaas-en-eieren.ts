import type { PicknickGame } from '../../../models/Picknick';

const boterKaasEnEieren: PicknickGame = {
  id: 'boter-kaas-en-eieren',
  name: 'Boter-kaas-en-eieren',
  intro: 'Drie op een rij. Jij zet blaadjes, de racer zet zichzelf.',
  order: 1,
  remarks: {
    start: [
      '{naam} gaat er eens goed voor zitten.',
      '{naam} kijkt naar het bord. Het bord kijkt terug.',
      '{naam} heeft dit spel vaker gespeeld. Zegt {hij}.',
    ],
    think: [
      '{naam} denkt na.',
      '{naam} telt de vakjes. Het zijn er nog steeds negen.',
      'Hmm, zegt {naam}.',
    ],
    opening: [
      '{naam} begint linksboven. {naam} begint altijd linksboven.',
      'Linksboven. Natuurlijk.',
      '{naam} kiest linksboven. Zoals altijd. Zoals vroeger.',
    ],
    distracted: [
      '{naam} zag een bloem. {Hij} weet niet meer waar {hij} was.',
      '{naam} keek even naar een vlinder. Daar staat nu een teken.',
      '{naam} zette iets neer. Waarom daar? Niemand weet het.',
    ],
    nap: [
      '{naam} doet een dutje. Jij bent weer aan de beurt.',
      '{naam} rust even uit. Van het nadenken.',
      '{naam} slaat een beurt over. Gewoon omdat het kan.',
    ],
    pass: [
      '{naam} heeft gepast. Opnieuw.',
      '{naam} doet niets. Dat is ook een zet.',
      '{naam} kijkt naar het bord. Verder niets.',
    ],
    playerWins: [
      'Jij wint! {naam} doet alsof {hij} het zo bedoeld had.',
      'Drie op een rij. {naam} applaudisseert. Een beetje.',
      'Gewonnen! {naam} wil er niet over praten.',
    ],
    racerWins: [
      '{naam} wint! {Hij} is er zelf het meest verbaasd over.',
      '{naam} heeft drie op een rij. {Hij} laat het je drie keer zien.',
      '{naam} wint. {Hij} wil meteen nog een potje.',
    ],
    draw: [
      'Gelijkspel. {naam} noemt het een overwinning.',
      'Niemand wint. {naam} vindt dat prima.',
      'Het bord is vol. {naam} ook.',
    ],
  },
  traitRemarks: {
    curious: {
      start: ['{naam} wil eerst weten waarom het boter-kaas-en-eieren heet.', '{naam} bekijkt elk vakje van dichtbij.'],
      playerWins: ['Jij wint. {naam} was net naar iets anders aan het kijken.'],
    },
    stubborn: {
      start: ['{naam} weet al precies waar {hij} begint.', '{naam} heeft een plan. Hetzelfde plan als altijd.'],
      racerWins: ['{naam} wint. Met hetzelfde plan als altijd.'],
    },
    chaotic: {
      start: ['{naam} heeft geen plan. Dat is het plan.', '{naam} gaat het gewoon proberen.'],
      racerWins: ['{naam} heeft gewonnen. {Hij} weet niet hoe.'],
    },
    lazy: {
      start: ['{naam} speelt mee. Liggend.', '{naam} hoopt dat het een kort potje wordt.'],
      playerWins: ['Jij wint. {naam} is opgelucht dat het voorbij is.'],
    },
  },
};

export default boterKaasEnEieren;
