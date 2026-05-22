import type { DefenseSystem } from "../types";

export const laserNavalAllemand: DefenseSystem = {
  slug: "laser-naval-mbda-rheinmetall",
  name: "Laser naval MBDA-Rheinmetall",
  designation: "Démonstrateur d'arme laser navale (Bundeswehr)",
  reference: "PNP-DE-007",
  category: "directed-energy",
  directedEnergyClass: "HEL",
  classLabel: "Démonstrateur laser naval",
  country: "Allemagne",
  flag: "🇩🇪",
  manufacturer: "Rheinmetall · MBDA Deutschland",
  status: "Démonstrateur ; campagne d'essais en mer achevée — décision d'acquisition visée 2027",
  acquisitionModes: ["production-nationale", "cooperatif"],
  tagline:
    "Cent tirs en mer, puis le banc d'essai à terre — un démonstrateur naval allemand à un pas du marché, à deux pas de la flotte.",
  summary:
    "Le démonstrateur d'arme laser navale développé conjointement par Rheinmetall et MBDA Deutschland est l'effort allemand pour doter sa marine d'un effecteur à énergie dirigée. Logé dans un conteneur modulaire installé sur le pont de la frégate Sachsen, il a mené une campagne d'essais en mer de plus de cent tirs avant d'être transféré au centre de compétence laser de la Bundeswehr.\n\nLa démarche est méthodique : essais embarqués, banc d'essai à terre, puis décision. Le démonstrateur opère aujourd'hui dans la classe des 20 kW, les industriels visant à terme plus de 100 kW. Une décision d'acquisition est espérée vers 2027, pour une mise en service possible vers 2029 — un calendrier crédible, mais conditionnel.",
  keySpecs: [
    {
      label: "Classe de puissance",
      value: "≈ 20 kW (démonstrateur)",
      confidence: "moyenne",
      sources: ["defense-news"],
    },
    {
      label: "Classe visée",
      value: "> 100 kW pour les versions futures",
      confidence: "faible",
      status: "variable",
      sources: ["breaking-def"],
    },
    {
      label: "Cibles",
      value: "Petits drones, cibles de surface légères",
      confidence: "moyenne",
      sources: ["defense-news"],
    },
    {
      label: "Essais en mer",
      value: "Plus de 100 tirs depuis la frégate Sachsen",
      confidence: "haute",
      sources: ["rheinmetall"],
    },
    {
      label: "Intégration",
      value: "Conteneur modulaire installé sur le pont",
      confidence: "moyenne",
      sources: ["naval-tech"],
    },
    {
      label: "Calendrier",
      value: "Décision d'acquisition visée 2027 ; flotte possible 2029",
      confidence: "moyenne",
      sources: ["breaking-def"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Comme tout effecteur laser, le démonstrateur naval allemand promet un coût par tir très faible — un complément économique aux missiles intercepteurs, dont chaque emploi coûte cher.\n\nMais le coût qui compte ici n'est pas encore connu : celui d'un système de série, de son intégration au navire et de son soutien. C'est précisément ce que la décision d'acquisition de 2027 devra trancher.",
      indicators: [
        {
          label: "Coût marginal par tir",
          value: "Faible — complément économique aux missiles",
          confidence: "moyenne",
          sources: ["breaking-def"],
        },
        {
          label: "Coût système",
          value: "Non public — à établir avant toute série",
          confidence: "faible",
          status: "variable",
          sources: ["naval-tech"],
        },
        {
          label: "Décision attendue",
          value: "L'arbitrage de coût relève de la décision de 2027",
          confidence: "moyenne",
          sources: ["breaking-def"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le démonstrateur est financé par la Bundeswehr, dans un partenariat industriel entre Rheinmetall et MBDA Deutschland. Le programme suit une trajectoire prudente : démonstration embarquée, évaluation à terre, puis décision.\n\nUne décision d'acquisition est espérée vers 2027. Tant qu'elle n'est pas prise, l'effort reste au stade de la démonstration financée, non du programme de série.",
      indicators: [
        {
          label: "Maître d'ouvrage",
          value: "Bundeswehr — marine allemande",
          confidence: "haute",
          sources: ["naval-tech"],
        },
        {
          label: "Partenariat industriel",
          value: "Rheinmetall et MBDA Deutschland",
          confidence: "haute",
          sources: ["rheinmetall"],
        },
        {
          label: "Stade budgétaire",
          value: "Démonstrateur — décision d'acquisition visée 2027",
          confidence: "moyenne",
          sources: ["breaking-def"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La répartition industrielle est nette : MBDA Deutschland conduit la détection, la poursuite, les consoles opérateur et l'intégration au système de combat du navire ; Rheinmetall fournit la source laser, la conduite de faisceau, le système de visée et l'intégration mécanique.\n\nCette division des tâches structure une chaîne allemande cohérente. Le passage du démonstrateur en conteneur à un système intégré au navire reste l'étape industrielle à franchir.",
      indicators: [
        {
          label: "MBDA Deutschland",
          value: "Détection, poursuite, consoles, intégration au système de combat",
          confidence: "haute",
          sources: ["rheinmetall"],
        },
        {
          label: "Rheinmetall",
          value: "Source laser, conduite de faisceau, visée, intégration mécanique",
          confidence: "haute",
          sources: ["rheinmetall"],
        },
        {
          label: "Étape à franchir",
          value: "Du conteneur de démonstration au système intégré au navire",
          confidence: "moyenne",
          sources: ["naval-tech"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "La marine allemande cherche un complément économique à ses intercepteurs face à la multiplication des drones et des menaces saturantes en mer. Le démonstrateur vise les frégates de classe Sachsen et les futures F126.\n\nL'Allemagne s'inscrit ainsi dans une course européenne au laser naval, aux côtés du britannique DragonFire — chacun cherchant à fielder le premier une capacité crédible.",
      indicators: [
        {
          label: "Besoin stratégique",
          value: "Complément économique aux missiles face aux drones en mer",
          confidence: "haute",
          sources: ["breaking-def"],
        },
        {
          label: "Plateformes visées",
          value: "Frégates de classe Sachsen et futures F126",
          confidence: "moyenne",
          sources: ["breaking-def"],
        },
        {
          label: "Contexte",
          value: "Course européenne au laser naval crédible",
          confidence: "moyenne",
          sources: ["defense-news"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "Porté par Rheinmetall et MBDA, le démonstrateur dispose d'un potentiel coopératif et d'export vers des marines alliées — une fois la capacité éprouvée et la décision d'acquisition allemande prise.\n\nÀ ce stade, l'effort est national et tourné vers la Bundeswehr. L'énergie dirigée navale reste un domaine sensible, soumis à des contrôles.",
      indicators: [
        {
          label: "Statut export",
          value: "Effort national — démonstrateur, pas de transfert",
          confidence: "moyenne",
          sources: ["naval-tech"],
        },
        {
          label: "Potentiel",
          value: "Marines alliées, après mise en service allemande",
          confidence: "faible",
          status: "variable",
          sources: ["defense-news"],
        },
        {
          label: "Sensibilité",
          value: "Énergie dirigée navale — domaine contrôlé",
          confidence: "moyenne",
          sources: ["crs-dew"],
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
      value: "Embruns, sel, humidité et brouillard dégradent le faisceau",
      confidence: "haute",
      sources: ["crs-dew"],
    },
    {
      label: "Temps d'illumination",
      value: "Plusieurs secondes de faisceau maintenu malgré le mouvement du navire",
      confidence: "moyenne",
      sources: ["crs-dew"],
    },
    {
      label: "Refroidissement",
      value: "Géré dans un conteneur modulaire — à intégrer au navire ensuite",
      confidence: "moyenne",
      sources: ["naval-tech"],
    },
    {
      label: "Puissance disponible",
      value: "≈ 20 kW — la montée vers 100 kW reste à démontrer",
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
      value: "Neutralisation de petits drones et cibles de surface par effet thermique",
      confidence: "moyenne",
      sources: ["defense-news"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Effecteur prometteur, à coût marginal faible et emploi crédible contre les drones ; l'efficacité d'un futur système de série reste à établir.",
    },
    {
      key: "survivabilite",
      grade: "C",
      rationale:
        "Démonstrateur embarqué sur une frégate ; sa contribution à la survie du navire reste à démontrer hors campagne d'essais.",
    },
    {
      key: "exportabilite",
      grade: "C",
      rationale:
        "Potentiel coopératif réel via Rheinmetall et MBDA, mais subordonné à une décision d'acquisition allemande encore à venir.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Deux maîtres d'œuvre solides, une répartition claire des tâches ; le risque tient au passage du démonstrateur au système intégré.",
    },
    {
      key: "maturite",
      grade: "C",
      rationale:
        "Plus de cent tirs en mer et un transfert vers un banc d'essai à terre — au-delà du simple démonstrateur, sans être un système de série.",
    },
    {
      key: "confiance-donnees",
      grade: "C",
      rationale:
        "Données surtout industrielles et de presse spécialisée ; le calendrier de 2029 et les puissances visées sont des projections.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : l'Allemagne dispose d'une arme laser navale. La réalité : un démonstrateur d'environ 20 kW, dont la campagne d'essais en mer est achevée et qui rejoint un banc d'essai à terre — la décision d'acquisition n'est pas attendue avant 2027.",
    bestUseCase:
      "Un complément économique aux missiles intercepteurs contre les petits drones et les cibles de surface légères, sur frégates de classe Sachsen ou futures F126.",
    weakPoint:
      "La puissance et le calendrier : une vingtaine de kilowatts aujourd'hui, plus de 100 kW en aspiration ; l'échéance de 2029 dépend d'une décision encore à prendre.",
    analystNote:
      "Le laser naval allemand avance avec méthode — cent tirs en mer, un banc d'essai à terre, puis une décision. Cette rigueur est sa force. Mais « proche de la maturité commerciale » est un langage d'industriel, et l'horizon 2029 demeure conditionnel.",
  },
  legalNote:
    "Le Protocole IV de la Convention sur certaines armes classiques interdit les armes laser spécifiquement conçues pour provoquer une cécité permanente. Le démonstrateur naval vise drones et cibles de surface ; le CICR rappelle l'obligation de précaution pour éviter d'aveugler lors de l'emploi de tout système laser.",
  operators: ["Allemagne — démonstrateur embarqué (essais)"],
  theatres: [
    "Mer du Nord / Baltique — essais embarqués (frégate Sachsen)",
    "Allemagne — banc d'essai laser (WTD 91, Meppen)",
  ],
  timeline: [
    {
      date: "2022",
      label:
        "Rheinmetall et MBDA Deutschland installent le démonstrateur laser sur la frégate Sachsen.",
      kind: "jalon",
    },
    {
      date: "2023",
      label: "Campagne d'essais en mer — plus de 100 tirs en conditions opérationnelles.",
      kind: "emploi",
    },
    {
      date: "2025",
      label:
        "Transfert du démonstrateur au centre de compétence laser de la Bundeswehr (WTD 91, Meppen).",
      kind: "jalon",
    },
    {
      date: "2025",
      label: "Les industriels annoncent un système « proche de la maturité commerciale ».",
      kind: "debat",
    },
    {
      date: "2027",
      label: "Décision d'acquisition visée par la marine allemande.",
      kind: "jalon",
    },
  ],
  sources: [
    {
      id: "rheinmetall",
      title:
        "Rheinmetall and MBDA: German laser weapon system close to market readiness",
      publisher: "Rheinmetall",
      type: "constructeur",
      reliability: "B",
      url: "https://www.rheinmetall.com/en/media/news-watch/news/2025/10/2025-10-28-rheinmetall-and-mbda-german-laser-weapon-system-close-to-market-readiness",
    },
    {
      id: "defense-news",
      title: "Rheinmetall, MBDA tout German shipborne laser gun for zapping drones",
      publisher: "Defense News",
      type: "presse",
      reliability: "C",
      url: "https://www.defensenews.com/global/europe/2025/10/28/rheinmetall-mbda-tout-german-shipborne-laser-gun-for-zapping-drones/",
    },
    {
      id: "naval-tech",
      title: "German Navy's laser demonstrator moves to WTD 91 testing",
      publisher: "Naval Technology",
      type: "presse",
      reliability: "C",
      url: "https://www.naval-technology.com/news/rheinmetall-mbda-laser-demonstrator/",
    },
    {
      id: "breaking-def",
      title: "German laser weapon could be on ships by 2029, say contractors",
      publisher: "Breaking Defense",
      type: "presse",
      reliability: "C",
      url: "https://breakingdefense.com/2025/10/german-laser-weapon-could-be-on-ships-by-2029-say-contractors/",
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
