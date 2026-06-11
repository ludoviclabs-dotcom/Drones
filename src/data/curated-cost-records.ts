export type CuratedCostType =
  | "acquisition"
  | "maintenance"
  | "lifecycle"
  | "program"
  | "unit_public";

export type CuratedCostUncertainty = "low" | "medium" | "high";

export interface CuratedCostRecordSeed {
  recordId: string;
  systemId: string;
  costType: CuratedCostType;
  amount: number | null;
  currency: string;
  year: number | null;
  perimeter: string;
  rawValue: string;
  sourceIds: string[];
  uncertainty: CuratedCostUncertainty;
  comparabilityLimit: string;
  normalizedNote: string;
}

export const CURATED_COST_RECORDS: CuratedCostRecordSeed[] = [
  {
    recordId: "f35-lifecycle-gao",
    systemId: "f-35",
    costType: "lifecycle",
    amount: 1_580_000_000_000,
    currency: "USD",
    year: 2024,
    perimeter: "Maintien en condition et possession flotte",
    rawValue: ">= 1 580 Md$ sur le cycle de vie de la flotte",
    sourceIds: ["gao"],
    uncertainty: "medium",
    comparabilityLimit:
      "Coût de flotte et de cycle de vie : non comparable à un prix unitaire avion.",
    normalizedNote:
      "Conserve l'ordre de grandeur public GAO ; aucun ajustement devise/année appliqué.",
  },
  {
    recordId: "gerald-ford-unit-crs",
    systemId: "gerald-r-ford",
    costType: "unit_public",
    amount: 13_000_000_000,
    currency: "USD",
    year: 2024,
    perimeter: "Coût public de navire tête de classe",
    rawValue: "≈ US$13 Md ordre public de grandeur",
    sourceIds: ["crs-ford"],
    uncertainty: "medium",
    comparabilityLimit:
      "Navire tête de classe : le coût intègre maturité programme, retards et équipements propres.",
    normalizedNote:
      "Montant arrondi, non converti, affiché comme coût public de plateforme.",
  },
  {
    recordId: "virginia-block-v-vpm-crs",
    systemId: "virginia-block-v",
    costType: "unit_public",
    amount: 4_400_000_000,
    currency: "USD",
    year: 2024,
    perimeter: "Sous-marin Block V avec Virginia Payload Module",
    rawValue: "≈ US$4,3-4,5 Md avec VPM",
    sourceIds: ["crs-virginia"],
    uncertainty: "medium",
    comparabilityLimit:
      "Moyenne de fourchette ; la configuration VPM et la cadence changent le périmètre.",
    normalizedNote: "Milieu de fourchette retenu pour visualisation comparative.",
  },
  {
    recordId: "eurodrone-program-occar",
    systemId: "eurodrone",
    costType: "program",
    amount: 7_100_000_000,
    currency: "EUR",
    year: 2022,
    perimeter: "Programme initial 20 systèmes / 60 drones",
    rawValue: "7,1 Md€ HT - 20 systèmes / 60 drones",
    sourceIds: ["occar-contrat", "iiss-mb"],
    uncertainty: "medium",
    comparabilityLimit:
      "Programme multinational hors taxes ; ne doit pas être lu comme coût unitaire simple.",
    normalizedNote:
      "Montant de programme conservé sans ventilation station sol/drone/soutien.",
  },
  {
    recordId: "f110-program-navantia",
    systemId: "f110-bonifaz",
    costType: "program",
    amount: 4_300_000_000,
    currency: "EUR",
    year: 2019,
    perimeter: "Programme cinq frégates",
    rawValue: "≈ €4,3 Md / 5 navires",
    sourceIds: ["navantia-frigates"],
    uncertainty: "medium",
    comparabilityLimit:
      "Programme complet : la ventilation par coque, combat system et soutien reste partielle.",
    normalizedNote:
      "Montant de programme conservé ; coût moyen implicite non présenté comme prix ferme.",
  },
  {
    recordId: "rafale-unit-range",
    systemId: "rafale",
    costType: "acquisition",
    amount: 100_000_000,
    currency: "EUR",
    year: 2025,
    perimeter: "Acquisition unitaire selon version et lot",
    rawValue: "De l'ordre de 80-120 M€ selon la version et le lot",
    sourceIds: ["air-cosmos"],
    uncertainty: "high",
    comparabilityLimit:
      "Milieu de fourchette ; les contrats export incluent souvent armements, soutien et formation.",
    normalizedNote: "Milieu de fourchette utilisé uniquement pour tri et graphe.",
  },
  {
    recordId: "mq9-cellule",
    systemId: "mq-9-reaper",
    costType: "unit_public",
    amount: 30_000_000,
    currency: "USD",
    year: 2024,
    perimeter: "Cellule / vecteur",
    rawValue: "≈ 30 M$",
    sourceIds: ["ga-asi", "sipri-at"],
    uncertainty: "medium",
    comparabilityLimit:
      "Cellule seule : ne couvre pas stations sol, SATCOM, capteurs, formation et soutien.",
    normalizedNote: "Coût de vecteur conservé séparément du coût système.",
  },
  {
    recordId: "mq9-system",
    systemId: "mq-9-reaper",
    costType: "acquisition",
    amount: 88_500_000,
    currency: "USD",
    year: 2024,
    perimeter: "Système complet estimé",
    rawValue: "≈ 56-121 M$",
    sourceIds: ["sipri-at", "usaf-factsheet"],
    uncertainty: "high",
    comparabilityLimit:
      "Milieu de fourchette large ; périmètres package et soutien variables selon client.",
    normalizedNote:
      "Moyenne de fourchette utilisée pour montrer l'écart cellule/système.",
  },
  {
    recordId: "bayraktar-tb2-vector",
    systemId: "bayraktar-tb2",
    costType: "unit_public",
    amount: 3_000_000,
    currency: "USD",
    year: 2024,
    perimeter: "Vecteur export estimé",
    rawValue: "≈ 1-5 M$",
    sourceIds: ["sipri-at"],
    uncertainty: "high",
    comparabilityLimit:
      "Milieu de fourchette ; ne couvre pas station sol, munitions MAM et soutien.",
    normalizedNote: "Coût de vecteur estimé, signalé comme incertain.",
  },
  {
    recordId: "wing-loong-cell",
    systemId: "wing-loong-2",
    costType: "unit_public",
    amount: 1_500_000,
    currency: "USD",
    year: 2024,
    perimeter: "Cellule export estimée",
    rawValue: "≈ 1-2 M$",
    sourceIds: ["csis-chinapower", "takshashila"],
    uncertainty: "high",
    comparabilityLimit:
      "Prix de cellule estimé ; versions export et packages client changent fortement le périmètre.",
    normalizedNote: "Milieu de fourchette conservé pour lecture de positionnement prix.",
  },
  {
    recordId: "aarok-unit-estimate",
    systemId: "aarok",
    costType: "unit_public",
    amount: 7_500_000,
    currency: "EUR",
    year: 2025,
    perimeter: "Appareil, avant contrat de série",
    rawValue: "5-10 M€ par appareil",
    sourceIds: ["opex360-cout"],
    uncertainty: "high",
    comparabilityLimit:
      "Prototype sans prix de marché notifié ; coût système complet non publié.",
    normalizedNote: "Milieu de fourchette conservé avec incertitude haute.",
  },
  {
    recordId: "switchblade-600-unit",
    systemId: "switchblade-600",
    costType: "unit_public",
    amount: 100_000,
    currency: "USD",
    year: 2024,
    perimeter: "Munition rôdeuse par coup, ordre de grandeur",
    rawValue: "> 100 000 $ le coup",
    sourceIds: ["warzone-cost", "av-switchblade"],
    uncertainty: "high",
    comparabilityLimit:
      "Seuil bas retenu ; lanceur, soutien et contrats cadres ont d'autres périmètres.",
    normalizedNote: "Montant plancher utilisé pour ne pas sur-préciser l'estimation.",
  },
  {
    recordId: "magura-v5-unit",
    systemId: "magura-v5",
    costType: "unit_public",
    amount: 275_000,
    currency: "USD",
    year: 2025,
    perimeter: "Plateforme USV, hors campagne complète",
    rawValue: "≈ 250 000-300 000 $",
    sourceIds: ["usni-proc"],
    uncertainty: "medium",
    comparabilityLimit:
      "Plateforme seulement : le coût de campagne, de communication et d'intégration n'est pas public.",
    normalizedNote: "Milieu de fourchette retenu.",
  },
  {
    recordId: "aim9x-fy2026",
    systemId: "aim-9x",
    costType: "unit_public",
    amount: 580_000,
    currency: "USD",
    year: 2026,
    perimeter: "Coût budgétaire unitaire FY2026",
    rawValue: "≈ 0,58 M$ par missile",
    sourceIds: ["dod-p1-fy26-aim9x"],
    uncertainty: "low",
    comparabilityLimit:
      "Coût budgétaire moyen de demande FY ; distinct d'un prix contractuel export.",
    normalizedNote: "Valeur issue du ratio budgétaire publié.",
  },
  {
    recordId: "amraam-fy2026",
    systemId: "aim-120-amraam",
    costType: "unit_public",
    amount: 1_380_000,
    currency: "USD",
    year: 2026,
    perimeter: "Coût budgétaire unitaire FY2026",
    rawValue: "≈ 1,38 M$ par missile - Air Force + Navy",
    sourceIds: ["dod-p1-fy26-amraam"],
    uncertainty: "low",
    comparabilityLimit:
      "Coût budgétaire moyen ; advance procurement et volumes influencent le ratio.",
    normalizedNote: "Valeur issue du ratio budgétaire publié.",
  },
  {
    recordId: "pac3-mse-fy2026",
    systemId: "pac-3-mse",
    costType: "unit_public",
    amount: 5_630_000,
    currency: "USD",
    year: 2026,
    perimeter: "Net procurement unitaire FY2026",
    rawValue: "≈ 5,63 M$ par missile",
    sourceIds: ["dod-p1-fy26-pac3"],
    uncertainty: "low",
    comparabilityLimit:
      "Inclut canister, ingénierie et system engineering ; pas un flyaway pur.",
    normalizedNote: "Valeur issue du ratio budgétaire publié.",
  },
  {
    recordId: "prsm-fy2026",
    systemId: "prsm",
    costType: "unit_public",
    amount: 8_080_000,
    currency: "USD",
    year: 2026,
    perimeter: "Coût budgétaire unitaire FY2026",
    rawValue: "≈ 8,08 M$ par missile",
    sourceIds: ["dod-p1-fy26-prsm"],
    uncertainty: "low",
    comparabilityLimit:
      "Programme en montée en cadence ; ratio sensible aux volumes commandés.",
    normalizedNote: "Valeur issue du ratio budgétaire publié.",
  },
  {
    recordId: "thaad-fy2025",
    systemId: "thaad",
    costType: "unit_public",
    amount: 33_864_000,
    currency: "USD",
    year: 2025,
    perimeter: "Gross weapon system unit cost",
    rawValue: "33,864 M$ par intercepteur",
    sourceIds: ["mda-thaad-p5"],
    uncertainty: "low",
    comparabilityLimit:
      "Gross weapon system : inclut canister et ingénierie, non comparable à un missile flyaway.",
    normalizedNote: "Valeur P-5 conservée telle quelle.",
  },
  {
    recordId: "f22-modernization",
    systemId: "f-22-raptor",
    costType: "program",
    amount: 9_000_000_000,
    currency: "USD",
    year: 2025,
    perimeter: "Modernisation et maintien de pertinence flotte close",
    rawValue: "Effort d'environ 9 Md$",
    sourceIds: ["af-mag"],
    uncertainty: "medium",
    comparabilityLimit:
      "Programme de modernisation d'une flotte fermée ; non comparable à une acquisition neuve.",
    normalizedNote: "Ordre de grandeur de programme, conservé sans ventilation.",
  },
  {
    recordId: "heron-tp-cell",
    systemId: "heron-tp",
    costType: "unit_public",
    amount: 9_500_000,
    currency: "USD",
    year: 2024,
    perimeter: "Coût de cellule estimé",
    rawValue: "≈ 9,5 M$",
    sourceIds: ["globalmilitary"],
    uncertainty: "high",
    comparabilityLimit:
      "Cellule estimée ; location, armement, station sol et soutien dominent les packages export.",
    normalizedNote: "Montant estimatif conservé avec incertitude haute.",
  },
];
