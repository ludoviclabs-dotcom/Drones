import type { DefenseSystem } from "../types";

export const jagm: DefenseSystem = {
  slug: "jagm",
  name: "JAGM",
  designation: "Joint Air-to-Ground Missile",
  reference: "PNP-MSL-004",
  category: "missile",
  missileRole: "ASM",
  classLabel: "Missile air-sol multi-mode courte portée",
  country: "États-Unis",
  flag: "🇺🇸",
  manufacturer: "Lockheed Martin",
  introduced: "2019",
  status: "En service — U.S. Army, USMC ; extension marine en cours",
  acquisitionModes: ["FMS"],
  tagline:
    "Le successeur du Hellfire — un seul missile, trois modes terminaux, pour boucler le triptyque CAS, anti-armure et maritime léger.",
  summary:
    "JAGM est le missile air-sol courte portée développé par Lockheed Martin pour remplacer, à terme, la famille AGM-114 Hellfire et le BGM-71 TOW dans le segment air-armure et anti-surface léger. Sa caractéristique centrale est l'autodirecteur multi-mode : laser semi-actif + onde millimétrique (MMW), parfois associé à l'imagerie IR — un objet qui s'engage en désignation laser, en illumination radar autonome ou en fire-and-forget selon la mission.\n\nL'effet de catalogue est important : un opérateur peut, avec une même munition, traiter un blindé léger, un véhicule en mouvement, un radar mobile ou un canot rapide. Pour Panoplie, JAGM est l'archétype du missile multi-mode — la consolidation d'un segment qui était fragmenté entre quatre ou cinq munitions distinctes il y a dix ans.",
  keySpecs: [
    {
      label: "Guidage terminal",
      value:
        "Multi-mode — laser semi-actif (SAL) + onde millimétrique (MMW) actif",
      confidence: "haute",
      sources: ["lm-jagm", "navair-jagm"],
    },
    {
      label: "Mode opératoire",
      value: "Fire-and-forget (MMW) ou désignation laser (SAL) ; mixte possible",
      confidence: "haute",
      sources: ["lm-jagm"],
    },
    {
      label: "Cibles primaires",
      value:
        "Véhicules blindés, structures légères, canots rapides, radars mobiles",
      confidence: "haute",
      sources: ["lm-jagm"],
    },
    {
      label: "Plateformes initiales",
      value: "AH-64E Apache (US Army) ; AH-1Z (USMC)",
      confidence: "haute",
      sources: ["lm-jagm"],
    },
    {
      label: "Charge militaire",
      value: "Multi-purpose — tandem HEAT + blast/fragmentation",
      confidence: "haute",
      sources: ["lm-jagm"],
    },
    {
      label: "Extensions en cours",
      value:
        "Intégration sur drones, F-16, F/A-18 et hélicoptères navals envisagée",
      confidence: "moyenne",
      sources: ["lm-jagm"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "JAGM est l'une des fiches les mieux documentées par le budget américain. La demande FY2026 publie un coût budgétaire moyen de l'ordre de 0,48 M$ par missile — un prix qui le situe dans la fourchette haute des effecteurs courte portée mais bien en dessous des standoff coûteux.\n\nLa logique économique est explicite : remplacer plusieurs familles distinctes par une seule consolide les coûts de production, de formation et de soutien. Le coût marginal supplémentaire d'un JAGM par rapport à un Hellfire R9X cible précise est compensé par la rationalisation du stock et du soutien.",
      indicators: [
        {
          label: "Coût budgétaire unitaire FY2026",
          value: "≈ 0,48 M$ par missile",
          confidence: "haute",
          note: "84,667 M$ / 178 missiles — demande FY2026.",
          sources: ["dod-p1-fy26-jagm"],
        },
        {
          label: "Type de coût publié",
          value: "Coût budgétaire moyen — flyaway + financement de production",
          confidence: "haute",
          sources: ["dod-p1-fy26-jagm"],
        },
        {
          label: "Logique économique",
          value:
            "Consolidation du segment — remplace Hellfire dans le triptyque CAS / armure / maritime",
          confidence: "haute",
          sources: ["lm-jagm"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "JAGM est financé par l'US Army comme programme acquéreur principal, avec l'USMC comme partenaire. Les contrats pluriannuels ont permis à Lockheed d'engager la montée en cadence d'une chaîne qui pourrait servir au moins une décennie de production aux côtés du Hellfire transitionnel.\n\nL'enjeu financier à venir est l'élargissement des plateformes : chaque intégration nouvelle — F-16, F/A-18, drone — déclenche un cycle additionnel de financement et grossit le volume de production. C'est la trajectoire classique d'un effecteur destiné à devenir le standard du segment.",
      indicators: [
        {
          label: "Volume FY2026 demandé",
          value: "178 missiles — US Army / USMC",
          confidence: "haute",
          sources: ["dod-p1-fy26-jagm"],
        },
        {
          label: "Trajectoire de financement",
          value: "Contrats pluriannuels engagés ; intégrations en montée en charge",
          confidence: "haute",
          sources: ["lm-jagm"],
        },
        {
          label: "Effet anticipé",
          value:
            "Devenir le standard ASM US courte portée d'ici la fin de la décennie",
          confidence: "moyenne",
          sources: ["lm-jagm"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne JAGM est majoritairement domestique américaine, sous maîtrise d'œuvre Lockheed Martin avec un réseau de sous-traitants. Comme pour l'AMRAAM, le nœud sensible est la propulsion à propergol solide, dont la base industrielle US est sous tension après les volumes consommés depuis 2022.\n\nL'autodirecteur multi-mode est l'autre composant critique : il marie capteurs SAL et MMW, soit deux chaînes techno qui doivent être maintenues simultanément. C'est précisément cette intégration qui constitue la valeur industrielle ajoutée du programme.",
      indicators: [
        {
          label: "Maître d'œuvre",
          value: "Lockheed Martin — site Troy (Alabama)",
          confidence: "haute",
          sources: ["lm-jagm"],
        },
        {
          label: "Composants critiques",
          value: "Autodirecteur SAL + MMW, moteur à propergol solide, calculateur",
          confidence: "haute",
          sources: ["lm-jagm"],
        },
        {
          label: "Risque industriel principal",
          value:
            "Base SRM partagée avec AMRAAM, PAC-3, GMLRS, PrSM — pression structurelle",
          confidence: "moyenne",
          sources: ["gao-srm"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "JAGM s'inscrit dans la transition de l'arsenal courte portée US vers des effecteurs multi-mode capables de répondre à un spectre plus large de menaces — petite embarcation rapide, véhicule blindé léger, radar mobile. Il prolonge la dépendance des opérateurs alliés à l'écosystème américain pour l'air-sol courte portée.\n\nLe régime ITAR s'applique. Pour les forces alliées qui exploitent l'Apache ou l'AH-1Z, JAGM est la trajectoire d'équipement naturelle. Pour les autres, la diversification reste possible mais réduit le bénéfice de standardisation.",
      indicators: [
        {
          label: "Position dans l'OTAN",
          value:
            "Standard émergent pour les utilisateurs d'Apache et d'AH-1Z",
          confidence: "haute",
          sources: ["lm-jagm"],
        },
        {
          label: "Régime applicable",
          value: "ITAR — defense article sous autorisation US",
          confidence: "haute",
          sources: ["itar-22cfr121"],
        },
        {
          label: "Effet de standardisation",
          value:
            "Consolide la dépendance des opérateurs hélico US au stock de munitions Lockheed",
          confidence: "moyenne",
          sources: ["lm-jagm"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "L'export JAGM se fait par FMS et accompagne typiquement l'export de l'Apache ou de l'AH-1Z. Les premiers utilisateurs étrangers sont à venir — la trajectoire suivra celle du Hellfire, dont l'écosystème export a couvert plusieurs dizaines de pays.\n\nLe ré-export est soumis aux clauses end-user habituelles ; toute évolution doctrinale ou de cible doit être discutée avec Washington. C'est une contrainte modérée pour un opérateur OTAN, plus structurante pour un client à doctrine indépendante.",
      indicators: [
        {
          label: "Canal d'export",
          value: "FMS — couplé aux contrats Apache / AH-1Z",
          confidence: "haute",
          sources: ["lm-jagm"],
        },
        {
          label: "Régime applicable",
          value: "ITAR — autorisations préalables et clauses end-user",
          confidence: "haute",
          sources: ["itar-22cfr121"],
        },
        {
          label: "Trajectoire export",
          value:
            "Premiers transferts aux utilisateurs alliés d'Apache attendus dans la décennie",
          confidence: "moyenne",
          sources: ["lm-jagm"],
        },
      ],
    },
  ],
  variants: [
    {
      label: "JAGM (standard initial)",
      value: "Autodirecteur SAL + MMW ; tube Hellfire-compatible",
      confidence: "haute",
      sources: ["lm-jagm"],
    },
    {
      label: "JAGM-MR (Medium Range)",
      value:
        "Variante à portée étendue annoncée — propulsion modifiée, intégration plateformes plus rapides",
      confidence: "moyenne",
      status: "a-recouper",
      sources: ["lm-jagm"],
    },
    {
      label: "JAGM-F (Fixed-wing)",
      value:
        "Intégration F-16, F/A-18 et drones en développement — élargissement plateforme",
      confidence: "moyenne",
      sources: ["lm-jagm"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "A",
      rationale:
        "Coût budgétaire mesuré pour un effecteur multi-mode ; consolidation de plusieurs lignes de munition.",
    },
    {
      key: "survivabilite",
      grade: "B",
      rationale:
        "Le seeker multi-mode et le fire-and-forget MMW rendent l'évitement difficile pour la cible ; le missile reste un effecteur courte portée tirant en zone défendue.",
    },
    {
      key: "exportabilite",
      grade: "B",
      rationale:
        "Exporté par FMS — base potentielle large via Apache, mais sous ITAR.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Base SRM commune avec AMRAAM, PAC-3 et autres munitions ; tension structurelle US à surveiller.",
    },
    {
      key: "maturite",
      grade: "B",
      rationale:
        "En service depuis 2019 ; intégrations multi-plateformes encore à venir.",
    },
    {
      key: "confiance-donnees",
      grade: "A",
      rationale:
        "Justifications budgétaires DoD annuelles + datasheet Lockheed publique + sources NAVAIR — couverture solide.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un Hellfire amélioré. La réalité : un changement de logique — JAGM consolide quatre lignes de munition en une, ce qui modifie le soutien, la formation et la planification d'emploi plus que la performance unitaire.",
    bestUseCase:
      "Doter un parc Apache ou AH-1Z d'un effecteur unique couvrant CAS, anti-armure, anti-radar mobile et maritime léger — réduire la fragmentation des munitions embarquées.",
    weakPoint:
      "La dépendance ITAR et la pression sur la base SRM — JAGM est un excellent missile, mais sa production reste otage du même goulot industriel que ses cousins.",
    analystNote:
      "JAGM est le meilleur cas pratique de l'effet d'un autodirecteur multi-mode : il déplace la valeur du missile vers son catalogue d'emploi, pas vers sa performance isolée. Suivre les intégrations F-16 et drones — elles diront si JAGM devient le standard ASM US ou reste un effecteur hélico spécialisé.",
  },
  operators: ["États-Unis (Army, USMC)"],
  theatres: ["Pas d'emploi en combat documenté à ce jour"],
  timeline: [
    {
      date: "2018",
      label: "Premier lot de production initiale (LRIP) — US Army.",
      kind: "jalon",
    },
    {
      date: "2019",
      label: "Mise en service initiale dans l'US Army — AH-64E Apache.",
      kind: "jalon",
    },
    {
      date: "2022",
      label: "Pleine capacité opérationnelle (FRP) confirmée.",
      kind: "jalon",
    },
    {
      date: "2024",
      label:
        "Annonce d'intégrations sur plateformes à voilure fixe et drones — extension du marché.",
      kind: "jalon",
    },
  ],
  sources: [
    {
      id: "lm-jagm",
      title: "JAGM — Joint Air-to-Ground Missile — page produit",
      publisher: "Lockheed Martin",
      type: "constructeur",
      reliability: "B",
      url: "https://www.lockheedmartin.com/en-us/products/joint-air-to-ground-missile.html",
    },
    {
      id: "navair-jagm",
      title: "JAGM — Naval Air Systems Command resources",
      publisher: "NAVAIR / US Navy",
      type: "officiel",
      reliability: "A",
      url: "https://www.navair.navy.mil/",
    },
    {
      id: "dod-p1-fy26-jagm",
      title: "FY2026 Procurement Justification Book — JAGM line item",
      publisher: "DoD Comptroller — Office of the Under Secretary of Defense",
      type: "officiel",
      reliability: "A",
      url: "https://comptroller.defense.gov/Budget-Materials/",
    },
    {
      id: "gao-srm",
      title:
        "Solid Rocket Motor Industrial Base — recent GAO assessments",
      publisher: "U.S. Government Accountability Office",
      type: "institution",
      reliability: "A",
      url: "https://www.gao.gov/",
    },
    {
      id: "itar-22cfr121",
      title: "International Traffic in Arms Regulations — 22 CFR 121 USML",
      publisher: "U.S. Department of State — DDTC",
      type: "officiel",
      reliability: "A",
      url: "https://www.pmddtc.state.gov/",
    },
  ],
  updated: "2026-05-26",
};
