import { makeNavalSystem } from "./naval-multinational";

// Pack naval Japon — densité technologique d'escorte : destroyer Aegis/BMD,
// porte-aéronefs converti F-35B et sous-marin lithium-ion. Plateformes
// officiellement prudentes mais architecture de groupe naval très avancée.

export const mayaClass = makeNavalSystem({
  slug: "maya-class",
  name: "Maya",
  designation: "27DDG · destroyer Aegis japonais",
  reference: "PNP-NS-027",
  navalVesselClass: "destroyer",
  classLabel: "Destroyer Aegis BMD",
  country: "Japon",
  flag: "🇯🇵",
  manufacturer: "Japan Marine United · Mitsubishi Heavy Industries · Lockheed Martin",
  introduced: "2020",
  status: "En service (2 unités : Maya, Haguro)",
  acquisitionModes: ["FMS", "production-nationale"],
  updated: "2026-06-03",
  tagline:
    "Le Maya est le destroyer Aegis japonais le plus avancé : Baseline 9C, BMD et premier porteur japonais de la liaison CEC pour la défense antimissile coopérative.",
  summary:
    "La classe Maya (27DDG) prolonge les Atago avec un déplacement porté à ≈ 8 200 t et l'Aegis Baseline 9C (désigné J7 au Japon), capable de défense antimissile balistique dès l'admission au service. Elle est la première unité japonaise dotée de la liaison CEC (Cooperative Engagement Capability).\n\nPour Panoplie, c'est la référence Aegis asiatique à comparer aux KDX-III Batch II coréens, aux Arleigh Burke et aux F110 : densité radar/VLS, BMD et intégration réseau au cœur de la valeur.",
  profile: {
    platform: {
      missions: ["AAW", "BMD", "ASW", "ASuW", "strike"],
      displacement: "≈ 8 200 t standard (≈ 10 250 t pleine charge)",
      crew: "≈ 300 marins",
      aviation: ["SH-60K"],
      notes: "Destroyer de défense aérienne et antimissile, nœud Aegis/CEC de la flotte japonaise.",
    },
    combatSystem: {
      family: "Aegis",
      cms: "Aegis Weapon System Baseline 9C (J7)",
      baseline: "Aegis BMD 5.1",
      tacticalLinks: ["Link 16", "CEC (Cooperative Engagement Capability)"],
      ballisticMissileDefense: true,
      interoperabilityNotes: "Premier destroyer japonais avec CEC : engagement coopératif avec l'US Navy et les autres unités Aegis.",
    },
    sensors: {
      radarPrimary: "AN/SPY-1D(V)",
      hullSonar: "Sonar intégré + sonar remorqué",
      esm: ["Suite de guerre électronique japonaise"],
    },
    effectors: {
      vlsType: "Mk 41",
      vlsCells: "96 cellules",
      sam: ["SM-3 Block IIA", "SM-6", "SM-2", "ESSM"],
      antiShipMissiles: ["Type 17 SSM", "Harpoon"],
      antiSubWeapons: ["VL-ASROC", "torpilles Type 12"],
      navalGuns: ["Mk 45 5 pouces"],
      ciws: ["Phalanx", "SeaRAM"],
    },
    propulsion: {
      architecture: "autre",
      primeMovers: ["COGLAG — turbines à gaz + propulsion électrique"],
      maxSpeed: "≈ 30 kt",
      notes: "COGLAG : transit économique électrique et pointe turbine.",
    },
    industrial: {
      primeContractor: "Japan Marine United",
      shipyards: ["Yokohama"],
      suppliers: [
        { subsystem: "Système de combat", supplier: "Lockheed Martin (Aegis)", country: "États-Unis" },
        { subsystem: "Missiles", supplier: "RTX / Mitsubishi", country: "États-Unis / Japon" },
      ],
    },
    export: {
      regimeSummary: "Capacité nationale non exportée ; brique Aegis sous contrôle américain.",
      itarExposure: "elevee",
      politicalConstraints: "Aegis, SM-3/SM-6 et CEC relèvent de contrôles américains forts.",
    },
    sustainment: {
      sustainmentNotes: "Soutien Aegis, missiles Standard et modernisations logicielles ; flotte d'escorte japonaise nombreuse.",
    },
  },
  keySpecs: [
    { label: "Déplacement", value: "≈ 8 200 t standard", confidence: "haute", sources: ["nt-maya"] },
    { label: "Système de combat", value: "Aegis Baseline 9C (J7), BMD 5.1", confidence: "haute", sources: ["nt-maya"] },
    { label: "Réseau", value: "CEC — premier destroyer japonais équipé", confidence: "haute", sources: ["nt-maya"] },
    { label: "VLS", value: "96 cellules Mk 41", confidence: "moyenne", sources: ["nt-maya"] },
    { label: "Intercepteurs", value: "SM-3 Block IIA · SM-6", confidence: "moyenne", sources: ["nt-maya"] },
    { label: "Unités", value: "2 (Maya, Haguro)", confidence: "haute", sources: ["sf-maya"] },
  ],
  costNarrative:
    "Le coût Maya se concentre dans le couple Aegis/SPY-1, les intercepteurs Standard et l'intégration CEC : un destroyer de défense antimissile haut de gamme.",
  financeNarrative:
    "Le programme s'appuie sur une coopération Aegis avec les États-Unis (FMS) et une construction nationale japonaise.",
  supplyNarrative:
    "La chaîne mêle coque japonaise (JMU), Aegis Lockheed Martin et missiles Standard américains : forte exposition US sur le combat système.",
  geopoliticsNarrative:
    "Le Maya ancre la défense antimissile japonaise et l'engagement coopératif avec l'US Navy face aux menaces balistiques régionales.",
  exportNarrative:
    "Capacité non exportée ; l'enjeu est l'interopérabilité Aegis/CEC dans l'alliance plutôt qu'une offre commerciale.",
  editorial: {
    mythVsReality:
      "Le mythe : c'est un Atago amélioré. La réalité : le CEC en fait un nœud de défense antimissile en réseau, pas un simple destroyer.",
    bestUseCase: "Défense antimissile balistique, défense aérienne de zone et engagement coopératif au sein d'un groupe Aegis.",
    weakPoint: "Forte dépendance américaine (Aegis, Standard, CEC) et coût élevé d'un escorteur BMD.",
    analystNote:
      "Le Maya est le repère Aegis asiatique : à comparer aux KDX-III Batch II coréens et aux Arleigh Burke, en distinguant bien BMD et défense de zone.",
  },
  operators: ["Japon — JMSDF"],
  theatres: ["Mer du Japon", "Pacifique Ouest", "Indo-Pacifique"],
  timeline: [
    { date: "2020", label: "Admission au service du JS Maya.", kind: "jalon" },
    { date: "2021", label: "Admission au service du JS Haguro.", kind: "jalon" },
  ],
  sources: [
    {
      id: "nt-maya",
      title: "Maya-Class Guided Missile Destroyers, Japan",
      publisher: "Naval Technology",
      type: "presse",
      reliability: "B",
      url: "https://www.naval-technology.com/projects/maya-class-guided-missile-destroyers/",
    },
    {
      id: "sf-maya",
      title: "Maya class guided missile destroyer DDG JMSDF",
      publisher: "Seaforces Online",
      type: "presse",
      reliability: "C",
      url: "https://www.seaforces.org/marint/Japan-Maritime-Self-Defense-Force/Destroyer/Maya-class.htm",
    },
  ],
  sourceIds: { primary: "nt-maya", combat: "nt-maya", industrial: "nt-maya", export: "nt-maya" },
  scores: {
    "efficacite-cout": ["B", "Capacité BMD/AAW de premier plan, coût élevé mais cohérent avec une menace balistique régionale."],
    survivabilite: ["B", "Aegis Baseline 9C, CEC et défense multicouche solides ; exposition en environnement saturé."],
    exportabilite: ["E", "Capacité nationale non exportée."],
    "risque-industriel": ["B", "Construction japonaise mature, mais forte dépendance américaine sur le combat système."],
    maturite: ["A", "Classe en service, dérivée d'une lignée Aegis japonaise éprouvée."],
    "confiance-donnees": ["B", "Architecture et rôle bien documentés ; performances fines BMD sensibles."],
  },
});

export const izumoKaga = makeNavalSystem({
  slug: "izumo-kaga",
  name: "Izumo / Kaga",
  designation: "DDH-183 / DDH-184 · porte-aéronefs léger japonais",
  reference: "PNP-NS-028",
  navalVesselClass: "porte-avions",
  classLabel: "Porte-aéronefs léger STOVL (ex-DDH)",
  country: "Japon",
  flag: "🇯🇵",
  manufacturer: "Japan Marine United (IHI Marine United)",
  introduced: "2015",
  status: "En service ; conversion F-35B en cours (pennants CVM-183 / CVM-184)",
  acquisitionModes: ["production-nationale", "FMS"],
  updated: "2026-06-03",
  tagline:
    "L'Izumo et le Kaga, anciens « destroyers porte-hélicoptères », deviennent des porte-aéronefs F-35B : la lecture aéronavale japonaise, prudente puis assumée.",
  summary:
    "Conçus comme « destroyers porte-hélicoptères » (DDH) de ≈ 248 m et ≈ 19 500 t, l'Izumo et le Kaga sont convertis pour mettre en œuvre le F-35B : proue reprofilée, revêtement résistant à la chaleur, nouveaux pennants CVM-183/184. Les chasseurs seront servis par la force aérienne (JASDF).\n\nPour Panoplie, c'est un cas politique autant que technique : comment un pays passe d'une plateforme « officiellement défensive » à une capacité de projection aéronavale, à comparer à Charles de Gaulle, Queen Elizabeth et Fujian — mais à une autre échelle.",
  profile: {
    platform: {
      missions: ["projection", "presence", "ASW"],
      displacement: "≈ 19 500 t standard (≈ 27 000 t pleine charge)",
      crew: "≈ 470 marins + groupe aérien",
      aviation: ["F-35B (servis par la JASDF)", "SH-60K", "compatible V-22 Osprey"],
      notes: "Conversion STOVL : proue carrée et pont résistant à la chaleur ; pas de catapulte.",
    },
    combatSystem: {
      family: "autre",
      cms: "Système de combat japonais (OYQ)",
      tacticalLinks: ["Link 16", "réseaux JMSDF / OTAN"],
      ballisticMissileDefense: false,
      interoperabilityNotes: "Plateforme de projection légère interopérable avec l'US Navy et les alliés F-35.",
    },
    sensors: {
      radarPrimary: "OPS-50 (radar AESA)",
      esm: ["Suite de guerre électronique japonaise"],
    },
    effectors: {
      ciws: ["Phalanx", "SeaRAM"],
      aviationWeapons: ["F-35B embarqués (armement air-sol / air-air)"],
    },
    propulsion: {
      architecture: "autre",
      primeMovers: ["COGAG — 4 turbines à gaz GE LM2500"],
      maxSpeed: "≈ 30 kt",
    },
    industrial: {
      primeContractor: "Japan Marine United",
      shipyards: ["Yokohama"],
      suppliers: [
        { subsystem: "Aéronefs", supplier: "Lockheed Martin (F-35B)", country: "États-Unis" },
        { subsystem: "Plateforme", supplier: "Japan Marine United", country: "Japon" },
      ],
    },
    export: {
      regimeSummary: "Capacité nationale non exportée ; dépendance F-35B américaine.",
      itarExposure: "elevee",
      politicalConstraints: "F-35B et logistique associée sous contrôle américain ; usage encadré politiquement au Japon.",
    },
    sustainment: {
      programCost: "Conversion progressive en deux étapes par navire (proue, pont, soutien F-35B)",
      sustainmentNotes: "Disponibilité dépendante du soutien F-35B, du groupe aérien et de l'escorte.",
      industrialRiskNotes: "Conversion étalée : Izumo et Kaga indisponibles par phases jusqu'à la fin de décennie.",
    },
  },
  keySpecs: [
    { label: "Longueur", value: "≈ 248 m", confidence: "haute", sources: ["usni-kaga"] },
    { label: "Déplacement", value: "≈ 19 500 t standard", confidence: "haute", sources: ["usni-kaga"] },
    { label: "Aviation", value: "F-35B STOVL (servis par la JASDF)", confidence: "haute", sources: ["usni-kaga"] },
    { label: "Conversion", value: "Proue carrée + pont résistant à la chaleur", confidence: "moyenne", sources: ["usni-kaga"] },
    { label: "Désignation", value: "Repassés CVM-183 / CVM-184", confidence: "moyenne", status: "a-recouper", sources: ["nn-f35b"] },
    { label: "Unités", value: "2 (Izumo, Kaga)", confidence: "haute", sources: ["usni-kaga"] },
  ],
  costNarrative:
    "Le coût se lit comme une chaîne complète de projection : conversion des coques, F-35B, soutien, escorte et disponibilité — pas le seul navire.",
  financeNarrative:
    "Conversion financée par étapes ; le vrai coût est celui de reconstituer une aviation embarquée et son soutien.",
  supplyNarrative:
    "La chaîne combine coques japonaises (JMU) et dépendance forte au F-35B américain et à sa logistique.",
  geopoliticsNarrative:
    "L'Izumo/Kaga marque le retour assumé d'une projection aéronavale japonaise, signal politique majeur dans l'Indo-Pacifique.",
  exportNarrative:
    "Pas de produit export ; l'enjeu est doctrinal et politique, et l'interopérabilité F-35B avec les alliés.",
  editorial: {
    mythVsReality:
      "Le mythe : c'est un vrai porte-avions. La réalité : un porte-aéronefs léger STOVL, sans catapulte, dépendant du F-35B et de l'escorte.",
    bestUseCase: "Projection aéronavale légère, présence et opérations alliées F-35B dans l'Indo-Pacifique.",
    weakPoint: "Pas de catapulte, groupe aérien limité, conversion longue et dépendance au F-35B.",
    analystNote:
      "À comparer à Queen Elizabeth (STOVL) et Charles de Gaulle (CATOBAR), pas à Fujian ou Ford : même fonction, échelles différentes.",
  },
  operators: ["Japon — JMSDF (aéronefs servis par la JASDF)"],
  theatres: ["Pacifique Ouest", "Indo-Pacifique", "mer de Chine méridionale (déploiements)"],
  timeline: [
    { date: "2015", label: "Admission au service du JS Izumo comme DDH.", kind: "jalon" },
    { date: "2021", label: "Premiers appontages de F-35B américains sur l'Izumo.", kind: "emploi" },
    { date: "2024", label: "Première étape de conversion du Kaga achevée.", kind: "jalon" },
  ],
  sources: [
    {
      id: "usni-kaga",
      title: "F-35B Upgrades Near Completion Aboard Japanese Warship Kaga",
      publisher: "USNI News",
      type: "think-tank",
      reliability: "A",
      date: "2022",
      url: "https://news.usni.org/2022/12/29/f-35b-upgrades-near-completion-aboard-japanese-warship-kaga",
    },
    {
      id: "nn-f35b",
      title: "Japan's largest warship preparing for F-35B training with U.S. Marines",
      publisher: "USNI News",
      type: "think-tank",
      reliability: "A",
      date: "2026",
      url: "https://news.usni.org/2026/05/20/japans-largest-warship-preparing-for-f-35b-training-with-u-s-marines",
    },
  ],
  sourceIds: { primary: "usni-kaga", combat: "usni-kaga", industrial: "usni-kaga", export: "nn-f35b" },
  scores: {
    "efficacite-cout": ["C", "Projection réelle mais limitée pour un coût complet élevé (conversion + F-35B + escorte)."],
    survivabilite: ["C", "Dépendance à l'escorte et au groupe aérien ; autodéfense limitée (CIWS/SeaRAM)."],
    exportabilite: ["E", "Capacité nationale non exportée."],
    "risque-industriel": ["B", "Conversion maîtrisée par JMU, mais dépendance F-35B et indisponibilités par phases."],
    maturite: ["C", "Coques matures, mais capacité F-35B encore en montée en puissance."],
    "confiance-donnees": ["B", "Plateforme et conversion bien documentées ; doctrine d'emploi encore évolutive."],
  },
});

export const taigeiClass = makeNavalSystem({
  slug: "taigei-class",
  name: "Taigei",
  designation: "29SS · sous-marin lithium-ion japonais",
  reference: "PNP-NS-029",
  navalVesselClass: "sous-marin",
  classLabel: "Sous-marin d'attaque lithium-ion (SSK)",
  country: "Japon",
  flag: "🇯🇵",
  manufacturer: "Mitsubishi Heavy Industries · Kawasaki Heavy Industries",
  introduced: "2022",
  status: "En service ; production continue (plusieurs unités commissionnées)",
  acquisitionModes: ["production-nationale"],
  updated: "2026-06-03",
  tagline:
    "Le Taigei mise tout sur la batterie lithium-ion plutôt que l'AIP : plus d'endurance et de discrétion en plongée, et le torpilleur Type 18.",
  summary:
    "La classe Taigei (29SS) marque un choix technologique fort : remplacer l'AIP par de grandes batteries lithium-ion, qui offrent davantage d'endurance et de vitesse en plongée tout en simplifiant l'architecture. Elle emporte le torpilleur Type 18 et le Harpoon UGM-84L.\n\nPour Panoplie, c'est le comparateur asiatique le plus instructif face au Type 212CD (AIP) et au KSS-III (AIP + VLS) : trois paris technologiques différents sur la discrétion conventionnelle.",
  profile: {
    platform: {
      missions: ["ASW", "ASuW", "presence"],
      displacement: "≈ 3 000 t standard (≈ 4 300 t en plongée)",
      crew: "≈ 70 marins",
      endurance: "Endurance et vitesse en plongée accrues grâce aux batteries lithium-ion",
      notes: "Choix lithium-ion (sans AIP) pour la discrétion et la simplicité.",
    },
    combatSystem: {
      family: "autre",
      cms: "Système de combat sous-marin japonais (ZQQ / OYQ)",
      tacticalLinks: ["Liaisons sous-marines nationales"],
      ballisticMissileDefense: false,
      interoperabilityNotes: "Nœud ASM discret de la flotte sous-marine japonaise.",
    },
    sensors: {
      hullSonar: "Suite sonar intégrée (proue, flancs)",
      towedSonar: "Antenne remorquée",
      esm: ["Mât optronique et ESM"],
    },
    effectors: {
      antiSubWeapons: ["Torpilles lourdes Type 18"],
      antiShipMissiles: ["UGM-84L Harpoon Block II"],
    },
    propulsion: {
      architecture: "diesel-electrique",
      primeMovers: ["Diesels + grandes batteries lithium-ion"],
      maxSpeed: "≈ 20 kt en plongée",
      notes: "Lithium-ion à la place de l'AIP : endurance et discrétion accrues.",
    },
    industrial: {
      primeContractor: "Mitsubishi Heavy Industries / Kawasaki Heavy Industries (alternance)",
      shipyards: ["Kobe"],
      suppliers: [
        { subsystem: "Batteries", supplier: "Filière lithium-ion japonaise (GS Yuasa)", country: "Japon" },
        { subsystem: "Torpilles", supplier: "Industrie japonaise (Type 18)", country: "Japon" },
      ],
    },
    export: {
      regimeSummary: "Non exporté à ce stade ; politique d'export d'armement japonaise restée prudente.",
      itarExposure: "aucune",
      politicalConstraints: "Cadre national japonais sur l'export d'armement encore restrictif.",
    },
    sustainment: {
      sustainmentNotes: "Cadence régulière MHI/KHI ; flotte sous-marine japonaise maintenue à haut niveau de disponibilité.",
    },
  },
  keySpecs: [
    { label: "Déplacement", value: "≈ 3 000 t standard", confidence: "moyenne", sources: ["usni-liion"] },
    { label: "Énergie", value: "Batteries lithium-ion (sans AIP)", confidence: "haute", sources: ["usni-liion"] },
    { label: "Vitesse", value: "≈ 20 kt en plongée", confidence: "moyenne", sources: ["usni-liion"] },
    { label: "Torpille", value: "Type 18", confidence: "moyenne", sources: ["nn-taigei"] },
    { label: "Anti-navire", value: "UGM-84L Harpoon Block II", confidence: "moyenne", sources: ["nn-taigei"] },
    { label: "Équipage", value: "≈ 70", confidence: "moyenne", status: "a-recouper", sources: ["nn-taigei"] },
  ],
  costNarrative:
    "Le coût Taigei tient au pari lithium-ion : batteries, discrétion, sonars et torpilles modernes. La cadence nationale amortit la série.",
  financeNarrative:
    "Programme purement national, financé en série régulière et alterné entre MHI et KHI.",
  supplyNarrative:
    "La chaîne est entièrement japonaise — coque, batteries lithium-ion (GS Yuasa), torpilles Type 18 — d'où une exposition ITAR nulle.",
  geopoliticsNarrative:
    "Le Taigei renforce la barrière sous-marine japonaise dans les détroits et le Pacifique Ouest face à la pression navale chinoise.",
  exportNarrative:
    "Non exporté à ce jour ; un assouplissement de la doctrine d'export japonaise pourrait en faire un concurrent du 212CD et du KSS-III.",
  editorial: {
    mythVsReality:
      "Le mythe : sans AIP, un SSK moderne est en retard. La réalité : les batteries lithium-ion offrent une autre voie vers l'endurance et la discrétion.",
    bestUseCase: "Surveillance ASM des détroits, embuscade et renseignement discret dans le Pacifique Ouest.",
    weakPoint: "Pas de VLS ni de frappe terrestre ; endurance moindre qu'un SSN ; performances fines non publiques.",
    analystNote:
      "Comparer Taigei (lithium-ion), 212CD (AIP) et KSS-III (AIP + VLS) : trois réponses technologiques distinctes au même besoin de discrétion conventionnelle.",
  },
  operators: ["Japon — JMSDF"],
  theatres: ["Mer du Japon", "détroits japonais", "Pacifique Ouest"],
  timeline: [
    { date: "2022", label: "Admission au service de la tête de série JS Taigei.", kind: "jalon" },
    { date: "2024", label: "Lancement de nouvelles unités de la classe.", kind: "jalon" },
  ],
  sources: [
    {
      id: "usni-liion",
      title: "Japan's Advanced Lithium-Ion Submarines",
      publisher: "U.S. Naval Institute Proceedings",
      type: "think-tank",
      reliability: "A",
      date: "2022",
      url: "https://www.usni.org/magazines/proceedings/2022/december/japans-advanced-lithium-ion-submarines",
    },
    {
      id: "nn-taigei",
      title: "Japan launches sixth Taigei-class submarine for JMSDF",
      publisher: "Naval News",
      type: "presse",
      reliability: "B",
      date: "2025",
      url: "https://www.navalnews.com/naval-news/2025/10/japan-launches-sixth-taigei-class-submarine-for-jmsdf/",
    },
  ],
  sourceIds: { primary: "usni-liion", combat: "usni-liion", industrial: "nn-taigei", export: "nn-taigei" },
  scores: {
    "efficacite-cout": ["B", "SSK très discret au coût conventionnel ; pari lithium-ion sans surcoût d'une filière nucléaire."],
    survivabilite: ["A", "Discrétion lithium-ion élevée ; performances acoustiques fines non publiques."],
    exportabilite: ["D", "Non exporté ; potentiel réel mais bridé par la doctrine d'export japonaise."],
    "risque-industriel": ["B", "Cadence MHI/KHI maîtrisée et filière batteries nationale."],
    maturite: ["B", "Classe en service et en production ; technologie lithium-ion encore récente."],
    "confiance-donnees": ["B", "Choix technologique et armement publics ; signatures acoustiques sensibles."],
  },
});
