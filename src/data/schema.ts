import { z } from "zod";

// Schéma de validation runtime des dossiers — miroir de `types.ts`. Exécuté en
// test (tests/data) pour échouer le build si un dossier est malformé : enum
// invalide, champ requis manquant, source non résolue. Garde-fou de l'écriture
// de contenu (packs navals notamment).

const SystemCategory = z.enum([
  "drone",
  "directed-energy",
  "combat-aircraft",
  "missile",
  "radar",
  "naval-vessel",
  "air-defense",
  "combat-system",
  "space",
  "artillery",
  "armored-vehicle",
]);

const Confidence = z.enum(["haute", "moyenne", "faible"]);
const Reliability = z.enum(["A", "B", "C", "D"]);
const Grade = z.enum(["A", "B", "C", "D", "E"]);
const ClaimStatus = z.enum(["verifie", "a-recouper", "variable"]);
const AcquisitionMode = z.enum([
  "FMS",
  "DCS",
  "production-nationale",
  "cooperatif",
]);

const BrickKey = z.enum([
  "finance",
  "cout",
  "supply-chain",
  "geopolitique",
  "export",
]);

const ScoreKey = z.enum([
  "efficacite-cout",
  "survivabilite",
  "exportabilite",
  "risque-industriel",
  "maturite",
  "confiance-donnees",
]);

const NavalVesselClass = z.enum([
  "porte-avions",
  "destroyer",
  "fregate",
  "corvette",
  "sous-marin",
  "patrouilleur",
  "amphibie",
]);

const NavalMission = z.enum([
  "AAW",
  "ASW",
  "ASuW",
  "strike",
  "amphibie",
  "projection",
  "presence",
  "MCM",
  "BMD",
]);

const NavalCombatSystemFamily = z.enum([
  "Aegis",
  "COMBATSS-21",
  "SETIS",
  "SCOMBA",
  "TACTICOS",
  "SAAM-ESD",
  "PAAMS",
  "9LV",
  "autre",
]);

const NavalPropulsionArchitecture = z.enum([
  "nucleaire",
  "CODAD",
  "CODLAG",
  "CODLOG",
  "IEP",
  "diesel-electrique",
  "AIP",
  "autre",
]);

const SpaceMission = z.enum([
  "observation",
  "sigint",
  "satcom",
  "pnt",
  "missile-warning",
  "sda-ssa",
  "metoc",
  "maritime-surveillance",
  "data-relay",
]);

const SpaceOrbitClass = z.enum([
  "LEO",
  "MEO",
  "GEO",
  "GSO",
  "SSO",
  "polar",
  "HEO",
  "Molniya",
  "multi-orbit",
  "ground-network",
  "unknown",
]);

const SpacePayloadType = z.enum([
  "optical",
  "infrared",
  "SAR",
  "RF-SIGINT",
  "COMINT",
  "ELINT",
  "SATCOM-X",
  "SATCOM-Ka",
  "SATCOM-EHF",
  "PNT",
  "OPIR",
  "space-surveillance",
  "AIS",
  "hosted-payload",
]);

const ArtilleryCarrier = z.enum([
  "tracked-heavy",
  "truck-4x4",
  "truck-6x6",
  "truck-8x8",
  "armored-8x8",
  "light-vehicle",
  "towed",
]);

const ArtilleryArchitecture = z.enum([
  "open-mount",
  "protected-cab",
  "protected-turret",
  "remote-module",
  "light-system",
]);

const ArtilleryCaliber = z.enum(["105mm", "122mm", "152mm", "155mm"]);
const ArtilleryBarrelLength = z.enum(["L39", "L45", "L52", "L58", "unknown"]);
const ArtilleryLoading = z.enum([
  "manual",
  "assisted",
  "semi-automatic",
  "automatic",
]);
const ArtilleryInteropStatus = z.enum([
  "nato-155",
  "jbmou-claimed",
  "jbmou-qualified",
  "national-munitions",
  "non-nato-caliber",
]);

const ArmoredVehicleFamily = z.enum([
  "MBT",
  "light-tank",
  "IFV",
  "APC",
  "support-vehicle",
  "program",
]);
const ArmoredProgramStatus = z.enum([
  "modernized",
  "new-standard",
  "future-program",
  "low-transparency",
]);
const ArmoredLoading = z.enum(["manual", "automatic", "assisted", "unknown"]);
const ArmoredApsStatus = z.enum([
  "integrated",
  "optional",
  "planned",
  "none-public",
  "unknown",
]);

const BattlefieldFunction = z.enum([
  "isr",
  "strike",
  "counter-uas",
  "air-defense",
  "ew",
  "relay-c2",
  "logistics",
  "maritime-support",
]);

const AutonomyMode = z.enum([
  "teleoperated",
  "manual-assisted",
  "autonomous-flight",
  "terminal-autonomy",
  "mission-autonomy",
  "swarm-ready",
]);

const Recoverability = z.enum([
  "reusable",
  "attritable",
  "consumable",
  "not-applicable",
]);

const SourceContext = z.enum([
  "official-spec",
  "official-marketing-claim",
  "contract-announcement",
  "operator-or-battlefield-claim",
  "secondary-analysis",
]);

const SourceRef = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  publisher: z.string().min(1),
  type: z.enum(["constructeur", "institution", "think-tank", "presse", "officiel"]),
  reliability: Reliability,
  date: z.string().optional(),
  url: z.string().url().optional(),
});

const Indicator = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  confidence: Confidence,
  status: ClaimStatus.optional(),
  note: z.string().optional(),
  sources: z.array(z.string()).optional(),
});

const Brick = z.object({
  key: BrickKey,
  narrative: z.string().min(1),
  indicators: z.array(Indicator),
  organisms: z.array(z.string()).optional(),
});

const Score = z.object({
  key: ScoreKey,
  grade: Grade,
  rationale: z.string().min(1),
});

const EditorialBlocks = z.object({
  mythVsReality: z.string().optional(),
  bestUseCase: z.string().optional(),
  weakPoint: z.string().optional(),
  analystNote: z.string().optional(),
});

const CCAReading = z.object({
  natureEconomique: z.string().min(1),
  problemeCosting: z.string().min(1),
  inducteursCout: z.string().min(1),
  modeAcquisition: z.string().min(1),
  risqueBudgetaire: z.string().min(1),
  kpiPilotage: z.string().min(1),
  leconCCA: z.string().min(1),
});

const TimelineEvent = z.object({
  date: z.string().min(1),
  label: z.string().min(1),
  kind: z.enum(["jalon", "emploi", "export", "debat"]),
});

const NavalIndustrialSupplier = z.object({
  subsystem: z.string(),
  supplier: z.string(),
  country: z.string().optional(),
});

const NavalStructuredProfile = z.object({
  platform: z.object({
    missions: z.array(NavalMission),
    displacement: z.string().optional(),
    crew: z.string().optional(),
    endurance: z.string().optional(),
    aviation: z.array(z.string()).optional(),
    notes: z.string().optional(),
  }),
  combatSystem: z
    .object({
      family: NavalCombatSystemFamily,
      cms: z.string(),
      baseline: z.string().optional(),
      tacticalLinks: z.array(z.string()).optional(),
      ballisticMissileDefense: z.boolean().optional(),
      interoperabilityNotes: z.string().optional(),
    })
    .optional(),
  sensors: z
    .object({
      radarPrimary: z.string().optional(),
      radarSecondary: z.array(z.string()).optional(),
      hullSonar: z.string().optional(),
      towedSonar: z.string().optional(),
      esm: z.array(z.string()).optional(),
      optronics: z.array(z.string()).optional(),
    })
    .optional(),
  effectors: z
    .object({
      vlsType: z.string().optional(),
      vlsCells: z.string().optional(),
      sam: z.array(z.string()).optional(),
      antiShipMissiles: z.array(z.string()).optional(),
      antiSubWeapons: z.array(z.string()).optional(),
      navalGuns: z.array(z.string()).optional(),
      ciws: z.array(z.string()).optional(),
      decoys: z.array(z.string()).optional(),
      aviationWeapons: z.array(z.string()).optional(),
    })
    .optional(),
  propulsion: z
    .object({
      architecture: NavalPropulsionArchitecture,
      primeMovers: z.array(z.string()).optional(),
      maxSpeed: z.string().optional(),
      notes: z.string().optional(),
    })
    .optional(),
  industrial: z
    .object({
      primeContractor: z.string(),
      shipyards: z.array(z.string()),
      suppliers: z.array(NavalIndustrialSupplier).optional(),
      localContentNotes: z.string().optional(),
      transferOfTechnology: z.string().optional(),
    })
    .optional(),
  export: z
    .object({
      regimeSummary: z.string().optional(),
      itarExposure: z.enum(["aucune", "partielle", "elevee"]).optional(),
      reexportConstraints: z.string().optional(),
      politicalConstraints: z.string().optional(),
    })
    .optional(),
  sustainment: z
    .object({
      unitCost: z.string().optional(),
      programCost: z.string().optional(),
      sustainmentNotes: z.string().optional(),
      refitPrograms: z.array(z.string()).optional(),
      industrialRiskNotes: z.string().optional(),
    })
    .optional(),
});

const SpaceStructuredProfile = z.object({
  missions: z.array(SpaceMission),
  orbit: z.object({
    classes: z.array(SpaceOrbitClass),
    altitude: z.string().optional(),
    inclination: z.string().optional(),
    notes: z.string().optional(),
  }),
  payloads: z.array(
    z.object({
      type: SpacePayloadType,
      name: z.string().optional(),
      supplier: z.string().optional(),
      description: z.string(),
      sensitivity: z.enum(["faible", "moyenne", "haute"]),
    }),
  ),
  architecture: z.object({
    constellationSize: z.string().optional(),
    satellitesLaunched: z.string().optional(),
    formationFlying: z.boolean().optional(),
    groundSegment: z.array(z.string()),
    dataChain: z.string(),
    launchDependency: z.array(z.string()).optional(),
    serviceContinuityNotes: z.string().optional(),
  }),
  resilienceNotes: z.string().optional(),
  sovereigntyNotes: z.string().optional(),
});

const ArtilleryStructuredProfile = z.object({
  carrier: ArtilleryCarrier,
  architecture: ArtilleryArchitecture,
  caliber: ArtilleryCaliber,
  barrelLength: ArtilleryBarrelLength,
  loading: ArtilleryLoading,
  interopStatus: ArtilleryInteropStatus,
  crewProtection: z.string(),
  fcs: z.string(),
  c2: z.string(),
  ammunition: z.object({
    families: z.array(z.string()),
    guidedFamilies: z.array(z.string()).optional(),
    sourcePerimeter: z.string(),
    caution: z.string().optional(),
  }),
  sustainment: z.object({
    tubeWearNotes: z.string().optional(),
    resupplyVehicle: z.string().optional(),
    maintenanceNotes: z.string().optional(),
    productionNotes: z.string().optional(),
  }),
  industrialNotes: z.string(),
  costNotes: z.string().optional(),
  exportNotes: z.string().optional(),
  safetyBoundary: z.string().optional(),
});

const ArmoredStructuredProfile = z.object({
  family: ArmoredVehicleFamily,
  programStatus: ArmoredProgramStatus,
  crew: z.string(),
  loading: ArmoredLoading,
  armament: z.object({
    mainGun: z.string(),
    secondary: z.array(z.string()).optional(),
    ammunitionFamilies: z.array(z.string()),
    sourcePerimeter: z.string(),
    caution: z.string().optional(),
  }),
  protection: z.object({
    passive: z.string(),
    modular: z.string().optional(),
    apsStatus: ArmoredApsStatus,
    apsName: z.string().optional(),
    crewSurvivabilityNotes: z.string().optional(),
  }),
  mobility: z.object({
    powerpack: z.string(),
    transmission: z.string().optional(),
    mobilityNotes: z.string().optional(),
  }),
  vetronics: z.string(),
  c2: z.string(),
  support: z.object({
    mcoNotes: z.string(),
    recoverySupport: z.string().optional(),
    modernizationNotes: z.string().optional(),
    localProductionNotes: z.string().optional(),
  }),
  industrialNotes: z.string(),
  costNotes: z.string().optional(),
  exportNotes: z.string().optional(),
  safetyBoundary: z.string().optional(),
});

const AutonomyProfile = z.object({
  battlefieldFunctions: z.array(BattlefieldFunction),
  autonomyModes: z.array(AutonomyMode),
  navigationGuidance: z
    .object({
      gnss: z.boolean().optional(),
      inertial: z.boolean().optional(),
      antiJam: z.boolean().optional(),
      vision: z.boolean().optional(),
      opticalFlow: z.boolean().optional(),
      deckLanding: z.boolean().optional(),
      terminalSeeker: z.string().optional(),
      notes: z.string().optional(),
    })
    .optional(),
  networkAndC2: z
    .object({
      datalinkTypes: z.array(z.string()).optional(),
      encryption: z.array(z.string()).optional(),
      losRange: z.string().optional(),
      satcom: z.boolean().optional(),
      meshNetworking: z.boolean().optional(),
      c2SoftwareStack: z.array(z.string()).optional(),
      notes: z.string().optional(),
    })
    .optional(),
  recoverability: Recoverability.optional(),
  industrialRoles: z
    .object({
      prime: z.array(z.string()).optional(),
      integrator: z.array(z.string()).optional(),
      autonomySoftware: z.array(z.string()).optional(),
      powertrain: z.array(z.string()).optional(),
      prototypeAccelerator: z.array(z.string()).optional(),
      production: z.array(z.string()).optional(),
    })
    .optional(),
  sourceContext: z
    .object({
      contexts: z.array(SourceContext),
      version: z.string().optional(),
      sourceDate: z.string().optional(),
      varianceNotes: z.string().optional(),
    })
    .optional(),
});

export const DefenseSystemSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  designation: z.string().optional(),
  reference: z.string().min(1),
  category: SystemCategory,
  droneClass: z
    .enum(["MALE", "HALE", "UCAV", "ISR", "munition-rodeuse", "kamikaze", "ravitailleur", "USV"])
    .optional(),
  directedEnergyClass: z.enum(["HEL", "HPM", "SHORAD-hybride"]).optional(),
  combatAircraftClass: z.enum(["gen-4", "gen-4-5", "gen-5", "gen-6"]).optional(),
  missileRole: z.enum(["AAM", "ASM", "SSM", "SAM", "ARM"]).optional(),
  radarRole: z
    .enum(["alerte-avancee", "multi-mission", "naval-mfr", "bmd", "aeroporte-aesa", "cuas"])
    .optional(),
  airDefenseClass: z
    .enum(["VSHORAD", "SHORAD", "MRAD", "LRAD", "BMD", "C-RAM", "C-UAS"])
    .optional(),
  combatSystemClass: z
    .enum(["naval-cms", "iamd-c2", "c4isr", "collaboratif"])
    .optional(),
  integrationFrameworks: z.array(z.string()).optional(),
  navalVesselClass: NavalVesselClass.optional(),
  navalProfile: NavalStructuredProfile.optional(),
  spaceProfile: SpaceStructuredProfile.optional(),
  artilleryProfile: ArtilleryStructuredProfile.optional(),
  armoredProfile: ArmoredStructuredProfile.optional(),
  autonomyProfile: AutonomyProfile.optional(),
  claimedGeneration: z.string().optional(),
  classLabel: z.string().min(1),
  country: z.string().min(1),
  flag: z.string().min(1),
  manufacturer: z.string().min(1),
  introduced: z.string().optional(),
  status: z.string().min(1),
  naval: z.string().optional(),
  acquisitionModes: z.array(AcquisitionMode).min(1),
  tagline: z.string().min(1),
  summary: z.string().min(1),
  keySpecs: z.array(Indicator),
  bricks: z.array(Brick),
  physicalConstraints: z.array(Indicator).optional(),
  variants: z.array(Indicator).optional(),
  scores: z.array(Score),
  editorial: EditorialBlocks,
  ccaReading: CCAReading.optional(),
  legalNote: z.string().optional(),
  operators: z.array(z.string()),
  theatres: z.array(z.string()),
  timeline: z.array(TimelineEvent).optional(),
  sources: z.array(SourceRef),
  updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "updated doit être au format YYYY-MM-DD"),
});

export type DefenseSystemParsed = z.infer<typeof DefenseSystemSchema>;
