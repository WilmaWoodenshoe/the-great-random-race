import type { PicknickGame } from '../../../models/Picknick';

const steenPapierSchaar: PicknickGame = {
  id: 'steen-papier-schaar',
  name: 'Steen-papier-schaar',
  intro: 'Wie het eerst twee rondes wint. Steve kiest… je raadt het al.',
  order: 2,
  remarks: {
    start: [
      '{naam} schudt {zijn} hand los. Of wat daarvoor doorgaat.',
      '{naam} is er klaar voor. Denkt {hij}.',
      'Wie het eerst twee rondes wint. {naam} telt al.',
    ],
    hint: [
      'Ik kies iets. Of niet.',
      '{naam} kijkt geheimzinnig.',
      '{naam} heeft al gekozen. Zegt {hij}.',
    ],
    playerRound: [
      'Die ronde is voor jou.',
      '{naam} had dat niet zien aankomen.',
      'Punt voor jou. {naam} zucht.',
    ],
    racerRound: [
      'Die ronde is voor {naam}.',
      '{naam} maakt een klein vreugdedansje.',
      'Punt voor {naam}. {Hij} wist het.',
    ],
    tieRound: [
      'Gelijk! Nog een keer.',
      'Jullie kozen hetzelfde. Gezellig.',
      'Gelijk. {naam} vindt dat jullie een team zijn.',
    ],
    playerWins: [
      'Jij wint! {naam} wil een herkansing.',
      'Gewonnen! {naam} geeft je een hand. Of een poot.',
      'Jij wint. {naam} zegt dat {hij} je liet winnen.',
    ],
    racerWins: [
      '{naam} wint! {Hij} vertelt het aan iedereen.',
      '{naam} wint. {Hij} doet alsof het niets was.',
      '{naam} heeft gewonnen. Nog een potje?',
    ],
  },
  traitRemarks: {
    stubborn: {
      hint: ['{naam} kiest wat {hij} altijd kiest.', 'Je weet wat {naam} gaat doen. {Naam} weet het ook.'],
    },
    chaotic: {
      hint: ['{naam} weet zelf nog niet wat {hij} kiest.', 'Misschien steen. Misschien iets anders. Misschien een banaan.'],
    },
    curious: {
      hint: ['{naam} vraagt zich af wat papier eigenlijk is.', '{naam} kijkt naar jouw hand. Heel lang.'],
    },
    lazy: {
      hint: ['{naam} kiest wat het minste moeite kost.', '{naam} gaapt. Dat is geen hint. Of wel.'],
    },
  },
};

export default steenPapierSchaar;
