import type { DefenseSystem } from "../types";

export const aim120Amraam: DefenseSystem = {
  slug: "aim-120-amraam",
  name: "AIM-120 AMRAAM",
  designation: "Advanced Medium-Range Air-to-Air Missile",
  reference: "PNP-MSL-002",
  category: "missile",
  missileRole: "AAM",
  classLabel: "Missile air-air moyenne portée multi-emploi",
  country: "États-Unis",
  flag: "🇺🇸",
  manufacturer: "RTX (Raytheon)",
  introduced: "1991",
  status:
    "En service — référence OTAN ; production active, plus de quarante nations utilisatrices",
  acquisitionModes: ["FMS", "DCS"],
  tagline:
    "Le BVR le plus déployé du monde occidental — un missile devenu standard, dont la valeur tient autant à la doctrine partagée qu'à la performance.",
  summary:
    "AMRAAM est le missile air-air moyenne portée standard de l'US Air Force, de l'US Navy et de plus de quarante forces partenaires. C'est un effecteur à autodirecteur radar actif terminal — fire-and-forget — guidé en mi-course par inertie et liaison de données ; conçu pour libérer l'avion tireur après le tir, alors que les MRAAM précédents exigeaient un suivi continu par le radar de l'avion.\n\nLa fiche AMRAAM est aussi celle du seul AAM utilisé en surface-launch à grande échelle : il équipe les batteries NASAMS — la même munition tirée d'un Rafale F4 et d'une rampe sol-air norvégienne. Cette mutualisation logistique est une caractéristique majeure du système, et un argument industriel central de RTX.",
  keySpecs: [
    {
      label: "Guidage",
      value: "Inertiel + liaison de données + autodirecteur RF actif terminal",
      confidence: "haute",
      sources: ["navair-amraam"],
    },
    {
      label: "Mode opératoire",
      value: "Fire-and-forget ; home-on-jam ; lock-on after launch",
      confidence: "haute",
      sources: ["navair-amraam"],
    },
    {
      label: "Charge militaire",
      value: "Fragmentation HE + fusée de proximité RF",
      confidence: "haute",
      sources: ["navair-amraam"],
    },
    {
      label: "Plateformes air-air",
      value:
        "F-15, F-16, F/A-18, F-22, F-35, Eurofighter, Gripen, Tornado, Sea Harrier",
      confidence: "haute",
      sources: ["rtx-amraam"],
    },
    {
      label: "Emploi surface-launch",
      value: "NASAMS — Norvège, États-Unis, Ukraine, Pays-Bas, Finlande, etc.",
      confidence: "haute",
      sources: ["rtx-amraam"],
    },
    {
      label: "Variantes principales",
      value: "AIM-120C-7, AIM-120D, AIM-120D-3 (ext. portée) ; AMRAAM-ER en NASAMS",
      confidence: "haute",
      sources: ["rtx-amraam"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le coût AMRAAM est l'un des mieux documentés du segment air-air, parce qu'il figure dans les justifications budgétaires annuelles du DoD. Pour FY2026, la demande budgétaire combinée Air Force et Navy aboutit à environ 1,38 M$ par missile, advance procurement inclus — coût budgétaire moyen, distinct du flyaway pur.\n\nC'est un missile cher relativement aux munitions air-sol guidées, et bon marché face à un intercepteur PAC-3 ou Aster. Le ratio coût-effet est solide tant que la cible justifie un missile à autodirecteur RF actif — ce qui exclut, en doctrine, le drone bas coût.",
      indicators: [
        {
          label: "Coût budgétaire unitaire FY2026",
          value: "≈ 1,38 M$ par missile — Air Force + Navy demande combinée",
          confidence: "haute",
          note: "665,125 M$ / 483 missiles, advance procurement inclus.",
          sources: ["dod-p1-fy26-amraam"],
        },
        {
          label: "Type de coût publié",
          value: "Coût budgétaire moyen — distinct du flyaway",
          confidence: "haute",
          sources: ["dod-p1-fy26-amraam"],
        },
        {
          label: "Lecture économique",
          value:
            "Justifié contre cibles habitées ; inadapté contre essaims de drones bon marché",
          confidence: "moyenne",
          sources: ["rtx-amraam"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "AMRAAM est financé par le DoD au titre des programmes pluriannuels et par les contrats FMS pour la majorité des utilisateurs alliés. Les justifications P-1 publient les volumes, les coûts unitaires et les sources de production — un rare cas de transparence budgétaire dans le segment.\n\nRTX a engagé un partenariat avec Nammo pour sécuriser la production des moteurs à propergol solide — réponse à la tension de la base SRM identifiée par le GAO et par les retours d'expérience post-soutien à l'Ukraine.",
      indicators: [
        {
          label: "Volume FY2026 demandé",
          value: "483 missiles — USAF + USN",
          confidence: "haute",
          sources: ["dod-p1-fy26-amraam"],
        },
        {
          label: "Modèle export",
          value: "FMS majoritaire ; quelques contrats DCS",
          confidence: "haute",
          sources: ["rtx-amraam"],
        },
        {
          label: "Sécurisation propulsion",
          value: "Partenariat RTX / Nammo pour moteurs à propergol solide",
          confidence: "haute",
          sources: ["rtx-nammo"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne AMRAAM cumule trois nœuds critiques : le moteur à propergol solide, l'autodirecteur RF actif et l'électronique de mi-course. Tous trois sont sous tension après deux ans de soutien à l'Ukraine et de constitution de stocks alliés.\n\nRTX investit avec Nammo pour seconder la production de moteurs, et augmente la cadence d'assemblage final. La base demeure largement américaine ; le risque industriel principal n'est pas la dépendance étrangère, mais la capacité à tenir un rythme de production de guerre.",
      indicators: [
        {
          label: "Moteur",
          value: "Propergol solide — RTX + partenariat Nammo en montée en cadence",
          confidence: "haute",
          sources: ["rtx-nammo"],
        },
        {
          label: "Autodirecteur",
          value: "RF actif RTX — chaîne d'électronique RF US",
          confidence: "haute",
          sources: ["rtx-amraam"],
        },
        {
          label: "Risque industriel principal",
          value: "Tension de la base SRM, montée en cadence post-Ukraine",
          confidence: "moyenne",
          sources: ["gao-srm"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "AMRAAM est, avec le Patriot, l'un des piliers de l'arsenal partagé OTAN. Le choisir, c'est aligner sa doctrine air-air sur celle des États-Unis et de l'écosystème allié. C'est aussi accepter le régime ITAR : le missile, son support et ses pièces sont des defense articles soumis à autorisation américaine.\n\nL'usage en NASAMS au profit de l'Ukraine a montré que AMRAAM peut aussi devenir un effecteur sol-air sous tension de production — un signal majeur sur la valeur stratégique d'un effecteur cher mais standardisé largement.",
      indicators: [
        {
          label: "Position dans l'OTAN",
          value: "Effecteur AAM standardisé pour la majorité des alliés",
          confidence: "haute",
          sources: ["rtx-amraam"],
        },
        {
          label: "Régime applicable",
          value: "ITAR — defense article sous autorisation US",
          confidence: "haute",
          sources: ["itar-22cfr121"],
        },
        {
          label: "Effet d'écosystème",
          value: "NASAMS étend l'AMRAAM au sol — mutualisation logistique forte",
          confidence: "haute",
          sources: ["rtx-amraam"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "AMRAAM est exporté massivement, en quasi-totalité par FMS. Plus de quarante nations sont utilisatrices — chasseurs et batteries NASAMS confondus. C'est l'un des produits de défense américains les plus largement diffusés, et le levier de standardisation OTAN par excellence.\n\nLa contrepartie est le contrôle américain : autorisation préalable d'emploi, restrictions de transfert, ré-export soumis à clauses end-user. La fiche AMRAAM est donc indissociable du débat plus large sur l'ITAR et la souveraineté capacitaire des alliés.",
      indicators: [
        {
          label: "Canal d'export dominant",
          value: "FMS — vente d'État à État",
          confidence: "haute",
          sources: ["rtx-amraam"],
        },
        {
          label: "Nombre d'utilisateurs",
          value: "Plus de 40 nations partenaires",
          confidence: "haute",
          sources: ["rtx-amraam"],
        },
        {
          label: "Contrainte applicable",
          value: "ITAR — clauses end-user et restrictions de ré-export",
          confidence: "haute",
          sources: ["itar-22cfr121"],
        },
      ],
    },
  ],
  variants: [
    {
      label: "AIM-120C-7",
      value: "Standard antérieur — autodirecteur, propulsion et électronique",
      confidence: "haute",
      sources: ["rtx-amraam"],
    },
    {
      label: "AIM-120D",
      value:
        "Allonge la portée et améliore guidage / datalink — standard récent USAF/USN",
      confidence: "haute",
      sources: ["rtx-amraam"],
    },
    {
      label: "AIM-120D-3",
      value:
        "Mise à jour software récente — résilience et performance terminale",
      confidence: "moyenne",
      sources: ["rtx-amraam"],
    },
    {
      label: "AMRAAM-ER",
      value:
        "Variante surface-launch à portée étendue — utilisée en NASAMS",
      confidence: "haute",
      sources: ["rtx-amraam"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Coût budgétaire élevé compensé par la mutualisation air/sol et la masse d'emploi alliée ; inadapté contre les drones bon marché.",
    },
    {
      key: "survivabilite",
      grade: "B",
      rationale:
        "Fire-and-forget, home-on-jam, datalink — l'effecteur le mieux éprouvé du segment ; les contre-mesures avancées restent classifiées.",
    },
    {
      key: "exportabilite",
      grade: "B",
      rationale:
        "Exporté massivement par FMS mais sous ITAR — contrainte politique pour les nations cherchant l'autonomie.",
    },
    {
      key: "risque-industriel",
      grade: "C",
      rationale:
        "Tension réelle de la base SRM et de la cadence post-Ukraine ; investissements RTX/Nammo en cours.",
    },
    {
      key: "maturite",
      grade: "A",
      rationale:
        "Plus de trente ans de service, emploi en NASAMS éprouvé, intégrations multi-plateformes maîtrisées.",
    },
    {
      key: "confiance-donnees",
      grade: "A",
      rationale:
        "Documents budgétaires DoD annuels, NAVAIR, RTX — rare cas de transparence quasi complète.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un missile « universel » qui résout tous les engagements aériens. La réalité : un excellent BVR, mais une munition chère et dont la NEZ est aujourd'hui rattrapée — voire dépassée — par Meteor et la prochaine génération chinoise.",
    bestUseCase:
      "Équiper une force alliée à la doctrine OTAN d'un effecteur air-air commun, mutualisable air et sol, dont la logistique et la formation sont massivement partagées.",
    weakPoint:
      "La dépendance ITAR et la tension de la base SRM en environnement de haute intensité — la production peine à suivre la consommation post-Ukraine.",
    analystNote:
      "AMRAAM est moins un missile qu'une plomberie partagée. Sa valeur ne se mesure pas missile par missile mais par l'écosystème logistique, doctrinal et industriel qu'il consolide — l'arrivée d'AIM-260 ne le remplacera pas avant longtemps dans cette fonction.",
  },
  operators: [
    "États-Unis",
    "Allemagne",
    "Royaume-Uni",
    "France (NASAMS Ukraine — utilisateur final)",
    "Norvège (NASAMS)",
    "Pays-Bas",
    "Finlande (NASAMS)",
    "Pologne (NASAMS)",
    "Australie",
    "Japon",
    "Corée du Sud",
    "Italie",
    "Espagne",
    "Israël",
    "Ukraine (NASAMS, partenaires donateurs)",
  ],
  theatres: [
    "Bosnie 1992-1995 — premier emploi air-air documenté",
    "Irak — opérations alliées",
    "Ukraine — NASAMS depuis 2022, défense aérienne urbaine et critique",
  ],
  timeline: [
    {
      date: "1991",
      label: "Entrée en service initiale dans l'US Air Force.",
      kind: "jalon",
    },
    {
      date: "1992",
      label: "Premier engagement air-air documenté — Bosnie.",
      kind: "emploi",
    },
    {
      date: "2007",
      label: "NASAMS — premier déploiement opérationnel surface-launch.",
      kind: "emploi",
    },
    {
      date: "2022",
      label:
        "Livraisons NASAMS à l'Ukraine — emploi massif documenté contre menaces aériennes diverses.",
      kind: "emploi",
    },
    {
      date: "2024",
      label:
        "Partenariat RTX-Nammo confirmé — sécurisation de la production des moteurs à propergol solide.",
      kind: "jalon",
    },
  ],
  sources: [
    {
      id: "rtx-amraam",
      title: "AMRAAM — page produit RTX",
      publisher: "RTX (Raytheon)",
      type: "constructeur",
      reliability: "B",
      url: "https://www.rtx.com/raytheon/what-we-do/effectors/amraam",
    },
    {
      id: "navair-amraam",
      title: "AIM-120 AMRAAM — Navy fact file",
      publisher: "NAVAIR / US Navy",
      type: "officiel",
      reliability: "A",
      url: "https://www.navair.navy.mil/",
    },
    {
      id: "dod-p1-fy26-amraam",
      title: "FY2026 Procurement Justification Book — AIM-120 AMRAAM",
      publisher: "DoD Comptroller — Office of the Under Secretary of Defense",
      type: "officiel",
      reliability: "A",
      url: "https://comptroller.defense.gov/Budget-Materials/",
    },
    {
      id: "rtx-nammo",
      title: "RTX and Nammo partnership for AMRAAM rocket motors",
      publisher: "RTX",
      type: "constructeur",
      reliability: "B",
      url: "https://www.rtx.com/news/",
    },
    {
      id: "gao-srm",
      title: "Solid Rocket Motor Industrial Base — recent GAO reports",
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
      url: "https://www.pmddtc.state.gov/ddtc_public/ddtc_public?id=ddtc_kb_article_page&sys_id=24d528fddbfc930044f9ff621f961987",
    },
  ],
  updated: "2026-05-26",
};
