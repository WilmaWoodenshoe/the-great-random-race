import type { PicknickGame } from '../../../models/Picknick';

const memory: PicknickGame = {
  id: 'memory',
  name: 'Memory',
  intro: 'Zoek de paren. De racer kijkt mee en wijst soms iets aan.',
  role: 'helper',
  order: 3,
  remarks: {
    start: [
      '{naam} kijkt mee. {Hij} heeft een goed geheugen. Zegt {hij}.',
      'Zes paren. {naam} helpt. Een beetje.',
      '{naam} gaat naast je zitten. Gezellig.',
    ],
    point: [
      'Die. Nee, die. Nee, toch die.',
      '{naam} wijst een kaart aan. Gewoon omdat die mooi is.',
      '{naam} vindt deze kaart leuk. Waarom weet niemand.',
    ],
    pointKnown: [
      '{naam} weet het zeker: deze.',
      'Ik wist dat het die was. Ik zei het alleen niet.',
      '{naam} heeft opgelet. Deze!',
    ],
    pointSame: [
      '{naam} wijst weer dezelfde kaart aan.',
      'Deze. Dat zei {naam} vorige keer ook.',
      '{naam} blijft bij {zijn} kaart.',
    ],
    noTip: [
      '{naam} kijkt even niet.',
      '{naam} laat het aan jou over.',
      '{naam} rust {zijn} ogen uit.',
    ],
    match: [
      'Een paar! {naam} klapt.',
      'Gevonden. {naam} wist het al. Echt.',
      'Mooi zo. {naam} knikt goedkeurend.',
    ],
    miss: [
      'Net niet. {naam} had het anders gedaan.',
      'Hmm. {naam} onthoudt het. Misschien.',
      'Die twee horen niet bij elkaar. {naam} vindt het jammer.',
    ],
    finished: [
      'Alle paren gevonden in {beurten} beurten! {naam} is trots op jullie.',
      'Klaar! {beurten} beurten. {naam} noemt het teamwerk.',
      'Gelukt in {beurten} beurten. {naam} wil het nog een keer.',
    ],
  },
  traitRemarks: {
    curious: { point: ['{naam} vindt deze het mooist. Daar is {hij} van overtuigd.'] },
    stubborn: { pointSame: ['{naam} wijst {zijn} kaart aan. Altijd die kaart.'] },
    lazy: { noTip: ['{naam} wijst niets aan. Wijzen is moeite.'] },
    chaotic: { point: ['{naam} wijst drie kaarten tegelijk aan. Kies er maar een.'] },
  },
};

export default memory;
