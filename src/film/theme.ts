import { Easing } from "remotion";
import type { FilmConfidence, FilmGrade, FilmLayout } from "./types";

/**
 * Jetons visuels du film — les valeurs de `src/app/globals.css`, recopiées en
 * dur : le rendu MP4 (CLI Remotion) ne charge pas la feuille du site.
 * Toute évolution de la charte se reporte ici.
 */
export const C = {
  bg: "#16150f",
  surface: "#1e1d14",
  surface2: "#272517",
  panel: "#1a1912",
  paper: "#d8cfb5",
  paperShade: "#ccc2a4",
  inkPaper: "#201d14",
  inkPaperDim: "#595139",
  linePaper: "#ada27e",
  line: "#33301f",
  lineBright: "#4c4731",
  ink: "#ece6d5",
  inkDim: "#9c9783",
  inkFaint: "#948d79",
  accent: "#e07a4d",
  accentDeep: "#a8521f",
  accentPaper: "#8a3f12",
  stamp: "#6d8a9a",
} as const;

export const GRADE_COLORS: Record<FilmGrade, string> = {
  A: "#61805a",
  B: "#888a48",
  C: "#b3823a",
  D: "#b9602e",
  E: "#a83a2c",
};

export const GRADE_LABELS: Record<FilmGrade, string> = {
  A: "Excellent",
  B: "Solide",
  C: "Moyen",
  D: "Fragile",
  E: "Critique",
};

export const CONFIDENCE_LEVEL: Record<FilmConfidence, 1 | 2 | 3> = {
  haute: 3,
  moyenne: 2,
  faible: 1,
};

/**
 * Familles : dans le lecteur du site, les variables posées par next/font ;
 * au rendu CLI, les mêmes fontes chargées par @remotion/google-fonts.
 */
export const FONT = {
  serif: 'var(--font-newsreader, "Newsreader"), Georgia, "Times New Roman", serif',
  mono: 'var(--font-plex-mono, "IBM Plex Mono"), ui-monospace, "SF Mono", Menlo, monospace',
  sans: 'var(--font-plex-sans, "IBM Plex Sans"), ui-sans-serif, system-ui, sans-serif',
} as const;

/** Courbe de sortie du site (`cubic-bezier(0.22, 1, 0.36, 1)`). */
export const EASE_OUT = Easing.bezier(0.22, 1, 0.36, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);

/**
 * Échelle typographique et marges de sécurité, par orientation.
 * Pensée pour la lecture dans un lecteur réduit (≈ 0,55× en 16:9 sur un
 * portable, ≈ 0,35× en 9:16 sur un téléphone) : rien de lu ne descend sous
 * 26 px de composition.
 */
export interface FilmScale {
  /** Marge latérale de la zone utile. */
  padX: number;
  /** Marge haute (sous le cartouche) et basse (au-dessus du pied). */
  padTop: number;
  padBottom: number;
  /** Titre principal (serif). */
  display: number;
  /** Titre de chapitre (serif). */
  title: number;
  /** Texte d'appui (sans). */
  body: number;
  /** Valeur mise en avant (serif). */
  figure: number;
  /** Étiquette mono capitales. */
  label: number;
  /** Petite étiquette mono (cartouche, pieds). */
  micro: number;
}

export const SCALE: Record<FilmLayout, FilmScale> = {
  paysage: {
    padX: 150,
    padTop: 150,
    padBottom: 130,
    display: 128,
    title: 84,
    body: 40,
    figure: 64,
    label: 28,
    micro: 22,
  },
  portrait: {
    padX: 90,
    padTop: 220,
    padBottom: 200,
    display: 112,
    title: 80,
    body: 44,
    figure: 62,
    label: 30,
    micro: 24,
  },
};

/** Interligne mono capitales du site (tracking 0.16–0.22em). */
export const TRACKING = {
  label: "0.18em",
  micro: "0.2em",
} as const;
