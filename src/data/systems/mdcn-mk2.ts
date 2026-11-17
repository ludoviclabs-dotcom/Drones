import type { DefenseSystem } from "../types";
import { ind, scoreSet, src } from "./registry-helpers";

// MdCN Mk2 — fiche issue du registre « Souveraineté industrielle » (17/11/2026).

export const mdcnMk2: DefenseSystem = {
  slug: "mdcn-mk2",
  name: "MdCN Mk2",
  designation: "Missile de croisière naval — nouveau standard",
  reference: "PNP-MSL-018",
  category: "missile",
  missileRole: "SSM",
  classLabel: "Missile de croisière naval de frappe (nouveau standard)",
  country: "France",
  flag: "🇫🇷",
  manufacturer: "MBDA",
  introduced: "Premières livraisons à la Marine « à partir de 2030 »",
  status:
    "Commande annoncée à MBDA (6 novembre 2026) ; contrat à signer — montant, nombre de missiles et porteurs non communiqués",
  acquisitionModes: ["production-nationale"],
  tagline:
    "Le nouveau standard du missile de croisière naval français : portée annoncée de plus de 1 000 km, première livraison attendue à partir de 2030, contrat encore à signer.",
  summary:
    "Le MdCN Mk2 est le nouveau standard du missile de croisière naval (MdCN) de MBDA. Le ministère des Armées a annoncé, début novembre 2026, vouloir le commander ; le contrat reste à signer et son montant, le nombre de missiles et les porteurs concernés ne sont pas communiqués. Le projet de loi de finances 2027 prévoit un investissement d'environ 1,3 Md€ au programme 146.\n\nPour Panoplie, la fiche lit un programme souverain à un stade amont : une enveloppe budgétaire non votée, une cible de programme MdCN rapportée par la presse, et un chiffre — le nombre de Mk2 — que personne ne publie.",
  keySpecs: [
    ind("Portée annoncée", "Plus de 1 000 km (annonce du ministère)", "moyenne", { ids: ["MET-0323"], fs: "presse", src: ["opex360-mdcn-mk2"], note: "Portée annoncée, non démontrée." }),
    ind("Premières livraisons", "« À partir de 2030 » à la Marine", "moyenne", { ids: ["MET-0325"], fs: "presse", src: ["opex360-mdcn-mk2"] }),
    ind("Nombre de MdCN Mk2", "n.c.", "haute", { ids: ["MET-0326"], fs: "non-communique", note: "Le nombre de Mk2 n'est pas communiqué." }),
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le coût du MdCN Mk2 n'a pas de prix unitaire : le projet de loi de finances 2027 inscrit un investissement prévu d'environ 1,3 Md€ au programme 146, sans nombre de missiles. Rapporté à une quantité inconnue, ce montant ne dit rien du coût d'un missile.",
      indicators: [
        ind("Investissement prévu (PLF 2027, programme 146)", "Environ 1,3 Md€", "moyenne", { ids: ["MET-0324"], fs: "requete-budgetaire", src: ["opex360-mdcn-mk2"], note: "Requête budgétaire du PLF 2027, non votée." }),
        ind("Prix unitaire", "non documenté", "faible"),
      ],
    },
    {
      key: "finance",
      narrative:
        "Le Mk2 s'inscrit dans le programme MdCN, dont la cible a été rapportée à 150 missiles — contre une cible initiale de 250 — dont 50 pour les sous-marins. Ces chiffres concernent le programme MdCN, pas le seul Mk2.",
      indicators: [
        ind("Cible du programme MdCN", "150 missiles, dont 50 pour les sous-marins", "moyenne", { ids: ["MET-0327", "MET-0329"], fs: "presse", src: ["opex360-mdcn-mk2"] }),
        ind("Cible initiale du programme MdCN", "250 missiles", "moyenne", { ids: ["MET-0328"], fs: "presse", src: ["opex360-mdcn-mk2"] }),
        ind("Signature du contrat Mk2", "Annoncée comme prochaine — montant, nombre de missiles et porteurs à préciser", "moyenne", { src: ["opex360-mdcn-mk2"] }),
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "MBDA est maître d'œuvre du missile ; le registre ne cite aucun autre acteur de la chaîne du Mk2 et ne documente aucun fournisseur critique.",
      indicators: [
        ind("Maître d'œuvre", "MBDA — contrat à signer", "haute", { src: ["opex360-mdcn-mk2"] }),
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Le registre classe le MdCN Mk2 en « souveraineté nationale » pour la règle de contenu local. Pour le programme MdCN, il relève une limite de profondeur de salve : une cible de 150 missiles représente moins de 15 % des plus de 1 000 Tomahawk tirés en 39 jours pendant la guerre contre l'Iran (calcul du registre).",
      indicators: [
        ind("Règle de contenu local", "Souveraineté nationale", "moyenne", { note: "Valeur du registre (bloc souveraineté ci-dessous)." }),
        ind("Profondeur de salve — MdCN rapporté aux Tomahawk tirés", "Moins de 15 % (calc.) : 150 missiles contre plus de 1 000 Tomahawk tirés en 39 jours", "faible", { ids: ["MET-0332"], fs: "calcule", note: "Calcul du registre à partir de chiffres de presse ; comparaison d'ordre de grandeur, pas un constat opérationnel." }),
      ],
    },
    {
      key: "export",
      narrative:
        "Le registre ne documente ni verrou d'un tiers ni accès au code source pour le MdCN Mk2, et ne mentionne aucun projet d'export : on n'en déduit rien.",
      indicators: [ind("Régime export et propriété intellectuelle", "non documenté", "faible")],
    },
  ],
  scores: scoreSet({
    "efficacite-cout": ["D", "Investissement prévu sans nombre de missiles : aucun coût unitaire ne peut être lu."],
    survivabilite: ["D", "Aucune donnée publique de survivabilité ; portée annoncée de plus de 1 000 km, non démontrée."],
    exportabilite: ["D", "Régime d'export non documenté ; programme classé en souveraineté nationale."],
    "risque-industriel": ["C", "Maître d'œuvre unique (MBDA) ; contrat à signer, calendrier à partir de 2030."],
    maturite: ["D", "Commande annoncée mais non signée ; premières livraisons visées à partir de 2030."],
    "confiance-donnees": ["C", "Chiffres issus de la presse spécialisée et d'une requête budgétaire non votée ; quantité non communiquée."],
  }),
  editorial: {
    mythVsReality:
      "Le mythe : une enveloppe budgétaire suffit à dimensionner une capacité de frappe. La réalité : sans nombre de missiles ni porteurs, le montant ne dit rien de la profondeur de salve — le registre la compare d'ailleurs défavorablement aux tirs de Tomahawk.",
    bestUseCase:
      "Lire un programme souverain de frappe à un stade amont : budget non voté, contrat à signer, quantités non publiées.",
    weakPoint:
      "Le nombre de Mk2 n'est pas communiqué : tout coût unitaire serait une invention.",
    analystNote:
      "À suivre : la signature annoncée du contrat, avec montant, nombre de missiles et porteurs.",
  },
  operators: ["France — Marine nationale (prévu)"],
  theatres: ["Aucun — standard non livré"],
  timeline: [
    { date: "2026-11", label: "Le ministère des Armées annonce vouloir commander le MdCN Mk2 à MBDA ; investissement prévu d'environ 1,3 Md€ au PLF 2027.", kind: "jalon", metricIds: ["MET-0324"] },
    { date: "2030", label: "Premières livraisons du MdCN Mk2 à la Marine « à partir de 2030 ».", kind: "jalon", metricIds: ["MET-0325"] },
  ],
  registryEntityIds: ["ENT-MDCN-MK2", "ENT-MDCN"],
  programmeTree: [
    { entityId: "ENT-MDCN", name: "MdCN (missile de croisière naval)", kind: "Munition_Effecteur", children: [
      { entityId: "ENT-MDCN-MK2", name: "MdCN Mk2", kind: "Munition_Effecteur" },
    ] },
  ],
  industrialChain: [
    { entityId: "ENT-MDCN-MK2", entityName: "MdCN Mk2", actor: "MBDA", role: "Maitre_Oeuvre", country: "France", scope: "Missile de croisière naval Mk2 (contrat à signer)" },
  ],
  sovereignty: [
    { entityId: "ENT-MDCN", scope: "Programme MdCN", localContentRule: "Non_specifie", thirdPartyLock: "Non_specifie", sourceCodeAccess: "Non_specifie", chokepoints: ["Profondeur de salve : cible de 150 MdCN, moins de 15 % des plus de 1 000 Tomahawk tirés en 39 jours (note15 [^4][^14], calc.)"] },
    { entityId: "ENT-MDCN-MK2", scope: "MdCN Mk2", localContentRule: "Souverain_National", thirdPartyLock: "Non_specifie", sourceCodeAccess: "Non_specifie", chokepoints: [] },
  ],
  watchpoints: [
    { entityId: "ENT-MDCN-MK2", entityName: "MdCN Mk2", horizon: "Annoncée « prochaine »", event: "Signature du MdCN Mk2 : montant, nombre de missiles et porteurs." },
  ],
  sources: [
    src("opex360-mdcn-mk2", "Opex360", "Marine nationale : le ministère des Armées va commander un nouveau standard du missile de croisière naval à MBDA", "presse", "C", "2026-11-06", "https://www.opex360.com/2026/11/06/marine-nationale-le-ministere-des-armees-va-commander-un-nouveau-standard-du-missile-de-croisiere-naval-a-mbda/"),
  ],
  updated: "2026-11-17",
};
