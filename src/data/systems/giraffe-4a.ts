import type { DefenseSystem } from "../types";

export const giraffe4a: DefenseSystem = {
  slug: "giraffe-4a",
  name: "Giraffe 4A",
  designation: "Giraffe 4A",
  reference: "PNP-RD-008",
  category: "radar",
  radarRole: "multi-mission",
  classLabel:
    "Radar AESA multi-mission GaN — surveillance aérienne, weapon-locating, intégration C-UAS et défense aérienne courte / moyenne portée",
  country: "Suède",
  flag: "🇸🇪",
  manufacturer: "Saab",
  introduced: "2017",
  status:
    "En service — exporté vers plusieurs nations OTAN et partenaires, base d'une famille mise à jour régulièrement",
  acquisitionModes: ["DCS", "cooperatif"],
  tagline:
    "Le radar suédois multi-mission qui mise sur la souplesse — AESA GaN, déployable sur conteneur ou véhicule, conçu pour la défense aérienne tactique et la posture neutre devenue OTAN.",
  summary:
    "Le Giraffe 4A est le radar AESA bande S multi-mission développé par Saab pour assumer simultanément surveillance aérienne, weapon-locating, C-RAM / C-UAS, et conduite de tir pour des batteries sol-air courte ou moyenne portée. Mise à jour GaN et nouvelle baseline logicielle en font l'un des radars GBAD européens les plus récents et les plus compétitifs à l'export.\n\nLa fiche Giraffe 4A est, pour Panoplie, celle de la souveraineté radar nordique. Saab a longtemps incarné une voie indépendante — neutralité historique, puis adhésion OTAN en 2024 — qui se traduit industriellement par une chaîne capteur largement suédoise. Le Giraffe est désormais un produit pivot pour les pays cherchant un radar GBAD souverain hors écosystème franco-américain.",
  keySpecs: [
    {
      label: "Architecture",
      value:
        "AESA bande S — panneau plan rotatif, modules T/R GaN, taux de revisite élevé",
      confidence: "haute",
      sources: ["saab-giraffe-4a"],
    },
    {
      label: "Portée publique",
      value:
        "Jusqu'à 400 km en surveillance aérienne instrumentée selon Saab",
      confidence: "moyenne",
      sources: ["saab-giraffe-4a"],
    },
    {
      label: "Modes simultanés",
      value:
        "Surveillance aérienne, weapon-locating, C-RAM / C-UAS, conduite de tir, IFF, surveillance maritime côtière",
      confidence: "haute",
      sources: ["saab-giraffe-4a"],
    },
    {
      label: "Mobilité",
      value:
        "Container ISO standard ou véhicule tactique 4×4 / 8×8 — déploiement opérationnel rapide",
      confidence: "haute",
      sources: ["saab-giraffe-4a"],
    },
    {
      label: "Intégration C2",
      value:
        "Saab GroundView / 9LV, NATINAMDS, C2 nationaux clients — compatibilité OTAN éprouvée",
      confidence: "haute",
      sources: ["saab-giraffe-4a"],
    },
    {
      label: "Argument LCC constructeur",
      value:
        "Redondance des parties critiques, modularité GaN, upgrade logiciel — réduction de LCC revendiquée",
      confidence: "haute",
      sources: ["saab-giraffe-4a"],
    },
    {
      label: "Technologie RF",
      value: "Modules T/R GaN — production suédoise sous contrôle Saab",
      confidence: "haute",
      sources: ["saab-giraffe-4a"],
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
        "Le coût Giraffe 4A est partiellement public à travers les contrats export et les communications Saab. Les ordres de grandeur communément cités pour un capteur seul tournent autour de 15-25 M€, avec variabilité selon configuration (container ou véhicule) et lot logistique inclus. C'est un positionnement de prix compétitif face à GM200 et EL/M-2084, ciblant explicitement les nations moyennes cherchant une capacité GBAD souveraine.\n\nL'argument LCC de Saab insiste sur la modularité, la redondance et la maintenabilité. Comme pour les autres radars du segment, la lecture de Panoplie reste prudente : les promesses LCC s'évaluent sur cycle complet (25-30 ans), et les paramètres précis (heures de bon fonctionnement, taux de remplacement, coût des spares) ne sont pas publiés.",
      indicators: [
        {
          label: "Coût unitaire capteur — ordre de grandeur public",
          value: "≈ 15 à 25 M€ par capteur selon configuration et lot",
          confidence: "moyenne",
          status: "a-recouper",
          sources: ["saab-giraffe-4a"],
        },
        {
          label: "Positionnement marché",
          value:
            "Compétitif vs GM200 et EL/M-2084 — cible nations moyennes et flotte navale légère",
          confidence: "moyenne",
          sources: ["saab-giraffe-4a"],
        },
        {
          label: "Argument LCC constructeur",
          value:
            "Modularité GaN, redondance critique, upgrade logiciel — réduction de LCC revendiquée",
          confidence: "haute",
          sources: ["saab-giraffe-4a"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le programme Giraffe est financé principalement par l'Agence suédoise du matériel de défense (FMV) pour les acquisitions nationales, et par Saab pour le développement export. Les contrats export documentés couvrent plusieurs nations OTAN et partenaires : Estonie, Lettonie, Royaume-Uni (Sky Sabre), République tchèque, Polynésie (etc.), avec une accélération nette post-2022.\n\nL'adhésion suédoise à l'OTAN en 2024 a renforcé la position de Saab dans l'écosystème de défense aérienne allié, en particulier sur le flanc Est. La transparence financière reste limitée comparée aux programmes US, conformément à la pratique européenne du secret commercial sur les contrats radar.",
      indicators: [
        {
          label: "Financeurs principaux",
          value:
            "FMV (Suède) pour le national + contrats export Saab — financement industriel suédois",
          confidence: "haute",
          sources: ["saab-giraffe-4a"],
        },
        {
          label: "Contrats export documentés",
          value:
            "Estonie, Lettonie, Royaume-Uni (Sky Sabre), République tchèque, autres — accélération post-2022",
          confidence: "haute",
          sources: ["press-giraffe-export"],
        },
        {
          label: "Effet adhésion OTAN suédoise",
          value:
            "Renforcement de l'écosystème Saab dans la défense aérienne alliée — particulièrement flanc Est",
          confidence: "moyenne",
          sources: ["saab-giraffe-4a"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne Giraffe 4A est largement suédoise, intégrée par Saab à Göteborg. Les modules T/R GaN, le packaging RF, les calculateurs DSP et le logiciel sont produits sous contrôle Saab. Cette souveraineté capteur est un argument de vente structurant face aux radars américains ITAR.\n\nLe risque industriel principal est celui d'une base industrielle relativement compacte face à une demande européenne post-2022 en forte croissance. Saab a accéléré ses investissements industriels mais reste un acteur de taille intermédiaire face à RTX ou Thales. La pression sur les semiconducteurs RF avancés constitue un nœud de tension partagé avec les autres radars européens.",
      indicators: [
        {
          label: "Empreinte industrielle",
          value: "Saab — chaîne entièrement suédoise, intégration à Göteborg",
          confidence: "haute",
          sources: ["saab-giraffe-4a"],
        },
        {
          label: "Technologie RF",
          value: "Modules T/R GaN — production suédoise sous contrôle Saab",
          confidence: "haute",
          sources: ["saab-giraffe-4a"],
        },
        {
          label: "Risque industriel principal",
          value:
            "Base industrielle compacte face à une demande européenne en forte croissance",
          confidence: "moyenne",
          sources: ["press-giraffe-export"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Le Giraffe 4A documente une trajectoire géopolitique singulière : il porte l'industrie de défense d'un pays historiquement neutre, devenu membre OTAN en 2024. L'adhésion suédoise modifie en profondeur la valeur stratégique du produit : d'un radar « hors blocs » à un radar pleinement intégré à l'architecture alliée.\n\nPour les nations clientes, choisir Giraffe 4A reste un signal de souveraineté capteur hors ITAR, intégrable dans NATINAMDS sans dépendance américaine sur la couche radar. Saab cultive depuis longtemps cette image de partenaire pragmatique et autonome — un positionnement renforcé par l'accélération post-2022 et par l'adhésion OTAN.",
      indicators: [
        {
          label: "Souveraineté capteur",
          value:
            "Hors ITAR — chaîne suédoise intégrée, contrôle baseline logicielle",
          confidence: "haute",
          sources: ["saab-giraffe-4a"],
        },
        {
          label: "Effet adhésion OTAN suédoise (2024)",
          value:
            "Intégration pleine à NATINAMDS — passage de « hors blocs » à pleinement allié",
          confidence: "haute",
          sources: ["nato-iamd-radar"],
        },
        {
          label: "Positionnement industriel",
          value:
            "Partenaire pragmatique de taille intermédiaire — alternative crédible aux grands radariers RTX, Thales, Leonardo, IAI ELTA",
          confidence: "moyenne",
          sources: ["saab-giraffe-4a"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "Le Giraffe 4A est l'un des radars GBAD européens les plus exportés depuis 2017. Les clients documentés couvrent plusieurs nations OTAN (Estonie, Lettonie, République tchèque), le Royaume-Uni (via le système Sky Sabre / Land Ceptor), des partenaires hors Europe, et la flotte suédoise nationale. Le canal dominant est DCS via Saab, sous licence ISP (Inspectorate of Strategic Products, Suède).\n\nLe régime applicable cumule contrôle suédois ISP, régimes nationaux des pays clients, et Wassenaar pour les composants RF avancés. L'exportabilité reste élevée — l'absence d'ITAR et l'image de partenaire pragmatique de Saab en font un produit de choix pour les nations cherchant un radar GBAD moderne hors écosystème franco-américain.",
      indicators: [
        {
          label: "Canal d'export dominant",
          value:
            "DCS via Saab — licence ISP (Inspectorate of Strategic Products, Suède)",
          confidence: "haute",
          sources: ["saab-giraffe-4a"],
        },
        {
          label: "Clients export documentés",
          value:
            "Estonie, Lettonie, Royaume-Uni (Sky Sabre / Land Ceptor), République tchèque, France (en évaluation), autres",
          confidence: "haute",
          sources: ["press-giraffe-export"],
        },
        {
          label: "Régime applicable",
          value:
            "Contrôle ISP suédois + régimes nationaux clients + Wassenaar composants RF",
          confidence: "haute",
          sources: ["wassenaar-list"],
        },
      ],
    },
  ],
  integrationFrameworks: [
    "NATINAMDS",
    "Sky Sabre / Land Ceptor (UK)",
    "Saab 9LV (naval)",
    "C2 nationaux multiples",
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "A",
      rationale:
        "Positionnement de prix compétitif pour un AESA GaN multi-mission, déploiement rapide, modularité ; bon rapport capacité / coût pour les nations moyennes.",
    },
    {
      key: "survivabilite",
      grade: "B",
      rationale:
        "Mobilité tactique forte (container ou véhicule), agilité de faisceau AESA, redondance des sous-systèmes critiques ; ECCM précis classifiés.",
    },
    {
      key: "exportabilite",
      grade: "A",
      rationale:
        "Hors ITAR, largement exporté, image de partenaire pragmatique — un des meilleurs profils export du segment radar GBAD européen.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Chaîne suédoise maîtrisée par Saab ; base industrielle compacte face à la demande européenne post-2022 — pression réelle.",
    },
    {
      key: "maturite",
      grade: "A",
      rationale:
        "En service depuis 2017, déployé chez plusieurs nations OTAN, intégrations multiples documentées — produit pleinement mature.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "Sources Saab et contrats export documentés, mais paramètres techniques fins (TRM, ECCM, baselines) classifiés.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un petit radar suédois pratique mais limité. La réalité : un AESA GaN multi-mission compétitif face aux radars beaucoup plus chers, à condition d'accepter qu'il ne joue pas dans la cour des capteurs IAMD haut de gamme type SPY-6 ou LTAMDS.",
    bestUseCase:
      "Équiper une nation moyenne d'un radar GBAD souverain hors ITAR, déployable en container ou véhicule, intégrable dans NATINAMDS et dans des C2 nationaux, à un coût d'entrée maîtrisé.",
    weakPoint:
      "La base industrielle compacte de Saab face à la demande européenne post-2022 — la cadence de production peut devenir un goulot pour les commandes nouvelles. Et l'absence de fiche d'identité claire sur certains paramètres techniques fins.",
    analystNote:
      "Le Giraffe 4A documente concrètement la pertinence d'un acteur radar de taille intermédiaire dans l'écosystème européen. L'adhésion OTAN suédoise renforce sa valeur géopolitique sans rompre son positionnement industriel souverain. Pour Panoplie, c'est l'archétype du radar GBAD européen multi-rôle, à comparer méthodiquement avec GM200 et EL/M-2084.",
  },
  operators: [
    "Suède (FMV)",
    "Estonie",
    "Lettonie",
    "Royaume-Uni (Sky Sabre / Land Ceptor)",
    "République tchèque",
    "France (en évaluation publique)",
    "Autres partenaires Saab — détail variable selon contrats",
  ],
  theatres: [
    "Défense aérienne nationale suédoise — couverture territoriale",
    "Défense aérienne flanc Est OTAN — Estonie, Lettonie, République tchèque",
    "Défense aérienne britannique — composante Sky Sabre / Land Ceptor",
  ],
  timeline: [
    {
      date: "2014",
      label: "Lancement du programme Giraffe 4A — successeur AESA des Giraffe AMB.",
      kind: "jalon",
    },
    {
      date: "2017",
      label: "Entrée en service initiale — premier client Saab.",
      kind: "jalon",
    },
    {
      date: "2020",
      label:
        "Intégration au système britannique Sky Sabre / Land Ceptor — déploiement opérationnel.",
      kind: "emploi",
    },
    {
      date: "2022",
      label:
        "Accélération des commandes post-invasion russe — Estonie, Lettonie, République tchèque.",
      kind: "export",
    },
    {
      date: "2024",
      label:
        "Adhésion suédoise à l'OTAN — intégration pleine à NATINAMDS, renforcement de la position Saab.",
      kind: "jalon",
    },
  ],
  sources: [
    {
      id: "saab-giraffe-4a",
      title: "Giraffe 4A — page produit Saab",
      publisher: "Saab",
      type: "constructeur",
      reliability: "B",
      url: "https://www.saab.com/products/giraffe-4a",
    },
    {
      id: "press-giraffe-export",
      title:
        "Contrats Giraffe 4A — dépêches Saab et presse spécialisée défense post-2022",
      publisher: "Saab / presse spécialisée",
      type: "presse",
      reliability: "B",
    },
    {
      id: "nato-iamd-radar",
      title:
        "NATINAMDS et intégration radar — communications OTAN et analyses ouvertes",
      publisher: "OTAN",
      type: "officiel",
      reliability: "A",
      url: "https://www.nato.int/cps/en/natohq/topics_8206.htm",
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
