import type { DefenseSystem } from "../types";

export const fremmFrance: DefenseSystem = {
  slug: "fremm-france",
  name: "FREMM France",
  designation: "Frégates multi-missions — variantes ASM et défense aérienne",
  reference: "PNP-NS-006",
  category: "naval-vessel",
  navalVesselClass: "fregate",
  classLabel: "Frégate de premier rang",
  country: "France · Italie",
  flag: "🇫🇷",
  manufacturer: "Naval Group · Fincantieri · MBDA · Thales",
  introduced: "2012",
  status:
    "En service ; flotte française articulée entre FREMM ASM et FREMM DA",
  acquisitionModes: ["cooperatif", "production-nationale"],
  tagline:
    "La frégate européenne de référence pour lire l'équilibre ASM, défense aérienne, frappe navale et export.",
  summary:
    "La FREMM française est un excellent cas Panoplie : même famille de plateforme, mais variantes et chargements très différents selon l'emploi. Les unités ASM privilégient la lutte sous-marine avec hélicoptère, sonar et torpilles ; les FREMM DA renforcent la défense aérienne.\n\nLe point analytique central est la cohérence système : Herakles, SETIS, CAPTAS-4, Aster, Exocet, MU90, MdCN selon configuration et soutien naval de premier rang. Une fiche FREMM doit donc distinguer famille, variante et standard.",
  keySpecs: [
    {
      label: "Déplacement",
      value: "≈ 6 000 t",
      confidence: "haute",
      sources: ["naval-alsace"],
    },
    {
      label: "Longueur",
      value: "≈ 142 m",
      confidence: "haute",
      sources: ["naval-lorraine"],
    },
    {
      label: "Missions",
      value: "ASM, AAW selon variante, ASuW, frappe dans la profondeur",
      confidence: "haute",
      sources: ["naval-alsace"],
    },
    {
      label: "Capteurs",
      value: "Radar Herakles, sonar de coque, CAPTAS-4 selon version",
      confidence: "moyenne",
      sources: ["thales-captas4"],
    },
    {
      label: "Armements",
      value: "Aster, Exocet, MU90, canon 76 mm ; MdCN sur certaines unités",
      confidence: "moyenne",
      status: "variable",
      sources: ["naval-alsace"],
    },
    {
      label: "Aviation",
      value: "Hélicoptère embarqué NH90 Caïman Marine",
      confidence: "moyenne",
      sources: ["naval-alsace"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "La FREMM illustre un coût de frégate de premier rang : capteurs lourds, sonar remorqué, missiles, aviation embarquée et maintien en condition.\n\nLe bon comparatif ne se limite pas au coût de construction : la valeur vient de la polyvalence réelle, de la capacité ASM et de l'endurance du soutien.",
      indicators: [
        {
          label: "Coût de lecture",
          value: "Frégate haut de gamme — coût complet dominé par capteurs, missiles et MCO",
          confidence: "moyenne",
          sources: ["naval-alsace"],
        },
        {
          label: "Effet",
          value: "Polyvalence de premier rang, forte valeur ASM",
          confidence: "haute",
          sources: ["thales-captas4"],
        },
        {
          label: "Variabilité",
          value: "Configuration différente entre ASM, DA et clients export",
          confidence: "haute",
          status: "variable",
          sources: ["naval-alsace"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "La FREMM est issue d'une logique coopérative franco-italienne, avec déclinaisons nationales. Elle montre l'intérêt et la complexité des programmes européens : mutualiser une famille, puis adapter les standards.\n\nPour Panoplie, c'est un objet de financement hybride : coopération initiale, production nationale, variantes nationales et export.",
      indicators: [
        {
          label: "Origine programme",
          value: "Coopération France-Italie",
          confidence: "haute",
          sources: ["naval-alsace"],
        },
        {
          label: "Standard français",
          value: "ASM et DA selon unités",
          confidence: "haute",
          sources: ["naval-lorraine"],
        },
        {
          label: "Lecture budgétaire",
          value: "Programme de flotte, non achat unitaire isolé",
          confidence: "moyenne",
          sources: ["naval-alsace"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne FREMM croise chantiers navals, CMS, radars, sonars, missiles, guerre électronique et aviation embarquée. Le sonar CAPTAS-4 est un marqueur fort : il transforme la frégate en plateforme ASM crédible à longue portée.\n\nLa chaîne est solide mais dense, avec dépendance aux missiles, capteurs et cycles de MCO.",
      indicators: [
        {
          label: "Maîtres d'oeuvre",
          value: "Naval Group et Fincantieri, avec écosystème Thales / MBDA",
          confidence: "haute",
          sources: ["naval-alsace"],
        },
        {
          label: "Sonar",
          value: "CAPTAS-4 — sonar remorqué basse fréquence sur la famille",
          confidence: "haute",
          sources: ["thales-captas4"],
        },
        {
          label: "Effecteurs",
          value: "Aster, Exocet, MU90, MdCN selon configuration",
          confidence: "moyenne",
          status: "variable",
          sources: ["naval-alsace"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "La FREMM est une brique de souveraineté maritime : escorte du groupe aéronaval, lutte ASM, présence de haute intensité et contribution à la défense aérienne selon variante.\n\nElle porte aussi une lecture européenne : même famille industrielle, mais doctrines nationales et exports différenciés.",
      indicators: [
        {
          label: "Rôle",
          value: "Escorte de premier rang et lutte ASM",
          confidence: "haute",
          sources: ["naval-lorraine"],
        },
        {
          label: "Projection",
          value: "Capable de s'insérer dans un groupe aéronaval ou une force navale alliée",
          confidence: "moyenne",
          sources: ["naval-alsace"],
        },
        {
          label: "Europe navale",
          value: "Coopération industrielle avec adaptations nationales",
          confidence: "haute",
          sources: ["naval-alsace"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "La famille FREMM a une lisibilité export réelle, mais chaque vente est un compromis de standard, capteurs, missiles, intégration et souveraineté client.\n\nC'est une bonne fiche pour rappeler que l'export naval vend autant un soutien de longue durée qu'un bâtiment.",
      indicators: [
        {
          label: "Exportabilité",
          value: "Solide, mais dépendante du standard et du soutien associé",
          confidence: "moyenne",
          sources: ["naval-alsace"],
        },
        {
          label: "Sensibilité",
          value: "Missiles, CMS, guerre électronique et sonars soumis à arbitrages",
          confidence: "moyenne",
          sources: ["thales-captas4"],
        },
        {
          label: "Valeur client",
          value: "Frégate haut de gamme avec forte crédibilité ASM",
          confidence: "haute",
          sources: ["thales-captas4"],
        },
      ],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Frégate coûteuse mais très crédible, surtout quand la mission ASM et l'escorte sont centrales.",
    },
    {
      key: "survivabilite",
      grade: "B",
      rationale:
        "Architecture de premier rang, capteurs solides et défense multicouche, avec limites propres à toute frégate isolée.",
    },
    {
      key: "exportabilite",
      grade: "B",
      rationale:
        "Famille exportable, mais chaque configuration engage missiles, capteurs, formation et soutien long.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Base franco-italienne robuste ; complexité liée aux standards et aux sous-systèmes critiques.",
    },
    {
      key: "maturite",
      grade: "A",
      rationale:
        "Plateforme en service, éprouvée et déclinée en variantes nationales.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "Caractéristiques et rôles bien documentés ; configurations exactes et coûts restent variables.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : une FREMM est une fiche unique. La réalité : la famille recouvre des variantes et standards qui changent la mission réelle.",
    bestUseCase:
      "Escorte de premier rang, lutte ASM et contribution à une force navale structurée.",
    weakPoint:
      "La comparaison brute par tonnage ou VLS masque les différences de capteurs, sonar et standard.",
    analystNote:
      "La FREMM est un dossier parfait pour Panoplie : elle oblige à distinguer plateforme, variante, capteurs, missiles et soutien, sans quoi la comparaison devient trompeuse.",
  },
  operators: [
    "France — Marine nationale",
    "Italie — Marina Militare",
    "Clients export selon variantes",
  ],
  theatres: ["Atlantique", "Méditerranée", "Océan Indien", "Indo-Pacifique"],
  timeline: [
    {
      date: "2012",
      label: "Admission au service de l'Aquitaine, première FREMM française.",
      kind: "jalon",
    },
    {
      date: "2021",
      label: "Livraison de l'Alsace, FREMM à défense aérienne renforcée.",
      kind: "jalon",
    },
    {
      date: "2022",
      label: "La Lorraine, dernière FREMM française, engage ses essais à la mer.",
      kind: "jalon",
    },
  ],
  sources: [
    {
      id: "naval-alsace",
      title:
        "Naval Group delivers FREMM DA frigate Alsace, first multi-missions frigate with enhanced air defence",
      publisher: "Naval Group",
      type: "constructeur",
      reliability: "B",
      date: "2021",
      url: "https://www.naval-group.com/en/naval-group-delivers-fremm-da-frigate-alsace-first-multimissions-frigate-enhanced-air-defence",
    },
    {
      id: "naval-lorraine",
      title: "Naval Group starts sea trials of the last FREMM frigate Lorraine",
      publisher: "Naval Group",
      type: "constructeur",
      reliability: "B",
      date: "2022",
      url: "https://www.naval-group.com/en/naval-group-starts-sea-trials-last-fremm-frigate-lorraine",
    },
    {
      id: "thales-captas4",
      title: "CAPTAS-4 variable depth sonar",
      publisher: "Thales",
      type: "constructeur",
      reliability: "B",
      url: "https://www.thalesgroup.com/en/markets/defence-and-security/naval-forces/underwater-warfare/captas-4",
    },
  ],
  updated: "2026-05-31",
};
