import type { DefenseSystem } from "../types";

export const gowindCorvette: DefenseSystem = {
  slug: "gowind-corvette",
  name: "Gowind",
  designation: "Corvette de combat export Naval Group",
  reference: "PNP-NS-014",
  category: "naval-vessel",
  navalVesselClass: "corvette",
  classLabel: "Corvette multirôle",
  country: "France · export",
  flag: "🇫🇷",
  manufacturer: "Naval Group",
  introduced: "2010s",
  status: "En service chez plusieurs marines export ; production et transferts selon clients",
  acquisitionModes: ["DCS", "production-nationale"],
  tagline:
    "La corvette qui brouille la frontière avec la frégate légère : compacte, exportable, mais dépendante de son standard.",
  summary:
    "La Gowind est une corvette multirôle conçue pour offrir à des marines moyennes un bâtiment compact, fortement intégré et exportable. Son intérêt Panoplie tient à son format : moins coûteux qu'une frégate de premier rang, mais capable d'emporter CMS, missiles, artillerie, hélicoptère et capteurs de combat.\n\nLa fiche doit toutefois rester prudente : le mot Gowind recouvre des configurations clients très différentes. La valeur réelle dépend du radar, du CMS, des missiles retenus, de la lutte ASM éventuelle et du soutien local.",
  keySpecs: [
    {
      label: "Déplacement",
      value: "≈ 2 800 t pour le format Gowind 2500",
      confidence: "moyenne",
      sources: ["naval-baniyas"],
    },
    {
      label: "Longueur",
      value: "≈ 102 m",
      confidence: "moyenne",
      sources: ["naval-baniyas"],
    },
    {
      label: "CMS",
      value: "SETIS selon standard Naval Group",
      confidence: "haute",
      sources: ["naval-baniyas"],
    },
    {
      label: "Aviation",
      value: "Pont et hangar pour hélicoptère selon configuration",
      confidence: "moyenne",
      sources: ["naval-launch-uae"],
    },
    {
      label: "Rôle",
      value: "ASuW, présence, défense locale, ASM selon standard",
      confidence: "moyenne",
      status: "variable",
      sources: ["naval-baniyas"],
    },
    {
      label: "Client emblématique",
      value: "Émirats arabes unis — classe Bani Yas",
      confidence: "haute",
      sources: ["naval-baniyas"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "La Gowind vend un compromis coût-effet : plus armée et intégrée qu'un OPV, moins lourde qu'une frégate de premier rang. Elle est donc attractive pour les marines qui veulent de la présence armée et une capacité de combat crédible sans basculer dans le format FREMM.\n\nLe coût réel dépend fortement du standard : missiles, sonar, guerre électronique, formation et soutien local peuvent changer la facture.",
      indicators: [
        {
          label: "Positionnement",
          value: "Corvette dense — compromis entre OPV armé et frégate légère",
          confidence: "moyenne",
          sources: ["naval-baniyas"],
        },
        {
          label: "Variable clé",
          value: "Standard client : capteurs, missiles, sonar, soutien",
          confidence: "haute",
          status: "variable",
          sources: ["naval-launch-uae"],
        },
        {
          label: "Effet par coût",
          value: "Fort si mission littorale / présence armée ; plus limité en haute intensité",
          confidence: "moyenne",
          sources: ["naval-baniyas"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "La Gowind est pensée pour l'export et les montages industriels adaptés aux clients. Elle permet à Naval Group de proposer un produit plus accessible que la frégate lourde, avec possibilité de construction locale ou d'intégration nationale.\n\nCette souplesse financière et industrielle est un avantage, mais elle rend les comparaisons de prix fragiles.",
      indicators: [
        {
          label: "Logique",
          value: "Produit export avec standards et montages clients",
          confidence: "haute",
          sources: ["naval-launch-uae"],
        },
        {
          label: "Construction",
          value: "Naval Group + partenaires locaux selon programme",
          confidence: "moyenne",
          status: "variable",
          sources: ["naval-baniyas"],
        },
        {
          label: "Comparabilité",
          value: "Prix publics rarement comparables entre clients",
          confidence: "moyenne",
          sources: ["naval-baniyas"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "Le coeur de la chaîne Gowind est l'intégration : coque compacte, CMS SETIS, armements, capteurs et soutien. Le produit est intéressant parce qu'il peut absorber des préférences clients tout en restant dans une architecture Naval Group.\n\nLe risque vient de l'hétérogénéité : plus le client nationalise ou modifie, plus l'intégration et le MCO deviennent décisifs.",
      indicators: [
        {
          label: "CMS",
          value: "SETIS — colonne logicielle de la corvette",
          confidence: "haute",
          sources: ["naval-baniyas"],
        },
        {
          label: "Intégration",
          value: "Architecture adaptable aux besoins client",
          confidence: "moyenne",
          sources: ["naval-launch-uae"],
        },
        {
          label: "Risque",
          value: "Hétérogénéité des standards export",
          confidence: "moyenne",
          status: "variable",
          sources: ["naval-baniyas"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "La Gowind est un instrument d'influence navale : elle permet à la France de proposer une capacité de combat crédible à des partenaires qui ne cherchent pas nécessairement une frégate lourde.\n\nElle est particulièrement pertinente pour ZEE, surveillance armée, protection d'approches maritimes et montée en gamme progressive de marines régionales.",
      indicators: [
        {
          label: "Usage",
          value: "Présence armée, souveraineté maritime, lutte de surface et escorte légère",
          confidence: "moyenne",
          sources: ["naval-baniyas"],
        },
        {
          label: "Influence",
          value: "Produit export donnant accès à un écosystème naval français",
          confidence: "moyenne",
          sources: ["naval-launch-uae"],
        },
        {
          label: "Limite",
          value: "Moins adaptée qu'une frégate lourde aux missions de haute intensité prolongées",
          confidence: "moyenne",
          sources: ["naval-baniyas"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "L'export est le coeur du dossier Gowind. Le bâtiment est lisible, adaptable et suffisamment compact pour intéresser des marines qui veulent franchir un palier.\n\nLa prudence porte sur les standards : une Gowind ne vaut pas une autre si le radar, l'ASM, les missiles ou le soutien diffèrent.",
      indicators: [
        {
          label: "Exportabilité",
          value: "Élevée — produit pensé pour clients internationaux",
          confidence: "haute",
          sources: ["naval-baniyas"],
        },
        {
          label: "Exemple",
          value: "Classe Bani Yas pour les Émirats arabes unis",
          confidence: "haute",
          sources: ["naval-baniyas"],
        },
        {
          label: "Risque export",
          value: "Standard client et soutien local déterminent la valeur réelle",
          confidence: "haute",
          status: "variable",
          sources: ["naval-launch-uae"],
        },
      ],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Très bon compromis pour présence armée et combat littoral ; moins pertinent qu'une frégate en haute intensité prolongée.",
    },
    {
      key: "survivabilite",
      grade: "C",
      rationale:
        "Survivabilité correcte pour le format, mais fortement dépendante des capteurs, missiles et contre-mesures retenus.",
    },
    {
      key: "exportabilite",
      grade: "A",
      rationale:
        "Produit explicitement export, adaptable et déjà vendu hors France.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Naval Group maîtrise l'intégration ; le risque tient aux variantes clients et à la production locale.",
    },
    {
      key: "maturite",
      grade: "B",
      rationale:
        "Famille en service, mais les standards clients doivent être lus séparément.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "Données publiques solides pour quelques programmes ; détail des configurations client parfois limité.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : une corvette est un petit navire secondaire. La réalité : une Gowind bien équipée peut porter une capacité de combat littoral crédible.",
    bestUseCase:
      "Marine régionale cherchant présence armée, souveraineté maritime et montée de gamme sans coût de frégate lourde.",
    weakPoint:
      "Le standard : sans détail sur capteurs, missiles, sonar et soutien, le nom Gowind ne suffit pas à comparer.",
    analystNote:
      "La Gowind montre pourquoi Panoplie doit lire les bâtiments comme architectures configurées. L'étiquette corvette dit la taille ; le standard dit la valeur.",
  },
  operators: [
    "Émirats arabes unis — classe Bani Yas",
    "Égypte — corvettes Gowind",
    "Autres clients selon standards",
  ],
  theatres: ["Golfe", "Méditerranée", "Zones littorales", "ZEE"],
  timeline: [
    {
      date: "2017",
      label: "Entrée en service des premières Gowind égyptiennes.",
      kind: "export",
    },
    {
      date: "2021",
      label: "Lancement de la première Gowind destinée aux Émirats arabes unis.",
      kind: "jalon",
    },
    {
      date: "2023",
      label: "Livraison de Bani Yas, première Gowind des Émirats arabes unis.",
      kind: "export",
    },
  ],
  sources: [
    {
      id: "naval-launch-uae",
      title:
        "Naval Group launches the first Gowind corvette for the United Arab Emirates",
      publisher: "Naval Group",
      type: "constructeur",
      reliability: "B",
      date: "2021",
      url: "https://www.naval-group.com/en/naval-group-launches-first-gowindr-corvette-united-arab-emirates",
    },
    {
      id: "naval-baniyas",
      title:
        "Naval Group delivers Bani Yas, the first Gowind corvette for the United Arab Emirates Navy",
      publisher: "Naval Group",
      type: "constructeur",
      reliability: "B",
      date: "2023",
      url: "https://www.naval-group.com/en/naval-group-delivers-bani-yas-first-gowind-corvette-united-arab-emirates-navy",
    },
  ],
  updated: "2026-05-31",
};
