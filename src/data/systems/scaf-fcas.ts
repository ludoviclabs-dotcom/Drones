import type { DefenseSystem } from "../types";

export const scafFcas: DefenseSystem = {
  slug: "scaf-fcas",
  name: "SCAF / FCAS",
  designation: "Système de combat aérien du futur",
  reference: "PNP-AC-014",
  category: "combat-aircraft",
  combatAircraftClass: "gen-6",
  classLabel: "Programme de combat aérien — 6e génération",
  country: "Europe — France, Allemagne, Espagne",
  flag: "🇪🇺",
  manufacturer: "Dassault Aviation · Airbus · Indra",
  status: "Programme futur — crise de gouvernance, avenir incertain",
  naval:
    "À confirmer — la France souhaite une déclinaison navalisable ; non figé.",
  acquisitionModes: ["cooperatif"],
  tagline:
    "L'ambition européenne de 6e génération — un système de systèmes, et une crise de gouvernance qui en menace l'existence.",
  summary:
    "Le SCAF — Système de combat aérien du futur, FCAS en anglais — est le programme par lequel la France, l'Allemagne et l'Espagne entendent doter l'Europe d'une capacité de combat aérien de 6e génération. Ce n'est pas qu'un avion : c'est un système de systèmes — un chasseur habité de nouvelle génération, des drones associés, un cloud de combat —, porté par Dassault Aviation, Airbus et Indra.\n\nMais sa fiche, en 2026, est d'abord celle d'une crise. Le partage du travail et le leadership industriel — en particulier sur le chasseur habité — opposent durement Dassault et Airbus. Les médiations ont échoué, des responsables allemands ont menacé d'y mettre fin, et l'avenir du programme dépend désormais d'arbitrages politiques. Le SCAF est l'illustration, en temps réel, de la difficulté de la coopération européenne.",
  keySpecs: [
    {
      label: "Génération",
      value: "6e génération — programme futur",
      confidence: "haute",
      sources: ["min-armees"],
    },
    {
      label: "Nations partenaires",
      value: "France, Allemagne, Espagne",
      confidence: "haute",
      sources: ["min-armees"],
    },
    {
      label: "Industriels",
      value: "Dassault Aviation · Airbus · Indra",
      confidence: "haute",
      sources: ["euro-sd"],
    },
    {
      label: "Nature",
      value: "Système de systèmes — chasseur habité, drones, cloud de combat",
      confidence: "haute",
      sources: ["min-armees"],
    },
    {
      label: "Calendrier visé",
      value: "Démonstrateur vers 2027, entrée en service vers 2040",
      confidence: "faible",
      status: "a-recouper",
      sources: ["euro-sd"],
    },
    {
      label: "Statut 2026",
      value: "Crise de gouvernance — avenir suspendu à des arbitrages politiques",
      confidence: "haute",
      sources: ["breaking-def"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le coût du SCAF est encore un coût d'études — phases de démonstration, travaux préparatoires. Le développement complet d'un système de systèmes de 6e génération se chiffrerait, à terme, en dizaines de milliards d'euros.\n\nMais la crise de gouvernance ajoute un coût caché : chaque mois de blocage est un mois d'études financées sans avancée décisive. Tant que le partage du travail n'est pas réglé, le coût réel du programme reste indéterminé.",
      indicators: [
        {
          label: "Nature du coût",
          value: "Coût d'études — phases préparatoires et de démonstration",
          confidence: "moyenne",
          sources: ["euro-sd"],
        },
        {
          label: "Coût caché",
          value: "Le blocage de gouvernance prolonge des dépenses sans avancée",
          confidence: "moyenne",
          sources: ["breaking-def"],
        },
        {
          label: "Coût complet",
          value: "Indéterminé tant que le partage du travail n'est pas réglé",
          confidence: "faible",
          status: "a-recouper",
          sources: ["euro-sd"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le SCAF est financé conjointement par la France, l'Allemagne et l'Espagne. Ce financement partagé est sa force théorique — mutualiser une facture qu'aucune nation ne porterait seule — et sa fragilité réelle.\n\nFin 2025, le ministre allemand de la Défense a publiquement menacé de mettre fin au programme ; France et Espagne ont réaffirmé leur engagement. Le financement de la phase suivante dépend désormais d'une décision politique commune, encore en suspens.",
      indicators: [
        {
          label: "Modèle de financement",
          value: "Partagé entre France, Allemagne et Espagne",
          confidence: "haute",
          sources: ["min-armees"],
        },
        {
          label: "Tension politique",
          value: "Menace allemande d'arrêt fin 2025 ; engagement réaffirmé côté français et espagnol",
          confidence: "haute",
          sources: ["breaking-def"],
        },
        {
          label: "Phase suivante",
          value: "Suspendue à une décision politique commune",
          confidence: "moyenne",
          sources: ["euro-sd"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne du SCAF est le cœur du conflit. Le partage du travail et le leadership sur le chasseur habité opposent Dassault Aviation à Airbus ; la question de la propriété intellectuelle et d'un transfert de technologie de la France vers l'Allemagne envenime le différend.\n\nLes médiations entre industriels ont échoué début 2026. C'est l'illustration la plus nette de ce que Panoplie analyse : dans un programme de coopération, la chaîne industrielle n'est jamais seulement technique — elle est politique.",
      indicators: [
        {
          label: "Industriels",
          value: "Dassault Aviation · Airbus · Indra",
          confidence: "haute",
          sources: ["euro-sd"],
        },
        {
          label: "Objet du conflit",
          value: "Partage du travail et leadership sur le chasseur habité",
          confidence: "haute",
          sources: ["breaking-def"],
        },
        {
          label: "État de la médiation",
          value: "Échouée début 2026 — décision renvoyée au politique",
          confidence: "haute",
          sources: ["euro-sd"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Le SCAF porte une ambition stratégique majeure : doter l'Europe continentale d'une autonomie de combat aérien de 6e génération, sans dépendre des États-Unis. C'est un projet de souveraineté autant que de capacité.\n\nSa crise a donc une portée qui dépasse l'avion. Si le programme échouait, ce serait un revers pour l'idée même d'une défense européenne intégrée — et un argument pour les nations tentées de se tourner, à nouveau, vers l'offre américaine.",
      indicators: [
        {
          label: "Ambition stratégique",
          value: "Autonomie européenne de combat aérien de 6e génération",
          confidence: "haute",
          sources: ["min-armees"],
        },
        {
          label: "Enjeu",
          value: "Test de l'idée d'une défense européenne intégrée",
          confidence: "moyenne",
          sources: ["breaking-def"],
        },
        {
          label: "Risque d'échec",
          value: "Un revers renforcerait l'attrait de l'offre américaine",
          confidence: "moyenne",
          sources: ["euro-sd"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "L'export du SCAF est, à ce stade, une perspective lointaine et hypothétique : aucun appareil n'existe, et le régime d'export d'un futur système européen dépendra des règles que les trois nations partenaires sauront — ou non — accorder entre elles.\n\nL'expérience de l'Eurofighter, où chaque vente requiert l'accord des partenaires, pèse sur cette question : la gouvernance d'export est précisément l'un des points que le SCAF devra clarifier s'il aboutit.",
      indicators: [
        {
          label: "Statut export",
          value: "Hypothétique — aucun appareil, aucun régime arrêté",
          confidence: "moyenne",
          sources: ["euro-sd"],
        },
        {
          label: "Précédent",
          value: "L'Eurofighter a montré la difficulté de l'export à plusieurs nations",
          confidence: "moyenne",
          sources: ["breaking-def"],
        },
        {
          label: "Point à clarifier",
          value: "La gouvernance d'export reste à définir si le programme aboutit",
          confidence: "faible",
          status: "a-recouper",
          sources: ["euro-sd"],
        },
      ],
    },
  ],
  variants: [
    {
      label: "Next Generation Fighter (NGF)",
      value: "Le chasseur habité de 6e génération — cœur du système.",
      confidence: "moyenne",
      sources: ["min-armees"],
    },
    {
      label: "Remote Carriers",
      value: "Drones associés — effecteurs et capteurs déportés.",
      confidence: "moyenne",
      sources: ["euro-sd"],
    },
    {
      label: "Air Combat Cloud",
      value: "Cloud de combat — architecture de partage de données et de commandement.",
      confidence: "moyenne",
      sources: ["min-armees"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "D",
      rationale:
        "Évaluation indicative — programme futur : aucun appareil, et un coût complet indéterminé tant que la gouvernance n'est pas réglée.",
    },
    {
      key: "survivabilite",
      grade: "D",
      rationale:
        "Ambition de 6e génération, mais aucun matériel volant — note indicative, non démontrée.",
    },
    {
      key: "exportabilite",
      grade: "C",
      rationale:
        "Pensé côté européen avec une ambition d'export, mais sans appareil ni régime d'export défini ; perspective hypothétique.",
    },
    {
      key: "risque-industriel",
      grade: "E",
      rationale:
        "Le risque s'est matérialisé : conflit de partage du travail, médiations échouées, programme menacé d'arrêt — un risque industriel et politique critique.",
    },
    {
      key: "maturite",
      grade: "D",
      rationale:
        "Programme futur — démonstrateur visé vers 2027, service envisagé vers 2040, et phase suivante non engagée.",
    },
    {
      key: "confiance-donnees",
      grade: "C",
      rationale:
        "Programme officiellement documenté, mais calendrier, périmètre et gouvernance restent mouvants et incertains.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : le futur chasseur européen est lancé. La réalité : un programme de 6e génération paralysé par un conflit de gouvernance industrielle, dont l'existence même dépend d'arbitrages politiques à venir.",
    bestUseCase:
      "À terme, doter l'Europe continentale d'une capacité de combat aérien de 6e génération souveraine — si les trois nations parviennent à s'accorder.",
    weakPoint:
      "La gouvernance : le partage du travail et le leadership sur le chasseur habité opposent les industriels et les États — c'est le programme, plus que la technologie, qui est en péril.",
    analystNote:
      "Le SCAF est, en 2026, moins un avion qu'un cas d'école de la coopération européenne en crise. Panoplie le classe en programme futur à risque industriel critique : l'enjeu n'est pas de savoir s'il serait un bon chasseur, mais s'il existera. Sa fiche est à suivre comme un baromètre de la défense européenne.",
  },
  operators: ["Europe — programme futur (France, Allemagne, Espagne)"],
  theatres: ["Europe — phases d'études"],
  timeline: [
    {
      date: "2017",
      label: "Lancement de l'initiative franco-allemande, rejointe par l'Espagne.",
      kind: "jalon",
    },
    {
      date: "2025",
      label:
        "Crise ouverte — menace allemande d'arrêt, conflit Dassault / Airbus sur le partage du travail.",
      kind: "debat",
    },
    {
      date: "2026",
      label:
        "Échec des médiations industrielles ; l'avenir du programme renvoyé au politique.",
      kind: "debat",
    },
  ],
  sources: [
    {
      id: "min-armees",
      title: "Le Système de combat aérien du futur (SCAF)",
      publisher: "Ministère des Armées",
      type: "officiel",
      reliability: "A",
      url: "https://www.defense.gouv.fr/dga/enjeux/scaf",
    },
    {
      id: "euro-sd",
      title: "Goodbye SCAF? The Franco-German-Spanish fighter dream in crisis",
      publisher: "European Security & Defence",
      type: "presse",
      reliability: "C",
      url: "https://euro-sd.com/2026/02/articles/exclusive/48822/goodbye-scaf-is-this-the-end-of-the-road-for-the-franco-german-spanish-fighter-dream/",
    },
    {
      id: "breaking-def",
      title:
        "France, Spain reassert faith in Europe's next-gen future fighter",
      publisher: "Breaking Defense",
      type: "presse",
      reliability: "C",
      url: "https://breakingdefense.com/2025/12/france-spain-reassert-faith-in-europes-next-gen-future-fighter-but-germany-stays-mum/",
    },
  ],
  updated: "2026-05-22",
};
