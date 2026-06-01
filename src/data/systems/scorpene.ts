import type { DefenseSystem } from "../types";

export const scorpene: DefenseSystem = {
  slug: "scorpene",
  name: "Scorpène",
  designation: "Sous-marin d'attaque conventionnel export",
  reference: "PNP-NS-010",
  category: "naval-vessel",
  navalVesselClass: "sous-marin",
  classLabel: "SSK diesel-électrique",
  country: "France · export",
  flag: "🇫🇷",
  manufacturer: "Naval Group",
  introduced: "2000s",
  status: "En service et en production export ; programmes avec transfert de technologie",
  acquisitionModes: ["DCS", "production-nationale"],
  tagline:
    "Le sous-marin conventionnel qui vend autant de discrétion que de transfert industriel.",
  summary:
    "Le Scorpène est un sous-marin d'attaque conventionnel conçu pour l'export. Sa valeur Panoplie tient moins à une fiche de performances publiques qu'à trois variables : discrétion, système de combat et transfert industriel.\n\nLe sous-marin est un domaine où l'incertitude doit rester visible. Les performances acoustiques, capteurs précis, endurance opérationnelle et tactiques d'emploi ne sont pas des données publiques stables. La fiche privilégie donc les faits sourcés : programmes livrés, architecture générale, armement ouvertement annoncé, soutien et production locale.",
  navalProfile: {
    platform: {
      missions: ["ASW", "ASuW", "presence"],
      crew: "≈ 30 à 40 marins selon version",
      endurance: "Endurance conventionnelle dépendante du profil et des options AIP / batteries",
      notes:
        "SSK export ; les performances acoustiques précises ne sont pas publiques et doivent rester hors champ.",
    },
    combatSystem: {
      family: "autre",
      cms: "SUBTICS",
      tacticalLinks: ["liaisons et C2 selon client"],
      ballisticMissileDefense: false,
      interoperabilityNotes:
        "Intégration dépendante du client, des armes retenues et de l'infrastructure de soutien.",
    },
    sensors: {
      hullSonar: "Suite sonar intégrée selon standard",
      towedSonar: "Options selon client",
      esm: ["Mâts optroniques / ESM selon configuration"],
      optronics: ["Périscopes / mâts optroniques selon standard"],
    },
    effectors: {
      antiShipMissiles: ["Missiles antinavires selon client"],
      antiSubWeapons: ["Torpilles lourdes"],
      decoys: ["Leurres sous-marins selon configuration"],
    },
    propulsion: {
      architecture: "diesel-electrique",
      primeMovers: ["Diesels", "batteries", "AIP selon version"],
      notes:
        "La discrétion, les batteries et l'AIP éventuel sont plus déterminants que la vitesse publique.",
    },
    industrial: {
      primeContractor: "Naval Group",
      shipyards: ["Cherbourg", "chantiers locaux selon contrat"],
      suppliers: [
        { subsystem: "Système de combat", supplier: "Naval Group", country: "France" },
        { subsystem: "Production locale", supplier: "chantier client", country: "variable" },
        { subsystem: "Armes", supplier: "fournisseurs client", country: "variable" },
      ],
      transferOfTechnology:
        "Transfert de technologie fréquent dans les contrats export Scorpène.",
    },
    export: {
      regimeSummary:
        "SSK export structurant ; le contrat vend autant la compétence sous-marine que la coque.",
      itarExposure: "partielle",
      politicalConstraints:
        "Armes, batteries, AIP, chantier local et formation conditionnent l'effet réel.",
    },
    sustainment: {
      sustainmentNotes:
        "Soutien lourd : équipages, simulateurs, batteries, torpilles, grands carénages et infrastructure de base.",
      industrialRiskNotes:
        "Risque transféré vers la montée en compétence locale et la tenue du MCO sous-marin.",
    },
  },
  keySpecs: [
    {
      label: "Type",
      value: "Sous-marin d'attaque conventionnel diesel-électrique",
      confidence: "haute",
      sources: ["naval-vagsheer"],
    },
    {
      label: "Armement",
      value: "Torpilles lourdes, missiles antinavires selon client, mines selon configuration",
      confidence: "moyenne",
      status: "variable",
      sources: ["naval-vagsheer"],
    },
    {
      label: "Tubes",
      value: "Six tubes lance-torpilles annoncés sur la famille",
      confidence: "moyenne",
      sources: ["naval-tech-scorpene"],
    },
    {
      label: "Charge armes",
      value: "Jusqu'à 18 armes selon standard ouvert",
      confidence: "moyenne",
      sources: ["naval-tech-scorpene"],
    },
    {
      label: "Production locale",
      value: "Possible selon contrat, avec transfert de technologie",
      confidence: "haute",
      sources: ["naval-indonesia"],
    },
    {
      label: "Discrétion",
      value: "Critère central, performances publiques limitées",
      confidence: "faible",
      status: "variable",
      sources: ["naval-vagsheer"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le coût d'un SSK ne s'arrête pas à la coque : formation des équipages, infrastructure de base, batteries, torpilles, simulateurs, indisponibilités et cycles de grand carénage pèsent lourd.\n\nLe Scorpène reste attractif parce qu'il offre une capacité de déni d'accès à un coût inférieur à un sous-marin nucléaire, tout en exigeant une culture opérationnelle et industrielle avancée.",
      indicators: [
        {
          label: "Coût complet",
          value: "Plateforme + infrastructure + formation + munitions + MCO",
          confidence: "moyenne",
          sources: ["naval-indonesia"],
        },
        {
          label: "Rapport effet / coût",
          value: "Déni d'accès élevé pour un format conventionnel",
          confidence: "moyenne",
          sources: ["naval-vagsheer"],
        },
        {
          label: "Variable",
          value: "AIP, batteries, armes et production locale changent la facture",
          confidence: "moyenne",
          status: "variable",
          sources: ["naval-indonesia"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Les contrats Scorpène se structurent souvent autour de la souveraineté client : production locale, transfert de technologie, soutien long et montée en compétence nationale.\n\nLa logique financière n'est donc pas seulement l'achat de deux ou six coques. Elle inclut la capacité d'un pays à construire, soutenir et protéger une force sous-marine.",
      indicators: [
        {
          label: "Montage",
          value: "Contrats export avec production locale possible",
          confidence: "haute",
          sources: ["naval-indonesia"],
        },
        {
          label: "Exemple Inde",
          value: "Classe Kalvari construite localement avec Mazagon Dock Shipbuilders",
          confidence: "haute",
          sources: ["naval-vagsheer"],
        },
        {
          label: "Lecture financière",
          value: "Programme de filière sous-marine, pas achat ponctuel",
          confidence: "moyenne",
          sources: ["naval-vagsheer"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne Scorpène combine coque, système de combat, propulsion, batteries, sonar, périscopes/optronique, torpilles et compétences de maintenance. C'est une chaîne plus secrète et plus exigeante que celle d'une corvette.\n\nLe transfert industriel peut réduire la dépendance politique, mais il augmente la complexité d'intégration et de qualité.",
      indicators: [
        {
          label: "Système",
          value: "Plateforme + combat system + sonar + armement",
          confidence: "moyenne",
          sources: ["naval-vagsheer"],
        },
        {
          label: "Transfert",
          value: "Production locale et ToT selon client",
          confidence: "haute",
          sources: ["naval-indonesia"],
        },
        {
          label: "Risque",
          value: "Maintien des compétences sous-marines sur cycles longs",
          confidence: "moyenne",
          sources: ["naval-vagsheer"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Un Scorpène donne à une marine régionale une capacité de déni d'accès très lisible : surveillance, dissuasion conventionnelle, protection d'approches maritimes et pression sur les routes navales adverses.\n\nL'objet est politiquement sensible : vendre un sous-marin, c'est transférer une capacité stratégique durable.",
      indicators: [
        {
          label: "Effet stratégique",
          value: "Déni d'accès conventionnel et dissuasion régionale",
          confidence: "haute",
          sources: ["naval-vagsheer"],
        },
        {
          label: "Sensibilité",
          value: "Capacité sous-marine export à fort enjeu politique",
          confidence: "haute",
          sources: ["naval-indonesia"],
        },
        {
          label: "Limite OSINT",
          value: "Performances acoustiques et emploi réel non publics",
          confidence: "haute",
          sources: ["naval-vagsheer"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "Le Scorpène est l'une des offres françaises les plus fortes en export naval. Son succès vient de la combinaison entre plateforme, transfert industriel et capacité à insérer le client dans une filière sous-marine.\n\nLe risque export est la durée : disponibilité, pièces, soutien, formation et modernisations conditionnent la valeur bien après la livraison.",
      indicators: [
        {
          label: "Exportabilité",
          value: "Élevée — plusieurs marines clientes",
          confidence: "haute",
          sources: ["naval-vagsheer"],
        },
        {
          label: "Indonésie",
          value: "Accord pour deux Scorpène construits localement",
          confidence: "haute",
          sources: ["naval-indonesia"],
        },
        {
          label: "Risque long terme",
          value: "MCO, formation et modernisation sur plusieurs décennies",
          confidence: "moyenne",
          sources: ["naval-vagsheer"],
        },
      ],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Très fort effet stratégique pour un coût inférieur au nucléaire, mais l'écosystème sous-marin reste lourd.",
    },
    {
      key: "survivabilite",
      grade: "B",
      rationale:
        "La discrétion donne une survivabilité potentielle élevée ; les performances fines restent non publiques.",
    },
    {
      key: "exportabilite",
      grade: "A",
      rationale:
        "Produit export éprouvé, renforcé par les options de production locale et transfert de technologie.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Naval Group maîtrise le produit ; le risque augmente avec la production locale et le soutien long.",
    },
    {
      key: "maturite",
      grade: "B",
      rationale:
        "Famille livrée et produite, mais chaque client porte un standard et un soutien spécifique.",
    },
    {
      key: "confiance-donnees",
      grade: "C",
      rationale:
        "Programmes et caractéristiques générales bien sourcés ; performances sous-marines sensibles et peu publiques.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un sous-marin export se compare par nombre de tubes. La réalité : discrétion, soutien, équipage, batteries et ToT décident sa valeur.",
    bestUseCase:
      "Déni d'accès conventionnel, surveillance sous-marine et montée en souveraineté industrielle d'une marine régionale.",
    weakPoint:
      "La donnée ouverte : l'essentiel des performances acoustiques et capteurs reste non public.",
    analystNote:
      "Le Scorpène doit être traité avec prudence : beaucoup de ses qualités réelles sont précisément celles qui ne se publient pas. Panoplie doit donc rendre l'incertitude visible.",
  },
  operators: [
    "Inde — classe Kalvari",
    "Chili",
    "Malaisie",
    "Brésil",
    "Indonésie — programme annoncé",
  ],
  theatres: ["Océan Indien", "Pacifique", "Atlantique Sud", "Zones littorales"],
  timeline: [
    {
      date: "2005",
      label: "Lancement de la production indienne sous licence Scorpène.",
      kind: "export",
    },
    {
      date: "2024",
      label: "Accord annoncé avec l'Indonésie pour deux Scorpène à production locale.",
      kind: "export",
    },
    {
      date: "2025",
      label: "Livraison de Vagsheer, dernier sous-marin de classe Kalvari en Inde.",
      kind: "jalon",
    },
  ],
  sources: [
    {
      id: "naval-vagsheer",
      title: "Naval Group delivers Vagsheer, last Kalvari-class submarine",
      publisher: "Naval Group",
      type: "constructeur",
      reliability: "B",
      date: "2025",
      url: "https://www.naval-group.com/en/naval-group-delivers-vagsheer-last-kalvari-class-submarine",
    },
    {
      id: "naval-indonesia",
      title:
        "Indonesia chooses Naval Group and PT PAL for two Scorpene submarines built in Indonesia",
      publisher: "Naval Group",
      type: "constructeur",
      reliability: "B",
      date: "2024",
      url: "https://www.naval-group.com/en/indonesia-chooses-naval-group-and-pt-pal-two-scorpene-submarines-built-indonesia",
    },
    {
      id: "naval-tech-scorpene",
      title: "Scorpene-class submarine profile",
      publisher: "Naval Technology",
      type: "presse",
      reliability: "C",
      url: "https://www.naval-technology.com/projects/scorpene/",
    },
  ],
  updated: "2026-05-31",
};
