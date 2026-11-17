import type {
  ClaimStatus,
  Confidence,
  FigureStatus,
  Grade,
  Indicator,
  Reliability,
  Score,
  ScoreKey,
  SourceRef,
} from "../types";

// Aides d'écriture des fiches issues du registre « Souveraineté industrielle ».
// Elles ne portent aucune donnée : elles raccourcissent la déclaration d'un
// indicateur, d'une source ou des six paliers. La fidélité des chiffres est
// vérifiée par tests/data/registre-tracabilite.test.ts.

export interface IndicatorExtras {
  note?: string;
  /** `metric_id` du registre dont le chiffre est tiré. */
  ids?: string[];
  /** Statut du chiffre au registre (voir FigureStatus). */
  fs?: FigureStatus;
  /** Identifiants de sources du dossier. */
  src?: string[];
  status?: ClaimStatus;
}

export function ind(
  label: string,
  value: string,
  confidence: Confidence,
  extras: IndicatorExtras = {},
): Indicator {
  const { note, ids, fs, src, status } = extras;
  return {
    label,
    value,
    confidence,
    ...(status ? { status } : {}),
    ...(note ? { note } : {}),
    ...(src ? { sources: src } : {}),
    ...(ids ? { metricIds: ids } : {}),
    ...(fs ? { figureStatus: fs } : {}),
  };
}

type SourceType = SourceRef["type"];

export function src(
  id: string,
  publisher: string,
  title: string,
  type: SourceType,
  reliability: Reliability,
  date?: string,
  url?: string,
): SourceRef {
  return {
    id,
    title,
    publisher,
    type,
    reliability,
    ...(date ? { date } : {}),
    ...(url ? { url } : {}),
  };
}

type ScorePlan = Record<ScoreKey, [Grade, string]>;

/** Les six paliers, dans l'ordre de la grille Panoplie. */
export function scoreSet(plan: ScorePlan): Score[] {
  const order: ScoreKey[] = [
    "efficacite-cout",
    "survivabilite",
    "exportabilite",
    "risque-industriel",
    "maturite",
    "confiance-donnees",
  ];
  return order.map((key) => ({ key, grade: plan[key][0], rationale: plan[key][1] }));
}
