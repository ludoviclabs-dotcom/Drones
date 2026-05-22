import type { DefenseSystem } from "../types";

export const deMShorad: DefenseSystem = {
  slug: "de-m-shorad",
  name: "DE M-SHORAD",
  designation: "« Guardian » — Stryker A1",
  reference: "PNP-DE-004",
  category: "directed-energy",
  directedEnergyClass: "HEL",
  classLabel: "Laser SHORAD mobile",
  country: "États-Unis",
  flag: "🇺🇸",
  manufacturer: "RTX (Raytheon) · Kord Technologies",
  status: "Prototypes livrés à une unité ; transition retardée — non jugé mûr pour le service",
  acquisitionModes: ["production-nationale"],
  tagline:
    "Le laser censé suivre la manœuvre — quatre prototypes, des soldats peu convaincus, une transition repoussée.",
  summary:
    "DE M-SHORAD — Directed Energy Maneuver-Short Range Air Defense — est la tentative de l'US Army de doter ses forces de manœuvre d'un laser de 50 kW monté sur Stryker, baptisé « Guardian ». Conçu dans une logique de prototypage rapide, il devait protéger les unités au contact contre drones, roquettes et obus.\n\nLe résultat est instructif. Quatre prototypes ont été livrés à une section de défense antiaérienne, mais le GAO juge le système insuffisamment mûr, la transition en programme d'armement a été repoussée d'environ deux ans, et l'armée envisage de renoncer au Stryker comme plateforme. DE M-SHORAD montre que livrer vite du matériel n'est pas livrer une capacité — c'est un dossier sur la difficulté d'intégrer un laser à une plateforme mobile.",
  keySpecs: [
    {
      label: "Classe de puissance",
      value: "50 kW (classe)",
      confidence: "moyenne",
      sources: ["army-recognition"],
    },
    {
      label: "Plateforme",
      value: "Stryker A1 8×8 — remise en cause",
      confidence: "haute",
      note: "L'armée étudie une configuration sans le Stryker.",
      sources: ["gao"],
    },
    {
      label: "Mission",
      value: "SHORAD de manœuvre — drones, roquettes, obus",
      confidence: "moyenne",
      sources: ["army-recognition"],
    },
    {
      label: "Cadre programme",
      value: "Prototypage rapide (RCCTO)",
      confidence: "haute",
      sources: ["gao"],
    },
    {
      label: "Prototypes livrés",
      value: "Quatre — à une section de défense antiaérienne",
      confidence: "moyenne",
      sources: ["gao", "breaking-def"],
    },
    {
      label: "Statut de transition",
      value: "Repoussée d'environ deux ans — production visée en 2027",
      confidence: "haute",
      sources: ["gao"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Comme tout laser, DE M-SHORAD promet un coût marginal par tir très bas. Mais ce dossier illustre l'autre versant du coût : celui d'un développement qui dérape.\n\nLe prototypage rapide devait réduire les délais et les coûts. La transition retardée de deux ans, et la remise en cause de la plateforme, signifient des dépenses engagées sans capacité livrée — le coût d'une maturité surestimée.",
      indicators: [
        {
          label: "Coût marginal par tir",
          value: "Bas — quelques unités d'énergie par engagement",
          confidence: "faible",
          status: "variable",
          sources: ["army-recognition"],
        },
        {
          label: "Coût système",
          value: "Non public",
          confidence: "faible",
          status: "variable",
          sources: ["gao"],
        },
        {
          label: "Coût caché",
          value: "Transition retardée — dépenses sans capacité livrée",
          confidence: "moyenne",
          sources: ["gao"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "DE M-SHORAD est financé par l'US Army via son bureau de prototypage rapide (RCCTO). Le calendrier prévoyait une transition vers un programme d'armement en 2025.\n\nLe GAO indique que cette transition a été repoussée d'environ deux ans, la production étant désormais attendue en 2027 : les résultats des démonstrations n'ont pas permis de juger le système assez mûr. À la transition, l'effort sera renommé « Enduring High Energy Laser ».",
      indicators: [
        {
          label: "Maître d'ouvrage",
          value: "US Army — bureau de prototypage rapide (RCCTO)",
          confidence: "haute",
          sources: ["gao", "us-army"],
        },
        {
          label: "Transition",
          value: "Repoussée d'environ deux ans (production visée 2027)",
          confidence: "haute",
          sources: ["gao"],
        },
        {
          label: "Évolution",
          value: "Renommage en « Enduring High Energy Laser »",
          confidence: "moyenne",
          sources: ["gao"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne associe une source laser industrielle, un intégrateur — Kord Technologies — et la plateforme Stryker. C'est précisément l'intégration qui a posé problème : loger un laser, son alimentation et son refroidissement sur un véhicule de manœuvre.\n\nQue l'armée envisage d'abandonner le Stryker en dit long : le maillon faible n'était pas la source laser, mais le mariage entre l'arme et son porteur.",
      indicators: [
        {
          label: "Intégrateur",
          value: "Kord Technologies — laser intégré au Stryker",
          confidence: "moyenne",
          sources: ["army-recognition"],
        },
        {
          label: "Sous-systèmes critiques",
          value: "Source laser, alimentation, refroidissement embarqués",
          confidence: "moyenne",
          sources: ["crs-dew"],
        },
        {
          label: "Maillon faible",
          value: "L'intégration sur plateforme mobile, pas la source laser",
          confidence: "moyenne",
          sources: ["gao"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "La guerre d'Ukraine a remis la défense antiaérienne courte portée au premier plan : les forces de manœuvre y sont exposées à des drones nombreux et bon marché. DE M-SHORAD est la réponse américaine à ce besoin.\n\nMais le retard du programme illustre un écart entre l'urgence stratégique et la maturité technologique — un laser de manœuvre crédible reste, pour l'US Army, une capacité recherchée plutôt que détenue.",
      indicators: [
        {
          label: "Besoin stratégique",
          value: "Protéger les forces de manœuvre contre les drones",
          confidence: "haute",
          sources: ["crs-dew"],
        },
        {
          label: "Place dans la défense",
          value: "SHORAD mobile — couche basse au contact",
          confidence: "moyenne",
          sources: ["army-recognition"],
        },
        {
          label: "Écart constaté",
          value: "Urgence du besoin vs maturité insuffisante du système",
          confidence: "haute",
          sources: ["gao"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "DE M-SHORAD est un programme national américain, qui relèverait du régime ITAR. Tant que le système n'est pas mûr ni transitionné, la question de l'export ne se pose pas.\n\nLe domaine de l'énergie dirigée est en outre l'un des plus sensibles à l'exportation : un laser de manœuvre, s'il aboutissait, resterait soumis aux arbitrages les plus stricts.",
      indicators: [
        {
          label: "Statut export",
          value: "Programme national — export hors sujet à ce stade",
          confidence: "haute",
          sources: ["gao"],
        },
        {
          label: "Régime probable",
          value: "ITAR — contrôle américain strict",
          confidence: "moyenne",
          sources: ["crs-dew"],
        },
        {
          label: "Condition préalable",
          value: "Une maturité et une transition encore non acquises",
          confidence: "haute",
          sources: ["gao"],
        },
      ],
    },
  ],
  physicalConstraints: [
    {
      label: "Ligne de visée",
      value: "La cible doit être vue et suivie depuis le véhicule en position",
      confidence: "haute",
      sources: ["crs-dew"],
    },
    {
      label: "Atmosphère",
      value: "Pluie, brouillard, poussière de manœuvre dégradent le faisceau",
      confidence: "haute",
      sources: ["crs-dew"],
    },
    {
      label: "Temps d'illumination",
      value: "Plusieurs secondes de faisceau maintenu sur la cible",
      confidence: "moyenne",
      sources: ["crs-dew"],
    },
    {
      label: "Refroidissement",
      value: "Difficile à loger sur un véhicule — limite la cadence",
      confidence: "moyenne",
      note: "Contrainte SWaP-C centrale dans les difficultés du programme.",
      sources: ["gao"],
    },
    {
      label: "Puissance disponible",
      value: "50 kW — l'alimentation embarquée est un point dur",
      confidence: "moyenne",
      sources: ["crs-dew"],
    },
    {
      label: "Sécurité laser",
      value: "Zones d'exclusion et risque oculaire en environnement de manœuvre",
      confidence: "moyenne",
      sources: ["crs-dew"],
    },
    {
      label: "Effet sur la cible",
      value: "Neutralisation de drones et munitions par effet thermique",
      confidence: "moyenne",
      sources: ["army-recognition"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "C",
      rationale:
        "Potentiel réel d'un effecteur SHORAD mobile, mais les performances jugées insuffisantes et le coût complet d'un programme qui dérape pèsent sur le bilan.",
    },
    {
      key: "survivabilite",
      grade: "C",
      rationale:
        "La mobilité du Stryker est un atout, mais la plateforme elle-même est remise en cause et le système n'a pas démontré sa robustesse en emploi.",
    },
    {
      key: "exportabilite",
      grade: "D",
      rationale:
        "Programme national non transitionné, sous régime ITAR ; capacité souveraine sans perspective d'export à ce stade.",
    },
    {
      key: "risque-industriel",
      grade: "D",
      rationale:
        "Transition repoussée de deux ans, plateforme remise en cause, retours d'emploi mitigés : le risque industriel s'est largement matérialisé.",
    },
    {
      key: "maturite",
      grade: "D",
      rationale:
        "Quatre prototypes livrés, mais explicitement jugés insuffisamment mûrs pour le service par le GAO — stade du démonstrateur.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "Le programme est bien documenté, notamment par un rapport du GAO ; certaines données de performance restent industrielles.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un Stryker laser qui abat les drones au rythme de la manœuvre. La réalité : quatre prototypes, des soldats peu convaincus, une transition repoussée de deux ans et une plateforme dont l'armée envisage de se passer.",
    bestUseCase:
      "En principe, la défense antiaérienne courte portée des forces de manœuvre contre drones et roquettes — à condition que les problèmes de maturité et d'intégration soient résolus.",
    weakPoint:
      "L'intégration : loger un laser gourmand en énergie et en refroidissement sur un véhicule mobile s'est révélé plus dur que ne le supposait le prototypage rapide.",
    analystNote:
      "DE M-SHORAD est le contre-exemple instructif du cycle d'enthousiasme autour du laser : le prototypage rapide a produit du matériel vite, mais « vite » a devancé « mûr ». Le renommage en Enduring HEL et l'abandon possible du Stryker sont les signaux à lire — un effecteur recherché, pas encore détenu.",
  },
  legalNote:
    "Le Protocole IV de la Convention sur certaines armes classiques interdit les armes laser spécifiquement conçues pour provoquer une cécité permanente. DE M-SHORAD vise drones et munitions ; le CICR rappelle l'obligation de précaution pour éviter d'aveugler lors de l'emploi de tout système laser.",
  operators: ["États-Unis — unité d'évaluation"],
  theatres: ["États-Unis — évaluation et tir réel (Fort Sill)"],
  timeline: [
    {
      date: "2019",
      label: "L'US Army lance DE M-SHORAD en prototypage rapide via le RCCTO.",
      kind: "jalon",
    },
    {
      date: "2022",
      label: "Livraison des premiers prototypes à une section de défense antiaérienne.",
      kind: "jalon",
    },
    {
      date: "2024",
      label: "Retours d'emploi mitigés ; des soldats jugent le système peu convaincant.",
      kind: "debat",
    },
    {
      date: "2025",
      label: "Le GAO juge le système insuffisamment mûr ; transition repoussée de deux ans.",
      kind: "debat",
    },
    {
      date: "2025",
      label: "L'armée étudie une configuration sans Stryker ; renommage en Enduring HEL.",
      kind: "jalon",
    },
  ],
  sources: [
    {
      id: "gao",
      title:
        "GAO-25-107491 — Army Modernization: Air and Missile Defense Efforts",
      publisher: "U.S. Government Accountability Office",
      type: "institution",
      reliability: "A",
      url: "https://files.gao.gov/reports/GAO-25-107491/index.html",
    },
    {
      id: "us-army",
      title: "Army awards laser weapon system contract",
      publisher: "U.S. Army",
      type: "officiel",
      reliability: "A",
      url: "https://www.army.mil/article/225276/army_awards_laser_weapon_system_contract",
    },
    {
      id: "breaking-def",
      title:
        "Army soldiers not impressed with Strykers outfitted with 50-kilowatt lasers",
      publisher: "Breaking Defense",
      type: "presse",
      reliability: "C",
      url: "https://breakingdefense.com/2024/05/army-soldiers-not-impressed-with-strykers-outfitted-with-50-kilowatt-lasers/",
    },
    {
      id: "army-recognition",
      title: "DE M-SHORAD Guardian — Stryker 50 kW-class laser weapon",
      publisher: "Army Recognition",
      type: "presse",
      reliability: "C",
      url: "https://www.armyrecognition.com/military-products/army/air-defense-systems/air-defense-vehicles/de-m-shorad-guardian-stryker-50-kw-class-laser-weapon-data-fact-sheet",
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
