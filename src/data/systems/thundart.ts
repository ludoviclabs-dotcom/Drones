import type { DefenseSystem } from "../types";
import { ind, scoreSet, src } from "./registry-helpers";

// Thundart (FLP-T) — fiche issue du registre « Souveraineté industrielle » du
// 17/11/2026. Les caractéristiques techniques du registre qui ne reposent que
// sur un message de réseau social (calibre, nombre de roquettes, charge) ne sont
// pas reprises ; seule la portée annoncée par MBDA l'est.

export const thundart: DefenseSystem = {
  slug: "thundart",
  name: "Thundart (FLP-T)",
  designation: "Frappe longue portée terrestre — lance-roquettes remplaçant des LRU",
  reference: "PNP-MSL-019",
  category: "missile",
  missileRole: "SSM",
  classLabel: "Système de frappe longue portée terrestre (lance-roquettes)",
  country: "France",
  flag: "🇫🇷",
  manufacturer: "Safran · MBDA",
  introduced: "Premières capacités 2030–2035",
  status:
    "Sélectionné par la DGA le 15 juin 2026 ; marché notifié le 10 septembre 2026 — montant, quantités de munitions et premières livraisons non communiqués",
  acquisitionModes: ["production-nationale"],
  tagline:
    "Le système français de frappe longue portée terrestre retenu face à l'offre Thales / ArianeGroup : 26 lanceurs visés, portée annoncée jusqu'à 150 km, montant non communiqué.",
  summary:
    "Thundart est le système de frappe longue portée terrestre (FLP-T) de Safran et MBDA, appelé à remplacer les lance-roquettes unitaires (LRU). La DGA l'a sélectionné le 15 juin 2026, à l'ouverture d'Eurosatory, face à l'offre FLP-T 150 de Thales et ArianeGroup ; le marché a été notifié le 10 septembre 2026. La mise en service opérationnelle est visée en 2030.\n\nPour Panoplie, c'est un programme souverain dont le contrôle se lit dans le registre — souveraineté nationale, aucun veto d'un tiers — et dont les chiffres clés sont absents : ni montant du marché, ni quantités de munitions, ni coût du programme ne sont communiqués. La fiche lit la capacité (26 lanceurs, option à 52) sans inventer son prix.",
  keySpecs: [
    ind("Portée de frappe de précision", "Jusqu'à 150 km (annonce MBDA)", "moyenne", { ids: ["MET-0340"], fs: "officiel", src: ["mbda-thundart"], note: "Annonce de l'industriel, pas une performance démontrée en service." }),
    ind("Maîtres d'œuvre", "Safran (lance-roquettes) · MBDA (munitions de frappe de précision)", "haute", { src: ["mbda-thundart", "safran-mbda-dga"] }),
    ind("Mise en service opérationnelle", "Visée en 2030 ; « totale autonomie d'emploi d'ici 2030 »", "moyenne", { ids: ["MET-0346"], fs: "officiel", src: ["safran-mbda-dga"] }),
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le coût de Thundart est un trou : le montant du marché notifié, les quantités de munitions et le coût du programme sont tous « non communiqués ». Aucune estimation n'est avancée ici — le registre n'en contient pas qui soit sourcée.",
      indicators: [
        ind("Montant du marché notifié", "n.c.", "haute", { ids: ["MET-0344"], fs: "non-communique", src: ["mbda-thundart"] }),
        ind("Quantités de munitions du marché", "n.c.", "haute", { ids: ["MET-0345"], fs: "non-communique", src: ["mbda-thundart"] }),
        ind("Coût du programme", "n.c.", "haute", { ids: ["MET-1326"], fs: "non-communique", src: ["senat-lpm-actualisee"] }),
      ],
    },
    {
      key: "finance",
      narrative:
        "La LPM actualisée prévoit 26 lanceurs pour 2030 et 2031 et ajoute jusqu'à 13 lanceurs à la cible de frappe longue portée terrestre ; un amendement sénatorial l'étend, au besoin, à 52 en 2035. Cette extension est une option, pas une commande.",
      indicators: [
        ind("Lanceurs prévus (LPM actualisée)", "26 lanceurs pour 2030 et 2031", "haute", { ids: ["MET-0347"], fs: "officiel", src: ["an-avis-3394"] }),
        ind("Cible de frappe longue portée terrestre", "26 systèmes souverains d'ici 2030–2035, dont jusqu'à +13 lanceurs ajoutés par la LPM actualisée", "haute", { ids: ["MET-0991", "MET-0990"], fs: "officiel", src: ["senat-lpm-actualisee"] }),
        ind("Extension à 52 lanceurs", "Option : cible extensible au besoin à 52 en 2035 (amendement sénatorial) — pas une commande ferme", "moyenne", { ids: ["MET-0992", "MET-1325"], fs: "plafond-cadre", src: ["senat-lpm-actualisee"] }),
        ind("Premières capacités", "2030–2035", "moyenne", { ids: ["MET-1327"], fs: "officiel", src: ["senat-lpm-actualisee"] }),
        ind("Notification du marché par la DGA", "10 septembre 2026 (Safran et MBDA)", "haute", { ids: ["MET-0343"], fs: "officiel", src: ["safran-mbda-dga"] }),
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "Safran est maître d'œuvre du lance-roquettes, MBDA fournit les munitions de frappe de précision : deux co-traitants français, notifiés conjointement par la DGA. Le registre ne documente aucun fournisseur critique étranger.",
      indicators: [
        ind("Lance-roquettes", "Safran — maître d'œuvre", "haute", { src: ["safran-mbda-dga"] }),
        ind("Munitions", "MBDA — munitions de frappe de précision", "haute", { src: ["mbda-thundart"] }),
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Thundart illustre la remontée d'une capacité de frappe terrestre en profondeur côté français. Le registre le classe en souveraineté nationale, sans veto d'un tiers : la liberté d'emploi ne dépend d'aucune autorisation extérieure documentée.",
      indicators: [
        ind("Sélection par la DGA", "15 juin 2026, à l'ouverture d'Eurosatory", "haute", { ids: ["MET-0342"], fs: "officiel", src: ["mbda-thundart"] }),
        ind("Concurrent écarté", "Offre FLP-T 150 de Thales et ArianeGroup", "haute", { src: ["mbda-thundart"] }),
      ],
    },
    {
      key: "export",
      narrative:
        "Rien n'est documenté sur l'export de Thundart ni sur l'accès au code source : le registre ne renseigne que la souveraineté nationale et l'absence de veto d'un tiers.",
      indicators: [ind("Régime export et accès au code source", "non documenté", "faible")],
    },
  ],
  scores: scoreSet({
    "efficacite-cout": ["D", "Montant du marché, quantités de munitions et coût du programme non communiqués : aucune lecture de coût."],
    survivabilite: ["D", "Aucune donnée publique de survivabilité ; portée annoncée par l'industriel."],
    exportabilite: ["D", "Aucun élément d'export documenté ; règle de souveraineté nationale."],
    "risque-industriel": ["B", "Deux co-traitants français, souveraineté nationale et aucun veto d'un tiers selon le registre."],
    maturite: ["C", "Marché notifié le 10 septembre 2026 ; premières capacités visées entre 2030 et 2035."],
    "confiance-donnees": ["C", "Sources officielles et industrielles solides pour le calendrier et la cible, mais aucun chiffre de coût."],
  }),
  editorial: {
    mythVsReality:
      "Le mythe : un système sélectionné est un système chiffré. La réalité : le montant du marché, les quantités de munitions et le coût du programme ne sont pas communiqués.",
    bestUseCase:
      "Comparer capacité visée (26 lanceurs, option à 52) et opacité budgétaire d'un programme souverain de frappe terrestre.",
    weakPoint:
      "Aucun chiffre de coût : la fiche ne peut lire ni prix, ni prix par lanceur, ni coût de salve.",
    analystNote:
      "À suivre fin 2026 : le contrat du Thundart — montant, quantités et premières livraisons du marché notifié en septembre.",
  },
  operators: ["France — armée de Terre (prévu)"],
  theatres: ["Aucun — système non livré"],
  timeline: [
    { date: "2026-06", label: "La DGA sélectionne Thundart le 15 juin 2026, à l'ouverture d'Eurosatory.", kind: "jalon", metricIds: ["MET-0342"] },
    { date: "2026-09", label: "Notification du marché de frappe longue portée terrestre à Safran et MBDA le 10 septembre 2026.", kind: "jalon", metricIds: ["MET-0343"] },
    { date: "2030", label: "Mise en service opérationnelle visée en 2030.", kind: "jalon", metricIds: ["MET-0346"] },
  ],
  registryEntityIds: ["ENT-THUNDART", "ENT-FLP-T150"],
  industrialChain: [
    { entityId: "ENT-THUNDART", entityName: "Thundart", actor: "Safran", role: "Co-traitant", country: "France", scope: "Système Thundart (FLP-T), marché notifié par la DGA" },
    { entityId: "ENT-THUNDART", entityName: "Thundart", actor: "MBDA", role: "Co-traitant", country: "France", scope: "Système Thundart (FLP-T), munitions de frappe de précision" },
    { entityId: "ENT-THUNDART", entityName: "Thundart", actor: "Safran", role: "Co-traitant", country: "France", scope: "Système Thundart" },
    { entityId: "ENT-THUNDART", entityName: "Thundart", actor: "MBDA", role: "Co-traitant", country: "France", scope: "Système Thundart" },
    { entityId: "ENT-THUNDART", entityName: "Thundart", actor: "Safran", role: "Maitre_Oeuvre", country: "France", scope: "Lance-roquettes" },
    { entityId: "ENT-THUNDART", entityName: "Thundart", actor: "MBDA", role: "Co-traitant", country: "Europe", scope: "Munitions" },
  ],
  sovereignty: [
    { entityId: "ENT-THUNDART", localContentRule: "Souverain_National", thirdPartyLock: "Aucun_Veto_Tiers", sourceCodeAccess: "Non_specifie", chokepoints: [] },
  ],
  watchpoints: [
    { entityId: "ENT-THUNDART", entityName: "Thundart", horizon: "Fin 2026", event: "Contrat du Thundart : montant, quantités et premières livraisons du marché notifié en septembre ; capacité à livrer 26 lanceurs, instruite d'ici fin 2026." },
    { entityId: "ENT-THUNDART", entityName: "Thundart", horizon: "2030–2035", event: "Premières capacités (26 lanceurs)" },
  ],
  sources: [
    src("mbda-thundart", "MBDA", "MBDA et Safran en phase finale pour fournir THUNDART, la future capacité française de frappe longue portée terrestre", "constructeur", "B", "2026-06-16", "https://newsroom.mbda-systems.com/mbda-and-safran-reach-final-phase-to-provide-thundart-frances-future-french-long-range-land-strike-capability-22063/?lang=en"),
    src("safran-mbda-dga", "Safran et MBDA", "Safran et MBDA notifiés par la DGA pour fournir la nouvelle capacité de frappe longue portée terrestre", "constructeur", "B", "2026-09-10", "https://www.safran-group.com/fr/espace-presse/safran-mbda-notifies-dga-fournir-nouvelle-capacite-frappe-longue-portee-terrestre-2026-09-10"),
    src("an-avis-3394", "Assemblée nationale — commission de la défense", "Avis n° 3394 sur le projet de loi de finances pour 2027, tome IV « Préparation et emploi des forces : forces terrestres »", "officiel", "A", "2026-10-22", "https://www.assemblee-nationale.fr/dyn/17/rapports/cion_def/l17b3394-tiv_rapport-avis.pdf"),
    src("senat-lpm-actualisee", "Sénat", "L'essentiel sur l'actualisation de la LPM 2024-2030 (pjl25-635)", "institution", "A", "2026-05", "https://www.senat.fr/lessentiel/pjl25-635.pdf"),
  ],
  updated: "2026-11-17",
};
