/**
 * Contrat de données du film « Panoplie en 80 secondes ».
 *
 * Le film ne lit jamais `@/data` directement : il reçoit ce paquet sérialisable
 * (inputProps Remotion), construit côté serveur par `buildFilmData()`. Le
 * lecteur du site n'embarque ainsi que quelques kilo-octets de données, et le
 * rendu MP4 (CLI Remotion) part exactement des mêmes chiffres que le site.
 */

export type FilmConfidence = "haute" | "moyenne" | "faible";
export type FilmGrade = "A" | "B" | "C" | "D" | "E";
export type FilmReliability = "A" | "B" | "C" | "D";

/** Orientation de la composition : 16:9 (site, salon) ou 9:16 (mobile, réseaux). */
export type FilmLayout = "paysage" | "portrait";

export interface FilmIndicator {
  label: string;
  value: string;
  confidence: FilmConfidence;
  /** Libellé du statut au registre : « Vérifié », « À recouper », « Variable ». */
  statusLabel: string;
}

export interface FilmAngle {
  key: string;
  /** « 01 » à « 05 ». */
  num: string;
  /** Coût, Financement, Chaîne industrielle, Géopolitique, Export. */
  label: string;
  /** Première phrase du narratif de la brique. */
  lede: string;
  indicator: FilmIndicator;
}

export interface FilmSource {
  publisher: string;
  title: string;
  /** « Constructeur », « Document officiel »… */
  typeLabel: string;
  reliability: FilmReliability;
  /** « Fiable », « Généralement fiable »… */
  reliabilityLabel: string;
  /** Date de publication formatée, si la source en porte une. */
  dateLabel?: string;
}

export interface FilmProof {
  /** Angle dont provient l'affirmation (« Financement »). */
  angleLabel: string;
  claimLabel: string;
  value: string;
  confidence: FilmConfidence;
  confidenceLabel: string;
  statusLabel: string;
  source: FilmSource;
}

export interface FilmCompareRow {
  label: string;
  left: FilmGrade;
  right: FilmGrade;
}

export interface FilmCompare {
  left: { name: string; reference: string; country: string };
  right: { name: string; reference: string; country: string };
  rows: FilmCompareRow[];
}

export interface FilmBoard {
  title: string;
  kind: string;
  /** Chemin public de la vignette (`/images/hud/…`). */
  src: string;
}

export interface FilmGraphRow {
  system: string;
  company?: { label: string; relation: string };
  country?: { label: string; relation: string };
}

export interface FilmStats {
  systems: number;
  domains: number;
  sources: number;
  claims: number;
  verified: number;
  /** Date d'arrêté du registre, formatée (« 19 juin 2026 »). */
  updatedLabel: string;
}

export interface FilmData {
  /** Nom et hôte du site (« drones-mu.vercel.app »), pour le carton final. */
  site: { name: string; host: string };
  stats: FilmStats;
  /** Libellés des domaines, dans l'ordre du site. */
  domains: string[];
  dossier: {
    slug: string;
    name: string;
    reference: string;
    manufacturer: string;
    classLabel: string;
    country: string;
    updatedLabel?: string;
    angles: FilmAngle[];
  };
  proof: FilmProof;
  compare: FilmCompare;
  boards: FilmBoard[];
  graph: FilmGraphRow[];
}

/** Props de la composition — un objet, comme l'exige `inputProps`. */
export interface FilmProps extends Record<string, unknown> {
  data: FilmData;
}

/** Props communes des scènes (un chapitre = une scène). */
export interface SceneProps extends Record<string, unknown> {
  data: FilmData;
}
