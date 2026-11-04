import { formatCount } from "@/lib/format";
import type { FilmData } from "./types";

/**
 * Découpage du film — source unique pour la composition, la barre de
 * chapitres du lecteur, les sous-titres et les liens profonds (`#preuve`).
 *
 * Règle d'écriture des scènes : à `keyFrame` (une seconde avant la fin du
 * chapitre), tout le contenu du chapitre est posé et lisible. Le lecteur s'en
 * sert comme image fixe quand le visiteur demande moins de mouvement, et comme
 * vignette de chapitre.
 */

export const FILM_FPS = 30;
export const FILM_WIDTH = 1920;
export const FILM_HEIGHT = 1080;

/** Fondu d'entrée et de sortie de chaque chapitre, en images. */
export const CHAPTER_FADE = 12;

export type ChapterId =
  | "ouverture"
  | "dossier"
  | "preuve"
  | "comparer"
  | "instruments"
  | "cadre"
  | "a-vous";

interface ChapterSpec {
  id: ChapterId;
  /** Libellé court de la barre de chapitres. */
  label: string;
  /** Titre complet, repris dans le cartouche du film. */
  title: string;
  durationInFrames: number;
  /** Sous-titre éditorial — lu par les lecteurs d'écran, affiché sous le film. */
  caption: (data: FilmData) => string;
}

const SPECS: readonly ChapterSpec[] = [
  {
    id: "ouverture",
    label: "Ouverture",
    title: "Un système d'armes n'est jamais un simple achat",
    durationInFrames: 270,
    caption: (d) =>
      `Panoplie lit ${formatCount(d.stats.systems)} systèmes de défense comme on lit un achat : coût, financement, chaîne industrielle, géopolitique, export.`,
  },
  {
    id: "dossier",
    label: "Un dossier",
    title: "Un dossier, cinq angles",
    durationInFrames: 450,
    caption: (d) =>
      `Un dossier, cinq angles : le ${d.dossier.name}, de la facture au régime d'export. Chaque chiffre affiche son niveau de confiance.`,
  },
  {
    id: "preuve",
    label: "La preuve",
    title: "Chaque chiffre porte sa source",
    durationInFrames: 420,
    caption: (d) =>
      `Chaque affirmation remonte à une source notée de A à D. Le registre en trace ${formatCount(d.stats.claims)}, dont ${formatCount(d.stats.verified)} vérifiées.`,
  },
  {
    id: "comparer",
    label: "Comparer",
    title: "Des paliers, pas un faux score",
    durationInFrames: 330,
    caption: (d) =>
      `${d.compare.left.name} et ${d.compare.right.name} sur la même grille : des paliers argumentés de A à E, pas de faux score chiffré. On lit des arbitrages, pas un vainqueur.`,
  },
  {
    id: "instruments",
    label: "Instruments",
    title: "Manipuler, comparer, relier",
    durationInFrames: 360,
    caption: (d) =>
      `${d.boards.length} planches techniques en 3D, un comparateur et le graphe des dépendances industrielles : passer du dossier à l'analyse.`,
  },
  {
    id: "cadre",
    label: "Le cadre",
    title: "Sources ouvertes, aucun usage opérationnel",
    durationInFrames: 240,
    caption: () =>
      "Sources ouvertes, niveau capacitaire et public. Pas d'aide au ciblage, pas de paramètre tactique, pas de contenu opérationnel.",
  },
  {
    id: "a-vous",
    label: "À vous",
    title: "Ouvrir le recueil",
    durationInFrames: 210,
    caption: (d) =>
      `${formatCount(d.stats.systems)} dossiers, ${d.stats.domains} domaines, une même grille de lecture. À vous d'ouvrir le recueil.`,
  },
];

export interface Chapter extends ChapterSpec {
  /** Rang 1-indexé, formaté « 01 ». */
  num: string;
  /** Première image du chapitre sur la timeline du film. */
  from: number;
  /** Image fixe représentative, relative au début du chapitre. */
  keyFrame: number;
}

export const CHAPTERS: readonly Chapter[] = SPECS.reduce<Chapter[]>(
  (acc, spec, i) => {
    const previous = acc.at(-1);
    const from = previous ? previous.from + previous.durationInFrames : 0;
    acc.push({
      ...spec,
      num: String(i + 1).padStart(2, "0"),
      from,
      keyFrame: spec.durationInFrames - FILM_FPS,
    });
    return acc;
  },
  [],
);

export const FILM_DURATION = CHAPTERS.reduce(
  (sum, chapter) => sum + chapter.durationInFrames,
  0,
);

/** Durée affichée sur les boutons (« 76 s »). */
export const FILM_SECONDS = Math.round(FILM_DURATION / FILM_FPS);

/** Chapitre courant pour une image absolue du film. */
export function chapterAt(frame: number): Chapter {
  const clamped = Math.min(Math.max(frame, 0), FILM_DURATION - 1);
  return (
    CHAPTERS.find(
      (chapter) =>
        clamped >= chapter.from &&
        clamped < chapter.from + chapter.durationInFrames,
    ) ?? CHAPTERS[0]
  );
}

export function chapterById(id: string): Chapter | undefined {
  return CHAPTERS.find((chapter) => chapter.id === id);
}

/** « 1:05 » — minutes:secondes d'une image du film. */
export function formatTimecode(frame: number): string {
  const total = Math.max(0, Math.floor(frame / FILM_FPS));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}
