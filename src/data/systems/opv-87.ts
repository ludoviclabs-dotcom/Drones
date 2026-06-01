import type { DefenseSystem } from "../types";

export const opv87: DefenseSystem = {
  slug: "opv-87",
  name: "OPV 87",
  designation: "Offshore Patrol Vessel — patrouilleur hauturier export",
  reference: "PNP-NS-015",
  category: "naval-vessel",
  navalVesselClass: "patrouilleur",
  classLabel: "Patrouilleur hauturier",
  country: "France · export",
  flag: "🇫🇷",
  manufacturer: "Naval Group · Kership",
  introduced: "2020s",
  status:
    "En service export, notamment en Argentine ; famille OPV proposée en variantes",
  acquisitionModes: ["DCS", "production-nationale"],
  tagline:
    "Le bâtiment de souveraineté maritime : faible coût relatif, forte présence, mais combat limité.",
  summary:
    "L'OPV 87 représente la partie la moins spectaculaire mais essentielle du domaine naval : présence, police maritime, ZEE, lutte contre trafics, surveillance et assistance. Il est moins armé qu'une corvette, mais plus soutenable pour tenir la mer longtemps.\n\nPanoplie le traite comme une fiche de souveraineté, pas comme une frégate faible. La question centrale est le rapport coût-présence : combien de jours de mer, quelles missions, quel équipage, quel hélicoptère ou drone, quel armement minimal et quel soutien.",
  navalProfile: {
    platform: {
      missions: ["presence"],
      displacement: "≈ 1 650 t pour la famille OPV 87",
      crew: "≈ 40 marins selon configuration",
      endurance: "Patrouille hauturière longue durée",
      aviation: ["plateforme hélicoptère", "drone ou embarcation selon client"],
      notes:
        "Patrouilleur de souveraineté : la valeur est le nombre de jours de mer, pas la densité missile.",
    },
    combatSystem: {
      family: "autre",
      cms: "Système de surveillance / conduite selon client",
      tacticalLinks: ["liaisons nationales selon client"],
      ballisticMissileDefense: false,
      interoperabilityNotes:
        "Interopérabilité centrée sur police maritime, ZEE, assistance et présence.",
    },
    sensors: {
      radarPrimary: "Radar de surveillance surface / air selon configuration",
      optronics: ["capteurs optroniques de surveillance"],
    },
    effectors: {
      navalGuns: ["Canon moyen / léger selon client"],
      ciws: ["armes légères"],
      decoys: ["équipements de protection selon standard"],
    },
    propulsion: {
      architecture: "CODAD",
      primeMovers: ["Diesels"],
      maxSpeed: "≈ 20+ noeuds selon profil",
      notes:
        "Architecture simple privilégiant coût de cycle, endurance et disponibilité.",
    },
    industrial: {
      primeContractor: "Naval Group / Kership",
      shipyards: ["Lorient", "Concarneau", "chantier client selon contrat"],
      suppliers: [
        { subsystem: "Plateforme", supplier: "Kership", country: "France" },
        { subsystem: "Intégration", supplier: "Naval Group", country: "France" },
        { subsystem: "Armement", supplier: "configuration client", country: "variable" },
      ],
    },
    export: {
      regimeSummary:
        "Produit export de souveraineté maritime, moins sensible qu'une corvette de combat.",
      itarExposure: "aucune",
      politicalConstraints:
        "La sensibilité augmente si le client ajoute missiles, capteurs militaires ou C2 avancé.",
    },
    sustainment: {
      sustainmentNotes:
        "MCO centré sur disponibilité, équipage réduit, pièces simples et entretien de flotte de présence.",
      industrialRiskNotes:
        "Risque principal : soutien local durable et standardisation entre unités.",
    },
  },
  keySpecs: [
    {
      label: "Longueur",
      value: "≈ 87 m",
      confidence: "haute",
      sources: ["naval-piedrabuena"],
    },
    {
      label: "Déplacement",
      value: "≈ 1 650 t pour la famille OPV 87",
      confidence: "moyenne",
      sources: ["naval-tech-opv"],
    },
    {
      label: "Vitesse",
      value: "≈ 20+ noeuds selon profil",
      confidence: "moyenne",
      sources: ["naval-piedrabuena"],
    },
    {
      label: "Endurance",
      value: "Présence hauturière et missions longues de souveraineté",
      confidence: "moyenne",
      sources: ["naval-piedrabuena"],
    },
    {
      label: "Aviation",
      value: "Plateforme hélicoptère selon configuration",
      confidence: "moyenne",
      sources: ["naval-piedrabuena"],
    },
    {
      label: "Armement",
      value: "Canon et armes légères ; modules selon client",
      confidence: "moyenne",
      status: "variable",
      sources: ["naval-piedrabuena"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "L'OPV est d'abord un ratio coût-présence. Son intérêt n'est pas de survivre seul en haute intensité, mais de fournir beaucoup de jours de mer à un coût maîtrisé.\n\nLe piège serait de le comparer directement à une corvette. L'OPV remplit des missions de souveraineté et de police maritime ; la corvette ajoute une capacité de combat plus dense.",
      indicators: [
        {
          label: "Coût relatif",
          value: "Inférieur à une corvette ou frégate de combat",
          confidence: "moyenne",
          sources: ["naval-piedrabuena"],
        },
        {
          label: "Effet principal",
          value: "Jours de mer et présence souveraine",
          confidence: "haute",
          sources: ["naval-piedrabuena"],
        },
        {
          label: "Limite",
          value: "Capacité de combat volontairement limitée",
          confidence: "moyenne",
          sources: ["naval-tech-opv"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Un programme OPV s'achète souvent comme flotte de présence. L'enjeu est moins la sophistication que le nombre de coques, le soutien, l'équipage et les coûts de cycle de vie.\n\nPour un client export, l'OPV est une voie rapide vers la souveraineté maritime visible.",
      indicators: [
        {
          label: "Objet d'acquisition",
          value: "Flotte de patrouille, pas unité de haute intensité isolée",
          confidence: "haute",
          sources: ["naval-piedrabuena"],
        },
        {
          label: "Exemple",
          value: "Programme argentin de patrouilleurs multi-missions",
          confidence: "haute",
          sources: ["naval-piedrabuena"],
        },
        {
          label: "Cycle de vie",
          value: "Disponibilité et équipage dominent la valeur",
          confidence: "moyenne",
          sources: ["naval-piedrabuena"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne OPV est plus simple que celle d'une frégate : coque, propulsion, passerelle, optronique, radar de navigation/surface, armement léger et soutien.\n\nCette simplicité est un atout export. Elle réduit la dépendance aux missiles et capteurs sensibles, tout en conservant une base de soutien naval.",
      indicators: [
        {
          label: "Chaîne",
          value: "Coque, propulsion, surveillance, armement léger, soutien",
          confidence: "moyenne",
          sources: ["naval-piedrabuena"],
        },
        {
          label: "Intégration",
          value: "Moins sensible qu'une frégate VLS / sonar / CMS lourd",
          confidence: "moyenne",
          sources: ["naval-tech-opv"],
        },
        {
          label: "Constructeurs",
          value: "Naval Group et Kership selon famille OPV",
          confidence: "moyenne",
          sources: ["naval-piedrabuena"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Le patrouilleur est une arme politique de basse intensité : il rend la souveraineté visible. ZEE, pêche, trafics, secours, présence dans les outre-mer ou les approches maritimes : c'est le quotidien stratégique.\n\nSon rôle est d'éviter que chaque mission maritime consomme une frégate de combat.",
      indicators: [
        {
          label: "Rôle",
          value: "Souveraineté maritime, ZEE, police des pêches, lutte contre trafics",
          confidence: "haute",
          sources: ["naval-piedrabuena"],
        },
        {
          label: "Effet politique",
          value: "Présence visible à coût soutenable",
          confidence: "moyenne",
          sources: ["naval-piedrabuena"],
        },
        {
          label: "Limite stratégique",
          value: "Dépend d'autres bâtiments en environnement contesté",
          confidence: "moyenne",
          sources: ["naval-tech-opv"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "L'OPV est très exportable parce qu'il est utile, compréhensible et moins sensible qu'une frégate lourde. Il répond aux besoins de nombreux États : surveiller, montrer le pavillon, agir en mer.\n\nLe risque export est la sous-spécification : un OPV trop peu équipé peut devenir insuffisant dès que la menace grimpe.",
      indicators: [
        {
          label: "Exportabilité",
          value: "Élevée — besoin mondial de souveraineté maritime",
          confidence: "haute",
          sources: ["naval-piedrabuena"],
        },
        {
          label: "Sensibilité",
          value: "Faible à moyenne, selon capteurs et armement",
          confidence: "moyenne",
          sources: ["naval-tech-opv"],
        },
        {
          label: "Vigilance",
          value: "Ne pas confondre OPV armé et corvette de combat",
          confidence: "haute",
          sources: ["naval-piedrabuena"],
        },
      ],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Excellent ratio coût-présence pour souveraineté maritime, moins fort en combat.",
    },
    {
      key: "survivabilite",
      grade: "C",
      rationale:
        "Suffisant pour basse intensité ; vulnérable en environnement contesté sans escorte.",
    },
    {
      key: "exportabilite",
      grade: "B",
      rationale:
        "Besoin largement partagé et sensibilité modérée, avec configuration client importante.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Architecture plus simple qu'une frégate, moins dépendante de sous-systèmes sensibles.",
    },
    {
      key: "maturite",
      grade: "A",
      rationale:
        "Type de bâtiment mature et en service, avec missions bien établies.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "Caractéristiques générales ouvertes ; détails d'armement et de capteurs variables selon client.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : l'OPV est un petit navire sans intérêt stratégique. La réalité : c'est souvent lui qui produit la présence maritime quotidienne.",
    bestUseCase:
      "ZEE, patrouille hauturière, police maritime, assistance et missions de souveraineté à faible coût relatif.",
    weakPoint:
      "La montée de menace : un OPV n'est pas une corvette, et encore moins une frégate de combat.",
    analystNote:
      "Le patrouilleur est le rappel utile de Panoplie : la défense navale ne se résume pas au haut du spectre. La souveraineté commence souvent par être présent.",
  },
  operators: ["Argentine — OPV multi-missions", "Clients export selon variantes"],
  theatres: ["Atlantique Sud", "ZEE", "Approches maritimes", "Patrouille hauturière"],
  timeline: [
    {
      date: "2020",
      label: "Livraison du premier OPV multi-missions destiné à l'Argentine.",
      kind: "export",
    },
    {
      date: "2021",
      label: "Livraison d'ARA Piedrabuena, deuxième patrouilleur argentin.",
      kind: "export",
    },
    {
      date: "2022",
      label: "Livraison du quatrième OPV argentin et clôture du programme.",
      kind: "export",
    },
  ],
  sources: [
    {
      id: "naval-piedrabuena",
      title:
        "Naval Group delivers ARA Piedrabuena, second multi-mission offshore patrol vessel for Argentina",
      publisher: "Naval Group",
      type: "constructeur",
      reliability: "B",
      date: "2021",
      url: "https://www.naval-group.com/en/naval-group-delivers-ara-piedrabuena-second-multi-mission-offshore-patrol-vessel-argentina",
    },
    {
      id: "naval-tech-opv",
      title: "Argentina OPV 87 offshore patrol vessels profile",
      publisher: "Naval Technology",
      type: "presse",
      reliability: "C",
      url: "https://www.naval-technology.com/projects/argentina-opv-87-offshore-patrol-vessels/",
    },
  ],
  updated: "2026-05-31",
};
