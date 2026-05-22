import type { DefenseSystem } from "../types";

export const j35: DefenseSystem = {
  slug: "j-35",
  name: "J-35",
  designation: "Shenyang FC-31 / J-35 / J-35A",
  reference: "PNP-AC-011",
  category: "combat-aircraft",
  combatAircraftClass: "gen-5",
  claimedGeneration:
    "5e génération — parité avec le F-35 revendiquée, non confirmée",
  classLabel: "Chasseur furtif moyen",
  country: "Chine",
  flag: "🇨🇳",
  manufacturer: "Shenyang Aircraft Corporation (AVIC)",
  introduced: "2025",
  status: "Entrée en service — variante navale et variante terrestre J-35A",
  naval:
    "Oui — J-35 navalisé, catapultage CATOBAR sur le porte-avions Fujian ; variante terrestre J-35A pour l'armée de l'air.",
  acquisitionModes: ["production-nationale"],
  tagline:
    "Le chasseur furtif moyen chinois — naval et terrestre, émergent, et premier appareil furtif catapulté d'un porte-avions.",
  summary:
    "Le J-35 de Shenyang est le second chasseur furtif chinois, plus léger que le J-20 : un appareil moyen, décliné en version navale — le J-35 proprement dit — et en version terrestre, le J-35A. Issu de la lignée du démonstrateur FC-31, il est entré en service en 2025.\n\nDeux faits le distinguent. Il est le premier chasseur de 5e génération au monde à être catapulté et récupéré sur un porte-avions au moyen d'une catapulte électromagnétique, à bord du Fujian. Et il porte une ambition d'exportation, à travers une variante dédiée. Sa fiche appelle la même prudence que celle du J-20 : on documente l'existence et la trajectoire, on s'abstient des chiffres de performance que les sources ouvertes ne soutiennent pas.",
  keySpecs: [
    {
      label: "Équipage",
      value: "1",
      confidence: "moyenne",
      sources: ["dod-china"],
    },
    {
      label: "Furtivité",
      value: "Conçue dès l'origine — chasseur furtif moyen",
      confidence: "moyenne",
      sources: ["twz"],
    },
    {
      label: "Versions",
      value: "J-35 naval · J-35A terrestre · J-35AE export",
      confidence: "moyenne",
      sources: ["dod-china", "army-recognition"],
    },
    {
      label: "Fait marquant",
      value: "Premier chasseur de 5e génération catapulté d'un porte-avions",
      confidence: "moyenne",
      sources: ["twz"],
    },
    {
      label: "Production",
      value: "Production de série lancée — quelques dizaines de cellules en 2025-2026",
      confidence: "faible",
      status: "a-recouper",
      sources: ["army-recognition"],
    },
    {
      label: "Positionnement",
      value: "Chasseur moyen complétant le J-20, plus lourd",
      confidence: "moyenne",
      sources: ["dod-china"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Comme pour le J-20, le coût du J-35 échappe à l'analyse open source : la Chine n'en publie aucun élément vérifiable.\n\nL'intention lisible est celle d'un appareil moins coûteux que le J-20 — un chasseur furtif moyen, produit en série, destiné à équiper en nombre l'aéronavale et l'armée de l'air, et à être proposé à l'export. C'est un positionnement de coût, à défaut d'un chiffre de coût.",
      indicators: [
        {
          label: "Coûts publiés",
          value: "Aucun chiffre vérifiable",
          confidence: "faible",
          status: "a-recouper",
          sources: ["dod-china"],
        },
        {
          label: "Positionnement",
          value: "Furtif moyen — moins coûteux que le J-20, produit en nombre",
          confidence: "moyenne",
          sources: ["dod-china"],
        },
        {
          label: "Ambition",
          value: "Équiper en série et viser le marché export",
          confidence: "moyenne",
          sources: ["army-recognition"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le J-35 est financé par l'État chinois, pour deux clients internes — la marine et l'armée de l'air — et un objectif d'exportation.\n\nLe lancement de la production de série, confirmé par l'imagerie d'usine, traduit un engagement financier soutenu. La déclinaison d'une variante d'exportation, le J-35AE, indique que Pékin entend aussi en faire un produit de marché.",
      indicators: [
        {
          label: "Maître d'ouvrage",
          value: "État chinois — marine et armée de l'air",
          confidence: "haute",
          sources: ["dod-china"],
        },
        {
          label: "Stade",
          value: "Production de série lancée chez Shenyang",
          confidence: "moyenne",
          sources: ["army-recognition"],
        },
        {
          label: "Volet export",
          value: "Variante J-35AE dédiée au marché extérieur",
          confidence: "moyenne",
          sources: ["army-recognition"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne du J-35 est chinoise : Shenyang Aircraft Corporation, au sein du groupe AVIC, en assure conception et production. L'objectif de souveraineté industrielle est le même que pour le J-20.\n\nComme pour tout programme furtif chinois récent, la maturité réelle de certains maillons — motorisation, capteurs — reste difficile à établir depuis l'extérieur. C'est un point que Panoplie signale plutôt qu'il ne tranche.",
      indicators: [
        {
          label: "Maître d'œuvre",
          value: "Shenyang Aircraft Corporation — groupe AVIC",
          confidence: "haute",
          sources: ["dod-china"],
        },
        {
          label: "Objectif",
          value: "Chaîne souveraine chinoise — conception et production",
          confidence: "moyenne",
          sources: ["dod-china"],
        },
        {
          label: "Maturité des maillons",
          value: "Motorisation et capteurs — difficiles à établir en source ouverte",
          confidence: "faible",
          status: "a-recouper",
          sources: ["twz"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Le J-35 prolonge la montée en puissance aérienne chinoise sur un terrain nouveau : la mer. Sa certification pour le catapultage électromagnétique depuis le porte-avions Fujian donne à la marine chinoise un chasseur furtif embarqué — une capacité que, jusque-là, seuls les États-Unis détenaient.\n\nCombiné au J-20 terrestre, il dessine une aviation de combat chinoise de 5e génération à deux étages, lourd et moyen — et, avec le J-35AE, une offre furtive à l'export que peu de pays peuvent formuler.",
      indicators: [
        {
          label: "Apport stratégique",
          value: "Un chasseur furtif embarqué pour la marine chinoise",
          confidence: "moyenne",
          sources: ["twz"],
        },
        {
          label: "Architecture d'ensemble",
          value: "5e génération chinoise à deux étages — J-20 lourd, J-35 moyen",
          confidence: "moyenne",
          sources: ["dod-china"],
        },
        {
          label: "Effet de marché",
          value: "Une offre furtive chinoise à l'export, rare sur le marché",
          confidence: "moyenne",
          sources: ["army-recognition"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "Contrairement au J-20, le J-35 est conçu pour s'exporter : une variante dédiée, le J-35AE, a été dévoilée, et un premier client potentiel — le Pakistan — a manifesté son intérêt pour plusieurs dizaines d'appareils.\n\nSi cet intérêt se concrétisait, le J-35 deviendrait le premier chasseur furtif chinois exporté — une percée sur un marché jusqu'ici fermé aux non-Occidentaux. À ce stade, l'export reste une perspective, non un contrat confirmé.",
      indicators: [
        {
          label: "Variante export",
          value: "J-35AE — dérivée de la version terrestre J-35A",
          confidence: "moyenne",
          sources: ["army-recognition"],
        },
        {
          label: "Premier prospect",
          value: "Pakistan — intérêt pour plusieurs dizaines d'appareils",
          confidence: "faible",
          status: "a-recouper",
          sources: ["army-recognition"],
        },
        {
          label: "Statut",
          value: "Perspective d'export — pas de contrat ferme confirmé",
          confidence: "moyenne",
          sources: ["army-recognition"],
        },
      ],
    },
  ],
  variants: [
    {
      label: "J-35",
      value:
        "Version navale — catapultage CATOBAR, train et structure renforcés pour le porte-avions.",
      confidence: "moyenne",
      sources: ["twz"],
    },
    {
      label: "J-35A",
      value:
        "Version terrestre — entrée en service dans l'armée de l'air chinoise.",
      confidence: "moyenne",
      sources: ["dod-china"],
    },
    {
      label: "J-35AE",
      value:
        "Variante d'exportation dévoilée — dérivée de la version terrestre.",
      confidence: "faible",
      status: "a-recouper",
      sources: ["army-recognition"],
    },
    {
      label: "Lignée FC-31",
      value:
        "Le J-35 descend du démonstrateur Shenyang FC-31 des années 2010.",
      confidence: "moyenne",
      sources: ["dod-china"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Furtif moyen pensé pour la production de série et l'export ; le rapport effet/coût réel n'est pas évaluable faute de données ouvertes.",
    },
    {
      key: "survivabilite",
      grade: "B",
      rationale:
        "Furtivité conçue dès l'origine ; les performances réelles, non publiées, imposent une évaluation prudente.",
    },
    {
      key: "exportabilite",
      grade: "C",
      rationale:
        "Une variante d'export existe et un premier prospect s'est manifesté, mais aucun contrat ferme n'est confirmé à ce stade.",
    },
    {
      key: "risque-industriel",
      grade: "C",
      rationale:
        "Production de série lancée sur une chaîne souveraine ; la maturité de la motorisation et des capteurs reste mal documentée.",
    },
    {
      key: "maturite",
      grade: "C",
      rationale:
        "Entrée en service récente (2025), parc encore réduit — une plateforme émergente, pas encore éprouvée dans la durée.",
    },
    {
      key: "confiance-donnees",
      grade: "C",
      rationale:
        "Données ouvertes rares et peu vérifiables ; l'équivalence revendiquée avec le F-35 n'est pas confirmée.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un F-35 chinois aux capacités équivalentes. La réalité : un chasseur furtif moyen réel, émergent, dont l'entrée en service est récente et dont la parité revendiquée avec le F-35 n'est étayée par aucune source vérifiable.",
    bestUseCase:
      "Doter la Chine d'un chasseur furtif embarqué et d'un complément moyen au J-20 — et offrir, via le J-35AE, une option furtive à l'export.",
    weakPoint:
      "La jeunesse du programme et l'opacité des données : entrée en service récente, parc réduit, et performances que les sources ouvertes ne permettent pas de valider.",
    analystNote:
      "Le J-35 marque un seuil : le premier chasseur furtif catapulté d'un porte-avions, et la première offre furtive chinoise à l'export. Mais « émergent » n'est pas « éprouvé » — et Panoplie maintient une confiance des données basse tant que le programme n'a pas livré de bilan vérifiable.",
  },
  operators: ["Chine"],
  theatres: ["Mer de Chine — aéronavale", "Détroit de Taïwan"],
  timeline: [
    {
      date: "2024",
      label: "Présentation publique du J-35A au salon de Zhuhai.",
      kind: "jalon",
    },
    {
      date: "2025",
      label:
        "Certification du J-35 pour le catapultage électromagnétique sur le porte-avions Fujian.",
      kind: "jalon",
    },
    {
      date: "2025",
      label: "Entrée en service du J-35A dans l'armée de l'air chinoise.",
      kind: "jalon",
    },
    {
      date: "2026",
      label: "Dévoilement de la variante d'exportation J-35AE.",
      kind: "export",
    },
  ],
  sources: [
    {
      id: "dod-china",
      title: "Military and Security Developments Involving the PRC",
      publisher: "U.S. Department of Defense",
      type: "officiel",
      reliability: "A",
      url: "https://www.defense.gov/News/Releases/",
    },
    {
      id: "twz",
      title: "China's J-35 Naval Stealth Fighter Looks Set For Service",
      publisher: "The War Zone",
      type: "presse",
      reliability: "C",
      url: "https://www.twz.com/air/chinas-j-35-naval-stealth-fighter-looks-set-for-service",
    },
    {
      id: "army-recognition",
      title:
        "China launches serial production of the J-35 stealth fighter",
      publisher: "Army Recognition",
      type: "presse",
      reliability: "C",
      url: "https://www.armyrecognition.com/news/aerospace-news/2025/china-officially-launches-serial-production-of-j-35-stealth-fighter-to-challenge-us-air-superiority",
    },
  ],
  updated: "2026-05-22",
};
