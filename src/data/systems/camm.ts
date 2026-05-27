import type { DefenseSystem } from "../types";

export const camm: DefenseSystem = {
  slug: "camm",
  name: "CAMM / CAMM-ER",
  designation: "Common Anti-air Modular Missile (Family)",
  reference: "PNP-MSL-013",
  category: "missile",
  missileRole: "SAM",
  classLabel:
    "Intercepteur surface-air courte/moyenne portée — soft vertical launch terre et marine",
  country: "Royaume-Uni / Italie",
  flag: "🇬🇧🇮🇹",
  manufacturer: "MBDA",
  introduced: "2018",
  status:
    "En service — Royaume-Uni (Sea Ceptor, Sky Sabre), Italie, Pologne, Brésil ; CAMM-ER en montée en cadence",
  acquisitionModes: ["cooperatif", "DCS"],
  tagline:
    "Le SHORAD/MRAD européen modulaire — soft vertical launch, RF actif, exporté largement en marine et en terre.",
  summary:
    "CAMM est la famille de missiles surface-air modulaires développée par MBDA, à l'origine pour la Royal Navy (Sea Ceptor) puis étendue aux versions terrestres et à l'export. Sa caractéristique structurante : le soft vertical launch — le missile est éjecté de son canister par cartouche pyrotechnique, puis son moteur principal s'allume en altitude. Cela élimine le panache de lancement, simplifie l'intégration plateforme et permet une réaction rapide à 360°.\n\nLa famille compte plusieurs déclinaisons. CAMM (≈ 25 km) couvre la défense de point et la défense de zone courte portée. CAMM-ER (Extended Range, jusqu'à 45 km publiquement) cible la défense aérienne moyenne portée. CAMM-MR à venir étend encore la portée. Pour Panoplie, CAMM est l'archétype de l'effecteur sol-air modulaire européen — un missile pensé d'emblée pour être commun terre/marine, simple à intégrer, exportable largement hors ITAR.",
  keySpecs: [
    {
      label: "Mode de lancement",
      value: "Soft vertical launch — éjection cartouche, allumage moteur en altitude",
      confidence: "haute",
      sources: ["mbda-camm"],
    },
    {
      label: "Guidage",
      value:
        "Inertiel + datalink bidirectionnel + autodirecteur RF actif terminal",
      confidence: "haute",
      sources: ["mbda-camm"],
    },
    {
      label: "Portée publique CAMM",
      value: "≈ 25 km — défense de point et de zone courte",
      confidence: "haute",
      sources: ["mbda-camm"],
    },
    {
      label: "Portée publique CAMM-ER",
      value: "≈ 45 km — moyenne portée",
      confidence: "haute",
      sources: ["mbda-camm"],
    },
    {
      label: "Systèmes hôtes",
      value:
        "Sea Ceptor (Type 23, Type 26, Type 31, FREMM IT) ; Sky Sabre (UK Army), EMADS, batteries terrestres",
      confidence: "haute",
      sources: ["mbda-camm", "uk-mod-camm"],
    },
    {
      label: "Charge militaire",
      value: "Blast-fragmentation avec fusée de proximité",
      confidence: "haute",
      sources: ["mbda-camm"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "CAMM n'est pas vendu missile par missile dans le domaine public — les coûts se lisent par lot ou par batterie. La logique économique est claire : un missile sol-air court/moyen courrier produit en série pour deux opérateurs principaux (UK + IT) et un parc export en expansion.\n\nLe positionnement est explicite : plus économique qu'un Aster, plus capacitaire qu'un Stinger, parfaitement calibré pour la couche SHORAD/MRAD. La modularité du canister (4 ou 6 missiles par cellule selon plateforme) renforce le ratio coût-efficacité par rapport aux intercepteurs longue portée.",
      indicators: [
        {
          label: "Coût unitaire public",
          value: "Non publié — livraison par lots contractuels",
          confidence: "faible",
          status: "variable",
          sources: ["mbda-camm"],
        },
        {
          label: "Lecture économique",
          value:
            "Effecteur court/moyen courrier modulaire — entre Stinger et Aster",
          confidence: "moyenne",
          sources: ["mbda-camm"],
        },
        {
          label: "Avantage capacitaire",
          value:
            "4-6 missiles par cellule — densité de feu élevée pour la défense de point",
          confidence: "haute",
          sources: ["mbda-camm"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le programme est porté par le UK MOD comme client principal, avec l'Italie comme partenaire stratégique pour CAMM-ER. Les contrats d'achat sont structurés en plusieurs vagues : équipement frégates Type 23 puis Type 26 et Type 31 ; déploiement Sky Sabre pour l'UK Army ; export Pologne (Narew), Brésil, Suède, etc.\n\nMBDA UK est l'industriel central. La trajectoire de cadence est forte — la pression européenne post-Ukraine et la prolifération des menaces drones et croisière ont fait de CAMM l'un des programmes les plus dynamiques du portefeuille MBDA.",
      indicators: [
        {
          label: "Maîtrise programme",
          value: "UK MOD (principal) + Italie (CAMM-ER) ; MBDA UK industriel",
          confidence: "haute",
          sources: ["uk-mod-camm"],
        },
        {
          label: "Trajectoire de financement",
          value:
            "Plusieurs vagues d'achat UK + contrats export en montée",
          confidence: "haute",
          sources: ["mbda-camm"],
        },
        {
          label: "Dynamique post-Ukraine",
          value:
            "Programme bénéficiant de la priorité européenne sur la défense aérienne",
          confidence: "haute",
          sources: ["mbda-cadence"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne CAMM est entièrement européenne — MBDA UK pour la maîtrise d'œuvre, MBDA Italia pour CAMM-ER, Roxel et autres sous-traitants pour le propergol. Aucun nœud critique n'est ITAR ; la chaîne est sous contrôle UK + IT, dans le cadre des accords industriels MBDA group.\n\nLe risque industriel principal est partagé avec les autres programmes MBDA — la concomitance Aster B1NT, CAMM, MICA NG, modernisation SCALP crée une demande structurelle qui justifie les annonces de doublement de capacité. CAMM bénéficie cependant d'une certaine maturité productive — la chaîne est rodée depuis 2018.",
      indicators: [
        {
          label: "Maître d'œuvre",
          value: "MBDA UK (CAMM) + MBDA Italia (CAMM-ER)",
          confidence: "haute",
          sources: ["mbda-camm"],
        },
        {
          label: "Composants critiques",
          value:
            "Propergol solide, autodirecteur RF actif, datalink, canister",
          confidence: "haute",
          sources: ["mbda-camm"],
        },
        {
          label: "Risque industriel principal",
          value:
            "Concomitance MBDA — Aster, MICA NG, SCALP MLR ; cadence en montée",
          confidence: "moyenne",
          sources: ["mbda-cadence"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "CAMM est devenu l'effecteur de référence du segment SHORAD/MRAD européen non-ITAR. Sa sélection par la Pologne pour le programme Narew, par la Suède pour la défense aérienne terrestre, et par le Brésil pour ses frégates — sans parler de la consolidation UK + IT — fait de la fiche CAMM un baromètre de l'autonomie capacitaire alliée hors écosystème Patriot/NASAMS.\n\nL'enjeu stratégique est explicite : pour une nation qui ne veut pas s'enfermer dans NASAMS (et donc l'AMRAAM ITAR), CAMM est l'option crédible. Cette polarité Patriot/NASAMS vs Aster/CAMM est devenue structurante du marché européen de la défense aérienne.",
      indicators: [
        {
          label: "Fonction stratégique",
          value:
            "Pilier SHORAD/MRAD européen non-ITAR — alternative à NASAMS",
          confidence: "haute",
          sources: ["mbda-camm"],
        },
        {
          label: "Régime applicable",
          value:
            "Contrôle UK + IT + Position commune UE — hors ITAR",
          confidence: "haute",
          sources: ["eu-cp-944"],
        },
        {
          label: "Effet structurant",
          value:
            "Couplage CAMM + Aster forme l'option défense aérienne européenne complète",
          confidence: "haute",
          sources: ["mbda-camm"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "L'export CAMM est dynamique : Royaume-Uni, Italie, Pologne (Narew), Brésil, Chili, Nouvelle-Zélande, Suède (FMV), Espagne, Émirats arabes unis sont les utilisateurs ou prospects confirmés. La modularité du missile permet à chaque opérateur de l'intégrer sur sa plateforme nationale — l'argument central de la promotion MBDA.\n\nLes contrôles UK et IT s'appliquent ; la Position commune UE structure les critères de transfert. L'absence d'ITAR fluidifie les arbitrages et explique la diversité géographique des prospects.",
      indicators: [
        {
          label: "Canal d'export dominant",
          value:
            "DCS / cooperatif — contrats nationaux MBDA, programmes communs",
          confidence: "haute",
          sources: ["mbda-camm"],
        },
        {
          label: "Régime applicable",
          value:
            "Contrôles UK + IT + Position commune UE — hors ITAR",
          confidence: "haute",
          sources: ["eu-cp-944"],
        },
        {
          label: "Utilisateurs export",
          value:
            "UK, IT, Pologne, Brésil, Chili, NZ, Suède (sélection), ES, UAE",
          confidence: "haute",
          sources: ["mbda-camm"],
        },
      ],
    },
  ],
  variants: [
    {
      label: "Sea Ceptor (CAMM)",
      value:
        "Standard naval initial — Type 23, Type 26, Type 31, FREMM IT",
      confidence: "haute",
      sources: ["mbda-camm"],
    },
    {
      label: "Sky Sabre (CAMM)",
      value:
        "Standard terrestre UK — Land Ceptor déployé en Europe (Pologne notamment)",
      confidence: "haute",
      sources: ["uk-mod-camm"],
    },
    {
      label: "CAMM-ER",
      value:
        "Extended Range — portée ≈ 45 km, MBDA Italia maître d'œuvre",
      confidence: "haute",
      sources: ["mbda-camm"],
    },
    {
      label: "CAMM-MR (futur)",
      value:
        "Medium Range — extension supplémentaire annoncée, calendrier en cours",
      confidence: "moyenne",
      status: "a-recouper",
      sources: ["mbda-camm"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Bon ratio coût-effet pour le segment SHORAD/MRAD ; densité de feu élevée par cellule.",
    },
    {
      key: "survivabilite",
      grade: "B",
      rationale:
        "Soft vertical launch + RF actif + datalink — l'un des meilleurs SHORAD européens contre menaces saturantes.",
    },
    {
      key: "exportabilite",
      grade: "A",
      rationale:
        "Hors ITAR, multi-canal, exporté largement — l'effecteur SHORAD/MRAD européen le plus diffusé.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Chaîne MBDA UK + IT mature ; cadence en concomitance avec autres programmes prioritaires.",
    },
    {
      key: "maturite",
      grade: "A",
      rationale:
        "En service depuis 2018, marine et terre éprouvées ; CAMM-ER en montée.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "UK MOD et MBDA publient l'essentiel ; performances précises classifiées.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un missile naval converti pour la terre. La réalité : un effecteur conçu d'emblée comme modulaire — la même munition équipe Sea Ceptor, Sky Sabre, EMADS et les contrats export, ce qui structure différemment le soutien et la formation.",
    bestUseCase:
      "Doter une marine ou une force terrestre d'un SHORAD/MRAD européen non-ITAR à densité de feu élevée, capable d'engager drones, missiles de croisière et aéronefs en couche courte/moyenne.",
    weakPoint:
      "La portée intrinsèque reste limitée pour les menaces longue portée — CAMM est complémentaire d'un Aster, pas un remplaçant.",
    analystNote:
      "CAMM est devenu l'instrument de la diversification européenne hors NASAMS. Sa sélection par la Pologne pour Narew confirme la maturité commerciale. À suivre — l'avancée CAMM-MR et l'élargissement du parc terrestre dans le cadre des annonces European Sky Shield.",
  },
  operators: [
    "Royaume-Uni",
    "Italie",
    "Pologne (Narew)",
    "Brésil",
    "Chili",
    "Nouvelle-Zélande",
    "Suède (sélection)",
    "Espagne",
    "Émirats arabes unis",
  ],
  theatres: [
    "Mer Rouge — interceptions documentées par frégates Type 23 (Sea Ceptor)",
    "Méditerranée — défense aérienne",
    "Pologne — déploiement Sky Sabre par l'armée britannique",
  ],
  timeline: [
    {
      date: "2018",
      label:
        "Mise en service initiale Sea Ceptor — Royal Navy, Type 23.",
      kind: "jalon",
    },
    {
      date: "2021",
      label:
        "Sky Sabre déployé par l'UK Army — successeur du Rapier.",
      kind: "jalon",
    },
    {
      date: "2022",
      label:
        "Sélection par la Pologne pour le programme Narew — défense de zone.",
      kind: "export",
    },
    {
      date: "2024",
      label:
        "Interceptions opérationnelles documentées en mer Rouge — Sea Ceptor sur frégates UK.",
      kind: "emploi",
    },
  ],
  sources: [
    {
      id: "mbda-camm",
      title: "Famille CAMM — pages produit",
      publisher: "MBDA",
      type: "constructeur",
      reliability: "B",
      url: "https://www.mbda-systems.com/product/camm/",
    },
    {
      id: "uk-mod-camm",
      title:
        "Sea Ceptor / Sky Sabre — annonces UK Ministry of Defence",
      publisher: "UK Ministry of Defence",
      type: "officiel",
      reliability: "A",
      url: "https://www.gov.uk/government/organisations/ministry-of-defence",
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
