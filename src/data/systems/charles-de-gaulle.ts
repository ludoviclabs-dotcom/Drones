import type { DefenseSystem } from "../types";

export const charlesDeGaulle: DefenseSystem = {
  slug: "charles-de-gaulle",
  name: "Charles de Gaulle",
  designation: "R91 — porte-avions nucléaire français",
  reference: "PNP-NS-001",
  category: "naval-vessel",
  navalVesselClass: "porte-avions",
  classLabel: "Porte-avions CATOBAR",
  country: "France",
  flag: "🇫🇷",
  manufacturer: "Naval Group · Chantiers de l'Atlantique · filière nucléaire",
  introduced: "2001",
  status:
    "En service ; arrêt technique majeur et modernisations périodiques en attendant le PA-NG",
  acquisitionModes: ["production-nationale"],
  tagline:
    "La pièce maîtresse aéronavale française : projection, C2, dissuasion politique et MCO nucléaire lourd.",
  summary:
    "Le Charles de Gaulle est le seul porte-avions nucléaire non américain en service. Sa valeur Panoplie ne tient pas seulement à sa coque : elle vient du couple aviation embarquée, catapultes, C2, escorte, soutien nucléaire et capacité à fédérer un groupe aéronaval.\n\nLa fiche le traite donc comme une architecture de puissance, pas comme un simple bâtiment. Le coût et la disponibilité se lisent à l'échelle de tout l'écosystème : Rafale Marine, E-2C Hawkeye, frégates d'escorte, ravitailleurs, SNLE/SSN en environnement et cycles d'arrêt technique.",
  navalProfile: {
    platform: {
      missions: ["projection", "strike", "presence"],
      displacement: "≈ 42 000 t pleine charge",
      crew: "≈ 1 200 marins + groupe aérien selon déploiement",
      aviation: ["Rafale Marine", "E-2C Hawkeye", "hélicoptères"],
      notes:
        "Porte-avions CATOBAR nucléaire ; la valeur se lit au niveau du groupe aéronaval.",
    },
    combatSystem: {
      family: "autre",
      cms: "Système de combat et C2 du groupe aéronaval",
      tacticalLinks: ["Link 16", "liaisons interalliées", "C2 groupe aéronaval"],
      ballisticMissileDefense: false,
      interoperabilityNotes:
        "Interopérabilité de coalition centrée sur l'aviation embarquée et l'escorte.",
    },
    sensors: {
      radarPrimary: "Radars de veille et de conduite selon modernisations",
      esm: ["Suite guerre électronique et C2 embarqué"],
      optronics: ["Capteurs de veille et navigation"],
    },
    effectors: {
      aviationWeapons: ["Rafale Marine", "E-2C Hawkeye"],
      sam: ["Aster / Sadral selon modernisations et escorte"],
      ciws: ["Autodéfense rapprochée"],
      navalGuns: ["Artillerie légère"],
    },
    propulsion: {
      architecture: "nucleaire",
      primeMovers: ["Deux chaufferies K15"],
      maxSpeed: "≈ 27 kt selon sources ouvertes",
      notes:
        "Propulsion nucléaire souveraine, déterminante pour endurance et MCO spécialisé.",
    },
    industrial: {
      primeContractor: "Naval Group / filière nucléaire navale française",
      shipyards: ["Brest", "Saint-Nazaire selon cycles industriels"],
      suppliers: [
        { subsystem: "Propulsion", supplier: "filière nucléaire navale", country: "France" },
        { subsystem: "Maintenance", supplier: "Naval Group", country: "France" },
        { subsystem: "Aviation", supplier: "Dassault / Northrop Grumman", country: "France / États-Unis" },
      ],
      localContentNotes:
        "Compétence rare : porte-avions CATOBAR nucléaire hors États-Unis.",
    },
    export: {
      regimeSummary:
        "Non exportable en pratique ; capacité souveraine française.",
      itarExposure: "elevee",
      politicalConstraints:
        "Nucléaire naval, catapultes, aviation embarquée et C2 restent hautement sensibles.",
    },
    sustainment: {
      sustainmentNotes:
        "Coût complet porté par arrêts techniques majeurs, propulsion nucléaire, groupe aérien, escorte et ravitaillement.",
      refitPrograms: ["ATM / IPER", "modernisations à mi-vie"],
      industrialRiskNotes:
        "Continuité PA-NG et compétences nucléaires navales à préserver.",
    },
  },
  keySpecs: [
    {
      label: "Déplacement",
      value: "≈ 42 000 t pleine charge",
      confidence: "haute",
      sources: ["marine-pa"],
    },
    {
      label: "Longueur",
      value: "≈ 261 m",
      confidence: "haute",
      sources: ["marine-pa"],
    },
    {
      label: "Propulsion",
      value: "Nucléaire — deux chaufferies K15",
      confidence: "haute",
      sources: ["naval-boilers"],
    },
    {
      label: "Groupe aérien",
      value: "Rafale Marine, E-2C Hawkeye, hélicoptères — format variable",
      confidence: "moyenne",
      status: "variable",
      sources: ["marine-pa"],
    },
    {
      label: "Architecture d'emploi",
      value: "CATOBAR — catapultage et appontage par brins",
      confidence: "haute",
      sources: ["marine-pa"],
    },
    {
      label: "Succession",
      value: "PA-NG en développement pour la relève à l'horizon fin des années 2030",
      confidence: "moyenne",
      sources: ["pang-production"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le coût pertinent d'un porte-avions nucléaire n'est pas son prix initial isolé : c'est le coût complet du groupe aéronaval, des arrêts techniques, de la propulsion nucléaire, de l'aviation embarquée et des infrastructures.\n\nPanoplie le note comme un effet stratégique élevé, mais à soutenabilité lourde. Les arrêts techniques majeurs sont des événements industriels autant que militaires.",
      indicators: [
        {
          label: "MCO",
          value: "Arrêts techniques majeurs périodiques et soutien nucléaire spécialisé",
          confidence: "haute",
          sources: ["naval-boilers"],
        },
        {
          label: "Coût complet",
          value: "À lire au niveau groupe aéronaval, non au niveau coque seule",
          confidence: "moyenne",
          sources: ["marine-pa"],
        },
        {
          label: "Effet par coût",
          value: "Très élevé stratégiquement, mais mobilise une base industrielle lourde",
          confidence: "moyenne",
          sources: ["pang-production"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le Charles de Gaulle relève d'une logique pleinement souveraine : financement national, maintenance nationale et relève nationale avec le PA-NG.\n\nLa trajectoire budgétaire se comprend par cycles longs. Les décisions prises aujourd'hui sur le PA-NG conditionnent la continuité de compétence nucléaire, pont d'envol, catapultes et intégration aéronavale.",
      indicators: [
        {
          label: "Canal d'acquisition",
          value: "Programme national",
          confidence: "haute",
          sources: ["marine-pa"],
        },
        {
          label: "Relève",
          value: "PA-NG — production lancée sur premières pièces longues durées",
          confidence: "moyenne",
          sources: ["pang-production"],
        },
        {
          label: "Temporalité",
          value: "Décisions à horizon décennal, dépendantes de la continuité industrielle",
          confidence: "moyenne",
          sources: ["pang-production"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La dépendance centrale est souveraine mais complexe : propulsion nucléaire, maintenance de coque, catapultes, aviation embarquée, systèmes C2 et escorte. Le navire concentre des compétences rares que peu de marines peuvent maintenir.\n\nLe risque n'est donc pas une dépendance étrangère classique ; il tient à la profondeur de la base industrielle nationale et à la rareté des cycles de grands arrêts.",
      indicators: [
        {
          label: "Propulsion",
          value: "Filière nucléaire navale française",
          confidence: "haute",
          sources: ["naval-boilers"],
        },
        {
          label: "Aviation embarquée",
          value: "Dépendance à l'écosystème Rafale Marine / Hawkeye / soutien pont",
          confidence: "moyenne",
          sources: ["marine-pa"],
        },
        {
          label: "Compétence rare",
          value: "CATOBAR nucléaire — savoir-faire concentré et peu exportable",
          confidence: "haute",
          sources: ["pang-production"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Le Charles de Gaulle est un outil de présence et de signalement politique. Il permet à la France de projeter une aviation de combat depuis la mer, d'opérer avec des alliés et de maintenir une autonomie de décision dans les crises.\n\nSa limite stratégique est symétrique : il concentre une valeur élevée et exige escorte, ravitaillement, renseignement, défense aérienne et disponibilité du groupe.",
      indicators: [
        {
          label: "Rôle",
          value: "Projection aéronavale et commandement de groupe",
          confidence: "haute",
          sources: ["marine-pa"],
        },
        {
          label: "Signal politique",
          value: "Outil de présence, coalition et autonomie stratégique",
          confidence: "moyenne",
          sources: ["marine-pa"],
        },
        {
          label: "Vulnérabilité systémique",
          value: "Dépend de l'escorte et de la disponibilité du groupe aéronaval",
          confidence: "moyenne",
          sources: ["marine-pa"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "Le Charles de Gaulle n'est pas un produit export. Il incarne une capacité souveraine, juridiquement, politiquement et industriellement liée à la France.\n\nLa vraie question export se situe indirectement : la crédibilité de la filière française nourrit des coopérations, de l'influence et des briques exportables autour du naval et de l'aviation, mais pas le porte-avions lui-même.",
      indicators: [
        {
          label: "Exportabilité",
          value: "Nulle en pratique — capacité souveraine non exportée",
          confidence: "haute",
          sources: ["marine-pa"],
        },
        {
          label: "Effet indirect",
          value: "Crédibilité industrielle et aéronavale française",
          confidence: "moyenne",
          sources: ["pang-production"],
        },
        {
          label: "Contrôle",
          value: "Technologies nucléaires et C2 sensibles",
          confidence: "haute",
          sources: ["naval-boilers"],
        },
      ],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Effet stratégique unique pour la France, mais coût complet très élevé quand on inclut aviation, escorte et MCO.",
    },
    {
      key: "survivabilite",
      grade: "C",
      rationale:
        "Survivabilité liée au groupe aéronaval et aux couches d'escorte ; la coque seule ne se lit pas isolément.",
    },
    {
      key: "exportabilite",
      grade: "E",
      rationale:
        "Capacité souveraine nucléaire et CATOBAR, non exportable en pratique.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Base industrielle souveraine mais profonde, rare et dépendante de cycles longs.",
    },
    {
      key: "maturite",
      grade: "A",
      rationale:
        "Plateforme éprouvée depuis 2001, modernisée par cycles, avec doctrine d'emploi installée.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "Caractéristiques publiques solides ; disponibilité réelle et coûts détaillés restent plus sensibles.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un porte-avions se compare par tonnage. La réalité : le Charles de Gaulle se compare par son groupe aérien, ses catapultes, son escorte, son MCO nucléaire et sa capacité C2.",
    bestUseCase:
      "Projection aéronavale souveraine, signalement stratégique et commandement d'un groupe naval dans une crise de haute intensité.",
    weakPoint:
      "La concentration de valeur : un outil puissant, rare, coûteux, et dont l'effet dépend d'un groupe complet disponible.",
    analystNote:
      "Le Charles de Gaulle est moins une fiche navire qu'une fiche système. Il faut le lire comme un noeud de puissance nationale : aviation, nucléaire, escorte, logistique et décision politique.",
  },
  operators: ["France — Marine nationale"],
  theatres: [
    "Méditerranée",
    "Océan Indien",
    "Atlantique",
    "Indo-Pacifique — déploiements ponctuels",
  ],
  timeline: [
    {
      date: "2001",
      label: "Admission au service actif du porte-avions Charles de Gaulle.",
      kind: "jalon",
    },
    {
      date: "2017",
      label: "Début d'un arrêt technique majeur de rénovation à mi-vie.",
      kind: "jalon",
    },
    {
      date: "2026",
      label: "La filière PA-NG entre dans une phase industrielle de long terme.",
      kind: "jalon",
    },
  ],
  sources: [
    {
      id: "marine-pa",
      title: "Le porte-avions Charles de Gaulle",
      publisher: "Marine nationale",
      type: "institution",
      reliability: "A",
      url: "https://www.defense.gouv.fr/marine/forces-surface/porte-avions",
    },
    {
      id: "naval-boilers",
      title: "Charles de Gaulle: a closer look at the replacement of the boilers",
      publisher: "Naval Group",
      type: "constructeur",
      reliability: "B",
      url: "https://www.naval-group.com/en/charles-de-gaulle-closer-look-replacement-boilers",
    },
    {
      id: "pang-production",
      title: "Production launch of the new-generation aircraft carrier PA-NG",
      publisher: "Naval Group",
      type: "constructeur",
      reliability: "B",
      date: "2026",
      url: "https://www.naval-group.com/en/production-launch-new-generation-aircraft-carrier-pa-ng",
    },
  ],
  updated: "2026-05-31",
};
