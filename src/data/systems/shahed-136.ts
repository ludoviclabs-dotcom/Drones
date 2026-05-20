import type { DefenseSystem } from "../types";

export const shahed136: DefenseSystem = {
  slug: "shahed-136",
  name: "Shahed-136",
  designation: "HESA Shahed-136 — « Geran-2 »",
  reference: "PNP-DR-003",
  category: "drone",
  droneClass: "munition-rodeuse",
  classLabel: "Munition rôdeuse",
  country: "Iran",
  flag: "🇮🇷",
  manufacturer: "HESA (Iran) — production russe sous licence",
  introduced: "2021",
  status: "En service — production de masse (Iran et Russie)",
  acquisitionModes: ["production-nationale"],
  tagline:
    "La munition rôdeuse à bas coût qui a fait de la quantité une arme stratégique.",
  summary:
    "Le Shahed-136 est un drone d'attaque à sens unique : une aile delta en matériaux simples, un petit moteur à hélice, une charge explosive — et un prix dérisoire à l'échelle de l'armement moderne. Conçu en Iran, il a été employé en masse par la Russie contre l'Ukraine, qui l'a surnommé d'après le bourdonnement caractéristique de son moteur.\n\nSa portée n'est pas technique mais économique et doctrinale : produit par milliers, lancé en essaims, il sature les défenses et impose à l'adversaire un échange de coûts ruineux. Le Shahed incarne le retour de la quantité comme facteur stratégique — et la zone grise juridique des transferts d'armes.",
  keySpecs: [
    { label: "Envergure", value: "≈ 3,5 m", confidence: "moyenne" },
    {
      label: "Charge militaire",
      value: "≈ 30–50 kg",
      confidence: "faible",
      note: "Estimations ouvertes ; plusieurs variantes existent.",
    },
    {
      label: "Portée",
      value: "≈ 1 000–2 500 km",
      confidence: "faible",
      note: "Données très dispersées selon les sources.",
    },
    { label: "Vitesse", value: "≈ 180 km/h", confidence: "faible" },
    {
      label: "Motorisation",
      value: "Petit moteur à hélice",
      confidence: "moyenne",
    },
    {
      label: "Guidage",
      value: "Navigation inertielle + GNSS",
      confidence: "moyenne",
      note: "Sensible au brouillage.",
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le Shahed inverse l'économie de la frappe — mais son coût réel est l'une des données les plus disputées du conflit. Trois chiffres coexistent : un coût de fabrication estimé à quelques dizaines de milliers de dollars, un coût de production russe à Alabuga de l'ordre de 70 000 à 80 000 $, et un prix de cession Iran-Russie bien supérieur — environ 190 000 à 300 000 $ par appareil selon des documents ayant fuité.\n\nL'essentiel n'est pas le chiffre exact mais le ratio : même à 80 000 $, le Shahed reste sans commune mesure avec l'intercepteur sol-air — souvent dix à trente fois plus cher — qu'il force le défenseur à tirer.",
      indicators: [
        {
          label: "Coût de fabrication estimé",
          value: "≈ 20 000–50 000 $",
          confidence: "faible",
          note: "Estimation d'experts ; coût matériel, hors marge.",
        },
        {
          label: "Coût de production (Alabuga)",
          value: "≈ 70 000–80 000 $",
          confidence: "faible",
          note: "Production russe localisée — estimations 2024.",
        },
        {
          label: "Prix de cession Iran-Russie",
          value: "≈ 190 000–300 000 $",
          confidence: "faible",
          note: "Prix payé par la Russie en 2022-2023, selon documents ayant fuité.",
        },
        {
          label: "Logique de coût",
          value: "Ratio d'échange défavorable au défenseur",
          confidence: "haute",
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le Shahed n'obéit pas à une logique de marché classique. Il n'y a ni catalogue ni contrat encadré : sa diffusion relève de transferts d'État à État, partiellement opaques, entre l'Iran et la Russie.\n\nLe financement de la production de masse est désormais largement russe : Moscou a investi dans une capacité industrielle nationale pour s'affranchir des livraisons iraniennes. C'est un financement de guerre, pensé pour le volume et la durée.",
      indicators: [
        {
          label: "Cadre de financement",
          value: "Transferts d'État à État ; production financée par la Russie",
          confidence: "moyenne",
        },
        {
          label: "Canal d'acquisition",
          value: "Hors marché — accord bilatéral Iran-Russie",
          confidence: "haute",
        },
        {
          label: "Logique",
          value: "Financement de guerre orienté volume",
          confidence: "moyenne",
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La supply chain du Shahed est un cas d'école du contournement des sanctions. L'analyse de débris retrouvés en Ukraine a révélé une dépendance massive à des composants électroniques commerciaux d'origine occidentale — semi-conducteurs, microcontrôleurs, modules de navigation.\n\nDrone « pauvre » dans sa cellule, il reste « riche » dans son électronique. Sa production de masse repose sur la capacité à se procurer ces puces malgré les contrôles — un défi logistique autant qu'industriel.",
      indicators: [
        {
          label: "Cellule",
          value: "Matériaux simples, fabrication peu exigeante",
          confidence: "moyenne",
        },
        {
          label: "Composants critiques",
          value: "Électronique commerciale d'origine occidentale",
          confidence: "moyenne",
          note: "Constat issu d'analyses de débris.",
        },
        {
          label: "Vulnérabilité",
          value: "Production dépendante de l'accès aux puces",
          confidence: "moyenne",
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Le Shahed a fait de l'Iran un fournisseur d'armes de premier plan dans une guerre majeure, et scellé un rapprochement militaro-industriel avec la Russie. Le transfert a aussi nourri une crise diplomatique : il pose la question du respect des résolutions onusiennes encadrant les transferts liés à l'Iran.\n\nPour les défenseurs, le Shahed a accéléré une course mondiale aux défenses anti-drones à bas coût.",
      indicators: [
        {
          label: "Fonction stratégique",
          value: "Levier d'influence iranien ; axe Iran-Russie",
          confidence: "moyenne",
        },
        {
          label: "Controverse",
          value: "Conformité aux résolutions de l'ONU contestée",
          confidence: "moyenne",
        },
        {
          label: "Effet induit",
          value: "Course aux défenses anti-drones bon marché",
          confidence: "haute",
        },
      ],
    },
    {
      key: "export",
      narrative:
        "Le « commerce » du Shahed se situe dans une zone grise. Il ne s'agit pas d'une exportation encadrée par un régime de contrôle, mais d'un transfert que plusieurs États jugent contraire aux engagements internationaux pesant sur l'Iran.\n\nLe Shahed échappe ainsi aux logiques d'autorisation, de certificat d'utilisateur final et de traçabilité — précisément ce que les régimes d'export cherchent à garantir. Son cas illustre les limites du système quand un fournisseur choisit de s'en affranchir.",
      indicators: [
        {
          label: "Régime applicable",
          value: "Hors régime de contrôle — transfert contesté",
          confidence: "moyenne",
        },
        {
          label: "Conformité",
          value: "Jugée contraire aux engagements ONU par plusieurs États",
          confidence: "moyenne",
        },
        {
          label: "Traçabilité",
          value: "Faible — pas de certificat d'utilisateur final",
          confidence: "moyenne",
        },
      ],
      organisms: ["unscr-2231", "tca"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "A",
      rationale:
        "Arme délibérément frugale : un coût dérisoire pour un effet de saturation et un ratio d'échange très favorable à l'attaquant.",
    },
    {
      key: "survivabilite",
      grade: "E",
      rationale:
        "Lent, bruyant, volant bas : un Shahed isolé est aisément abattu. Sa survie tient au nombre, pas à l'individu — par conception.",
    },
    {
      key: "exportabilite",
      grade: "D",
      rationale:
        "Hors de tout régime de contrôle légitime : sa cession relève de transferts contestés, non d'un marché ouvert.",
    },
    {
      key: "risque-industriel",
      grade: "C",
      rationale:
        "Cellule simple, mais production de masse suspendue à l'accès — sous sanctions — à l'électronique commerciale.",
    },
    {
      key: "maturite",
      grade: "B",
      rationale:
        "Employé en masse et en continu depuis 2022 ; conception simple, éprouvée au combat et en évolution constante.",
    },
    {
      key: "confiance-donnees",
      grade: "D",
      rationale:
        "Données dispersées et souvent invérifiables : coût, portée et chiffres de production varient fortement d'une source à l'autre.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : une arme rudimentaire et négligeable. La réalité : le Shahed est rudimentaire par choix. Sa simplicité est une stratégie industrielle — il est conçu pour être produit en masse et perdu en masse. Le sous-estimer, c'est confondre la valeur d'un vecteur isolé et l'effet d'un essaim.",
    bestUseCase:
      "Frappe en profondeur et harcèlement par saturation contre infrastructures et défenses adverses, dans une logique d'usure et d'épuisement des stocks d'intercepteurs.",
    weakPoint:
      "Le vecteur isolé : lent, bruyant, à basse altitude, vulnérable au brouillage GNSS et à une interception bon marché. Toute la doctrine repose sur la compensation par le nombre.",
    analystNote:
      "Le Shahed-136 n'est pas une prouesse technique : c'est une thèse stratégique. Il affirme que la quantité, le coût et la cadence de production valent capacité militaire. Sa principale conséquence n'est pas sur le champ de bataille, mais dans les bureaux d'études : il a relancé partout la quête d'une défense anti-drone réellement abordable.",
  },
  operators: ["Iran", "Russie (sous la désignation « Geran-2 »)"],
  theatres: ["Ukraine", "Moyen-Orient"],
  sources: [
    {
      id: "car-shahed",
      title: "Analyses de composants de systèmes documentés sur le terrain",
      publisher: "Conflict Armament Research",
      type: "institution",
      reliability: "A",
      url: "https://www.conflictarm.com",
    },
    {
      id: "csis-supplychain",
      title: "The Drone Supply Chain War — Identifying the Chokepoints",
      publisher: "CSIS",
      type: "think-tank",
      reliability: "B",
      url: "https://www.csis.org/analysis/drone-supply-chain-war-identifying-chokepoints-making-drone",
    },
    {
      id: "sipri-at",
      title: "Arms Transfers Database",
      publisher: "SIPRI",
      type: "institution",
      reliability: "A",
      url: "https://www.sipri.org/databases/armstransfers",
    },
    {
      id: "iiss-mb",
      title: "The Military Balance",
      publisher: "IISS",
      type: "institution",
      reliability: "A",
    },
    {
      id: "csis-cost",
      title: "Calculating the Cost-Effectiveness of Russia's Drone Strikes",
      publisher: "CSIS",
      type: "think-tank",
      reliability: "B",
      url: "https://www.csis.org/analysis/calculating-cost-effectiveness-russias-drone-strikes",
    },
  ],
  updated: "2026-05-20",
};
