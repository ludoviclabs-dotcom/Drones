import type { DefenseSystem } from "../types";

export const irisTSlm: DefenseSystem = {
  slug: "iris-t-slm",
  name: "IRIS-T SLM",
  designation: "IRIS-T Surface-Launched Medium-range",
  reference: "PNP-MSL-014",
  category: "missile",
  missileRole: "SAM",
  classLabel: "Système surface-air SHORAD/MRAD — défense aérienne 360°",
  country: "Allemagne",
  flag: "🇩🇪",
  manufacturer: "Diehl Defence",
  introduced: "2022",
  status:
    "En service — Allemagne, Ukraine, Danemark, Slovénie, etc. ; combat proven en Ukraine",
  acquisitionModes: ["cooperatif", "DCS"],
  tagline:
    "L'effecteur sol-air allemand devenu standard d'urgence européen — combat proven en Ukraine, livré en série post-2022.",
  summary:
    "IRIS-T SLM est le système surface-air moyenne portée développé par Diehl Defence, dérivé du missile air-air IRIS-T (Sidewinder européen). Sa caractéristique tient à l'architecture : autodirecteur IR à imagerie, thrust-vector control pour l'agilité terminale, et capacité 360° d'engagement par un radar AESA léger.\n\nLe système est sorti de l'anonymat avec la guerre en Ukraine : livré dès l'automne 2022, il a fait la démonstration publique de sa capacité contre drones, missiles de croisière et menaces aériennes diverses. La cadence Diehl a été multipliée, et la sélection par la Danemark, la Slovénie, l'Égypte (en discussion) et plusieurs autres prospects fait d'IRIS-T SLM l'un des programmes sol-air européens les plus dynamiques du moment.",
  keySpecs: [
    {
      label: "Guidage terminal",
      value:
        "Autodirecteur IR à imagerie focale (FPA) + thrust-vector control",
      confidence: "haute",
      sources: ["diehl-iris-t"],
    },
    {
      label: "Capacité 360°",
      value:
        "Lancement vertical + radar AESA en rotation — engagement omnidirectionnel",
      confidence: "haute",
      sources: ["diehl-iris-t"],
    },
    {
      label: "Portée publique",
      value: "Jusqu'à 40 km en SLM ; 25 km en altitude pratique",
      confidence: "haute",
      sources: ["diehl-iris-t"],
    },
    {
      label: "Cibles primaires",
      value: "Aéronefs, hélicoptères, drones, missiles de croisière",
      confidence: "haute",
      sources: ["diehl-iris-t"],
    },
    {
      label: "Système hôte",
      value:
        "Batterie IRIS-T SLM — TLVS / Bundeswehr et configurations export équivalentes",
      confidence: "haute",
      sources: ["diehl-iris-t", "bundeswehr-iris-t"],
    },
    {
      label: "Charge militaire",
      value:
        "Charge fragmentation HE avec fusée de proximité",
      confidence: "moyenne",
      sources: ["diehl-iris-t"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Diehl ne publie pas les coûts unitaires IRIS-T SLM. Les contrats récents — notamment Allemagne pour la Bundeswehr et donation/livraison Ukraine — donnent des ordres de grandeur par batterie : plusieurs centaines de millions d'euros pour une batterie complète (radar, ECS, lanceurs, premier lot de missiles).\n\nLa logique économique est celle d'un système intégré : le coût se lit par batterie déployée, pas missile à missile. Comparativement, c'est moins cher qu'un Patriot complet, plus cher qu'un système purement courte portée. Le ratio coût-efficacité est devenu un argument central avec le retour d'expérience ukrainien.",
      indicators: [
        {
          label: "Coût publié",
          value:
            "Par batterie complète — ordre de plusieurs centaines de millions d'euros",
          confidence: "moyenne",
          status: "variable",
          sources: ["bundeswehr-iris-t"],
        },
        {
          label: "Type de coût exploitable",
          value:
            "Système complet — pas missile à missile",
          confidence: "haute",
          sources: ["bundeswehr-iris-t"],
        },
        {
          label: "Lecture économique",
          value:
            "Intermédiaire entre Patriot et SHORAD pur — bon ratio capacité/coût",
          confidence: "moyenne",
          sources: ["diehl-iris-t"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le programme IRIS-T SLM a connu une accélération financière sans précédent depuis 2022. La Bundeswehr a notifié plusieurs commandes successives, l'Allemagne a financé les premières livraisons à l'Ukraine, et plusieurs partenaires européens ont sécurisé leur commande dans la foulée.\n\nDiehl a engagé une montée en cadence majeure, avec investissements de capacité dans ses sites allemands. Le programme est devenu l'un des emblèmes de la réponse industrielle européenne à la demande défense aérienne post-Ukraine.",
      indicators: [
        {
          label: "Maître d'œuvre",
          value: "Diehl Defence — Allemagne",
          confidence: "haute",
          sources: ["diehl-iris-t"],
        },
        {
          label: "Dynamique post-Ukraine",
          value:
            "Plusieurs commandes Bundeswehr + financement donations Ukraine + nouveaux contrats export",
          confidence: "haute",
          sources: ["bundeswehr-iris-t"],
        },
        {
          label: "Effort industriel",
          value:
            "Montée en cadence Diehl confirmée — investissements de capacité",
          confidence: "haute",
          sources: ["diehl-iris-t"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne IRIS-T SLM est allemande de cœur, avec un réseau de sous-traitants européens. Les nœuds critiques : autodirecteur IR imageur (Diehl), structure et propulsion, radar AESA léger (souvent Hensoldt), électronique de mission. Aucun composant critique n'est ITAR.\n\nLe risque industriel principal est la cadence — comme pour MBDA, Diehl absorbe une demande qui excède la capacité historique. L'extension du parc européen et les prospects export en discussion (Égypte, Lettonie, Estonie, etc.) maintiennent la pression.",
      indicators: [
        {
          label: "Maître d'œuvre",
          value: "Diehl Defence",
          confidence: "haute",
          sources: ["diehl-iris-t"],
        },
        {
          label: "Composants critiques",
          value:
            "Autodirecteur IR imageur, propulsion, radar AESA (Hensoldt), ECS",
          confidence: "haute",
          sources: ["diehl-iris-t"],
        },
        {
          label: "Risque industriel principal",
          value:
            "Cadence — demande européenne post-Ukraine excédant la capacité historique",
          confidence: "haute",
          sources: ["bundeswehr-iris-t"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "IRIS-T SLM est l'instrument de la Zeitenwende allemande dans le segment défense aérienne. Le système est devenu le pilier de la European Sky Shield Initiative (ESSI) annoncée par Berlin en 2022 — un cadre multinational visant à coordonner l'acquisition de défense aérienne entre nations européennes.\n\nLa fiche illustre concrètement la mutation : un système allemand non-ITAR, combat proven en Ukraine, sélectionné par des nations qui auparavant auraient acheté Patriot ou NASAMS. C'est un changement géopolitique structurel du marché européen — Allemagne devient un fournisseur de défense aérienne, pas seulement un client.",
      indicators: [
        {
          label: "Fonction stratégique",
          value:
            "Pilier ESSI — défense aérienne européenne coordonnée",
          confidence: "haute",
          sources: ["bundeswehr-iris-t"],
        },
        {
          label: "Régime applicable",
          value:
            "Contrôle allemand + Position commune UE — hors ITAR",
          confidence: "haute",
          sources: ["eu-cp-944"],
        },
        {
          label: "Effet géopolitique",
          value:
            "Allemagne devient exportateur de défense aérienne — mutation structurelle",
          confidence: "haute",
          sources: ["bundeswehr-iris-t"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "L'export IRIS-T SLM est en forte croissance : Ukraine (livraisons via donation puis production sponsorisée par Berlin), Égypte (premier client export 2014 d'IRIS-T air-air, en discussion SLM), Estonie, Lettonie, Slovénie, Danemark, Bulgarie ont sélectionné ou évaluent le système. C'est l'un des deux ou trois meilleurs cas d'export sol-air européen actuels.\n\nLes contrôles allemands appliquent ; la Position commune UE structure les critères de transfert. La fiche IRIS-T SLM cumule les avantages : non-ITAR, combat proven, prix maîtrisé par batterie, intégration européenne ESSI.",
      indicators: [
        {
          label: "Canal d'export dominant",
          value:
            "DCS / contrats nationaux + dynamique ESSI multinationale",
          confidence: "haute",
          sources: ["diehl-iris-t"],
        },
        {
          label: "Régime applicable",
          value:
            "Contrôle allemand + Position commune UE — hors ITAR",
          confidence: "haute",
          sources: ["eu-cp-944"],
        },
        {
          label: "Utilisateurs export confirmés",
          value:
            "Allemagne, Ukraine, Danemark, Slovénie, Estonie ; Bulgarie, Lettonie en sélection",
          confidence: "haute",
          sources: ["bundeswehr-iris-t"],
        },
      ],
    },
  ],
  variants: [
    {
      label: "IRIS-T (air-air)",
      value:
        "Missile air-air courte portée — base de la famille (équivalent classe AIM-9X)",
      confidence: "haute",
      sources: ["diehl-iris-t"],
    },
    {
      label: "IRIS-T SLS",
      value:
        "Surface-Launched Short-range — version courte portée du système",
      confidence: "haute",
      sources: ["diehl-iris-t"],
    },
    {
      label: "IRIS-T SLM",
      value:
        "Surface-Launched Medium-range — la version qui a fait la réputation du programme post-2022",
      confidence: "haute",
      sources: ["diehl-iris-t"],
    },
    {
      label: "IRIS-T SLX (futur)",
      value:
        "Extended Long-range annoncé — portée étendue, capacité ATBM limitée",
      confidence: "moyenne",
      sources: ["diehl-iris-t"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Bon ratio capacité/coût pour le segment ; intermédiaire entre SHORAD et longue portée.",
    },
    {
      key: "survivabilite",
      grade: "B",
      rationale:
        "Autodirecteur IR + TVC + capacité 360° — éprouvé en combat en Ukraine, contre-mesures avancées en évolution.",
    },
    {
      key: "exportabilite",
      grade: "A",
      rationale:
        "Hors ITAR, exporté largement, dynamique ESSI — l'un des meilleurs cas export sol-air européens actuels.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Chaîne Diehl en montée en cadence — capacité historique débordée par la demande.",
    },
    {
      key: "maturite",
      grade: "A",
      rationale:
        "En service depuis 2022, combat proven en Ukraine — l'un des effecteurs européens les plus éprouvés récemment.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "Diehl et Bundeswehr publient les jalons ; détails seekers et performances précises classifiés.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un Sidewinder allemand tiré du sol. La réalité : un système complet — radar AESA, ECS, lanceur 360°, autodirecteur IR moderne — qui a démontré sa pertinence opérationnelle en Ukraine et a recomposé le marché européen du sol-air moyen courrier.",
    bestUseCase:
      "Doter une nation européenne d'un sol-air moyen courrier non-ITAR avec engagement 360° et coût maîtrisé — l'option naturelle pour les pays qui rejoignent ESSI.",
    weakPoint:
      "La portée publique reste limitée à 40 km — IRIS-T SLM est complémentaire d'un Patriot ou d'un Aster, pas un remplaçant pour la couche supérieure.",
    analystNote:
      "IRIS-T SLM est l'illustration la plus nette de la mutation industrielle européenne post-2022. Diehl est passé de fournisseur de niche à pilier de la défense aérienne du continent en deux ans. À suivre : l'avancée IRIS-T SLX et l'expansion ESSI — ils diront jusqu'où l'autonomie européenne tient la promesse.",
  },
  operators: [
    "Allemagne",
    "Ukraine",
    "Danemark",
    "Slovénie",
    "Estonie",
    "Bulgarie (sélection)",
    "Lettonie (en discussion)",
  ],
  theatres: [
    "Ukraine — depuis octobre 2022, défense aérienne urbaine et critique, multiples interceptions documentées",
  ],
  timeline: [
    {
      date: "2014",
      label:
        "Mise en service IRIS-T air-air — base de la famille (Eurofighter, Tornado, Gripen).",
      kind: "jalon",
    },
    {
      date: "2022",
      label:
        "Mise en service initiale IRIS-T SLM — Allemagne et premières livraisons à l'Ukraine.",
      kind: "jalon",
    },
    {
      date: "2023",
      label:
        "Multiplication des contrats européens — Danemark, Slovénie, Estonie.",
      kind: "export",
    },
    {
      date: "2024",
      label:
        "Diehl annonce une nouvelle vague d'extension de capacité industrielle.",
      kind: "jalon",
    },
  ],
  sources: [
    {
      id: "diehl-iris-t",
      title: "Famille IRIS-T — pages produit Diehl Defence",
      publisher: "Diehl Defence",
      type: "constructeur",
      reliability: "B",
      url: "https://www.diehl.com/defence/en/products-and-services/air-defence/",
    },
    {
      id: "bundeswehr-iris-t",
      title:
        "IRIS-T SLM — déploiement Bundeswehr et soutien à l'Ukraine",
      publisher: "Bundeswehr / BMVg",
      type: "officiel",
      reliability: "A",
      url: "https://www.bundeswehr.de/",
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
