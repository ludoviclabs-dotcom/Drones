import type { DefenseSystem } from "../types";

export const gcapTempest: DefenseSystem = {
  slug: "gcap-tempest",
  name: "GCAP / Tempest",
  designation: "Global Combat Air Programme",
  reference: "PNP-AC-015",
  category: "combat-aircraft",
  combatAircraftClass: "gen-6",
  classLabel: "Programme de combat aérien — 6e génération",
  country: "Royaume-Uni · Italie · Japon",
  flag: "🇬🇧",
  manufacturer: "BAE Systems · Leonardo · JAIEC",
  status: "Programme futur — développement structuré, démonstrateur visé en 2027",
  naval: "Non — programme principalement terrestre.",
  acquisitionModes: ["cooperatif"],
  tagline:
    "L'autre 6e génération européenne — Royaume-Uni, Italie, Japon : une coopération qui, elle, avance.",
  summary:
    "Le GCAP — Global Combat Air Programme — est le programme de chasseur de 6e génération qui réunit le Royaume-Uni, l'Italie et le Japon. Il fusionne le projet britannique Tempest et l'effort japonais en un programme commun, formalisé par un traité signé fin 2023.\n\nSa fiche se lit en miroir de celle du SCAF. Mêmes ambitions — un chasseur de 6e génération, une famille de systèmes —, mais une trajectoire différente : la coentreprise industrielle Edgewing a été constituée, un démonstrateur supersonique est en construction, et le programme est passé de la phase de concept au développement structuré. Le GCAP est le cas d'une coopération de 6e génération qui, pour l'instant, tient son calendrier.",
  keySpecs: [
    {
      label: "Génération",
      value: "6e génération — programme futur",
      confidence: "haute",
      sources: ["commons"],
    },
    {
      label: "Nations partenaires",
      value: "Royaume-Uni, Italie, Japon",
      confidence: "haute",
      sources: ["commons"],
    },
    {
      label: "Autorité de conception",
      value: "Edgewing — coentreprise BAE Systems, Leonardo, JAIEC",
      confidence: "haute",
      sources: ["bae"],
    },
    {
      label: "Démonstrateur",
      value: "Démonstrateur supersonique en construction — vol visé vers 2027",
      confidence: "moyenne",
      sources: ["bae"],
    },
    {
      label: "Entrée en service visée",
      value: "À partir de 2035",
      confidence: "moyenne",
      sources: ["commons"],
    },
    {
      label: "Origine",
      value: "Fusion du Tempest britannique et de l'effort japonais",
      confidence: "haute",
      sources: ["commons"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le coût du GCAP est, comme celui de tout programme futur, un coût d'études et de développement — des centaines de millions de livres déjà engagés côté britannique, et un coût complet qui se chiffrera, à terme, en dizaines de milliards.\n\nLa différence avec un programme bloqué est ici décisive : les crédits financent une progression réelle — un démonstrateur en construction, une coentreprise constituée. Le coût est lourd, mais il achète de l'avancement.",
      indicators: [
        {
          label: "Nature du coût",
          value: "Coût d'études et de développement, partagé à trois nations",
          confidence: "moyenne",
          sources: ["commons"],
        },
        {
          label: "Engagement britannique",
          value: "Plusieurs centaines de millions de livres déjà investies",
          confidence: "moyenne",
          sources: ["commons"],
        },
        {
          label: "Contrepartie",
          value: "Les crédits financent une progression effective du programme",
          confidence: "moyenne",
          sources: ["bae"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le GCAP est financé conjointement par le Royaume-Uni, l'Italie et le Japon. Le programme a franchi une étape clé : le passage du concept au développement structuré, matérialisé par les premiers contrats confiés à la coentreprise.\n\nL'entrée du Japon — qui finance et co-développe à parité — distingue le GCAP des programmes purement européens : c'est une coopération intercontinentale, ce qui élargit l'assise financière autant que les contraintes de coordination.",
      indicators: [
        {
          label: "Modèle de financement",
          value: "Partagé entre Royaume-Uni, Italie et Japon",
          confidence: "haute",
          sources: ["commons"],
        },
        {
          label: "Étape franchie",
          value: "Passage du concept au développement structuré",
          confidence: "moyenne",
          sources: ["bae"],
        },
        {
          label: "Spécificité",
          value: "Coopération intercontinentale — le Japon co-développe à parité",
          confidence: "moyenne",
          sources: ["commons"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne du GCAP s'organise autour d'Edgewing, coentreprise réunissant BAE Systems, Leonardo et l'industriel japonais JAIEC, désignée autorité de conception. Côté britannique, plusieurs milliers d'ingénieurs travaillent déjà sur le programme et le démonstrateur, avec Rolls-Royce sur la motorisation.\n\nLa gouvernance industrielle à trois reste un défi — mais, à la différence du SCAF, elle a jusqu'ici produit une structure de décision opérationnelle plutôt qu'un blocage.",
      indicators: [
        {
          label: "Autorité de conception",
          value: "Edgewing — BAE Systems, Leonardo, JAIEC",
          confidence: "haute",
          sources: ["bae"],
        },
        {
          label: "Mobilisation",
          value: "Plusieurs milliers d'ingénieurs ; Rolls-Royce sur la motorisation",
          confidence: "moyenne",
          sources: ["bae"],
        },
        {
          label: "Gouvernance",
          value: "Coopération à trois ayant produit une structure de décision",
          confidence: "moyenne",
          sources: ["commons"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Le GCAP est un projet stratégique à double portée. Pour le Royaume-Uni et l'Italie, c'est l'assurance d'une capacité de combat aérien de 6e génération hors du programme américain. Pour le Japon, c'est une rupture : son premier grand programme d'armement co-développé avec des partenaires occidentaux non américains.\n\nIl dessine un axe industriel et stratégique reliant l'Europe et l'Indo-Pacifique — une configuration que peu de programmes d'armement avaient jusqu'ici esquissée.",
      indicators: [
        {
          label: "Enjeu européen",
          value: "Capacité de 6e génération hors programme américain",
          confidence: "haute",
          sources: ["commons"],
        },
        {
          label: "Enjeu japonais",
          value: "Premier grand programme co-développé hors des États-Unis",
          confidence: "moyenne",
          sources: ["commons"],
        },
        {
          label: "Portée",
          value: "Un axe industriel reliant Europe et Indo-Pacifique",
          confidence: "moyenne",
          sources: ["bae"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "L'export du GCAP est une perspective de long terme, mais le programme l'a, dès l'origine, intégré à sa réflexion : les trois partenaires conçoivent un appareil pensé pour pouvoir être proposé à des clients tiers.\n\nLe régime d'export d'un programme à trois nations — dont le Japon, à la doctrine d'exportation historiquement restrictive — reste toutefois à clarifier. C'est une question ouverte, qui ne se tranchera qu'avec la maturité du programme.",
      indicators: [
        {
          label: "Intention",
          value: "Appareil pensé dès l'origine pour pouvoir s'exporter",
          confidence: "moyenne",
          sources: ["bae"],
        },
        {
          label: "Point à clarifier",
          value: "Régime d'export à trois nations, dont le Japon",
          confidence: "moyenne",
          sources: ["commons"],
        },
        {
          label: "Échéance",
          value: "Question ouverte — tranchée avec la maturité du programme",
          confidence: "faible",
          status: "a-recouper",
          sources: ["commons"],
        },
      ],
    },
  ],
  variants: [
    {
      label: "Chasseur GCAP",
      value: "Le chasseur habité de 6e génération — plateforme commune aux trois nations.",
      confidence: "moyenne",
      sources: ["commons"],
    },
    {
      label: "Démonstrateur supersonique",
      value:
        "Appareil d'essai en construction au Royaume-Uni — vol visé vers 2027.",
      confidence: "moyenne",
      sources: ["bae"],
    },
    {
      label: "Edgewing",
      value:
        "Coentreprise BAE Systems / Leonardo / JAIEC — autorité de conception du programme.",
      confidence: "haute",
      sources: ["bae"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "D",
      rationale:
        "Évaluation indicative — programme futur : ni le coût complet, ni l'efficacité d'un appareil non volé ne sont mesurables.",
    },
    {
      key: "survivabilite",
      grade: "D",
      rationale:
        "Ambition de 6e génération, mais aucun matériel opérationnel — note indicative, non démontrée.",
    },
    {
      key: "exportabilite",
      grade: "C",
      rationale:
        "Conçu dès l'origine avec l'export en vue, mais le régime de cession à trois nations — dont le Japon — reste à définir.",
    },
    {
      key: "risque-industriel",
      grade: "C",
      rationale:
        "Coopération à trois exigeante, mais qui a produit une autorité de conception et un démonstrateur en construction — un risque maîtrisé à ce stade.",
    },
    {
      key: "maturite",
      grade: "D",
      rationale:
        "Programme futur — démonstrateur visé vers 2027, entrée en service à partir de 2035.",
    },
    {
      key: "confiance-donnees",
      grade: "C",
      rationale:
        "Programme officiellement documenté, y compris par le Parlement britannique ; l'essentiel des caractéristiques reste non figé.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un avion européen prêt à voler. La réalité : un programme de 6e génération au stade du développement — mais qui, à la différence du SCAF, a constitué sa structure industrielle et tient son calendrier.",
    bestUseCase:
      "À terme, doter le Royaume-Uni, l'Italie et le Japon d'une capacité de combat aérien de 6e génération co-développée, hors du programme américain.",
    weakPoint:
      "Le statut : tout reste à démontrer. La coordination à trois nations sur deux continents est exigeante, et la maturité réelle ne se jugera qu'au vol du démonstrateur.",
    analystNote:
      "Le GCAP est le miroir inversé du SCAF : même ambition de 6e génération, mais une coopération qui, jusqu'ici, avance. Panoplie le classe en programme futur — paliers prudents, maturité basse — mais note ce qui le distingue : une autorité de conception constituée et un démonstrateur en construction. La comparaison des deux programmes est, en soi, l'un des apports du domaine.",
  },
  operators: ["Royaume-Uni · Italie · Japon — programme futur"],
  theatres: ["Royaume-Uni — développement et essais"],
  timeline: [
    {
      date: "2022",
      label:
        "Le Royaume-Uni, l'Italie et le Japon annoncent un programme commun de chasseur.",
      kind: "jalon",
    },
    {
      date: "2023",
      label: "Signature du traité fondateur du GCAP au Japon.",
      kind: "jalon",
    },
    {
      date: "2025",
      label:
        "Constitution de la coentreprise Edgewing ; passage au développement structuré.",
      kind: "jalon",
    },
    {
      date: "2027",
      label: "Vol du démonstrateur supersonique visé.",
      kind: "jalon",
    },
  ],
  sources: [
    {
      id: "commons",
      title: "What is the Global Combat Air Programme (GCAP)?",
      publisher: "House of Commons Library",
      type: "institution",
      reliability: "A",
      url: "https://commonslibrary.parliament.uk/research-briefings/cbp-10143/",
    },
    {
      id: "bae",
      title: "Global Combat Air Programme — Tempest",
      publisher: "BAE Systems",
      type: "constructeur",
      reliability: "B",
      url: "https://www.baesystems.com/en/what-we-do/air/fcas",
    },
    {
      id: "army-recognition",
      title:
        "Japan, UK and Italy propel collaborative development of sixth-generation fighter",
      publisher: "Army Recognition",
      type: "presse",
      reliability: "C",
      url: "https://www.armyrecognition.com/news/aerospace-news/2025/japan-uk-and-italy-propel-collaborative-development-of-sixth-generation-stealth-fighter-jet",
    },
  ],
  updated: "2026-05-22",
};
