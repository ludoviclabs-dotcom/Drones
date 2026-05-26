import type { DefenseSystem } from "../types";

export const gmlrs: DefenseSystem = {
  slug: "gmlrs",
  name: "GMLRS / ER-GMLRS",
  designation: "Guided Multiple Launch Rocket System — Extended Range",
  reference: "PNP-MSL-012",
  category: "missile",
  missileRole: "SSM",
  classLabel: "Roquette guidée d'artillerie de précision — HIMARS et M270",
  country: "États-Unis",
  flag: "🇺🇸",
  manufacturer: "Lockheed Martin",
  introduced: "2005",
  status:
    "En service — production massive, ER-GMLRS en montée en capacité ; emploi opérationnel intensif",
  acquisitionModes: ["FMS"],
  tagline:
    "L'artillerie de précision OTAN — six roquettes par cellule HIMARS, l'effet capacitaire le plus documenté de la guerre en Ukraine.",
  summary:
    "GMLRS est la roquette guidée de précision conçue par Lockheed Martin pour les lance-roquettes HIMARS et M270. Sa caractéristique est radicalement simple : guidage GPS/INS, propulsion à propergol solide, six roquettes par cellule (deux cellules sur HIMARS, soit douze tirs avant rechargement). Elle a remplacé les roquettes non guidées MLRS de la guerre froide en transformant chaque tir en frappe de précision à 70 km.\n\nER-GMLRS — Extended Range — étend la portée publique à 150 km et entre en production massive pour répondre à la demande post-Ukraine. Pour Panoplie, c'est le cas le plus net de la valeur d'un effecteur produit en grande série : la performance unitaire ne change pas le destin d'une bataille, le volume disponible si. GMLRS est devenu l'archétype de la frappe de précision de masse — une catégorie nouvelle dans le vocabulaire de l'artillerie occidentale.",
  keySpecs: [
    {
      label: "Guidage",
      value: "GNSS (GPS) + INS — fire-and-forget précision métrique",
      confidence: "haute",
      sources: ["lm-gmlrs"],
    },
    {
      label: "Capacité par cellule",
      value: "6 roquettes par cellule (12 par HIMARS, 12 par M270)",
      confidence: "haute",
      sources: ["lm-gmlrs"],
    },
    {
      label: "Portée publique GMLRS",
      value: "70 km — standard",
      confidence: "haute",
      sources: ["lm-gmlrs"],
    },
    {
      label: "Portée publique ER-GMLRS",
      value: "150 km — extended range",
      confidence: "haute",
      sources: ["lm-gmlrs"],
    },
    {
      label: "Charge militaire",
      value: "Unitaire 200 lb (≈ 90 kg) HE — variantes alternative warhead à l'étude",
      confidence: "haute",
      sources: ["lm-gmlrs"],
    },
    {
      label: "Plateformes",
      value:
        "HIMARS (M142), M270A2 ; intégration future sur lanceurs alliés",
      confidence: "haute",
      sources: ["lm-gmlrs"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "GMLRS est l'un des effecteurs guidés les moins coûteux du portefeuille US. Les justifications budgétaires publient des prix au pod (6 roquettes), pas à la roquette seule — l'ordre de grandeur d'environ 170 000 USD par roquette est régulièrement repris en source ouverte.\n\nLa logique économique est radicale : un GMLRS est une munition à coût marginal raisonnable produite en grande série. C'est le seul effecteur guidé occidental dont le coût permet d'envisager un emploi de masse — l'antithèse du PAC-3 MSE à 5,6 M$. Cette polarité coût-effet est l'argument central du programme.",
      indicators: [
        {
          label: "Type de coût publié",
          value: "Coût par pod (6 roquettes) — programme Army P-1",
          confidence: "haute",
          sources: ["army-gmlrs"],
        },
        {
          label: "Ordre de grandeur unitaire",
          value: "≈ 170 000 USD par roquette (estimation source ouverte)",
          confidence: "moyenne",
          status: "variable",
          sources: ["lm-gmlrs"],
        },
        {
          label: "Logique économique",
          value:
            "Munition de précision produite en grande série — emploi de masse possible",
          confidence: "haute",
          sources: ["lm-gmlrs"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "GMLRS est financé par le DoD au profit de l'US Army et des partenaires FMS. La cadence de production a doublé entre 2022 et 2024 pour répondre à la demande post-Ukraine, et Lockheed annonce un objectif > 14 000 roquettes par an à pleine capacité.\n\nC'est le cas le plus net dans l'arsenal allié où la base industrielle a su répondre à l'épreuve de la guerre. Camden (Arkansas) absorbe la majorité de la production, avec des investissements de capacité de plusieurs centaines de millions de dollars confirmés ces deux dernières années.",
      indicators: [
        {
          label: "Cadence actuelle",
          value: "Doublée entre 2022 et 2024 — annonce Lockheed et Army",
          confidence: "haute",
          sources: ["army-gmlrs"],
        },
        {
          label: "Cadence cible",
          value: "> 14 000 roquettes par an à pleine capacité",
          confidence: "haute",
          sources: ["lm-gmlrs"],
        },
        {
          label: "Site de production",
          value:
            "Lockheed Martin — Camden, Arkansas ; investissements de capacité confirmés",
          confidence: "haute",
          sources: ["lm-gmlrs"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne GMLRS est domestique américaine, dominée par Lockheed Martin. Les nœuds critiques : propergol solide (base SRM partagée avec autres munitions), structure composite, navigation GPS/INS, fuze.\n\nL'avantage de la fiche GMLRS est sa simplicité relative — pas d'autodirecteur RF, pas d'IR imageur, pas de PIF/PAF. C'est une roquette guidée bien conçue, produite à très haut volume, dont la chaîne est mature et la courbe d'apprentissage acquise depuis vingt ans. C'est cette simplicité industrielle qui rend la montée en cadence soutenable.",
      indicators: [
        {
          label: "Maître d'œuvre",
          value: "Lockheed Martin — site Camden",
          confidence: "haute",
          sources: ["lm-gmlrs"],
        },
        {
          label: "Composants critiques",
          value:
            "Propergol solide, structure composite, navigation GPS/INS, fuze",
          confidence: "haute",
          sources: ["lm-gmlrs"],
        },
        {
          label: "Effort de montée en cadence",
          value:
            "Investissements Camden confirmés — chaîne mature qui supporte la croissance",
          confidence: "haute",
          sources: ["army-gmlrs"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "GMLRS est devenu en deux ans un objet de doctrine et de diplomatie. Les livraisons HIMARS + GMLRS à l'Ukraine ont structuré la frappe ukrainienne dans la profondeur opérative à partir de 2022 — cibles de C2, dépôts logistiques, points de passage. C'est l'un des programmes les plus documentés en termes d'emploi opérationnel récent.\n\nLa fiche illustre ainsi la valeur stratégique d'une munition produite en série : sa diffusion crée un standard tactique partagé, sa cadence définit la profondeur opérative soutenable, et sa cession devient un instrument diplomatique de premier ordre.",
      indicators: [
        {
          label: "Fonction stratégique",
          value:
            "Pilier de l'artillerie de précision OTAN — frappe opérative",
          confidence: "haute",
          sources: ["lm-gmlrs"],
        },
        {
          label: "Régime applicable",
          value: "ITAR — defense article sous autorisation US",
          confidence: "haute",
          sources: ["itar-22cfr121"],
        },
        {
          label: "Emploi en Ukraine",
          value:
            "Documenté massivement depuis 2022 — structuration de la frappe ukrainienne",
          confidence: "haute",
          sources: ["army-gmlrs"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "L'export GMLRS suit l'export HIMARS/M270 — Royaume-Uni, Allemagne, Italie, Pologne, Roumanie, Estonie, Lettonie, Lituanie, Pays-Bas, Australie, Singapour, Taïwan, et bien d'autres. C'est l'effecteur de précision le plus largement diffusé dans le segment artillerie alliée.\n\nLe régime ITAR s'applique. La portée < 300 km (et < 500 km pour ER-GMLRS) évite la classification MTCR Catégorie I, ce qui fluidifie les arbitrages export — contraste explicite avec PrSM, qui partage la même plateforme HIMARS mais tombe en Cat I.",
      indicators: [
        {
          label: "Canal d'export dominant",
          value: "FMS — couplé aux contrats HIMARS et M270",
          confidence: "haute",
          sources: ["lm-gmlrs"],
        },
        {
          label: "Régime applicable",
          value:
            "ITAR ; pas de Cat MTCR I — portée < 300 km",
          confidence: "haute",
          sources: ["itar-22cfr121", "mtcr-guidelines"],
        },
        {
          label: "Diffusion",
          value:
            "L'effecteur de précision le plus exporté du segment artillerie",
          confidence: "haute",
          sources: ["lm-gmlrs"],
        },
      ],
    },
  ],
  variants: [
    {
      label: "GMLRS Unitary",
      value: "Standard — charge unitaire HE 200 lb, 70 km",
      confidence: "haute",
      sources: ["lm-gmlrs"],
    },
    {
      label: "GMLRS Alternative Warhead",
      value:
        "Charge fragmentation pré-formée — remplace les DPICM proscrites par CCM",
      confidence: "haute",
      sources: ["lm-gmlrs"],
    },
    {
      label: "ER-GMLRS",
      value:
        "Extended Range — 150 km, en montée en capacité, demande post-Ukraine forte",
      confidence: "haute",
      sources: ["lm-gmlrs"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "A",
      rationale:
        "Coût marginal raisonnable pour une munition guidée, volume de production massif — emploi de masse possible.",
    },
    {
      key: "survivabilite",
      grade: "B",
      rationale:
        "Roquette balistique guidée GPS — vulnérable au brouillage GNSS local mais difficile à intercepter sur trajectoire.",
    },
    {
      key: "exportabilite",
      grade: "A",
      rationale:
        "ITAR mais hors MTCR I — fluidité d'export, diffusion très large dans l'OTAN.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Chaîne Camden mature, base SRM sous tension mais cadence en hausse documentée.",
    },
    {
      key: "maturite",
      grade: "A",
      rationale:
        "En service depuis 2005, emploi en combat massif — Irak, Afghanistan, Ukraine.",
    },
    {
      key: "confiance-donnees",
      grade: "A",
      rationale:
        "Justifications budgétaires Army, datasheet Lockheed, sources OSINT abondantes.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : une roquette d'artillerie comme les autres. La réalité : la précision GPS sur munition de masse a créé une catégorie nouvelle — la frappe opérative de précision en volume, ce qui a transformé la doctrine artillerie occidentale.",
    bestUseCase:
      "Frapper en profondeur opérative un C2 mobile, un dépôt logistique ou un point de passage adverse, avec une cadence permettant la saturation et le ciblage discriminé.",
    weakPoint:
      "La vulnérabilité au brouillage GNSS local — les opérateurs récents intègrent INS plus robuste, mais la dépendance au signal reste un point sensible en environnement de haute intensité.",
    analystNote:
      "GMLRS est l'effecteur qui a réécrit la valeur d'un lance-roquettes léger en deux ans de retour d'expérience Ukraine. C'est la munition que les alliés veulent en plus grand nombre. La cadence Camden et la version ER-GMLRS sont les deux variables à suivre pour la décennie.",
  },
  operators: [
    "États-Unis",
    "Royaume-Uni",
    "Allemagne",
    "Italie",
    "Pologne",
    "Roumanie",
    "Estonie",
    "Lettonie",
    "Lituanie",
    "Pays-Bas",
    "Australie",
    "Singapour",
    "Taïwan",
    "Ukraine",
  ],
  theatres: [
    "Irak 2007-2011 — premier emploi opérationnel large",
    "Afghanistan — frappes de précision en relief",
    "Ukraine — depuis 2022, frappes massives en profondeur opérative",
  ],
  timeline: [
    {
      date: "2005",
      label: "Mise en service initiale de GMLRS — US Army.",
      kind: "jalon",
    },
    {
      date: "2007",
      label: "Premier emploi opérationnel massif — Irak.",
      kind: "emploi",
    },
    {
      date: "2022",
      label:
        "Livraisons HIMARS + GMLRS à l'Ukraine — restructuration de la frappe ukrainienne.",
      kind: "export",
    },
    {
      date: "2023",
      label:
        "Lockheed Martin annonce le doublement de cadence à Camden.",
      kind: "jalon",
    },
    {
      date: "2024",
      label:
        "ER-GMLRS en production — portée 150 km, montée en capacité.",
      kind: "jalon",
    },
  ],
  sources: [
    {
      id: "lm-gmlrs",
      title:
        "Guided MLRS — pages produit GMLRS et ER-GMLRS",
      publisher: "Lockheed Martin",
      type: "constructeur",
      reliability: "B",
      url: "https://www.lockheedmartin.com/en-us/products/guided-mlrs-unitary-rocket.html",
    },
    {
      id: "army-gmlrs",
      title:
        "GMLRS — programme U.S. Army et justifications budgétaires",
      publisher: "U.S. Army",
      type: "officiel",
      reliability: "A",
      url: "https://www.army.mil/",
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
