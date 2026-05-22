import type { DefenseSystem } from "../types";

export const ifpcHel: DefenseSystem = {
  slug: "ifpc-hel",
  name: "IFPC-HEL",
  designation: "Indirect Fire Protection Capability — High Energy Laser",
  reference: "PNP-DE-005",
  category: "directed-energy",
  directedEnergyClass: "HEL",
  classLabel: "Laser de défense de site",
  country: "États-Unis",
  flag: "🇺🇸",
  manufacturer: "Lockheed Martin",
  status: "Prototype unique en essais ; abandonné comme programme — non destiné aux forces",
  acquisitionModes: ["production-nationale"],
  tagline:
    "Le laser le plus puissant de l'arsenal terrestre américain — un prototype de 300 kW que l'armée a renoncé à déployer.",
  summary:
    "IFPC-HEL est la variante laser de forte puissance du programme américain de défense de sites Indirect Fire Protection Capability : un laser de classe 300 kW, monté sur remorque, destiné à protéger des emprises fixes ou semi-fixes contre roquettes, artillerie, mortiers, missiles de croisière et drones. Lockheed Martin a été retenu fin 2023 pour le livrer.\n\nMais le dossier a basculé. L'US Army a décidé qu'IFPC-HEL ne deviendrait pas un programme d'armement : le contrat est réduit à un prototype unique, le financement futur est supprimé, et la variante ne sera pas mise en service. C'est la fiche la plus instructive du domaine — celle qui montre qu'annoncer une classe de puissance n'est pas livrer une capacité.",
  keySpecs: [
    {
      label: "Classe de puissance",
      value: "300 kW (classe visée)",
      confidence: "moyenne",
      sources: ["army-mil", "lockheed"],
    },
    {
      label: "Mission",
      value: "Défense de site — roquettes, artillerie, mortiers, drones, missiles",
      confidence: "moyenne",
      sources: ["crs-ifpc"],
    },
    {
      label: "Plateforme",
      value: "Laser sur remorque — emprise fixe ou semi-fixe",
      confidence: "moyenne",
      sources: ["crs-ifpc"],
    },
    {
      label: "Maître d'œuvre",
      value: "Lockheed Martin — laser à l'état solide",
      confidence: "haute",
      sources: ["lockheed"],
    },
    {
      label: "Statut programme",
      value: "Réduit à un prototype unique — non transitionné",
      confidence: "haute",
      sources: ["military-times"],
    },
    {
      label: "Avenir",
      value: "Divestissement — alimentera un effort laser interarmées",
      confidence: "moyenne",
      sources: ["military-times"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "IFPC-HEL devait être le laser le plus puissant de l'arsenal terrestre américain. Le coût marginal par tir d'un tel système est dérisoire ; ce n'est pas là que le dossier s'est joué.\n\nC'est le coût complet — développement, montée à 300 kW, intégration, soutien — qui n'a jamais convaincu. L'US Army prévoit de retrancher de l'ordre de 4,8 Md$ de ses dépenses futures pour IFPC-HEL : la meilleure mesure d'un coût jugé disproportionné au regard du résultat.",
      indicators: [
        {
          label: "Coût marginal par tir",
          value: "Dérisoire — ce n'est pas l'enjeu du dossier",
          confidence: "moyenne",
          sources: ["crs-dew"],
        },
        {
          label: "Dépenses futures retirées",
          value: "≈ 4,8 Md$ retranchés des plans",
          confidence: "moyenne",
          sources: ["military-times"],
        },
        {
          label: "Verdict de coût",
          value: "Coût complet jugé disproportionné au résultat attendu",
          confidence: "moyenne",
          sources: ["military-times"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le programme a été financé par l'US Army, qui a sélectionné Lockheed Martin fin 2023 pour livrer un laser de classe 300 kW. Une transition vers un programme d'armement était prévue pour 2025.\n\nElle n'a pas eu lieu. Le financement futur est éliminé à compter de 2026, le contrat ramené à un prototype unique. Les variantes laser et micro-ondes d'IFPC sont divesties : développées comme prototypes, elles ne seront pas mises en service.",
      indicators: [
        {
          label: "Maître d'ouvrage",
          value: "US Army",
          confidence: "haute",
          sources: ["crs-ifpc"],
        },
        {
          label: "Décision",
          value: "Pas de transition en programme d'armement",
          confidence: "haute",
          sources: ["military-times"],
        },
        {
          label: "Financement futur",
          value: "Supprimé à compter de 2026",
          confidence: "moyenne",
          sources: ["military-times"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "Lockheed Martin assure la maîtrise d'œuvre d'un laser à l'état solide de classe 300 kW. À ce niveau de puissance, chaque maillon devient un défi : qualité de faisceau, refroidissement, alimentation.\n\nLe prototype unique achève des essais en laboratoire avant des essais de développement sur le terrain. La chaîne industrielle existe — mais elle produira un objet de recherche, pas une série.",
      indicators: [
        {
          label: "Maître d'œuvre",
          value: "Lockheed Martin",
          confidence: "haute",
          sources: ["lockheed"],
        },
        {
          label: "Défi d'échelle",
          value: "Faisceau, refroidissement et alimentation à 300 kW",
          confidence: "moyenne",
          sources: ["crs-dew"],
        },
        {
          label: "Production",
          value: "Prototype unique — pas de série prévue",
          confidence: "haute",
          sources: ["military-times"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "L'US Army cherchait, avec IFPC-HEL, un laser de forte puissance pour protéger ses emprises contre des frappes saturantes. Le renoncement ne dit pas que le besoin a disparu — il dit que la technologie n'était pas au rendez-vous du calendrier.\n\nLe prototype servira à alimenter un effort laser interarmées, en s'appuyant aussi sur les travaux navals. La défense de site par laser de forte puissance reste un objectif ; elle redevient un sujet de recherche.",
      indicators: [
        {
          label: "Besoin stratégique",
          value: "Défense d'emprises contre des frappes saturantes",
          confidence: "haute",
          sources: ["crs-ifpc"],
        },
        {
          label: "Leçon",
          value: "La classe de 300 kW n'était pas mûre pour le calendrier visé",
          confidence: "moyenne",
          sources: ["military-times"],
        },
        {
          label: "Redirection",
          value: "Le prototype alimentera un effort laser interarmées",
          confidence: "moyenne",
          sources: ["military-times"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "La question de l'export ne se pose pas : IFPC-HEL n'est pas un produit. C'est un prototype unique, divesti, qui ne sera pas mis en service par les forces américaines elles-mêmes.\n\nSi un laser de défense de site américain devait un jour exister, il serait soumis au régime ITAR et aux arbitrages politiques les plus stricts — mais ce ne sera pas IFPC-HEL.",
      indicators: [
        {
          label: "Statut export",
          value: "Sans objet — prototype unique non mis en service",
          confidence: "haute",
          sources: ["military-times"],
        },
        {
          label: "Régime théorique",
          value: "ITAR — s'il existait un produit",
          confidence: "faible",
          status: "variable",
          sources: ["crs-dew"],
        },
        {
          label: "Réalité",
          value: "IFPC-HEL ne sera pas un système exportable",
          confidence: "haute",
          sources: ["military-times"],
        },
      ],
    },
  ],
  physicalConstraints: [
    {
      label: "Ligne de visée",
      value: "La cible doit être vue et suivie depuis l'emprise protégée",
      confidence: "haute",
      sources: ["crs-dew"],
    },
    {
      label: "Atmosphère",
      value: "Absorption et turbulence pèsent davantage à 300 kW",
      confidence: "haute",
      note: "Le thermal blooming s'aggrave avec la puissance émise.",
      sources: ["crs-dew"],
    },
    {
      label: "Temps d'illumination",
      value: "Maintenir le faisceau face à des cibles rapides et durcies",
      confidence: "moyenne",
      sources: ["crs-dew"],
    },
    {
      label: "Refroidissement",
      value: "Charge thermique considérable à 300 kW",
      confidence: "moyenne",
      sources: ["crs-dew"],
    },
    {
      label: "Puissance disponible",
      value: "300 kW — alimentation et thermique parmi les points durs",
      confidence: "moyenne",
      sources: ["army-mil"],
    },
    {
      label: "Sécurité laser",
      value: "Zones d'exclusion étendues pour une émission de forte puissance",
      confidence: "moyenne",
      sources: ["crs-dew"],
    },
    {
      label: "Effet sur la cible",
      value: "Destruction visée de roquettes, obus et missiles par effet thermique",
      confidence: "moyenne",
      sources: ["crs-ifpc"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "D",
      rationale:
        "Ambition réelle, mais coût complet mal maîtrisé : l'armée a jugé l'effort non rentable et a renoncé à le transformer en programme.",
    },
    {
      key: "survivabilite",
      grade: "C",
      rationale:
        "Système de site, semi-fixe ; la survivabilité dépend de l'emprise protégée — ce n'est pas là que le dossier a échoué.",
    },
    {
      key: "exportabilite",
      grade: "E",
      rationale:
        "Prototype unique divesti : sans mise en service par les forces américaines, il n'existe aucune perspective d'exportation.",
    },
    {
      key: "risque-industriel",
      grade: "E",
      rationale:
        "Le risque s'est pleinement matérialisé : programme non transitionné, financement futur supprimé, capacité non livrée.",
    },
    {
      key: "maturite",
      grade: "D",
      rationale:
        "Un prototype de 300 kW existe et achève ses essais, mais l'effort en restera là — stade du démonstrateur, sans suite.",
    },
    {
      key: "confiance-donnees",
      grade: "A",
      rationale:
        "Dossier très bien documenté — GAO, CRS et annonces officielles —, y compris sur son arrêt : la confiance dans les données est élevée.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un laser de 300 kW protégeant les bases américaines. La réalité : un prototype unique, en essais de laboratoire, que l'armée a décidé de ne pas mettre en service — un laser de forte puissance qui n'est jamais devenu un programme.",
    bestUseCase:
      "En tant que prototype, IFPC-HEL sert désormais à éclairer l'effort laser interarmées qui lui succède — il informe, il ne défend rien.",
    weakPoint:
      "L'échelle. Atteindre 300 kW avec une qualité de faisceau, un refroidissement et une alimentation exploitables, dans le calendrier prévu, s'est révélé hors de portée d'un programme d'armement.",
    analystNote:
      "IFPC-HEL est la fiche la plus instructive du domaine : elle montre qu'annoncer une classe de puissance n'est pas livrer une capacité. Le retrait d'environ 4,8 Md$ est le verdict honnête — le laser de 300 kW relève encore de la recherche, pas de l'arsenal.",
  },
  legalNote:
    "Le Protocole IV de la Convention sur certaines armes classiques interdit les armes laser spécifiquement conçues pour provoquer une cécité permanente. IFPC-HEL visait roquettes, obus et missiles ; le CICR rappelle l'obligation de précaution pour éviter d'aveugler lors de l'emploi de tout système laser.",
  operators: ["États-Unis — prototype"],
  theatres: ["États-Unis — essais en laboratoire et à Dugway Proving Ground"],
  timeline: [
    {
      date: "2023",
      label:
        "Lockheed Martin est retenu pour livrer un laser à l'état solide de classe 300 kW.",
      kind: "jalon",
    },
    {
      date: "2025",
      label: "La transition en programme d'armement, prévue, n'a pas lieu.",
      kind: "debat",
    },
    {
      date: "2026",
      label: "Le contrat est réduit à un prototype unique — essais de laboratoire en cours.",
      kind: "jalon",
    },
    {
      date: "2026",
      label:
        "L'Army supprime le financement futur ; IFPC-HEL et IFPC-HPM ne seront pas mis en service.",
      kind: "debat",
    },
  ],
  sources: [
    {
      id: "crs-ifpc",
      title: "The U.S. Army's Indirect Fire Protection Capability (IFPC) System",
      publisher: "Congressional Research Service",
      type: "institution",
      reliability: "A",
      url: "https://www.congress.gov/crs-product/IF12421",
    },
    {
      id: "army-mil",
      title: "Scaling Up: Army Advances 300kW-class Laser Prototype",
      publisher: "U.S. Army",
      type: "officiel",
      reliability: "A",
      url: "https://www.army.mil/article/233346/scaling_up_army_advances_300kw_class_laser_prototype",
    },
    {
      id: "lockheed",
      title:
        "U.S. Army Selects Lockheed Martin to Deliver 300 kW-class Laser Weapon System",
      publisher: "Lockheed Martin",
      type: "constructeur",
      reliability: "B",
      url: "https://news.lockheedmartin.com/2023-10-10-US-Army-Selects-Lockheed-Martin-to-Deliver-300-kW-class-Solid-State-Laser-Weapon-System",
    },
    {
      id: "military-times",
      title: "The US Army is already ditching its most powerful laser weapon yet",
      publisher: "Military Times",
      type: "presse",
      reliability: "C",
      url: "https://www.militarytimes.com/industry/techwatch/2026/03/23/the-us-army-is-already-ditching-its-most-powerful-laser-weapon-yet/",
    },
    {
      id: "crs-dew",
      title: "Directed Energy Weapons — report R46925",
      publisher: "Congressional Research Service",
      type: "institution",
      reliability: "A",
      url: "https://crsreports.congress.gov/product/pdf/R/R46925",
    },
  ],
  updated: "2026-05-22",
};
