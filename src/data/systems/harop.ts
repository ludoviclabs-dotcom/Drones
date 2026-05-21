import type { DefenseSystem } from "../types";

export const harop: DefenseSystem = {
  slug: "harop",
  name: "IAI Harop",
  designation: "Harpy-2",
  reference: "PNP-DR-009",
  category: "drone",
  droneClass: "munition-rodeuse",
  classLabel: "Munition rôdeuse anti-radar",
  country: "Israël",
  flag: "🇮🇱",
  manufacturer: "Israel Aerospace Industries (IAI)",
  introduced: "2005",
  status: "En service — production active",
  acquisitionModes: ["DCS"],
  tagline:
    "Le drone qui tourne au-dessus du champ de bataille et plonge sur les radars — la munition rôdeuse anti-radar qui a fait école.",
  summary:
    "Le Harop d'Israel Aerospace Industries est une munition rôdeuse conçue pour la suppression des défenses aériennes ennemies (SEAD). Héritier du Harpy, il fusionne deux objets longtemps distincts : le drone tactique, qui patrouille et observe, et le missile guidé, qui frappe. Il décolle d'un canister, rôde plusieurs heures au-dessus d'une zone, traque une émission radar — puis pique sur sa cible.\n\nSa singularité tient à un détail rare pour une arme « kamikaze » : il peut renoncer. Si la cible disparaît ou si le tir n'est plus opportun, l'opérateur le rappelle en mode rôdeuse. Le comprendre, c'est saisir comment Israël a transformé un créneau de niche — neutraliser les radars adverses — en un produit d'export structurant, et pourquoi cette catégorie d'arme s'est imposée du Haut-Karabakh à l'Asie du Sud.",
  keySpecs: [
    {
      label: "Envergure",
      value: "≈ 3 m",
      confidence: "moyenne",
      sources: ["iai-harop"],
    },
    {
      label: "Endurance",
      value: "> 6 h",
      confidence: "moyenne",
      note: "Permet une longue phase de rôdage avant l'engagement.",
      sources: ["iai-harop"],
    },
    {
      label: "Portée",
      value: "≈ 200 km (LOS) — jusqu'à ≈ 1 000 km via SATCOM",
      confidence: "moyenne",
      note: "La portée longue dépend d'une liaison satellite, pas toujours offerte à l'export.",
      sources: ["iai-harop"],
    },
    {
      label: "Charge militaire",
      value: "≈ 16 kg",
      confidence: "moyenne",
      sources: ["janes-harop"],
    },
    {
      label: "Guidage",
      value: "Double — homing anti-radar + électro-optique (FLIR/CCD) man-in-the-loop",
      confidence: "moyenne",
      note: "Le canal EO autorise l'engagement de cibles non émettrices et le rappel.",
      sources: ["iai-harop"],
    },
    {
      label: "Lancement",
      value: "Canister — véhicule, navire ou structure fixe",
      confidence: "moyenne",
      sources: ["iai-harop"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le coût unitaire d'un Harop n'est pas public — et la fiche l'assume. IAI ne communique pas de prix « à la munition », et aucune source institutionnelle fiable n'en propose. Le seul point d'ancrage est un contrat agrégé : la commande indienne de 2009, environ 100 M$ pour dix « systèmes » Harop. Or un système n'est pas une munition : il englobe les vecteurs, les canisters, les stations de contrôle et le soutien initial, dans une proportion non détaillée.\n\nEn déduire un prix unitaire serait une reconstruction, pas une donnée. Cette opacité est structurelle pour une arme consommable : le client compare un coût d'attrition, le constructeur protège sa grille tarifaire. À retenir : le Harop coûte beaucoup plus qu'un drone FPV et nettement moins qu'un missile de croisière — mais le chiffre exact relève de l'estimation, pas du fait.",
      indicators: [
        {
          label: "Coût unitaire (munition)",
          value: "Non public",
          confidence: "faible",
          status: "variable",
          note: "IAI ne publie pas de prix à la munition ; aucune estimation institutionnelle fiable.",
          sources: ["iai-harop", "sipri-at"],
        },
        {
          label: "Contrat de référence",
          value: "≈ 100 M$ — 10 systèmes (Inde, 2009)",
          confidence: "moyenne",
          status: "a-recouper",
          note: "Contrat agrégé : vecteurs, canisters, stations sol et soutien — non ventilé.",
          sources: ["sipri-at", "janes-harop"],
        },
        {
          label: "Positionnement de coût",
          value: "Entre le drone consommable et le missile de croisière",
          confidence: "faible",
          status: "variable",
          note: "Ordre de grandeur d'analyste, faute de prix publié.",
          sources: ["janes-harop"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le Harop est financé selon deux logiques. En interne, c'est une dépense du budget de défense israélien, sur un programme arrivé à maturité depuis le milieu des années 2000. À l'export, l'acquisition relève de contrats commerciaux directs entre IAI et l'État client, sans intermédiation gouvernementale de type FMS américain — une vente d'industriel à État, encadrée par l'autorité israélienne de contrôle.\n\nCe modèle direct donne au client une relation contractuelle plus souple qu'un canal d'État à État, mais l'expose pleinement aux aléas diplomatiques entre Jérusalem et sa capitale. Comme toute arme consommable, le Harop appelle un poste budgétaire récurrent souvent sous-estimé : le réapprovisionnement en munitions après usage, distinct de l'investissement initial dans les lanceurs et les stations.",
      indicators: [
        {
          label: "Cadre de financement",
          value: "Budget de défense israélien ; contrats commerciaux à l'export",
          confidence: "moyenne",
          sources: ["iai-harop"],
        },
        {
          label: "Canal d'acquisition",
          value: "Vente directe industriel-État (DCS)",
          confidence: "moyenne",
          sources: ["sipri-at"],
        },
        {
          label: "Poste sous-estimé",
          value: "Réapprovisionnement en munitions après emploi",
          confidence: "faible",
          status: "a-recouper",
          note: "Coût récurrent propre aux armes consommables, rarement chiffré publiquement.",
          sources: ["janes-harop"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne du Harop est l'un de ses atouts les plus nets : la munition est conçue et produite par IAI, via sa division missiles MBT, sur une base industrielle israélienne. Cellule, charge militaire, autodirecteur anti-radar, capteur électro-optique — les nœuds critiques sont domestiques. Peu de dépendance étrangère signifie peu de leviers de pression extérieurs sur la production.\n\nLa contrepartie est connue. Une chaîne nationale concentre le risque : elle reste soumise aux priorités du ministère israélien de la Défense, qui peut préempter la production pour les besoins de Tsahal. Et la cadence de fabrication d'une munition consommable devient elle-même un paramètre stratégique — un conflit de haute intensité, où l'on tire vite, peut tendre l'approvisionnement bien plus qu'on ne l'anticipe.",
      indicators: [
        {
          label: "Maître d'œuvre",
          value: "IAI — division MBT Missiles",
          confidence: "moyenne",
          sources: ["iai-harop"],
        },
        {
          label: "Origine des composants",
          value: "Base industrielle israélienne — nœuds critiques domestiques",
          confidence: "moyenne",
          sources: ["iai-harop"],
        },
        {
          label: "Dépendance étrangère",
          value: "Faible",
          confidence: "faible",
          status: "a-recouper",
          note: "Composition fine de la chaîne non publiée par le constructeur.",
          sources: ["janes-harop"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Le Harop a fait d'Israël une référence durable sur un créneau étroit mais décisif : la munition rôdeuse anti-radar. Son influence dépasse la fiche technique. Au Haut-Karabakh, en 2016 puis surtout en 2020, son emploi par l'Azerbaïdjan a pesé sur l'issue du conflit et nourri un débat mondial sur la vulnérabilité des défenses sol-air classiques face à des armes patientes et bon marché à l'échelle d'un système d'armes.\n\nVendre un Harop, c'est donc exporter une capacité offensive lisible et un signal stratégique. Son usage récent au cours de l'affrontement indo-pakistanais de mai 2025 — avec des frappes indiennes revendiquées sur des sites pakistanais — illustre cette portée, mais reste un épisode très récent : les détails opérationnels, les pertes et les effets réels demandent à être recoupés et doivent être lus avec prudence.",
      indicators: [
        {
          label: "Position d'Israël",
          value: "Référence historique de la munition rôdeuse anti-radar",
          confidence: "moyenne",
          sources: ["janes-harop"],
        },
        {
          label: "Conflit structurant",
          value: "Haut-Karabakh 2016 et 2020 — emploi par l'Azerbaïdjan",
          confidence: "moyenne",
          sources: ["janes-harop", "sipri-at"],
        },
        {
          label: "Emploi récent",
          value: "Conflit Inde-Pakistan, mai 2025 — frappes indiennes revendiquées",
          confidence: "faible",
          status: "a-recouper",
          note: "Épisode très récent : effets et pertes encore mal établis.",
          sources: ["press-2025"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "L'export du Harop relève du régime israélien de contrôle, piloté par l'autorité de coopération de défense du ministère de la Défense (DECA). Israël n'est pas membre du MTCR mais en applique volontairement les principes : le Harop, par sa portée et sa charge, en relèverait de la catégorie la plus sensible. Les transferts restent donc soumis à autorisation politique au cas par cas, et certaines fonctions avancées peuvent être bridées sur les versions destinées à l'export.\n\nLa base d'opérateurs déclarée est large pour une arme aussi spécialisée : outre Israël, l'Azerbaïdjan, l'Allemagne, l'Inde, le Maroc, Singapour et la Corée du Sud sont cités, la Turquie ayant été présentée comme client de lancement. Cette diffusion confirme l'attrait commercial de la catégorie — mais chaque vente engage la responsabilité d'Israël quant à l'usage final, dans des théâtres parfois sensibles.",
      indicators: [
        {
          label: "Régime applicable",
          value: "Contrôle israélien — DECA ; principes MTCR appliqués volontairement",
          confidence: "moyenne",
          sources: ["iai-harop", "sipri-at"],
        },
        {
          label: "Conditions",
          value: "Autorisation politique au cas par cas ; fonctions parfois bridées à l'export",
          confidence: "faible",
          status: "a-recouper",
          sources: ["sipri-at"],
        },
        {
          label: "Base d'opérateurs",
          value: "Israël, Azerbaïdjan, Allemagne, Inde, Maroc, Singapour, Corée du Sud",
          confidence: "moyenne",
          note: "Turquie présentée comme client de lancement présumé.",
          sources: ["janes-harop", "sipri-at"],
        },
      ],
      organisms: ["deca"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Effet militaire reconnu pour un coût situé entre le drone consommable et le missile de croisière ; note tempérée par l'absence de prix unitaire public.",
    },
    {
      key: "survivabilite",
      grade: "B",
      rationale:
        "Conçu pour pénétrer une bulle sol-air : profil discret, rôdage et pique terminale en font une cible difficile, même si la phase d'approche reste exposée.",
    },
    {
      key: "exportabilite",
      grade: "B",
      rationale:
        "Largement exporté et hors emprise ITAR américaine, mais soumis à l'autorisation politique israélienne et à un possible bridage des versions export.",
    },
    {
      key: "risque-industriel",
      grade: "A",
      rationale:
        "Chaîne nationale, maître d'œuvre unique, faible dépendance étrangère ; seul risque réel, la préemption de la production par les besoins de Tsahal.",
    },
    {
      key: "maturite",
      grade: "A",
      rationale:
        "En service depuis le milieu des années 2000, employé sur plusieurs théâtres et adossé à une lignée Harpy en évolution continue.",
    },
    {
      key: "confiance-donnees",
      grade: "C",
      rationale:
        "Capacités étayées par des sources convergentes, mais coût unitaire absent et épisodes 2025 trop récents pour être pleinement consolidés.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un « drone suicide » infaillible qui efface les défenses aériennes adverses. La réalité : le Harop est une munition rôdeuse efficace contre des radars qui émettent, mais sa portée utile dépend d'une liaison de données, son temps de rôdage l'expose à la guerre électronique, et un adversaire qui éteint ses radars le prive de sa proie la plus naturelle. Une arme redoutable dans son créneau, pas une solution universelle.",
    bestUseCase:
      "L'ouverture d'une campagne SEAD/DEAD : faire rôder le Harop au-dessus d'une zone défendue pour traquer et détruire les radars de veille et de conduite de tir, et créer un couloir pour l'aviation pilotée. Sa capacité de rappel le rend également pertinent face à des cibles fugaces, là où une frappe irréversible serait trop risquée.",
    weakPoint:
      "La dépendance à l'émission adverse et à la liaison de données. Contre un ennemi discipliné en gestion d'émission, ou dans un environnement fortement brouillé, le Harop perd en efficacité. Son autonomie de ciblage reste par ailleurs encadrée par l'humain dans la boucle — une garantie, mais aussi une contrainte de bande passante et de latence.",
    analystNote:
      "Le Harop a moins inventé une technologie qu'imposé une catégorie : la munition rôdeuse anti-radar comme outil crédible et exportable. Sa vraie portée en 2026 est doctrinale — il a contribué à banaliser l'idée qu'une défense sol-air statique est vulnérable à des armes patientes. Les emplois de 2025 en Asie du Sud confirment cette diffusion, mais leur lecture appelle de la retenue : les premières revendications de conflit sont rarement les plus fiables.",
  },
  operators: [
    "Israël",
    "Azerbaïdjan",
    "Allemagne",
    "Inde",
    "Maroc",
    "Singapour",
    "Corée du Sud",
  ],
  theatres: ["Haut-Karabakh", "Syrie", "Asie du Sud"],
  sources: [
    {
      id: "iai-harop",
      title: "HAROP — Loitering Munition System",
      publisher: "Israel Aerospace Industries",
      type: "constructeur",
      reliability: "B",
      url: "https://www.iai.co.il",
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
      id: "janes-harop",
      title: "IAI Harop — fiche système et analyses",
      publisher: "Janes",
      type: "institution",
      reliability: "B",
    },
    {
      id: "iiss-mb",
      title: "The Military Balance",
      publisher: "IISS",
      type: "institution",
      reliability: "A",
    },
    {
      id: "press-2025",
      title: "Couverture du conflit Inde-Pakistan de mai 2025",
      publisher: "Presse internationale",
      type: "presse",
      reliability: "C",
    },
  ],
  updated: "2026-05-21",
};
