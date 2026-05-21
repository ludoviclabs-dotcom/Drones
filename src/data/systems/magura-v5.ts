import type { DefenseSystem } from "../types";

export const maguraV5: DefenseSystem = {
  slug: "magura-v5",
  name: "Magura V5 / V7",
  designation: "MAGURA V5",
  reference: "PNP-DR-008",
  category: "drone",
  droneClass: "USV",
  classLabel: "Drone naval de surface",
  country: "Ukraine",
  flag: "🇺🇦",
  manufacturer: "SpetsTechnoExport / HUR",
  introduced: "2023",
  status: "En service — production active",
  acquisitionModes: ["production-nationale"],
  tagline:
    "Le drone-suicide de surface qui a chassé une flotte de haute mer avec des pièces du commerce.",
  summary:
    "Le Magura est un drone naval de surface (USV) ukrainien conçu pour une seule logique : approcher une cible à grande vitesse et la détruire à coût dérisoire. Développé par SpetsTechnoExport avec le renseignement militaire (HUR), il a fait basculer la guerre navale en mer Noire en démontrant qu'une coque de carbone de cinq mètres, bourrée d'explosifs et pilotée par liaison satellite, pouvait neutraliser des bâtiments de plusieurs milliers de tonnes.\n\nLe comprendre, c'est saisir une bascule doctrinale plus large : la viabilité du déni maritime asymétrique, où une flotte mineure tient une mer à distance sans navires de combat. Mais la fiche se lit aussi à travers le filtre du belligérant — l'essentiel des résultats revendiqués provient de communiqués ukrainiens, dans un théâtre saturé de propagande des deux camps.",
  keySpecs: [
    {
      label: "Longueur",
      value: "5,5 m (V5) à 7,5 m (V7)",
      confidence: "moyenne",
      note: "Le V7 est une plateforme distincte, plus longue et armée de missiles air-air.",
      sources: ["usni-proc"],
    },
    {
      label: "Déplacement en charge",
      value: "≈ 1,1 t",
      confidence: "moyenne",
      sources: ["usni-proc"],
    },
    {
      label: "Vitesse",
      value: "22 nœuds en croisière — 42 à 54 nœuds en pointe",
      confidence: "moyenne",
      note: "Fourchette de pointe variable selon l'état de mer et la source.",
      sources: ["usni-proc"],
    },
    {
      label: "Portée",
      value: "> 400 milles nautiques (≈ 800 km)",
      confidence: "moyenne",
      sources: ["usni-proc"],
    },
    {
      label: "Charge militaire",
      value: "≈ 320 kg d'explosifs",
      confidence: "moyenne",
      note: "Valeur maximale annoncée ; configuration variable selon la mission.",
      sources: ["usni-proc"],
    },
    {
      label: "Liaisons",
      value: "Radio maillée + Starlink + antennes Kymeta",
      confidence: "moyenne",
      note: "Architecture reposant sur des composants commerciaux occidentaux.",
      sources: ["usni-proc", "naval-news-uk"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le Magura est l'incarnation du pari « masse plus bas coût ». Une unité est estimée entre 250 000 et 300 000 dollars — deux à trois ordres de grandeur en dessous des bâtiments qu'elle vise. C'est l'asymétrie financière qui fait l'arme : perdre dix drones pour couler une corvette reste un échange favorable.\n\nLe chiffre doit pourtant se lire avec prudence. Il s'agit d'un coût de plateforme cité par la presse spécialisée, hors munitions reconverties (le missile Sidewinder du V7 provient de stocks américains) et hors segment de mise en œuvre — opérateurs, liaisons satellite, soutien. Le coût « complet » d'une campagne n'est pas public.",
      indicators: [
        {
          label: "Coût unitaire",
          value: "≈ 250 000–300 000 $",
          confidence: "moyenne",
          status: "variable",
          note: "Coût de plateforme cité par la presse ; hors munitions et segment de mise en œuvre.",
          sources: ["usni-proc"],
        },
        {
          label: "Logique de coût",
          value: "Asymétrie : drone vs bâtiment de plusieurs milliers de tonnes",
          confidence: "haute",
          sources: ["usni-proc"],
        },
        {
          label: "Coût complet de campagne",
          value: "Non public",
          confidence: "faible",
          status: "a-recouper",
          note: "Soutien, liaisons et personnel non documentés.",
          sources: ["usni-proc"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le Magura est né d'un montage de financement hétérodoxe. Les premières unités ont été payées par souscription publique via la plateforme United24, plus de trente drones ayant été financés par dons dès la fin 2022. L'État ukrainien et l'aide internationale ont ensuite pris le relais.\n\nCe modèle de crowdfunding militaire est une réponse de circonstance autant qu'un choix : il accélère la mise en service mais ne garantit pas la régularité d'un budget pérenne. La capacité de production avancée par les autorités — jusqu'à cinquante unités par mois — relève de la déclaration d'intention, non d'une cadence constatée.",
      indicators: [
        {
          label: "Amorçage",
          value: "Souscription publique United24 (> 30 unités fin 2022)",
          confidence: "moyenne",
          sources: ["united24"],
        },
        {
          label: "Financement courant",
          value: "Budget ukrainien et dons internationaux",
          confidence: "moyenne",
          sources: ["usni-proc"],
        },
        {
          label: "Capacité de production annoncée",
          value: "Jusqu'à 50 unités/mois",
          confidence: "faible",
          status: "variable",
          note: "Déclaration des autorités ukrainiennes — capacité théorique, non une production réelle confirmée.",
          sources: ["usni-proc"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne du Magura est son originalité et sa fragilité. SpetsTechnoExport assure l'intégration, mais le drone est largement assemblé à partir de composants civils du commerce : terminaux Starlink de SpaceX, antennes Kymeta américaines, caméras de vision. Cette approche « COTS » comprime les délais et les coûts.\n\nElle crée aussi des dépendances hors du contrôle de Kiev. La disponibilité de Starlink dépend d'un opérateur privé étranger ; le V7 emploie des Sidewinder issus de stocks américains anciens, reconvertis selon la logique « FrankenSAM ». L'arme est nationale par l'assemblage, mais tributaire de l'extérieur pour ses nœuds critiques.",
      indicators: [
        {
          label: "Intégrateur",
          value: "SpetsTechnoExport (STE)",
          confidence: "moyenne",
          sources: ["usni-proc"],
        },
        {
          label: "Composants critiques",
          value: "Starlink (SpaceX) · antennes Kymeta (USA)",
          confidence: "moyenne",
          note: "Disponibilité dépendante d'opérateurs privés étrangers.",
          sources: ["usni-proc", "naval-news-uk"],
        },
        {
          label: "Armement du V7",
          value: "Missiles air-air reconvertis (R-73, puis AIM-9 Sidewinder)",
          confidence: "faible",
          status: "a-recouper",
          note: "Sidewinder issus de stocks américains anciens — logique « FrankenSAM ».",
          sources: ["usni-proc"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Le Magura a une portée stratégique qui dépasse la mer Noire. Il a apporté la preuve opérationnelle qu'une stratégie de déni maritime asymétrique fonctionne : sans flotte de combat, l'Ukraine a contraint la marine russe à reculer vers Novorossiisk. Toutes les marines dotées de grands bâtiments de surface en tirent une leçon inconfortable.\n\nL'empreinte géographique de l'arme s'élargit, parfois malgré elle : un Magura V5 a été retrouvé échoué sur la côte turque, près de Trabzon, fin septembre 2025. L'épisode rappelle qu'un USV à longue portée déborde le théâtre où il est employé et soulève des questions de droit maritime et de neutralité.",
      indicators: [
        {
          label: "Effet stratégique",
          value: "Preuve de viabilité du déni maritime asymétrique",
          confidence: "moyenne",
          sources: ["usni-proc"],
        },
        {
          label: "Effet sur la flotte russe",
          value: "Repli partiel vers Novorossiisk",
          confidence: "moyenne",
          status: "variable",
          note: "Effet largement documenté par l'OSINT mais d'ampleur difficile à quantifier.",
          sources: ["usni-proc"],
        },
        {
          label: "Extension géographique",
          value: "Drone échoué sur la côte turque (Trabzon, sept. 2025)",
          confidence: "moyenne",
          sources: ["naval-news-uk"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "Le Magura n'a pas d'historique d'exportation : c'est une arme de guerre conçue pour un besoin national immédiat. Sa diffusion relève du régime de contrôle ukrainien et reste, à ce stade, une perspective plus qu'une réalité.\n\nLe président Zelensky a évoqué, en septembre 2025, l'exportation de surplus militaires ukrainiens, drones navals compris. Une telle ouverture concernerait un système éprouvé au combat, donc commercialement attractif — mais sous contrainte de classification sensible, et sans cadre multilatéral comparable au MTCR pour les drones de surface.",
      indicators: [
        {
          label: "Historique d'exportation",
          value: "Aucun",
          confidence: "moyenne",
          sources: ["usni-proc"],
        },
        {
          label: "Perspective annoncée",
          value: "Export de surplus évoqué (Zelensky, sept. 2025)",
          confidence: "faible",
          status: "a-recouper",
          note: "Déclaration politique d'intention, non un cadre d'exportation établi.",
          sources: ["naval-news-uk"],
        },
        {
          label: "Cadre de contrôle",
          value: "Régime national ukrainien",
          confidence: "moyenne",
          sources: ["usni-proc"],
        },
      ],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "A",
      rationale:
        "Asymétrie financière extrême : un drone à quelques centaines de milliers de dollars contre des bâtiments coûtant des centaines de fois plus. Le rapport coût/effet est l'argument central de l'arme.",
    },
    {
      key: "survivabilite",
      grade: "C",
      rationale:
        "Petite signature et profil rasant rendent l'interception difficile, mais l'USV est consommable par nature et sa liaison reste exposée au brouillage et au tir adverse.",
    },
    {
      key: "exportabilite",
      grade: "D",
      rationale:
        "Aucun historique d'exportation ; arme sensible, diffusion seulement évoquée et soumise au seul régime national ukrainien.",
    },
    {
      key: "risque-industriel",
      grade: "C",
      rationale:
        "Assemblage national rapide, mais dépendance à des composants commerciaux étrangers — Starlink, Kymeta — et à des munitions reconverties pour le V7.",
    },
    {
      key: "maturite",
      grade: "B",
      rationale:
        "Éprouvé au combat depuis 2023 avec des résultats opérationnels tangibles, mais plateforme jeune, en évolution rapide et au retour d'expérience encore court.",
    },
    {
      key: "confiance-donnees",
      grade: "C",
      rationale:
        "Sources mêlant communiqués officiels, OSINT et propagande des deux camps ; chiffres de dégâts et revendications de destruction reposant sur des déclarations ukrainiennes.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un drone miracle qui aurait coulé la flotte russe à lui seul. La réalité : le Magura est un système réel et efficace, mais l'essentiel des résultats — le bilan « > 500 M$ de dommages », les chasseurs abattus — provient de communiqués ukrainiens dans un théâtre saturé de propagande. L'effet est avéré ; son ampleur exacte ne l'est pas.",
    bestUseCase:
      "Le déni maritime asymétrique : interdire une mer fermée à une flotte adverse sans posséder de navires de combat, en frappant les bâtiments au mouillage ou en transit et en saturant les côtes ennemies à coût marginal.",
    weakPoint:
      "La dépendance à la liaison et aux composants étrangers. Le drone tient à une chaîne radio et satellite brouillable, fournie en partie par un opérateur privé hors du contrôle de Kiev ; sans liaison, l'USV perd sa précision.",
    analystNote:
      "Le Magura est l'une des innovations les plus instructives de la guerre d'Ukraine : il valide le déni maritime asymétrique et oblige toutes les marines à repenser la protection de leurs bâtiments de surface. Mais une fiche honnête sépare le fait — l'arme existe, elle frappe — de la revendication : les bilans chiffrés et la destruction de deux Su-30 en mai 2025 sont des déclarations de belligérant, à recouper. La capacité de « 50 par mois » est une intention affichée, non une cadence constatée.",
  },
  operators: [
    "Ukraine — HUR (Group 13)",
    "Ukraine — 385e brigade USV",
  ],
  theatres: ["Mer Noire"],
  timeline: [
    { date: "2022", label: "Premières unités financées par souscription publique United24 — plus de 30 drones fin 2022.", kind: "jalon" },
    { date: "2023", label: "Mise en service du Magura ; éprouvé au combat en mer Noire dès cette date.", kind: "emploi" },
    { date: "2025-05", label: "Destruction revendiquée de deux Su-30 russes — déclaration de belligérant à recouper.", kind: "emploi" },
    { date: "2025-09", label: "Un Magura V5 retrouvé échoué sur la côte turque, près de Trabzon.", kind: "emploi" },
    { date: "2025-09", label: "Le président Zelensky évoque l'exportation de surplus militaires, drones navals compris.", kind: "export" },
  ],
  sources: [
    {
      id: "usni-proc",
      title: "Ukraine's Sea Drone Campaign in the Black Sea",
      publisher: "U.S. Naval Institute — Proceedings",
      type: "institution",
      reliability: "B",
      date: "2025-09",
    },
    {
      id: "naval-news-uk",
      title: "Couverture des drones navals de surface ukrainiens",
      publisher: "Naval News",
      type: "presse",
      reliability: "B",
    },
    {
      id: "united24",
      title: "United24 — plateforme de financement de la défense ukrainienne",
      publisher: "Gouvernement ukrainien",
      type: "officiel",
      reliability: "C",
      url: "https://u24.gov.ua",
    },
    {
      id: "hur-statements",
      title: "Communiqués du renseignement militaire ukrainien (HUR)",
      publisher: "Defence Intelligence of Ukraine (HUR)",
      type: "officiel",
      reliability: "C",
    },
  ],
  updated: "2026-05-21",
};
