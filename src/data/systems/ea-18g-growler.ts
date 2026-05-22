import type { DefenseSystem } from "../types";

export const ea18gGrowler: DefenseSystem = {
  slug: "ea-18g-growler",
  name: "EA-18G Growler",
  designation: "EA-18G",
  reference: "PNP-AC-007",
  category: "combat-aircraft",
  combatAircraftClass: "gen-4-5",
  classLabel: "Avion de guerre électronique embarqué",
  country: "États-Unis",
  flag: "🇺🇸",
  manufacturer: "Boeing",
  introduced: "2009",
  status: "En service — modernisation du brouilleur de nouvelle génération en cours",
  naval:
    "Oui — embarqué, dérivé du Super Hornet ; opère depuis les porte-avions de l'US Navy.",
  acquisitionModes: ["FMS"],
  tagline:
    "L'arme électronique de l'aéronavale américaine — une niche stratégique, irremplaçable et très spécialisée.",
  summary:
    "L'EA-18G Growler est la variante de guerre électronique du Super Hornet : un appareil dont la mission n'est pas d'abattre, mais d'aveugler. Il brouille les radars, perturbe les communications et neutralise les défenses adverses pour ouvrir un couloir à l'aviation de frappe. Il a remplacé le vénérable EA-6B Prowler.\n\nLe Growler n'est pas un chasseur que l'on compare à un Rafale ou à un F-35 : c'est un effecteur de niche, mais une niche que personne d'autre, en Occident, ne tient avec cette profondeur. Sa modernisation — le passage au brouilleur de nouvelle génération NGJ — conditionne la capacité de guerre électronique embarquée américaine pour la décennie.",
  keySpecs: [
    {
      label: "Équipage",
      value: "2",
      confidence: "haute",
      sources: ["navair"],
    },
    {
      label: "Mission",
      value: "Guerre électronique — brouillage, attaque électronique, SEAD",
      confidence: "haute",
      sources: ["navair"],
    },
    {
      label: "Cellule",
      value: "Dérivée du F/A-18F Super Hornet biplace",
      confidence: "haute",
      sources: ["navair"],
    },
    {
      label: "Brouilleur",
      value:
        "Transition de l'AN/ALQ-99 vers le Next Generation Jammer (NGJ)",
      confidence: "haute",
      sources: ["twz"],
    },
    {
      label: "Modernisation",
      value: "Growler Block II — cockpit avancé, suite d'attaque électronique",
      confidence: "moyenne",
      sources: ["navair"],
    },
    {
      label: "Remplace",
      value: "L'EA-6B Prowler",
      confidence: "haute",
      sources: ["navair"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le coût du Growler doit se lire à l'échelle de sa fonction. L'appareil partage la cellule du Super Hornet — donc une part de ses coûts —, mais sa charge utile électronique en fait un système à part.\n\nLe poste majeur est la modernisation : le passage de l'ancien brouilleur AN/ALQ-99 au Next Generation Jammer, décliné en plusieurs bandes de fréquences, étale un investissement lourd jusqu'à la fin de la décennie.",
      indicators: [
        {
          label: "Base de coût",
          value: "Cellule partagée avec le Super Hornet",
          confidence: "moyenne",
          sources: ["navair"],
        },
        {
          label: "Poste majeur",
          value: "Modernisation du brouilleur — programme NGJ pluriannuel",
          confidence: "haute",
          sources: ["twz"],
        },
        {
          label: "Valeur de niche",
          value: "Capacité sans équivalent — un coût justifié par la rareté",
          confidence: "moyenne",
          sources: ["navair"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le Growler est financé par l'US Navy. Comme le Super Hornet, sa production neuve s'achève — l'avenir budgétaire du programme est dans la modernisation.\n\nLe Next Generation Jammer, en bandes moyenne et basse, et le programme Growler Block II concentrent les crédits. La marine américaine investit pour maintenir une supériorité électronique que les défenses adverses, de plus en plus denses, rendent décisive.",
      indicators: [
        {
          label: "Maître d'ouvrage",
          value: "US Navy",
          confidence: "haute",
          sources: ["navair"],
        },
        {
          label: "Priorité budgétaire",
          value: "Next Generation Jammer et Growler Block II",
          confidence: "haute",
          sources: ["twz"],
        },
        {
          label: "Justification",
          value: "Maintenir la supériorité électronique face aux défenses denses",
          confidence: "moyenne",
          sources: ["navair"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne du Growler combine la cellule Boeing du Super Hornet et une suite électronique spécialisée. Le brouilleur de nouvelle génération mobilise une base industrielle distincte — capteurs, électronique de puissance, traitement du signal.\n\nLa transition entre ancien et nouveau brouilleur impose, un temps, de faire coexister deux générations d'équipements sur la flotte — une contrainte logistique réelle.",
      indicators: [
        {
          label: "Maître d'œuvre cellule",
          value: "Boeing — base Super Hornet",
          confidence: "haute",
          sources: ["navair"],
        },
        {
          label: "Suite électronique",
          value: "Brouilleur NGJ — base industrielle spécialisée",
          confidence: "moyenne",
          sources: ["twz"],
        },
        {
          label: "Contrainte de transition",
          value: "Coexistence des brouilleurs ancien et nouveau sur la flotte",
          confidence: "moyenne",
          sources: ["twz"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Le Growler donne à l'aéronavale américaine une capacité que peu de forces possèdent : ouvrir, par le brouillage, un couloir dans une défense aérienne moderne. C'est un multiplicateur de force pour toute opération de frappe.\n\nDans un environnement où les défenses sol-air se densifient, cette capacité devient un avantage stratégique — et un point d'appui pour les alliés qui n'en disposent pas.",
      indicators: [
        {
          label: "Fonction stratégique",
          value: "Ouvrir un couloir dans les défenses aériennes adverses",
          confidence: "haute",
          sources: ["navair"],
        },
        {
          label: "Effet",
          value: "Multiplicateur de force pour les opérations de frappe",
          confidence: "haute",
          sources: ["navair"],
        },
        {
          label: "Rareté",
          value: "Capacité de guerre électronique embarquée peu répandue",
          confidence: "moyenne",
          sources: ["twz"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "Le Growler n'a été exporté que vers un seul pays : l'Australie, qui l'emploie aux côtés de ses Super Hornet. La guerre électronique est l'une des technologies les plus sensibles — les États-Unis en partagent l'accès avec une grande parcimonie.\n\nL'exportabilité du Growler est donc faible par nature : ce n'est pas un produit de marché, c'est une capacité réservée aux partenaires les plus proches.",
      indicators: [
        {
          label: "Unique client export",
          value: "Australie",
          confidence: "haute",
          sources: ["boeing"],
        },
        {
          label: "Sensibilité",
          value: "Guerre électronique — technologie très étroitement gardée",
          confidence: "haute",
          sources: ["navair"],
        },
        {
          label: "Régime applicable",
          value: "ITAR — accès réservé aux partenaires les plus proches",
          confidence: "haute",
          sources: ["boeing"],
        },
      ],
    },
  ],
  variants: [
    {
      label: "EA-18G Growler",
      value:
        "Version unique — variante de guerre électronique du F/A-18F biplace.",
      confidence: "haute",
      sources: ["navair"],
    },
    {
      label: "Growler Block II",
      value:
        "Modernisation — cockpit avancé et suite d'attaque électronique de nouvelle génération.",
      confidence: "moyenne",
      sources: ["navair"],
    },
    {
      label: "Next Generation Jammer",
      value:
        "Nouveau brouilleur — bandes moyenne et basse, remplaçant l'AN/ALQ-99.",
      confidence: "moyenne",
      sources: ["twz"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "A",
      rationale:
        "Capacité de guerre électronique sans équivalent : un effecteur de niche dont la valeur stratégique justifie largement le coût.",
    },
    {
      key: "survivabilite",
      grade: "C",
      rationale:
        "Cellule non furtive de Super Hornet ; le Growler agit en appui, protégé par la distance et par l'effet même de son brouillage.",
    },
    {
      key: "exportabilite",
      grade: "C",
      rationale:
        "Un seul client export — l'Australie. La guerre électronique est une technologie réservée aux partenaires les plus proches.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Cellule Boeing éprouvée ; le risque se concentre sur la modernisation du brouilleur et la coexistence de deux générations d'équipements.",
    },
    {
      key: "maturite",
      grade: "A",
      rationale:
        "En service depuis 2009, emploi opérationnel constant, doctrine éprouvée — pleinement mûr.",
    },
    {
      key: "confiance-donnees",
      grade: "A",
      rationale:
        "Programme bien documenté par la NAVAIR ; seules les performances fines du brouillage restent classifiées.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un chasseur de plus. La réalité : un avion de guerre électronique très spécialisé, dont la mission est d'aveugler les défenses adverses — à ne pas comparer aux chasseurs polyvalents.",
    bestUseCase:
      "Ouvrir un couloir dans une défense aérienne moderne — brouiller radars et liaisons pour permettre à l'aviation de frappe de pénétrer.",
    weakPoint:
      "Une niche étroite : le Growler ne se suffit pas à lui-même, il agit en appui, et sa cellule non furtive le tient à distance des zones les plus contestées.",
    analystNote:
      "Le Growler est l'exemple type de l'effecteur de niche : on ne le juge pas à sa polyvalence mais à sa rareté. Personne, en Occident, ne tient la guerre électronique embarquée avec cette profondeur — et c'est pourquoi sa modernisation NGJ compte autant qu'un programme de chasseur neuf.",
  },
  operators: ["États-Unis", "Australie"],
  theatres: ["Moyen-Orient", "Indo-Pacifique", "Mer Rouge"],
  timeline: [
    {
      date: "2009",
      label: "Entrée en service de l'EA-18G Growler dans l'US Navy.",
      kind: "jalon",
    },
    {
      date: "2017",
      label: "Livraison des Growler à la Royal Australian Air Force.",
      kind: "export",
    },
    {
      date: "2025",
      label:
        "Déploiement opérationnel du brouilleur de nouvelle génération NGJ aux côtés de l'ancien AN/ALQ-99.",
      kind: "jalon",
    },
  ],
  sources: [
    {
      id: "navair",
      title: "EA-18G Growler — fiche programme",
      publisher: "U.S. Naval Air Systems Command (NAVAIR)",
      type: "officiel",
      reliability: "A",
      url: "https://www.navair.navy.mil/product/EA-18G-Growler",
    },
    {
      id: "boeing",
      title: "EA-18G Growler — capacités",
      publisher: "Boeing",
      type: "constructeur",
      reliability: "B",
      url: "https://www.boeing.com/defense/ea-18g-growler",
    },
    {
      id: "twz",
      title:
        "EA-18G Growlers Carrying Mixed Load Of Old And New Jamming Pods",
      publisher: "The War Zone",
      type: "presse",
      reliability: "C",
      url: "https://www.twz.com/air/ea-18g-growler-with-split-load-of-new-and-old-jamming-pods-seen-supporting-iran-strikes",
    },
  ],
  updated: "2026-05-22",
};
