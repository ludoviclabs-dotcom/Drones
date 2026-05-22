import type { DefenseSystem } from "../types";

export const rafale: DefenseSystem = {
  slug: "rafale",
  name: "Rafale",
  designation: "Rafale C / B / M",
  reference: "PNP-AC-001",
  category: "combat-aircraft",
  combatAircraftClass: "gen-4-5",
  classLabel: "Chasseur omnirôle",
  country: "France",
  flag: "🇫🇷",
  manufacturer: "Dassault Aviation",
  introduced: "2004",
  status: "En service — production active, carnet de commandes record",
  naval:
    "Oui — Rafale M, appontage CATOBAR sur le porte-avions Charles-de-Gaulle ; seul chasseur de combat naval européen en service.",
  acquisitionModes: ["production-nationale"],
  tagline:
    "Le chasseur omnirôle français — souveraineté industrielle complète et export en plein essor, sans furtivité native.",
  summary:
    "Le Rafale est le chasseur omnirôle de Dassault Aviation : un avion conçu pour assurer, sur une seule cellule, la supériorité aérienne, la frappe au sol, la reconnaissance, l'attaque antinavire et la dissuasion nucléaire aéroportée. C'est un appareil de génération 4.5 — cellule non furtive, mais capteurs, guerre électronique et architecture logicielle de tout premier rang.\n\nSa singularité tient autant à l'industrie qu'à l'avion : cellule Dassault, radar et guerre électronique Thales, moteur Safran — une chaîne entièrement française, sans composant soumis au régime américain ITAR. Longtemps boudé à l'export, le Rafale connaît depuis 2015 un succès commercial qui en fait, fin 2025, un carnet de commandes record. Le comprendre, c'est lire ce qu'un pays achète quand il choisit l'autonomie plutôt que l'écosystème américain.",
  keySpecs: [
    {
      label: "Équipage",
      value: "1 (Rafale C / M) ou 2 (Rafale B)",
      confidence: "haute",
      sources: ["dassault"],
    },
    {
      label: "Motorisation",
      value: "2 × Safran M88 — turboréacteurs français",
      confidence: "haute",
      sources: ["dassault"],
    },
    {
      label: "Capteur principal",
      value: "Radar AESA Thales RBE2",
      confidence: "haute",
      sources: ["dassault"],
    },
    {
      label: "Guerre électronique",
      value: "Système SPECTRA — autoprotection intégrée",
      confidence: "haute",
      note: "Pierre angulaire de la survivabilité, à défaut de furtivité native.",
      sources: ["dassault"],
    },
    {
      label: "Standard en service",
      value: "F3R ; F4 en cours de déploiement",
      confidence: "haute",
      sources: ["min-armees"],
    },
    {
      label: "Rôle nucléaire",
      value: "Vecteur du missile ASMPA — composante aéroportée de dissuasion",
      confidence: "haute",
      sources: ["min-armees"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le coût d'un Rafale ne se réduit pas à un prix unitaire. La cellule seule, le coût d'acquisition complet — moteur, capteurs, armement —, le coût de programme amorti et le maintien en condition opérationnelle sont quatre lectures distinctes.\n\nLe Rafale est plus cher à l'achat qu'un chasseur léger, moins qu'un appareil furtif de 5e génération. Son atout économique tient au MCO et à la souveraineté : pas de dépendance à une chaîne logistique étrangère, donc pas de coût politique caché.",
      indicators: [
        {
          label: "Coût d'acquisition unitaire",
          value: "De l'ordre de 80–120 M€ selon la version et le lot",
          confidence: "faible",
          status: "variable",
          note: "Les contrats export incluent armement, soutien et formation.",
          sources: ["air-cosmos"],
        },
        {
          label: "Maintien en condition",
          value: "Poste majeur — mais sans dépendance logistique étrangère",
          confidence: "moyenne",
          sources: ["min-armees"],
        },
        {
          label: "Coût politique",
          value: "Faible — chaîne souveraine, hors régime ITAR",
          confidence: "haute",
          sources: ["dassault"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le développement du Rafale a été financé sur fonds nationaux français — sans partage de programme, à la différence de l'Eurofighter ou du F-35. C'est un choix de souveraineté coûteux, longtemps sans retour à l'export.\n\nLa tendance s'est inversée. Fin 2025, le carnet de commandes de Dassault atteint un niveau record : 220 Rafale, dont 175 destinés à l'export — la part étrangère porte désormais la cadence de production.",
      indicators: [
        {
          label: "Carnet de commandes",
          value: "220 Rafale fin 2025, dont 175 à l'export",
          confidence: "haute",
          sources: ["dassault"],
        },
        {
          label: "Modèle de financement",
          value: "Développement national ; export en vente d'État à État",
          confidence: "haute",
          sources: ["min-armees"],
        },
        {
          label: "Signal stratégique",
          value: "L'export finance désormais la montée en cadence",
          confidence: "moyenne",
          sources: ["air-cosmos"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne du Rafale est son argument central : Dassault pour la cellule et l'intégration, Thales pour le radar RBE2 et la guerre électronique, Safran pour le moteur M88. L'ensemble est français.\n\nAucun nœud critique ne dépend d'une autorisation étrangère. C'est ce qui distingue le Rafale du Gripen — dont le moteur est d'origine américaine — et de tout appareil contenant des composants soumis à l'ITAR : l'acheteur n'hérite d'aucune dépendance politique.",
      indicators: [
        {
          label: "Maître d'œuvre",
          value: "Dassault Aviation — cellule et intégration",
          confidence: "haute",
          sources: ["dassault"],
        },
        {
          label: "Nœuds critiques",
          value: "Radar et EW Thales · moteur M88 Safran — français",
          confidence: "haute",
          sources: ["dassault"],
        },
        {
          label: "Dépendance étrangère",
          value: "Aucune sur les nœuds critiques — hors ITAR",
          confidence: "haute",
          sources: ["dassault"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Acheter un Rafale, c'est acheter une autonomie. L'appareil s'adresse aux États qui veulent une capacité de combat de premier rang sans s'inscrire dans l'écosystème américain — ni dans ses chaînes logistiques, ni dans ses autorisations d'emploi.\n\nLes clients récents — Égypte, Inde, Qatar, Grèce, Croatie, Émirats, Indonésie, Serbie — illustrent cette demande. Pour la France, le Rafale est aussi un vecteur de la dissuasion nucléaire : un attribut régalien que peu d'avions portent.",
      indicators: [
        {
          label: "Fonction stratégique",
          value: "Capacité de combat souveraine, hors dépendance américaine",
          confidence: "haute",
          sources: ["min-armees"],
        },
        {
          label: "Clients export",
          value: "Égypte, Inde, Qatar, Grèce, Croatie, Émirats, Indonésie, Serbie",
          confidence: "haute",
          sources: ["sipri"],
        },
        {
          label: "Rôle national",
          value: "Composante aéroportée de la dissuasion française",
          confidence: "haute",
          sources: ["min-armees"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "Le Rafale est l'un des chasseurs occidentaux les plus exportables : pas de régime ITAR, pas de catégorie de non-prolifération bloquante, une vente d'État à État qui rassure l'acheteur.\n\nLa contrepartie est politique : l'export d'un avion porteur de la dissuasion suppose des configurations adaptées, et la France conserve la maîtrise des standards et des autorisations. L'exportabilité est forte — elle n'est pas inconditionnelle.",
      indicators: [
        {
          label: "Régime applicable",
          value: "Contrôle français — hors ITAR américain",
          confidence: "haute",
          sources: ["dassault"],
        },
        {
          label: "Dynamique",
          value: "175 appareils au carnet export fin 2025",
          confidence: "haute",
          sources: ["dassault"],
        },
        {
          label: "Limite",
          value: "Configurations et standards maîtrisés par la France",
          confidence: "moyenne",
          sources: ["min-armees"],
        },
      ],
    },
  ],
  variants: [
    {
      label: "Rafale C",
      value: "Monoplace terrestre — armée de l'air et de l'espace.",
      confidence: "haute",
      sources: ["dassault"],
    },
    {
      label: "Rafale B",
      value: "Biplace terrestre — entraînement et missions à deux équipiers.",
      confidence: "haute",
      sources: ["dassault"],
    },
    {
      label: "Rafale M",
      value: "Naval CATOBAR — train renforcé, crosse d'appontage, brin d'arrêt.",
      confidence: "haute",
      sources: ["dassault"],
    },
    {
      label: "Standard F3R",
      value: "Standard opérationnel précédent — missile Meteor, pod Talios.",
      confidence: "haute",
      sources: ["min-armees"],
    },
    {
      label: "Standard F4",
      value:
        "En déploiement — connectivité, combat collaboratif, capteurs et MCO ; sous-standard F4-2 accepté, F4-3 lancé.",
      confidence: "moyenne",
      sources: ["min-armees"],
    },
    {
      label: "Standard F5",
      value:
        "En préparation — moteur plus puissant, missile ASN4G, radar RBE2 XG, drone de combat associé.",
      confidence: "moyenne",
      status: "a-recouper",
      sources: ["air-cosmos"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Capacité omnirôle réelle pour un coût inférieur à la 5e génération ; sans furtivité native, son rapport effet/coût reste excellent mais borné.",
    },
    {
      key: "survivabilite",
      grade: "B",
      rationale:
        "Le système SPECTRA et la connectivité offrent une survie élevée ; faute de furtivité VLO, la pénétration d'une défense très dense reste un point ouvert.",
    },
    {
      key: "exportabilite",
      grade: "A",
      rationale:
        "Hors régime ITAR, vendu d'État à État, carnet export record : l'un des chasseurs occidentaux les plus exportables.",
    },
    {
      key: "risque-industriel",
      grade: "A",
      rationale:
        "Chaîne entièrement française — cellule, radar, EW, moteur — sans dépendance critique étrangère.",
    },
    {
      key: "maturite",
      grade: "A",
      rationale:
        "Plus de vingt ans de service, emploi opérationnel éprouvé, montée en standards maîtrisée.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "Programme bien documenté par le constructeur et l'État ; les coûts unitaires export restent dispersés selon les contrats.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un chasseur qui vaudrait un appareil de 5e génération. La réalité : un excellent 4.5 omnirôle, sans furtivité native — sa survie repose sur la guerre électronique, la connectivité et la tactique, non sur une signature radar minimale.",
    bestUseCase:
      "Doter une nation d'une capacité de combat complète et souveraine — supériorité aérienne, frappe, reconnaissance, action navale, dissuasion — sans dépendre d'un écosystème étranger.",
    weakPoint:
      "L'absence de furtivité VLO native : face à une défense sol-air de très haute densité, le Rafale s'appuie sur le brouillage et le tir à distance de sécurité plutôt que sur la pénétration discrète.",
    analystNote:
      "La vraie force du Rafale n'est pas une performance isolée mais une équation rare : un chasseur de premier rang dont aucun maillon — cellule, moteur, capteurs — ne dépend d'une autorisation étrangère. Le carnet de commandes record de 2025 confirme que cette souveraineté est devenue un argument de vente, pas seulement un choix national.",
  },
  operators: [
    "France",
    "Égypte",
    "Inde",
    "Qatar",
    "Grèce",
    "Croatie",
    "Émirats arabes unis",
    "Indonésie (livraisons à venir)",
    "Serbie (commande)",
  ],
  theatres: ["Afghanistan", "Libye", "Sahel", "Levant — Irak et Syrie"],
  timeline: [
    {
      date: "2004",
      label: "Entrée en service du Rafale M dans la Marine nationale.",
      kind: "jalon",
    },
    {
      date: "2015",
      label: "Premiers contrats export — Égypte et Qatar.",
      kind: "export",
    },
    {
      date: "2016",
      label: "Commande indienne de 36 Rafale.",
      kind: "export",
    },
    {
      date: "2021",
      label: "Vague d'exportations — Croatie, Grèce, Émirats arabes unis.",
      kind: "export",
    },
    {
      date: "2025",
      label:
        "Carnet de commandes record : 220 Rafale, dont 175 à l'export ; standard F5 en préparation.",
      kind: "jalon",
    },
  ],
  sources: [
    {
      id: "dassault",
      title:
        "Livraisons, prises de commandes et carnet — résultats annuels 2025",
      publisher: "Dassault Aviation",
      type: "constructeur",
      reliability: "B",
      url: "https://www.dassault-aviation.com/en/group/press/press-kits/deliveries-order-intakes-and-backlog-in-number-of-new-aircraft-as-of-december-31-2025/",
    },
    {
      id: "min-armees",
      title: "Le Rafale et ses standards F3R / F4 / F5",
      publisher: "Ministère des Armées — DGA",
      type: "officiel",
      reliability: "A",
      url: "https://www.defense.gouv.fr/dga",
    },
    {
      id: "air-cosmos",
      title: "Le carnet de commandes du Rafale atteint des sommets",
      publisher: "Air & Cosmos",
      type: "presse",
      reliability: "C",
      url: "https://air-cosmos.com/article/le-carnet-de-commande-du-rafale-atteint-des-sommets-63975",
    },
    {
      id: "sipri",
      title: "Arms Transfers Database",
      publisher: "SIPRI",
      type: "institution",
      reliability: "A",
      url: "https://www.sipri.org/databases/armstransfers",
    },
  ],
  updated: "2026-05-22",
};
