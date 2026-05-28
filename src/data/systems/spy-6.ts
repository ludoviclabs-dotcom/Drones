import type { DefenseSystem } from "../types";

export const spy6: DefenseSystem = {
  slug: "spy-6",
  name: "AN/SPY-6(V)",
  designation: "SPY-6",
  reference: "PNP-RD-003",
  category: "radar",
  radarRole: "naval-mfr",
  classLabel:
    "Famille de radars navals AESA multifonctions IAMD bande S — défense aérienne et antimissile flotte américaine",
  country: "États-Unis",
  flag: "🇺🇸",
  manufacturer: "RTX (Raytheon)",
  introduced: "2023 (Flight III Arleigh Burke)",
  status:
    "En service — déployé sur Arleigh Burke Flight III ; en intégration sur classes Ford, Constellation, San Antonio Flight II et backfit Flight IIA",
  acquisitionModes: ["FMS"],
  tagline:
    "Le radar IAMD naval américain de référence — quatre variantes, une architecture commune en blocs RMA, et la promesse d'une couverture aérienne et antimissile balistique simultanée.",
  summary:
    "AN/SPY-6(V) est la famille de radars navals AESA multifonctions développée par RTX pour remplacer progressivement les SPY-1D(V) à panneaux fixes sur la flotte de surface américaine. Sa singularité tient à son architecture en blocs RMA (Radar Modular Assembly) cubiques de 0,6 m de côté, qui s'assemblent en panneaux de taille variable selon la classe de navire et la mission — un même produit décliné en quatre variantes principales.\n\nLa fiche SPY-6 est la fiche du basculement doctrinal de l'US Navy : passage d'une logique de radar dédié à une logique d'IAMD navale intégrée, où le même capteur gère simultanément veille longue portée, défense antiaérienne, défense antimissile balistique et conduite de tir multi-effecteurs. RTX en a fait un produit de souveraineté américaine, soumis à un régime ITAR strict.",
  keySpecs: [
    {
      label: "Architecture",
      value:
        "AESA bande S, panneaux fixes 4 faces, briques modulaires RMA (Radar Modular Assembly)",
      confidence: "haute",
      sources: ["rtx-spy6"],
    },
    {
      label: "Briques RMA",
      value:
        "Cubes 0,6 m × 0,6 m × 0,6 m — chaque brique = mini-radar autonome ; nombre par panneau selon variante",
      confidence: "haute",
      sources: ["rtx-spy6"],
    },
    {
      label: "Variantes documentées",
      value:
        "SPY-6(V)1 — DDG Flight III (37 RMA) ; (V)2 — LHA/LPD/CVN ; (V)3 — FFG Constellation ; (V)4 — backfit DDG Flight IIA (24 RMA)",
      confidence: "haute",
      sources: ["rtx-spy6", "navy-spy6"],
    },
    {
      label: "Bande de fréquence",
      value: "S — confirmée par sources publiques tierces",
      confidence: "haute",
      sources: ["public-band-spy6"],
    },
    {
      label: "Capacités simultanées",
      value:
        "Veille air, défense antiaérienne, défense antimissile balistique, conduite de tir, surveillance de surface — déclarées simultanées",
      confidence: "haute",
      sources: ["rtx-spy6"],
    },
    {
      label: "Intégration C2",
      value: "Aegis Combat System ; integration NIFC-CA, CEC, IAMD navale",
      confidence: "haute",
      sources: ["rtx-spy6", "navy-spy6"],
    },
    {
      label: "Technologie RF",
      value:
        "Modules T/R GaN — RTX revendique une intégration verticale microélectronique",
      confidence: "haute",
      sources: ["rtx-spy6", "rtx-microelectronics"],
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
        "Le coût SPY-6 est principalement documenté à travers les justifications budgétaires DoD et les contrats RTX/Navy. Le programme est structuré sur des lots pluriannuels couvrant à la fois la production et le soutien initial. La modularité RMA permet à RTX de pousser un argument fort de réduction du coût de cycle de vie : remplacer une brique défaillante coûte moins cher qu'intervenir sur un panneau monolithique.\n\nLes ordres de grandeur publics par capteur dépassent largement les radars terrestres équivalents, en raison de la masse de briques RMA et de l'intégration Aegis. La lecture de Panoplie reste prudente : le coût total dépend du nombre de RMA et de l'intégration sur la classe de navire, et n'est pas comparable au capteur seul.",
      indicators: [
        {
          label: "Modèle contractuel",
          value:
            "Lots pluriannuels RTX / US Navy — justifications budgétaires DoD annuelles",
          confidence: "haute",
          sources: ["dod-budget-spy6"],
        },
        {
          label: "Argument LCC constructeur",
          value:
            "Maintenance par briques RMA — réduction du coût de cycle de vie revendiquée par RTX",
          confidence: "haute",
          sources: ["rtx-spy6"],
        },
        {
          label: "Coût unitaire capteur",
          value:
            "Non publié homogène — varie fortement selon variante (nombre de RMA) et lot",
          confidence: "faible",
          status: "variable",
          sources: ["dod-budget-spy6"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le programme SPY-6 est financé par l'US Navy au titre des programmes shipbuilding et weapon system. Les volumes annuels sont fixés par le Congrès, avec une montée en cadence pluriannuelle pour soutenir la transition Flight III et la modernisation Flight IIA. RTX en a fait l'un de ses produits stratégiques radar, avec un investissement industriel dédié à la production des modules RMA.\n\nLe modèle export reste limité par construction : SPY-6 est essentiellement destiné à la flotte américaine, avec quelques explorations FMS sur des alliés très proches (Australie, Japon, Corée du Sud — discussions publiques de niveaux de maturité variables).",
      indicators: [
        {
          label: "Volume programmé",
          value:
            "Lots pluriannuels — Flight III, FFG Constellation, modernisation Flight IIA, intégration porte-aéronefs",
          confidence: "haute",
          sources: ["dod-budget-spy6", "navy-spy6"],
        },
        {
          label: "Modèle export",
          value: "FMS très restreint — alliés proches seulement",
          confidence: "moyenne",
          sources: ["rtx-spy6"],
        },
        {
          label: "Investissement industriel",
          value:
            "Ligne dédiée RMA chez RTX — montée en cadence en cours pour soutenir la flotte américaine",
          confidence: "haute",
          sources: ["rtx-spy6", "rtx-microelectronics"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne SPY-6 est entièrement américaine et largement intégrée par RTX. Les modules T/R sont produits sur ligne dédiée, avec une intégration verticale du GaN revendiquée par le constructeur. Cette intégration verticale est un point d'attention pour Panoplie : c'est exactement le type de souveraineté capteur que les industriels européens cherchent à reproduire.\n\nLe risque industriel principal n'est pas une dépendance étrangère mais la capacité à tenir la cadence pluriannuelle face aux multiples programmes navals simultanés (Flight III, Constellation, Ford, San Antonio Flight II, backfit Flight IIA). Les semiconducteurs RF avancés constituent un nœud de tension partagé avec les autres grands programmes radar et EW américains.",
      indicators: [
        {
          label: "Empreinte industrielle",
          value: "Intégration verticale RTX — chaîne entièrement américaine",
          confidence: "haute",
          sources: ["rtx-spy6", "rtx-microelectronics"],
        },
        {
          label: "Technologie RF",
          value: "GaN sur ligne dédiée RTX — intégration verticale revendiquée",
          confidence: "haute",
          sources: ["rtx-microelectronics"],
        },
        {
          label: "Risque industriel principal",
          value:
            "Cadence face à la convergence des programmes navals US ; pression semiconducteurs RF avancés",
          confidence: "moyenne",
          sources: ["rtx-spy6"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "SPY-6 est un objet de souveraineté américaine. Il porte la transition de l'US Navy vers l'IAMD intégrée, structurante pour le théâtre Pacifique. Le radar est lié indissolublement à Aegis, à NIFC-CA et au CEC — il n'a de valeur opérationnelle réelle qu'inséré dans cet écosystème de commandement et de tir.\n\nLes implications pour les alliés sont doubles. Premièrement, SPY-6 normalise la coopération navale IAMD entre US Navy et marines partenaires équipées d'Aegis (Japon, Corée du Sud, Australie, Norvège, Espagne). Deuxièmement, le coût et la complexité du système concentrent de fait la défense aérienne navale haute performance sur un petit nombre de marines capables d'opérer dans cet écosystème.",
      indicators: [
        {
          label: "Position stratégique",
          value:
            "Cœur de la transition IAMD navale US — théâtre Pacifique prioritaire",
          confidence: "haute",
          sources: ["rtx-spy6", "navy-spy6"],
        },
        {
          label: "Couplage doctrinal",
          value:
            "Indissociable d'Aegis, NIFC-CA, CEC — pas de valeur opérationnelle isolée",
          confidence: "haute",
          sources: ["rtx-spy6"],
        },
        {
          label: "Régime applicable",
          value: "ITAR — capteur stratégique sous contrôle Department of State",
          confidence: "haute",
          sources: ["itar-radar"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "SPY-6 est l'un des capteurs radar les plus contrôlés du catalogue Panoplie. Le régime ITAR américain s'applique avec un niveau de restriction élevé : les seules pistes d'export documentées concernent un cercle restreint d'alliés stratégiques opérant déjà Aegis. Le Japon (futures Maya-class), la Corée du Sud (Sejong the Great-class evolution), l'Australie (Hunter-class, en discussion publique) et l'Espagne (F-110) sont les pistes les plus avancées publiquement.\n\nL'exportabilité reste fondamentalement faible à modérée — chaque transfert nécessite une autorisation politique de haut niveau, et l'intégration capteur ne se conçoit qu'avec une intégration Aegis correspondante. Pour Panoplie, c'est l'exemple-type d'un capteur dont la valeur géopolitique l'emporte sur sa valeur commerciale.",
      indicators: [
        {
          label: "Canal d'export dominant",
          value:
            "FMS — restreint aux alliés stratégiques opérant Aegis",
          confidence: "haute",
          sources: ["rtx-spy6"],
        },
        {
          label: "Pistes export documentées",
          value:
            "Japon (Aegis Ashore évolutions, Maya-class), Corée du Sud, Australie (Hunter-class), Espagne (F-110) — niveaux de maturité variables",
          confidence: "moyenne",
          sources: ["public-spy6-foreign"],
        },
        {
          label: "Régime applicable",
          value:
            "ITAR avec niveau de restriction élevé — capteur stratégique de l'US Navy",
          confidence: "haute",
          sources: ["itar-radar"],
        },
      ],
    },
  ],
  integrationFrameworks: [
    "Aegis Combat System",
    "NIFC-CA",
    "CEC (Cooperative Engagement Capability)",
    "IAMD navale US",
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Coût total élevé en valeur absolue, mais argument LCC fort via la modularité RMA et la capacité simultanée multi-mission.",
    },
    {
      key: "survivabilite",
      grade: "B",
      rationale:
        "Capteur naval embarqué, redondance par briques RMA, intégration EW Aegis ; les performances ECCM précises restent classifiées.",
    },
    {
      key: "exportabilite",
      grade: "D",
      rationale:
        "ITAR très restrictif — capteur réservé aux alliés stratégiques opérant Aegis ; chaque transfert relève d'une décision politique de haut niveau.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Intégration verticale RTX maîtrisée, mais convergence des programmes navals US et pression semiconducteurs RF à surveiller.",
    },
    {
      key: "maturite",
      grade: "B",
      rationale:
        "En service opérationnel depuis 2023 sur Flight III ; intégration Flight IIA et Constellation en cours, périmètre fonctionnel encore en consolidation.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "Documents Navy / RTX abondants, justifications DoD annuelles, mais paramètres techniques fins (TRM, formes d'onde, ECCM) classifiés.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un super-radar qui « voit tout » à des centaines de kilomètres. La réalité : un capteur d'architecture modulaire indissociable d'Aegis, dont la valeur opérationnelle dépend autant des liaisons CEC et NIFC-CA que de ses briques RMA.",
    bestUseCase:
      "Équiper une marine alliée d'Aegis d'une capacité IAMD navale complète — défense aérienne, antimissile balistique et conduite de tir multi-effecteurs simultanément sur la même plateforme.",
    weakPoint:
      "Le couplage ITAR strict et la dépendance totale à l'écosystème Aegis — un capteur qui ne se conçoit pas en architecture C2 indépendante. La pression industrielle américaine sur les semiconducteurs RF avancés constitue une tension de fond.",
    analystNote:
      "SPY-6 est l'archétype du capteur stratégique américain de nouvelle génération. Pour Panoplie, il documente concrètement deux réalités : la souveraineté industrielle radar haut de gamme reste américaine, et le coût d'entrée IAMD navale haute performance se concentre sur un nombre restreint de marines alliées. C'est aussi un cas-école pour la lecture intégration C2 + capteur + effecteur des fiches Panoplie.",
  },
  operators: [
    "États-Unis (US Navy — Arleigh Burke Flight III déployé, Flight IIA backfit, FFG Constellation, classes Ford et San Antonio en intégration)",
  ],
  theatres: [
    "Pacifique — déploiement prioritaire de la transition IAMD navale",
    "Atlantique — déploiement progressif sur Flight III",
  ],
  timeline: [
    {
      date: "2013",
      label: "Lancement du programme SPY-6 — sélection RTX par l'US Navy.",
      kind: "jalon",
    },
    {
      date: "2019",
      label: "Premier tir d'essai opérationnel — démonstration IAMD intégrée.",
      kind: "jalon",
    },
    {
      date: "2023",
      label:
        "Entrée en service opérationnelle sur USS Jack H. Lucas (DDG Flight III) — premier déploiement.",
      kind: "jalon",
    },
    {
      date: "2024",
      label:
        "Confirmation du backfit Flight IIA avec variante (V)4 — extension de la base installée.",
      kind: "jalon",
    },
    {
      date: "2025",
      label:
        "Pistes export documentées vers Japon, Corée du Sud, Australie, Espagne — niveaux de maturité variables.",
      kind: "export",
    },
  ],
  sources: [
    {
      id: "rtx-spy6",
      title: "SPY-6 — page produit RTX",
      publisher: "RTX (Raytheon)",
      type: "constructeur",
      reliability: "B",
      url: "https://www.rtx.com/raytheon/what-we-do/sea/spy6-radars",
    },
    {
      id: "navy-spy6",
      title: "AN/SPY-6(V) Family of Radars — US Navy program page",
      publisher: "US Navy / NAVSEA",
      type: "officiel",
      reliability: "A",
      url: "https://www.navsea.navy.mil/",
    },
    {
      id: "dod-budget-spy6",
      title: "DoD Procurement Justification Books — SPY-6 line items",
      publisher: "DoD Comptroller — Office of the Under Secretary of Defense",
      type: "officiel",
      reliability: "A",
      url: "https://comptroller.defense.gov/Budget-Materials/",
    },
    {
      id: "public-band-spy6",
      title: "Bande S confirmée — sources publiques tierces, FCC filings et publications spécialisées",
      publisher: "Sources publiques tierces",
      type: "presse",
      reliability: "B",
    },
    {
      id: "rtx-microelectronics",
      title: "RTX Microelectronics — intégration verticale GaN",
      publisher: "RTX (Raytheon)",
      type: "constructeur",
      reliability: "B",
      url: "https://www.rtx.com/raytheon/what-we-do/advanced-technology/microelectronics",
    },
    {
      id: "public-spy6-foreign",
      title:
        "Pistes export SPY-6 — discussions publiques Japon, Corée du Sud, Australie, Espagne",
      publisher: "Presse spécialisée défense",
      type: "presse",
      reliability: "B",
    },
    {
      id: "itar-radar",
      title:
        "International Traffic in Arms Regulations — 22 CFR 121 USML Category XI (Military Electronics)",
      publisher: "U.S. Department of State — DDTC",
      type: "officiel",
      reliability: "A",
      url: "https://www.pmddtc.state.gov/",
    },
  ],
  updated: "2026-05-27",
};
