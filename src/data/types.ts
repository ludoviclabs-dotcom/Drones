// Modèle de données — plateforme d'intelligence sur les systèmes de défense.
// L'entité de base est un « système » doté d'une catégorie. Le catalogue couvre
// drones, énergie dirigée, aviation de combat, missiles, radars et bâtiments
// navals ; le modèle reste générique pour l'extension future (spatial).

export type SystemCategory =
  | "drone"
  | "directed-energy"
  | "combat-aircraft"
  | "missile"
  | "radar"
  | "naval-vessel"
  | "air-defense"
  | "combat-system"
  | "space"
  | "artillery"
  | "armored-vehicle";

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

/**
 * Rôle d'un missile — air-air, air-surface, surface-surface, surface-air,
 * anti-radiation (SEAD). Pour les missiles vraiment dual-use (MICA NG en
 * air-air et VL, AMRAAM en NASAMS), le rôle principal porte la fiche ; le
 * tagline et l'éditorial portent la lecture multi-emploi.
 */
export type MissileRole = "AAM" | "ASM" | "SSM" | "SAM" | "ARM";

/**
 * Rôle d'un radar — la grille Panoplie. « Alerte avancée » couvre la veille
 * stratégique longue portée ; « multi-mission » couvre la surveillance GBAD
 * fusionnant détection, suivi et engagement quality ; « naval-mfr » désigne
 * les radars navals multifonctions à panneaux fixes ; « BMD » les capteurs
 * dédiés à la défense antimissile balistique ; « aéroporté-AESA » les radars
 * de chasse et d'AEW ; « C-UAS » les radars spécialisés contre drones.
 * Les radars vraiment multi-capteurs (couplage actif/passif/EO-IR) restent
 * en multi-mission ; la fusion est décrite dans l'éditorial.
 */
export type RadarRole =
  | "alerte-avancee"
  | "multi-mission"
  | "naval-mfr"
  | "bmd"
  | "aeroporte-aesa"
  | "cuas";

/** Couche de la défense sol-air — du très courte portée à l'antimissile. */
export type AirDefenseClass =
  | "VSHORAD"
  | "SHORAD"
  | "MRAD"
  | "LRAD"
  | "BMD"
  | "C-RAM"
  | "C-UAS";

/** Famille d'un système de combat / C2 — CMS naval, C2 IAMD, C4ISR, collaboratif. */
export type CombatSystemClass =
  | "naval-cms"
  | "iamd-c2"
  | "c4isr"
  | "collaboratif";

/** Famille de bâtiment naval — lecture plateforme + mission, pas simple tonnage. */
export type NavalVesselClass =
  | "porte-avions"
  | "destroyer"
  | "fregate"
  | "corvette"
  | "sous-marin"
  | "patrouilleur"
  | "amphibie";

export type NavalMission =
  | "AAW"
  | "ASW"
  | "ASuW"
  | "strike"
  | "amphibie"
  | "projection"
  | "presence"
  | "MCM"
  | "BMD";

export type NavalCombatSystemFamily =
  | "Aegis"
  | "COMBATSS-21"
  | "SETIS"
  | "SCOMBA"
  | "TACTICOS"
  | "SAAM-ESD"
  | "PAAMS"
  | "9LV"
  | "autre";

export type NavalPropulsionArchitecture =
  | "nucleaire"
  | "CODAD"
  | "CODLAG"
  | "CODLOG"
  | "IEP"
  | "diesel-electrique"
  | "AIP"
  | "autre";

export interface NavalPlatformProfile {
  missions: NavalMission[];
  displacement?: string;
  crew?: string;
  endurance?: string;
  aviation?: string[];
  notes?: string;
}

export interface NavalCombatSystemProfile {
  family: NavalCombatSystemFamily;
  cms: string;
  baseline?: string;
  tacticalLinks?: string[];
  ballisticMissileDefense?: boolean;
  interoperabilityNotes?: string;
}

export interface NavalSensorProfile {
  radarPrimary?: string;
  radarSecondary?: string[];
  hullSonar?: string;
  towedSonar?: string;
  esm?: string[];
  optronics?: string[];
}

export interface NavalEffectorProfile {
  vlsType?: string;
  vlsCells?: string;
  sam?: string[];
  antiShipMissiles?: string[];
  antiSubWeapons?: string[];
  navalGuns?: string[];
  ciws?: string[];
  decoys?: string[];
  aviationWeapons?: string[];
}

export interface NavalPropulsionProfile {
  architecture: NavalPropulsionArchitecture;
  primeMovers?: string[];
  maxSpeed?: string;
  notes?: string;
}

export interface NavalIndustrialSupplier {
  subsystem: string;
  supplier: string;
  country?: string;
}

export interface NavalIndustrialProfile {
  primeContractor: string;
  shipyards: string[];
  suppliers?: NavalIndustrialSupplier[];
  localContentNotes?: string;
  transferOfTechnology?: string;
}

export interface NavalExportProfile {
  regimeSummary?: string;
  itarExposure?: "aucune" | "partielle" | "elevee";
  reexportConstraints?: string;
  politicalConstraints?: string;
}

export interface NavalSustainmentProfile {
  unitCost?: string;
  programCost?: string;
  sustainmentNotes?: string;
  refitPrograms?: string[];
  industrialRiskNotes?: string;
}

export interface NavalStructuredProfile {
  platform: NavalPlatformProfile;
  combatSystem?: NavalCombatSystemProfile;
  sensors?: NavalSensorProfile;
  effectors?: NavalEffectorProfile;
  propulsion?: NavalPropulsionProfile;
  industrial?: NavalIndustrialProfile;
  export?: NavalExportProfile;
  sustainment?: NavalSustainmentProfile;
}

/** Mission spatiale publique — lecture de service, pas trajectographie exploitable. */
export type SpaceMission =
  | "observation"
  | "sigint"
  | "satcom"
  | "pnt"
  | "missile-warning"
  | "sda-ssa"
  | "metoc"
  | "maritime-surveillance"
  | "data-relay";

/** Classe orbitale générique publiée ; aucun TLE ni paramètre temps réel. */
export type SpaceOrbitClass =
  | "LEO"
  | "MEO"
  | "GEO"
  | "GSO"
  | "SSO"
  | "polar"
  | "HEO"
  | "Molniya"
  | "multi-orbit"
  | "ground-network"
  | "unknown";

export type SpacePayloadType =
  | "optical"
  | "infrared"
  | "SAR"
  | "RF-SIGINT"
  | "COMINT"
  | "ELINT"
  | "SATCOM-X"
  | "SATCOM-Ka"
  | "SATCOM-EHF"
  | "PNT"
  | "OPIR"
  | "space-surveillance"
  | "AIS"
  | "hosted-payload";

export interface SpaceOrbitProfile {
  classes: SpaceOrbitClass[];
  altitude?: string;
  inclination?: string;
  notes?: string;
}

export interface SpacePayloadProfile {
  type: SpacePayloadType;
  name?: string;
  supplier?: string;
  description: string;
  sensitivity: "faible" | "moyenne" | "haute";
}

export interface SpaceArchitectureProfile {
  constellationSize?: string;
  satellitesLaunched?: string;
  formationFlying?: boolean;
  groundSegment: string[];
  dataChain: string;
  launchDependency?: string[];
  serviceContinuityNotes?: string;
}

export interface SpaceStructuredProfile {
  missions: SpaceMission[];
  orbit: SpaceOrbitProfile;
  payloads: SpacePayloadProfile[];
  architecture: SpaceArchitectureProfile;
  resilienceNotes?: string;
  sovereigntyNotes?: string;
}

/** Modes d'acquisition — la grille de lecture qui relie les cinq briques. */
export type ArtilleryCarrier =
  | "tracked-heavy"
  | "truck-4x4"
  | "truck-6x6"
  | "truck-8x8"
  | "armored-8x8"
  | "light-vehicle"
  | "towed";

export type ArtilleryArchitecture =
  | "open-mount"
  | "protected-cab"
  | "protected-turret"
  | "remote-module"
  | "light-system";

export type ArtilleryCaliber = "105mm" | "122mm" | "152mm" | "155mm";
export type ArtilleryBarrelLength = "L39" | "L45" | "L52" | "L58" | "unknown";

export type ArtilleryLoading =
  | "manual"
  | "assisted"
  | "semi-automatic"
  | "automatic";

export type ArtilleryInteropStatus =
  | "nato-155"
  | "jbmou-claimed"
  | "jbmou-qualified"
  | "national-munitions"
  | "non-nato-caliber";

export interface ArtilleryAmmunitionProfile {
  families: string[];
  guidedFamilies?: string[];
  sourcePerimeter: string;
  caution?: string;
}

export interface ArtillerySustainmentProfile {
  tubeWearNotes?: string;
  resupplyVehicle?: string;
  maintenanceNotes?: string;
  productionNotes?: string;
}

export interface ArtilleryStructuredProfile {
  carrier: ArtilleryCarrier;
  architecture: ArtilleryArchitecture;
  caliber: ArtilleryCaliber;
  barrelLength: ArtilleryBarrelLength;
  loading: ArtilleryLoading;
  interopStatus: ArtilleryInteropStatus;
  crewProtection: string;
  fcs: string;
  c2: string;
  ammunition: ArtilleryAmmunitionProfile;
  sustainment: ArtillerySustainmentProfile;
  industrialNotes: string;
  costNotes?: string;
  exportNotes?: string;
  safetyBoundary?: string;
}

export type ArmoredVehicleFamily =
  | "MBT"
  | "light-tank"
  | "IFV"
  | "APC"
  | "support-vehicle"
  | "program";

export type ArmoredProgramStatus =
  | "modernized"
  | "new-standard"
  | "future-program"
  | "low-transparency";

export type ArmoredLoading = "manual" | "automatic" | "assisted" | "unknown";

export type ArmoredApsStatus =
  | "integrated"
  | "optional"
  | "planned"
  | "none-public"
  | "unknown";

export interface ArmoredArmamentProfile {
  mainGun: string;
  secondary?: string[];
  ammunitionFamilies: string[];
  sourcePerimeter: string;
  caution?: string;
}

export interface ArmoredProtectionProfile {
  passive: string;
  modular?: string;
  apsStatus: ArmoredApsStatus;
  apsName?: string;
  crewSurvivabilityNotes?: string;
}

export interface ArmoredMobilityProfile {
  powerpack: string;
  transmission?: string;
  mobilityNotes?: string;
}

export interface ArmoredSupportProfile {
  mcoNotes: string;
  recoverySupport?: string;
  modernizationNotes?: string;
  localProductionNotes?: string;
}

export interface ArmoredStructuredProfile {
  family: ArmoredVehicleFamily;
  programStatus: ArmoredProgramStatus;
  crew: string;
  loading: ArmoredLoading;
  armament: ArmoredArmamentProfile;
  protection: ArmoredProtectionProfile;
  mobility: ArmoredMobilityProfile;
  vetronics: string;
  c2: string;
  support: ArmoredSupportProfile;
  industrialNotes: string;
  costNotes?: string;
  exportNotes?: string;
  safetyBoundary?: string;
}

export type BattlefieldFunction =
  | "isr"
  | "strike"
  | "counter-uas"
  | "air-defense"
  | "ew"
  | "relay-c2"
  | "logistics"
  | "maritime-support";

export type AutonomyMode =
  | "teleoperated"
  | "manual-assisted"
  | "autonomous-flight"
  | "terminal-autonomy"
  | "mission-autonomy"
  | "swarm-ready";

export type Recoverability =
  | "reusable"
  | "attritable"
  | "consumable"
  | "not-applicable";

export type SourceContext =
  | "official-spec"
  | "official-marketing-claim"
  | "contract-announcement"
  | "operator-or-battlefield-claim"
  | "secondary-analysis";

export interface NavigationGuidanceProfile {
  gnss?: boolean;
  inertial?: boolean;
  antiJam?: boolean;
  vision?: boolean;
  opticalFlow?: boolean;
  deckLanding?: boolean;
  terminalSeeker?: string;
  notes?: string;
}

export interface NetworkAndC2Profile {
  datalinkTypes?: string[];
  encryption?: string[];
  losRange?: string;
  satcom?: boolean;
  meshNetworking?: boolean;
  c2SoftwareStack?: string[];
  notes?: string;
}

export interface IndustrialRoleProfile {
  prime?: string[];
  integrator?: string[];
  autonomySoftware?: string[];
  powertrain?: string[];
  prototypeAccelerator?: string[];
  production?: string[];
}

export interface SourceContextProfile {
  contexts: SourceContext[];
  version?: string;
  sourceDate?: string;
  varianceNotes?: string;
}

export interface AutonomyProfile {
  battlefieldFunctions: BattlefieldFunction[];
  autonomyModes: AutonomyMode[];
  navigationGuidance?: NavigationGuidanceProfile;
  networkAndC2?: NetworkAndC2Profile;
  recoverability?: Recoverability;
  industrialRoles?: IndustrialRoleProfile;
  sourceContext?: SourceContextProfile;
}

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

/**
 * Lecture de contrôle de gestion (CCA — comptabilité, contrôle, audit).
 * Synthèse transversale qui *reformule* les briques Coût et Finance sans
 * introduire de donnée chiffrée nouvelle : coût complet vs coût cellule,
 * inducteurs, mode d'acquisition, risque budgétaire, KPI de pilotage.
 */
export interface CCAReading {
  natureEconomique: string;
  problemeCosting: string;
  inducteursCout: string;
  modeAcquisition: string;
  risqueBudgetaire: string;
  kpiPilotage: string;
  leconCCA: string;
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
  /** Rôle principal — renseigné pour le domaine « missile ». */
  missileRole?: MissileRole;
  /** Rôle radar — renseigné pour le domaine « radar ». */
  radarRole?: RadarRole;
  /** Couche de défense aérienne — renseignée pour le domaine « air-defense ». */
  airDefenseClass?: AirDefenseClass;
  /** Famille C2 — renseignée pour le domaine « combat-system ». */
  combatSystemClass?: CombatSystemClass;
  /**
   * Cadres d'intégration réseau — NATINAMDS, IBCS, NASAMS, SAMP/T, Iron Dome,
   * Aegis. Champ transversal : un radar y siège comme capteur, un missile
   * comme effecteur ; permet de rendre la lecture C2 commune au catalogue.
   */
  integrationFrameworks?: string[];
  /** Famille navale — renseignée pour le domaine « bâtiments navals ». */
  navalVesselClass?: NavalVesselClass;
  /** Profil naval structuré — capteurs, CMS, effecteurs, propulsion, MCO et export. */
  navalProfile?: NavalStructuredProfile;
  /** Profil spatial structuré — orbite publique, charge utile, segment sol et résilience. */
  spaceProfile?: SpaceStructuredProfile;
  artilleryProfile?: ArtilleryStructuredProfile;
  armoredProfile?: ArmoredStructuredProfile;
  /** Profil transversal autonomie / fonction / C-UAS, sans domaine dedie. */
  autonomyProfile?: AutonomyProfile;
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
  /** Lecture CCA optionnelle — synthèse de contrôle de gestion par système. */
  ccaReading?: CCAReading;
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
