import type { DefenseSystem } from "../types";
import { ind, scoreSet, src } from "./registry-helpers";

// UCUV (Naval Group) — fiche issue du registre « Souveraineté industrielle »
// du 17/11/2026. Les montants de l'accord-cadre et du démonstrateur sont « n.c. ».

export const ucuv: DefenseSystem = {
  slug: "ucuv",
  name: "UCUV",
  designation: "Drone sous-marin de combat — démonstrateur de Naval Group (plateforme d'essais XL-UUV)",
  reference: "PNP-DR-025",
  category: "drone",
  droneClass: "UUV",
  classLabel: "Drone sous-marin de combat (démonstrateur)",
  country: "France",
  flag: "🇫🇷",
  manufacturer: "Naval Group",
  introduced: "Accord-cadre notifié le 28 décembre 2023 ; premiers essais en mer en 2028",
  status:
    "Démonstrateur opérationnel lancé en réalisation début novembre 2026 ; premiers essais en mer prévus en 2028 — montant du financement non communiqué",
  acquisitionModes: ["production-nationale"],
  tagline:
    "Un démonstrateur de drone sous-marin de combat de Naval Group : accord-cadre en 2023, réalisation lancée en novembre 2026, essais en mer en 2028, aucun montant publié.",
  summary:
    "L'UCUV est le démonstrateur français de drone sous-marin de combat, confié à Naval Group par un accord-cadre notifié le 28 décembre 2023, avec le XL-UUV de l'industriel comme plateforme d'essais. Un premier marché subséquent, pour le logiciel d'autonomie, a duré 24 mois. Le ministère des Armées a lancé en réalisation, début novembre 2026, un démonstrateur opérationnel dont les premiers essais en mer sont attendus en 2028.\n\nPour Panoplie, c'est une capacité naissante dont aucun montant n'est public : ni l'accord-cadre ni le financement du démonstrateur ne sont communiqués. La fiche lit le calendrier et la chaîne, pas le coût.",
  keySpecs: [
    ind("Accord-cadre", "Notifié à Naval Group le 28 décembre 2023", "haute", { ids: ["MET-0259"], fs: "officiel", src: ["naval-group-ucuv-2024"] }),
    ind("Premier marché subséquent (logiciel d'autonomie)", "24 mois", "haute", { ids: ["MET-0260"], fs: "officiel", src: ["naval-group-ucuv-2024"] }),
    ind("Plateforme d'essais", "XL-UUV de Naval Group", "moyenne", { src: ["naval-group-ucuv-2024"] }),
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Aucun montant n'est public : ni l'accord-cadre de décembre 2023 ni le financement du démonstrateur opérationnel lancé en réalisation en 2026. La fiche ne les estime pas.",
      indicators: [
        ind("Montant de l'accord-cadre", "n.c.", "haute", { ids: ["MET-0261"], fs: "non-communique", src: ["naval-group-ucuv-2024"] }),
        ind("Montant du financement du démonstrateur", "n.c.", "haute", { ids: ["MET-0264"], fs: "non-communique", src: ["opex360-ucuv"] }),
      ],
    },
    {
      key: "finance",
      narrative:
        "Le calendrier est simple : un accord-cadre en 2023, un premier marché pour le logiciel d'autonomie sur 24 mois, puis le lancement en réalisation d'un démonstrateur opérationnel début novembre 2026, avec des premiers essais en mer en 2028.",
      indicators: [
        ind("Lancement en réalisation du démonstrateur opérationnel", "Début novembre 2026", "moyenne", { ids: ["MET-0263"], fs: "presse", src: ["opex360-ucuv"] }),
        ind("Premiers essais en mer", "2028", "moyenne", { ids: ["MET-0262"], fs: "presse", src: ["opex360-ucuv"] }),
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "Naval Group est maître d'œuvre de l'accord-cadre, avec son XL-UUV comme plateforme d'essais. Le registre ne cite aucun autre acteur ni goulot d'étranglement.",
      indicators: [
        ind("Maître d'œuvre", "Naval Group — accord-cadre du 28/12/2023", "haute", { src: ["naval-group-ucuv-2024"] }),
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "L'UCUV prolonge le positionnement de la France sur les drones sous-marins de combat : un démonstrateur national, sans partenaire étranger cité par le registre.",
      indicators: [ind("Partenaires étrangers", "non documenté", "faible")],
    },
    {
      key: "export",
      narrative:
        "Rien n'est documenté sur l'export de l'UCUV, la règle de contenu local, un verrou d'un tiers ou l'accès au code source.",
      indicators: [ind("Régime export et accès au code source", "non documenté", "faible")],
    },
  ],
  scores: scoreSet({
    "efficacite-cout": ["D", "Aucun montant publié pour l'accord-cadre ni pour le démonstrateur."],
    survivabilite: ["D", "Aucune donnée publique de survivabilité ; démonstrateur."],
    exportabilite: ["D", "Aucun élément d'export documenté."],
    "risque-industriel": ["C", "Un seul maître d'œuvre ; calendrier à échéance 2028."],
    maturite: ["E", "Démonstrateur lancé en réalisation en novembre 2026 ; premiers essais en mer en 2028."],
    "confiance-donnees": ["C", "Calendrier de l'accord-cadre officiel ; lancement et essais rapportés par la presse ; montants non communiqués."],
  }),
  editorial: {
    mythVsReality:
      "Le mythe : un drone sous-marin de combat est une capacité acquise. La réalité : un démonstrateur dont les premiers essais en mer sont attendus en 2028.",
    bestUseCase:
      "Lire une capacité naissante dont le calendrier est public et le coût ne l'est pas.",
    weakPoint:
      "Aucun montant, aucune performance publique, aucun partenaire documenté.",
    analystNote:
      "À suivre en 2028 : montant du financement, nouveaux marchés et premiers essais en mer.",
  },
  operators: ["France — Marine nationale (prévu)"],
  theatres: ["Aucun — démonstrateur"],
  timeline: [
    { date: "2023-12", label: "Notification de l'accord-cadre UCUV à Naval Group le 28 décembre 2023.", kind: "jalon", metricIds: ["MET-0259"] },
    { date: "2026-11", label: "Lancement en réalisation du démonstrateur opérationnel UCUV début novembre 2026.", kind: "jalon", metricIds: ["MET-0263"] },
    { date: "2028", label: "Premiers essais en mer du démonstrateur UCUV en 2028.", kind: "jalon", metricIds: ["MET-0262"] },
  ],
  registryEntityIds: ["ENT-UCUV"],
  industrialChain: [
    { entityId: "ENT-UCUV", entityName: "UCUV (drone sous-marin de combat)", actor: "Naval Group", role: "Maitre_Oeuvre", country: "France", scope: "Accord-cadre du 28/12/2023 ; XL-UUV de Naval Group comme plateforme d'essais" },
  ],
  sovereignty: [
    { entityId: "ENT-UCUV", localContentRule: "Non_specifie", thirdPartyLock: "Non_specifie", sourceCodeAccess: "Non_specifie", chokepoints: [] },
  ],
  watchpoints: [
    { entityId: "ENT-UCUV", entityName: "UCUV (drone sous-marin de combat)", horizon: "2028", event: "UCUV : montant du financement, nouveaux marchés et premiers essais en mer." },
  ],
  sources: [
    src("naval-group-ucuv-2024", "Naval Group", "Naval Group va réaliser un démonstrateur de drone sous-marin autonome pour la Direction générale de l'armement", "constructeur", "B", "2024-01-30", "https://gican.asso.fr/wp-content/uploads/2024/01/CP_20240130_Naval-Group-va-realiser-un-demonstrateur-de-drone-sous-marin-autonome-pour-la-Direction-Generale-de-lArmement.pdf"),
    src("opex360-ucuv", "Opex360", "Le ministère des Armées lance la réalisation d'un démonstrateur du drone sous-marin de combat UCUV", "presse", "C", "2026-11-04", "https://www.opex360.com/2026/11/04/le-ministere-des-armees-lance-la-realisation-dun-demonstrateur-du-drone-sous-marin-de-combat-ucuv/"),
  ],
  updated: "2026-11-17",
};
