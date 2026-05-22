import type { DefenseSystem } from "../types";

export const j20: DefenseSystem = {
  slug: "j-20",
  name: "J-20",
  designation: "Chengdu J-20 « Mighty Dragon »",
  reference: "PNP-AC-010",
  category: "combat-aircraft",
  combatAircraftClass: "gen-5",
  classLabel: "Chasseur furtif lourd",
  country: "Chine",
  flag: "🇨🇳",
  manufacturer: "Chengdu Aircraft Industry (AVIC)",
  introduced: "2017",
  status: "En service — flotte de plus de 300 appareils, production à cadence élevée",
  naval:
    "Non — appareil basé à terre ; la 5e génération navale chinoise est le J-35.",
  acquisitionModes: ["production-nationale"],
  tagline:
    "Le chasseur furtif lourd chinois — une capacité structurante de l'Indo-Pacifique, mais aux données ouvertes volontairement limitées.",
  summary:
    "Le J-20 « Mighty Dragon » de Chengdu est le premier chasseur furtif chinois entré en service. Appareil lourd de 5e génération, conçu pour la supériorité aérienne à longue portée, il est aujourd'hui produit en grande série : la flotte dépasse les trois cents appareils et la cadence reste élevée.\n\nSa fiche appelle une prudence particulière. Le J-20 est une capacité réelle et structurante — il faut le dire sans le minorer. Mais les données ouvertes — surface équivalente radar, portée des capteurs, performances de la motorisation — restent rares et peu vérifiables. Panoplie en abaisse en conséquence le niveau de confiance : on documente l'existence et l'échelle, on s'abstient des chiffres que les sources ne soutiennent pas.",
  keySpecs: [
    {
      label: "Équipage",
      value: "1 ; variante biplace J-20S en service",
      confidence: "moyenne",
      sources: ["dod-china"],
    },
    {
      label: "Furtivité",
      value: "Conçue dès l'origine — armement en soute interne",
      confidence: "moyenne",
      sources: ["iiss"],
    },
    {
      label: "Rôle",
      value: "Supériorité aérienne furtive à longue portée",
      confidence: "moyenne",
      sources: ["dod-china"],
    },
    {
      label: "Flotte",
      value: "Plus de 300 appareils — production estimée à 100-120 par an",
      confidence: "moyenne",
      sources: ["dod-china", "usni"],
    },
    {
      label: "Motorisation",
      value: "Réacteurs chinois — historiquement le point faible du programme",
      confidence: "faible",
      status: "a-recouper",
      sources: ["iiss"],
    },
    {
      label: "Export",
      value: "Aucun — appareil réservé à l'armée de l'air chinoise",
      confidence: "haute",
      sources: ["dod-china"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le coût du J-20 est, pour l'analyse open source, largement opaque. La Chine ne publie ni prix unitaire, ni coût de programme, ni coût de possession dans un format vérifiable.\n\nCe que les sources permettent d'affirmer, c'est l'échelle : une production de masse, de l'ordre d'une centaine d'appareils par an, suppose une base industrielle dimensionnée et un investissement soutenu de l'État chinois.",
      indicators: [
        {
          label: "Coûts publiés",
          value: "Aucun chiffre vérifiable — données non communiquées",
          confidence: "faible",
          status: "a-recouper",
          sources: ["usni"],
        },
        {
          label: "Indice d'échelle",
          value: "Production de masse — base industrielle dimensionnée",
          confidence: "moyenne",
          sources: ["dod-china"],
        },
        {
          label: "Lecture prudente",
          value: "On documente l'ampleur, pas un coût qu'aucune source ne soutient",
          confidence: "moyenne",
          sources: ["iiss"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le J-20 est financé par l'État chinois, sur un budget de défense dont la part consacrée à l'aviation de combat n'est pas détaillée publiquement.\n\nLe signal financier lisible est la cadence : produire le J-20 en grande série, et lancer en parallèle la variante biplace J-20S, traduit une priorité budgétaire forte et durable accordée à la 5e génération.",
      indicators: [
        {
          label: "Maître d'ouvrage",
          value: "État chinois — armée de l'air (PLAAF)",
          confidence: "haute",
          sources: ["dod-china"],
        },
        {
          label: "Détail budgétaire",
          value: "Non communiqué — part aviation non détaillée",
          confidence: "faible",
          status: "a-recouper",
          sources: ["usni"],
        },
        {
          label: "Signal lisible",
          value: "Cadence élevée et variante J-20S — priorité durable",
          confidence: "moyenne",
          sources: ["dod-china"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne du J-20 est chinoise et souveraine : Chengdu et le groupe AVIC en assurent la conception et la production. C'est précisément l'objectif du programme — affranchir la Chine de toute dépendance étrangère pour son chasseur de pointe.\n\nLe maillon longtemps faible a été la motorisation : les premiers J-20 dépendaient de réacteurs d'origine russe, avant une montée en gamme des moteurs chinois. L'état exact de cette transition reste difficile à établir à partir de sources ouvertes.",
      indicators: [
        {
          label: "Maître d'œuvre",
          value: "Chengdu Aircraft Industry — groupe AVIC",
          confidence: "haute",
          sources: ["dod-china"],
        },
        {
          label: "Objectif",
          value: "Souveraineté industrielle complète sur le chasseur de pointe",
          confidence: "moyenne",
          sources: ["iiss"],
        },
        {
          label: "Maillon sensible",
          value: "Motorisation — transition vers les moteurs chinois mal documentée",
          confidence: "faible",
          status: "a-recouper",
          sources: ["iiss"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Le J-20 est une capacité structurante de la puissance aérienne chinoise. Déployé face au détroit de Taïwan et en mer de Chine orientale, il conteste directement la supériorité aérienne dont les États-Unis et leurs alliés disposaient dans la région.\n\nSa montée en nombre — la flotte pourrait approcher le millier d'appareils d'ici la fin de la décennie selon plusieurs estimations — change l'équation de l'Indo-Pacifique : la 5e génération n'y est plus un monopole occidental.",
      indicators: [
        {
          label: "Fonction stratégique",
          value: "Contester la supériorité aérienne occidentale en Indo-Pacifique",
          confidence: "haute",
          sources: ["dod-china"],
        },
        {
          label: "Zones d'emploi",
          value: "Détroit de Taïwan, mer de Chine orientale",
          confidence: "moyenne",
          sources: ["usni"],
        },
        {
          label: "Trajectoire",
          value: "Montée en nombre rapide — vers un parc de grande ampleur",
          confidence: "moyenne",
          sources: ["dod-china"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "Le J-20 n'est pas exporté. La Chine le réserve à son armée de l'air, comme les États-Unis l'ont fait du F-22 : un appareil de pointe que l'on garde pour soi.\n\nLes clients étrangers cherchant un chasseur furtif chinois sont orientés vers d'autres plateformes — la famille J-35 notamment. L'exportabilité du J-20 est nulle, par choix stratégique.",
      indicators: [
        {
          label: "Statut export",
          value: "Aucun — réservé à l'armée de l'air chinoise",
          confidence: "haute",
          sources: ["dod-china"],
        },
        {
          label: "Doctrine d'accès",
          value: "Appareil de pointe gardé national, comme le F-22 américain",
          confidence: "moyenne",
          sources: ["iiss"],
        },
        {
          label: "Alternative export",
          value: "L'offre furtive chinoise à l'export passe par la famille J-35",
          confidence: "moyenne",
          sources: ["usni"],
        },
      ],
    },
  ],
  variants: [
    {
      label: "J-20",
      value: "Version initiale monoplace — chasseur furtif de supériorité aérienne.",
      confidence: "moyenne",
      sources: ["dod-china"],
    },
    {
      label: "J-20A",
      value: "Variante améliorée — évolutions de motorisation et de capteurs rapportées.",
      confidence: "faible",
      status: "a-recouper",
      sources: ["iiss"],
    },
    {
      label: "J-20S",
      value:
        "Variante biplace entrée en service — premier chasseur furtif biplace opérationnel.",
      confidence: "moyenne",
      sources: ["usni"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Capacité furtive réelle produite à grande échelle ; le rapport effet/coût ne peut être évalué finement faute de données ouvertes fiables.",
    },
    {
      key: "survivabilite",
      grade: "B",
      rationale:
        "Furtivité conçue dès l'origine et armement interne ; les performances réelles, classifiées, imposent une évaluation prudente.",
    },
    {
      key: "exportabilite",
      grade: "E",
      rationale:
        "Non exporté et non destiné à l'être — la Chine réserve son chasseur de pointe à son armée de l'air.",
    },
    {
      key: "risque-industriel",
      grade: "C",
      rationale:
        "Chaîne souveraine et cadence élevée, mais la motorisation a longtemps été un point faible et reste mal documentée.",
    },
    {
      key: "maturite",
      grade: "A",
      rationale:
        "En service depuis 2017, produit en masse, désormais décliné en variante biplace — une plateforme pleinement entrée en service.",
    },
    {
      key: "confiance-donnees",
      grade: "C",
      rationale:
        "Données ouvertes rares et peu vérifiables ; Panoplie documente l'existence et l'échelle, sans valider les chiffres de performance.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : on connaîtrait précisément les performances du J-20. La réalité : un chasseur furtif réel et produit en masse, mais dont les données ouvertes — signature radar, portée, motorisation — restent rares et peu vérifiables.",
    bestUseCase:
      "La supériorité aérienne furtive à longue portée en Indo-Pacifique — l'actif qui conteste la domination occidentale de la 5e génération dans la région.",
    weakPoint:
      "Pour l'analyste, l'opacité des données ; pour le programme, une motorisation longtemps en retard sur l'ambition de la cellule.",
    analystNote:
      "Le J-20 oblige à un exercice d'honnêteté : reconnaître une capacité structurante et son ampleur, sans céder aux chiffres précis que les sources ouvertes ne permettent pas d'étayer. La confiance des données est volontairement abaissée — c'est la lecture la plus rigoureuse possible d'un programme aussi fermé.",
  },
  operators: ["Chine"],
  theatres: [
    "Détroit de Taïwan",
    "Mer de Chine orientale",
  ],
  timeline: [
    {
      date: "2011",
      label: "Premier vol du prototype J-20.",
      kind: "jalon",
    },
    {
      date: "2017",
      label: "Entrée en service du J-20 dans l'armée de l'air chinoise.",
      kind: "jalon",
    },
    {
      date: "2025",
      label:
        "La flotte dépasse 300 appareils ; la variante biplace J-20S entre en service.",
      kind: "jalon",
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
      id: "iiss",
      title: "The Military Balance",
      publisher: "IISS",
      type: "institution",
      reliability: "A",
    },
    {
      id: "usni",
      title: "Analyses sur les forces aériennes chinoises",
      publisher: "USNI News",
      type: "presse",
      reliability: "C",
      url: "https://news.usni.org/",
    },
  ],
  updated: "2026-05-22",
};
