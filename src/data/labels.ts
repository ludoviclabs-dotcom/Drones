import type {
  AcquisitionMode,
  AirDefenseClass,
  BrickKey,
  ClaimStatus,
  CombatAircraftClass,
  CombatSystemClass,
  Confidence,
  Grade,
  MissileRole,
  NavalMission,
  NavalVesselClass,
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
  "naval-vessel": "Bâtiments navals",
  "air-defense": "Défense aérienne",
  "combat-system": "Systèmes de combat / C2",
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

export const NAVAL_VESSEL_LABELS: Record<NavalVesselClass, string> = {
  "porte-avions": "Porte-avions",
  destroyer: "Destroyer / frégate AAW",
  fregate: "Frégate",
  corvette: "Corvette",
  "sous-marin": "Sous-marin",
  patrouilleur: "Patrouilleur",
  amphibie: "Bâtiment amphibie",
};

export const NAVAL_VESSEL_ORDER: NavalVesselClass[] = [
  "porte-avions",
  "destroyer",
  "fregate",
  "corvette",
  "sous-marin",
  "patrouilleur",
  "amphibie",
];

export const NAVAL_VESSEL_BLURBS: Record<NavalVesselClass, string> = {
  "porte-avions":
    "Projection aéronavale, C2, groupe aérien embarqué et dépendances MCO lourdes.",
  destroyer:
    "Défense aérienne de zone, BMD, escorte de flotte et forte densité VLS / radar.",
  fregate:
    "Escorte de premier rang, ASM/AAW/ASuW, capteurs, CMS, VLS et hélicoptère.",
  corvette:
    "Combat littoral et export : format compact, armement dense, endurance bornée.",
  "sous-marin":
    "Déni d'accès, discrétion acoustique, capteurs sous-marins, torpilles et missiles.",
  patrouilleur:
    "Présence souveraine, police maritime, ZEE et rapport coût/effet en basse intensité.",
  amphibie:
    "Projection de forces, commandement, aviation tournante, chalands et missions duales.",
};

export const NAVAL_MISSION_LABELS: Record<NavalMission, string> = {
  AAW: "Défense aérienne",
  ASW: "Lutte ASM",
  ASuW: "Anti-surface",
  strike: "Frappe",
  amphibie: "Amphibie",
  projection: "Projection",
  presence: "Présence",
  MCM: "Guerre des mines",
  BMD: "Défense antimissile",
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

export const AIR_DEFENSE_LABELS: Record<AirDefenseClass, string> = {
  VSHORAD: "Très courte portée (VSHORAD)",
  SHORAD: "Courte portée (SHORAD)",
  MRAD: "Moyenne portée (MRAD)",
  LRAD: "Longue portée (LRAD / HIMAD)",
  BMD: "Antimissile balistique (BMD)",
  "C-RAM": "Anti-roquettes & rapprochée (C-RAM)",
  "C-UAS": "Anti-drones (C-UAS)",
};

export const AIR_DEFENSE_ORDER: AirDefenseClass[] = [
  "VSHORAD",
  "SHORAD",
  "MRAD",
  "LRAD",
  "BMD",
  "C-RAM",
  "C-UAS",
];

export const AIR_DEFENSE_BLURBS: Record<AirDefenseClass, string> = {
  VSHORAD: "Défense rapprochée — drones, hélicoptères, menaces à très courte portée.",
  SHORAD: "Couche courte portée — protection de site et bulle tactique.",
  MRAD: "Couche moyenne portée — aéronefs, missiles de croisière, défense de zone.",
  LRAD: "Longue portée et haute altitude — défense de zone étendue et antimissile.",
  BMD: "Interception de missiles balistiques — couches endo et exo-atmosphériques.",
  "C-RAM": "Contre roquettes, obus et mortiers — réaction très rapide, faible coût par tir.",
  "C-UAS": "Lutte anti-drones — détection fine et effecteurs adaptés aux petites cibles.",
};

export const COMBAT_SYSTEM_LABELS: Record<CombatSystemClass, string> = {
  "naval-cms": "Système de combat naval (CMS)",
  "iamd-c2": "Commandement IAMD (C2)",
  c4isr: "C4ISR",
  collaboratif: "Combat collaboratif",
};

export const COMBAT_SYSTEM_ORDER: CombatSystemClass[] = [
  "naval-cms",
  "iamd-c2",
  "c4isr",
  "collaboratif",
];

export const COMBAT_SYSTEM_BLURBS: Record<CombatSystemClass, string> = {
  "naval-cms": "Le cerveau d'un navire — fusion capteurs, conduite de tir et armes.",
  "iamd-c2": "Commandement de la défense aérienne et antimissile — tout capteur, tout effecteur.",
  c4isr: "Commandement, contrôle, communications, renseignement et surveillance.",
  collaboratif: "Engagement coopératif en réseau — partage de pistes entre plateformes.",
};
