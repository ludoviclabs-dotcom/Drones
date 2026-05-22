import type { DefenseSystem } from "../types";

export const ironBeam: DefenseSystem = {
  slug: "iron-beam",
  name: "Iron Beam",
  reference: "PNP-DE-002",
  category: "directed-energy",
  directedEnergyClass: "HEL",
  classLabel: "Laser haute énergie C-RAM",
  country: "Israël",
  flag: "🇮🇱",
  manufacturer: "Rafael Advanced Defense Systems",
  introduced: "2025",
  status: "Premier système opérationnel livré à l'IDF (fin 2025) ; montée en puissance en cours",
  acquisitionModes: ["production-nationale"],
  tagline:
    "Le premier laser de forte puissance livré opérationnel — la couche basse, enfin réelle, d'un bouclier multicouche.",
  summary:
    "Iron Beam est le laser haute énergie développé par Rafael pour intercepter roquettes, obus de mortier et drones — la couche basse, peu coûteuse, du bouclier aérien israélien. Conçu pour compléter Iron Dome, David's Sling et Arrow, il répond à une menace pensée pour saturer : des projectiles nombreux et bon marché qu'il devient ruineux d'arrêter avec des missiles intercepteurs.\n\nSa livraison à l'IDF fin 2025 en fait le premier laser de classe « forte puissance » présenté comme opérationnel. Mais livré n'est pas éprouvé : le système monte encore en puissance au sein de l'armée de l'air, et sa promesse — un tir quasi gratuit — reste bornée par les conditions atmosphériques et par un emploi opérationnel encore jeune.",
  keySpecs: [
    {
      label: "Classe de puissance",
      value: "≈ 100 kW (classe annoncée)",
      confidence: "faible",
      status: "variable",
      note: "Chiffre industriel — à considérer avec prudence.",
      sources: ["rafael"],
    },
    {
      label: "Cibles",
      value: "Roquettes, obus de mortier, drones",
      confidence: "haute",
      sources: ["rafael", "israel-mod"],
    },
    {
      label: "Portée d'engagement",
      value: "Tactique — ordre de quelques kilomètres",
      confidence: "faible",
      status: "variable",
      sources: ["crs-dew"],
    },
    {
      label: "Architecture de défense",
      value: "Couche basse du bouclier multicouche israélien",
      confidence: "haute",
      sources: ["israel-mod"],
    },
    {
      label: "Plateforme",
      value: "Système terrestre fixe ou semi-mobile",
      confidence: "moyenne",
      sources: ["rafael"],
    },
    {
      label: "Coût par tir",
      value: "Quelques dollars d'électricité (annoncé)",
      confidence: "moyenne",
      sources: ["rafael"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Iron Beam a été pensé autour d'un seul chiffre : le coût par tir. Un intercepteur d'Iron Dome coûte des dizaines de milliers de dollars ; une roquette artisanale, quelques centaines. Le ratio d'échange de coût joue contre le défenseur — et c'est précisément ce que le laser entend corriger.\n\nMais le coût marginal quasi nul ne dit rien du coût système et d'intégration, ni d'un coût de possession encore mal connu pour une technologie aussi récente. Le bon usage d'Iron Beam est de réserver les missiles aux cibles qu'il ne peut pas traiter.",
      indicators: [
        {
          label: "Coût marginal par tir",
          value: "Quelques dollars d'électricité",
          confidence: "moyenne",
          note: "Distinct du coût complet de possession.",
          sources: ["rafael", "crs-dew"],
        },
        {
          label: "Coût système et programme",
          value: "Non public — investissement pluriannuel du MoD",
          confidence: "faible",
          status: "variable",
          sources: ["israel-mod"],
        },
        {
          label: "Logique économique",
          value: "Corriger le ratio d'échange de coût face aux roquettes",
          confidence: "haute",
          sources: ["crs-dew"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le programme est financé par le ministère israélien de la Défense, dans une logique de long terme : recherche, prototypage, puis acquisition opérationnelle. La livraison du premier système marque le passage au stade de l'équipement.\n\nLe signal politique est clair : doter Israël d'une couche d'interception à faible coût pour soulager une défense antiaérienne qui consomme des intercepteurs coûteux face à des tirs de saturation.",
      indicators: [
        {
          label: "Maître d'ouvrage",
          value: "Ministère israélien de la Défense",
          confidence: "haute",
          sources: ["israel-mod"],
        },
        {
          label: "Stade budgétaire",
          value: "Acquisition opérationnelle — premier système livré",
          confidence: "haute",
          sources: ["israel-mod", "defense-news"],
        },
        {
          label: "Signal politique",
          value: "Compléter Iron Dome à moindre coût par tir",
          confidence: "haute",
          sources: ["crs-dew"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "Rafael assure la maîtrise d'œuvre, en s'appuyant sur une base industrielle israélienne aguerrie en optronique et en défense antiaérienne. La chaîne est largement nationale, ce qui limite les dépendances extérieures.\n\nL'enjeu n'est pas l'approvisionnement mais l'industrialisation : monter en cadence et fiabiliser une source laser de forte puissance, le refroidissement et la conduite de tir.",
      indicators: [
        {
          label: "Maître d'œuvre",
          value: "Rafael Advanced Defense Systems",
          confidence: "haute",
          sources: ["rafael"],
        },
        {
          label: "Base industrielle",
          value: "Israélienne — optronique et défense antiaérienne",
          confidence: "moyenne",
          sources: ["rafael"],
        },
        {
          label: "Enjeu critique",
          value: "Industrialisation de la source laser et du refroidissement",
          confidence: "moyenne",
          sources: ["crs-dew"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Iron Beam est indissociable de la doctrine israélienne de défense multicouche : Arrow contre les missiles balistiques, David's Sling pour la couche intermédiaire, Iron Dome contre les roquettes, et désormais le laser pour la frange basse et la plus saturante.\n\nFace à des adversaires qui misent sur le nombre et le faible coût, disposer d'une couche dont chaque tir ne coûte presque rien modifie l'équation stratégique — sans pour autant rendre les missiles obsolètes.",
      indicators: [
        {
          label: "Place dans la défense",
          value: "Couche basse, sous Iron Dome / David's Sling / Arrow",
          confidence: "haute",
          sources: ["israel-mod"],
        },
        {
          label: "Menace traitée",
          value: "Tirs de saturation — roquettes, mortiers, drones",
          confidence: "haute",
          sources: ["crs-dew"],
        },
        {
          label: "Effet stratégique",
          value: "Rééquilibrer le coût de la défense face au nombre",
          confidence: "moyenne",
          sources: ["crs-dew"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "Israël est un exportateur d'armement majeur, et la famille Iron Dome a connu des transferts. Un intérêt étranger pour le laser est probable, mais à ce stade Iron Beam est une capacité nationale fraîchement livrée.\n\nL'énergie dirigée de forte puissance reste un domaine sensible : composants, conduite de tir et savoir-faire peuvent relever de contrôles, et tout transfert dépendra d'arbitrages politiques.",
      indicators: [
        {
          label: "Statut export",
          value: "Capacité nationale — pas de transfert documenté",
          confidence: "moyenne",
          sources: ["rafael"],
        },
        {
          label: "Antécédent",
          value: "La famille Iron Dome a connu des exportations",
          confidence: "moyenne",
          sources: ["crs-dew"],
        },
        {
          label: "Sensibilité",
          value: "Technologie laser de forte puissance sous contrôle possible",
          confidence: "moyenne",
          sources: ["crs-dew"],
        },
      ],
    },
  ],
  physicalConstraints: [
    {
      label: "Ligne de visée",
      value: "La cible doit être vue et suivie sans interruption",
      confidence: "haute",
      sources: ["crs-dew"],
    },
    {
      label: "Atmosphère",
      value: "Nuages, pluie et poussière réduisent fortement la portée utile",
      confidence: "haute",
      note: "Contrainte majeure pour une couche C-RAM exposée à toute météo.",
      sources: ["crs-dew"],
    },
    {
      label: "Temps d'illumination",
      value: "Plusieurs secondes de faisceau pour détruire roquette ou obus",
      confidence: "moyenne",
      sources: ["crs-dew"],
    },
    {
      label: "Refroidissement",
      value: "Conditionne la cadence face à un tir de saturation",
      confidence: "moyenne",
      sources: ["crs-dew"],
    },
    {
      label: "Puissance disponible",
      value: "Classe ≈ 100 kW — alimentation et thermique dimensionnantes",
      confidence: "faible",
      status: "variable",
      sources: ["rafael"],
    },
    {
      label: "Sécurité laser",
      value: "Zones d'exclusion et risque oculaire encadrent l'emploi",
      confidence: "moyenne",
      sources: ["crs-dew"],
    },
    {
      label: "Effet sur la cible",
      value: "Échauffement jusqu'à la rupture ou la mise à feu du projectile",
      confidence: "moyenne",
      sources: ["rafael"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Coût par tir quasi nul et rôle clair contre les menaces saturantes ; l'efficacité réelle dépend de la météo et reste à confirmer en emploi prolongé.",
    },
    {
      key: "survivabilite",
      grade: "C",
      rationale:
        "Système de site, dépendant de sa protection rapprochée et d'une infrastructure d'alimentation ; peu mobile en emploi.",
    },
    {
      key: "exportabilite",
      grade: "C",
      rationale:
        "Israël exporte largement, mais le laser de forte puissance est récent et sensible — aucun transfert documenté à ce stade.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Rafael est un maître d'œuvre éprouvé sur base industrielle nationale ; le risque tient à l'industrialisation d'une source laser de forte puissance.",
    },
    {
      key: "maturite",
      grade: "B",
      rationale:
        "Premier système de forte puissance livré opérationnel — un seuil réel, mais la pleine capacité opérationnelle reste annoncée plus qu'éprouvée.",
    },
    {
      key: "confiance-donnees",
      grade: "C",
      rationale:
        "Beaucoup d'annonces industrielles ; la classe de puissance et les emplois au combat ne sont pas confirmés par des sources indépendantes détaillées.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : Iron Beam remplace Iron Dome et rend l'interception gratuite. La réalité : c'est la couche basse, complémentaire et dépendante de la météo — les missiles restent indispensables pour ce que le laser ne peut pas traiter, et par mauvais temps.",
    bestUseCase:
      "Intercepter des menaces saturantes et peu coûteuses — roquettes, mortiers, drones — par temps clair, comme tranche basse et économe d'un bouclier antiaérien multicouche.",
    weakPoint:
      "Les conditions atmosphériques, qui bornent une couche censée fonctionner par toute météo, et un emploi opérationnel encore trop jeune pour être jugé.",
    analystNote:
      "L'événement n'est pas la puissance, mais l'antériorité : un laser de forte puissance a franchi le premier le seuil de la livraison opérationnelle. Reste à distinguer « livré » d'« éprouvé ». Les revendications d'emploi au combat doivent être traitées comme non vérifiées tant qu'aucune source officielle détaillée ne les étaye.",
  },
  legalNote:
    "Le Protocole IV de la Convention sur certaines armes classiques interdit les armes laser spécifiquement conçues pour provoquer une cécité permanente. Iron Beam vise roquettes, obus et drones ; le CICR rappelle l'obligation de précaution pour éviter d'aveugler lors de l'emploi de tout système laser.",
  operators: ["Israël"],
  theatres: ["Israël — intégration à la défense aérienne"],
  timeline: [
    {
      date: "2014",
      label: "Rafael dévoile le concept Iron Beam comme couche laser du bouclier israélien.",
      kind: "jalon",
    },
    {
      date: "2022",
      label: "Israël annonce des essais d'interception laser jugés concluants.",
      kind: "jalon",
    },
    {
      date: "2025",
      label: "Livraison du premier système opérationnel Iron Beam à l'IDF.",
      kind: "jalon",
    },
    {
      date: "2026",
      label: "Montée en puissance opérationnelle au sein de l'armée de l'air israélienne.",
      kind: "emploi",
    },
    {
      date: "2026",
      label: "Des interceptions au combat sont évoquées, sans confirmation officielle détaillée.",
      kind: "debat",
    },
  ],
  sources: [
    {
      id: "rafael",
      title: "Iron Beam — High Energy Laser Weapon System",
      publisher: "Rafael Advanced Defense Systems",
      type: "constructeur",
      reliability: "B",
      url: "https://www.rafael.co.il/system/iron-beam/",
    },
    {
      id: "israel-mod",
      title:
        "Israel MoD and Rafael deliver first operational Iron Beam laser system to the IDF",
      publisher: "Israel Ministry of Defense",
      type: "officiel",
      reliability: "A",
      url: "https://mod.gov.il/en/press-releases/press-room/israel-mod-and-rafael-deliver-first-operational-high-power-laser-system-iron-beam-to-the-idf",
    },
    {
      id: "defense-news",
      title: "Israel fields new SIGMA artillery cannon, Iron Beam laser system",
      publisher: "Defense News",
      type: "presse",
      reliability: "C",
      url: "https://www.defensenews.com/global/mideast-africa/2025/12/29/israel-fields-new-sigma-artillery-cannon-iron-beam-laser-system/",
    },
    {
      id: "globes",
      title: "Rafael CEO: Iron Beam becoming operational",
      publisher: "Globes",
      type: "presse",
      reliability: "C",
      url: "https://en.globes.co.il/en/article-rafael-ceo-iron-beam-becoming-operational-1001538796",
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
