import type {
  AcquisitionMode,
  Brick,
  DefenseSystem,
  EditorialBlocks,
  Grade,
  Indicator,
  NavalStructuredProfile,
  NavalVesselClass,
  Score,
  ScoreKey,
  SourceRef,
  TimelineEvent,
} from "../types";

type ScorePlan = Record<ScoreKey, [Grade, string]>;

interface NavalSeed {
  slug: string;
  name: string;
  designation: string;
  reference: string;
  navalVesselClass: NavalVesselClass;
  classLabel: string;
  country: string;
  flag: string;
  manufacturer: string;
  introduced?: string;
  status: string;
  acquisitionModes: AcquisitionMode[];
  tagline: string;
  summary: string;
  keySpecs: Indicator[];
  profile: NavalStructuredProfile;
  editorial: EditorialBlocks;
  operators: string[];
  theatres: string[];
  timeline?: TimelineEvent[];
  sources: SourceRef[];
  sourceIds: {
    primary: string;
    cost?: string;
    combat?: string;
    industrial?: string;
    export?: string;
  };
  costNarrative: string;
  financeNarrative: string;
  supplyNarrative: string;
  geopoliticsNarrative: string;
  exportNarrative: string;
  scores: ScorePlan;
}

function specsFromProfile(seed: NavalSeed): Brick[] {
  const profile = seed.profile;
  const costSource = seed.sourceIds.cost ?? seed.sourceIds.primary;
  const combatSource = seed.sourceIds.combat ?? seed.sourceIds.primary;
  const industrialSource = seed.sourceIds.industrial ?? seed.sourceIds.primary;
  const exportSource = seed.sourceIds.export ?? seed.sourceIds.primary;

  return [
    {
      key: "cout",
      narrative: seed.costNarrative,
      indicators: [
        {
          label: "Coût public",
          value:
            profile.sustainment?.unitCost ??
            profile.sustainment?.programCost ??
            "Non consolidé publiquement",
          confidence: profile.sustainment?.unitCost ? "moyenne" : "faible",
          status: profile.sustainment?.unitCost ? "a-recouper" : "variable",
          sources: [costSource],
        },
        {
          label: "Facteur de coût",
          value:
            profile.sustainment?.sustainmentNotes ??
            "Soutien long, intégration logicielle et chaîne navale",
          confidence: "moyenne",
          sources: [seed.sourceIds.primary],
        },
        {
          label: "Propulsion",
          value:
            profile.propulsion?.notes ??
            profile.propulsion?.architecture ??
            "Architecture non précisée",
          confidence: "moyenne",
          sources: [seed.sourceIds.primary],
        },
      ],
    },
    {
      key: "finance",
      narrative: seed.financeNarrative,
      indicators: [
        {
          label: "Canal d'acquisition",
          value: seed.acquisitionModes.join(" · "),
          confidence: "haute",
          sources: [seed.sourceIds.primary],
        },
        {
          label: "Programme",
          value: seed.status,
          confidence: "moyenne",
          sources: [seed.sourceIds.primary],
        },
        {
          label: "Temporalité",
          value:
            seed.introduced ??
            "Calendrier dépendant des essais et de la cadence industrielle",
          confidence: seed.introduced ? "haute" : "moyenne",
          sources: [seed.sourceIds.primary],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative: seed.supplyNarrative,
      indicators: [
        {
          label: "Maître d'oeuvre",
          value: profile.industrial?.primeContractor ?? seed.manufacturer,
          confidence: "haute",
          sources: [industrialSource],
        },
        {
          label: "CMS",
          value: profile.combatSystem?.cms ?? "Non précisé publiquement",
          confidence: profile.combatSystem?.cms ? "haute" : "faible",
          sources: [combatSource],
        },
        {
          label: "Capteur clé",
          value:
            profile.sensors?.radarPrimary ??
            profile.sensors?.towedSonar ??
            "Non précisé publiquement",
          confidence: "moyenne",
          sources: [combatSource],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative: seed.geopoliticsNarrative,
      indicators: [
        {
          label: "Rôle stratégique",
          value: seed.profile.platform.missions.join(" · "),
          confidence: "moyenne",
          sources: [seed.sourceIds.primary],
        },
        {
          label: "Interopérabilité",
          value:
            profile.combatSystem?.interoperabilityNotes ??
            profile.combatSystem?.tacticalLinks?.join(" · ") ??
            "Interopérabilité à documenter par standard",
          confidence: "moyenne",
          sources: [combatSource],
        },
        {
          label: "Théâtres",
          value: seed.theatres.join(" · "),
          confidence: "moyenne",
          sources: [seed.sourceIds.primary],
        },
      ],
    },
    {
      key: "export",
      narrative: seed.exportNarrative,
      indicators: [
        {
          label: "Profil export",
          value:
            profile.export?.regimeSummary ??
            "Capacité surtout nationale ou souveraine",
          confidence: "moyenne",
          sources: [exportSource],
        },
        {
          label: "Exposition ITAR",
          value: profile.export?.itarExposure ?? "non précisée",
          confidence: "moyenne",
          status: "variable",
          sources: [exportSource],
        },
        {
          label: "Contraintes",
          value:
            profile.export?.politicalConstraints ??
            profile.export?.reexportConstraints ??
            "Configuration client, armements et soutien à vérifier contrat par contrat",
          confidence: "moyenne",
          status: "variable",
          sources: [exportSource],
        },
      ],
    },
  ];
}

function makeScores(scores: ScorePlan): Score[] {
  return Object.entries(scores).map(([key, [grade, rationale]]) => ({
    key: key as ScoreKey,
    grade,
    rationale,
  }));
}

function makeNavalSystem(seed: NavalSeed): DefenseSystem {
  return {
    slug: seed.slug,
    name: seed.name,
    designation: seed.designation,
    reference: seed.reference,
    category: "naval-vessel",
    navalVesselClass: seed.navalVesselClass,
    navalProfile: seed.profile,
    classLabel: seed.classLabel,
    country: seed.country,
    flag: seed.flag,
    manufacturer: seed.manufacturer,
    introduced: seed.introduced,
    status: seed.status,
    acquisitionModes: seed.acquisitionModes,
    tagline: seed.tagline,
    summary: seed.summary,
    keySpecs: seed.keySpecs,
    bricks: specsFromProfile(seed),
    scores: makeScores(seed.scores),
    editorial: seed.editorial,
    operators: seed.operators,
    theatres: seed.theatres,
    timeline: seed.timeline,
    sources: seed.sources,
    updated: "2026-06-01",
  };
}

const commonCarrierScores: Pick<ScorePlan, "maturite" | "confiance-donnees"> = {
  maturite: ["B", "Plateforme en service ou doctrine installée, mais disponibilité et cycles de soutien restent déterminants."],
  "confiance-donnees": ["B", "Caractéristiques générales bien documentées ; disponibilité, coûts complets et détails de configuration restent partiellement sensibles."],
};

export const mistralPha = makeNavalSystem({
  slug: "mistral-pha",
  name: "Mistral PHA",
  designation: "L9013 · porte-hélicoptères amphibie français",
  reference: "PNP-NS-016",
  navalVesselClass: "amphibie",
  classLabel: "Porte-hélicoptères amphibie",
  country: "France",
  flag: "🇫🇷",
  manufacturer: "Naval Group · Chantiers de l'Atlantique",
  introduced: "2006",
  status: "En service dans la Marine nationale ; trois PHA structurent le groupe amphibie français",
  acquisitionModes: ["production-nationale"],
  tagline:
    "Le Mistral est moins un navire de combat pur qu'un multiplicateur de projection, de commandement et de soutien humanitaire.",
  summary:
    "Le PHA Mistral complète le socle français déjà intégré à Panoplie : il montre que le domaine naval ne se réduit pas aux frégates et aux sous-marins. Sa valeur tient à l'embarquement de forces, aux hélicoptères, aux chalands, au commandement et au soutien médical.\n\nDans la grille Panoplie, il sert à lire la projection comme chaîne complète : disponibilité du bâtiment, escorte, détachements embarqués, moyens amphibies, protection rapprochée et capacité à tenir une présence dans la durée.",
  profile: {
    platform: {
      missions: ["amphibie", "projection", "presence"],
      displacement: "≈ 21 300 t pleine charge",
      crew: "≈ 160 marins + état-major / troupes embarquées",
      endurance: "Projection longue durée selon groupe embarqué",
      aviation: ["Hélicoptères de manoeuvre et de combat", "Chalands / flottille amphibie"],
      notes: "Plateforme de projection et de commandement, pas escorte de haute intensité autonome.",
    },
    combatSystem: {
      family: "autre",
      cms: "SENIT / SIC 21 selon sources ouvertes",
      tacticalLinks: ["Liaisons nationales et interalliées"],
      ballisticMissileDefense: false,
      interoperabilityNotes: "Commandement amphibie et opérations de coalition.",
    },
    sensors: {
      radarPrimary: "Radar de veille et navigation, configuration publique variable",
      optronics: ["Capteurs de navigation et surveillance"],
    },
    effectors: {
      navalGuns: ["Narwhal / artillerie légère selon modernisation"],
      ciws: ["Mistral / SIMBAD selon configuration"],
      aviationWeapons: ["Hélicoptères embarqués"],
    },
    propulsion: {
      architecture: "IEP",
      primeMovers: ["Propulsion électrique intégrée"],
      maxSpeed: "≈ 19 kt",
      notes: "Architecture pensée pour volume utile, endurance et opérations amphibies.",
    },
    industrial: {
      primeContractor: "Naval Group / Chantiers de l'Atlantique",
      shipyards: ["Saint-Nazaire", "Brest"],
      suppliers: [
        { subsystem: "CMS", supplier: "Naval Group / Thales", country: "France" },
        { subsystem: "Plateforme", supplier: "Chantiers de l'Atlantique", country: "France" },
      ],
    },
    export: {
      regimeSummary: "Export possible par design dérivé ; forte sensibilité politique des clients et missions.",
      itarExposure: "partielle",
      politicalConstraints: "Le cas russe annulé rappelle que l'export amphibie reste hautement politique.",
    },
    sustainment: {
      sustainmentNotes: "Coût réel porté par le groupe amphibie, l'aviation embarquée, les chalands et l'escorte.",
      industrialRiskNotes: "Maintien de compétences de grands navires amphibies et soutien interarmées.",
    },
  },
  keySpecs: [
    { label: "Déplacement", value: "≈ 21 300 t", confidence: "haute", sources: ["marine-pha"] },
    { label: "Rôle", value: "Projection amphibie · commandement · soutien humanitaire", confidence: "haute", sources: ["marine-pha"] },
    { label: "Aviation", value: "Hélicoptères et détachements embarqués", confidence: "moyenne", sources: ["marine-pha"] },
    { label: "Chalands", value: "Flottille amphibie embarquée selon mission", confidence: "moyenne", sources: ["marine-pha"] },
    { label: "Protection", value: "Autodéfense limitée, dépendance à l'escorte", confidence: "moyenne", sources: ["navalgroup-surface"] },
    { label: "MCO", value: "Soutien de flotte amphibie et interarmées", confidence: "moyenne", sources: ["marine-pha"] },
  ],
  costNarrative:
    "Le coût du Mistral se lit dans l'effet interarmées : hélicoptères, chalands, troupes, hôpital, commandement et escorte. La coque seule sous-estime la chaîne de projection.",
  financeNarrative:
    "Le programme relève d'une logique nationale française, avec une flotte de trois PHA qui donne de la permanence au groupe amphibie.",
  supplyNarrative:
    "La chaîne est très française : architecture de grand navire, intégration Naval Group, chantier de Saint-Nazaire et soutien Marine nationale.",
  geopoliticsNarrative:
    "Le PHA sert la présence, l'évacuation, l'aide humanitaire et la projection limitée. Il est un outil de signalement autant qu'un transport de forces.",
  exportNarrative:
    "La classe Mistral illustre un export possible mais politiquement sensible : un LHD transfère une capacité de projection, pas seulement une plateforme.",
  editorial: {
    mythVsReality:
      "Le mythe : un PHA est un porte-avions allégé. La réalité : c'est d'abord un outil amphibie, C2 et soutien.",
    bestUseCase:
      "Projection, évacuation de ressortissants, aide humanitaire, présence outre-mer et commandement amphibie.",
    weakPoint:
      "Autodéfense limitée : l'effet militaire dépend fortement de l'escorte, du groupe aérien et des moyens débarqués.",
    analystNote:
      "Mistral complète le domaine naval parce qu'il force Panoplie à lire le coût complet d'une opération amphibie, pas seulement la fiche d'un navire.",
  },
  operators: ["France — Marine nationale"],
  theatres: ["Méditerranée", "Golfe de Guinée", "Océan Indien", "Indo-Pacifique"],
  timeline: [
    { date: "2006", label: "Admission au service actif du PHA Mistral.", kind: "jalon" },
    { date: "2023", label: "Missions Corymbe et présence amphibie régulière documentées publiquement.", kind: "emploi" },
  ],
  sources: [
    {
      id: "marine-pha",
      title: "Porte-hélicoptères amphibie",
      publisher: "Marine nationale",
      type: "institution",
      reliability: "A",
      url: "https://www.defense.gouv.fr/marine/nos-equipements/porte-helicopteres-amphibie",
    },
    {
      id: "navalgroup-surface",
      title: "Surface ships",
      publisher: "Naval Group",
      type: "constructeur",
      reliability: "B",
      url: "https://www.naval-group.com/en/surface-ships",
    },
  ],
  sourceIds: { primary: "marine-pha", industrial: "navalgroup-surface", export: "navalgroup-surface" },
  scores: {
    "efficacite-cout": ["B", "Effet de projection très élevé si l'escorte, les hélicoptères et les moyens amphibies sont disponibles."],
    survivabilite: ["C", "Autodéfense limitée ; survivabilité dépendante du groupe naval et de la protection aérienne."],
    exportabilite: ["C", "Plateforme exportable techniquement, mais politiquement sensible et coûteuse à soutenir."],
    "risque-industriel": ["B", "Base française solide, mais compétence de grands navires amphibies moins fréquente que les frégates."],
    ...commonCarrierScores,
  },
});

export const geraldRFord = makeNavalSystem({
  slug: "gerald-r-ford",
  name: "Gerald R. Ford",
  designation: "CVN-78 · supercarrier américain",
  reference: "PNP-NS-017",
  navalVesselClass: "porte-avions",
  classLabel: "Supercarrier CATOBAR nucléaire",
  country: "États-Unis",
  flag: "🇺🇸",
  manufacturer: "Huntington Ingalls Industries · Newport News Shipbuilding",
  introduced: "2017",
  status: "Lead ship de la classe Ford, en service dans l'US Navy",
  acquisitionModes: ["production-nationale"],
  tagline:
    "Le Ford concentre la puissance aéronavale américaine : aviation embarquée, EMALS, soutien nucléaire et coût complet de très haute intensité.",
  summary:
    "Le Gerald R. Ford est le cas extrême du domaine naval : un navire dont l'effet militaire ne se comprend qu'à l'échelle du carrier strike group. EMALS, aviation embarquée, propulsion nucléaire, escorte Aegis, logistique et disponibilité forment un système de systèmes.\n\nPour Panoplie, il sert de référence haute : coût public massif, maturité industrielle américaine, mais aussi complexité de mise au point, MCO très lourd et dépendance à tout l'écosystème aéronaval.",
  profile: {
    platform: {
      missions: ["projection", "strike", "presence"],
      displacement: "≈ 100 000 t pleine charge",
      crew: "Plusieurs milliers de marins avec air wing",
      aviation: ["Carrier Air Wing", "F/A-18E/F", "F-35C", "E-2D", "EA-18G"],
      notes: "Capacité CATOBAR et groupe aérien au centre de la valeur.",
    },
    combatSystem: {
      family: "autre",
      cms: "Self-defense ship combat system + CSG C2",
      tacticalLinks: ["Link 16", "CEC", "réseaux CSG"],
      ballisticMissileDefense: false,
      interoperabilityNotes: "Noeud de commandement de carrier strike group.",
    },
    sensors: {
      radarPrimary: "Dual Band Radar sur CVN-78 ; EASR pour unités ultérieures",
      esm: ["EW / C2 de groupe aéronaval"],
    },
    effectors: {
      aviationWeapons: ["Air wing embarqué"],
      ciws: ["ESSM / RAM / CIWS selon configuration"],
    },
    propulsion: {
      architecture: "nucleaire",
      primeMovers: ["Réacteurs A1B"],
      maxSpeed: "> 30 kt",
      notes: "Endurance stratégique élevée, soutien nucléaire très spécialisé.",
    },
    industrial: {
      primeContractor: "Huntington Ingalls Industries",
      shipyards: ["Newport News Shipbuilding"],
      suppliers: [
        { subsystem: "Lancement", supplier: "General Atomics EMALS / AAG", country: "États-Unis" },
        { subsystem: "Radar", supplier: "Raytheon / RTX", country: "États-Unis" },
      ],
    },
    export: {
      regimeSummary: "Non exportable en pratique : capacité souveraine américaine.",
      itarExposure: "elevee",
      politicalConstraints: "Nucléaire naval, aviation embarquée et C2 hautement sensibles.",
    },
    sustainment: {
      unitCost: "≈ US$13 Md ordre public de grandeur",
      sustainmentNotes: "MCO nucléaire, air wing, escorte et disponibilité de carrier strike group.",
    },
  },
  keySpecs: [
    { label: "Déplacement", value: "≈ 100 000 t", confidence: "haute", sources: ["usn-cvn"] },
    { label: "Propulsion", value: "Nucléaire · réacteurs A1B", confidence: "moyenne", sources: ["usn-cvn"] },
    { label: "Lancement aviation", value: "EMALS / AAG", confidence: "haute", sources: ["usn-cvn"] },
    { label: "Coût public", value: "≈ US$13 Md", confidence: "moyenne", status: "a-recouper", sources: ["crs-ford"] },
    { label: "Groupe aérien", value: "Carrier Air Wing, composition variable", confidence: "moyenne", sources: ["usn-cvn"] },
    { label: "Architecture", value: "Carrier strike group", confidence: "haute", sources: ["usn-cvn"] },
  ],
  costNarrative:
    "Le Ford illustre le coût complet maximal : coque, propulsion nucléaire, EMALS, air wing, munitions, escorte, ravitailleurs et cycles de maintenance.",
  financeNarrative:
    "Le financement est national américain et s'inscrit dans une série de supercarriers. Les chiffres unitaires publics doivent être lus avec prudence selon périmètre.",
  supplyNarrative:
    "La chaîne concentre Newport News, fournisseurs nucléaires, EMALS, radars, aviation embarquée et systèmes C2 ; elle est large mais souveraine.",
  geopoliticsNarrative:
    "Un CVN américain est un signal politique mobile. Il sert la présence, la coercition, la frappe et l'assurance alliée dans les théâtres contestés.",
  exportNarrative:
    "La capacité n'est pas exportable. La comparaison utile porte sur l'écosystème : aviation, escorte, ravitaillement, soutien nucléaire et bases avancées.",
  editorial: {
    mythVsReality:
      "Le mythe : le Ford est une coque géante. La réalité : c'est le centre d'un système aéronaval complet.",
    bestUseCase: "Projection de puissance, présence de crise, frappe aérienne embarquée et commandement de CSG.",
    weakPoint: "Coût complet, disponibilité et dépendance à une escorte de très haut niveau.",
    analystNote:
      "Le Ford doit rester une référence de comparaison, pas un standard réaliste pour la plupart des marines.",
  },
  operators: ["États-Unis — US Navy"],
  theatres: ["Atlantique", "Pacifique", "Méditerranée", "Indo-Pacifique"],
  timeline: [
    { date: "2017", label: "Livraison du CVN-78 à l'US Navy.", kind: "jalon" },
    { date: "2022", label: "Premier déploiement opérationnel public du Ford.", kind: "emploi" },
  ],
  sources: [
    {
      id: "usn-cvn",
      title: "Aircraft Carriers - CVN",
      publisher: "United States Navy",
      type: "institution",
      reliability: "A",
      date: "2025",
      url: "https://www.navy.mil/Resources/Fact-Files/Display-FactFiles/article/2169795/aircraft-carriers-cvn/",
    },
    {
      id: "crs-ford",
      title: "Navy Ford (CVN-78) Class Aircraft Carrier Program",
      publisher: "Congressional Research Service",
      type: "institution",
      reliability: "A",
      url: "https://crsreports.congress.gov/product/pdf/RS/RS20643",
    },
  ],
  sourceIds: { primary: "usn-cvn", cost: "crs-ford", industrial: "usn-cvn" },
  scores: {
    "efficacite-cout": ["C", "Effet militaire exceptionnel, mais coût complet très élevé et réservé à une marine continentale."],
    survivabilite: ["B", "Survivabilité liée aux couches du CSG ; la valeur concentrée impose une escorte permanente."],
    exportabilite: ["E", "Non exportable en pratique."],
    "risque-industriel": ["B", "Base industrielle américaine unique, mais très spécialisée et contrainte par la cadence."],
    ...commonCarrierScores,
  },
});

export const arleighBurkeFlightIii = makeNavalSystem({
  slug: "arleigh-burke-flight-iii",
  name: "Arleigh Burke Flight III",
  designation: "DDG-51 Flight III · destroyer AAW/BMD",
  reference: "PNP-NS-018",
  navalVesselClass: "destroyer",
  classLabel: "Destroyer Aegis BMD",
  country: "États-Unis",
  flag: "🇺🇸",
  manufacturer: "Bath Iron Works · Huntington Ingalls · Lockheed Martin",
  introduced: "2023",
  status: "Flight III en production et entrée progressive en flotte",
  acquisitionModes: ["production-nationale"],
  tagline:
    "Le Flight III est l'archétype Aegis moderne : SPY-6, 96 cellules Mk 41, BMD et escorte de carrier strike group.",
  summary:
    "L'Arleigh Burke Flight III montre ce que signifie une frégate/destroyer radar-first : la plateforme est surtout le support d'un radar AMDR SPY-6, d'Aegis, de Mk 41 VLS et d'une architecture BMD.\n\nPour Panoplie, c'est la référence américaine pour comparer les frégates européennes : densité de VLS, puissance radar, maturité Aegis et coût de maintien d'une flotte très nombreuse.",
  profile: {
    platform: {
      missions: ["AAW", "BMD", "ASW", "ASuW", "strike"],
      displacement: "≈ 9 700 long tons selon Flight",
      crew: "≈ 359 marins pour Flight III",
      aviation: ["2 × MH-60R"],
      notes: "Destroyer de défense aérienne et antimissile, aussi employé en frappe Tomahawk.",
    },
    combatSystem: {
      family: "Aegis",
      cms: "Aegis Weapon System",
      baseline: "Flight III / Baseline 10 selon modernisation",
      tacticalLinks: ["Link 16", "CEC"],
      ballisticMissileDefense: true,
      interoperabilityNotes: "Noeud Aegis de CSG, SAG et défense antimissile.",
    },
    sensors: {
      radarPrimary: "AN/SPY-6(V)1 AMDR",
      hullSonar: "AN/SQQ-89 suite sonar selon standard",
      esm: ["Suite EW américaine selon configuration"],
    },
    effectors: {
      vlsType: "Mk 41 VLS",
      vlsCells: "96 cellules",
      sam: ["Standard Missile", "ESSM"],
      antiShipMissiles: ["Tomahawk / SM selon mission", "NSM selon modernisation éventuelle"],
      antiSubWeapons: ["VL-ASROC", "Torpilles Mk 46/54"],
      navalGuns: ["Mk 45 5 pouces"],
      ciws: ["CIWS / RAM selon configuration"],
    },
    propulsion: {
      architecture: "autre",
      primeMovers: ["4 × GE LM2500"],
      maxSpeed: "> 30 kt",
      notes: "COGAG gaz, standardisé sur une très grande flotte.",
    },
    industrial: {
      primeContractor: "US Navy / Bath Iron Works / Huntington Ingalls",
      shipyards: ["Bath", "Pascagoula"],
      suppliers: [
        { subsystem: "CMS", supplier: "Lockheed Martin", country: "États-Unis" },
        { subsystem: "Radar", supplier: "RTX / Raytheon", country: "États-Unis" },
        { subsystem: "VLS", supplier: "BAE Systems", country: "États-Unis" },
      ],
    },
    export: {
      regimeSummary: "Le standard DDG-51 n'est pas exporté tel quel ; l'écosystème Aegis l'est via variantes alliées.",
      itarExposure: "elevee",
      politicalConstraints: "Aegis, SM, BMD et SPY-6 relèvent de contrôles américains forts.",
    },
    sustainment: {
      sustainmentNotes: "Soutien d'une flotte nombreuse, modernisations Aegis et disponibilité radar/missiles.",
    },
  },
  keySpecs: [
    { label: "Déplacement", value: "≈ 8 230–9 700 long tons", confidence: "haute", sources: ["usn-ddg51"] },
    { label: "Radar", value: "AN/SPY-6(V)1", confidence: "haute", sources: ["usn-ddg51"] },
    { label: "VLS", value: "96 cellules Mk 41", confidence: "haute", sources: ["usn-ddg51"] },
    { label: "Propulsion", value: "4 × GE LM2500", confidence: "haute", sources: ["usn-ddg51"] },
    { label: "Équipage", value: "≈ 359 pour Flight III", confidence: "haute", sources: ["usn-ddg51"] },
    { label: "BMD", value: "Aegis BMD selon baseline", confidence: "moyenne", sources: ["usn-aegis"] },
  ],
  costNarrative:
    "Le coût du Flight III est dominé par le couple SPY-6/Aegis, les cellules VLS et la modernisation continue d'une classe produite sur plusieurs décennies.",
  financeNarrative:
    "Le programme bénéficie d'une base industrielle installée et de commandes répétées, mais la cadence dépend de deux chantiers et du budget US Navy.",
  supplyNarrative:
    "La chaîne est américaine et profonde : chantiers, Lockheed Martin pour Aegis, RTX pour SPY-6, BAE pour Mk 41 et GE pour turbines.",
  geopoliticsNarrative:
    "Le Flight III est la brique d'escorte américaine par excellence : CSG, BMD, présence avancée et défense intégrée alliée.",
  exportNarrative:
    "Le navire lui-même est national, mais son architecture Aegis irrigue l'export allié : Japon, Espagne, Corée, Australie et autres variantes.",
  editorial: {
    mythVsReality:
      "Le mythe : c'est seulement un destroyer de plus. La réalité : c'est une architecture Aegis/SPY-6 qui porte une part du bouclier naval américain.",
    bestUseCase: "Escorte de groupe aéronaval, défense aérienne de zone, BMD et frappe longue portée.",
    weakPoint: "Coût de modernisation et dépendance à une chaîne américaine très sollicitée.",
    analystNote:
      "Le Flight III est le repère à garder en tête quand on compare FDI, F110, FREMM IT ou Type 26 : même mission d'escorte, mais échelle radar/VLS différente.",
  },
  operators: ["États-Unis — US Navy"],
  theatres: ["Pacifique", "Atlantique", "Méditerranée", "Mer Rouge"],
  sources: [
    {
      id: "usn-ddg51",
      title: "Destroyers (DDG 51)",
      publisher: "United States Navy",
      type: "institution",
      reliability: "A",
      date: "2025",
      url: "https://www.navy.mil/Resources/Fact-Files/Display-FactFiles/Article/2169871/destroyers-ddg-51/destroyers-ddg-51/",
    },
    {
      id: "usn-aegis",
      title: "AEGIS Weapon System",
      publisher: "United States Navy",
      type: "institution",
      reliability: "A",
      url: "https://www.navy.mil/Resources/Fact-Files/Display-FactFiles/Article/2166739/aegis-weapon-system/",
    },
  ],
  sourceIds: { primary: "usn-ddg51", combat: "usn-aegis", industrial: "usn-ddg51", export: "usn-aegis" },
  scores: {
    "efficacite-cout": ["B", "Capacité AAW/BMD majeure, coût élevé mais amorti par une grande série et une doctrine mature."],
    survivabilite: ["B", "Très forte défense active ; exposition accrue dans les environnements saturés."],
    exportabilite: ["C", "Architecture Aegis exportable indirectement, navire complet non exporté tel quel."],
    "risque-industriel": ["B", "Deux chantiers et fournisseurs matures, mais cadence et modernisation restent critiques."],
    maturite: ["A", "Classe très mature, Flight III plus récent mais bâti sur une lignée éprouvée."],
    "confiance-donnees": ["B", "Données générales solides ; performances radar et BMD fines restent sensibles."],
  },
});

export const virginiaBlockV = makeNavalSystem({
  slug: "virginia-block-v",
  name: "Virginia Block V",
  designation: "SSN-774 · sous-marin nucléaire d'attaque avec VPM",
  reference: "PNP-NS-019",
  navalVesselClass: "sous-marin",
  classLabel: "SSN polyvalent",
  country: "États-Unis",
  flag: "🇺🇸",
  manufacturer: "General Dynamics Electric Boat · Huntington Ingalls",
  status: "Block V en construction et montée en puissance dans l'US Navy",
  acquisitionModes: ["production-nationale"],
  tagline:
    "Le Virginia Block V ajoute le Virginia Payload Module : plus de volume de frappe, mais coût et cadence sous tension.",
  summary:
    "Le Virginia Block V est la référence occidentale SSN récente : propulsion nucléaire, missions sous-marines polyvalentes, ISR, frappe et opérations spéciales. Le VPM augmente fortement la capacité d'emport, ce qui déplace la comparaison avec les SSK européens.\n\nPanoplie le traite avec prudence : les performances acoustiques et capteurs restent sensibles, mais les sources publiques documentent bien le coût, la cadence et les enjeux industriels.",
  profile: {
    platform: {
      missions: ["ASW", "ASuW", "strike", "presence"],
      displacement: "≈ 10 200 t en plongée pour Block V VPM selon sources ouvertes",
      crew: "≈ 135",
      notes: "SSN nucléaire, endurance limitée surtout par équipage et vivres.",
    },
    combatSystem: {
      family: "autre",
      cms: "US submarine combat system",
      tacticalLinks: ["Réseaux sous-marins US classifiés / partiellement publics"],
      ballisticMissileDefense: false,
      interoperabilityNotes: "Noeud sous-marin de frappe, ISR et escorte discrète.",
    },
    sensors: {
      hullSonar: "Suite sonar intégrée Virginia",
      towedSonar: "Towed array selon standard",
      esm: ["ESM / périscopes optroniques selon configuration"],
    },
    effectors: {
      vlsType: "Virginia Payload Module + tubes torpilles",
      vlsCells: "VPM sur Block V",
      antiShipMissiles: ["Tomahawk"],
      antiSubWeapons: ["Mk 48 ADCAP"],
    },
    propulsion: {
      architecture: "nucleaire",
      primeMovers: ["Réacteur S9G"],
      notes: "Endurance nucléaire et très forte dépendance à la base industrielle sous-marine.",
    },
    industrial: {
      primeContractor: "General Dynamics Electric Boat / Huntington Ingalls",
      shipyards: ["Groton", "Newport News"],
      suppliers: [
        { subsystem: "Coque / intégration", supplier: "Electric Boat", country: "États-Unis" },
        { subsystem: "Coque / modules", supplier: "Huntington Ingalls", country: "États-Unis" },
      ],
    },
    export: {
      regimeSummary: "Non exporté à ce stade ; AUKUS ouvre une lecture politique spécifique.",
      itarExposure: "elevee",
      politicalConstraints: "Technologie nucléaire navale et transfert AUKUS très contrôlés.",
    },
    sustainment: {
      unitCost: "≈ US$4,3–4,5 Md selon configuration VPM et source CRS",
      sustainmentNotes: "Coût porté par cadence sous-marine, composants nucléaires, équipage spécialisé et MRO.",
      industrialRiskNotes: "Cadence américaine sous tension documentée par CRS.",
    },
  },
  keySpecs: [
    { label: "Propulsion", value: "Nucléaire", confidence: "haute", sources: ["usn-ssn"] },
    { label: "Module", value: "Virginia Payload Module sur Block V", confidence: "moyenne", sources: ["crs-virginia"] },
    { label: "Coût public", value: "≈ US$4,3–4,5 Md avec VPM", confidence: "moyenne", sources: ["crs-virginia"] },
    { label: "Mission", value: "ASW · ASuW · strike · ISR · forces spéciales", confidence: "haute", sources: ["navsea-blockv"] },
    { label: "Équipage", value: "≈ 135", confidence: "moyenne", sources: ["usn-ssn"] },
    { label: "Export", value: "AUKUS à suivre, non export standard", confidence: "moyenne", sources: ["crs-virginia"] },
  ],
  costNarrative:
    "Le coût d'un SSN Block V mêle propulsion nucléaire, discrétion, capteurs sensibles et VPM. Les chiffres publics sont des ordres de grandeur de programme, pas des prix catalogue.",
  financeNarrative:
    "La cadence Virginia est un sujet stratégique américain : elle conditionne à la fois l'US Navy, les retards industriels et l'équation AUKUS.",
  supplyNarrative:
    "La base industrielle sous-marine est une dépendance majeure : chantiers spécialisés, composants nucléaires, fournisseurs qualifiés et cycles longs.",
  geopoliticsNarrative:
    "Le Block V est un outil discret de contrôle sous-marin, de frappe et d'assurance alliée. AUKUS transforme aussi le SSN en objet diplomatique.",
  exportNarrative:
    "Le SSN nucléaire n'est pas un produit export classique. AUKUS est l'exception politique à analyser avec un niveau de confiance prudent.",
  editorial: {
    mythVsReality:
      "Le mythe : un sous-marin se compare par tonnage. La réalité : discrétion, capteurs, endurance, cadence industrielle et armement priment.",
    bestUseCase: "Dissuasion conventionnelle sous-marine, escorte discrète, ISR et frappe depuis la mer.",
    weakPoint: "Cadence, coût et disponibilité de la base industrielle nucléaire.",
    analystNote:
      "Face à Scorpène ou S-80 Plus, Virginia Block V n'est pas une alternative directe : c'est une autre classe de coût, de souveraineté et d'endurance.",
  },
  operators: ["États-Unis — US Navy"],
  theatres: ["Atlantique", "Pacifique", "Indo-Pacifique"],
  sources: [
    {
      id: "usn-ssn",
      title: "Attack Submarines - SSN",
      publisher: "United States Navy",
      type: "institution",
      reliability: "A",
      date: "2025",
      url: "https://www.navy.mil/Resources/Fact-Files/Display-FactFiles/Article/2169558/attack-submarines-ssn/attack-submarines-ssn/",
    },
    {
      id: "crs-virginia",
      title: "Navy Virginia-Class Submarine Program and AUKUS Submarine Project",
      publisher: "Congressional Research Service",
      type: "institution",
      reliability: "A",
      url: "https://www.congress.gov/crs-products/product/pdf/RL/RL32418",
    },
    {
      id: "navsea-blockv",
      title: "Navy awards Block V Virginia-class submarine contract",
      publisher: "Naval Sea Systems Command",
      type: "institution",
      reliability: "A",
      date: "2019",
      url: "https://www.navsea.navy.mil/Media/News/Article-View/Article/2030052/navy-awards-block-v-virginia-class-submarine-contract/",
    },
  ],
  sourceIds: { primary: "usn-ssn", cost: "crs-virginia", industrial: "crs-virginia", export: "crs-virginia" },
  scores: {
    "efficacite-cout": ["C", "Capacité très élevée, mais coût unitaire et soutien nucléaire sans commune mesure avec un SSK."],
    survivabilite: ["A", "Survivabilité sous-marine très forte, avec limites publiques importantes sur les performances réelles."],
    exportabilite: ["D", "Export classique quasi nul ; AUKUS est un cas politique exceptionnel."],
    "risque-industriel": ["C", "Base industrielle américaine profonde mais cadence sous tension."],
    maturite: ["B", "Classe mature ; Block V et VPM ajoutent une complexité récente."],
    "confiance-donnees": ["C", "Coûts et programme bien documentés ; capacités fines très sensibles."],
  },
});

export const queenElizabethCarrier = makeNavalSystem({
  slug: "queen-elizabeth-carrier",
  name: "Queen Elizabeth class",
  designation: "Porte-avions STOVL britannique",
  reference: "PNP-NS-020",
  navalVesselClass: "porte-avions",
  classLabel: "Porte-avions STOVL",
  country: "Royaume-Uni",
  flag: "🇬🇧",
  manufacturer: "Aircraft Carrier Alliance · BAE Systems · Babcock · Thales",
  introduced: "2017",
  status: "Classe en service ; HMS Queen Elizabeth et HMS Prince of Wales",
  acquisitionModes: ["production-nationale", "cooperatif"],
  tagline:
    "La classe Queen Elizabeth donne au Royaume-Uni une projection STOVL : moins CATOBAR que Ford, mais très structurante pour le Carrier Strike Group britannique.",
  summary:
    "Les Queen Elizabeth class sont la lecture britannique de la puissance aéronavale : F-35B, grand pont, propulsion intégrée, escorte Type 45/Type 23 puis Type 26 et logique expéditionnaire.\n\nLa comparaison utile n'est pas seulement avec Ford ou Charles de Gaulle, mais avec le coût de reconstituer une aviation embarquée, une escorte et une disponibilité après une longue pause capacitaire.",
  profile: {
    platform: {
      missions: ["projection", "strike", "presence"],
      displacement: "≈ 65 000 t",
      crew: "≈ 700 navire, davantage avec air group",
      aviation: ["F-35B", "Merlin", "Crowsnest"],
      notes: "STOVL : pas de catapultes, dépendance au F-35B.",
    },
    combatSystem: {
      family: "autre",
      cms: "UK carrier mission system",
      tacticalLinks: ["Link 16", "réseaux CSG britanniques / OTAN"],
      ballisticMissileDefense: false,
      interoperabilityNotes: "Carrier Strike Group OTAN avec F-35B et escorte multinationale possible.",
    },
    sensors: {
      radarPrimary: "S1850M + Artisan selon sources ouvertes",
      esm: ["Suite EW britannique"],
    },
    effectors: {
      aviationWeapons: ["F-35B Lightning"],
      ciws: ["Phalanx", "canons légers"],
    },
    propulsion: {
      architecture: "IEP",
      primeMovers: ["Turbines à gaz Rolls-Royce MT30", "Diesels Wärtsilä"],
      maxSpeed: "> 25 kt",
      notes: "Propulsion électrique intégrée, optimisée pour volume aviation.",
    },
    industrial: {
      primeContractor: "Aircraft Carrier Alliance",
      shipyards: ["Rosyth", "chantiers britanniques multiples"],
      suppliers: [
        { subsystem: "Plateforme", supplier: "BAE Systems / Babcock", country: "Royaume-Uni" },
        { subsystem: "Mission systems", supplier: "Thales", country: "Royaume-Uni / France" },
      ],
    },
    export: {
      regimeSummary: "Non exportée ; capacité nationale britannique.",
      itarExposure: "elevee",
      politicalConstraints: "Dépendance F-35B et interopérabilité américaine/OTAN.",
    },
    sustainment: {
      programCost: "Programme britannique de plusieurs milliards de livres pour deux navires",
      sustainmentNotes: "Disponibilité dépendante du F-35B, des escortes et du soutien de groupe.",
    },
  },
  keySpecs: [
    { label: "Déplacement", value: "≈ 65 000 t", confidence: "haute", sources: ["rn-qe-f35"] },
    { label: "Aviation", value: "F-35B Lightning · Merlin", confidence: "haute", sources: ["rn-f35"] },
    { label: "Architecture", value: "STOVL", confidence: "haute", sources: ["rn-f35"] },
    { label: "Groupe", value: "Carrier Strike Group britannique", confidence: "haute", sources: ["rn-csg"] },
    { label: "Propulsion", value: "IEP", confidence: "moyenne", sources: ["rn-qe-f35"] },
    { label: "Export", value: "Capacité nationale non exportée", confidence: "haute", sources: ["rn-csg"] },
  ],
  costNarrative:
    "La classe Queen Elizabeth se lit comme coût de reconstitution d'un outil aéronaval : navires, F-35B, escortes, soutien et disponibilité.",
  financeNarrative:
    "Le programme a financé deux grands porte-avions, ce qui réduit le risque de capacité unique mais impose une chaîne de soutien durable.",
  supplyNarrative:
    "La chaîne britannique combine BAE, Babcock, Thales, Rolls-Royce et une dépendance forte au F-35B américain.",
  geopoliticsNarrative:
    "La classe sert la présence britannique et OTAN, notamment dans des déploiements de CSG avec alliés et F-35B.",
  exportNarrative:
    "Pas de produit export ; l'enjeu export se situe plutôt dans les briques F-35B, escortes, systèmes et doctrine interopérable.",
  editorial: {
    mythVsReality:
      "Le mythe : un porte-avions STOVL est un demi-porte-avions. La réalité : c'est une architecture cohérente, mais dépendante du F-35B.",
    bestUseCase: "Carrier strike OTAN, présence mondiale, opérations expéditionnaires et coalition.",
    weakPoint: "Disponibilité, taille réelle du groupe aérien et dépendance au F-35B.",
    analystNote:
      "Queen Elizabeth est le bon comparateur de Charles de Gaulle : deux modèles politiques différents de puissance aéronavale européenne.",
  },
  operators: ["Royaume-Uni — Royal Navy"],
  theatres: ["Atlantique", "Méditerranée", "Indo-Pacifique"],
  sources: [
    {
      id: "rn-qe-f35",
      title: "HMS Queen Elizabeth sets off for F-35B fighter jet trials",
      publisher: "Royal Navy",
      type: "institution",
      reliability: "A",
      date: "2018",
      url: "https://www.royalnavy.mod.uk/news/2018/august/18/180813-hms-queen-elizabeth-sets-off-for-f-35b-fighter-jet-trials",
    },
    {
      id: "rn-f35",
      title: "F-35 Lightning",
      publisher: "Royal Navy",
      type: "institution",
      reliability: "A",
      url: "https://www.royalnavy.mod.uk/equipment/aircraft/f-35",
    },
    {
      id: "rn-csg",
      title: "New face leads nation's most powerful Naval force — the UK Carrier Strike Group",
      publisher: "Royal Navy",
      type: "institution",
      reliability: "A",
      date: "2023",
      url: "https://www.royalnavy.mod.uk/news/2023/may/24/20230524-new-face-leads-nation-most-powerful-naval-force-the-uk-carrier-strike-group",
    },
  ],
  sourceIds: { primary: "rn-qe-f35", combat: "rn-csg", industrial: "rn-qe-f35", export: "rn-f35" },
  scores: {
    "efficacite-cout": ["B", "Projection significative pour une marine européenne, avec coût complet élevé mais partagé sur deux coques."],
    survivabilite: ["C", "Dépendance forte à l'escorte, au CSG et à la disponibilité des F-35B."],
    exportabilite: ["E", "Capacité nationale non exportée."],
    "risque-industriel": ["C", "Soutien long et dépendance au F-35B, malgré une base britannique solide."],
    ...commonCarrierScores,
  },
});

export const type26Frigate = makeNavalSystem({
  slug: "type-26-frigate",
  name: "Type 26",
  designation: "City class · frégate ASW britannique",
  reference: "PNP-NS-021",
  navalVesselClass: "fregate",
  classLabel: "Frégate ASW lourde",
  country: "Royaume-Uni",
  flag: "🇬🇧",
  manufacturer: "BAE Systems · Royal Navy",
  status: "En construction ; huit navires prévus pour la Royal Navy",
  acquisitionModes: ["production-nationale", "DCS"],
  tagline:
    "La Type 26 est une frégate sonar-first : grand mission bay, CODLOG, Sea Ceptor, Mk 41 et exportabilité de design.",
  summary:
    "La Type 26 donne à Panoplie un excellent cas de frégate ASW moderne. Elle privilégie la discrétion acoustique, le sonar, le mission bay et l'adaptabilité, tout en gardant une défense aérienne locale et un potentiel Mk 41.\n\nElle sert aussi de pont vers l'export : le design inspire les programmes canadien et australien, et le rapport recommande de suivre le cas norvégien comme signal de confiance industrielle.",
  profile: {
    platform: {
      missions: ["ASW", "presence", "ASuW"],
      displacement: "≈ 8 000 t",
      crew: "Équipage réduit avec capacité additionnelle",
      aviation: ["Merlin / Wildcat", "mission bay pour drones et embarcations"],
      notes: "Frégate lourde optimisée ASM et adaptable par mission bay.",
    },
    combatSystem: {
      family: "autre",
      cms: "BAE Systems CMS / architecture Royal Navy",
      tacticalLinks: ["Link 16", "réseaux OTAN"],
      ballisticMissileDefense: false,
      interoperabilityNotes: "Protection de dissuasion et carrier strike group.",
    },
    sensors: {
      radarPrimary: "Artisan 997",
      hullSonar: "Sonar de coque",
      towedSonar: "Type 2087 / suite remorquée selon sources publiques",
    },
    effectors: {
      vlsType: "Sea Ceptor + Mk 41",
      vlsCells: "Cellules Sea Ceptor + silo Mk 41",
      sam: ["Sea Ceptor"],
      antiSubWeapons: ["Sting Ray / hélicoptère ASM"],
      navalGuns: ["Mk 45 5 pouces"],
    },
    propulsion: {
      architecture: "CODLOG",
      primeMovers: ["MT30", "moteurs électriques"],
      notes: "CODLOG et coque silencieuse pour mission ASM.",
    },
    industrial: {
      primeContractor: "BAE Systems",
      shipyards: ["Clyde / Glasgow"],
      suppliers: [
        { subsystem: "Canon", supplier: "BAE Systems Mk 45", country: "États-Unis / Royaume-Uni" },
        { subsystem: "Missiles", supplier: "MBDA Sea Ceptor", country: "Royaume-Uni" },
      ],
    },
    export: {
      regimeSummary: "Design exporté ou dérivé au Canada et en Australie ; intérêt norvégien à suivre.",
      itarExposure: "partielle",
      politicalConstraints: "Les armements et CMS changent selon client.",
    },
    sustainment: {
      sustainmentNotes: "Soutien long de frégate lourde, sonar et mission bay comme coûts clés.",
      industrialRiskNotes: "Cadence Clyde et dérivés export à suivre.",
    },
  },
  keySpecs: [
    { label: "Rôle", value: "Frégate ASW", confidence: "haute", sources: ["rn-type26"] },
    { label: "Radar", value: "Artisan 997", confidence: "moyenne", sources: ["bae-type26-cardiff"] },
    { label: "Missiles", value: "Sea Ceptor + Mk 41", confidence: "haute", sources: ["bae-type26-cardiff"] },
    { label: "Sonar", value: "Sonars de coque et remorqué", confidence: "moyenne", sources: ["bae-type26-cardiff"] },
    { label: "Canon", value: "Mk 45 5 pouces", confidence: "haute", sources: ["bae-type26-gun"] },
    { label: "Mission bay", value: "Grand volume adaptable", confidence: "haute", sources: ["bae-type26-cardiff"] },
  ],
  costNarrative:
    "Le coût Type 26 tient au compromis frégate lourde : discrétion ASM, mission bay, sonar, missiles et adaptation future.",
  financeNarrative:
    "La Royal Navy finance huit City class ; l'export de design aide à valider la base industrielle et à soutenir la série.",
  supplyNarrative:
    "BAE Systems porte le design et la construction, avec MBDA, BAE weapon systems et une chaîne britannique de propulsion/capteurs.",
  geopoliticsNarrative:
    "La Type 26 protège la dissuasion et les groupes navals, tout en donnant au Royaume-Uni un produit export de premier rang.",
  exportNarrative:
    "Son attractivité export tient au design adaptable : l'architecture n'est pas figée, mais les configurations client peuvent diverger fortement.",
  editorial: {
    mythVsReality:
      "Le mythe : la Type 26 est une frégate généraliste. La réalité : c'est d'abord une plateforme ASM lourde et très adaptable.",
    bestUseCase: "Protection ASM de groupe aéronaval, dissuasion et escorte haute valeur.",
    weakPoint: "Coût et cadence d'une frégate lourde, avec performances fines sonar peu publiques.",
    analystNote:
      "Face à FDI ou F110, Type 26 illustre un choix différent : plus de volume et d'ASM, moins de densité radar/VLS que les destroyers Aegis.",
  },
  operators: ["Royaume-Uni — Royal Navy", "Canada — design dérivé", "Australie — Hunter class dérivée"],
  theatres: ["Atlantique Nord", "Mer du Nord", "Méditerranée", "Indo-Pacifique"],
  sources: [
    {
      id: "rn-type26",
      title: "City Class frigate",
      publisher: "Royal Navy",
      type: "institution",
      reliability: "A",
      url: "https://www.royalnavy.mod.uk/equipment/ships/city-class",
    },
    {
      id: "bae-type26-cardiff",
      title: "HMS Cardiff steel cut ceremony",
      publisher: "BAE Systems",
      type: "constructeur",
      reliability: "B",
      date: "2017",
      url: "https://www.baesystems.com/en/article/steel-cut-ceremony-signals-important-progress-on-uk-royal-navy-programme",
    },
    {
      id: "bae-type26-gun",
      title: "Continued Success on U.K. Type 26 Global Combat Ship",
      publisher: "BAE Systems",
      type: "constructeur",
      reliability: "B",
      date: "2015",
      url: "https://www.baesystems.com/en-us/article/continued-success-on-u-k--type-26-global-combat-ship",
    },
  ],
  sourceIds: { primary: "rn-type26", combat: "bae-type26-cardiff", industrial: "bae-type26-cardiff", export: "bae-type26-cardiff" },
  scores: {
    "efficacite-cout": ["B", "Très forte valeur ASM et adaptation, mais coût élevé de frégate lourde."],
    survivabilite: ["B", "Discrétion et capteurs ASM solides ; défense aérienne surtout locale."],
    exportabilite: ["A", "Design déjà crédible à l'export ou en dérivé allié."],
    "risque-industriel": ["C", "Cadence et soutenabilité du programme britannique à suivre."],
    maturite: ["C", "Programme en construction ; design robuste mais retour flotte encore limité."],
    "confiance-donnees": ["B", "Design et équipements publics ; performances acoustiques sensibles."],
  },
});

export const fremmCarloBergamini = makeNavalSystem({
  slug: "fremm-carlo-bergamini",
  name: "FREMM Carlo Bergamini",
  designation: "F590 · frégate multimission italienne",
  reference: "PNP-NS-022",
  navalVesselClass: "fregate",
  classLabel: "FREMM italienne multirôle",
  country: "Italie",
  flag: "🇮🇹",
  manufacturer: "Fincantieri · Leonardo · OCCAR",
  introduced: "2013",
  status: "Classe en service dans la Marina Militare ; série FREMM italienne livrée",
  acquisitionModes: ["cooperatif", "production-nationale"],
  tagline:
    "La FREMM italienne combine Kronos, SAAM-ESD, CAPTAS-4, Teseo, Aster et CODLAG : un laboratoire européen de frégate lourde.",
  summary:
    "La Carlo Bergamini donne le pendant italien de la FREMM française. Même famille coopérative, mais choix de capteurs, armes et artillerie différents : Kronos, canons Leonardo, Teseo, Aster, MU90/MILAS et CODLAG.\n\nElle est utile à Panoplie parce qu'elle montre comment un programme commun peut diverger en deux architectures nationales, et comment OCCAR, Fincantieri et Leonardo structurent un écosystème exportable.",
  profile: {
    platform: {
      missions: ["ASW", "AAW", "ASuW", "presence"],
      displacement: "≈ 6 500 t pleine charge",
      crew: "≈ 145 personnes, capacité ≈ 200",
      endurance: "≈ 45 jours",
      aviation: ["EH101 / NH90", "double hangar"],
      notes: "Frégate lourde multi-mission, versions GP et ASW.",
    },
    combatSystem: {
      family: "SAAM-ESD",
      cms: "SAAM-ESD / CMS italien Leonardo",
      tacticalLinks: ["Link 16", "réseaux OTAN"],
      ballisticMissileDefense: false,
      interoperabilityNotes: "Programme FREMM européen coordonné par OCCAR.",
    },
    sensors: {
      radarPrimary: "Leonardo Kronos Grand Naval",
      hullSonar: "UMS 4110",
      towedSonar: "CAPTAS-4 / VDS selon version",
      esm: ["Elettronica / suite EW italienne"],
    },
    effectors: {
      vlsType: "Sylver A43/A50",
      vlsCells: "2 × 8 cellules",
      sam: ["Aster 15/30"],
      antiShipMissiles: ["Teseo / Otomat"],
      antiSubWeapons: ["MU90", "MILAS selon configuration"],
      navalGuns: ["127/64", "76/62 Strales"],
    },
    propulsion: {
      architecture: "CODLAG",
      primeMovers: ["Turbine gaz", "moteurs électriques"],
      maxSpeed: "≥ 27 kt",
      notes: "CODLAG : discrétion ASM et vitesse de transit.",
    },
    industrial: {
      primeContractor: "Orizzonte Sistemi Navali / Fincantieri / Leonardo",
      shipyards: ["Riva Trigoso", "Muggiano"],
      suppliers: [
        { subsystem: "Radar", supplier: "Leonardo", country: "Italie" },
        { subsystem: "Missiles", supplier: "MBDA", country: "Europe" },
        { subsystem: "Programme", supplier: "OCCAR", country: "Europe" },
      ],
    },
    export: {
      regimeSummary: "Plateforme européenne exportable ; armements et senseurs variables selon client.",
      itarExposure: "partielle",
      politicalConstraints: "Configuration Aster/Teseo/MILAS à arbitrer par client et régime national.",
    },
    sustainment: {
      programCost: "Programme italien initial autour de plusieurs milliards d'euros pour la série",
      sustainmentNotes: "ISS/TLSM et soutien OCCAR/OSN à suivre dans la durée.",
    },
  },
  keySpecs: [
    { label: "Déplacement", value: "≈ 6 500 t", confidence: "haute", sources: ["fincantieri-fremm-pdf"] },
    { label: "Propulsion", value: "CODLAG", confidence: "haute", sources: ["fincantieri-fremm-pdf"] },
    { label: "VLS", value: "2 × 8 Sylver A43/A50", confidence: "haute", sources: ["fincantieri-fremm-pdf"] },
    { label: "Radar", value: "Kronos Grand Naval", confidence: "moyenne", sources: ["fincantieri-fremm-pdf"] },
    { label: "Sonar", value: "UMS 4110 + CAPTAS-4 selon version", confidence: "moyenne", sources: ["fincantieri-fremm-pdf"] },
    { label: "Programme", value: "FREMM franco-italien OCCAR", confidence: "haute", sources: ["occar-fremm"] },
  ],
  costNarrative:
    "Le coût FREMM IT se lit dans une frégate lourde européenne : propulsion CODLAG, artillerie Leonardo, sonar, Aster, Teseo et soutien de série.",
  financeNarrative:
    "Le programme est coopératif via OCCAR, puis nationalisé par choix d'équipements italiens et commandes de la Marina Militare.",
  supplyNarrative:
    "La chaîne italienne donne un contraste utile avec la FREMM française : Fincantieri, Leonardo, MBDA, OCCAR et un soutien OSN.",
  geopoliticsNarrative:
    "La FREMM italienne sert la présence méditerranéenne, l'OTAN et l'autonomie industrielle italienne dans le naval de premier rang.",
  exportNarrative:
    "Le design FREMM a prouvé son potentiel export, mais chaque client recompose capteurs, missiles, canons et soutien.",
  editorial: {
    mythVsReality:
      "Le mythe : FREMM France et Italie seraient interchangeables. La réalité : même base, architectures nationales distinctes.",
    bestUseCase: "Escorte ASM/ASuW de premier rang, présence méditerranéenne et opérations OTAN.",
    weakPoint: "Coût de frégate lourde et configurations multiples qui compliquent la comparaison.",
    analystNote:
      "La Carlo Bergamini est une fiche clé pour montrer que Panoplie compare des architectures, pas seulement des noms de programmes.",
  },
  operators: ["Italie — Marina Militare", "Égypte — variantes FREMM IT"],
  theatres: ["Méditerranée", "Atlantique", "Océan Indien"],
  sources: [
    {
      id: "fincantieri-fremm-pdf",
      title: "Bergamini class FREMM technical sheet",
      publisher: "Fincantieri",
      type: "constructeur",
      reliability: "B",
      url: "https://www.fincantieri.com/globalassets/prodotti-servizi/repository/web_scheda_militari_m-09-22_bergamini-class_fremm_new.pdf",
    },
    {
      id: "occar-fremm",
      title: "FREMM multi-mission frigates — general information",
      publisher: "OCCAR",
      type: "institution",
      reliability: "A",
      url: "https://www.occar.int/our-work/programmes/horizon-mlufremm-multi-mission-frigates/general-information",
    },
  ],
  sourceIds: { primary: "fincantieri-fremm-pdf", combat: "fincantieri-fremm-pdf", industrial: "occar-fremm", export: "occar-fremm" },
  scores: {
    "efficacite-cout": ["B", "Frégate lourde coûteuse mais dense en capteurs, armes et endurance."],
    survivabilite: ["B", "Bonne combinaison AAW locale, ASM, EW et hélicoptères ; performances fines non publiques."],
    exportabilite: ["B", "Design FREMM exporté, mais configuration fortement variable."],
    "risque-industriel": ["B", "Base Fincantieri/Leonardo/OCCAR solide, soutien de série à suivre."],
    maturite: ["A", "Classe en service et série italienne avancée."],
    "confiance-donnees": ["B", "Fiche constructeur détaillée ; détails de guerre électronique et sonar sensibles."],
  },
});

export const f110Bonifaz = makeNavalSystem({
  slug: "f110-bonifaz",
  name: "F110 Bonifaz",
  designation: "F-111 · frégate espagnole nouvelle génération",
  reference: "PNP-NS-023",
  navalVesselClass: "fregate",
  classLabel: "Frégate ASW / AAW SCOMBA",
  country: "Espagne",
  flag: "🇪🇸",
  manufacturer: "Navantia · Lockheed Martin · Thales",
  status: "Première unité lancée ; programme de cinq frégates F110",
  acquisitionModes: ["production-nationale", "DCS"],
  tagline:
    "La F110 agrège SCOMBA, IAFCL, SPY-7 et CAPTAS-4 : une frégate espagnole qui hybride souveraineté CMS et brique Aegis américaine.",
  summary:
    "La F110 Bonifaz est l'exemple exact demandé par le rapport : une frégate où l'architecture compte plus que le tonnage. Navantia garde SCOMBA comme coeur national, Lockheed Martin apporte SPY-7 et l'IAFCL, Thales fournit la brique sonar.\n\nPour Panoplie, elle est le meilleur comparateur de la FDI et de la Type 26 : radar très ambitieux, mission ASM, coût public de programme, forte base industrielle locale et exposition américaine partielle.",
  profile: {
    platform: {
      missions: ["ASW", "AAW", "ASuW", "presence"],
      displacement: "≈ 6 100 t selon sources ouvertes",
      crew: "≈ 150",
      aviation: ["SH-60 / hélicoptère embarqué", "drones selon évolution"],
      notes: "Frégate de remplacement des Santa María, orientée ASM avec radar de haut niveau.",
    },
    combatSystem: {
      family: "SCOMBA",
      cms: "SCOMBA + IAFCL",
      baseline: "SPY-7(V)2 integration",
      tacticalLinks: ["Link 16", "Aegis / IAFCL"],
      ballisticMissileDefense: false,
      interoperabilityNotes: "Hybridation nationale espagnole et brique Aegis/Lockheed.",
    },
    sensors: {
      radarPrimary: "AN/SPY-7(V)2",
      hullSonar: "BlueMaster / sonar de coque selon sources ouvertes",
      towedSonar: "CAPTAS-4",
      esm: ["Mât intégré MASTIN / suite EW espagnole"],
    },
    effectors: {
      vlsType: "Mk 41",
      vlsCells: "16 cellules selon sources ouvertes",
      sam: ["ESSM Block 2"],
      antiShipMissiles: ["NSM"],
      antiSubWeapons: ["Torpilles légères", "hélicoptère ASM"],
      navalGuns: ["127 mm"],
    },
    propulsion: {
      architecture: "CODLOG",
      primeMovers: ["Turbine gaz", "diesels", "moteurs électriques"],
      notes: "CODLOG cohérent avec une mission ASM discrète.",
    },
    industrial: {
      primeContractor: "Navantia",
      shipyards: ["Ferrol"],
      suppliers: [
        { subsystem: "CMS", supplier: "Navantia Sistemas", country: "Espagne" },
        { subsystem: "Radar", supplier: "Lockheed Martin", country: "États-Unis" },
        { subsystem: "Sonar", supplier: "Thales", country: "France" },
      ],
      localContentNotes: "Programme fortement structurant pour l'industrie espagnole.",
    },
    export: {
      regimeSummary: "Potentiel export via Navantia, mais dépendance SPY-7/IAFCL américaine.",
      itarExposure: "partielle",
      reexportConstraints: "Briques Lockheed et missiles soumis aux règles américaines.",
    },
    sustainment: {
      programCost: "≈ €4,3 Md pour cinq frégates selon ordre public de programme",
      sustainmentNotes: "Soutien SCOMBA/IAFCL/SPY-7 et cadence Ferrol à suivre.",
    },
  },
  keySpecs: [
    { label: "CMS", value: "SCOMBA + IAFCL", confidence: "haute", sources: ["navantia-spy7-scomba"] },
    { label: "Radar", value: "AN/SPY-7(V)2", confidence: "haute", sources: ["lm-spy7-f110"] },
    { label: "Sonar", value: "CAPTAS-4 + sonar de coque", confidence: "moyenne", sources: ["navantia-frigates"] },
    { label: "VLS", value: "Mk 41, 16 cellules selon sources ouvertes", confidence: "moyenne", sources: ["navantia-armamento"] },
    { label: "Coût public", value: "≈ €4,3 Md / 5 navires", confidence: "moyenne", status: "a-recouper", sources: ["navantia-frigates"] },
    { label: "Chantier", value: "Ferrol", confidence: "haute", sources: ["navantia-frigates"] },
  ],
  costNarrative:
    "La F110 concentre son coût dans SPY-7, SCOMBA/IAFCL, sonar, CODLOG et intégration locale. Le prix public de programme doit être manié comme enveloppe.",
  financeNarrative:
    "Le programme de cinq unités est une politique industrielle espagnole autant qu'un renouvellement naval.",
  supplyNarrative:
    "La chaîne F110 est précisément le type d'objet que Panoplie doit cartographier : Navantia national, Lockheed radar/Aegis, Thales sonar.",
  geopoliticsNarrative:
    "La F110 renforce l'Espagne dans le club des frégates européennes avancées et maintient la continuité F100/Aegis.",
  exportNarrative:
    "Navantia dispose d'un potentiel export, mais l'exposition américaine de SPY-7/IAFCL conditionne les configurations possibles.",
  editorial: {
    mythVsReality:
      "Le mythe : une frégate espagnole serait surtout une plateforme nationale. La réalité : F110 est une hybridation SCOMBA/Aegis/SPY-7.",
    bestUseCase: "Escorte ASM/AAW de groupe, couverture radar et renouvellement de flotte espagnole.",
    weakPoint: "Intégration complexe SPY-7/IAFCL/SCOMBA et nombre VLS plus limité que les destroyers Aegis.",
    analystNote:
      "F110 est l'une des fiches les plus utiles pour Panoplie : elle rend visibles les dépendances croisées entre souveraineté CMS et capteurs américains.",
  },
  operators: ["Espagne — Armada Española"],
  theatres: ["Atlantique", "Méditerranée", "OTAN"],
  timeline: [
    { date: "2019", label: "Autorisation du programme F110 pour cinq frégates.", kind: "jalon" },
    { date: "2025", label: "Intégration publique SPY-7 / SCOMBA documentée par Navantia et Lockheed Martin.", kind: "jalon" },
  ],
  sources: [
    {
      id: "navantia-spy7-scomba",
      title: "Integration of Lockheed Martin's SPY-7 Radar into SCOMBA",
      publisher: "Navantia",
      type: "constructeur",
      reliability: "B",
      date: "2025",
      url: "https://www.navantia.es/en/news/press-releases/integration-lockheed-martin-spy7-radar-scomba-system-navantia/",
    },
    {
      id: "lm-spy7-f110",
      title: "SPY-7 Radar for Spain's F-110 Frigate Successfully Tracks Airborne Objects",
      publisher: "Lockheed Martin",
      type: "constructeur",
      reliability: "B",
      date: "2025",
      url: "https://news.lockheedmartin.com/2025-01-14-The-Skys-No-Limit-Lockheed-Martins-SPY-7-Radar-for-Spains-F-110-Frigate-Successfully-Tracks-Airborne-Objects",
    },
    {
      id: "navantia-frigates",
      title: "Frigates",
      publisher: "Navantia",
      type: "constructeur",
      reliability: "B",
      url: "https://www.navantia.es/en/business-lines/naval-construction/frigates/",
    },
    {
      id: "navantia-armamento",
      title: "F110 armamento",
      publisher: "Navantia",
      type: "constructeur",
      reliability: "B",
      url: "https://www.navantia.es/en/product/f110-armamento/",
    },
  ],
  sourceIds: { primary: "navantia-frigates", combat: "navantia-spy7-scomba", cost: "navantia-frigates", industrial: "navantia-spy7-scomba", export: "lm-spy7-f110" },
  scores: {
    "efficacite-cout": ["B", "Radar et CMS ambitieux pour une frégate, coût de programme élevé mais structurant."],
    survivabilite: ["B", "SPY-7, ESSM et ASM solides ; VLS limité face aux grands destroyers."],
    exportabilite: ["B", "Navantia a une forte crédibilité export, mais dépendance américaine partielle."],
    "risque-industriel": ["C", "Intégration SPY-7/SCOMBA/IAFCL complexe, avec calendrier encore en montée."],
    maturite: ["C", "Programme en lancement ; maturité opérationnelle à confirmer après admission au service."],
    "confiance-donnees": ["B", "Sources industrielles nombreuses ; performances et configuration finale à recouper."],
  },
});
