import type { DefenseSystem } from "../types";
import { ind, scoreSet, src } from "./registry-helpers";

// SLAM-F (système de lutte anti-mines futur) — fiche issue du registre
// « Souveraineté industrielle » du 17/11/2026 : drones de surface de Thales et
// drones sous-marins du groupement Thales / Exail. Aucun montant n'est publié.

export const slamF: DefenseSystem = {
  slug: "slam-f",
  name: "SLAM-F",
  designation: "Système de lutte anti-mines futur — drones de surface (Thales) et sous-marins (Thales · Exail)",
  reference: "PNP-DR-026",
  category: "drone",
  droneClass: "USV",
  classLabel: "Programme de drones de guerre des mines (surface et sous-marins)",
  country: "France",
  flag: "🇫🇷",
  manufacturer: "Thales (mandataire) · Exail",
  introduced: "Premier drone de surface livré le 19 décembre 2024",
  status:
    "Une douzaine de drones supplémentaires commandés en juillet 2026 ; huit drones sous-marins commandés en novembre 2024 (premières livraisons au premier semestre 2028) — montants non communiqués",
  acquisitionModes: ["cooperatif", "production-nationale"],
  tagline:
    "Le programme de drones de guerre des mines mené avec le Royaume-Uni, la Belgique et les Pays-Bas : drones de surface de Thales, drones sous-marins de Thales et Exail, aucun montant public.",
  summary:
    "Le SLAM-F est le système de lutte anti-mines futur de la Marine nationale. Il comprend des drones de surface de guerre des mines — dont le premier a été livré à la Marine le 19 décembre 2024, pour association à cinq autres — et des drones sous-marins autonomes de nouvelle génération : huit commandés à Thales et Exail en novembre 2024, avec huit autres en tranches optionnelles. Une douzaine de drones supplémentaires ont été commandés en juillet 2026.\n\nPour Panoplie, c'est un programme coopératif — Royaume-Uni pour les drones, Belgique et Pays-Bas pour les navires porteurs — dont aucun montant n'est public : ni la commande de juillet 2026, ni les contrats de surface et sous-marins, ni le coût total.",
  keySpecs: [
    ind("Drones de surface — premier livré", "19 décembre 2024, à associer à cinq autres", "haute", { ids: ["MET-0233", "MET-0234"], fs: "officiel", src: ["dga-slam-f-surface"] }),
    ind("Drones de surface — capacité opérationnelle visée", "Fin 2025", "haute", { ids: ["MET-0235"], fs: "officiel", src: ["dga-slam-f-surface"] }),
    ind("Drones sous-marins commandés", "Huit, auprès de Thales et Exail (novembre 2024)", "haute", { ids: ["MET-0237"], fs: "commande-ferme", src: ["dga-slam-f-sous-marins"] }),
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Aucun montant n'est public pour le SLAM-F : ni la commande de juillet 2026, ni les contrats de drones de surface et sous-marins, ni le coût total du programme.",
      indicators: [
        ind("Montant de la commande de juillet 2026", "n.c.", "haute", { ids: ["MET-0231"], fs: "non-communique", src: ["dga-slam-f-2026"] }),
        ind("Coût total du programme", "n.c.", "haute", { ids: ["MET-0232"], fs: "non-communique" }),
        ind("Contrat des drones de surface (Thales)", "n.c.", "haute", { ids: ["MET-0236"], fs: "non-communique", src: ["dga-slam-f-surface"] }),
        ind("Contrat des drones sous-marins (Thales, Exail)", "n.c.", "haute", { ids: ["MET-0241"], fs: "non-communique", src: ["dga-slam-f-sous-marins"] }),
      ],
    },
    {
      key: "finance",
      narrative:
        "Les commandes se sont succédé : huit drones sous-marins en novembre 2024, avec huit autres en tranches optionnelles — une option, pas une commande —, puis une douzaine de drones supplémentaires en juillet 2026. Les premières livraisons de drones sous-marins sont attendues au premier semestre 2028, la livraison des huit à l'horizon mi-2030.",
      indicators: [
        ind("Drones supplémentaires commandés", "Une douzaine, en juillet 2026 (sous-marins et de surface)", "haute", { ids: ["MET-0230"], fs: "commande-ferme", src: ["dga-slam-f-2026"] }),
        ind("Tranches optionnelles — drones sous-marins", "Huit de plus en tranches optionnelles — option, pas une commande ferme", "moyenne", { ids: ["MET-0238"], fs: "plafond-cadre", src: ["dga-slam-f-sous-marins"] }),
        ind("Premières livraisons — drones sous-marins", "Premier semestre 2028", "haute", { ids: ["MET-0239"], fs: "officiel", src: ["dga-slam-f-sous-marins"] }),
        ind("Livraison des huit drones sous-marins", "À l'horizon mi-2030", "haute", { ids: ["MET-0240"], fs: "officiel", src: ["dga-slam-f-sous-marins"] }),
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "Thales est maître d'œuvre des drones de surface et mandataire du groupement des drones sous-marins, dont Exail est co-traitant. Le Royaume-Uni est partenaire sur les drones ; la Belgique et les Pays-Bas coopèrent sur les navires porteurs.",
      indicators: [
        ind("Drones de surface", "Thales — maître d'œuvre", "haute", { src: ["dga-slam-f-surface"] }),
        ind("Drones sous-marins", "Thales (mandataire) et Exail (co-traitant)", "haute", { src: ["dga-slam-f-sous-marins"] }),
        ind("Coopération", "Royaume-Uni (drones) ; Belgique et Pays-Bas (navires porteurs)", "moyenne", { note: "Valeur de la chaîne de valeur du registre (ci-dessous)." }),
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Le SLAM-F est un programme de coopération : le registre le classe en coopération multinationale pour la règle de contenu local. Le Royaume-Uni, la Belgique et les Pays-Bas y sont associés ; le registre ne documente ni verrou d'un tiers ni accès au code source.",
      indicators: [
        ind("Règle de contenu local", "Coopération multinationale", "moyenne", { note: "Valeur du registre (bloc souveraineté ci-dessous)." }),
      ],
    },
    {
      key: "export",
      narrative:
        "Rien n'est documenté sur l'export du SLAM-F au-delà de la coopération avec le Royaume-Uni, la Belgique et les Pays-Bas.",
      indicators: [ind("Régime export et accès au code source", "non documenté", "faible")],
    },
  ],
  scores: scoreSet({
    "efficacite-cout": ["D", "Aucun montant publié : ni commande, ni contrats, ni coût total."],
    survivabilite: ["D", "Aucune donnée publique de survivabilité."],
    exportabilite: ["C", "Programme coopératif avec trois partenaires étrangers ; régime d'export non documenté."],
    "risque-industriel": ["B", "Maîtrise d'œuvre française solide (Thales, Exail) et coopération multinationale."],
    maturite: ["C", "Premier drone de surface livré en décembre 2024 ; drones sous-marins attendus en 2028–2030."],
    "confiance-donnees": ["B", "Commandes, livraisons et calendrier confirmés par des communiqués de la DGA ; montants non communiqués."],
  }),
  editorial: {
    mythVsReality:
      "Le mythe : un programme de drones de guerre des mines se lit à son prix. La réalité : des commandes et des livraisons publiques, aucun montant.",
    bestUseCase:
      "Lire un programme de drones où les quantités, les livraisons et la coopération sont publiques et le coût ne l'est pas.",
    weakPoint:
      "Aucun montant n'est communiqué ; les options (huit drones sous-marins) ne sont pas des commandes.",
    analystNote:
      "À suivre sur 2026–2030 : prix et livraisons de la douzaine de drones commandée en juillet 2026, livraisons des drones sous-marins commandés en 2024.",
  },
  operators: ["France — Marine nationale", "Royaume-Uni (coopération)", "Belgique et Pays-Bas (navires porteurs)"],
  theatres: ["Guerre des mines — zones littorales"],
  timeline: [
    { date: "2024-11", label: "Commande de huit drones sous-marins autonomes à Thales et Exail (12/11/2024).", kind: "jalon", metricIds: ["MET-0237"] },
    { date: "2024-12", label: "Livraison du premier drone de surface de guerre des mines à la Marine nationale le 19 décembre 2024.", kind: "jalon", metricIds: ["MET-0233"] },
    { date: "2026-07", label: "Commande d'une douzaine de drones supplémentaires pour le SLAM-F (juillet 2026).", kind: "jalon", metricIds: ["MET-0230"] },
    { date: "2028", label: "Premières livraisons des drones sous-marins au premier semestre 2028.", kind: "jalon", metricIds: ["MET-0239"] },
  ],
  registryEntityIds: ["ENT-SLAM-F", "ENT-SLAM-F-DRONES-SURFACE", "ENT-SLAM-F-DRONES-SOUS-MARINS"],
  programmeTree: [
    { entityId: "ENT-SLAM-F", name: "SLAM-F (Système de lutte anti-mines futur)", kind: "Programme_Cadre", children: [
      { entityId: "ENT-SLAM-F-DRONES-SURFACE", name: "Drones de surface de guerre des mines (SLAM-F)", kind: "Plateforme_Vecteur" },
      { entityId: "ENT-SLAM-F-DRONES-SOUS-MARINS", name: "Drones sous-marins autonomes de nouvelle génération (SLAM-F)", kind: "Plateforme_Vecteur" },
      { entityId: "ENT-MMCM", name: "Systèmes de drones MMCM (franco-britannique)", kind: "Plateforme_Vecteur" },
      { entityId: "ENT-BGDM", name: "Bâtiments de guerre des mines (BGDM)", kind: "Plateforme_Vecteur" },
      { entityId: "ENT-BBPD-NG", name: "Bâtiments bases de plongeurs démineurs NG", kind: "Plateforme_Vecteur" },
      { entityId: "ENT-PMGM", name: "Plateforme modulaire de guerre des mines (PMGM, navires affrétés)", kind: "Plateforme_Vecteur" },
    ] },
  ],
  industrialChain: [
    { entityId: "ENT-SLAM-F", entityName: "SLAM-F (Système de lutte anti-mines futur)", actor: "Thales (Thales Underwater Systems)", role: "Maitre_Oeuvre", country: "France", scope: "Programme de drones de surface" },
    { entityId: "ENT-SLAM-F", entityName: "SLAM-F (Système de lutte anti-mines futur)", actor: "Thales", role: "Maitre_Oeuvre", country: "France", scope: "Mandataire du groupement pour les drones sous-marins" },
    { entityId: "ENT-SLAM-F", entityName: "SLAM-F (Système de lutte anti-mines futur)", actor: "Exail", role: "Co-traitant", country: "France", scope: "Drones sous-marins (groupement avec Thales)" },
    { entityId: "ENT-SLAM-F", entityName: "SLAM-F (Système de lutte anti-mines futur)", actor: "Royaume-Uni", role: "Partenaire", country: "Royaume-Uni", scope: "Coopération sur les drones" },
    { entityId: "ENT-SLAM-F", entityName: "SLAM-F (Système de lutte anti-mines futur)", actor: "Belgique et Pays-Bas", role: "Partenaire", country: "Belgique ; Pays-Bas", scope: "Coopération sur les navires porteurs de drones" },
    { entityId: "ENT-SLAM-F-DRONES-SURFACE", entityName: "Drones de surface de guerre des mines (SLAM-F)", actor: "Thales", role: "Maitre_Oeuvre", country: "France", scope: "Drones de surface" },
    { entityId: "ENT-SLAM-F-DRONES-SOUS-MARINS", entityName: "Drones sous-marins autonomes de nouvelle génération (SLAM-F)", actor: "Thales", role: "Maitre_Oeuvre", country: "France", scope: "Mandataire du groupement" },
    { entityId: "ENT-SLAM-F-DRONES-SOUS-MARINS", entityName: "Drones sous-marins autonomes de nouvelle génération (SLAM-F)", actor: "Exail", role: "Co-traitant", country: "France", scope: "Membre du groupement" },
  ],
  sovereignty: [
    { entityId: "ENT-SLAM-F", localContentRule: "Cooperation_Multinationale", thirdPartyLock: "Non_specifie", sourceCodeAccess: "Non_specifie", chokepoints: [] },
  ],
  watchpoints: [
    { entityId: "ENT-SLAM-F", entityName: "SLAM-F (Système de lutte anti-mines futur)", horizon: "2026-2030", event: "SLAM-F : prix et livraisons de la douzaine de drones commandée en juillet 2026, et livraisons des drones sous-marins commandés en 2024 (premières au premier semestre 2028)." },
  ],
  sources: [
    src("dga-slam-f-2026", "Ministère des Armées — DGA", "Programme Slam-F : la DGA commande douze drones supplémentaires", "officiel", "A", "2026-08-04", "https://www.defense.gouv.fr/dga/actualites/programme-slam-f-dga-commande-douze-drones-supplementaires"),
    src("dga-slam-f-surface", "Ministère des Armées — DGA", "La DGA livre le premier drone de surface de guerre des mines à la Marine nationale dans le cadre du programme SLAM-F", "officiel", "A", "2025-01-21", "https://www.defense.gouv.fr/dga/actualites/dga-livre-premier-drone-surface-guerre-mines-marine-nationale-cadre-du-programme-slam-f"),
    src("dga-slam-f-sous-marins", "Ministère des Armées — DGA", "Commande de huit drones sous-marins autonomes de nouvelle génération dans le cadre du programme SLAM-F auprès des sociétés Thales et Exail", "officiel", "A", "2024-11-12", "https://www.defense.gouv.fr/dga/actualites/commande-huit-drones-marins-autonomes-nouvelle-generation-cadre-du-programme-slam-f-aupres-societes"),
  ],
  updated: "2026-11-17",
};
