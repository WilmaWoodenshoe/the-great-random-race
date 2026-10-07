export type AccessoryKind = 'hoed' | 'ogen' | 'rugzak' | 'speciaal';

/** Een accessoire zoals het in src/content/accessories/ staat. */
export interface Accessory {
  id: string;
  name: string;
  kind: AccessoryKind;
  /** Afbeelding, relatief aan public/images/. */
  image: string;
}
