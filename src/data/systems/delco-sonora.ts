import type { DefenseSystem } from "../types";
import { ind, scoreSet, src } from "./registry-helpers";

// Delco / Sonora (Harmattan AI) — fiche issue du registre « Souveraineté
// industrielle » du 17/11/2026. Le prix unitaire n'est pas publié : le chiffre
// d'environ 8 M€ pour le premier lot, à source unique, n'est pas converti en
// prix par drone.

export const delcoSonora: DefenseSystem = {
  slug: "delco-sonora",
  name: "Delco / Sonora",
  designation: "Micro-drones du combattant d'Harmattan AI — quadricoptères",
  reference: "PNP-DR-023",
  category: "drone",
  droneClass: "ISR",
  classLabel: "Micro-drone du combattant (quadricoptère)",
  country: "France",
  flag: "🇫🇷",
  manufacturer: "Harmattan AI",
  introduced: "Premiers drones livrés en janvier 2026",
  status:
    "6 000 micro-drones commandés en deux fois (1 000 en juin 2025, 5 000 le 28 mai 2026) ; 1 000 premiers livrés en janvier 2026, 5 000 Delco attendus au plus tard début 2027",
  acquisitionModes: ["production-nationale"],
  tagline:
    "Des micro-drones du combattant produits en série pour l'armée de Terre : 6 000 commandés à Harmattan AI, aucun prix unitaire publié.",
  summary:
    "Sonora et Delco sont des micro-drones du combattant conçus et produits par Harmattan AI pour l'armée de Terre. La DGA en a commandé 1 000 en juin 2025, puis 5 000 le 28 mai 2026, soit 6 000 au total ; les 1 000 premiers ont été livrés en janvier 2026 et les 5 000 Delco sont attendus « au plus tard début 2027 ». Le Delco pèse 1,8 kg, a une portée de plus de deux kilomètres et une autonomie de 40 minutes selon la DGA.\n\nPour Panoplie, c'est le cas d'école d'une commande en volume sans transparence de prix : la DGA ne publie ni le montant du contrat de mai 2026 ni un prix unitaire. Un chiffre d'environ 8 M€ pour le premier lot circule, à source unique ; Panoplie ne le convertit pas en prix par drone.",
  keySpecs: [
    ind("Masse du Delco", "1,8 kg", "haute", { ids: ["MET-0401"], fs: "officiel", src: ["dga-delco-2026"] }),
    ind("Portée du Delco", "Plus de deux kilomètres", "haute", { ids: ["MET-0402"], fs: "officiel", src: ["dga-delco-2026"] }),
    ind("Autonomie du Delco", "40 minutes", "haute", { ids: ["MET-0403"], fs: "officiel", src: ["dga-delco-2026"] }),
    ind("Capteurs", "Caméras infrarouges et optronique de Lynred", "moyenne", { src: ["dga-delco-2026"], note: "Fournisseur de rang 1 cité par le registre." }),
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le coût du Delco n'est pas public : la DGA ne publie ni le montant du contrat de mai 2026 ni un prix unitaire. Un budget d'environ 8 M€ pour les 1 000 premiers drones est rapporté par un seul article, sans document à l'appui ; rapporté au nombre de drones, il donnerait un prix qu'aucune source ne confirme — Panoplie ne le calcule pas.",
      indicators: [
        ind("Montant du contrat de mai 2026", "n.c.", "haute", { ids: ["MET-0397"], fs: "non-communique", src: ["dga-delco-2026"], note: "Le montant n'a pas été dévoilé." }),
        ind("Prix unitaire du Delco", "n.c.", "haute", { ids: ["MET-0398"], fs: "non-communique", note: "La DGA ne publie ni montant ni prix." }),
        ind("Budget des 1 000 premiers drones", "Environ 8 M€", "faible", { ids: ["MET-0394"], fs: "source-unique", src: ["clubic-1000-drones"], note: "Chiffre d'un article sans document ; à ne pas lire comme un prix par drone." }),
      ],
    },
    {
      key: "finance",
      narrative:
        "La commande s'est faite en deux lots : 1 000 drones en juin 2025, 5 000 autres le 28 mai 2026. Le registre totalise 6 000 micro-drones Sonora et Delco commandés. Les 1 000 premiers ont été livrés en janvier 2026 pour Orion 2026 ; les 5 000 Delco doivent l'être au plus tard début 2027.",
      indicators: [
        ind("Premier lot", "1 000 drones Sonora commandés en juin 2025", "haute", { ids: ["MET-1550", "MET-0387"], fs: "commande-ferme", src: ["dga-1000-drones-2025"] }),
        ind("Second lot", "5 000 Delco commandés le 28 mai 2026", "haute", { ids: ["MET-1348", "MET-0388", "MET-0389"], fs: "officiel", src: ["dga-delco-2026"] }),
        ind("Total commandé", "6 000 micro-drones Sonora et Delco, en deux fois", "haute", { ids: ["MET-0386"], fs: "commande-ferme", src: ["dga-delco-2026", "dga-1000-drones-2025"] }),
        ind("Livraison du premier lot", "1 000 premiers drones livrés en janvier 2026", "haute", { ids: ["MET-0391"], fs: "officiel", src: ["dga-delco-2026"] }),
        ind("Livraison des 5 000 Delco", "« Au plus tard début 2027 »", "haute", { ids: ["MET-0390"], fs: "officiel", src: ["dga-delco-2026"] }),
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "Harmattan AI est maître d'œuvre — conception et production — avec Lynred en fournisseur de rang 1 des caméras infrarouges et capteurs optroniques. Le registre ne documente aucun goulot d'étranglement ni verrou d'un tiers.",
      indicators: [
        ind("Maître d'œuvre", "Harmattan AI — conception et production", "haute", { src: ["dga-delco-2026"] }),
        ind("Capteurs infrarouges", "Lynred — sous-traitant de rang 1", "moyenne", { src: ["dga-delco-2026"] }),
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Le Delco relève du Pacte drones aériens de défense : un cadre signé en juin 2024 qui réunit environ une centaine d'entreprises autour de drones de moins de 150 kg, avec un premier lot de 1 000 drones d'entraînement à bas coût pour Orion 2026.",
      indicators: [
        ind("Pacte drones aériens de défense", "Signé le 17 juin 2024 — environ une centaine d'entreprises, drones de moins de 150 kg", "haute", { ids: ["MET-0421", "MET-0422", "MET-0423"], fs: "officiel", src: ["minarm-pacte-drones"] }),
        ind("Premier lot du Pacte", "1 000 drones d'entraînement à bas coût pour Orion 2026", "haute", { ids: ["MET-0424"], fs: "officiel", src: ["minarm-pacte-drones"] }),
      ],
    },
    {
      key: "export",
      narrative:
        "Rien n'est documenté sur l'export, le contenu local ou l'accès au code source du Delco et du Sonora.",
      indicators: [ind("Régime export et accès au code source", "non documenté", "faible")],
    },
  ],
  scores: scoreSet({
    "efficacite-cout": ["D", "Prix unitaire et montant du contrat non communiqués ; l'unique chiffre budgétaire repose sur une source unique."],
    survivabilite: ["D", "Aucune donnée de survivabilité ; micro-drone de 1,8 kg à autonomie de 40 minutes."],
    exportabilite: ["D", "Aucun élément d'export documenté."],
    "risque-industriel": ["C", "Un maître d'œuvre unique pour 6 000 drones, des capteurs infrarouges d'un seul fournisseur de rang 1 ; échéance de livraison de 2027 à tenir."],
    maturite: ["B", "Premier lot de 1 000 drones livré en janvier 2026 ; second lot de 5 000 attendu début 2027."],
    "confiance-donnees": ["B", "Commandes, livraisons et caractéristiques confirmées par la DGA ; prix absents."],
  }),
  editorial: {
    mythVsReality:
      "Le mythe : des milliers de drones commandés se lisent à leur prix. La réalité : 6 000 drones commandés, aucun prix publié — seul un article cite environ 8 M€ pour le premier lot.",
    bestUseCase:
      "Lire une commande en volume de micro-drones où les quantités et les délais sont publics et les prix ne le sont pas.",
    weakPoint:
      "L'absence de prix et de montant : toute comparaison de coût avec d'autres drones serait une spéculation.",
    analystNote:
      "À suivre : la livraison des 5 000 Delco au plus tard début 2027, le respect de l'échéance et la cadence mensuelle.",
  },
  operators: ["France — armée de Terre"],
  theatres: ["Exercices — Orion 2026"],
  timeline: [
    { date: "2025-06", label: "La DGA commande 1 000 drones du combattant Sonora à Harmattan AI (juin 2025).", kind: "jalon", metricIds: ["MET-1550"] },
    { date: "2026-01", label: "Livraison des 1 000 premiers drones en janvier 2026, pour Orion 2026.", kind: "jalon", metricIds: ["MET-0391"] },
    { date: "2026-05", label: "La DGA commande 5 000 Delco le 28 mai 2026.", kind: "jalon", metricIds: ["MET-1348"] },
    { date: "2027", label: "Livraison des 5 000 Delco attendue au plus tard début 2027.", kind: "jalon", metricIds: ["MET-0390"] },
  ],
  registryEntityIds: ["ENT-DELCO-SONORA", "ENT-PACTE-DRONES"],
  programmeTree: [
    { entityId: "ENT-PACTE-DRONES", name: "Pacte drones aériens de défense", kind: "Programme_Cadre", children: [
      { entityId: "ENT-DELCO-SONORA", name: "Delco", kind: "Plateforme_Vecteur" },
    ] },
  ],
  industrialChain: [
    { entityId: "ENT-DELCO-SONORA", entityName: "Delco", actor: "Harmattan AI", role: "Maitre_Oeuvre", country: "France", scope: "Quadricoptère Delco / Sonora" },
    { entityId: "ENT-DELCO-SONORA", entityName: "Delco", actor: "Lynred", role: "Sous-traitant_Rang_1", country: "France", scope: "Caméras infrarouges" },
    { entityId: "ENT-DELCO-SONORA", entityName: "Delco", actor: "Harmattan AI", role: "Maitre_Oeuvre", country: "France", scope: "Conception et production" },
    { entityId: "ENT-DELCO-SONORA", entityName: "Delco", actor: "Lynred", role: "Sous-traitant_Rang_1", country: "France", scope: "Capteurs IR / optronique" },
  ],
  sovereignty: [
    { entityId: "ENT-DELCO-SONORA", localContentRule: "Non_specifie", thirdPartyLock: "Non_specifie", sourceCodeAccess: "Non_specifie", chokepoints: [] },
  ],
  watchpoints: [
    { entityId: "ENT-DELCO-SONORA", entityName: "Delco", horizon: "Début 2027", event: "Livraison des 5 000 Delco : respect de l'échéance et cadence mensuelle observée." },
    { entityId: "ENT-DELCO-SONORA", entityName: "Delco", horizon: "n.c.", event: "Montant du contrat et prix unitaire : publication par la DGA ou comptes d'Harmattan AI." },
    { entityId: "ENT-DELCO-SONORA", entityName: "Delco", horizon: "Début 2027", event: "Livraison des Delco" },
  ],
  sources: [
    src("dga-delco-2026", "Ministère des Armées — DGA", "La DGA commande 5 000 drones du combattant Delco pour l'armée de Terre", "officiel", "A", "2026-06-23", "https://www.defense.gouv.fr/dga/actualites/dga-commande-5-000-drones-du-combattant-delco-larmee-terre"),
    src("dga-1000-drones-2025", "Ministère des Armées — DGA", "La DGA commande 1 000 drones du combattant au fabricant français Harmattan AI pour équiper l'armée de Terre", "officiel", "A", "2025-07-02", "https://prod-site-internet-minarm-admin.cloud.defense.gouv.fr/sites/default/files/ministere-armees/02.07.2025%20La%20Direction%20g%C3%A9n%C3%A9rale%20de%20l%27armement%20commande%201%20000%20drones%20du%20combattant%20au%20fabricant%20fran%C3%A7ais%20Harmattan%20AI%20pour%20%C3%A9quiper%20l%E2%80%99arm%C3%A9e%20de%20Terre.pdf"),
    src("minarm-pacte-drones", "Ministère des Armées", "Le « pacte drones aériens de défense » désormais pleinement opérationnel", "officiel", "A", "2024-12-05", "https://prod-site-internet-minarm-admin.cloud.defense.gouv.fr/sites/default/files/ministere-armees/Communiqu%C3%A9_Le%20%C2%AB%20pacte%20drones%20a%C3%A9riens%20de%20d%C3%A9fense%20%C2%BB%20d%C3%A9sormais%20pleinement%20op%C3%A9rationnel.pdf"),
    src("clubic-1000-drones", "Clubic", "L'armée de Terre française s'équipe de 1 000 nouveaux drones made in France", "presse", "D", "2025-07-03", "https://www.clubic.com/actualite-571251-l-armee-de-terre-francaise-s-equipe-de-1-000-nouveaux-drones-made-in-france.html"),
  ],
  updated: "2026-11-17",
};
