import type { DefenseSystem } from "../types";

export const gm200: DefenseSystem = {
  slug: "gm200",
  name: "Ground Master 200",
  designation: "GM200",
  reference: "PNP-RD-001",
  category: "radar",
  radarRole: "multi-mission",
  classLabel: "Radar AESA multi-mission GBAD bande S — surveillance, acquisition, fire control",
  country: "France",
  flag: "🇫🇷",
  manufacturer: "Thales",
  introduced: "2009",
  status:
    "En service — produit phare GBAD Thales, exporté largement en Europe et hors Europe, base de la famille GM200 MM",
  acquisitionModes: ["DCS", "production-nationale", "cooperatif"],
  tagline:
    "Le radar AESA tactique européen — multifonction, transportable en moins de dix minutes, intégrable dans presque toutes les architectures C2 alliées.",
  summary:
    "Le Ground Master 200 est un radar AESA bande S à panneau plan rotatif, conçu par Thales pour assumer simultanément surveillance, acquisition d'objectifs et engagement quality data au profit d'une batterie sol-air. Il combine une portée instrumentée publique de 250 km, une rotation à fort taux de revisite, des formes d'onde Doppler complètes et une électronique AESA à composants GaN.\n\nLe GM200 est devenu un produit pivot pour Thales : déployable rapidement, intégrable à des C2 OTAN comme à des C2 nationaux, et capable d'alimenter plusieurs batteries de tir. Sa valeur principale pour Panoplie n'est pas un chiffre de portée mais sa souplesse d'intégration et son rôle dans la consolidation d'une chaîne radar européenne souveraine.",
  keySpecs: [
    {
      label: "Architecture",
      value: "AESA bande S, panneau plan rotatif, composants GaN",
      confidence: "haute",
      sources: ["thales-gm200"],
    },
    {
      label: "Portée instrumentée publique",
      value: "≈ 250 km",
      confidence: "haute",
      sources: ["thales-gm200"],
    },
    {
      label: "Mobilité",
      value:
        "Transportable sur véhicule tactique 4×4 ou 8×8 ; déploiement publié < 10 min",
      confidence: "haute",
      sources: ["thales-gm200"],
    },
    {
      label: "Formes d'onde",
      value: "Full Doppler waveforms, ECCM intégrés (détail non précisé publiquement)",
      confidence: "moyenne",
      status: "a-recouper",
      sources: ["thales-gm200"],
    },
    {
      label: "Modes simultanés",
      value:
        "Surveillance aérienne, acquisition d'objectifs, weapon-locating limité, IFF Mode 5",
      confidence: "haute",
      sources: ["thales-gm200"],
    },
    {
      label: "Intégration C2",
      value: "NATO ACCS, NASAMS, C2 nationaux multiples (France, Estonie, Lettonie, Finlande)",
      confidence: "haute",
      sources: ["thales-gm200", "thales-nasams-gm200"],
    },
    {
      label: "Nombre exact de TRM",
      value: "Non précisé publiquement",
      confidence: "faible",
      status: "variable",
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le coût du GM200 est partiellement public à travers les contrats export. Les achats danois et baltes documentent un coût unitaire capteur de l'ordre de 14 à 30 M€ selon variante et lot — le bas de la fourchette correspond à des contrats récents en variante MM, le haut à des configurations plus complètes intégration comprise.\n\nLa lecture économique n'a de sens qu'au niveau « batterie » : le radar seul ne vaut rien sans son intégration C2, ses véhicules de soutien, sa formation et ses stocks de rechange. La modularité GaN et l'évolutivité logicielle promettent une réduction du LCC, mais cette promesse reste à vérifier sur des cycles complets de 25-30 ans.",
      indicators: [
        {
          label: "Coût unitaire capteur — ordre de grandeur public",
          value: "≈ 14 à 30 M€ selon variante et lot d'export",
          confidence: "moyenne",
          note: "Documents contractuels export (Danemark, États baltes).",
          sources: ["danish-mod-gm200", "thales-gm200"],
        },
        {
          label: "Coût batterie complète",
          value: "Non publié homogène — intégration C2 et soutien décisifs",
          confidence: "faible",
          status: "variable",
          sources: ["thales-gm200"],
        },
        {
          label: "Argument LCC constructeur",
          value:
            "Modularité GaN, redondance des panneaux, upgrade logiciel — promesse de réduction du coût de cycle de vie",
          confidence: "moyenne",
          sources: ["thales-gm200"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le GM200 est financé par les budgets nationaux des États clients et, dans certains cas, par des programmes coopératifs européens. Thales le commercialise comme un produit pivot pour les forces de moyenne envergure cherchant un radar GBAD souverain à coût maîtrisé. La France l'emploie en réseau de défense aérienne nationale ; les États baltes l'ont retenu dans le cadre de leur consolidation IAMD post-2022.\n\nLes commandes post-2022 ont confirmé la montée en cadence de production Thales sur la famille GM, avec un effet d'apprentissage industriel attendu sur les coûts unitaires. La transparence budgétaire reste cependant inférieure à celle des grands programmes US.",
      indicators: [
        {
          label: "Modèle de financement",
          value: "Budgets nationaux clients ; programmes européens partiels",
          confidence: "haute",
          sources: ["thales-gm200"],
        },
        {
          label: "Effet d'apprentissage post-2022",
          value: "Montée en cadence Thales documentée — Estonie, Lettonie, Pays-Bas, Finlande",
          confidence: "moyenne",
          sources: ["thales-gm200", "ap-gm200-news"],
        },
        {
          label: "Transparence budgétaire",
          value:
            "Inférieure aux programmes US — contrats publiés au cas par cas, pas de justification annuelle uniforme",
          confidence: "moyenne",
          sources: ["danish-mod-gm200"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne GM200 est largement européenne, ancrée chez Thales (France, Pays-Bas, Royaume-Uni). Le radar utilise des composants RF GaN — un point de souveraineté que Thales a sécurisé via ses propres lignes de production et des partenariats fonderie européens. Le packaging RF, les calculateurs DSP et le logiciel restent dominés par Thales et ses filiales.\n\nLe risque industriel principal n'est pas la dépendance à un fournisseur étranger critique, mais la cadence de production face à la demande européenne post-Ukraine, et l'accès aux semiconducteurs RF avancés dans un contexte de tension globale sur la microélectronique.",
      indicators: [
        {
          label: "Empreinte industrielle",
          value: "Thales France / Pays-Bas / Royaume-Uni — chaîne largement européenne",
          confidence: "haute",
          sources: ["thales-gm200"],
        },
        {
          label: "Technologie RF",
          value: "Modules T/R GaN — souveraineté composants partielle",
          confidence: "haute",
          sources: ["thales-gm200"],
        },
        {
          label: "Risque industriel principal",
          value:
            "Cadence de production face à la demande européenne ; accès semiconducteurs RF avancés",
          confidence: "moyenne",
          sources: ["thales-gm200"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Le GM200 est un produit de souveraineté radar européen. Le choisir, c'est éviter ITAR sur la couche capteur, garder le contrôle de la baseline logicielle et conserver une latitude d'intégration avec des C2 nationaux. C'est aussi accepter une intégration de fait dans l'écosystème industriel Thales et la diplomatie d'armement française.\n\nLe radar est compatible avec les architectures OTAN (NATINAMDS, ACCS) et avec des architectures hybrides — il équipe par exemple des batteries NASAMS, démontrant une interopérabilité concrète avec un C2 d'origine américano-norvégienne. Cette transversalité est un atout pour les nations cherchant la souveraineté sans rupture avec l'OTAN.",
      indicators: [
        {
          label: "Souveraineté capteur",
          value: "Hors ITAR sur le radar lui-même — composants RF européens",
          confidence: "haute",
          sources: ["thales-gm200"],
        },
        {
          label: "Compatibilité réseau",
          value: "NATINAMDS, ACCS, NASAMS, C2 nationaux — intégration éprouvée",
          confidence: "haute",
          sources: ["thales-gm200", "thales-nasams-gm200"],
        },
        {
          label: "Effet d'écosystème",
          value:
            "Produit pivot pour la consolidation d'une chaîne radar européenne souveraine",
          confidence: "moyenne",
          sources: ["thales-gm200"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "Le GM200 est l'un des radars européens les plus exportés de la décennie 2010-2020, avec une accélération post-2022. Les clients documentés couvrent l'Estonie, la Lettonie, la Finlande, le Danemark, les Pays-Bas, le Royaume-Uni, l'Indonésie, l'Australie, le Brésil et plusieurs autres. Le canal dominant est la vente commerciale directe (DCS) sous licence DGA, parfois accompagnée d'un partenariat industriel local.\n\nLe régime applicable est principalement européen — Position commune UE 2008/944/PESC, contrôle national DGA — avec une couche Wassenaar sur les composants RF avancés. L'exportabilité reste élevée comparée aux radars US équivalents, ce qui en fait un produit de choix pour les nations cherchant un radar GBAD moderne sans contrainte ITAR.",
      indicators: [
        {
          label: "Canal d'export dominant",
          value: "DCS sous licence DGA — partenariats industriels locaux selon cas",
          confidence: "haute",
          sources: ["thales-gm200"],
        },
        {
          label: "Nombre d'utilisateurs publics",
          value: "≈ 10 nations documentées — Europe + Asie-Pacifique + Amérique latine",
          confidence: "moyenne",
          sources: ["thales-gm200", "ap-gm200-news"],
        },
        {
          label: "Régime applicable",
          value:
            "Position commune UE 2008/944/PESC + contrôle DGA + Wassenaar composants RF",
          confidence: "haute",
          sources: ["wassenaar-list"],
        },
      ],
    },
  ],
  integrationFrameworks: [
    "NATINAMDS",
    "NASAMS",
    "ACCS OTAN",
    "C2 nationaux multiples",
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Coût unitaire capteur modéré pour un AESA multi-mission ; le MCO et l'upgrade logiciel pluriannuel restent peu documentés publiquement.",
    },
    {
      key: "survivabilite",
      grade: "B",
      rationale:
        "Mobilité tactique forte, déploiement rapide, agilité de faisceau AESA ; les performances ECCM précises restent classifiées.",
    },
    {
      key: "exportabilite",
      grade: "A",
      rationale:
        "Largement exporté, hors ITAR, intégrations multiples documentées — un des meilleurs profils export du segment radar.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Chaîne européenne maîtrisée par Thales ; tension globale sur la microélectronique RF et la cadence post-Ukraine à surveiller.",
    },
    {
      key: "maturite",
      grade: "A",
      rationale:
        "En service depuis 2009, exporté à une dizaine de nations, base d'une famille élargie (GM200 MM) — produit pleinement mature.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "Sources constructeur abondantes, contrats export publics, mais paramètres techniques fins (TRM, ECCM, baselines) non publiés.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un radar AESA léger qui « voit tout » à 250 km. La réalité : un radar GBAD multi-mission solide, dont la valeur réelle dépend autant du C2 auquel il est connecté que de ses panneaux et de son traitement.",
    bestUseCase:
      "Équiper une nation moyenne d'un radar souverain hors ITAR, compatible avec les architectures OTAN et nationale, déployable rapidement et upgradable par logiciel.",
    weakPoint:
      "L'absence de transparence publique sur les paramètres ECCM, le nombre de TRM et les performances en environnement brouillé sévère — la promesse AESA est difficile à vérifier sur sources ouvertes.",
    analystNote:
      "Le GM200 est moins un radar qu'un produit industriel européen de référence. Sa valeur pour Panoplie tient à ce qu'il documente concrètement : la possibilité d'un radar AESA moderne, exporté hors ITAR, intégré dans NATINAMDS, sur une chaîne industrielle largement souveraine. C'est un cas-école de la brique géopolitique.",
  },
  operators: [
    "France",
    "Estonie",
    "Lettonie",
    "Finlande",
    "Pays-Bas",
    "Danemark (variante MM)",
    "Royaume-Uni",
    "Indonésie",
    "Australie",
    "Brésil",
  ],
  theatres: [
    "Surveillance aérienne nationale — France et États baltes",
    "Défense aérienne en posture renforcée post-2022 — Europe orientale",
    "Intégration à des batteries NASAMS — démonstration interopérabilité OTAN",
  ],
  timeline: [
    {
      date: "2009",
      label: "Entrée en service initiale — premier client Thales.",
      kind: "jalon",
    },
    {
      date: "2015",
      label: "Adoption par les premiers États baltes — Estonie, Lettonie.",
      kind: "export",
    },
    {
      date: "2020",
      label:
        "Lancement de la variante Ground Master 200 MM — multi-mission étendue C-UAS / C-RAM.",
      kind: "jalon",
    },
    {
      date: "2022",
      label:
        "Accélération des commandes post-invasion russe — Pays-Bas, Finlande, Danemark.",
      kind: "export",
    },
    {
      date: "2024",
      label:
        "Confirmation de la montée en cadence Thales sur la famille GM — référence radar européen.",
      kind: "jalon",
    },
  ],
  sources: [
    {
      id: "thales-gm200",
      title: "Ground Master 200 — page produit Thales",
      publisher: "Thales",
      type: "constructeur",
      reliability: "B",
      url: "https://www.thalesgroup.com/en/markets/defence-and-security/radars",
    },
    {
      id: "thales-nasams-gm200",
      title: "GM200 — intégration à des batteries NASAMS",
      publisher: "Thales / Kongsberg",
      type: "constructeur",
      reliability: "B",
      url: "https://www.thalesgroup.com/",
    },
    {
      id: "danish-mod-gm200",
      title:
        "Annonce contrat radars GM200 MM/C — ministère danois de la Défense",
      publisher: "Forsvarsministeriet / Forsvaret (Danemark)",
      type: "officiel",
      reliability: "A",
      url: "https://www.fmi.dk/",
    },
    {
      id: "ap-gm200-news",
      title:
        "Commandes Thales Ground Master post-2022 — dépêches et communiqués",
      publisher: "Agences de presse / Thales",
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
