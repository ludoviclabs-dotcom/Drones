import type { DefenseSystem } from "../types";

export const superHornet: DefenseSystem = {
  slug: "super-hornet",
  name: "F/A-18E/F Super Hornet",
  designation: "F/A-18E / F",
  reference: "PNP-AC-006",
  category: "combat-aircraft",
  combatAircraftClass: "gen-4-5",
  classLabel: "Chasseur embarqué multirôle",
  country: "États-Unis",
  flag: "🇺🇸",
  manufacturer: "Boeing",
  introduced: "2001",
  status: "En service — production neuve en fin de vie, modernisation Block III",
  naval:
    "Oui — chasseur embarqué CATOBAR, pilier du groupe aérien des porte-avions américains.",
  acquisitionModes: ["FMS"],
  tagline:
    "Le pilier de l'aéronavale américaine — un 4.5e naval éprouvé, dont la ligne neuve se ferme au profit de la modernisation.",
  summary:
    "Le F/A-18E/F Super Hornet est, depuis un quart de siècle, l'ossature du groupe aérien embarqué de l'US Navy : un chasseur multirôle robuste, conçu pour le rythme exigeant des opérations sur porte-avions — catapultage, appontage, cadence élevée, environnement salin.\n\nC'est un appareil de 4.5e génération, non furtif, désormais à un tournant. La production d'avions neufs s'achève : les dernières cellules seront livrées vers 2027. L'avenir du Super Hornet n'est plus dans l'usine mais dans la modernisation — le standard Block III et un programme de prolongation de durée de vie maintiendront des centaines d'appareils en service bien au-delà.",
  keySpecs: [
    {
      label: "Équipage",
      value: "1 (F/A-18E) ou 2 (F/A-18F)",
      confidence: "haute",
      sources: ["navair"],
    },
    {
      label: "Motorisation",
      value: "2 réacteurs — bimoteur embarqué",
      confidence: "haute",
      sources: ["navair"],
    },
    {
      label: "Emploi",
      value: "Chasseur embarqué CATOBAR — porte-avions de l'US Navy",
      confidence: "haute",
      sources: ["navair"],
    },
    {
      label: "Standard de modernisation",
      value: "Block III — cockpit avancé, connectivité, signature réduite",
      confidence: "haute",
      sources: ["navair"],
    },
    {
      label: "Production neuve",
      value: "En fin de vie — dernières livraisons attendues vers 2027",
      confidence: "haute",
      sources: ["twz"],
    },
    {
      label: "Prolongation",
      value: "Service Life Modification — durée de vie portée à 10 000 heures",
      confidence: "haute",
      sources: ["twz"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le coût du Super Hornet bascule, en 2025, du neuf vers la modernisation. La ligne de production d'appareils neufs se ferme : il n'y aura plus de coût d'acquisition de cellules après les derniers exemplaires.\n\nL'US Navy investit désormais dans le maintien : un contrat de modernisation et de prolongation de durée de vie — le Service Life Modification — porte la cellule à dix mille heures de vol. C'est un coût de flotte existante, non un coût d'achat.",
      indicators: [
        {
          label: "Coût d'acquisition neuve",
          value: "En extinction — fin des livraisons d'appareils neufs",
          confidence: "haute",
          sources: ["twz"],
        },
        {
          label: "Modernisation Block III",
          value: "Contrat de prolongation — jusqu'à 60 appareils visés",
          confidence: "haute",
          sources: ["twz"],
        },
        {
          label: "Lecture économique",
          value: "Le coût est désormais celui d'une flotte à prolonger",
          confidence: "moyenne",
          sources: ["navair"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le Super Hornet est financé par l'US Navy. Le dernier contrat d'appareils neufs porte sur un nombre limité de cellules, livraisons achevées vers 2027.\n\nLe financement se déplace vers la modernisation : le standard Block III et la prolongation de durée de vie représentent l'essentiel des crédits désormais alloués au programme. La marine américaine fait le choix de durer plutôt que d'acheter.",
      indicators: [
        {
          label: "Maître d'ouvrage",
          value: "US Navy",
          confidence: "haute",
          sources: ["navair"],
        },
        {
          label: "Dernières commandes neuves",
          value: "Nombre limité de cellules — livraisons jusqu'à ~2027",
          confidence: "haute",
          sources: ["twz"],
        },
        {
          label: "Bascule budgétaire",
          value: "Du neuf vers la modernisation et la prolongation",
          confidence: "moyenne",
          sources: ["twz"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne du Super Hornet entre dans sa phase finale de production. Les fournisseurs structurels ont livré leurs dernières pièces de cellules neuves ; Boeing achève les assemblages.\n\nLa transition vers une logique de soutien et de modernisation reconfigure la chaîne : moins de production, plus de rénovation. L'enjeu industriel devient la disponibilité de pièces pour une flotte qu'on prolonge sans plus la fabriquer.",
      indicators: [
        {
          label: "Maître d'œuvre",
          value: "Boeing — assemblage final",
          confidence: "haute",
          sources: ["twz"],
        },
        {
          label: "Production structurelle",
          value: "Dernières pièces de cellules neuves livrées",
          confidence: "haute",
          sources: ["twz"],
        },
        {
          label: "Enjeu de soutien",
          value: "Pièces et obsolescences d'une flotte prolongée",
          confidence: "moyenne",
          sources: ["navair"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Le Super Hornet est indissociable de la projection de puissance navale américaine : sans lui, le groupe aérien embarqué n'existe pas. Tant que le F-35C ne sera pas pleinement majoritaire, il reste le cheval de bataille des ponts d'envol.\n\nÀ l'export, il a séduit des marines et armées de l'air alliées — l'Australie l'emploie aux côtés du Growler. Son rôle géopolitique est celui d'un outil de coalition navale, éprouvé et interopérable.",
      indicators: [
        {
          label: "Fonction stratégique",
          value: "Ossature du groupe aérien embarqué américain",
          confidence: "haute",
          sources: ["navair"],
        },
        {
          label: "Complémentarité",
          value: "Cohabite avec le F-35C sur les porte-avions",
          confidence: "haute",
          sources: ["navair"],
        },
        {
          label: "Export",
          value: "Australie et Koweït — emploi en coalition",
          confidence: "moyenne",
          sources: ["boeing"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "Le Super Hornet a été exporté vers l'Australie et le Koweït, sous régime ITAR et vente d'État à État. Sa diffusion reste plus limitée que celle des chasseurs terrestres, le marché des appareils navals étant étroit.\n\nAvec la fin de la production neuve, la fenêtre d'export se referme : un nouvel acquéreur devrait désormais se tourner vers la modernisation d'appareils existants plutôt que vers des cellules neuves.",
      indicators: [
        {
          label: "Clients export",
          value: "Australie, Koweït",
          confidence: "haute",
          sources: ["boeing"],
        },
        {
          label: "Régime applicable",
          value: "ITAR — vente d'État à État",
          confidence: "haute",
          sources: ["boeing"],
        },
        {
          label: "Fenêtre d'export",
          value: "Se referme avec la fin de la production neuve",
          confidence: "moyenne",
          sources: ["twz"],
        },
      ],
    },
  ],
  variants: [
    {
      label: "F/A-18E",
      value: "Monoplace — version la plus nombreuse.",
      confidence: "haute",
      sources: ["navair"],
    },
    {
      label: "F/A-18F",
      value: "Biplace — missions à deux équipiers, conversion.",
      confidence: "haute",
      sources: ["navair"],
    },
    {
      label: "Block III",
      value:
        "Standard de modernisation — cockpit avancé, connectivité, réservoirs conformes, signature réduite.",
      confidence: "haute",
      sources: ["navair"],
    },
    {
      label: "Service Life Modification",
      value:
        "Programme de prolongation — durée de vie de la cellule portée à 10 000 heures de vol.",
      confidence: "haute",
      sources: ["twz"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Chasseur naval robuste et polyvalent au coût maîtrisé ; sans furtivité, son rapport effet/coût reste solide mais générationnellement borné.",
    },
    {
      key: "survivabilite",
      grade: "C",
      rationale:
        "Non furtif : la modernisation Block III réduit la signature à la marge, mais la survie en zone très défendue dépend de la tactique et de l'escorte.",
    },
    {
      key: "exportabilite",
      grade: "B",
      rationale:
        "Exporté vers l'Australie et le Koweït sous régime ITAR ; la fin de production neuve referme la fenêtre commerciale.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Chaîne mûre en phase d'extinction ; l'enjeu se déplace vers la disponibilité de pièces pour une flotte prolongée.",
    },
    {
      key: "maturite",
      grade: "A",
      rationale:
        "Près de vingt-cinq ans de service embarqué, emploi opérationnel intensif, doctrine pleinement éprouvée.",
    },
    {
      key: "confiance-donnees",
      grade: "A",
      rationale:
        "Programme très documenté par la NAVAIR et les rapports américains.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un chasseur en fin de course. La réalité : un pilier naval qu'on ne fabrique bientôt plus, mais que la modernisation Block III et la prolongation de durée de vie maintiendront en première ligne pendant des décennies.",
    bestUseCase:
      "Armer le groupe aérien d'un porte-avions — chasse, frappe, ravitaillement en vol par les nacelles — dans un environnement naval exigeant et en coalition.",
    weakPoint:
      "La génération : non furtif, il dépend de l'escorte et de la tactique face à une défense aérienne moderne — et sa production neuve s'achève.",
    analystNote:
      "Le Super Hornet illustre la fin de vie réussie d'un programme : on cesse de le produire, mais on choisit de le faire durer. Sa vraie question n'est plus le coût d'achat, c'est la disponibilité d'une flotte prolongée jusqu'à ce que le F-35C prenne pleinement le relais.",
  },
  operators: ["États-Unis", "Australie", "Koweït"],
  theatres: ["Moyen-Orient", "Indo-Pacifique", "Mer Rouge"],
  timeline: [
    {
      date: "2001",
      label: "Entrée en service du Super Hornet dans l'US Navy.",
      kind: "jalon",
    },
    {
      date: "2007",
      label: "Première exportation — Australie.",
      kind: "export",
    },
    {
      date: "2020",
      label: "Lancement de la modernisation au standard Block III.",
      kind: "jalon",
    },
    {
      date: "2025",
      label:
        "Fin de la production de cellules neuves engagée ; bascule vers la prolongation de durée de vie.",
      kind: "jalon",
    },
  ],
  sources: [
    {
      id: "navair",
      title: "F/A-18E/F Super Hornet — fiche programme",
      publisher: "U.S. Naval Air Systems Command (NAVAIR)",
      type: "officiel",
      reliability: "A",
      url: "https://www.navair.navy.mil/fa-18ef",
    },
    {
      id: "boeing",
      title: "F/A-18 Super Hornet — capacités et clients",
      publisher: "Boeing",
      type: "constructeur",
      reliability: "B",
      url: "https://www.boeing.com/defense/fa-18-super-hornet",
    },
    {
      id: "twz",
      title:
        "Last New F/A-18 Aft Fuselages Built As Super Hornet Production End Approaches",
      publisher: "The War Zone",
      type: "presse",
      reliability: "C",
      url: "https://www.twz.com/air/last-new-f-a-18-aft-fuselages-built-as-super-hornet-production-end-approaches",
    },
  ],
  updated: "2026-05-22",
};
