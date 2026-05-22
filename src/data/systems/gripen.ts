import type { DefenseSystem } from "../types";

export const gripen: DefenseSystem = {
  slug: "gripen",
  name: "JAS 39 Gripen",
  designation: "Gripen C/D · E/F",
  reference: "PNP-AC-008",
  category: "combat-aircraft",
  combatAircraftClass: "gen-4-5",
  classLabel: "Chasseur léger",
  country: "Suède",
  flag: "🇸🇪",
  manufacturer: "Saab",
  introduced: "1996",
  status: "En service — Gripen E/F en production, succès export 2025",
  naval: "Non — pas de version navale opérationnelle.",
  acquisitionModes: ["production-nationale"],
  tagline:
    "Le chasseur léger pensé pour la disponibilité — coût maîtrisé, bases dispersées, et une dépendance composant assumée.",
  summary:
    "Le JAS 39 Gripen de Saab est un chasseur léger conçu autour d'une idée : la résilience. Capable d'opérer depuis des routes et des bases dispersées, d'être réarmé et ravitaillé en quelques minutes par une équipe réduite, il privilégie la disponibilité et le coût d'exploitation sur la puissance brute.\n\nLa version E/F, plus grande et plus capacitaire, le fait basculer dans la génération 4.5. Le Gripen incarne la stratégie d'une puissance moyenne : un avion souverain dans sa conception — mais dont le moteur et certains composants sont d'origine étrangère. C'est cette nuance, et le succès export de 2025 vers la Colombie et la Thaïlande, qui font sa fiche.",
  keySpecs: [
    {
      label: "Équipage",
      value: "1 (C / E) ou 2 (D / F)",
      confidence: "haute",
      sources: ["saab"],
    },
    {
      label: "Motorisation",
      value: "1 réacteur — General Electric F414 sur le Gripen E",
      confidence: "haute",
      note: "Moteur d'origine américaine — point de dépendance majeur.",
      sources: ["saab"],
    },
    {
      label: "Capteur principal",
      value: "Radar AESA (Gripen E)",
      confidence: "haute",
      sources: ["saab"],
    },
    {
      label: "Atout opérationnel",
      value: "Bases dispersées — réarmement rapide, équipe réduite",
      confidence: "haute",
      sources: ["saab"],
    },
    {
      label: "Versions",
      value: "Gripen C/D en service ; Gripen E/F en production",
      confidence: "haute",
      sources: ["saab"],
    },
    {
      label: "Commandes 2025",
      value: "Colombie (17) et Thaïlande (4) — Gripen E/F",
      confidence: "haute",
      sources: ["saab", "flightglobal"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le Gripen est sans doute le chasseur occidental dont l'argument économique est le plus assumé. Saab met en avant un coût d'exploitation maîtrisé : réarmement et ravitaillement rapides, équipe au sol réduite, maintenance pensée pour la disponibilité.\n\nLe coût d'acquisition est inférieur à celui d'un appareil lourd ; surtout, le coût horaire et le coût de possession sont contenus. Pour une armée de l'air de taille moyenne, c'est souvent l'équation décisive.",
      indicators: [
        {
          label: "Logique de coût",
          value: "Disponibilité et coût d'exploitation avant puissance brute",
          confidence: "haute",
          sources: ["saab"],
        },
        {
          label: "Maintien en condition",
          value: "Pensé pour un réarmement rapide et une équipe réduite",
          confidence: "haute",
          sources: ["saab"],
        },
        {
          label: "Coût d'acquisition",
          value: "Inférieur aux chasseurs lourds — cible des puissances moyennes",
          confidence: "moyenne",
          sources: ["flightglobal"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le Gripen est financé par l'État suédois et porté à l'export, souvent via l'agence d'acquisition FMV. L'année 2025 a été commercialement forte : la Colombie a signé pour dix-sept Gripen E/F, la Thaïlande pour quatre.\n\nCes contrats confirment le positionnement financier de l'appareil : un chasseur de 4.5e génération accessible, dont le modèle d'achat — prix contenu, paquet de soutien — séduit les budgets de défense intermédiaires.",
      indicators: [
        {
          label: "Maître d'ouvrage",
          value: "État suédois ; export souvent via l'agence FMV",
          confidence: "haute",
          sources: ["saab"],
        },
        {
          label: "Commandes 2025",
          value: "Colombie — 17 appareils ; Thaïlande — 4 appareils",
          confidence: "haute",
          sources: ["saab", "flightglobal"],
        },
        {
          label: "Cible budgétaire",
          value: "Armées de l'air de taille moyenne",
          confidence: "moyenne",
          sources: ["flightglobal"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "Saab assure la maîtrise d'œuvre du Gripen — cellule, intégration, électronique de mission. Mais la chaîne n'est pas entièrement souveraine : le Gripen E est propulsé par un moteur General Electric F414, d'origine américaine.\n\nCette dépendance est le point faible industriel de l'appareil. Elle n'affecte pas la conception, mais elle introduit un composant soumis au régime américain — avec les conséquences qui en découlent à l'export.",
      indicators: [
        {
          label: "Maître d'œuvre",
          value: "Saab — cellule, intégration, mission",
          confidence: "haute",
          sources: ["saab"],
        },
        {
          label: "Dépendance critique",
          value: "Moteur GE F414 américain sur le Gripen E",
          confidence: "haute",
          sources: ["saab"],
        },
        {
          label: "Composants étrangers",
          value: "Plusieurs sous-systèmes d'origine non suédoise",
          confidence: "moyenne",
          sources: ["flightglobal"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Le Gripen est l'avion d'une puissance moyenne qui a voulu garder une industrie aéronautique de combat. Sa doctrine — dispersion sur routes et bases multiples, résilience face à une frappe sur les aérodromes — répond à la géographie et à la menace suédoises.\n\nÀ l'export, il s'adresse à des États au profil comparable : budget mesuré, recherche d'autonomie opérationnelle, refus de la dépendance lourde au F-35.",
      indicators: [
        {
          label: "Doctrine d'emploi",
          value: "Dispersion et résilience — opérations sur routes et bases multiples",
          confidence: "haute",
          sources: ["saab"],
        },
        {
          label: "Cible stratégique",
          value: "Puissances moyennes cherchant autonomie et coût maîtrisé",
          confidence: "moyenne",
          sources: ["flightglobal"],
        },
        {
          label: "Limite de souveraineté",
          value: "Le moteur américain borne l'autonomie réelle de l'acheteur",
          confidence: "moyenne",
          sources: ["saab"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "Le Gripen est largement exporté — Afrique du Sud, République tchèque, Hongrie, Brésil, et désormais Thaïlande et Colombie. C'est un succès commercial réel pour un constructeur de taille moyenne.\n\nMais l'export bute sur une contrainte : le moteur F414 étant américain, certaines ventes nécessitent l'aval des États-Unis. L'exportabilité du Gripen est bonne — elle n'est pas pleinement souveraine.",
      indicators: [
        {
          label: "Clients export",
          value: "Afrique du Sud, Tchéquie, Hongrie, Brésil, Thaïlande, Colombie",
          confidence: "haute",
          sources: ["sipri"],
        },
        {
          label: "Contrainte",
          value: "Le moteur américain peut imposer un aval des États-Unis",
          confidence: "moyenne",
          sources: ["saab"],
        },
        {
          label: "Dynamique",
          value: "Deux nouveaux clients en 2025 — 21 Gripen E/F vendus",
          confidence: "haute",
          sources: ["flightglobal"],
        },
      ],
    },
  ],
  variants: [
    {
      label: "Gripen C",
      value: "Monoplace de 4e génération modernisée — version la plus diffusée.",
      confidence: "haute",
      sources: ["saab"],
    },
    {
      label: "Gripen D",
      value: "Biplace — conversion et missions à deux équipiers.",
      confidence: "haute",
      sources: ["saab"],
    },
    {
      label: "Gripen E",
      value:
        "Nouvelle génération — cellule agrandie, radar AESA, moteur GE F414, emport accru ; classe 4.5.",
      confidence: "haute",
      sources: ["saab"],
    },
    {
      label: "Gripen F",
      value: "Version biplace du Gripen E.",
      confidence: "haute",
      sources: ["saab"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "A",
      rationale:
        "Le rapport effet/coût est l'argument central du Gripen : disponibilité élevée, coût d'exploitation contenu, emploi dispersé — une équation rare.",
    },
    {
      key: "survivabilite",
      grade: "C",
      rationale:
        "Chasseur léger non furtif ; sa survie tient à la dispersion, à la guerre électronique et à la tactique plus qu'à la cellule.",
    },
    {
      key: "exportabilite",
      grade: "B",
      rationale:
        "Largement exporté et toujours commercialement actif, mais le moteur américain peut soumettre certaines ventes à un aval des États-Unis.",
    },
    {
      key: "risque-industriel",
      grade: "C",
      rationale:
        "Saab maîtrise la conception, mais le moteur et plusieurs composants étrangers bornent l'autonomie industrielle de l'appareil.",
    },
    {
      key: "maturite",
      grade: "B",
      rationale:
        "Le Gripen C/D est pleinement mûr ; le Gripen E/F, plus récent, poursuit sa montée en puissance opérationnelle.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "Programme bien documenté par le constructeur et la presse spécialisée ; certaines performances du Gripen E restent en consolidation.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un chasseur souverain low-cost. La réalité : un appareil brillamment optimisé pour la disponibilité et le coût — mais dont le moteur est américain, ce qui borne sa souveraineté et son export.",
    bestUseCase:
      "Doter une armée de l'air de taille moyenne d'un chasseur 4.5 abordable, hautement disponible et conçu pour des opérations dispersées et résilientes.",
    weakPoint:
      "La dépendance étrangère : moteur GE F414 américain et composants importés — une autonomie réelle de conception, mais incomplète à l'usage et à l'export.",
    analystNote:
      "Le Gripen est l'anti-F-35 : un pari assumé sur le coût, la disponibilité et la résilience plutôt que sur la puissance maximale. C'est une équation gagnante pour les puissances moyennes — à condition de lire l'astérisque : « souverain », sauf le moteur.",
  },
  operators: [
    "Suède",
    "Afrique du Sud",
    "République tchèque",
    "Hongrie",
    "Brésil",
    "Thaïlande (livraisons à venir)",
    "Colombie (commande)",
  ],
  theatres: ["Suède — défense nationale", "Police du ciel — pays baltes"],
  timeline: [
    {
      date: "1996",
      label: "Entrée en service du JAS 39 Gripen dans l'armée de l'air suédoise.",
      kind: "jalon",
    },
    {
      date: "2008",
      label: "Premières exportations significatives — Afrique du Sud, Europe centrale.",
      kind: "export",
    },
    {
      date: "2019",
      label: "Montée en service de la nouvelle génération Gripen E.",
      kind: "jalon",
    },
    {
      date: "2025",
      label:
        "Contrats export avec la Colombie (17) et la Thaïlande (4) — 21 Gripen E/F.",
      kind: "export",
    },
  ],
  sources: [
    {
      id: "saab",
      title: "Gripen E-series — système et contrats",
      publisher: "Saab",
      type: "constructeur",
      reliability: "B",
      url: "https://www.saab.com/products/gripen-e-series",
    },
    {
      id: "flightglobal",
      title: "How Gripen E/F, GlobalEye orders propelled Saab in 2025",
      publisher: "FlightGlobal",
      type: "presse",
      reliability: "C",
      url: "https://www.flightglobal.com/fixed-wing/2026/02/how-gripen-e-f-globaleye-orders-propelled-fast-growing-saab-in-2025/",
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
