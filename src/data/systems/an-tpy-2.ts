import type { DefenseSystem } from "../types";

export const anTpy2: DefenseSystem = {
  slug: "an-tpy-2",
  name: "AN/TPY-2",
  designation: "Army/Navy Transportable Radar Surveillance — Model 2",
  reference: "PNP-RD-004",
  category: "radar",
  radarRole: "bmd",
  classLabel:
    "Radar AESA antimissile balistique bande X — capteur de discrimination terminale et d'alerte avancée THAAD",
  country: "États-Unis",
  flag: "🇺🇸",
  manufacturer: "RTX (Raytheon)",
  introduced: "2008",
  status:
    "En service — déployé en Forward-Based Mode (FBM) au Japon, Israël, Turquie, et en Terminal Mode (TM) sur les batteries THAAD",
  acquisitionModes: ["FMS"],
  tagline:
    "Les yeux de THAAD — un capteur X-band conçu pour discriminer une ogive balistique d'un leurre, au prix d'une exportabilité quasi nulle et d'un poids politique majeur.",
  summary:
    "L'AN/TPY-2 est le radar antimissile balistique de référence du Department of Defense américain. Bande X, AESA à panneaux à modules T/R, il opère selon deux modes principaux : Forward-Based Mode (FBM), où il sert de capteur d'alerte avancée déployé près de la zone de lancement adverse, et Terminal Mode (TM), où il est intégré aux batteries THAAD pour la discrimination et le guidage terminal des intercepteurs.\n\nLa fiche AN/TPY-2 est, dans le catalogue Panoplie, celle du capteur le plus politiquement chargé. Sa présence sur un territoire conditionne le périmètre couvert par la défense antimissile balistique américaine et signale un alignement stratégique fort avec Washington. Sa diffusion reste donc strictement contrôlée par les autorités américaines.",
  keySpecs: [
    {
      label: "Architecture",
      value: "AESA bande X — panneaux à modules T/R, antenne plane transportable",
      confidence: "haute",
      sources: ["rtx-antpy2"],
    },
    {
      label: "Bande de fréquence",
      value: "X — choix de bande motivé par la finesse de discrimination cible/leurre",
      confidence: "haute",
      sources: ["rtx-antpy2"],
    },
    {
      label: "Modes opératoires",
      value:
        "Forward-Based Mode (FBM) — alerte avancée ; Terminal Mode (TM) — discrimination et guidage intégré THAAD",
      confidence: "haute",
      sources: ["rtx-antpy2", "mda-thaad"],
    },
    {
      label: "Portée publique",
      value: "Non publiée — sources ouvertes estiment plusieurs centaines à plus de 1 000 km selon profil cible",
      confidence: "faible",
      status: "variable",
      sources: ["public-antpy2-range"],
    },
    {
      label: "Mobilité",
      value:
        "Transportable — déployable par voie aérienne, terrestre ou maritime ; déploiement opérationnel en quelques jours",
      confidence: "haute",
      sources: ["rtx-antpy2"],
    },
    {
      label: "Intégration C2",
      value: "Command and Control, Battle Management, Communications (C2BMC) ; AN/TPY-2 alimente la couche BMDS",
      confidence: "haute",
      sources: ["mda-thaad"],
    },
    {
      label: "Technologie RF",
      value:
        "Modules T/R GaAs / GaN selon génération — détails non précisés publiquement",
      confidence: "moyenne",
      status: "a-recouper",
      sources: ["rtx-antpy2"],
    },
    {
      label: "PRF, formes d'onde, algorithmes de discrimination",
      value: "Classifiés",
      confidence: "faible",
      status: "variable",
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le coût unitaire AN/TPY-2 est publié principalement à travers les contrats FMS approuvés par la Defense Security Cooperation Agency (DSCA). Les ordres de grandeur publics oscillent entre 350 M$ et 950 M$ par capteur selon la configuration retenue, le lot logistique inclus, et la fenêtre temporelle du contrat. Le radar seul, sans soutien initial ni transferts technologiques, se situe dans le bas de la fourchette.\n\nLa lecture coût n'a de sens qu'au niveau de l'écosystème THAAD complet, qui inclut intercepteurs, lanceurs, C2, formation et soutien pluriannuel. Une batterie THAAD complète atteint plusieurs milliards de dollars selon les contrats FMS récents (Arabie saoudite, UAE).",
      indicators: [
        {
          label: "Coût unitaire capteur — ordre de grandeur public",
          value:
            "≈ 350 à 950 M$ par capteur selon configuration et lot logistique inclus",
          confidence: "moyenne",
          note: "Contrats FMS notifiés par la DSCA — variabilité forte.",
          sources: ["dsca-thaad-fms"],
        },
        {
          label: "Coût batterie THAAD complète",
          value: "Plusieurs milliards de dollars selon contrats FMS récents",
          confidence: "haute",
          sources: ["dsca-thaad-fms"],
        },
        {
          label: "MCO pluriannuel",
          value:
            "Très significatif — capteur complexe, intégration BMDS, mises à jour MDA continues",
          confidence: "moyenne",
          sources: ["mda-budget"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "AN/TPY-2 est financé par la Missile Defense Agency (MDA) et par les contrats FMS notifiés à la DSCA. La MDA publie chaque année un Program Acquisition (P-1) detail qui documente les achats, les modernisations et le soutien. C'est l'un des programmes BMD les mieux tracés publiquement, à l'échelle du capteur stratégique.\n\nLes commandes FMS sont des décisions politiques de premier rang : chaque déploiement à l'étranger fait l'objet d'une notification au Congrès et engage la diplomatie américaine. Les bénéficiaires sont peu nombreux et historiquement constants.",
      indicators: [
        {
          label: "Financeur principal",
          value: "Missile Defense Agency (MDA) — programme phare BMD US",
          confidence: "haute",
          sources: ["mda-budget"],
        },
        {
          label: "Cadre des FMS",
          value:
            "Notifications DSCA au Congrès — chaque transfert engage la diplomatie US",
          confidence: "haute",
          sources: ["dsca-thaad-fms"],
        },
        {
          label: "Transparence budgétaire",
          value: "P-1 MDA annuel + DSCA — relativement bonne pour un capteur stratégique",
          confidence: "haute",
          sources: ["mda-budget"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne AN/TPY-2 est entièrement américaine, intégrée par RTX, avec une participation étroite de la MDA sur la conception et la qualification. Les composants critiques — modules T/R bande X, calculateurs de traitement BMD, algorithmes de discrimination — sont produits sous contrôle américain strict, avec des protections de propriété intellectuelle et de classification renforcées.\n\nLe risque industriel principal est interne au système américain : tenir la cadence de modernisation continue de la MDA face à l'évolution des menaces balistiques, en particulier les manœuvrants hypersoniques et les leurres avancés. La pression sur la microélectronique RF X-band haute performance est partagée avec d'autres programmes radar US.",
      indicators: [
        {
          label: "Empreinte industrielle",
          value: "Intégration RTX — chaîne entièrement américaine, classification renforcée",
          confidence: "haute",
          sources: ["rtx-antpy2"],
        },
        {
          label: "Technologie RF",
          value:
            "Modules T/R bande X — GaAs historique, transition GaN selon génération",
          confidence: "moyenne",
          status: "a-recouper",
          sources: ["rtx-antpy2"],
        },
        {
          label: "Risque industriel principal",
          value:
            "Cadence modernisation MDA face à l'évolution des menaces hypersoniques et leurres",
          confidence: "moyenne",
          sources: ["mda-budget"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "AN/TPY-2 est un objet politique de premier rang. Sa présence dans un pays signale un alignement stratégique fort avec les États-Unis et place le territoire concerné dans la couverture BMD américaine. Les déploiements FBM au Japon (Shariki, Kyogamisaki), en Israël (Negev), en Turquie (Kürecik) et au Qatar (suspendu) ont chacun fait l'objet de négociations diplomatiques majeures.\n\nLa présence d'un AN/TPY-2 conditionne aussi la posture régionale : le radar de Kürecik intégré à NATINAMDS a fait l'objet de tensions répétées entre Turquie, États-Unis et Russie ; le radar israélien du Negev formalise la coopération BMD US-Israël. Pour Panoplie, AN/TPY-2 est un cas-école de la brique géopolitique : le capteur n'est pas qu'un objet technique, c'est un acte diplomatique.",
      indicators: [
        {
          label: "Sites de déploiement FBM connus",
          value:
            "Japon (Shariki, Kyogamisaki), Israël (Negev), Turquie (Kürecik) ; Qatar suspendu",
          confidence: "haute",
          sources: ["public-fbm-sites"],
        },
        {
          label: "Signification stratégique",
          value:
            "Alignement BMD US affiché — couverture du territoire et négociation diplomatique de haut niveau",
          confidence: "haute",
          sources: ["mda-thaad"],
        },
        {
          label: "Intégration OTAN",
          value:
            "Kürecik intégré à NATINAMDS — tensions Russie / Turquie / US récurrentes",
          confidence: "haute",
          sources: ["nato-iamd-radar"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "L'export de l'AN/TPY-2 est strictement limité. Au-delà des sites FBM déployés en propre par les forces américaines, les seuls clients confirmés sont les nations achetant des batteries THAAD complètes : Émirats arabes unis, Arabie saoudite, et la Corée du Sud (THAAD US déployé à Seongju). Chaque transfert engage l'ITAR au niveau le plus restrictif et fait l'objet d'une notification DSCA.\n\nL'exportabilité est, par construction, faible. Le capteur est trop sensible et trop politique pour être commercialisé largement. Le coût d'entrée écosystémique — batterie THAAD complète + intégration BMDS + soutien pluriannuel — concentre de fait l'accès sur un petit nombre d'alliés très proches.",
      indicators: [
        {
          label: "Canal d'export dominant",
          value:
            "FMS — restreint, chaque transfert engage la diplomatie américaine et l'ITAR",
          confidence: "haute",
          sources: ["dsca-thaad-fms"],
        },
        {
          label: "Clients export documentés",
          value:
            "Émirats arabes unis, Arabie saoudite — THAAD complet ; Corée du Sud — déploiement US en propre",
          confidence: "haute",
          sources: ["dsca-thaad-fms"],
        },
        {
          label: "Régime applicable",
          value:
            "ITAR niveau maximal — capteur BMD stratégique, contrôle Department of State strict",
          confidence: "haute",
          sources: ["itar-radar"],
        },
      ],
    },
  ],
  integrationFrameworks: [
    "Ballistic Missile Defense System (BMDS)",
    "C2BMC",
    "THAAD",
    "NATINAMDS (Kürecik)",
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "C",
      rationale:
        "Coût unitaire très élevé compensé par une mission stratégique sans équivalent commercial ; aucun substitut crédible dans la défense antimissile balistique exportable.",
    },
    {
      key: "survivabilite",
      grade: "C",
      rationale:
        "Capteur fixe ou semi-fixe sur site connu, signature radar et électromagnétique forte ; vulnérabilité physique et électronique sensible mais peu documentée publiquement.",
    },
    {
      key: "exportabilite",
      grade: "E",
      rationale:
        "ITAR niveau maximal — seuls quelques alliés très proches y accèdent, et chaque transfert relève d'une décision politique de premier rang.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Chaîne RTX intégrée sous contrôle MDA ; pression de modernisation continue face aux menaces hypersoniques.",
    },
    {
      key: "maturite",
      grade: "A",
      rationale:
        "En service depuis 2008, déployé sur plusieurs continents, intégré à BMDS et à THAAD — capteur pleinement mature.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "Sources RTX et MDA abondantes sur le rôle et l'architecture, mais paramètres techniques fins et performances classifiés.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un radar « magique » qui voit l'ogive séparée du leurre à mille kilomètres. La réalité : un capteur X-band de très haute performance qui dépend autant des algorithmes de discrimination (classifiés) et du C2BMC que de ses panneaux AESA — et dont la valeur opérationnelle est conditionnée par sa place géographique.",
    bestUseCase:
      "Couvrir un théâtre BMD critique — Asie du Nord-Est, Levant, Golfe — en alerte avancée ou en discrimination terminale, en alignant la doctrine de défense aérienne et antimissile du pays hôte sur celle des États-Unis.",
    weakPoint:
      "Le poids politique de la présence du capteur, qui transforme chaque déploiement en sujet diplomatique. La signature électromagnétique et la fixité relative en font aussi une cible théorique pour les menaces SEAD/DEAD avancées.",
    analystNote:
      "AN/TPY-2 est le cas-école Panoplie de la brique géopolitique : le capteur ne se lit qu'en intégration BMDS et en posture diplomatique américaine. Pour les analystes, sa diffusion et ses sites de déploiement sont autant d'indicateurs de la posture stratégique US et de la confiance qu'elle accorde à ses alliés régionaux.",
  },
  operators: [
    "États-Unis (déploiement FBM en propre — Japon, Israël, Turquie historiquement Qatar)",
    "Émirats arabes unis (THAAD)",
    "Arabie saoudite (THAAD)",
    "Corée du Sud (déploiement US — Seongju)",
  ],
  theatres: [
    "Asie du Nord-Est — couverture de la péninsule coréenne et du théâtre maritime adjacent",
    "Levant — couverture israélienne BMD",
    "Golfe Persique — couverture régionale via UAE et Arabie saoudite",
    "Europe — site de Kürecik (Turquie) intégré à NATINAMDS",
  ],
  timeline: [
    {
      date: "2008",
      label: "Entrée en service initiale — première unité opérationnelle aux États-Unis.",
      kind: "jalon",
    },
    {
      date: "2011",
      label:
        "Déploiement FBM en Turquie (Kürecik) — intégration NATINAMDS et tensions Russie / US.",
      kind: "emploi",
    },
    {
      date: "2017",
      label:
        "Déploiement THAAD US à Seongju (Corée du Sud) — incidents diplomatiques régionaux majeurs.",
      kind: "emploi",
    },
    {
      date: "2019",
      label: "Notification FMS THAAD à l'Arabie saoudite — capteur AN/TPY-2 inclus.",
      kind: "export",
    },
    {
      date: "2022",
      label:
        "Renforcement du déploiement FBM en Israël (Negev) — coopération BMD US-Israël affichée.",
      kind: "emploi",
    },
  ],
  sources: [
    {
      id: "rtx-antpy2",
      title: "AN/TPY-2 — page produit RTX",
      publisher: "RTX (Raytheon)",
      type: "constructeur",
      reliability: "B",
      url: "https://www.rtx.com/raytheon/what-we-do/strategic-missile-defense/antpy-2",
    },
    {
      id: "mda-thaad",
      title: "THAAD program page — Missile Defense Agency",
      publisher: "Missile Defense Agency (MDA)",
      type: "officiel",
      reliability: "A",
      url: "https://www.mda.mil/",
    },
    {
      id: "mda-budget",
      title: "MDA Program Acquisition P-1 — annual procurement justification",
      publisher: "Missile Defense Agency / DoD Comptroller",
      type: "officiel",
      reliability: "A",
      url: "https://comptroller.defense.gov/Budget-Materials/",
    },
    {
      id: "dsca-thaad-fms",
      title: "DSCA THAAD FMS notifications to Congress",
      publisher: "Defense Security Cooperation Agency",
      type: "officiel",
      reliability: "A",
      url: "https://www.dsca.mil/press-media/major-arms-sales",
    },
    {
      id: "public-fbm-sites",
      title:
        "AN/TPY-2 FBM deployment sites — open-source intelligence (CSIS, FAS, presse spécialisée)",
      publisher: "Sources publiques tierces",
      type: "think-tank",
      reliability: "B",
    },
    {
      id: "public-antpy2-range",
      title:
        "AN/TPY-2 portée estimée — analyses publiques tierces (CSIS, FAS)",
      publisher: "Sources publiques tierces",
      type: "think-tank",
      reliability: "B",
    },
    {
      id: "nato-iamd-radar",
      title:
        "NATINAMDS et radar de Kürecik — communications OTAN et analyses ouvertes",
      publisher: "OTAN / sources publiques",
      type: "officiel",
      reliability: "A",
      url: "https://www.nato.int/cps/en/natohq/topics_8206.htm",
    },
    {
      id: "itar-radar",
      title:
        "International Traffic in Arms Regulations — 22 CFR 121 USML Category XI",
      publisher: "U.S. Department of State — DDTC",
      type: "officiel",
      reliability: "A",
      url: "https://www.pmddtc.state.gov/",
    },
  ],
  updated: "2026-05-27",
};
