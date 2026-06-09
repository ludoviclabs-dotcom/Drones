import type { DefenseSystem } from "../types";

export const csoMusis: DefenseSystem = {
  slug: "cso-musis",
  name: "CSO / MUSIS",
  designation: "Composante Spatiale Optique — Multinational Space-based Imaging System",
  reference: "PNP-SP-001",
  category: "spatial",
  satelliteClass: "observation",
  classLabel:
    "Constellation française d'observation optique militaire — successeur de Helios 2",
  country: "France",
  flag: "🇫🇷",
  manufacturer: "Airbus Defence and Space · Thales Alenia Space",
  introduced: "2018 (CSO-1)",
  status:
    "En service — constellation complète à 3 satellites (CSO-1, CSO-2, CSO-3)",
  acquisitionModes: ["cooperatif", "production-nationale"],
  tagline:
    "La capacité française d'imagerie optique militaire — souveraineté du renseignement image, partagée avec sept partenaires européens via MUSIS.",
  summary:
    "CSO (Composante Spatiale Optique) est la constellation française d'observation optique militaire, succédant à Helios 2. Trois satellites en orbite basse héliosynchrone fournissent imagerie optique et infrarouge très haute résolution aux forces françaises et aux partenaires européens du programme MUSIS (Allemagne, Belgique, Espagne, Italie, Pologne, Suède).\n\nLa valeur de CSO ne tient pas au satellite isolé. Elle tient au cycle de renseignement complet : demande de prise de vue par les armées, acquisition orbitale, descente de données par les stations sol, traitement image au CMOS de Creil, diffusion aux utilisateurs. C'est l'architecture entière qui produit le renseignement — pas la plateforme spatiale seule. La fiche illustre concrètement ce que signifie « souveraineté du renseignement image » : maîtrise française intégrale du segment spatial, du segment sol, du traitement et de la diffusion.",
  keySpecs: [
    {
      label: "Architecture",
      value: "Constellation de 3 satellites en orbite basse héliosynchrone",
      confidence: "haute",
      sources: ["cnes-cso"],
    },
    {
      label: "Altitudes opérationnelles",
      value: "≈ 480 km (identification) ou 800 km (reconnaissance) selon mission",
      confidence: "haute",
      sources: ["cnes-cso"],
    },
    {
      label: "Charges utiles",
      value:
        "Capteurs optique visible et infrarouge — résolution publique très haute, valeur précise non communiquée",
      confidence: "moyenne",
      sources: ["cnes-cso"],
    },
    {
      label: "Maître d'œuvre",
      value: "Airbus Defence and Space (plateforme) · Thales Alenia Space (charge utile)",
      confidence: "haute",
      sources: ["dga-cso"],
    },
    {
      label: "Cadre multinational",
      value:
        "Programme MUSIS — partenaires Allemagne, Belgique, Espagne, Italie, Pologne, Suède",
      confidence: "haute",
      sources: ["dga-cso"],
    },
    {
      label: "Successeur de",
      value: "Helios 2 (en service 2004–2020)",
      confidence: "haute",
      sources: ["cnes-cso"],
    },
    {
      label: "Calendrier de lancement",
      value:
        "CSO-1 (décembre 2018, Soyouz) · CSO-2 (décembre 2020, Soyouz) · CSO-3 (mars 2024, Ariane 6 — premier vol)",
      confidence: "haute",
      sources: ["cnes-cso", "esa-ariane6"],
    },
    {
      label: "Performances précises",
      value: "Résolution, agilité, capacité de revisite non communiquées",
      confidence: "faible",
      status: "variable",
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le coût total du programme CSO est public à travers la LPM française et les rapports parlementaires de la commission de la défense, sans ventilation détaillée satellite par satellite. Le coût programme se lit à l'échelle de l'écosystème complet : trois satellites, stations sol, centres mission, traitement image, formation, MCO.\n\nLa transition Soyouz → Ariane 6 pour CSO-3 a ajouté une couche de coût et de risque calendaire — l'arrêt brutal des Soyouz commerciaux après 2022 a obligé à attendre le premier vol Ariane 6, soit trois ans de glissement par rapport au calendrier initial.",
      indicators: [
        {
          label: "Coût programme",
          value: "Ordre de grandeur ~1,7 Md€ (estimation publique LPM)",
          confidence: "moyenne",
          status: "variable",
          sources: ["senat-lpm"],
        },
        {
          label: "Coût exploitable",
          value: "Par programme et par tranche LPM — pas par satellite isolé",
          confidence: "haute",
          sources: ["senat-lpm"],
        },
        {
          label: "Impact transition lanceur",
          value:
            "Glissement de ~3 ans entre CSO-2 (Soyouz, 2020) et CSO-3 (Ariane 6, 2024)",
          confidence: "haute",
          sources: ["esa-ariane6"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "CSO est financé par l'État français dans le cadre des LPM 2014-2019 et 2019-2025, sous maîtrise d'ouvrage DGA et maîtrise d'œuvre déléguée CNES. Le programme MUSIS organise un partage d'usage avec six partenaires européens : chacun apporte une contribution financière ou capacitaire en échange d'un quota d'accès aux images.\n\nLe modèle illustre une logique cohérente : financement souverain de la capacité française, contributions partenaires pour mutualiser la production de renseignement image, partage d'usage encadré par accords intergouvernementaux.",
      indicators: [
        {
          label: "Maître d'ouvrage",
          value: "DGA — programme inscrit en LPM 2014-2019 et 2019-2025",
          confidence: "haute",
          sources: ["dga-cso"],
        },
        {
          label: "Maître d'œuvre déléguée",
          value: "CNES — pilotage technique et industriel",
          confidence: "haute",
          sources: ["cnes-cso"],
        },
        {
          label: "Partage MUSIS",
          value:
            "Allemagne, Belgique, Espagne, Italie, Pologne, Suède — quotas selon accord",
          confidence: "haute",
          sources: ["dga-cso"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne CSO est entièrement européenne. Airbus Defence and Space fournit la plateforme et l'intégration ; Thales Alenia Space fournit les charges utiles optique et infrarouge — base industrielle française historique du capteur d'imagerie spatiale de défense.\n\nLe maillon le plus exposé est le lanceur. La rupture Soyouz post-2022 a forcé une reconfiguration pour CSO-3 vers Ariane 6 — démonstration concrète que l'accès souverain à l'espace conditionne la souveraineté du renseignement image. C'est pourquoi la France et l'Europe maintiennent un effort soutenu sur Ariane 6 et Vega-C.",
      indicators: [
        {
          label: "Plateforme",
          value: "Airbus Defence and Space — bus AstroBus M",
          confidence: "haute",
          sources: ["cnes-cso"],
        },
        {
          label: "Charge utile optique + IR",
          value: "Thales Alenia Space",
          confidence: "haute",
          sources: ["cnes-cso"],
        },
        {
          label: "Lanceur",
          value:
            "Soyouz (CSO-1, CSO-2) — Ariane 6 (CSO-3) suite à la rupture Soyouz post-2022",
          confidence: "haute",
          sources: ["esa-ariane6"],
        },
        {
          label: "Segment sol",
          value: "Stations de réception nationales · CMOS Creil pour traitement image",
          confidence: "haute",
          sources: ["dga-cso"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "CSO est une brique de souveraineté du renseignement français. La capacité d'imagerie militaire à très haute résolution est l'un des marqueurs structurants de la défense moderne — sans elle, l'autonomie d'appréciation de situation reste partielle.\n\nLe programme MUSIS étend cette souveraineté en cercle européen : six partenaires accèdent à du renseignement image hors écosystème américain. Le modèle est particulièrement structurant pour l'Allemagne (qui partage CSO et apporte SARah en SAR), formant un binôme image optique/radar européen.",
      indicators: [
        {
          label: "Fonction stratégique",
          value:
            "Souveraineté du renseignement image — autonomie d'appréciation de situation",
          confidence: "haute",
          sources: ["dga-cso"],
        },
        {
          label: "Modèle MUSIS",
          value:
            "Mutualisation européenne du renseignement image hors écosystème américain",
          confidence: "haute",
          sources: ["dga-cso"],
        },
        {
          label: "Binôme image",
          value: "Couplage avec SARah (Allemagne, SAR) — optique FR + radar DE",
          confidence: "moyenne",
          sources: ["dga-cso"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "CSO n'est pas un produit export — c'est une capacité souveraine française mutualisée avec des partenaires européens via MUSIS. Les images sont partagées sous quotas d'accès régis par accords intergouvernementaux ; la plateforme et le segment sol restent sous contrôle français exclusif.\n\nLa fiche illustre une distinction fondamentale du domaine spatial : ce qui s'exporte, ce n'est pas le satellite, c'est l'accès aux données — et cet accès est lui-même une décision politique, pas commerciale.",
      indicators: [
        {
          label: "Statut export",
          value: "Capacité souveraine — pas d'export du satellite ou du segment sol",
          confidence: "haute",
          sources: ["dga-cso"],
        },
        {
          label: "Partage de données",
          value: "Quotas d'accès image via accords MUSIS — décision politique",
          confidence: "haute",
          sources: ["dga-cso"],
        },
        {
          label: "Régime applicable",
          value:
            "Contrôle DGA · données militaires sous classification française · Wassenaar pour composants optroniques avancés",
          confidence: "haute",
          sources: ["dga-cso"],
        },
      ],
    },
  ],
  spaceProfile: {
    orbit: {
      classes: ["LEO", "SSO", "Polar"],
      altitudeKm: "≈ 480 km ou ≈ 800 km selon mission",
      inclinationDeg: "≈ 98° (héliosynchrone)",
      operationalReading:
        "Orbite basse héliosynchrone phasée à trois satellites : passages réguliers à heure solaire locale stable, revisite améliorée par la phasage en constellation, arbitrage altitude/résolution selon la mission (identification à 480 km, reconnaissance à 800 km).",
      notes:
        "Plan polaire — couverture mondiale, y compris latitudes élevées.",
    },
    payloads: [
      {
        type: "optique",
        supplier: "Thales Alenia Space",
        publicDescription:
          "Imagerie visible et infrarouge très haute résolution, valeurs précises non communiquées.",
        sensitivity: "sensible",
      },
      {
        type: "infrarouge",
        supplier: "Thales Alenia Space",
        publicDescription:
          "Complément infrarouge documenté publiquement ; détails opérationnels classifiés.",
        sensitivity: "sensible",
      },
    ],
    architecture: {
      constellationSize: "3 satellites (CSO-1, CSO-2, CSO-3)",
      formationFlying: false,
      serviceContinuityNotes:
        "Constellation phasée à 3 satellites renforçant la capacité de revisite — chaque satellite peut continuer le service en cas d'indisponibilité d'un autre.",
    },
    groundSegment: {
      facilities: [
        "CMOS Creil — Centre Militaire d'Observation par Satellite",
        "Stations de réception nationales",
        "Centres mission CNES Toulouse",
      ],
      dataChain:
        "Demande de prise de vue (armées) → planification (CMOS) → acquisition orbitale → descente de données → traitement image → diffusion renseignement aux utilisateurs.",
    },
    launch: {
      provider:
        "Arianespace (Soyouz pour CSO-1 et CSO-2, Ariane 6 pour CSO-3)",
      site: "Centre spatial guyanais (Kourou)",
      dependencyNotes:
        "Rupture Soyouz post-2022 — CSO-3 reporté ~3 ans pour basculement vers Ariane 6, dont CSO-3 a inauguré le vol commercial. Démonstration de la dépendance souveraine au lanceur.",
    },
    resilience: {
      jammingExposure:
        "Capteurs passifs — peu exposés au brouillage RF, mais segment sol et liaisons de descente restent à protéger.",
      cyberNotes:
        "Liaisons et stations sol durcies sous contrôle national.",
      redundancyNotes:
        "Constellation à 3 satellites — redondance par phasage, pas par redondance technique sur un satellite isolé.",
      replacementStrategy:
        "Successeur post-2030 à l'étude (CSO renouvelé ou nouveau programme) — calendrier de remplacement à suivre.",
    },
  },
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Coût programme élevé en valeur absolue, justifié par la souveraineté du renseignement image et le partage MUSIS.",
    },
    {
      key: "survivabilite",
      grade: "C",
      rationale:
        "Satellites peu exposés en orbite (pas de menace contre-spatiale documentée contre des cibles européennes), mais segment sol et lanceur restent les maillons sensibles.",
    },
    {
      key: "exportabilite",
      grade: "D",
      rationale:
        "Capacité souveraine non exportable ; partage de données via MUSIS = décision politique, pas commerciale.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Chaîne européenne maîtrisée (Airbus, Thales Alenia Space) ; le risque est le lanceur — la transition Soyouz → Ariane 6 l'a démontré.",
    },
    {
      key: "maturite",
      grade: "A",
      rationale:
        "Constellation complète et opérationnelle depuis 2024 — successeur éprouvé de Helios 2.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "Données ouvertes solides sur le calendrier, l'architecture et les partenaires (CNES, DGA, Sénat) ; les performances capteur précises restent classifiées.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un satellite militaire « voit tout » à très haute résolution. La réalité : CSO est une constellation à 3 satellites dont la valeur tient au cycle de renseignement complet (commande, acquisition, traitement, diffusion) autant qu'aux performances optiques — sans le CMOS de Creil, sans les stations sol, le satellite ne produit pas de renseignement exploitable.",
    bestUseCase:
      "Doter la France et ses partenaires MUSIS d'une capacité souveraine d'imagerie optique et infrarouge militaire — autonomie d'appréciation de situation hors écosystème américain.",
    weakPoint:
      "La dépendance au lanceur. La rupture Soyouz post-2022 a forcé un report de ~3 ans pour CSO-3 — démonstration que la souveraineté du renseignement image dépend de la souveraineté d'accès à l'espace.",
    analystNote:
      "CSO est l'archétype du satellite militaire moderne lu comme architecture : un satellite isolé n'a aucune valeur, c'est la chaîne complète qui produit le renseignement. La transition Soyouz → Ariane 6 sur CSO-3 mérite d'être suivie comme cas-école — elle illustre la fragilité réelle du maillon lanceur et la durée nécessaire pour reconfigurer un programme spatial militaire.",
  },
  operators: [
    "France — Armée de l'Air et de l'Espace, Commandement de l'Espace",
    "Allemagne, Belgique, Espagne, Italie, Pologne, Suède (partenaires MUSIS)",
  ],
  theatres: [
    "Couverture mondiale — orbite polaire héliosynchrone",
  ],
  timeline: [
    {
      date: "2010",
      label:
        "Notification du contrat CSO/MUSIS — Airbus Defence and Space maître d'œuvre.",
      kind: "jalon",
    },
    {
      date: "2018-12",
      label:
        "Lancement de CSO-1 depuis Kourou (Soyouz) — premier satellite de la constellation.",
      kind: "jalon",
    },
    {
      date: "2020-12",
      label:
        "Lancement de CSO-2 depuis Kourou (Soyouz) — capacité opérationnelle partielle atteinte.",
      kind: "jalon",
    },
    {
      date: "2022",
      label:
        "Rupture Soyouz post-invasion russe de l'Ukraine — CSO-3 reporté en attente d'Ariane 6.",
      kind: "debat",
    },
    {
      date: "2024-03",
      label:
        "Lancement de CSO-3 sur le premier vol commercial d'Ariane 6 — constellation complète.",
      kind: "jalon",
    },
  ],
  sources: [
    {
      id: "cnes-cso",
      title: "CSO / MUSIS — page projet officielle",
      publisher: "CNES",
      type: "officiel",
      reliability: "A",
      url: "https://cnes.fr/en/projects/cso",
    },
    {
      id: "dga-cso",
      title:
        "Programme CSO / MUSIS — DGA et Ministère des Armées (programmes spatiaux)",
      publisher: "Direction Générale de l'Armement / Ministère des Armées",
      type: "officiel",
      reliability: "A",
      url: "https://www.defense.gouv.fr/dga",
    },
    {
      id: "senat-lpm",
      title:
        "Rapports parlementaires LPM 2014-2019 et 2019-2025 — section programmes spatiaux militaires",
      publisher: "Sénat — Commission des affaires étrangères, de la défense et des forces armées",
      type: "officiel",
      reliability: "A",
      url: "https://www.senat.fr/commission/etr/index.html",
    },
    {
      id: "esa-ariane6",
      title:
        "Vol inaugural Ariane 6 et reconfiguration des charges utiles institutionnelles",
      publisher: "ESA / Arianespace",
      type: "officiel",
      reliability: "A",
      url: "https://www.esa.int/Enabling_Support/Space_Transportation/Ariane",
    },
  ],
  updated: "2026-06-09",
};
