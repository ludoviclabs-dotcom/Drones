import type { DefenseSystem } from "../types";

export const aster30B1nt: DefenseSystem = {
  slug: "aster-30-b1nt",
  name: "Aster 30 B1NT",
  designation: "Aster 30 Block 1 New Technology",
  reference: "PNP-MSL-006",
  category: "missile",
  missileRole: "SAM",
  classLabel: "Intercepteur surface-air longue portée — défense aérienne et antimissile",
  country: "France / Italie",
  flag: "🇫🇷🇮🇹",
  manufacturer: "Eurosam (MBDA + Thales)",
  introduced: "2026",
  status:
    "Qualification finale ; production lancée pour SAMP/T NG (FR/IT) et marine",
  acquisitionModes: ["cooperatif"],
  tagline:
    "Le pilier de la défense aérienne longue portée européenne — successeur direct de l'Aster 30 Block 1, optimisé contre missiles balistiques de courte portée nouvelle génération.",
  summary:
    "Aster 30 B1NT est la version « New Technology » du missile Aster 30 Block 1, développée en coopération franco-italienne par Eurosam (MBDA + Thales). Conçue pour la défense aérienne de zone et l'interception de missiles balistiques de courte portée modernes, elle est l'effecteur central du nouveau SAMP/T NG — système terrestre de génération Aster 30 — et complète l'Aster 30 Block 1 déjà en service dans PAAMS et SAMP/T.\n\nSon évolution porte sur la résilience face aux contre-mesures, la manœuvrabilité terminale et l'élargissement de l'enveloppe d'interception. La DGA annonce un rayon de 150 km et une interception jusqu'à 25 000 m d'altitude. C'est le pendant européen au PAC-3 MSE pour le segment LRAD/ATBM — avec une différence structurante : Aster fonctionne par RF actif avec PIF/PAF, là où PAC-3 mise sur le hit-to-kill pur.",
  keySpecs: [
    {
      label: "Architecture",
      value: "Booster + dart — séparation en vol, dart manœuvrable",
      confidence: "haute",
      sources: ["mbda-aster"],
    },
    {
      label: "Guidage terminal",
      value:
        "Inertiel + uplink + autodirecteur RF actif ; manœuvre PIF/PAF (jets latéraux)",
      confidence: "haute",
      sources: ["mbda-aster"],
    },
    {
      label: "Rayon d'interception",
      value: "Jusqu'à 150 km — annonce DGA",
      confidence: "haute",
      sources: ["dga-aster-b1nt"],
    },
    {
      label: "Altitude d'interception",
      value: "Jusqu'à 25 000 m — annonce DGA",
      confidence: "haute",
      sources: ["dga-aster-b1nt"],
    },
    {
      label: "Systèmes hôtes",
      value: "SAMP/T NG (terre) ; FREMM, Horizon, FDI (marine, via PAAMS / SYLVER)",
      confidence: "haute",
      sources: ["occar-fsaf", "mbda-aster"],
    },
    {
      label: "Lancement",
      value: "Vertical depuis SYLVER A50 — soft vertical launch",
      confidence: "haute",
      sources: ["mbda-aster"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Aster 30 B1NT est livré dans le cadre des contrats SAMP/T NG et des contrats marine — la transparence budgétaire est plus faible que pour les programmes US. Les coûts publics se lisent par enveloppe industrielle plutôt que par missile scellé.\n\nLe positionnement économique est clair : un intercepteur LRAD/ATBM est nécessairement cher, parce qu'il combine propulsion à deux étages, autodirecteur RF actif et système de divert. La logique coût-effet se mesure en regard de la valeur de la cible interceptée — un missile balistique court ne peut pas être traité par autre chose.",
      indicators: [
        {
          label: "Coût unitaire public",
          value: "Non publié — couvert par enveloppes SAMP/T NG et marine",
          confidence: "faible",
          status: "variable",
          sources: ["occar-fsaf"],
        },
        {
          label: "Type de coût exploitable",
          value: "Coût programme par batterie ou par contrat — pas missile à missile",
          confidence: "moyenne",
          sources: ["occar-fsaf"],
        },
        {
          label: "Logique économique",
          value:
            "Effecteur d'interception haut de gamme — emploi sur menaces à très forte valeur",
          confidence: "moyenne",
          sources: ["mbda-aster"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le programme est porté par OCCAR pour la France et l'Italie. La qualification du B1NT a été lancée formellement en 2016 et la production engagée à la fin de la décennie suivante. Les contrats successifs MBDA / Eurosam couvrent missiles, intégration SAMP/T NG et modernisation des unités existantes.\n\nLe contexte ukrainien a accéléré le financement et la cadence : les dons aux Forces armées ukrainiennes ont vidé des stocks que la France et l'Italie reconstituent en parallèle de la mise en service B1NT, avec un effort budgétaire confirmé pour 2024-2025.",
      indicators: [
        {
          label: "Maîtrise programme",
          value:
            "OCCAR — programme FSAF (Famille Sol-Air Futur) FR-IT",
          confidence: "haute",
          sources: ["occar-fsaf"],
        },
        {
          label: "Notifications récentes",
          value:
            "Contrat MBDA pour montée en cadence ; accélération post-Ukraine",
          confidence: "haute",
          sources: ["mbda-aster"],
        },
        {
          label: "Effort de reconstitution",
          value:
            "Stocks réduits par dons à l'Ukraine ; reconstitution intégrée à la planification",
          confidence: "moyenne",
          sources: ["dga-aster-b1nt"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne Aster B1NT est cooperative franco-italienne et entièrement européenne. MBDA France et MBDA Italia produisent le missile ; Thales fournit l'autodirecteur ; le propulsif est issu de la base européenne (Avio en Italie, Roxel en France). Aucun nœud critique n'est soumis à l'ITAR.\n\nLa cadence est le défi : MBDA a annoncé un doublement de production entre 2023 et fin 2025 et une nouvelle hausse de 40 % en 2026. Cela reflète à la fois la demande Aster pour PAAMS et SAMP/T NG, et le marché global des intercepteurs LRAD européens — Pologne, Espagne, et discussions autour de l'European Sky Shield.",
      indicators: [
        {
          label: "Maîtrise d'œuvre",
          value: "Eurosam — MBDA + Thales, FR + IT",
          confidence: "haute",
          sources: ["mbda-aster"],
        },
        {
          label: "Composants critiques",
          value:
            "Booster, propulsion sustainer, autodirecteur RF actif, PIF/PAF, calculateur",
          confidence: "haute",
          sources: ["mbda-aster"],
        },
        {
          label: "Cadence",
          value:
            "Doublement entre 2023 et fin 2025 ; +40 % visé en 2026 — annonces MBDA",
          confidence: "haute",
          sources: ["mbda-cadence"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Aster 30 B1NT est le marqueur capacitaire de l'autonomie défense aérienne européenne — c'est le seul intercepteur LRAD non soumis à l'ITAR capable de couvrir la couche supérieure jusqu'à l'antimissile balistique courte portée. Sa promotion accompagne la candidature européenne sur l'European Sky Shield et la consolidation industrielle franco-italienne.\n\nLe positionnement vis-à-vis du Patriot est explicite : Aster est l'option pour les nations européennes qui veulent une capacité LRAD souveraine, sans dépendre du calendrier de livraison et des autorisations américaines. C'est aussi pour cela que MBDA a engagé une montée en cadence aussi ambitieuse.",
      indicators: [
        {
          label: "Fonction stratégique",
          value:
            "Pilier de la défense aérienne longue portée européenne non US",
          confidence: "haute",
          sources: ["mbda-aster"],
        },
        {
          label: "Régime applicable",
          value:
            "Européen — hors ITAR ; Position commune UE 2008/944/PESC",
          confidence: "haute",
          sources: ["eu-cp-944"],
        },
        {
          label: "Levier industriel",
          value:
            "Programme central pour le rang européen sur l'air defense de zone",
          confidence: "haute",
          sources: ["mbda-cadence"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "L'export Aster suit deux logiques : marine (via PAAMS et SYLVER) et terre (via SAMP/T puis SAMP/T NG). Les utilisateurs export connus incluent Royaume-Uni (PAAMS Type 45), Italie (Horizon, FREMM), France (PAAMS, FREMM, FDI), Singapour (Formidable), Maroc (FREMM), Égypte (FREMM), Qatar (Doha-class), Émirats arabes unis (Baynunah). La promotion B1NT vise l'extension du marché terrestre.\n\nL'absence de contrainte ITAR fait de la fiche Aster un argument central pour les nations cherchant l'autonomie capacitaire. La contrepartie est la cadence — une demande forte pour une chaîne en montée en charge.",
      indicators: [
        {
          label: "Canal d'export",
          value:
            "Contrats nationaux + bundle plateforme (PAAMS, SYLVER, SAMP/T)",
          confidence: "haute",
          sources: ["mbda-aster"],
        },
        {
          label: "Régime applicable",
          value: "Contrôles FR + IT + Position commune UE — hors ITAR",
          confidence: "haute",
          sources: ["eu-cp-944"],
        },
        {
          label: "Utilisateurs export connus",
          value:
            "Royaume-Uni, Italie, Maroc, Égypte, Qatar, Émirats, Singapour, France",
          confidence: "haute",
          sources: ["mbda-aster"],
        },
      ],
    },
  ],
  variants: [
    {
      label: "Aster 15",
      value:
        "Variante courte/moyenne portée — généralement embarquée sur frégates",
      confidence: "haute",
      sources: ["mbda-aster"],
    },
    {
      label: "Aster 30",
      value:
        "Standard initial — longue portée, défense de zone, capacité ATBM limitée",
      confidence: "haute",
      sources: ["mbda-aster"],
    },
    {
      label: "Aster 30 Block 1",
      value:
        "Premier standard avec capacité antimissile balistique de théâtre",
      confidence: "haute",
      sources: ["mbda-aster"],
    },
    {
      label: "Aster 30 Block 1 NT",
      value:
        "Nouvelle technologie — résilience contre-mesures, manœuvrabilité, enveloppe étendue",
      confidence: "haute",
      sources: ["dga-aster-b1nt"],
    },
    {
      label: "Aster 30 Block 2",
      value:
        "À l'étude — antimissile balistique exoatmosphérique, capacité élargie",
      confidence: "faible",
      status: "a-recouper",
      sources: ["mbda-aster"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Effecteur LRAD haut de gamme nécessairement cher ; justifié pour la couche supérieure et l'ATBM.",
    },
    {
      key: "survivabilite",
      grade: "B",
      rationale:
        "PIF/PAF et RF actif assurent une enveloppe d'interception large ; contre-mesures balistiques avancées en évolution rapide.",
    },
    {
      key: "exportabilite",
      grade: "A",
      rationale:
        "Hors ITAR, large base export marine + terre, alignement européen — position concurrentielle forte.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Chaîne européenne complète mais cadence sous tension — MBDA en montée en charge.",
    },
    {
      key: "maturite",
      grade: "B",
      rationale:
        "Famille Aster mature ; B1NT en fin de qualification et montée en production.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "DGA, OCCAR et MBDA publient les jalons clés ; chiffres précis d'interception classifiés.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un équivalent direct du Patriot. La réalité : une logique d'interception différente — Aster combine RF actif et PIF/PAF là où PAC-3 mise sur le hit-to-kill pur ; les deux conviennent à des doctrines distinctes.",
    bestUseCase:
      "Doter une nation européenne d'une défense aérienne longue portée souveraine, capable d'engager avions, missiles de croisière et balistiques courte portée modernes, sans dépendre d'autorisations américaines.",
    weakPoint:
      "La cadence de production : la demande européenne post-Ukraine excède pour l'instant la capacité de la chaîne MBDA — les livraisons 2025-2027 sont serrées.",
    analystNote:
      "Aster 30 B1NT est l'effecteur qui consolide la candidature européenne à une défense aérienne autonome au niveau de la couche supérieure. Surveiller la cadence MBDA et l'avancée du programme Block 2 — ils diront si l'Europe tient la promesse stratégique de l'European Sky Shield à terme.",
  },
  operators: [
    "France",
    "Italie",
    "Royaume-Uni (PAAMS — Aster 15/30)",
    "Singapour",
    "Maroc",
    "Égypte",
    "Qatar",
    "Émirats arabes unis",
  ],
  theatres: [
    "Mer Rouge — interceptions documentées par frégates européennes contre missiles balistiques et drones",
    "Méditerranée — défense aérienne porte-avions",
    "Ukraine — emploi via batteries SAMP/T transférées",
  ],
  timeline: [
    {
      date: "2016",
      label:
        "Lancement formel du développement Aster 30 B1NT — OCCAR / FR-IT.",
      kind: "jalon",
    },
    {
      date: "2018",
      label:
        "Décision lancement du SAMP/T NG — l'effecteur principal sera B1NT.",
      kind: "jalon",
    },
    {
      date: "2023",
      label:
        "Doublement de la cadence MBDA annoncé suite à la guerre en Ukraine.",
      kind: "jalon",
    },
    {
      date: "2024",
      label:
        "Première interception opérationnelle d'un missile balistique houthi par une frégate européenne en mer Rouge — Aster 30 Block 1.",
      kind: "emploi",
    },
    {
      date: "2025",
      label:
        "Qualification finale Aster 30 B1NT engagée — production lancée.",
      kind: "jalon",
    },
  ],
  sources: [
    {
      id: "mbda-aster",
      title: "Famille Aster — pages produit",
      publisher: "MBDA",
      type: "constructeur",
      reliability: "B",
      url: "https://www.mbda-systems.com/product/aster-15-30/",
    },
    {
      id: "dga-aster-b1nt",
      title: "Aster 30 B1NT — annonces DGA",
      publisher: "Direction générale de l'armement (DGA)",
      type: "officiel",
      reliability: "A",
      url: "https://www.defense.gouv.fr/dga",
    },
    {
      id: "occar-fsaf",
      title: "Programme FSAF — Famille Sol-Air Futur",
      publisher: "OCCAR",
      type: "officiel",
      reliability: "A",
      url: "https://www.occar.int/",
    },
    {
      id: "mbda-cadence",
      title:
        "MBDA — montée en cadence de production 2023-2026 : annonces et chiffres publics",
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
