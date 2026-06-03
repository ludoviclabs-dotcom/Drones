import { makeNavalSystem } from "./naval-multinational";

// Pack naval Chine — masse industrielle et accélération de la PLAN. RÉGIME DE
// CONFIANCE ABAISSÉ : sources triangulées (CSIS, USNI, presse spécialisée),
// indicateurs en confiance moyenne/faible et statut « à recouper », score
// confiance-données C/D. Les données sous-marines et fines restent opaques.

export const fujian = makeNavalSystem({
  slug: "fujian",
  name: "Fujian",
  designation: "Type 003 · porte-avions EMALS chinois",
  reference: "PNP-NS-033",
  navalVesselClass: "porte-avions",
  classLabel: "Porte-avions EMALS conventionnel",
  country: "Chine",
  flag: "🇨🇳",
  manufacturer: "China State Shipbuilding Corporation (CSSC) · chantier Jiangnan",
  introduced: "2025",
  status: "Mis en service en 2025 ; montée en puissance opérationnelle",
  acquisitionModes: ["production-nationale"],
  updated: "2026-06-03",
  tagline:
    "Le Fujian est le premier porte-avions chinois à catapultes électromagnétiques (EMALS) : un saut aéronaval majeur, mais à lire avec prudence sur les sources.",
  summary:
    "Le Fujian (Type 003) est le troisième porte-avions chinois et le premier conçu pour le décollage assisté par catapultes électromagnétiques (EMALS), à propulsion conventionnelle, pour ≈ 80 000–85 000 t. Il met en œuvre J-15T, J-35 et l'AEW KJ-600.\n\nPour Panoplie, c'est une référence majeure de la PLAN, mais à régime de confiance abaissé : l'essentiel des chiffres provient de l'imagerie, de think-tanks et de la presse spécialisée, rarement de sources primaires chinoises.",
  profile: {
    platform: {
      missions: ["projection", "strike", "presence"],
      displacement: "≈ 80 000–85 000 t pleine charge (estimation)",
      crew: "Plusieurs milliers avec groupe aérien (estimation)",
      aviation: ["J-15T", "J-35", "KJ-600 (AEW)"],
      notes: "Premier porte-avions chinois à EMALS ; propulsion conventionnelle (non nucléaire).",
    },
    combatSystem: {
      family: "autre",
      cms: "Système de combat naval chinois (non documenté en source primaire)",
      tacticalLinks: ["Réseaux PLAN (peu documentés publiquement)"],
      ballisticMissileDefense: false,
      interoperabilityNotes: "Nœud central d'un futur groupe aéronaval de la PLAN.",
    },
    sensors: {
      radarPrimary: "Radar AESA à panneaux fixes (famille Type 346, estimation)",
      esm: ["Suite EW chinoise (peu documentée)"],
    },
    effectors: {
      ciws: ["HHQ-10", "CIWS Type 1130"],
      aviationWeapons: ["Groupe aérien embarqué (J-15T, J-35)"],
    },
    propulsion: {
      architecture: "autre",
      maxSpeed: "≈ 30 kt (estimation)",
      notes: "Propulsion conventionnelle ; EMALS alimentée par un système électrique intégré moyenne tension (revendiqué).",
    },
    industrial: {
      primeContractor: "China State Shipbuilding Corporation (CSSC)",
      shipyards: ["Shanghai (Jiangnan)"],
      suppliers: [
        { subsystem: "Plateforme et EMALS", supplier: "CSSC / industrie d'État chinoise", country: "Chine" },
      ],
      localContentNotes: "Chaîne entièrement nationale ; opacité forte sur les fournisseurs critiques.",
    },
    export: {
      regimeSummary: "Capacité souveraine non exportée.",
      itarExposure: "aucune",
      politicalConstraints: "Aucune logique d'export ; objet de puissance nationale.",
    },
    sustainment: {
      sustainmentNotes: "Coût et soutien réels non publiés ; lecture par analogie avec les grands porte-avions.",
      industrialRiskNotes: "Mise au point EMALS et montée en compétence du groupe aérien embarqué à confirmer.",
    },
  },
  keySpecs: [
    { label: "Déplacement", value: "≈ 80 000–85 000 t (estimation)", confidence: "moyenne", status: "a-recouper", sources: ["csis-fujian"] },
    { label: "Catapultes", value: "3 catapultes électromagnétiques (EMALS)", confidence: "moyenne", sources: ["csis-fujian"] },
    { label: "Propulsion", value: "Conventionnelle (non nucléaire)", confidence: "moyenne", sources: ["csis-fujian"] },
    { label: "Aviation", value: "J-15T · J-35 · KJ-600", confidence: "moyenne", status: "a-recouper", sources: ["nt-fujian"] },
    { label: "Mise en service", value: "2025", confidence: "moyenne", status: "a-recouper", sources: ["usni-fujian"] },
    { label: "Constructeur", value: "CSSC · Jiangnan (Shanghai)", confidence: "moyenne", sources: ["csis-fujian"] },
  ],
  costNarrative:
    "Le coût du Fujian n'est pas publié ; il se lit par analogie (coque, EMALS, groupe aérien, escorte, soutien). Toute estimation chiffrée reste à recouper.",
  financeNarrative:
    "Financement d'État chinois opaque ; le Fujian s'inscrit dans une trajectoire industrielle de porte-avions accélérée.",
  supplyNarrative:
    "La chaîne est entièrement nationale (CSSC). L'opacité sur les fournisseurs critiques impose une lecture prudente.",
  geopoliticsNarrative:
    "Le Fujian fait franchir un seuil à la PLAN : aviation embarquée lancée par catapulte, projection accrue en Indo-Pacifique et au-delà du premier rideau d'îles.",
  exportNarrative:
    "Capacité souveraine sans dimension export ; la comparaison utile porte sur l'écosystème (groupe aérien, escorte, soutien), pas sur un prix.",
  editorial: {
    mythVsReality:
      "Le mythe : le Fujian égale déjà un supercarrier américain. La réalité : un saut réel (EMALS), mais une capacité opérationnelle encore en montée et des données partielles.",
    bestUseCase: "Projection de puissance régionale, présence et apprentissage de l'aéronavale catapultée à grande échelle.",
    weakPoint: "Propulsion conventionnelle (endurance), maturité du groupe aérien et opacité des données.",
    analystNote:
      "À comparer à Charles de Gaulle (CATOBAR nucléaire) et Gerald R. Ford : même fonction catapultée, mais régime de confiance bien plus faible — trianguler systématiquement.",
  },
  operators: ["Chine — PLA Navy"],
  theatres: ["Mer de Chine méridionale", "Pacifique Ouest", "Indo-Pacifique"],
  timeline: [
    { date: "2022", label: "Lancement du Fujian au chantier Jiangnan.", kind: "jalon" },
    { date: "2024", label: "Campagne d'essais à la mer documentée par sources ouvertes.", kind: "jalon" },
    { date: "2025", label: "Mise en service rapportée par sources ouvertes.", kind: "jalon" },
  ],
  sources: [
    {
      id: "csis-fujian",
      title: "How Advanced Is China's Third Aircraft Carrier?",
      publisher: "CSIS ChinaPower Project",
      type: "think-tank",
      reliability: "B",
      url: "https://chinapower.csis.org/china-type-003-fujian-aircraft-carrier/",
    },
    {
      id: "usni-fujian",
      title: "China's First Supercarrier",
      publisher: "U.S. Naval Institute Proceedings",
      type: "think-tank",
      reliability: "B",
      date: "2026",
      url: "https://www.usni.org/magazines/proceedings/2026/march/chinas-first-supercarrier",
    },
    {
      id: "nt-fujian",
      title: "PLA Navy commissions Fujian, China's first carrier with EMALS catapults",
      publisher: "Naval Technology",
      type: "presse",
      reliability: "B",
      url: "https://www.naval-technology.com/news/pla-navy-commission-fujian-chinas-first-carrier-with-emals-catapults/",
    },
  ],
  sourceIds: { primary: "csis-fujian", combat: "csis-fujian", industrial: "csis-fujian", export: "csis-fujian" },
  scores: {
    "efficacite-cout": ["C", "Saut capacitaire réel, mais coût opaque et capacité opérationnelle encore en montée."],
    survivabilite: ["C", "Dépendance à l'escorte et au groupe aérien ; données de protection peu publiques."],
    exportabilite: ["E", "Capacité souveraine non exportée."],
    "risque-industriel": ["B", "Industrie d'État massive et rapide, mais maîtrise EMALS et groupe aérien à confirmer."],
    maturite: ["C", "Mise en service récente ; pleine capacité opérationnelle non atteinte."],
    "confiance-donnees": ["D", "Données surtout indirectes (imagerie, think-tanks, presse) ; sources primaires rares."],
  },
});

export const type055 = makeNavalSystem({
  slug: "type-055",
  name: "Type 055 (Renhai)",
  designation: "Type 055 · grand destroyer lance-missiles chinois",
  reference: "PNP-NS-034",
  navalVesselClass: "destroyer",
  classLabel: "Grand destroyer lance-missiles (Renhai)",
  country: "Chine",
  flag: "🇨🇳",
  manufacturer: "CSSC — chantiers Jiangnan (Shanghai) et Dalian",
  introduced: "2020",
  status: "En service (≈ 8 unités) ; classé « croiseur » par le DoD américain",
  acquisitionModes: ["production-nationale"],
  updated: "2026-06-03",
  tagline:
    "Le Type 055 est le grand escorteur de la PLAN : ≈ 13 000 t, 112 cellules de lancement et radar bi-bande — le DoD le classe comme croiseur.",
  summary:
    "Le Type 055 (OTAN/DoD : Renhai, parfois « croiseur ») est le grand escorteur de surface chinois : ≈ 180 m, ≈ 13 000 t, 112 cellules de lancement universelles et un radar bi-bande. Il porte HHQ-9/HHQ-16, des YJ-18 et, selon les revendications, des YJ-21.\n\nPour Panoplie, c'est l'escorteur de référence de la PLAN à comparer à l'Arleigh Burke, au Maya et au KDX-III Batch II — mais avec un régime de confiance abaissé sur les performances fines.",
  profile: {
    platform: {
      missions: ["AAW", "ASuW", "ASW", "strike"],
      displacement: "≈ 13 000 t pleine charge",
      crew: "≈ 300 marins (estimation)",
      aviation: ["Hélicoptères ASM"],
      notes: "Grand escorteur d'escadre ; pilier de défense et de frappe d'un futur groupe aéronaval.",
    },
    combatSystem: {
      family: "autre",
      cms: "Système de combat naval chinois (peu documenté en source primaire)",
      tacticalLinks: ["Réseaux PLAN (peu documentés publiquement)"],
      ballisticMissileDefense: false,
      interoperabilityNotes: "Escorte de groupe et nœud de frappe antinavire/terrestre.",
    },
    sensors: {
      radarPrimary: "Radar bi-bande à panneaux fixes (famille Type 346B, estimation)",
      esm: ["Suite EW chinoise (peu documentée)"],
    },
    effectors: {
      vlsType: "VLS universel chinois",
      vlsCells: "112 cellules",
      sam: ["HHQ-9", "HHQ-16"],
      antiShipMissiles: ["YJ-18", "YJ-21 (revendiqué)"],
      antiSubWeapons: ["Torpilles", "missiles ASM"],
      navalGuns: ["130 mm"],
      ciws: ["HHQ-10", "Type 1130"],
    },
    propulsion: {
      architecture: "autre",
      primeMovers: ["COGAG — turbines à gaz (estimation)"],
      maxSpeed: "≈ 30 kt (estimation)",
    },
    industrial: {
      primeContractor: "China State Shipbuilding Corporation (CSSC)",
      shipyards: ["Shanghai (Jiangnan)", "Dalian"],
      suppliers: [
        { subsystem: "Plateforme et systèmes", supplier: "Industrie d'État chinoise", country: "Chine" },
      ],
      localContentNotes: "Chaîne nationale produite en série rapide ; fournisseurs critiques opaques.",
    },
    export: {
      regimeSummary: "Non exporté ; capacité de premier rang réservée à la PLAN.",
      itarExposure: "aucune",
      politicalConstraints: "Pas de logique export pour cette classe.",
    },
    sustainment: {
      sustainmentNotes: "Coûts et soutien non publiés ; cadence de production élevée documentée par sources ouvertes.",
    },
  },
  keySpecs: [
    { label: "Déplacement", value: "≈ 13 000 t", confidence: "moyenne", status: "a-recouper", sources: ["nn-type055"] },
    { label: "VLS", value: "112 cellules de lancement universelles", confidence: "moyenne", sources: ["nn-type055"] },
    { label: "Radar", value: "Bi-bande à panneaux fixes (estimation)", confidence: "faible", status: "a-recouper", sources: ["usni-pla"] },
    { label: "Armement", value: "HHQ-9 · YJ-18 · 130 mm", confidence: "moyenne", status: "a-recouper", sources: ["nn-type055"] },
    { label: "Classification", value: "« Croiseur » selon le DoD américain", confidence: "moyenne", sources: ["usni-pla"] },
    { label: "Unités", value: "≈ 8 en service", confidence: "moyenne", status: "a-recouper", sources: ["usni-pla"] },
  ],
  costNarrative:
    "Le coût du Type 055 n'est pas publié ; sa valeur se lit dans la densité VLS et la production en série, à recouper systématiquement.",
  financeNarrative:
    "Financement d'État opaque ; la série rapide traduit une priorité industrielle forte de la PLAN.",
  supplyNarrative:
    "Chaîne entièrement nationale (CSSC, Jiangnan, Dalian) ; opacité sur les sous-systèmes critiques.",
  geopoliticsNarrative:
    "Le Type 055 est l'ossature d'escorte de la montée en puissance navale chinoise, en mer de Chine et au-delà du premier rideau d'îles.",
  exportNarrative:
    "Non exporté ; comparaison utile sur la fonction d'escorte plutôt que sur un marché.",
  editorial: {
    mythVsReality:
      "Le mythe : un Arleigh Burke chinois. La réalité : un grand escorteur très armé, mais dont la maturité réseau et les capteurs restent mal documentés.",
    bestUseCase: "Escorte d'escadre, défense aérienne de zone et frappe antinavire/terrestre au sein d'un groupe PLAN.",
    weakPoint: "Maturité ASM et réseau de combat peu documentées ; performances fines à recouper.",
    analystNote:
      "À comparer à l'Arleigh Burke, au Maya et au KDX-III Batch II : densité VLS comparable, mais confiance des données nettement plus faible.",
  },
  operators: ["Chine — PLA Navy"],
  theatres: ["Mer de Chine méridionale", "Mer de Chine orientale", "Pacifique Ouest"],
  timeline: [
    { date: "2020", label: "Admission au service de la tête de série Nanchang.", kind: "jalon" },
    { date: "2021", label: "Mise en service simultanée de plusieurs grandes unités rapportée par sources ouvertes.", kind: "jalon" },
  ],
  sources: [
    {
      id: "nn-type055",
      title: "China commissions a Type 055 DDG, a Type 075 LHD and a Type 094 SSBN in a single day",
      publisher: "Naval News",
      type: "presse",
      reliability: "B",
      date: "2021",
      url: "https://www.navalnews.com/naval-news/2021/04/china-commissions-a-type-055-ddg-a-type-075-lhd-and-a-type-094-ssbn-in-a-single-day/",
    },
    {
      id: "usni-pla",
      title: "The PLA Navy Comes of Age: Big Decks and More",
      publisher: "U.S. Naval Institute Proceedings",
      type: "think-tank",
      reliability: "B",
      date: "2025",
      url: "https://www.usni.org/magazines/proceedings/2025/may/pla-navy-comes-age-big-decks-and-more",
    },
  ],
  sourceIds: { primary: "nn-type055", combat: "usni-pla", industrial: "nn-type055", export: "usni-pla" },
  scores: {
    "efficacite-cout": ["C", "Forte densité d'armement produite en série ; coût opaque et maturité réseau incertaine."],
    survivabilite: ["C", "Capteurs et VLS ambitieux ; performances réelles et défense fine peu documentées."],
    exportabilite: ["E", "Non exporté."],
    "risque-industriel": ["B", "Production en série rapide ; fournisseurs critiques opaques."],
    maturite: ["B", "Classe en service en nombre, mais retour d'expérience opérationnel limité publiquement."],
    "confiance-donnees": ["C", "Données surtout indirectes ; chiffres et capteurs à recouper."],
  },
});

export const type075 = makeNavalSystem({
  slug: "type-075",
  name: "Type 075 (Yushen)",
  designation: "Type 075 · porte-hélicoptères d'assaut chinois",
  reference: "PNP-NS-035",
  navalVesselClass: "amphibie",
  classLabel: "Porte-hélicoptères d'assaut (LHD)",
  country: "Chine",
  flag: "🇨🇳",
  manufacturer: "CSSC — chantier Hudong-Zhonghua (Shanghai)",
  introduced: "2021",
  status: "En service (3 unités : Hainan, Guangxi, Anhui)",
  acquisitionModes: ["production-nationale"],
  updated: "2026-06-03",
  tagline:
    "Le Type 075 est le grand amphibie de la PLAN : ≈ 36 000–40 000 t, radier, environ 28 hélicoptères — la projection chinoise par la mer.",
  summary:
    "Le Type 075 (Yushen) est un porte-hélicoptères d'assaut (LHD) de ≈ 237 m et ≈ 36 000–40 000 t, doté d'un radier pour chalands et capable de mettre en œuvre une trentaine d'hélicoptères. Trois unités (Hainan, Guangxi, Anhui) sont en service.\n\nPour Panoplie, c'est le comparateur amphibie chinois face au Mistral, au Dokdo/Marado et à l'America-class — projection et débarquement, avec le Type 076 (à radier et catapulte pour drones) comme vague suivante.",
  profile: {
    platform: {
      missions: ["amphibie", "projection", "presence"],
      displacement: "≈ 36 000–40 000 t pleine charge (estimation)",
      crew: "Estimation non consolidée",
      aviation: ["≈ 28 hélicoptères", "radier pour chalands (LCAC)"],
      notes: "Grand LHD amphibie ; pas d'aviation à voilure fixe à ce stade.",
    },
    combatSystem: {
      family: "autre",
      cms: "Système de combat naval chinois (peu documenté)",
      tacticalLinks: ["Réseaux PLAN (peu documentés publiquement)"],
      ballisticMissileDefense: false,
      interoperabilityNotes: "Commandement amphibie et débarquement à grande échelle.",
    },
    sensors: {
      radarPrimary: "Radar de veille chinois (estimation)",
      esm: ["Suite EW chinoise (peu documentée)"],
    },
    effectors: {
      ciws: ["HHQ-10", "Type 1130"],
      aviationWeapons: ["Hélicoptères embarqués"],
    },
    propulsion: {
      architecture: "autre",
      primeMovers: ["Diesels (estimation)"],
      maxSpeed: "≈ 23 kt (estimation)",
    },
    industrial: {
      primeContractor: "China State Shipbuilding Corporation (CSSC)",
      shipyards: ["Shanghai (Hudong-Zhonghua)"],
      suppliers: [
        { subsystem: "Plateforme", supplier: "Industrie d'État chinoise", country: "Chine" },
      ],
      localContentNotes: "Chaîne nationale ; Type 076 (radier + catapulte pour drones) annoncé comme évolution.",
    },
    export: {
      regimeSummary: "Non exporté ; capacité de projection souveraine.",
      itarExposure: "aucune",
      politicalConstraints: "Pas de logique export.",
    },
    sustainment: {
      sustainmentNotes: "Coûts et soutien non publiés ; trois coques en service en quelques années.",
      industrialRiskNotes: "Cadence amphibie rapide ; passage au Type 076 à surveiller.",
    },
  },
  keySpecs: [
    { label: "Déplacement", value: "≈ 36 000–40 000 t (estimation)", confidence: "moyenne", status: "a-recouper", sources: ["usni-type075"] },
    { label: "Aviation", value: "≈ 28 hélicoptères + radier", confidence: "moyenne", status: "a-recouper", sources: ["usni-type075"] },
    { label: "Longueur", value: "≈ 237 m", confidence: "moyenne", sources: ["csis-type075"] },
    { label: "Unités", value: "3 (Hainan, Guangxi, Anhui)", confidence: "moyenne", sources: ["csis-type075"] },
    { label: "Vague suivante", value: "Type 076 (radier + catapulte pour drones)", confidence: "faible", status: "a-recouper", sources: ["csis-type075"] },
    { label: "Constructeur", value: "CSSC · Hudong-Zhonghua", confidence: "moyenne", sources: ["csis-type075"] },
  ],
  costNarrative:
    "Le coût du Type 075 n'est pas publié ; il se lit dans la chaîne amphibie complète (navire, chalands, hélicoptères, troupes), à recouper.",
  financeNarrative:
    "Financement d'État opaque ; trois unités livrées rapidement traduisent une priorité de projection amphibie.",
  supplyNarrative:
    "Chaîne nationale (CSSC, Hudong-Zhonghua) ; opacité sur capteurs et sous-systèmes.",
  geopoliticsNarrative:
    "Le Type 075 donne à la PLAN une capacité de projection amphibie majeure, pertinente pour les scénarios régionaux et la présence lointaine.",
  exportNarrative:
    "Non exporté ; la comparaison utile porte sur la fonction amphibie, pas sur un marché.",
  editorial: {
    mythVsReality:
      "Le mythe : un équivalent direct de l'America-class. La réalité : un grand LHD à hélicoptères, sans aviation à voilure fixe — le Type 076 visera ce créneau.",
    bestUseCase: "Débarquement amphibie, projection régionale et opérations héliportées de grande ampleur.",
    weakPoint: "Pas d'aviation à voilure fixe, autodéfense limitée, données fines opaques.",
    analystNote:
      "À comparer au Mistral et au Dokdo/Marado : même fonction amphibie, échelle supérieure, mais confiance des données nettement plus faible.",
  },
  operators: ["Chine — PLA Navy"],
  theatres: ["Mer de Chine méridionale", "Mer de Chine orientale", "Pacifique Ouest"],
  timeline: [
    { date: "2021", label: "Admission au service du Hainan, tête de série du Type 075.", kind: "jalon" },
    { date: "2022", label: "Mise en service des Guangxi et Anhui rapportée par sources ouvertes.", kind: "jalon" },
  ],
  sources: [
    {
      id: "usni-type075",
      title: "Chinese Type 075 Big Deck Amphib Preparing for Sea Trials",
      publisher: "USNI News",
      type: "think-tank",
      reliability: "B",
      date: "2020",
      url: "https://news.usni.org/2020/07/29/chinese-type-075-big-deck-amphib-preparing-for-sea-trials",
    },
    {
      id: "csis-type075",
      title: "China's New Amphibious Assault Ship Sails into the South China Sea",
      publisher: "CSIS",
      type: "think-tank",
      reliability: "B",
      url: "https://www.csis.org/analysis/chinas-new-amphibious-assault-ship-sails-south-china-sea",
    },
  ],
  sourceIds: { primary: "usni-type075", combat: "csis-type075", industrial: "csis-type075", export: "csis-type075" },
  scores: {
    "efficacite-cout": ["C", "Capacité de projection majeure produite vite ; coût opaque et autodéfense limitée."],
    survivabilite: ["C", "Dépendance à l'escorte ; protection et capteurs peu documentés."],
    exportabilite: ["E", "Non exporté."],
    "risque-industriel": ["B", "Cadence amphibie rapide ; sous-systèmes critiques opaques."],
    maturite: ["B", "Trois coques en service ; doctrine d'emploi encore en consolidation."],
    "confiance-donnees": ["C", "Données surtout indirectes (imagerie, think-tanks) ; chiffres à recouper."],
  },
});
