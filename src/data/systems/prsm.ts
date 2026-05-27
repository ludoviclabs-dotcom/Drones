import type { DefenseSystem } from "../types";

export const prsm: DefenseSystem = {
  slug: "prsm",
  name: "PrSM",
  designation: "Precision Strike Missile",
  reference: "PNP-MSL-005",
  category: "missile",
  missileRole: "SSM",
  classLabel: "Missile tactique sol-sol longue portée — successeur ATACMS",
  country: "États-Unis",
  flag: "🇺🇸",
  manufacturer: "Lockheed Martin",
  introduced: "2024",
  status:
    "Capacité opérationnelle initiale atteinte ; production-déploiement, Increment 1 en service",
  acquisitionModes: ["production-nationale", "FMS"],
  tagline:
    "Le remplaçant ATACMS — plus longue portée, deux missiles par cellule HIMARS, conçu pour la frappe dans la profondeur OTAN.",
  summary:
    "PrSM est le missile tactique sol-sol développé par Lockheed Martin pour remplacer l'ATACMS dans le portefeuille de l'US Army. Sa caractéristique structurante : deux missiles tirés depuis une seule cellule HIMARS ou M270 — là où ATACMS occupait un pod complet. Cela double la capacité de feu d'une plateforme déjà éprouvée en Ukraine et au Levant.\n\nL'Increment 1 — Land-based Anti-Ship Missile Increment 0 (LBASM) en chantier également — porte la première capacité opérationnelle, avec une portée publique supérieure à 400 km, et des incréments futurs visant l'anti-navire et les très longues portées. PrSM est aujourd'hui l'un des programmes munitionnaires US les plus suivis, parce qu'il conditionne la doctrine de feu longue portée pour la décennie à venir.",
  keySpecs: [
    {
      label: "Portée publique Increment 1",
      value: "Supérieure à 400 km — confirmée publiquement par l'US Army",
      confidence: "haute",
      sources: ["army-prsm", "lm-prsm"],
    },
    {
      label: "Capacité par cellule",
      value: "2 missiles par cellule HIMARS / M270 — doublement vs ATACMS",
      confidence: "haute",
      sources: ["lm-prsm"],
    },
    {
      label: "Guidage",
      value: "GNSS + INS ; architecture ouverte pour intégrations futures",
      confidence: "haute",
      sources: ["lm-prsm"],
    },
    {
      label: "Plateformes",
      value: "HIMARS, M270A2 — pods compatibles MFOM",
      confidence: "haute",
      sources: ["lm-prsm"],
    },
    {
      label: "Charge militaire",
      value:
        "Insensitive Munition (IM) — détails et variantes selon incrément",
      confidence: "moyenne",
      sources: ["lm-prsm"],
    },
    {
      label: "Statut programme",
      value:
        "Capacité opérationnelle initiale (EOC) atteinte ; production en montée en cadence",
      confidence: "haute",
      sources: ["army-prsm"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "PrSM est un missile cher à l'unité — la demande FY2026 publie un coût budgétaire moyen de l'ordre de 8 M$. C'est le prix d'un effecteur tactique longue portée avec doublement de capacité par cellule.\n\nCe coût se lit en regard du multiplicateur de feu : un HIMARS désormais capable de tirer deux PrSM augmente massivement la valeur ajoutée d'un système qui coûtait déjà cher à acquérir et à protéger. La courbe d'apprentissage industrielle devrait améliorer le coût unitaire au fil des incréments — un schéma vu sur GMLRS.",
      indicators: [
        {
          label: "Coût budgétaire unitaire FY2026",
          value: "≈ 8,08 M$ par missile",
          confidence: "haute",
          note: "363,662 M$ / 45 missiles — demande FY2026.",
          sources: ["dod-p1-fy26-prsm"],
        },
        {
          label: "Type de coût publié",
          value: "Coût budgétaire moyen — production de montée en cadence",
          confidence: "haute",
          sources: ["dod-p1-fy26-prsm"],
        },
        {
          label: "Lecture économique",
          value:
            "Doublement de capacité par cellule HIMARS — facteur central du coût-efficacité",
          confidence: "haute",
          sources: ["lm-prsm"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "PrSM est un programme central du budget Army — l'un des très hauts financements munitionnaires hors PAC-3. L'enjeu financier est double : tenir la cadence de production Increment 1 et financer parallèlement les incréments suivants (anti-navire, capacités longue portée).\n\nLockheed Martin a engagé des investissements de capacité à Camden (Arkansas), site historique de production des effecteurs Army longue portée. Le rythme de financement actuel pose un cadre clair : remplacer ATACMS sur l'ensemble de la décennie.",
      indicators: [
        {
          label: "Volume FY2026 demandé",
          value: "45 missiles — US Army",
          confidence: "haute",
          sources: ["dod-p1-fy26-prsm"],
        },
        {
          label: "Trajectoire de financement",
          value:
            "Programme prioritaire Army — incréments multiples financés en parallèle",
          confidence: "haute",
          sources: ["army-prsm"],
        },
        {
          label: "Site de production",
          value:
            "Lockheed Martin — Camden, Arkansas ; site historique des effecteurs Army",
          confidence: "haute",
          sources: ["lm-prsm"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne PrSM est domestique américaine, sous maîtrise d'œuvre Lockheed, et croise les mêmes nœuds critiques que GMLRS et JAGM : propergol solide, électronique, guidage GNSS. La base SRM nationale est la même que celle qui alimente AMRAAM et PAC-3 — d'où la criticité de la sécurisation engagée par RTX et Lockheed.\n\nL'architecture ouverte annoncée pour PrSM est un choix structurant : elle permet, dans les incréments futurs, d'intégrer des seekers anti-navire ou des capacités SEAD sans refaire l'effecteur. C'est une réponse industrielle à l'évolution rapide de la menace.",
      indicators: [
        {
          label: "Maître d'œuvre",
          value: "Lockheed Martin — site Camden",
          confidence: "haute",
          sources: ["lm-prsm"],
        },
        {
          label: "Composants critiques",
          value: "Propergol solide, GNSS / INS, calculateur, structure composite",
          confidence: "haute",
          sources: ["lm-prsm"],
        },
        {
          label: "Architecture",
          value:
            "Open Systems Architecture — extensions seeker et propulsion prévues par incrément",
          confidence: "haute",
          sources: ["army-prsm"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "PrSM redéfinit le profil de la frappe Army US à longue portée : ATACMS a montré son utilité tactique en Ukraine ; PrSM en démultiplie l'effet par le doublement de capacité par cellule et l'allonge de portée. C'est une capacité que les alliés OTAN observent avec attention pour leurs propres programmes — au Royaume-Uni, en Australie, et en Europe continentale.\n\nLes premiers contrats FMS sont annoncés — Australie en tête. La géopolitique du programme se lit donc à deux niveaux : effecteur national clé pour la doctrine Multi-Domain Operations, et nouveau standard exportable du segment.",
      indicators: [
        {
          label: "Fonction stratégique",
          value:
            "Pilier de la frappe Army longue portée — doctrine Multi-Domain Operations",
          confidence: "haute",
          sources: ["army-prsm"],
        },
        {
          label: "Régime applicable",
          value: "ITAR — defense article sous autorisation US",
          confidence: "haute",
          sources: ["itar-22cfr121"],
        },
        {
          label: "Signal export",
          value:
            "Australie — premier client export confirmé ; intérêts UK et Europe documentés",
          confidence: "moyenne",
          sources: ["lm-prsm"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "PrSM relève du régime ITAR comme defense article. Son export pose la question du respect des seuils MTCR — portée > 300 km, charge > 500 kg — qui catégorise PrSM en MTCR Catégorie I et soumet les transferts à un contrôle strict.\n\nLa cession à l'Australie sous AUKUS, par exemple, illustre que la mécanique est jouable mais conditionnée. Pour les autres prospects, le calendrier d'export dépendra à la fois de la capacité de production et de l'arbitrage politique américain — moins libéral pour cette catégorie que pour AMRAAM ou JAGM.",
      indicators: [
        {
          label: "Catégorie MTCR",
          value: "Catégorie I — portée > 300 km, contrôles renforcés",
          confidence: "haute",
          sources: ["mtcr-guidelines"],
        },
        {
          label: "Régime applicable",
          value: "ITAR + MTCR — double contrainte de transfert",
          confidence: "haute",
          sources: ["itar-22cfr121", "mtcr-guidelines"],
        },
        {
          label: "Utilisateurs export annoncés",
          value: "Australie sous AUKUS — premier transfert confirmé",
          confidence: "moyenne",
          sources: ["lm-prsm"],
        },
      ],
    },
  ],
  variants: [
    {
      label: "PrSM Increment 1",
      value: "Standard initial — portée > 400 km, frappe terrestre",
      confidence: "haute",
      sources: ["army-prsm"],
    },
    {
      label: "PrSM Increment 2",
      value:
        "Anti-navire — seeker maritime, capacité littorale annoncée",
      confidence: "moyenne",
      sources: ["lm-prsm"],
    },
    {
      label: "PrSM Increments 3 / 4",
      value:
        "Longues portées étendues, charge alternative — feuille de route Lockheed / Army",
      confidence: "faible",
      status: "a-recouper",
      sources: ["lm-prsm"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Coût unitaire élevé mais doublement de la capacité par cellule HIMARS — multiplicateur de feu majeur.",
    },
    {
      key: "survivabilite",
      grade: "B",
      rationale:
        "Trajectoire balistique, propulsion solide, signature thermique au lancement ; valeur tactique tient à la portée et au volume.",
    },
    {
      key: "exportabilite",
      grade: "C",
      rationale:
        "Catégorie MTCR I + ITAR — transferts soumis à arbitrage politique américain strict.",
    },
    {
      key: "risque-industriel",
      grade: "C",
      rationale:
        "Base SRM partagée avec autres effecteurs prioritaires — tension structurelle.",
    },
    {
      key: "maturite",
      grade: "B",
      rationale:
        "EOC atteinte, premières unités déployées ; incréments futurs encore en développement.",
    },
    {
      key: "confiance-donnees",
      grade: "A",
      rationale:
        "Documents Army et budget DoD ouverts ; portée précise et payloads variants restent partiellement classifiés.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un ATACMS amélioré. La réalité : un changement de paradigme tactique — deux missiles par cellule transforment la valeur d'un HIMARS, et l'architecture ouverte engage la décennie d'évolution des feux longue portée Army.",
    bestUseCase:
      "Frapper en profondeur depuis un système HIMARS déjà éprouvé — C2, logistique, défense aérienne longue portée — en triplant la cadence par rapport à ATACMS.",
    weakPoint:
      "La double contrainte ITAR + MTCR I — chaque demande export est un dossier politique majeur, pas une transaction routinière.",
    analystNote:
      "PrSM est l'archétype du programme de souveraineté capacitaire repensé pour la décennie : une seule munition, plusieurs incréments, un effet multiplicateur pour la plateforme déjà déployée. Suivre la cadence Camden — c'est elle qui dira si l'Army tient la doctrine annoncée.",
  },
  operators: ["États-Unis", "Australie (commande confirmée)"],
  theatres: ["Pas d'emploi en combat documenté à ce jour"],
  timeline: [
    {
      date: "2019",
      label:
        "Premiers tirs de qualification — Lockheed Martin sélectionné, Raytheon abandonne.",
      kind: "jalon",
    },
    {
      date: "2023",
      label: "Premières livraisons LRIP à l'US Army.",
      kind: "jalon",
    },
    {
      date: "2024",
      label:
        "Capacité opérationnelle initiale atteinte ; déploiement en unités Army.",
      kind: "jalon",
    },
    {
      date: "2024",
      label:
        "Commande export Australie confirmée — premier client international.",
      kind: "export",
    },
  ],
  sources: [
    {
      id: "army-prsm",
      title: "PrSM — Precision Strike Missile — programme U.S. Army",
      publisher: "U.S. Army",
      type: "officiel",
      reliability: "A",
      url: "https://www.army.mil/",
    },
    {
      id: "lm-prsm",
      title: "Precision Strike Missile — page produit Lockheed Martin",
      publisher: "Lockheed Martin",
      type: "constructeur",
      reliability: "B",
      url: "https://www.lockheedmartin.com/en-us/products/precision-strike-missile.html",
    },
    {
      id: "dod-p1-fy26-prsm",
      title: "FY2026 Procurement Justification Book — PrSM line item",
      publisher: "DoD Comptroller — Office of the Under Secretary of Defense",
      type: "officiel",
      reliability: "A",
      url: "https://comptroller.defense.gov/Budget-Materials/",
    },
    {
      id: "mtcr-guidelines",
      title: "MTCR Guidelines for sensitive missile-relevant transfers",
      publisher: "Missile Technology Control Regime",
      type: "officiel",
      reliability: "A",
      url: "https://mtcr.info/",
    },
    {
      id: "itar-22cfr121",
      title: "International Traffic in Arms Regulations — 22 CFR 121 USML",
      publisher: "U.S. Department of State — DDTC",
      type: "officiel",
      reliability: "A",
      url: "https://www.pmddtc.state.gov/",
    },
  ],
  updated: "2026-05-26",
};
