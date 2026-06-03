import { makeNavalSystem } from "./naval-multinational";

// Vague navale suivante — programmes en construction ou en cours de définition,
// cités comme « à surveiller » par le briefing. Maturité plus basse, signaux de
// risque programme assumés (Constellation réduite, F127 mi-2030s). Type 076 en
// régime de confiance abaissé (Chine).

export const f127 = makeNavalSystem({
  slug: "f127",
  name: "F127",
  designation: "Type F127 · frégate de défense aérienne et antimissile allemande",
  reference: "PNP-NS-036",
  navalVesselClass: "fregate",
  classLabel: "Frégate AAW / BMD (programme)",
  country: "Allemagne",
  flag: "🇩🇪",
  manufacturer: "Deutsche Marine · industrie navale allemande (à désigner)",
  status: "Programme approuvé (2024) ; livraisons visées à partir du milieu des années 2030",
  acquisitionModes: ["production-nationale", "cooperatif"],
  updated: "2026-06-03",
  tagline:
    "La F127 vise la défense antimissile navale allemande : ≈ 10 000 t, six unités pour remplacer les Sachsen F124, avec une ambition d'interception balistique et hypersonique en couche basse.",
  summary:
    "La F127 est le futur escorteur de défense aérienne et antimissile de la Deutsche Marine : ≈ 160 m, ≈ 10 000 t, six coques attendues à partir du milieu des années 2030 pour remplacer et élargir les trois Sachsen F124.\n\nPour Panoplie, c'est un programme à suivre : la mission BMD (menaces balistiques et hypersoniques en couche basse) suppose un radar et un système de combat de très haut niveau, dont le choix industriel n'est pas encore figé publiquement.",
  profile: {
    platform: {
      missions: ["AAW", "BMD", "ASuW", "presence"],
      displacement: "≈ 10 000 t pleine charge (concept)",
      crew: "≈ 150 marins",
      endurance: "> 30 jours ; rayon ≈ 4 000 nautiques",
      notes: "Concept de grand escorteur antiaérien/antimissile ; six unités visées.",
    },
    combatSystem: {
      family: "autre",
      cms: "Système de combat à désigner (architecture BMD ; Aegis/SPY-7 évoqués publiquement)",
      ballisticMissileDefense: true,
      interoperabilityNotes: "Défense antimissile de zone OTAN ; choix radar/CMS encore ouvert.",
    },
    sensors: {
      radarPrimary: "Radar de défense antimissile à panneaux fixes (en définition)",
    },
    effectors: {
      vlsType: "Mk 41 (pressenti)",
      sam: ["Intercepteurs de défense aérienne et antimissile (à définir)"],
    },
    propulsion: {
      architecture: "autre",
      notes: "Architecture de propulsion non figée publiquement.",
    },
    industrial: {
      primeContractor: "À désigner (programme F127)",
      shipyards: ["Allemagne"],
      localContentNotes: "Choix industriel, radar et CMS encore ouverts — décision structurante à venir.",
    },
    export: {
      regimeSummary: "Capacité nationale ; dimension OTAN forte.",
      itarExposure: "partielle",
      politicalConstraints: "Une brique BMD américaine impliquerait des contrôles US.",
    },
    sustainment: {
      industrialRiskNotes: "Programme au stade amont : coûts et calendrier à consolider.",
    },
  },
  keySpecs: [
    { label: "Déplacement", value: "≈ 10 000 t (concept)", confidence: "moyenne", status: "a-recouper", sources: ["nn-f127-approval"] },
    { label: "Mission", value: "Défense aérienne et antimissile (BMD couche basse)", confidence: "moyenne", sources: ["nn-f127-approval"] },
    { label: "Série", value: "Jusqu'à 6 unités", confidence: "moyenne", status: "a-recouper", sources: ["nn-f127-shape"] },
    { label: "Calendrier", value: "Livraisons mi-2030s", confidence: "moyenne", status: "a-recouper", sources: ["nn-f127-approval"] },
    { label: "Remplace", value: "Frégates Sachsen F124", confidence: "haute", sources: ["gs-f127"] },
  ],
  costNarrative:
    "Le coût F127 sera dominé par la brique BMD : radar, système de combat, intercepteurs. Au stade amont, les chiffres restent des ordres de grandeur.",
  financeNarrative:
    "Programme national approuvé en 2024, structurant pour la flotte allemande des années 2030.",
  supplyNarrative:
    "La chaîne n'est pas figée : le choix radar/CMS (option Aegis/SPY-7) décidera d'une partie de la dépendance industrielle.",
  geopoliticsNarrative:
    "La F127 répond au contexte baltique et à la menace balistique : une contribution navale allemande à la défense antimissile de l'OTAN.",
  exportNarrative:
    "Programme national ; l'enjeu est l'interopérabilité OTAN plus que l'export.",
  editorial: {
    mythVsReality:
      "Le mythe : la F127 est déjà un navire. La réalité : un programme amont dont les choix structurants ne sont pas figés.",
    bestUseCase: "Défense aérienne et antimissile de zone, escorte de groupe et contribution BMD OTAN.",
    weakPoint: "Maturité programme : radar, CMS, industriel et calendrier encore ouverts.",
    analystNote:
      "À suivre comme le pari BMD allemand : la F127 prolongera la logique Sachsen vers l'interception balistique/hypersonique.",
  },
  operators: ["Allemagne — Deutsche Marine (programme)"],
  theatres: ["Mer du Nord", "Baltique", "Atlantique Nord", "OTAN"],
  timeline: [
    { date: "2024", label: "Approbation budgétaire du programme F127 par le Bundestag.", kind: "jalon" },
    { date: "2035", label: "Livraisons visées à partir du milieu des années 2030.", kind: "jalon" },
  ],
  sources: [
    {
      id: "nn-f127-approval",
      title: "Germany formally approves Type F127 air-defense frigate program",
      publisher: "Naval News",
      type: "presse",
      reliability: "B",
      date: "2024",
      url: "https://www.navalnews.com/naval-news/2024/12/germany-formally-approves-type-f127-air-defense-frigate-program/",
    },
    {
      id: "nn-f127-shape",
      title: "German F127 AAW Frigate Takes Shape",
      publisher: "Naval News",
      type: "presse",
      reliability: "B",
      date: "2024",
      url: "https://www.navalnews.com/naval-news/2024/07/german-f127-aaw-frigate-takes-shape/",
    },
    {
      id: "gs-f127",
      title: "Type 127 Next Generation Frigate",
      publisher: "GlobalSecurity.org",
      type: "think-tank",
      reliability: "C",
      url: "https://www.globalsecurity.org/military/world/europe/type-127.htm",
    },
  ],
  sourceIds: { primary: "nn-f127-approval", combat: "nn-f127-shape", industrial: "gs-f127", export: "nn-f127-approval" },
  scores: {
    "efficacite-cout": ["C", "Capacité BMD potentiellement majeure, mais coût et définition encore amont."],
    survivabilite: ["B", "Ambition antiaérienne/antimissile de premier plan, à confirmer par les choix radar/CMS."],
    exportabilite: ["D", "Programme national ; pas de logique export à ce stade."],
    "risque-industriel": ["D", "Choix industriel, radar et CMS ouverts : risque de calendrier élevé."],
    maturite: ["E", "Programme amont — aucune coque, design non figé."],
    "confiance-donnees": ["C", "Intentions publiques claires ; spécifications fines non figées."],
  },
});

export const type076 = makeNavalSystem({
  slug: "type-076",
  name: "Type 076 (Sichuan)",
  designation: "Type 076 · porte-hélicoptères d'assaut chinois à catapulte",
  reference: "PNP-NS-037",
  navalVesselClass: "amphibie",
  classLabel: "LHD à EMALS / porteur de drones",
  country: "Chine",
  flag: "🇨🇳",
  manufacturer: "CSSC — Hudong-Zhonghua (Shanghai)",
  status: "Tête de série Sichuan lancée (déc. 2024) ; essais à la mer entamés (fin 2025)",
  acquisitionModes: ["production-nationale"],
  updated: "2026-06-03",
  tagline:
    "Le Type 076 brouille la frontière entre amphibie et porte-avions léger : un LHD de ≈ 40 000 t doté d'une catapulte électromagnétique (EMALS) pour des drones de combat.",
  summary:
    "Le Type 076 (Sichuan) est une rupture : premier bâtiment amphibie au monde doté d'une catapulte électromagnétique (EMALS), double îlot, radier, ≈ 252–260 m et ≈ 40 000 t. Il est pensé comme un « porteur de drones » (UCAV GJ-11/GJ-21) autant que comme un amphibie.\n\nPour Panoplie, c'est un objet à régime de confiance abaissé : lancé fin 2024, en essais fin 2025, ses capacités réelles restent largement inférées de l'imagerie et de la presse spécialisée.",
  profile: {
    platform: {
      missions: ["amphibie", "projection", "presence", "strike"],
      displacement: "≈ 40 000 t pleine charge (estimation, jusqu'à ~50 000 t selon sources)",
      crew: "Estimation non consolidée",
      aviation: ["UCAV GJ-11 / GJ-21 (revendiqué)", "hélicoptères", "radier pour chalands"],
      notes: "Double îlot, EMALS + brins d'arrêt — premier amphibie au monde à catapulte.",
    },
    combatSystem: {
      family: "autre",
      cms: "Système de combat naval chinois (non documenté en source primaire)",
      ballisticMissileDefense: false,
      interoperabilityNotes: "Concept drone-centré : frappe et ISR par voilure fixe sans pilote.",
    },
    sensors: {
      radarPrimary: "Radar à panneaux fixes (estimation)",
    },
    effectors: {
      ciws: ["HHQ-10", "Type 1130"],
      aviationWeapons: ["Drones de combat embarqués (revendiqué)"],
    },
    propulsion: {
      architecture: "autre",
      notes: "Propulsion conventionnelle (estimation) ; EMALS alimentée par système électrique intégré.",
    },
    industrial: {
      primeContractor: "China State Shipbuilding Corporation (CSSC)",
      shipyards: ["Shanghai (Hudong-Zhonghua)"],
      localContentNotes: "Chaîne nationale ; opacité sur les fournisseurs critiques.",
    },
    export: {
      regimeSummary: "Non exporté ; capacité souveraine.",
      itarExposure: "aucune",
    },
    sustainment: {
      industrialRiskNotes: "Mise au point EMALS sur plateforme amphibie inédite ; capacité opérationnelle à confirmer.",
    },
  },
  keySpecs: [
    { label: "Déplacement", value: "≈ 40 000 t (estimation)", confidence: "faible", status: "a-recouper", sources: ["ar-076"] },
    { label: "Rupture", value: "EMALS sur un amphibie — une première mondiale", confidence: "moyenne", status: "a-recouper", sources: ["ar-076"] },
    { label: "Aviation", value: "Drones de combat GJ-11 / GJ-21 (revendiqué)", confidence: "faible", status: "a-recouper", sources: ["at-076"] },
    { label: "Lancement", value: "Décembre 2024 ; essais fin 2025", confidence: "moyenne", status: "a-recouper", sources: ["ar-076"] },
    { label: "Constructeur", value: "CSSC · Hudong-Zhonghua", confidence: "moyenne", sources: ["ar-076"] },
  ],
  costNarrative:
    "Coût non publié ; la valeur tient au pari drone-centré (EMALS + UCAV), à lire par analogie et avec prudence.",
  financeNarrative:
    "Financement d'État opaque ; programme de rupture inscrit dans l'accélération de la PLAN.",
  supplyNarrative:
    "Chaîne nationale CSSC ; sous-systèmes et EMALS peu documentés en sources ouvertes.",
  geopoliticsNarrative:
    "Le Type 076 préfigure une projection chinoise par drones embarqués — un changement potentiel de l'équilibre amphibie/aéronaval en Indo-Pacifique.",
  exportNarrative:
    "Non exporté ; comparaison utile sur la fonction (amphibie + drones), pas sur un marché.",
  editorial: {
    mythVsReality:
      "Le mythe : un porte-avions de drones opérationnel. La réalité : une rupture réelle mais en essais, aux capacités encore inférées.",
    bestUseCase: "Projection amphibie et mise en œuvre de drones de combat embarqués (concept).",
    weakPoint: "Maturité EMALS/drones non démontrée ; données opaques.",
    analystNote:
      "À comparer au Type 075 et au Mistral : même fonction amphibie, mais le 076 ajoute une dimension drone-centrée à confiance abaissée.",
  },
  operators: ["Chine — PLA Navy (essais)"],
  theatres: ["Mer de Chine méridionale", "Pacifique Ouest"],
  timeline: [
    { date: "2024", label: "Lancement de la tête de série Sichuan.", kind: "jalon" },
    { date: "2025", label: "Premiers essais à la mer rapportés par sources ouvertes.", kind: "jalon" },
  ],
  sources: [
    {
      id: "ar-076",
      title: "Chinese Type 076 Sichuan Amphibious Assault Ship Conducts First Sea Trial",
      publisher: "Army Recognition",
      type: "presse",
      reliability: "C",
      date: "2025",
      url: "https://www.armyrecognition.com/news/navy-news/2025/chinese-type-076-sichuan-amphibious-assault-ship-and-future-drone-carrier-conducts-first-sea-trial",
    },
    {
      id: "at-076",
      title: "China's Type 076 blurs line between carrier and assault ship",
      publisher: "Asia Times",
      type: "presse",
      reliability: "C",
      date: "2025",
      url: "https://asiatimes.com/2025/10/chinas-type-076-blurs-line-between-carrier-and-assault-ship/",
    },
  ],
  sourceIds: { primary: "ar-076", combat: "at-076", industrial: "ar-076", export: "ar-076" },
  scores: {
    "efficacite-cout": ["C", "Concept potentiellement disruptif ; coût opaque et capacité non démontrée."],
    survivabilite: ["C", "Grande plateforme dépendante de l'escorte ; données de protection inconnues."],
    exportabilite: ["E", "Non exporté."],
    "risque-industriel": ["C", "Industrie rapide, mais EMALS amphibie et intégration drones inédites."],
    maturite: ["D", "Tête de série en essais ; capacité opérationnelle non atteinte."],
    "confiance-donnees": ["D", "Données surtout indirectes (imagerie, presse) ; à trianguler."],
  },
});

export const kddx = makeNavalSystem({
  slug: "kddx",
  name: "KDDX",
  designation: "KDDX · destroyer coréen de nouvelle génération",
  reference: "PNP-NS-038",
  navalVesselClass: "destroyer",
  classLabel: "Destroyer furtif tout-électrique (programme)",
  country: "Corée du Sud",
  flag: "🇰🇷",
  manufacturer: "HD Hyundai Heavy Industries / Hanwha (à attribuer) · Hanwha Systems",
  status: "Design de base achevé (2023) ; appel d'offres ouvert, contrat visé 2026",
  acquisitionModes: ["production-nationale"],
  updated: "2026-06-03",
  tagline:
    "Le KDDX est le premier destroyer 100 % coréen — coque, propulsion électrique intégrée, mât intégré bi-bande et système de combat indigènes.",
  summary:
    "Le KDDX est le saut souverain de la marine coréenne : ≈ 8 000 t, ≈ 155 m, coque furtive, propulsion tout-électrique (IEP, moteur 25 MW), mât intégré (I-MAST) à radar multifonction bi-bande S/X de Hanwha Systems, et système de combat indigène (Hanwha Systems + ADD).\n\nPour Panoplie, c'est le cas d'une montée en souveraineté complète : à la différence des KDX-III sous Aegis, le KDDX vise une indépendance du capteur au CMS, avec KVLS-I/II et missiles nationaux (K-SAAM, L-SAM, SSM-II).",
  profile: {
    platform: {
      missions: ["AAW", "ASuW", "ASW", "strike", "presence"],
      displacement: "≈ 8 000 t (≈ 7 100 t à lège)",
      crew: "Équipage réduit (automatisation)",
      aviation: ["Hélicoptère ASM"],
      notes: "Coque furtive, mât intégré ; premier destroyer coréen entièrement national.",
    },
    combatSystem: {
      family: "autre",
      cms: "Système de combat indigène (Hanwha Systems + ADD)",
      tacticalLinks: ["Liaisons coréennes / OTAN"],
      ballisticMissileDefense: false,
      interoperabilityNotes: "Souveraineté complète capteur → CMS, distincte de l'écosystème Aegis du KDX-III.",
    },
    sensors: {
      radarPrimary: "Radar multifonction bi-bande S/X sur mât intégré (Hanwha Systems)",
      hullSonar: "Sonar intégré",
    },
    effectors: {
      vlsType: "KVLS-I + KVLS-II (national)",
      sam: ["K-SAAM", "L-SAM / SAM-II (en développement)"],
      antiShipMissiles: ["C-Star (SSM)"],
      navalGuns: ["Mk 45 5 pouces"],
      ciws: ["CIWS-II"],
    },
    propulsion: {
      architecture: "IEP",
      primeMovers: ["2 turbines à gaz + 3 diesels générateurs", "moteur électrique 25 MW"],
      notes: "Première propulsion entièrement électrique d'un combattant coréen.",
    },
    industrial: {
      primeContractor: "HD Hyundai Heavy Industries / Hanwha Ocean (attribution en cours)",
      shipyards: ["Corée du Sud"],
      suppliers: [
        { subsystem: "Radar / CMS", supplier: "Hanwha Systems", country: "Corée du Sud" },
        { subsystem: "Missiles", supplier: "LIG Nex1 / ADD", country: "Corée du Sud" },
      ],
      localContentNotes: "Contenu national maximal — argument de souveraineté et d'export.",
    },
    export: {
      regimeSummary: "Conçu national, mais forte ambition export coréenne (contenu souverain, peu d'exposition ITAR).",
      itarExposure: "aucune",
      politicalConstraints: "Composants nationaux — flexibilité export supérieure aux navires sous Aegis.",
    },
    sustainment: {
      industrialRiskNotes: "Programme au stade contractuel ; concurrence HD Hyundai / Hanwha Ocean.",
    },
  },
  keySpecs: [
    { label: "Déplacement", value: "≈ 8 000 t", confidence: "moyenne", sources: ["nn-kddx-design"] },
    { label: "Propulsion", value: "IEP tout-électrique (moteur 25 MW)", confidence: "moyenne", sources: ["nn-kddx-design"] },
    { label: "Capteur", value: "Radar bi-bande S/X sur mât intégré", confidence: "moyenne", sources: ["nn-kddx-design"] },
    { label: "Système de combat", value: "Indigène (Hanwha Systems + ADD)", confidence: "haute", sources: ["nn-kddx-design"] },
    { label: "Statut", value: "Appel d'offres ouvert, contrat visé 2026", confidence: "moyenne", status: "a-recouper", sources: ["nn-kddx-tender"] },
  ],
  costNarrative:
    "Le coût KDDX intègre un capteur et un CMS souverains, une propulsion électrique et des missiles nationaux : ambitieux, mais maîtrisé en contenu local.",
  financeNarrative:
    "Programme national stratégique, aussi pensé comme vitrine export de la BITD coréenne.",
  supplyNarrative:
    "Chaîne quasi entièrement coréenne (Hanwha Systems, LIG Nex1, ADD) — faible exposition étrangère, fort argument export.",
  geopoliticsNarrative:
    "Le KDDX scelle l'autonomie navale coréenne et renforce une offre export crédible face aux frégates européennes et aux destroyers Aegis.",
  exportNarrative:
    "Sa souveraineté de bout en bout (capteur, CMS, missiles) en fait un candidat export plus flexible que les navires dépendant d'Aegis.",
  editorial: {
    mythVsReality:
      "Le mythe : un KDX-III bis. La réalité : une rupture de souveraineté — capteur, propulsion et CMS nationaux.",
    bestUseCase: "Défense aérienne et escorte souveraines, démonstration de la BITD coréenne, base d'offre export.",
    weakPoint: "Programme au stade contractuel ; maturité du CMS et du radar indigènes à prouver.",
    analystNote:
      "À comparer au KDX-III Batch II (sous Aegis) : le KDDX troque l'écosystème américain contre une souveraineté complète, plus exportable.",
  },
  operators: ["Corée du Sud — ROK Navy (programme)"],
  theatres: ["Mer Jaune", "Mer du Japon", "Indo-Pacifique"],
  timeline: [
    { date: "2023", label: "Achèvement du design de base par HD Hyundai.", kind: "jalon" },
    { date: "2026", label: "Ouverture de l'appel d'offres, contrat visé.", kind: "jalon" },
  ],
  sources: [
    {
      id: "nn-kddx-design",
      title: "HHI completes basic design of the Korean Next Gen Destroyer KDDX",
      publisher: "Naval News",
      type: "presse",
      reliability: "B",
      date: "2024",
      url: "https://www.navalnews.com/naval-news/2024/01/hhi-completes-basic-design-of-the-korean-next-gen-destroyer-kddx/",
    },
    {
      id: "nn-kddx-tender",
      title: "South Korea opens KDDX destroyer tender, eyes July contract",
      publisher: "Naval News",
      type: "presse",
      reliability: "B",
      date: "2026",
      url: "https://www.navalnews.com/naval-news/2026/03/south-korea-opens-kddx-destroyer-tender-eyes-july-contract/",
    },
  ],
  sourceIds: { primary: "nn-kddx-design", combat: "nn-kddx-design", industrial: "nn-kddx-tender", export: "nn-kddx-design" },
  scores: {
    "efficacite-cout": ["B", "Forte valeur souveraine ; coût ambitieux mais contenu national maximal."],
    survivabilite: ["B", "Furtivité, mât intégré et défense multicouche prévus ; à confirmer en service."],
    exportabilite: ["B", "Souveraineté de bout en bout : candidat export flexible, sans verrou Aegis."],
    "risque-industriel": ["C", "Stade contractuel ; maturité CMS/radar indigènes et arbitrage industriel à venir."],
    maturite: ["D", "Design de base achevé ; aucune coque en construction."],
    "confiance-donnees": ["C", "Spécifications publiques nombreuses ; configuration finale à recouper."],
  },
});

export const constellationFfg62 = makeNavalSystem({
  slug: "constellation-ffg62",
  name: "Constellation (FFG-62)",
  designation: "FFG-62 · frégate américaine dérivée de la FREMM",
  reference: "PNP-NS-039",
  navalVesselClass: "fregate",
  classLabel: "Frégate dérivée FREMM (programme réduit)",
  country: "États-Unis",
  flag: "🇺🇸",
  manufacturer: "Fincantieri Marinette Marine · Lockheed Martin",
  status: "Programme en grande difficulté : design instable, 36 mois de retard, réduit fin 2025 (4 unités annulées)",
  acquisitionModes: ["production-nationale", "cooperatif"],
  updated: "2026-06-03",
  tagline:
    "La Constellation devait être une frégate FREMM « américanisée » à faible risque. Elle est devenue le cas d'école du risque programme : design jamais figé, surpoids, retards, série réduite.",
  summary:
    "La classe Constellation (FFG-62) part d'un design FREMM éprouvé pour réduire le risque — mais l'« américanisation » (normes US, Aegis dérivé) a déstabilisé le design : surpoids de ≈ 759 t (+13 %), conception non figée, première coque à ≈ 10 % d'avancement début 2025, et un programme réduit fin 2025 (quatre unités annulées).\n\nPour Panoplie, c'est le contre-exemple parfait : il montre qu'un design « sur étagère » ne garantit rien sans stabilité de conception, et illustre la valeur d'une lecture industrielle et de programme.",
  profile: {
    platform: {
      missions: ["AAW", "ASW", "ASuW", "presence"],
      displacement: "≈ 7 400 t initial → proche de 8 000 t après surpoids",
      crew: "≈ 200 marins",
      aviation: ["MH-60R", "MQ-8C Fire Scout"],
      notes: "Dérivée de la FREMM franco-italienne, fortement modifiée aux normes américaines.",
    },
    combatSystem: {
      family: "Aegis",
      cms: "Aegis dérivé (COMBATSS-21 / Aegis baseline frégate)",
      tacticalLinks: ["Link 16", "CEC"],
      ballisticMissileDefense: false,
      interoperabilityNotes: "Brique Aegis allégée pour escorte distribuée.",
    },
    sensors: {
      radarPrimary: "AN/SPY-6(V)3 EASR",
      esm: ["Suite EW américaine"],
    },
    effectors: {
      vlsType: "Mk 41",
      vlsCells: "32 cellules",
      sam: ["SM-2", "ESSM"],
      antiShipMissiles: ["NSM"],
      navalGuns: ["57 mm"],
      ciws: ["RAM"],
    },
    propulsion: {
      architecture: "CODLAG",
      notes: "Architecture CODLAG héritée de la FREMM, adaptée.",
    },
    industrial: {
      primeContractor: "Fincantieri Marinette Marine",
      shipyards: ["Marinette (Wisconsin)"],
      suppliers: [
        { subsystem: "Radar / CMS", supplier: "Lockheed Martin / RTX", country: "États-Unis" },
      ],
      transferOfTechnology: "Design FREMM européen transféré puis fortement modifié aux normes US — source d'instabilité.",
    },
    export: {
      regimeSummary: "Capacité nationale américaine ; non exportée.",
      itarExposure: "elevee",
    },
    sustainment: {
      industrialRiskNotes: "Surpoids (+13 %), design non figé, manque de main-d'œuvre, retards : cas GAO/CRS de référence sur l'instabilité de conception ; programme réduit fin 2025.",
    },
  },
  keySpecs: [
    { label: "Origine", value: "Design FREMM « américanisé »", confidence: "haute", sources: ["crs-ffg62"] },
    { label: "Surpoids", value: "≈ +759 t (+13 %) vs estimation initiale", confidence: "moyenne", status: "a-recouper", sources: ["gao-ffg62"] },
    { label: "Retard", value: "≈ 36 mois ; 1re coque ~10 % début 2025", confidence: "moyenne", sources: ["gao-ffg62"] },
    { label: "Radar", value: "AN/SPY-6(V)3 EASR", confidence: "moyenne", sources: ["crs-ffg62"] },
    { label: "Programme", value: "Réduit fin 2025 (4 unités annulées)", confidence: "moyenne", status: "a-recouper", sources: ["crs-ffg62"] },
  ],
  costNarrative:
    "Le coût Constellation a dérivé avec le design : l'américanisation d'une FREMM a effacé le bénéfice « sur étagère » attendu.",
  financeNarrative:
    "Programme national américain dont la réduction fin 2025 traduit l'échec de stabilisation du design et du calendrier.",
  supplyNarrative:
    "Marinette Marine (Fincantieri) + Lockheed Martin/RTX : transfert d'un design européen puis modifications profondes — racine documentée de l'instabilité.",
  geopoliticsNarrative:
    "La Constellation devait densifier la flotte de surface américaine ; sa réduction pèse sur le format de la flotte distribuée.",
  exportNarrative:
    "Non exportée ; sa leçon export est négative — un design éprouvé ne réduit le risque que si la conception reste stable.",
  editorial: {
    mythVsReality:
      "Le mythe : reprendre une FREMM = faible risque. La réalité : l'américanisation a déstabilisé le design et fait dériver le programme.",
    bestUseCase: "Escorte distribuée — si tant est que les coques restantes soient livrées.",
    weakPoint: "Instabilité de conception, surpoids, retards, série réduite.",
    analystNote:
      "Le meilleur cas Panoplie de risque programme : à opposer à la FREMM/FDI européennes pour montrer ce que coûte une conception non figée.",
  },
  operators: ["États-Unis — US Navy (programme réduit)"],
  theatres: ["Atlantique", "Pacifique"],
  timeline: [
    { date: "2020", label: "Attribution du contrat FFG-62 à Fincantieri Marinette Marine.", kind: "jalon" },
    { date: "2024", label: "Retard estimé porté à 36 mois ; surpoids documenté par le GAO.", kind: "debat" },
    { date: "2025", label: "Programme réduit ; quatre unités annulées.", kind: "debat" },
  ],
  sources: [
    {
      id: "crs-ffg62",
      title: "Navy Constellation (FFG-62) Class Frigate Program: Background and Issues for Congress",
      publisher: "Congressional Research Service",
      type: "institution",
      reliability: "A",
      url: "https://www.congress.gov/crs-product/R44972",
    },
    {
      id: "gao-ffg62",
      title: "Navy Frigate: Unstable Design Has Stalled Construction and Compromised Delivery Schedules",
      publisher: "U.S. Government Accountability Office",
      type: "institution",
      reliability: "A",
      date: "2024",
      url: "https://www.gao.gov/products/gao-24-106546",
    },
  ],
  sourceIds: { primary: "crs-ffg62", combat: "crs-ffg62", industrial: "gao-ffg62", export: "crs-ffg62" },
  scores: {
    "efficacite-cout": ["D", "Bénéfice « sur étagère » effacé par la dérive de conception, coût et calendrier."],
    survivabilite: ["B", "Architecture SPY-6/Aegis/Mk 41 crédible — si les coques sont livrées."],
    exportabilite: ["E", "Non exportée."],
    "risque-industriel": ["E", "Cas GAO d'instabilité de conception ; programme réduit fin 2025."],
    maturite: ["D", "Première coque très peu avancée ; design non figé."],
    "confiance-donnees": ["B", "Très bien documenté par CRS et GAO — la transparence est ici une force."],
  },
});

export const fremmEvo = makeNavalSystem({
  slug: "fremm-evo",
  name: "FREMM EVO",
  designation: "FREMM Evoluzione · frégate italienne de nouvelle génération",
  reference: "PNP-NS-040",
  navalVesselClass: "fregate",
  classLabel: "FREMM évoluée (SADOC 4, BMD)",
  country: "Italie",
  flag: "🇮🇹",
  manufacturer: "Fincantieri · Leonardo · OCCAR",
  status: "En construction (tête de série Alpino F594, quille posée 2025) ; livraisons 2029–2030",
  acquisitionModes: ["cooperatif", "production-nationale"],
  updated: "2026-06-03",
  tagline:
    "La FREMM EVO pousse la FREMM italienne vers la défense antimissile : système de combat SADOC 4, radar Kronos bi-bande à faces fixes et baies de mission modulaires.",
  summary:
    "La FREMM EVO (Evoluzione) est l'évolution de la FREMM italienne : ≈ 6 700 t, système de combat cyber-résilient SADOC 4, radar Kronos Dual Band à faces fixes (capacité antimissile balistique de théâtre), Aster 30 et SM-2 Block IIIC, baies de mission modulaires et équipage réduit. Trois unités (contrat 2024, ≈ 3,2 Md€), revue critique de conception passée fin 2025, livraisons 2029–2030.\n\nPour Panoplie, c'est le contrepoint positif de la Constellation : une évolution maîtrisée d'un design éprouvé, calendrier tenu, montée vers la BMD.",
  profile: {
    platform: {
      missions: ["AAW", "ASW", "ASuW", "BMD", "presence"],
      displacement: "≈ 6 700 t",
      crew: "Équipage réduit (automatisation accrue)",
      aviation: ["EH101 / NH90", "baies de mission modulaires (drones, munitions rôdeuses)"],
      notes: "Évolution maîtrisée de la FREMM IT vers la défense antimissile et la modularité.",
    },
    combatSystem: {
      family: "SAAM-ESD",
      cms: "SADOC 4 (cyber-résilient)",
      tacticalLinks: ["Link 16", "réseaux OTAN"],
      ballisticMissileDefense: true,
      interoperabilityNotes: "Capacité antimissile balistique de théâtre via radar à faces fixes.",
    },
    sensors: {
      radarPrimary: "Leonardo Kronos Dual Band (X-C, faces fixes)",
      hullSonar: "Sonar de coque",
      towedSonar: "CAPTAS-4 selon configuration",
    },
    effectors: {
      vlsType: "Sylver A50",
      sam: ["Aster 30", "SM-2 Block IIIC"],
      antiShipMissiles: ["Teseo Mk2/E"],
      navalGuns: ["127/64 Vulcano"],
    },
    propulsion: {
      architecture: "CODLAG",
      notes: "CODLAG hérité de la FREMM, discrétion ASM.",
    },
    industrial: {
      primeContractor: "Fincantieri / Leonardo (OCCAR)",
      shipyards: ["Riva Trigoso", "Muggiano"],
      suppliers: [
        { subsystem: "Radar / CMS", supplier: "Leonardo", country: "Italie" },
        { subsystem: "Missiles", supplier: "MBDA / RTX", country: "Europe / États-Unis" },
      ],
    },
    export: {
      regimeSummary: "Famille FREMM exportable ; EVO renforce l'attractivité (BMD, SADOC 4).",
      itarExposure: "partielle",
      politicalConstraints: "SM-2 sous contrôle américain ; reste largement européen.",
    },
    sustainment: {
      programCost: "≈ 3,2 Md€ pour 3 unités (contrat 2024)",
      sustainmentNotes: "Conception pour 30 ans, baies modulaires pour charges futures.",
    },
  },
  keySpecs: [
    { label: "Déplacement", value: "≈ 6 700 t", confidence: "moyenne", sources: ["fincantieri-evo"] },
    { label: "Système de combat", value: "SADOC 4 (cyber-résilient)", confidence: "moyenne", sources: ["ar-evo"] },
    { label: "Radar", value: "Kronos Dual Band faces fixes (BMD de théâtre)", confidence: "moyenne", sources: ["ar-evo"] },
    { label: "Missiles", value: "Aster 30 · SM-2 Block IIIC", confidence: "moyenne", sources: ["ar-evo"] },
    { label: "Programme", value: "3 unités, ≈ 3,2 Md€ ; livraisons 2029–2030", confidence: "moyenne", status: "a-recouper", sources: ["fincantieri-evo"] },
  ],
  costNarrative:
    "Le coût EVO finance une montée vers la BMD (radar à faces fixes, SADOC 4, SM-2) sur une base FREMM amortie : évolution plutôt que rupture.",
  financeNarrative:
    "Contrat de ≈ 3,2 Md€ pour trois unités (2024), via OCCAR — continuité industrielle italienne.",
  supplyNarrative:
    "Fincantieri + Leonardo + MBDA : chaîne européenne dense, exposition américaine limitée au SM-2.",
  geopoliticsNarrative:
    "La FREMM EVO renforce la défense antimissile navale italienne et l'autonomie européenne, tout en restant interopérable OTAN.",
  exportNarrative:
    "EVO consolide l'attractivité export de la famille FREMM : BMD, CMS cyber-résilient et modularité.",
  editorial: {
    mythVsReality:
      "Le mythe : une simple FREMM rafraîchie. La réalité : une montée vers la défense antimissile (radar faces fixes, SADOC 4).",
    bestUseCase: "Escorte ASM/AAW avec contribution antimissile de théâtre, présence méditerranéenne et OTAN.",
    weakPoint: "Programme en construction ; performances BMD à confirmer en service.",
    analystNote:
      "Contrepoint positif de la Constellation : une évolution maîtrisée d'un design éprouvé, calendrier tenu après revue critique de conception.",
  },
  operators: ["Italie — Marina Militare (programme)"],
  theatres: ["Méditerranée", "Atlantique", "OTAN"],
  timeline: [
    { date: "2024", label: "Contrat de trois FREMM EVO (≈ 3,2 Md€) signé.", kind: "jalon" },
    { date: "2025", label: "Pose de quille de la tête de série Alpino (F594).", kind: "jalon" },
  ],
  sources: [
    {
      id: "fincantieri-evo",
      title: "Fincantieri: works start on the first « Fremm Evo » unit for the Italian Navy",
      publisher: "Fincantieri",
      type: "constructeur",
      reliability: "B",
      date: "2025",
      url: "https://www.fincantieri.com/en/newsroom/press-releases/2025/fincantieri-works-start-on-the-first-fremm-evo-unit-for-the-italian-navy",
    },
    {
      id: "ar-evo",
      title: "Italy starts construction of first FREMM EVO frigate",
      publisher: "Army Recognition",
      type: "presse",
      reliability: "C",
      date: "2025",
      url: "https://www.armyrecognition.com/news/navy-news/2025/italy-starts-construction-of-first-fremm-evo-frigate-to-counter-maritime-threats-expected-until-the-2030s",
    },
  ],
  sourceIds: { primary: "fincantieri-evo", combat: "ar-evo", industrial: "fincantieri-evo", export: "ar-evo" },
  scores: {
    "efficacite-cout": ["B", "Montée capacitaire (BMD, SADOC 4) sur une base FREMM amortie — bon rapport évolution/coût."],
    survivabilite: ["B", "Radar à faces fixes, Aster/SM-2 et CMS cyber-résilient ; à confirmer en service."],
    exportabilite: ["B", "Renforce l'attractivité export de la famille FREMM."],
    "risque-industriel": ["B", "Base Fincantieri/Leonardo solide ; revue critique de conception franchie."],
    maturite: ["C", "En construction ; tête de série pas encore livrée."],
    "confiance-donnees": ["B", "Sources industrielles et institutionnelles ; détails fins à recouper."],
  },
});
