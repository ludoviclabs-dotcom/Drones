import type { DefenseSystem } from "../types";

export const f22Raptor: DefenseSystem = {
  slug: "f-22-raptor",
  name: "F-22 Raptor",
  designation: "F-22A",
  reference: "PNP-AC-003",
  category: "combat-aircraft",
  combatAircraftClass: "gen-5",
  classLabel: "Chasseur de supériorité aérienne",
  country: "États-Unis",
  flag: "🇺🇸",
  manufacturer: "Lockheed Martin · Boeing",
  introduced: "2005",
  status: "En service — flotte close d'environ 185 appareils, jamais exportée",
  naval: "Non — exclusivement US Air Force, aucune version embarquée.",
  acquisitionModes: ["production-nationale"],
  tagline:
    "L'étalon de la supériorité aérienne — furtivité et supercroisière, mais une flotte close, coûteuse et interdite d'export.",
  summary:
    "Le F-22 Raptor est le premier chasseur de 5e génération à être entré en service. Il combine furtivité conçue dès l'origine, supercroisière — vol supersonique soutenu sans postcombustion —, manœuvrabilité extrême et avionique intégrée. Pendant deux décennies, il a défini ce qu'est la supériorité aérienne.\n\nMais le Raptor est aussi un avertissement. La production a été arrêtée en 2011 après seulement quelque 187 exemplaires ; la flotte, close, vieillit. Interdit d'exportation par la loi américaine, il ne sera jamais vendu. Les États-Unis investissent désormais des milliards pour le maintenir pertinent jusqu'à l'arrivée du F-47 — un programme de 6e génération conçu, précisément, pour le remplacer.",
  keySpecs: [
    {
      label: "Équipage",
      value: "1",
      confidence: "haute",
      sources: ["usaf"],
    },
    {
      label: "Motorisation",
      value: "2 × Pratt & Whitney F119 — supercroisière",
      confidence: "haute",
      sources: ["usaf"],
    },
    {
      label: "Furtivité",
      value: "Très basse observabilité conçue dès l'origine",
      confidence: "haute",
      sources: ["usaf"],
    },
    {
      label: "Parc",
      value: "≈ 185 appareils — flotte close, production arrêtée en 2011",
      confidence: "haute",
      sources: ["af-mag"],
    },
    {
      label: "Modernisation",
      value: "Effort d'environ 9 Md$ — fiabilité, capteurs IRST, missile AIM-260",
      confidence: "moyenne",
      sources: ["af-mag"],
    },
    {
      label: "Export",
      value: "Aucun — interdit par la loi américaine",
      confidence: "haute",
      sources: ["crs"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le coût du F-22 se lit à rebours. La production, interrompue en 2011 bien avant la cible initiale, a réparti les coûts de développement sur un parc réduit — chaque appareil en a porté une part démesurée.\n\nAujourd'hui le coût est celui d'une flotte close à entretenir : pièces d'un avion qu'on ne fabrique plus, et un effort de modernisation de l'ordre de 9 milliards de dollars pour tenir jusqu'au F-47. Maintenir peu d'avions exquis coûte cher.",
      indicators: [
        {
          label: "Production",
          value: "Arrêtée en 2011 — environ 187 appareils construits",
          confidence: "haute",
          sources: ["af-mag"],
        },
        {
          label: "Coût de modernisation",
          value: "Effort d'environ 9 Md$ pour maintenir la flotte pertinente",
          confidence: "moyenne",
          sources: ["af-mag"],
        },
        {
          label: "Coût de flotte close",
          value: "Élevé — entretenir un avion qui n'est plus produit",
          confidence: "moyenne",
          sources: ["crs"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le F-22 est financé sur le seul budget de l'US Air Force. La ligne de production étant fermée, il n'y a plus de coût d'acquisition — mais un budget de modernisation et de soutien substantiel, étalé jusqu'à la fin de la décennie.\n\nLe calendrier de retrait, un temps fixé autour de 2030, a été repoussé : l'US Air Force a engagé des crédits pluriannuels pour prolonger le Raptor, le temps que le F-47 prenne le relais.",
      indicators: [
        {
          label: "Maître d'ouvrage",
          value: "US Air Force — budget fédéral américain",
          confidence: "haute",
          sources: ["usaf"],
        },
        {
          label: "Crédits de prolongation",
          value: "Plusieurs milliards engagés jusqu'à la fin de la décennie",
          confidence: "moyenne",
          sources: ["af-mag"],
        },
        {
          label: "Retrait",
          value: "Repoussé au-delà de 2030 — relais assuré par le F-47",
          confidence: "moyenne",
          sources: ["af-mag"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne du F-22 a été démantelée avec l'arrêt de la production en 2011. C'est le cœur de sa fragilité industrielle : obtenir des pièces pour un avion qu'on ne fabrique plus suppose de relancer, ponctuellement, des fournisseurs ou d'en re-qualifier.\n\nLockheed Martin et Boeing assurent le maintien et la modernisation, mais sur une base industrielle qui n'a plus la profondeur d'un programme actif.",
      indicators: [
        {
          label: "Maîtres d'œuvre",
          value: "Lockheed Martin · Boeing — maintien et modernisation",
          confidence: "haute",
          sources: ["usaf"],
        },
        {
          label: "Ligne de production",
          value: "Fermée depuis 2011 — pas de réouverture",
          confidence: "haute",
          sources: ["af-mag"],
        },
        {
          label: "Point dur",
          value: "Pièces et obsolescences d'une flotte qu'on ne produit plus",
          confidence: "moyenne",
          sources: ["crs"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Le F-22 est l'actif de supériorité aérienne le plus capable de l'arsenal américain — et un actif que les États-Unis ont choisi de garder pour eux seuls. Il n'a jamais été proposé, même aux alliés les plus proches.\n\nCette exclusivité, voulue par la loi, a privé Washington d'un instrument d'influence : faute de Raptor à offrir, les alliés se sont tournés vers le F-35. Le F-22 protège la suprématie technologique américaine ; il ne tisse aucune relation d'export.",
      indicators: [
        {
          label: "Fonction stratégique",
          value: "Actif de supériorité aérienne réservé aux États-Unis",
          confidence: "haute",
          sources: ["usaf"],
        },
        {
          label: "Doctrine d'accès",
          value: "Aucun partage, même avec les alliés les plus proches",
          confidence: "haute",
          sources: ["crs"],
        },
        {
          label: "Effet d'influence",
          value: "Nul à l'export — le F-35 a joué ce rôle à sa place",
          confidence: "moyenne",
          sources: ["af-mag"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "Le F-22 est le cas limite de l'exportabilité : un amendement du Congrès américain a interdit, dès l'origine, toute exportation du Raptor. La furtivité de pointe et l'avionique devaient rester strictement nationales.\n\nIl n'existe donc aucune version export, aucune perspective de cession. L'exportabilité du F-22 n'est pas faible — elle est nulle, par décision législative.",
      indicators: [
        {
          label: "Régime applicable",
          value: "Interdiction légale d'exportation (Congrès américain)",
          confidence: "haute",
          sources: ["crs"],
        },
        {
          label: "Version export",
          value: "Aucune — jamais conçue ni envisagée",
          confidence: "haute",
          sources: ["crs"],
        },
        {
          label: "Perspective",
          value: "Nulle — la flotte close ne sera jamais cédée",
          confidence: "haute",
          sources: ["af-mag"],
        },
      ],
    },
  ],
  variants: [
    {
      label: "F-22A",
      value: "Seule version opérationnelle — monoplace de supériorité aérienne.",
      confidence: "haute",
      sources: ["usaf"],
    },
    {
      label: "Programme « Viability »",
      value:
        "Paquet de modernisation — fiabilité (RAMP), capteurs IRST, missile AIM-260, pour tenir face aux menaces récentes.",
      confidence: "moyenne",
      sources: ["af-mag"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "C",
      rationale:
        "Performances de supériorité aérienne sans rival, mais portées par une flotte close, réduite et coûteuse à maintenir.",
    },
    {
      key: "survivabilite",
      grade: "A",
      rationale:
        "Furtivité native, supercroisière et manœuvrabilité : le Raptor reste une référence de survivabilité en combat aérien.",
    },
    {
      key: "exportabilite",
      grade: "E",
      rationale:
        "Exportation interdite par la loi américaine — aucune version export, aucune perspective de cession.",
    },
    {
      key: "risque-industriel",
      grade: "C",
      rationale:
        "Ligne de production fermée depuis 2011 : pièces et obsolescences d'une flotte qu'on ne fabrique plus.",
    },
    {
      key: "maturite",
      grade: "A",
      rationale:
        "Vingt ans de service, doctrine d'emploi éprouvée — une plateforme pleinement mûre, quoique vieillissante.",
    },
    {
      key: "confiance-donnees",
      grade: "A",
      rationale:
        "Programme très documenté par l'USAF et les rapports parlementaires américains ; seules les performances furtives restent classifiées.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : le meilleur chasseur de combat aérien du monde. La réalité : une flotte close d'environ 185 appareils vieillissants, jamais exportée, qu'un effort de 9 Md$ maintient pertinente en attendant le F-47.",
    bestUseCase:
      "La supériorité aérienne pure : pénétrer et dominer un espace aérien contesté, en tête d'un dispositif, là où la furtivité et la supercroisière font la différence.",
    weakPoint:
      "La rareté : une production arrêtée trop tôt, une flotte qu'on ne peut ni agrandir ni remplacer rapidement, et une base industrielle réduite.",
    analystNote:
      "Le F-22 est le contre-exemple instructif du programme exquis : un avion magnifique, construit en trop petit nombre, dont la ligne a été fermée. Sa leçon n'est pas technique mais industrielle — fabriquer le meilleur ne sert à rien si l'on ne peut ni le produire en nombre, ni le renouveler, ni le partager.",
  },
  operators: ["États-Unis"],
  theatres: ["Moyen-Orient — Syrie", "Indo-Pacifique — dissuasion"],
  timeline: [
    {
      date: "2005",
      label: "Entrée en service du F-22A dans l'US Air Force.",
      kind: "jalon",
    },
    {
      date: "2009",
      label: "L'achat est plafonné — la production s'arrêtera à environ 187 appareils.",
      kind: "debat",
    },
    {
      date: "2011",
      label: "Fermeture de la ligne de production du F-22.",
      kind: "jalon",
    },
    {
      date: "2014",
      label: "Premier emploi au combat du Raptor, au-dessus de la Syrie.",
      kind: "emploi",
    },
    {
      date: "2025",
      label:
        "Effort de modernisation d'environ 9 Md$ ; retrait repoussé au-delà de 2030.",
      kind: "jalon",
    },
  ],
  sources: [
    {
      id: "usaf",
      title: "F-22 Raptor — Fact Sheet",
      publisher: "U.S. Air Force",
      type: "officiel",
      reliability: "A",
      url: "https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104506/f-22-raptor/",
    },
    {
      id: "af-mag",
      title: "F-22 Raptor — modernisation et avenir de la flotte",
      publisher: "Air & Space Forces Magazine",
      type: "presse",
      reliability: "C",
      url: "https://www.airandspaceforces.com/weapons/f-22/",
    },
    {
      id: "crs",
      title: "Tactical Aircraft — programmes et contrôles d'exportation",
      publisher: "Congressional Research Service",
      type: "institution",
      reliability: "A",
      url: "https://www.congress.gov/crs-products",
    },
  ],
  updated: "2026-05-22",
};
