/**
 * Mise en forme des nombres et dates à la française, déterministe entre le
 * serveur et le navigateur (pas d'Intl : les séparateurs varient selon l'ICU
 * et feraient diverger l'hydratation).
 */

/** 4104 → « 4 104 » (espace fine insécable). */
export function formatCount(value: number): string {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

const MONTHS_FR = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

/** « 2026-05-22 » → « 22 mai 2026 » ; toute autre forme est rendue telle quelle. */
export function formatDateFr(iso: string): string {
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return iso;
  const [, year, month, day] = match;
  const monthName = MONTHS_FR[Number(month) - 1];
  if (!monthName) return iso;
  const dayNumber = Number(day);
  return `${dayNumber === 1 ? "1er" : dayNumber} ${monthName} ${year}`;
}
