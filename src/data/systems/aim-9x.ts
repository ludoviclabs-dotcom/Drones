import type { DefenseSystem } from "../types";

export const aim9x: DefenseSystem = {
  slug: "aim-9x",
  name: "AIM-9X Sidewinder",
  designation: "AIM-9X Block II",
  reference: "PNP-MSL-009",
  category: "missile",
  missileRole: "AAM",
  classLabel: "Missile air-air courte portée — défense de point dual-use",
  country: "États-Unis",
  flag: "🇺🇸",
  manufacturer: "RTX (Raytheon)",
  introduced: "2003",
  status:
    "En service — US Navy, USAF, et plus de trente partenaires FMS ; Block II en production",
  acquisitionModes: ["FMS", "DCS"],
  tagline:
    "Le standard WVR du monde occidental — un missile court rendu pertinent par un autodirecteur IR avancé, le LOAL et l'emploi surface-launch.",
  summary:
    "AIM-9X est la dernière itération vivante de la famille Sidewinder, l'une des familles de missiles air-air les plus produites du XXe siècle. Son autodirecteur IR à imagerie focale, sa capacité high off-boresight et son intégration au casque JHMCS l'ont fait sortir de la simple succession technique pour entrer dans le combat aérien moderne — il complète AMRAAM dans le combat au-delà comme en deçà de la portée visuelle.\n\nLe Block II ajoute le LOAL — lock-on after launch — et un datalink permettant de tirer sans verrou initial, puis de désigner la cible en vol. La même munition équipe aussi NASAMS en surface-launch, ce qui en fait un effecteur dual-use à fort levier logistique. Pour Panoplie, AIM-9X est l'archétype du missile court à valeur ajoutée logicielle — le hardware est mature, l'évolution est dans le seeker, la doctrine et le datalink.",
  keySpecs: [
    {
      label: "Mode de guidage",
      value: "Autodirecteur IR à imagerie focale (FPA) — Block II",
      confidence: "haute",
      sources: ["rtx-aim9x", "navair-aim9x"],
    },
    {
      label: "Modes opératoires",
      value:
        "LOBL, LOAL + datalink (Block II), high off-boresight via JHMCS",
      confidence: "haute",
      sources: ["rtx-aim9x"],
    },
    {
      label: "Charge militaire",
      value: "Fragmentation annulaire avec fusée de proximité laser actif",
      confidence: "haute",
      sources: ["navair-aim9x"],
    },
    {
      label: "Plateformes air-air",
      value:
        "F-15, F-16, F/A-18, F-22, F-35, AV-8B, Eurofighter, Gripen, Sea Harrier",
      confidence: "haute",
      sources: ["rtx-aim9x"],
    },
    {
      label: "Emploi surface-launch",
      value:
        "NASAMS — intercepteur courte portée complémentaire de l'AMRAAM",
      confidence: "haute",
      sources: ["rtx-aim9x"],
    },
    {
      label: "Capacité IRCCM",
      value:
        "Contre-mesures intégrées à l'autodirecteur — détails public partiels",
      confidence: "moyenne",
      status: "variable",
      sources: ["rtx-aim9x"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "AIM-9X figure aux justifications budgétaires US — la demande FY2026 publie un coût budgétaire moyen de l'ordre de 0,58 M$ par missile. C'est l'un des AAM occidentaux les moins coûteux à l'unité, ce qui justifie aussi son emploi de défense de point et sa mutualisation surface-launch.\n\nLa logique économique est explicite : le coût par tir reste bas relativement aux autres familles, ce qui permet une dotation large dans les soutes et sur les rampes NASAMS. Cela en fait l'effecteur courte portée par défaut dans l'arsenal OTAN — un missile qu'on peut se permettre de tirer.",
      indicators: [
        {
          label: "Coût budgétaire unitaire FY2026",
          value: "≈ 0,58 M$ par missile",
          confidence: "haute",
          note: "100,352 M$ / 173 missiles — total FY2026.",
          sources: ["dod-p1-fy26-aim9x"],
        },
        {
          label: "Type de coût publié",
          value: "Coût budgétaire moyen — production complète",
          confidence: "haute",
          sources: ["dod-p1-fy26-aim9x"],
        },
        {
          label: "Lecture économique",
          value:
            "Le moins cher des AAM occidentaux modernes — dotation large possible",
          confidence: "haute",
          sources: ["rtx-aim9x"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le programme est porté en commun par l'US Navy et l'USAF, avec une cadence de production stable et un volume d'export massif. Le partenariat avec les nations FMS et DCS rend le coût marginal d'un lot supplémentaire très bas — la chaîne est rodée et déjà amortie.\n\nL'enjeu financier des prochaines années est moins la production que les évolutions logicielles : maturation IRCCM, intégration sur de nouvelles plateformes (F-35 Block 4), et capacité datalink étendue. Ce sont des sujets logiciels qui coûtent peu en proportion de la valeur capacitaire ajoutée.",
      indicators: [
        {
          label: "Volume FY2026 demandé",
          value: "173 missiles — Navy + Air Force",
          confidence: "haute",
          sources: ["dod-p1-fy26-aim9x"],
        },
        {
          label: "Modèle export",
          value: "FMS pour la majorité ; DCS pour quelques partenaires",
          confidence: "haute",
          sources: ["rtx-aim9x"],
        },
        {
          label: "Stade industriel",
          value: "Production stabilisée, courbe d'apprentissage atteinte",
          confidence: "haute",
          sources: ["rtx-aim9x"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne AIM-9X est largement domestique américaine sous maîtrise d'œuvre RTX. Les nœuds critiques sont l'autodirecteur IR à imagerie focale, le moteur à propergol solide et l'électronique de mission. La base SRM est partagée avec AMRAAM et JAGM — d'où la même pression structurelle.\n\nL'avantage de Sidewinder est la maturité industrielle : la chaîne est rodée depuis des décennies, les coûts d'investissement de capacité sont déjà absorbés. C'est l'un des programmes les moins exposés au risque de cadence dans l'arsenal courte portée.",
      indicators: [
        {
          label: "Maître d'œuvre",
          value: "RTX (Raytheon Missiles & Defense)",
          confidence: "haute",
          sources: ["rtx-aim9x"],
        },
        {
          label: "Composants critiques",
          value:
            "Autodirecteur IR FPA, moteur à propergol solide, charge fragmentation",
          confidence: "haute",
          sources: ["rtx-aim9x"],
        },
        {
          label: "Risque industriel principal",
          value:
            "Base SRM partagée — pression modérée car la cadence est mature",
          confidence: "moyenne",
          sources: ["gao-srm"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "AIM-9X est dans toutes les soutes occidentales. Sa position dans l'OTAN est celle d'un standard partagé pour le combat rapproché et la défense de point — il accompagne presque systématiquement AMRAAM dans la dotation air-air.\n\nLe régime ITAR s'applique comme pour AMRAAM. La fiche AIM-9X confirme l'analyse plus large sur le segment AAM US : standardisation maximale, dépendance ITAR, levier doctrinal partagé. C'est l'effecteur de la routine alliée.",
      indicators: [
        {
          label: "Position dans l'OTAN",
          value:
            "Effecteur WVR standard pour la majorité des alliés OTAN et partenaires",
          confidence: "haute",
          sources: ["rtx-aim9x"],
        },
        {
          label: "Régime applicable",
          value: "ITAR — defense article sous autorisation US",
          confidence: "haute",
          sources: ["itar-22cfr121"],
        },
        {
          label: "Effet d'écosystème",
          value:
            "Complète AMRAAM dans la dotation air-air ; étendu au sol via NASAMS",
          confidence: "haute",
          sources: ["rtx-aim9x"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "L'export AIM-9X se fait par FMS principalement, avec quelques contrats DCS pour des opérateurs sélectionnés. Plus de trente nations sont utilisatrices, ce qui en fait l'un des effecteurs aériens les plus diffusés du monde occidental.\n\nLes clauses ITAR habituelles s'appliquent. Le ré-export est encadré ; mais le caractère courte portée et défensif du missile rend les arbitrages politiques plus faciles que pour AMRAAM ou les ARM longue portée.",
      indicators: [
        {
          label: "Canal d'export dominant",
          value: "FMS — vente d'État à État",
          confidence: "haute",
          sources: ["rtx-aim9x"],
        },
        {
          label: "Nombre d'utilisateurs",
          value: "Plus de 30 nations partenaires",
          confidence: "haute",
          sources: ["rtx-aim9x"],
        },
        {
          label: "Régime applicable",
          value: "ITAR — autorisations préalables et clauses end-user",
          confidence: "haute",
          sources: ["itar-22cfr121"],
        },
      ],
    },
  ],
  variants: [
    {
      label: "AIM-9X Block I",
      value:
        "Standard initial — autodirecteur IR FPA, agility air-air, capacité high off-boresight",
      confidence: "haute",
      sources: ["rtx-aim9x"],
    },
    {
      label: "AIM-9X Block II",
      value:
        "Ajoute LOAL et datalink — engage sans verrou initial, puis désigne en vol",
      confidence: "haute",
      sources: ["rtx-aim9x"],
    },
    {
      label: "AIM-9X Block II+ / III (étudié)",
      value:
        "Évolutions software, IRCCM, datalink étendu — feuille de route en cours",
      confidence: "faible",
      status: "a-recouper",
      sources: ["rtx-aim9x"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "A",
      rationale:
        "Coût unitaire bas pour un effecteur AAM moderne ; capacité partagée air-air et sol-air via NASAMS.",
    },
    {
      key: "survivabilite",
      grade: "B",
      rationale:
        "Autodirecteur IRCCM, LOAL et HOB éprouvés ; les contre-mesures avancées restent une zone classifiée.",
    },
    {
      key: "exportabilite",
      grade: "B",
      rationale:
        "Largement exporté par FMS mais sous ITAR — contrainte politique modérée pour ce type d'effecteur.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Chaîne mature, cadence stabilisée ; même base SRM que les autres munitions sous tension.",
    },
    {
      key: "maturite",
      grade: "A",
      rationale:
        "Plus de vingt ans de service, intégrations multi-plateformes maîtrisées, emploi en NASAMS éprouvé.",
    },
    {
      key: "confiance-donnees",
      grade: "A",
      rationale:
        "Justifications budgétaires DoD, NAVAIR, RTX — couverture solide.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : le successeur direct du Sidewinder de Vietnam. La réalité : un missile dont seul le nom de famille fait référence à 1958 — l'autodirecteur, la cinématique et l'intégration relèvent d'une autre époque tactique.",
    bestUseCase:
      "Doter un parc OTAN d'un effecteur WVR partagé air-air et sol-air, à coût marginal modéré, pour le combat rapproché et la défense de point.",
    weakPoint:
      "La dépendance ITAR et la limite intrinsèque d'un IR courte portée face à des cibles très lentes ou très dégradées thermiquement.",
    analystNote:
      "AIM-9X est l'effecteur courte portée que les opérateurs occidentaux n'ont pas besoin de penser. C'est sa principale qualité — il fonctionne, il est partout, il sert deux missions distinctes avec la même munition. Suivre l'évolution Block III et l'intégration F-35 Block 4 pour la prochaine étape capacitaire.",
  },
  operators: [
    "États-Unis",
    "Allemagne",
    "Royaume-Uni",
    "Australie",
    "Norvège (air + NASAMS)",
    "Pays-Bas",
    "Pologne",
    "Finlande",
    "Japon",
    "Corée du Sud",
    "Israël",
    "Émirats arabes unis",
    "Singapour",
    "Suisse",
    "Turquie",
  ],
  theatres: [
    "Irak / Afghanistan — emploi en escorte et défense de point",
    "Ukraine — NASAMS depuis 2022, défense aérienne urbaine et critique",
  ],
  timeline: [
    {
      date: "2003",
      label: "Mise en service initiale de l'AIM-9X Block I.",
      kind: "jalon",
    },
    {
      date: "2015",
      label: "Mise en service du Block II — LOAL et datalink.",
      kind: "jalon",
    },
    {
      date: "2022",
      label:
        "Livraisons NASAMS à l'Ukraine — emploi sol-air massif documenté.",
      kind: "emploi",
    },
  ],
  sources: [
    {
      id: "rtx-aim9x",
      title: "AIM-9X Sidewinder — page produit RTX",
      publisher: "RTX (Raytheon)",
      type: "constructeur",
      reliability: "B",
      url: "https://www.rtx.com/raytheon/what-we-do/effectors/aim-9x-sidewinder-missile",
    },
    {
      id: "navair-aim9x",
      title: "AIM-9X — NAVAIR / US Navy",
      publisher: "NAVAIR / US Navy",
      type: "officiel",
      reliability: "A",
      url: "https://www.navair.navy.mil/",
    },
    {
      id: "dod-p1-fy26-aim9x",
      title: "FY2026 Procurement Justification Book — AIM-9X line item",
      publisher: "DoD Comptroller — Office of the Under Secretary of Defense",
      type: "officiel",
      reliability: "A",
      url: "https://comptroller.defense.gov/Budget-Materials/",
    },
    {
      id: "gao-srm",
      title: "Solid Rocket Motor Industrial Base — recent GAO assessments",
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
