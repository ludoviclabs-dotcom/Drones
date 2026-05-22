import type { DefenseSystem } from "../types";

export const dragonfire: DefenseSystem = {
  slug: "dragonfire",
  name: "DragonFire",
  designation: "Démonstrateur LDEW",
  reference: "PNP-DE-003",
  category: "directed-energy",
  directedEnergyClass: "HEL",
  classLabel: "Laser haute énergie naval",
  country: "Royaume-Uni",
  flag: "🇬🇧",
  manufacturer: "MBDA UK · Leonardo UK · QinetiQ",
  status: "Démonstrateur ; déploiement accéléré annoncé sur destroyers Type 45 dès 2027",
  acquisitionModes: ["production-nationale"],
  tagline:
    "Le laser qui a fait basculer le Royaume-Uni du démonstrateur au calendrier — premier laser de marine européen annoncé en service.",
  summary:
    "DragonFire est le démonstrateur britannique d'arme à énergie dirigée : un laser de classe 50 kW à fibres combinées, développé par MBDA UK avec Leonardo UK, QinetiQ et le laboratoire de défense Dstl. Ses essais ont montré une précision remarquable — atteindre une cible de la taille d'une pièce de monnaie à un kilomètre.\n\nSon importance tient surtout au calendrier. Le Royaume-Uni a annoncé une accélération de cinq ans : un déploiement sur quatre destroyers Type 45 à partir de 2027, faisant de DragonFire le premier laser de marine européen annoncé en service de première ligne. Un contrat de série a transformé le démonstrateur en engagement daté — reste à le tenir.",
  keySpecs: [
    {
      label: "Classe de puissance",
      value: "≈ 50 kW",
      confidence: "moyenne",
      sources: ["defense-news"],
    },
    {
      label: "Architecture laser",
      value: "Laser à fibres combinées",
      confidence: "moyenne",
      sources: ["defense-news"],
    },
    {
      label: "Précision démontrée",
      value: "Cible de la taille d'une pièce à 1 km",
      confidence: "moyenne",
      note: "Affirmation du ministère de la Défense britannique.",
      sources: ["gov-uk"],
    },
    {
      label: "Cibles",
      value: "Drones, munitions rôdeuses, embarcations rapides",
      confidence: "moyenne",
      sources: ["navy-lookout"],
    },
    {
      label: "Coût par tir",
      value: "≈ 10 £ d'électricité (annoncé)",
      confidence: "moyenne",
      sources: ["defense-news"],
    },
    {
      label: "Plateforme visée",
      value: "Destroyer Type 45 — déploiement annoncé dès 2027",
      confidence: "moyenne",
      sources: ["gov-uk", "naval-tech"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "DragonFire est souvent résumé à un chiffre : un tir à une dizaine de livres d'électricité, contre des centaines de milliers de livres pour un missile Aster. Le contraste est réel et il fonde la promesse du « magasin profond ».\n\nMais ce coût marginal ne dit rien du reste. Le contrat de 316 M£ pour les deux premiers systèmes de série donne, lui, l'ordre de grandeur de l'investissement réel — système, intégration au navire, conduite de tir. Le tir est presque gratuit ; le programme ne l'est pas.",
      indicators: [
        {
          label: "Coût marginal par tir",
          value: "≈ 10 £ d'électricité",
          confidence: "moyenne",
          note: "Distinct du coût système et d'intégration.",
          sources: ["defense-news"],
        },
        {
          label: "Contrat de série",
          value: "316 M£ — deux premiers systèmes de série",
          confidence: "haute",
          sources: ["naval-tech", "navy-lookout"],
        },
        {
          label: "Logique économique",
          value: "Magasin profond face aux drones et munitions rôdeuses",
          confidence: "moyenne",
          sources: ["defense-news"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le développement de DragonFire a été porté par le ministère de la Défense britannique et le Dstl. En novembre 2025, un contrat de 316 M£ a été attribué à MBDA UK pour les deux premiers systèmes de série destinés à la Royal Navy.\n\nCe contrat, assorti d'un calendrier avancé de cinq ans, marque le passage d'une logique de recherche à une logique d'acquisition — un pari budgétaire autant que technique.",
      indicators: [
        {
          label: "Maître d'ouvrage",
          value: "Ministère de la Défense britannique · Dstl",
          confidence: "haute",
          sources: ["gov-uk"],
        },
        {
          label: "Contrat de production",
          value: "316 M£ à MBDA UK (novembre 2025)",
          confidence: "haute",
          sources: ["naval-tech"],
        },
        {
          label: "Signal politique",
          value: "Calendrier accéléré de cinq ans annoncé",
          confidence: "haute",
          sources: ["gov-uk", "defense-news"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "DragonFire repose sur un consortium britannique : MBDA UK pour la maîtrise d'œuvre et l'intégration, Leonardo UK pour la conduite de faisceau, QinetiQ pour la source laser, le Dstl pour la recherche. La chaîne est largement nationale.\n\nL'accélération du calendrier déplace le risque vers l'industrialisation : produire, intégrer au navire et soutenir des systèmes de série en cinq ans de moins que prévu.",
      indicators: [
        {
          label: "Consortium",
          value: "MBDA UK · Leonardo UK · QinetiQ · Dstl",
          confidence: "haute",
          sources: ["gov-uk", "defense-news"],
        },
        {
          label: "Maître d'œuvre",
          value: "MBDA UK — intégration et production",
          confidence: "haute",
          sources: ["naval-tech"],
        },
        {
          label: "Enjeu critique",
          value: "Tenir un calendrier de série fortement comprimé",
          confidence: "moyenne",
          sources: ["defense-news"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "DragonFire s'inscrit dans une leçon récente : en mer Rouge, des navires alliés ont dépensé des missiles coûteux contre des drones bon marché. Un effecteur laser à tir quasi gratuit promet de rééquilibrer cette arithmétique.\n\nEn l'annonçant sur ses Type 45, le Royaume-Uni vise aussi une position : être la première puissance européenne à mettre un laser de marine en service de première ligne.",
      indicators: [
        {
          label: "Fonction stratégique",
          value: "Effecteur naval de couche basse à faible coût par tir",
          confidence: "haute",
          sources: ["defense-news"],
        },
        {
          label: "Positionnement",
          value: "Premier laser de marine européen annoncé en service",
          confidence: "moyenne",
          sources: ["naval-tech"],
        },
        {
          label: "Moteur stratégique",
          value: "Drones et munitions rôdeuses contre les navires",
          confidence: "haute",
          sources: ["navy-lookout"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "Porté par un consortium dont MBDA est un acteur européen majeur, DragonFire dispose d'un potentiel d'export vers des marines alliées une fois la capacité éprouvée.\n\nÀ ce stade, l'effort est national et tourné vers la Royal Navy ; l'énergie dirigée navale reste un domaine sensible, et tout transfert dépendra d'un système d'abord prouvé en service britannique.",
      indicators: [
        {
          label: "Statut export",
          value: "Effort national — destiné d'abord à la Royal Navy",
          confidence: "moyenne",
          sources: ["naval-tech"],
        },
        {
          label: "Potentiel",
          value: "Marines alliées, une fois la capacité éprouvée",
          confidence: "faible",
          status: "variable",
          sources: ["defense-news"],
        },
        {
          label: "Sensibilité",
          value: "Énergie dirigée navale — domaine technologiquement contrôlé",
          confidence: "moyenne",
          sources: ["crs-dew"],
        },
      ],
    },
  ],
  physicalConstraints: [
    {
      label: "Ligne de visée",
      value: "La cible doit être vue et suivie en continu depuis le navire",
      confidence: "haute",
      sources: ["crs-dew"],
    },
    {
      label: "Atmosphère marine",
      value: "Embruns, sel, humidité et brouillard dégradent le faisceau",
      confidence: "haute",
      sources: ["crs-dew"],
    },
    {
      label: "Temps d'illumination",
      value: "Plusieurs secondes de faisceau maintenu malgré le roulis",
      confidence: "moyenne",
      sources: ["crs-dew"],
    },
    {
      label: "Refroidissement",
      value: "Conditionne la cadence et l'intégration dans le navire",
      confidence: "moyenne",
      sources: ["crs-dew"],
    },
    {
      label: "Puissance disponible",
      value: "Classe 50 kW — prélevée sur l'énergie du navire",
      confidence: "moyenne",
      sources: ["defense-news"],
    },
    {
      label: "Sécurité laser",
      value: "Zones d'exclusion en mer et risque oculaire à gérer",
      confidence: "moyenne",
      sources: ["crs-dew"],
    },
    {
      label: "Effet sur la cible",
      value: "Destruction de drones et embarcations par effet thermique",
      confidence: "moyenne",
      sources: ["navy-lookout"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Coût par tir minime et précision démontrée en essais ; l'efficacité opérationnelle réelle reste à établir, le système n'étant pas encore embarqué.",
    },
    {
      key: "survivabilite",
      grade: "C",
      rationale:
        "Effecteur porté par un destroyer bien défendu, mais lui-même au stade du démonstrateur ; sa contribution à la survie du navire reste à prouver.",
    },
    {
      key: "exportabilite",
      grade: "C",
      rationale:
        "Potentiel réel vers des marines alliées via MBDA, mais subordonné à une mise en service britannique préalable.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Consortium britannique solide ; le calendrier accéléré de cinq ans constitue lui-même le principal facteur de risque.",
    },
    {
      key: "maturite",
      grade: "C",
      rationale:
        "Démonstrateur aux essais concluants et doté d'un contrat de série, mais pas encore embarqué : le déploiement de 2027 est annoncé, non acquis.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "Sources gouvernementales et industrielles convergentes ; performances de portée et de puissance restent des ordres de grandeur.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un tir à 10 £ remplace les missiles. La réalité : ces 10 £ ne sont que le coût marginal — le système, son intégration au navire et un programme accéléré portent le coût et le risque réels ; et un laser de 50 kW traite des drones, pas toute la menace missile.",
    bestUseCase:
      "La défense rapprochée d'un navire contre drones, munitions rôdeuses et embarcations rapides — la couche basse économe qui réserve les missiles aux menaces les plus dures.",
    weakPoint:
      "Le statut : DragonFire reste un démonstrateur. L'atmosphère marine le contraint, et l'échéance de 2027 est un pari de calendrier, pas un fait acquis.",
    analystNote:
      "L'importance de DragonFire tient au calendrier autant qu'à la capacité : le Royaume-Uni a transformé un démonstrateur en engagement daté. Le contrat de 316 M£ est le repère solide ; la question ouverte est de savoir si l'échéance de 2027 tiendra face à la compression du programme.",
  },
  legalNote:
    "Le Protocole IV de la Convention sur certaines armes classiques interdit les armes laser spécifiquement conçues pour provoquer une cécité permanente. DragonFire vise drones et embarcations ; le CICR rappelle l'obligation de précaution pour éviter d'aveugler lors de l'emploi de tout système laser.",
  operators: ["Royaume-Uni — déploiement annoncé"],
  theatres: ["Royaume-Uni — campagnes d'essais (Hébrides)"],
  timeline: [
    {
      date: "2017",
      label: "Contrat de démonstrateur LDEW attribué au consortium DragonFire.",
      kind: "jalon",
    },
    {
      date: "2024",
      label: "Premier tir d'essai de haute puissance contre des cibles aériennes.",
      kind: "jalon",
    },
    {
      date: "2025",
      label: "Contrat de 316 M£ à MBDA UK pour les deux premiers systèmes de série.",
      kind: "jalon",
    },
    {
      date: "2025",
      label: "Le Royaume-Uni annonce un calendrier accéléré de cinq ans.",
      kind: "debat",
    },
    {
      date: "2027",
      label: "Déploiement annoncé sur les destroyers Type 45 de la Royal Navy.",
      kind: "jalon",
    },
  ],
  sources: [
    {
      id: "gov-uk",
      title: "DragonFire laser weapon — déploiement Royal Navy",
      publisher: "GOV.UK — UK Government",
      type: "officiel",
      reliability: "A",
      url: "https://www.gov.uk/government/news/major-5-billion-technology-investment-accelerates-uk-defence-innovation-in-a-european-first",
    },
    {
      id: "naval-tech",
      title: "MBDA wins £316m contract to supply DragonFire to Royal Navy",
      publisher: "Naval Technology",
      type: "presse",
      reliability: "C",
      url: "https://www.naval-technology.com/news/royal-navy-dragonfire-laser/",
    },
    {
      id: "navy-lookout",
      title: "Contract to deliver first laser weapons for the Royal Navy agreed",
      publisher: "Navy Lookout",
      type: "presse",
      reliability: "C",
      url: "https://www.navylookout.com/contract-to-deliver-first-laser-weapons-for-the-royal-navy-agreed/",
    },
    {
      id: "defense-news",
      title: "UK Royal Navy to equip MBDA's drone-frying lasers by 2027",
      publisher: "Defense News",
      type: "presse",
      reliability: "C",
      url: "https://www.defensenews.com/global/europe/2025/11/20/uk-royal-navy-to-equip-mbdas-drone-frying-lasers-by-2027/",
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
