import type { DefenseSystem } from "../types";

export const bayraktarTb2: DefenseSystem = {
  slug: "bayraktar-tb2",
  name: "Bayraktar TB2",
  designation: "TB2",
  reference: "PNP-DR-002",
  category: "drone",
  droneClass: "MALE",
  classLabel: "Drone MALE tactique",
  country: "Turquie",
  flag: "🇹🇷",
  manufacturer: "Baykar",
  introduced: "2014",
  status: "En service — production active, fort volume d'export",
  acquisitionModes: ["DCS", "production-nationale"],
  tagline:
    "Le drone qui a démocratisé la frappe — abordable, exportable, et devenu un symbole géopolitique.",
  summary:
    "Le Bayraktar TB2 de Baykar est le drone qui a brisé le monopole des grandes puissances sur la frappe aérienne. Plus petit et bien moins cher qu'un Reaper, ce vecteur tactique de 12 mètres a transformé des armées modestes en forces capables de frapper avec précision.\n\nRévélé au grand public en Libye, au Haut-Karabakh puis en Ukraine, il doit son succès autant à sa doctrine d'emploi et à son marketing qu'à ses performances brutes. Le TB2 est devenu un objet politique — un symbole de l'autonomie turque et un produit d'influence. Mais la guerre d'Ukraine a aussi exposé ses limites dès que la défense sol-air adverse se densifie.",
  keySpecs: [
    {
      label: "Envergure",
      value: "12 m",
      confidence: "haute",
      sources: ["baykar"],
    },
    {
      label: "Endurance",
      value: "≈ 27 h",
      confidence: "moyenne",
      sources: ["baykar"],
    },
    {
      label: "Plafond opérationnel",
      value: "≈ 7 600 m",
      confidence: "moyenne",
      note: "Plafond plus bas qu'un MALE lourd.",
      sources: ["baykar"],
    },
    {
      label: "Charge utile",
      value: "≈ 150 kg",
      confidence: "moyenne",
      note: "Quatre points d'emport ; micro-munitions MAM.",
      sources: ["baykar"],
    },
    {
      label: "Liaison",
      value: "Vue directe (LOS) — ≈ 150 km",
      confidence: "haute",
      note: "Pas de SATCOM en standard : rayon d'action borné par l'horizon.",
      sources: ["iiss-mb"],
    },
    {
      label: "Motorisation",
      value: "Moteur d'aviation légère (≈ 100 ch)",
      confidence: "moyenne",
      sources: ["baykar"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le TB2 a fait du prix un argument stratégique. Là où un système Reaper se chiffre en dizaines de millions, un système TB2 — six vecteurs et leurs stations sol — est cité dans une fourchette bien inférieure, de l'ordre de la dizaine de millions.\n\nCe positionnement low-cost rend le drone armé accessible à des budgets modestes. Mais le « prix d'appel » masque le coût réel d'un parc soutenu dans la durée : munitions, attrition au combat, formation.",
      indicators: [
        {
          label: "Coût unitaire (vecteur)",
          value: "≈ 1–5 M$",
          confidence: "faible",
          status: "variable",
          note: "Estimations de presse divergentes, non confirmées par le constructeur.",
          sources: ["sipri-at"],
        },
        {
          label: "Coût d'un système",
          value: "≈ 10 M$ et plus",
          confidence: "faible",
          status: "variable",
          note: "Ordre de grandeur — six vecteurs et stations sol.",
          sources: ["sipri-at"],
        },
        {
          label: "Munitions",
          value: "Micro-munitions MAM — faible coût unitaire",
          confidence: "moyenne",
          sources: ["baykar"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le TB2 est porté par un industriel privé, Baykar, et non par un programme d'État classique. Cette structure lui donne une agilité commerciale rare dans la défense : tarifs, délais et conditions négociés directement.\n\nLe financement de l'achat relève souvent d'accords bilatéraux et d'arrangements de production locale. Pour Ankara, l'export du TB2 est aussi un outil diplomatique — un produit qui finance une industrie nationale et achète de l'influence.",
      indicators: [
        {
          label: "Cadre de financement",
          value: "Industriel privé (Baykar) ; accords bilatéraux",
          confidence: "haute",
          sources: ["baykar"],
        },
        {
          label: "Canal d'acquisition",
          value: "Vente commerciale directe, accords de production locale",
          confidence: "haute",
          sources: ["sipri-at"],
        },
        {
          label: "Dimension",
          value: "Outil d'influence diplomatique turc",
          confidence: "moyenne",
          sources: ["rusi-tb2"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La supply chain du TB2 est son chapitre le plus instructif. À l'origine, le drone intégrait des composants occidentaux clés : boule optronique canadienne, moteur d'origine autrichienne.\n\nAprès le Haut-Karabakh en 2020, le Canada a suspendu l'exportation de ses capteurs vers la Turquie. Baykar a alors accéléré la « nationalisation » de la chaîne — optronique et moteur turcs. Une démonstration grandeur nature de la façon dont un contrôle d'export peut être contourné par la substitution industrielle.",
      indicators: [
        {
          label: "Maître d'œuvre",
          value: "Baykar (Turquie)",
          confidence: "haute",
          sources: ["baykar"],
        },
        {
          label: "Composant historiquement sensible",
          value: "Boule optronique canadienne",
          confidence: "moyenne",
          note: "Exportation suspendue par le Canada en 2020.",
          sources: ["defensenews-tb2"],
        },
        {
          label: "Trajectoire",
          value: "Nationalisation accélérée de la chaîne",
          confidence: "moyenne",
          sources: ["defensenews-tb2"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Le TB2 est un instrument géopolitique avant d'être un produit. Chaque vente prolonge l'influence turque et offre à Ankara une carte diplomatique. Pour l'acheteur, il représente une émancipation : frapper sans dépendre de l'autorisation de Washington ou de Moscou.\n\nSon succès — Azerbaïdjan, Ukraine, Libye, Afrique — a redessiné des rapports de force régionaux et nourri une véritable « diplomatie du drone ».",
      indicators: [
        {
          label: "Fonction stratégique",
          value: "Émancipation de l'acheteur, influence turque",
          confidence: "moyenne",
          sources: ["rusi-tb2"],
        },
        {
          label: "Diffusion",
          value: "Une trentaine de pays utilisateurs",
          confidence: "moyenne",
          note: "Estimations ouvertes.",
          sources: ["newamerica-drones"],
        },
        {
          label: "Effet d'image",
          value: "Fort — symbole médiatique et politique",
          confidence: "moyenne",
          sources: ["rusi-tb2"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "L'exportabilité est l'atout maître du TB2. La Turquie applique des contraintes d'export plus légères que les régimes américain ou européen, et Baykar assume une stratégie commerciale agressive.\n\nLe revers de la nationalisation : à mesure que le drone intègre des composants nationaux, il échappe à l'effet « ITAR » qui bridait ses ventes — mais il reste exposé aux pressions diplomatiques sur les pays vendeurs comme acheteurs.",
      indicators: [
        {
          label: "Régime applicable",
          value: "Contrôle turc — contraintes allégées",
          confidence: "moyenne",
          sources: ["sipri-at"],
        },
        {
          label: "Atout",
          value: "Peu de restrictions de réexport, marketing offensif",
          confidence: "moyenne",
          sources: ["rusi-tb2"],
        },
        {
          label: "Sensibilité",
          value: "Pression diplomatique selon les théâtres d'emploi",
          confidence: "moyenne",
          sources: ["rusi-tb2"],
        },
      ],
      organisms: ["wassenaar", "tca"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "A",
      rationale:
        "Rapport capacité/prix exceptionnel : une frappe de précision rendue accessible à des budgets modestes.",
    },
    {
      key: "survivabilite",
      grade: "D",
      rationale:
        "Efficace face à des défenses légères ; pertes nombreuses dès que la défense sol-air adverse se densifie (Ukraine, 2022).",
    },
    {
      key: "exportabilite",
      grade: "A",
      rationale:
        "Contraintes d'export allégées, nationalisation de la chaîne et stratégie commerciale offensive.",
    },
    {
      key: "risque-industriel",
      grade: "C",
      rationale:
        "Chaîne en cours de nationalisation, mais dépendances résiduelles et maître d'œuvre unique.",
    },
    {
      key: "maturite",
      grade: "B",
      rationale:
        "Éprouvé sur plusieurs théâtres depuis 2014 ; doctrine d'emploi largement diffusée.",
    },
    {
      key: "confiance-donnees",
      grade: "C",
      rationale:
        "Communication constructeur abondante mais peu de chiffres indépendants ; coûts surtout estimés par la presse.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un drone miracle, né du Haut-Karabakh, qui gagnerait les guerres à lui seul. La réalité : le TB2 excelle contre un adversaire mal défendu, mais son plafond bas, sa liaison à courte portée et sa lenteur le rendent vulnérable dès que la défense anti-aérienne se densifie — comme l'a montré l'Ukraine après 2022.",
    bestUseCase:
      "Frappe de précision et ISR contre un adversaire à la défense sol-air faible ou désorganisée ; montée en puissance rapide d'une force aérienne modeste.",
    weakPoint:
      "La survivabilité en milieu contesté et l'absence de liaison SATCOM, qui borne le rayon d'action à la vue directe.",
    analystNote:
      "Le TB2 a moins révolutionné la technique que l'accès : il a prouvé qu'un drone armé pouvait être un produit de grande diffusion. Sa vraie portée est industrielle et politique — un modèle d'autonomie que beaucoup chercheront à copier.",
  },
  operators: [
    "Turquie",
    "Azerbaïdjan",
    "Ukraine",
    "Libye",
    "Pologne",
    "Qatar",
    "Maroc",
    "Kirghizistan",
  ],
  theatres: ["Syrie (Idlib)", "Libye", "Haut-Karabakh", "Ukraine", "Éthiopie"],
  timeline: [
    { date: "2014", label: "Entrée en service du Bayraktar TB2 ; emploi sur plusieurs théâtres depuis cette date.", kind: "jalon" },
    { date: "2020", label: "Emploi médiatisé au Haut-Karabakh, révélant le drone au grand public.", kind: "emploi" },
    { date: "2020", label: "Le Canada suspend l'exportation de sa boule optronique vers la Turquie après le Haut-Karabakh.", kind: "debat" },
    { date: "2022", label: "Pertes nombreuses en Ukraine dès que la défense sol-air adverse se densifie.", kind: "emploi" },
  ],
  sources: [
    {
      id: "baykar",
      title: "Bayraktar TB2 — documentation système",
      publisher: "Baykar",
      type: "constructeur",
      reliability: "C",
      url: "https://www.baykartech.com",
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
      id: "iiss-mb",
      title: "The Military Balance",
      publisher: "IISS",
      type: "institution",
      reliability: "A",
    },
    {
      id: "newamerica-drones",
      title: "World of Drones — Tracking Armed Drone Use",
      publisher: "New America",
      type: "think-tank",
      reliability: "B",
      url: "https://www.newamerica.org/insights/world-drones/",
    },
    {
      id: "rusi-tb2",
      title: "Analyses sur l'emploi des drones tactiques",
      publisher: "RUSI",
      type: "think-tank",
      reliability: "B",
      url: "https://www.rusi.org",
    },
    {
      id: "defensenews-tb2",
      title:
        "Canadian block on drone parts shows Turkey's defense industry still not independent",
      publisher: "Defense News",
      type: "presse",
      reliability: "B",
      url: "https://www.defensenews.com/global/europe/2020/10/13/canadian-block-on-drone-parts-shows-turkeys-defense-industry-still-not-independent/",
    },
  ],
  updated: "2026-05-20",
};
