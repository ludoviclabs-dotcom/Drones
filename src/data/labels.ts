import type {
  AcquisitionMode,
  BrickKey,
  ClaimStatus,
  CombatAircraftClass,
  Confidence,
  Grade,
  MissileRole,
  RadarRole,
  Reliability,
  RoadmapHorizon,
  ScoreKey,
  SourceRef,
  SystemCategory,
  TimelineKind,
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

export const CATEGORY_LABELS: Record<SystemCategory, string> = {
  drone: "Drones",
  "directed-energy": "Énergie dirigée",
  "combat-aircraft": "Aviation de combat",
  missile: "Missiles",
  radar: "Radars",
};

export const GENERATION_LABELS: Record<CombatAircraftClass, string> = {
  "gen-4": "4e génération modernisée",
  "gen-4-5": "4.5e génération",
  "gen-5": "5e génération",
  "gen-6": "6e génération",
};

export const MISSILE_ROLE_LABELS: Record<MissileRole, string> = {
  AAM: "Air-air",
  ASM: "Air-surface",
  SSM: "Surface-surface",
  SAM: "Surface-air",
  ARM: "Anti-radiation · SEAD",
};

export const MISSILE_ROLE_BLURBS: Record<MissileRole, string> = {
  AAM: "Engagement de cibles aériennes — supériorité aérienne et défense de point.",
  ASM: "Frappe sur cibles terrestres ou navales — précision, standoff, deep strike.",
  SSM: "Tir sol-sol — roquettes guidées, tactiques, balistiques, anti-navire.",
  SAM: "Défense aérienne et antimissile — couches courte, moyenne et longue portée.",
  ARM: "Neutralisation des défenses aériennes — SEAD / DEAD anti-radar.",
};

export const RADAR_ROLE_LABELS: Record<RadarRole, string> = {
  "alerte-avancee": "Alerte avancée",
  "multi-mission": "Multi-mission GBAD",
  "naval-mfr": "Naval multifonction",
  bmd: "Antimissile balistique",
  "aeroporte-aesa": "Aéroporté AESA",
  cuas: "C-UAS",
};

export const RADAR_ROLE_BLURBS: Record<RadarRole, string> = {
  "alerte-avancee":
    "Veille longue portée — détection précoce d'aéronefs, missiles balistiques et menaces basse observabilité.",
  "multi-mission":
    "Surveillance, acquisition et engagement quality — la colonne vertébrale des défenses sol-air modernes.",
  "naval-mfr":
    "Radars navals à panneaux fixes — conduite de tir, guidage missile et auto-défense de flotte.",
  bmd: "Détection, suivi et discrimination des menaces balistiques — capteurs sensibles, faiblement exportables.",
  "aeroporte-aesa":
    "AESA de chasse, AEW&C et SAR/GMTI — fusion capteurs, EW/EA et désignation d'objectif.",
  cuas: "Détection de petites cibles et drones — résolution élevée, cadence de revisite forte.",
};

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
  cooperatif: {
    short: "Coopératif",
    full: "Programme coopératif multinational",
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

export const STATUS_LABELS: Record<ClaimStatus, string> = {
  verifie: "Vérifié",
  "a-recouper": "À recouper",
  variable: "Variable",
};

export const ROADMAP_HORIZON_LABELS: Record<RoadmapHorizon, string> = {
  "en-cours": "En cours",
  prochain: "Prochain",
  exploratoire: "À l'étude",
};

export const TIMELINE_KIND_LABELS: Record<TimelineKind, string> = {
  jalon: "Jalon",
  emploi: "Emploi",
  export: "Export",
  debat: "Débat",
};
