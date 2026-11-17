import type { DefenseSystem } from "../types";
import { ind, scoreSet, src } from "./registry-helpers";

// DELUGE (MBDA) — fiche issue du registre « Souveraineté industrielle » du
// 17/11/2026. Les trois chiffres du registre reposent sur un article unique,
// signalé « source unique » : ils sont affichés comme tels, sans recoupement.

export const deluge: DefenseSystem = {
  slug: "deluge",
  name: "DELUGE",
  designation: "Effecteur à usage unique de MBDA — présenté à Eurosatory 2026",
  reference: "PNP-MSL-022",
  category: "missile",
  classLabel: "Effecteur à usage unique (annoncé)",
  country: "France",
  flag: "🇫🇷",
  manufacturer: "MBDA",
  introduced: "Première série attendue en 2027 (source unique)",
  status:
    "Annoncé à Eurosatory 2026 (15 juin) — portée, charge utile et première série reposent sur un article unique",
  acquisitionModes: ["production-nationale"],
  tagline:
    "Un effecteur à usage unique de MBDA : portée annoncée jusqu'à 500 km, charge de la classe des 50 kg, première série attendue en 2027 — le tout d'après une source unique.",
  summary:
    "DELUGE est un effecteur à usage unique présenté par MBDA à Eurosatory 2026, selon un article d'Army Recognition daté du 15 juin 2026. Le registre en retient trois chiffres — portée jusqu'à 500 km, charge utile de la classe des 50 kg, première série attendue en 2027 — tous signalés « source unique » : aucun n'est recoupé.\n\nPour Panoplie, c'est une fiche d'attente : le produit existe sur le papier d'un seul article. Elle sert à marquer la présence de DELUGE dans le catalogue sans en dire plus que les sources ne permettent — ni prix, ni quantités, ni client, ni chaîne d'approvisionnement ne sont documentés.",
  keySpecs: [
    ind("Portée annoncée", "Jusqu'à 500 km", "faible", { ids: ["MET-0361"], fs: "source-unique", src: ["army-recognition-deluge"], note: "Article unique ; non recoupé." }),
    ind("Charge utile", "Charge de la classe des 50 kg", "faible", { ids: ["MET-0362"], fs: "source-unique", src: ["army-recognition-deluge"], note: "Article unique ; non recoupé." }),
    ind("Première série", "Attendue en 2027", "faible", { ids: ["MET-0363"], fs: "source-unique", src: ["army-recognition-deluge"], note: "Article unique ; non recoupé." }),
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Aucun coût, prix ou budget n'est documenté pour DELUGE : le registre ne contient aucun chiffre monétaire sur ce produit, et la fiche n'en déduit pas.",
      indicators: [ind("Coût et prix", "non documenté", "faible")],
    },
    {
      key: "finance",
      narrative:
        "Le seul élément de calendrier est l'attente d'une première série en 2027, rapportée par un article unique. Aucun client, aucune commande, aucun financement n'est documenté.",
      indicators: [
        ind("Première série attendue", "2027", "faible", { ids: ["MET-0363"], fs: "source-unique", src: ["army-recognition-deluge"] }),
        ind("Clients et commandes", "non documenté", "faible"),
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "MBDA est le seul acteur nommé au registre pour DELUGE. Aucun fournisseur, aucun site, aucun goulot d'étranglement n'est documenté.",
      indicators: [ind("Industriel", "MBDA", "moyenne", { src: ["army-recognition-deluge"] })],
    },
    {
      key: "geopolitique",
      narrative:
        "Le registre ne documente aucun enjeu géopolitique propre à DELUGE ; il le range, comme les autres produits de frappe en profondeur, dans la catégorie missiles de frappe.",
      indicators: [ind("Enjeu stratégique", "non documenté", "faible")],
    },
    {
      key: "export",
      narrative:
        "Contenu local, verrou d'un tiers et accès au code source ne sont pas documentés pour DELUGE.",
      indicators: [ind("Régime export et accès au code source", "non documenté", "faible")],
    },
  ],
  scores: scoreSet({
    "efficacite-cout": ["D", "Aucun coût documenté : aucune lecture de coût possible."],
    survivabilite: ["D", "Aucune donnée de survivabilité ; caractéristiques annoncées par un article unique."],
    exportabilite: ["D", "Aucun élément d'export documenté."],
    "risque-industriel": ["D", "Un seul industriel nommé, aucune chaîne documentée."],
    maturite: ["D", "Première série attendue en 2027 selon une source unique."],
    "confiance-donnees": ["E", "Les trois chiffres du registre reposent sur un seul article, non recoupé."],
  }),
  editorial: {
    mythVsReality:
      "Le mythe : un produit présenté en salon est un produit documenté. La réalité : trois chiffres, un article, aucune confirmation.",
    bestUseCase:
      "Illustrer comment Panoplie traite un produit dont l'existence ne repose que sur une source unique.",
    weakPoint:
      "Tout : portée, charge utile et calendrier viennent du même article, signalé « source unique ».",
    analystNote:
      "À recouper par un document de MBDA ou un communiqué officiel avant toute lecture comparative.",
  },
  operators: ["Aucun — produit annoncé"],
  theatres: ["Aucun — produit annoncé"],
  timeline: [
    { date: "2026-06", label: "DELUGE présenté à Eurosatory 2026, d'après un article du 15 juin 2026.", kind: "jalon" },
    { date: "2027", label: "Première série attendue en 2027 (source unique).", kind: "jalon", metricIds: ["MET-0363"] },
  ],
  registryEntityIds: ["ENT-DELUGE"],
  sovereignty: [
    { entityId: "ENT-DELUGE", localContentRule: "Non_specifie", thirdPartyLock: "Non_specifie", sourceCodeAccess: "Non_specifie", chokepoints: [] },
  ],
  sources: [
    src("army-recognition-deluge", "Army Recognition", "Article sur le LCM Mk II et DELUGE, Eurosatory 2026 (15/06/2026)", "presse", "D", "2026-06-15", "https://armyrecognition.com/archives/archives-defense-exhibitions/2026-archives-news-defense-exhibitions/eurosatory-2026/new-mbda-lcm-mk-ii-missile-targets-1000-km-strikes-as-deluge-drone-adds-saturation-firepower"),
  ],
  updated: "2026-11-17",
};
