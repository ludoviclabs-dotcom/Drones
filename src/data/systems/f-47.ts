import type { DefenseSystem } from "../types";

export const f47: DefenseSystem = {
  slug: "f-47",
  name: "F-47",
  designation: "Boeing F-47 — programme NGAD",
  reference: "PNP-AC-013",
  category: "combat-aircraft",
  combatAircraftClass: "gen-6",
  classLabel: "Programme de domination aérienne — 6e génération",
  country: "États-Unis",
  flag: "🇺🇸",
  manufacturer: "Boeing",
  status: "Programme futur — contrat attribué en 2025, premier vol visé vers 2028",
  naval:
    "Non — programme de l'US Air Force ; l'US Navy conduit son propre programme de 6e génération (F/A-XX).",
  acquisitionModes: ["production-nationale"],
  tagline:
    "Le pari américain de 6e génération — successeur du F-22, conçu non comme un avion isolé mais comme une famille de systèmes.",
  summary:
    "Le F-47 est la plateforme habitée du programme américain Next Generation Air Dominance (NGAD). Boeing en a remporté le contrat de développement en mars 2025. C'est le premier chasseur de 6e génération américain : le successeur désigné du F-22 Raptor.\n\nPanoplie le classe à part. Une fiche de 6e génération ne s'évalue pas comme un avion en service : le F-47 n'a pas encore volé, son premier vol étant attendu vers 2028. Ce qu'on peut en dire tient au programme, non à l'appareil — un contrat, une ambition de portée et de furtivité supérieures à la 5e génération, et une logique nouvelle : le chasseur habité conçu pour opérer avec des drones de combat associés.",
  keySpecs: [
    {
      label: "Génération",
      value: "6e génération — programme futur",
      confidence: "haute",
      sources: ["usaf"],
    },
    {
      label: "Maître d'œuvre",
      value: "Boeing — contrat de développement attribué en mars 2025",
      confidence: "haute",
      sources: ["usaf"],
    },
    {
      label: "Rôle",
      value: "Successeur du F-22 Raptor — domination aérienne",
      confidence: "haute",
      sources: ["usaf"],
    },
    {
      label: "Premier vol visé",
      value: "Vers 2028 — fabrication du premier appareil engagée",
      confidence: "moyenne",
      sources: ["breaking-def"],
    },
    {
      label: "Parc envisagé",
      value: "Plus de 185 appareils annoncés par l'US Air Force",
      confidence: "moyenne",
      sources: ["usaf"],
    },
    {
      label: "Logique d'emploi",
      value: "Chasseur habité opérant avec des drones de combat associés (CCA)",
      confidence: "moyenne",
      sources: ["usaf"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le coût du F-47 est, à ce stade, un coût de programme : le contrat de développement attribué à Boeing dépasse vingt milliards de dollars. L'US Air Force affirme que l'appareil coûtera moins cher que le F-22 et sera acquis en plus grand nombre.\n\nC'est une intention, pas un résultat. Les coûts d'acquisition unitaire et de possession d'un chasseur de 6e génération ne seront connus qu'au fil du développement — Panoplie les traite comme non encore évaluables.",
      indicators: [
        {
          label: "Contrat de développement",
          value: "Plus de 20 Md$ attribués à Boeing",
          confidence: "haute",
          sources: ["usaf"],
        },
        {
          label: "Intention de coût",
          value: "Annoncé moins cher que le F-22, acquis en plus grand nombre",
          confidence: "moyenne",
          sources: ["usaf"],
        },
        {
          label: "Coût réel",
          value: "Non évaluable — programme au stade du développement",
          confidence: "faible",
          status: "a-recouper",
          sources: ["breaking-def"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le F-47 est financé par l'US Air Force. Au contrat de développement s'ajoutent des crédits d'accélération inscrits aux budgets récents, et une cible affichée de plus de cent quatre-vingt-cinq appareils — un volume comparable à la flotte de F-22 qu'il remplace.\n\nLe pari budgétaire est lourd et de long terme : développer, en parallèle, le chasseur habité et les drones de combat associés qui forment la famille de systèmes.",
      indicators: [
        {
          label: "Maître d'ouvrage",
          value: "US Air Force",
          confidence: "haute",
          sources: ["usaf"],
        },
        {
          label: "Cible de parc",
          value: "Plus de 185 appareils — remplacement du F-22",
          confidence: "moyenne",
          sources: ["usaf"],
        },
        {
          label: "Pari de long terme",
          value: "Financer chasseur habité et drones associés en parallèle",
          confidence: "moyenne",
          sources: ["breaking-def"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "Le F-47 est un enjeu industriel majeur pour Boeing : remporter le NGAD relance sa division chasseurs face à Lockheed Martin. La chaîne s'appuie sur des travaux de démonstrateurs antérieurs, qui ont permis d'engager rapidement la phase de développement.\n\nComme tout programme de pointe, le risque industriel est réel — technologies nouvelles, intégration de la famille de systèmes, calendrier ambitieux —, mais il s'agit d'un risque de développement, non d'une dépendance critique identifiée.",
      indicators: [
        {
          label: "Maître d'œuvre",
          value: "Boeing — relance de sa division chasseurs",
          confidence: "haute",
          sources: ["usaf"],
        },
        {
          label: "Socle technique",
          value: "Travaux de démonstrateurs antérieurs au contrat",
          confidence: "moyenne",
          sources: ["breaking-def"],
        },
        {
          label: "Nature du risque",
          value: "Risque de développement — technologies neuves, calendrier ambitieux",
          confidence: "moyenne",
          sources: ["breaking-def"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Le F-47 est conçu pour une fin précise : conserver à l'US Air Force la domination aérienne face à la montée en puissance chinoise, alors que la flotte de J-20 se compte désormais en centaines d'appareils.\n\nC'est l'actif de pointe de la prochaine décennie : une portée et une furtivité supérieures à la 5e génération, et une architecture nouvelle où le chasseur habité commande des drones de combat. Son rôle géopolitique se jouera dans l'Indo-Pacifique.",
      indicators: [
        {
          label: "Fonction stratégique",
          value: "Maintenir la domination aérienne américaine face à la Chine",
          confidence: "haute",
          sources: ["usaf"],
        },
        {
          label: "Logique de génération",
          value: "Famille de systèmes — chasseur habité et drones associés",
          confidence: "moyenne",
          sources: ["usaf"],
        },
        {
          label: "Théâtre visé",
          value: "Indo-Pacifique — compétition de domination aérienne",
          confidence: "moyenne",
          sources: ["breaking-def"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "L'export du F-47 n'est pas à l'ordre du jour. Comme le F-22 qu'il remplace, le F-47 est un actif de domination aérienne de pointe — la catégorie d'appareils que les États-Unis gardent, en règle générale, pour eux seuls.\n\nUne version export pourrait être envisagée plus tard, mais elle n'est ni annoncée ni acquise. À ce stade, l'exportabilité du F-47 est, par défaut, à considérer comme très restreinte.",
      indicators: [
        {
          label: "Statut export",
          value: "Non à l'ordre du jour — actif de domination aérienne de pointe",
          confidence: "moyenne",
          sources: ["usaf"],
        },
        {
          label: "Précédent",
          value: "Le F-22, qu'il remplace, n'a jamais été exporté",
          confidence: "haute",
          sources: ["breaking-def"],
        },
        {
          label: "Perspective",
          value: "Aucune version export annoncée à ce stade",
          confidence: "moyenne",
          sources: ["usaf"],
        },
      ],
    },
  ],
  variants: [
    {
      label: "F-47 — plateforme habitée",
      value:
        "Le chasseur de 6e génération proprement dit — pilote, cœur de la famille de systèmes.",
      confidence: "moyenne",
      sources: ["usaf"],
    },
    {
      label: "Drones de combat associés (CCA)",
      value:
        "Drones ailiers autonomes conçus pour opérer avec le F-47 — capteurs, frappe, leurre.",
      confidence: "moyenne",
      sources: ["usaf"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "D",
      rationale:
        "Évaluation indicative — programme futur : ni le coût, ni l'efficacité opérationnelle d'un appareil non encore volé ne sont mesurables.",
    },
    {
      key: "survivabilite",
      grade: "D",
      rationale:
        "Conçu pour une furtivité et une portée supérieures à la 5e génération, mais appareil non volé — note indicative, non démontrée.",
    },
    {
      key: "exportabilite",
      grade: "E",
      rationale:
        "Actif de domination aérienne de pointe ; comme le F-22, vraisemblablement non exportable — aucune version export annoncée.",
    },
    {
      key: "risque-industriel",
      grade: "D",
      rationale:
        "Contrat attribué et fabrication engagée, mais programme de 6e génération à fort risque de développement et de calendrier.",
    },
    {
      key: "maturite",
      grade: "D",
      rationale:
        "Programme futur — premier vol visé vers 2028, aucune capacité opérationnelle avant la fin de la décennie.",
    },
    {
      key: "confiance-donnees",
      grade: "C",
      rationale:
        "Programme officiellement documenté, mais l'essentiel des caractéristiques reste classifié ou non figé.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : le chasseur qui surclassera tout. La réalité : un programme de 6e génération au stade du développement — contrat attribué, premier vol visé vers 2028 — qu'il serait prématuré de comparer aux avions en service.",
    bestUseCase:
      "À terme, assurer la domination aérienne américaine face à la Chine — un chasseur habité de 6e génération commandant des drones de combat associés.",
    weakPoint:
      "Le statut : tout reste à démontrer. Calendrier, coût, performances — un programme futur porte par nature l'incertitude la plus forte du domaine.",
    analystNote:
      "Le F-47 ne se juge pas comme un avion mais comme un pari. Panoplie le classe en programme futur et lui attribue des paliers volontairement prudents : c'est l'honnêteté minimale face à un appareil qui n'a pas encore volé. La vraie information, ici, n'est pas une performance — c'est un contrat, un calendrier et une intention.",
  },
  operators: ["États-Unis (programme futur)"],
  theatres: ["États-Unis — développement"],
  timeline: [
    {
      date: "2020",
      label: "Premiers essais expérimentaux dans le cadre du programme NGAD.",
      kind: "jalon",
    },
    {
      date: "2025",
      label:
        "L'US Air Force attribue à Boeing le contrat de développement du F-47.",
      kind: "jalon",
    },
    {
      date: "2025",
      label: "Lancement de la fabrication du premier appareil.",
      kind: "jalon",
    },
    {
      date: "2028",
      label: "Premier vol visé.",
      kind: "jalon",
    },
  ],
  sources: [
    {
      id: "usaf",
      title: "Next Generation Air Dominance — plateforme F-47",
      publisher: "U.S. Air Force",
      type: "officiel",
      reliability: "A",
      url: "https://www.af.mil/",
    },
    {
      id: "boeing",
      title: "F-47 — programme de domination aérienne de nouvelle génération",
      publisher: "Boeing",
      type: "constructeur",
      reliability: "B",
      url: "https://www.boeing.com/defense",
    },
    {
      id: "breaking-def",
      title:
        "Next-gen air dominance: F-47 program status and accelerated pace",
      publisher: "Breaking Defense",
      type: "presse",
      reliability: "C",
      url: "https://breakingdefense.com/2025/12/next-gen-air-dominance-and-surprise-new-air-force-leadership-2025-review/",
    },
  ],
  updated: "2026-05-22",
};
