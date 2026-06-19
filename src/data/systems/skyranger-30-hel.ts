import type { DefenseSystem } from "../types";

export const skyranger30Hel: DefenseSystem = {
  slug: "skyranger-30-hel",
  name: "Skyranger 30 HEL",
  designation: "Variante laser du Skyranger 30",
  reference: "PNP-DE-006",
  category: "directed-energy",
  directedEnergyClass: "SHORAD-hybride",
  classLabel: "SHORAD hybride — canon, missiles, laser",
  country: "Allemagne",
  flag: "🇩🇪",
  manufacturer: "Rheinmetall",
  status: "Variante laser au stade démonstrateur ; tourelle Skyranger 30 commandée en série sans laser",
  acquisitionModes: ["production-nationale", "cooperatif"],
  autonomyProfile: {
    battlefieldFunctions: ["counter-uas", "air-defense"],
    autonomyModes: ["manual-assisted"],
    navigationGuidance: {
      vision: true,
      terminalSeeker: "suite capteurs / conduite de tir tourelle",
      notes:
        "Lecture C-UAS assistee par capteurs et conduite de tir ; pas d'autonomie lethale autonome documentee dans cette fiche.",
    },
    networkAndC2: {
      notes:
        "Tourelle SHORAD integree a une bulle de defense aerienne courte portee ; architecture C2 exacte depend du client et du vehicule porteur.",
    },
    recoverability: "not-applicable",
    industrialRoles: {
      prime: ["Rheinmetall"],
      integrator: ["Rheinmetall"],
      production: ["Europe / clients OTAN selon lots Skyranger 30"],
    },
    sourceContext: {
      contexts: ["official-spec", "secondary-analysis"],
      sourceDate: "2026-05",
      varianceNotes:
        "Profil transverse ajoute pour la fonction C-UAS ; la brique HEL reste demonstrateur et non commande serie.",
    },
  },
  tagline:
    "Le pari de l'effecteur mixte — canon, missiles et laser sur une même tourelle, dont seule la brique laser reste à mûrir.",
  summary:
    "Le Skyranger 30 de Rheinmetall est une tourelle de défense antiaérienne mobile qui associe un canon de 30 mm et des missiles guidés. La variante Skyranger 30 HEL y ajoute un laser haute énergie : l'idée d'une tourelle unique capable de choisir, selon la menace, l'effecteur le moins coûteux — laser contre les drones bon marché, canon et missiles pour le reste.\n\nLe concept est séduisant ; la lecture honnête exige une distinction. La tourelle Skyranger 30 est un succès européen, commandée en nombre par plusieurs armées. La brique laser, elle, reste un démonstrateur d'une vingtaine de kilowatts, absente des commandes de série. Cette fiche documente la variante HEL — donc la partie la moins mûre d'un système par ailleurs éprouvé.",
  keySpecs: [
    {
      label: "Architecture",
      value: "Tourelle hybride — canon 30 mm, missiles guidés, laser",
      confidence: "haute",
      sources: ["rheinmetall", "defense-update"],
    },
    {
      label: "Classe laser actuelle",
      value: "≈ 20 kW (démonstrateur)",
      confidence: "moyenne",
      sources: ["army-recognition"],
    },
    {
      label: "Classe laser visée",
      value: "20-50 kW, objectif à terme 100 kW",
      confidence: "faible",
      status: "variable",
      sources: ["army-recognition"],
    },
    {
      label: "Rôle du laser",
      value: "Cibles « molles » — drones, munitions rôdeuses ; éblouissement optique",
      confidence: "moyenne",
      sources: ["defense-update"],
    },
    {
      label: "Plateforme",
      value: "Tourelle mobile — ex. véhicule Boxer",
      confidence: "haute",
      sources: ["defense-post"],
    },
    {
      label: "Statut du laser",
      value: "Démonstrateur — hors des commandes de série",
      confidence: "haute",
      sources: ["army-recognition"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "L'intérêt économique du Skyranger 30 HEL tient à l'arbitrage : face à un drone bon marché, le laser tire pour quelques unités d'énergie là où un missile coûterait cent fois plus. Une même tourelle peut réserver ses munitions chères aux menaces qui les justifient.\n\nMais ce raisonnement vaut pour un laser qui existe en série. Aujourd'hui, ce que les armées achètent et financent, c'est la tourelle canon-missiles ; le coût du laser reste un coût de développement.",
      indicators: [
        {
          label: "Logique économique",
          value: "Arbitrer l'effecteur le moins coûteux selon la menace",
          confidence: "haute",
          sources: ["defense-update"],
        },
        {
          label: "Coût marginal du tir laser",
          value: "Quelques unités d'énergie par engagement",
          confidence: "moyenne",
          sources: ["crs-dew"],
        },
        {
          label: "Réalité d'achat",
          value: "Les commandes portent sur la tourelle, pas sur le laser",
          confidence: "haute",
          sources: ["defense-post"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le Skyranger 30 est porté par Rheinmetall et par des commandes étatiques : l'armée allemande a commandé une première tranche de tourelles sur véhicule Boxer, suivie d'autres clients européens.\n\nLa brique laser relève d'un financement de développement, pas d'un programme de série. Un contrat industriel pour un télémètre laser de la tourelle a été signé en 2025 — un maillon, pas l'arme laser elle-même.",
      indicators: [
        {
          label: "Maître d'ouvrage",
          value: "Armée allemande et clients européens — tourelle Skyranger 30",
          confidence: "haute",
          sources: ["defense-post"],
        },
        {
          label: "Première tranche allemande",
          value: "19 systèmes sur Boxer (≈ 595 M€), tranches ultérieures prévues",
          confidence: "moyenne",
          sources: ["defense-post"],
        },
        {
          label: "Statut financier du laser",
          value: "Développement — pas de programme de série HEL",
          confidence: "moyenne",
          sources: ["army-recognition"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "Rheinmetall assure la maîtrise d'œuvre du Skyranger 30 et de sa variante laser. La tourelle intègre canon, missiles, capteurs et — pour la variante HEL — une source laser et sa conduite de faisceau.\n\nLa chaîne mobilise aussi des fournisseurs spécialisés : un télémètre laser, par exemple, a fait l'objet d'un contrat avec un industriel suédois. La maturité de la source laser de forte puissance reste le maillon déterminant.",
      indicators: [
        {
          label: "Maître d'œuvre",
          value: "Rheinmetall",
          confidence: "haute",
          sources: ["rheinmetall"],
        },
        {
          label: "Sous-systèmes",
          value: "Canon 30 mm, missiles, capteurs, source laser, conduite de faisceau",
          confidence: "moyenne",
          sources: ["defense-update"],
        },
        {
          label: "Maillon déterminant",
          value: "Maturité et montée en puissance de la source laser",
          confidence: "moyenne",
          sources: ["army-recognition"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "La guerre d'Ukraine a relancé la défense antiaérienne courte portée en Europe, et le Skyranger 30 en est l'un des principaux bénéficiaires : plusieurs armées de l'OTAN l'ont commandé.\n\nLa variante HEL incarne l'étape d'après — donner à cette tourelle un effecteur à magasin profond. Le laser y est moins une rupture qu'une option future, greffée sur un succès commercial déjà acquis.",
      indicators: [
        {
          label: "Contexte stratégique",
          value: "Relance européenne de la défense antiaérienne courte portée",
          confidence: "haute",
          sources: ["defense-post"],
        },
        {
          label: "Diffusion",
          value: "Tourelle commandée par plusieurs armées de l'OTAN",
          confidence: "haute",
          sources: ["defense-post"],
        },
        {
          label: "Rôle du laser",
          value: "Option future greffée sur un système déjà adopté",
          confidence: "moyenne",
          sources: ["army-recognition"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "Le Skyranger 30 est un succès d'exportation au sein de l'OTAN — plusieurs pays voisins l'ont retenu. Sa diffusion relève d'une logique coopérative et de partenariats industriels.\n\nLa variante laser suivrait cette voie si elle mûrissait, mais l'énergie dirigée resterait soumise à des contrôles plus stricts que le canon ou le missile.",
      indicators: [
        {
          label: "Statut export — tourelle",
          value: "Exportée vers plusieurs alliés européens",
          confidence: "haute",
          sources: ["defense-post"],
        },
        {
          label: "Statut export — variante HEL",
          value: "Sans objet — le laser n'est pas un produit de série",
          confidence: "moyenne",
          sources: ["army-recognition"],
        },
        {
          label: "Sensibilité",
          value: "L'énergie dirigée relèverait de contrôles renforcés",
          confidence: "moyenne",
          sources: ["crs-dew"],
        },
      ],
    },
  ],
  physicalConstraints: [
    {
      label: "Ligne de visée",
      value: "Le laser exige une cible vue et suivie — comme tout effecteur DE",
      confidence: "haute",
      sources: ["crs-dew"],
    },
    {
      label: "Atmosphère",
      value: "Pluie, brouillard et poussière dégradent la portée du faisceau",
      confidence: "haute",
      sources: ["crs-dew"],
    },
    {
      label: "Temps d'illumination",
      value: "Le laser traite des cibles « molles » à courte portée",
      confidence: "moyenne",
      sources: ["defense-update"],
    },
    {
      label: "Refroidissement",
      value: "Contrainte d'intégration dans une tourelle déjà dense",
      confidence: "moyenne",
      sources: ["crs-dew"],
    },
    {
      label: "Puissance disponible",
      value: "≈ 20 kW aujourd'hui — la montée en puissance reste à démontrer",
      confidence: "moyenne",
      sources: ["army-recognition"],
    },
    {
      label: "Sécurité laser",
      value: "Zones d'exclusion et risque oculaire encadrent l'emploi",
      confidence: "moyenne",
      sources: ["crs-dew"],
    },
    {
      label: "Effet sur la cible",
      value: "Neutralisation de drones ou éblouissement des capteurs adverses",
      confidence: "moyenne",
      sources: ["defense-update"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Le concept hybride est pertinent et le coût marginal du tir laser très bas ; l'efficacité de la brique laser reste toutefois à démontrer en série.",
    },
    {
      key: "survivabilite",
      grade: "B",
      rationale:
        "Tourelle mobile montée sur véhicule blindé — la mobilité et la diversité d'effecteurs renforcent la résilience du système.",
    },
    {
      key: "exportabilite",
      grade: "B",
      rationale:
        "Le Skyranger 30 est déjà exporté vers plusieurs alliés ; la variante laser suivrait, sous contrôles renforcés, si elle aboutissait.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Rheinmetall est un maître d'œuvre solide et la tourelle est éprouvée ; le risque se concentre sur la maturation de la source laser.",
    },
    {
      key: "maturite",
      grade: "D",
      rationale:
        "La variante HEL en reste à un démonstrateur d'une vingtaine de kilowatts, absente des commandes de série — stade du démonstrateur.",
    },
    {
      key: "confiance-donnees",
      grade: "C",
      rationale:
        "Données surtout industrielles et de presse spécialisée ; les classes de puissance visées sont des objectifs, non des mesures.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : le Skyranger 30 HEL est un système laser de défense antiaérienne en service. La réalité : le laser est un démonstrateur d'environ 20 kW ; ce que les armées européennes achètent, c'est la tourelle canon-missiles.",
    bestUseCase:
      "Le concept hybride — une tourelle unique arbitrant canon, missile ou laser selon la menace, en laissant le laser traiter les drones bon marché — séduisant, si la brique laser mûrit.",
    weakPoint:
      "Justement la brique laser : une vingtaine de kilowatts aujourd'hui, 100 kW en aspiration. Le HEL est l'élément le moins mûr d'un système par ailleurs réussi.",
    analystNote:
      "Le Skyranger 30 HEL est un pari sur l'effecteur mixte. La tourelle elle-même est un succès européen — mais distinguer la tourelle éprouvée du laser démonstrateur est la condition d'une lecture honnête de ce dossier.",
  },
  legalNote:
    "Le Protocole IV de la Convention sur certaines armes classiques interdit les armes laser spécifiquement conçues pour provoquer une cécité permanente. La brique laser du Skyranger 30 vise des drones et l'éblouissement de capteurs ; le CICR rappelle l'obligation de précaution pour éviter d'aveugler lors de l'emploi de tout système laser.",
  operators: [
    "Tourelle Skyranger 30 : Allemagne, Autriche, Danemark, Pays-Bas",
    "Variante HEL : aucun opérateur — stade démonstrateur",
  ],
  theatres: ["Allemagne — essais du démonstrateur laser"],
  timeline: [
    {
      date: "2021",
      label: "Rheinmetall dévoile la variante Skyranger 30 HEL, à effecteur laser.",
      kind: "jalon",
    },
    {
      date: "2024",
      label:
        "L'armée allemande commande 19 tourelles Skyranger 30 sur Boxer — sans la brique laser.",
      kind: "jalon",
    },
    {
      date: "2025",
      label:
        "Commandes du Skyranger 30 par d'autres armées européennes — tourelle canon-missiles.",
      kind: "export",
    },
    {
      date: "2025",
      label: "La brique laser reste un démonstrateur, hors des commandes de série.",
      kind: "debat",
    },
  ],
  sources: [
    {
      id: "rheinmetall",
      title: "The Skyranger 30 HEL",
      publisher: "Rheinmetall",
      type: "constructeur",
      reliability: "B",
      url: "https://www.rheinmetall.com/en/media/news-watch/news/2022/2022-02-04_the-skyranger-30-hel",
    },
    {
      id: "defense-update",
      title:
        "Rheinmetall Introduces Skyranger 30 HEL — a Hybrid Air Defense Vehicle",
      publisher: "Defense Update",
      type: "presse",
      reliability: "C",
      url: "https://defense-update.com/20220204_rheinmetall-introduces-skyranger-30-hel-a-hybrid-air-defense-vehicle-with-missiles-gun-and-laser.html",
    },
    {
      id: "defense-post",
      title: "Rheinmetall's Skyranger 30 Chosen for Major German Military Order",
      publisher: "The Defense Post",
      type: "presse",
      reliability: "C",
      url: "https://thedefensepost.com/2025/08/12/germany-skyranger30-rheinmetall/",
    },
    {
      id: "army-recognition",
      title:
        "Rheinmetall proposes Skyranger 30 HEL hybrid solution for modern mobile air defence",
      publisher: "Army Recognition",
      type: "presse",
      reliability: "C",
      url: "https://www.armyrecognition.com/focus-analysis-conflicts/army/defence-security-industry-technology/rheinmetall-proposes-skyranger-30-hel-hybrid-solution-for-threat-commensurate-modern-mobile-air-defence",
    },
    {
      id: "crs-dew",
      title: "Directed Energy Weapons — report R46925",
      publisher: "Congressional Research Service",
      type: "institution",
      reliability: "A",
      url: "https://crsreports.congress.gov/product/pdf/R/R46925",
    },
  ],
  updated: "2026-05-22",
};
