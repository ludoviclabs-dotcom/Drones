import type { DefenseSystem } from "../types";

export const helmaP: DefenseSystem = {
  slug: "helma-p",
  name: "HELMA-P",
  designation: "Laser anti-drone L2AD",
  reference: "PNP-DE-001",
  category: "directed-energy",
  directedEnergyClass: "HEL",
  classLabel: "Laser haute énergie anti-drone",
  country: "France",
  flag: "🇫🇷",
  manufacturer: "CILAS",
  introduced: "2024",
  status: "Déployé en protection d'événement ; intégration aux forces armées en cours",
  acquisitionModes: ["production-nationale"],
  tagline:
    "Le premier laser anti-drone français entré dans une logique d'emploi réel — un effecteur de site, pas un bouclier.",
  summary:
    "HELMA-P — High-Energy Laser for Multiple Applications, Portable — est le système développé par CILAS qui a fait entrer la France dans l'emploi opérationnel du laser anti-drone. Compact et transportable, il détecte, suit puis neutralise de petits drones par effet thermique : une réponse de couche basse à la prolifération des aéronefs légers.\n\nIl n'est pas un bouclier aérien. C'est un effecteur courte portée, pensé pour la protection de sites et d'événements, en complément de la détection, du brouillage, des canons et des missiles. Sa valeur tient autant à sa maturité d'emploi — il a été engagé dans un dispositif réel — qu'à son coût marginal par tir, très faible face à des menaces conçues pour être nombreuses et bon marché.",
  keySpecs: [
    {
      label: "Classe de puissance",
      value: "≈ 2 kW",
      confidence: "moyenne",
      note: "Classe adaptée aux drones légers — pas aux menaces lourdes.",
      sources: ["army-tech"],
    },
    {
      label: "Portée de détection",
      value: "≈ 3 km",
      confidence: "moyenne",
      sources: ["army-tech"],
    },
    {
      label: "Portée de neutralisation",
      value: "< 1 km",
      confidence: "moyenne",
      sources: ["army-tech"],
    },
    {
      label: "Cibles",
      value: "Drones de 100 g à 25 kg",
      confidence: "moyenne",
      note: "Y compris à plus de 50 km/h.",
      sources: ["army-tech"],
    },
    {
      label: "Plateformes",
      value: "Terrestre fixe, mobile, naval expérimental",
      confidence: "haute",
      sources: ["cilas", "dga-forbin"],
    },
    {
      label: "Mission",
      value: "Lutte anti-drone — protection de sites et d'événements",
      confidence: "haute",
      sources: ["min-armees"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le coût d'un laser ne se lit pas comme celui d'un missile. Quatre couches doivent être distinguées : le coût du système — source laser, tourelle, optiques, capteurs, alimentation, refroidissement ; le coût d'intégration sur sa plateforme ; le coût marginal par tir, réduit à quelques euros d'électricité ; et le coût de possession sur la durée.\n\nHELMA-P tire sa promesse économique du troisième poste : face à des drones conçus pour être nombreux et bon marché, un tir quasi gratuit inverse le ratio d'échange de coût. Mais présenter ce seul chiffre serait trompeur — l'investissement réel se loge dans le système et son intégration.",
      indicators: [
        {
          label: "Coût marginal par tir",
          value: "Quelques euros d'électricité",
          confidence: "moyenne",
          note: "Distinct du coût complet de possession.",
          sources: ["crs-dew"],
        },
        {
          label: "Coût système",
          value: "Non public",
          confidence: "faible",
          status: "variable",
          note: "Poste principal de l'investissement réel.",
          sources: ["cilas"],
        },
        {
          label: "Logique économique",
          value: "Inverser le ratio d'échange de coût face aux drones",
          confidence: "moyenne",
          sources: ["crs-dew"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le programme est porté par la Direction générale de l'armement dans le cadre du marché de lutte anti-drone L2AD. Le financement est intégralement étatique : recherche depuis 2017, prototypage, puis commande.\n\nLa notification d'une commande de systèmes supplémentaires pour équiper les armées marque le passage d'une logique de démonstration à une logique d'équipement — le signal financier le plus net qu'un laser puisse recevoir.",
      indicators: [
        {
          label: "Maître d'ouvrage",
          value: "Direction générale de l'armement (DGA)",
          confidence: "haute",
          sources: ["min-armees", "theatrum-l2ad"],
        },
        {
          label: "Cadre contractuel",
          value: "Marché de lutte anti-drone L2AD",
          confidence: "haute",
          sources: ["theatrum-l2ad"],
        },
        {
          label: "Stade budgétaire",
          value: "Prototype opérationnel puis commande supplémentaire",
          confidence: "moyenne",
          sources: ["theatrum-l2ad"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne de HELMA-P est l'un de ses atouts souverains : CILAS, spécialiste français du laser, maîtrise la source et la conduite de faisceau ; l'intégration reste nationale.\n\nCette autonomie limite les leviers de pression extérieurs. L'enjeu industriel central n'est pas la dépendance, mais la montée en cadence — passer d'un prototype à une production régulière.",
      indicators: [
        {
          label: "Maître d'œuvre",
          value: "CILAS — spécialiste français du laser",
          confidence: "haute",
          sources: ["cilas"],
        },
        {
          label: "Sous-systèmes critiques",
          value: "Source laser, conduite de faisceau, optronique de poursuite",
          confidence: "moyenne",
          sources: ["cilas"],
        },
        {
          label: "Dépendance étrangère",
          value: "Faible — capacité largement souveraine",
          confidence: "moyenne",
          sources: ["cilas"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "HELMA-P répond à une mutation : la prolifération de drones légers, accessibles et difficiles à traiter par des moyens classiques. En s'en dotant, la France acquiert une capacité souveraine de protection de sites et d'événements.\n\nLe système s'inscrit dans une architecture multicouche — détection, brouillage, canons, missiles, sécurité aérienne — où le laser occupe la couche basse, et non le rôle de bouclier.",
      indicators: [
        {
          label: "Fonction stratégique",
          value: "Capacité souveraine de lutte anti-drone",
          confidence: "haute",
          sources: ["min-armees"],
        },
        {
          label: "Place dans la défense",
          value: "Effecteur de couche basse, complémentaire",
          confidence: "haute",
          sources: ["crs-dew"],
        },
        {
          label: "Moteur stratégique",
          value: "Prolifération des drones et protection d'événements",
          confidence: "haute",
          sources: ["crs-dew"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "HELMA-P est d'abord une capacité nationale. Un export vers des partenaires proches est crédible, mais l'énergie dirigée reste un domaine technologiquement sensible : sources laser, optiques et logiciels de conduite de tir peuvent relever de contrôles à l'exportation.\n\nÀ ce stade, l'emploi documenté est français ; tout transfert resterait soumis à l'autorisation de l'État et à l'arbitrage politique.",
      indicators: [
        {
          label: "Statut export",
          value: "Capacité nationale — pas d'export documenté",
          confidence: "moyenne",
          sources: ["cilas"],
        },
        {
          label: "Sensibilité",
          value: "Composants laser et optroniques sous contrôle possible",
          confidence: "moyenne",
          sources: ["crs-dew"],
        },
        {
          label: "Marché potentiel",
          value: "Partenaires européens et alliés proches",
          confidence: "faible",
          status: "variable",
          sources: ["cilas"],
        },
      ],
    },
  ],
  physicalConstraints: [
    {
      label: "Ligne de visée",
      value: "Indispensable — la cible doit être vue et suivie en continu",
      confidence: "haute",
      sources: ["crs-dew"],
    },
    {
      label: "Atmosphère",
      value: "Pluie, brouillard, fumée et turbulence dégradent la portée utile",
      confidence: "haute",
      sources: ["crs-dew"],
    },
    {
      label: "Temps d'illumination",
      value: "Le faisceau doit rester sur la cible plusieurs secondes",
      confidence: "moyenne",
      note: "Le dwell time croît avec la distance et la robustesse de la cible.",
      sources: ["crs-dew"],
    },
    {
      label: "Refroidissement",
      value: "Limite la cadence de tir et l'intégration mobile",
      confidence: "moyenne",
      sources: ["crs-dew"],
    },
    {
      label: "Puissance disponible",
      value: "≈ 2 kW — contrainte de la plateforme et de l'alimentation",
      confidence: "moyenne",
      sources: ["army-tech"],
    },
    {
      label: "Sécurité laser",
      value: "Zones d'exclusion et risque oculaire encadrent l'emploi",
      confidence: "moyenne",
      sources: ["crs-dew"],
    },
    {
      label: "Effet sur la cible",
      value: "Mise hors d'usage par échauffement de la structure ou des capteurs",
      confidence: "moyenne",
      sources: ["cilas"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Coût marginal par tir très faible et rôle clair contre les drones légers ; l'efficacité dépend toutefois de la météo et du temps d'illumination.",
    },
    {
      key: "survivabilite",
      grade: "C",
      rationale:
        "Effecteur de site, transportable mais peu mobile en emploi ; sa survie tient à son intégration dans un dispositif protégé.",
    },
    {
      key: "exportabilite",
      grade: "C",
      rationale:
        "Capacité souveraine exportable vers des alliés proches, mais l'énergie dirigée reste politiquement et technologiquement sensible.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "CILAS maîtrise la source laser et la chaîne reste nationale ; le risque tient à la montée en cadence, pas à la dépendance.",
    },
    {
      key: "maturite",
      grade: "B",
      rationale:
        "Engagé dans un dispositif réel de protection d'événement et suivi d'une commande supplémentaire — au-delà du démonstrateur, sans être encore un parc.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "Sources industrielles et institutionnelles convergentes ; certaines performances de portée restent des ordres de grandeur.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un rayon qui pulvérise instantanément n'importe quel drone. La réalité : HELMA-P est un effecteur de 2 kW à courte portée, efficace contre de petits drones, qui exige une ligne de visée, plusieurs secondes d'illumination et une météo favorable.",
    bestUseCase:
      "La protection de sites fixes et de grands événements contre les drones légers et mini-drones, intégré à un dispositif anti-drone multicouche associant détection, brouillage et armes cinétiques.",
    weakPoint:
      "La dépendance à l'atmosphère et le traitement séquentiel des cibles : une attaque en saturation, par de nombreux drones simultanés, met l'effecteur en difficulté.",
    analystNote:
      "La valeur de HELMA-P tient moins à sa puissance brute qu'au franchissement d'un seuil : la France est passée du démonstrateur à l'emploi réel. La commande de systèmes supplémentaires par la DGA est le signal à suivre — c'est lui, et non un record de portée, qui fait entrer le laser anti-drone dans l'équipement des forces.",
  },
  legalNote:
    "Le Protocole IV de la Convention sur certaines armes classiques interdit les armes laser spécifiquement conçues pour provoquer une cécité permanente. HELMA-P vise des drones, et non des personnels ; le CICR rappelle néanmoins l'obligation de précaution pour éviter d'aveugler lors de l'emploi de tout système laser.",
  operators: ["France"],
  theatres: [
    "France — protection d'événement",
    "Méditerranée — essais embarqués (frégate Forbin)",
  ],
  timeline: [
    {
      date: "2017",
      label: "Lancement du développement de HELMA-P dans le cadre du marché L2AD.",
      kind: "jalon",
    },
    {
      date: "2021",
      label: "Essais au sol concluants contre des cibles drones.",
      kind: "jalon",
    },
    {
      date: "2022",
      label: "La DGA notifie à CILAS le marché de lutte anti-drone L2AD.",
      kind: "jalon",
    },
    {
      date: "2023",
      label: "Campagne d'essais en mer depuis la frégate de défense aérienne Forbin.",
      kind: "emploi",
    },
    {
      date: "2024",
      label: "Emploi en protection anti-drone d'un grand événement en France.",
      kind: "emploi",
    },
    {
      date: "2024",
      label: "La DGA commande des systèmes supplémentaires pour les forces armées.",
      kind: "jalon",
    },
  ],
  sources: [
    {
      id: "cilas",
      title: "HELMA-P — page système",
      publisher: "CILAS",
      type: "constructeur",
      reliability: "B",
      url: "https://www.cilas.com/laser/helma-p",
    },
    {
      id: "min-armees",
      title: "HELMA-P",
      publisher: "Ministère des Armées",
      type: "officiel",
      reliability: "A",
      url: "https://www.defense.gouv.fr/en/helma-p",
    },
    {
      id: "dga-forbin",
      title:
        "Succès de l'essai du laser HELMA-P sur la frégate Forbin",
      publisher: "Marine & Océans",
      type: "presse",
      reliability: "C",
      url: "https://marine-oceans.com/les-infos-mer-de-mo/succes-du-test-du-laser-haute-energie-a-applications-multiples-puissance-helma-p-sur-la-fregate-de-defense-aerienne-forbin/",
    },
    {
      id: "theatrum-l2ad",
      title: "La DGA commande trois nouvelles armes laser anti-drones à CILAS",
      publisher: "Theatrum Belli",
      type: "presse",
      reliability: "C",
      url: "https://theatrum-belli.com/la-dga-commande-trois-nouvelles-armes-laser-anti-drones-a-cilas/",
    },
    {
      id: "army-tech",
      title: "HELMA-P Laser Counter-Drone Weapon System, France",
      publisher: "Army Technology",
      type: "presse",
      reliability: "C",
      url: "https://www.army-technology.com/projects/helma-p-laser-counter-drone-weapon-system-france/",
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
