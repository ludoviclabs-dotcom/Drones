import { makeNavalSystem } from "./naval-multinational";

// Pack naval Allemagne — spécialiste OTAN / export : défense aérienne, frégate
// multi-missions modulaire et sous-marin conventionnel furtif. Sources
// institutionnelles et industrielles ; calendrier F126 signalé comme glissant.

export const sachsenF124 = makeNavalSystem({
  slug: "sachsen-f124",
  name: "Sachsen F124",
  designation: "F124 · frégate de défense aérienne allemande",
  reference: "PNP-NS-024",
  navalVesselClass: "fregate",
  classLabel: "Frégate de défense aérienne",
  country: "Allemagne",
  flag: "🇩🇪",
  manufacturer: "ARGE F124 — Blohm+Voss · TKMS · Thales",
  introduced: "2004",
  status: "En service (3 unités) ; modernisation de mi-vie en cours",
  acquisitionModes: ["production-nationale", "cooperatif"],
  updated: "2026-06-03",
  tagline:
    "La Sachsen est l'escorteur antiaérien allemand : couple APAR / SMART-L, SM-2 et ESSM pour la défense de zone d'un groupe naval.",
  summary:
    "La classe Sachsen (F124) est la brique de défense aérienne de la Deutsche Marine : trois frégates conçues autour du radar à panneaux fixes APAR et de la veille longue portée SMART-L, avec SM-2 et ESSM en Mk 41.\n\nPour Panoplie, elle sert de comparateur européen non-Aegis : une défense aérienne de zone crédible bâtie sur des capteurs Thales/Hensoldt plutôt que sur l'écosystème Aegis, à lire face aux F110, FREMM DA et destroyers asiatiques.",
  profile: {
    platform: {
      missions: ["AAW", "ASuW", "ASW", "presence"],
      displacement: "≈ 5 800 t pleine charge",
      crew: "≈ 230–255 marins",
      aviation: ["2 × hélicoptères Sea Lynx / NH90"],
      notes: "Frégate de défense aérienne de zone, cœur antiaérien de la flotte de surface allemande.",
    },
    combatSystem: {
      family: "autre",
      cms: "Système de conduite de combat F124 (Atlas Elektronik / Thales)",
      tacticalLinks: ["Link 11", "Link 16", "Link 22"],
      ballisticMissileDefense: false,
      interoperabilityNotes: "Escorte antiaérienne intégrée aux groupes OTAN ; SMART-L modernisable pour la veille étendue.",
    },
    sensors: {
      radarPrimary: "APAR (radar multifonction à panneaux fixes)",
      radarSecondary: ["SMART-L (veille longue portée)"],
      hullSonar: "DSQS-24B",
      esm: ["Suite de guerre électronique allemande"],
    },
    effectors: {
      vlsType: "Mk 41",
      vlsCells: "32 cellules",
      sam: ["SM-2 Block IIIA", "ESSM"],
      antiShipMissiles: ["RGM-84 Harpoon"],
      navalGuns: ["76 mm OtoMelara"],
      ciws: ["RAM (Rolling Airframe Missile)"],
    },
    propulsion: {
      architecture: "autre",
      primeMovers: ["CODAG — 1 turbine à gaz GE LM2500 + 2 diesels MTU"],
      maxSpeed: "≈ 29 kt",
      notes: "CODAG : turbine à gaz pour la pointe, diesels pour le transit.",
    },
    industrial: {
      primeContractor: "ARGE F124 (Blohm+Voss / ThyssenKrupp Marine Systems)",
      shipyards: ["Hambourg", "Kiel", "Emden"],
      suppliers: [
        { subsystem: "Radar", supplier: "Thales / Hensoldt", country: "Pays-Bas / Allemagne" },
        { subsystem: "Missiles", supplier: "RTX / MBDA", country: "États-Unis / Europe" },
      ],
    },
    export: {
      regimeSummary: "Capacité nationale non exportée telle quelle ; briques radar et missiles exportées séparément.",
      itarExposure: "partielle",
      politicalConstraints: "SM-2 et Mk 41 relèvent de contrôles américains.",
    },
    sustainment: {
      sustainmentNotes: "Modernisation de mi-vie (SMART-L MM/radar, conduite de combat) pour tenir la défense de zone jusqu'à l'arrivée de la F127.",
      industrialRiskNotes: "Flotte réduite à trois coques : forte sensibilité à la disponibilité.",
    },
  },
  keySpecs: [
    { label: "Déplacement", value: "≈ 5 800 t", confidence: "haute", sources: ["nt-f124"] },
    { label: "Radar", value: "APAR + SMART-L", confidence: "haute", sources: ["nt-f124"] },
    { label: "VLS", value: "32 cellules Mk 41", confidence: "haute", sources: ["nt-f124"] },
    { label: "Défense aérienne", value: "SM-2 Block IIIA · ESSM", confidence: "haute", sources: ["nt-f124"] },
    { label: "Propulsion", value: "CODAG", confidence: "moyenne", sources: ["nt-f124"] },
    { label: "Unités", value: "3 frégates en service", confidence: "haute", sources: ["sf-f124"] },
  ],
  costNarrative:
    "Le coût de la Sachsen se concentre dans la défense aérienne : APAR, SMART-L, SM-2 et conduite de combat. La modernisation de mi-vie prolonge cette valeur en attendant la F127.",
  financeNarrative:
    "Programme national allemand limité à trois coques, ce qui rend chaque unité précieuse et la disponibilité critique.",
  supplyNarrative:
    "La chaîne combine chantiers allemands, radar Thales/Hensoldt et missiles américains/européens — une dépendance radar et missile à cartographier.",
  geopoliticsNarrative:
    "La Sachsen porte la défense aérienne de zone de la flotte allemande au sein de l'OTAN, en attendant le saut capacitaire de la future F127.",
  exportNarrative:
    "La plateforme n'est pas exportée, mais l'écosystème APAR/SMART-L irrigue d'autres marines européennes via Thales.",
  editorial: {
    mythVsReality:
      "Le mythe : seule une frégate Aegis fait de la défense aérienne crédible. La réalité : APAR/SMART-L offre une défense de zone européenne sérieuse, sans BMD natif.",
    bestUseCase: "Défense aérienne de zone d'un groupe naval, escorte OTAN et veille étendue après modernisation SMART-L.",
    weakPoint: "Trois coques seulement, pas de BMD natif et dépendance aux missiles américains.",
    analystNote:
      "La Sachsen est le bon repère pour comparer une défense aérienne non-Aegis (APAR/SMART-L) face aux F110 SPY-7 et aux destroyers Aegis asiatiques.",
  },
  operators: ["Allemagne — Deutsche Marine"],
  theatres: ["Mer du Nord", "Atlantique Nord", "Méditerranée", "OTAN"],
  timeline: [
    { date: "2004", label: "Admission au service actif de la tête de série Sachsen.", kind: "jalon" },
    { date: "2020", label: "Lancement de la modernisation de mi-vie de la classe.", kind: "jalon" },
  ],
  sources: [
    {
      id: "nt-f124",
      title: "Sachsen Class (F124) air-defence frigate",
      publisher: "Naval Technology",
      type: "presse",
      reliability: "B",
      url: "https://www.naval-technology.com/projects/f124/",
    },
    {
      id: "sf-f124",
      title: "Type 124 Sachsen class guided missile frigate",
      publisher: "Seaforces Online",
      type: "presse",
      reliability: "C",
      url: "https://www.seaforces.org/marint/German-Navy/Frigate/Type-124-Sachsen-class.htm",
    },
  ],
  sourceIds: { primary: "nt-f124", combat: "nt-f124", industrial: "nt-f124", export: "nt-f124" },
  scores: {
    "efficacite-cout": ["B", "Défense aérienne de zone crédible pour trois coques, mais sans BMD et avec une flotte étroite."],
    survivabilite: ["B", "APAR/SMART-L et SM-2/ESSM offrent une bonne couverture antiaérienne ; pas de défense antimissile balistique native."],
    exportabilite: ["C", "Plateforme non exportée ; valeur export portée par les capteurs Thales/Hensoldt."],
    "risque-industriel": ["C", "Trois coques et fournisseurs croisés : disponibilité et obsolescence radar à surveiller."],
    maturite: ["A", "Classe éprouvée, en service depuis 2004 et modernisée."],
    "confiance-donnees": ["B", "Architecture et armement bien documentés en sources ouvertes."],
  },
});

export const f126Niedersachsen = makeNavalSystem({
  slug: "f126-niedersachsen",
  name: "F126 Niedersachsen",
  designation: "F126 (ex-MKS 180) · frégate multi-missions allemande",
  reference: "PNP-NS-025",
  navalVesselClass: "fregate",
  classLabel: "Frégate multi-missions modulaire",
  country: "Allemagne",
  flag: "🇩🇪",
  manufacturer: "Damen Naval · Blohm+Voss · Peene-Werft (Lürssen)",
  status: "En construction ; tête de série attendue vers 2028 — calendrier signalé comme glissant",
  acquisitionModes: ["cooperatif", "DCS"],
  updated: "2026-06-03",
  tagline:
    "La F126 est la plus grande frégate allemande depuis 1945 : ≈ 10 000 t, conçue modulaire (mission modules) autour d'un design néerlandais Damen construit en Allemagne.",
  summary:
    "La F126 (ex-MKS 180) est une frégate multi-missions de ≈ 10 000 t et 166 m, conçue par Damen Naval et construite en Allemagne (Blohm+Voss, Peene-Werft). Pensée modulaire, elle doit accueillir des modules de mission interchangeables (ASM, drones, forces spéciales).\n\nPour Panoplie, elle illustre deux choses : une frégate « porteuse » de grande taille à équipage réduit, et un programme dont le calendrier et la gouvernance industrielle sont régulièrement signalés comme tendus — un cas d'école de risque de programme.",
  profile: {
    platform: {
      missions: ["ASW", "AAW", "ASuW", "presence", "projection"],
      displacement: "≈ 10 000 t pleine charge",
      crew: "≈ 125 marins + module de mission",
      aviation: ["Hélicoptères embarqués", "drones aériens et de surface"],
      notes: "Plus grand bâtiment de surface allemand depuis 1945 ; conçue autour de modules de mission interchangeables.",
    },
    combatSystem: {
      family: "autre",
      cms: "Système de combat F126 (intégration Damen / partenaires allemands)",
      tacticalLinks: ["Link 16", "réseaux OTAN"],
      ballisticMissileDefense: false,
      interoperabilityNotes: "Frégate de présence longue durée et d'escorte OTAN, modularité au cœur du concept.",
    },
    sensors: {
      radarPrimary: "Radar multifonction (configuration en définition publique)",
      esm: ["Suite de guerre électronique"],
    },
    effectors: {
      vlsType: "Mk 41",
      sam: ["ESSM Block 2"],
      antiShipMissiles: ["RGM-84 Harpoon / NSM selon configuration"],
      navalGuns: ["127 mm avec munitions guidées Vulcano"],
      ciws: ["RAM"],
    },
    propulsion: {
      architecture: "autre",
      notes: "Architecture optimisée pour la présence longue durée ; configuration de propulsion en définition publique.",
    },
    industrial: {
      primeContractor: "Damen Naval (maître d'œuvre néerlandais)",
      shipyards: ["Hambourg (Blohm+Voss)", "Wolgast (Peene-Werft)"],
      suppliers: [
        { subsystem: "Conception", supplier: "Damen Naval", country: "Pays-Bas" },
        { subsystem: "Construction", supplier: "Blohm+Voss / Lürssen", country: "Allemagne" },
      ],
      transferOfTechnology: "Design néerlandais construit en Allemagne — coopération industrielle structurante mais source de friction calendaire.",
    },
    export: {
      regimeSummary: "Programme national allemand ; design Damen potentiellement déclinable à l'export.",
      itarExposure: "partielle",
      politicalConstraints: "Mk 41, ESSM et certains capteurs soumis à contrôles US/partenaires.",
    },
    sustainment: {
      programCost: "Programme de plusieurs milliards d'euros — six frégates commandées (2024)",
      industrialRiskNotes: "Calendrier et gouvernance régulièrement signalés comme tendus par la presse spécialisée (tête de série repoussée).",
    },
  },
  keySpecs: [
    { label: "Déplacement", value: "≈ 10 000 t", confidence: "haute", sources: ["damen-f126"] },
    { label: "Longueur", value: "≈ 166 m", confidence: "moyenne", sources: ["mf-f126"] },
    { label: "Équipage", value: "≈ 125 + module de mission", confidence: "moyenne", sources: ["mf-f126"] },
    { label: "Concept", value: "Frégate modulaire (mission modules)", confidence: "haute", sources: ["damen-f126"] },
    { label: "Artillerie", value: "127 mm Vulcano", confidence: "moyenne", sources: ["mf-f126"] },
    { label: "Série", value: "6 frégates commandées (option 2024 levée)", confidence: "haute", status: "a-recouper", sources: ["damen-f126"] },
  ],
  costNarrative:
    "La F126 porte le coût d'une frégate très grande et modulaire : coque, modules de mission, intégration et soutien long. Le calendrier glissant pèse sur le coût complet.",
  financeNarrative:
    "Six unités commandées font de la F126 un investissement majeur de la Marine allemande, avec une enveloppe pluriannuelle conséquente.",
  supplyNarrative:
    "La chaîne mêle conception Damen (Pays-Bas) et construction allemande (Blohm+Voss, Peene-Werft / Lürssen) — une coopération structurante mais à frictions documentées.",
  geopoliticsNarrative:
    "La F126 incarne la remontée en puissance navale allemande et la coopération industrielle intra-européenne, avec présence longue durée et flexibilité de mission.",
  exportNarrative:
    "Le design Damen est exportable par nature, mais la version allemande reste un objet national ; le vrai signal export est la maîtrise du calendrier.",
  editorial: {
    mythVsReality:
      "Le mythe : une grande frégate moderne est forcément un saut capacitaire immédiat. La réalité : la F126 est d'abord un test de tenue de programme.",
    bestUseCase: "Présence longue durée, escorte OTAN et missions modulaires (ASM, drones, forces spéciales).",
    weakPoint: "Calendrier et gouvernance du programme ; configuration capteurs/propulsion encore en définition publique.",
    analystNote:
      "La F126 est le meilleur cas Panoplie pour lire le risque de programme : grande ambition, design étranger, construction nationale et glissements calendaires.",
  },
  operators: ["Allemagne — Deutsche Marine"],
  theatres: ["Atlantique Nord", "Mer du Nord", "OTAN", "présence longue durée"],
  timeline: [
    { date: "2020", label: "Damen Naval remporte l'appel d'offres MKS 180 / F126.", kind: "jalon" },
    { date: "2024", label: "Commande de deux frégates F126 supplémentaires (série portée à six).", kind: "jalon" },
  ],
  sources: [
    {
      id: "damen-f126",
      title: "German armed forces order two more F126 frigates from Damen Naval",
      publisher: "Damen Naval",
      type: "constructeur",
      reliability: "B",
      date: "2024",
      url: "https://www.damen.com/insights-center/news/german-armed-forces-order-two-more-f126-frigates-from-damen-naval",
    },
    {
      id: "mf-f126",
      title: "Here we go: F126",
      publisher: "Marineforum",
      type: "presse",
      reliability: "B",
      url: "https://marineforum.online/en/here-we-go-f-126/",
    },
  ],
  sourceIds: { primary: "damen-f126", industrial: "damen-f126", combat: "mf-f126", export: "damen-f126" },
  scores: {
    "efficacite-cout": ["C", "Grande frégate modulaire à fort potentiel, mais coût complet et calendrier encore incertains."],
    survivabilite: ["B", "Taille, modularité et autodéfense ESSM/RAM correctes ; configuration capteurs à confirmer."],
    exportabilite: ["C", "Design Damen exportable, mais version allemande nationale et calendrier peu rassurant pour un client."],
    "risque-industriel": ["D", "Programme régulièrement signalé comme glissant : gouvernance Damen/chantiers allemands sous tension."],
    maturite: ["D", "En construction ; aucune unité encore admise au service."],
    "confiance-donnees": ["C", "Concept et commande bien documentés ; capteurs, propulsion et calendrier fin restent à recouper."],
  },
});

export const type212cd = makeNavalSystem({
  slug: "type-212cd",
  name: "Type 212CD",
  designation: "U212CD · sous-marin AIP germano-norvégien",
  reference: "PNP-NS-026",
  navalVesselClass: "sous-marin",
  classLabel: "Sous-marin conventionnel AIP furtif",
  country: "Allemagne · Norvège",
  flag: "🇩🇪",
  manufacturer: "ThyssenKrupp Marine Systems · kta Naval Systems",
  status: "En construction ; programme commun Allemagne–Norvège (livraisons en fin de décennie)",
  acquisitionModes: ["cooperatif", "production-nationale"],
  updated: "2026-06-03",
  tagline:
    "Le Type 212CD pousse la lignée 212/214/218 : coque furtive en losange, propulsion AIP à pile à combustible et programme commun germano-norvégien.",
  summary:
    "Le Type 212CD (Common Design) est le successeur du Type 212A : presque deux fois plus volumineux, doté d'une coque furtive en losange pour dévier les ondes sonar actives et d'une propulsion anaérobie (AIP) à pile à combustible hydrogène complétée de deux diesels.\n\nProgramme commun à l'Allemagne et à la Norvège, il est le pivot de l'offre sous-marine conventionnelle de TKMS. Pour Panoplie, il est le comparateur européen face aux KSS-III, Taigei et Scorpène — discrétion AIP plutôt que volume de frappe.",
  profile: {
    platform: {
      missions: ["ASW", "ASuW", "presence", "strike"],
      displacement: "≈ 2 500 t surface / 2 800 t plongée",
      crew: "≈ 28–35 marins",
      endurance: "Patrouille prolongée grâce à l'AIP",
      notes: "Coque furtive en losange (réduction de section équivalente sonar) ; presque le double du Type 212A.",
    },
    combatSystem: {
      family: "autre",
      cms: "Système de combat ORCCA (kta Naval Systems)",
      tacticalLinks: ["Liaisons nationales et OTAN"],
      ballisticMissileDefense: false,
      interoperabilityNotes: "Commun DE/NO : interopérabilité et soutien mutualisés.",
    },
    sensors: {
      hullSonar: "Suite sonar intégrée (réseau de flanc et proue)",
      towedSonar: "Antenne remorquée selon configuration",
      esm: ["Mât optronique et ESM"],
    },
    effectors: {
      antiSubWeapons: ["Torpilles lourdes DM2A4 / Seehecht"],
      antiShipMissiles: ["Missiles antinavires selon configuration client"],
    },
    propulsion: {
      architecture: "AIP",
      primeMovers: ["Pile à combustible hydrogène", "2 moteurs diesel"],
      maxSpeed: "> 20 kt en plongée",
      notes: "AIP pour la discrétion en plongée prolongée ; deux diesels (au lieu d'un sur le 212A).",
    },
    industrial: {
      primeContractor: "ThyssenKrupp Marine Systems",
      shipyards: ["Kiel"],
      suppliers: [
        { subsystem: "Système de combat", supplier: "kta Naval Systems", country: "Allemagne" },
        { subsystem: "Pile à combustible", supplier: "Filière hydrogène allemande", country: "Allemagne" },
      ],
      transferOfTechnology: "Coopération germano-norvégienne ; participation industrielle norvégienne (Kongsberg).",
    },
    export: {
      regimeSummary: "Base d'export TKMS forte (212/214/218) ; le CD vise d'abord DE/NO mais reste très exportable.",
      itarExposure: "aucune",
      politicalConstraints: "Équipements essentiellement européens : faible exposition ITAR.",
    },
    sustainment: {
      sustainmentNotes: "Soutien mutualisé DE/NO ; mutualisation des pièces et de la formation.",
      industrialRiskNotes: "Charge de la filière sous-marine TKMS (212CD, 214, 218) et cadence de Kiel.",
    },
  },
  keySpecs: [
    { label: "Déplacement", value: "≈ 2 500 t surface / 2 800 t plongée", confidence: "moyenne", sources: ["nt-212cd"] },
    { label: "Propulsion", value: "AIP pile à combustible + 2 diesels", confidence: "haute", sources: ["nt-212cd"] },
    { label: "Furtivité", value: "Coque en losange anti-sonar", confidence: "moyenne", sources: ["nt-212cd"] },
    { label: "Programme", value: "Commun Allemagne–Norvège", confidence: "haute", sources: ["nt-212cd"] },
    { label: "Vitesse", value: "> 20 kt en plongée", confidence: "moyenne", sources: ["nt-212cd"] },
    { label: "Équipage", value: "≈ 28–35", confidence: "moyenne", status: "a-recouper", sources: ["ar-212cd"] },
  ],
  costNarrative:
    "Le coût du 212CD tient à la discrétion : AIP, coque furtive, sonars et intégration. La mutualisation germano-norvégienne amortit le développement.",
  financeNarrative:
    "Programme binational structurant pour TKMS, sécurisant la charge de Kiel et la base sous-marine allemande.",
  supplyNarrative:
    "La chaîne est essentiellement européenne — TKMS, kta Naval Systems, filière hydrogène et participation norvégienne (Kongsberg).",
  geopoliticsNarrative:
    "Le 212CD scelle un axe naval germano-norvégien en mer du Nord et Baltique, face à la pression sous-marine russe.",
  exportNarrative:
    "La famille 212/214/218 est l'un des plus gros succès export sous-marins ; le CD prolonge cette crédibilité avec une exposition ITAR quasi nulle.",
  editorial: {
    mythVsReality:
      "Le mythe : un sous-marin conventionnel est dépassé. La réalité : un AIP furtif est redoutable en eaux côtières et difficile à détecter.",
    bestUseCase: "Patrouille ASM discrète, renseignement et contrôle des approches en mer du Nord, Baltique et Atlantique.",
    weakPoint: "Endurance et volume de frappe inférieurs à un SSN ; performances acoustiques fines non publiques.",
    analystNote:
      "Le 212CD est le comparateur européen idéal face aux KSS-III, Taigei et Scorpène : discrétion AIP et souveraineté plutôt que volume de frappe nucléaire.",
  },
  operators: ["Allemagne — Deutsche Marine", "Norvège — Sjøforsvaret"],
  theatres: ["Mer du Nord", "Baltique", "Atlantique Nord", "Arctique"],
  timeline: [
    { date: "2021", label: "Contrat commun germano-norvégien pour les Type 212CD.", kind: "jalon" },
    { date: "2023", label: "Lancement de la construction de la tête de série à Kiel.", kind: "jalon" },
  ],
  sources: [
    {
      id: "nt-212cd",
      title: "Type 212CD Submarines, Germany",
      publisher: "Naval Technology",
      type: "presse",
      reliability: "B",
      url: "https://www.naval-technology.com/projects/type-212cd-submarines-germany/",
    },
    {
      id: "ar-212cd",
      title: "F127 Frigates and U212CD Submarines: Germany's Naval Expansion",
      publisher: "Army Recognition",
      type: "presse",
      reliability: "C",
      date: "2024",
      url: "https://www.armyrecognition.com/news/navy-news/2024/f127-frigates-and-u212cd-submarines-germanys-bold-naval-expansion-plan",
    },
  ],
  sourceIds: { primary: "nt-212cd", combat: "nt-212cd", industrial: "nt-212cd", export: "nt-212cd" },
  scores: {
    "efficacite-cout": ["B", "Sous-marin AIP très discret au coût conventionnel, sans le fardeau d'une filière nucléaire."],
    survivabilite: ["A", "Coque furtive et AIP donnent une excellente discrétion ; performances fines non publiques."],
    exportabilite: ["A", "Famille 212/214/218 parmi les meilleures ventes export, exposition ITAR quasi nulle."],
    "risque-industriel": ["B", "Base TKMS solide, mais cadence de Kiel chargée par plusieurs programmes simultanés."],
    maturite: ["C", "Évolution d'une lignée mature, mais le CD lui-même est en construction."],
    "confiance-donnees": ["B", "Architecture et programme publics ; signatures acoustiques et capteurs sensibles."],
  },
});
