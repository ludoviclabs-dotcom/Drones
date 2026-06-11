export type IndustrialNodeKind =
  | "system"
  | "company"
  | "country"
  | "program"
  | "source";

export interface IndustrialNode {
  id: string;
  label: string;
  kind: IndustrialNodeKind;
  detail: string;
}

export interface IndustrialEdge {
  from: string;
  to: string;
  relation: "produces" | "funds" | "exports" | "depends_on" | "documents";
  confidence: "haute" | "moyenne" | "faible";
  sourceIds: string[];
}

export const INDUSTRIAL_GRAPH_PILOT = {
  title: "Drones & munitions rôdeuses",
  blurb:
    "Graphe public pilote : systèmes, industriels, pays, dépendances et sources. Niveau industriel uniquement, sans détail de fabrication.",
  nodes: [
    {
      id: "mq9",
      label: "MQ-9 Reaper",
      kind: "system",
      detail: "MALE ISR/armé, canal FMS et soutien US.",
    },
    {
      id: "tb2",
      label: "Bayraktar TB2",
      kind: "system",
      detail: "MALE tactique turc, export commercial très diffusé.",
    },
    {
      id: "eurodrone",
      label: "Eurodrone",
      kind: "system",
      detail: "Programme MALE coopératif européen.",
    },
    {
      id: "switchblade",
      label: "Switchblade 600",
      kind: "system",
      detail: "Munition rôdeuse américaine, contrats cadres et FMS.",
    },
    {
      id: "magura",
      label: "MAGURA V5",
      kind: "system",
      detail: "USV ukrainien, financement public et dons.",
    },
    {
      id: "gaasi",
      label: "General Atomics ASI",
      kind: "company",
      detail: "Maître d'oeuvre MQ-9.",
    },
    {
      id: "baykar",
      label: "Baykar",
      kind: "company",
      detail: "Maître d'oeuvre TB2.",
    },
    {
      id: "airbus",
      label: "Airbus DS",
      kind: "company",
      detail: "Intégration Eurodrone.",
    },
    {
      id: "av",
      label: "AeroVironment",
      kind: "company",
      detail: "Maître d'oeuvre Switchblade.",
    },
    {
      id: "ste",
      label: "SpetsTechnoExport",
      kind: "company",
      detail: "Entité industrielle ukrainienne citée pour MAGURA.",
    },
    {
      id: "usa",
      label: "États-Unis",
      kind: "country",
      detail: "FMS, ITAR, budget fédéral et base industrielle.",
    },
    {
      id: "turkiye",
      label: "Turquie",
      kind: "country",
      detail: "Export TB2 et diplomatie industrielle.",
    },
    {
      id: "eu",
      label: "Europe",
      kind: "country",
      detail: "Financement coopératif et chaînes multi-pays.",
    },
    {
      id: "ukraine",
      label: "Ukraine",
      kind: "country",
      detail: "Innovation maritime, dons et financement national.",
    },
    {
      id: "ge-catalyst",
      label: "GE Catalyst",
      kind: "company",
      detail: "Dépendance moteur publique du programme Eurodrone.",
    },
    {
      id: "spacex-kymeta",
      label: "SpaceX / Kymeta",
      kind: "company",
      detail: "Dépendances de communication ouvertes sur MAGURA.",
    },
  ] satisfies IndustrialNode[],
  edges: [
    { from: "gaasi", to: "mq9", relation: "produces", confidence: "haute", sourceIds: ["ga-asi"] },
    { from: "usa", to: "mq9", relation: "exports", confidence: "haute", sourceIds: ["sipri-at"] },
    { from: "baykar", to: "tb2", relation: "produces", confidence: "haute", sourceIds: ["baykar"] },
    { from: "turkiye", to: "tb2", relation: "exports", confidence: "moyenne", sourceIds: ["sipri-at", "rusi-tb2"] },
    { from: "airbus", to: "eurodrone", relation: "produces", confidence: "haute", sourceIds: ["airbus-eurodrone"] },
    { from: "eu", to: "eurodrone", relation: "funds", confidence: "haute", sourceIds: ["occar-contrat"] },
    { from: "eurodrone", to: "ge-catalyst", relation: "depends_on", confidence: "moyenne", sourceIds: ["iiss-mb"] },
    { from: "av", to: "switchblade", relation: "produces", confidence: "haute", sourceIds: ["av-switchblade"] },
    { from: "usa", to: "switchblade", relation: "exports", confidence: "moyenne", sourceIds: ["dsca-fms"] },
    { from: "ste", to: "magura", relation: "produces", confidence: "moyenne", sourceIds: ["usni-proc"] },
    { from: "ukraine", to: "magura", relation: "funds", confidence: "moyenne", sourceIds: ["united24"] },
    { from: "magura", to: "spacex-kymeta", relation: "depends_on", confidence: "moyenne", sourceIds: ["usni-proc", "naval-news-uk"] },
  ] satisfies IndustrialEdge[],
};

export type UpdateCandidateKind =
  | "new_claim"
  | "modified_claim"
  | "contradicted_claim"
  | "obsolete_claim";

export interface UpdateCandidate {
  id: string;
  systemName: string;
  kind: UpdateCandidateKind;
  sourceLabel: string;
  confidence: "haute" | "moyenne" | "faible";
  summary: string;
  proposedAction: string;
}

export const UPDATE_REVIEW_QUEUE: UpdateCandidate[] = [
  {
    id: "upd-001",
    systemName: "F-35 Lightning II",
    kind: "modified_claim",
    sourceLabel: "Rapport GAO / modernisation Block 4",
    confidence: "moyenne",
    summary: "Décalage possible du périmètre Block 4 et évolution du coût de soutien.",
    proposedAction: "Relire les claims coût, calendrier et maturité logicielle.",
  },
  {
    id: "upd-002",
    systemName: "Eurodrone",
    kind: "contradicted_claim",
    sourceLabel: "Revue programme / moteur GE Catalyst",
    confidence: "moyenne",
    summary: "La formulation souveraineté doit rester nuancée par la dépendance moteur.",
    proposedAction: "Renforcer la note supply chain et export.",
  },
  {
    id: "upd-003",
    systemName: "Aarok",
    kind: "new_claim",
    sourceLabel: "Presse spécialisée 2025",
    confidence: "faible",
    summary: "Nouvelles mentions d'intérêt étatique avant contrat ferme.",
    proposedAction: "Classer en intérêt public, pas en commande.",
  },
  {
    id: "upd-004",
    systemName: "F110 Bonifaz",
    kind: "modified_claim",
    sourceLabel: "Navantia / SCOMBA / SPY-7",
    confidence: "moyenne",
    summary: "Préciser le découpage coût programme et configuration combat system.",
    proposedAction: "Ajouter une note de périmètre dans le comparateur coûts.",
  },
  {
    id: "upd-005",
    systemName: "Switchblade 600",
    kind: "contradicted_claim",
    sourceLabel: "Contrats US Army vs retours Ukraine",
    confidence: "moyenne",
    summary: "Le programme progresse malgré un débat public sur coût d'attrition.",
    proposedAction: "Séparer financement cadre et analyse de coût par munition.",
  },
  {
    id: "upd-006",
    systemName: "MAGURA V5",
    kind: "new_claim",
    sourceLabel: "Naval News / USNI Proceedings",
    confidence: "moyenne",
    summary: "Nouvelles variantes et dépendances communication à recouper.",
    proposedAction: "Actualiser supply chain publique uniquement.",
  },
  {
    id: "upd-007",
    systemName: "THAAD",
    kind: "modified_claim",
    sourceLabel: "MDA P-5",
    confidence: "haute",
    summary: "Coût gross weapon system à maintenir séparé du flyaway.",
    proposedAction: "Vérifier les libellés du panneau coûts.",
  },
  {
    id: "upd-008",
    systemName: "PAC-3 MSE",
    kind: "modified_claim",
    sourceLabel: "DoD P-1 FY2026",
    confidence: "haute",
    summary: "Net procurement unit cost publié avec canister et ingénierie.",
    proposedAction: "Étiqueter le périmètre dans export CSV/PDF futur.",
  },
  {
    id: "upd-009",
    systemName: "Gerald R. Ford",
    kind: "obsolete_claim",
    sourceLabel: "CRS Navy shipbuilding",
    confidence: "moyenne",
    summary: "Le coût de tête de classe ne doit pas représenter toute la classe.",
    proposedAction: "Ajouter une note 'tête de classe' dans la fiche.",
  },
  {
    id: "upd-010",
    systemName: "Virginia Block V",
    kind: "modified_claim",
    sourceLabel: "CRS submarine industrial base",
    confidence: "moyenne",
    summary: "La fourchette Block V varie selon VPM et cadence industrielle.",
    proposedAction: "Conserver la fourchette, pas un point unique définitif.",
  },
  {
    id: "upd-011",
    systemName: "Meteor",
    kind: "obsolete_claim",
    sourceLabel: "MBDA / intégration F-35",
    confidence: "moyenne",
    summary: "Ne pas dériver de coût unitaire depuis les contrats plateforme.",
    proposedAction: "Marquer les coûts comme non publiés.",
  },
  {
    id: "upd-012",
    systemName: "Rafale",
    kind: "modified_claim",
    sourceLabel: "Export 2025 / cadence",
    confidence: "moyenne",
    summary: "Le carnet export influence le coût industriel, mais pas un prix unique.",
    proposedAction: "Garder une fourchette acquisition et une note export.",
  },
  {
    id: "upd-013",
    systemName: "MQ-9 Reaper",
    kind: "contradicted_claim",
    sourceLabel: "GA-ASI / SIPRI / USAF",
    confidence: "moyenne",
    summary: "Prix cellule et coût système complet coexistent dans les sources.",
    proposedAction: "Afficher les deux périmètres dans la page coûts.",
  },
  {
    id: "upd-014",
    systemName: "Bayraktar TB2",
    kind: "modified_claim",
    sourceLabel: "SIPRI / Baykar",
    confidence: "faible",
    summary: "Les coûts export restent des ordres de grandeur selon package.",
    proposedAction: "Conserver l'incertitude haute.",
  },
  {
    id: "upd-015",
    systemName: "Heron TP",
    kind: "contradicted_claim",
    sourceLabel: "Bundestag / presse défense",
    confidence: "moyenne",
    summary: "Location de capacité et prix cellule ne se comparent pas directement.",
    proposedAction: "Créer des lignes coût distinctes.",
  },
  {
    id: "upd-016",
    systemName: "F-22 Raptor",
    kind: "modified_claim",
    sourceLabel: "Air & Space Forces Magazine / CRS",
    confidence: "moyenne",
    summary: "La flotte close transforme la modernisation en coût de soutenabilité.",
    proposedAction: "Relier coût et risque industriel sans parler d'emploi tactique.",
  },
  {
    id: "upd-017",
    systemName: "Aster 30 B1NT",
    kind: "obsolete_claim",
    sourceLabel: "OCCAR / MBDA",
    confidence: "moyenne",
    summary: "Coût missile non publié : éviter toute estimation par analogie.",
    proposedAction: "Maintenir la mention 'non publié'.",
  },
  {
    id: "upd-018",
    systemName: "SCALP / Storm Shadow",
    kind: "modified_claim",
    sourceLabel: "MBDA MLR",
    confidence: "moyenne",
    summary: "La rénovation mi-vie ne vaut pas prix unitaire neuf.",
    proposedAction: "Créer un claim de modernisation séparé.",
  },
  {
    id: "upd-019",
    systemName: "Queen Elizabeth class",
    kind: "new_claim",
    sourceLabel: "Royal Navy / CSG",
    confidence: "moyenne",
    summary: "Le coût comparable dépend du groupe aérien et de l'escorte.",
    proposedAction: "Préparer une fiche TCO carrier strike group.",
  },
  {
    id: "upd-020",
    systemName: "FREMM Carlo Bergamini",
    kind: "modified_claim",
    sourceLabel: "OCCAR / Fincantieri",
    confidence: "moyenne",
    summary: "Configurations italiennes multiples : ne pas confondre série, version et armement.",
    proposedAction: "Étiqueter les versions dans les coûts futurs.",
  },
];

export interface ExportBrief {
  id: string;
  country: string;
  systems: string[];
  generalFrame: string;
  knownRestrictions: string[];
  dependencies: string[];
  uncertainties: string[];
  legalValidation: string[];
  sourceLabels: string[];
}

export const EXPORT_BRIEFS: ExportBrief[] = [
  {
    id: "france-rafale-mica",
    country: "France",
    systems: ["Rafale", "MICA NG", "SCALP / Storm Shadow"],
    generalFrame:
      "Cadre national français, contrôles européens et arbitrage politique par dossier ; analyse non juridique.",
    knownRestrictions: [
      "Contrôle national des matériels de guerre.",
      "Position commune UE 2008/944/PESC pour la cohérence européenne.",
      "Restrictions propres aux composants et charges utiles selon configuration.",
    ],
    dependencies: [
      "Chaîne Rafale majoritairement française sur les noeuds critiques.",
      "SCALP / Storm Shadow ajoute une lecture franco-britannique selon version.",
    ],
    uncertainties: [
      "Configurations export et lots de soutien rarement ventilés publiquement.",
      "Clauses utilisateur final non publiques.",
    ],
    legalValidation: [
      "Valider toute conclusion auprès d'un juriste export control.",
      "Ne pas utiliser ce brief pour décider ou contourner une exportation.",
    ],
    sourceLabels: ["Dassault", "Ministère des Armées", "MBDA", "Position commune UE"],
  },
  {
    id: "usa-f35-amraam-pac3",
    country: "États-Unis",
    systems: ["F-35", "AMRAAM", "PAC-3 MSE"],
    generalFrame:
      "Cadre ITAR/FMS structurant ; accès dépendant de l'autorisation américaine et du statut allié.",
    knownRestrictions: [
      "ITAR et certificats utilisateur final.",
      "FMS dominant pour les transferts majeurs.",
      "Réexport et mises à jour dépendants de Washington.",
    ],
    dependencies: [
      "Soutien logiciel et modernisation F-35 sous gouvernance américaine.",
      "Base missiles sous tension : propergol solide, électronique RF, canisters.",
    ],
    uncertainties: [
      "Calendriers Block 4, stocks et priorités FMS évolutifs.",
      "Prix export non identiques aux ratios budgétaires DoD.",
    ],
    legalValidation: [
      "Faire valider tout scénario par conseil export control.",
      "Aucune stratégie de contournement n'est fournie par Panoplie.",
    ],
    sourceLabels: ["GAO", "DoD P-1", "Lockheed Martin", "RTX"],
  },
  {
    id: "turkiye-tb2",
    country: "Turquie",
    systems: ["Bayraktar TB2"],
    generalFrame:
      "Cadre national turc, logique commerciale et diplomatie industrielle active ; analyse non juridique.",
    knownRestrictions: [
      "Contrôles nationaux turcs et arbitrages diplomatiques.",
      "Sensibilité aux composants ou sous-systèmes étrangers selon standard.",
    ],
    dependencies: [
      "Nationalisation accélérée de sous-systèmes après restrictions passées.",
      "Production locale ou partenariats possibles selon pays client.",
    ],
    uncertainties: [
      "Prix publics souvent estimatifs.",
      "Clauses de réexport et de transfert de technologie peu détaillées publiquement.",
    ],
    legalValidation: [
      "Vérifier le droit applicable dans le pays acheteur et vendeur.",
      "Ne pas déduire d'autorisation export depuis la présence d'un système dans un autre pays.",
    ],
    sourceLabels: ["Baykar", "SIPRI", "RUSI"],
  },
  {
    id: "spain-f110",
    country: "Espagne",
    systems: ["F110 Bonifaz"],
    generalFrame:
      "Programme naval national avec composants et radars internationaux ; analyse export non juridique.",
    knownRestrictions: [
      "Contrôle espagnol des exportations de défense.",
      "Sous-systèmes américains possibles, notamment SPY-7 / Mk 41 selon configuration.",
    ],
    dependencies: [
      "Navantia et SCOMBA côté espagnol.",
      "Lockheed Martin côté radar SPY-7 public.",
    ],
    uncertainties: [
      "Périmètre exact des lots de soutien et armements.",
      "Clauses de réexport des sous-systèmes non publiques.",
    ],
    legalValidation: [
      "Vérifier les contraintes ITAR éventuelles sur sous-systèmes.",
      "Ne pas extrapoler depuis le programme domestique vers un export.",
    ],
    sourceLabels: ["Navantia", "Lockheed Martin"],
  },
  {
    id: "israel-heron",
    country: "Israël",
    systems: ["Heron TP"],
    generalFrame:
      "Contrôle israélien des technologies avancées, contrats directs ou locations capacitaires.",
    knownRestrictions: [
      "Restrictions nationales israéliennes de transfert de technologies sensibles.",
      "Montages contractuels avec intégrateurs tiers selon client.",
    ],
    dependencies: [
      "IAI Malat pour cellule et intégration.",
      "Moteur Pratt & Whitney Canada cité publiquement.",
    ],
    uncertainties: [
      "Packages location, armement et soutien peu comparables au prix cellule.",
      "Configurations client rarement publiques.",
    ],
    legalValidation: [
      "Valider tout point auprès de juristes export et autorités compétentes.",
      "Ne pas utiliser ce brief comme avis juridique final.",
    ],
    sourceLabels: ["IAI", "Bundestag", "Presse défense"],
  },
];

export interface PortfolioSystem {
  systemId: string;
  name: string;
  classLabel: string;
  country: string;
  criteria: {
    cost: string;
    finance: string;
    supplyChain: string;
    export: string;
    maturity: string;
    sourceConfidence: string;
  };
  notes: string;
}

export const STRATEGIC_PORTFOLIO: PortfolioSystem[] = [
  {
    systemId: "f-35",
    name: "F-35 Lightning II",
    classLabel: "Chasseur 5e génération",
    country: "États-Unis",
    criteria: {
      cost: "Cycle de vie très élevé",
      finance: "Programme multinational + FMS",
      supplyChain: "Chaîne mondiale sous gouvernance US",
      export: "ITAR, accès alliés sélectionnés",
      maturity: "Très diffusé, modernisation Block 4 instable",
      sourceConfidence: "Forte sur volumes et limites GAO",
    },
    notes:
      "Comparer comme dépendance stratégique et coût de possession, pas comme promesse tactique.",
  },
  {
    systemId: "rafale",
    name: "Rafale",
    classLabel: "Chasseur omnirôle",
    country: "France",
    criteria: {
      cost: "Fourchette acquisition élevée mais maîtrisée",
      finance: "Export soutenant la cadence",
      supplyChain: "Noeuds critiques souverains",
      export: "Contrôle français, hors ITAR central",
      maturity: "Mature, standards F4/F5",
      sourceConfidence: "Moyenne à forte",
    },
    notes:
      "Lecture utile pour souveraineté, export et maîtrise industrielle nationale.",
  },
  {
    systemId: "eurodrone",
    name: "Eurodrone",
    classLabel: "MALE européen",
    country: "Europe",
    criteria: {
      cost: "Programme très coûteux",
      finance: "Coopératif quadrinational",
      supplyChain: "Dépendance moteur GE Catalyst",
      export: "MTCR catégorie I, marché restreint",
      maturity: "En développement",
      sourceConfidence: "Moyenne",
    },
    notes:
      "Portefeuille industriel et souveraineté politique avant retour d'expérience opérationnel.",
  },
  {
    systemId: "mq-9-reaper",
    name: "MQ-9 Reaper",
    classLabel: "MALE ISR",
    country: "États-Unis",
    criteria: {
      cost: "Cellule vs système complet à séparer",
      finance: "FMS et soutien pluriannuel",
      supplyChain: "Base industrielle US mature",
      export: "Autorisation US et end-user",
      maturity: "Très mature",
      sourceConfidence: "Forte sur caractéristiques, moyenne sur coût complet",
    },
    notes:
      "Bon cas d'école pour l'écart entre prix visible et coût de capacité.",
  },
  {
    systemId: "f110-bonifaz",
    name: "F110 Bonifaz",
    classLabel: "Frégate ASW / AAW",
    country: "Espagne",
    criteria: {
      cost: "Programme public multi-milliards",
      finance: "Programme naval national",
      supplyChain: "Navantia + sous-systèmes US/UE",
      export: "Contraintes sous-systèmes à vérifier",
      maturity: "En construction",
      sourceConfidence: "Moyenne",
    },
    notes:
      "Cas naval intéressant pour dépendances CMS/radar et lecture coût programme.",
  },
];
