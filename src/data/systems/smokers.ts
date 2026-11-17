import type { DefenseSystem } from "../types";
import { ind, scoreSet, src } from "./registry-helpers";

// SMOKERS (DGA) — fiche issue du registre « Souveraineté industrielle » du
// 17/11/2026. Les caractéristiques techniques viennent d'un seul article
// (Opex360, 1er novembre 2026) : elles sont signalées « presse ».

export const smokers: DefenseSystem = {
  slug: "smokers",
  name: "SMOKERS",
  designation: "Système maritime opérationnel kamikaze évolutif en réalisation souveraine",
  reference: "PNP-DR-024",
  category: "drone",
  droneClass: "USV",
  classLabel: "Drone naval kamikaze de conception DGA",
  country: "France",
  flag: "🇫🇷",
  manufacturer: "DGA Techniques navales · DGA Techniques hydrodynamiques (conception interne)",
  introduced: "Expérimentation précurseur en avril 2025",
  status:
    "Appel d'offres d'industrialisation lancé (jusqu'à 36 M€ TTC) ; industriel retenu, nombre d'exemplaires et calendrier de livraison à connaître",
  acquisitionModes: ["production-nationale"],
  tagline:
    "Un drone naval kamikaze conçu en interne par la DGA : 500 kg, 5 m, 40 nœuds, un appel d'offres de 36 M€ TTC maximum pour l'industrialiser.",
  summary:
    "SMOKERS est un drone naval kamikaze conçu par la DGA elle-même — conception interne des Techniques navales et des Techniques hydrodynamiques. Selon Opex360 (1er novembre 2026), la DGA a lancé un appel d'offres pour l'industrialiser : marché de quatre ans prolongeable de deux, d'une valeur de 36 M€ TTC, soit 30 M€ hors taxes (calcul du registre). Le nombre d'exemplaires n'est pas publié.\n\nPour Panoplie, le montant est un plafond d'appel d'offres, pas une commande : il ne dit rien du coût d'un drone. Les caractéristiques — 500 kg, 5 m, 40 nœuds, plus de 50 nautiques d'autonomie — reposent sur un seul article.",
  keySpecs: [
    ind("Déplacement", "500 kg", "moyenne", { ids: ["MET-0249"], fs: "presse", src: ["opex360-smokers"] }),
    ind("Longueur", "5 m", "moyenne", { ids: ["MET-0250"], fs: "presse", src: ["opex360-smokers"] }),
    ind("Vitesse maximale", "40 nœuds au maximum", "moyenne", { ids: ["MET-0251"], fs: "presse", src: ["opex360-smokers"] }),
    ind("Autonomie", "Supérieure à 50 nautiques", "moyenne", { ids: ["MET-0252"], fs: "presse", src: ["opex360-smokers"] }),
    ind("Durée citée des projets SMOKERS", "6 mois", "moyenne", { ids: ["MET-0248"], fs: "presse", src: ["opex360-smokers"] }),
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le seul montant du registre est la valeur de l'appel d'offres d'industrialisation : un plafond de 36 M€ TTC sur quatre ans prolongeables de deux, soit 30 M€ hors taxes. Ce n'est ni un prix unitaire ni une commande ferme, et le nombre d'exemplaires n'est pas publié.",
      indicators: [
        ind("Valeur de l'appel d'offres d'industrialisation", "Jusqu'à 36 M€ TTC — plafond de l'appel d'offres, pas une commande", "moyenne", { ids: ["MET-0253"], fs: "plafond-cadre", src: ["opex360-smokers"] }),
        ind("Valeur hors taxes", "30 M€ hors taxes (calc.) — TVA à 20 %", "moyenne", { ids: ["MET-0254"], fs: "calcule", src: ["opex360-smokers"] }),
        ind("Nombre d'exemplaires à industrialiser", "n.c.", "haute", { ids: ["MET-0256"], fs: "non-communique", src: ["opex360-smokers"], note: "Non publié." }),
      ],
    },
    {
      key: "finance",
      narrative:
        "Le marché d'industrialisation durera quatre ans, prolongeable de deux. L'industriel retenu, le nombre d'exemplaires et le calendrier de livraison sont à connaître.",
      indicators: [
        ind("Durée du marché d'industrialisation", "Quatre ans, prolongeable de deux", "moyenne", { ids: ["MET-0255"], fs: "presse", src: ["opex360-smokers"] }),
        ind("Expérimentation précurseur", "Avril 2025", "moyenne", { ids: ["MET-0257"], fs: "presse", src: ["opex360-smokers"] }),
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La conception est interne à la DGA — Techniques navales et Techniques hydrodynamiques ; le registre ne cite aucun industriel avant l'attribution de l'appel d'offres.",
      indicators: [
        ind("Conception", "DGA Techniques navales et DGA Techniques hydrodynamiques — conception interne", "haute", { src: ["opex360-smokers"] }),
        ind("Industriel retenu", "À suivre — attribution de l'appel d'offres", "moyenne", { src: ["opex360-smokers"] }),
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "SMOKERS est classé en souveraineté nationale pour la règle de contenu local : conception interne de l'État, industrialisation par appel d'offres. Le registre ne documente ni verrou d'un tiers ni accès au code source.",
      indicators: [
        ind("Règle de contenu local", "Souveraineté nationale", "moyenne", { note: "Valeur du registre (bloc souveraineté ci-dessous)." }),
      ],
    },
    {
      key: "export",
      narrative:
        "Rien n'est documenté sur l'export de SMOKERS ni sur son contrôle : le système est une conception interne de l'État.",
      indicators: [ind("Régime export et accès au code source", "non documenté", "faible")],
    },
  ],
  scores: scoreSet({
    "efficacite-cout": ["D", "Plafond d'appel d'offres sans nombre d'exemplaires : aucun coût unitaire ne peut être lu."],
    survivabilite: ["D", "Aucune donnée de survivabilité ; caractéristiques rapportées par un seul article."],
    exportabilite: ["D", "Aucun élément d'export documenté ; conception de l'État."],
    "risque-industriel": ["C", "Industriel non encore retenu ; conception interne de la DGA."],
    maturite: ["D", "Expérimentation précurseur en avril 2025 ; industrialisation à venir."],
    "confiance-donnees": ["C", "Caractéristiques et montants rapportés par un seul article, avec vérification du plafond."],
  }),
  editorial: {
    mythVsReality:
      "Le mythe : un appel d'offres chiffré vaut un prix. La réalité : 36 M€ TTC plafonnent un marché de quatre ans, sans nombre d'exemplaires.",
    bestUseCase:
      "Lire un drone de conception étatique industrialisé par appel d'offres : plafond public, quantités non publiées.",
    weakPoint:
      "Tout vient d'un seul article, y compris les caractéristiques techniques.",
    analystNote:
      "À suivre : l'attribution de l'appel d'offres — industriel retenu, nombre d'exemplaires et calendrier de livraison.",
  },
  operators: ["France — Marine nationale (prévu)"],
  theatres: ["Aucun — industrialisation à venir"],
  timeline: [
    { date: "2025-04", label: "Expérimentation précurseur du SMOKERS en avril 2025.", kind: "jalon", metricIds: ["MET-0257"] },
    { date: "2026-11", label: "La DGA lance un appel d'offres d'industrialisation du SMOKERS, d'une valeur de 36 M€ TTC.", kind: "jalon", metricIds: ["MET-0253"] },
  ],
  registryEntityIds: ["ENT-SMOKERS"],
  industrialChain: [
    { entityId: "ENT-SMOKERS", entityName: "SMOKERS", actor: "DGA Techniques navales", role: "Maitre_Oeuvre", country: "France", scope: "Conception interne" },
    { entityId: "ENT-SMOKERS", entityName: "SMOKERS", actor: "DGA Techniques hydrodynamiques", role: "Maitre_Oeuvre", country: "France", scope: "Conception interne" },
  ],
  sovereignty: [
    { entityId: "ENT-SMOKERS", localContentRule: "Souverain_National", thirdPartyLock: "Non_specifie", sourceCodeAccess: "Non_specifie", chokepoints: [] },
  ],
  watchpoints: [
    { entityId: "ENT-SMOKERS", entityName: "SMOKERS", horizon: "À suivre", event: "Attribution du SMOKERS : industriel retenu, nombre d'exemplaires et calendrier de livraison." },
  ],
  sources: [
    src("opex360-smokers", "Opex360 (L. Lagneau)", "La Direction générale de l'armement lance un appel d'offres pour industrialiser son drone naval kamikaze SMOKERS", "presse", "C", "2026-11-01", "https://www.opex360.com/2026/11/01/la-direction-generale-de-larmement-lance-un-appel-doffres-pour-industrialiser-son-drone-naval-kamikaze-smokers/"),
  ],
  updated: "2026-11-17",
};
