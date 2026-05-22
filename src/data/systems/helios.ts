import type { DefenseSystem } from "../types";

export const helios: DefenseSystem = {
  slug: "helios",
  name: "HELIOS",
  designation:
    "High Energy Laser with Integrated Optical-dazzler and Surveillance",
  reference: "PNP-DE-008",
  category: "directed-energy",
  directedEnergyClass: "HEL",
  classLabel: "Laser naval intégré",
  country: "États-Unis",
  flag: "🇺🇸",
  manufacturer: "Lockheed Martin",
  status: "Installé sur l'USS Preble depuis 2022 ; essais de développement — pas encore opérationnel",
  acquisitionModes: ["production-nationale"],
  tagline:
    "Le laser de marine américain le plus éprouvé en mer — embarqué, tireur, mais toujours à l'essai.",
  summary:
    "HELIOS — High Energy Laser with Integrated Optical-dazzler and Surveillance — est le laser naval développé par Lockheed Martin pour l'US Navy. D'une classe de 60 kW, il combine trois fonctions : effecteur laser, éblouisseur optique et capteur de surveillance, intégré au système de combat d'un destroyer.\n\nInstallé sur l'USS Preble depuis 2022, c'est le laser américain le plus éprouvé en mer : il a abattu des drones lors de démonstrations. Mais la Navy reste prudente — HELIOS demeure un banc d'essai embarqué, pas un système opérationnel déployé. Un seul navire en est doté, et la marine n'a pas tranché en faveur d'un achat élargi.",
  keySpecs: [
    {
      label: "Classe de puissance",
      value: "≈ 60 kW",
      confidence: "moyenne",
      sources: ["crs-navy"],
    },
    {
      label: "Fonctions intégrées",
      value: "Laser haute énergie, éblouisseur optique, surveillance (ISR)",
      confidence: "moyenne",
      sources: ["crs-navy"],
    },
    {
      label: "Plateforme",
      value: "Destroyer Arleigh Burke — USS Preble",
      confidence: "haute",
      sources: ["twz"],
    },
    {
      label: "Cibles",
      value: "Drones, embarcations rapides ; éblouissement de capteurs",
      confidence: "moyenne",
      sources: ["crs-navy"],
    },
    {
      label: "Statut",
      value: "Essais de développement embarqués depuis 2022",
      confidence: "haute",
      sources: ["navy-times"],
    },
    {
      label: "Diffusion",
      value: "Un seul navire équipé — Preble, basé à Yokosuka",
      confidence: "haute",
      sources: ["twz"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "HELIOS partage la promesse économique de tout laser : un tir réduit à l'énergie consommée, là où un missile antiaérien coûte des centaines de milliers de dollars. Face aux drones bon marché, le ratio d'échange de coût s'inverse.\n\nMais la valeur de HELIOS est ailleurs : dans l'intégration de trois fonctions — tir, éblouissement, surveillance — au système de combat. C'est cette intégration, plus que le coût du tir, qui constitue l'investissement et le défi.",
      indicators: [
        {
          label: "Coût marginal par tir",
          value: "Réduit à l'énergie consommée",
          confidence: "moyenne",
          sources: ["crs-dew"],
        },
        {
          label: "Valeur du système",
          value: "Intégration laser + éblouisseur + surveillance",
          confidence: "moyenne",
          sources: ["crs-navy"],
        },
        {
          label: "Coût d'intégration",
          value: "Couplage au système de combat Aegis du destroyer",
          confidence: "moyenne",
          sources: ["crs-navy"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "HELIOS est financé par l'US Navy, avec Lockheed Martin pour maître d'œuvre. Le système est installé et tire depuis 2022, mais la marine n'a pas franchi le pas d'un achat élargi.\n\nLe haut commandement naval a publiquement exprimé sa prudence : pas question de « tout miser » avant d'avoir une efficacité assurée. HELIOS sert aussi de socle de recherche à un futur effort laser interarmées.",
      indicators: [
        {
          label: "Maître d'ouvrage",
          value: "US Navy",
          confidence: "haute",
          sources: ["crs-navy"],
        },
        {
          label: "Posture d'achat",
          value: "Prudente — pas de décision d'achat élargi",
          confidence: "moyenne",
          sources: ["twz"],
        },
        {
          label: "Rôle programme",
          value: "Socle de recherche pour un effort laser interarmées",
          confidence: "moyenne",
          sources: ["crs-navy"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "Lockheed Martin assure la maîtrise d'œuvre de HELIOS. La difficulté — et la singularité — du système tient à son intégration : coupler un laser, un éblouisseur et un capteur de surveillance au système de combat d'un destroyer Arleigh Burke.\n\nC'est ce couplage, plus que la source laser elle-même, qui distingue HELIOS et qui conditionne sa généralisation éventuelle à d'autres navires.",
      indicators: [
        {
          label: "Maître d'œuvre",
          value: "Lockheed Martin",
          confidence: "haute",
          sources: ["crs-navy"],
        },
        {
          label: "Défi central",
          value: "Intégration au système de combat du destroyer",
          confidence: "moyenne",
          sources: ["crs-navy"],
        },
        {
          label: "Facteur de généralisation",
          value: "La reproductibilité de cette intégration sur d'autres navires",
          confidence: "faible",
          status: "variable",
          sources: ["twz"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "L'US Navy fait face, notamment en mer Rouge, à des drones et munitions bon marché qui l'obligent à dépenser des intercepteurs coûteux. HELIOS incarne la recherche d'une réponse économique à cette menace.\n\nSon déploiement avancé dans l'Indo-Pacifique, à bord d'un destroyer basé au Japon, en fait aussi un banc d'essai opérationnel placé là où la marine américaine concentre son attention stratégique.",
      indicators: [
        {
          label: "Besoin stratégique",
          value: "Réponse économique aux drones contre les navires",
          confidence: "haute",
          sources: ["crs-dew"],
        },
        {
          label: "Positionnement",
          value: "Déploiement avancé en Indo-Pacifique (Yokosuka)",
          confidence: "haute",
          sources: ["twz"],
        },
        {
          label: "Place dans la défense",
          value: "Effecteur de couche basse, complémentaire des missiles",
          confidence: "moyenne",
          sources: ["crs-navy"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "HELIOS est un programme national américain, qui relèverait du régime ITAR. La marine ne l'ayant pas encore adopté pour un achat élargi, il n'est pas un produit destiné à l'export.\n\nUn laser naval américain mûr serait, en tout état de cause, soumis aux contrôles les plus stricts et réservé aux partenaires les plus proches.",
      indicators: [
        {
          label: "Statut export",
          value: "Programme national — export hors sujet à ce stade",
          confidence: "haute",
          sources: ["crs-navy"],
        },
        {
          label: "Régime probable",
          value: "ITAR — contrôle américain strict",
          confidence: "moyenne",
          sources: ["crs-dew"],
        },
        {
          label: "Condition préalable",
          value: "Une adoption par l'US Navy elle-même, non encore acquise",
          confidence: "moyenne",
          sources: ["twz"],
        },
      ],
    },
  ],
  physicalConstraints: [
    {
      label: "Ligne de visée",
      value: "La cible doit être vue et suivie depuis le navire",
      confidence: "haute",
      sources: ["crs-dew"],
    },
    {
      label: "Atmosphère marine",
      value: "Embruns, sel et humidité dégradent la propagation du faisceau",
      confidence: "haute",
      sources: ["crs-dew"],
    },
    {
      label: "Temps d'illumination",
      value: "Plusieurs secondes de faisceau maintenu malgré le mouvement",
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
      value: "Classe 60 kW — prélevée sur l'énergie du destroyer",
      confidence: "moyenne",
      sources: ["crs-navy"],
    },
    {
      label: "Sécurité laser",
      value: "Zones d'exclusion en mer et risque oculaire à gérer",
      confidence: "moyenne",
      sources: ["crs-dew"],
    },
    {
      label: "Effet sur la cible",
      value: "Destruction de drones, ou éblouissement de capteurs adverses",
      confidence: "moyenne",
      sources: ["crs-navy"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Coût par tir faible et multifonction (tir, éblouissement, surveillance) ; l'efficacité opérationnelle pleine reste à confirmer.",
    },
    {
      key: "survivabilite",
      grade: "C",
      rationale:
        "Porté par un destroyer bien défendu, mais HELIOS reste un banc d'essai dont la contribution en combat n'est pas établie.",
    },
    {
      key: "exportabilite",
      grade: "D",
      rationale:
        "Programme national sous régime ITAR, non adopté pour un achat élargi : aucune perspective d'export à ce stade.",
    },
    {
      key: "risque-industriel",
      grade: "C",
      rationale:
        "Lockheed Martin est un maître d'œuvre solide, mais la prudence affichée de la marine laisse l'avenir du programme incertain.",
    },
    {
      key: "maturite",
      grade: "C",
      rationale:
        "Embarqué et tireur depuis 2022, avec des drones abattus en démonstration — au-delà du démonstrateur, mais pas encore déclaré opérationnel.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "Programme documenté par le CRS et des déclarations officielles ; les performances précises restent en partie classifiées ou industrielles.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : les destroyers américains disposent d'armes laser opérationnelles. La réalité : un seul destroyer porte HELIOS, comme banc d'essai ; il a abattu des drones en démonstration, mais la marine ne s'est pas engagée à le généraliser.",
    bestUseCase:
      "La défense rapprochée d'un navire contre drones et embarcations rapides, doublée d'un éblouisseur et d'une fonction de surveillance — un laser naval multifonction, une fois mûri.",
    weakPoint:
      "L'écart entre un banc d'essai qui fonctionne et une arme mise en service : la prudence affichée par la marine américaine elle-même en est le meilleur indice.",
    analystNote:
      "HELIOS est le laser américain le plus éprouvé en mer, et son intégration au système de combat en est la vraie réussite. Mais « embarqué et tireur » n'est pas « opérationnel » : la réticence de la Navy à s'engager est la lecture honnête de ce dossier.",
  },
  legalNote:
    "Le Protocole IV de la Convention sur certaines armes classiques interdit les armes laser spécifiquement conçues pour provoquer une cécité permanente. HELIOS intègre un éblouisseur optique visant des capteurs, et vise par ailleurs drones et embarcations ; le CICR rappelle l'obligation de précaution pour éviter d'aveugler lors de l'emploi de tout système laser.",
  operators: ["États-Unis — un navire (USS Preble)"],
  theatres: [
    "Indo-Pacifique — déploiement avancé (Yokosuka)",
    "Essais en mer — interception de drones",
  ],
  timeline: [
    {
      date: "2018",
      label: "L'US Navy attribue à Lockheed Martin le contrat du laser naval HELIOS.",
      kind: "jalon",
    },
    {
      date: "2022",
      label: "HELIOS est intégré au destroyer USS Preble.",
      kind: "jalon",
    },
    {
      date: "2024",
      label: "L'USS Preble abat des drones lors de démonstrations, dont quatre cibles.",
      kind: "emploi",
    },
    {
      date: "2025",
      label:
        "La marine américaine reste prudente — pas de décision d'achat élargi.",
      kind: "debat",
    },
  ],
  sources: [
    {
      id: "crs-navy",
      title: "Navy Shipboard Lasers: Background and Issues for Congress — R44175",
      publisher: "Congressional Research Service",
      type: "institution",
      reliability: "A",
      url: "https://www.congress.gov/crs-product/R44175",
    },
    {
      id: "navy-times",
      title: "US Navy hits drone with HELIOS laser in successful test",
      publisher: "Navy Times",
      type: "presse",
      reliability: "C",
      url: "https://www.navytimes.com/news/your-navy/2025/02/04/us-navy-hits-drone-with-helios-laser-in-successful-test/",
    },
    {
      id: "twz",
      title: "USS Preble Used HELIOS Laser To Zap Four Drones In Expanding Testing",
      publisher: "The War Zone",
      type: "presse",
      reliability: "C",
      url: "https://www.twz.com/sea/uss-preble-used-helios-laser-to-zap-four-drones-in-expanding-testing",
    },
    {
      id: "defense-post",
      title: "US Navy's Burke-Class Destroyer Unleashes HELIOS Laser",
      publisher: "The Defense Post",
      type: "presse",
      reliability: "C",
      url: "https://thedefensepost.com/2025/02/04/us-navy-helios-laser/",
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
