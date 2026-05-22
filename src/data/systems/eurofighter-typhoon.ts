import type { DefenseSystem } from "../types";

export const eurofighterTyphoon: DefenseSystem = {
  slug: "eurofighter-typhoon",
  name: "Eurofighter Typhoon",
  designation: "Typhoon — Tranches 1 à 5",
  reference: "PNP-AC-009",
  category: "combat-aircraft",
  combatAircraftClass: "gen-4-5",
  classLabel: "Chasseur de consortium européen",
  country: "Europe — Allemagne, Royaume-Uni, Italie, Espagne",
  flag: "🇪🇺",
  manufacturer: "Airbus · BAE Systems · Leonardo",
  introduced: "2003",
  status: "En service — Tranche 5 commandée, radar AESA ECRS en intégration",
  naval: "Non — aucune version embarquée.",
  acquisitionModes: ["cooperatif"],
  tagline:
    "Le chasseur du consortium européen — très capacitaire, et l'illustration vivante de la complexité industrielle partagée.",
  summary:
    "L'Eurofighter Typhoon est le chasseur né de la coopération de quatre nations — Allemagne, Royaume-Uni, Italie, Espagne. Excellent intercepteur devenu multirôle, c'est un appareil de génération 4.5 : cellule delta-canard non furtive, mais radar, guerre électronique et armement de tout premier rang.\n\nSa fiche est l'une des plus « Panoplie » du domaine, car le Typhoon vaut autant comme objet politique que comme avion. Sa gouvernance industrielle à quatre — répartition du travail, décisions partagées, vetos d'export — illustre à la fois la force et la lourdeur de la coopération européenne. C'est ce modèle, et ses frictions, que le programme SCAF cherche aujourd'hui à dépasser.",
  keySpecs: [
    {
      label: "Équipage",
      value: "1 ou 2 selon la version",
      confidence: "haute",
      sources: ["eurofighter"],
    },
    {
      label: "Motorisation",
      value: "2 × Eurojet EJ200 — consortium européen",
      confidence: "haute",
      sources: ["eurofighter"],
    },
    {
      label: "Capteur principal",
      value: "Radar AESA ECRS en intégration (Tranches 4 et 5)",
      confidence: "haute",
      sources: ["aviationist"],
    },
    {
      label: "Guerre électronique",
      value: "Système d'autoprotection DASS",
      confidence: "haute",
      sources: ["eurofighter"],
    },
    {
      label: "Tranche la plus récente",
      value: "Tranche 5 — Allemagne, 20 appareils commandés en 2025",
      confidence: "haute",
      sources: ["aviationist"],
    },
    {
      label: "Industriels",
      value: "Airbus, BAE Systems, Leonardo — répartition par nation",
      confidence: "haute",
      sources: ["bae"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le coût de l'Eurofighter porte la marque du consortium. Le développement à quatre a permis de partager la facture initiale, mais la gouvernance partagée et les répartitions de travail nationales ajoutent un coût de coordination que n'a pas un programme souverain.\n\nL'appareil est cher à l'acquisition et exigeant en maintien en condition. Les tranches successives — jusqu'à la Tranche 5 — étalent l'investissement, mais chaque modernisation doit être négociée entre nations.",
      indicators: [
        {
          label: "Modèle de coût",
          value: "Développement partagé à quatre nations",
          confidence: "haute",
          sources: ["eurofighter"],
        },
        {
          label: "Coût de coordination",
          value: "Surcoût propre à la gouvernance industrielle partagée",
          confidence: "moyenne",
          sources: ["bae"],
        },
        {
          label: "Modernisation",
          value: "Étalée par tranches — chacune négociée entre partenaires",
          confidence: "moyenne",
          sources: ["aviationist"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le programme est financé par les quatre nations partenaires, au prorata de leurs commandes, et par les ventes à l'export. Le financement suit la logique du consortium : aucune nation ne décide seule.\n\nL'Allemagne a signé fin 2025 une Tranche 5 de vingt appareils, livraisons prévues au début des années 2030 — portant l'engagement de production neuve à plus d'une centaine d'avions et confirmant la prolongation du programme.",
      indicators: [
        {
          label: "Modèle de financement",
          value: "Quatre nations partenaires + export",
          confidence: "haute",
          sources: ["eurofighter"],
        },
        {
          label: "Commande récente",
          value: "Tranche 5 allemande — 20 appareils signés en 2025",
          confidence: "haute",
          sources: ["aviationist"],
        },
        {
          label: "Engagement de production",
          value: "Plus d'une centaine d'appareils neufs engagés",
          confidence: "moyenne",
          sources: ["aviationist"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne du Typhoon est répartie par nation : BAE Systems, Airbus Defence and Space et Leonardo se partagent cellule, intégration et sous-systèmes ; le moteur EJ200 vient du consortium Eurojet ; le radar AESA ECRS est développé côté européen.\n\nCette répartition est un choix politique autant qu'industriel : elle garantit à chaque nation une part de charge de travail — mais complique les décisions et ralentit les modernisations communes.",
      indicators: [
        {
          label: "Maîtres d'œuvre",
          value: "Airbus · BAE Systems · Leonardo",
          confidence: "haute",
          sources: ["bae"],
        },
        {
          label: "Moteur et radar",
          value: "EJ200 (Eurojet) · radar AESA ECRS européen",
          confidence: "haute",
          sources: ["eurofighter", "aviationist"],
        },
        {
          label: "Effet de la répartition",
          value: "Charge de travail garantie, mais décisions ralenties",
          confidence: "moyenne",
          sources: ["bae"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "L'Eurofighter est un instrument de la coopération européenne de défense — et l'un de ses cas d'école. Il assure l'interception et la police du ciel dans plusieurs armées de l'air de l'OTAN, et reste un rival comme un complément du Rafale sur le marché.\n\nSa gouvernance à quatre est aussi sa limite stratégique : les exportations dépendent de l'accord de chaque partenaire, et un veto national — sur les ventes à certains pays — peut bloquer un contrat. C'est cette friction que le SCAF est censé corriger.",
      indicators: [
        {
          label: "Fonction stratégique",
          value: "Pilier de la coopération aérienne européenne",
          confidence: "haute",
          sources: ["eurofighter"],
        },
        {
          label: "Positionnement",
          value: "Rival et complément du Rafale à l'export",
          confidence: "moyenne",
          sources: ["sipri"],
        },
        {
          label: "Friction structurelle",
          value: "Exportations soumises à l'accord de chaque nation partenaire",
          confidence: "haute",
          sources: ["bae"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "Le Typhoon est exporté — Arabie saoudite, Oman, Koweït, Qatar, Autriche — mais son régime d'export est singulier : chaque vente engage les quatre nations, et l'opposition d'un seul partenaire peut suspendre une livraison.\n\nL'exportabilité est donc réelle, mais politiquement plus contrainte que celle d'un appareil souverain : l'acheteur dépend de la cohésion d'un consortium autant que d'un État.",
      indicators: [
        {
          label: "Clients export",
          value: "Arabie saoudite, Oman, Koweït, Qatar, Autriche",
          confidence: "haute",
          sources: ["sipri"],
        },
        {
          label: "Régime applicable",
          value: "Accord requis des quatre nations partenaires",
          confidence: "haute",
          sources: ["bae"],
        },
        {
          label: "Limite",
          value: "Un veto national peut suspendre une exportation",
          confidence: "moyenne",
          sources: ["bae"],
        },
      ],
    },
  ],
  variants: [
    {
      label: "Tranches 1 à 3",
      value:
        "Standards successifs — montée progressive en capacités air-air puis multirôles.",
      confidence: "haute",
      sources: ["eurofighter"],
    },
    {
      label: "Tranche 4",
      value:
        "Standard récent — intégration du radar AESA ECRS Mk1 et capteurs modernisés.",
      confidence: "haute",
      sources: ["aviationist"],
    },
    {
      label: "Tranche 5",
      value:
        "Commande allemande de 2025 — 20 appareils, livraisons au standard ECRS, début des années 2030.",
      confidence: "haute",
      sources: ["aviationist"],
    },
    {
      label: "Radars ECRS",
      value:
        "ECRS Mk1 — standard germano-espagnol ; variantes nationales du radar AESA selon les pays.",
      confidence: "moyenne",
      sources: ["aviationist"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Chasseur très capacitaire, surtout en air-air ; l'acquisition et le maintien restent coûteux, alourdis par la coordination du consortium.",
    },
    {
      key: "survivabilite",
      grade: "B",
      rationale:
        "Performances et autoprotection DASS de bon niveau ; comme tout 4.5, il n'offre pas la furtivité native d'un appareil VLO.",
    },
    {
      key: "exportabilite",
      grade: "B",
      rationale:
        "Exporté vers plusieurs pays, mais chaque vente requiert l'accord des quatre nations — un régime plus contraint qu'un appareil souverain.",
    },
    {
      key: "risque-industriel",
      grade: "C",
      rationale:
        "Industriels solides, mais la gouvernance partagée à quatre ralentit les décisions et les modernisations — un risque structurel.",
    },
    {
      key: "maturite",
      grade: "A",
      rationale:
        "Plus de vingt ans de service, emploi opérationnel large, montée en tranches éprouvée.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "Programme bien documenté par les industriels et les nations ; les calendriers de modernisation restent mouvants.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un chasseur européen unifié. La réalité : un excellent appareil porté par quatre nations dont la gouvernance partagée — répartition du travail, vetos d'export — pèse sur chaque décision.",
    bestUseCase:
      "Assurer interception et supériorité aérienne au sein d'une armée de l'air de l'OTAN, dans une logique de coopération européenne et d'interopérabilité.",
    weakPoint:
      "La gouvernance du consortium : à quatre nations, les modernisations se négocient lentement et les exportations restent exposées au veto d'un partenaire.",
    analystNote:
      "L'Eurofighter est le cas d'école de la coopération européenne : la capacité est au rendez-vous, mais la friction de gouvernance est structurelle. C'est précisément cette leçon que le SCAF tente d'intégrer — sans garantie d'y parvenir.",
  },
  operators: [
    "Allemagne",
    "Royaume-Uni",
    "Italie",
    "Espagne",
    "Autriche",
    "Arabie saoudite",
    "Oman",
    "Koweït",
    "Qatar",
  ],
  theatres: ["Libye", "Levant — Irak et Syrie", "Police du ciel OTAN"],
  timeline: [
    {
      date: "2003",
      label: "Entrée en service de l'Eurofighter Typhoon.",
      kind: "jalon",
    },
    {
      date: "2007",
      label: "Premières exportations — Autriche, puis Arabie saoudite.",
      kind: "export",
    },
    {
      date: "2011",
      label: "Emploi au combat au-dessus de la Libye.",
      kind: "emploi",
    },
    {
      date: "2025",
      label:
        "L'Allemagne commande une Tranche 5 de 20 appareils au standard ECRS.",
      kind: "jalon",
    },
  ],
  sources: [
    {
      id: "eurofighter",
      title: "Eurofighter Typhoon — programme et capacités",
      publisher: "Eurofighter GmbH",
      type: "constructeur",
      reliability: "B",
      url: "https://www.eurofighter.com/",
    },
    {
      id: "bae",
      title: "Eurofighter Typhoon — partenariat industriel",
      publisher: "BAE Systems",
      type: "constructeur",
      reliability: "B",
      url: "https://www.baesystems.com/en/product/eurofighter-typhoon",
    },
    {
      id: "aviationist",
      title: "Germany Signs Eurofighter Tranche 5 Deal",
      publisher: "The Aviationist",
      type: "presse",
      reliability: "C",
      url: "https://theaviationist.com/2025/10/15/germany-eurofighter-tranche-5-deal/",
    },
    {
      id: "sipri",
      title: "Arms Transfers Database",
      publisher: "SIPRI",
      type: "institution",
      reliability: "A",
      url: "https://www.sipri.org/databases/armstransfers",
    },
  ],
  updated: "2026-05-22",
};
