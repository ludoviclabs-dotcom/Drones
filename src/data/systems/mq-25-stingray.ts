import type { DefenseSystem } from "../types";

export const mq25Stingray: DefenseSystem = {
  slug: "mq-25-stingray",
  name: "MQ-25 Stingray",
  designation: "MQ-25A",
  reference: "PNP-DR-006",
  category: "drone",
  droneClass: "ravitailleur",
  classLabel: "Ravitailleur embarqué",
  country: "États-Unis",
  flag: "🇺🇸",
  manufacturer: "Boeing",
  introduced: "Capacité opérationnelle visée fin FY2027",
  status: "En développement — phase d'essais, IOC glissée à fin FY2027",
  acquisitionModes: ["production-nationale"],
  tagline:
    "Le premier drone ravitailleur de pont — un programme qui rend leurs ailes aux chasseurs embarqués.",
  summary:
    "Le MQ-25A Stingray de Boeing est le tout premier drone ravitailleur conçu pour opérer depuis un porte-avions. Sa raison d'être est arithmétique : aujourd'hui, une part importante des F/A-18E/F d'un groupe aérien sert de citerne volante au lieu de combattre. Le Stingray doit reprendre cette corvée et restituer ces chasseurs à leur mission première.\n\nMais son intérêt dépasse le ravitaillement. En posant sur un pont d'envol un drone autonome capable de décoller, manœuvrer en formation et apponter, l'US Navy ouvre l'ère du combat embarqué sans pilote — une passerelle technique et doctrinale vers le futur chasseur F/A-XX. Le comprendre, c'est lire un programme de transition autant qu'un avion-citerne.",
  keySpecs: [
    {
      label: "Envergure (ailes repliées)",
      value: "≈ 9,4 m",
      confidence: "moyenne",
      note: "Configuration repliée pour le stockage sur pont ; envergure déployée non confirmée publiquement.",
      sources: ["boeing-mq25"],
    },
    {
      label: "Carburant transférable",
      value: "≈ 6 800 kg",
      confidence: "moyenne",
      note: "Soit 15 000–16 000 lb, livrables à plusieurs appareils à environ 500 nm du porte-avions.",
      sources: ["usni-mq25"],
    },
    {
      label: "Motorisation",
      value: "Rolls-Royce AE 3007N (turbofan)",
      confidence: "haute",
      sources: ["boeing-mq25", "crs-mq25"],
    },
    {
      label: "Vitesse de croisière",
      value: "≈ 740 km/h",
      confidence: "faible",
      note: "Estimation ; performances détaillées non publiées par l'US Navy.",
      sources: ["usni-mq25"],
    },
    {
      label: "Plafond opérationnel",
      value: "≈ 12 000 m",
      confidence: "faible",
      sources: ["usni-mq25"],
    },
    {
      label: "Points d'emport",
      value: "Pod de ravitaillement Cobham ARS + 2 points durs sous voilure",
      confidence: "moyenne",
      note: "Emport de deux missiles AGM-158C LRASM démontré en 2024 — capacité de frappe à l'étude, non doctrinale.",
      sources: ["boeing-mq25"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le MQ-25 illustre la dérive classique d'un programme de défense de premier de série. Le contrat initial de 2018 portait sur quatre exemplaires de développement pour environ 805 M$ ; l'US Navy promettait alors un drone sobre, dérivé d'un démonstrateur déjà volant.\n\nSept ans plus tard, le GAO chiffre l'acquisition unitaire autour de 209 M$ et le coût total du programme près de 15,9 Md$. Le glissement n'est pas un détail : il rapproche le ravitailleur autonome du prix d'un RQ-4 Global Hawk, et fragilise l'argument d'économie qui justifiait le programme. Les chiffres restent dispersés selon qu'on parle de cellule, de lot ou d'acquisition complète.",
      indicators: [
        {
          label: "Contrat initial de développement",
          value: "≈ 805 M$ (2018, 4 vecteurs EDM)",
          confidence: "haute",
          sources: ["crs-mq25"],
        },
        {
          label: "Coût d'acquisition unitaire",
          value: "≈ 209 M$",
          confidence: "faible",
          status: "variable",
          note: "Estimation GAO 2025, en hausse d'environ 4 % sur l'évaluation précédente ; donnée très récente.",
          sources: ["gao-wsaa"],
        },
        {
          label: "Coût total du programme",
          value: "≈ 15,9 Md$",
          confidence: "faible",
          status: "variable",
          note: "Évaluation GAO 2025, relayée par le CRS — périmètre programme complet.",
          sources: ["gao-wsaa", "crs-mq25"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le Stingray est intégralement porté par le budget de l'US Navy — un programme national, sans canal d'exportation ni cofinancement étranger. La demande de financement FY2025 atteignait environ 898 M$ pour le drone et son système de commande et de contrôle (UMCS).\n\nLe programme entre dans la phase délicate de la production initiale à bas régime (LRIP), encore en cours d'autorisation. Lancer la production avant l'achèvement des essais comprime le calendrier mais expose au risque de rétrofit : tout défaut révélé tardivement devra être corrigé sur des cellules déjà construites.",
      indicators: [
        {
          label: "Cadre de financement",
          value: "Budget de l'US Navy — programme national",
          confidence: "haute",
          sources: ["crs-mq25"],
        },
        {
          label: "Demande budgétaire FY2025",
          value: "≈ 898 M$ (MQ-25 + UMCS)",
          confidence: "moyenne",
          sources: ["crs-mq25"],
        },
        {
          label: "Étape contractuelle",
          value: "Production initiale (LRIP) en cours d'autorisation",
          confidence: "moyenne",
          status: "a-recouper",
          note: "Calendrier susceptible d'évoluer avec les arbitrages budgétaires du Congrès.",
          sources: ["crs-mq25"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne du MQ-25 est entièrement américaine, structurée autour de Boeing comme maître d'œuvre. L'industriel a inauguré en 2024 une usine dédiée d'environ 27 870 m² près de Saint-Louis, un investissement de quelque 200 M$ qui matérialise l'engagement de série.\n\nLes nœuds critiques restent nationaux : moteur AE 3007N de Rolls-Royce à Indianapolis, système de gestion du véhicule de BAE Systems, pod de ravitaillement Cobham. Cette base domestique limite l'exposition aux pressions extérieures, mais concentre le risque sur un seul intégrateur et sur la montée en cadence d'un outil industriel encore neuf.",
      indicators: [
        {
          label: "Maître d'œuvre",
          value: "Boeing — intégration à Saint-Louis",
          confidence: "haute",
          sources: ["boeing-mq25"],
        },
        {
          label: "Composants critiques",
          value: "Moteur Rolls-Royce (Indianapolis) · gestion véhicule BAE Systems · pod Cobham",
          confidence: "moyenne",
          sources: ["crs-mq25", "boeing-mq25"],
        },
        {
          label: "Outil industriel",
          value: "Usine dédiée ≈ 27 870 m² ouverte en 2024 (≈ 200 M$)",
          confidence: "moyenne",
          sources: ["boeing-mq25"],
        },
        {
          label: "Dépendance étrangère",
          value: "Faible — base industrielle nationale",
          confidence: "moyenne",
          sources: ["crs-mq25"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Le MQ-25 n'a pas de fonction diplomatique d'exportation : sa portée stratégique est interne à la marine américaine. En libérant les F/A-18E/F de la mission de ravitaillement, il augmente mécaniquement le rayon de combat du groupe aérien embarqué — un enjeu direct dans l'Indo-Pacifique, où la distance est l'adversaire premier.\n\nSa valeur la plus durable est doctrinale. En faisant entrer un appareil autonome dans le ballet d'un pont d'envol, l'US Navy valide les procédures, l'interface homme-machine et la confiance opérationnelle qui conditionneront le futur F/A-XX. Le Stingray est le galop d'essai de l'aéronavale sans pilote.",
      indicators: [
        {
          label: "Fonction stratégique",
          value: "Extension du rayon d'action du groupe aérien embarqué",
          confidence: "moyenne",
          sources: ["usni-mq25"],
        },
        {
          label: "Théâtre dimensionnant",
          value: "Indo-Pacifique — primauté de l'allonge",
          confidence: "moyenne",
          sources: ["usni-mq25"],
        },
        {
          label: "Apport doctrinal",
          value: "Passerelle vers l'aéronavale autonome (F/A-XX)",
          confidence: "moyenne",
          status: "a-recouper",
          sources: ["crs-mq25"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "Le MQ-25 n'est pas un produit d'exportation et ne le sera pas à court terme. C'est un système spécifique de l'US Navy, conçu pour ses porte-avions et son architecture de commande — il relève du régime ITAR, mais la question de l'autorisation ne se pose même pas faute de programme commercial.\n\nCe choix est cohérent : le Stingray est trop intriqué dans l'écosystème aéronaval américain pour être détaché, et l'US Navy a tout intérêt à conserver l'exclusivité d'une capacité unique au monde le temps d'en maîtriser l'emploi. Une éventuelle ouverture à l'export n'est pas envisagée à ce stade.",
      indicators: [
        {
          label: "Régime applicable",
          value: "ITAR — aucun programme d'exportation",
          confidence: "haute",
          sources: ["crs-mq25"],
        },
        {
          label: "Disponibilité à l'export",
          value: "Non envisagée à ce stade",
          confidence: "haute",
          sources: ["crs-mq25"],
        },
        {
          label: "Cause structurelle",
          value: "Système intégré aux porte-avions et à l'architecture US Navy",
          confidence: "moyenne",
          sources: ["usni-mq25"],
        },
      ],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "C",
      rationale:
        "La capacité — restituer des chasseurs à la mission de combat — est réelle et mesurable, mais la dérive du coût unitaire vers 209 M$ érode fortement l'argument d'économie initial.",
    },
    {
      key: "survivabilite",
      grade: "C",
      rationale:
        "Non furtif et tributaire de liaisons, il opère à l'arrière du dispositif, loin de la menace ; sa survie tient à son positionnement, non à des qualités défensives propres. Jamais éprouvé au combat.",
    },
    {
      key: "exportabilite",
      grade: "E",
      rationale:
        "Aucun programme d'exportation : système propre à l'US Navy, sous ITAR, indissociable de son écosystème aéronaval.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Chaîne nationale et maître d'œuvre unique, mais montée en cadence d'un outil industriel neuf et risque de rétrofit lié au lancement de production avant la fin des essais.",
    },
    {
      key: "maturite",
      grade: "C",
      rationale:
        "Premier vol franchi et ravitaillements en vol démontrés avec plusieurs types d'appareils, mais programme encore en essais, IOC glissée à fin FY2027 et aucun emploi opérationnel.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "Programme bien documenté par le GAO et le CRS ; coûts officiels publiés mais très récents et encore mouvants, performances de vol partiellement estimées.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un drone de combat embarqué qui inaugure l'aéronavale sans pilote. La réalité : le MQ-25 est avant tout un avion-citerne. Son rôle premier est de ravitailler, et la capacité de frappe — l'emport de LRASM démontré en 2024 — reste une piste d'évolution, pas une mission validée. C'est un programme de transition, pas encore le chasseur autonome qu'il annonce.",
    bestUseCase:
      "Le ravitaillement en vol organique d'un groupe aérien embarqué, pour rendre les F/A-18E/F à la mission de combat et étendre le rayon d'action de la flotte — particulièrement dans les vastes distances de l'Indo-Pacifique.",
    weakPoint:
      "Un programme de transition au calendrier glissé et au coût dérivé : l'IOC repoussée à fin FY2027 et une acquisition unitaire proche des 209 M$ affaiblissent la promesse d'économie. Le lancement de production avant la fin des essais ajoute un risque de rétrofit.",
    analystNote:
      "La vraie valeur du MQ-25 ne se lit pas dans sa fiche technique mais dans ce qu'il prépare. En faisant cohabiter un appareil autonome avec les opérations de pont, l'US Navy achète de l'expérience, des procédures et de la confiance pour le F/A-XX. À ce titre, même un programme cher et retardé peut être un investissement rationnel — à condition d'assumer qu'on paie une rampe d'accès, pas seulement un avion-citerne.",
  },
  operators: ["États-Unis (US Navy)"],
  theatres: ["Aucun — phase d'essais"],
  sources: [
    {
      id: "boeing-mq25",
      title: "MQ-25 Stingray — documentation programme",
      publisher: "Boeing",
      type: "constructeur",
      reliability: "B",
      url: "https://www.boeing.com/defense/mq25",
    },
    {
      id: "crs-mq25",
      title: "Navy MQ-25 Stingray Carrier-Based Aerial-Refueling Drone — CRS Insight IF12972",
      publisher: "Congressional Research Service",
      type: "officiel",
      reliability: "A",
      date: "2025-08",
    },
    {
      id: "gao-wsaa",
      title: "Weapon Systems Annual Assessment 2025",
      publisher: "U.S. Government Accountability Office",
      type: "officiel",
      reliability: "A",
      date: "2025-06",
      url: "https://www.gao.gov",
    },
    {
      id: "usni-mq25",
      title: "Analyses sur le programme MQ-25 et l'aéronavale sans pilote",
      publisher: "U.S. Naval Institute (USNI News)",
      type: "presse",
      reliability: "B",
      url: "https://news.usni.org",
    },
    {
      id: "navair-mq25",
      title: "MQ-25 Stingray — Naval Air Systems Command",
      publisher: "U.S. Navy (NAVAIR)",
      type: "officiel",
      reliability: "A",
    },
  ],
  updated: "2026-05-21",
};
