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
  legalNote: z.string().optional(),
  operators: z.array(z.string()),
  theatres: z.array(z.string()),
  timeline: z.array(TimelineEvent).optional(),
  sources: z.array(SourceRef),
  updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "updated doit être au format YYYY-MM-DD"),
});

export type DefenseSystemParsed = z.infer<typeof DefenseSystemSchema>;
