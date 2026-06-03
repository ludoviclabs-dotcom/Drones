import type { DefenseSystem } from "../types";

// Domaine systèmes de combat & C2 — le logiciel qui relie capteurs et effecteurs.
// CMS navals (Aegis, TACTICOS, PAAMS, SETIS) et C2 IAMD terrestre (IBCS).

export const aegis: DefenseSystem = {
  slug: "aegis",
  name: "Aegis",
  designation: "Aegis Combat System · système de combat naval intégré",
  reference: "PNP-C2-001",
  category: "combat-system",
  combatSystemClass: "naval-cms",
  classLabel: "Système de combat naval Aegis (et BMD)",
  country: "États-Unis",
  flag: "🇺🇸",
  manufacturer: "Lockheed Martin",
  introduced: "1983",
  status:
    "En service — US Navy et six marines alliées (Japon, Espagne, Norvège, Corée du Sud, Australie) ; socle de la défense antimissile navale",
  acquisitionModes: ["FMS", "cooperatif"],
  tagline:
    "Le système de combat naval de référence mondiale : radar SPY, conduite de tir intégrée, Standard Missile et défense antimissile balistique — un écosystème autant qu'un logiciel.",
  summary:
    "Aegis est le cœur logiciel et capteur des grands escorteurs américains et de six marines alliées. Autour du radar à panneaux fixes SPY-1 (puis SPY-6), il fusionne pistes, priorise les menaces et conduit le tir des Standard Missile (SM-2/3/6) et ESSM, jusqu'à la défense antimissile balistique (Aegis BMD) et la version terrestre Aegis Ashore.\n\nPour Panoplie, Aegis est l'archétype du système de combat comme verrou stratégique : choisir Aegis, c'est adopter un écosystème de capteurs, d'effecteurs et d'interopérabilité (CEC), avec la dépendance américaine qui l'accompagne. C'est le repère face auquel se lisent TACTICOS, PAAMS et SETIS.",
  keySpecs: [
    { label: "Radar", value: "AN/SPY-1 puis AN/SPY-6 — suivi de 100+ pistes, portée > 450 km", confidence: "moyenne", sources: ["lm-aegis", "usn-aegis-c2"] },
    { label: "Effecteurs", value: "Standard Missile SM-2 / SM-3 / SM-6, ESSM via Mk 41", confidence: "haute", sources: ["lm-aegis"] },
    { label: "Baseline", value: "Évolutif jusqu'à Baseline 9/10 ; Aegis BMD", confidence: "moyenne", sources: ["lm-aegis"] },
    { label: "Réseau", value: "CEC — engagement coopératif entre unités", confidence: "haute", sources: ["usn-aegis-c2"] },
    { label: "Diffusion", value: "US Navy + 6 marines alliées ; version terrestre Aegis Ashore", confidence: "haute", sources: ["lm-aegis"] },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Aegis est un investissement lourd : le coût n'est pas celui d'un logiciel isolé mais d'un écosystème complet — radar, calculateurs, Standard Missile, modernisations de baseline sur des décennies.",
      indicators: [
        { label: "Lecture de coût", value: "Écosystème complet — radar, SM, modernisations pluriannuelles", confidence: "moyenne", sources: ["lm-aegis"] },
        { label: "Amortissement", value: "Base installée énorme (US + alliés) qui amortit le développement", confidence: "moyenne", sources: ["usn-aegis-c2"] },
      ],
    },
    {
      key: "finance",
      narrative:
        "Financé par l'US Navy et la MDA, plus un flux FMS/coopératif vers les alliés Aegis. La continuité (SPY-6, Baseline 10) garantit un effort budgétaire durable.",
      indicators: [
        { label: "Maîtrise", value: "Lockheed Martin (intégrateur), US Navy / MDA", confidence: "haute", sources: ["lm-aegis"] },
        { label: "Continuité", value: "Modernisation SPY-6 / Baseline 10 financée dans la durée", confidence: "moyenne", sources: ["usn-aegis-c2"] },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "Chaîne américaine : Lockheed Martin pour le système, RTX pour SPY-6 et Standard Missile. C'est une dépendance industrielle profonde mais souveraine pour les États-Unis, exposée à l'ITAR pour les clients.",
      indicators: [
        { label: "Intégrateur", value: "Lockheed Martin ; radar et SM par RTX", confidence: "haute", sources: ["lm-aegis"] },
        { label: "Exposition", value: "ITAR élevée pour les marines clientes", confidence: "haute", sources: ["usn-aegis-c2"] },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Aegis est un instrument d'alliance : il lie ses utilisateurs à l'écosystème américain (CEC, BMD, Standard Missile) et à une interopérabilité étroite avec l'US Navy. C'est un choix stratégique autant que technique.",
      indicators: [
        { label: "Fonction", value: "Colonne vertébrale de la défense aérienne/antimissile navale alliée", confidence: "haute", sources: ["lm-aegis"] },
        { label: "Dépendance", value: "Écosystème, mises à jour et missiles américains", confidence: "haute", sources: ["usn-aegis-c2"] },
      ],
    },
    {
      key: "export",
      narrative:
        "Exporté via FMS/coopération à six marines (Japon, Espagne, Norvège, Corée, Australie, plus le Canada à venir). L'accès est un marqueur d'alliance forte ; le cœur reste sous contrôle américain.",
      indicators: [
        { label: "Utilisateurs export", value: "Japon, Espagne, Norvège, Corée du Sud, Australie", confidence: "haute", sources: ["lm-aegis"] },
        { label: "Régime", value: "FMS / coopératif sous ITAR — marqueur d'alliance", confidence: "haute", sources: ["usn-aegis-c2"] },
      ],
    },
  ],
  scores: [
    { key: "efficacite-cout", grade: "B", rationale: "Capacité inégalée (BMD, CEC) à coût d'écosystème élevé mais amorti." },
    { key: "survivabilite", grade: "A", rationale: "Référence éprouvée de la défense de zone et antimissile navale." },
    { key: "exportabilite", grade: "C", rationale: "Réservé aux alliés proches via FMS sous ITAR ; marqueur d'alliance." },
    { key: "risque-industriel", grade: "B", rationale: "Base américaine profonde et mature ; forte dépendance pour les clients." },
    { key: "maturite", grade: "A", rationale: "En service depuis 1983, modernisé en continu jusqu'à SPY-6 / Baseline 10." },
    { key: "confiance-donnees", grade: "B", rationale: "Largement documenté ; détails de baseline et de performances sensibles." },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un radar. La réalité : un écosystème complet capteur-C2-effecteur, et un verrou d'interopérabilité avec l'US Navy.",
    bestUseCase: "Défense aérienne de zone et antimissile balistique navale interopérable avec l'écosystème américain.",
    weakPoint: "Coût d'écosystème et dépendance américaine (ITAR, mises à jour, Standard Missile).",
    analystNote:
      "Aegis est le repère mondial des CMS : il rend lisible le vrai enjeu — choisir un système de combat, c'est choisir un écosystème et une alliance.",
  },
  operators: ["États-Unis — US Navy", "Japon, Espagne, Norvège, Corée du Sud, Australie", "Canada (prévu)"],
  theatres: ["Pacifique, Atlantique, Méditerranée — escorte et BMD", "Aegis Ashore — Roumanie, Pologne"],
  timeline: [
    { date: "1983", label: "Premier déploiement d'Aegis (USS Ticonderoga).", kind: "jalon" },
    { date: "2023", label: "Montée en service du radar SPY-6 et de Baseline 10 sur Flight III.", kind: "jalon" },
  ],
  sources: [
    { id: "lm-aegis", title: "Aegis Combat System", publisher: "Lockheed Martin", type: "constructeur", reliability: "B", url: "https://www.lockheedmartin.com/en-us/products/aegis-combat-system.html" },
    { id: "usn-aegis-c2", title: "AEGIS Weapon System", publisher: "United States Navy", type: "institution", reliability: "A", url: "https://www.navy.mil/Resources/Fact-Files/Display-FactFiles/Article/2166739/aegis-weapon-system/" },
  ],
  updated: "2026-06-03",
};

export const tacticos: DefenseSystem = {
  slug: "tacticos",
  name: "TACTICOS",
  designation: "TACTICOS · système de gestion de combat naval modulaire",
  reference: "PNP-C2-002",
  category: "combat-system",
  combatSystemClass: "naval-cms",
  classLabel: "CMS naval modulaire à architecture ouverte",
  country: "Pays-Bas",
  flag: "🇳🇱",
  manufacturer: "Thales",
  introduced: "années 1990",
  status:
    "En service — plus de 178 navires dans 23+ marines ; CMS export de référence (dont frégates polonaises Miecznik)",
  acquisitionModes: ["DCS", "cooperatif"],
  tagline:
    "Le système de combat naval le plus exporté : architecture ouverte et modulaire, du patrouilleur à la frégate, dans plus de vingt marines.",
  summary:
    "TACTICOS, le CMS de Thales (héritage néerlandais), s'est imposé comme le système de combat naval le plus largement exporté : conçu dès les années 1990 comme une architecture ouverte et hautement automatisée, il équipe plus de 178 navires dans plus de 23 marines, du patrouilleur à la frégate de premier rang.\n\nPour Panoplie, il illustre la stratégie inverse d'Aegis : non pas un écosystème fermé adossé à une superpuissance, mais un CMS modulaire, intégrable à des capteurs et effecteurs variés, qui fait de la flexibilité export son principal atout — comme l'a confirmé son choix pour les frégates polonaises Miecznik.",
  keySpecs: [
    { label: "Type", value: "CMS multi-warfare à architecture ouverte et modulaire", confidence: "haute", sources: ["thales-tacticos"] },
    { label: "Diffusion", value: "178+ navires, 23+ marines", confidence: "haute", sources: ["thales-tacticos"] },
    { label: "Spectre", value: "Du patrouilleur à la frégate de premier rang", confidence: "haute", sources: ["thales-tacticos"] },
    { label: "Intégration", value: "Capteurs et effecteurs multi-fournisseurs", confidence: "moyenne", sources: ["nt-tacticos-pl"] },
    { label: "Référence récente", value: "Frégates polonaises Miecznik", confidence: "moyenne", sources: ["nt-tacticos-pl"] },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "TACTICOS mise sur la modularité et la réutilisation logicielle pour contenir les coûts d'intégration, en s'adaptant à des plateformes et budgets très variés.",
      indicators: [
        { label: "Logique", value: "Modularité et réutilisation — coût d'intégration maîtrisé", confidence: "moyenne", sources: ["thales-tacticos"] },
        { label: "Adaptabilité", value: "Du petit combattant à la frégate — large gamme de budgets", confidence: "haute", sources: ["thales-tacticos"] },
      ],
    },
    {
      key: "finance",
      narrative:
        "Porté par Thales sur un flux export continu et une large base installée, le programme s'autofinance par sa diffusion et les contrats de modernisation.",
      indicators: [
        { label: "Maîtrise", value: "Thales (héritage Thales Nederland)", confidence: "haute", sources: ["thales-tacticos"] },
        { label: "Base installée", value: "Flux export et modernisations récurrents", confidence: "moyenne", sources: ["thales-tacticos"] },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "Chaîne européenne (Thales), avec une capacité à intégrer des capteurs et armes de tiers — un atout d'indépendance pour les clients par rapport à un écosystème fermé.",
      indicators: [
        { label: "Maître d'œuvre", value: "Thales", confidence: "haute", sources: ["thales-tacticos"] },
        { label: "Ouverture", value: "Intégration multi-fournisseurs (capteurs, armes)", confidence: "moyenne", sources: ["nt-tacticos-pl"] },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "TACTICOS est un produit d'influence européen : il offre aux marines une alternative crédible aux CMS américains, avec une moindre dépendance et une grande liberté d'intégration.",
      indicators: [
        { label: "Fonction", value: "Alternative européenne aux CMS sous écosystème US", confidence: "moyenne", sources: ["thales-tacticos"] },
        { label: "Atout", value: "Moindre dépendance, liberté d'intégration", confidence: "moyenne", sources: ["nt-tacticos-pl"] },
      ],
    },
    {
      key: "export",
      narrative:
        "L'export est le cœur de l'identité de TACTICOS : 23+ marines clientes. Les configurations s'adaptent au client, ce qui maximise l'attractivité commerciale.",
      indicators: [
        { label: "Clients", value: "Plus de 23 marines", confidence: "haute", sources: ["thales-tacticos"] },
        { label: "Atout export", value: "Adaptation par client, intégration ouverte", confidence: "haute", sources: ["nt-tacticos-pl"] },
      ],
    },
  ],
  scores: [
    { key: "efficacite-cout", grade: "A", rationale: "Modularité et large base installée — excellent rapport capacité/coût d'intégration." },
    { key: "survivabilite", grade: "B", rationale: "CMS éprouvé et automatisé ; la capacité dépend des capteurs/effecteurs intégrés." },
    { key: "exportabilite", grade: "A", rationale: "CMS naval le plus exporté au monde, architecture ouverte." },
    { key: "risque-industriel", grade: "A", rationale: "Thales mature, base installée massive et diversifiée." },
    { key: "maturite", grade: "A", rationale: "En service depuis les années 1990, modernisé en continu." },
    { key: "confiance-donnees", grade: "B", rationale: "Diffusion et références publiques ; détails d'intégration par client variables." },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un logiciel parmi d'autres. La réalité : le CMS naval le plus vendu, dont la force est l'ouverture et l'adaptabilité.",
    bestUseCase: "Doter une marine d'un système de combat flexible, intégrable à des capteurs et armes variés, sans verrou d'écosystème.",
    weakPoint: "La capacité finale dépend des capteurs et effecteurs choisis — le CMS n'est qu'une partie de l'équation.",
    analystNote:
      "TACTICOS est l'anti-Aegis commercial : là où Aegis vend un écosystème fermé, Thales vend l'ouverture et la liberté d'intégration.",
  },
  operators: ["Pays-Bas et 22+ marines clientes", "Pologne (Miecznik)", "Nombreux clients export"],
  theatres: ["Mondial — du patrouilleur à la frégate de premier rang"],
  timeline: [
    { date: "1990s", label: "Conception de TACTICOS comme CMS modulaire.", kind: "jalon" },
    { date: "2022", label: "Sélection pour les frégates polonaises Miecznik.", kind: "export" },
  ],
  sources: [
    { id: "thales-tacticos", title: "TACTICOS Combat Management System", publisher: "Thales Group", type: "constructeur", reliability: "B", url: "https://www.thalesgroup.com/en/markets/defence-and-security/naval-forces/above-water-warfare/tacticos-combat-management-system" },
    { id: "nt-tacticos-pl", title: "Thales integrates Tacticos CMS on Polish Miecznik frigates", publisher: "Naval Technology", type: "presse", reliability: "B", url: "https://www.naval-technology.com/news/thales-integrates-tacticos-cms-on-polish-miecznik-frigates/" },
  ],
  updated: "2026-06-03",
};

export const paamsSeaViper: DefenseSystem = {
  slug: "paams-sea-viper",
  name: "PAAMS / Sea Viper",
  designation: "Principal Anti-Air Missile System · système de combat antiaérien naval",
  reference: "PNP-C2-003",
  category: "combat-system",
  combatSystemClass: "naval-cms",
  classLabel: "Système de combat antiaérien naval (PAAMS / Sea Viper)",
  country: "France · Italie · Royaume-Uni",
  flag: "🇪🇺",
  manufacturer: "EUROPAAMS (Eurosam · UKAMS)",
  introduced: "années 2010",
  status:
    "En service — frégates Horizon (FR/IT) et destroyers Type 45 britanniques (Sea Viper) ; emploi documenté en mer Rouge",
  acquisitionModes: ["cooperatif"],
  tagline:
    "Le système antiaérien naval européen : Aster 15/30, radars SAMPSON et S1850M, capable de suivre plus de 1 000 pistes — le PAAMS des Horizon et le Sea Viper des Type 45.",
  summary:
    "PAAMS (Principal Anti-Air Missile System) est le système de combat antiaérien développé en coopération par la France, l'Italie et le Royaume-Uni via EUROPAAMS (Eurosam 66 %, UKAMS 33 %). Il associe les missiles Aster 15/30 aux radars longue portée (S1850M, et SAMPSON sur la variante britannique Sea Viper), avec un suivi annoncé de plus de 1 000 pistes jusqu'à ≈ 400 km.\n\nPour Panoplie, c'est le pendant européen d'Aegis pour la défense aérienne de zone : un système de combat naval cohérent, souverain à l'échelle européenne, dont l'emploi récent en mer Rouge a confirmé la pertinence opérationnelle.",
  keySpecs: [
    { label: "Effecteurs", value: "Aster 15 (courte) et Aster 30 (longue portée)", confidence: "haute", sources: ["eurosam-paams"] },
    { label: "Radars", value: "S1850M longue portée ; SAMPSON sur Sea Viper (Type 45)", confidence: "moyenne", sources: ["ukdj-seaviper"] },
    { label: "Capacité", value: "Suivi de 1 000+ pistes jusqu'à ≈ 400 km", confidence: "moyenne", status: "a-recouper", sources: ["ukdj-seaviper"] },
    { label: "Plateformes", value: "Horizon (FR/IT), Type 45 (UK), dérivés FREMM DA", confidence: "haute", sources: ["eurosam-paams"] },
    { label: "Emploi", value: "Interceptions documentées en mer Rouge", confidence: "moyenne", sources: ["ukdj-seaviper"] },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "PAAMS est un système premium de défense aérienne navale : son coût se lit dans le couple radar/Aster et l'intégration, mutualisé sur trois marines.",
      indicators: [
        { label: "Segment", value: "Défense aérienne navale premium", confidence: "moyenne", sources: ["eurosam-paams"] },
        { label: "Mutualisation", value: "Développement partagé FR/IT/UK", confidence: "haute", sources: ["eurosam-paams"] },
      ],
    },
    {
      key: "finance",
      narrative:
        "Programme coopératif trinational via EUROPAAMS, financé par les trois marines. La modernisation (Aster B1NT, radars) prolonge l'effort dans la durée.",
      indicators: [
        { label: "Maîtrise", value: "EUROPAAMS — Eurosam (66 %) + UKAMS (33 %)", confidence: "haute", sources: ["eurosam-paams"] },
        { label: "Continuité", value: "Modernisation Aster et radars en cours", confidence: "moyenne", sources: ["ukdj-seaviper"] },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "Chaîne européenne : MBDA (Aster), Thales et Leonardo (radars). C'est une capacité de défense aérienne navale souveraine à l'échelle européenne, à faible exposition ITAR.",
      indicators: [
        { label: "Maîtres d'œuvre", value: "MBDA, Thales, Leonardo via EUROPAAMS", confidence: "haute", sources: ["eurosam-paams"] },
        { label: "Souveraineté", value: "Chaîne européenne — faible exposition ITAR", confidence: "moyenne", sources: ["ukdj-seaviper"] },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "PAAMS incarne la coopération navale européenne de premier rang : il donne à FR, IT et UK une défense aérienne de flotte autonome, alternative crédible à l'écosystème Aegis.",
      indicators: [
        { label: "Fonction", value: "Défense aérienne de zone navale européenne", confidence: "haute", sources: ["eurosam-paams"] },
        { label: "Autonomie", value: "Alternative européenne souveraine à Aegis", confidence: "moyenne", sources: ["ukdj-seaviper"] },
      ],
    },
    {
      key: "export",
      narrative:
        "L'export se fait surtout via les plateformes (FREMM DA, Horizon dérivés) plutôt que le système seul. La souveraineté de la chaîne facilite les transferts entre partenaires européens.",
      indicators: [
        { label: "Vecteur d'export", value: "Porté par les frégates/destroyers équipés", confidence: "moyenne", sources: ["eurosam-paams"] },
        { label: "Atout", value: "Chaîne européenne — réexport facilité", confidence: "moyenne", status: "a-recouper", sources: ["ukdj-seaviper"] },
      ],
    },
  ],
  scores: [
    { key: "efficacite-cout", grade: "B", rationale: "Défense aérienne navale de premier rang à coût premium, mutualisé sur trois marines." },
    { key: "survivabilite", grade: "A", rationale: "Aster + radars longue portée éprouvés, emploi récent confirmé en mer Rouge." },
    { key: "exportabilite", grade: "B", rationale: "Exporté via plateformes ; souveraineté européenne facilitant les transferts." },
    { key: "risque-industriel", grade: "B", rationale: "Base MBDA/Thales/Leonardo solide ; coordination trinationale exigeante." },
    { key: "maturite", grade: "A", rationale: "En service sur Horizon et Type 45, modernisé (Aster B1NT)." },
    { key: "confiance-donnees", grade: "B", rationale: "Sources industrielles et presse ; performances fines de radar sensibles." },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : juste un lanceur d'Aster. La réalité : un système de combat antiaérien complet, pendant européen d'Aegis pour la flotte.",
    bestUseCase: "Défense aérienne de zone d'un groupe naval européen, souveraine et interopérable OTAN.",
    weakPoint: "Coordination trinationale exigeante ; export surtout porté par les plateformes.",
    analystNote:
      "PAAMS/Sea Viper est la preuve qu'une défense aérienne navale de premier rang peut être européenne ; à comparer à Aegis sur l'axe souveraineté/écosystème.",
  },
  operators: ["France et Italie (Horizon)", "Royaume-Uni (Type 45 — Sea Viper)"],
  theatres: ["Méditerranée, Atlantique — défense aérienne de flotte", "Mer Rouge — interceptions documentées"],
  timeline: [
    { date: "2010s", label: "Mise en service de PAAMS sur Horizon et Type 45.", kind: "jalon" },
    { date: "2024", label: "Interceptions documentées par des Type 45 en mer Rouge.", kind: "emploi" },
  ],
  sources: [
    { id: "eurosam-paams", title: "PAAMS — Principal Anti-Air Missile System", publisher: "Eurosam", type: "constructeur", reliability: "B", url: "https://eurosam.com/products/" },
    { id: "ukdj-seaviper", title: "Sea Viper — a guide to the missile protecting the Red Sea", publisher: "UK Defence Journal", type: "presse", reliability: "C", url: "https://ukdefencejournal.org.uk/sea-viper-a-guide-to-the-missile-protecting-the-red-sea/" },
  ],
  updated: "2026-06-03",
};

export const setis: DefenseSystem = {
  slug: "setis",
  name: "SETIS",
  designation: "SETIS · système de combat naval Naval Group",
  reference: "PNP-C2-004",
  category: "combat-system",
  combatSystemClass: "naval-cms",
  classLabel: "CMS naval à architecture ouverte (Naval Group)",
  country: "France",
  flag: "🇫🇷",
  manufacturer: "Naval Group",
  introduced: "années 2010",
  status:
    "En service — CMS des FREMM françaises et des corvettes Gowind ; exporté avec les plateformes Naval Group",
  acquisitionModes: ["production-nationale", "DCS"],
  tagline:
    "Le système de combat naval souverain français : cœur des FREMM et des corvettes Gowind, à architecture ouverte et fortement exporté avec les plateformes.",
  summary:
    "SETIS est le système de combat développé par Naval Group pour ses plateformes de surface : il équipe les FREMM françaises et la gamme de corvettes Gowind largement exportée. Architecture ouverte, fusion de capteurs, conduite de tir et intégration des effecteurs (Aster, Exocet, MU90) en font le pendant national du CMS.\n\nPour Panoplie, SETIS illustre la souveraineté de bout en bout à la française : couplé à SETIS pour le combat et à SUBTICS côté sous-marins, Naval Group propose un écosystème CMS cohérent, exporté avec ses coques, sans dépendance à un système étranger.",
  keySpecs: [
    { label: "Type", value: "CMS naval de surface à architecture ouverte", confidence: "haute", sources: ["ng-setis"] },
    { label: "Plateformes", value: "FREMM françaises, corvettes Gowind", confidence: "haute", sources: ["ng-setis"] },
    { label: "Effecteurs intégrés", value: "Aster, Exocet, MU90, artillerie", confidence: "moyenne", sources: ["ng-setis"] },
    { label: "Famille", value: "SETIS (surface) et SUBTICS (sous-marins)", confidence: "moyenne", sources: ["ng-setis"] },
    { label: "Export", value: "Diffusé avec les Gowind (Égypte, Émirats, etc.)", confidence: "moyenne", sources: ["ng-setis"] },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "SETIS mutualise un cœur logiciel entre FREMM et Gowind, ce qui amortit le développement sur des plateformes de tailles et budgets différents.",
      indicators: [
        { label: "Mutualisation", value: "Cœur commun FREMM / Gowind", confidence: "moyenne", sources: ["ng-setis"] },
        { label: "Adaptabilité", value: "De la corvette à la frégate de premier rang", confidence: "haute", sources: ["ng-setis"] },
      ],
    },
    {
      key: "finance",
      narrative:
        "Financé dans le cadre des programmes Naval Group (FREMM, Gowind), avec un retour export régulier qui soutient les évolutions du CMS.",
      indicators: [
        { label: "Maîtrise", value: "Naval Group", confidence: "haute", sources: ["ng-setis"] },
        { label: "Soutien", value: "Programmes nationaux + flux export Gowind", confidence: "moyenne", sources: ["ng-setis"] },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "Chaîne française autour de Naval Group, avec Thales et MBDA pour les capteurs et effecteurs. C'est une capacité souveraine, à faible exposition ITAR.",
      indicators: [
        { label: "Maître d'œuvre", value: "Naval Group ; Thales, MBDA en appui", confidence: "haute", sources: ["ng-setis"] },
        { label: "Souveraineté", value: "Chaîne française — faible exposition ITAR", confidence: "moyenne", sources: ["ng-setis"] },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "SETIS sert l'autonomie navale française et l'offre export de Naval Group : vendre une Gowind avec son CMS, c'est offrir une souveraineté de combat sans verrou étranger.",
      indicators: [
        { label: "Fonction", value: "CMS souverain des plateformes françaises", confidence: "haute", sources: ["ng-setis"] },
        { label: "Atout export", value: "Souveraineté de combat sans écosystème imposé", confidence: "moyenne", sources: ["ng-setis"] },
      ],
    },
    {
      key: "export",
      narrative:
        "L'export se fait avec les coques Gowind (Égypte, Émirats arabes unis, Malaisie, etc.). Le CMS s'adapte au client, argument clé de la compétitivité Naval Group.",
      indicators: [
        { label: "Clients", value: "Via Gowind — Égypte, Émirats, Malaisie, etc.", confidence: "moyenne", sources: ["ng-setis"] },
        { label: "Atout", value: "CMS souverain adaptable, livré avec la plateforme", confidence: "moyenne", status: "a-recouper", sources: ["ng-setis"] },
      ],
    },
  ],
  scores: [
    { key: "efficacite-cout", grade: "B", rationale: "Cœur mutualisé FREMM/Gowind — bon rapport capacité/coût, souverain." },
    { key: "survivabilite", grade: "B", rationale: "CMS de premier rang sur FREMM ; capacité selon capteurs/effecteurs intégrés." },
    { key: "exportabilite", grade: "B", rationale: "Exporté avec les Gowind ; souveraineté facilitant les transferts." },
    { key: "risque-industriel", grade: "B", rationale: "Naval Group solide ; base plus étroite que Thales/Lockheed." },
    { key: "maturite", grade: "A", rationale: "En service sur FREMM et Gowind, éprouvé à l'export." },
    { key: "confiance-donnees", grade: "B", rationale: "Sources constructeur ; détails d'intégration par client variables." },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un détail des FREMM. La réalité : le système de combat qui rend l'offre Naval Group souveraine de bout en bout.",
    bestUseCase: "Doter une plateforme française ou export (Gowind) d'un système de combat souverain et adaptable.",
    weakPoint: "Base industrielle plus étroite que les géants Thales/Lockheed ; capacité liée aux capteurs choisis.",
    analystNote:
      "SETIS (surface) et SUBTICS (sous-marins) sont la brique souveraineté de Naval Group : à comparer à TACTICOS (ouverture) et Aegis (écosystème).",
  },
  operators: ["France — Marine nationale (FREMM)", "Clients export Gowind (Égypte, Émirats, Malaisie, etc.)"],
  theatres: ["Méditerranée, Atlantique (FREMM)", "Export — clients Gowind"],
  timeline: [
    { date: "2012", label: "Entrée en service de SETIS avec les premières FREMM.", kind: "jalon" },
    { date: "2010s", label: "Diffusion export via les corvettes Gowind.", kind: "export" },
  ],
  sources: [
    { id: "ng-setis", title: "Combat systems & surface ships", publisher: "Naval Group", type: "constructeur", reliability: "B", url: "https://www.naval-group.com/en/surface-ships" },
  ],
  updated: "2026-06-03",
};

export const ibcs: DefenseSystem = {
  slug: "ibcs",
  name: "IBCS",
  designation: "Integrated Battle Command System · C2 de défense aérienne intégrée",
  reference: "PNP-C2-005",
  category: "combat-system",
  combatSystemClass: "iamd-c2",
  classLabel: "Commandement de bataille IAMD (any sensor, any shooter)",
  country: "États-Unis",
  flag: "🇺🇸",
  manufacturer: "Northrop Grumman",
  introduced: "2023 (capacité opérationnelle initiale)",
  status:
    "En service — US Army (IOC 2023) ; adopté par la Pologne (programme Wisła)",
  acquisitionModes: ["FMS", "production-nationale"],
  tagline:
    "Le cerveau de la défense aérienne intégrée terrestre : relier n'importe quel capteur à n'importe quel effecteur (« any sensor, any shooter ») via un réseau unique.",
  summary:
    "L'IBCS de Northrop Grumman est le système de commandement de la défense aérienne et antimissile intégrée (IAMD) de l'US Army. Son principe — « any sensor, best shooter » — est de fusionner les pistes de radars hétérogènes (Patriot, Sentinel, capteurs futurs) sur un réseau unique (IFCN) et d'attribuer la menace au meilleur effecteur disponible, en s'affranchissant des silos système par système.\n\nPour Panoplie, IBCS incarne le basculement de la défense aérienne du « système » vers le « réseau » : ce n'est plus le radar ou le missile qui compte d'abord, mais la couche C2 qui les relie. Sa capacité opérationnelle initiale (2023) et son adoption par la Pologne en font la référence du domaine C2 IAMD terrestre.",
  keySpecs: [
    { label: "Principe", value: "« Any sensor, best shooter » — fusion réseau des capteurs et effecteurs", confidence: "haute", sources: ["ng-ibcs", "mda-ibcs"] },
    { label: "Réseau", value: "IFCN — réseau de combat intégré reliant capteurs et tirs", confidence: "moyenne", sources: ["ng-ibcs"] },
    { label: "Intègre", value: "Patriot, Sentinel, capteurs additionnels (architecture ouverte)", confidence: "moyenne", sources: ["mda-ibcs"] },
    { label: "Statut", value: "Capacité opérationnelle initiale US Army en 2023", confidence: "haute", sources: ["ng-ibcs"] },
    { label: "Export", value: "Pologne (programme Wisła)", confidence: "haute", sources: ["ng-ibcs"] },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "IBCS est un investissement de couche C2 : son coût ne se lit pas au capteur ou au missile, mais à la valeur d'intégration qu'il dégage en mutualisant des effecteurs existants.",
      indicators: [
        { label: "Nature", value: "Couche C2 — valeur d'intégration plutôt que de plateforme", confidence: "moyenne", sources: ["ng-ibcs"] },
        { label: "Retour", value: "Mutualisation d'effecteurs existants (Patriot, etc.)", confidence: "moyenne", sources: ["mda-ibcs"] },
      ],
    },
    {
      key: "finance",
      narrative:
        "Financé par l'US Army après un développement long et difficile (Northrop Grumman, sélectionné en 2010), désormais en production et exporté (Pologne).",
      indicators: [
        { label: "Maîtrise", value: "Northrop Grumman, US Army", confidence: "haute", sources: ["ng-ibcs"] },
        { label: "Trajectoire", value: "Développement long ; IOC 2023, export Pologne", confidence: "moyenne", sources: ["mda-ibcs"] },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "Chaîne américaine (Northrop Grumman) avec une architecture ouverte censée intégrer des capteurs tiers. La couche C2 est sensible et relève des contrôles américains à l'export.",
      indicators: [
        { label: "Maître d'œuvre", value: "Northrop Grumman", confidence: "haute", sources: ["ng-ibcs"] },
        { label: "Exposition", value: "C2 sensible — contrôle US à l'export", confidence: "moyenne", sources: ["mda-ibcs"] },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "IBCS redéfinit la défense aérienne comme un réseau : adopter IBCS, c'est adosser sa défense IAMD à l'architecture américaine, avec un gain d'intégration et une dépendance C2.",
      indicators: [
        { label: "Fonction", value: "C2 de la défense aérienne intégrée terrestre", confidence: "haute", sources: ["ng-ibcs"] },
        { label: "Dépendance", value: "Architecture et mises à jour américaines", confidence: "moyenne", sources: ["mda-ibcs"] },
      ],
    },
    {
      key: "export",
      narrative:
        "La Pologne est le premier client export majeur (Wisła). L'export d'une couche C2 aussi structurante est un marqueur d'alliance forte et reste sous contrôle américain.",
      indicators: [
        { label: "Premier client", value: "Pologne (Wisła)", confidence: "haute", sources: ["ng-ibcs"] },
        { label: "Régime", value: "FMS sous contrôle US — marqueur d'alliance", confidence: "moyenne", sources: ["mda-ibcs"] },
      ],
    },
  ],
  scores: [
    { key: "efficacite-cout", grade: "B", rationale: "Forte valeur d'intégration (mutualisation d'effecteurs) pour un coût de couche C2." },
    { key: "survivabilite", grade: "B", rationale: "Réseau résilient « any sensor, any shooter » ; dépend de la robustesse réseau." },
    { key: "exportabilite", grade: "C", rationale: "Couche C2 sensible — export d'alliance (Pologne) sous contrôle US." },
    { key: "risque-industriel", grade: "C", rationale: "Northrop Grumman solide, mais développement historiquement long et complexe." },
    { key: "maturite", grade: "C", rationale: "IOC 2023 — récent ; montée en puissance et intégrations en cours." },
    { key: "confiance-donnees", grade: "B", rationale: "Sources industrielles et think-tanks ; performances réseau fines sensibles." },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un logiciel de plus pour Patriot. La réalité : un C2 qui fait basculer la défense aérienne du système isolé au réseau intégré.",
    bestUseCase: "Fédérer des capteurs et effecteurs hétérogènes de défense aérienne en un réseau IAMD unique.",
    weakPoint: "Couche C2 récente et sensible, dépendance à l'architecture américaine, développement long.",
    analystNote:
      "IBCS est le pendant terrestre de la logique CEC navale : la vraie capacité de défense aérienne se joue désormais au niveau du réseau C2, pas du capteur seul.",
  },
  operators: ["États-Unis — US Army", "Pologne (Wisła)"],
  theatres: ["États-Unis — défense aérienne intégrée", "Pologne — déploiement Wisła"],
  timeline: [
    { date: "2010", label: "Northrop Grumman sélectionné comme maître d'œuvre IBCS.", kind: "jalon" },
    { date: "2023", label: "Capacité opérationnelle initiale (IOC) de l'IBCS dans l'US Army.", kind: "jalon" },
  ],
  sources: [
    { id: "ng-ibcs", title: "Integrated Battle Command System (IBCS)", publisher: "Northrop Grumman", type: "constructeur", reliability: "B", url: "https://www.northropgrumman.com/what-we-do/missile-defense/integrated-battle-command-system-ibcs" },
    { id: "mda-ibcs", title: "Integrated Air and Missile Defense Battle Command System (IBCS)", publisher: "Missile Defense Advocacy Alliance", type: "think-tank", reliability: "C", url: "https://www.missiledefenseadvocacy.org/defense-systems/integrated-air-and-missile-defense-battle-command-system-ibcs/" },
  ],
  updated: "2026-06-03",
};
