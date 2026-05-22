import type { DefenseSystem } from "../types";

export const f15ex: DefenseSystem = {
  slug: "f-15ex",
  name: "F-15EX Eagle II",
  designation: "F-15EX",
  reference: "PNP-AC-005",
  category: "combat-aircraft",
  combatAircraftClass: "gen-4-5",
  classLabel: "Chasseur lourd — 4.5e génération",
  country: "États-Unis",
  flag: "🇺🇸",
  manufacturer: "Boeing",
  introduced: "2024",
  status: "En service — production en cours, montée en cadence après une grève en 2025",
  naval: "Non — version de l'US Air Force, aucune variante embarquée.",
  acquisitionModes: ["production-nationale"],
  tagline:
    "Le « camion à missiles » assumé — non furtif, mais une charge utile et une avionique ouverte qui complètent la 5e génération.",
  summary:
    "Le F-15EX Eagle II est la version la plus moderne d'une cellule née dans les années 1970. Boeing n'a pas cherché la furtivité : le F-15EX assume son statut de chasseur lourd de 4.5e génération — radar AESA, suite de guerre électronique EPAWSS, architecture de mission ouverte (OMS) et une charge utile parmi les plus élevées du domaine.\n\nSa logique n'est pas de remplacer le F-35 mais de le compléter : transporter beaucoup d'armes, loin, à moindre coût d'intégration, là où la furtivité n'est pas requise. L'US Air Force le retient pour relever ses vieux F-15C. C'est l'illustration la plus claire de ce qu'un 4.5e bien conçu apporte encore — et de ce qu'il ne fait pas.",
  keySpecs: [
    {
      label: "Équipage",
      value: "1 ou 2 selon la configuration",
      confidence: "haute",
      sources: ["boeing"],
    },
    {
      label: "Motorisation",
      value: "2 réacteurs — chasseur lourd bimoteur",
      confidence: "haute",
      sources: ["boeing"],
    },
    {
      label: "Capteur principal",
      value: "Radar AESA · suite de guerre électronique EPAWSS",
      confidence: "haute",
      sources: ["boeing"],
    },
    {
      label: "Charge utile",
      value: "Parmi les plus élevées du domaine — jusqu'à ≈ 13 t citées",
      confidence: "moyenne",
      note: "Rôle revendiqué de « camion à missiles ».",
      sources: ["boeing"],
    },
    {
      label: "Architecture",
      value: "Open Mission Systems (OMS) — intégration ouverte",
      confidence: "haute",
      sources: ["boeing"],
    },
    {
      label: "Programme",
      value: "98 appareils prévus pour l'US Air Force, en six lots",
      confidence: "moyenne",
      sources: ["afmc"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le F-15EX joue une carte économique précise : réutiliser une cellule mûre et une chaîne existante pour éviter les coûts d'un développement neuf. L'avion est cher à l'unité — c'est un chasseur lourd —, mais son coût d'intégration et son risque de programme sont faibles.\n\nLa contrepartie, c'est un appareil non furtif : son rapport effet/coût est excellent pour la charge et la permanence, médiocre pour la pénétration en zone très défendue.",
      indicators: [
        {
          label: "Logique de coût",
          value: "Cellule mûre, chaîne existante — faible risque de développement",
          confidence: "haute",
          sources: ["boeing"],
        },
        {
          label: "Coût unitaire",
          value: "Élevé — chasseur lourd bimoteur",
          confidence: "moyenne",
          sources: ["afmc"],
        },
        {
          label: "Rapport effet/coût",
          value: "Excellent pour la charge utile, faible pour la pénétration",
          confidence: "moyenne",
          sources: ["boeing"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le F-15EX est financé par l'US Air Force, qui prévoit d'en acquérir quatre-vingt-dix-huit appareils répartis en six lots, pour remplacer ses F-15C vieillissants.\n\nLa production a connu un accroc en 2025 : une grève à l'usine Boeing de Saint-Louis a interrompu la ligne d'août à novembre, retardant les livraisons. Elles ont depuis repris, et Boeing vise un doublement de la cadence.",
      indicators: [
        {
          label: "Maître d'ouvrage",
          value: "US Air Force — remplacement des F-15C",
          confidence: "haute",
          sources: ["afmc"],
        },
        {
          label: "Programme",
          value: "98 appareils en six lots de production",
          confidence: "moyenne",
          sources: ["afmc"],
        },
        {
          label: "Aléa 2025",
          value: "Grève à Saint-Louis — ligne interrompue d'août à novembre",
          confidence: "haute",
          sources: ["aviationist"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne du F-15EX repose sur la longévité du programme F-15 : une cellule et un outillage éprouvés, une base de fournisseurs américaine établie. Boeing annonce une ligne active jusque tard dans la décennie.\n\nLa grève de 2025 a rappelé que même une chaîne mature reste exposée aux aléas sociaux et industriels. Mais le risque industriel d'ensemble demeure modéré : pas de technologie de rupture, pas de dépendance critique nouvelle.",
      indicators: [
        {
          label: "Maître d'œuvre",
          value: "Boeing — site de Saint-Louis",
          confidence: "haute",
          sources: ["boeing"],
        },
        {
          label: "Base industrielle",
          value: "Cellule F-15 éprouvée, fournisseurs américains établis",
          confidence: "haute",
          sources: ["afmc"],
        },
        {
          label: "Cadence visée",
          value: "Doublement annoncé — vers 24 appareils par an",
          confidence: "moyenne",
          sources: ["aviationist"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Le F-15EX répond à une logique de complémentarité : conserver une flotte de chasseurs lourds, capables d'emporter beaucoup d'armes et de tenir l'alerte, pendant que les F-22 et F-35 assurent la pénétration furtive.\n\nC'est un choix de masse et de permanence. Pour l'US Air Force, il s'agit de ne pas tout miser sur la furtivité, et de garder un appareil à fort emport pour la défense du territoire et les théâtres peu contestés.",
      indicators: [
        {
          label: "Fonction stratégique",
          value: "Masse et permanence en complément de la 5e génération",
          confidence: "haute",
          sources: ["afmc"],
        },
        {
          label: "Emploi visé",
          value: "Défense du territoire, théâtres peu ou pas contestés",
          confidence: "moyenne",
          sources: ["boeing"],
        },
        {
          label: "Doctrine",
          value: "Ne pas tout miser sur la furtivité",
          confidence: "moyenne",
          sources: ["boeing"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "Le F-15EX lui-même équipe l'US Air Force. Mais la famille F-15 moderne est largement exportée sous des désignations dérivées — F-15QA pour le Qatar, F-15SA pour l'Arabie saoudite, F-15IA pour Israël —, partageant l'essentiel de l'avionique.\n\nCes appareils relèvent du régime ITAR et de la vente d'État à État : un export réel, mais sous contrôle américain.",
      indicators: [
        {
          label: "F-15EX",
          value: "Version de l'US Air Force",
          confidence: "haute",
          sources: ["afmc"],
        },
        {
          label: "Famille export",
          value: "F-15QA, F-15SA, F-15IA — dérivés modernes exportés",
          confidence: "moyenne",
          sources: ["boeing"],
        },
        {
          label: "Régime applicable",
          value: "ITAR — vente d'État à État sous contrôle américain",
          confidence: "haute",
          sources: ["boeing"],
        },
      ],
    },
  ],
  variants: [
    {
      label: "F-15EX Eagle II",
      value:
        "Version de l'US Air Force — radar AESA, EPAWSS, architecture OMS, forte charge utile.",
      confidence: "haute",
      sources: ["boeing"],
    },
    {
      label: "Lots de production",
      value:
        "Six lots prévus — Lot 1 livré, Lot 2 en cours après l'interruption de 2025.",
      confidence: "moyenne",
      sources: ["afmc"],
    },
    {
      label: "Famille F-15 export",
      value:
        "F-15QA (Qatar), F-15SA (Arabie saoudite), F-15IA (Israël) — dérivés modernes apparentés.",
      confidence: "moyenne",
      sources: ["boeing"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Forte charge utile et faible risque de développement, pour un coût unitaire élevé et sans capacité de pénétration furtive.",
    },
    {
      key: "survivabilite",
      grade: "C",
      rationale:
        "Chasseur non furtif : sa survie en zone très défendue dépend du tir à distance et de la guerre électronique, non de la signature.",
    },
    {
      key: "exportabilite",
      grade: "B",
      rationale:
        "Le F-15EX équipe l'US Air Force ; la famille F-15 moderne est exportée sous régime ITAR vers plusieurs alliés.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Cellule et chaîne éprouvées, base américaine solide ; la grève de 2025 a rappelé l'exposition aux aléas industriels.",
    },
    {
      key: "maturite",
      grade: "B",
      rationale:
        "Cellule très mûre, mais la version EX n'est entrée en service qu'en 2024 et poursuit sa montée en cadence.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "Programme bien documenté par Boeing et l'US Air Force ; certains chiffres de charge utile restent des données constructeur.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un chasseur dépassé parce que non furtif. La réalité : un 4.5e lourd parfaitement assumé — beaucoup d'armes, loin, à faible risque de programme — conçu pour compléter la 5e génération, pas la concurrencer.",
    bestUseCase:
      "Emporter une charge utile élevée et tenir la permanence — défense du territoire, théâtres peu contestés — pendant que les appareils furtifs assurent la pénétration.",
    weakPoint:
      "L'absence de furtivité : face à une défense sol-air dense, le F-15EX est un porteur d'armes à distance de sécurité, non un pénétrant.",
    analystNote:
      "Le F-15EX est l'exemple le plus net du 4.5e lourd : il ne prétend pas être furtif, il prétend être utile. Sa valeur tient à une division du travail assumée avec le F-35 — la masse et l'emport d'un côté, la pénétration discrète de l'autre.",
  },
  operators: ["États-Unis"],
  theatres: ["États-Unis — défense du territoire et alerte"],
  timeline: [
    {
      date: "2021",
      label: "Premiers F-15EX livrés à l'US Air Force pour essais.",
      kind: "jalon",
    },
    {
      date: "2024",
      label: "Entrée en service opérationnel du F-15EX Eagle II.",
      kind: "jalon",
    },
    {
      date: "2025",
      label:
        "Grève chez Boeing — ligne de production interrompue d'août à novembre.",
      kind: "debat",
    },
    {
      date: "2025",
      label: "Reprise des livraisons et montée en cadence.",
      kind: "jalon",
    },
  ],
  sources: [
    {
      id: "boeing",
      title: "F-15EX Eagle II — capacités et programme",
      publisher: "Boeing",
      type: "constructeur",
      reliability: "B",
      url: "https://www.boeing.com/defense/f-15ex",
    },
    {
      id: "afmc",
      title: "F-15EX production rebounds, deliveries continue",
      publisher: "U.S. Air Force Materiel Command",
      type: "officiel",
      reliability: "A",
      url: "https://www.afmc.af.mil/News/Article-Display/Article/4360150/f-15ex-production-rebounds-deliveries-continue/",
    },
    {
      id: "aviationist",
      title: "142nd Wing Receives Eighth F-15EX as Boeing Strike Ends",
      publisher: "The Aviationist",
      type: "presse",
      reliability: "C",
      url: "https://theaviationist.com/2025/11/29/142nd-wing-eighth-f-15ex-eagle-ii/",
    },
  ],
  updated: "2026-05-22",
};
