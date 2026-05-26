import type { DefenseSystem } from "../types";

export const pac3Mse: DefenseSystem = {
  slug: "pac-3-mse",
  name: "PAC-3 MSE",
  designation: "Patriot Advanced Capability-3 Missile Segment Enhancement",
  reference: "PNP-MSL-007",
  category: "missile",
  missileRole: "SAM",
  classLabel:
    "Intercepteur hit-to-kill — défense aérienne et antimissile balistique de théâtre",
  country: "États-Unis",
  flag: "🇺🇸",
  manufacturer: "Lockheed Martin",
  introduced: "2015",
  status:
    "En service — 19 nations Patriot ; production massive en cours, base alliée en expansion",
  acquisitionModes: ["FMS"],
  tagline:
    "Le hit-to-kill du système Patriot — la référence OTAN de l'interception balistique de théâtre, devenue l'effecteur sous-traité de la défense ukrainienne et israélienne.",
  summary:
    "PAC-3 MSE est l'intercepteur hit-to-kill développé par Lockheed Martin pour la dernière itération du système Patriot. C'est le successeur du PAC-3 CRI, avec une portée et une enveloppe d'engagement augmentées — particulièrement contre les missiles balistiques tactiques. Son principe est radical : pas de charge militaire classique, le missile détruit la cible par impact cinétique, avec un autodirecteur RF actif et une précision extrême.\n\nLe contexte récent a fait de PAC-3 MSE l'un des effecteurs les plus médiatisés de la guerre moderne. Les batteries Patriot exploitées par l'Ukraine ont intercepté des missiles balistiques iraniens et russes — y compris des Kinzhal. La demande FMS dépasse aujourd'hui la production, et Lockheed engage une expansion industrielle internationale, dont la localisation partielle en Espagne.",
  keySpecs: [
    {
      label: "Principe d'interception",
      value:
        "Hit-to-kill — destruction par impact cinétique, pas de warhead classique",
      confidence: "haute",
      sources: ["lm-pac3"],
    },
    {
      label: "Guidage terminal",
      value:
        "Inertiel + datalink Patriot + autodirecteur RF actif terminal",
      confidence: "haute",
      sources: ["lm-pac3"],
    },
    {
      label: "Manœuvrabilité",
      value: "Two-pulse rocket motor + attitude control motors (ACM)",
      confidence: "haute",
      sources: ["lm-pac3"],
    },
    {
      label: "Capacité par cellule",
      value: "4 missiles MSE par cellule lance (16 par batterie M903 standard)",
      confidence: "haute",
      sources: ["lm-pac3"],
    },
    {
      label: "Mission",
      value:
        "Défense aérienne haute couche + interception balistique de théâtre",
      confidence: "haute",
      sources: ["lm-pac3"],
    },
    {
      label: "Système hôte",
      value: "Patriot — radar, ECS, lanceurs M903 (PAC-3) ou MIM-104 Patriot",
      confidence: "haute",
      sources: ["lm-pac3"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "PAC-3 MSE est l'un des intercepteurs les plus chers en service. La demande FY2026 publie un coût net procurement moyen de l'ordre de 5,6 M$ par missile — coût budgétaire qui inclut le canister, l'ingénierie de production et le system engineering.\n\nC'est le prix d'un effecteur hit-to-kill capable d'interception balistique : aucune autre munition n'offre une telle granularité d'engagement, ce qui justifie économiquement la valeur. La logique d'emploi suit : un PAC-3 ne se tire pas contre un drone bas coût — il est réservé aux cibles à très forte valeur.",
      indicators: [
        {
          label: "Coût net procurement unitaire FY2026",
          value: "≈ 5,63 M$ par missile",
          confidence: "haute",
          note: "1 311,905 M$ / 233 missiles — total FY2026.",
          sources: ["dod-p1-fy26-pac3"],
        },
        {
          label: "Type de coût publié",
          value:
            "Net procurement — canister, production engineering et system engineering inclus",
          confidence: "haute",
          sources: ["dod-p1-fy26-pac3"],
        },
        {
          label: "Logique économique",
          value:
            "Effecteur premium réservé aux cibles à très forte valeur — pas anti-saturation",
          confidence: "haute",
          sources: ["lm-pac3"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le financement PAC-3 MSE explose post-2022 : entre les demandes alliées, la reconstitution des stocks US et le soutien à l'Ukraine, le programme entre dans une trajectoire de production sans précédent depuis trente ans. Lockheed Martin annonce un objectif de cadence supérieur à 650 missiles par an à partir de 2027, contre environ 500 historiquement.\n\nL'effort de localisation accompagne le financement : un site de production complémentaire est engagé en Espagne pour les composants, et l'extension Camden / Troy aux États-Unis est lancée. C'est l'un des programmes munitionnaires les plus dynamiques du DoD à ce jour.",
      indicators: [
        {
          label: "Volume FY2026 demandé",
          value: "233 missiles — programme PAC-3 total",
          confidence: "haute",
          sources: ["dod-p1-fy26-pac3"],
        },
        {
          label: "Objectif de cadence 2027",
          value:
            "Supérieure à 650 missiles par an — annonce Lockheed Martin",
          confidence: "haute",
          sources: ["lm-pac3-cadence"],
        },
        {
          label: "Localisation industrielle",
          value:
            "Composants en Espagne ; extension capacitaire US Camden / Troy",
          confidence: "haute",
          sources: ["lm-pac3-cadence"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne PAC-3 MSE est dominée par Lockheed Martin avec un réseau dense de sous-traitants américains. Les nœuds critiques : propergol solide (base SRM US partagée avec AMRAAM, PrSM, JAGM), autodirecteur RF, attitude control motors, électronique de mi-course.\n\nLockheed engage une politique de second-sourcing pour sécuriser plusieurs composants, et localise une partie de la production en Espagne dans le cadre de la coopération industrielle européenne. Le risque industriel principal reste la cadence en haute intensité — PAC-3 est l'effecteur le plus contraint par la demande post-Ukraine.",
      indicators: [
        {
          label: "Maître d'œuvre",
          value: "Lockheed Martin Missiles and Fire Control",
          confidence: "haute",
          sources: ["lm-pac3"],
        },
        {
          label: "Composants critiques",
          value:
            "Moteur deux étages, ACM, autodirecteur RF, calculateur, canister",
          confidence: "haute",
          sources: ["lm-pac3"],
        },
        {
          label: "Risque industriel principal",
          value:
            "Demande FMS et reconstitution US excèdent la cadence — tension structurelle",
          confidence: "haute",
          sources: ["lm-pac3-cadence"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "PAC-3 MSE est l'effecteur autour duquel s'organise la défense aérienne des alliés OTAN qui ont choisi le Patriot — soit 19 nations en 2025. C'est l'objet le plus emblématique de la dépendance capacitaire à Washington pour la couche supérieure : aucune alternative occidentale équivalente n'existait jusqu'à l'arrivée d'Aster 30 B1NT, et même ce dernier n'offre pas exactement le même profil hit-to-kill.\n\nLa guerre en Ukraine a fait basculer PAC-3 du statut de programme d'équipement à celui d'instrument de gestion politique des stocks alliés. Les arbitrages de livraison — qui reçoit combien, dans quel ordre — sont aujourd'hui des décisions stratégiques US majeures.",
      indicators: [
        {
          label: "Position dans l'OTAN",
          value: "Standard LRAD / ATBM des opérateurs Patriot — 19 nations",
          confidence: "haute",
          sources: ["lm-pac3"],
        },
        {
          label: "Régime applicable",
          value: "ITAR + MTCR Cat I — defense article sous autorisation US",
          confidence: "haute",
          sources: ["itar-22cfr121", "mtcr-guidelines"],
        },
        {
          label: "Effet stratégique récent",
          value:
            "Devenu instrument de gestion politique des stocks alliés depuis 2022",
          confidence: "haute",
          sources: ["lm-pac3-cadence"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "L'export PAC-3 MSE est exclusivement FMS, à des nations exploitant le Patriot. Les utilisateurs incluent Allemagne, Pays-Bas, Espagne, Pologne, Roumanie, Suède, Japon, Corée du Sud, Émirats arabes unis, Arabie saoudite, Israël, Bahreïn, Taïwan, Ukraine, etc. La demande dépasse la production — chaque nouvelle commande s'inscrit dans une file d'attente longue.\n\nLes contraintes ITAR et MTCR I s'appliquent. Le calendrier de livraison devient un objet de négociation politique entre Washington et les capitales alliées, et la localisation partielle en Espagne illustre la pression industrielle pour soulager la chaîne nationale.",
      indicators: [
        {
          label: "Canal d'export",
          value: "FMS exclusivement — base Patriot",
          confidence: "haute",
          sources: ["lm-pac3"],
        },
        {
          label: "Régime applicable",
          value: "ITAR + MTCR Cat I",
          confidence: "haute",
          sources: ["itar-22cfr121", "mtcr-guidelines"],
        },
        {
          label: "Tension de marché",
          value:
            "Demande excédant la cadence — files d'attente FMS plurianuelles",
          confidence: "haute",
          sources: ["lm-pac3-cadence"],
        },
      ],
    },
  ],
  variants: [
    {
      label: "PAC-3 CRI",
      value:
        "Standard antérieur — base hit-to-kill, en service depuis le début des années 2000",
      confidence: "haute",
      sources: ["lm-pac3"],
    },
    {
      label: "PAC-3 MSE",
      value:
        "Missile Segment Enhancement — portée et enveloppe étendues, propulsion deux étages",
      confidence: "haute",
      sources: ["lm-pac3"],
    },
    {
      label: "Intégration LTAMDS",
      value:
        "Nouveau radar Patriot LTAMDS — PAC-3 MSE conserve sa pertinence",
      confidence: "haute",
      sources: ["lm-pac3-cadence"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Coût unitaire très élevé compensé par le caractère unique de la capacité hit-to-kill ATBM — pas d'alternative directe.",
    },
    {
      key: "survivabilite",
      grade: "A",
      rationale:
        "Hit-to-kill et autodirecteur RF actif — l'un des effecteurs les plus résilients aux contre-mesures balistiques.",
    },
    {
      key: "exportabilite",
      grade: "C",
      rationale:
        "ITAR + MTCR I + files d'attente FMS — exporté largement mais avec arbitrage politique US strict.",
    },
    {
      key: "risque-industriel",
      grade: "C",
      rationale:
        "Demande structurelle excède la production ; expansion engagée mais à effet pluri-annuel.",
    },
    {
      key: "maturite",
      grade: "A",
      rationale:
        "En service depuis 2015, employé en combat à plusieurs reprises — Yémen, Ukraine, Israël.",
    },
    {
      key: "confiance-donnees",
      grade: "A",
      rationale:
        "Documents budgétaires DoD et MDA, datasheet Lockheed publique — couverture excellente.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un missile qui intercepte tout. La réalité : un intercepteur premium réservé aux cibles à très forte valeur, dont la cadence de production est aujourd'hui le facteur limitant — pas la performance.",
    bestUseCase:
      "Doter une nation OTAN d'une capacité ATBM contre missiles balistiques tactiques, dans le cadre du système Patriot, pour la couche supérieure de la défense aérienne.",
    weakPoint:
      "Le coût unitaire et la cadence de production — chaque PAC-3 utilisé contre une cible mal calibrée est un investissement qui ne sera pas reconstitué à court terme.",
    analystNote:
      "PAC-3 MSE est devenu le baromètre de la base industrielle missilière américaine. Suivre la cadence Camden / Troy et l'avancée du site Espagne — ce sont eux qui diront si l'arsenal allié tiendra une décennie de demande structurelle, ou si la dépendance à Washington se transformera en goulot capacitaire.",
  },
  operators: [
    "États-Unis",
    "Allemagne",
    "Pays-Bas",
    "Espagne",
    "Pologne",
    "Roumanie",
    "Suède",
    "Japon",
    "Corée du Sud",
    "Émirats arabes unis",
    "Arabie saoudite",
    "Israël",
    "Qatar",
    "Bahreïn",
    "Taïwan",
    "Ukraine",
  ],
  theatres: [
    "Yémen — interceptions revendiquées par l'Arabie saoudite",
    "Ukraine — depuis 2023, dont interceptions Kinzhal",
    "Israël — emploi documenté contre menaces balistiques",
  ],
  timeline: [
    {
      date: "2015",
      label: "Mise en service initiale du PAC-3 MSE.",
      kind: "jalon",
    },
    {
      date: "2017",
      label:
        "Premiers tirs opérationnels documentés contre menaces aériennes complexes.",
      kind: "emploi",
    },
    {
      date: "2023",
      label:
        "Interceptions documentées de Kinzhal russes par Patriot ukrainien.",
      kind: "emploi",
    },
    {
      date: "2024",
      label:
        "Lockheed Martin annonce un objectif de cadence > 650 missiles par an pour 2027.",
      kind: "jalon",
    },
    {
      date: "2024",
      label:
        "Site de localisation industrielle annoncé en Espagne — soulagement chaîne US.",
      kind: "jalon",
    },
  ],
  sources: [
    {
      id: "lm-pac3",
      title: "PAC-3 — Patriot Advanced Capability-3 — page produit",
      publisher: "Lockheed Martin",
      type: "constructeur",
      reliability: "B",
      url: "https://www.lockheedmartin.com/en-us/products/pac-3-missile.html",
    },
    {
      id: "dod-p1-fy26-pac3",
      title: "FY2026 Procurement Justification Book — PAC-3 line item",
      publisher: "DoD Comptroller — Office of the Under Secretary of Defense",
      type: "officiel",
      reliability: "A",
      url: "https://comptroller.defense.gov/Budget-Materials/",
    },
    {
      id: "lm-pac3-cadence",
      title:
        "Lockheed Martin — annonces de cadence PAC-3, localisation Espagne et expansion industrielle",
      publisher: "Lockheed Martin",
      type: "constructeur",
      reliability: "B",
      url: "https://www.lockheedmartin.com/en-us/news.html",
    },
    {
      id: "itar-22cfr121",
      title: "International Traffic in Arms Regulations — 22 CFR 121 USML",
      publisher: "U.S. Department of State — DDTC",
      type: "officiel",
      reliability: "A",
      url: "https://www.pmddtc.state.gov/",
    },
    {
      id: "mtcr-guidelines",
      title: "MTCR Guidelines for sensitive missile-relevant transfers",
      publisher: "Missile Technology Control Regime",
      type: "officiel",
      reliability: "A",
      url: "https://mtcr.info/",
    },
  ],
  updated: "2026-05-26",
};
