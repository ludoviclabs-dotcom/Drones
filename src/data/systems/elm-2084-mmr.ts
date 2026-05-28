import type { DefenseSystem } from "../types";

export const elm2084Mmr: DefenseSystem = {
  slug: "elm-2084-mmr",
  name: "EL/M-2084 MMR",
  designation: "Multi-Mission Radar",
  reference: "PNP-RD-006",
  category: "radar",
  radarRole: "multi-mission",
  classLabel:
    "Radar AESA multi-mission bande S — Iron Dome, David's Sling, SPYDER, weapon-locating",
  country: "Israël",
  flag: "🇮🇱",
  manufacturer: "IAI ELTA Systems",
  introduced: "2011",
  status:
    "En service — base radar d'Iron Dome, David's Sling et SPYDER ; variante MS-MMR (multi-capteur) en déploiement",
  acquisitionModes: ["DCS", "cooperatif"],
  tagline:
    "Le radar qui rend Iron Dome possible — un AESA bande S multi-mission conçu pour la complexité du théâtre israélien, exporté largement sans contrainte ITAR.",
  summary:
    "L'EL/M-2084 MMR est un radar AESA bande S à panneau plan rotatif conçu par IAI ELTA pour assurer simultanément la surveillance aérienne, la détection de roquettes / obus / mortiers (C-RAM), le suivi de menaces balistiques tactiques et la conduite de tir au profit d'une batterie sol-air. C'est le capteur de base d'Iron Dome, de David's Sling et de SPYDER ; il équipe également de nombreux clients export sans intégration israélienne.\n\nLa fiche EL/M-2084 est, pour Panoplie, celle du radar GBAD le plus opérationnellement éprouvé du catalogue. Iron Dome a effectué des milliers d'interceptions documentées depuis 2011 ; chaque cycle d'engagement est passé par un EL/M-2084. L'exportabilité hors ITAR en fait un produit pivot pour les nations cherchant une capacité C-RAM / C-UAS / défense aérienne tactique sans dépendance américaine.",
  keySpecs: [
    {
      label: "Architecture",
      value:
        "AESA bande S — panneau plan rotatif, modules T/R GaN (variante récente)",
      confidence: "haute",
      sources: ["iai-elta-elm2084"],
    },
    {
      label: "Modes simultanés",
      value:
        "Surveillance aérienne, weapon-locating (C-RAM), suivi balistique tactique, conduite de tir, IFF",
      confidence: "haute",
      sources: ["iai-elta-elm2084"],
    },
    {
      label: "Variantes documentées",
      value:
        "MMR — base ; MS-MMR (Multi-Sensor) — couche passive, EO/IR, IFF, ADS-B intégrés",
      confidence: "haute",
      sources: ["iai-elta-elm2084", "ms-mmr-press"],
    },
    {
      label: "Portée selon mode",
      value:
        "Variable — non publiée homogène ; ordres de grandeur publics : dizaines de km en C-RAM, centaines de km en surveillance aérienne",
      confidence: "moyenne",
      status: "a-recouper",
      sources: ["iai-elta-elm2084"],
    },
    {
      label: "Intégration C2",
      value:
        "Iron Dome, David's Sling, SPYDER, C2 nationaux clients export",
      confidence: "haute",
      sources: ["iai-elta-elm2084"],
    },
    {
      label: "Mobilité",
      value: "Transportable sur véhicule tactique — déploiement opérationnel rapide",
      confidence: "haute",
      sources: ["iai-elta-elm2084"],
    },
    {
      label: "PRF, formes d'onde, algorithmes de discrimination C-RAM",
      value: "Non précisé publiquement",
      confidence: "faible",
      status: "variable",
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le coût EL/M-2084 est partiellement public à travers les contrats export et certaines acquisitions documentées. Les ordres de grandeur communément cités pour un capteur seul tournent autour de 25-50 M$, avec une variabilité forte selon la configuration MMR ou MS-MMR et le lot logistique inclus. Le coût d'une batterie Iron Dome complète (capteur + lanceurs + intercepteurs + soutien) atteint des centaines de millions de dollars.\n\nLa lecture coût n'a de sens qu'au niveau du système complet, et inclut le coût des effecteurs Tamir (Iron Dome) ou Stunner (David's Sling). Le rapport coût-effet d'Iron Dome a fait l'objet de débats publics intenses : un intercepteur Tamir à environ 50 k$ contre une roquette artisanale à quelques centaines de dollars pose une équation économique structurelle.",
      indicators: [
        {
          label: "Coût unitaire capteur — ordre de grandeur public",
          value: "≈ 25 à 50 M$ par capteur selon variante (MMR / MS-MMR) et lot",
          confidence: "moyenne",
          status: "a-recouper",
          sources: ["iai-elta-elm2084", "press-iron-dome-cost"],
        },
        {
          label: "Coût batterie Iron Dome complète",
          value:
            "Plusieurs centaines de millions de dollars — capteur + lanceurs + lot Tamir + soutien",
          confidence: "haute",
          sources: ["press-iron-dome-cost"],
        },
        {
          label: "Équation coût-effet C-RAM",
          value:
            "Tamir ≈ 50 k$ contre roquettes adverses à coût très inférieur — débat doctrinal et politique",
          confidence: "moyenne",
          sources: ["press-iron-dome-cost"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le programme MMR est financé principalement par le ministère israélien de la Défense (IMOD), avec contribution substantielle du US DoD via les programmes de coopération bilatérale (Foreign Military Financing, programmes Iron Dome). Les contrats export sont commercialisés par IAI ELTA, souvent assortis de transferts technologiques et de partenariats industriels locaux.\n\nLa transparence financière côté israélien reste limitée par rapport aux programmes US. Côté américain, les contributions Iron Dome sont publiques via les justifications budgétaires US Army et State Department. Les contrats export documentés (Inde, Canada, Finlande, République tchèque, Azerbaïdjan) couvrent des centaines de millions de dollars cumulés.",
      indicators: [
        {
          label: "Financeurs principaux",
          value:
            "IMOD (Israël) + US DoD (Iron Dome) + contrats export IAI ELTA",
          confidence: "haute",
          sources: ["iai-elta-elm2084", "us-state-iron-dome"],
        },
        {
          label: "Contrats export documentés",
          value:
            "Inde, Canada (MSPS), Finlande, République tchèque (David's Sling), Azerbaïdjan, autres",
          confidence: "haute",
          sources: ["press-elm2084-export"],
        },
        {
          label: "Modèle commercial",
          value:
            "DCS + partenariats industriels — transferts technologiques selon contrat",
          confidence: "haute",
          sources: ["iai-elta-elm2084"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne EL/M-2084 est entièrement israélienne, intégrée par IAI ELTA. Les modules T/R, le packaging RF, les calculateurs DSP et le logiciel sont produits sous contrôle israélien strict. Cette souveraineté capteur est un argument de vente majeur d'IAI ELTA face aux radars américains soumis à ITAR.\n\nLe risque industriel principal est celui de la cadence : Iron Dome a fait l'objet de demandes massives post-2022 (notamment du US Marine Corps qui a acquis le système comme MRIC — Medium Range Intercept Capability), et le marché export a explosé après les démonstrations opérationnelles de 2021 et 2023. IAI ELTA doit tenir la cadence sur une base industrielle relativement compacte.",
      indicators: [
        {
          label: "Empreinte industrielle",
          value: "IAI ELTA — chaîne entièrement israélienne, souveraineté capteur",
          confidence: "haute",
          sources: ["iai-elta-elm2084"],
        },
        {
          label: "Technologie RF",
          value:
            "Modules T/R GaN sur variante récente — production israélienne",
          confidence: "moyenne",
          status: "a-recouper",
          sources: ["iai-elta-elm2084"],
        },
        {
          label: "Risque industriel principal",
          value:
            "Cadence face à la demande post-2022 ; base industrielle compacte, montée en puissance contrainte",
          confidence: "moyenne",
          sources: ["press-elm2084-export"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "L'EL/M-2084 est un produit de souveraineté israélien et un acte d'alignement implicite. Adopter Iron Dome ou David's Sling, c'est entrer dans l'écosystème industriel et doctrinal israélien — et accepter une dépendance partielle aux mises à jour, à la formation et aux pièces fournies par IAI ELTA. C'est aussi accéder à une capacité opérationnellement éprouvée que peu d'autres systèmes peuvent revendiquer.\n\nLa diffusion croissante du système, notamment au sein de l'OTAN (Roumanie SPYDER, République tchèque David's Sling, Allemagne Arrow 3) crée un effet d'écosystème nouveau. Pour Panoplie, EL/M-2084 documente un cas-école : un capteur radar n'a pas besoin d'être américain ou européen pour structurer une partie de la défense aérienne occidentale.",
      indicators: [
        {
          label: "Souveraineté capteur",
          value: "Hors ITAR sur le radar — composants RF israéliens, contrôle baseline",
          confidence: "haute",
          sources: ["iai-elta-elm2084"],
        },
        {
          label: "Position dans l'OTAN",
          value:
            "Diffusion croissante dans les architectures de défense aérienne alliées — Roumanie, République tchèque, Allemagne, autres",
          confidence: "haute",
          sources: ["press-elm2084-export"],
        },
        {
          label: "Dépendance partielle",
          value:
            "Mises à jour, formation, pièces fournies par IAI ELTA — alignement industriel implicite",
          confidence: "moyenne",
          sources: ["iai-elta-elm2084"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "L'EL/M-2084 est l'un des radars GBAD les plus exportés au monde. Les clients documentés couvrent Israël (Iron Dome, David's Sling, SPYDER), Inde (intégration nationale), Canada (Medium-Range Sensor Project), Finlande, République tchèque (David's Sling), Azerbaïdjan, Singapour, et plusieurs autres nations. Le canal dominant est DCS via IAI ELTA, sous licence du ministère israélien de la Défense (DECA).\n\nL'exportabilité est élevée — l'absence d'ITAR sur la couche capteur en fait un produit de choix face aux radars américains. Le régime applicable combine contrôle israélien DECA et, pour les composants RF avancés, les régimes de contrôle des exports nationaux des clients (Wassenaar dans le cas européen).",
      indicators: [
        {
          label: "Canal d'export dominant",
          value:
            "DCS via IAI ELTA — licence DECA (ministère israélien de la Défense)",
          confidence: "haute",
          sources: ["iai-elta-elm2084"],
        },
        {
          label: "Nombre d'utilisateurs documentés",
          value:
            "≈ 10+ nations — Iron Dome, David's Sling, SPYDER, contrats radar seul",
          confidence: "haute",
          sources: ["press-elm2084-export"],
        },
        {
          label: "Régime applicable",
          value:
            "Contrôle israélien DECA + Wassenaar (composants RF avancés) + régimes nationaux clients",
          confidence: "haute",
          sources: ["wassenaar-list"],
        },
      ],
    },
  ],
  integrationFrameworks: [
    "Iron Dome",
    "David's Sling",
    "SPYDER",
    "C2 nationaux multiples",
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Coût unitaire modéré pour un AESA multi-mission ; équation coût-effet C-RAM débattue mais validée par milliers d'engagements opérationnels.",
    },
    {
      key: "survivabilite",
      grade: "B",
      rationale:
        "Mobilité tactique, agilité de faisceau AESA, intégration multi-capteur (MS-MMR) ; ECCM éprouvés en conditions réelles répétées.",
    },
    {
      key: "exportabilite",
      grade: "A",
      rationale:
        "Très largement exporté, hors ITAR, intégrable dans des C2 hétérogènes — un des meilleurs profils export du segment radar GBAD.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Chaîne israélienne maîtrisée par IAI ELTA ; cadence face à la demande post-2022 à surveiller.",
    },
    {
      key: "maturite",
      grade: "A",
      rationale:
        "En service depuis 2011, des milliers d'engagements Iron Dome documentés, base d'une famille de systèmes exportés — produit pleinement mature.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "Sources IAI ELTA, US State Department (Iron Dome) et presse spécialisée abondantes, mais paramètres techniques fins (TRM, algorithmes C-RAM, ECCM) non publiés.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un radar « parfait » qui rend Iron Dome impénétrable. La réalité : un AESA multi-mission solide dont la performance opérationnelle dépend autant de l'algorithmique C-RAM et du C2 que de l'antenne. Iron Dome n'est pas infaillible ; il est rentable face à un certain spectre de menaces.",
    bestUseCase:
      "Équiper une nation cherchant une capacité C-RAM, C-UAS et défense aérienne tactique solide, hors ITAR, intégrable dans son C2 national et industriellement maîtrisée par un partenaire fiable hors États-Unis.",
    weakPoint:
      "La dépendance fournisseur unique à IAI ELTA pour les mises à jour, les pièces et la formation. Et l'équation coût-effet C-RAM, structurellement asymétrique face à des menaces très bon marché.",
    analystNote:
      "EL/M-2084 est, à l'échelle du catalogue Panoplie, le radar GBAD le mieux validé opérationnellement. Pour les analystes, il documente concrètement deux réalités : la souveraineté radar israélienne face aux États-Unis, et l'efficacité réelle d'un capteur AESA multi-mission éprouvé en conditions de combat répétées sur deux décennies.",
  },
  operators: [
    "Israël (Iron Dome, David's Sling, SPYDER)",
    "Inde",
    "Canada (Medium-Range Sensor Project)",
    "Finlande",
    "République tchèque (David's Sling — programme en cours)",
    "Azerbaïdjan",
    "Singapour",
    "États-Unis (USMC — MRIC, Iron Dome adapté)",
    "Roumanie (SPYDER)",
    "Allemagne (programme Arrow 3 — capteurs adjacents)",
  ],
  theatres: [
    "Théâtre israélien — Iron Dome contre roquettes et drones, milliers d'engagements documentés depuis 2011",
    "Théâtre indien — intégration nationale, surveillance aérienne",
    "Théâtre européen — Roumanie, République tchèque, Finlande, exports post-2022",
  ],
  timeline: [
    {
      date: "2011",
      label:
        "Entrée en service Iron Dome — premier emploi opérationnel documenté.",
      kind: "jalon",
    },
    {
      date: "2014",
      label:
        "Opération Bordure protectrice — emploi massif Iron Dome, démonstration grand public d'efficacité.",
      kind: "emploi",
    },
    {
      date: "2017",
      label: "Entrée en service David's Sling — extension de la couverture israélienne.",
      kind: "jalon",
    },
    {
      date: "2022",
      label:
        "Adoption MRIC par l'USMC — Iron Dome adapté pour usage US, contrat structurant.",
      kind: "export",
    },
    {
      date: "2023",
      label:
        "Lancement variante MS-MMR (Multi-Sensor) — intégration capteurs passifs et EO/IR.",
      kind: "jalon",
    },
    {
      date: "2024",
      label:
        "Commandes David's Sling République tchèque, accélération des contrats post-2022.",
      kind: "export",
    },
  ],
  sources: [
    {
      id: "iai-elta-elm2084",
      title: "EL/M-2084 — page produit IAI ELTA",
      publisher: "IAI ELTA Systems",
      type: "constructeur",
      reliability: "B",
      url: "https://www.iai.co.il/p/elm-2084",
    },
    {
      id: "ms-mmr-press",
      title: "EL/M-2084 MS-MMR — communications IAI ELTA et presse spécialisée",
      publisher: "IAI ELTA / presse spécialisée",
      type: "constructeur",
      reliability: "B",
    },
    {
      id: "us-state-iron-dome",
      title:
        "US-Israel Iron Dome cooperation — State Department & US Army budget justifications",
      publisher: "US State Department / US Army",
      type: "officiel",
      reliability: "A",
      url: "https://www.state.gov/",
    },
    {
      id: "press-iron-dome-cost",
      title:
        "Iron Dome — analyses coût-effet ouvertes (CSIS, Brookings, presse spécialisée)",
      publisher: "Think tanks et presse spécialisée défense",
      type: "think-tank",
      reliability: "B",
    },
    {
      id: "press-elm2084-export",
      title:
        "EL/M-2084 contrats export — dépêches IAI ELTA et presse spécialisée",
      publisher: "IAI ELTA / presse spécialisée",
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
