import type { DefenseSystem } from "../types";

export const rat31dl: DefenseSystem = {
  slug: "rat-31dl",
  name: "RAT-31DL",
  designation: "RAT-31DL / DL-M",
  reference: "PNP-RD-011",
  category: "radar",
  radarRole: "alerte-avancee",
  classLabel:
    "Radar 3D bande L d'alerte avancée et de surveillance longue portée — capteur stratégique OTAN",
  country: "Italie",
  flag: "🇮🇹",
  manufacturer: "Leonardo (héritage Selex / Galileo Avionica)",
  introduced: "2006",
  status:
    "En service — capteur d'alerte avancée standard OTAN ; déployé dans une quinzaine de nations alliées",
  acquisitionModes: ["DCS", "cooperatif"],
  tagline:
    "Le capteur OTAN d'alerte avancée par excellence — bande L, 3D, déployé chez quinze nations alliées pour structurer la couche supérieure de NATINAMDS.",
  summary:
    "Le RAT-31DL est le radar 3D bande L d'alerte avancée conçu par Leonardo (héritage Selex / Galileo Avionica) à l'usage des forces aériennes alliées de l'OTAN. Doté d'une portée publique de l'ordre de 470 à 500 km, il assume la couche supérieure de la surveillance aérienne stratégique : détection précoce d'aéronefs et de menaces basse observabilité, intégration NATINAMDS et ACCS, posture permanente d'alerte. La variante DL-M apporte une modernisation mineure du traitement signal et de l'interface C2.\n\nLa fiche RAT-31DL est, pour Panoplie, celle du « radar OTAN standard » par défaut. Aux côtés du SMART-L et du GM400, il forme le triptyque des capteurs européens d'alerte avancée. Son adoption par une quinzaine de nations alliées en fait un point de référence pour l'interopérabilité radar dans le cadre allié.",
  keySpecs: [
    {
      label: "Architecture",
      value:
        "Radar 3D bande L — antenne rotative à diagramme empilé, traitement Doppler avancé",
      confidence: "haute",
      sources: ["leonardo-rat31dl"],
    },
    {
      label: "Portée publique",
      value: "≈ 470 à 500 km en surveillance aérienne stratégique",
      confidence: "haute",
      sources: ["leonardo-rat31dl"],
    },
    {
      label: "Modes opératoires",
      value:
        "Surveillance air longue portée, alerte avancée, intégration ACCS / NATINAMDS, IFF Mode 5",
      confidence: "haute",
      sources: ["leonardo-rat31dl"],
    },
    {
      label: "Variantes documentées",
      value: "RAT-31DL — RAT-31DL/M (modernisation, traitement signal étendu)",
      confidence: "haute",
      sources: ["leonardo-rat31dl"],
    },
    {
      label: "Mobilité",
      value:
        "Semi-fixe — déploiement en site préparé ou transportable par éléments",
      confidence: "haute",
      sources: ["leonardo-rat31dl"],
    },
    {
      label: "Intégration C2",
      value:
        "ACCS OTAN, NATINAMDS, C2 nationaux des forces aériennes alliées",
      confidence: "haute",
      sources: ["leonardo-rat31dl", "nato-iamd-radar"],
    },
    {
      label: "Technologie RF",
      value:
        "Émetteurs à état solide (SSPA) sur variantes récentes — détail GaN non précisé homogène",
      confidence: "moyenne",
      status: "a-recouper",
      sources: ["leonardo-rat31dl"],
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
        "Le coût RAT-31DL n'est pas publié de façon homogène par Leonardo. Les ordres de grandeur communément cités pour un capteur seul oscillent entre 20 et 50 M€, avec une variabilité forte selon la configuration (DL ou DL/M), le lot logistique et l'intégration C2 nationale. C'est un positionnement de prix compétitif pour un radar 3D bande L d'alerte avancée.\n\nLa lecture coût n'a de sens qu'au niveau du site complet — capteur + abri + alimentation + C2 + formation. Le MCO pluriannuel est significatif, conforme à la pratique des grands radars semi-fixes. La rentabilité du programme repose sur l'effet de base installée OTAN et l'effet d'apprentissage industriel cumulé chez Leonardo.",
      indicators: [
        {
          label: "Coût unitaire capteur — ordre de grandeur public",
          value: "≈ 20 à 50 M€ par capteur selon variante et lot",
          confidence: "moyenne",
          status: "a-recouper",
          sources: ["leonardo-rat31dl"],
        },
        {
          label: "Lecture économique",
          value:
            "Capteur + abri + C2 national + soutien — coût site complet supérieur au capteur seul",
          confidence: "moyenne",
          sources: ["leonardo-rat31dl"],
        },
        {
          label: "MCO pluriannuel",
          value:
            "Significatif — capteur semi-fixe à grande antenne, conforme aux pratiques des radars d'alerte avancée",
          confidence: "moyenne",
          sources: ["leonardo-rat31dl"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le RAT-31DL est financé par les budgets de défense nationaux des États clients, avec contribution OTAN partielle sur certains segments d'alerte avancée. Leonardo en a fait l'un de ses produits-phares radar terrestre, en héritage direct des compétences historiques de Selex / Galileo Avionica en radar aérien.\n\nLa base installée d'environ une quinzaine de nations OTAN ou partenaires fournit une rentabilité solide au programme, avec un effet d'apprentissage industriel marqué. Les contrats post-2022 confirment une accélération de la demande, notamment sur le flanc Est de l'OTAN.",
      indicators: [
        {
          label: "Financeurs principaux",
          value:
            "Budgets nationaux clients OTAN + cofinancement OTAN sur certains segments",
          confidence: "haute",
          sources: ["leonardo-rat31dl"],
        },
        {
          label: "Base installée",
          value: "≈ 15 nations alliées documentées — base solide pour l'effet d'apprentissage",
          confidence: "haute",
          sources: ["leonardo-rat31dl", "press-rat31dl-export"],
        },
        {
          label: "Effet post-2022",
          value:
            "Accélération de la demande sur le flanc Est OTAN — contrats récents documentés",
          confidence: "moyenne",
          sources: ["press-rat31dl-export"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne RAT-31DL est largement italienne, intégrée par Leonardo sur ses sites de Rome et de Florence (héritage Selex). Les composants RF, les émetteurs SSPA, les calculateurs DSP et le logiciel sont produits sous contrôle Leonardo. C'est un actif industriel important pour la souveraineté radar terrestre européenne.\n\nLe risque industriel principal est partagé avec les autres radars Leonardo (ECRS, radars navals) : pression sur les semiconducteurs RF européens et cadence de production face à la demande OTAN post-2022. La base de compétences en bande L navalisable ou terrestre longue portée est rare en Europe — Leonardo, Thales Nederland et Hensoldt en partagent l'essentiel.",
      indicators: [
        {
          label: "Empreinte industrielle",
          value:
            "Leonardo Italie (Rome, Florence — héritage Selex / Galileo Avionica) — chaîne européenne",
          confidence: "haute",
          sources: ["leonardo-rat31dl"],
        },
        {
          label: "Technologie RF",
          value:
            "Émetteurs à état solide (SSPA) ; transition GaN progressive selon variante — détail non publié homogène",
          confidence: "moyenne",
          status: "a-recouper",
          sources: ["leonardo-rat31dl"],
        },
        {
          label: "Risque industriel principal",
          value:
            "Pression sur les semiconducteurs RF européens ; cadence face à la demande OTAN post-2022",
          confidence: "moyenne",
          sources: ["leonardo-rat31dl"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Le RAT-31DL est un produit de souveraineté radar italien et un outil structurant de l'interopérabilité OTAN. Sa diffusion large dans l'OTAN — Italie, Allemagne, Pologne, République tchèque, Hongrie, Bulgarie, Roumanie, Slovaquie, Turquie, Espagne, Grèce, Royaume-Uni (partiel), Pakistan — en fait l'un des piliers de la couche d'alerte avancée alliée.\n\nL'absence d'ITAR sur la couche capteur permet aux nations OTAN d'avoir une alerte avancée non dépendante des États-Unis sur le radar lui-même, tout en restant pleinement intégrées dans NATINAMDS et ACCS. Pour Panoplie, RAT-31DL documente concrètement la viabilité d'une chaîne radar d'alerte avancée européenne, à la fois souveraine et alliée.",
      indicators: [
        {
          label: "Position dans l'OTAN",
          value:
            "Capteur d'alerte avancée standard — base installée largement OTAN, interopérabilité éprouvée",
          confidence: "haute",
          sources: ["leonardo-rat31dl", "nato-iamd-radar"],
        },
        {
          label: "Souveraineté capteur",
          value:
            "Hors ITAR — chaîne européenne, contrôle baseline logicielle",
          confidence: "haute",
          sources: ["leonardo-rat31dl"],
        },
        {
          label: "Effet d'écosystème",
          value:
            "Pilier de la couche d'alerte avancée européenne souveraine, complémentaire de SMART-L et GM400",
          confidence: "moyenne",
          sources: ["leonardo-rat31dl"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "Le RAT-31DL est l'un des radars d'alerte avancée les plus exportés au monde. Les clients documentés couvrent une quinzaine de nations OTAN ou partenaires, principalement européennes mais aussi hors Europe (Turquie, Pakistan). Le canal dominant est DCS via Leonardo, sous licence UAMA italienne.\n\nLe régime applicable cumule Position commune UE 2008/944/PESC, contrôle UAMA italien, et Wassenaar sur les composants RF avancés. L'exportabilité est l'une des plus élevées du segment radar d'alerte avancée — l'absence d'ITAR et la maturité du produit en font un choix privilégié pour les nations OTAN et alliées.",
      indicators: [
        {
          label: "Canal d'export dominant",
          value: "DCS via Leonardo — licence UAMA italienne",
          confidence: "haute",
          sources: ["leonardo-rat31dl"],
        },
        {
          label: "Nombre d'utilisateurs documentés",
          value: "≈ 15 nations alliées OTAN ou partenaires",
          confidence: "haute",
          sources: ["press-rat31dl-export"],
        },
        {
          label: "Régime applicable",
          value:
            "Position commune UE + UAMA italien + Wassenaar composants RF",
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
        "Coût unitaire modéré pour un radar 3D bande L d'alerte avancée ; effet de base installée OTAN solide.",
    },
    {
      key: "survivabilite",
      grade: "C",
      rationale:
        "Capteur semi-fixe à grande antenne, signature électromagnétique forte ; vulnérabilité physique sur site connu.",
    },
    {
      key: "exportabilite",
      grade: "A",
      rationale:
        "Largement exporté, hors ITAR, intégrations OTAN multiples — un des meilleurs profils export du segment alerte avancée.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Chaîne Leonardo maîtrisée, mais pression composants RF et cadence européenne post-2022.",
    },
    {
      key: "maturite",
      grade: "A",
      rationale:
        "En service depuis 2006, déployé chez 15 nations alliées, intégration ACCS éprouvée — produit pleinement mature.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "Sources Leonardo et OTAN abondantes sur le rôle et l'architecture, mais paramètres techniques fins classifiés.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un radar « 500 km partout, tout le temps ». La réalité : un excellent radar bande L 3D dont la portée nominale dépend du profil de la cible, et dont la valeur opérationnelle est conditionnée par l'intégration ACCS et la posture d'alerte permanente des forces alliées.",
    bestUseCase:
      "Doter une nation OTAN d'un capteur d'alerte avancée standard, intégrable dans ACCS et NATINAMDS sans dépendance ITAR, mature et industriellement éprouvé.",
    weakPoint:
      "Capteur semi-fixe lourd, peu adapté au redéploiement rapide. Vulnérabilité physique sur site connu. Et l'opacité sur la modernisation des émetteurs à grande puissance (transition vers GaN).",
    analystNote:
      "RAT-31DL est, dans le catalogue Panoplie, l'archétype du capteur OTAN standard. Pour les analystes, il documente concrètement deux réalités : la maturité industrielle européenne sur le radar bande L d'alerte avancée, et la viabilité d'une chaîne radar souveraine sans rupture avec les États-Unis.",
  },
  operators: [
    "Italie (Aeronautica Militare)",
    "Allemagne (Luftwaffe — partiel)",
    "Pologne",
    "République tchèque",
    "Hongrie",
    "Bulgarie",
    "Roumanie",
    "Slovaquie",
    "Turquie",
    "Espagne (Ejército del Aire)",
    "Grèce",
    "Royaume-Uni (programme partiel)",
    "Pakistan",
    "Autres nations OTAN ou partenaires — détail variable",
  ],
  theatres: [
    "Défense aérienne intégrée OTAN — couverture continentale européenne",
    "Posture permanente d'alerte — flanc Est et flanc Sud",
    "Couverture nationale — Italie, Espagne, Grèce, Turquie",
  ],
  timeline: [
    {
      date: "2006",
      label:
        "Entrée en service initiale — premier client Selex / Galileo Avionica.",
      kind: "jalon",
    },
    {
      date: "2012",
      label:
        "Adoption massive par les nations OTAN — flanc Est et continental.",
      kind: "export",
    },
    {
      date: "2018",
      label:
        "Lancement de la variante RAT-31DL/M — modernisation traitement signal et C2.",
      kind: "jalon",
    },
    {
      date: "2022",
      label:
        "Accélération des commandes post-invasion russe — renforcement du flanc Est OTAN.",
      kind: "export",
    },
    {
      date: "2024",
      label:
        "Confirmation de la transition technologique vers les émetteurs RF avancés — communications Leonardo.",
      kind: "jalon",
    },
  ],
  sources: [
    {
      id: "leonardo-rat31dl",
      title: "RAT-31DL / DL-M — page Leonardo",
      publisher: "Leonardo",
      type: "constructeur",
      reliability: "B",
      url: "https://www.leonardo.com/en/products/rat-31dl",
    },
    {
      id: "nato-iamd-radar",
      title:
        "NATINAMDS et capteurs alliés d'alerte avancée — communications OTAN",
      publisher: "OTAN",
      type: "officiel",
      reliability: "A",
      url: "https://www.nato.int/cps/en/natohq/topics_8206.htm",
    },
    {
      id: "press-rat31dl-export",
      title:
        "Contrats RAT-31DL post-2022 — dépêches Leonardo et presse spécialisée",
      publisher: "Leonardo / presse spécialisée",
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
