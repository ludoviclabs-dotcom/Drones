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
  status: "En service — production active ; carnet de 208 Rafale au 30 juin 2026",
  naval:
    "Oui — Rafale M, appontage CATOBAR sur le porte-avions Charles-de-Gaulle ; seul chasseur de combat naval européen en service.",
  acquisitionModes: ["production-nationale"],
  tagline:
    "Le chasseur omnirôle français — souveraineté industrielle complète et export en plein essor, sans furtivité native.",
  summary:
    "Le Rafale est le chasseur omnirôle de Dassault Aviation : un avion conçu pour assurer, sur une seule cellule, la supériorité aérienne, la frappe au sol, la reconnaissance, l'attaque antinavire et la dissuasion nucléaire aéroportée. C'est un appareil de génération 4.5 — cellule non furtive, mais capteurs, guerre électronique et architecture logicielle de tout premier rang.\n\nSa singularité tient autant à l'industrie qu'à l'avion : cellule Dassault, radar et guerre électronique Thales, moteur Safran — une chaîne entièrement française, sans composant soumis au régime américain ITAR. Longtemps boudé à l'export, le Rafale connaît depuis 2015 un succès commercial qui en fait, fin 2025, un carnet de commandes record — 208 Rafale au 30 juin 2026, dont 165 à l'export. Le comprendre, c'est lire ce qu'un pays achète quand il choisit l'autonomie plutôt que l'écosystème américain.",
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
        "Le développement du Rafale a été financé sur fonds nationaux français — sans partage de programme, à la différence de l'Eurofighter ou du F-35. C'est un choix de souveraineté coûteux, longtemps sans retour à l'export.\n\nLa tendance s'est inversée. Fin 2025, le carnet de commandes de Dassault atteignait un niveau record : 220 Rafale, dont 175 destinés à l'export. Au 30 juin 2026, il compte 208 Rafale, dont 165 à l'exportation et 43 pour la France — la part étrangère porte toujours la cadence de production.",
      indicators: [
        {
          label: "Carnet de commandes",
          value: "208 Rafale au 30/06/2026, dont 165 à l'export et 43 pour la France",
          confidence: "haute",
          note: "Le chiffre de fin 2025 (220 dont 175 à l'export) était juste à cette date ; il est dépassé depuis le premier semestre 2026.",
          metricIds: ["MET-0637", "MET-0638", "MET-0639"],
          figureStatus: "officiel",
          sources: ["dassault-s1-2026"],
        },
        {
          label: "Carnet de commandes — fin 2025",
          value: "220 Rafale au 31/12/2025, dont 175 à l'export",
          confidence: "haute",
          metricIds: ["MET-0185", "MET-0641"],
          figureStatus: "officiel",
          sources: ["dassault-fy2025"],
        },
        {
          label: "F5 — coût de développement",
          value: "≈ 5 Md€, dont 3,5 Md€ demandés aux Émirats",
          confidence: "faible",
          note: "Montant de la demande initiale, avant la rupture du printemps 2026 ; non confirmé par Paris ni par Abou Dhabi, montant finalement retenu inconnu. Aucun chiffre DGA.",
          metricIds: ["MET-0081", "MET-0083"],
          figureStatus: "source-unique",
          sources: ["armees-com-f5", "opex360-f5-eau"],
        },
        {
          label: "F5 — accord France–Émirats",
          value: "Signé le 20/10/2026, confirmé le 21/10",
          confidence: "moyenne",
          note: "The National rapporte la signature dès le 20/10, pendant la visite ; la conférence de presse a eu lieu le 21/10.",
          metricIds: ["MET-0096"],
          figureStatus: "presse",
          sources: ["essentiel-f5-eau"],
        },
        {
          label: "F5 — termes financiers de l'accord",
          value: "n.c. — non publics",
          confidence: "haute",
          metricIds: ["MET-0097"],
          figureStatus: "non-communique",
          sources: ["opex360-f5-eau"],
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
          note: "Liste des commandes fermes. Une feuille de route France–Ukraine du 13/07/2026 vise 16 Rafale : c'est une intention, pas une commande ferme.",
          sources: ["sipri", "dassault-s1-2026"],
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
          value: "165 appareils au carnet export au 30/06/2026 (175 fin 2025)",
          confidence: "haute",
          metricIds: ["MET-0638", "MET-0641"],
          figureStatus: "officiel",
          sources: ["dassault-s1-2026", "dassault-fy2025"],
        },
        {
          label: "Inde — Rafale Marine",
          value: "26 Rafale Marine commandés — accord intergouvernemental signé le 28/04/2025",
          confidence: "haute",
          metricIds: ["MET-0600", "MET-0603"],
          figureStatus: "officiel",
          sources: ["dassault-rafale-m-inde"],
        },
        {
          label: "Inde — 114 Rafale en négociation",
          value:
            "114 Rafale visés (MRFA) — négociation de gré à gré, acceptation de nécessité du DAC indien le 12/02/2026",
          confidence: "moyenne",
          note: "Le communiqué officiel indien ne chiffre pas le nombre d'avions. Aucun contrat signé.",
          metricIds: ["MET-0615", "MET-1632", "MET-0111"],
          figureStatus: "presse",
          sources: ["dassault-s1-2026", "tribune-dac-114", "newsonair-dac"],
        },
        {
          label: "Inde — décision sur les 114",
          value:
            "Attendue entre décembre 2026 et mars 2027 — aucune décision connue au 17/11/2026",
          confidence: "faible",
          metricIds: ["MET-0112"],
          figureStatus: "source-unique",
          sources: ["migflug-114"],
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
        "Lancement en réalisation prévu fin 2026, premiers contrats de développement des briques notifiés à l'été 2026 ; qualification visée à l'horizon 2033 — moteur M88 T-REX, radar RBE2 XG, guerre électronique SPECTRA F5, drone de combat associé.",
      confidence: "haute",
      note: "Aucune notification du contrat de réalisation au 17/11/2026. Air & Cosmos cite aussi le missile ASN4G, absent du registre.",
      metricIds: ["MET-0092", "MET-0095", "MET-0089"],
      figureStatus: "officiel",
      sources: ["dga-f5", "air-cosmos"],
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
      label: "Carnet de commandes record : 220 Rafale au 31/12/2025, dont 175 à l'export.",
      kind: "jalon",
      metricIds: ["MET-0185", "MET-0641"],
    },
    {
      date: "2025-04",
      label: "Inde — contrat de 26 Rafale Marine signé le 28/04/2025.",
      kind: "export",
      metricIds: ["MET-0600", "MET-0603"],
    },
    {
      date: "2026-02",
      label: "Inde — acceptation de nécessité du DAC pour l'acquisition de 114 Rafale (12/02/2026).",
      kind: "export",
      metricIds: ["MET-0111"],
    },
    {
      date: "2026-07",
      label: "Carnet de 208 Rafale au 30/06/2026, dont 165 à l'export et 43 pour la France.",
      kind: "jalon",
      metricIds: ["MET-0637", "MET-0638", "MET-0639"],
    },
    {
      date: "2026-10",
      label: "Accord intergouvernemental France–Émirats sur le développement du F5, signé le 20/10/2026 et confirmé le 21/10.",
      kind: "export",
      metricIds: ["MET-0096"],
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
    {
      id: "dassault-s1-2026",
      title:
        "Résultats Dassault Aviation, données consolidées — 1er semestre 2026 (communiqué financier)",
      publisher: "Dassault Aviation",
      type: "constructeur",
      reliability: "B",
      date: "2026-07-22",
      url: "https://www.dassault-aviation.com/wp-content/blogs.dir/1/files/2026/07/Communique-Financier-Resultats-du-1er-semestre-2026.pdf",
    },
    {
      id: "dassault-fy2025",
      title:
        "Résultats Dassault Aviation, données consolidées — exercice 2025 (communiqué financier)",
      publisher: "Dassault Aviation",
      type: "constructeur",
      reliability: "B",
      date: "2026-03-04",
      url: "https://www.dassault-aviation.com/wp-content/blogs.dir/2/files/2026/03/Communique-financier-Resultats-2025.pdf",
    },
    {
      id: "dassault-rafale-m-inde",
      title: "Signature du contrat Rafale Marine pour l'Inde",
      publisher: "Dassault Aviation",
      type: "constructeur",
      reliability: "B",
      date: "2025-04-28",
      url: "https://www.dassault-aviation.com/wp-content/blogs.dir/2/files/2025/04/CP_Dassault-Aviation_Rafale-M-Inde.pdf",
    },
    {
      id: "tribune-dac-114",
      title: "DAC nod for 114 Rafale jets sets stage for Russia-like France tie-up",
      publisher: "The Tribune (Inde)",
      type: "presse",
      reliability: "C",
      date: "2026-02-13",
      url: "https://www.tribuneindia.com/news/india/dac-nod-for-114-rafale-jets-sets-stage-for-russia-like-france-tie-up",
    },
    {
      id: "newsonair-dac",
      title: "DAC clears proposals of nearly 3.60 lakh Cr to enhance capabilities of armed forces",
      publisher: "All India Radio (newsonair.gov.in) — communiqué du ministère de la Défense indien",
      type: "officiel",
      reliability: "B",
      date: "2026-02-12",
      url: "https://www.newsonair.gov.in/dac-clears-proposals-of-nearly-3-60-lakh-cr-to-enhance-capabilities-of-armed-forces",
    },
    {
      id: "migflug-114",
      title: "114 Rafale Deal: India Expects Decision by Year-End",
      publisher: "MiGFlug",
      type: "presse",
      reliability: "C",
      date: "2026-10-03",
      url: "https://migflug.com/afterburner/india-114-rafale-deal-decision-year-end-indian-weapons-no-fifth-gen-2026/",
    },
    {
      id: "dga-f5",
      title:
        "La DGA commande des premiers travaux en amont du prochain lancement en réalisation du standard F5 du Rafale, prévu fin 2026",
      publisher: "Ministère des Armées — DGA",
      type: "officiel",
      reliability: "A",
      date: "2026-09-10",
      url: "https://www.defense.gouv.fr/dga/actualites/dga-commande-premiers-travaux-amont-du-prochain-lancement-realisation-du-standard-f5-du-rafale",
    },
    {
      id: "essentiel-f5-eau",
      title: "Rafale F5 : Paris et Abou Dhabi s'accordent sur un partage des coûts",
      publisher: "L'Essentiel de l'Éco",
      type: "presse",
      reliability: "C",
      date: "2026-10-22",
      url: "https://lessentieldeleco.fr/9074-rafale-f5-paris-et-abou-dhabi-saccordent-sur-un-partage-des-couts/",
    },
    {
      id: "opex360-f5-eau",
      title:
        "La France et les Émirats arabes unis ont signé un accord intergouvernemental sur le développement du Rafale F5",
      publisher: "Opex360",
      type: "presse",
      reliability: "C",
      date: "2026-10-21",
      url: "https://www.opex360.com/2026/10/21/la-france-et-les-emirats-arabes-unis-ont-signe-un-accord-intergouvernemental-sur-le-developpement-du-rafale-f5/",
    },
    {
      id: "armees-com-f5",
      title:
        "Rafale F5 : Paris et Abou Dhabi relancent leur coopération, le financement reste à négocier",
      publisher: "Armees.com (citant Reuters)",
      type: "presse",
      reliability: "C",
      date: "2026-10-25",
      url: "https://armees.com/rafale-f5-france-emirats-accord-financement-octobre-2026/",
    },
  ],
  updated: "2026-11-17",
};
