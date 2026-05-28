import type { DefenseSystem } from "../types";

export const gm400Alpha: DefenseSystem = {
  slug: "gm400-alpha",
  name: "Ground Master 400α",
  designation: "GM400α",
  reference: "PNP-RD-002",
  category: "radar",
  radarRole: "alerte-avancee",
  classLabel: "Radar AESA d'alerte avancée et de surveillance longue portée bande S",
  country: "France",
  flag: "🇫🇷",
  manufacturer: "Thales",
  introduced: "2019 (variante α)",
  status:
    "En service — modernisation Alpha déployée chez plusieurs nations OTAN, plus de cent capteurs GM400 toutes variantes vendus",
  acquisitionModes: ["DCS", "production-nationale", "cooperatif"],
  tagline:
    "Le radar européen de veille longue portée — surveillance aérienne, suivi de menaces basse observabilité, intégration NATINAMDS et défense antimissile balistique partielle.",
  summary:
    "Le Ground Master 400α est la version modernisée du GM400, radar AESA bande S de surveillance longue portée et d'alerte avancée conçu par Thales. La variante α apporte une nouvelle baseline logicielle, une intégration C2 OTAN renforcée et des modes étendus de suivi de menaces balistiques de théâtre.\n\nLe GM400 est, avec le SMART-L MM néerlandais et le RAT-31DL italien, l'un des trois radars européens de référence pour la couche d'alerte avancée. Sa diffusion dans l'OTAN — France, Allemagne, Estonie, Slovénie, Finlande, Royaume-Uni, plus exports hors Europe — en fait un point d'appui industriel et politique de premier plan pour la défense aérienne intégrée européenne.",
  keySpecs: [
    {
      label: "Architecture",
      value: "AESA bande S, antenne plane rotative, composants GaN sur variante α",
      confidence: "haute",
      sources: ["thales-gm400"],
    },
    {
      label: "Portée instrumentée publique",
      value: "≈ 470 à 515 km selon variante",
      confidence: "moyenne",
      sources: ["thales-gm400", "ap-gm400-news"],
    },
    {
      label: "Couverture",
      value: "Surveillance 360° par rotation ; couverture haute altitude étendue",
      confidence: "haute",
      sources: ["thales-gm400"],
    },
    {
      label: "Capacités BMD",
      value:
        "Détection et suivi de menaces balistiques de théâtre — capacité limitée par construction sur GM400, étendue sur variante α",
      confidence: "moyenne",
      status: "a-recouper",
      sources: ["thales-gm400"],
    },
    {
      label: "Mobilité",
      value:
        "Transportable sur véhicule lourd ou semi-fixe ; déploiement publié en quelques heures",
      confidence: "haute",
      sources: ["thales-gm400"],
    },
    {
      label: "Intégration C2",
      value: "NATINAMDS, ACCS OTAN, C2 nationaux",
      confidence: "haute",
      sources: ["thales-gm400"],
    },
    {
      label: "Nombre exact de TRM, formes d'onde, ECCM",
      value: "Non précisé publiquement",
      confidence: "faible",
      status: "variable",
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le coût unitaire du GM400 et de sa variante α est partiellement public à travers les contrats export et certains documents budgétaires de défense européens. L'ordre de grandeur communément cité pour un capteur seul tourne autour de 30 M€, avec des contrats batterie complète atteignant 50-70 M€ selon intégration, soutien initial et lot de rechanges.\n\nComme pour le GM200, la lecture coût n'a de sens qu'au niveau du système complet — capteur + véhicules + C2 + formation + lot logistique initial. Le MCO pluriannuel, peu documenté publiquement, représente probablement la moitié du coût total sur 25-30 ans.",
      indicators: [
        {
          label: "Coût unitaire capteur — ordre de grandeur public",
          value: "≈ 30 M€ par capteur (contrats export documentés)",
          confidence: "moyenne",
          note: "Variabilité selon variante et lot logistique inclus.",
          sources: ["thales-gm400", "ap-gm400-news"],
        },
        {
          label: "Coût système complet",
          value: "≈ 50 à 70 M€ batterie intégrée — non homogène",
          confidence: "faible",
          status: "variable",
          sources: ["thales-gm400"],
        },
        {
          label: "MCO pluriannuel",
          value: "Non publié homogène — estimation analyste ≈ 50 % du coût total sur 25-30 ans",
          confidence: "faible",
          status: "variable",
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le GM400α est financé par les budgets de défense nationaux des États clients, avec quelques cas de cofinancement OTAN sur les segments d'alerte avancée. Thales en a fait un produit phare et structurant de son catalogue radar, avec une montée en cadence post-2022 documentée dans plusieurs annonces.\n\nLa transparence financière reste limitée par rapport aux grands programmes US ; les contrats sont publiés au cas par cas, sans justification annuelle uniforme. Le programme bénéficie de l'effet d'apprentissage commun à la famille Ground Master.",
      indicators: [
        {
          label: "Modèle de financement",
          value: "Budgets nationaux ; cofinancement OTAN partiel pour alerte avancée",
          confidence: "moyenne",
          sources: ["thales-gm400"],
        },
        {
          label: "Capteurs livrés toutes variantes",
          value: "> 100 capteurs GM400 vendus à plus de 15 nations",
          confidence: "moyenne",
          sources: ["thales-gm400"],
        },
        {
          label: "Effet d'apprentissage",
          value:
            "Mutualisation industrielle famille GM (GM200 / GM400) — bénéfice de cadence partagé",
          confidence: "moyenne",
          sources: ["thales-gm400"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne GM400α est largement européenne, similaire à celle du GM200 mais avec une part plus importante de packaging RF haute puissance, propre aux radars longue portée. Thales France assure la plupart de l'intégration, avec contributions sites Pays-Bas et Royaume-Uni selon variantes.\n\nLa montée en GaN sur la variante α renforce les performances mais accroît la dépendance aux fonderies européennes spécialisées. Le risque industriel principal n'est pas un fournisseur étranger critique, mais la capacité à tenir la cadence face à la demande européenne post-2022 et la pression globale sur la microélectronique RF haute puissance.",
      indicators: [
        {
          label: "Empreinte industrielle",
          value:
            "Thales France principalement — sites Pays-Bas / Royaume-Uni selon variantes",
          confidence: "haute",
          sources: ["thales-gm400"],
        },
        {
          label: "Technologie RF",
          value: "Modules T/R GaN sur variante α — accroissement de la dépendance fonderie",
          confidence: "moyenne",
          sources: ["thales-gm400"],
        },
        {
          label: "Risque industriel principal",
          value:
            "Cadence face à la demande européenne ; accès semiconducteurs RF haute puissance",
          confidence: "moyenne",
          sources: ["thales-gm400"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Le GM400α est l'un des radars d'alerte avancée structurants de la défense aérienne européenne. Le choisir, c'est s'inscrire dans NATINAMDS et contribuer à une chaîne capteur européenne souveraine, en alternative ou en complément aux capteurs américains. La France en a fait un pilier de sa contribution à la défense aérienne OTAN, notamment sur le flanc Est.\n\nL'absence d'ITAR sur la couche capteur est un argument fort pour les nations cherchant à garder le contrôle de leur image aérienne nationale. La compatibilité avec les C2 OTAN reste totale, ce qui évite tout effet d'isolement industriel.",
      indicators: [
        {
          label: "Position dans l'OTAN",
          value:
            "Capteur d'alerte avancée majeur — flanc Est, défense aérienne européenne",
          confidence: "haute",
          sources: ["thales-gm400"],
        },
        {
          label: "Souveraineté capteur",
          value:
            "Hors ITAR sur le radar — composants RF européens, contrôle baseline logicielle",
          confidence: "haute",
          sources: ["thales-gm400"],
        },
        {
          label: "Effet d'écosystème",
          value:
            "Pilier de la chaîne radar européenne souveraine, alternative crédible aux capteurs US",
          confidence: "moyenne",
          sources: ["thales-gm400"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "Le GM400 est l'un des radars longue portée européens les plus exportés. Plus de cent capteurs vendus à au moins quinze nations selon Thales, sur trois continents. Le canal dominant est la vente commerciale directe sous licence DGA, parfois assortie de partenariats industriels locaux.\n\nLe régime applicable cumule Position commune UE 2008/944/PESC, contrôle DGA et Wassenaar sur les composants RF avancés. L'exportabilité reste élevée, l'absence d'ITAR constituant un avantage concurrentiel notable face aux radars longue portée américains.",
      indicators: [
        {
          label: "Canal d'export dominant",
          value: "DCS sous licence DGA — partenariats industriels locaux selon cas",
          confidence: "haute",
          sources: ["thales-gm400"],
        },
        {
          label: "Nombre d'utilisateurs publics",
          value: "> 15 nations documentées (Thales)",
          confidence: "moyenne",
          sources: ["thales-gm400"],
        },
        {
          label: "Régime applicable",
          value:
            "Position commune UE 2008/944/PESC + DGA + Wassenaar composants RF",
          confidence: "haute",
          sources: ["wassenaar-list"],
        },
      ],
    },
  ],
  integrationFrameworks: ["NATINAMDS", "ACCS OTAN", "C2 nationaux multiples"],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Coût élevé en valeur absolue mais compétitif pour le segment alerte avancée ; rendement industriel mutualisé avec la famille GM.",
    },
    {
      key: "survivabilite",
      grade: "B",
      rationale:
        "Mobilité moyenne — capteur lourd, peu adapté au redéploiement rapide ; agilité de faisceau AESA et ECCM intégrés sur variante α.",
    },
    {
      key: "exportabilite",
      grade: "A",
      rationale:
        "Largement exporté, hors ITAR ; un des deux ou trois radars d'alerte avancée européens crédibles à l'export.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Chaîne maîtrisée par Thales ; pression sur semiconducteurs RF haute puissance et cadence européenne post-Ukraine.",
    },
    {
      key: "maturite",
      grade: "A",
      rationale:
        "Plus de quinze ans de service sur le GM400 historique, variante α déployée depuis 2019, base installée de plus de 100 capteurs.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "Sources constructeur abondantes, contrats export documentés, mais paramètres techniques fins non publiés.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un radar à 500 km qui « voit la Russie ». La réalité : un capteur d'alerte avancée solide dont la portée nominale dépend du profil de la cible et qui n'a de valeur opérationnelle qu'intégré dans NATINAMDS.",
    bestUseCase:
      "Équiper une nation OTAN ou partenaire d'un capteur d'alerte avancée souverain hors ITAR, capable de contribuer à NATINAMDS et de tenir une image aérienne nationale autonome.",
    weakPoint:
      "La mobilité limitée du capteur lourd, la dépendance industrielle aux semiconducteurs RF haute puissance européens, et l'opacité sur les performances réelles en environnement de brouillage sévère.",
    analystNote:
      "Le GM400α est un test grandeur nature pour la souveraineté radar européenne : il prouve qu'une alternative crédible aux capteurs US d'alerte avancée existe, à condition que Thales tienne sa cadence et que les fonderies européennes RF tiennent la leur. Sa diffusion post-2022 sera un indicateur clé pour Panoplie dans les années à venir.",
  },
  operators: [
    "France",
    "Allemagne",
    "Estonie",
    "Slovénie",
    "Finlande",
    "Royaume-Uni",
    "Malaisie",
    "Singapour",
    "Émirats arabes unis",
    "Kazakhstan",
  ],
  theatres: [
    "Défense aérienne intégrée OTAN — flanc Est",
    "Surveillance haute altitude nationale — France et États clients",
    "Couverture d'alerte avancée post-2022 — renforcement Europe orientale",
  ],
  timeline: [
    {
      date: "2008",
      label: "Lancement du GM400 — première variante en service.",
      kind: "jalon",
    },
    {
      date: "2014",
      label: "Adoption par la France et plusieurs nations OTAN.",
      kind: "export",
    },
    {
      date: "2019",
      label:
        "Lancement de la variante α — modernisation GaN, baseline logicielle étendue.",
      kind: "jalon",
    },
    {
      date: "2022",
      label:
        "Accélération des commandes post-invasion russe — renforcement du flanc Est.",
      kind: "export",
    },
    {
      date: "2025",
      label:
        "Plus de 100 capteurs GM400 toutes variantes vendus selon communications Thales.",
      kind: "jalon",
    },
  ],
  sources: [
    {
      id: "thales-gm400",
      title: "Ground Master 400 — page produit Thales",
      publisher: "Thales",
      type: "constructeur",
      reliability: "B",
      url: "https://www.thalesgroup.com/en/markets/defence-and-security/radars",
    },
    {
      id: "ap-gm400-news",
      title:
        "Commandes Thales Ground Master 400 post-2022 — dépêches et communiqués",
      publisher: "Agences de presse / Thales",
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
    {
      id: "nato-iamd",
      title: "NATO Integrated Air and Missile Defence",
      publisher: "OTAN",
      type: "officiel",
      reliability: "A",
      url: "https://www.nato.int/cps/en/natohq/topics_8206.htm",
    },
  ],
  updated: "2026-05-27",
};
