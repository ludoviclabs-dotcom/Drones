import type { DefenseSystem } from "../types";

export const mfStar: DefenseSystem = {
  slug: "mf-star",
  name: "EL/M-2248 MF-STAR",
  designation: "Multi-Function Surveillance, Track And Guidance Radar",
  reference: "PNP-RD-013",
  category: "radar",
  radarRole: "naval-mfr",
  classLabel:
    "Radar naval AESA multifonction à 4 faces fixes bande S — surveillance, conduite de tir et guidage missile",
  country: "Israël",
  flag: "🇮🇱",
  manufacturer: "IAI ELTA Systems",
  introduced: "2013",
  status:
    "En service — capteur principal des corvettes Saar 6 israéliennes et des destroyers Kolkata / Visakhapatnam indiens ; production active",
  acquisitionModes: ["DCS", "cooperatif"],
  tagline:
    "L'AESA naval israélien à panneaux fixes — surveillance, conduite de tir et guidage Barak missile, exporté largement hors écosystème américain Aegis.",
  summary:
    "L'EL/M-2248 MF-STAR est le radar naval AESA multifonction à quatre faces fixes développé par IAI ELTA Systems. Bande S, panneaux à modules T/R, il assume simultanément surveillance aérienne longue portée, conduite de tir, guidage missile (Barak 8) et surveillance de surface. C'est, avec Sea Fire et SPY-6, l'un des trois radars navals AESA multifonctions à panneaux fixes en service dans le monde occidental.\n\nLa fiche MF-STAR est, pour Panoplie, celle de la souveraineté radar navale israélienne et d'un cas-école d'export. Sa diffusion sur les corvettes Saar 6 israéliennes, les destroyers Kolkata / Visakhapatnam indiens, et son intégration progressive sur d'autres plateformes alliées d'Israël en font un produit pivot de la diplomatie d'armement navale israélienne.",
  keySpecs: [
    {
      label: "Architecture",
      value:
        "AESA bande S — 4 panneaux fixes en faces de superstructure, couverture 360° native",
      confidence: "haute",
      sources: ["iai-elta-mf-star"],
    },
    {
      label: "Portée publique",
      value:
        "> 250 km en surveillance aérienne (variante compacte) ; > 450 km sur variantes longue portée",
      confidence: "moyenne",
      sources: ["iai-elta-mf-star", "press-mf-star"],
    },
    {
      label: "Capacités simultanées",
      value:
        "Surveillance air, surveillance de surface, conduite de tir, guidage missile Barak 8, défense anti-missile naval — déclarées simultanées",
      confidence: "haute",
      sources: ["iai-elta-mf-star"],
    },
    {
      label: "Plateformes",
      value:
        "Saar 6 (Israël), Kolkata / Visakhapatnam (Inde), futures plateformes indiennes (Kalvari sub-derivative en discussion), corvettes Sa'ar 5 modernisées",
      confidence: "haute",
      sources: ["iai-elta-mf-star"],
    },
    {
      label: "Intégration C2",
      value:
        "Système de combat naval israélien, AAA Indian Navy, intégration Barak 8 / 8ER",
      confidence: "haute",
      sources: ["iai-elta-mf-star"],
    },
    {
      label: "Technologie RF",
      value:
        "Modules T/R bande S sous contrôle israélien — détail GaN non précisé homogène selon variante",
      confidence: "moyenne",
      status: "a-recouper",
      sources: ["iai-elta-mf-star"],
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
        "Le coût MF-STAR n'est pas publié de façon homogène par IAI ELTA. Les ordres de grandeur estimés tournent autour de 60-120 M$ par capteur intégré selon variante (longue portée ou compacte) et lot logistique. Pour les programmes export couplés à Barak 8 (Inde notamment), les contrats globaux atteignent plusieurs milliards de dollars.\n\nLa lecture coût n'a de sens qu'au niveau du système naval complet — capteur + lanceurs Barak 8 + intercepteurs + soutien. Le programme indien Kolkata / Visakhapatnam a structuré l'essentiel de la rentabilité industrielle MF-STAR sur la décennie 2010-2020.",
      indicators: [
        {
          label: "Coût unitaire capteur — estimation publique",
          value: "≈ 60 à 120 M$ par capteur intégré selon variante",
          confidence: "faible",
          status: "variable",
          sources: ["press-mf-star"],
        },
        {
          label: "Lecture économique",
          value:
            "Capteur + Barak 8 + intégration plateforme — système naval complet à plusieurs centaines de millions",
          confidence: "moyenne",
          sources: ["iai-elta-mf-star"],
        },
        {
          label: "MCO pluriannuel",
          value:
            "Significatif — capteur naval AESA complexe, mises à jour continues",
          confidence: "moyenne",
          sources: ["iai-elta-mf-star"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le programme MF-STAR est financé par le ministère israélien de la Défense (IMOD) pour les acquisitions nationales, et par les contrats export pour les clients étrangers. Le programme indien — destroyers Kolkata et Visakhapatnam, intégration Barak 8 — a fourni l'essentiel des volumes industriels MF-STAR sur la décennie 2010-2020, avec une coopération industrielle Inde-Israël structurante.\n\nLes pistes export post-2020 sont en discussion (Philippines, Vietnam, autres). L'adhésion croissante d'Israël à l'écosystème de coopération navale alliée multiplie les opportunités. La transparence financière reste limitée côté israélien et indien, conforme à la pratique sur les capteurs navals AESA stratégiques.",
      indicators: [
        {
          label: "Financeurs principaux",
          value:
            "IMOD (Israël) + Indian Navy / DRDO (Inde) + contrats export IAI ELTA",
          confidence: "haute",
          sources: ["iai-elta-mf-star"],
        },
        {
          label: "Programme indien structurant",
          value:
            "Kolkata, Visakhapatnam — essentiel des volumes MF-STAR sur la décennie 2010-2020",
          confidence: "haute",
          sources: ["press-mf-star"],
        },
        {
          label: "Pistes export en discussion",
          value:
            "Philippines, Vietnam, autres partenaires israéliens — détail variable",
          confidence: "moyenne",
          sources: ["press-mf-star"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne MF-STAR est entièrement israélienne, intégrée par IAI ELTA, avec coopération industrielle indienne pour certaines briques d'intégration (programme Make in India). Les modules T/R, le packaging RF, les calculateurs DSP et le logiciel sont produits sous contrôle israélien strict.\n\nLe risque industriel principal est partagé avec EL/M-2084 et Green Pine : base industrielle israélienne compacte face à une demande mondiale en forte croissance post-2022. La diversification des plateformes clientes (corvettes, destroyers, futures frégates) accroît la pression sur la cadence.",
      indicators: [
        {
          label: "Empreinte industrielle",
          value:
            "IAI ELTA Israël (intégration principale) + coopération industrielle indienne (assembly Make in India)",
          confidence: "haute",
          sources: ["iai-elta-mf-star"],
        },
        {
          label: "Technologie RF",
          value:
            "Modules T/R bande S sous contrôle israélien — détail GaN selon variante non précisé homogène",
          confidence: "moyenne",
          status: "a-recouper",
          sources: ["iai-elta-mf-star"],
        },
        {
          label: "Risque industriel principal",
          value:
            "Base industrielle compacte face à une demande mondiale en forte croissance ; pression cadence",
          confidence: "moyenne",
          sources: ["press-mf-star"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Le MF-STAR est un produit de souveraineté navale israélienne et un outil pivot de la diplomatie d'armement vers les marines partenaires. Le programme indien Kolkata / Visakhapatnam — capteur israélien sur plateforme indienne, missile Barak 8 codéveloppé Israël-Inde — est l'un des cas les plus aboutis de coopération technologique militaire stratégique non occidentale.\n\nL'absence d'ITAR sur la couche capteur en fait un produit privilégié pour les nations cherchant une capacité IAMD navale haut de gamme sans alignement Aegis. Pour Panoplie, MF-STAR documente concrètement qu'une chaîne capteur navale AESA multifonction hors écosystème américain existe et fonctionne.",
      indicators: [
        {
          label: "Souveraineté capteur",
          value:
            "Hors ITAR — chaîne israélienne, contrôle baseline et algorithmes",
          confidence: "haute",
          sources: ["iai-elta-mf-star"],
        },
        {
          label: "Coopération Israël-Inde",
          value:
            "Programme Kolkata / Visakhapatnam — coopération technologique militaire stratégique aboutie",
          confidence: "haute",
          sources: ["iai-elta-mf-star", "press-mf-star"],
        },
        {
          label: "Effet d'écosystème",
          value:
            "Alternative crédible à Aegis pour les marines moyennes — diplomatie d'armement israélienne",
          confidence: "moyenne",
          sources: ["iai-elta-mf-star"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "L'export MF-STAR est l'un des plus dynamiques du segment radar naval AESA non américain. Les clients confirmés couvrent Israël (Saar 6), Inde (Kolkata, Visakhapatnam, futures plateformes), et des discussions en cours avec plusieurs marines partenaires (Philippines, Vietnam, autres). Le canal dominant est DCS via IAI ELTA, sous licence DECA israélienne.\n\nLe régime applicable cumule contrôle DECA strict, Wassenaar pour les composants RF avancés, et régimes nationaux des pays clients. L'exportabilité reste modérée à élevée pour les nations partenaires d'Israël, modérée pour les autres compte tenu de la sensibilité capteur naval haut de gamme.",
      indicators: [
        {
          label: "Canal d'export dominant",
          value:
            "DCS via IAI ELTA — licence DECA israélienne, partenariats industriels selon contrat",
          confidence: "haute",
          sources: ["iai-elta-mf-star"],
        },
        {
          label: "Clients export confirmés",
          value:
            "Israël, Inde ; pistes Philippines, Vietnam, autres partenaires israéliens",
          confidence: "haute",
          sources: ["press-mf-star"],
        },
        {
          label: "Régime applicable",
          value:
            "Contrôle DECA + Wassenaar composants RF + régimes nationaux clients",
          confidence: "haute",
          sources: ["wassenaar-list"],
        },
      ],
    },
  ],
  integrationFrameworks: [
    "Système de combat naval israélien",
    "Barak 8 / 8ER (cohérence missile-capteur)",
    "AAA Indian Navy",
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Coût d'intégration élevé compensé par la couverture 360° native et la mutualisation avec Barak 8 ; bon positionnement face à SPY-6 et Sea Fire.",
    },
    {
      key: "survivabilite",
      grade: "B",
      rationale:
        "Capteur naval embarqué, panneaux fixes redondants, agilité de faisceau AESA ; ECCM précis classifiés.",
    },
    {
      key: "exportabilite",
      grade: "B",
      rationale:
        "Hors ITAR, exportabilité bonne pour les marines partenaires d'Israël ; un des meilleurs profils export du segment radar naval AESA non américain.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Chaîne IAI ELTA maîtrisée, mais base industrielle israélienne compacte face à la demande mondiale post-2022.",
    },
    {
      key: "maturite",
      grade: "A",
      rationale:
        "En service depuis 2013, déployé sur destroyers indiens et corvettes israéliennes, intégration Barak 8 éprouvée — produit pleinement mature.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "Sources IAI ELTA et presse spécialisée abondantes sur le rôle et l'architecture, mais paramètres techniques fins classifiés.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un SPY-6 israélien à coût modéré. La réalité : un excellent radar naval AESA multifonction, légèrement en retrait sur l'enveloppe BMD complète mais largement supérieur sur l'exportabilité et la souveraineté capteur — une équation différente de SPY-6.",
    bestUseCase:
      "Équiper une marine partenaire d'Israël (ou hors écosystème Aegis) d'une capacité IAMD navale 360° native — surveillance, conduite de tir et guidage Barak 8 — sans contrainte ITAR.",
    weakPoint:
      "L'écosystème missile-capteur couplé à Barak 8 — sans intercepteur compatible, l'intégration devient prohibitivement complexe. La base industrielle israélienne compacte est un point de pression réel.",
    analystNote:
      "MF-STAR est, pour Panoplie, l'archétype de la souveraineté radar navale AESA non américaine. Sa diffusion croissante post-2022 — particulièrement dans les marines partenaires d'Israël et les flottes des nations cherchant à éviter ITAR — fera de cette fiche un indicateur structurant pour la décennie 2020-2030.",
  },
  operators: [
    "Israël (Saar 6, Sa'ar 5 modernisées)",
    "Inde (Kolkata, Visakhapatnam — destroyers Project 15A / 15B)",
    "Pistes Philippines, Vietnam, autres partenaires — détail variable",
  ],
  theatres: [
    "Méditerranée orientale — défense aérienne navale israélienne",
    "Océan Indien — patrouille Indian Navy avec destroyers Kolkata / Visakhapatnam",
    "Mer Rouge — opérations israéliennes",
  ],
  timeline: [
    {
      date: "2013",
      label:
        "Première mise en service — destroyer indien Kolkata, premier client export structurant.",
      kind: "jalon",
    },
    {
      date: "2014",
      label:
        "Intégration Barak 8 — capteur et missile codéveloppés Israël-Inde.",
      kind: "jalon",
    },
    {
      date: "2020",
      label:
        "Entrée en service Saar 6 — capteur MF-STAR sur corvettes israéliennes nouvelle génération.",
      kind: "jalon",
    },
    {
      date: "2023",
      label:
        "Visakhapatnam Project 15B en service — extension de la base installée indienne.",
      kind: "jalon",
    },
    {
      date: "2024",
      label:
        "Pistes export post-2022 — discussions avec marines partenaires israéliennes documentées.",
      kind: "export",
    },
  ],
  sources: [
    {
      id: "iai-elta-mf-star",
      title: "EL/M-2248 MF-STAR — page IAI ELTA",
      publisher: "IAI ELTA Systems",
      type: "constructeur",
      reliability: "B",
      url: "https://www.iai.co.il/p/elm-2248",
    },
    {
      id: "press-mf-star",
      title:
        "MF-STAR — analyses publiques et presse spécialisée (Janes, défense)",
      publisher: "Presse spécialisée défense",
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
