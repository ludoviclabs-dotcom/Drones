import type {
  AcquisitionMode,
  BrickKey,
  Confidence,
  Grade,
  Reliability,
  ScoreKey,
  SourceRef,
} from "./types";

export const BRICK_LABELS: Record<BrickKey, string> = {
  finance: "Finance",
  cout: "Coût",
  "supply-chain": "Supply chain",
  geopolitique: "Géopolitique",
  export: "Export",
};

export const BRICK_BLURBS: Record<BrickKey, string> = {
  finance:
    "Comment l'acquisition est financée — budgets, programmes, crédits export, offsets.",
  cout: "Le prix et son cycle de vie — acquisition, heure de vol, maintenance, munitions.",
  "supply-chain":
    "Les dépendances industrielles — composants critiques, fournisseurs, pays d'origine.",
  geopolitique:
    "Ce que le système engage — alliances, dépendances, rapports de force.",
  export:
    "Le régime de cession — autorisations, restrictions et contrôles applicables.",
};

export const BRICK_ORDER: BrickKey[] = [
  "cout",
  "finance",
  "supply-chain",
  "geopolitique",
  "export",
];

export const SCORE_LABELS: Record<ScoreKey, string> = {
  "efficacite-cout": "Efficacité / coût",
  survivabilite: "Survivabilité",
  exportabilite: "Exportabilité",
  "risque-industriel": "Risque industriel",
  maturite: "Maturité",
  "confiance-donnees": "Confiance des données",
};

export const GRADE_META: Record<Grade, { label: string; token: string }> = {
  A: { label: "Excellent", token: "var(--color-grade-a)" },
  B: { label: "Solide", token: "var(--color-grade-b)" },
  C: { label: "Moyen", token: "var(--color-grade-c)" },
  D: { label: "Fragile", token: "var(--color-grade-d)" },
  E: { label: "Critique", token: "var(--color-grade-e)" },
};

export const MODE_LABELS: Record<
  AcquisitionMode,
  { short: string; full: string }
> = {
  FMS: { short: "FMS", full: "Vente d'État à État — Foreign Military Sales" },
  DCS: {
    short: "DCS",
    full: "Vente commerciale directe — Direct Commercial Sales",
  },
  "production-nationale": {
    short: "Production nationale",
    full: "Production nationale ou sous licence",
  },
};

export const CONFIDENCE_META: Record<
  Confidence,
  { label: string; level: 1 | 2 | 3 }
> = {
  haute: { label: "Confiance haute", level: 3 },
  moyenne: { label: "Confiance moyenne", level: 2 },
  faible: { label: "Confiance faible", level: 1 },
};

export const RELIABILITY_LABELS: Record<Reliability, string> = {
  A: "Fiable",
  B: "Généralement fiable",
  C: "À recouper",
  D: "Douteuse",
};

export const SOURCE_TYPE_LABELS: Record<SourceRef["type"], string> = {
  constructeur: "Constructeur",
  institution: "Institution",
  "think-tank": "Think tank",
  presse: "Presse spécialisée",
  officiel: "Document officiel",
};
