import type { DefenseSystem } from "../types";

export const thaad: DefenseSystem = {
  slug: "thaad",
  name: "THAAD",
  designation: "Terminal High Altitude Area Defense",
  reference: "PNP-MSL-015",
  category: "missile",
  missileRole: "SAM",
  classLabel:
    "Intercepteur antimissile balistique upper-tier — endo et exo-atmosphérique",
  country: "États-Unis",
  flag: "🇺🇸",
  manufacturer: "Lockheed Martin",
  introduced: "2008",
  status:
    "En service — US Army, FMS Arabie saoudite, Émirats arabes unis ; localisation industrielle régionale",
  acquisitionModes: ["FMS"],
  tagline:
    "La défense antimissile balistique de théâtre upper-tier — hit-to-kill endo/exo, complément vertical du Patriot dans la posture IAMD US.",
  summary:
    "THAAD est le système antimissile balistique de théâtre upper-tier développé par Lockheed Martin pour la US Missile Defense Agency. Sa caractéristique structurante : l'interception de missiles balistiques à courte, moyenne et intermédiaire portée dans la phase terminale, à la fois dans l'atmosphère (endo) et au-dessus (exo). C'est le seul système au monde capable de cette double couche, ce qui en fait un complément vertical naturel du PAC-3.\n\nLe principe d'interception est radical : hit-to-kill, pas de warhead, navigation par autodirecteur IR et discrimination de cible en exo-atmosphérique. Le système comporte radar AN/TPY-2, ECS, lanceurs, intercepteurs et système de gestion. Son coût unitaire publié — environ 33,9 M$ par intercepteur en gross weapon system FY2025 — illustre la position premium de la fiche dans le portefeuille missile.",
  keySpecs: [
    {
      label: "Principe d'interception",
      value:
        "Hit-to-kill — destruction par impact cinétique, kill vehicle avec autodirecteur IR",
      confidence: "haute",
      sources: ["lm-thaad", "mda-thaad"],
    },
    {
      label: "Domaine d'engagement",
      value:
        "Endoatmosphérique et exoatmosphérique — couche supérieure terminale",
      confidence: "haute",
      sources: ["lm-thaad"],
    },
    {
      label: "Mission",
      value:
        "Défense antimissile balistique de théâtre (TBMD) — courte, moyenne et intermédiaire portée",
      confidence: "haute",
      sources: ["mda-thaad"],
    },
    {
      label: "Système",
      value:
        "Intercepteur + lanceur + radar AN/TPY-2 + ECS + système C2",
      confidence: "haute",
      sources: ["lm-thaad"],
    },
    {
      label: "Capacité par batterie",
      value:
        "6 lanceurs × 8 intercepteurs = 48 intercepteurs par batterie",
      confidence: "haute",
      sources: ["mda-thaad"],
    },
    {
      label: "Coût unitaire publié",
      value:
        "≈ 33,9 M$ par intercepteur — gross weapon system FY2025",
      confidence: "haute",
      sources: ["mda-thaad-p5"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "THAAD est l'effecteur le plus cher de la fiche missile Panoplie. Le coût gross weapon system par intercepteur publié pour FY2025 est de 33,864 M$ — ce qui inclut l'intercepteur, l'ingénierie de production, l'obsolescence, le system engineering et le canister.\n\nC'est le prix d'une capacité unique au monde : intercepter un balistique à courte portée en phase terminale, à la frontière atmosphère/espace, par hit-to-kill. La fiche THAAD illustre parfaitement la stratification des coûts publics — flyaway, net procurement, gross weapon system — et pourquoi Panoplie stocke explicitement le type de coût publié.",
      indicators: [
        {
          label: "Coût gross weapon system unitaire FY2025",
          value: "33,864 M$ par intercepteur",
          confidence: "haute",
          note: "Publication MDA P-5 — gross weapon system unit cost.",
          sources: ["mda-thaad-p5"],
        },
        {
          label: "Type de coût publié",
          value:
            "Gross weapon system — la plus haute des trois lectures budgétaires",
          confidence: "haute",
          sources: ["mda-thaad-p5"],
        },
        {
          label: "Lecture économique",
          value:
            "Capacité unique — premium absolu réservé aux cibles balistiques",
          confidence: "haute",
          sources: ["lm-thaad"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "THAAD est financé par la Missile Defense Agency (MDA) au profit de l'US Army, avec une cadence de production stabilisée et des renforts FMS pour Arabie saoudite et Émirats arabes unis. La trajectoire récente inclut la localisation partielle de production en Arabie saoudite — un fait industriel et politique majeur.\n\nLe Service Life Extension Program (SLEP) en cours étend la durée de vie des intercepteurs existants et finance la modernisation logicielle. C'est un programme à valeur stratégique qui justifie un effort budgétaire constant dans la durée.",
      indicators: [
        {
          label: "Maîtrise programme",
          value: "U.S. Missile Defense Agency (MDA)",
          confidence: "haute",
          sources: ["mda-thaad"],
        },
        {
          label: "Effort budgétaire continu",
          value:
            "Production stabilisée + SLEP + extensions FMS — financement pluriannuel",
          confidence: "haute",
          sources: ["mda-thaad"],
        },
        {
          label: "Localisation industrielle",
          value:
            "Production partielle Arabie saoudite confirmée — capacité régionale",
          confidence: "haute",
          sources: ["lm-thaad-saudi"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne THAAD est dominée par Lockheed Martin avec un réseau de sous-traitants américains pour la propulsion, l'autodirecteur IR du kill vehicle, la structure et l'électronique. La localisation partielle en Arabie saoudite (annoncée 2017, en montée en charge depuis) est l'un des rares cas de transfert industriel partiel pour un système US aussi sensible.\n\nLes nœuds critiques restent contrôlés depuis les États-Unis : kill vehicle, autodirecteur IR refroidi, calculateur de mission. C'est la limite de la localisation — la valeur ajoutée principale reste US et ITAR.",
      indicators: [
        {
          label: "Maître d'œuvre",
          value: "Lockheed Martin Missiles and Fire Control",
          confidence: "haute",
          sources: ["lm-thaad"],
        },
        {
          label: "Composants critiques",
          value:
            "Kill vehicle, autodirecteur IR refroidi, propulsion, calculateur",
          confidence: "haute",
          sources: ["lm-thaad"],
        },
        {
          label: "Localisation",
          value:
            "Production partielle Arabie saoudite — composants secondaires",
          confidence: "haute",
          sources: ["lm-thaad-saudi"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "THAAD est l'un des effecteurs les plus politiquement chargés du portefeuille US. Son déploiement en Corée du Sud en 2017 a provoqué une crise diplomatique majeure avec la Chine, qui a estimé que le radar AN/TPY-2 menaçait sa propre posture stratégique. Le déploiement en Roumanie et en Israël (Golan), sa présence aux Émirats et en Arabie saoudite, font de chaque batterie un objet géopolitique en soi.\n\nLa fiche illustre concrètement ce que signifie « une munition est un objet de contrôle politique ». Au-delà du missile, c'est le radar et la doctrine d'emploi qui suscitent la controverse — d'où la sensibilité particulière des arbitrages FMS pour cette catégorie.",
      indicators: [
        {
          label: "Fonction stratégique",
          value:
            "Pilier upper-tier BMD US et FMS premium — couche supérieure terminale",
          confidence: "haute",
          sources: ["mda-thaad"],
        },
        {
          label: "Régime applicable",
          value:
            "ITAR + MTCR Cat I — autorisations US et MTCR strict",
          confidence: "haute",
          sources: ["itar-22cfr121", "mtcr-guidelines"],
        },
        {
          label: "Sensibilité géopolitique",
          value:
            "Déploiement = signal stratégique majeur — radar AN/TPY-2 comme objet de controverse",
          confidence: "haute",
          sources: ["mda-thaad"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "L'export THAAD est étroitement contrôlé par Washington. Les utilisateurs FMS sont l'Arabie saoudite (commande 2017, livraisons en cours) et les Émirats arabes unis (livré 2018). Tout transfert engage une discussion politique de haut niveau avec la MDA et le département d'État.\n\nLa double contrainte ITAR + MTCR Catégorie I s'applique avec une rigueur particulière compte tenu de la sensibilité de la capacité — détection longue portée, kill vehicle exo. Les prospects export crédibles à venir relèvent presque tous d'arbitrages politiques majeurs — pas d'une dynamique commerciale ordinaire.",
      indicators: [
        {
          label: "Canal d'export",
          value: "FMS exclusivement — arbitrage politique au cas par cas",
          confidence: "haute",
          sources: ["lm-thaad-saudi"],
        },
        {
          label: "Régime applicable",
          value: "ITAR + MTCR Cat I — application stricte",
          confidence: "haute",
          sources: ["itar-22cfr121", "mtcr-guidelines"],
        },
        {
          label: "Utilisateurs export",
          value: "Arabie saoudite, Émirats arabes unis",
          confidence: "haute",
          sources: ["lm-thaad"],
        },
      ],
    },
  ],
  variants: [
    {
      label: "THAAD",
      value:
        "Standard initial — endoatmosphérique et exoatmosphérique, en service depuis 2008",
      confidence: "haute",
      sources: ["lm-thaad"],
    },
    {
      label: "THAAD-ER (à l'étude)",
      value:
        "Extended Range étudié — booster modifié, capacité étendue annoncée",
      confidence: "faible",
      status: "a-recouper",
      sources: ["lm-thaad"],
    },
    {
      label: "Intégration C2BMC",
      value:
        "Lien avec Aegis BMD et Patriot via Command & Control, Battle Management, and Communications",
      confidence: "haute",
      sources: ["mda-thaad"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Coût extrême compensé par l'unicité capacitaire — pas d'alternative pour la couche supérieure terminale endo/exo.",
    },
    {
      key: "survivabilite",
      grade: "A",
      rationale:
        "Hit-to-kill exo-atmosphérique éprouvé en essais ; emploi opérationnel face à menaces réelles limité.",
    },
    {
      key: "exportabilite",
      grade: "D",
      rationale:
        "ITAR + MTCR I + arbitrage politique de haut niveau — exports rares, conditionnés par des intérêts stratégiques majeurs.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Chaîne Lockheed stable ; localisation partielle Arabie saoudite atténue la dépendance, sans compromettre le cœur US.",
    },
    {
      key: "maturite",
      grade: "A",
      rationale:
        "En service depuis 2008, essais en interception réussis répétés, emploi en Corée et UAE éprouvé.",
    },
    {
      key: "confiance-donnees",
      grade: "A",
      rationale:
        "MDA et P-5 budgétaires publient les chiffres clés ; performances précises d'interception classifiées.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un bouclier antimissile complet. La réalité : un effecteur upper-tier complémentaire — il ne remplace ni le Patriot pour la couche inférieure, ni Aegis pour la trajectoire ; il occupe la verticale terminale.",
    bestUseCase:
      "Doter une force d'une capacité antimissile balistique de théâtre terminal endo/exo, en complément vertical du Patriot pour les missiles à courte et moyenne portée.",
    weakPoint:
      "Le coût et la sensibilité géopolitique — un déploiement THAAD est un acte stratégique majeur, ce qui en limite l'usage tactique opportuniste.",
    analystNote:
      "THAAD est le cas pratique le plus net de la valeur d'un coût publié bien typé. Sa fiche aide aussi à comprendre la stratification de la défense aérienne moderne — couche basse (CAMM, IRIS-T SLM), couche moyenne (PAC-3 MSE, Aster 30 B1NT), couche supérieure (THAAD), trajectoire (Aegis SM-3). Chacune a son économie et sa géopolitique propres.",
  },
  operators: [
    "États-Unis",
    "Arabie saoudite (commande 2017)",
    "Émirats arabes unis",
    "Corée du Sud (batterie US déployée localement depuis 2017)",
    "Israël (batterie US déployée sur le Golan en 2019)",
    "Roumanie (batterie US déployée en 2024)",
  ],
  theatres: [
    "Corée — déploiement US permanent depuis 2017",
    "Émirats arabes unis — interceptions documentées contre menaces houthies",
    "Israël (Golan) — déploiement US depuis 2019",
    "Roumanie — déploiement US engagé en 2024",
  ],
  timeline: [
    {
      date: "2008",
      label: "Première unité opérationnelle US Army.",
      kind: "jalon",
    },
    {
      date: "2017",
      label:
        "Déploiement controversé en Corée du Sud — crise diplomatique avec la Chine.",
      kind: "emploi",
    },
    {
      date: "2017",
      label:
        "Annonce FMS Arabie saoudite — premier client export à grande échelle.",
      kind: "export",
    },
    {
      date: "2018",
      label:
        "Émirats arabes unis reçoivent leurs premières batteries.",
      kind: "export",
    },
    {
      date: "2022",
      label:
        "Interceptions documentées de missiles houthis tirés contre les Émirats — premier emploi opérationnel public.",
      kind: "emploi",
    },
    {
      date: "2024",
      label:
        "Batterie US déployée en Roumanie en réponse à l'évolution du contexte régional.",
      kind: "emploi",
    },
  ],
  sources: [
    {
      id: "lm-thaad",
      title: "THAAD — page produit Lockheed Martin",
      publisher: "Lockheed Martin",
      type: "constructeur",
      reliability: "B",
      url: "https://www.lockheedmartin.com/en-us/products/thaad.html",
    },
    {
      id: "mda-thaad",
      title:
        "Terminal High Altitude Area Defense — page programme MDA",
      publisher: "U.S. Missile Defense Agency",
      type: "officiel",
      reliability: "A",
      url: "https://www.mda.mil/system/thaad.html",
    },
    {
      id: "mda-thaad-p5",
      title: "MDA P-5 — THAAD interceptor unit cost FY2025",
      publisher: "U.S. Missile Defense Agency",
      type: "officiel",
      reliability: "A",
      url: "https://www.mda.mil/news/budget.html",
    },
    {
      id: "lm-thaad-saudi",
      title:
        "THAAD — localisation industrielle Arabie saoudite et expansion FMS",
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
