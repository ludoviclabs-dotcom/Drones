import type { DefenseSystem } from "../types";

export const seaFire: DefenseSystem = {
  slug: "sea-fire",
  name: "Sea Fire",
  designation: "Sea Fire 500",
  reference: "PNP-RD-009",
  category: "radar",
  radarRole: "naval-mfr",
  classLabel:
    "Radar naval AESA multifonction à panneaux fixes bande S — frégates de défense aérienne françaises",
  country: "France",
  flag: "🇫🇷",
  manufacturer: "Thales",
  introduced: "2020 (mise en service FDA Lorraine)",
  status:
    "En service — équipe les FREMM FDA Alsace et Lorraine et la classe FDI Amiral Ronarc'h ; production active",
  acquisitionModes: ["DCS", "production-nationale"],
  tagline:
    "Le radar naval AESA à panneaux fixes que la France a fait sien — surveillance, conduite de tir et défense antimissile balistique partielle sur une seule antenne quadri-face.",
  summary:
    "Le Sea Fire est le radar naval AESA multifonction à panneaux fixes développé par Thales pour les frégates de défense aérienne françaises. C'est l'équivalent français du basculement doctrinal qu'incarne SPY-6 chez RTX : passage d'antennes rotatives mécaniques à une couverture 360° native par quatre faces fixes, et fusion sur le même capteur des fonctions surveillance, conduite de tir et défense antimissile balistique partielle.\n\nLa fiche Sea Fire est, pour Panoplie, celle de la souveraineté radar navale européenne. Conçu en France, intégré à des frégates FREMM FDA et FDI, lié à l'écosystème Aster / SAMP-T / SCAF, il documente concrètement qu'une chaîne capteur navale haut de gamme existe en Europe hors écosystème américain Aegis.",
  keySpecs: [
    {
      label: "Architecture",
      value:
        "AESA bande S — 4 panneaux fixes en faces de superstructure, couverture 360° native",
      confidence: "haute",
      sources: ["thales-sea-fire"],
    },
    {
      label: "Portée publique",
      value: "≈ 500 km en mode surveillance air, plus en BMD partiel",
      confidence: "moyenne",
      sources: ["thales-sea-fire"],
    },
    {
      label: "Capacités simultanées",
      value:
        "Surveillance air, conduite de tir Aster, défense antimissile balistique partielle, surveillance de surface — déclarées simultanées",
      confidence: "haute",
      sources: ["thales-sea-fire"],
    },
    {
      label: "Technologie RF",
      value: "Modules T/R GaN — production Thales",
      confidence: "haute",
      sources: ["thales-sea-fire"],
    },
    {
      label: "Plateformes",
      value:
        "FREMM FDA (Alsace, Lorraine) — classe FDI Amiral Ronarc'h (5 frégates programmées)",
      confidence: "haute",
      sources: ["thales-sea-fire", "marine-fdi"],
    },
    {
      label: "Intégration C2",
      value:
        "Système de combat naval français (SETIS / FDI), liaisons Link 16 / Link 22",
      confidence: "haute",
      sources: ["thales-sea-fire"],
    },
    {
      label: "PRF, formes d'onde, ECCM précis",
      value: "Non précisé publiquement",
      confidence: "faible",
      status: "variable",
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le coût Sea Fire est partiellement public à travers les programmes FREMM FDA et FDI. Le coût capteur isolé n'est pas publié de façon homogène ; il est intégré dans le coût total des frégates, qui dépasse le milliard d'euros par unité pour les FDI. La part radar est généralement estimée à 10-15 % du coût plateforme, soit un ordre de grandeur de 100-150 M€ par installation complète quatre faces.\n\nL'argument LCC repose sur la suppression des servocommandes d'antenne rotative et sur la modularité des modules T/R GaN. Comme pour SPY-6, la promesse LCC s'évaluera sur cycle complet de service ; les premières années opérationnelles depuis 2020 sur les FDA sont encourageantes selon la Marine nationale, mais le retour d'expérience public reste limité.",
      indicators: [
        {
          label: "Coût installation complète — estimation",
          value:
            "≈ 100 à 150 M€ par jeu de 4 panneaux fixes intégré — part radar dans un programme FDI complet",
          confidence: "faible",
          status: "variable",
          sources: ["marine-fdi"],
        },
        {
          label: "Lecture économique",
          value:
            "Coût capteur intégré dans le coût plateforme — ≈ 10 à 15 % du coût frégate",
          confidence: "moyenne",
          sources: ["marine-fdi"],
        },
        {
          label: "Argument LCC constructeur",
          value:
            "Suppression rotation mécanique, modularité GaN, upgrade logiciel — promesse de réduction du coût de cycle de vie",
          confidence: "moyenne",
          sources: ["thales-sea-fire"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Sea Fire est financé par la Marine nationale française au titre des programmes FREMM FDA et FDI, sous maîtrise d'ouvrage DGA. Naval Group est maître d'œuvre intégrateur, Thales fournit le radar. La structuration financière reflète l'architecture des grands programmes navals français : engagement pluriannuel, financement budgétaire continu, contrôle DGA strict.\n\nLes pistes export du Sea Fire sont liées à celles des frégates FDI : Grèce (3 FDI commandées, Hellenic Frigate program), Indonésie (en discussion), et autres. Chaque export est un acte de coopération industrielle franco-pays client, encadré par la DGA et par les régimes nationaux européens.",
      indicators: [
        {
          label: "Financeur principal",
          value:
            "Marine nationale française / DGA — intégré au programme FDI et FREMM FDA",
          confidence: "haute",
          sources: ["marine-fdi", "dga-fdi"],
        },
        {
          label: "Contrats export FDI confirmés",
          value:
            "Grèce — 3 FDI (Hellenic Frigate program, contrats 2021-2022)",
          confidence: "haute",
          sources: ["dga-fdi"],
        },
        {
          label: "Pistes export en discussion",
          value: "Indonésie, autres clients potentiels — détail variable",
          confidence: "moyenne",
          sources: ["press-fdi-export"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne Sea Fire est entièrement européenne et largement française. Thales intègre l'ensemble du capteur — modules T/R GaN, calculateurs, logiciel — sur ses sites France et Pays-Bas. La part de composants RF avancés produits sous contrôle européen est élevée, conformément à la stratégie de souveraineté affichée par Thales.\n\nLe risque industriel principal est partagé avec les autres programmes radar Thales (GM200, GM400, MS-MMR navals) : pression sur les semiconducteurs RF européens et cadence de production face à la demande naval post-2022. La base industrielle reste compacte comparée à celle de RTX.",
      indicators: [
        {
          label: "Empreinte industrielle",
          value: "Thales France / Pays-Bas — chaîne européenne, souveraineté capteur",
          confidence: "haute",
          sources: ["thales-sea-fire"],
        },
        {
          label: "Technologie RF",
          value: "Modules T/R GaN — production Thales européenne",
          confidence: "haute",
          sources: ["thales-sea-fire"],
        },
        {
          label: "Risque industriel principal",
          value:
            "Pression sur les semiconducteurs RF européens ; cadence face à la demande navale post-2022",
          confidence: "moyenne",
          sources: ["thales-sea-fire"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Sea Fire est un instrument de souveraineté navale française et un outil d'exportation pour la flotte FDI. Le choisir, c'est rester hors écosystème Aegis tout en disposant d'une capacité IAMD navale comparable. Pour les nations alliées de la France, Sea Fire est l'alternative crédible à SPY-6 sans intégration politique américaine.\n\nLe programme s'inscrit dans la diplomatie d'armement française et dans la logique d'autonomie stratégique européenne. Il est compatible avec NATINAMDS et avec les architectures C2 OTAN, sans en dépendre. La Marine nationale en a fait l'un des piliers de sa modernisation, et Thales un produit pivot pour la flotte FDI à l'export.",
      indicators: [
        {
          label: "Souveraineté capteur",
          value:
            "Hors ITAR — chaîne européenne, alternative crédible à Aegis pour les marines moyennes",
          confidence: "haute",
          sources: ["thales-sea-fire"],
        },
        {
          label: "Position dans l'OTAN",
          value:
            "Compatible NATINAMDS — autonome politiquement, intégré techniquement",
          confidence: "haute",
          sources: ["thales-sea-fire"],
        },
        {
          label: "Effet d'écosystème",
          value:
            "Pilier de la diplomatie d'armement française naval — couplé à la flotte FDI",
          confidence: "moyenne",
          sources: ["dga-fdi"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "L'export Sea Fire suit l'export FDI. Les FDI grecques (Kimon, Nearchos, Formion) seront les premières à recevoir Sea Fire à l'étranger. D'autres pistes existent — Indonésie, Émirats arabes unis ont exprimé un intérêt public — sans confirmation au moment où ces lignes sont écrites.\n\nLe régime applicable cumule Position commune UE 2008/944/PESC, contrôle DGA, et Wassenaar pour les composants RF avancés. L'exportabilité reste modérée : le capteur est cher, sa valeur intrinsèque dépend de l'intégration sur frégate, et il s'adresse à un cercle restreint de marines clientes du programme FDI. Mais l'absence d'ITAR est un atout structurant.",
      indicators: [
        {
          label: "Canal d'export",
          value:
            "Couplé à l'export FDI — DCS sous licence DGA, partenariats industriels selon contrat",
          confidence: "haute",
          sources: ["dga-fdi"],
        },
        {
          label: "Premiers clients export confirmés",
          value:
            "Grèce — 3 FDI Hellenic Frigate program (Kimon, Nearchos, Formion)",
          confidence: "haute",
          sources: ["dga-fdi", "press-fdi-export"],
        },
        {
          label: "Régime applicable",
          value:
            "Position commune UE + DGA + Wassenaar composants RF",
          confidence: "haute",
          sources: ["wassenaar-list"],
        },
      ],
    },
  ],
  integrationFrameworks: [
    "Système de combat naval français (SETIS / FDI)",
    "Aster / SAMP-T (cohérence effecteur)",
    "NATINAMDS",
    "Link 16 / Link 22",
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Coût d'intégration élevé compensé par la couverture 360° native et la suppression des servocommandes ; LCC à confirmer sur les premières années opérationnelles FDI.",
    },
    {
      key: "survivabilite",
      grade: "B",
      rationale:
        "Capteur naval embarqué, panneaux fixes redondants, agilité de faisceau AESA ; ECCM précis classifiés.",
    },
    {
      key: "exportabilite",
      grade: "B",
      rationale:
        "Hors ITAR mais couplé à l'export FDI — accès limité aux marines partenaires du programme français.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Chaîne Thales maîtrisée, mais pression européenne sur les semiconducteurs RF et cadence navale post-2022.",
    },
    {
      key: "maturite",
      grade: "B",
      rationale:
        "En service depuis 2020 sur FDA Lorraine et Alsace, intégration FDI en cours ; périmètre fonctionnel en consolidation.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "Sources Thales et Marine nationale abondantes sur le rôle et l'architecture, mais paramètres techniques fins classifiés.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un SPY-6 français qui voit à 500 km en BMD complet. La réalité : un excellent radar naval AESA multifonction, dont la couche BMD est partielle et dont la valeur opérationnelle dépend autant du système de combat naval français que de ses panneaux.",
    bestUseCase:
      "Équiper une marine alliée de la France d'une capacité IAMD navale 360° native hors écosystème Aegis, intégrée à la frégate FDI et compatible avec NATINAMDS.",
    weakPoint:
      "Couplage fort à l'export FDI et à l'écosystème Aster — sans frégate française correspondante, l'intégration devient prohibitivement complexe. La couverture BMD partielle est aussi à clarifier face à des menaces hypersoniques.",
    analystNote:
      "Sea Fire est, dans le catalogue Panoplie, le pendant français de SPY-6. Il documente concrètement que la souveraineté radar navale haut de gamme existe en Europe, à condition d'accepter le couplage industriel et politique au programme FDI. C'est un cas-école de la brique géopolitique navale.",
  },
  operators: [
    "France (Marine nationale — FREMM FDA Lorraine et Alsace, classe FDI Amiral Ronarc'h en intégration)",
    "Grèce (Hellenic Navy — FDI Kimon, Nearchos, Formion en intégration)",
  ],
  theatres: [
    "Méditerranée — déploiement FREMM FDA française",
    "Atlantique nord — patrouille FDI dans le futur",
    "Mer Égée — FDI grecques en intégration",
  ],
  timeline: [
    {
      date: "2017",
      label:
        "Sélection officielle Sea Fire pour la classe FDI — Thales maître d'œuvre radar.",
      kind: "jalon",
    },
    {
      date: "2020",
      label:
        "Mise en service sur FREMM FDA Lorraine — premier emploi opérationnel.",
      kind: "jalon",
    },
    {
      date: "2021",
      label:
        "Contrat FDI grecque signé — premier export confirmé pour Sea Fire.",
      kind: "export",
    },
    {
      date: "2024",
      label:
        "Mise sur cale FDI Amiral Ronarc'h — première frégate de la classe.",
      kind: "jalon",
    },
    {
      date: "2026",
      label:
        "Intégration vol FDI en cours — démonstrations opérationnelles attendues.",
      kind: "jalon",
    },
  ],
  sources: [
    {
      id: "thales-sea-fire",
      title: "Sea Fire — page produit Thales",
      publisher: "Thales",
      type: "constructeur",
      reliability: "B",
      url: "https://www.thalesgroup.com/en/markets/defence-and-security/radars",
    },
    {
      id: "marine-fdi",
      title:
        "Programme Frégates de Défense et d'Intervention (FDI) — Marine nationale française",
      publisher: "Marine nationale française",
      type: "officiel",
      reliability: "A",
      url: "https://www.defense.gouv.fr/marine",
    },
    {
      id: "dga-fdi",
      title:
        "DGA — programmes FREMM FDA et FDI, annonces export",
      publisher: "Direction Générale de l'Armement",
      type: "officiel",
      reliability: "A",
      url: "https://www.defense.gouv.fr/dga",
    },
    {
      id: "press-fdi-export",
      title:
        "Exports FDI — contrats Grèce, pistes Indonésie et UAE (presse spécialisée)",
      publisher: "Presse spécialisée défense",
      type: "presse",
      reliability: "B",
    },
    {
      id: "wassenaar-list",
      title:
        "Arrangement de Wassenaar — listes de biens et technologies à double usage",
      publisher: "Secrétariat de Wassenaar",
      type: "officiel",
      reliability: "A",
      url: "https://www.wassenaar.org/",
    },
  ],
  updated: "2026-05-27",
};
