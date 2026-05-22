import type { DefenseSystem } from "../types";

export const mirage2000: DefenseSystem = {
  slug: "mirage-2000",
  name: "Mirage 2000",
  designation: "Mirage 2000-5 / 2000D",
  reference: "PNP-AC-002",
  category: "combat-aircraft",
  combatAircraftClass: "gen-4",
  classLabel: "Chasseur de 4e génération modernisé",
  country: "France",
  flag: "🇫🇷",
  manufacturer: "Dassault Aviation",
  introduced: "1984",
  status: "En service — flotte en réduction, retrait visé vers 2035, cessions à l'Ukraine",
  naval: "Non — aucune version embarquée.",
  acquisitionModes: ["production-nationale"],
  tagline:
    "L'héritage de la 4e génération française — encore pertinent par la modernisation, mais générationnellement dépassé.",
  summary:
    "Le Mirage 2000 de Dassault est l'avion qui a porté la chasse française pendant deux décennies, avant le Rafale. Aile delta, monoréacteur, il a existé en de nombreuses versions — intercepteur, pénétration, nucléaire, export. C'est un appareil de 4e génération, modernisé au fil du temps, mais sans l'architecture complète d'un 4.5.\n\nSa fiche est celle d'une seconde vie. La France retire progressivement ses Mirage 2000 au profit du Rafale, horizon 2035. Mais l'appareil connaît un regain d'actualité : cédé à l'Ukraine, le Mirage 2000-5F s'y révèle un intercepteur efficace contre les drones et les missiles de croisière. Une plateforme dépassée, mais loin d'être inutile.",
  keySpecs: [
    {
      label: "Équipage",
      value: "1 ou 2 selon la version",
      confidence: "haute",
      sources: ["dassault"],
    },
    {
      label: "Motorisation",
      value: "1 réacteur — monoréacteur à aile delta",
      confidence: "haute",
      sources: ["dassault"],
    },
    {
      label: "Versions principales",
      value: "Mirage 2000-5 (interception) · Mirage 2000D (frappe)",
      confidence: "haute",
      sources: ["min-armees"],
    },
    {
      label: "Flotte française",
      value: "En réduction — environ 26 Mirage 2000-5F en 2025",
      confidence: "moyenne",
      sources: ["opex360"],
    },
    {
      label: "Retrait visé",
      value: "Vers 2035 — relais assuré par le Rafale",
      confidence: "moyenne",
      sources: ["min-armees"],
    },
    {
      label: "Emploi récent notable",
      value: "Mirage 2000-5F cédés à l'Ukraine",
      confidence: "haute",
      sources: ["air-cosmos"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le Mirage 2000 a, sur le tard, un atout de coût : c'est un appareil amorti, dont la cellule et l'emploi sont parfaitement connus. Face à des chasseurs de génération récente, il est peu coûteux à mettre en œuvre.\n\nMais ce coût bas se paie en capacité : le Mirage 2000 ne reçoit plus de modernisation majeure, et son maintien en condition devient celui d'une flotte vieillissante, dont les pièces se raréfient.",
      indicators: [
        {
          label: "Coût d'emploi",
          value: "Bas — appareil amorti, cellule éprouvée",
          confidence: "moyenne",
          sources: ["min-armees"],
        },
        {
          label: "Modernisation",
          value: "Arrêtée — pas de standard majeur nouveau",
          confidence: "moyenne",
          sources: ["min-armees"],
        },
        {
          label: "Maintien en condition",
          value: "Celui d'une flotte vieillissante — pièces qui se raréfient",
          confidence: "moyenne",
          sources: ["opex360"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le Mirage 2000 a été développé sur fonds français. Aujourd'hui, il ne fait plus l'objet d'investissement de modernisation : la France finance son retrait progressif et le remplacement par le Rafale.\n\nLes cessions de Mirage 2000-5F à l'Ukraine, à partir de 2025, ont accéléré la décrue de la flotte française — un transfert davantage politique que budgétaire.",
      indicators: [
        {
          label: "Investissement",
          value: "Plus de modernisation majeure — financement du retrait",
          confidence: "moyenne",
          sources: ["min-armees"],
        },
        {
          label: "Cessions Ukraine",
          value: "Quelques Mirage 2000-5F transférés à partir de 2025",
          confidence: "haute",
          sources: ["air-cosmos"],
        },
        {
          label: "Effet sur la flotte",
          value: "Décrue accélérée du parc français",
          confidence: "moyenne",
          sources: ["opex360"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne du Mirage 2000 est française — Dassault, Thales, Safran — mais c'est une chaîne en extinction. La production a cessé depuis longtemps ; il s'agit de soutenir un parc, non de le fabriquer.\n\nL'enjeu industriel est la disponibilité des pièces et la gestion des obsolescences d'un appareil dont les fournisseurs se sont, pour beaucoup, tournés vers le Rafale.",
      indicators: [
        {
          label: "Maître d'œuvre",
          value: "Dassault Aviation — soutien d'une flotte existante",
          confidence: "haute",
          sources: ["dassault"],
        },
        {
          label: "Production",
          value: "Arrêtée — appareil hérité, non fabriqué",
          confidence: "haute",
          sources: ["dassault"],
        },
        {
          label: "Enjeu",
          value: "Pièces et obsolescences d'une flotte en fin de vie",
          confidence: "moyenne",
          sources: ["opex360"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Le Mirage 2000 a longtemps été un instrument de l'influence française : exporté vers l'Inde, les Émirats, la Grèce, l'Égypte, Taïwan, il a tissé des relations durables.\n\nSa cession à l'Ukraine lui donne un dernier rôle stratégique. Le Mirage 2000-5F y intercepte drones et missiles de croisière russes — la démonstration qu'une plateforme dépassée peut rester décisive contre une menace de saturation.",
      indicators: [
        {
          label: "Héritage d'influence",
          value: "Exporté vers l'Inde, les Émirats, la Grèce, l'Égypte, Taïwan",
          confidence: "haute",
          sources: ["dassault"],
        },
        {
          label: "Rôle en Ukraine",
          value: "Interception de drones et de missiles de croisière",
          confidence: "moyenne",
          sources: ["opex360"],
        },
        {
          label: "Enseignement",
          value: "Une plateforme dépassée peut rester utile face à la saturation",
          confidence: "moyenne",
          sources: ["opex360"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "Le Mirage 2000 a connu un large succès export, avec des versions dédiées — dont le Mirage 2000-9 livré aux Émirats arabes unis. Il n'est plus produit, mais il alimente désormais un marché de seconde main.\n\nLes cessions de cellules d'occasion — vers l'Ukraine, ou entre opérateurs — prolongent la vie de l'appareil. Son exportabilité résiduelle est celle d'un avion mature, sans contrainte technologique majeure.",
      indicators: [
        {
          label: "Export historique",
          value: "Plusieurs versions exportées, dont le Mirage 2000-9 (Émirats)",
          confidence: "haute",
          sources: ["dassault"],
        },
        {
          label: "Marché de seconde main",
          value: "Cessions de cellules d'occasion entre opérateurs",
          confidence: "moyenne",
          sources: ["air-cosmos"],
        },
        {
          label: "Contrainte",
          value: "Faible — appareil mature, sans verrou technologique majeur",
          confidence: "moyenne",
          sources: ["dassault"],
        },
      ],
    },
  ],
  variants: [
    {
      label: "Mirage 2000C / B",
      value: "Intercepteur monoplace initial et sa version biplace.",
      confidence: "haute",
      sources: ["dassault"],
    },
    {
      label: "Mirage 2000D",
      value:
        "Version de pénétration et de frappe, biplace — rénovée et maintenue en service côté français.",
      confidence: "haute",
      sources: ["min-armees"],
    },
    {
      label: "Mirage 2000-5",
      value:
        "Intercepteur modernisé — radar et armement air-air améliorés ; version cédée à l'Ukraine.",
      confidence: "haute",
      sources: ["min-armees"],
    },
    {
      label: "Mirage 2000-9",
      value: "Version d'exportation multirôle — livrée aux Émirats arabes unis.",
      confidence: "moyenne",
      sources: ["dassault"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "C",
      rationale:
        "Appareil amorti et peu coûteux à l'emploi, mais générationnellement dépassé et sans modernisation majeure à venir.",
    },
    {
      key: "survivabilite",
      grade: "C",
      rationale:
        "Cellule de 4e génération non furtive ; sa survie en environnement contesté repose sur la tactique et reste limitée.",
    },
    {
      key: "exportabilite",
      grade: "B",
      rationale:
        "Large export historique, et un marché de seconde main encore actif — sans verrou technologique majeur.",
    },
    {
      key: "risque-industriel",
      grade: "A",
      rationale:
        "Chaîne française, appareil mature et parfaitement connu ; aucun risque de développement — seulement la gestion d'une fin de vie.",
    },
    {
      key: "maturite",
      grade: "A",
      rationale:
        "Plus de quarante ans de service, emploi opérationnel éprouvé sur de nombreux théâtres.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "Programme ancien et très documenté ; les effectifs exacts de la flotte évoluent au gré des cessions.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un chasseur encore moderne. La réalité : un excellent appareil de 4e génération, modernisé mais dépassé, que la France retire — et qui trouve en Ukraine une seconde vie inattendue.",
    bestUseCase:
      "L'interception et la défense aérienne dans un environnement peu contesté — et, comme le montre l'Ukraine, un intercepteur économique efficace contre drones et missiles de croisière.",
    weakPoint:
      "La génération : 4e génération sans architecture 4.5 complète, sans furtivité, en fin de carrière — il ne pénètre pas une défense aérienne moderne.",
    analystNote:
      "Le Mirage 2000 est le dossier de la seconde vie : une plateforme que la France juge dépassée trouve, contre la menace de saturation en Ukraine, une pertinence renouvelée. La leçon est que la valeur d'un avion ne se lit pas seulement à sa génération, mais à l'adéquation entre ce qu'il sait faire et la menace du moment.",
  },
  operators: [
    "France",
    "Émirats arabes unis",
    "Inde",
    "Grèce",
    "Égypte",
    "Taïwan",
    "Ukraine (cessions)",
  ],
  theatres: ["Libye", "Sahel", "Ukraine"],
  timeline: [
    {
      date: "1984",
      label: "Entrée en service du Mirage 2000 dans l'armée de l'air française.",
      kind: "jalon",
    },
    {
      date: "2011",
      label: "Emploi au combat au-dessus de la Libye.",
      kind: "emploi",
    },
    {
      date: "2025",
      label: "Premières cessions de Mirage 2000-5F à l'Ukraine.",
      kind: "export",
    },
    {
      date: "2025",
      label:
        "Le Mirage 2000-5F s'illustre en Ukraine contre drones et missiles de croisière.",
      kind: "emploi",
    },
  ],
  sources: [
    {
      id: "dassault",
      title: "Mirage 2000 — héritage et versions",
      publisher: "Dassault Aviation",
      type: "constructeur",
      reliability: "B",
      url: "https://www.dassault-aviation.com/fr/defense/mirage-2000/",
    },
    {
      id: "min-armees",
      title: "Le Mirage 2000 dans l'armée de l'air et de l'espace",
      publisher: "Ministère des Armées",
      type: "officiel",
      reliability: "A",
      url: "https://www.defense.gouv.fr/air",
    },
    {
      id: "opex360",
      title: "Le Mirage 2000-5 face aux drones et missiles russes en Ukraine",
      publisher: "Zone Militaire (Opex360)",
      type: "presse",
      reliability: "C",
      url: "https://www.opex360.com/2025/11/27/en-ukraine-le-mirage-2000-5-fait-quasiment-mouche-a-tous-les-coups-contre-les-drones-et-les-missiles-russes/",
    },
    {
      id: "air-cosmos",
      title: "L'armée de l'air et de l'espace cède des Mirage 2000-5 à l'Ukraine",
      publisher: "Air & Cosmos",
      type: "presse",
      reliability: "C",
      url: "https://air-cosmos.com/article/l-armee-de-l-air-et-de-l-espace-cede-deux-mirage-2000-5-a-l-ukraine-70997",
    },
  ],
  updated: "2026-05-22",
};
