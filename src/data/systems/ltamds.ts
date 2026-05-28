import type { DefenseSystem } from "../types";

export const ltamds: DefenseSystem = {
  slug: "ltamds",
  name: "LTAMDS",
  designation: "Lower Tier Air and Missile Defense Sensor",
  reference: "PNP-RD-005",
  category: "radar",
  radarRole: "multi-mission",
  classLabel:
    "Radar AESA GaN 360° d'IAMD terrestre — successeur du MPQ-65 Patriot, nœud IBCS",
  country: "États-Unis",
  flag: "🇺🇸",
  manufacturer: "RTX (Raytheon)",
  introduced: "2025 (initial operational capability programmée)",
  status:
    "En industrialisation — IOC US Army programmée 2025, contrats export Pologne, Guam et autres alliés OTAN actifs",
  acquisitionModes: ["FMS"],
  tagline:
    "Le radar 360° qui remplace le Patriot tournant — trois panneaux GaN pour une couverture continue, conçue pour le combat IBCS et les menaces hypersoniques.",
  summary:
    "LTAMDS est le radar de remplacement du AN/MPQ-65 Patriot, conçu pour offrir une couverture 360° native via trois panneaux AESA GaN (un panneau principal en façade et deux panneaux secondaires latéraux). RTX en a fait l'un des produits-phares de sa transition radar : architecture entièrement nouvelle, intégration IBCS, conception pensée pour les menaces émergentes (drones, missiles de croisière, hypersoniques en glissement).\n\nLa fiche LTAMDS est, pour Panoplie, celle de la transition doctrinale de l'US Army vers AIAMD. Sortir de la rotation mécanique du MPQ-65 pour entrer dans une logique de panneaux fixes 360° n'est pas une simple modernisation : c'est un changement de modèle, qui suppose un C2 IBCS différent, des effecteurs étendus (PAC-3 MSE, futurs intercepteurs) et une logistique repensée.",
  keySpecs: [
    {
      label: "Architecture",
      value:
        "AESA bande S, 3 panneaux GaN (1 principal + 2 secondaires latéraux) — couverture 360° native sans rotation",
      confidence: "haute",
      sources: ["rtx-ltamds"],
    },
    {
      label: "Couverture",
      value: "360° native, faisceaux multiples simultanés, agilité de faisceau forte",
      confidence: "haute",
      sources: ["rtx-ltamds"],
    },
    {
      label: "Successeur de",
      value:
        "AN/MPQ-65 Patriot — radar passif rotatif, couverture sectorielle limitée",
      confidence: "haute",
      sources: ["rtx-ltamds", "us-army-ltamds"],
    },
    {
      label: "Technologie RF",
      value: "Modules T/R GaN — RTX intégration verticale",
      confidence: "haute",
      sources: ["rtx-ltamds", "rtx-microelectronics"],
    },
    {
      label: "Capacités déclarées",
      value:
        "Détection et suivi simultanés drones, missiles de croisière, missiles balistiques tactiques, menaces hypersoniques en glissement",
      confidence: "moyenne",
      status: "a-recouper",
      sources: ["rtx-ltamds"],
    },
    {
      label: "Intégration C2",
      value: "IBCS — capteur de batterie au cœur de l'architecture AIAMD US Army",
      confidence: "haute",
      sources: ["rtx-ltamds", "us-army-ltamds"],
    },
    {
      label: "Portée publique",
      value: "Non publiée précisément — supérieure au MPQ-65 selon RTX",
      confidence: "faible",
      status: "variable",
      sources: ["rtx-ltamds"],
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
        "Le coût LTAMDS est documenté à travers les contrats US Army et les notifications FMS pour les premiers clients export. Les ordres de grandeur publics oscillent autour de 250 à 400 M$ par capteur intégré, soutien initial inclus, avec une variabilité forte selon le lot et la configuration. Le coût du système IBCS associé n'est pas inclus dans ces montants.\n\nL'argument LCC de RTX repose sur la suppression de la rotation mécanique du MPQ-65, qui élimine une source majeure de panne, et sur la maintenance par modules GaN. Les premières années de service permettront de vérifier ces promesses ; pour l'instant, Panoplie traite cette lecture comme un argument constructeur à recouper.",
      indicators: [
        {
          label: "Coût unitaire capteur — ordre de grandeur public",
          value: "≈ 250 à 400 M$ par capteur intégré selon lot et configuration",
          confidence: "moyenne",
          status: "a-recouper",
          sources: ["dod-budget-ltamds", "dsca-ltamds"],
        },
        {
          label: "Argument LCC constructeur",
          value:
            "Suppression rotation mécanique, maintenance modulaire GaN — promesse de réduction du coût de cycle de vie",
          confidence: "moyenne",
          sources: ["rtx-ltamds"],
        },
        {
          label: "Coût IBCS associé",
          value: "Non inclus dans le coût capteur — programme séparé, addition substantielle",
          confidence: "haute",
          sources: ["us-army-ibcs"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "LTAMDS est financé par l'US Army au titre du programme Lower Tier Air and Missile Defense. Les premiers contrats EMD et LRIP (Engineering and Manufacturing Development, Low-Rate Initial Production) sont publics à travers les justifications budgétaires DoD annuelles. Le calendrier IOC a glissé à plusieurs reprises depuis le lancement initial du programme, ce qui rend la lecture financière prudente.\n\nLes notifications FMS récentes — Pologne (contrat WISŁA II), Guam (architecture régionale), discussions OTAN — confirment l'intérêt export. Le modèle financier reste similaire à celui de Patriot : un mix budgets US Army + FMS, avec un effet d'apprentissage industriel attendu sur les premières années de production.",
      indicators: [
        {
          label: "Financeur principal",
          value: "US Army — programme Lower Tier Air and Missile Defense",
          confidence: "haute",
          sources: ["dod-budget-ltamds"],
        },
        {
          label: "Premiers contrats FMS",
          value: "Pologne (WISŁA II), Guam, discussions OTAN multiples",
          confidence: "haute",
          sources: ["dsca-ltamds"],
        },
        {
          label: "Calendrier IOC",
          value:
            "Glissements documentés — IOC initialement prévue plus tôt, repoussée à 2025-2026",
          confidence: "haute",
          sources: ["dod-budget-ltamds", "us-army-ltamds"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne LTAMDS est entièrement américaine, intégrée par RTX, avec une intégration verticale GaN revendiquée. Le capteur utilise les briques microélectroniques que RTX produit en interne, dans une logique de souveraineté composants similaire à celle de SPY-6. Cette intégration verticale est l'un des arguments stratégiques majeurs du constructeur.\n\nLe risque industriel principal est celui de la cadence : LTAMDS doit monter en production tout en partageant la base GaN avec SPY-6, LRDR et d'autres grands programmes radar US. La pression sur les fonderies et le packaging RF avancé constitue un nœud de tension réel pour les années à venir.",
      indicators: [
        {
          label: "Empreinte industrielle",
          value: "Intégration verticale RTX — chaîne entièrement américaine",
          confidence: "haute",
          sources: ["rtx-ltamds", "rtx-microelectronics"],
        },
        {
          label: "Technologie RF",
          value: "GaN intégration verticale RTX — souveraineté composants revendiquée",
          confidence: "haute",
          sources: ["rtx-microelectronics"],
        },
        {
          label: "Risque industriel principal",
          value:
            "Cadence partagée avec SPY-6 et LRDR ; pression fonderies et packaging RF",
          confidence: "moyenne",
          sources: ["rtx-ltamds"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "LTAMDS est le capteur qui structure la prochaine décennie de la défense aérienne tactique américaine et de ses alliés Patriot. Adopter LTAMDS, c'est rester dans l'écosystème US Patriot tout en migrant vers l'AIAMD IBCS : standardisation OTAN renforcée, mutualisation des intercepteurs (PAC-3 MSE notamment), interopérabilité avec les capteurs alliés.\n\nLa Pologne a fait de LTAMDS son choix structurant via le programme WISŁA II. Cette décision marque une trajectoire alignée fermement avec Washington dans la défense aérienne du flanc Est. D'autres alliés OTAN (Roumanie, Suède en évaluation) examinent la même option. Pour Panoplie, c'est un cas-école de la brique géopolitique où le radar n'est pas un produit isolé mais une décision de doctrine.",
      indicators: [
        {
          label: "Position stratégique",
          value:
            "Capteur de transition Patriot → IBCS — structure la défense aérienne tactique alliée",
          confidence: "haute",
          sources: ["rtx-ltamds", "us-army-ibcs"],
        },
        {
          label: "Premier client export structurant",
          value:
            "Pologne (WISŁA II) — décision politique majeure d'alignement défense aérienne",
          confidence: "haute",
          sources: ["dsca-ltamds"],
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
        "L'export LTAMDS suit le modèle Patriot mais sous régime ITAR plus strict, compte tenu de la sensibilité du capteur GaN 360° et de son intégration IBCS. Les premiers contrats FMS publics couvrent la Pologne (WISŁA II), Guam et des discussions avec plusieurs alliés OTAN. La cadence de production limite mécaniquement le nombre d'exports possibles dans les premières années.\n\nLe canal dominant est FMS, avec notifications DSCA au Congrès. L'exportabilité reste faible à modérée — un cercle d'alliés Patriot uniquement, et au prix d'un alignement fort sur l'écosystème C2 IBCS. La fiche reste à mettre à jour à mesure que de nouveaux contrats sont notifiés.",
      indicators: [
        {
          label: "Canal d'export dominant",
          value: "FMS — alliés Patriot uniquement, alignement IBCS exigé",
          confidence: "haute",
          sources: ["dsca-ltamds"],
        },
        {
          label: "Clients export documentés",
          value: "Pologne (WISŁA II), Guam ; discussions OTAN multiples",
          confidence: "haute",
          sources: ["dsca-ltamds"],
        },
        {
          label: "Régime applicable",
          value:
            "ITAR — capteur AESA GaN 360°, contrôle Department of State strict",
          confidence: "haute",
          sources: ["itar-radar"],
        },
      ],
    },
  ],
  integrationFrameworks: [
    "IBCS",
    "Patriot écosystème (modernisation)",
    "AIAMD US Army",
    "NATINAMDS (via FMS)",
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Coût unitaire élevé mais couverture 360° native et capacité multi-menace ; LCC à confirmer après mise en service opérationnelle.",
    },
    {
      key: "survivabilite",
      grade: "B",
      rationale:
        "Suppression de la rotation mécanique, redondance par panneaux GaN, intégration IBCS résiliente ; les performances ECCM précises restent classifiées.",
    },
    {
      key: "exportabilite",
      grade: "C",
      rationale:
        "ITAR restrictif et exigence d'alignement IBCS — accès limité au cercle d'alliés Patriot, mais piste claire pour la modernisation OTAN.",
    },
    {
      key: "risque-industriel",
      grade: "C",
      rationale:
        "Programme jeune, glissements de calendrier passés, cadence GaN partagée avec d'autres programmes RTX ; pression industrielle réelle.",
    },
    {
      key: "maturite",
      grade: "C",
      rationale:
        "IOC US Army en cours de finalisation, premières unités opérationnelles en déploiement initial ; périmètre fonctionnel encore en consolidation.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "Sources RTX, US Army, DoD budget et DSCA abondantes sur le rôle et l'architecture, mais paramètres techniques fins classifiés.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un Patriot qui voit enfin partout en même temps. La réalité : un capteur 360° natif effectivement supérieur au MPQ-65, mais dont la valeur réelle dépend de l'intégration IBCS, du calendrier de livraison et des premières années opérationnelles encore en validation.",
    bestUseCase:
      "Moderniser une batterie Patriot vers une couverture 360° native, en s'inscrivant dans la doctrine IBCS et en consolidant l'interopérabilité OTAN sur les intercepteurs PAC-3 MSE.",
    weakPoint:
      "La jeunesse du programme, les glissements de calendrier passés, et la dépendance totale à l'écosystème IBCS — adopter LTAMDS sans IBCS n'a pas de sens doctrinal.",
    analystNote:
      "LTAMDS est le marqueur de la prochaine décennie de défense aérienne tactique pour les alliés Patriot. Pour Panoplie, c'est un cas-école de la convergence radar + C2 + effecteur : le capteur isolé ne se lit pas ; il faut le replacer dans la triple architecture LTAMDS + IBCS + PAC-3 MSE.",
  },
  operators: [
    "États-Unis (US Army — premières unités en montée en puissance opérationnelle)",
    "Pologne (WISŁA II — programme en cours)",
    "États-Unis (territoire de Guam — architecture régionale)",
  ],
  theatres: [
    "Europe centrale — défense aérienne intégrée flanc Est, Pologne",
    "Pacifique — Guam, posture régionale",
    "Territoire US — bases majeures",
  ],
  timeline: [
    {
      date: "2019",
      label: "Sélection RTX par l'US Army pour le programme LTAMDS.",
      kind: "jalon",
    },
    {
      date: "2022",
      label: "Premiers essais opérationnels capteur — démonstration architecture 360°.",
      kind: "jalon",
    },
    {
      date: "2023",
      label:
        "Notification FMS Pologne — programme WISŁA II structurant pour la défense aérienne polonaise.",
      kind: "export",
    },
    {
      date: "2025",
      label:
        "IOC US Army programmée — entrée en service opérationnel des premières unités.",
      kind: "jalon",
    },
    {
      date: "2026",
      label:
        "Discussions OTAN multiples — Roumanie, Suède en évaluation publique.",
      kind: "export",
    },
  ],
  sources: [
    {
      id: "rtx-ltamds",
      title: "LTAMDS — page produit RTX",
      publisher: "RTX (Raytheon)",
      type: "constructeur",
      reliability: "B",
      url: "https://www.rtx.com/raytheon/what-we-do/integrated-air-and-missile-defense/ltamds",
    },
    {
      id: "us-army-ltamds",
      title: "LTAMDS program — US Army Program Executive Office",
      publisher: "US Army PEO Missiles and Space",
      type: "officiel",
      reliability: "A",
      url: "https://www.army.mil/",
    },
    {
      id: "us-army-ibcs",
      title:
        "Integrated Battle Command System (IBCS) — US Army program page and recent communications",
      publisher: "US Army",
      type: "officiel",
      reliability: "A",
      url: "https://www.army.mil/",
    },
    {
      id: "dod-budget-ltamds",
      title: "DoD Procurement Justification Books — LTAMDS line items",
      publisher: "DoD Comptroller — Office of the Under Secretary of Defense",
      type: "officiel",
      reliability: "A",
      url: "https://comptroller.defense.gov/Budget-Materials/",
    },
    {
      id: "dsca-ltamds",
      title: "DSCA LTAMDS FMS notifications to Congress",
      publisher: "Defense Security Cooperation Agency",
      type: "officiel",
      reliability: "A",
      url: "https://www.dsca.mil/press-media/major-arms-sales",
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
      id: "itar-radar",
      title:
        "International Traffic in Arms Regulations — 22 CFR 121 USML Category XI",
      publisher: "U.S. Department of State — DDTC",
      type: "officiel",
      reliability: "A",
      url: "https://www.pmddtc.state.gov/",
    },
  ],
  updated: "2026-05-27",
};
