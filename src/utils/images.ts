/** Volledige link naar een afbeelding in public/images/. */
export function img(path: string): string {
  return `${import.meta.env.BASE_URL}images/${path}`;
}
