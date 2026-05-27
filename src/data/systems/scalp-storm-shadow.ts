import type { DefenseSystem } from "../types";

export const scalpStormShadow: DefenseSystem = {
  slug: "scalp-storm-shadow",
  name: "SCALP / Storm Shadow",
  designation: "Système de Croisière Autonome à Longue Portée — Emploi Général",
  reference: "PNP-MSL-003",
  category: "missile",
  missileRole: "ASM",
  classLabel: "Missile de croisière air-sol de frappe dans la profondeur",
  country: "France / Royaume-Uni",
  flag: "🇫🇷🇬🇧",
  manufacturer: "MBDA",
  introduced: "2003",
  status:
    "En service — France, Royaume-Uni, Italie, Égypte, Grèce ; emploi en combat documenté",
  acquisitionModes: ["cooperatif", "DCS"],
  tagline:
    "Le standard européen du deep strike air-sol — mission planifiée, pénétration à basse altitude, charge anti-bunker.",
  summary:
    "SCALP — Storm Shadow côté britannique — est le missile de croisière air-sol conçu en coopération franco-britannique sous maîtrise d'œuvre MBDA. C'est l'effecteur européen de référence pour la frappe planifiée dans la profondeur : pénétration à basse altitude, navigation inertielle assistée par GNSS et terrain matching, terminal imaging IR, charge BROACH conçue pour pénétrer puis détruire un bunker.\n\nSon emploi en Ukraine depuis 2023 — Storm Shadow britannique puis SCALP français livrés et tirés contre des objectifs stratégiques russes — a fait de cette munition l'un des marqueurs publics du soutien occidental à Kiev. C'est aussi le test grandeur nature d'un système conçu dans les années 1990 contre une défense aérienne moderne — un cas d'école.",
  keySpecs: [
    {
      label: "Mission",
      value: "Frappe pré-planifiée à longue portée — bunkers, infrastructures, C2",
      confidence: "haute",
      sources: ["mbda-scalp"],
    },
    {
      label: "Guidage",
      value:
        "Inertiel + GNSS + terrain matching + autodirecteur imageur IR terminal",
      confidence: "haute",
      sources: ["mbda-scalp"],
    },
    {
      label: "Profil de vol",
      value:
        "Très basse altitude, suivi de terrain — pénétration des défenses aériennes",
      confidence: "haute",
      sources: ["mbda-scalp"],
    },
    {
      label: "Charge militaire",
      value: "BROACH — pénétrante puis explosive, optimisée anti-bunker",
      confidence: "haute",
      sources: ["mbda-scalp"],
    },
    {
      label: "Plateformes",
      value: "Rafale, Mirage 2000-D, Tornado GR4, Eurofighter, Typhoon, Su-24 (UA)",
      confidence: "haute",
      sources: ["mbda-scalp", "mod-uk-storm"],
    },
    {
      label: "Classe de portée publique",
      value:
        "Longue portée — valeur exacte non publiée, ordre de grandeur > 250 km en version export",
      confidence: "moyenne",
      status: "variable",
      sources: ["mod-uk-storm"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "SCALP n'est pas vendu à l'unité dans le domaine public : le coût se lit par lot d'achat ou de remise à niveau. Les programmes MLR — Mid-Life Refurbishment — sont une part importante du coût total, parce qu'un missile vieux de 20 ans nécessite la mise à jour de ses composants électroniques, propulsifs et explosifs.\n\nL'export récent vers la Grèce, dans le contrat Rafale, illustre la logique du bundle plateforme + effecteur. Le coût SCALP est ainsi noyé dans le coût d'acquisition d'un escadron Rafale — un mode opératoire qui rend la transparence budgétaire moins lisible que pour les programmes US.",
      indicators: [
        {
          label: "Coût unitaire public",
          value: "Non publié — livraison par lots contractuels",
          confidence: "faible",
          status: "variable",
          sources: ["mbda-scalp"],
        },
        {
          label: "Coût MLR",
          value:
            "Poste majeur — modernisation électronique, propulsion, charge ; Grèce et Italie engagées",
          confidence: "moyenne",
          sources: ["mbda-scalp-mlr"],
        },
        {
          label: "Logique économique",
          value:
            "Munition consommable rare et chère — emploi sur cibles à très forte valeur",
          confidence: "moyenne",
          sources: ["mbda-scalp"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "SCALP est financé en partage franco-britannique, avec montée en charge industrielle MBDA des deux côtés de la Manche. La pression sur les stocks après le soutien à l'Ukraine a conduit la France à passer en 2024 un contrat de remise à niveau et de production de nouveaux missiles.\n\nLe modèle financier reste celui d'une munition stratégique — volumes faibles, valeur unitaire élevée, intégration profonde dans les contrats plateforme. C'est aussi pour cela que la transparence budgétaire est faible : SCALP n'apparaît pas comme une ligne autonome dans les documents budgétaires français comme l'AMRAAM dans les P-1 américains.",
      indicators: [
        {
          label: "Modèle de financement",
          value: "Coopération FR-UK — production MBDA des deux côtés",
          confidence: "haute",
          sources: ["mbda-scalp"],
        },
        {
          label: "Notification récente (FR)",
          value:
            "Contrat 2024 — modernisation et production nouvelle, post-Ukraine",
          confidence: "moyenne",
          sources: ["mbda-scalp-mlr"],
        },
        {
          label: "Stade stocks alliés",
          value:
            "Sous tension après dons à l'Ukraine — reconstitution engagée",
          confidence: "moyenne",
          sources: ["mod-uk-storm"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne SCALP est partagée entre MBDA UK et MBDA France, avec des sous-systèmes critiques chez des sous-traitants nationaux des deux pays. C'est l'archétype du programme européen à supply chain duale — autonomie complète vis-à-vis des États-Unis, mais coordination industrielle franco-britannique permanente.\n\nLes nœuds sensibles sont la propulsion turbojet, la charge BROACH et l'autodirecteur imageur. Tous trois sont des compétences détenues par MBDA et ses partenaires européens. Le risque industriel principal est la cadence : remettre une chaîne de production en route pour une munition de niche est plus coûteux que pour un missile produit en flux continu.",
      indicators: [
        {
          label: "Maître d'œuvre",
          value: "MBDA — équipes UK et FR",
          confidence: "haute",
          sources: ["mbda-scalp"],
        },
        {
          label: "Composants critiques",
          value: "Turbojet, charge BROACH, autodirecteur imageur IR terminal",
          confidence: "haute",
          sources: ["mbda-scalp"],
        },
        {
          label: "Risque industriel principal",
          value: "Cadence — relance d'une production de munition de niche",
          confidence: "moyenne",
          sources: ["mbda-scalp-mlr"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "SCALP est l'arme européenne du choix politique. La livraison à l'Ukraine d'abord par Londres en 2023, puis par Paris, a fait passer le missile du statut d'outil tactique national à celui de signal stratégique transmissible — un fait diplomatique majeur de la guerre en Ukraine.\n\nLa fiche SCALP doit donc se lire à deux niveaux : effecteur de mission planifiée pour son utilisateur d'origine, et levier politique mobilisable par un État souverain dans une crise. C'est précisément ce que l'autonomie hors ITAR permet — et que SCALP a démontré.",
      indicators: [
        {
          label: "Fonction stratégique",
          value:
            "Effecteur de frappe planifiée + levier politique transmissible",
          confidence: "haute",
          sources: ["mod-uk-storm"],
        },
        {
          label: "Régime applicable",
          value:
            "Contrôle FR + UK + UE — hors ITAR, transferts autorisés au niveau étatique",
          confidence: "haute",
          sources: ["eu-cp-944"],
        },
        {
          label: "Signal stratégique récent",
          value:
            "Livraisons à l'Ukraine — preuve d'autonomie capacitaire occidentale non US",
          confidence: "haute",
          sources: ["mod-uk-storm"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "SCALP est exporté de façon ciblée — Égypte, Grèce, Italie, et utilisateurs Rafale ou Eurofighter qui en font la demande. Chaque transfert relève d'une décision politique au niveau étatique, dans le cadre des régimes nationaux français et britannique et de la Position commune européenne.\n\nL'absence de contrainte ITAR fait toute la différence : un client peut envisager des trajectoires d'emploi sans devoir solliciter une autorisation américaine. Cette caractéristique est l'argument central de l'offre MBDA dans le segment standoff.",
      indicators: [
        {
          label: "Canal d'export",
          value: "Contrats nationaux ou packages plateforme — Rafale notamment",
          confidence: "haute",
          sources: ["mbda-scalp"],
        },
        {
          label: "Régime applicable",
          value: "Contrôle FR + UK + Position commune UE — hors ITAR",
          confidence: "haute",
          sources: ["eu-cp-944"],
        },
        {
          label: "Utilisateurs export connus",
          value: "Égypte, Grèce, Italie ; Ukraine en transfert allié",
          confidence: "haute",
          sources: ["mod-uk-storm"],
        },
      ],
    },
  ],
  variants: [
    {
      label: "SCALP EG (France)",
      value: "Standard français — Rafale et Mirage 2000-D",
      confidence: "haute",
      sources: ["mbda-scalp"],
    },
    {
      label: "Storm Shadow (Royaume-Uni)",
      value: "Standard britannique — Tornado puis Typhoon",
      confidence: "haute",
      sources: ["mod-uk-storm"],
    },
    {
      label: "SCALP / Storm Shadow rénové",
      value:
        "Mid-Life Refurbishment — modernisation électronique, propulsion, charge",
      confidence: "moyenne",
      sources: ["mbda-scalp-mlr"],
    },
    {
      label: "FC/ASW (successeur)",
      value:
        "Future Cruise / Anti-Ship Weapon — programme FR-UK de remplacement à venir",
      confidence: "moyenne",
      sources: ["mbda-scalp"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Munition stratégique chère mais sans équivalent occidental hors US contre cibles durcies ; ratio coût-effet justifié pour le segment.",
    },
    {
      key: "survivabilite",
      grade: "B",
      rationale:
        "Vol basse altitude, suivi de terrain, signature réduite ; rattrapée par les défenses aériennes modernes — d'où l'urgence du programme FC/ASW.",
    },
    {
      key: "exportabilite",
      grade: "B",
      rationale:
        "Hors ITAR mais soumis à arbitrage étatique strict — exporté de façon ciblée, pas en masse.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Chaîne FR-UK MBDA souveraine ; le risque tient à la cadence d'une production de niche en relance post-Ukraine.",
    },
    {
      key: "maturite",
      grade: "A",
      rationale:
        "En service depuis 2003, employé en combat à plusieurs reprises — Irak, Libye, Levant, Ukraine.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "Constructeur et ministères publient l'essentiel ; portée exacte et performances terminales classifiées.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un missile invulnérable qui frappe partout en profondeur. La réalité : un effecteur excellent contre une défense aérienne dégradée, mais dont l'attrition documentée en Ukraine montre la limite face à un IADS dense et alerte.",
    bestUseCase:
      "Frapper une cible stratégique durcie — bunker, C2, infrastructure énergétique — pré-planifiée, à très longue portée, sans engager l'avion tireur dans la zone défendue.",
    weakPoint:
      "Trente ans d'écart entre la conception et l'environnement actuel : la pénétration à basse altitude reste valable mais a perdu son caractère décisif face aux radars LPI modernes.",
    analystNote:
      "La livraison à l'Ukraine a fait de SCALP / Storm Shadow l'un des objets diplomatiques marquants du soutien occidental. À suivre maintenant : le rythme de reconstitution des stocks alliés et l'avancée du programme FC/ASW, qui dira si l'Europe garde une carte standoff souveraine dans les années 2030.",
  },
  operators: [
    "France",
    "Royaume-Uni",
    "Italie",
    "Égypte",
    "Grèce",
    "Émirats arabes unis",
    "Inde (Rafale)",
    "Qatar (Rafale)",
    "Ukraine (transferts FR + UK depuis 2023)",
  ],
  theatres: [
    "Irak 2003",
    "Libye 2011",
    "Levant — Syrie, Irak",
    "Ukraine — depuis 2023",
  ],
  timeline: [
    {
      date: "2003",
      label: "Premier emploi Storm Shadow par la Royal Air Force — Irak.",
      kind: "emploi",
    },
    {
      date: "2011",
      label: "Emploi en Libye — opération Harmattan, frappes coalition.",
      kind: "emploi",
    },
    {
      date: "2018",
      label:
        "Frappes coalition contre cibles chimiques en Syrie — Storm Shadow et SCALP.",
      kind: "emploi",
    },
    {
      date: "2023",
      label:
        "Royaume-Uni livre Storm Shadow à l'Ukraine ; la France suit avec SCALP.",
      kind: "export",
    },
    {
      date: "2024",
      label:
        "France notifie un contrat de modernisation et de production nouvelle — reconstitution post-Ukraine.",
      kind: "jalon",
    },
  ],
  sources: [
    {
      id: "mbda-scalp",
      title: "SCALP / Storm Shadow — page produit",
      publisher: "MBDA",
      type: "constructeur",
      reliability: "B",
      url: "https://www.mbda-systems.com/product/scalpeg-stormshadow/",
    },
    {
      id: "mod-uk-storm",
      title: "Storm Shadow — UK Ministry of Defence",
      publisher: "UK Ministry of Defence",
      type: "officiel",
      reliability: "A",
      url: "https://www.gov.uk/government/organisations/ministry-of-defence",
    },
    {
      id: "mbda-scalp-mlr",
      title:
        "SCALP / Storm Shadow — programmes de remise à niveau (MLR) en France et en Italie",
      publisher: "MBDA",
      type: "constructeur",
      reliability: "B",
      url: "https://www.mbda-systems.com/press-releases/",
    },
    {
      id: "eu-cp-944",
      title:
        "Position commune 2008/944/PESC — règles communes régissant le contrôle des exportations de technologie et d'équipements militaires",
      publisher: "Conseil de l'Union européenne",
      type: "officiel",
      reliability: "A",
      url: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX%3A32008E0944",
    },
  ],
  updated: "2026-05-26",
};
