import type { DefenseSystem } from "../types";

// Domaine défense aérienne & antimissile — systèmes intégrés (radar + C2 +
// lanceurs + intercepteurs), lus par couche. Les effecteurs seuls (Aster,
// PAC-3, AMRAAM, Tamir) sont documentés côté missiles.

export const sampTNg: DefenseSystem = {
  slug: "samp-t-ng",
  name: "SAMP/T NG",
  designation: "Mamba NG · système sol-air moyenne-longue portée européen",
  reference: "PNP-AD-001",
  category: "air-defense",
  airDefenseClass: "LRAD",
  classLabel: "Système sol-air moyenne-longue portée et antibalistique",
  country: "France · Italie",
  flag: "🇫🇷",
  manufacturer: "Eurosam (MBDA · Thales · Leonardo)",
  introduced: "2025 (qualification NG)",
  status:
    "Tir de qualification Aster 30 B1NT réussi en 2025 ; montée en service FR/IT et candidat longue portée pour plusieurs pays européens",
  acquisitionModes: ["cooperatif"],
  tagline:
    "La réponse européenne au Patriot : Aster 30 B1NT, radar Kronos à panneaux tournants et C2 souverain, capable de défense de zone et d'interception balistique de théâtre.",
  summary:
    "Le SAMP/T NG (Next Generation) est la montée en gamme du seul système sol-air de premier rang entièrement européen. Il associe l'intercepteur Aster 30 B1NT (portée ≈ 150 km contre cibles aérobies, plafond ≈ 25 km, capacité antibalistique étendue), un nouveau radar rotatif Kronos Grand Mobile (Leonardo, détection > 350 km, suivi de ≈ 1 000 pistes) et un module d'engagement modernisé.\n\nPour Panoplie, c'est le cas d'école de l'autonomie stratégique : à mission comparable au Patriot PAC-3 MSE, il offre une chaîne souveraine FR/IT sans dépendance ITAR sur le cœur du système — un argument central dans les arbitrages européens post-2022.",
  keySpecs: [
    { label: "Intercepteur", value: "Aster 30 B1NT — plafond ≈ 25 km", confidence: "haute", sources: ["eurosam-b1nt", "nn-samptng"] },
    { label: "Portée (aérobie)", value: "≈ 150 km contre aéronefs et missiles de croisière", confidence: "moyenne", sources: ["at-samptng"] },
    { label: "Antibalistique", value: "Interception de balistiques de théâtre (classe ≈ 1 500 km)", confidence: "moyenne", status: "a-recouper", sources: ["eurosam-b1nt"] },
    { label: "Radar", value: "Kronos Grand Mobile — détection > 350 km, ≈ 1 000 pistes", confidence: "moyenne", sources: ["at-samptng"] },
    { label: "Architecture", value: "Module radar + module d'engagement + jusqu'à 6 lanceurs × 8", confidence: "moyenne", sources: ["at-samptng"] },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le SAMP/T NG se situe dans le segment premium de la défense sol-air, comparable au Patriot. Son coût se lit en système complet — radar, C2, lanceurs, Aster — et non au missile seul.",
      indicators: [
        { label: "Segment", value: "Système longue portée premium — équivalent fonctionnel du Patriot", confidence: "moyenne", sources: ["nn-samptng"] },
        { label: "Lecture de coût", value: "Coût dominé par le radar, le C2 et la dotation en Aster", confidence: "moyenne", sources: ["at-samptng"] },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le programme est franco-italien via Eurosam et l'OCCAR, avec un effort de modernisation NG soutenu par la demande européenne post-2022 (remplacement ou complément des Patriot).",
      indicators: [
        { label: "Maîtrise programme", value: "Eurosam (MBDA / Thales / Leonardo), coordination OCCAR", confidence: "haute", sources: ["eurosam-b1nt"] },
        { label: "Dynamique", value: "Demande européenne forte de longue portée souveraine", confidence: "moyenne", sources: ["nn-samptng"] },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne est européenne de bout en bout : MBDA (Aster), Thales et Leonardo (radar, C2). C'est précisément ce qui distingue le SAMP/T des solutions américaines.",
      indicators: [
        { label: "Maître d'œuvre", value: "Eurosam — MBDA, Thales, Leonardo", confidence: "haute", sources: ["eurosam-b1nt"] },
        { label: "Exposition ITAR", value: "Faible — cœur du système souverain européen", confidence: "moyenne", sources: ["nn-samptng"] },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Le SAMP/T NG est l'étendard de l'autonomie stratégique européenne en défense aérienne. Son adoption (ou non) par les pays du flanc est lue comme un choix entre souveraineté européenne et écosystème américain.",
      indicators: [
        { label: "Fonction stratégique", value: "Pilier d'une défense aérienne européenne autonome", confidence: "haute", sources: ["nn-samptng"] },
        { label: "Enjeu", value: "Concurrence directe avec le Patriot dans les appels d'offres européens", confidence: "moyenne", sources: ["at-samptng"] },
      ],
    },
    {
      key: "export",
      narrative:
        "L'absence de dépendance ITAR sur le cœur facilite l'export et la réexportation par rapport au Patriot. Plusieurs pays européens évaluent le système comme alternative ou complément.",
      indicators: [
        { label: "Canal", value: "Coopératif européen ; prospects flanc Est et Europe du Nord", confidence: "moyenne", status: "a-recouper", sources: ["nn-samptng"] },
        { label: "Atout export", value: "Souveraineté de la chaîne — réexport facilité", confidence: "moyenne", sources: ["eurosam-b1nt"] },
      ],
    },
  ],
  scores: [
    { key: "efficacite-cout", grade: "B", rationale: "Capacité de zone + antibalistique de théâtre crédible, à coût premium mais souverain." },
    { key: "survivabilite", grade: "B", rationale: "Radar rotatif et Aster B1NT modernes ; emploi opérationnel NG encore récent." },
    { key: "exportabilite", grade: "B", rationale: "Faible exposition ITAR et forte demande européenne, face à un Patriot très implanté." },
    { key: "risque-industriel", grade: "B", rationale: "Base Eurosam solide ; cadence à confirmer face à la demande." },
    { key: "maturite", grade: "C", rationale: "Aster 30 mature ; standard NG qualifié en 2025, montée en service en cours." },
    { key: "confiance-donnees", grade: "B", rationale: "Sources industrielles et presse spécialisée nombreuses ; performances antibalistiques fines sensibles." },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un simple lanceur d'Aster. La réalité : un système complet radar/C2/lanceurs dont la valeur tient à la souveraineté de la chaîne.",
    bestUseCase: "Défense aérienne de zone souveraine avec capacité antibalistique de théâtre, en alternative ou complément du Patriot.",
    weakPoint: "Standard NG récent et cadence industrielle à prouver face à une demande européenne soudaine.",
    analystNote:
      "SAMP/T NG et Patriot PAC-3 MSE sont le duel structurant de la défense aérienne européenne : même mission, deux logiques de souveraineté.",
  },
  operators: ["France — Armée de l'air et de l'espace", "Italie — Esercito / Aeronautica", "Ukraine (SAMP/T livrés)"],
  theatres: ["Europe — défense de zone", "Ukraine — emploi documenté"],
  timeline: [
    { date: "2025", label: "Tir de qualification longue portée de l'Aster 30 B1NT pour le SAMP/T NG.", kind: "jalon" },
    { date: "2023", label: "Livraison de systèmes SAMP/T à l'Ukraine (standard antérieur).", kind: "emploi" },
  ],
  sources: [
    { id: "eurosam-b1nt", title: "Successful Aster B1NT firing qualifying the long-range performance of the SAMP/T NG", publisher: "Eurosam", type: "constructeur", reliability: "B", date: "2025", url: "https://eurosam.com/successful-aster-b1nt-firing-qualifying-the-long-range-performance-of-the-missile-and-the-samp-t-ng-air-defence-system/" },
    { id: "nn-samptng", title: "Successful Aster B1NT firing, qualifying SAMP/T NG air defence system", publisher: "Naval News", type: "presse", reliability: "B", date: "2025", url: "https://www.navalnews.com/naval-news/2025/08/successful-aster-b1nt-firing-qalifying-long-range-performance-od-missile-and-samp-t-ng-air-defence-system/" },
    { id: "at-samptng", title: "SAMP/T NG Surface-to-Air Missile Defence System, Europe", publisher: "Army Technology", type: "presse", reliability: "B", url: "https://www.army-technology.com/projects/samp-t-ng-surface-to-air-missile-defence-system-europe/" },
  ],
  updated: "2026-06-03",
};

export const patriotPac3Mse: DefenseSystem = {
  slug: "patriot-pac3-mse",
  name: "Patriot PAC-3 MSE",
  designation: "MIM-104 Patriot · système sol-air longue portée et antimissile",
  reference: "PNP-AD-002",
  category: "air-defense",
  airDefenseClass: "LRAD",
  classLabel: "Système sol-air longue portée et antimissile balistique",
  country: "États-Unis",
  flag: "🇺🇸",
  manufacturer: "RTX (Raytheon) · Lockheed Martin (PAC-3 MSE)",
  introduced: "1984 (Patriot) ; 2016 (PAC-3 MSE)",
  status:
    "Référence mondiale — 18+ pays utilisateurs, emploi intensif en Ukraine et au Moyen-Orient",
  acquisitionModes: ["FMS"],
  tagline:
    "Le standard occidental de la défense aérienne et antimissile : PAC-3 MSE hit-to-kill, radar AN/MPQ-65 et un réseau d'utilisateurs FMS sans équivalent.",
  summary:
    "Le Patriot est le système sol-air longue portée le plus répandu et le plus éprouvé au combat du monde occidental. Sa version PAC-3 MSE (Missile Segment Enhancement) de Lockheed Martin offre une interception hit-to-kill de missiles balistiques, de croisière et d'aéronefs, avec un plafond ≈ 24 km et une portée ≈ 160 km, servie par le radar AN/MPQ-65 (suivi de plus de 125 cibles jusqu'à ≈ 180 km).\n\nPour Panoplie, c'est le mètre-étalon : sa diffusion FMS massive, son emploi opérationnel récent intensif et sa double brique industrielle (RTX pour le système, Lockheed pour l'intercepteur) en font le repère face auquel se positionnent le SAMP/T NG, le NASAMS et l'IRIS-T SLM.",
  keySpecs: [
    { label: "Intercepteur", value: "PAC-3 MSE — hit-to-kill, plafond ≈ 24 km", confidence: "haute", sources: ["lm-pac3", "ar-patriot"] },
    { label: "Portée", value: "≈ 160 km, vitesse > Mach 4,5", confidence: "moyenne", sources: ["ar-patriot"] },
    { label: "Radar", value: "AN/MPQ-65 — > 125 cibles jusqu'à ≈ 180 km", confidence: "moyenne", sources: ["ar-patriot"] },
    { label: "Missions", value: "Anti-aéronefs, missiles de croisière et balistiques (BMD)", confidence: "haute", sources: ["rtx-gemt"] },
    { label: "Diffusion", value: "18+ pays utilisateurs — réseau FMS mondial", confidence: "haute", sources: ["ar-patriot"] },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le Patriot est cher à l'achat comme à l'emploi : intercepteurs PAC-3 MSE coûteux, radar et C2 lourds. Mais l'amortissement sur une base installée énorme et le retour d'expérience compensent.",
      indicators: [
        { label: "Segment", value: "Premium longue portée — intercepteurs et radar coûteux", confidence: "moyenne", sources: ["ar-patriot"] },
        { label: "Lecture", value: "Coût compensé par la maturité et la base installée mondiale", confidence: "moyenne", sources: ["rtx-gemt"] },
      ],
    },
    {
      key: "finance",
      narrative:
        "Financé par l'US Army et un flux FMS continu, le Patriot bénéficie d'une demande record post-2022. Reconstituer les stocks d'intercepteurs est devenu un enjeu industriel majeur.",
      indicators: [
        { label: "Demande", value: "Carnet FMS record ; tension sur les stocks d'intercepteurs", confidence: "moyenne", sources: ["ar-patriot"] },
        { label: "Maîtrise", value: "RTX (système) + Lockheed Martin (PAC-3 MSE)", confidence: "haute", sources: ["lm-pac3"] },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "Double maître d'œuvre américain : RTX pour le système et le radar, Lockheed pour l'intercepteur. La cadence PAC-3 MSE est un point de tension documenté.",
      indicators: [
        { label: "Maîtres d'œuvre", value: "RTX (Raytheon) et Lockheed Martin", confidence: "haute", sources: ["lm-pac3", "rtx-gemt"] },
        { label: "Tension", value: "Cadence d'intercepteurs sous pression face à la demande", confidence: "moyenne", status: "a-recouper", sources: ["ar-patriot"] },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Acheter Patriot, c'est entrer dans l'écosystème américain de défense aérienne — interopérabilité, soutien, mais aussi dépendance et arbitrage FMS. Chaque déploiement est un signal d'alliance.",
      indicators: [
        { label: "Fonction stratégique", value: "Colonne vertébrale de la défense aérienne alliée des États-Unis", confidence: "haute", sources: ["ar-patriot"] },
        { label: "Dépendance", value: "Écosystème et arbitrage FMS américains", confidence: "haute", sources: ["rtx-gemt"] },
      ],
    },
    {
      key: "export",
      narrative:
        "Export par FMS sous contrôle américain (ITAR), mais largement accordé aux alliés. Les délais de livraison, allongés par la demande, deviennent un facteur de décision face au SAMP/T NG.",
      indicators: [
        { label: "Canal", value: "FMS — large diffusion alliée sous ITAR", confidence: "haute", sources: ["ar-patriot"] },
        { label: "Contrainte", value: "Délais de livraison allongés par la demande mondiale", confidence: "moyenne", status: "a-recouper", sources: ["ar-patriot"] },
      ],
    },
  ],
  scores: [
    { key: "efficacite-cout", grade: "B", rationale: "Capacité antimissile éprouvée au combat ; coût élevé mais amorti et crédible." },
    { key: "survivabilite", grade: "A", rationale: "Hit-to-kill PAC-3 MSE éprouvé contre menaces réelles, balistiques inclus." },
    { key: "exportabilite", grade: "B", rationale: "Très large diffusion FMS, tempérée par ITAR et délais de livraison." },
    { key: "risque-industriel", grade: "B", rationale: "Double base US robuste ; cadence d'intercepteurs sous tension." },
    { key: "maturite", grade: "A", rationale: "Système le plus éprouvé au combat de sa catégorie, emploi intensif récent." },
    { key: "confiance-donnees", grade: "B", rationale: "Abondamment documenté ; performances fines et taux d'interception variables." },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un bouclier infaillible. La réalité : un système très capable mais coûteux, dépendant des stocks d'intercepteurs et de l'arbitrage FMS.",
    bestUseCase: "Défense aérienne et antimissile de zone interopérable avec l'écosystème américain et l'OTAN.",
    weakPoint: "Coût des intercepteurs, tension sur les stocks et délais de livraison ; dépendance ITAR.",
    analystNote:
      "Le Patriot est le repère mondial : toute lecture du SAMP/T NG, du NASAMS ou de l'IRIS-T SLM se fait par rapport à lui.",
  },
  operators: ["États-Unis", "Allemagne, Pays-Bas, Pologne, Suède, Japon, Arabie saoudite et 12+ autres", "Ukraine (livré)"],
  theatres: ["Ukraine — interceptions documentées (aéronefs, missiles, balistiques)", "Moyen-Orient — emploi opérationnel"],
  timeline: [
    { date: "2016", label: "Entrée en service de l'intercepteur PAC-3 MSE.", kind: "jalon" },
    { date: "2023", label: "Premières interceptions documentées en Ukraine, balistiques inclus.", kind: "emploi" },
  ],
  sources: [
    { id: "lm-pac3", title: "PAC-3 MSE — page produit", publisher: "Lockheed Martin", type: "constructeur", reliability: "B", url: "https://www.lockheedmartin.com/en-us/products/pac-3-missile-defense.html" },
    { id: "rtx-gemt", title: "Patriot / Guidance Enhanced Missile", publisher: "RTX (Raytheon)", type: "constructeur", reliability: "B", url: "https://www.rtx.com/raytheon/what-we-do/integrated-air-and-missile-defense/guidance-enhanced-missile" },
    { id: "ar-patriot", title: "Patriot PAC-3 MSE / GEM-T air defense missile system data", publisher: "Army Recognition", type: "presse", reliability: "C", url: "https://www.armyrecognition.com/military-products/army/air-defense-systems/air-defense-vehicles/patriot-pac-3-mse-gem-t-air-defense-missile-system-data" },
  ],
  updated: "2026-06-03",
};

export const nasams: DefenseSystem = {
  slug: "nasams",
  name: "NASAMS",
  designation: "National Advanced Surface-to-Air Missile System",
  reference: "PNP-AD-003",
  category: "air-defense",
  airDefenseClass: "MRAD",
  classLabel: "Système sol-air moyenne portée en réseau (AMRAAM)",
  country: "Norvège · États-Unis",
  flag: "🇳🇴",
  manufacturer: "Kongsberg · RTX (Raytheon)",
  introduced: "2000s",
  status:
    "En service — 13+ pays, protège l'espace aérien de Washington, déployé en Ukraine",
  acquisitionModes: ["FMS", "cooperatif"],
  tagline:
    "Le système moyenne portée modulaire et en réseau : il recycle l'AMRAAM air-air en sol-air et sépare radar, C2 et lanceurs pour un déploiement distribué.",
  summary:
    "Le NASAMS, développé par Kongsberg et Raytheon, a popularisé l'architecture distribuée : un poste de commandement (FDC), un radar 3D Sentinel AN/MPQ-64F1, des capteurs passifs et des lanceurs déportés tirant l'AMRAAM (et l'AMRAAM-ER). Le « launch-on-remote » permet d'éloigner les lanceurs du radar et de couvrir une bulle réticulée.\n\nPour Panoplie, c'est l'exemple de la modularité et de la réutilisation : le même missile équipe les chasseurs et le sol, ce qui simplifie la logistique. Sa caution la plus visible — la protection de l'espace aérien de Washington — en fait une référence moyenne portée mondiale.",
  keySpecs: [
    { label: "Effecteur", value: "AMRAAM / AMRAAM-ER (portée et plafond étendus)", confidence: "haute", sources: ["kongsberg-nasams"] },
    { label: "Architecture", value: "FDC + radar Sentinel + lanceurs déportés (launch-on-remote)", confidence: "haute", sources: ["kongsberg-nasams"] },
    { label: "Radar", value: "AN/MPQ-64F1 Sentinel (3D)", confidence: "moyenne", sources: ["mda-nasams"] },
    { label: "Extension", value: "AMRAAM-ER : +50 % portée, +70 % plafond annoncés", confidence: "moyenne", status: "a-recouper", sources: ["kongsberg-nasams"] },
    { label: "Caution", value: "Protège l'espace aérien de Washington depuis 2005", confidence: "haute", sources: ["mda-nasams"] },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le NASAMS est plus abordable que les systèmes longue portée et mutualise un missile déjà produit en masse (AMRAAM), ce qui réduit le coût logistique global.",
      indicators: [
        { label: "Positionnement", value: "Moyenne portée — coût modéré vs longue portée", confidence: "moyenne", sources: ["kongsberg-nasams"] },
        { label: "Logistique", value: "Mutualisation AMRAAM air-air / sol-air", confidence: "haute", sources: ["kongsberg-nasams"] },
      ],
    },
    {
      key: "finance",
      narrative:
        "Coopération Kongsberg/Raytheon, financée par un large flux export et la demande post-2022. Plusieurs pays ont commandé en urgence pour l'Ukraine et pour eux-mêmes.",
      indicators: [
        { label: "Maîtrise", value: "Kongsberg (Norvège) + RTX (États-Unis)", confidence: "haute", sources: ["kongsberg-nasams"] },
        { label: "Demande", value: "Commandes accélérées post-2022", confidence: "moyenne", sources: ["mda-nasams"] },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "Chaîne mixte norvégienne et américaine : Kongsberg pour le C2 et le système, Raytheon pour l'AMRAAM et le radar. L'AMRAAM relève des contrôles américains.",
      indicators: [
        { label: "Maîtres d'œuvre", value: "Kongsberg + Raytheon", confidence: "haute", sources: ["kongsberg-nasams"] },
        { label: "Exposition", value: "AMRAAM et radar sous contrôle américain", confidence: "moyenne", sources: ["mda-nasams"] },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Le NASAMS est un produit d'alliance — norvégo-américain, largement diffusé en Europe et chez les partenaires. Sa banalisation en fait un standard moyenne portée OTAN de fait.",
      indicators: [
        { label: "Fonction", value: "Standard moyenne portée de fait dans l'OTAN", confidence: "moyenne", sources: ["mda-nasams"] },
        { label: "Signal", value: "Caution Washington + soutien Ukraine", confidence: "haute", sources: ["mda-nasams"] },
      ],
    },
    {
      key: "export",
      narrative:
        "Très exporté (13+ pays). La présence de l'AMRAAM impose des autorisations américaines, mais l'architecture ouverte facilite l'intégration de capteurs et d'effecteurs tiers.",
      indicators: [
        { label: "Diffusion", value: "13+ pays utilisateurs", confidence: "haute", sources: ["kongsberg-nasams"] },
        { label: "Canal", value: "FMS / coopératif ; AMRAAM sous contrôle US", confidence: "moyenne", sources: ["mda-nasams"] },
      ],
    },
  ],
  scores: [
    { key: "efficacite-cout", grade: "A", rationale: "Moyenne portée efficace et logistique mutualisée — excellent rapport capacité/coût." },
    { key: "survivabilite", grade: "B", rationale: "Architecture distribuée (launch-on-remote) résiliente ; portée plafonnée par le segment." },
    { key: "exportabilite", grade: "A", rationale: "Diffusion mondiale et architecture ouverte, malgré le contrôle US sur l'AMRAAM." },
    { key: "risque-industriel", grade: "B", rationale: "Double base Kongsberg/Raytheon solide ; dépendance AMRAAM." },
    { key: "maturite", grade: "A", rationale: "En service depuis 20 ans, emploi opérationnel récent en Ukraine." },
    { key: "confiance-donnees", grade: "B", rationale: "Bien documenté ; performances exactes selon variante de missile." },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un système courte portée. La réalité : un moyenne portée modulaire et réticulé, dont la force est l'architecture distribuée.",
    bestUseCase: "Défense moyenne portée de sites et de zones, intégrable à une défense multicouche et à des capteurs tiers.",
    weakPoint: "Portée plafonnée par le segment et dépendance à l'AMRAAM sous contrôle américain.",
    analystNote:
      "NASAMS et IRIS-T SLM se disputent la couche moyenne européenne : missile américain mutualisé contre solution allemande souveraine.",
  },
  operators: ["Norvège", "États-Unis (NCR / Washington)", "Pays-Bas, Espagne, Finlande, Lituanie et 8+ autres", "Ukraine (livré)"],
  theatres: ["Washington — défense permanente depuis 2005", "Ukraine — emploi documenté"],
  timeline: [
    { date: "2005", label: "NASAMS prend en charge la défense aérienne de Washington (NCR).", kind: "emploi" },
    { date: "2022", label: "Commandes accélérées et livraisons vers l'Ukraine.", kind: "export" },
  ],
  sources: [
    { id: "kongsberg-nasams", title: "NASAMS Air Defence System", publisher: "Kongsberg", type: "constructeur", reliability: "B", url: "https://www.kongsberg.com/what-we-do/defence-and-security/integrated-air-and-missile-defence/nasams-air-defence-system/" },
    { id: "mda-nasams", title: "National Advanced Surface-to-Air Missile System (NASAMS)", publisher: "Missile Defense Advocacy Alliance", type: "think-tank", reliability: "C", url: "https://www.missiledefenseadvocacy.org/defense-systems/national-advanced-surface-to-air-missile-system-nasams/" },
  ],
  updated: "2026-06-03",
};

export const davidsSling: DefenseSystem = {
  slug: "davids-sling",
  name: "David's Sling",
  designation: "Fronde de David · système sol-air moyenne-longue portée (Stunner)",
  reference: "PNP-AD-004",
  category: "air-defense",
  airDefenseClass: "MRAD",
  classLabel: "Système sol-air moyenne-longue portée",
  country: "Israël · États-Unis",
  flag: "🇮🇱",
  manufacturer: "Rafael Advanced Defense Systems · RTX (Raytheon)",
  introduced: "2017",
  status:
    "En service — couche médiane du bouclier israélien, entre Iron Dome et Arrow ; premier export majeur (Finlande)",
  acquisitionModes: ["cooperatif", "FMS"],
  tagline:
    "La couche médiane du bouclier israélien : l'intercepteur Stunner contre aéronefs, missiles de croisière, balistiques tactiques et grosses roquettes — entre Iron Dome et Arrow.",
  summary:
    "David's Sling (Fronde de David), développé par Rafael et RTX, comble la couche médiane de la défense aérienne israélienne, entre l'Iron Dome (rapproché) et l'Arrow (exo-atmosphérique). Son intercepteur Stunner (exporté sous le nom SkyCeptor) traite un large spectre — aéronefs, missiles de croisière, missiles balistiques tactiques et roquettes de gros calibre — sur une enveloppe étendue, guidé par le radar ELM-2084 MMR.\n\nPour Panoplie, il complète la lecture de la stratification : il montre qu'une défense multicouche cohérente exige une couche médiane dédiée, et illustre une coopération israélo-américaine dont l'intercepteur (Stunner / SkyCeptor) irrigue aussi d'autres programmes.",
  keySpecs: [
    { label: "Intercepteur", value: "Stunner (export : SkyCeptor) — hit-to-kill multi-cibles", confidence: "haute", sources: ["rafael-ds", "csis-ds"] },
    { label: "Cibles", value: "Aéronefs, missiles de croisière, balistiques tactiques, grosses roquettes", confidence: "haute", sources: ["csis-ds"] },
    { label: "Couche", value: "Médiane — entre Iron Dome et Arrow", confidence: "haute", sources: ["rafael-ds"] },
    { label: "Radar", value: "ELM-2084 MMR (Elta)", confidence: "moyenne", sources: ["csis-ds"] },
    { label: "Enveloppe", value: "Portée étendue (≈ dizaines à quelques centaines de km selon cible)", confidence: "faible", status: "a-recouper", sources: ["csis-ds"] },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "David's Sling occupe un segment intermédiaire : plus cher qu'Iron Dome, moins qu'Arrow. Son intercepteur Stunner est conçu pour un bon rapport efficacité/coût sur une large gamme de menaces.",
      indicators: [
        { label: "Segment", value: "Couche médiane — coût intermédiaire entre Iron Dome et Arrow", confidence: "moyenne", sources: ["csis-ds"] },
        { label: "Lecture", value: "Intercepteur polyvalent pour amortir une large gamme de menaces", confidence: "moyenne", sources: ["rafael-ds"] },
      ],
    },
    {
      key: "finance",
      narrative:
        "Co-développé et co-financé par Israël et les États-Unis (aide à la défense antimissile). L'export (Finlande) ajoute un financement externe et un effet de série.",
      indicators: [
        { label: "Co-financement", value: "Israël + soutien américain", confidence: "haute", sources: ["csis-ds"] },
        { label: "Export structurant", value: "Sélection par la Finlande (2023)", confidence: "moyenne", sources: ["rafael-ds"] },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "Chaîne israélo-américaine : Rafael maître d'œuvre, RTX partenaire pour l'intercepteur. Le Stunner/SkyCeptor circule dans d'autres programmes, ce qui dilue la dépendance.",
      indicators: [
        { label: "Maîtres d'œuvre", value: "Rafael + RTX (Raytheon)", confidence: "haute", sources: ["rafael-ds"] },
        { label: "Mutualisation", value: "Intercepteur Stunner / SkyCeptor partagé entre programmes", confidence: "moyenne", sources: ["csis-ds"] },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "David's Sling complète la pyramide israélienne et devient un produit d'influence : son adoption européenne (Finlande) marque l'entrée d'une couche médiane israélienne dans l'OTAN.",
      indicators: [
        { label: "Fonction", value: "Couche médiane de la défense multicouche israélienne", confidence: "haute", sources: ["csis-ds"] },
        { label: "Signal", value: "Premier client européen (Finlande)", confidence: "moyenne", sources: ["rafael-ds"] },
      ],
    },
    {
      key: "export",
      narrative:
        "Export sous double encadrement israélo-américain (co-financement). La Finlande est le premier client externe majeur ; chaque transfert reste politiquement encadré.",
      indicators: [
        { label: "Premier client", value: "Finlande (2023)", confidence: "moyenne", sources: ["rafael-ds"] },
        { label: "Encadrement", value: "Double aval Israël / États-Unis", confidence: "moyenne", sources: ["csis-ds"] },
      ],
    },
  ],
  scores: [
    { key: "efficacite-cout", grade: "B", rationale: "Couche médiane polyvalente à coût intermédiaire, comblant un vrai manque entre Iron Dome et Arrow." },
    { key: "survivabilite", grade: "A", rationale: "Intercepteur Stunner multi-cibles éprouvé au combat régional." },
    { key: "exportabilite", grade: "C", rationale: "Export politiquement encadré (double aval) ; premier client européen acquis." },
    { key: "risque-industriel", grade: "B", rationale: "Base Rafael/RTX solide ; intercepteur mutualisé entre programmes." },
    { key: "maturite", grade: "A", rationale: "Opérationnel depuis 2017, emploi régional documenté." },
    { key: "confiance-donnees", grade: "C", rationale: "Sources industrielles et think-tanks ; enveloppe d'engagement fine non publique." },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un Iron Dome amélioré. La réalité : une couche médiane distincte, contre des menaces que ni Iron Dome ni Arrow ne traitent idéalement.",
    bestUseCase: "Couche médiane d'une défense multicouche, contre missiles de croisière, balistiques tactiques et grosses roquettes.",
    weakPoint: "Enveloppe fine non publique ; export sous double encadrement israélo-américain.",
    analystNote:
      "David's Sling complète la démonstration de stratification : Iron Dome (C-RAM) → David's Sling (médian) → Arrow (exo). Chaque couche a son économie propre.",
  },
  operators: ["Israël", "Finlande (sélection 2023)"],
  theatres: ["Israël — couche médiane opérationnelle", "Europe — déploiement finlandais à venir"],
  timeline: [
    { date: "2017", label: "Mise en service opérationnelle de David's Sling.", kind: "jalon" },
    { date: "2023", label: "La Finlande sélectionne David's Sling — premier client export.", kind: "export" },
  ],
  sources: [
    { id: "rafael-ds", title: "David's Sling Weapon System", publisher: "Rafael Advanced Defense Systems", type: "constructeur", reliability: "B", url: "https://www.rafael.co.il/system/davids-sling/" },
    { id: "csis-ds", title: "David's Sling (Israel) — Missile Threat", publisher: "CSIS Missile Defense Project", type: "think-tank", reliability: "B", url: "https://missilethreat.csis.org/defsys/davids-sling/" },
  ],
  updated: "2026-06-03",
};

export const arrow3: DefenseSystem = {
  slug: "arrow-3",
  name: "Arrow 3",
  designation: "Hetz 3 · intercepteur antimissile balistique exo-atmosphérique",
  reference: "PNP-AD-005",
  category: "air-defense",
  airDefenseClass: "BMD",
  classLabel: "Intercepteur antimissile balistique exo-atmosphérique",
  country: "Israël · États-Unis",
  flag: "🇮🇱",
  manufacturer: "Israel Aerospace Industries (IAI) · Boeing",
  introduced: "2017",
  status:
    "En service — couche haute du bouclier israélien ; premier export majeur vers l'Allemagne (ESSI)",
  acquisitionModes: ["cooperatif", "FMS"],
  tagline:
    "La couche la plus haute de la défense antimissile israélienne : interception exo-atmosphérique hit-to-kill jusqu'à ≈ 100 km d'altitude, contre des menaces de classe balistique longue portée.",
  summary:
    "L'Arrow 3, développé par IAI et Boeing sous l'égide de l'administration israélienne « Homa » et de la MDA américaine, assure l'interception exo-atmosphérique des missiles balistiques pendant leur phase spatiale, jusqu'à des altitudes ≈ 100 km. Son kill vehicle à autodirecteur gimbalé et tuyère à poussée vectorielle vise des cibles de classe longue portée, intercontinentale incluse.\n\nPour Panoplie, c'est le sommet de la stratification : au-dessus de David's Sling et d'Iron Dome, il forme la couche haute. Son premier export majeur — l'Allemagne, dans le cadre de l'ESSI — en a fait un objet diplomatique de premier plan en Europe.",
  keySpecs: [
    { label: "Domaine", value: "Exo-atmosphérique — interception jusqu'à ≈ 100 km d'altitude", confidence: "haute", sources: ["iai-arrow3", "csis-arrow3"] },
    { label: "Principe", value: "Hit-to-kill, kill vehicle à autodirecteur gimbalé", confidence: "haute", sources: ["iai-arrow3"] },
    { label: "Portée de vol", value: "Estimée jusqu'à ≈ 2 400 km", confidence: "moyenne", status: "a-recouper", sources: ["csis-arrow3"] },
    { label: "Radar", value: "Super Green Pine (bande L) — alerte avancée et conduite de tir", confidence: "moyenne", sources: ["csis-arrow3"] },
    { label: "Cibles", value: "Balistiques de classe longue portée, ICBM inclus", confidence: "moyenne", sources: ["iai-arrow3"] },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Arrow 3 est une capacité rare et premium : interception exo-atmosphérique réservée à un club très restreint de nations. Le coût se justifie par l'unicité de la couche.",
      indicators: [
        { label: "Segment", value: "Couche haute exo — capacité rare et premium", confidence: "moyenne", sources: ["csis-arrow3"] },
        { label: "Lecture", value: "Coût justifié par l'absence d'alternative dans cette couche", confidence: "moyenne", sources: ["iai-arrow3"] },
      ],
    },
    {
      key: "finance",
      narrative:
        "Co-financé par Israël et les États-Unis (MDA) depuis l'origine. L'export allemand (ESSI) y ajoute un financement européen massif et un effet de série.",
      indicators: [
        { label: "Co-financement", value: "Israël (Homa) + MDA américaine", confidence: "haute", sources: ["csis-arrow3"] },
        { label: "Export structurant", value: "Contrat allemand (ESSI) de plusieurs milliards", confidence: "moyenne", sources: ["iai-arrow3"] },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "Chaîne israélo-américaine : IAI maître d'œuvre, Boeing partenaire, sous-systèmes Elta/Elbit. L'export requiert l'accord américain compte tenu du co-financement MDA.",
      indicators: [
        { label: "Maîtres d'œuvre", value: "IAI + Boeing ; radar Elta, BMC Elbit", confidence: "haute", sources: ["iai-arrow3"] },
        { label: "Contrainte", value: "Accord américain requis (co-financement MDA)", confidence: "moyenne", sources: ["csis-arrow3"] },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Arrow 3 est un objet diplomatique majeur : sa vente à l'Allemagne a nécessité l'aval de Washington et marque l'entrée d'une capacité exo non américaine au cœur de l'OTAN européenne.",
      indicators: [
        { label: "Fonction", value: "Couche haute du bouclier israélien et, désormais, allemand", confidence: "haute", sources: ["iai-arrow3"] },
        { label: "Signal", value: "Premier intercepteur exo non US déployé en Europe", confidence: "moyenne", sources: ["csis-arrow3"] },
      ],
    },
    {
      key: "export",
      narrative:
        "Export rarissime et hautement politique. L'Allemagne est le premier client externe ; tout transfert engage Israël et les États-Unis et relève du MTCR Catégorie I.",
      indicators: [
        { label: "Premier client", value: "Allemagne (ESSI)", confidence: "haute", sources: ["iai-arrow3"] },
        { label: "Régime", value: "Accord israélo-américain + MTCR Cat I", confidence: "moyenne", sources: ["csis-arrow3"] },
      ],
    },
  ],
  scores: [
    { key: "efficacite-cout", grade: "B", rationale: "Capacité exo unique justifiant un coût premium réservé à la couche haute." },
    { key: "survivabilite", grade: "A", rationale: "Interception exo hit-to-kill éprouvée en essais et en emploi régional." },
    { key: "exportabilite", grade: "D", rationale: "Export rarissime, politique, MTCR I et double aval Israël/États-Unis." },
    { key: "risque-industriel", grade: "B", rationale: "Base IAI/Boeing solide ; capacité réservée et sensible." },
    { key: "maturite", grade: "A", rationale: "Opérationnel depuis 2017, emploi régional documenté." },
    { key: "confiance-donnees", grade: "C", rationale: "Sources industrielles et think-tanks ; performances exo fines classifiées." },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un missile de plus du Dôme de fer. La réalité : la couche la plus haute, exo-atmosphérique, contre des menaces de classe longue portée.",
    bestUseCase: "Couche haute d'une défense antimissile multicouche, contre menaces balistiques longue portée.",
    weakPoint: "Coût, sensibilité et export verrouillé par le double aval israélo-américain.",
    analystNote:
      "Arrow 3 illustre la stratification verticale : Iron Dome (rapproché), David's Sling (moyen-haut), Arrow (exo). Chaque couche a son économie et sa géopolitique.",
  },
  operators: ["Israël", "Allemagne (contrat ESSI, livraisons en cours)"],
  theatres: ["Israël — couche haute opérationnelle", "Europe — déploiement allemand engagé (ESSI)"],
  timeline: [
    { date: "2017", label: "Déclaration de capacité opérationnelle de l'Arrow 3.", kind: "jalon" },
    { date: "2023", label: "Accord d'export vers l'Allemagne (ESSI) — aval américain obtenu.", kind: "export" },
  ],
  sources: [
    { id: "iai-arrow3", title: "Arrow 3 — Anti Ballistic Missile Interceptor", publisher: "Israel Aerospace Industries", type: "constructeur", reliability: "B", url: "https://www.iai.co.il/product/arrow-3" },
    { id: "csis-arrow3", title: "Arrow 3 (Israel) — Missile Threat", publisher: "CSIS Missile Defense Project", type: "think-tank", reliability: "B", url: "https://missilethreat.csis.org/defsys/arrow-3/" },
  ],
  updated: "2026-06-03",
};

export const ironDome: DefenseSystem = {
  slug: "iron-dome",
  name: "Iron Dome",
  designation: "Kipat Barzel · système anti-roquettes et défense rapprochée",
  reference: "PNP-AD-006",
  category: "air-defense",
  airDefenseClass: "C-RAM",
  classLabel: "Système anti-roquettes, obus et défense rapprochée",
  country: "Israël",
  flag: "🇮🇱",
  manufacturer: "Rafael Advanced Defense Systems",
  introduced: "2011",
  status:
    "En service — emploi massif documenté ; version navale C-Dome ; deux batteries acquises par l'US Army",
  acquisitionModes: ["FMS", "DCS"],
  tagline:
    "La couche la plus basse et la plus médiatisée : interception de roquettes, obus et mortiers par le missile Tamir, avec une logique de tri économique des menaces.",
  summary:
    "L'Iron Dome de Rafael est le système C-RAM le plus connu au monde : il intercepte roquettes, obus et mortiers à courte portée à l'aide du missile Tamir, guidé par le radar ELM-2084 et un C2 qui ne tire que sur les menaces dont la trajectoire vise une zone protégée — un tri économique assumé.\n\nPour Panoplie, c'est l'exemple du compromis coût/effet : un Tamir reste cher face à une roquette artisanale, mais l'économie se juge à l'échelle des dégâts évités. La version navale C-Dome et l'achat de deux batteries par l'US Army illustrent son rayonnement.",
  keySpecs: [
    { label: "Effecteur", value: "Missile Tamir — interception courte portée", confidence: "haute", sources: ["rafael-irondome", "csis-irondome"] },
    { label: "Cibles", value: "Roquettes, obus et mortiers (C-RAM)", confidence: "haute", sources: ["rafael-irondome"] },
    { label: "Radar", value: "ELM-2084 MMR (Elta)", confidence: "moyenne", sources: ["csis-irondome"] },
    { label: "Logique C2", value: "Tri économique — tir seulement sur menaces visant une zone protégée", confidence: "haute", sources: ["rafael-irondome"] },
    { label: "Déclinaisons", value: "C-Dome (naval) ; deux batteries acquises par l'US Army", confidence: "moyenne", sources: ["csis-irondome"] },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le débat coût/effet est au cœur de l'Iron Dome : un Tamir coûte bien plus qu'une roquette adverse, mais l'économie réelle se mesure aux dégâts et aux vies épargnés. La logique de tri sélectif optimise la dépense.",
      indicators: [
        { label: "Compromis", value: "Tamir coûteux face à des roquettes bon marché", confidence: "moyenne", sources: ["csis-irondome"] },
        { label: "Optimisation", value: "Tri économique des menaces par le C2", confidence: "haute", sources: ["rafael-irondome"] },
      ],
    },
    {
      key: "finance",
      narrative:
        "Co-financé par Israël et les États-Unis (aide à la défense antimissile). La production de Tamir est partiellement localisée aux États-Unis (coentreprise Rafael/Raytheon).",
      indicators: [
        { label: "Co-financement", value: "Israël + soutien américain à la défense antimissile", confidence: "haute", sources: ["csis-irondome"] },
        { label: "Localisation", value: "Production Tamir partiellement américaine (Rafael/Raytheon)", confidence: "moyenne", sources: ["csis-irondome"] },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "Chaîne israélienne (Rafael, Elta) avec une localisation américaine pour les Tamir destinés au marché US. Le cœur technologique reste israélien.",
      indicators: [
        { label: "Maître d'œuvre", value: "Rafael Advanced Defense Systems ; radar Elta", confidence: "haute", sources: ["rafael-irondome"] },
        { label: "Localisation", value: "Tamir aussi produit aux États-Unis", confidence: "moyenne", sources: ["csis-irondome"] },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Iron Dome est devenu un symbole de la défense israélienne et un produit d'influence : son adoption (US Army, intérêt de plusieurs pays) et sa déclinaison navale en font une référence C-RAM mondiale.",
      indicators: [
        { label: "Fonction", value: "Couche basse C-RAM de référence mondiale", confidence: "haute", sources: ["csis-irondome"] },
        { label: "Rayonnement", value: "US Army (2 batteries), C-Dome naval, prospects multiples", confidence: "moyenne", sources: ["csis-irondome"] },
      ],
    },
    {
      key: "export",
      narrative:
        "Export sous contrôle israélien, parfois croisé avec des intérêts américains (co-financement). L'achat US et la version navale ont élargi la base, mais chaque transfert reste politiquement encadré.",
      indicators: [
        { label: "Utilisateurs", value: "Israël, États-Unis (US Army) ; déclinaison navale C-Dome", confidence: "moyenne", sources: ["csis-irondome"] },
        { label: "Encadrement", value: "Contrôle israélien, intérêts américains croisés", confidence: "moyenne", sources: ["rafael-irondome"] },
      ],
    },
  ],
  scores: [
    { key: "efficacite-cout", grade: "B", rationale: "Compromis coût/effet débattu, optimisé par un tri sélectif des menaces." },
    { key: "survivabilite", grade: "A", rationale: "Efficacité C-RAM démontrée par un emploi massif et répété." },
    { key: "exportabilite", grade: "B", rationale: "Adoption US et version navale ; export politiquement encadré." },
    { key: "risque-industriel", grade: "B", rationale: "Base Rafael solide, localisation US partielle ; forte sollicitation." },
    { key: "maturite", grade: "A", rationale: "En service depuis 2011, emploi opérationnel parmi les plus intensifs au monde." },
    { key: "confiance-donnees", grade: "B", rationale: "Sources industrielles et think-tanks ; taux d'interception revendiqués à recouper." },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : une protection totale. La réalité : une couche basse C-RAM efficace mais sélective, à lire par son économie et sa portée limitée.",
    bestUseCase: "Protection rapprochée contre roquettes, obus et mortiers ; couche basse d'une défense multicouche.",
    weakPoint: "Coût par tir élevé face à des menaces rustiques ; portée et altitude limitées par le segment.",
    analystNote:
      "Iron Dome est le bas de la pyramide israélienne — au-dessus viennent David's Sling et Arrow. Sa vraie leçon est économique : juger le coût aux dégâts évités, pas au prix du missile.",
  },
  operators: ["Israël", "États-Unis (US Army — 2 batteries)", "Clients C-Dome / Iron Dome (divers)"],
  theatres: ["Israël — emploi massif documenté", "Mer (C-Dome) — protection de plateformes"],
  timeline: [
    { date: "2011", label: "Mise en service opérationnelle de l'Iron Dome.", kind: "jalon" },
    { date: "2020", label: "L'US Army acquiert deux batteries Iron Dome.", kind: "export" },
  ],
  sources: [
    { id: "rafael-irondome", title: "Iron Dome — Defense System", publisher: "Rafael Advanced Defense Systems", type: "constructeur", reliability: "B", url: "https://www.rafael.co.il/system/iron-dome/" },
    { id: "csis-irondome", title: "Iron Dome (Israel) — Missile Threat", publisher: "CSIS Missile Defense Project", type: "think-tank", reliability: "B", url: "https://missilethreat.csis.org/defsys/iron-dome/" },
  ],
  updated: "2026-06-03",
};
