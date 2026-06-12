import type {
  AcquisitionMode,
  ArtilleryArchitecture,
  ArtilleryBarrelLength,
  ArtilleryCaliber,
  ArtilleryCarrier,
  ArtilleryInteropStatus,
  ArtilleryLoading,
  Brick,
  DefenseSystem,
  Indicator,
  Score,
  SourceRef,
} from "../types";

const UPDATED = "2026-06-12";

interface ArtillerySystemInput {
  slug: string;
  name: string;
  designation: string;
  reference: string;
  classLabel: string;
  country: string;
  flag: string;
  manufacturer: string;
  introduced: string;
  status: string;
  acquisitionModes: AcquisitionMode[];
  tagline: string;
  summary: string;
  carrier: ArtilleryCarrier;
  architecture: ArtilleryArchitecture;
  caliber: ArtilleryCaliber;
  barrelLength: ArtilleryBarrelLength;
  loading: ArtilleryLoading;
  interopStatus: ArtilleryInteropStatus;
  crewProtection: string;
  fcs: string;
  c2: string;
  ammunitionFamilies: string[];
  guidedFamilies?: string[];
  ammunitionPerimeter: string;
  ammunitionCaution?: string;
  tubeWearNotes?: string;
  resupplyVehicle?: string;
  maintenanceNotes?: string;
  productionNotes?: string;
  industrialNotes: string;
  costNotes?: string;
  exportNotes?: string;
  cost: string;
  finance: string;
  supplyChain: string;
  geopolitics: string;
  export: string;
  costFrame: string;
  financeFrame: string;
  industrialFrame: string;
  exportFrame: string;
  operators: string[];
  theatres: string[];
  timeline: DefenseSystem["timeline"];
  sources: SourceRef[];
  editorial: DefenseSystem["editorial"];
  scores?: Score[];
}

function indicator(
  label: string,
  value: string,
  sources: string[],
  confidence: Indicator["confidence"] = "moyenne",
  status?: Indicator["status"],
  note?: string,
): Indicator {
  return { label, value, confidence, status, note, sources };
}

function scoreSet(
  sourceConfidence: Score["grade"],
  maturity: Score["grade"],
  exportability: Score["grade"],
  industrialRisk: Score["grade"] = "B",
): Score[] {
  return [
    {
      key: "efficacite-cout",
      grade: "C",
      rationale:
        "Lecture limitée au coût public, au périmètre contractuel, au soutien et aux munitions ; aucune comparaison d'efficacité militaire n'est produite.",
    },
    {
      key: "survivabilite",
      grade: "C",
      rationale:
        "Le palier reflète seulement protection, mobilité déclarée et dépendances de soutien, pas une recommandation d'emploi tactique.",
    },
    {
      key: "exportabilite",
      grade: exportability,
      rationale:
        "L'exportabilité dépend du régime national, des licences, de l'intégration munitions et des options de production locale.",
    },
    {
      key: "risque-industriel",
      grade: industrialRisk,
      rationale:
        "Risque lu par cadence, disponibilité de tubes, munitions, porteurs, sous-traitants et capacité de maintenance.",
    },
    {
      key: "maturite",
      grade: maturity,
      rationale:
        "La maturité suit les livraisons, modernisations, variantes et retours publics, sans tirer de conclusion opérationnelle.",
    },
    {
      key: "confiance-donnees",
      grade: sourceConfidence,
      rationale:
        "Le palier dépend de sources constructeur, institutionnelles ou presse ; les paramètres de tir fins sont volontairement exclus.",
    },
  ];
}

function makeArtillerySystem(input: ArtillerySystemInput): DefenseSystem {
  const sourceIds = input.sources.map((source) => source.id);
  const primary = [input.sources[0]?.id ?? ""].filter(Boolean);
  const primaryOrAll = primary.length > 0 ? primary : sourceIds;
  const scores = input.scores ?? scoreSet("B", "B", "B");
  const safetyBoundary =
    "Pas de table de tir, pas de calcul balistique, pas de coordonnées, pas de contre-batterie, pas de procédure d'emploi.";

  const bricks: Brick[] = [
    {
      key: "cout",
      narrative: input.cost,
      indicators: [
        indicator("Périmètre coût", input.costFrame, sourceIds),
        indicator(
          "Incertitude",
          "Distinguer plateforme, lot contractuel, munitions, véhicules de soutien, formation, MCO, tubes et production locale.",
          primaryOrAll,
        ),
      ],
    },
    {
      key: "finance",
      narrative: input.finance,
      indicators: [
        indicator("Portage programme", input.financeFrame, sourceIds, "moyenne"),
        indicator(
          "Lecture budgétaire",
          "Capacité de feu terrestre à lire avec stocks de munitions, ravitaillement et soutien sur cycle de vie.",
          primaryOrAll,
        ),
      ],
    },
    {
      key: "supply-chain",
      narrative: input.supplyChain,
      indicators: [
        indicator("Chaîne industrielle", input.industrialFrame, sourceIds, "haute"),
        indicator("MCO / tubes", input.maintenanceNotes ?? "Soutien à recouper par contrat.", sourceIds),
      ],
    },
    {
      key: "geopolitique",
      narrative: input.geopolitics,
      indicators: [
        indicator("Fonction stratégique", input.classLabel, primaryOrAll, "haute"),
        indicator("Souveraineté / dépendance", input.industrialNotes, sourceIds),
      ],
    },
    {
      key: "export",
      narrative: input.export,
      indicators: [
        indicator("Régime public", input.exportFrame, sourceIds),
        indicator("Limite Panoplie", safetyBoundary, primaryOrAll, "haute"),
      ],
    },
  ];

  return {
    slug: input.slug,
    name: input.name,
    designation: input.designation,
    reference: input.reference,
    category: "artillery",
    classLabel: input.classLabel,
    country: input.country,
    flag: input.flag,
    manufacturer: input.manufacturer,
    introduced: input.introduced,
    status: input.status,
    acquisitionModes: input.acquisitionModes,
    tagline: input.tagline,
    summary: input.summary,
    keySpecs: [
      indicator("Mission", input.classLabel, primaryOrAll, "haute"),
      indicator("Porteur", input.carrier, sourceIds),
      indicator("Calibre / tube", `${input.caliber} · ${input.barrelLength}`, sourceIds),
      indicator("Chargement", input.loading, sourceIds),
      indicator("Garde-fou", safetyBoundary, primaryOrAll, "haute"),
    ],
    bricks,
    scores,
    editorial: input.editorial,
    legalNote:
      "Dossier OSINT stratégique non opérationnel : les données de portée, cadence ou munition sont traitées comme claims publics dépendants du périmètre source, sans table balistique, procédure de tir, ciblage ou optimisation d'emploi.",
    operators: input.operators,
    theatres: input.theatres,
    timeline: input.timeline,
    sources: input.sources,
    updated: UPDATED,
    artilleryProfile: {
      carrier: input.carrier,
      architecture: input.architecture,
      caliber: input.caliber,
      barrelLength: input.barrelLength,
      loading: input.loading,
      interopStatus: input.interopStatus,
      crewProtection: input.crewProtection,
      fcs: input.fcs,
      c2: input.c2,
      ammunition: {
        families: input.ammunitionFamilies,
        guidedFamilies: input.guidedFamilies,
        sourcePerimeter: input.ammunitionPerimeter,
        caution: input.ammunitionCaution,
      },
      sustainment: {
        tubeWearNotes: input.tubeWearNotes,
        resupplyVehicle: input.resupplyVehicle,
        maintenanceNotes: input.maintenanceNotes,
        productionNotes: input.productionNotes,
      },
      industrialNotes: input.industrialNotes,
      costNotes: input.costNotes,
      exportNotes: input.exportNotes,
      safetyBoundary,
    },
  };
}

export const caesarMk2 = makeArtillerySystem({
  slug: "caesar-mk2",
  name: "CAESAR 6x6 / Mk2",
  designation: "Camion équipé d'un système d'artillerie · 155 mm / 52 calibres",
  reference: "PNP-ART-001",
  classLabel: "Obusier automoteur 155 mm sur camion 6x6",
  country: "France",
  flag: "🇫🇷",
  manufacturer: "KNDS France",
  introduced: "2008 ; Mk2 en production 2020s",
  status:
    "Référence française et export ; standard Mk2 en montée industrielle, avec commandes françaises et renouvellement de parc.",
  acquisitionModes: ["production-nationale", "DCS"],
  tagline:
    "Le format canon sur camion devenu référence export : coût, mobilité routière, cadence industrielle et munitions 155 mm à lire comme système complet.",
  summary:
    "CAESAR 6x6 / Mk2 est documenté ici comme un programme d'artillerie mobile, pas comme une recette d'emploi. Le dossier suit le porteur, la cabine, le tube 155/52, la chaîne KNDS, les stocks de munitions, les contrats export, le soutien et les limites de preuve. Les performances de tir restent des revendications constructeur ou institutionnelles, dépendantes des munitions et du périmètre source.",
  carrier: "truck-6x6",
  architecture: "protected-cab",
  caliber: "155mm",
  barrelLength: "L52",
  loading: "assisted",
  interopStatus: "jbmou-qualified",
  crewProtection:
    "Cabine protégée revendiquée sur Mk2 ; la pièce reste un système sur camion avec arbitrage protection/masse.",
  fcs: "Conduite de tir numérique et navigation inertielle/GNSS selon configuration publique.",
  c2: "Intégration aux chaînes de commandement nationales et export selon client.",
  ammunitionFamilies: ["155 mm OTAN", "ERFB", "base bleed", "RAP selon stock client"],
  guidedFamilies: ["BONUS", "Excalibur ou équivalents selon intégration et autorisation"],
  ammunitionPerimeter:
    "Familles 155 mm publiques ; pas de table de tir, pas de réglage de fusée exploitable.",
  ammunitionCaution:
    "Portée et cadence varient fortement selon munition, lot, charge et doctrine ; Panoplie ne les compare pas en performance tactique.",
  tubeWearNotes:
    "L'usure tube et le remplacement sont des postes de coût MCO, rarement consolidés publiquement.",
  resupplyVehicle:
    "Véhicules munitions et lots de soutien à distinguer du prix de la plateforme.",
  maintenanceNotes:
    "MCO à lire avec porteur routier, tube 155 mm, hydraulique, électronique et stocks de pièces.",
  productionNotes:
    "KNDS France a augmenté ses cadences publiques après 2022 ; cadence exacte à suivre par sources ministérielles.",
  industrialNotes:
    "Chaîne française centrée KNDS, avec dépendances porteur, tubes, viseurs, électronique et munitions.",
  costNotes:
    "Coût à distinguer entre pièce seule, lot d'accompagnement, munitions, formation, MCO et cadence industrielle.",
  exportNotes:
    "Succès export important ; chaque client implique licences, munitions et soutien spécifiques.",
  cost:
    "Le coût du CAESAR ne se réduit pas au camion canon : munitions 155 mm, tubes, véhicules de ravitaillement, formation, pièces et adaptation client dominent la comparaison sérieuse.",
  finance:
    "La dynamique post-2022 transforme CAESAR en enjeu de cadence industrielle et de reconstitution de stocks, avec financement national et export.",
  supplyChain:
    "Le système agrège porteur, tube, conduite de tir, électronique, munitions et soutien KNDS ; la résilience vient surtout de la capacité à produire et maintenir ces briques.",
  geopolitics:
    "CAESAR est devenu un marqueur de souveraineté française et de soutien européen, notamment parce qu'il combine standard 155 mm et modèle export relativement lisible.",
  export:
    "L'export repose sur l'attractivité du format camion, la compatibilité 155 mm et la capacité de soutien ; Panoplie exclut tout conseil de contournement export.",
  costFrame: "Plateforme + lot de soutien + munitions + formation + MCO + tubes",
  financeFrame: "Programme français et ventes export KNDS, reconstitution post-2022",
  industrialFrame: "KNDS France, porteurs, tubes 155 mm, électronique, munitions",
  exportFrame: "Licences françaises et contrats client par client",
  operators: ["France", "Danemark", "Ukraine", "Indonésie", "Thaïlande", "Arabie saoudite"],
  theatres: ["Europe", "Moyen-Orient", "Indo-Pacifique"],
  timeline: [
    { date: "2008", label: "Mise en service publique du CAESAR 6x6 en France.", kind: "jalon" },
    { date: "2020s", label: "Montée de cadence et standard Mk2 dans le contexte de recomplètement européen.", kind: "jalon" },
  ],
  sources: [
    {
      id: "knds-caesar-mk2",
      title: "CAESAR Mk2",
      publisher: "KNDS",
      type: "constructeur",
      reliability: "B",
      url: "https://knds.com/en/products/systems/caesar-mk-2",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un camion avec un canon suffit à résumer le système. La réalité : la valeur tient aux stocks 155 mm, au MCO, aux tubes, au ravitaillement et à la cadence industrielle.",
    bestUseCase:
      "Comparer coût public, supply chain et export d'un format camion 155 mm sans traiter l'emploi tactique.",
    weakPoint:
      "Les coûts consolidés par lot et la consommation de tubes/munitions sont rarement publiés de façon homogène.",
    analystNote:
      "CAESAR est un excellent cas Panoplie : son succès est autant industriel et budgétaire que technique.",
  },
  scores: scoreSet("B", "B", "A", "B"),
});

export const caesar8x8 = makeArtillerySystem({
  slug: "caesar-8x8",
  name: "CAESAR 8x8",
  designation: "Variante lourde CAESAR · porteur 8x8",
  reference: "PNP-ART-002",
  classLabel: "Obusier automoteur 155 mm sur camion 8x8",
  country: "France",
  flag: "🇫🇷",
  manufacturer: "KNDS France",
  introduced: "2010s",
  status:
    "Variante export et configuration lourde, offrant charge utile et automatisation accrues selon client.",
  acquisitionModes: ["DCS", "production-nationale"],
  tagline:
    "La lecture lourde du CAESAR : plus de masse, plus d'emport et plus d'options, avec un coût et un soutien à isoler du 6x6.",
  summary:
    "CAESAR 8x8 reprend la logique 155/52 sur camion mais déplace l'arbitrage vers l'emport, la protection et l'automatisation. Panoplie le sépare du 6x6 pour éviter une comparaison simpliste : un 8x8 implique porteur, munitions embarquées, soute, soutien et contrat client différents.",
  carrier: "truck-8x8",
  architecture: "protected-cab",
  caliber: "155mm",
  barrelLength: "L52",
  loading: "semi-automatic",
  interopStatus: "jbmou-qualified",
  crewProtection:
    "Cabine protégée selon configuration ; plateforme plus lourde que le 6x6.",
  fcs: "Conduite de tir numérique CAESAR, automatisation accrue selon fiche publique.",
  c2: "Intégration client par chaîne nationale, standard OTAN si retenu contractuellement.",
  ammunitionFamilies: ["155 mm OTAN", "ERFB", "base bleed", "RAP selon client"],
  guidedFamilies: ["Familles guidées 155 mm selon autorisation et intégration"],
  ammunitionPerimeter:
    "Compatibilité 155 mm publique ; la fiche ne détaille ni charges ni solutions de tir.",
  tubeWearNotes:
    "Le tube 155/52 et la chaîne de soutien doivent être isolés dans tout coût de possession.",
  resupplyVehicle: "Ravitaillement et soute plus importants que sur 6x6 selon configuration.",
  maintenanceNotes:
    "MCO influencé par porteur 8x8, automatisation et stock de pièces spécifique.",
  productionNotes:
    "Production liée aux commandes export et à la capacité KNDS de gérer variantes.",
  industrialNotes:
    "KNDS France, porteur 8x8, intégration client, munitions et soutien.",
  costNotes:
    "Surcoût probable face au 6x6 à lire par protection, emport, automatisation et package.",
  exportNotes:
    "Positionné pour clients cherchant un format camion 155 mm plus lourd.",
  cost:
    "Le CAESAR 8x8 doit être comparé comme variante lourde : le coût unitaire apparent ne suffit pas sans emport, soutien, porteur et lot munitions.",
  finance:
    "Les contrats 8x8 relèvent surtout d'arbitrages export : capacité routière, niveau de protection, besoins de production locale et financement client.",
  supplyChain:
    "La chaîne reste KNDS, mais le porteur 8x8 et l'automatisation renforcent la part intégration et soutien.",
  geopolitics:
    "La variante 8x8 illustre la segmentation du marché : certains clients veulent le standard CAESAR avec davantage d'emport et de protection.",
  export:
    "L'export dépend du porteur, de la munition, des offsets et des licences françaises ; aucune lecture de contournement n'est proposée.",
  costFrame: "Plateforme 8x8 + automatisation + munitions + soutien + intégration client",
  financeFrame: "Contrats export et options de configuration",
  industrialFrame: "KNDS France + porteur 8x8 + chaîne 155 mm",
  exportFrame: "Contrats directs sous autorisation française",
  operators: ["République tchèque", "Danemark (commandes transférées/remplacées selon contexte public)"],
  theatres: ["Europe", "Marchés export"],
  timeline: [
    { date: "2015", label: "Présentation publique de la variante CAESAR 8x8.", kind: "jalon" },
    { date: "2020s", label: "Commandes et arbitrages européens autour des formats camion 155 mm.", kind: "export" },
  ],
  sources: [
    {
      id: "knds-caesar-8x8",
      title: "CAESAR 8x8",
      publisher: "KNDS",
      type: "constructeur",
      reliability: "B",
      url: "https://knds.com/en/products/systems/caesar-8x8",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : 6x6 et 8x8 seraient interchangeables. La réalité : le porteur change l'économie du système, son soutien et sa proposition export.",
    bestUseCase:
      "Comparer des architectures camion 155 mm selon coût de possession, emport, protection et soutien.",
    weakPoint:
      "Les packages export rendent les comparaisons publiques très hétérogènes.",
    analystNote:
      "La question n'est pas seulement combien coûte le 8x8, mais quel surcoût il apporte dans le package complet.",
  },
  scores: scoreSet("B", "B", "B", "B"),
});

export const archer = makeArtillerySystem({
  slug: "archer",
  name: "Archer",
  designation: "BAE Systems Bofors Archer Artillery System",
  reference: "PNP-ART-003",
  classLabel: "Obusier 155 mm automatisé sur porteur protégé",
  country: "Suède",
  flag: "🇸🇪",
  manufacturer: "BAE Systems Bofors",
  introduced: "2010s",
  status:
    "Système suédois en service et export, avec architecture très automatisée et variantes de porteur.",
  acquisitionModes: ["production-nationale", "DCS"],
  tagline:
    "L'artillerie sur camion pensée comme système automatisé : cabine protégée, munitionnement intégré et supply chain nordique à suivre.",
  summary:
    "Archer est traité comme un cas d'automatisation industrielle : la fiche lit le porteur, la protection, le chargement automatique, le stock embarqué, la conduite de tir et l'export. Les cadences et portées restent des claims constructeur, non des paramètres d'emploi.",
  carrier: "truck-6x6",
  architecture: "protected-cab",
  caliber: "155mm",
  barrelLength: "L52",
  loading: "automatic",
  interopStatus: "jbmou-claimed",
  crewProtection:
    "Équipage en cabine protégée selon architecture publique, avec manipulation réduite autour de la pièce.",
  fcs: "Système automatisé avec conduite de tir, navigation et gestion munitions intégrées.",
  c2: "Interfaces BMS/C2 revendiquées publiquement, intégration selon pays utilisateur.",
  ammunitionFamilies: ["155 mm OTAN", "munitions conventionnelles", "base bleed selon stock"],
  guidedFamilies: ["Excalibur et familles guidées selon autorisation publique"],
  ammunitionPerimeter:
    "Familles 155 mm publiées par constructeur ; pas de procédure de chargement ni réglage exploitable.",
  tubeWearNotes:
    "Automatisation et tube 155/52 doivent être suivis comme postes de maintenance spécifiques.",
  resupplyVehicle:
    "Soutien munitions et recomplètement à documenter par package national/export.",
  maintenanceNotes:
    "Soutien à lire avec automatisation, porteur et disponibilité de pièces BAE/Bofors.",
  productionNotes:
    "Production liée aux commandes suédoises, britanniques et export, avec adaptations de porteur.",
  industrialNotes:
    "BAE Systems Bofors, base industrielle suédoise, porteurs et intégration client.",
  costNotes:
    "Coût probablement porté par automatisation et intégration, à comparer seulement par package.",
  exportNotes:
    "Export actif ; variantes et porteurs doivent être distingués dans les sources.",
  cost:
    "Archer illustre le coût de l'automatisation : le prix public doit être lu avec la cabine protégée, la gestion munitions, le porteur et le soutien logiciel.",
  finance:
    "La finance programme suit les commandes nationales et les acquisitions d'urgence ou de recomplètement en Europe.",
  supplyChain:
    "La chaîne BAE/Bofors et les porteurs associés créent un profil industriel nordique, avec intégration export client.",
  geopolitics:
    "Archer est un marqueur de capacité suédoise et de coopération européenne post-2022, y compris dans les dons et remplacements.",
  export:
    "La valeur export réside dans l'automatisation et la protection ; Panoplie ne fournit aucun conseil d'emploi ou d'export.",
  costFrame: "Système automatisé + porteur + munitions + soutien logiciel + MCO",
  financeFrame: "Commandes nationales suédoises et contrats export européens",
  industrialFrame: "BAE Systems Bofors, porteurs, intégration C2 et munitions 155 mm",
  exportFrame: "Export sous autorisations nationales et configurations client",
  operators: ["Suède", "Royaume-Uni", "Ukraine"],
  theatres: ["Europe", "Ukraine (données publiques de transfert)"],
  timeline: [
    { date: "2010s", label: "Entrée en service publique dans les forces suédoises.", kind: "jalon" },
    { date: "2023", label: "Transferts et commandes européennes renforçant la visibilité du système.", kind: "export" },
  ],
  sources: [
    {
      id: "bae-archer",
      title: "Archer artillery system",
      publisher: "BAE Systems",
      type: "constructeur",
      reliability: "B",
      url: "https://www.baesystems.com/en/product/archer",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : l'automatisation serait seulement une cadence. La réalité : elle change coûts, maintenance, formation, soutien logiciel et résilience industrielle.",
    bestUseCase:
      "Étudier l'arbitrage entre automatisation, protection et coût complet.",
    weakPoint:
      "Les configurations de porteur et d'export peuvent varier fortement.",
    analystNote:
      "Archer est utile pour comparer architectures automatisées et formats camion plus rustiques.",
  },
  scores: scoreSet("B", "B", "B", "B"),
});

export const atmos = makeArtillerySystem({
  slug: "atmos",
  name: "ATMOS",
  designation: "Autonomous Truck Mounted howitzer System",
  reference: "PNP-ART-004",
  classLabel: "Obusier 155 mm sur camion modulaire",
  country: "Israël",
  flag: "🇮🇱",
  manufacturer: "Elbit Systems",
  introduced: "2000s",
  status:
    "Système export modulaire, proposé sur plusieurs porteurs et configurations 155 mm.",
  acquisitionModes: ["DCS"],
  tagline:
    "Le modèle export modulaire d'Elbit : porteur client, tube 155 mm et intégration munitions à lire contrat par contrat.",
  summary:
    "ATMOS est un cas d'école de modularité export. Panoplie suit les porteurs, le périmètre 155 mm, les munitions, la conduite de tir Elbit et les chaînes locales possibles, sans transformer les revendications de performance en vérité opérationnelle.",
  carrier: "truck-6x6",
  architecture: "open-mount",
  caliber: "155mm",
  barrelLength: "L52",
  loading: "assisted",
  interopStatus: "jbmou-claimed",
  crewProtection:
    "Protection dépendante du porteur et de la cabine retenue par le client.",
  fcs: "Suite de conduite de tir Elbit, navigation et intégration numérique selon configuration.",
  c2: "Intégration aux réseaux client ; architecture export modulaire.",
  ammunitionFamilies: ["155 mm OTAN", "familles Elbit", "ERFB/base bleed selon contrat"],
  guidedFamilies: ["PGM 155 mm selon autorisation et stock client"],
  ammunitionPerimeter:
    "Compatibilités publiées au niveau famille ; pas de table ni paramètre de tir.",
  ammunitionCaution:
    "ATMOS étant modulaire, les données exactes changent avec tube, porteur et munition.",
  tubeWearNotes:
    "Usure tube à traiter dans le MCO client, non consolidée publiquement.",
  resupplyVehicle: "Solution de ravitaillement dépendante de l'armée cliente.",
  maintenanceNotes:
    "Soutien lié au porteur local, à la conduite de tir Elbit et à la munition retenue.",
  productionNotes:
    "Possibilités de production locale ou d'intégration porteur selon accords export.",
  industrialNotes:
    "Elbit Systems, porteurs nationaux/export, munitions 155 mm et offsets possibles.",
  costNotes:
    "Coût très dépendant du porteur, de la production locale, de la dotation munitions et du C2.",
  exportNotes:
    "Large orientation export ; chaque contrat doit être lu avec licence, offsets et porteur.",
  cost:
    "ATMOS se prête mal à un prix unitaire unique : porteur, tube, C2, munitions et offsets changent d'un contrat à l'autre.",
  finance:
    "Le financement est souvent export et client-spécifique, avec logique de production locale ou d'intégration nationale.",
  supplyChain:
    "La chaîne combine Elbit, porteur choisi, électronique, munitions et partenaires locaux.",
  geopolitics:
    "ATMOS reflète l'agilité de l'industrie israélienne sur les marchés où modularité et délais comptent.",
  export:
    "La fiche reste non juridique : elle décrit le caractère export et les contraintes publiques, sans stratégie de transfert.",
  costFrame: "Porteur + tube + conduite de tir + munitions + offsets + MCO",
  financeFrame: "Contrats export modulaires et financements client",
  industrialFrame: "Elbit Systems + porteurs locaux/export + munitions 155 mm",
  exportFrame: "Contrats sous régime israélien et autorisations client",
  operators: ["Israël", "Philippines", "Thaïlande", "Danemark (commande publiquement évoquée)", "Colombie"],
  theatres: ["Moyen-Orient", "Asie", "Europe"],
  timeline: [
    { date: "2000s", label: "Diffusion export progressive de la famille ATMOS.", kind: "export" },
    { date: "2020s", label: "Nouvelles commandes et reconfiguration du marché 155 mm sur camion.", kind: "export" },
  ],
  sources: [
    {
      id: "elbit-atmos",
      title: "ATMOS howitzer system",
      publisher: "Elbit Systems",
      type: "constructeur",
      reliability: "B",
      url: "https://www.elbitsystems.com/land/weapons-systems-and-munitions/howitzer-systems/atmos",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : ATMOS serait un standard unique. La réalité : c'est une famille modulaire où porteur et contrat font beaucoup.",
    bestUseCase:
      "Analyser un modèle export souple : coût, porteur, offsets, munitions et intégration nationale.",
    weakPoint:
      "La variabilité des configurations rend la comparaison publique délicate.",
    analystNote:
      "ATMOS doit être lu comme une plateforme d'intégration export, pas comme une fiche technique figée.",
  },
  scores: scoreSet("B", "B", "A", "B"),
});

export const rch155 = makeArtillerySystem({
  slug: "rch-155",
  name: "RCH 155",
  designation: "Remote Controlled Howitzer 155 · Boxer/AGM",
  reference: "PNP-ART-005",
  classLabel: "Module 155 mm téléopéré sur blindé 8x8",
  country: "Allemagne · Royaume-Uni",
  flag: "🇩🇪",
  manufacturer: "KNDS Deutschland · ARTEC Boxer",
  introduced: "2020s",
  status:
    "Programme en montée, choisi notamment par l'Allemagne et le Royaume-Uni autour de la plateforme Boxer.",
  acquisitionModes: ["cooperatif", "DCS"],
  tagline:
    "Le 155 mm comme module téléopéré : Boxer, automatisation et coût d'intégration au cœur de la lecture Panoplie.",
  summary:
    "RCH 155 combine le module AGM 155/52 et le véhicule Boxer. La fiche suit l'automatisation, la protection, l'intégration C2, la chaîne KNDS/Boxer et les contrats européens. Elle exclut toute procédure ou paramètre de tir.",
  carrier: "armored-8x8",
  architecture: "remote-module",
  caliber: "155mm",
  barrelLength: "L52",
  loading: "automatic",
  interopStatus: "jbmou-qualified",
  crewProtection:
    "Équipage dans véhicule blindé Boxer ; module d'arme téléopéré selon revendication publique.",
  fcs: "Module automatisé AGM avec conduite de tir numérique et architecture Boxer.",
  c2: "Intégration dans réseaux Boxer/nationaux, à documenter par pays utilisateur.",
  ammunitionFamilies: ["155 mm OTAN", "munitions JBMOU", "familles longue portée selon source"],
  guidedFamilies: ["Familles guidées 155 mm selon intégration publique"],
  ammunitionPerimeter:
    "Compatibilité 155 mm au niveau standard ; pas de paramètres de mission ni charges.",
  tubeWearNotes:
    "Tube 155/52 et module automatisé imposent une lecture MCO spécifique.",
  resupplyVehicle:
    "Ravitaillement et recomplètement à isoler du véhicule Boxer porteur.",
  maintenanceNotes:
    "MCO à lire avec châssis Boxer, module AGM, électronique et munitions.",
  productionNotes:
    "Production dépendante de la base Boxer, KNDS et commandes européennes.",
  industrialNotes:
    "KNDS Deutschland, ARTEC Boxer, supply chain 8x8 européenne et munitions 155 mm.",
  costNotes:
    "Coût à lire comme intégration blindé 8x8 + module automatisé, distinct d'un camion ouvert.",
  exportNotes:
    "Très lié aux pays déjà engagés sur Boxer ou cherchant un module 155 protégé.",
  cost:
    "RCH 155 n'est pas un simple canon : le coût porte sur le blindé 8x8 Boxer, le module automatisé, le soutien et l'intégration réseau.",
  finance:
    "Les acquisitions s'inscrivent dans le renouvellement européen de l'artillerie et la base industrielle Boxer.",
  supplyChain:
    "Le risque industriel se concentre sur Boxer, KNDS, l'automatisation, les tubes et les munitions 155 mm.",
  geopolitics:
    "RCH 155 illustre la préférence de certains pays européens pour une architecture plus protégée et standardisée Boxer.",
  export:
    "L'export est attractif pour clients Boxer ; Panoplie s'arrête aux régimes publics et aux dépendances industrielles.",
  costFrame: "Boxer 8x8 + AGM 155 + automatisation + munitions + soutien",
  financeFrame: "Programmes nationaux européens et coopérations Boxer",
  industrialFrame: "KNDS Deutschland, ARTEC Boxer, fournisseurs 155 mm",
  exportFrame: "Contrats européens sous autorisations nationales",
  operators: ["Allemagne", "Royaume-Uni (programme public)", "Ukraine (commande annoncée publiquement)"],
  theatres: ["Europe"],
  timeline: [
    { date: "2022", label: "Visibilité accrue du RCH 155 dans les commandes européennes.", kind: "jalon" },
    { date: "2020s", label: "Adoption par des programmes Boxer et renouvellement artillerie.", kind: "export" },
  ],
  sources: [
    {
      id: "knds-rch-155",
      title: "RCH 155",
      publisher: "KNDS",
      type: "constructeur",
      reliability: "B",
      url: "https://knds.com/en/products/systems/rch-155",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : RCH 155 serait seulement un PzH 2000 sur roues. La réalité : c'est un module automatisé sur écosystème Boxer.",
    bestUseCase:
      "Comparer le coût d'une architecture blindée téléopérée face aux camions 155 mm.",
    weakPoint:
      "Maturité et coûts de soutien restent à suivre au fur et à mesure des livraisons.",
    analystNote:
      "RCH 155 est une fiche parfaite pour la brique supply chain : le châssis compte autant que le canon.",
  },
  scores: scoreSet("B", "C", "B", "B"),
});

export const pzh2000 = makeArtillerySystem({
  slug: "pzh-2000",
  name: "PzH 2000",
  designation: "Panzerhaubitze 2000 · 155 mm / L52",
  reference: "PNP-ART-006",
  classLabel: "Obusier automoteur chenillé lourd 155 mm",
  country: "Allemagne",
  flag: "🇩🇪",
  manufacturer: "KNDS Deutschland · Rheinmetall",
  introduced: "1998",
  status:
    "Système lourd de référence en Europe, modernisé et fortement sollicité dans le contexte post-2022.",
  acquisitionModes: ["production-nationale", "DCS"],
  tagline:
    "La référence chenillée lourde européenne : protection, automatisation, MCO et tubes au centre de l'analyse.",
  summary:
    "PzH 2000 représente le haut du spectre chenillé : tourelle protégée, tube 155/52, chargement automatisé et logistique lourde. Panoplie le lit par coût complet, maintenance, disponibilité des tubes, industriels et export, sans décrire d'emploi tactique.",
  carrier: "tracked-heavy",
  architecture: "protected-turret",
  caliber: "155mm",
  barrelLength: "L52",
  loading: "automatic",
  interopStatus: "jbmou-qualified",
  crewProtection:
    "Plateforme chenillée blindée avec tourelle protégée, au prix d'un soutien plus lourd.",
  fcs: "Conduite de tir numérique et chargement automatisé selon sources constructeur.",
  c2: "Intégration aux chaînes nationales utilisatrices et standards OTAN.",
  ammunitionFamilies: ["155 mm OTAN", "munitions JBMOU", "familles longue portée publiques"],
  guidedFamilies: ["SMArt 155", "Excalibur ou équivalents selon pays"],
  ammunitionPerimeter:
    "Familles 155 mm publiques ; pas de détails de charges, calculs ou tables.",
  tubeWearNotes:
    "L'usure des tubes est un sujet public de disponibilité et MCO, pas une donnée d'optimisation.",
  resupplyVehicle: "Véhicules logistiques et stocks 155 mm indispensables au coût complet.",
  maintenanceNotes:
    "MCO lourd : chenilles, motorisation, tourelle, chargeur, tube et pièces spécifiques.",
  productionNotes:
    "Base industrielle KNDS/Rheinmetall ; modernisation et recomplètement européens à suivre.",
  industrialNotes:
    "KNDS Deutschland, Rheinmetall, sous-traitants blindés, tubes et munitions 155 mm.",
  costNotes:
    "Coût de possession plus élevé qu'un camion, mais protection et automatisation supérieures.",
  exportNotes:
    "Export européen et transferts publics ; disponibilité des parcs et soutien sont des contraintes.",
  cost:
    "Le PzH 2000 impose une lecture TCO : chenilles, tourelle, automatisation, tubes, pièces et MCO pèsent plus qu'un prix de plateforme isolé.",
  finance:
    "Le financement porte sur modernisation, recomplètement, transferts et maintien de disponibilité dans les parcs européens.",
  supplyChain:
    "La chaîne KNDS/Rheinmetall est mature mais contrainte par tubes, pièces, munitions et capacités de maintenance.",
  geopolitics:
    "Le PzH 2000 est un marqueur de l'artillerie lourde européenne et de la dépendance aux stocks 155 mm.",
  export:
    "Les transferts/export sont limités par disponibilité des parcs, autorisations nationales et capacité de soutien.",
  costFrame: "Plateforme chenillée + tourelle + tube + MCO lourd + munitions",
  financeFrame: "Parcs nationaux, modernisation, transferts et recomplètement",
  industrialFrame: "KNDS Deutschland, Rheinmetall, tubes, munitions et MCO",
  exportFrame: "Export/transferts sous autorisations nationales européennes",
  operators: ["Allemagne", "Pays-Bas", "Italie", "Grèce", "Croatie", "Ukraine"],
  theatres: ["Europe", "Ukraine (transferts publics)"],
  timeline: [
    { date: "1998", label: "Entrée en service publique en Allemagne.", kind: "jalon" },
    { date: "2022", label: "Transferts européens à l'Ukraine et retour d'attention sur MCO/tubes.", kind: "emploi" },
  ],
  sources: [
    {
      id: "knds-pzh-2000",
      title: "PzH 2000",
      publisher: "KNDS",
      type: "constructeur",
      reliability: "B",
      url: "https://knds.com/en/products/systems/pzh-2000",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un système lourd serait simplement meilleur. La réalité : il apporte protection et automatisation, mais aussi MCO, logistique et coût plus lourds.",
    bestUseCase:
      "Lire l'économie d'une plateforme chenillée lourde européenne face aux canons sur camion.",
    weakPoint:
      "Disponibilité, tubes et pièces sont des variables aussi importantes que les performances revendiquées.",
    analystNote:
      "Le PzH 2000 rappelle que la supériorité technique ne suffit pas : la soutenabilité industrielle décide beaucoup.",
  },
  scores: scoreSet("B", "A", "B", "B"),
});

export const k9Thunder = makeArtillerySystem({
  slug: "k9-thunder",
  name: "K9 Thunder / K9A1 / K9A2",
  designation: "Hanwha K9 family · 155 mm / L52",
  reference: "PNP-ART-007",
  classLabel: "Obusier automoteur chenillé lourd 155 mm",
  country: "Corée du Sud",
  flag: "🇰🇷",
  manufacturer: "Hanwha Aerospace",
  introduced: "1999",
  status:
    "Famille chenillée export majeure, avec variantes nationales et production/licence dans plusieurs pays.",
  acquisitionModes: ["DCS", "production-nationale"],
  tagline:
    "L'artillerie coréenne devenue plateforme export mondiale : licence, cadence et supply chain comme avantage stratégique.",
  summary:
    "La famille K9 est l'un des principaux succès export de l'artillerie lourde. Panoplie la lit comme écosystème industriel : plateforme, variantes A1/A2, production sous licence, véhicules de ravitaillement, munitions 155 mm et dépendances de soutien.",
  carrier: "tracked-heavy",
  architecture: "protected-turret",
  caliber: "155mm",
  barrelLength: "L52",
  loading: "semi-automatic",
  interopStatus: "jbmou-claimed",
  crewProtection:
    "Plateforme chenillée blindée avec tourelle protégée ; niveau exact selon variante et client.",
  fcs: "Conduite de tir numérique et automatisation accrue selon standards K9A1/K9A2.",
  c2: "Intégration nationale/export, avec adaptations locales et production sous licence.",
  ammunitionFamilies: ["155 mm OTAN", "munitions nationales coréennes", "familles longue portée publiques"],
  guidedFamilies: ["PGM 155 mm selon pays et autorisations"],
  ammunitionPerimeter:
    "Compatibilité 155 mm au niveau public ; variantes et munitions client à distinguer.",
  tubeWearNotes:
    "Tubes et soutien à lire avec cadence industrielle et production locale.",
  resupplyVehicle:
    "K10/K11 et solutions associées à prendre en compte dans les packages.",
  maintenanceNotes:
    "Soutien lié à la production locale, aux pièces Hanwha et aux flottes export.",
  productionNotes:
    "Production et licences en Corée, Europe et autres clients selon contrats publics.",
  industrialNotes:
    "Hanwha Aerospace, partenaires locaux, porteurs, tubes, munitions et véhicules ravitailleurs.",
  costNotes:
    "Contrats souvent en packages comprenant production locale, véhicules associés, munitions et soutien.",
  exportNotes:
    "Atout export fort : disponibilité industrielle, licences et adaptation client.",
  cost:
    "Le K9 se compare par package : obusiers, véhicules ravitailleurs, munitions, licence, transfert industriel et soutien.",
  finance:
    "Les contrats export coréens s'appuient sur financement client, production locale et promesse de cadence.",
  supplyChain:
    "La force du K9 réside dans Hanwha et un modèle de partenariat industriel, mais chaque licence ajoute des dépendances locales.",
  geopolitics:
    "K9 matérialise l'émergence sud-coréenne sur le marché européen et mondial de la défense terrestre.",
  export:
    "L'export est un pilier du programme ; Panoplie décrit les dépendances et contraintes publiques sans conseil de transfert.",
  costFrame: "Obusiers + ravitailleurs + licence + munitions + soutien + production locale",
  financeFrame: "Contrats export multi-lots et partenariats industriels",
  industrialFrame: "Hanwha Aerospace + production locale + chaîne 155 mm",
  exportFrame: "Contrats export sud-coréens, licences et autorisations nationales",
  operators: ["Corée du Sud", "Pologne", "Finlande", "Norvège", "Estonie", "Australie", "Égypte"],
  theatres: ["Europe", "Asie-Pacifique", "Moyen-Orient"],
  timeline: [
    { date: "1999", label: "Mise en service initiale de la famille K9 en Corée du Sud.", kind: "jalon" },
    { date: "2020s", label: "Accélération des grands contrats export, notamment en Europe.", kind: "export" },
  ],
  sources: [
    {
      id: "hanwha-k9",
      title: "K9 Self-Propelled Howitzer",
      publisher: "Hanwha Aerospace",
      type: "constructeur",
      reliability: "B",
      url: "https://m.hanwhaaerospace.com/eng/showroom.do",
    },
    {
      id: "reuters-k9-romania",
      title: "Hanwha Aerospace wins Romania K9 howitzers order",
      publisher: "Reuters",
      type: "presse",
      reliability: "B",
      date: "2024",
      url: "https://www.reuters.com/business/aerospace-defense/south-koreas-hanwha-aerospace-wins-1-bln-order-romania-k9-howitzers-2024-07-09/",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : K9 serait seulement une fiche technique compétitive. La réalité : son avantage est surtout industriel, export et contractuel.",
    bestUseCase:
      "Étudier le rôle des licences et de la cadence dans l'achat d'artillerie lourde.",
    weakPoint:
      "Les variantes A1/A2, productions locales et packages rendent les comparaisons publiques complexes.",
    analystNote:
      "K9 est un cas de supply chain plus qu'un simple système : la capacité de livrer devient un argument stratégique.",
  },
  scores: scoreSet("B", "A", "A", "A"),
});

export const m109a7Paladin = makeArtillerySystem({
  slug: "m109a7-paladin",
  name: "M109A7 Paladin",
  designation: "Paladin Integrated Management · US Army",
  reference: "PNP-ART-008",
  classLabel: "Obusier automoteur chenillé 155 mm modernisé",
  country: "États-Unis",
  flag: "🇺🇸",
  manufacturer: "BAE Systems",
  introduced: "2010s",
  status:
    "Modernisation américaine de la famille M109, avec chaîne ABCT et soutien industriel BAE.",
  acquisitionModes: ["production-nationale", "FMS"],
  tagline:
    "La modernisation d'un standard historique : châssis, électronique, soutien et base installée dominent la lecture.",
  summary:
    "M109A7 n'est pas une nouvelle famille ex nihilo, mais la modernisation d'une base installée massive. Panoplie suit le coût de prolongation, la chaîne BAE, les pièces, l'intégration US Army et les enjeux FMS.",
  carrier: "tracked-heavy",
  architecture: "protected-turret",
  caliber: "155mm",
  barrelLength: "L39",
  loading: "assisted",
  interopStatus: "nato-155",
  crewProtection:
    "Plateforme chenillée blindée modernisée, avec protection héritée de la famille Paladin.",
  fcs: "Modernisation électronique et systèmes de bord selon programme US Army.",
  c2: "Intégration aux brigades blindées américaines et réseaux US Army.",
  ammunitionFamilies: ["155 mm OTAN/US", "familles conventionnelles", "munitions US selon stock"],
  guidedFamilies: ["Excalibur et autres munitions US selon autorisation"],
  ammunitionPerimeter:
    "Familles US 155 mm publiques ; pas de paramètres de tir ni procédures.",
  tubeWearNotes:
    "Tube et modernisation à lire dans le soutien longue durée de la flotte.",
  resupplyVehicle: "Véhicules ravitailleurs associés à la famille M109/FAASV selon armée.",
  maintenanceNotes:
    "MCO facilité par base installée, mais dépendant des pièces et modernisations.",
  productionNotes:
    "BAE Systems, programmes US Army, modernisation progressive des parcs.",
  industrialNotes:
    "BAE Systems, US Army, chaîne blindés, électronique, pièces et munitions 155 mm.",
  costNotes:
    "Coût à lire comme modernisation de parc, pas comme acquisition plateforme vierge.",
  exportNotes:
    "FMS et modernisations de familles M109 existantes, selon autorisations américaines.",
  cost:
    "M109A7 illustre le coût de moderniser une flotte existante : moins spectaculaire qu'un nouveau système, mais central pour disponibilité et homogénéité.",
  finance:
    "Le financement est porté par l'US Army, avec effets de base installée et opportunités FMS.",
  supplyChain:
    "BAE et l'écosystème US Army structurent le soutien ; la flotte historique facilite certaines pièces mais entretient des contraintes d'obsolescence.",
  geopolitics:
    "La famille M109 reste un standard allié, ce qui facilite soutien, formation et échanges de pièces, sous forte dépendance américaine.",
  export:
    "La voie FMS domine ; Panoplie décrit seulement le cadre public, sans conseil juridique ou opérationnel.",
  costFrame: "Modernisation parc + pièces + soutien + munitions + formation",
  financeFrame: "Programme US Army et ventes FMS",
  industrialFrame: "BAE Systems, US Army, chaîne M109 et munitions 155 mm",
  exportFrame: "FMS et transferts sous autorisation américaine",
  operators: ["États-Unis", "Utilisateurs internationaux de la famille M109"],
  theatres: ["Amérique du Nord", "Europe", "Moyen-Orient"],
  timeline: [
    { date: "2010s", label: "Lancement de la modernisation M109A7/PIM.", kind: "jalon" },
    { date: "2020s", label: "Poursuite des lots de production et modernisation US Army.", kind: "jalon" },
  ],
  sources: [
    {
      id: "bae-m109a7",
      title: "M109A7 self-propelled howitzer",
      publisher: "BAE Systems",
      type: "constructeur",
      reliability: "B",
      url: "https://www.baesystems.com/en/product/m109a7",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : ancien veut dire obsolète. La réalité : une base installée modernisée peut être financièrement et logistiquement très rationnelle.",
    bestUseCase:
      "Comparer modernisation de parc et acquisition neuve.",
    weakPoint:
      "Le standard reste dépendant de la chaîne américaine et des limites de la cellule historique.",
    analystNote:
      "M109A7 montre que le coût complet n'est pas seulement innovation, mais continuité industrielle.",
  },
  scores: scoreSet("B", "B", "B", "B"),
});

export const zuzana2 = makeArtillerySystem({
  slug: "zuzana-2",
  name: "Zuzana 2",
  designation: "155 mm ShKH Zuzana 2",
  reference: "PNP-ART-009",
  classLabel: "Obusier 155 mm en tourelle sur camion 8x8",
  country: "Slovaquie",
  flag: "🇸🇰",
  manufacturer: "Konštrukta Defence",
  introduced: "2020s",
  status:
    "Système slovaque en service et export/transfert, avec tourelle protégée 155/52 sur Tatra 8x8.",
  acquisitionModes: ["production-nationale", "DCS"],
  tagline:
    "Une offre européenne intermédiaire : tourelle protégée, porteur 8x8 et base industrielle slovaque.",
  summary:
    "Zuzana 2 se situe entre camion ouvert et chenillé lourd : tourelle protégée, tube 155/52, châssis 8x8 et production slovaque. Panoplie suit sa valeur industrielle, ses packages export et ses limites de comparaison.",
  carrier: "truck-8x8",
  architecture: "protected-turret",
  caliber: "155mm",
  barrelLength: "L52",
  loading: "automatic",
  interopStatus: "jbmou-claimed",
  crewProtection:
    "Tourelle et cabine protégées selon fiche constructeur, avec châssis Tatra 8x8.",
  fcs: "Conduite de tir et navigation intégrées selon fiche Konštrukta.",
  c2: "Intégration nationale/export selon client, à recouper par contrat.",
  ammunitionFamilies: ["155 mm OTAN", "familles longue portée publiques"],
  guidedFamilies: ["Munitions guidées selon intégration client"],
  ammunitionPerimeter:
    "Compatibilité et performances revendiquées au niveau constructeur ; pas de table.",
  tubeWearNotes:
    "Tube 155/52 et chargeur sont à intégrer au coût de possession.",
  resupplyVehicle: "Véhicules munitions selon package client.",
  maintenanceNotes:
    "MCO dépendant de Konštrukta, du porteur Tatra, du chargeur et de la disponibilité pièces.",
  productionNotes:
    "Production slovaque à cadence plus limitée que les grands industriels mondiaux.",
  industrialNotes:
    "Konštrukta Defence, DMD Group, porteur Tatra et écosystème slovaque.",
  costNotes:
    "Coût à lire comme solution européenne de niche, souvent en lots modestes.",
  exportNotes:
    "Export/transfert européen, avec capacité industrielle et soutien à vérifier.",
  cost:
    "Zuzana 2 doit être lue par lot : tourelle, châssis Tatra, munitions, soutien et capacité industrielle slovaque.",
  finance:
    "Le financement dépend de commandes nationales, transferts et contrats export plus modestes que les grands programmes.",
  supplyChain:
    "La chaîne slovaque apporte souveraineté régionale mais peut être contrainte par cadence et sous-traitants.",
  geopolitics:
    "Zuzana 2 donne à la Slovaquie une place visible dans l'artillerie européenne et les soutiens post-2022.",
  export:
    "L'export repose sur une offre 155 mm européenne, mais la soutenabilité et la capacité de production restent à recouper.",
  costFrame: "Tourelle 155 + Tatra 8x8 + munitions + soutien + production slovaque",
  financeFrame: "Commandes nationales, transferts européens et contrats export",
  industrialFrame: "Konštrukta Defence, DMD Group, Tatra et fournisseurs 155 mm",
  exportFrame: "Contrats/transferts sous autorisations slovaques et européennes",
  operators: ["Slovaquie", "Ukraine"],
  theatres: ["Europe", "Ukraine (transferts publics)"],
  timeline: [
    { date: "2020s", label: "Entrée en service et visibilité export/transfert européenne.", kind: "jalon" },
    { date: "2022", label: "Transferts et commandes liées au soutien à l'Ukraine.", kind: "export" },
  ],
  sources: [
    {
      id: "konstrukta-zuzana-2",
      title: "155 mm ShKH Zuzana 2",
      publisher: "Konštrukta Defence",
      type: "constructeur",
      reliability: "B",
      url: "https://kotadef.sk/projekty/zuzana/?lang=en",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : seuls les grands pays comptent dans le 155 mm. La réalité : des industriels de niche peuvent devenir stratégiques quand les stocks manquent.",
    bestUseCase:
      "Lire la valeur d'une base industrielle européenne régionale.",
    weakPoint:
      "Cadence, soutien et coûts consolidés restent moins documentés que pour KNDS, BAE ou Hanwha.",
    analystNote:
      "Zuzana 2 enrichit Panoplie parce qu'elle montre la diversité industrielle européenne, pas seulement les leaders.",
  },
  scores: scoreSet("B", "B", "C", "C"),
});

export const noraB52 = makeArtillerySystem({
  slug: "nora-b52",
  name: "NORA B-52 M21 / NG",
  designation: "155 mm self-propelled gun-howitzer",
  reference: "PNP-ART-010",
  classLabel: "Obusier 155 mm sur camion 8x8",
  country: "Serbie",
  flag: "🇷🇸",
  manufacturer: "Yugoimport SDPR",
  introduced: "2000s-2020s",
  status:
    "Famille serbe export, avec variantes M21/NG et configurations contractuelles variables.",
  acquisitionModes: ["DCS", "production-nationale"],
  tagline:
    "Une famille export moins standardisée : intéressante pour lire configuration, preuve et risque de comparabilité.",
  summary:
    "NORA B-52 est traitée comme famille de systèmes et non comme configuration unique. Le dossier insiste sur la variabilité contractuelle, les versions M21/NG, le porteur, la tourelle, les munitions et la nécessité de recouper les claims.",
  carrier: "truck-8x8",
  architecture: "protected-turret",
  caliber: "155mm",
  barrelLength: "L52",
  loading: "semi-automatic",
  interopStatus: "jbmou-claimed",
  crewProtection:
    "Protection et architecture dépendantes de la variante et du porteur retenu.",
  fcs: "Conduite de tir numérique revendiquée selon configuration Yugoimport.",
  c2: "Intégration client variable ; sources à lire par contrat.",
  ammunitionFamilies: ["155 mm", "familles ERFB/base bleed selon fiche publique"],
  guidedFamilies: ["Munitions guidées si intégrées par client, à recouper"],
  ammunitionPerimeter:
    "Données constructeur variables selon version ; aucune solution de tir exposée.",
  ammunitionCaution:
    "Yugoimport précise que les spécifications finales peuvent varier par contrat.",
  tubeWearNotes:
    "Tube et soutien à documenter contractuellement ; consolidation publique limitée.",
  resupplyVehicle: "Ravitaillement et soutien dépendants du package client.",
  maintenanceNotes:
    "MCO à recouper avec porteur, tourelle, pièces et support Yugoimport.",
  productionNotes:
    "Production serbe orientée export, avec configurations évolutives.",
  industrialNotes:
    "Yugoimport SDPR, porteurs MAN/8x8 selon version, sous-traitants serbes et munitions.",
  costNotes:
    "Coûts publics fragmentaires ; prudence forte sur comparaisons.",
  exportNotes:
    "Export vers clients variés, sous régime serbe et dépendances contractuelles.",
  cost:
    "NORA B-52 illustre le risque d'un prix ou d'une fiche unique : les versions, porteurs et lots export changent beaucoup.",
  finance:
    "Les financements sont majoritairement export et client-spécifiques, avec moins de transparence que les programmes OTAN majeurs.",
  supplyChain:
    "La chaîne serbe est intégrée mais moins documentée publiquement ; les porteurs et variantes doivent être séparés.",
  geopolitics:
    "NORA B-52 montre l'existence d'une offre 155 mm non occidentale européenne, utile sur certains marchés.",
  export:
    "Panoplie décrit le caractère export et les incertitudes ; aucune recommandation de transfert ou contournement.",
  costFrame: "Configuration client + porteur + tourelle + munitions + soutien",
  financeFrame: "Contrats export serbes et packages client",
  industrialFrame: "Yugoimport SDPR, porteurs 8x8, fournisseurs serbes",
  exportFrame: "Export sous régime serbe, configurations variables",
  operators: ["Serbie", "Clients export selon sources publiques"],
  theatres: ["Europe", "Marchés export"],
  timeline: [
    { date: "2000s", label: "Diffusion progressive de la famille NORA B-52.", kind: "export" },
    { date: "2020s", label: "Variantes M21/NG et offres export mises en avant publiquement.", kind: "jalon" },
  ],
  sources: [
    {
      id: "yugoimport-nora-b52",
      title: "NORA B52 M21",
      publisher: "Yugoimport SDPR",
      type: "constructeur",
      reliability: "C",
      url: "https://www.yugoimport.com/en/products/land-forces/fire-support-systems-and-upgrade-programs/self-propelled-and-towed-artillery/155-mm/nora-b52-m21",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : une famille export serait facilement comparable. La réalité : la configuration contractuelle change la substance du système.",
    bestUseCase:
      "Tester le moteur de confiance des sources et la prudence sur les claims constructeur.",
    weakPoint:
      "Sources moins nombreuses, configurations variables et coûts peu consolidés.",
    analystNote:
      "NORA B-52 est volontairement un dossier à recouper : il oblige Panoplie à montrer l'incertitude.",
  },
  scores: scoreSet("C", "B", "C", "C"),
});

export const bohdana = makeArtillerySystem({
  slug: "bohdana",
  name: "2S22 Bohdana",
  designation: "Ukrainian 155 mm self-propelled howitzer",
  reference: "PNP-ART-011",
  classLabel: "Obusier 155 mm ukrainien sur camion",
  country: "Ukraine",
  flag: "🇺🇦",
  manufacturer: "Industrie ukrainienne de défense",
  introduced: "2020s",
  status:
    "Système ukrainien produit et adapté en temps de guerre ; données publiques à traiter avec prudence.",
  acquisitionModes: ["production-nationale"],
  tagline:
    "Le cas industriel de guerre : standard 155 mm, production nationale et évolution rapide des configurations.",
  summary:
    "Bohdana est moins une fiche figée qu'un dossier de résilience industrielle. Panoplie suit l'adoption du 155 mm, l'évolution des porteurs, la production locale, les sources fragmentaires et les limites de preuve, sans décrire d'emploi tactique.",
  carrier: "truck-6x6",
  architecture: "open-mount",
  caliber: "155mm",
  barrelLength: "L52",
  loading: "assisted",
  interopStatus: "nato-155",
  crewProtection:
    "Protection dépendante des versions et porteurs ; données publiques très évolutives.",
  fcs: "Conduite de tir et intégration ukrainiennes, détails à recouper par sources publiques.",
  c2: "Intégration nationale ukrainienne, sans détail exploitable publié par Panoplie.",
  ammunitionFamilies: ["155 mm OTAN", "familles fournies par partenaires selon sources publiques"],
  guidedFamilies: ["Munitions guidées selon stocks alliés, non détaillées"],
  ammunitionPerimeter:
    "Standard 155 mm public ; aucune information de tir, réglage ou coordonnées.",
  ammunitionCaution:
    "Configuration, porteur et production évoluent rapidement ; prudence de source forte.",
  tubeWearNotes:
    "Tubes et pièces sont des enjeux industriels majeurs, mais les données consolidées sont limitées.",
  resupplyVehicle: "Ravitaillement et soutien non standardisés publiquement.",
  maintenanceNotes:
    "MCO dépendant de l'industrie ukrainienne, des stocks alliés et des réparations en temps de guerre.",
  productionNotes:
    "Production nationale accélérée et adaptations successives selon sources publiques.",
  industrialNotes:
    "Industrie ukrainienne, porteurs disponibles, tubes 155 mm, fournisseurs et soutien allié.",
  costNotes:
    "Coûts publics très fragmentaires ; le dossier privilégie production et résilience.",
  exportNotes:
    "Pas une fiche export prioritaire ; lecture centrée sur souveraineté et production nationale.",
  cost:
    "Le coût de Bohdana doit être lu comme capacité industrielle nationale sous contrainte, pas comme prix catalogue.",
  finance:
    "Le financement est lié à l'effort de guerre ukrainien et au soutien allié ; les coûts consolidés sont peu publics.",
  supplyChain:
    "Le dossier suit les dépendances de tubes, porteurs, munitions 155 mm et pièces, avec forte incertitude.",
  geopolitics:
    "Bohdana symbolise la transition ukrainienne vers le standard 155 mm et la souveraineté industrielle en situation de guerre.",
  export:
    "La dimension export est secondaire ; Panoplie bloque toute lecture d'emploi et reste sur production, soutien et sources.",
  costFrame: "Production nationale + porteurs + tubes + munitions + réparations + soutien allié",
  financeFrame: "Effort national ukrainien et soutien international",
  industrialFrame: "Industrie ukrainienne, porteurs, tubes 155 mm, munitions alliées",
  exportFrame: "Non prioritaire ; souveraineté nationale et soutien allié",
  operators: ["Ukraine"],
  theatres: ["Ukraine"],
  timeline: [
    { date: "2020s", label: "Montée en visibilité du système Bohdana et adaptations de production.", kind: "jalon" },
    { date: "2022", label: "Accélération du besoin 155 mm et documentation publique fragmentaire.", kind: "emploi" },
  ],
  sources: [
    {
      id: "milin-bohdana",
      title: "Ukrainian Bohdana self-propelled howitzer updates",
      publisher: "Militarnyi",
      type: "presse",
      reliability: "C",
      url: "https://mil.in.ua/en/news/ukrainian-bohdana-self-propelled-howitzer-is-being-modernized/",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : Bohdana aurait une configuration stable. La réalité : c'est un programme vivant, adapté sous contrainte.",
    bestUseCase:
      "Analyser résilience industrielle, standardisation 155 mm et limites de preuve.",
    weakPoint:
      "Sources fragmentaires, données dynamiques et forte sensibilité du contexte.",
    analystNote:
      "Bohdana doit rester un dossier méthodologique : il montre quand Panoplie doit dire 'à recouper'.",
  },
  scores: scoreSet("C", "C", "D", "C"),
});

export const hawkeye105Mhs = makeArtillerySystem({
  slug: "hawkeye-105-mhs",
  name: "Hawkeye 105 MHS",
  designation: "Humvee 2-CT Hawkeye Mobile Howitzer System",
  reference: "PNP-ART-012",
  classLabel: "Système mobile 105 mm léger",
  country: "États-Unis",
  flag: "🇺🇸",
  manufacturer: "AM General · Mandus Group",
  introduced: "2020s",
  status:
    "Système léger proposé par AM General, combinant Humvee 2-CT, soft recoil et conduite de tir numérique.",
  acquisitionModes: ["DCS", "production-nationale"],
  tagline:
    "Le contrepoint léger du 155 mm : coût, mobilité, logistique et empreinte industrielle plutôt que comparaison de puissance.",
  summary:
    "Hawkeye 105 MHS est inclus pour ne pas réduire le domaine artillerie au 155 mm lourd. Le dossier suit le format léger, le porteur Humvee, le système de recul, la conduite de tir et les usages publics, sans comparer l'effet militaire au 155 mm.",
  carrier: "light-vehicle",
  architecture: "light-system",
  caliber: "105mm",
  barrelLength: "unknown",
  loading: "manual",
  interopStatus: "national-munitions",
  crewProtection:
    "Protection limitée par le format véhicule léger ; avantage surtout logistique et empreinte.",
  fcs: "Conduite de tir numérique selon fiche AM General.",
  c2: "Intégration légère selon client ; pas de détail réseau exploitable.",
  ammunitionFamilies: ["105 mm", "munitions conventionnelles 105 mm selon stock client"],
  guidedFamilies: ["Non central dans les sources publiques Panoplie"],
  ammunitionPerimeter:
    "Calibre 105 mm documenté au niveau système ; aucune table ni correction de tir.",
  ammunitionCaution:
    "Ne pas comparer directement le 105 mm et le 155 mm comme efficacité militaire ; comparer coût, logistique et soutien.",
  tubeWearNotes:
    "Tube 105 mm et système de recul à suivre dans les coûts de maintenance.",
  resupplyVehicle: "Ravitaillement plus léger, à documenter par package client.",
  maintenanceNotes:
    "MCO influencé par porteur Humvee, soft recoil, FCS et disponibilité munitions 105 mm.",
  productionNotes:
    "AM General et Mandus Group, avec porteur Humvee 2-CT.",
  industrialNotes:
    "AM General, Mandus Group, chaîne Humvee, sous-systèmes FCS et munitions 105 mm.",
  costNotes:
    "Coût à lire comme système léger : porteur, kit, soutien, formation et munitions.",
  exportNotes:
    "Potentiel export pour clients recherchant mobilité légère et logistique plus simple.",
  cost:
    "Hawkeye se lit par empreinte logistique et coût complet léger, pas comme substitut direct à un 155 mm.",
  finance:
    "La valeur financière vient du porteur existant, d'une logistique plus légère et de la possibilité d'équiper des unités avec un coût moindre.",
  supplyChain:
    "Le système dépend de la chaîne Humvee, du kit de recul, du FCS et de la disponibilité des munitions 105 mm.",
  geopolitics:
    "Hawkeye répond à un segment où mobilité, coût et rusticité peuvent compter davantage que le format lourd.",
  export:
    "La fiche décrit le potentiel export et les contraintes publiques, sans recommandation d'emploi ou de transfert.",
  costFrame: "Humvee 2-CT + kit 105 mm + FCS + munitions + soutien",
  financeFrame: "Programme industriel AM General/Mandus et ventes potentielles",
  industrialFrame: "AM General, Mandus Group, chaîne Humvee, munitions 105 mm",
  exportFrame: "Ventes sous autorisation américaine et configuration client",
  operators: ["États-Unis (évaluations/démonstrations publiques)", "Clients potentiels"],
  theatres: ["Amérique du Nord", "Marchés export"],
  timeline: [
    { date: "2020s", label: "Mise en avant publique du Humvee 2-CT Hawkeye MHS.", kind: "jalon" },
  ],
  sources: [
    {
      id: "amgeneral-hawkeye",
      title: "Humvee 2-CT Hawkeye MHS",
      publisher: "AM General",
      type: "constructeur",
      reliability: "B",
      url: "https://www.amgeneral.com/what-we-do/vehicles-chassis/humvee-2ct-hawkeye-mhs/",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : plus léger veut dire moins intéressant. La réalité : coût, logistique et empreinte peuvent justifier un segment séparé.",
    bestUseCase:
      "Comparer le 105 mm mobile comme décision de portefeuille non opérationnelle.",
    weakPoint:
      "Adoption et retours publics restent limités par rapport aux grands systèmes 155 mm.",
    analystNote:
      "Hawkeye rappelle que Panoplie compare des modèles d'acquisition, pas une puissance de feu.",
  },
  scores: scoreSet("B", "C", "C", "B"),
});
