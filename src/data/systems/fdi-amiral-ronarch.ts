import type { DefenseSystem } from "../types";

export const fdiAmiralRonarch: DefenseSystem = {
  slug: "fdi-amiral-ronarch",
  name: "FDI Amiral Ronarc'h",
  designation: "Frégate de défense et d'intervention — tête de série française",
  reference: "PNP-NS-007",
  category: "naval-vessel",
  navalVesselClass: "fregate",
  classLabel: "Frégate numérique compacte",
  country: "France",
  flag: "🇫🇷",
  manufacturer: "Naval Group · Thales · MBDA",
  introduced: "2025",
  status:
    "Tête de série livrée à la Marine nationale ; programme France et export Grèce",
  acquisitionModes: ["production-nationale", "DCS"],
  tagline:
    "Une frégate compacte où la valeur militaire vient du Sea Fire, de SETIS, de la guerre ASM et de l'intégration numérique.",
  summary:
    "La FDI Amiral Ronarc'h est une frégate de défense et d'intervention pensée comme une plateforme compacte, numérisée et exportable. Elle associe le radar Sea Fire, le CMS SETIS, des missiles Aster, Exocet, MU90, des capteurs ASM et des liaisons de données.\n\nPour Panoplie, la FDI est le cas idéal du « moins de tonnage, plus d'intégration ». Elle permet de comparer une frégate moderne par densité de capteurs, automatisation, équipage réduit, export et montée de standard, plutôt que par taille seule.",
  navalProfile: {
    platform: {
      missions: ["AAW", "ASW", "ASuW", "presence"],
      displacement: "≈ 4 500 t",
      crew: "≈ 125 marins + capacité passagers",
      aviation: ["Hélicoptère embarqué", "Drone aérien selon évolution"],
      notes:
        "Frégate compacte de premier rang ; la densité capteurs/CMS compense le tonnage contenu.",
    },
    combatSystem: {
      family: "SETIS",
      cms: "SETIS",
      tacticalLinks: ["Link 16", "liaisons OTAN / nationales selon standard"],
      ballisticMissileDefense: false,
      interoperabilityNotes:
        "Architecture pensée pour opérations alliées et configurations export, notamment FDI HN.",
    },
    sensors: {
      radarPrimary: "Thales Sea Fire AESA 4 faces",
      hullSonar: "KingKlip",
      towedSonar: "CAPTAS-4 Compact selon configuration",
      esm: ["Suite EW / cyber navale selon standard"],
      optronics: ["Capteurs optroniques de veille et conduite de tir"],
    },
    effectors: {
      vlsType: "Sylver",
      vlsCells: "Jusqu'à 32 cellules selon configuration",
      sam: ["Aster 15/30"],
      antiShipMissiles: ["Exocet MM40 Block 3C"],
      antiSubWeapons: ["MU90", "hélicoptère ASM"],
      navalGuns: ["76 mm"],
      ciws: ["Artillerie légère / autodéfense selon client"],
    },
    propulsion: {
      architecture: "CODAD",
      primeMovers: ["Diesels"],
      notes:
        "Architecture de frégate compacte optimisée pour disponibilité, coût et endurance.",
    },
    industrial: {
      primeContractor: "Naval Group",
      shipyards: ["Lorient"],
      suppliers: [
        { subsystem: "CMS", supplier: "Naval Group", country: "France" },
        { subsystem: "Radar", supplier: "Thales", country: "France" },
        { subsystem: "Missiles", supplier: "MBDA", country: "Europe" },
        { subsystem: "Sonar", supplier: "Thales", country: "France" },
      ],
    },
    export: {
      regimeSummary:
        "Frégate conçue pour export de premier rang ; standard grec déjà structurant.",
      itarExposure: "partielle",
      politicalConstraints:
        "Missiles, sonars, liaisons et soutien logiciel restent à configurer client par client.",
    },
    sustainment: {
      sustainmentNotes:
        "MCO dominé par logiciel CMS, radar AESA fixe, sonar et stocks de missiles.",
      industrialRiskNotes:
        "Montée de cadence Lorient, cyber durci et intégration capteurs à surveiller.",
    },
  },
  keySpecs: [
    {
      label: "Déplacement",
      value: "≈ 4 500 t",
      confidence: "haute",
      sources: ["naval-fdi-trials"],
    },
    {
      label: "Longueur",
      value: "≈ 122 m",
      confidence: "haute",
      sources: ["naval-fdi-trials"],
    },
    {
      label: "Radar",
      value: "Sea Fire — radar AESA 4 faces",
      confidence: "haute",
      sources: ["thales-seafire"],
    },
    {
      label: "CMS",
      value: "SETIS",
      confidence: "haute",
      sources: ["naval-fdi-trials"],
    },
    {
      label: "ASM",
      value: "KingKlip + CAPTAS-4 Compact selon configuration",
      confidence: "moyenne",
      sources: ["thales-captas4-compact"],
    },
    {
      label: "Équipage",
      value: "≈ 125 marins + capacité passagers",
      confidence: "moyenne",
      sources: ["naval-fdi-trials"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "La FDI cherche un point d'équilibre : frégate de premier rang, mais plus compacte qu'une FREMM. Le coût se lit donc dans la densité d'intégration : radar AESA fixe, CMS, missiles, sonar, cyber et automatisation.\n\nSon intérêt Panoplie est le rapport entre format réduit, valeur capteurs et potentiel export.",
      indicators: [
        {
          label: "Format",
          value: "Frégate compacte de premier rang",
          confidence: "haute",
          sources: ["naval-fdi-trials"],
        },
        {
          label: "Coût caché",
          value: "Intégration capteurs / CMS / cyber et MCO logiciel",
          confidence: "moyenne",
          sources: ["naval-fdi-trials"],
        },
        {
          label: "Effet attendu",
          value: "Densité de capteurs élevée pour un tonnage contenu",
          confidence: "moyenne",
          sources: ["thales-seafire"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le programme FDI combine commande nationale et export. La France conserve une série de cinq frégates, tandis que la Grèce en a commandé pour sa marine.\n\nCette double logique est structurante : la cadence de Lorient et la crédibilité du standard français soutiennent l'export, mais l'export exige des configurations adaptées.",
      indicators: [
        {
          label: "Programme France",
          value: "Cinq FDI destinées à la Marine nationale",
          confidence: "haute",
          sources: ["dga-fdi-5"],
        },
        {
          label: "Export",
          value: "Frégates FDI HN pour la Grèce",
          confidence: "haute",
          sources: ["naval-fdi-greece"],
        },
        {
          label: "Site industriel",
          value: "Construction à Lorient",
          confidence: "haute",
          sources: ["naval-fdi-trials"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne FDI est fortement française : Naval Group pour la plateforme et SETIS, Thales pour Sea Fire et briques sonar, MBDA pour les effecteurs. Le risque se déplace vers le logiciel, les capteurs et la montée de cadence.\n\nLe Sea Fire est le marqueur de rang : radar fixe AESA, suivi multi-menaces et conduite de la défense aérienne.",
      indicators: [
        {
          label: "Sea Fire",
          value: "Radar AESA 4 faces de Thales",
          confidence: "haute",
          sources: ["thales-seafire"],
        },
        {
          label: "Système de combat",
          value: "SETIS intégré par Naval Group",
          confidence: "haute",
          sources: ["naval-fdi-trials"],
        },
        {
          label: "Sonar remorqué",
          value: "CAPTAS-4 Compact selon configuration",
          confidence: "moyenne",
          sources: ["thales-captas4-compact"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "La FDI sert à renouveler le rang français en frégates de combat tout en renforçant un axe export européen. La Grèce est le cas le plus lisible : acquisition de frégates modernes dans un environnement naval tendu en Méditerranée orientale.\n\nLe bâtiment devient donc un objet géopolitique : standard français, interopérabilité alliée, montée en capacité grecque et maintien de la base industrielle française.",
      indicators: [
        {
          label: "Rôle France",
          value: "Renouvellement de frégates de premier rang",
          confidence: "haute",
          sources: ["dga-fdi-5"],
        },
        {
          label: "Rôle Grèce",
          value: "Modernisation navale en Méditerranée orientale",
          confidence: "moyenne",
          sources: ["naval-fdi-greece"],
        },
        {
          label: "Interopérabilité",
          value: "Architecture apte aux opérations alliées et liaisons tactiques",
          confidence: "moyenne",
          sources: ["naval-fdi-trials"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "La FDI est conçue pour l'export sans être une corvette allégée : elle vend une frégate compacte mais hautement intégrée. L'enjeu export est donc la confiance dans le standard, le soutien et les effecteurs.\n\nLa Grèce valide la crédibilité du produit, mais chaque client arbitrera missiles, sonar, liaisons et souveraineté logicielle.",
      indicators: [
        {
          label: "Client export",
          value: "Grèce — FDI HN",
          confidence: "haute",
          sources: ["naval-fdi-greece"],
        },
        {
          label: "Atout",
          value: "Frégate compacte avec radar AESA fixe et CMS moderne",
          confidence: "haute",
          sources: ["thales-seafire"],
        },
        {
          label: "Point de vigilance",
          value: "Configuration client : missiles, sonar, liaisons et soutien",
          confidence: "moyenne",
          status: "variable",
          sources: ["naval-fdi-greece"],
        },
      ],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Très bon potentiel capteurs / tonnage, avec coût d'intégration élevé mais cohérent pour une frégate moderne.",
    },
    {
      key: "survivabilite",
      grade: "B",
      rationale:
        "Sea Fire, missiles et architecture numérique renforcent la défense ; le format compact impose des choix de charge utile.",
    },
    {
      key: "exportabilite",
      grade: "B",
      rationale:
        "Déjà exportée en Grèce ; attractivité forte si le client accepte le standard et le soutien associés.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Base française robuste, mais montée en cadence, logiciel et capteurs sont les points à suivre.",
    },
    {
      key: "maturite",
      grade: "B",
      rationale:
        "Tête de série livrée et programme actif ; maturité encore à consolider par la flotte.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "Architecture publique bien documentée ; détails de configuration et performances fines restent partiellement sensibles.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : la FDI est une frégate plus petite donc moins structurante. La réalité : elle concentre une architecture capteurs/CMS dense qui change son rang.",
    bestUseCase:
      "Frégate de premier rang compacte pour escorte, présence, défense aérienne locale et lutte ASM selon configuration.",
    weakPoint:
      "Le compromis de volume : tout dépend du standard, du nombre d'effecteurs et de la suite sonar réellement retenue.",
    analystNote:
      "La FDI est le type même de plateforme que Panoplie doit lire comme architecture de mission. Son tonnage compte moins que Sea Fire, SETIS, CAPTAS, Aster, Exocet et le soutien logiciel.",
  },
  operators: ["France — Marine nationale", "Grèce — Hellenic Navy"],
  theatres: ["Atlantique", "Méditerranée", "Mer Égée", "Océan Indien"],
  timeline: [
    {
      date: "2022",
      label: "Mise à flot de l'Amiral Ronarc'h à Lorient.",
      kind: "jalon",
    },
    {
      date: "2024",
      label: "Début des essais à la mer de la première FDI française.",
      kind: "jalon",
    },
    {
      date: "2025",
      label: "Livraison de la tête de série à la Marine nationale.",
      kind: "jalon",
    },
    {
      date: "2026",
      label: "La DGA commande la cinquième FDI destinée à la Marine nationale.",
      kind: "jalon",
    },
  ],
  sources: [
    {
      id: "naval-fdi-trials",
      title:
        "Naval Group starts sea trials of the French Navy's first FDI Amiral Ronarc'h",
      publisher: "Naval Group",
      type: "constructeur",
      reliability: "B",
      date: "2024",
      url: "https://www.naval-group.com/en/naval-group-starts-sea-trials-french-navys-first-defence-and-intervention-frigate-fdi-amiral-ronarch",
    },
    {
      id: "dga-fdi-5",
      title:
        "La DGA commande la cinquième frégate de défense et d'intervention destinée à la Marine nationale",
      publisher: "Direction générale de l'armement",
      type: "institution",
      reliability: "A",
      date: "2026",
      url: "https://www.defense.gouv.fr/dga/actualites/dga-commande-cinquieme-fregate-defense-dintervention-fdi-naval-group",
    },
    {
      id: "thales-seafire",
      title: "Sea Fire — fully digital multifunction radar",
      publisher: "Thales",
      type: "constructeur",
      reliability: "B",
      url: "https://www.thalesgroup.com/en/markets/defence-and-security/naval-forces/above-water-warfare/sea-fire",
    },
    {
      id: "thales-captas4-compact",
      title: "CAPTAS-4 Compact variable depth sonar",
      publisher: "Thales",
      type: "constructeur",
      reliability: "B",
      url: "https://www.thalesgroup.com/en/markets/defence-and-security/naval-forces/underwater-warfare/captas-4-compact",
    },
    {
      id: "naval-fdi-greece",
      title: "FDI HN frigates for the Hellenic Navy",
      publisher: "Naval Group",
      type: "constructeur",
      reliability: "B",
      url: "https://www.naval-group.com/en/naval-group-starts-construction-third-defense-and-intervention-frigate-fdi-hn-hellenic-navy",
    },
  ],
  updated: "2026-05-31",
};
