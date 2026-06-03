import { makeNavalSystem } from "./naval-multinational";

// Pack naval Corée du Sud — montée en gamme et offre export : destroyer Aegis
// très chargé, sous-marin conventionnel à VLS et amphibie LPH. Base industrielle
// rapide (Hanwha Ocean, HD Hyundai) au cœur de l'offre internationale récente.

export const kdxIiiBatchIi = makeNavalSystem({
  slug: "kdx-iii-batch-ii",
  name: "KDX-III Batch II",
  designation: "Jeongjo the Great · destroyer Aegis coréen",
  reference: "PNP-NS-030",
  navalVesselClass: "destroyer",
  classLabel: "Destroyer Aegis (KVLS-II)",
  country: "Corée du Sud",
  flag: "🇰🇷",
  manufacturer: "HD Hyundai Heavy Industries · Lockheed Martin",
  introduced: "2024",
  status: "En service (tête de série ROKS Jeongjo the Great) ; série de trois",
  acquisitionModes: ["FMS", "production-nationale"],
  updated: "2026-06-03",
  tagline:
    "Le KDX-III Batch II est l'un des destroyers Aegis les plus chargés au monde : Aegis Baseline 9, KVLS-II national et missiles balistiques mer-sol dérivés du Hyunmoo.",
  summary:
    "Le KDX-III Batch II (classe Jeongjo the Great) prolonge les Sejong the Great avec ≈ 8 200 t à lège (≈ 12 000 t pleine charge), l'Aegis Baseline 9 et surtout le lanceur national KVLS-II, qui ouvre la voie à des intercepteurs SM-3 et à des missiles balistiques mer-sol dérivés du Hyunmoo.\n\nPour Panoplie, c'est le cas coréen par excellence : montée en gamme industrielle rapide (HD Hyundai), densité d'armement hors norme et stratégie export agressive, à comparer aux Maya japonais et aux Arleigh Burke.",
  profile: {
    platform: {
      missions: ["AAW", "BMD", "ASW", "ASuW", "strike"],
      displacement: "≈ 8 200 t à lège (≈ 12 000 t pleine charge)",
      crew: "≈ 300 marins",
      aviation: ["2 × hélicoptères ASM"],
      notes: "Destroyer Aegis très chargé : défense aérienne, BMD et frappe balistique mer-sol.",
    },
    combatSystem: {
      family: "Aegis",
      cms: "Aegis Weapon System Baseline 9",
      tacticalLinks: ["Link 16", "réseaux ROK Navy"],
      ballisticMissileDefense: true,
      interoperabilityNotes: "Aegis interopérable avec l'US Navy ; couche nationale KVLS-II pour frappe et défense.",
    },
    sensors: {
      radarPrimary: "AN/SPY-1D(V)",
      hullSonar: "Sonar de coque + sonar remorqué",
      esm: ["Suite de guerre électronique coréenne"],
    },
    effectors: {
      vlsType: "Mk 41 + KVLS-II (national)",
      vlsCells: "≈ 88 Mk 41 + cellules KVLS-II",
      sam: ["SM-2", "SM-3 (capacité prévue)"],
      antiShipMissiles: ["SSM-700K Haeseong"],
      antiSubWeapons: ["K-ASROC Red Shark", "torpilles légères"],
      navalGuns: ["127 mm"],
      ciws: ["Phalanx", "RAM"],
    },
    propulsion: {
      architecture: "autre",
      primeMovers: ["4 turbines à gaz", "2 moteurs électriques 1,7 MW + propulsion auxiliaire"],
      maxSpeed: "≈ 30 kt",
      notes: "Hybridation turbine + propulsion électrique pour l'économie et la discrétion.",
    },
    industrial: {
      primeContractor: "HD Hyundai Heavy Industries",
      shipyards: ["Ulsan"],
      suppliers: [
        { subsystem: "Système de combat", supplier: "Lockheed Martin (Aegis)", country: "États-Unis" },
        { subsystem: "VLS / missiles", supplier: "LIG Nex1 / Hanwha", country: "Corée du Sud" },
      ],
      localContentNotes: "Forte montée en contenu national (KVLS-II, missiles Hyunmoo dérivés).",
    },
    export: {
      regimeSummary: "Brique Aegis non exportée, mais la Corée pousse une offre export navale globale (Hanwha, HD Hyundai).",
      itarExposure: "elevee",
      politicalConstraints: "Aegis et missiles Standard sous contrôle américain ; couche nationale plus librement exportable.",
    },
    sustainment: {
      sustainmentNotes: "Soutien Aegis et montée en charge de la base industrielle coréenne ; cadence Ulsan élevée.",
    },
  },
  keySpecs: [
    { label: "Déplacement", value: "≈ 8 200 t à lège (≈ 12 000 t pleine charge)", confidence: "moyenne", sources: ["nn-kdx3"] },
    { label: "Longueur", value: "≈ 170 m", confidence: "moyenne", sources: ["nn-kdx3"] },
    { label: "Système de combat", value: "Aegis Baseline 9", confidence: "haute", sources: ["nn-kdx3"] },
    { label: "VLS", value: "Mk 41 + KVLS-II national", confidence: "moyenne", sources: ["twz-kdx3"] },
    { label: "Frappe", value: "Missile balistique mer-sol dérivé du Hyunmoo", confidence: "moyenne", status: "a-recouper", sources: ["twz-kdx3"] },
    { label: "Série", value: "3 unités (tête de série en service)", confidence: "haute", sources: ["ar-kdx3"] },
  ],
  costNarrative:
    "Le coût KDX-III Batch II combine Aegis, KVLS-II national, intercepteurs et frappe balistique : un destroyer dense au coût élevé mais amorti par l'industrie locale.",
  financeNarrative:
    "Financement national avec brique Aegis américaine ; programme qui sert aussi de vitrine industrielle pour l'export.",
  supplyNarrative:
    "La chaîne mêle coque HD Hyundai, Aegis Lockheed Martin et couche nationale LIG Nex1/Hanwha — montée rapide en contenu coréen.",
  geopoliticsNarrative:
    "Le KDX-III Batch II affirme la dissuasion conventionnelle coréenne (BMD + frappe) et soutient une ambition export navale assumée.",
  exportNarrative:
    "Le navire complet n'est pas exporté, mais il incarne la crédibilité industrielle coréenne sur laquelle s'appuie l'offre export (frégates, sous-marins, OPV).",
  editorial: {
    mythVsReality:
      "Le mythe : un clone de Sejong the Great. La réalité : KVLS-II et la frappe balistique mer-sol en font un destroyer d'une densité d'armement rare.",
    bestUseCase: "Défense aérienne/antimissile, frappe mer-sol et démonstration de la base industrielle coréenne.",
    weakPoint: "Densité d'armement très élevée et dépendance Aegis/Standard américaine ; coût complet conséquent.",
    analystNote:
      "À comparer au Maya japonais et à l'Arleigh Burke : même brique Aegis, mais couche nationale coréenne (KVLS-II, Hyunmoo) plus offensive.",
  },
  operators: ["Corée du Sud — ROK Navy"],
  theatres: ["Mer Jaune", "Mer du Japon", "détroits coréens", "Indo-Pacifique"],
  timeline: [
    { date: "2022", label: "Lancement de la tête de série KDX-III Batch II par HD Hyundai.", kind: "jalon" },
    { date: "2023", label: "Début des essais à la mer du premier Batch II.", kind: "jalon" },
    { date: "2024", label: "Admission au service du ROKS Jeongjo the Great.", kind: "jalon" },
  ],
  sources: [
    {
      id: "nn-kdx3",
      title: "HHI launches South Korea's first KDX III Batch II destroyer",
      publisher: "Naval News",
      type: "presse",
      reliability: "B",
      date: "2022",
      url: "https://www.navalnews.com/naval-news/2022/07/hhi-launches-south-koreas-first-kdx-iii-batch-ii-destroyer/",
    },
    {
      id: "twz-kdx3",
      title: "South Korea's new destroyer is designed to fire ballistic missiles",
      publisher: "The War Zone",
      type: "presse",
      reliability: "B",
      url: "https://www.twz.com/news-features/south-koreas-new-destroyer-is-designed-to-fire-ballistic-missiles",
    },
    {
      id: "ar-kdx3",
      title: "South Korea names final KDX-III Batch-II Aegis destroyer",
      publisher: "Army Recognition",
      type: "presse",
      reliability: "C",
      date: "2026",
      url: "https://www.armyrecognition.com/news/navy-news/2026/south-korea-names-final-kdx-iii-batch-ii-aegis-destroyer-roks-daeho-kim-jongseo",
    },
  ],
  sourceIds: { primary: "nn-kdx3", combat: "nn-kdx3", industrial: "nn-kdx3", export: "ar-kdx3" },
  scores: {
    "efficacite-cout": ["B", "Densité d'armement exceptionnelle pour le prix, mais coût complet élevé et dépendance Aegis."],
    survivabilite: ["B", "Aegis Baseline 9 et défense multicouche ; exposition propre à tout escorteur très chargé."],
    exportabilite: ["C", "Navire complet non exporté, mais vitrine industrielle qui nourrit l'offre export coréenne."],
    "risque-industriel": ["B", "Base HD Hyundai rapide et profonde ; dépendance américaine sur le combat système."],
    maturite: ["B", "Tête de série en service ; série jeune en montée en puissance."],
    "confiance-donnees": ["C", "Architecture publique solide ; capacités balistiques et chiffres fins à recouper."],
  },
});

export const kssIii = makeNavalSystem({
  slug: "kss-iii",
  name: "KSS-III",
  designation: "Dosan Ahn Changho · sous-marin coréen à VLS",
  reference: "PNP-NS-031",
  navalVesselClass: "sous-marin",
  classLabel: "Sous-marin AIP avec lanceurs verticaux",
  country: "Corée du Sud",
  flag: "🇰🇷",
  manufacturer: "Hanwha Ocean · HD Hyundai Heavy Industries",
  introduced: "2021",
  status: "En service (Batch I) ; Batch II en construction",
  acquisitionModes: ["production-nationale", "cooperatif"],
  updated: "2026-06-03",
  tagline:
    "Le KSS-III est rare parmi les sous-marins conventionnels : il embarque des lanceurs verticaux capables de missiles balistiques mer-sol dérivés du Hyunmoo.",
  summary:
    "La classe Dosan Ahn Changho (KSS-III) est un SSK de premier plan : ≈ 3 358 t / 3 750 t (Batch I), conception et construction nationales par Hanwha Ocean et HD Hyundai, propulsion AIP, et surtout des lanceurs verticaux (6 cellules en Batch I, davantage en Batch II) ouvrant à des missiles balistiques mer-sol dérivés du Hyunmoo.\n\nPour Panoplie, il se distingue du 212CD et du Taigei par cette capacité de frappe verticale, qui change la nature stratégique d'un sous-marin conventionnel.",
  profile: {
    platform: {
      missions: ["ASW", "ASuW", "strike", "presence"],
      displacement: "≈ 3 358 t surface / 3 750 t plongée (Batch I)",
      crew: "≈ 50 marins",
      endurance: "Patrouille prolongée grâce à l'AIP (et lithium-ion en Batch II)",
      notes: "SSK national à lanceurs verticaux — capacité de frappe rare sur un sous-marin conventionnel.",
    },
    combatSystem: {
      family: "autre",
      cms: "Système de combat sous-marin coréen (Hanwha)",
      tacticalLinks: ["Liaisons sous-marines nationales"],
      ballisticMissileDefense: false,
      interoperabilityNotes: "Nœud de dissuasion conventionnelle et de frappe de la flotte sous-marine coréenne.",
    },
    sensors: {
      hullSonar: "Suite sonar intégrée",
      towedSonar: "Antenne remorquée",
      esm: ["Mât optronique et ESM"],
    },
    effectors: {
      vlsType: "Lanceurs verticaux K-VLS (sous-marin)",
      vlsCells: "6 cellules (Batch I) ; davantage en Batch II",
      antiShipMissiles: ["SSM-700K Haeseong"],
      antiSubWeapons: ["Torpilles lourdes (Tiger Shark / Beom Sang-eo)"],
    },
    propulsion: {
      architecture: "AIP",
      primeMovers: ["Pile à combustible (AIP)", "Batch II : batteries lithium-ion"],
      maxSpeed: "≈ 20 kt en plongée",
      notes: "AIP pour la discrétion ; Batch II passe aux batteries lithium-ion.",
    },
    industrial: {
      primeContractor: "Hanwha Ocean / HD Hyundai Heavy Industries",
      shipyards: ["Geoje", "Ulsan"],
      suppliers: [
        { subsystem: "Conception / coque", supplier: "Hanwha Ocean / HD HHI", country: "Corée du Sud" },
        { subsystem: "Missiles", supplier: "LIG Nex1 / ADD", country: "Corée du Sud" },
      ],
      localContentNotes: "Conception et construction largement nationales — pilier de la souveraineté sous-marine coréenne.",
    },
    export: {
      regimeSummary: "Forte ambition export coréenne (offres internationales récentes Hanwha Ocean).",
      itarExposure: "partielle",
      politicalConstraints: "Capacité de frappe balistique sensible à l'export ; configuration adaptée par client.",
    },
    sustainment: {
      sustainmentNotes: "Soutien national et montée en charge de la base sous-marine coréenne.",
      industrialRiskNotes: "Jeunesse de la filière VLS sous-marine et passage Batch II au lithium-ion.",
    },
  },
  keySpecs: [
    { label: "Déplacement", value: "≈ 3 358 t / 3 750 t (Batch I)", confidence: "moyenne", sources: ["gs-kss3"] },
    { label: "Propulsion", value: "AIP (Batch II : lithium-ion)", confidence: "moyenne", sources: ["gs-kss3"] },
    { label: "Lanceurs verticaux", value: "6 cellules (Batch I)", confidence: "moyenne", status: "a-recouper", sources: ["gs-kss3"] },
    { label: "Frappe", value: "Missile balistique mer-sol dérivé du Hyunmoo", confidence: "faible", status: "a-recouper", sources: ["gs-kss3"] },
    { label: "Équipage", value: "≈ 50", confidence: "moyenne", sources: ["sf-kss3"] },
    { label: "Industriels", value: "Hanwha Ocean · HD Hyundai", confidence: "haute", sources: ["gs-kss3"] },
  ],
  costNarrative:
    "Le coût KSS-III intègre l'AIP, les lanceurs verticaux et un système de combat national : un SSK premium qui se rapproche d'une mini-dissuasion conventionnelle.",
  financeNarrative:
    "Programme national structurant, financé pour bâtir une filière sous-marine souveraine et exportable.",
  supplyNarrative:
    "La chaîne est largement coréenne — Hanwha Ocean, HD Hyundai, LIG Nex1/ADD — avec une exposition étrangère limitée.",
  geopoliticsNarrative:
    "Le KSS-III donne à Séoul une frappe sous-marine discrète, élément clé de sa dissuasion conventionnelle face au Nord.",
  exportNarrative:
    "Hanwha Ocean en fait un argument central de son offre export ; la capacité de frappe verticale reste politiquement sensible selon les clients.",
  editorial: {
    mythVsReality:
      "Le mythe : un sous-marin conventionnel ne fait pas de frappe stratégique. La réalité : les lanceurs verticaux du KSS-III brouillent cette frontière.",
    bestUseCase: "Dissuasion conventionnelle sous-marine, frappe mer-sol et patrouille ASM dans les eaux régionales.",
    weakPoint: "Filière VLS sous-marine jeune ; endurance et frappe inférieures à un SSN ; données fines sensibles.",
    analystNote:
      "Comparer KSS-III (AIP + VLS), Taigei (lithium-ion) et 212CD (AIP) : la capacité de frappe verticale est le vrai différenciateur coréen.",
  },
  operators: ["Corée du Sud — ROK Navy"],
  theatres: ["Mer du Japon", "Mer Jaune", "détroits coréens"],
  timeline: [
    { date: "2021", label: "Admission au service du ROKS Dosan Ahn Changho (tête de série).", kind: "jalon" },
    { date: "2024", label: "Poursuite du programme Batch II (lithium-ion, capacité accrue).", kind: "jalon" },
  ],
  sources: [
    {
      id: "gs-kss3",
      title: "KSS-III / Jangbogo-III submarine program",
      publisher: "GlobalSecurity.org",
      type: "think-tank",
      reliability: "C",
      url: "https://www.globalsecurity.org/military/world/rok/kss-3.htm",
    },
    {
      id: "sf-kss3",
      title: "Dosan Ahn Changho class KSS-III submarine, Korean Navy",
      publisher: "Seaforces Online",
      type: "presse",
      reliability: "C",
      url: "https://www.seaforces.org/marint/Republic-Korea-Navy/Submarine/Dosan-Ahn-Changho-class.htm",
    },
  ],
  sourceIds: { primary: "gs-kss3", combat: "gs-kss3", industrial: "gs-kss3", export: "gs-kss3" },
  scores: {
    "efficacite-cout": ["B", "SSK premium avec capacité de frappe rare ; coût élevé pour un conventionnel mais effet stratégique fort."],
    survivabilite: ["A", "AIP et discrétion élevées ; performances acoustiques fines non publiques."],
    exportabilite: ["B", "Argument export coréen majeur, mais la frappe verticale est politiquement sensible."],
    "risque-industriel": ["C", "Filière VLS sous-marine et transition lithium-ion encore jeunes."],
    maturite: ["B", "Batch I en service ; Batch II en construction."],
    "confiance-donnees": ["C", "Capacités de frappe et chiffres fins à recouper ; régime de confiance prudent."],
  },
});

export const dokdoMarado = makeNavalSystem({
  slug: "dokdo-marado",
  name: "Dokdo / Marado",
  designation: "LPH-6111 / LPH-6112 · porte-hélicoptères amphibie coréen",
  reference: "PNP-NS-032",
  navalVesselClass: "amphibie",
  classLabel: "Porte-hélicoptères amphibie (LPH)",
  country: "Corée du Sud",
  flag: "🇰🇷",
  manufacturer: "Hanjin Heavy Industries (HJ Shipbuilding)",
  introduced: "2007",
  status: "En service (2 unités : Dokdo, Marado)",
  acquisitionModes: ["production-nationale"],
  updated: "2026-06-03",
  tagline:
    "Le couple Dokdo / Marado donne à la Corée une projection amphibie : pont d'envol, chalands LCAC et, sur Marado, un radar de veille amélioré.",
  summary:
    "La classe Dokdo (LPH) est le pilier de la projection amphibie coréenne : ≈ 200 m, ≈ 18 800 t pleine charge, capable d'embarquer environ 720 fusiliers marins, des chars, des KAAV, deux LCAC et 7 à 12 hélicoptères. La seconde unité, Marado, reçoit un radar de veille amélioré (MF-STAR) et un pont compatible V-22.\n\nPour Panoplie, c'est le comparateur amphibie coréen face au Mistral, au Type 075 chinois et au Dokdo/Izumo : projection et commandement, pas combat de haute intensité autonome.",
  profile: {
    platform: {
      missions: ["amphibie", "projection", "presence"],
      displacement: "≈ 14 500 t à lège (≈ 18 800 t pleine charge)",
      crew: "≈ 330 marins + ≈ 720 fusiliers marins",
      aviation: ["7 à 12 hélicoptères", "Marado : pont compatible V-22 Osprey"],
      notes: "Projection amphibie : chars, KAAV, 2 LCAC, hélicoptères ; pas d'aviation à voilure fixe.",
    },
    combatSystem: {
      family: "autre",
      cms: "Système de combat coréen",
      tacticalLinks: ["Link 16", "réseaux ROK Navy"],
      ballisticMissileDefense: false,
      interoperabilityNotes: "Commandement amphibie et opérations interarmées coréennes.",
    },
    sensors: {
      radarPrimary: "Marado : MF-STAR (EL/M-2248, IAI) · Dokdo : radar de veille antérieur",
      esm: ["Suite de guerre électronique coréenne"],
    },
    effectors: {
      ciws: ["Goalkeeper / Phalanx selon unité", "RAM"],
      aviationWeapons: ["Hélicoptères embarqués"],
    },
    propulsion: {
      architecture: "CODAD",
      primeMovers: ["4 moteurs diesel"],
      maxSpeed: "≈ 22 kt",
    },
    industrial: {
      primeContractor: "Hanjin Heavy Industries (HJ Shipbuilding)",
      shipyards: ["Busan"],
      suppliers: [
        { subsystem: "Radar (Marado)", supplier: "IAI / partenaire local", country: "Israël / Corée du Sud" },
        { subsystem: "Plateforme", supplier: "Hanjin Heavy Industries", country: "Corée du Sud" },
      ],
    },
    export: {
      regimeSummary: "Capacité nationale ; savoir-faire amphibie valorisable dans l'offre export coréenne.",
      itarExposure: "partielle",
      politicalConstraints: "Composants américains/israéliens ponctuels (radar, CIWS) selon configuration.",
    },
    sustainment: {
      sustainmentNotes: "Coût réel porté par le groupe amphibie embarqué, l'aviation et l'escorte.",
    },
  },
  keySpecs: [
    { label: "Déplacement", value: "≈ 18 800 t pleine charge", confidence: "moyenne", sources: ["nn-marado"] },
    { label: "Capacité", value: "≈ 720 fusiliers marins, chars, KAAV, 2 LCAC", confidence: "moyenne", sources: ["nn-marado"] },
    { label: "Aviation", value: "7 à 12 hélicoptères ; Marado compatible V-22", confidence: "moyenne", sources: ["nn-marado"] },
    { label: "Radar (Marado)", value: "MF-STAR (EL/M-2248)", confidence: "moyenne", sources: ["nn-marado"] },
    { label: "Propulsion", value: "4 diesels (CODAD)", confidence: "moyenne", sources: ["nt-dokdo"] },
    { label: "Unités", value: "2 (Dokdo, Marado)", confidence: "haute", sources: ["nn-marado"] },
  ],
  costNarrative:
    "Le coût Dokdo/Marado se lit dans la chaîne amphibie : navire, chalands, hélicoptères, troupes et escorte — la coque seule sous-estime la projection.",
  financeNarrative:
    "Programme national en deux unités, avec une montée capacitaire nette sur Marado (radar, aviation).",
  supplyNarrative:
    "La chaîne est coréenne (Hanjin) avec apports ponctuels (radar IAI, CIWS) — une dépendance limitée mais réelle.",
  geopoliticsNarrative:
    "Le couple LPH soutient la projection coréenne, l'aide humanitaire régionale et le commandement amphibie interarmées.",
  exportNarrative:
    "Capacité nationale ; le savoir-faire amphibie alimente la crédibilité export plus large des chantiers coréens.",
  editorial: {
    mythVsReality:
      "Le mythe : un LPH est un mini-porte-avions. La réalité : c'est d'abord un outil amphibie, de commandement et de soutien.",
    bestUseCase: "Projection amphibie, évacuation, aide humanitaire et commandement de force navale.",
    weakPoint: "Autodéfense limitée et dépendance à l'escorte ; pas d'aviation à voilure fixe.",
    analystNote:
      "À comparer au Mistral et au Type 075 : Marado montre une nette montée capacitaire (radar, V-22) par rapport au Dokdo initial.",
  },
  operators: ["Corée du Sud — ROK Navy"],
  theatres: ["détroits coréens", "Mer du Japon", "Indo-Pacifique (déploiements)"],
  timeline: [
    { date: "2007", label: "Admission au service du ROKS Dokdo.", kind: "jalon" },
    { date: "2021", label: "Admission au service du ROKS Marado (radar et aviation améliorés).", kind: "jalon" },
  ],
  sources: [
    {
      id: "nn-marado",
      title: "South Korea commissions second Dokdo-class amphibious ship ROKS Marado (LPH-6112)",
      publisher: "Naval News",
      type: "presse",
      reliability: "B",
      date: "2021",
      url: "https://www.navalnews.com/naval-news/2021/06/south-korea-commissions-second-dokdo-class-amphibious-ship-roks-marado-lph-6112/",
    },
    {
      id: "nt-dokdo",
      title: "Dokdo Class Landing Platform Helicopter (LPH)",
      publisher: "Naval Technology",
      type: "presse",
      reliability: "B",
      url: "https://www.naval-technology.com/projects/dodko-class/",
    },
  ],
  sourceIds: { primary: "nn-marado", combat: "nn-marado", industrial: "nt-dokdo", export: "nt-dokdo" },
  scores: {
    "efficacite-cout": ["B", "Projection amphibie utile pour deux coques, à condition de disposer de l'escorte et de l'aviation."],
    survivabilite: ["C", "Autodéfense limitée ; survivabilité dépendante du groupe naval."],
    exportabilite: ["C", "Plateforme nationale ; savoir-faire valorisable mais navire non proposé tel quel."],
    "risque-industriel": ["B", "Base coréenne solide ; apports étrangers ponctuels (radar, CIWS)."],
    maturite: ["A", "Classe en service depuis 2007, renforcée par Marado en 2021."],
    "confiance-donnees": ["B", "Capacités amphibies et configuration bien documentées en sources ouvertes."],
  },
});
