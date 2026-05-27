import type { DefenseSystem } from "../types";

export const micaNg: DefenseSystem = {
  slug: "mica-ng",
  name: "MICA NG",
  designation: "Missile d'Interception, de Combat et d'Auto-défense — New Generation",
  reference: "PNP-MSL-010",
  category: "missile",
  missileRole: "AAM",
  classLabel: "Missile air-air court/moyen courrier dual-use — successeur MICA",
  country: "France",
  flag: "🇫🇷",
  manufacturer: "MBDA",
  introduced: "2026",
  status:
    "Qualification finale ; premières livraisons à l'armée de l'air et de l'espace en 2026",
  acquisitionModes: ["production-nationale"],
  tagline:
    "Le successeur du MICA — deux autodirecteurs interopérables (RF AESA + IR imageur), une dotation universelle Rafale, et un effecteur sol-air via VL MICA.",
  summary:
    "MICA NG est la modernisation profonde du MICA développée par MBDA pour l'armée de l'air et de l'espace française. La famille MICA est unique au monde par sa caractéristique structurante : deux autodirecteurs — RF et IR — interchangeables sur le même missile, sans modification de la cellule ni de la propulsion. La NG conserve cette logique en y intégrant des seekers de génération récente : AESA pour la version RF, imageur IR refroidi à matrice plan focal pour la version IR.\n\nL'objet a une double vocation. En air-air, il équipe le Rafale comme effecteur multi-cible court/moyen courrier, complémentaire de Meteor. En surface-launch, il alimente le système VL MICA — défense aérienne mobile, terrestre et navale. La fiche MICA NG est ainsi l'archétype du missile dual-use européen non-ITAR : un effecteur souverain, exportable avec la plateforme ou la batterie, qui consolide la fonction air-air française pour les vingt prochaines années.",
  keySpecs: [
    {
      label: "Autodirecteurs interopérables",
      value:
        "RF AESA (variante MICA NG RF) ou imageur IR refroidi FPA (variante MICA NG IR)",
      confidence: "haute",
      sources: ["mbda-mica-ng"],
    },
    {
      label: "Guidage mi-course",
      value: "Inertiel + datalink bidirectionnel",
      confidence: "haute",
      sources: ["mbda-mica-ng"],
    },
    {
      label: "Modes opératoires",
      value: "LOBL, LOAL ; capacité multi-cible (verrou-tir multiple)",
      confidence: "haute",
      sources: ["mbda-mica-ng"],
    },
    {
      label: "Charge militaire",
      value:
        "Charge focalisée HE avec fusée de proximité RF/laser",
      confidence: "haute",
      sources: ["mbda-mica-ng"],
    },
    {
      label: "Plateformes air-air",
      value: "Rafale (toutes versions) ; rétrofit possible sur Mirage 2000",
      confidence: "haute",
      sources: ["mbda-mica-ng"],
    },
    {
      label: "Emploi surface-launch",
      value:
        "VL MICA — défense aérienne mobile terre et marine ; logique MICA NG VL annoncée",
      confidence: "moyenne",
      sources: ["mbda-mica-ng"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "MICA NG n'est pas publié à l'unité. Le contrat de qualification et de production initial passé à MBDA est connu, mais ventilé par missile. La logique économique est celle d'un effecteur courte/moyenne portée souverain — moins cher qu'un Meteor, plus cher qu'un AIM-9X, calibré pour une dotation universelle Rafale.\n\nLa réutilisation de cellule MICA — propulsion, charge, structure — réduit le coût de développement et permet une cadence de production raisonnable. C'est un argument central de l'arbitrage français pour la NG plutôt qu'un missile totalement nouveau.",
      indicators: [
        {
          label: "Coût unitaire public",
          value: "Non publié — livraison par lots contractuels",
          confidence: "faible",
          status: "variable",
          sources: ["mbda-mica-ng"],
        },
        {
          label: "Lecture économique",
          value:
            "Réutilisation de cellule MICA — coût de développement maîtrisé",
          confidence: "moyenne",
          sources: ["mbda-mica-ng"],
        },
        {
          label: "Coût d'écosystème",
          value:
            "Mutualisé avec VL MICA — économies sur le soutien et la formation",
          confidence: "moyenne",
          sources: ["mbda-mica-ng"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le programme est porté par la DGA française et notifié à MBDA dans le cadre d'une trajectoire de remplacement du MICA en service depuis le début des années 2000. Les premières livraisons sont prévues à partir de 2026, en concomitance avec la maturation du Rafale standard F4.\n\nLe financement est entièrement national, dans une logique cohérente avec la souveraineté capacitaire française : pas de partage de programme, pas de dépendance ITAR, autonomie complète de standard et d'export. C'est la même grille que pour Aster, SCALP, Exocet — la cohérence française du domaine missiles.",
      indicators: [
        {
          label: "Maîtrise programme",
          value:
            "DGA — programme national, MBDA maître d'œuvre industriel",
          confidence: "haute",
          sources: ["dga-mica-ng"],
        },
        {
          label: "Calendrier de livraison",
          value: "Premières livraisons à partir de 2026 — armée de l'air et de l'espace",
          confidence: "haute",
          sources: ["dga-mica-ng"],
        },
        {
          label: "Modèle de financement",
          value: "Financement national intégral — souveraineté capacitaire",
          confidence: "haute",
          sources: ["dga-mica-ng"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne MICA NG est entièrement européenne — MBDA pour la maîtrise d'œuvre, Thales pour le seeker RF AESA, Safran pour l'autodirecteur IR refroidi. C'est l'une des fiches les plus claires du domaine en matière d'autonomie : aucun nœud critique n'est soumis à l'ITAR ou à une autorisation étrangère.\n\nLe risque industriel principal est la cadence — comme pour Aster, la base européenne du missile sol-air et air-air est dimensionnée pour un rythme de paix. La mise en service simultanée MICA NG, Aster B1NT et la modernisation SCALP créent une demande structurelle sur MBDA qui justifie les annonces de doublement de capacité.",
      indicators: [
        {
          label: "Maître d'œuvre",
          value: "MBDA France",
          confidence: "haute",
          sources: ["mbda-mica-ng"],
        },
        {
          label: "Seekers",
          value: "Thales (RF AESA) + Safran (IR imageur refroidi)",
          confidence: "haute",
          sources: ["mbda-mica-ng"],
        },
        {
          label: "Risque industriel principal",
          value:
            "Cadence — concomitance MICA NG, Aster B1NT et modernisation SCALP",
          confidence: "moyenne",
          sources: ["mbda-cadence"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "MICA NG est un objet structurant de l'autonomie capacitaire française. Il consolide la fonction air-air court/moyen courrier sans dépendre des États-Unis, et il alimente VL MICA — qui est le seul système sol-air mobile français-MBDA dans cette classe de portée.\n\nPour les opérateurs Rafale export, MICA NG est l'effecteur naturel. Sa disponibilité accélère les contrats Rafale et renforce la cohérence de l'écosystème français — Rafale + Meteor + MICA NG + SCALP + Exocet, tous hors ITAR. C'est cette cohérence qui distingue Paris des autres exportateurs occidentaux.",
      indicators: [
        {
          label: "Fonction stratégique",
          value:
            "Pilier français du segment AAM court/moyen + alimentation VL MICA",
          confidence: "haute",
          sources: ["mbda-mica-ng"],
        },
        {
          label: "Régime applicable",
          value:
            "Contrôle français + Position commune UE — hors ITAR",
          confidence: "haute",
          sources: ["eu-cp-944"],
        },
        {
          label: "Effet d'écosystème",
          value:
            "Consolide la cohérence non-ITAR du couple Rafale + munitions MBDA",
          confidence: "haute",
          sources: ["mbda-mica-ng"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "MICA NG suivra naturellement les contrats Rafale export et les systèmes VL MICA. Les utilisateurs MICA actuels — France, Grèce, Égypte, Inde, Qatar, Émirats, Croatie, Indonésie, etc. — sont des prospects naturels pour MICA NG, soit par renouvellement de stock soit par bundle Rafale.\n\nLe régime applicable reste celui des contrôles français et européens, sans ITAR. La fiche MICA NG illustre concrètement ce qu'un missile non-ITAR rend possible : un client peut acheter sans devoir négocier avec une troisième capitale.",
      indicators: [
        {
          label: "Canal d'export",
          value:
            "Bundle plateforme Rafale ou VL MICA — contrat MBDA via État français",
          confidence: "haute",
          sources: ["mbda-mica-ng"],
        },
        {
          label: "Régime applicable",
          value:
            "Contrôles FR + Position commune UE 2008/944/PESC — hors ITAR",
          confidence: "haute",
          sources: ["eu-cp-944"],
        },
        {
          label: "Prospects naturels",
          value:
            "Tout opérateur MICA et tout client Rafale export en quête de renouvellement",
          confidence: "haute",
          sources: ["mbda-mica-ng"],
        },
      ],
    },
  ],
  variants: [
    {
      label: "MICA EM (héritage)",
      value:
        "Variante RF du MICA en service — base à renouveler par MICA NG RF",
      confidence: "haute",
      sources: ["mbda-mica-ng"],
    },
    {
      label: "MICA IR (héritage)",
      value:
        "Variante IR du MICA en service — base à renouveler par MICA NG IR",
      confidence: "haute",
      sources: ["mbda-mica-ng"],
    },
    {
      label: "MICA NG RF",
      value: "Autodirecteur RF AESA — version radar moderne",
      confidence: "haute",
      sources: ["mbda-mica-ng"],
    },
    {
      label: "MICA NG IR",
      value: "Autodirecteur IR imageur refroidi FPA — version IR moderne",
      confidence: "haute",
      sources: ["mbda-mica-ng"],
    },
    {
      label: "VL MICA",
      value:
        "Variante surface-launch du MICA — défense aérienne mobile terre et marine ; logique NG annoncée",
      confidence: "haute",
      sources: ["mbda-mica-ng"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Effecteur souverain à coût maîtrisé via réutilisation de cellule ; mutualisation air-air et sol-air via VL MICA.",
    },
    {
      key: "survivabilite",
      grade: "B",
      rationale:
        "Deux seekers interopérables, datalink, NG améliore résilience ECCM ; performances précises classifiées.",
    },
    {
      key: "exportabilite",
      grade: "A",
      rationale:
        "Hors ITAR, lié aux contrats Rafale et VL MICA — exportabilité forte vers les opérateurs MICA actuels.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Chaîne entièrement française, cadence MBDA en montée mais sous tension globale.",
    },
    {
      key: "maturite",
      grade: "C",
      rationale:
        "En fin de qualification — livraisons à partir de 2026, retour d'expérience opérationnel à constituer.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "DGA et MBDA publient les jalons clés ; détails seekers et NEZ classifiés.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un missile rendu obsolète par Meteor. La réalité : un effecteur complémentaire — Meteor pour la longue portée et la NEZ étendue, MICA NG pour la défense rapprochée multi-cible et l'emploi sol-air via VL MICA.",
    bestUseCase:
      "Doter un parc Rafale d'un AAM courte/moyenne portée souverain à double seeker, ou monter une défense aérienne mobile européenne via VL MICA — sans dépendre d'autorisations américaines.",
    weakPoint:
      "La maturité encore à construire — la première année d'emploi opérationnel sera décisive pour la confiance des opérateurs et des prospects export.",
    analystNote:
      "MICA NG est le test de cohérence de l'arsenal souverain français. Sa réussite renforce le couple Rafale + MBDA face aux offres américaines ; un retard ou une déception capacitaire pèserait sur l'image globale d'une chaîne européenne autonome. À suivre dès 2026.",
  },
  operators: ["France (livraisons 2026)"],
  theatres: ["Pas d'emploi en combat à ce jour"],
  timeline: [
    {
      date: "2018",
      label:
        "Lancement formel du programme MICA NG — DGA / MBDA.",
      kind: "jalon",
    },
    {
      date: "2024",
      label:
        "Première tranche de qualification réussie ; production engagée.",
      kind: "jalon",
    },
    {
      date: "2026",
      label:
        "Premières livraisons à l'armée de l'air et de l'espace — version RF puis IR.",
      kind: "jalon",
    },
  ],
  sources: [
    {
      id: "mbda-mica-ng",
      title: "MICA NG — page produit",
      publisher: "MBDA",
      type: "constructeur",
      reliability: "B",
      url: "https://www.mbda-systems.com/product/mica-ng/",
    },
    {
      id: "dga-mica-ng",
      title: "MICA NG — annonces DGA et calendrier de livraison",
      publisher: "Direction générale de l'armement (DGA)",
      type: "officiel",
      reliability: "A",
      url: "https://www.defense.gouv.fr/dga",
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
