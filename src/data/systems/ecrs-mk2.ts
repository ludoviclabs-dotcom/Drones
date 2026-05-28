import type { DefenseSystem } from "../types";

export const ecrsMk2: DefenseSystem = {
  slug: "ecrs-mk2",
  name: "ECRS Mk2",
  designation: "European Common Radar System Mk2",
  reference: "PNP-RD-007",
  category: "radar",
  radarRole: "aeroporte-aesa",
  classLabel:
    "Radar AESA aéroporté de chasse — multifonction radar + guerre électronique pour Eurofighter Typhoon",
  country: "Europe (Royaume-Uni / Italie / Allemagne / Espagne)",
  flag: "🇪🇺",
  manufacturer: "EuroRadar (Leonardo IT, Hensoldt DE, Indra ES) — prime Leonardo UK pour Mk2",
  introduced: "2026 (intégration vol Typhoon programmée)",
  status:
    "En développement et industrialisation — programme structurant pour la longévité Typhoon, financé Royaume-Uni / Allemagne, intégration vol et qualification en cours",
  acquisitionModes: ["cooperatif"],
  tagline:
    "Le radar qui doit maintenir Typhoon compétitif face au F-35 — un AESA pleinement multifonction radar et guerre électronique, conçu par et pour l'Europe.",
  summary:
    "ECRS Mk2 est l'évolution majeure de la famille de radars AESA conçus par le consortium EuroRadar pour l'Eurofighter Typhoon. Mené sous prime Leonardo UK, il combine une nouvelle antenne à pointage électronique étendu (Wide Field of Regard), une intégration radar + guerre électronique simultanée, et une refonte du traitement signal qui permet des modes radar et EW/EA opérés depuis le même matériel.\n\nLa fiche ECRS Mk2 est, pour Panoplie, celle de la dépendance européenne aux capteurs AESA aéroportés. Sans Mk2, le Typhoon perd progressivement sa pertinence face au F-35 et aux chasseurs adverses de génération AESA. Avec Mk2, l'Europe consolide une chaîne capteur aéroporté souveraine, doublement utile pour Typhoon et pour les futurs programmes (GCAP / Tempest, FCAS / SCAF en partie).",
  keySpecs: [
    {
      label: "Architecture",
      value:
        "AESA bande X — antenne à pointage électronique étendu (Wide Field of Regard), pivotable mécaniquement",
      confidence: "haute",
      sources: ["leonardo-ecrs-mk2", "airbus-eurofighter-radar"],
    },
    {
      label: "Capacités EW / EA simultanées",
      value:
        "Radar + electronic warfare + electronic attack simultanés sur la même antenne — argument structurant Leonardo / Hensoldt",
      confidence: "haute",
      sources: ["leonardo-ecrs-mk2"],
    },
    {
      label: "Plateforme",
      value: "Eurofighter Typhoon — intégration Tranche 3/4 prioritairement",
      confidence: "haute",
      sources: ["airbus-eurofighter-radar"],
    },
    {
      label: "Variantes documentées",
      value:
        "Mk0 (Captor-E) en service — Mk1 BREMM (UK interim) — Mk2 nouvelle architecture en intégration",
      confidence: "haute",
      sources: ["leonardo-ecrs-mk2", "airbus-eurofighter-radar"],
    },
    {
      label: "Modes radar",
      value:
        "Air-air longue portée, air-sol SAR / GMTI, surveillance maritime, désignation d'objectif pour Meteor / SCALP",
      confidence: "haute",
      sources: ["leonardo-ecrs-mk2"],
    },
    {
      label: "Intégration capteurs",
      value:
        "Fusion avec PIRATE (IRST), DASS (Defensive Aids Sub-System), liaisons Link 16 / MIDS",
      confidence: "haute",
      sources: ["airbus-eurofighter-radar"],
    },
    {
      label: "Technologie RF",
      value:
        "Modules T/R GaN — production européenne, partage Leonardo / Hensoldt",
      confidence: "haute",
      sources: ["leonardo-ecrs-mk2"],
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
        "Le coût ECRS Mk2 est partiellement public à travers les contrats Royaume-Uni / Allemagne et les justifications budgétaires de défense correspondantes. Le programme est financé en partage entre le Royaume-Uni (MoD), l'Allemagne (BMVg), avec contributions Italie et Espagne. Les ordres de grandeur publics du contrat de développement initial dépassent le milliard de livres sterling pour la phase Mk2.\n\nLe coût unitaire capteur à l'export n'est pas publié de façon homogène. La logique économique du programme repose moins sur le coût marginal du radar que sur le maintien de la compétitivité Typhoon — sans ECRS Mk2, la flotte européenne perdrait progressivement sa valeur d'export et son rôle dans la dissuasion conventionnelle européenne.",
      indicators: [
        {
          label: "Phase de développement",
          value:
            "≈ 2 Md£ pour la phase Mk2 — partage Royaume-Uni + Allemagne (chiffres publics du MoD UK)",
          confidence: "moyenne",
          sources: ["uk-mod-ecrs"],
        },
        {
          label: "Coût unitaire capteur à l'export",
          value: "Non publié homogène — inclus dans le prix Typhoon Tranche 4+",
          confidence: "faible",
          status: "variable",
          sources: ["airbus-eurofighter-radar"],
        },
        {
          label: "Logique économique",
          value:
            "Maintien de la valeur de la flotte Typhoon — sans Mk2, érosion progressive du marché export",
          confidence: "haute",
          sources: ["airbus-eurofighter-radar"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le programme ECRS Mk2 est financé en partage entre le Royaume-Uni (UK MoD, contrat principal Leonardo UK) et l'Allemagne (BMVg via Hensoldt). L'Italie et l'Espagne participent via leurs industries respectives et leurs flottes Typhoon. Le financement transversal s'inscrit dans l'effort plus large de modernisation Typhoon (Tranche 4, Long-Term Evolution Programme — LTEP).\n\nLa structure financière reflète l'architecture du consortium Eurofighter : un programme transnational européen, avec ses lourdeurs de gouvernance et ses avantages industriels mutualisés. Les retards de programme observés depuis le lancement initial sont en partie liés à cette complexité gouvernance.",
      indicators: [
        {
          label: "Financeurs principaux",
          value: "Royaume-Uni (MoD) + Allemagne (BMVg) — partage majeur",
          confidence: "haute",
          sources: ["uk-mod-ecrs"],
        },
        {
          label: "Inscription programme",
          value: "Long-Term Evolution Programme Typhoon (LTEP) — Tranche 4+",
          confidence: "haute",
          sources: ["airbus-eurofighter-radar"],
        },
        {
          label: "Gouvernance",
          value:
            "Consortium EuroRadar + comités Eurofighter — complexité gouvernance documentée",
          confidence: "haute",
          sources: ["airbus-eurofighter-radar"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne ECRS Mk2 est entièrement européenne, structurée par le consortium EuroRadar : Leonardo UK (prime Mk2), Leonardo Italie, Hensoldt Allemagne, Indra Espagne. Les modules T/R GaN sont produits par Leonardo et Hensoldt en partage. C'est un cas-école de la souveraineté industrielle radar aéroportée européenne — l'alternative crédible à la dépendance Northrop Grumman / RTX sur les chasseurs occidentaux.\n\nLe risque industriel principal est celui de la coordination transnationale et de la cadence : un retard dans une chaîne nationale impacte tout le programme. La pression sur les semiconducteurs RF avancés est partagée avec d'autres programmes radar européens (GM200/400, MS-MMR ailleurs).",
      indicators: [
        {
          label: "Empreinte industrielle",
          value:
            "Leonardo UK (prime Mk2) + Leonardo IT + Hensoldt DE + Indra ES — consortium EuroRadar",
          confidence: "haute",
          sources: ["leonardo-ecrs-mk2"],
        },
        {
          label: "Technologie RF",
          value: "Modules T/R GaN — production partagée Leonardo / Hensoldt",
          confidence: "haute",
          sources: ["leonardo-ecrs-mk2"],
        },
        {
          label: "Risque industriel principal",
          value:
            "Coordination transnationale ; pression semiconducteurs RF européens",
          confidence: "moyenne",
          sources: ["airbus-eurofighter-radar"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "ECRS Mk2 est la pièce manquante pour que le Typhoon reste compétitif jusqu'aux années 2040 et soit valorisable à l'export face au F-35. Le programme conditionne mécaniquement la rentabilité industrielle de tous les partenaires Eurofighter — Royaume-Uni, Italie, Allemagne, Espagne — et la pertinence stratégique de leurs flottes.\n\nL'enjeu est doublement stratégique : il s'agit d'une part de maintenir une chaîne aéronautique de combat européenne crédible, d'autre part de préparer l'avenir post-Typhoon (GCAP / Tempest pour UK/IT/JP, FCAS / SCAF pour FR/DE/ES). Pour Panoplie, ECRS Mk2 documente concrètement la difficulté politique et industrielle de tenir une souveraineté radar aéroportée européenne.",
      indicators: [
        {
          label: "Position stratégique",
          value:
            "Pivot industriel pour la flotte Typhoon — sans Mk2, érosion de la pertinence Typhoon post-2030",
          confidence: "haute",
          sources: ["airbus-eurofighter-radar"],
        },
        {
          label: "Souveraineté capteur",
          value:
            "Hors ITAR — chaîne européenne complète, alternative crédible à la dépendance US",
          confidence: "haute",
          sources: ["leonardo-ecrs-mk2"],
        },
        {
          label: "Lien futurs programmes",
          value:
            "Briques technologiques transférables vers GCAP/Tempest et FCAS/SCAF — base de l'aéronautique de combat européenne",
          confidence: "moyenne",
          sources: ["airbus-eurofighter-radar"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "L'export ECRS Mk2 suit l'export Typhoon. Les premiers clients Tranche 4 (Espagne — Halcón II, Italie, Royaume-Uni, Allemagne) bénéficieront du Mk2 progressivement. Les futurs clients export potentiels (Turquie en discussion, autres nations Moyen-Orient) auront le radar dans leur offre de base.\n\nLe régime applicable cumule Position commune UE 2008/944/PESC, contrôle national du pays exportateur principal (UK ECJU, Italie UAMA, Allemagne BAFA), et Wassenaar pour les composants RF avancés. L'exportabilité reste élevée — l'absence d'ITAR est un atout face au F-35, particulièrement pour les nations cherchant l'autonomie d'emploi.",
      indicators: [
        {
          label: "Canal d'export",
          value:
            "Couplé à l'export Typhoon — coopératif via consortium Eurofighter",
          confidence: "haute",
          sources: ["airbus-eurofighter-radar"],
        },
        {
          label: "Clients Tranche 4 confirmés",
          value:
            "Espagne (Halcón II), Italie, Royaume-Uni, Allemagne, Qatar et Koweït (Mk0 mais base pour Mk2)",
          confidence: "haute",
          sources: ["airbus-eurofighter-radar"],
        },
        {
          label: "Régime applicable",
          value:
            "Position commune UE + contrôles nationaux (ECJU UK, UAMA IT, BAFA DE) + Wassenaar composants RF",
          confidence: "haute",
          sources: ["wassenaar-list"],
        },
      ],
    },
  ],
  integrationFrameworks: [
    "Eurofighter Typhoon (LTEP)",
    "NATINAMDS (via plateforme Typhoon)",
    "Link 16 / MIDS",
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Coût de développement élevé mais inscription dans le programme LTEP Typhoon ; rentabilité dépendante du nombre d'exports Tranche 4+.",
    },
    {
      key: "survivabilite",
      grade: "B",
      rationale:
        "AESA agile + EW/EA simultanés — argument constructeur fort pour la survivabilité plateforme ; performances précises classifiées.",
    },
    {
      key: "exportabilite",
      grade: "B",
      rationale:
        "Hors ITAR, intégré à l'offre Typhoon — bon profil face au F-35 mais limité aux clients Typhoon ou potentiels.",
    },
    {
      key: "risque-industriel",
      grade: "C",
      rationale:
        "Coordination transnationale complexe, retards de programme documentés, pression composants RF européens.",
    },
    {
      key: "maturite",
      grade: "C",
      rationale:
        "En développement avancé, intégration vol Typhoon en cours, IOC programmée mais pas encore opérationnelle ; périmètre fonctionnel en consolidation.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "Sources Leonardo, Airbus Defence, UK MoD abondantes sur le rôle et l'architecture ; paramètres techniques fins classifiés.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un AESA qui rend enfin Typhoon égal au F-35. La réalité : un capteur AESA structurant qui prolonge la pertinence Typhoon, mais ne résout pas à lui seul l'enjeu de furtivité, de fusion capteurs et de connectivité réseau face à un chasseur de 5e génération.",
    bestUseCase:
      "Moderniser une flotte Typhoon vers une capacité radar + EW pleinement AESA, conserver l'autonomie d'emploi hors ITAR, et préparer la transition technologique vers les programmes de chasse européens de 6e génération (GCAP, FCAS).",
    weakPoint:
      "Les retards de programme cumulés et la complexité gouvernance Eurofighter — chaque mois de retard érode la fenêtre de pertinence Typhoon face aux nouveaux entrants.",
    analystNote:
      "ECRS Mk2 est l'un des programmes les plus politiquement chargés du catalogue Panoplie : il porte la souveraineté radar aéroportée européenne et conditionne la rentabilité de toute la filière Typhoon. Son succès — ou son échec — sera un indicateur structurant pour les ambitions GCAP / FCAS.",
  },
  operators: [
    "Royaume-Uni (RAF — programme principal Mk2)",
    "Allemagne (Luftwaffe)",
    "Italie (Aeronautica Militare)",
    "Espagne (Ejército del Aire — Halcón II)",
    "Clients Typhoon Tranche 4+ progressivement",
  ],
  theatres: [
    "Théâtre européen — air-air, air-sol, surveillance maritime",
    "Théâtre OTAN — défense aérienne intégrée, posture flanc Est",
    "Exports — Golfe Persique (Koweït, Qatar — Mk0 base pour évolution Mk2)",
  ],
  timeline: [
    {
      date: "2007",
      label:
        "Captor-E (Mk0) — premières études AESA pour Eurofighter, lancement du parcours capteur.",
      kind: "jalon",
    },
    {
      date: "2014",
      label:
        "Premiers vols Captor-E sur Typhoon — démonstration AESA initiale.",
      kind: "jalon",
    },
    {
      date: "2020",
      label:
        "Sélection ECRS Mk2 par le Royaume-Uni — Leonardo UK prime pour la phase d'industrialisation.",
      kind: "jalon",
    },
    {
      date: "2023",
      label:
        "Confirmation de l'Allemagne — financement et engagement industriel Hensoldt.",
      kind: "jalon",
    },
    {
      date: "2026",
      label:
        "Intégration vol Typhoon programmée — première unité fonctionnellement équipée.",
      kind: "jalon",
    },
  ],
  sources: [
    {
      id: "leonardo-ecrs-mk2",
      title: "ECRS Mk2 — page Leonardo / Typhoon radar",
      publisher: "Leonardo",
      type: "constructeur",
      reliability: "B",
      url: "https://uk.leonardo.com/en/innovation/typhoon/radar",
    },
    {
      id: "airbus-eurofighter-radar",
      title: "Eurofighter Typhoon radar — page Airbus Defence and Space",
      publisher: "Airbus Defence and Space",
      type: "constructeur",
      reliability: "B",
      url: "https://www.airbus.com/en/products-services/defence/military-aircraft/eurofighter",
    },
    {
      id: "uk-mod-ecrs",
      title:
        "ECRS Mk2 contract — UK Ministry of Defence announcements (2020-2024)",
      publisher: "UK Ministry of Defence",
      type: "officiel",
      reliability: "A",
      url: "https://www.gov.uk/government/organisations/ministry-of-defence",
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
