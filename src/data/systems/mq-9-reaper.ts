import type { DefenseSystem } from "../types";

export const mq9Reaper: DefenseSystem = {
  slug: "mq-9-reaper",
  name: "MQ-9 Reaper",
  designation: "MQ-9A",
  reference: "PNP-DR-001",
  category: "drone",
  droneClass: "MALE",
  classLabel: "Drone MALE",
  country: "États-Unis",
  flag: "🇺🇸",
  manufacturer: "General Atomics Aeronautical Systems",
  introduced: "2007",
  status: "En service — production active",
  acquisitionModes: ["FMS"],
  tagline:
    "Le drone qui a industrialisé la frappe à distance — et l'étalon, vieillissant, du MALE occidental.",
  summary:
    "Le MQ-9 Reaper de General Atomics est le drone qui a fait entrer la frappe à distance dans l'ère industrielle. Successeur armé du Predator, ce MALE de 20 mètres d'envergure combine endurance, capteurs et armement guidé sous le contrôle d'équipages déportés à des milliers de kilomètres.\n\nPendant deux décennies, il a structuré la doctrine occidentale du drone et les campagnes de contre-terrorisme américaines. Il reste une référence — mais une référence datée : conçu pour des ciels sans menace, il révèle ses limites face aux défenses sol-air modernes. Le comprendre, c'est saisir à la fois la puissance et l'angle mort du modèle de drone occidental haut de gamme.",
  keySpecs: [
    {
      label: "Envergure",
      value: "20,1 m",
      confidence: "haute",
      sources: ["ga-asi"],
    },
    {
      label: "Endurance",
      value: "≈ 27 h",
      confidence: "moyenne",
      note: "En configuration ISR ; sensiblement réduite avec un armement lourd.",
      sources: ["usaf-factsheet"],
    },
    {
      label: "Plafond opérationnel",
      value: "≈ 15 000 m",
      confidence: "haute",
      sources: ["usaf-factsheet"],
    },
    {
      label: "Charge utile",
      value: "≈ 1 700 kg",
      confidence: "moyenne",
      note: "Interne et externe cumulées.",
      sources: ["usaf-factsheet"],
    },
    {
      label: "Liaison",
      value: "SATCOM — au-delà de la vue directe",
      confidence: "haute",
      sources: ["ga-asi"],
    },
    {
      label: "Motorisation",
      value: "Honeywell TPE331-10 (turbopropulseur)",
      confidence: "haute",
      sources: ["ga-asi"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le Reaper illustre le piège du coût « complet ». La cellule seule s'affiche autour de 30 M$, mais un système opérationnel — quatre vecteurs, stations sol, capteurs, liaisons — dépasse largement ce chiffre.\n\nLe coût horaire de vol fait l'objet de débats récurrents : les estimations basses ignorent souvent le personnel, les segments satellite et la maintenance lourde. Un drone MALE n'est pas « bon marché » — il est seulement moins cher qu'un avion piloté, pour une mission différente.",
      indicators: [
        {
          label: "Coût unitaire (cellule)",
          value: "≈ 30 M$",
          confidence: "faible",
          status: "variable",
          note: "Varie fortement selon la source, le lot et la configuration.",
          sources: ["ga-asi", "sipri-at"],
        },
        {
          label: "Coût d'un système",
          value: "≈ 56–121 M$",
          confidence: "faible",
          status: "variable",
          note: "Quatre vecteurs, stations sol, capteurs et liaisons — estimations américaines.",
          sources: ["sipri-at", "usaf-factsheet"],
        },
        {
          label: "Coût horaire de vol",
          value: "≈ 3 500–5 000 $/h (cités)",
          confidence: "faible",
          status: "variable",
          note: "Le coût pleinement chargé est sensiblement supérieur.",
          sources: ["csis-uav"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Côté américain, le Reaper est financé sur le budget fédéral de l'US Air Force — un programme mature aux lignes bien identifiées. À l'export, l'acquisition passe quasi systématiquement par le canal FMS : l'État américain agit comme intermédiaire contractuel.\n\nCe canal sécurise l'acheteur, mais le place sous la dépendance des arbitrages budgétaires et politiques de Washington. Le financement d'un parc inclut un poste régulièrement sous-estimé : le soutien pluriannuel.",
      indicators: [
        {
          label: "Cadre de financement",
          value: "Budget fédéral US ; FMS à l'export",
          confidence: "haute",
          sources: ["usaf-factsheet"],
        },
        {
          label: "Canal d'acquisition",
          value: "Vente d'État à État (FMS)",
          confidence: "haute",
          sources: ["sipri-at"],
        },
        {
          label: "Poste sous-estimé",
          value: "Soutien et maintien en condition pluriannuels",
          confidence: "moyenne",
          sources: ["csis-uav"],
        },
      ],
      organisms: ["dsca"],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne du Reaper est l'une de ses forces : maître d'œuvre unique, base industrielle nationale, fournisseurs américains pour les nœuds critiques — boule optronique MTS-B de Raytheon, turbopropulseur Honeywell. Peu de dépendance étrangère, donc peu de leviers de pression extérieurs.\n\nLa contrepartie : une chaîne entièrement soumise aux priorités et aux contrôles américains, et des composants de pointe — capteurs, liaisons sécurisées — aux délais d'approvisionnement longs.",
      indicators: [
        {
          label: "Maître d'œuvre",
          value: "General Atomics (GA-ASI)",
          confidence: "haute",
          sources: ["ga-asi"],
        },
        {
          label: "Composants critiques",
          value: "Capteur MTS-B (Raytheon) · moteur TPE331 (Honeywell)",
          confidence: "haute",
          sources: ["ga-asi"],
        },
        {
          label: "Dépendance étrangère",
          value: "Faible — base industrielle nationale",
          confidence: "moyenne",
          sources: ["csis-uav"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Vendre un Reaper, c'est vendre une relation. Le système crée de l'interopérabilité avec les forces américaines et un lien de dépendance durable — pièces, mises à jour logicielles, autorisations d'emploi.\n\nWashington a longtemps réservé le Reaper à ses alliés les plus proches, laissant un boulevard commercial à la Turquie et à la Chine. L'assouplissement de la doctrine d'exportation en 2020 visait précisément à enrayer cette perte d'influence.",
      indicators: [
        {
          label: "Fonction stratégique",
          value: "Interopérabilité et influence alliées",
          confidence: "moyenne",
          sources: ["csis-uav"],
        },
        {
          label: "Accès",
          value: "Réservé aux alliés et partenaires proches",
          confidence: "haute",
          sources: ["newamerica-drones"],
        },
        {
          label: "Effet de dépendance",
          value: "Élevé — pièces, mises à jour, autorisations d'emploi",
          confidence: "moyenne",
          sources: ["csis-uav"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "Le Reaper relève du régime ITAR et fut longtemps classé en catégorie I du MTCR — la plus restrictive, valant présomption de refus. En 2020, les États-Unis ont réinterprété unilatéralement cette catégorie pour les drones « lents », facilitant les ventes.\n\nL'acquisition reste conditionnée à une autorisation américaine, à un certificat d'utilisateur final et à des restrictions d'emploi : l'acheteur ne dispose jamais d'une pleine liberté d'usage.",
      indicators: [
        {
          label: "Régime applicable",
          value: "ITAR · MTCR catégorie I (assoupli en 2020)",
          confidence: "haute",
          sources: ["sipri-at"],
        },
        {
          label: "Conditions",
          value: "Autorisation US, certificat d'utilisateur final",
          confidence: "haute",
          sources: ["sipri-at"],
        },
        {
          label: "Marge d'emploi de l'acheteur",
          value: "Restreinte",
          confidence: "moyenne",
          sources: ["csis-uav"],
        },
      ],
      organisms: ["ddtc", "mtcr"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "C",
      rationale:
        "Capacités réelles et éprouvées, mais coût pleinement chargé élevé et mal restitué par les seuls chiffres de cellule.",
    },
    {
      key: "survivabilite",
      grade: "D",
      rationale:
        "Conçu pour des ciels permissifs : lent, peu furtif, tributaire de liaisons brouillables. Plusieurs appareils perdus au combat.",
    },
    {
      key: "exportabilite",
      grade: "C",
      rationale:
        "Exportable, mais sous contrôle ITAR/MTCR et soumis à l'arbitrage politique américain.",
    },
    {
      key: "risque-industriel",
      grade: "A",
      rationale:
        "Chaîne nationale, maître d'œuvre unique, faible exposition aux pressions extérieures.",
    },
    {
      key: "maturite",
      grade: "A",
      rationale:
        "Près de vingt ans de service, des millions d'heures de vol, une doctrine d'emploi éprouvée.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "Système très documenté ; seules les données de coût restent dispersées d'une source à l'autre.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un œil omniscient et invulnérable qui voit et frappe partout. La réalité : le Reaper a été optimisé pour des ciels permissifs. Face à une défense sol-air moderne, il est lent, peu furtif et vulnérable — plusieurs appareils ont été abattus, notamment au Yémen et au-dessus de la mer Noire.",
    bestUseCase:
      "Surveillance persistante et frappe de précision dans un environnement peu ou pas contesté : contre-terrorisme, contrôle de zone, appui ISR de longue durée au profit de forces au sol.",
    weakPoint:
      "La survivabilité. Sans supériorité aérienne, le Reaper devient une cible ; sa dépendance aux liaisons satellite l'expose au brouillage et à l'interception.",
    analystNote:
      "Le Reaper reste l'étalon du drone MALE occidental, mais son modèle — coûteux, exquis, tributaire d'un ciel dégagé — est interrogé par la guerre d'Ukraine. Sa vraie valeur en 2026 tient moins au combat de haute intensité qu'à la permanence ISR et au poids diplomatique du canal FMS.",
  },
  operators: [
    "États-Unis",
    "Royaume-Uni (Protector RG1)",
    "France",
    "Italie",
    "Espagne",
    "Pays-Bas",
    "Inde (MQ-9B)",
  ],
  theatres: ["Afghanistan", "Irak", "Syrie", "Libye", "Sahel", "Yémen"],
  sources: [
    {
      id: "ga-asi",
      title: "MQ-9A — documentation système",
      publisher: "General Atomics Aeronautical Systems",
      type: "constructeur",
      reliability: "B",
      url: "https://www.ga-asi.com",
    },
    {
      id: "usaf-factsheet",
      title: "MQ-9 Reaper — Fact Sheet",
      publisher: "U.S. Air Force",
      type: "officiel",
      reliability: "A",
      url: "https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104470/mq-9-reaper/",
    },
    {
      id: "sipri-at",
      title: "Arms Transfers Database",
      publisher: "SIPRI",
      type: "institution",
      reliability: "A",
      url: "https://www.sipri.org/databases/armstransfers",
    },
    {
      id: "iiss-mb",
      title: "The Military Balance",
      publisher: "IISS",
      type: "institution",
      reliability: "A",
    },
    {
      id: "newamerica-drones",
      title: "World of Drones — Tracking Armed Drone Use",
      publisher: "New America",
      type: "think-tank",
      reliability: "B",
      url: "https://www.newamerica.org/insights/world-drones/",
    },
    {
      id: "csis-uav",
      title: "Analyses sur les drones et la puissance aérienne",
      publisher: "CSIS",
      type: "think-tank",
      reliability: "B",
      url: "https://www.csis.org",
    },
  ],
  updated: "2026-05-20",
};
