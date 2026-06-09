import type { DefenseSystem } from "../types";

export const syracuseIv: DefenseSystem = {
  slug: "syracuse-iv",
  name: "Syracuse IV",
  designation: "Système Spatial de Communications Sécurisées — quatrième génération",
  reference: "PNP-SP-003",
  category: "spatial",
  satelliteClass: "satcom",
  classLabel:
    "Constellation française de télécommunications militaires durcies — bandes X et Ka, anti-brouillage",
  country: "France",
  flag: "🇫🇷",
  manufacturer: "Thales Alenia Space · Airbus Defence and Space",
  introduced: "2021 (Syracuse 4A)",
  status: "En service — 2 satellites GEO opérationnels (Syracuse 4A, Syracuse 4B)",
  acquisitionModes: ["production-nationale"],
  tagline:
    "La quatrième génération SATCOM militaire française — bandes X et Ka, anti-brouillage durci, support des drones et plateformes mobiles déployées.",
  summary:
    "Syracuse IV est la quatrième génération du système français de télécommunications militaires par satellite. Deux satellites en orbite géostationnaire — Syracuse 4A (2021) et Syracuse 4B (2023) — assurent la continuité de service entamée avec Syracuse 1 (1980), 2 (1990) et 3 (2005), avec un saut capacitaire majeur : extension à la bande Ka, durcissement anti-brouillage avancé, support à de nouveaux usagers (drones armés, plateformes aéroportées, stations mobiles déployées).\n\nLa fiche illustre une logique de souveraineté de la communication militaire stratégique et de théâtre. Sans SATCOM militaire durci, une force expéditionnaire perd ses liaisons C2 dès qu'elle s'éloigne de l'horizon HF — et les options commerciales (Inmarsat, Intelsat) n'offrent ni la robustesse, ni la confidentialité, ni le contrôle politique nécessaires. Syracuse IV est la couche communication souveraine qui permet l'autonomie de décision sur tous les théâtres.",
  keySpecs: [
    {
      label: "Architecture",
      value: "2 satellites en orbite géostationnaire (Syracuse 4A et Syracuse 4B)",
      confidence: "haute",
      sources: ["cnes-syracuse4"],
    },
    {
      label: "Bandes de fréquence",
      value:
        "Bande X (héritage Syracuse 3) + bande Ka (nouveauté Syracuse IV) — haut débit déployable",
      confidence: "haute",
      sources: ["cnes-syracuse4"],
    },
    {
      label: "Durcissement",
      value: "Anti-brouillage et anti-nucléaire — protection de la chaîne C2 stratégique",
      confidence: "haute",
      sources: ["cnes-syracuse4"],
    },
    {
      label: "Nouveaux usagers supportés",
      value:
        "Drones armés (MALE Reaper, Patroller) · stations mobiles · plateformes aéroportées",
      confidence: "haute",
      sources: ["dga-syracuse4"],
    },
    {
      label: "Maîtres d'œuvre",
      value: "Thales Alenia Space (plateforme et charge utile) · Airbus Defence and Space",
      confidence: "haute",
      sources: ["dga-syracuse4"],
    },
    {
      label: "Lancements",
      value:
        "Syracuse 4A (Ariane 5, octobre 2021) · Syracuse 4B (Ariane 5, juin 2023)",
      confidence: "haute",
      sources: ["arianespace-syracuse"],
    },
    {
      label: "Performances précises",
      value:
        "Débits par usager, couverture exacte, modes anti-brouillage — non communiqués publiquement",
      confidence: "faible",
      status: "variable",
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le coût total du programme Syracuse IV est public à travers la LPM française et les rapports parlementaires, autour de 3,8 Md€ sur la durée du programme — segment spatial, segment sol, stations utilisateurs, lancements, exploitation. C'est l'un des programmes spatiaux militaires français les plus structurants en volume budgétaire.\n\nLa logique économique est celle d'une couche communication souveraine indispensable : sans Syracuse IV, la France perdrait l'autonomie de commandement stratégique sur les théâtres déployés. Le coût se mesure en regard du service rendu et de la dépendance évitée — pas en regard d'un équivalent commercial qui ne peut pas répondre aux exigences de durcissement et de souveraineté.",
      indicators: [
        {
          label: "Coût programme",
          value: "Ordre de grandeur ~3,8 Md€ sur la durée (estimation publique LPM)",
          confidence: "moyenne",
          status: "variable",
          sources: ["senat-lpm-syracuse"],
        },
        {
          label: "Lecture économique",
          value:
            "Couche souveraine indispensable — pas de substituabilité commerciale (Inmarsat, Intelsat) pour les besoins militaires durcis",
          confidence: "haute",
          sources: ["dga-syracuse4"],
        },
        {
          label: "Coût utilisateur",
          value:
            "Le coût programme inclut le segment utilisateur (stations mobiles déployées) — pas seulement le segment spatial",
          confidence: "moyenne",
          sources: ["senat-lpm-syracuse"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Syracuse IV est financé par l'État français dans le cadre des LPM 2014-2019 et 2019-2025, sous maîtrise d'ouvrage DGA, maîtrise d'œuvre déléguée CNES, et maîtrise d'œuvre industrielle Thales Alenia Space + Airbus. Programme national strict — pas de coopération MUSIS ou équivalent, car le SATCOM militaire stratégique relève de la souveraineté de commandement.\n\nLa trajectoire financière est continue depuis Syracuse 1 (1980) — 45 ans de continuité d'effort qui ont fait de la France l'un des rares pays à maîtriser intégralement la chaîne SATCOM militaire durcie. Cette continuité est un actif rare et fragile : une interruption d'effort sur une génération suffirait à perdre le savoir-faire.",
      indicators: [
        {
          label: "Maître d'ouvrage",
          value: "DGA — programme inscrit en LPM 2014-2019 et 2019-2025",
          confidence: "haute",
          sources: ["dga-syracuse4"],
        },
        {
          label: "Maître d'œuvre déléguée",
          value: "CNES — pilotage technique et industriel",
          confidence: "haute",
          sources: ["cnes-syracuse4"],
        },
        {
          label: "Continuité historique",
          value:
            "Syracuse 1 (1980) → 2 (1990) → 3 (2005) → 4 (2021) — 45 ans de continuité d'effort",
          confidence: "haute",
          sources: ["cnes-syracuse4"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne Syracuse IV est entièrement française. Thales Alenia Space fournit la plateforme Spacebus NEO et la charge utile principale ; Airbus Defence and Space contribue à l'architecture. La chaîne n'est pas exposée à l'ITAR sur ses nœuds critiques — souveraineté pleine, condition nécessaire d'un SATCOM militaire stratégique français.\n\nLe maillon le plus sensible n'est pas le satellite mais le segment utilisateur : stations mobiles déployées, modems anti-brouillage durcis, chaînes de chiffrement souveraines. Ce sont elles qui doivent suivre la cadence des théâtres et des nouveaux usagers (drones, plateformes aéroportées) — un défi industriel récurrent.",
      indicators: [
        {
          label: "Maîtres d'œuvre",
          value: "Thales Alenia Space (plateforme + charge utile) · Airbus Defence and Space",
          confidence: "haute",
          sources: ["dga-syracuse4"],
        },
        {
          label: "Plateforme",
          value: "Spacebus NEO (Thales Alenia Space) — bus européen souverain",
          confidence: "haute",
          sources: ["cnes-syracuse4"],
        },
        {
          label: "Composants ITAR",
          value: "Pas d'exposition ITAR sur nœuds critiques — souveraineté complète",
          confidence: "haute",
          sources: ["dga-syracuse4"],
        },
        {
          label: "Lanceur",
          value: "Ariane 5 (Arianespace) — accès souverain européen à l'espace",
          confidence: "haute",
          sources: ["arianespace-syracuse"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Syracuse IV est l'une des briques fondamentales de l'autonomie stratégique française. Sans SATCOM militaire souverain durci, la chaîne de commandement perdrait son autonomie dès qu'une force est déployée hors d'Europe — et toute alternative (recours à des SATCOM américains via Wideband Global SATCOM, ou commerciaux) suppose un partage d'usage et de visibilité incompatible avec la souveraineté.\n\nLa fiche illustre aussi un binôme structurant : la France et le Royaume-Uni sont les deux seules nations européennes à maintenir un SATCOM militaire durci souverain (Syracuse côté FR, Skynet côté UK). L'Italie et l'Allemagne dépendent de programmes hybrides (SICRAL, SATCOMBw) avec des compromis sur la souveraineté ou le durcissement.",
      indicators: [
        {
          label: "Fonction stratégique",
          value:
            "Couche communication souveraine indispensable à l'autonomie de commandement déployé",
          confidence: "haute",
          sources: ["dga-syracuse4"],
        },
        {
          label: "Binôme européen",
          value:
            "France (Syracuse) et Royaume-Uni (Skynet) — seules nations EU avec SATCOM militaire durci souverain",
          confidence: "haute",
          sources: ["dga-syracuse4"],
        },
        {
          label: "Alternatives évitées",
          value:
            "WGS américain (partage d'usage US), commerciaux (Inmarsat, Intelsat) — incompatibles avec souveraineté militaire",
          confidence: "haute",
          sources: ["dga-syracuse4"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "Syracuse IV n'est pas un produit d'export — c'est une capacité souveraine française. Mais la base industrielle qui l'a produit (Thales Alenia Space sur Spacebus NEO, savoir-faire SATCOM militaire) alimente une activité commerciale et exportable significative : SATCOM commerciaux (constellations comme SES, Eutelsat) et programmes alliés.\n\nL'effet indirect compte autant que l'objet : Syracuse IV finance et maintient la base industrielle française du SATCOM, dont les retombées export et duales sont substantielles. C'est le modèle économique du spatial militaire souverain — un programme national consolide la position d'un industriel européen sur le marché mondial.",
      indicators: [
        {
          label: "Statut export",
          value: "Non exportable — capacité souveraine française",
          confidence: "haute",
          sources: ["dga-syracuse4"],
        },
        {
          label: "Régime applicable",
          value:
            "Contrôle DGA · Wassenaar pour composants chiffrement avancés · Position commune UE",
          confidence: "haute",
          sources: ["dga-syracuse4"],
        },
        {
          label: "Effet industriel indirect",
          value:
            "Soutien à la base industrielle Thales Alenia Space — retombées sur SATCOM commerciaux et programmes alliés",
          confidence: "moyenne",
          sources: ["cnes-syracuse4"],
        },
      ],
    },
  ],
  spaceProfile: {
    orbit: {
      classes: ["GEO"],
      altitudeKm: "≈ 35 786 km (orbite géostationnaire)",
      inclinationDeg: "0° (équatoriale)",
      operationalReading:
        "Orbite géostationnaire : position apparente fixe au-dessus de l'équateur — couverture régionale persistante d'un hémisphère, condition nécessaire d'un SATCOM toujours disponible pour les forces déployées. Deux satellites couvrent les théâtres d'intérêt français (Afrique, Moyen-Orient, océan Indien, Atlantique).",
      notes:
        "Positions orbitales précises (degrés Est/Ouest) non détaillées ici — relèvent de la planification opérationnelle.",
    },
    payloads: [
      {
        type: "satcom-x",
        supplier: "Thales Alenia Space",
        publicDescription:
          "Bande X militaire — continuité avec Syracuse 3, support des stations héritage et des plateformes déjà équipées.",
        sensitivity: "partielle",
      },
      {
        type: "satcom-ka",
        supplier: "Thales Alenia Space",
        publicDescription:
          "Bande Ka militaire — nouveauté Syracuse IV, haut débit déployable pour nouveaux usagers (drones, plateformes aéroportées, stations mobiles).",
        sensitivity: "partielle",
      },
    ],
    architecture: {
      constellationSize: "2 satellites GEO (Syracuse 4A et 4B)",
      formationFlying: false,
      serviceContinuityNotes:
        "Deux satellites couvrent les théâtres d'intérêt français avec recouvrement partiel — la perte d'un satellite dégrade significativement la couverture mais ne l'interrompt pas totalement.",
    },
    groundSegment: {
      facilities: [
        "Stations d'ancrage souveraines françaises",
        "Centre de mission Thales Alenia Space",
        "Stations utilisateurs militaires déployables (mobiles + fixes)",
      ],
      dataChain:
        "Émission depuis station utilisateur déployée → satellite GEO → station d'ancrage souveraine → exploitation par centre de commandement militaire ou opérateur autorisé.",
    },
    launch: {
      provider: "Arianespace (Ariane 5)",
      site: "Centre spatial guyanais (Kourou)",
      dependencyNotes:
        "Ariane 5 — accès souverain européen à l'espace. La transition vers Ariane 6 sera à suivre pour la prochaine génération Syracuse V.",
    },
    resilience: {
      jammingExposure:
        "Durcissement anti-brouillage avancé — mode public, valeurs précises non communiquées. C'est précisément la fonction qui justifie l'investissement par rapport aux SATCOM commerciaux.",
      cyberNotes:
        "Chaîne de chiffrement souveraine ; liaisons et stations sol durcies sous contrôle national.",
      redundancyNotes:
        "Deux satellites GEO avec recouvrement partiel — pas de redondance technique sur un satellite isolé.",
      replacementStrategy:
        "Durée de vie nominale ~15 ans (jusqu'à ~2036) — successeur Syracuse V à étudier dans la prochaine LPM. La continuité de service est constitutive du programme.",
    },
  },
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Coût programme élevé (~3,8 Md€) mais justifié par l'absence de substitut commercial pour les besoins militaires durcis et par la souveraineté de la chaîne C2 stratégique.",
    },
    {
      key: "survivabilite",
      grade: "B",
      rationale:
        "Durcissement anti-brouillage et anti-nucléaire avancé — robustesse parmi les meilleures du domaine SATCOM militaire.",
    },
    {
      key: "exportabilite",
      grade: "E",
      rationale:
        "Capacité souveraine non exportable ; mais la base industrielle (Thales Alenia Space) en tire des retombées export substantielles via SATCOM commerciaux.",
    },
    {
      key: "risque-industriel",
      grade: "A",
      rationale:
        "Chaîne entièrement française, aucun composant ITAR, continuité d'effort de 45 ans depuis Syracuse 1 — souveraineté industrielle exemplaire.",
    },
    {
      key: "maturite",
      grade: "A",
      rationale:
        "Constellation à 2 satellites opérationnelle depuis 2023, dans la continuité de quatre générations Syracuse — modèle éprouvé.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "Sources CNES, DGA et parlementaires solides ; modes anti-brouillage, débits par usager et couverture exacte restent classifiés (et le resteront).",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : on peut remplacer un SATCOM militaire par une solution commerciale. La réalité : Inmarsat, Intelsat et les constellations commerciales n'offrent ni le durcissement anti-brouillage, ni la confidentialité, ni le contrôle politique requis pour la chaîne C2 militaire stratégique. Syracuse IV n'a pas de substitut réel.",
    bestUseCase:
      "Assurer la chaîne de commandement militaire stratégique et de théâtre — y compris drones armés et plateformes mobiles déployées — sur les zones d'intérêt français, sans dépendre des SATCOM américains (WGS) ni commerciaux.",
    weakPoint:
      "Le segment utilisateur. Le satellite est durable (~15 ans), mais les stations utilisateurs mobiles, modems anti-brouillage et chaînes de chiffrement doivent suivre la cadence des théâtres et de la prolifération des nouveaux usagers (drones, plateformes). C'est le maillon qui exige le plus d'investissement continu.",
    analystNote:
      "Syracuse IV est l'archétype du programme spatial militaire de souveraineté de longue durée : 45 ans de continuité d'effort depuis Syracuse 1, base industrielle pleinement maîtrisée, et un service rendu sans substitut commercial réel. Le renouvellement Syracuse V — à prévoir dans la LPM post-2025 — déterminera si la France conserve son rang dans le club très restreint des nations à SATCOM militaire durci souverain.",
  },
  operators: [
    "France — Armée de l'Air et de l'Espace, Commandement de l'Espace, forces déployées (Armée de Terre, Marine nationale)",
  ],
  theatres: [
    "Couverture régionale persistante — Afrique, Moyen-Orient, océan Indien, Atlantique (théâtres d'intérêt français)",
  ],
  timeline: [
    {
      date: "1980",
      label:
        "Syracuse 1 — entrée en service du premier SATCOM militaire français (charge embarquée sur Telecom 1).",
      kind: "jalon",
    },
    {
      date: "2005",
      label:
        "Syracuse 3 — saut générationnel précédent ; bande X dédiée, durcissement étendu.",
      kind: "jalon",
    },
    {
      date: "2015",
      label:
        "Notification du contrat Syracuse IV — Thales Alenia Space et Airbus maîtres d'œuvre.",
      kind: "jalon",
    },
    {
      date: "2021-10",
      label:
        "Lancement de Syracuse 4A sur Ariane 5 depuis Kourou — entrée en service.",
      kind: "jalon",
    },
    {
      date: "2023-06",
      label:
        "Lancement de Syracuse 4B sur Ariane 5 depuis Kourou — constellation complète à 2 satellites.",
      kind: "jalon",
    },
  ],
  sources: [
    {
      id: "cnes-syracuse4",
      title: "Syracuse IV — page projet officielle",
      publisher: "CNES",
      type: "officiel",
      reliability: "A",
      url: "https://cnes.fr/en/projects/syracuse-4",
    },
    {
      id: "dga-syracuse4",
      title:
        "Programme Syracuse IV — DGA et Ministère des Armées (SATCOM militaire)",
      publisher: "Direction Générale de l'Armement / Ministère des Armées",
      type: "officiel",
      reliability: "A",
      url: "https://www.defense.gouv.fr/dga",
    },
    {
      id: "senat-lpm-syracuse",
      title:
        "Rapports LPM 2014-2019 et 2019-2025 — section SATCOM militaire et Syracuse IV",
      publisher: "Sénat — Commission des affaires étrangères, de la défense et des forces armées",
      type: "officiel",
      reliability: "A",
      url: "https://www.senat.fr/commission/etr/index.html",
    },
    {
      id: "arianespace-syracuse",
      title:
        "Vols Ariane 5 VA255 (Syracuse 4A, 2021) et VA260 (Syracuse 4B, 2023)",
      publisher: "Arianespace",
      type: "constructeur",
      reliability: "B",
      url: "https://www.arianespace.com/",
    },
  ],
  updated: "2026-06-09",
};
