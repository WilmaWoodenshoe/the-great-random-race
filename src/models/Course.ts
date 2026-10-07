/** Een punt op de kaartafbeelding, in pixels van de originele afbeelding. */
export interface MapPoint {
  x: number;
  y: number;
}

/** Eén deel van het parcours, bijv. 'Modderveld'. */
export interface CourseSegment {
  id: string;
  name: string;
  /** Naam in een zin, bijv. 'het Modderveld' of 'de Heuvel'. */
  withArticle: string;
  /** Aandeel van de totale afstand, tussen 0 en 1. Samen precies 1. */
  share: number;
  /** Terrein-modifier op de snelheid (1,00 = normaal). */
  terrain: number;
  /** Waar het bordje van dit deel op de kaart staat. */
  sign: MapPoint;
}

/** Een route zoals hij in src/content/courses/ staat. */
export interface Course {
  id: string;
  name: string;
  /** Lengte zoals de speler die ziet, in kilometers. */
  lengthKm: number;
  /** Duur van de race in dagen. */
  days: number;
  map: {
    /** Kaartafbeelding, relatief aan public/images/. */
    image: string;
    width: number;
    height: number;
    /** Waar het finishlabel op de kaart staat. */
    finish: MapPoint;
  };
  segments: CourseSegment[];
}
