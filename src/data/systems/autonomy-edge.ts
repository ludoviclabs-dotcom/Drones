import type {
  Brick,
  Confidence,
  DefenseSystem,
  Grade,
  Indicator,
  Score,
  SourceRef,
} from "../types";

type BrickDraft = {
  cout: string;
  finance: string;
  supplyChain: string;
  geopolitique: string;
  export: string;
  indicators: {
    cout: Indicator;
    finance: Indicator;
    supplyChain: Indicator;
    geopolitique: Indicator;
    export: Indicator;
  };
};

function spec(
  label: string,
  value: string,
  confidence: Confidence,
  sources: string[],
  note?: string,
): Indicator {
  return { label, value, confidence, sources, note };
}

function indicator(
  label: string,
  value: string,
  confidence: Confidence,
  sources: string[],
  note?: string,
): Indicator {
  return { label, value, confidence, sources, note };
}

function bricks(draft: BrickDraft): Brick[] {
  return [
    {
      key: "cout",
      narrative: draft.cout,
      indicators: [draft.indicators.cout],
    },
    {
      key: "finance",
      narrative: draft.finance,
      indicators: [draft.indicators.finance],
    },
    {
      key: "supply-chain",
      narrative: draft.supplyChain,
      indicators: [draft.indicators.supplyChain],
    },
    {
      key: "geopolitique",
      narrative: draft.geopolitique,
      indicators: [draft.indicators.geopolitique],
    },
    {
      key: "export",
      narrative: draft.export,
      indicators: [draft.indicators.export],
    },
  ];
}

function scores(input: {
  cost?: Grade;
  survivability?: Grade;
  exportability?: Grade;
  industrialRisk?: Grade;
  maturity?: Grade;
  confidence?: Grade;
  note: string;
}): Score[] {
  return [
    {
      key: "efficacite-cout",
      grade: input.cost ?? "C",
      rationale: input.note,
    },
    {
      key: "survivabilite",
      grade: input.survivability ?? "C",
      rationale:
        "Lecture prudente fondee sur le profil public : mobilite, C2 et exposition EW, sans mesure operationnelle independante.",
    },
    {
      key: "exportabilite",
      grade: input.exportability ?? "C",
      rationale:
        "Exportabilite estimee depuis les pages publiques, les contraintes dual-use et la dependance a l'autorisation du pays producteur.",
    },
    {
      key: "risque-industriel",
      grade: input.industrialRisk ?? "C",
      rationale:
        "Risque apprecie par maturite industrielle visible, role du maitre d'oeuvre et profondeur de la chaine de fournisseurs publiee.",
    },
    {
      key: "maturite",
      grade: input.maturity ?? "C",
      rationale:
        "La maturite est notee conservativement quand la fiche repose surtout sur une annonce produit ou une configuration recente.",
    },
    {
      key: "confiance-donnees",
      grade: input.confidence ?? "C",
      rationale:
        "Les donnees proviennent de sources ouvertes verifiables ; les annonces constructeur non corroborees restent classees a recouper.",
    },
  ];
}

function source(
  id: string,
  title: string,
  publisher: string,
  url: string,
  reliability: SourceRef["reliability"] = "B",
  date?: string,
  type: SourceRef["type"] = "constructeur",
): SourceRef {
  return { id, title, publisher, type, reliability, date, url };
}

const commonOperators = ["Client ou operateur non publie"];
const commonTheatres = ["Catalogue export / demonstrations industrielles"];

export const ht100: DefenseSystem = {
  slug: "ht-100",
  name: "HT-100",
  designation: "ANAVIA HT-100",
  reference: "PNP-DR-901",
  category: "drone",
  droneClass: "ISR",
  classLabel: "Helicoptere VTOL autonome ISR / logistique legere",
  country: "Suisse · Emirats arabes unis",
  flag: "🇨🇭",
  manufacturer: "ANAVIA · EDGE Group",
  status:
    "Plateforme dual-use commercialisee ; performances issues des pages ANAVIA / EDGE a recouper par contrat client",
  acquisitionModes: ["DCS"],
  tagline:
    "Un helicopter UAV turbine, reutilisable, qui deplace la lecture drone vers l'endurance, la charge utile et l'appontage autonome.",
  summary:
    "Le HT-100 est un drone-helicoptere suisse integre dans l'ecosysteme EDGE. Son interet pour Panoplie n'est pas d'ajouter un simple drone de plus, mais de montrer comment une plateforme reutilisable peut servir ISR, inspection, logistique legere et appui maritime avec une autonomie de decollage, vol et atterrissage. Les chiffres publics sont nombreux, mais viennent surtout du constructeur : ils sont utiles pour cadrer l'objet, pas pour conclure sur une performance operationnelle.",
  autonomyProfile: {
    battlefieldFunctions: ["isr", "logistics", "maritime-support"],
    autonomyModes: ["autonomous-flight", "mission-autonomy"],
    navigationGuidance: {
      gnss: true,
      inertial: true,
      deckLanding: true,
      notes:
        "ANAVIA revendique un decollage, vol et atterrissage autonomes ; la variante navale ajoute une approche radar d'appontage.",
    },
    networkAndC2: {
      datalinkTypes: ["MESH IP", "LTE optionnel", "SATCOM optionnel"],
      encryption: ["datalink chiffre revendique"],
      losRange: "jusqu'a 200 km selon configuration radio",
      satcom: true,
      meshNetworking: true,
      notes: "Portee et resilience dependent fortement de la configuration client.",
    },
    recoverability: "reusable",
    industrialRoles: {
      prime: ["ANAVIA"],
      integrator: ["EDGE Group"],
      production: ["Suisse"],
    },
    sourceContext: {
      contexts: ["official-spec", "official-marketing-claim"],
      sourceDate: "2026",
      varianceNotes:
        "Specifications constructeur, sans verification independante de performance en mission.",
    },
  },
  keySpecs: [
    spec("MTOW", "120 kg", "haute", ["anavia-ht100", "edge-ht100"]),
    spec("Charge utile", "jusqu'a 60 kg", "haute", ["anavia-ht100", "edge-ht100"]),
    spec("Endurance", "jusqu'a 6 h", "haute", ["anavia-ht100", "edge-ht100"]),
    spec("Portee mission", "600 km revendiques", "moyenne", ["anavia-ht100"]),
    spec("Consommation", "9 l/h Jet A-1", "moyenne", ["anavia-ht100", "edge-ht100"]),
    spec("Autonomie", "decollage, vol et atterrissage autonomes", "moyenne", ["anavia-ht100"]),
  ],
  bricks: bricks({
    cout:
      "Le HT-100 se lit comme une substitution partielle a des missions d'helicoptere leger : carburant, empreinte sol et absence d'equipage embarque sont les arguments de cout. Le constructeur parle de cout d'operation inferieur, mais ne publie pas de prix complet.",
    finance:
      "La fiche publique indique une offre commerciale dual-use. Sans contrat client documente dans cette fiche, le financement reste lu comme achat direct ou package export.",
    supplyChain:
      "ANAVIA conserve l'identite suisse de conception et d'assemblage, tandis que EDGE apporte l'acces groupe, la distribution et le portefeuille defense. La turbine et le datalink restent des sous-ensembles critiques a documenter client par client.",
    geopolitique:
      "L'objet illustre la logique EDGE : agreger des actifs autonomes non emirati pour enrichir une offre export souveraine du Golfe. C'est une lecture industrielle plus qu'une rupture doctrinale.",
    export:
      "ANAVIA affiche une position ITAR-free, mais le site rappelle que les ventes restent soumises aux controles dual-use, a Wassenaar et aux licences suisses d'exportation.",
    indicators: {
      cout: indicator("Lecture de cout", "Alternative UAV a certaines missions helicopteres", "moyenne", ["anavia-ht100"]),
      finance: indicator("Mode probable", "Achat direct / package export", "moyenne", ["edge-ht100"]),
      supplyChain: indicator("Chaine visible", "ANAVIA, avec integration commerciale EDGE", "haute", ["edge-ht100"]),
      geopolitique: indicator("Role industriel", "Actif suisse dans portefeuille EDGE", "moyenne", ["anavia-ht100"]),
      export: indicator("Regime", "Dual-use, Wassenaar et licences suisses", "haute", ["anavia-ht100"]),
    },
  }),
  scores: scores({
    cost: "B",
    survivability: "C",
    exportability: "B",
    industrialRisk: "B",
    maturity: "B",
    confidence: "B",
    note:
      "L'efficacite-cout est convaincante pour les missions ISR/logistique persistantes, mais le prix complet et le soutien restent non publics.",
  }),
  editorial: {
    mythVsReality:
      "Le mythe : un gros drone civil militarise. La realite : un helicopter UAV autonome, plus proche d'un outil de mission persistent que d'un quadricoptere tactique.",
    bestUseCase:
      "ISR maritime ou logistique legere quand l'endurance et la recuperation comptent plus que la discretion.",
    weakPoint:
      "Donnees principalement constructeur ; l'effet reel depend des charges utiles et du datalink client.",
    analystNote:
      "Le HT-100 est utile pour ouvrir la facette autonomie sans basculer dans un nouveau domaine : meme fiche drone, mais lecture fonctionnelle beaucoup plus riche.",
  },
  operators: commonOperators,
  theatres: commonTheatres,
  sources: [
    source("anavia-ht100", "HT-100 Unmanned Helicopter", "ANAVIA", "https://anavia.eu/ht-100/"),
    source("edge-ht100", "ANAVIA HT-100 Long Range Unmanned Helicopter", "EDGE Group", "https://edgegroup.ae/solutions/ht-100"),
    source("anavia-mission-control", "ANAVIA Mission Control", "ANAVIA", "https://anavia.eu/mission-control"),
  ],
  updated: "2026-06-19",
};

export const ht750: DefenseSystem = {
  slug: "ht-750",
  name: "HT-750",
  designation: "ANAVIA HT-750",
  reference: "PNP-DR-902",
  category: "drone",
  droneClass: "ISR",
  classLabel: "Helicoptere VTOL lourd autonome",
  country: "Suisse · Emirats arabes unis",
  flag: "🇨🇭",
  manufacturer: "ANAVIA · EDGE Group",
  status:
    "Plateforme heavy-lift presentee publiquement ; performances a consolider hors brochure constructeur",
  acquisitionModes: ["DCS"],
  tagline:
    "Le drone-helicoptere qui tire l'autonomie vers le transport lourd, la longue endurance et les missions maritimes.",
  summary:
    "Le HT-750 transpose la logique du HT-100 a une echelle lourde : charge utile et carburant jusqu'a 750 kg, endurance revendiquee jusqu'a 15 heures, datalink chiffre et options SATCOM. Panoplie le classe comme dossier prudent : les donnees sont publiques et verifiables sur EDGE/ANAVIA, mais elles decrivent surtout un potentiel de plateforme.",
  autonomyProfile: {
    battlefieldFunctions: ["logistics", "isr", "maritime-support"],
    autonomyModes: ["autonomous-flight", "mission-autonomy"],
    navigationGuidance: {
      gnss: true,
      inertial: true,
      antiJam: true,
      deckLanding: true,
      notes: "EDGE revendique GPS/inertiel, protection anti-jam GPS et appontage autonome.",
    },
    networkAndC2: {
      datalinkTypes: ["MESH IP", "dual MIMO radios", "SATCOM"],
      encryption: ["AES-256 revendique"],
      losRange: "jusqu'a 200 km selon radio et terrain",
      satcom: true,
      meshNetworking: true,
    },
    recoverability: "reusable",
    industrialRoles: {
      prime: ["ANAVIA"],
      integrator: ["EDGE Group"],
      production: ["Suisse"],
    },
    sourceContext: {
      contexts: ["official-spec", "official-marketing-claim"],
      sourceDate: "2026",
      varianceNotes: "Capacite heavy-lift publique, sans retour operateur consolide.",
    },
  },
  keySpecs: [
    spec("MTOW", "1 150 kg", "haute", ["edge-ht750", "anavia-ht750"]),
    spec("Charge utile + carburant", "750 kg", "haute", ["edge-ht750", "anavia-ht750"]),
    spec("Endurance", "jusqu'a 15 h", "haute", ["edge-ht750", "anavia-ht750"]),
    spec("Vitesse max", "222 km/h", "haute", ["edge-ht750", "anavia-ht750"]),
    spec("Datalink", "MESH IP chiffre, SATCOM, dual MIMO", "moyenne", ["edge-ht750", "anavia-ht750"]),
    spec("Navigation", "GPS/inertiel, appontage autonome revendique", "moyenne", ["edge-ht750"]),
  ],
  bricks: bricks({
    cout:
      "Le HT-750 vise le cout evite de missions helicopteres lourdes ou de ravitaillement. L'economie n'est pas un prix catalogue : elle depend de la charge utile, de la maintenance turbine et du rythme de recuperation.",
    finance:
      "Le dossier public reste une offre industrielle. A defaut de client nomme dans cette fiche, la lecture financiere est celle d'un achat direct ou d'un package de capacite.",
    supplyChain:
      "La dependance critique porte sur les ensembles helicopteres lourds : turbine, rotor, avionique et datalink. EDGE donne une vitrine export, ANAVIA la base technique.",
    geopolitique:
      "Une plateforme heavy-lift autonome interesse les forces distribuees et maritimes : elle remplace moins l'helicoptere qu'elle n'ajoute une couche non habitee a la logistique.",
    export:
      "Comme le HT-100, l'argument ITAR-free ne supprime pas les licences suisses, Wassenaar et les arbitrages d'utilisateur final.",
    indicators: {
      cout: indicator("Logique de cout", "Ravitaillement / ISR sans equipage embarque", "moyenne", ["edge-ht750"]),
      finance: indicator("Mode probable", "Achat direct / package capacitaire", "moyenne", ["edge-ht750"]),
      supplyChain: indicator("Sous-systemes clefs", "Turboshaft, rotor, avionique, datalink", "moyenne", ["edge-ht750"]),
      geopolitique: indicator("Fonction", "Logistique distribuee et missions maritimes autonomes", "moyenne", ["edge-ht750"]),
      export: indicator("Contraintes", "Dual-use et licences suisses", "haute", ["anavia-ht750"]),
    },
  }),
  scores: scores({
    cost: "C",
    survivability: "C",
    exportability: "B",
    industrialRisk: "C",
    maturity: "C",
    confidence: "B",
    note:
      "Le potentiel cout/effet est fort pour la logistique, mais sans prix ni retour client public il reste moins solide que le HT-100.",
  }),
  editorial: {
    mythVsReality:
      "Le mythe : un helicopter autonome remplace l'helicoptere habite. La realite : il deplace certaines missions repetitives et risquées vers une plateforme sans equipage.",
    bestUseCase:
      "Ravitaillement, ISR longue endurance ou appui maritime quand la charge utile prime sur la discretion.",
    weakPoint:
      "Maturite et soutien encore peu documentes publiquement pour une plateforme de cette masse.",
    analystNote:
      "Le HT-750 est un bon marqueur de la facette 'fonction' : le drone n'est plus seulement capteur ou munition, il devient segment logistique.",
  },
  operators: commonOperators,
  theatres: commonTheatres,
  sources: [
    source("edge-ht750", "HT-750 High-Torque Multi-Purpose VTOL UAV", "EDGE Group", "https://edgegroup.ae/solutions/ht-750"),
    source("anavia-ht750", "ANAVIA HT-750 Heavy-Lift Unmanned VTOL", "ANAVIA", "https://anavia.eu/ht-750"),
  ],
  updated: "2026-06-19",
};

export const omen: DefenseSystem = {
  slug: "omen",
  name: "Omen",
  designation: "Anduril / EDGE Omen",
  reference: "PNP-DR-903",
  category: "drone",
  droneClass: "ISR",
  classLabel: "AAV VTOL group 3 multi-mission",
  country: "Etats-Unis · Emirats arabes unis",
  flag: "🇺🇸",
  manufacturer: "Anduril · EDGE Group",
  status:
    "Co-developpement annonce ; achat EDGE de 50 drones rapporte par presse financiere, a suivre jusqu'au contrat detaille",
  acquisitionModes: ["DCS", "cooperatif"],
  tagline:
    "Le tail-sitter autonome d'Anduril et EDGE : Lattice, charge utile modulaire et promesse de C2 degrade.",
  summary:
    "Omen est presente par EDGE comme un Autonomous Air Vehicle de groupe 3, co-developpe avec Anduril, capable de vol VTOL tail-sitter, de missions ISR, relais reseau, logistique et capteurs de defense aerienne. La fiche est volontairement prudente : l'annonce est recente, les specifications ouvertes restent limitees et le package de 50 drones rapporte par Investors.com doit etre lu comme indicateur programme, pas comme fiche technique stabilisee.",
  autonomyProfile: {
    battlefieldFunctions: ["isr", "relay-c2", "logistics", "air-defense"],
    autonomyModes: ["mission-autonomy", "autonomous-flight"],
    navigationGuidance: {
      gnss: true,
      inertial: true,
      notes: "EDGE insiste sur les environnements de communication degradee ou refusee, sans publier de details.",
    },
    networkAndC2: {
      c2SoftwareStack: ["Anduril Lattice for Mission Autonomy"],
      notes: "Architecture ouverte et modulaire revendiquee pour charges utiles diverses.",
    },
    recoverability: "reusable",
    industrialRoles: {
      prime: ["Anduril", "EDGE Group"],
      autonomySoftware: ["Anduril Lattice"],
      powertrain: ["Archer Aviation powertrain technology"],
      production: ["EDGE / Anduril production alliance a confirmer par lots"],
    },
    sourceContext: {
      contexts: ["official-marketing-claim", "contract-announcement", "secondary-analysis"],
      sourceDate: "2025-11",
      varianceNotes: "Annonce programme recente ; peu de specifications publiques detaillees.",
    },
  },
  keySpecs: [
    spec("Architecture", "tail-sitter VTOL group 3", "moyenne", ["edge-omen"]),
    spec("Logiciel", "Lattice for Mission Autonomy", "moyenne", ["edge-omen"]),
    spec("Fonctions", "ISR, relais reseau, logistique, capteurs defense aerienne", "moyenne", ["edge-omen"]),
    spec("Setup", "lancement rapide par deux personnes revendique", "faible", ["edge-omen"]),
    spec("Powertrain", "technologie Archer licenciee a Anduril", "moyenne", ["ibd-omen"]),
    spec("Package", "50 drones Omen annonces pour EDGE", "moyenne", ["ibd-omen"]),
  ],
  bricks: bricks({
    cout:
      "Omen est vendu comme compromis entre plateforme plus grosse et systeme agile : la promesse de cout tient a l'attrition acceptable, a la modularite et au lancement sans piste. Aucun prix public ne stabilise encore cette lecture.",
    finance:
      "Le signal financier le plus concret est le package de 50 Omen rapporte autour de l'accord Archer-Anduril-EDGE. La source est secondaire ; la fiche le garde en confiance moyenne.",
    supplyChain:
      "La chaine combine Anduril pour l'autonomie/Lattice, EDGE pour la base client et Archer pour le powertrain. C'est une chaine transnationale, donc rapide a assembler mais politiquement plus exposee.",
    geopolitique:
      "Omen illustre le rapprochement defense-tech US et EDGE : produire vite des plateformes autonomes exportables vers le Golfe et les theatres allies.",
    export:
      "L'exportabilite dependra du contenu US du systeme, de Lattice et du powertrain Archer. Elle est donc potentiellement forte vers partenaires proches, mais avec exposition de controle americaine.",
    indicators: {
      cout: indicator("Promesse de cout", "plateforme modulaire, runway-independent", "faible", ["edge-omen"]),
      finance: indicator("Package annonce", "50 drones pour EDGE selon Investors.com", "moyenne", ["ibd-omen"]),
      supplyChain: indicator("Roles", "Anduril, EDGE, Archer powertrain", "moyenne", ["edge-omen", "ibd-omen"]),
      geopolitique: indicator("Positionnement", "Alliance defense-tech US / EDGE", "moyenne", ["edge-omen"]),
      export: indicator("Exposition", "Controle US probable sur logiciel et powertrain", "faible", ["ibd-omen"]),
    },
  }),
  scores: scores({
    cost: "C",
    survivability: "C",
    exportability: "C",
    industrialRisk: "C",
    maturity: "D",
    confidence: "C",
    note:
      "Le concept semble pertinent, mais la fiche publique manque de prix, de production livree et de specifications detaillees.",
  }),
  editorial: {
    mythVsReality:
      "Le mythe : Omen est deja une flotte autonome stabilisee. La realite : c'est surtout un signal de coalition industrielle autour d'Anduril, EDGE et Archer.",
    bestUseCase:
      "ISR, relais reseau et charge utile modulaire dans des environnements ou l'absence de piste compte.",
    weakPoint:
      "Peu de donnees publiques hors annonces ; exposition US probable sur logiciel et powertrain.",
    analystNote:
      "Omen merite d'etre dans l'amorce parce qu'il connecte autonomie logicielle, powertrain eVTOL et alliance industrielle, mais presque tout doit rester a recouper.",
  },
  operators: ["EDGE Group / client emirati annonce"],
  theatres: ["Dubai Airshow / annonce industrielle"],
  sources: [
    source("edge-omen", "OMEN product page", "EDGE Group", "https://edgegroup.ae/solutions/omen"),
    source(
      "ibd-omen",
      "Archer Aviation Licenses Flying-Taxi Tech For Anduril Drones",
      "Investors.com",
      "https://www.investors.com/news/archer-aviation-anduril-defense-tech-aerospace-drone/",
      "C",
      "2025",
      "presse",
    ),
    source("archer", "Archer Defense", "Archer", "https://www.archer.com/", "B"),
  ],
  updated: "2026-06-19",
};

export const allagE: DefenseSystem = {
  slug: "allag-e",
  name: "ALLAG-E",
  designation: "Advanced Concepts ALLAG-E",
  reference: "PNP-DR-904",
  category: "drone",
  droneClass: "kamikaze",
  classLabel: "Intercepteur C-UAS sol-air basse altitude",
  country: "Emirats arabes unis",
  flag: "🇦🇪",
  manufacturer: "Advanced Concepts · EDGE Group",
  status:
    "Produit C-UAS affiche par EDGE ; donnees constructeur sans contrat public recoupe dans cette fiche",
  acquisitionModes: ["DCS", "production-nationale"],
  tagline:
    "Un intercepteur C-UAS a charge lethalisee, concu pour rendre la defense anti-drone moins dependante des missiles chers.",
  summary:
    "ALLAG-E est presente comme un systeme ground-to-air contre drones ISR, munitions rodeuses et multirotors. Son profil est plus proche d'un consommable C-UAS que d'un drone reutilisable : deux EDF, charge de 1,7 kg, navigation guidee puis attaque par flux optique selon EDGE. Les claims restent classes prudemment, faute de retour client ou d'essais independants publies.",
  autonomyProfile: {
    battlefieldFunctions: ["counter-uas", "air-defense"],
    autonomyModes: ["manual-assisted", "terminal-autonomy"],
    navigationGuidance: {
      opticalFlow: true,
      notes: "EDGE indique guidage RF en croisiere et flux optique en phase d'attaque.",
    },
    networkAndC2: {
      datalinkTypes: ["RF link"],
      losRange: "30 km LOS revendiques",
      notes: "Fonctionnement anti-jamming revendique, sans details techniques publics.",
    },
    recoverability: "consumable",
    industrialRoles: {
      prime: ["Advanced Concepts"],
      integrator: ["EDGE Group"],
      production: ["Emirats arabes unis"],
    },
    sourceContext: {
      contexts: ["official-spec", "official-marketing-claim"],
      sourceDate: "2026",
      varianceNotes: "Page produit officielle, non corrobooree par contrat public dans cette fiche.",
    },
  },
  keySpecs: [
    spec("Role", "contre drones ISR, munitions rodeuses, multirotors", "moyenne", ["edge-allag-e"]),
    spec("Vitesse", "250+ km/h en croisiere", "moyenne", ["edge-allag-e"]),
    spec("Altitude cible", "jusqu'a 3 000 m revendiques", "moyenne", ["edge-allag-e"]),
    spec("Charge", "1,7 kg fragmentation / cutting disk", "moyenne", ["edge-allag-e"]),
    spec("Portee communication", "30 km LOS", "moyenne", ["edge-allag-e"]),
    spec("Navigation", "guidage sol en croisiere, self-guiding en attaque", "faible", ["edge-allag-e"]),
  ],
  bricks: bricks({
    cout:
      "ALLAG-E existe pour corriger l'economie C-UAS : ne pas employer un missile sol-air cher contre une cible a bas cout. Le prix unitaire n'est pas public.",
    finance:
      "La fiche publique indique une offre industrielle EDGE, sans commande publiee rattachee ici. Le financement est donc lu comme capacite export ou achat national potentiel.",
    supplyChain:
      "La chaine visible est emirati : Advanced Concepts comme maitre d'oeuvre et EDGE comme groupe integrateur. Les capteurs, proximite et charge militaire restent a documenter.",
    geopolitique:
      "ALLAG-E renforce le positionnement EDGE sur les couches anti-drones bas cout, une demande devenue structurante apres l'Ukraine et la mer Rouge.",
    export:
      "Produit sensible : charge militaire, proximite et emploi C-UAS. Export probable au cas par cas avec autorisations emiratiennes et end-user strict.",
    indicators: {
      cout: indicator("Ratio cout/menace", "Intercepteur dedie aux drones bas cout", "moyenne", ["edge-allag-e"]),
      finance: indicator("Statut", "Offre produit EDGE, commande non documentee ici", "moyenne", ["edge-allag-e"]),
      supplyChain: indicator("Maitre d'oeuvre", "Advanced Concepts / EDGE", "haute", ["edge-allag-e"]),
      geopolitique: indicator("Demande", "C-UAS basse altitude", "moyenne", ["edge-allag-e"]),
      export: indicator("Sensibilite", "Intercepteur lethalise soumis a controle strict", "moyenne", ["edge-allag-e"]),
    },
  }),
  scores: scores({
    cost: "B",
    survivability: "C",
    exportability: "C",
    industrialRisk: "C",
    maturity: "C",
    confidence: "C",
    note:
      "Le cout/effet C-UAS est coherent, mais le prix et la performance d'interception ne sont pas verifies hors constructeur.",
  }),
  editorial: {
    mythVsReality:
      "Le mythe : un mini missile anti-drone suffit a resoudre le C-UAS. La realite : il faut capteur, C2, autorisation de tir et chaine d'approvisionnement.",
    bestUseCase:
      "Protection de site ou de force contre drones ISR et munitions rodeuses a basse altitude.",
    weakPoint:
      "Donnees de performance non recoupees et dependance a une detection/cueing externe.",
    analystNote:
      "ALLAG-E est important comme facette C-UAS : il transforme la fiche drone en effecteur de defense aerienne.",
  },
  operators: commonOperators,
  theatres: commonTheatres,
  sources: [
    source("edge-allag-e", "ALLAG-E Ground-to-Air Interceptor UAV", "EDGE Group", "https://edgegroup.ae/solutions/allag-e"),
  ],
  updated: "2026-06-19",
};

export const jernasM: DefenseSystem = {
  slug: "jernas-m",
  name: "JERNAS-M",
  designation: "ADASI JERNAS-M",
  reference: "PNP-DR-905",
  category: "drone",
  droneClass: "MALE",
  classLabel: "MALE tactique multi-mission",
  country: "Emirats arabes unis",
  flag: "🇦🇪",
  manufacturer: "ADASI · EDGE Group",
  status:
    "UAV multi-mission presente par EDGE ; range public incoherent entre narratif et tableau, donc a recouper",
  acquisitionModes: ["DCS", "production-nationale"],
  tagline:
    "Un MALE tactique emirati qui combine ISR, capteurs EW et option d'armement dans une enveloppe cout reduit.",
  summary:
    "JERNAS-M est une plateforme fixe MALE compacte d'ADASI. EDGE la decrit comme multi-mission : ISR, attaque au sol, capteurs EO/radar/EW et armement RASH. Le dossier est utile pour la facette fonctionnelle, mais conserve une alerte qualite : la page EDGE mentionne a la fois un range LOS de 200 km et un tableau indiquant 3 600 km, signe qu'il faut traiter les chiffres avec prudence.",
  autonomyProfile: {
    battlefieldFunctions: ["isr", "strike", "ew"],
    autonomyModes: ["autonomous-flight", "manual-assisted"],
    navigationGuidance: {
      gnss: true,
      inertial: true,
      notes: "Guidage et FCS non detailles publiquement dans la page EDGE.",
    },
    networkAndC2: {
      losRange: "200 km LOS dans le narratif EDGE ; tableau public contradictoire",
      notes: "Configuration datalink client non publiee.",
    },
    recoverability: "reusable",
    industrialRoles: {
      prime: ["ADASI"],
      integrator: ["EDGE Group"],
      production: ["Emirats arabes unis"],
    },
    sourceContext: {
      contexts: ["official-spec", "official-marketing-claim"],
      sourceDate: "2026",
      varianceNotes: "Contradiction publique sur la portee LOS ; donnees range classees faibles.",
    },
  },
  keySpecs: [
    spec("MTOW", "1 200 kg", "haute", ["edge-jernas-m"]),
    spec("Endurance", "20 h ISR ; 12 h max payload", "moyenne", ["edge-jernas-m"]),
    spec("Payload", "280 kg maximum", "moyenne", ["edge-jernas-m"]),
    spec("Vitesse", "240 km/h max / cruise publie", "moyenne", ["edge-jernas-m"]),
    spec("Capteurs", "EO, radar, EW selon configuration", "moyenne", ["edge-jernas-m"]),
    spec("Range LOS", "200 km narratif ; 3 600 km dans tableau EDGE", "faible", ["edge-jernas-m"], "Incoherence source officielle a recouper avant usage analytique."),
  ],
  bricks: bricks({
    cout:
      "JERNAS-M revendique un positionnement low-cost MALE tactique. Sans prix public, le cout s'analyse par charge utile et endurance plutot que par ticket d'achat.",
    finance:
      "Le financement visible est industriel : plateforme ADASI dans catalogue EDGE, sans contrat client publie dans cette amorce.",
    supplyChain:
      "La chaine est emirati-centree avec ADASI comme maitre d'oeuvre. Les capteurs et armements modulaires peuvent faire varier fortement le contenu export.",
    geopolitique:
      "JERNAS-M sert la strategie des Emirats : disposer d'un MALE national/export, moins dependant des fournisseurs turcs, chinois ou americains.",
    export:
      "L'exportabilite dependra des charges utiles, surtout radar/EW et armement RASH. La cellule seule est moins sensible que le package arme complet.",
    indicators: {
      cout: indicator("Positionnement", "MALE tactique low-cost revendique", "moyenne", ["edge-jernas-m"]),
      finance: indicator("Statut", "Catalogue EDGE / ADASI", "haute", ["edge-jernas-m"]),
      supplyChain: indicator("Chaine", "ADASI, capteurs et armements modulaires", "moyenne", ["edge-jernas-m"]),
      geopolitique: indicator("Souverainete", "MALE national emirati", "moyenne", ["edge-jernas-m"]),
      export: indicator("Contrainte", "Package arme plus sensible que cellule ISR", "moyenne", ["edge-jernas-m"]),
    },
  }),
  scores: scores({
    cost: "C",
    survivability: "C",
    exportability: "C",
    industrialRisk: "C",
    maturity: "C",
    confidence: "D",
    note:
      "Le positionnement est plausible, mais la contradiction publique sur la portee degrade la confiance globale.",
  }),
  editorial: {
    mythVsReality:
      "Le mythe : un MALE national suffit a garantir souverainete. La realite : les charges utiles, datalinks et armements font la vraie dependance.",
    bestUseCase:
      "ISR tactique persistant avec option d'armement dans un package export EDGE.",
    weakPoint:
      "Donnees publiques incoherentes sur la portee et peu de retour operateur.",
    analystNote:
      "JERNAS-M est volontairement conserve avec une confiance faible sur certains chiffres : la fiche doit signaler les contradictions, pas les lisser.",
  },
  operators: commonOperators,
  theatres: commonTheatres,
  sources: [
    source("edge-jernas-m", "JERNAS-M MALE Tactical Multi-Mission UAV", "EDGE Group", "https://edgegroup.ae/solutions/jernas-m"),
  ],
  updated: "2026-06-19",
};

export const shadow3: DefenseSystem = {
  slug: "shadow-3",
  name: "SHADOW-3",
  designation: "ADASI SHADOW-3",
  reference: "PNP-DR-906",
  category: "drone",
  droneClass: "munition-rodeuse",
  classLabel: "Drone portable dual mission C-UAS / frappe",
  country: "Emirats arabes unis",
  flag: "🇦🇪",
  manufacturer: "ADASI · EDGE Group",
  status:
    "Produit portable affiche par EDGE ; fonctions C-UAS et frappe revendiquees, a recouper hors page constructeur",
  acquisitionModes: ["DCS", "production-nationale"],
  tagline:
    "La fiche qui brouille volontairement les lignes : intercepteur anti-drone, munition guidee et outil EW portable.",
  summary:
    "SHADOW-3 est presente par EDGE comme un drone VTOL portable a double mission : contre-mesure drone ou munition de frappe guidee. Les caracteristiques publiques le placent sur un segment tres reactif : 30+ km de portee, 20 minutes d'endurance et propulsion electrique ou turbine jet. La fiche classe les claims d'autonomie terminale en prudence moyenne/faible car ils viennent d'une page produit.",
  autonomyProfile: {
    battlefieldFunctions: ["counter-uas", "strike", "ew"],
    autonomyModes: ["terminal-autonomy", "manual-assisted"],
    navigationGuidance: {
      gnss: true,
      vision: true,
      terminalSeeker: "GNSS / optical seeker",
      notes: "EDGE revendique computer vision navigation and target recognition.",
    },
    networkAndC2: {
      notes: "Launcher system publie ; architecture C2 detaillee non publiee.",
    },
    recoverability: "consumable",
    industrialRoles: {
      prime: ["ADASI"],
      integrator: ["EDGE Group"],
      production: ["Emirats arabes unis"],
    },
    sourceContext: {
      contexts: ["official-spec", "official-marketing-claim"],
      sourceDate: "2026",
      varianceNotes: "Autonomous target acquisition and engagement est une revendication marketing non recoupee ici.",
    },
  },
  keySpecs: [
    spec("Portee", "30+ km", "moyenne", ["edge-shadow-3"]),
    spec("Endurance", "jusqu'a 20 min", "moyenne", ["edge-shadow-3"]),
    spec("Payload", "3 kg", "moyenne", ["edge-shadow-3"]),
    spec("Vitesse max", "200+ a 400+ km/h selon propulsion", "moyenne", ["edge-shadow-3"]),
    spec("Guidage", "GNSS / optical seeker", "moyenne", ["edge-shadow-3"]),
    spec("Autonomie terminale", "target acquisition and engagement revendiques", "faible", ["edge-shadow-3"]),
  ],
  bricks: bricks({
    cout:
      "SHADOW-3 vise le cout d'un effecteur portable polyvalent : un meme systeme peut couvrir interception, EW ou frappe. Le prix n'est pas publie.",
    finance:
      "Aucune commande precise n'est rattachee ici a SHADOW-3 ; le dossier reste une offre produit ADASI/EDGE.",
    supplyChain:
      "ADASI fournit la plateforme, la propulsion pouvant varier entre electrique et turbine jet. Cette variabilite complique la lecture cout et export.",
    geopolitique:
      "Le systeme repond a la demande post-Ukraine pour des effecteurs portables et rapides, capables de traiter drones et cibles ponctuelles.",
    export:
      "L'export est sensible car la fiche combine intercepteur, munition et autonomie terminale. Les regimes dependront de la charge et du seeker.",
    indicators: {
      cout: indicator("Polyvalence", "C-UAS, EW ou frappe dans format portable", "moyenne", ["edge-shadow-3"]),
      finance: indicator("Statut", "Produit EDGE, commande non documentee ici", "moyenne", ["edge-shadow-3"]),
      supplyChain: indicator("Variantes", "propulsion electrique ou turbine jet", "moyenne", ["edge-shadow-3"]),
      geopolitique: indicator("Demande", "Effecteurs portables anti-drone / frappe", "moyenne", ["edge-shadow-3"]),
      export: indicator("Sensibilite", "Seeker et charge terminale a controler", "moyenne", ["edge-shadow-3"]),
    },
  }),
  scores: scores({
    cost: "B",
    survivability: "C",
    exportability: "C",
    industrialRisk: "C",
    maturity: "C",
    confidence: "C",
    note:
      "La polyvalence C-UAS/frappe est attractive, mais l'absence de prix et de recoupement impose une note prudente.",
  }),
  editorial: {
    mythVsReality:
      "Le mythe : SHADOW-3 serait seulement une munition rodeuse. La realite : EDGE le positionne aussi comme contre-mesure drone et outil EW.",
    bestUseCase:
      "Unite tactique cherchant un effecteur portable rapide contre drones ou cibles ponctuelles.",
    weakPoint:
      "Claims d'autonomie terminale et de reconnaissance cible non recoupes hors constructeur.",
    analystNote:
      "SHADOW-3 est une fiche utile pour tester la facette Fonction : un meme objet coche C-UAS, EW et frappe.",
  },
  operators: commonOperators,
  theatres: commonTheatres,
  sources: [
    source("edge-shadow-3", "SHADOW-3 Dual-Mission Portable VTOL Drone", "EDGE Group", "https://edgegroup.ae/solutions/shadow-3"),
  ],
  updated: "2026-06-19",
};

export const strilaQuantumWiy: DefenseSystem = {
  slug: "strila-quantum-wiy",
  name: "STRILA",
  designation: "WIY STRILA · Quantum Systems",
  reference: "PNP-DR-907",
  category: "drone",
  droneClass: "kamikaze",
  classLabel: "Intercepteur C-UAS semi-autonome",
  country: "Ukraine · Allemagne",
  flag: "🇺🇦",
  manufacturer: "WIY · Quantum Systems",
  status:
    "Intercepteur C-UAS battlefield-proven selon Quantum Systems ; donnees techniques officielles mais claims terrain a recouper",
  acquisitionModes: ["DCS", "cooperatif"],
  tagline:
    "L'intercepteur rapide pense pour restaurer l'economie de la defense aerienne contre Shahed et drones ISR.",
  summary:
    "STRILA est presente par Quantum Systems comme un intercepteur C-UAS issu de WIY, concu pour traiter Shahed-136/131 et drones ISR. Sa logique est economique autant qu'operationnelle : eviter de consommer des missiles de valeur contre des menaces a bas cout. La fiche inclut les specifications publiees, mais classe les claims 'battlefield proven' et les scenarios d'interception comme source officielle a recouper.",
  autonomyProfile: {
    battlefieldFunctions: ["counter-uas", "air-defense"],
    autonomyModes: ["manual-assisted", "terminal-autonomy"],
    navigationGuidance: {
      gnss: true,
      vision: true,
      terminalSeeker: "EO/IR avec controle operateur en approche finale",
      notes:
        "Quantum decrit une guidance semi-autonome vers le secteur cible, puis controle manuel terminal.",
    },
    networkAndC2: {
      datalinkTypes: ["liaison protegee revendiquee", "radar cueing"],
      notes:
        "Integration radar et WIY Ground Control Station ; details de protocole non publics.",
    },
    recoverability: "attritable",
    industrialRoles: {
      prime: ["WIY"],
      integrator: ["Quantum Systems"],
      autonomySoftware: ["WIY Ground Control Station", "Quantum Systems ecosystem"],
      production: ["Ukraine / Europe a confirmer"],
    },
    sourceContext: {
      contexts: ["official-spec", "official-marketing-claim"],
      sourceDate: "2026",
      varianceNotes:
        "Page produit officielle ; les retours battlefield-proven ne sont pas detailles par contrat ou rapport independant.",
    },
  },
  keySpecs: [
    spec("MTOW", "5,7 kg", "haute", ["quantum-strila"]),
    spec("Payload", "700 g", "haute", ["quantum-strila"]),
    spec("Vitesse max", "415 km/h", "moyenne", ["quantum-strila"]),
    spec("Portee", "34 km one-way", "moyenne", ["quantum-strila"]),
    spec("Altitude max", "6 000 m", "moyenne", ["quantum-strila"]),
    spec("Mode", "semi-autonome, controle manuel en phase finale", "moyenne", ["quantum-strila"]),
  ],
  bricks: bricks({
    cout:
      "STRILA est explicitement pense pour restaurer le ratio cout/effet de la defense aerienne : traiter des munitions rodeuses avec un intercepteur dedie plutot qu'un missile rare et cher.",
    finance:
      "Le financement public detaille n'est pas documente ici. Le signal programme vient de Quantum Systems, qui integre STRILA a son ecosysteme C-UAS.",
    supplyChain:
      "La chaine associe WIY comme origine du produit et Quantum Systems comme integrateur/industrialiseur. Les capteurs EO/IR et la station sol sont les briques a suivre.",
    geopolitique:
      "STRILA est directement lie au theatre ukrainien et a la saturation Shahed : il illustre la reponse europeenne/ukrainienne a une menace industrielle russe-iranienne.",
    export:
      "L'exportabilite est sensible : systeme C-UAS kinetic, experience ukrainienne et possibles controles allemands/europeens via Quantum Systems.",
    indicators: {
      cout: indicator("Ratio cout/effet", "Intercepteur dedie a menaces Shahed-class", "moyenne", ["quantum-strila"]),
      finance: indicator("Statut programme", "Integre au portefeuille cUAS Quantum Systems", "moyenne", ["quantum-strila"]),
      supplyChain: indicator("Roles", "WIY produit, Quantum Systems integre", "moyenne", ["quantum-strila"]),
      geopolitique: indicator("Theatre", "Reponse a la saturation drone en Ukraine", "moyenne", ["quantum-strila"]),
      export: indicator("Contrainte", "C-UAS kinetic, controles europeens probables", "moyenne", ["quantum-strila"]),
    },
  }),
  scores: scores({
    cost: "B",
    survivability: "C",
    exportability: "C",
    industrialRisk: "C",
    maturity: "C",
    confidence: "C",
    note:
      "La logique economique C-UAS est solide, mais la validation battlefield-proven reste formulee par le constructeur.",
  }),
  editorial: {
    mythVsReality:
      "Le mythe : STRILA est un missile miniature. La realite : c'est un drone intercepteur semi-autonome, avec operateur dans la boucle terminale.",
    bestUseCase:
      "Couche C-UAS mobile contre Shahed-class et drones ISR a moyenne altitude.",
    weakPoint:
      "La fiche publique raconte un scenario complet ; il faut le separer de la performance verifiee en conditions reelles.",
    analystNote:
      "STRILA est le bon exemple d'une autonomie acceptable politiquement : assistance et cueing automatique, mais autorite humaine conservee au moment critique.",
  },
  operators: ["Ukraine / utilisateurs non detailles publiquement"],
  theatres: ["Ukraine · defense contre Shahed et drones ISR"],
  sources: [
    source("quantum-strila", "STRILA Counter-UAV Interceptor", "Quantum Systems", "https://quantum-systems.com/strila/"),
    source(
      "quantum-airbus-cuas",
      "Quantum Systems expands Counter-UAS ecosystem through Airbus Helicopters partnership",
      "Quantum Systems",
      "https://quantum-systems.com/news/quantum-systems-airbus-helicopters-counter-uas-partnership/",
      "B",
      "2026-06-10",
    ),
  ],
  updated: "2026-06-19",
};
