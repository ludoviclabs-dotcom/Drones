import type { DefenseSystem } from "../types";

export const f35: DefenseSystem = {
  slug: "f-35",
  name: "F-35 Lightning II",
  designation: "F-35A / B / C",
  reference: "PNP-AC-004",
  category: "combat-aircraft",
  combatAircraftClass: "gen-5",
  classLabel: "Chasseur furtif multirôle",
  country: "États-Unis",
  flag: "🇺🇸",
  manufacturer: "Lockheed Martin",
  introduced: "2015",
  status: "En service — programme global ; modernisation TR-3 / Block 4 retardée",
  naval:
    "Oui — F-35B à décollage court et atterrissage vertical (STOVL) ; F-35C naval CATOBAR de l'US Navy.",
  acquisitionModes: ["FMS", "cooperatif"],
  tagline:
    "L'avion-programme — capteur, nœud de réseau et plateforme de frappe ; et un coût de possession sans précédent.",
  summary:
    "Le F-35 Lightning II est moins un chasseur qu'un programme : trois variantes — A conventionnelle, B à décollage court, C navale — partageant une furtivité native, une fusion de capteurs poussée et une architecture logicielle profonde. C'est l'avion de combat le plus produit de sa génération, choisi par les États-Unis et une vingtaine de nations alliées.\n\nMais sa lecture économique est aussi vertigineuse que ses capacités. Le programme cumule retards logiciels — la modernisation TR-3 / Block 4 a glissé de plusieurs années —, surcoûts et un coût de maintien en condition estimé en milliers de milliards de dollars sur le cycle de vie. Le F-35 illustre, mieux qu'aucun autre, qu'un chasseur de 5e génération s'achète moins qu'il ne s'abonne.",
  keySpecs: [
    {
      label: "Équipage",
      value: "1",
      confidence: "haute",
      sources: ["lockheed"],
    },
    {
      label: "Motorisation",
      value: "1 × Pratt & Whitney F135",
      confidence: "haute",
      sources: ["lockheed"],
    },
    {
      label: "Capteur principal",
      value: "Radar AESA · fusion de capteurs (DAS, EOTS)",
      confidence: "haute",
      sources: ["lockheed"],
    },
    {
      label: "Furtivité",
      value: "Conçue dès l'origine — armement en soute interne",
      confidence: "haute",
      sources: ["lockheed"],
    },
    {
      label: "Standard de modernisation",
      value: "TR-3 / Block 4 — version réduite, achèvement visé vers 2031",
      confidence: "moyenne",
      sources: ["gao"],
    },
    {
      label: "Parc livré",
      value: "Plus de 1 100 appareils — livraisons de 170 à 190 par an",
      confidence: "moyenne",
      sources: ["lockheed", "defense-news"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le F-35 est l'exemple type du coût qu'on ne peut pas lire au prix de cellule. Le coût d'acquisition unitaire a baissé avec les cadences, mais ce n'est pas là que se joue l'addition.\n\nLe bureau de programme estime le coût d'exploitation et de maintien de la flotte à au moins 1 580 milliards de dollars sur le cycle de vie ; coûts d'acquisition compris, le programme dépasse 2 000 milliards. La modernisation Block 4, elle, a vu son coût croître de plus de moitié. Le coût du F-35 est un coût de possession, pas un coût d'achat.",
      indicators: [
        {
          label: "Coût de maintien en condition",
          value: "≥ 1 580 Md$ sur le cycle de vie de la flotte",
          confidence: "haute",
          sources: ["gao"],
        },
        {
          label: "Coût de modernisation Block 4",
          value: "Croissance de plus de 50 % sur la ligne de base initiale",
          confidence: "haute",
          sources: ["gao"],
        },
        {
          label: "Lecture économique",
          value: "Le coût se loge dans la possession, non dans l'acquisition",
          confidence: "moyenne",
          sources: ["gao"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le F-35 est financé par les États-Unis, huit nations partenaires du programme et des ventes d'État à État (FMS) vers une vingtaine d'alliés. Cette base mondiale lisse les coûts de production — et lie financièrement les clients au calendrier américain.\n\nLe GAO documente sans détour les dérives : retards de livraison, modernisation TR-3 / Block 4 repoussée et désormais livrée en version réduite. Le financement d'un parc de F-35 inclut un poste de modernisation qui se révèle, lui-même, un risque budgétaire.",
      indicators: [
        {
          label: "Modèle de financement",
          value: "États-Unis + 8 nations partenaires + ventes FMS",
          confidence: "haute",
          sources: ["lockheed"],
        },
        {
          label: "Constat d'audit",
          value: "Retards de livraison et modernisation Block 4 réduite",
          confidence: "haute",
          sources: ["gao"],
        },
        {
          label: "Dette logicielle",
          value: "TR-3 / Block 4 — un coût stratégique autant que budgétaire",
          confidence: "moyenne",
          sources: ["gao"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne du F-35 est mondiale par conception : des centaines de fournisseurs répartis entre les nations du programme, un moteur Pratt & Whitney F135, une logistique pilotée par logiciel.\n\nCette architecture est aussi sa principale vulnérabilité. La dépendance logicielle est la plus profonde de tous les chasseurs en service : mises à jour, autorisations, données de mission transitent par des systèmes américains. Un F-35 n'est jamais pleinement détenu par son opérateur.",
      indicators: [
        {
          label: "Maître d'œuvre",
          value: "Lockheed Martin · moteur Pratt & Whitney F135",
          confidence: "haute",
          sources: ["lockheed"],
        },
        {
          label: "Architecture",
          value: "Chaîne mondiale répartie entre nations du programme",
          confidence: "moyenne",
          sources: ["lockheed"],
        },
        {
          label: "Dépendance critique",
          value: "Logicielle — la plus profonde des chasseurs en service",
          confidence: "moyenne",
          sources: ["gao"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Choisir le F-35, c'est entrer dans le système américain : interopérabilité maximale avec l'US Air Force et l'OTAN, partage de données, doctrine commune. C'est un atout d'alliance autant qu'un avion.\n\nC'est aussi une dépendance. Le maintien en condition, les mises à jour logicielles et les autorisations d'emploi placent l'opérateur sous l'influence durable de Washington — ce que les débats récurrents sur un éventuel verrouillage à distance, fondés ou non, rendent politiquement sensible.",
      indicators: [
        {
          label: "Fonction stratégique",
          value: "Intégration profonde au système américain et à l'OTAN",
          confidence: "haute",
          sources: ["usni"],
        },
        {
          label: "Effet de dépendance",
          value: "Élevé — soutien, logiciel, autorisations sous contrôle US",
          confidence: "moyenne",
          sources: ["gao"],
        },
        {
          label: "Diffusion",
          value: "États-Unis et une vingtaine de nations alliées",
          confidence: "haute",
          sources: ["lockheed"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "Le F-35 est largement exporté — mais uniquement vers des alliés autorisés, et toujours sous régime ITAR et arbitrage politique américain. La furtivité, la fusion de capteurs et le code source restent des technologies étroitement gardées.\n\nL'exportabilité est donc réelle mais politiquement bornée : l'accès dépend de la relation avec Washington, et peut être suspendu ou conditionné.",
      indicators: [
        {
          label: "Régime applicable",
          value: "ITAR — autorisation et arbitrage politique américains",
          confidence: "haute",
          sources: ["gao"],
        },
        {
          label: "Accès",
          value: "Réservé aux alliés autorisés",
          confidence: "haute",
          sources: ["lockheed"],
        },
        {
          label: "Conditionnalité",
          value: "L'accès dépend de la relation politique avec Washington",
          confidence: "moyenne",
          sources: ["usni"],
        },
      ],
    },
  ],
  variants: [
    {
      label: "F-35A",
      value: "Décollage et atterrissage conventionnels — US Air Force et export.",
      confidence: "haute",
      sources: ["lockheed"],
    },
    {
      label: "F-35B",
      value:
        "Décollage court et atterrissage vertical (STOVL) — Marines et porte-aéronefs.",
      confidence: "haute",
      sources: ["lockheed"],
    },
    {
      label: "F-35C",
      value: "Version navale CATOBAR — train et voilure renforcés, US Navy.",
      confidence: "haute",
      sources: ["lockheed"],
    },
    {
      label: "TR-3",
      value: "Mise à jour matérielle et logicielle — socle de la Block 4.",
      confidence: "moyenne",
      sources: ["gao"],
    },
    {
      label: "Block 4",
      value:
        "Modernisation capacitaire majeure — retardée, livrée en version réduite, achèvement visé vers 2031.",
      confidence: "moyenne",
      status: "a-recouper",
      sources: ["gao"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "C",
      rationale:
        "Capacité de 5e génération sans équivalent par le nombre, mais coût de possession et dette logicielle pèsent lourdement sur le rapport effet/coût.",
    },
    {
      key: "survivabilite",
      grade: "A",
      rationale:
        "Furtivité native, fusion de capteurs et rôle de nœud de réseau — la survivabilité est la raison d'être de l'appareil.",
    },
    {
      key: "exportabilite",
      grade: "B",
      rationale:
        "Largement exporté vers les alliés, mais sous régime ITAR et arbitrage politique : un accès réel mais conditionnel.",
    },
    {
      key: "risque-industriel",
      grade: "C",
      rationale:
        "Retards de livraison, modernisation Block 4 réduite, dépendance logicielle profonde — un risque industriel et programmatique documenté par le GAO.",
    },
    {
      key: "maturite",
      grade: "A",
      rationale:
        "En service depuis 2015, plus d'un millier d'appareils livrés, emploi opérationnel éprouvé sur plusieurs théâtres.",
    },
    {
      key: "confiance-donnees",
      grade: "A",
      rationale:
        "Programme exceptionnellement documenté, y compris sur ses difficultés, par le GAO et les rapports parlementaires américains.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un chasseur invincible qui voit tout et frappe partout. La réalité : un nœud de capteurs très performant, mais miné par les retards logiciels TR-3 / Block 4, les surcoûts et un maintien en condition d'une lourdeur inédite.",
    bestUseCase:
      "Opérer en 5e génération au sein d'une coalition conduite par les États-Unis — fusion de capteurs, partage de données, frappe furtive coordonnée.",
    weakPoint:
      "Le coût de possession et la dette logicielle, doublés d'une dépendance politique : l'opérateur ne détient jamais pleinement son F-35.",
    analystNote:
      "Le F-35 est moins un avion qu'un abonnement à l'écosystème de défense américain. Sa capacité de combat est réelle et majeure ; sa facture véritable se lit sur des décennies, et son calendrier de modernisation reste, après vingt ans, un risque ouvert.",
  },
  operators: [
    "États-Unis",
    "Royaume-Uni",
    "Italie",
    "Pays-Bas",
    "Norvège",
    "Australie",
    "Israël",
    "Japon",
    "Corée du Sud",
    "et une dizaine d'autres nations alliées",
  ],
  theatres: ["Moyen-Orient", "Indo-Pacifique", "Europe — police du ciel OTAN"],
  timeline: [
    {
      date: "2015",
      label: "Première capacité opérationnelle (F-35B des Marines).",
      kind: "jalon",
    },
    {
      date: "2018",
      label: "Premier emploi au combat d'un F-35 (F-35I israélien).",
      kind: "emploi",
    },
    {
      date: "2024",
      label: "Les retards TR-3 freinent les livraisons d'appareils.",
      kind: "debat",
    },
    {
      date: "2025",
      label:
        "Le GAO documente retards et réduction du périmètre de la Block 4.",
      kind: "debat",
    },
  ],
  sources: [
    {
      id: "lockheed",
      title: "F-35 Lightning II — programme et nations clientes",
      publisher: "Lockheed Martin",
      type: "constructeur",
      reliability: "B",
      url: "https://www.lockheedmartin.com/en-us/products/f-35.html",
    },
    {
      id: "gao",
      title:
        "GAO-25-107632 — F-35 Joint Strike Fighter: Late Deliveries and Future Development",
      publisher: "U.S. Government Accountability Office",
      type: "institution",
      reliability: "A",
      url: "https://www.gao.gov/products/gao-25-107632",
    },
    {
      id: "usni",
      title: "GAO Report on the F-35 Joint Strike Fighter",
      publisher: "USNI News",
      type: "presse",
      reliability: "C",
      url: "https://news.usni.org/2025/09/03/gao-report-on-the-f-35-joint-strike-fighter",
    },
    {
      id: "defense-news",
      title: "Pentagon cuts back F-35 upgrades to slow schedule slips",
      publisher: "Defense News",
      type: "presse",
      reliability: "C",
      url: "https://www.defensenews.com/air/2025/09/03/pentagon-cuts-back-f-35-upgrades-to-slow-schedule-slips-auditors/",
    },
  ],
  updated: "2026-05-22",
};
