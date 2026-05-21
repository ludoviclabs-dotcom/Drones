import type { DefenseSystem } from "../types";

export const wingLoong2: DefenseSystem = {
  slug: "wing-loong-2",
  name: "Wing Loong II",
  designation: "GJ-2",
  reference: "PNP-DR-007",
  category: "drone",
  droneClass: "MALE",
  classLabel: "Drone MALE armé",
  country: "Chine",
  flag: "🇨🇳",
  manufacturer: "Chengdu Aircraft Industry Group (AVIC)",
  introduced: "2018",
  status: "En service — exporté massivement",
  acquisitionModes: ["DCS"],
  tagline:
    "La réponse chinoise au Reaper — moins capable, mais quinze fois moins chère et libre de tout régime de non-prolifération.",
  summary:
    "Le Wing Loong II de Chengdu (CAIG/AVIC) est le drone MALE armé le plus exporté de la famille chinoise. Conçu comme une réponse directe au MQ-9 Reaper, ce vecteur de 4,2 tonnes combine endurance, capteurs EO/IR et SAR, et six points durs sous une cellule entièrement d'origine chinoise — moteur WJ-9A et armements compris.\n\nSa singularité n'est pas technique mais politique : la Chine n'est pas signataire du Régime de contrôle de la technologie des missiles. Là où Washington opposait un refus, Pékin a livré — aux Émirats, à l'Arabie saoudite, à l'Algérie, au Nigeria. Comprendre le Wing Loong II, c'est lire un instrument d'influence autant qu'un système d'armes.",
  keySpecs: [
    {
      label: "Masse maximale au décollage",
      value: "≈ 4 200 kg",
      confidence: "moyenne",
      sources: ["catic", "flightglobal-wl2"],
    },
    {
      label: "Endurance",
      value: "20–32 h",
      confidence: "faible",
      note: "Fourchette large selon les sources et la configuration ; valeur haute non vérifiée.",
      sources: ["flightglobal-wl2"],
    },
    {
      label: "Plafond opérationnel",
      value: "≈ 9 000 m",
      confidence: "moyenne",
      sources: ["catic"],
    },
    {
      label: "Charge utile",
      value: "400–480 kg",
      confidence: "moyenne",
      note: "Répartie sur six points durs.",
      sources: ["catic", "flightglobal-wl2"],
    },
    {
      label: "Liaison",
      value: "LOS ; SATCOM jusqu'à 3 000 km (option)",
      confidence: "faible",
      note: "La liaison satellite n'est pas toujours offerte sur les versions export.",
      sources: ["flightglobal-wl2"],
    },
    {
      label: "Motorisation",
      value: "WJ-9A indigène (turbopropulseur, ≈ 670 ch)",
      confidence: "moyenne",
      sources: ["catic"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le Wing Loong II est le price-leader du MALE armé exportable. Les think tanks situent la cellule autour de 1 à 2 M$ — un ordre de grandeur quinze fois inférieur à celui d'un Reaper. Ce ratio, plus que toute caractéristique technique, explique son succès commercial.\n\nCe chiffre reste une estimation, jamais un prix catalogue vérifié. Il s'agit d'un coût de cellule, non d'un système complet avec stations sol et soutien. Et l'écart de prix recouvre un écart de capacité : la version export est souvent dégradée, sans liaison satellite longue portée. Le Wing Loong II n'est pas un Reaper bon marché — c'est un produit différent, calibré pour un autre marché.",
      indicators: [
        {
          label: "Coût unitaire (cellule)",
          value: "≈ 1–2 M$",
          confidence: "faible",
          status: "variable",
          note: "Estimation think tank (CSIS ChinaPower, Takshashila) ; pas de prix catalogue public.",
          sources: ["csis-chinapower", "takshashila"],
        },
        {
          label: "Ratio de prix face au MQ-9",
          value: "≈ 1:15",
          confidence: "faible",
          status: "variable",
          note: "Comparaison cellule à cellule ; les périmètres ne sont pas strictement homogènes.",
          sources: ["csis-chinapower", "flightglobal-wl2"],
        },
        {
          label: "Périmètre du chiffre cité",
          value: "Cellule seule — hors stations sol et soutien",
          confidence: "moyenne",
          sources: ["takshashila"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "L'acquisition d'un Wing Loong II est financée sur le budget national du client, sans canal intermédiaire de type FMS. La commercialisation passe par CATIC, le bras export du complexe aéronautique chinois.\n\nL'attrait du modèle chinois tient autant aux conditions de paiement qu'au prix : Pékin est réputé pour des modalités souples, parfois adossées à des accords plus larges de coopération industrielle ou de production locale. C'est un argument commercial décisif face à des clients aux budgets contraints et à l'accès limité aux financements occidentaux.",
      indicators: [
        {
          label: "Cadre de financement",
          value: "Budget national du client ; pas de canal d'État intermédiaire",
          confidence: "moyenne",
          sources: ["sipri-at"],
        },
        {
          label: "Canal commercial",
          value: "Vente directe via CATIC",
          confidence: "moyenne",
          sources: ["catic", "sipri-at"],
        },
        {
          label: "Conditions de paiement",
          value: "Réputées souples ; parfois liées à la production locale",
          confidence: "faible",
          status: "a-recouper",
          note: "Pratique documentée de façon fragmentaire ; conditions rarement publiées.",
          sources: ["takshashila"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne du Wing Loong II est une force assumée. Contrairement au Wing Loong I, tributaire d'un moteur Rotax autrichien, le II est entièrement chinois — turbopropulseur WJ-9A, capteurs, armements, navigation par satellite BeiDou. Aucun composant occidental, donc aucun levier d'embargo extérieur.\n\nCette autonomie est le pendant industriel de l'argument export : Pékin peut livrer sans dépendre d'une autorisation tierce. La contrepartie tient à la maturité encore inégale de certains sous-systèmes indigènes par rapport aux références occidentales — une question de performance, non d'approvisionnement.",
      indicators: [
        {
          label: "Maître d'œuvre",
          value: "Chengdu Aircraft Industry Group (AVIC)",
          confidence: "haute",
          sources: ["catic"],
        },
        {
          label: "Composants critiques",
          value: "Moteur WJ-9A, capteurs, armements et BeiDou — d'origine chinoise",
          confidence: "moyenne",
          sources: ["catic", "flightglobal-wl2"],
        },
        {
          label: "Dépendance étrangère",
          value: "Quasi nulle — base industrielle nationale intégrée",
          confidence: "moyenne",
          note: "Rupture nette avec le Wing Loong I et son moteur Rotax autrichien.",
          sources: ["takshashila"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Vendre un Wing Loong II, c'est ouvrir une relation. Le drone est devenu un levier d'influence chinois au Moyen-Orient, en Afrique subsaharienne, en Asie centrale et du Sud — souvent auprès de clients que Washington avait refusés.\n\nCet instrument a un coût réputationnel. En Libye, des Wing Loong II opérés depuis la base d'Al-Khadim ont été employés dans des frappes meurtrières, dont celle d'une académie militaire de Tripoli en janvier 2020 — et leur transfert via les Émirats a été documenté comme une violation de l'embargo de l'ONU. La diffusion du système alimente un débat sur la responsabilité dans les transferts d'armes.",
      indicators: [
        {
          label: "Fonction stratégique",
          value: "Levier d'influence sur les marchés MENA, Afrique et Asie",
          confidence: "moyenne",
          sources: ["takshashila", "dronewars-uk"],
        },
        {
          label: "Clients refusés par Washington",
          value: "Accès assumé — argument commercial central",
          confidence: "moyenne",
          sources: ["takshashila"],
        },
        {
          label: "Controverse documentée",
          value: "Frappes meurtrières en Libye ; transfert en violation de l'embargo ONU",
          confidence: "moyenne",
          status: "a-recouper",
          note: "Documenté par enquêtes de presse et panel d'experts ONU ; attributions parfois disputées.",
          sources: ["bbc-africaeye", "dronewars-uk"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "L'export est la raison d'être du Wing Loong II — et son avantage décisif est juridique. Par ses caractéristiques, le drone relève de la catégorie I du MTCR, la plus restrictive. Mais la Chine n'est pas signataire du régime : observateur depuis 2004, sa demande d'adhésion a été rejetée. Pékin n'est donc liée par aucune présomption de refus.\n\nLà où un Reaper exige une autorisation américaine, un certificat d'utilisateur final et des restrictions d'emploi, le Wing Loong II s'achète sans ces verrous. Cette liberté est l'argument de vente le plus puissant du système : elle lui ouvre, par construction, le marché des États écartés des fournisseurs occidentaux.",
      indicators: [
        {
          label: "Régime applicable",
          value: "MTCR catégorie I — mais la Chine n'en est pas signataire",
          confidence: "haute",
          sources: ["mtcr-ref", "takshashila"],
        },
        {
          label: "Statut de la Chine au MTCR",
          value: "Observateur depuis 2004 ; demande d'adhésion rejetée",
          confidence: "haute",
          sources: ["mtcr-ref"],
        },
        {
          label: "Marge d'emploi de l'acheteur",
          value: "Large — pas de certificat d'utilisateur final imposé",
          confidence: "moyenne",
          sources: ["takshashila"],
        },
        {
          label: "Diffusion",
          value: "Opérateurs sur quatre continents",
          confidence: "moyenne",
          sources: ["sipri-at", "dronewars-uk"],
        },
      ],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Le meilleur rapport capacité/prix du MALE armé exportable : capacités correctes pour une cellule estimée quinze fois moins chère qu'un Reaper.",
    },
    {
      key: "survivabilite",
      grade: "D",
      rationale:
        "Lent, peu furtif, tributaire de liaisons brouillables. Plusieurs appareils abattus en Libye et au Yémen face à des défenses sol-air même limitées.",
    },
    {
      key: "exportabilite",
      grade: "A",
      rationale:
        "Avantage structurel : hors MTCR, sans certificat d'utilisateur final ni autorisation tierce. Déjà diffusé sur quatre continents.",
    },
    {
      key: "risque-industriel",
      grade: "A",
      rationale:
        "Chaîne entièrement chinoise depuis le moteur WJ-9A ; aucune dépendance étrangère exposée à un embargo.",
    },
    {
      key: "maturite",
      grade: "B",
      rationale:
        "En service depuis 2018, combat-proven en Libye, au Yémen et au Sahel ; doctrine d'emploi établie, mais recul plus court qu'un Reaper.",
    },
    {
      key: "confiance-donnees",
      grade: "C",
      rationale:
        "Caractéristiques et coûts reposent sur des estimations think tank et des sources secondaires ; les versions export dégradées brouillent la lecture.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un Reaper chinois à prix cassé. La réalité : un MALE armé aux capacités correctes mais inférieures, dont la version export est souvent amputée de la liaison satellite longue portée. Son avantage réel n'est pas le rapport qualité/prix de la cellule — c'est l'absence de tout verrou à l'exportation.",
    bestUseCase:
      "Surveillance armée et frappe de précision dans un environnement peu ou pas contesté, pour un État au budget contraint ou écarté des fournisseurs occidentaux : contre-insurrection, contrôle de zone, frappes ciblées.",
    weakPoint:
      "La survivabilité face à une défense aérienne sérieuse. La Libye l'a montré : plusieurs Wing Loong II ont été abattus, et les versions export dégradées limitent la portée d'emploi sécurisée.",
    analystNote:
      "Le Wing Loong II est moins un objet technique qu'un instrument de politique étrangère. Sa diffusion mesure, mieux qu'aucun autre système, l'effet d'un non-alignement sur un régime de non-prolifération : là où le MTCR contraint les Occidentaux, la Chine livre. Pour Panoplie, c'est le cas d'école du levier d'export comme arme géopolitique — et un rappel que le contrôle des transferts ne vaut que si les principaux fournisseurs y souscrivent.",
  },
  operators: [
    "Émirats arabes unis",
    "Arabie saoudite",
    "Égypte",
    "Algérie",
    "Pakistan",
    "Nigeria",
    "Turkménistan",
  ],
  theatres: ["Libye", "Yémen", "Sinaï", "Nigeria"],
  timeline: [
    { date: "2004", label: "La Chine devient observateur du MTCR ; sa demande d'adhésion sera rejetée.", kind: "debat" },
    { date: "2018", label: "Entrée en service du Wing Loong II, exporté massivement.", kind: "jalon" },
    { date: "2020-01", label: "Frappe meurtrière contre une académie militaire de Tripoli par des Wing Loong II opérés en Libye.", kind: "emploi" },
    { date: "2020", label: "Transfert via les Émirats documenté comme une violation de l'embargo de l'ONU sur la Libye.", kind: "debat" },
  ],
  sources: [
    {
      id: "catic",
      title: "Wing Loong II — documentation export",
      publisher: "China National Aero-Technology Import & Export Corporation (CATIC)",
      type: "constructeur",
      reliability: "C",
    },
    {
      id: "csis-chinapower",
      title: "ChinaPower Project — technologies de drones chinois",
      publisher: "CSIS",
      type: "think-tank",
      reliability: "B",
      url: "https://chinapower.csis.org",
    },
    {
      id: "takshashila",
      title: "Discussion Document 2025-08 — drones armés chinois à l'export",
      publisher: "Takshashila Institution",
      type: "think-tank",
      reliability: "B",
      date: "2025-04",
    },
    {
      id: "flightglobal-wl2",
      title: "China's Wing Loong II and the export UAV market",
      publisher: "FlightGlobal",
      type: "presse",
      reliability: "B",
      date: "2019-06-14",
    },
    {
      id: "sipri-at",
      title: "Arms Transfers Database",
      publisher: "SIPRI",
      type: "institution",
      reliability: "A",
      url: "https://www.sipri.org/databases/armstransfers",
    },
    {
      id: "mtcr-ref",
      title: "Régime de contrôle de la technologie des missiles — partenaires et statut",
      publisher: "MTCR",
      type: "officiel",
      reliability: "A",
      url: "https://mtcr.info",
    },
    {
      id: "dronewars-uk",
      title: "Suivi de l'export et de l'emploi des drones armés chinois",
      publisher: "Drone Wars UK",
      type: "think-tank",
      reliability: "B",
      url: "https://dronewars.net",
    },
    {
      id: "bbc-africaeye",
      title: "Enquête sur l'emploi de drones étrangers dans le conflit libyen",
      publisher: "BBC Africa Eye",
      type: "presse",
      reliability: "B",
    },
  ],
  updated: "2026-05-21",
};
