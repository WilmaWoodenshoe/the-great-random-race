/**
 * True in de testversie (GitHub Pages) en tijdens het ontwikkelen. Alleen
 * dan zijn de testhulpjes zichtbaar, zoals de tijdmachine. Op
 * thegreatrandomrace.nl staan ze uit.
 */
export const isTestVersion: boolean = import.meta.env.DEV || import.meta.env.VITE_TESTVERSIE === '1';
