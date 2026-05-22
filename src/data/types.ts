// Modèle de données — plateforme d'intelligence sur les systèmes de défense.
// L'entité de base est un « système » doté d'une catégorie. Le catalogue couvre
// les drones, l'énergie dirigée et l'aviation de combat ; le modèle reste
// générique pour l'extension future (systèmes sol-air, missiles).

export type SystemCategory = "drone" | "directed-energy" | "combat-aircraft";

export type DroneClass =
  | "MALE"
  | "HALE"
  | "UCAV"
  | "ISR"
  | "munition-rodeuse"
  | "kamikaze"
  | "ravitailleur"
  | "USV";

/** Classe d'un système d'énergie dirigée. */
export type DirectedEnergyClass = "HEL" | "HPM" | "SHORAD-hybride";

/** Génération d'un avion de combat — lecture évaluée par Panoplie. */
export type CombatAircraftClass = "gen-4" | "gen-4-5" | "gen-5" | "gen-6";

/** Modes d'acquisition — la grille de lecture qui relie les cinq briques. */
export type AcquisitionMode =
  | "FMS"
  | "DCS"
  | "production-nationale"
  | "cooperatif";

export type Confidence = "haute" | "moyenne" | "faible";

/** Fiabilité d'une source, échelle OTAN A (fiable) → D (douteuse). */
export type Reliability = "A" | "B" | "C" | "D";

/** Palier d'évaluation — pas de score chiffré, pour ne pas surjouer la précision. */
export type Grade = "A" | "B" | "C" | "D" | "E";

/** Statut d'une affirmation dans le registre de preuves. */
export type ClaimStatus = "verifie" | "a-recouper" | "variable";

export type BrickKey =
  | "finance"
  | "cout"
  | "supply-chain"
  | "geopolitique"
  | "export";

export type ScoreKey =
  | "efficacite-cout"
  | "survivabilite"
  | "exportabilite"
  | "risque-industriel"
  | "maturite"
  | "confiance-donnees";

export interface SourceRef {
  id: string;
  title: string;
  publisher: string;
  type: "constructeur" | "institution" | "think-tank" | "presse" | "officiel";
  reliability: Reliability;
  date?: string;
  url?: string;
}

/** Un chiffre ou un fait, toujours accompagné de son niveau de confiance. */
export interface Indicator {
  label: string;
  value: string;
  confidence: Confidence;
  /** Override explicite ; sinon dérivé de la confiance dans le registre. */
  status?: ClaimStatus;
  note?: string;
  sources?: string[];
}

export interface Brick {
  key: BrickKey;
  narrative: string;
  indicators: Indicator[];
  organisms?: string[];
}

export interface Score {
  key: ScoreKey;
  grade: Grade;
  rationale: string;
}

export interface EditorialBlocks {
  mythVsReality?: string;
  bestUseCase?: string;
  weakPoint?: string;
  analystNote?: string;
}

/** Nature d'un repère de la frise : jalon, emploi, exportation, débat. */
export type TimelineKind = "jalon" | "emploi" | "export" | "debat";

export interface TimelineEvent {
  /** Année ou mois — « 2012 », « 2024-10 ». Tri lexicographique = chronologique. */
  date: string;
  label: string;
  kind: TimelineKind;
}

export interface DefenseSystem {
  slug: string;
  name: string;
  designation?: string;
  reference: string;
  category: SystemCategory;
  /** Classe de drone — renseignée pour le domaine « drone ». */
  droneClass?: DroneClass;
  /** Classe d'énergie dirigée — renseignée pour le domaine « directed-energy ». */
  directedEnergyClass?: DirectedEnergyClass;
  /** Génération évaluée — renseignée pour le domaine « combat-aircraft ». */
  combatAircraftClass?: CombatAircraftClass;
  /** Génération revendiquée par l'industriel ou la nation, si elle diffère. */
  claimedGeneration?: string;
  classLabel: string;
  country: string;
  flag: string;
  manufacturer: string;
  introduced?: string;
  status: string;
  /** Capacité d'appontage — note ; renseignée pour le domaine « combat-aircraft ». */
  naval?: string;
  acquisitionModes: AcquisitionMode[];
  tagline: string;
  summary: string;
  keySpecs: Indicator[];
  bricks: Brick[];
  /** Bloc transversal des contraintes physiques — propre à l'énergie dirigée. */
  physicalConstraints?: Indicator[];
  /** Versions & standards — propre au domaine « combat-aircraft ». */
  variants?: Indicator[];
  scores: Score[];
  editorial: EditorialBlocks;
  /** Encadré juridique permanent — ex. Protocole IV de la CCW pour les lasers. */
  legalNote?: string;
  operators: string[];
  theatres: string[];
  timeline?: TimelineEvent[];
  sources: SourceRef[];
  updated: string;
}

export interface GlossaryTerm {
  slug: string;
  term: string;
  acronym?: string;
  definition: string;
  category: "technique" | "commerce" | "doctrine" | "juridique";
}

export interface Organism {
  slug: string;
  name: string;
  acronym?: string;
  scope: string;
  type: "controle-export" | "acquisition" | "programme" | "norme";
  role: string;
}

export interface ChangelogEntry {
  date: string;
  title: string;
  items: string[];
}

export type RoadmapHorizon = "en-cours" | "prochain" | "exploratoire";

export interface RoadmapItem {
  title: string;
  detail: string;
  horizon: RoadmapHorizon;
}
