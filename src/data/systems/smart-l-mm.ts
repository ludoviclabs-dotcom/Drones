import type { DefenseSystem } from "../types";

export const smartLMm: DefenseSystem = {
  slug: "smart-l-mm",
  name: "SMART-L MM",
  designation: "Signal Multibeam Acquisition Radar for Tracking — Long range, Multi-Mission",
  reference: "PNP-RD-010",
  category: "radar",
  radarRole: "alerte-avancee",
  classLabel:
    "Radar bande L naval / terrestre — alerte avancée longue portée, surveillance et défense antimissile balistique",
  country: "Pays-Bas",
  flag: "🇳🇱",
  manufacturer: "Thales Nederland",
  introduced: "2019 (variante MM en service)",
  status:
    "En service — équipe les frégates Air Defence and Command néerlandaises, danoises (Iver Huitfeldt), version terrestre déployée pour la défense antimissile",
  acquisitionModes: ["DCS", "cooperatif"],
  tagline:
    "Le radar bande L naval qui voit à 2000 km en BMD — l'œil européen de l'alerte avancée balistique, mature, navalisé et progressivement déployé au sol.",
  summary:
    "Le SMART-L MM est la modernisation du radar bande L naval SMART-L conçu par Thales Nederland. La variante MM (Multi-Mission) étend significativement les capacités d'alerte avancée balistique : portée publique annoncée jusqu'à 2 000 km en mode BMD, contre 400 km en mode surveillance aérienne classique. Une variante terrestre (SMART-L MM/N) est déployée pour la défense antimissile.\n\nLa fiche SMART-L MM est, pour Panoplie, celle de l'alerte avancée navale européenne. C'est l'un des très rares radars BMD non américains en service dans l'OTAN, et le seul capable d'alimenter une chaîne d'alerte avancée balistique entièrement européenne depuis la mer. Sa diffusion progressive — frégates néerlandaises, danoises, allemandes, françaises (Horizon), britanniques (Type 45 partiellement) — fait du SMART-L un point d'ancrage majeur de l'IAMD navale alliée.",
  keySpecs: [
    {
      label: "Architecture",
      value:
        "Radar bande L — antenne tournante longue portée, modernisation MM à panneau électroniquement orientable",
      confidence: "haute",
      sources: ["thales-smart-l"],
    },
    {
      label: "Portée publique",
      value:
        "≈ 400 km en surveillance aérienne classique ; jusqu'à 2 000 km en BMD après upgrade MM",
      confidence: "moyenne",
      sources: ["thales-smart-l"],
    },
    {
      label: "Modes opératoires",
      value:
        "Surveillance air longue portée, alerte avancée BMD, suivi balistique, conduite de tir indirecte",
      confidence: "haute",
      sources: ["thales-smart-l"],
    },
    {
      label: "Variantes documentées",
      value:
        "SMART-L (originale, naval) — SMART-L MM (Multi-Mission, BMD étendu) — SMART-L MM/N (terrestre, défense antimissile)",
      confidence: "haute",
      sources: ["thales-smart-l"],
    },
    {
      label: "Plateformes navales",
      value:
        "ADCF (Pays-Bas), Iver Huitfeldt (Danemark), Horizon (France et Italie — SMART-L original), Type 45 (UK, partiel), futures FACTAS (Allemagne)",
      confidence: "haute",
      sources: ["thales-smart-l"],
    },
    {
      label: "Intégration C2",
      value:
        "NATINAMDS, IAMD navale OTAN, C2 nationaux",
      confidence: "haute",
      sources: ["thales-smart-l", "nato-iamd-radar"],
    },
    {
      label: "Technologie RF",
      value:
        "Modules T/R sur la variante MM — détail GaN non précisé homogène",
      confidence: "moyenne",
      status: "a-recouper",
      sources: ["thales-smart-l"],
    },
    {
      label: "PRF, formes d'onde, algorithmes de discrimination BMD",
      value: "Non précisé publiquement",
      confidence: "faible",
      status: "variable",
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le coût SMART-L MM n'est pas publié de façon homogène. Comme pour Sea Fire, le radar est intégré dans le coût total des frégates ou des installations terrestres. Les ordres de grandeur communément cités estiment le coût capteur entre 50 et 100 M€ par installation, avec une part importante consacrée à l'antenne longue portée et au traitement BMD.\n\nLe coût pluriannuel du MCO est significatif compte tenu de la complexité du capteur et de la rareté des bandes L navalisées. Les programmes de modernisation MM ont représenté plusieurs centaines de millions d'euros répartis entre Pays-Bas, Allemagne, Danemark et autres clients européens.",
      indicators: [
        {
          label: "Coût installation — estimation",
          value: "≈ 50 à 100 M€ par capteur intégré selon variante et lot",
          confidence: "faible",
          status: "variable",
          sources: ["thales-smart-l"],
        },
        {
          label: "Coût programme de modernisation MM",
          value:
            "Plusieurs centaines de millions d'euros répartis entre clients européens",
          confidence: "moyenne",
          sources: ["press-smart-l-export"],
        },
        {
          label: "MCO pluriannuel",
          value:
            "Significatif — antenne complexe, traitement BMD, rareté des bandes L navalisées",
          confidence: "moyenne",
          sources: ["thales-smart-l"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le SMART-L MM est financé par les marines nationales clientes, avec contributions partielles OTAN sur certains segments d'alerte avancée navale. Thales Nederland en a fait l'un de ses produits-phares radar, en héritage direct des compétences historiques de Hengelo en radar naval longue portée.\n\nLa modernisation MM a été lancée en partage entre les marines néerlandaise, allemande et danoise, avec une logique de mutualisation industrielle. La transparence financière reste limitée comparée aux programmes US, conforme à la pratique européenne sur les contrats radar navals.",
      indicators: [
        {
          label: "Financeurs principaux",
          value:
            "Marines nationales (Pays-Bas, Allemagne, Danemark, France via SMART-L original) + cofinancement OTAN partiel",
          confidence: "haute",
          sources: ["thales-smart-l", "nato-iamd-radar"],
        },
        {
          label: "Logique de mutualisation",
          value:
            "Programme de modernisation MM en partage entre marines européennes — mutualisation industrielle",
          confidence: "haute",
          sources: ["thales-smart-l"],
        },
        {
          label: "Transparence budgétaire",
          value:
            "Limitée — contrats publiés au cas par cas, conforme à la pratique européenne",
          confidence: "moyenne",
          sources: ["press-smart-l-export"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne SMART-L est entièrement européenne, structurée par Thales Nederland (héritage Hengelo) en partenariat avec d'autres sites Thales France et Royaume-Uni. La rareté des compétences en radar bande L navalisé longue portée fait de Thales Nederland un acteur quasi unique de ce segment en Europe. C'est un actif industriel critique pour la souveraineté radar navale européenne.\n\nLe risque industriel principal est celui de la base de compétences spécialisées : un capteur bande L navalisé exige des savoir-faire spécifiques sur la propagation, les guides d'onde, et l'intégration au système de combat. Le renouvellement des ingénieurs et la cadence de production face à la demande européenne post-2022 sont des points d'attention.",
      indicators: [
        {
          label: "Empreinte industrielle",
          value:
            "Thales Nederland (Hengelo héritage) + sites Thales France / UK — chaîne européenne",
          confidence: "haute",
          sources: ["thales-smart-l"],
        },
        {
          label: "Compétences critiques",
          value:
            "Radar bande L navalisé longue portée — savoir-faire rare en Europe",
          confidence: "haute",
          sources: ["thales-smart-l"],
        },
        {
          label: "Risque industriel principal",
          value:
            "Base de compétences spécialisées ; cadence face à la demande post-2022 ; renouvellement ingénieur",
          confidence: "moyenne",
          sources: ["thales-smart-l"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Le SMART-L MM est l'un des très rares capteurs BMD non américains crédibles dans l'OTAN. Son adoption par plusieurs marines alliées en fait un point d'ancrage majeur pour une chaîne d'alerte avancée balistique européenne. C'est un actif géopolitique de premier plan, particulièrement utile dans la perspective d'une autonomie stratégique européenne.\n\nLa diffusion progressive du SMART-L MM/N terrestre (déploiements documentés aux Pays-Bas) renforce cette logique. Pour Panoplie, SMART-L documente concrètement la viabilité d'une alerte avancée BMD européenne — un sujet politiquement très sensible, traité par les industriels et les États sans publicité excessive.",
      indicators: [
        {
          label: "Position stratégique",
          value:
            "Très rare capteur BMD non américain crédible dans l'OTAN — actif géopolitique majeur",
          confidence: "haute",
          sources: ["thales-smart-l", "nato-iamd-radar"],
        },
        {
          label: "Souveraineté capteur",
          value:
            "Hors ITAR — chaîne européenne, contrôle baseline et algorithmes",
          confidence: "haute",
          sources: ["thales-smart-l"],
        },
        {
          label: "Effet d'écosystème",
          value:
            "Point d'ancrage pour une chaîne d'alerte avancée balistique européenne",
          confidence: "moyenne",
          sources: ["thales-smart-l"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "L'export SMART-L MM est limité aux marines alliées européennes et à quelques partenaires hors Europe. Les clients confirmés couvrent Pays-Bas (ADCF), Danemark (Iver Huitfeldt), Allemagne (futures FACTAS / F126), France et Italie (Horizon avec SMART-L original), Royaume-Uni (Type 45 partiellement). La modernisation MM est déployée progressivement.\n\nLe régime applicable cumule Position commune UE 2008/944/PESC, contrôle néerlandais, et Wassenaar sur les composants RF avancés et les algorithmes BMD. L'exportabilité reste modérée à élevée pour les marines alliées européennes, faible pour les autres compte tenu de la sensibilité BMD.",
      indicators: [
        {
          label: "Canal d'export dominant",
          value:
            "DCS via Thales Nederland — coopératif au sein de l'OTAN, partenariats industriels selon cas",
          confidence: "haute",
          sources: ["thales-smart-l"],
        },
        {
          label: "Clients export documentés",
          value:
            "Pays-Bas, Danemark, Allemagne (en intégration), France / Italie (SMART-L original), Royaume-Uni (Type 45 partiel), Singapour, Émirats arabes unis",
          confidence: "haute",
          sources: ["press-smart-l-export"],
        },
        {
          label: "Régime applicable",
          value:
            "Position commune UE + contrôle néerlandais + Wassenaar (BMD particulièrement sensible)",
          confidence: "haute",
          sources: ["wassenaar-list"],
        },
      ],
    },
  ],
  integrationFrameworks: [
    "NATINAMDS",
    "IAMD navale OTAN",
    "Aster / SAMP-T (cohérence intercepteur)",
    "C2 nationaux multiples",
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Coût élevé compensé par la double mission alerte avancée + BMD partiel — pas de substitut crédible non américain à ce périmètre fonctionnel.",
    },
    {
      key: "survivabilite",
      grade: "C",
      rationale:
        "Capteur naval ou semi-fixe, antenne rotative, signature électromagnétique forte ; vulnérabilité physique sensible sur plateforme exposée.",
    },
    {
      key: "exportabilite",
      grade: "B",
      rationale:
        "Hors ITAR mais sensibilité BMD élevée — exportabilité bonne pour les marines alliées européennes, modérée au-delà.",
    },
    {
      key: "risque-industriel",
      grade: "C",
      rationale:
        "Base de compétences bande L navalisée rare en Europe ; pression de renouvellement ingénieur et cadence post-2022.",
    },
    {
      key: "maturite",
      grade: "A",
      rationale:
        "Famille en service depuis les années 1990 (SMART-L original), modernisation MM en service depuis 2019, plusieurs marines alliées équipées.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "Sources Thales abondantes sur le rôle et l'architecture, mais paramètres BMD précis classifiés.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un radar qui voit à 2000 km. La réalité : un radar bande L excellent dont la portée nominale dépend fortement de la cible (ogive, leurre, débris), des conditions de propagation et du mode opératoire. La capacité BMD est partielle et complémentaire des grands radars terrestres.",
    bestUseCase:
      "Doter une marine alliée européenne d'une capacité d'alerte avancée balistique navale crédible, hors ITAR, intégrable dans NATINAMDS et compatible avec les intercepteurs Aster ou SM-3.",
    weakPoint:
      "Capteur lourd, antenne tournante (en mode classique), peu adapté à la furtivité électromagnétique. Sensibilité BMD qui peut compliquer les exports hors OTAN.",
    analystNote:
      "SMART-L MM est un cas-école Panoplie : un capteur stratégique non américain qui documente concrètement la viabilité d'une chaîne BMD européenne. Sa montée en puissance et son adoption par l'Allemagne (futures FACTAS) seront des indicateurs structurants pour la décennie 2030.",
  },
  operators: [
    "Pays-Bas (Air Defence and Command Frigates — De Zeven Provinciën class)",
    "Danemark (Iver Huitfeldt class)",
    "France (Horizon — SMART-L original, modernisation en cours)",
    "Italie (Horizon — SMART-L original)",
    "Royaume-Uni (Type 45 — capteur S1850M dérivé)",
    "Allemagne (futures FACTAS / F126)",
    "Singapour",
    "Émirats arabes unis",
    "Pays-Bas terrestre (déploiement SMART-L MM/N — défense antimissile)",
  ],
  theatres: [
    "Atlantique nord — patrouille IAMD navale OTAN",
    "Méditerranée — défense aérienne navale alliée",
    "Mer du Nord — surveillance et alerte avancée",
    "Pays-Bas continental — déploiement terrestre BMD",
  ],
  timeline: [
    {
      date: "2000",
      label:
        "Premier déploiement SMART-L original — frégates Horizon et De Zeven Provinciën.",
      kind: "jalon",
    },
    {
      date: "2012",
      label:
        "Lancement officiel du programme SMART-L MM — modernisation BMD étendue.",
      kind: "jalon",
    },
    {
      date: "2019",
      label:
        "Première variante SMART-L MM en service — frégate Tromp (Pays-Bas).",
      kind: "jalon",
    },
    {
      date: "2021",
      label:
        "Déploiement SMART-L MM/N terrestre aux Pays-Bas — couverture BMD continentale.",
      kind: "emploi",
    },
    {
      date: "2025",
      label:
        "Intégration progressive aux futures FACTAS allemandes — extension du réseau européen.",
      kind: "export",
    },
  ],
  sources: [
    {
      id: "thales-smart-l",
      title: "SMART-L MM — page Thales",
      publisher: "Thales",
      type: "constructeur",
      reliability: "B",
      url: "https://www.thalesgroup.com/en/smart-l-mm",
    },
    {
      id: "nato-iamd-radar",
      title:
        "NATINAMDS et capteurs alliés d'alerte avancée — communications OTAN",
      publisher: "OTAN",
      type: "officiel",
      reliability: "A",
      url: "https://www.nato.int/cps/en/natohq/topics_8206.htm",
    },
    {
      id: "press-smart-l-export",
      title:
        "SMART-L MM — exports et déploiements (presse spécialisée défense)",
      publisher: "Presse spécialisée défense",
      type: "presse",
      reliability: "B",
    },
    {
      id: "wassenaar-list",
      title:
        "Arrangement de Wassenaar — listes de biens et technologies à double usage",
      publisher: "Secrétariat de Wassenaar",
      type: "officiel",
      reliability: "A",
      url: "https://www.wassenaar.org/",
    },
  ],
  updated: "2026-05-27",
};
