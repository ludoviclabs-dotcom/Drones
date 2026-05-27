import type { DefenseSystem } from "../types";

export const aargmEr: DefenseSystem = {
  slug: "aargm-er",
  name: "AARGM-ER",
  designation: "AGM-88G Advanced Anti-Radiation Guided Missile — Extended Range",
  reference: "PNP-MSL-008",
  category: "missile",
  missileRole: "ARM",
  classLabel: "Missile anti-radiation à portée étendue — SEAD / DEAD moderne",
  country: "États-Unis",
  flag: "🇺🇸",
  manufacturer: "Northrop Grumman",
  introduced: "2024",
  status:
    "En production — F/A-18E/F, EA-18G ; intégration F-35 (soute interne) en développement",
  acquisitionModes: ["FMS"],
  tagline:
    "Le SEAD/DEAD de la prochaine décennie — guidance multi-mode AARGM héritée, propulsion repensée pour la pénétration des défenses denses.",
  summary:
    "AARGM-ER est l'évolution majeure de la famille AGM-88. Northrop Grumman a conservé la section avant — autodirecteur anti-radiation, GPS/INS, terminal multi-spectral — du missile AARGM AGM-88E déjà en service, et a entièrement redessiné la propulsion pour étendre la portée et permettre l'emport en soute interne du F-35.\n\nLa singularité technique du missile est sa réponse à un problème vieux de quarante ans : un radar adverse qui s'éteint pour échapper à un anti-radiation. AARGM (AGM-88E) introduisait déjà la mémoire de point d'émission et un terminal MMW imageur ; AARGM-ER consolide cette logique avec plus de portée pour permettre le tir hors de l'enveloppe ennemie. C'est le pivot industriel et doctrinal du SEAD/DEAD allié pour la décennie.",
  keySpecs: [
    {
      label: "Guidance",
      value:
        "GPS / INS + anti-radiation homing + terminal multi-spectral MMW (hérité AARGM)",
      confidence: "haute",
      sources: ["northrop-aargm-er", "navair-aargm"],
    },
    {
      label: "Mode anti-shutdown",
      value:
        "Mémoire de point d'émission + capteur terminal — engage même après extinction du radar",
      confidence: "haute",
      sources: ["northrop-aargm-er"],
    },
    {
      label: "Portée",
      value: "Étendue par rapport à AARGM AGM-88E — chiffres exacts classifiés",
      confidence: "moyenne",
      status: "variable",
      sources: ["northrop-aargm-er"],
    },
    {
      label: "Charge militaire",
      value: "Warhead amélioré par rapport à AARGM ; WAU-7/B family",
      confidence: "moyenne",
      sources: ["navair-aargm"],
    },
    {
      label: "Plateformes",
      value:
        "F/A-18E/F Super Hornet, EA-18G Growler ; F-35 (soute interne) en intégration",
      confidence: "haute",
      sources: ["northrop-aargm-er"],
    },
    {
      label: "Site de production",
      value: "Northrop Grumman — Allegany Ballistics Laboratory (ABL)",
      confidence: "haute",
      sources: ["northrop-mif"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "AARGM-ER est en montée en cadence et le coût unitaire public reste partiel. Les justifications budgétaires couvrent la phase de production initiale puis l'extension ; les coûts varieront selon le rythme de production atteint.\n\nLa logique économique est claire : un effecteur SEAD/DEAD reste cher — autodirecteur multi-mode, navigation hybride, terminal MMW. Mais le coût se lit en regard de la cible neutralisée : un radar de défense aérienne moderne coûte plusieurs dizaines de millions d'euros et bloque l'accès à une zone entière. Le ratio coût-effet est favorable.",
      indicators: [
        {
          label: "Coût unitaire public",
          value:
            "Partiellement publié — phase de montée en cadence, P-1 disponibles annuellement",
          confidence: "moyenne",
          sources: ["dod-p1-fy26-aargm-er"],
        },
        {
          label: "Type de coût publié",
          value:
            "Coût budgétaire moyen — flyaway + financement de production",
          confidence: "moyenne",
          sources: ["dod-p1-fy26-aargm-er"],
        },
        {
          label: "Logique économique",
          value:
            "Justifié pour neutraliser des radars haute valeur ouvrant l'accès à une zone défendue",
          confidence: "haute",
          sources: ["northrop-aargm-er"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "AARGM-ER est financé par le DoD au profit de l'US Navy en priorité, avec l'Italie comme partenaire programme historique (héritage AARGM). Northrop Grumman a regroupé toutes les opérations de production finale à Allegany Ballistics Laboratory (ABL) pour gagner en cadence.\n\nLes contrats récents engagent la montée en production sur plusieurs années. L'intégration F-35 — sous Block 4 — déclenchera un cycle additionnel de financement, parce qu'elle ouvre le missile à l'ensemble du parc F-35 international.",
      indicators: [
        {
          label: "Maître d'œuvre",
          value: "Northrop Grumman — site ABL West Virginia",
          confidence: "haute",
          sources: ["northrop-mif"],
        },
        {
          label: "Volume FY2026 demandé",
          value:
            "Précisé dans les justifications budgétaires annuelles US Navy",
          confidence: "moyenne",
          sources: ["dod-p1-fy26-aargm-er"],
        },
        {
          label: "Trajectoire",
          value:
            "Cycle d'intégration F-35 attendu — extension d'arsenal allié à venir",
          confidence: "moyenne",
          sources: ["northrop-aargm-er"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La consolidation industrielle à ABL est l'un des signaux structurants du programme : Northrop a regroupé production finale, intégration et test sur un seul site pour réduire les risques d'attrition de chaîne. C'est une réponse aux leçons des dernières années sur la fragilité des chaînes munitionnaires américaines.\n\nLes composants critiques : section avant AARGM (héritage RTX puis transition à Northrop), nouvelle propulsion, ailes / sections aérodynamiques redessinées, électronique de mission. La chaîne reste domestique américaine ; le partenariat industriel avec l'Italie (héritage AARGM) est conservé.",
      indicators: [
        {
          label: "Site de production final",
          value:
            "Allegany Ballistics Laboratory — Northrop Grumman, West Virginia",
          confidence: "haute",
          sources: ["northrop-mif"],
        },
        {
          label: "Composants critiques",
          value:
            "Section avant AARGM, nouvelle propulsion, ailes, électronique de mission",
          confidence: "haute",
          sources: ["northrop-aargm-er"],
        },
        {
          label: "Partenariat international",
          value: "Italie — héritage programme AARGM, capacité maintenue",
          confidence: "haute",
          sources: ["northrop-aargm-er"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "AARGM-ER est la réponse industrielle US à la consolidation des défenses aériennes denses — chinoises, russes, iraniennes. Sa portée étendue et l'emport interne F-35 visent à restaurer la pénétration alliée en zone très défendue, un sujet où les capacités SEAD/DEAD avaient pris du retard sur l'évolution des IADS adverses.\n\nPour les alliés F-35 — Australie, Royaume-Uni, Norvège, Pays-Bas, Italie, Finlande, Japon, etc. — c'est l'effecteur qui transforme leur F-35 en plateforme SEAD/DEAD utilisable. C'est aussi un objet politique : l'arsenal de pénétration aérienne devient partagé au niveau OTAN.",
      indicators: [
        {
          label: "Fonction stratégique",
          value:
            "Pivot SEAD/DEAD allié pour la décennie 2025-2035",
          confidence: "haute",
          sources: ["northrop-aargm-er"],
        },
        {
          label: "Régime applicable",
          value: "ITAR + MTCR Cat I (portée étendue) — autorisation US",
          confidence: "haute",
          sources: ["itar-22cfr121", "mtcr-guidelines"],
        },
        {
          label: "Effet d'écosystème",
          value:
            "Étend la capacité SEAD/DEAD aux opérateurs F-35 internationaux",
          confidence: "haute",
          sources: ["northrop-aargm-er"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "L'export AARGM-ER se fera prioritairement par FMS aux opérateurs F-35 alliés, après intégration sous Block 4. L'Italie, partenaire programme historique, est utilisateur d'origine de la famille AARGM ; elle accédera donc à AARGM-ER en priorité.\n\nComme PrSM, AARGM-ER cumule ITAR et MTCR Catégorie I — les transferts sont soumis à arbitrage politique américain. Pour les opérateurs F-35 alliés, la trajectoire d'équipement est néanmoins crédible : sans AARGM-ER, un F-35 international ne peut pas remplir la mission SEAD/DEAD dans sa pleine acception.",
      indicators: [
        {
          label: "Canal d'export",
          value:
            "FMS — couplé à l'intégration F-35 Block 4 pour les opérateurs alliés",
          confidence: "haute",
          sources: ["northrop-aargm-er"],
        },
        {
          label: "Régime applicable",
          value: "ITAR + MTCR Cat I — autorisation US et MTCR strict",
          confidence: "haute",
          sources: ["itar-22cfr121", "mtcr-guidelines"],
        },
        {
          label: "Utilisateurs export anticipés",
          value:
            "Italie en priorité ; opérateurs F-35 alliés à mesure de l'intégration Block 4",
          confidence: "moyenne",
          sources: ["northrop-aargm-er"],
        },
      ],
    },
  ],
  variants: [
    {
      label: "AGM-88B HARM",
      value:
        "Standard historique — anti-radiation classique, en service depuis les années 1980",
      confidence: "haute",
      sources: ["navair-aargm"],
    },
    {
      label: "AGM-88E AARGM",
      value:
        "Advanced Anti-Radiation Guided Missile — GPS/INS + ARH + terminal MMW",
      confidence: "haute",
      sources: ["navair-aargm"],
    },
    {
      label: "AGM-88G AARGM-ER",
      value:
        "Extended Range — section avant AARGM héritée, nouvelle propulsion, emport interne F-35",
      confidence: "haute",
      sources: ["northrop-aargm-er"],
    },
    {
      label: "Stand-In Attack Weapon (SiAW)",
      value:
        "Variante à objectifs élargis (multi-target) en développement — capacité étendue au-delà du SEAD pur",
      confidence: "moyenne",
      sources: ["northrop-aargm-er"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Coût élevé mais effecteur essentiel pour la pénétration des IADS modernes — pas d'alternative équivalente côté allié.",
    },
    {
      key: "survivabilite",
      grade: "A",
      rationale:
        "Anti-shutdown éprouvé via AARGM, portée étendue, emport interne F-35 — l'un des effecteurs les mieux placés pour la SEAD moderne.",
    },
    {
      key: "exportabilite",
      grade: "C",
      rationale:
        "ITAR + MTCR Cat I — exporté de façon ciblée, conditionné par l'intégration F-35 Block 4.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Consolidation ABL réduit le risque chaîne ; programme jeune, montée en cadence à valider.",
    },
    {
      key: "maturite",
      grade: "B",
      rationale:
        "Production initiale en cours, héritage AARGM solide ; intégration F-35 et FRP encore à venir.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "NAVAIR, Northrop et budgets DoD publient les jalons ; performances précises et portée classifiées.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un HARM nouvelle génération. La réalité : AARGM-ER conserve la section avant déjà éprouvée d'AARGM — l'innovation est dans la propulsion, l'intégration F-35 et la capacité à tirer plus loin que la portée des radars adverses, pas dans le seeker.",
    bestUseCase:
      "Neutraliser un radar de défense aérienne moderne depuis un F-35 en zone très défendue, en gardant l'avantage tactique du tir hors de l'enveloppe de la cible.",
    weakPoint:
      "La double contrainte ITAR + MTCR I et le calendrier d'intégration F-35 Block 4 — l'export massif n'arrivera qu'avec la maturité de cette intégration.",
    analystNote:
      "AARGM-ER est le test grandeur nature de la capacité industrielle américaine à livrer un effecteur SEAD/DEAD pertinent face aux IADS chinois et russes modernes. Le programme Stand-In Attack Weapon, qui dérive de la même architecture, élargira encore le rôle — à suivre au fil des intégrations.",
  },
  operators: ["États-Unis (Navy en priorité)", "Italie (héritage AARGM)"],
  theatres: ["Pas d'emploi en combat documenté à ce jour"],
  timeline: [
    {
      date: "2017",
      label:
        "Contrat de développement AARGM-ER attribué à Northrop Grumman.",
      kind: "jalon",
    },
    {
      date: "2021",
      label: "Premiers tirs de qualification.",
      kind: "jalon",
    },
    {
      date: "2023",
      label:
        "Lots de production initiale (LRIP) — Northrop ABL site consolidé.",
      kind: "jalon",
    },
    {
      date: "2024",
      label:
        "Première capacité opérationnelle confirmée — F/A-18E/F et EA-18G.",
      kind: "jalon",
    },
    {
      date: "2025",
      label:
        "Travaux d'intégration F-35 Block 4 — emport en soute interne — engagés.",
      kind: "jalon",
    },
  ],
  sources: [
    {
      id: "northrop-aargm-er",
      title: "AARGM-ER — AGM-88G — page produit",
      publisher: "Northrop Grumman",
      type: "constructeur",
      reliability: "B",
      url: "https://www.northropgrumman.com/what-we-do/air/advanced-anti-radiation-guided-missile-extended-range",
    },
    {
      id: "navair-aargm",
      title: "AARGM — Naval Air Systems Command resources",
      publisher: "NAVAIR / US Navy",
      type: "officiel",
      reliability: "A",
      url: "https://www.navair.navy.mil/",
    },
    {
      id: "dod-p1-fy26-aargm-er",
      title: "FY2026 Procurement Justification Book — AARGM-ER line item",
      publisher: "DoD Comptroller — Office of the Under Secretary of Defense",
      type: "officiel",
      reliability: "A",
      url: "https://comptroller.defense.gov/Budget-Materials/",
    },
    {
      id: "northrop-mif",
      title:
        "Northrop Grumman — consolidation de la production AARGM-ER à Allegany Ballistics Laboratory",
      publisher: "Northrop Grumman",
      type: "constructeur",
      reliability: "B",
      url: "https://news.northropgrumman.com/",
    },
    {
      id: "itar-22cfr121",
      title: "International Traffic in Arms Regulations — 22 CFR 121 USML",
      publisher: "U.S. Department of State — DDTC",
      type: "officiel",
      reliability: "A",
      url: "https://www.pmddtc.state.gov/",
    },
    {
      id: "mtcr-guidelines",
      title: "MTCR Guidelines for sensitive missile-relevant transfers",
      publisher: "Missile Technology Control Regime",
      type: "officiel",
      reliability: "A",
      url: "https://mtcr.info/",
    },
  ],
  updated: "2026-05-26",
};
