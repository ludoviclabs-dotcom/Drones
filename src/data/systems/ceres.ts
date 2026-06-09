import type { DefenseSystem } from "../types";

export const ceres: DefenseSystem = {
  slug: "ceres",
  name: "CERES",
  designation: "Capacité de Renseignement Électromagnétique Spatiale",
  reference: "PNP-SP-002",
  category: "spatial",
  satelliteClass: "sigint",
  classLabel:
    "Constellation française SIGINT / ROEM spatiale — première capacité européenne opérationnelle",
  country: "France",
  flag: "🇫🇷",
  manufacturer: "Airbus Defence and Space · Thales",
  introduced: "2021",
  status: "En service — constellation opérationnelle (3 satellites)",
  acquisitionModes: ["production-nationale"],
  tagline:
    "La première constellation européenne SIGINT spatiale opérationnelle — trois satellites volant en formation pour localiser les émissions électromagnétiques.",
  summary:
    "CERES est la première capacité spatiale française — et européenne — de renseignement d'origine électromagnétique (ROEM) opérationnelle. Trois satellites en orbite basse, lancés simultanément en novembre 2021 et opérant en formation, détectent et localisent par triangulation les émissions de systèmes de radiocommunication et de radars terrestres ou maritimes.\n\nLa singularité de CERES tient au vol en formation. Aucun des trois satellites n'a de valeur isolée : c'est la combinaison des signaux captés simultanément qui permet la localisation par triangulation. La fiche illustre ainsi un principe central du spatial militaire moderne : la capacité ne vient pas du satellite, elle vient de l'architecture — segment spatial coordonné, segment sol commun, traitement croisé des signaux. CERES s'inscrit dans la lignée des démonstrateurs Essaim (2004) et ELISA (2011), passés du laboratoire à la capacité opérationnelle.",
  keySpecs: [
    {
      label: "Architecture",
      value:
        "Constellation de 3 satellites en orbite basse, opérant en formation pour traitement croisé",
      confidence: "haute",
      sources: ["cnes-ceres"],
    },
    {
      label: "Mission",
      value:
        "Détection et localisation d'émissions électromagnétiques (radiocommunication, radars)",
      confidence: "haute",
      sources: ["cnes-ceres"],
    },
    {
      label: "Maître d'œuvre",
      value: "Airbus Defence and Space (système) · Thales (charge utile)",
      confidence: "haute",
      sources: ["dga-ceres"],
    },
    {
      label: "Lancement",
      value:
        "Vega VV20, 16 novembre 2021, depuis le Centre spatial guyanais (Kourou)",
      confidence: "haute",
      sources: ["cnes-ceres", "arianespace-vv20"],
    },
    {
      label: "Démonstrateurs précurseurs",
      value: "Essaim (2004, 4 micro-satellites) · ELISA (2011, 4 micro-satellites)",
      confidence: "haute",
      sources: ["cnes-ceres"],
    },
    {
      label: "Opérateurs",
      value:
        "Commandement de l'Espace, DGA, CNES — segment utilisateur militaire français",
      confidence: "haute",
      sources: ["dga-ceres"],
    },
    {
      label: "Performances précises",
      value:
        "Bandes RF couvertes, précision de localisation, latence — non communiquées publiquement",
      confidence: "faible",
      status: "variable",
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le coût total du programme CERES est public à travers la LPM française et les rapports parlementaires, autour de 450 M€ pour le programme complet — segment spatial, segment sol, exploitation initiale. La logique coût-effet est claire : un programme à coût maîtrisé pour une capacité dont l'équivalent commercial n'existe pas, et que seules quelques nations (États-Unis, Chine, Russie) maîtrisent.\n\nLe coût se lit aussi en regard de la rareté. CERES place la France parmi les rares puissances disposant d'une capacité SIGINT spatiale opérationnelle — la valeur stratégique excède largement la valeur monétaire du programme.",
      indicators: [
        {
          label: "Coût programme",
          value: "Ordre de grandeur ~450 M€ (estimation publique LPM)",
          confidence: "moyenne",
          status: "variable",
          sources: ["senat-lpm-ceres"],
        },
        {
          label: "Lecture économique",
          value:
            "Capacité rare — l'équivalent commercial n'existe pas, le coût se mesure à la valeur stratégique",
          confidence: "moyenne",
          sources: ["dga-ceres"],
        },
        {
          label: "Coût de continuité",
          value:
            "Renouvellement à étudier post-2030 — durée de vie nominale ~7 ans",
          confidence: "moyenne",
          sources: ["senat-lpm-ceres"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "CERES est financé intégralement par l'État français dans le cadre des LPM 2009-2014, 2014-2019 et 2019-2025, sous maîtrise d'ouvrage DGA et maîtrise d'œuvre déléguée CNES. Programme strictement national — pas de partage MUSIS ou équivalent — car la sensibilité du domaine ROEM exclut la mutualisation européenne au stade actuel.\n\nLa trajectoire financière est exemplaire d'une logique d'investissement de longue durée : Essaim (2004) puis ELISA (2011) ont servi de démonstrateurs technologiques avant CERES en 2021. La continuité d'effort sur ~20 ans a permis le passage du démonstrateur à la capacité opérationnelle souveraine.",
      indicators: [
        {
          label: "Maître d'ouvrage",
          value: "DGA — programme inscrit en LPM successives",
          confidence: "haute",
          sources: ["dga-ceres"],
        },
        {
          label: "Maître d'œuvre déléguée",
          value: "CNES — pilotage technique et industriel",
          confidence: "haute",
          sources: ["cnes-ceres"],
        },
        {
          label: "Trajectoire d'investissement",
          value: "Essaim (2004) → ELISA (2011) → CERES (2021) — continuité ~20 ans",
          confidence: "haute",
          sources: ["cnes-ceres"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne CERES est entièrement française. Airbus Defence and Space assure la maîtrise d'œuvre système ; Thales fournit la charge utile SIGINT — base industrielle française historique du capteur RF de défense. Aucun composant ITAR critique dans la chaîne — souveraineté pleine.\n\nLe maillon le plus sensible est la combinaison de traitement croisé des signaux : c'est cette ingénierie qui transforme trois flux RF distincts en localisation utile. Le savoir-faire concentré chez Thales et au CNES est un actif rare — sa préservation passe par la continuité d'effort sur les démonstrateurs et le renouvellement de la capacité.",
      indicators: [
        {
          label: "Maître d'œuvre système",
          value: "Airbus Defence and Space",
          confidence: "haute",
          sources: ["dga-ceres"],
        },
        {
          label: "Charge utile SIGINT",
          value: "Thales — savoir-faire RF rare",
          confidence: "haute",
          sources: ["cnes-ceres"],
        },
        {
          label: "Composants ITAR",
          value: "Aucun composant critique sous ITAR — souveraineté complète",
          confidence: "haute",
          sources: ["dga-ceres"],
        },
        {
          label: "Lanceur",
          value: "Vega (Arianespace) — accès souverain européen à l'espace",
          confidence: "haute",
          sources: ["arianespace-vv20"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "CERES donne à la France une capacité spatiale rare. Seules les États-Unis, la Chine et la Russie disposent de capacités SIGINT spatiales opérationnelles équivalentes ou supérieures ; CERES place la France à un rang européen et mondial distinctif.\n\nLa fonction stratégique est triple : appréciation autonome de situation (cartographie des émetteurs adverses), alerte sur déploiements opérationnels (un nouveau radar repéré signale une activité), et contribution à l'écosystème français de renseignement (DGSE, DRM, DRSD). La capacité reste strictement nationale — pas de partage allié documenté à ce stade, contrairement au binôme MUSIS / SARah pour l'imagerie.",
      indicators: [
        {
          label: "Position stratégique",
          value:
            "Capacité SIGINT spatiale opérationnelle — France au rang des États-Unis, Chine, Russie",
          confidence: "haute",
          sources: ["dga-ceres"],
        },
        {
          label: "Fonctions",
          value:
            "Appréciation autonome de situation · alerte déploiements · alimentation renseignement français",
          confidence: "moyenne",
          sources: ["dga-ceres"],
        },
        {
          label: "Partage allié",
          value: "Aucun partage documenté — capacité strictement nationale",
          confidence: "haute",
          sources: ["dga-ceres"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "CERES n'est pas un produit d'export, et l'industrie française n'en a jamais affiché l'ambition. Le caractère stratégique du ROEM spatial — proche du renseignement souverain — exclut la commercialisation. Les composants critiques (charges utiles SIGINT Thales) sont par ailleurs soumis aux régimes de contrôle français (DGA) et européens (Position commune UE) sur les biens et technologies à double usage.\n\nLa fiche illustre le cas-limite du spatial militaire : certaines capacités ne sont pas pensées pour être exportées, leur valeur est précisément qu'elles restent souveraines.",
      indicators: [
        {
          label: "Statut export",
          value:
            "Non exportable par construction — capacité stratégique souveraine",
          confidence: "haute",
          sources: ["dga-ceres"],
        },
        {
          label: "Régime applicable",
          value:
            "Contrôle DGA · Wassenaar pour composants RF avancés · Position commune UE",
          confidence: "haute",
          sources: ["dga-ceres"],
        },
        {
          label: "Effet indirect",
          value:
            "Crédibilité de la base industrielle française du capteur RF spatial — vitrine technologique",
          confidence: "moyenne",
          sources: ["cnes-ceres"],
        },
      ],
    },
  ],
  spaceProfile: {
    orbit: {
      classes: ["LEO"],
      altitudeKm: "≈ 700 km (orbite basse)",
      operationalReading:
        "Orbite basse à 3 satellites en formation : la valeur opérationnelle vient de la combinaison simultanée des signaux captés depuis 3 positions distinctes — la triangulation est rendue possible par la maîtrise fine de la géométrie de la formation.",
      notes:
        "Vol en formation maintenu par les manœuvres de chaque satellite — défi de positionnement orbital.",
    },
    payloads: [
      {
        type: "rf-sigint",
        supplier: "Thales",
        publicDescription:
          "Détection et localisation d'émissions électromagnétiques de radiocommunication et de radars — bandes RF, précision et sensibilité non publiquement détaillées.",
        sensitivity: "sensible",
      },
    ],
    architecture: {
      constellationSize: "3 satellites volant en formation",
      formationFlying: true,
      serviceContinuityNotes:
        "Le vol en formation est constitutif de la mission : la perte d'un satellite dégrade significativement la capacité de triangulation. Pas de redondance par phasage — la valeur tient à la simultanéité.",
    },
    groundSegment: {
      facilities: [
        "CNES Toulouse — centre de mission",
        "Commandement de l'Espace — segment utilisateur militaire",
        "Stations de réception nationales",
      ],
      dataChain:
        "Collecte multi-satellites simultanée → liaison de descente → traitement croisé des signaux (CNES) → exploitation par le segment utilisateur (Commandement de l'Espace, services de renseignement).",
    },
    launch: {
      provider: "Arianespace (Vega VV20)",
      site: "Centre spatial guyanais (Kourou)",
      dependencyNotes:
        "Lanceur Vega souverain européen — pas d'exposition au risque Soyouz subi par CSO. Vega-C succédant à Vega assure la continuité.",
    },
    resilience: {
      jammingExposure:
        "Capteur passif RF — pas de brouillage direct, mais robustesse face aux contre-mesures électroniques (modulation, déception) reste un sujet classifié.",
      cyberNotes:
        "Liaisons de descente et chaîne de traitement durcies sous contrôle national.",
      redundancyNotes:
        "Constellation à 3 satellites essentielle au fonctionnement — la perte d'un nœud dégrade la triangulation. C'est une fragilité structurelle assumée.",
      replacementStrategy:
        "Durée de vie nominale ~7 ans (jusqu'à ~2028) — successeur post-2030 à l'étude, jalon stratégique à suivre dans la prochaine LPM.",
    },
  },
  scores: [
    {
      key: "efficacite-cout",
      grade: "A",
      rationale:
        "Coût programme maîtrisé (~450 M€) pour une capacité rare au monde — l'équivalent commercial n'existe pas, la valeur stratégique excède largement le coût.",
    },
    {
      key: "survivabilite",
      grade: "C",
      rationale:
        "Constellation à 3 satellites en formation — la perte d'un nœud dégrade significativement la capacité ; pas de redondance technique sur un satellite isolé.",
    },
    {
      key: "exportabilite",
      grade: "E",
      rationale:
        "Capacité stratégique souveraine — non exportable par construction, et pas d'intention de le devenir.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Chaîne entièrement française (Airbus, Thales) ; aucun composant ITAR. Le risque tient à la préservation du savoir-faire RF spatial, concentré sur peu d'acteurs.",
    },
    {
      key: "maturite",
      grade: "A",
      rationale:
        "Capacité opérationnelle depuis 2021, dans la continuité des démonstrateurs Essaim (2004) et ELISA (2011) — passage du laboratoire à l'opérationnel réussi.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "Sources CNES et DGA solides sur l'architecture et le calendrier ; les bandes RF, précisions et performances restent classifiées (et le resteront).",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un satellite SIGINT « écoute tout ». La réalité : CERES est une constellation où c'est la combinaison simultanée des signaux captés par trois satellites distincts qui produit la valeur — aucun satellite n'a de capacité opérationnelle isolée. La triangulation est constitutive de la mission.",
    bestUseCase:
      "Cartographier les émetteurs adverses (radars, communications militaires) sur des théâtres d'intérêt français, alerter sur les nouveaux déploiements et alimenter le renseignement français en données ROEM spatiales.",
    weakPoint:
      "La dépendance au vol en formation : la perte d'un satellite dégrade significativement la capacité de triangulation. La constellation est plus fragile qu'elle n'en a l'air — chaque nœud compte structurellement.",
    analystNote:
      "CERES est le cas-école du « satellite comme architecture » : la valeur ne vient pas d'un objet mais d'une géométrie. C'est aussi un cas de continuité d'investissement remarquable — 17 ans entre Essaim et CERES — qui démontre que la souveraineté SIGINT spatiale exige une politique de long terme, pas un coup ponctuel. Le renouvellement post-2028 sera le test de la pérennité.",
  },
  operators: [
    "France — Commandement de l'Espace, DGA, services de renseignement militaire (DRM, DRSD)",
  ],
  theatres: [
    "Couverture mondiale — orbite basse couvrant les théâtres d'intérêt français",
  ],
  timeline: [
    {
      date: "2004",
      label:
        "Lancement du démonstrateur Essaim (4 micro-satellites) — première expérimentation française SIGINT spatiale.",
      kind: "jalon",
    },
    {
      date: "2011",
      label:
        "Lancement du démonstrateur ELISA (4 micro-satellites) — montée en gamme technologique.",
      kind: "jalon",
    },
    {
      date: "2015",
      label:
        "Notification du contrat CERES — Airbus Defence and Space maître d'œuvre, Thales charge utile.",
      kind: "jalon",
    },
    {
      date: "2021-11",
      label:
        "Lancement des 3 satellites CERES sur Vega VV20 depuis Kourou — entrée en service opérationnelle.",
      kind: "jalon",
    },
  ],
  sources: [
    {
      id: "cnes-ceres",
      title: "CERES — page projet officielle",
      publisher: "CNES",
      type: "officiel",
      reliability: "A",
      url: "https://cnes.fr/en/projects/ceres",
    },
    {
      id: "dga-ceres",
      title:
        "Programme CERES — DGA et Commandement de l'Espace (programmes spatiaux militaires)",
      publisher: "Direction Générale de l'Armement / Commandement de l'Espace",
      type: "officiel",
      reliability: "A",
      url: "https://www.defense.gouv.fr/dga",
    },
    {
      id: "senat-lpm-ceres",
      title:
        "Rapports LPM 2014-2019 et 2019-2025 — section ROEM spatial et CERES",
      publisher: "Sénat — Commission des affaires étrangères, de la défense et des forces armées",
      type: "officiel",
      reliability: "A",
      url: "https://www.senat.fr/commission/etr/index.html",
    },
    {
      id: "arianespace-vv20",
      title: "Vol Vega VV20 — lancement des 3 satellites CERES (novembre 2021)",
      publisher: "Arianespace",
      type: "constructeur",
      reliability: "B",
      url: "https://www.arianespace.com/",
    },
  ],
  updated: "2026-06-09",
};
