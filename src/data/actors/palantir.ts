import { ind, src } from "../systems/registry-helpers";
import type { ActorDossier } from "./types";

// Palantir — dossier d'acteur issu du registre « Souveraineté industrielle » du
// 17/11/2026. Règle de lecture : le plafond de 10,0 Md$ n'est pas une commande.
// Sur TITAN, les 192 M$ de commandes fermes additionnent les deux commandes de
// série (127 M$ + 65 M$) ; la Phase 3 de 178 M$ est antérieure et n'y figure pas.

export const palantir: ActorDossier = {
  slug: "palantir",
  name: "Palantir",
  reference: "PNP-ACT-005",
  kind: "defense-tech",
  country: "États-Unis",
  flag: "🇺🇸",
  tagline:
    "Un plafond de 10,0 Md$ sur 10 ans avec l'Army, et TITAN : 127 M$ de commandes de série, 192 M$ avec Anduril.",
  summary:
    "Palantir Technologies, cotée au NYSE, est l'autre « neo-prime » de la défense tech américaine retenu par l'US Army. En juillet 2025, l'Army lui a attribué un accord d'entreprise dont le plafond atteint 10,0 Md$ sur 10 ans : une autorisation maximale, pas une commande.\n\nLes commandes fermes se lisent sur TITAN, la station de ciblage au sol dont Palantir est maître d'œuvre. Après une Phase 3 de prototypes à 178 M$ en 2024, l'Army a commandé en août-septembre 2026 huit stations de série pour 127 M$ ; avec les 65 M$ commandés à Anduril, co-traitant, le total des commandes de série atteint 192 M$.",
  keyFigures: [
    ind("Accord d'entreprise de l'Army (juillet 2025)", "Jusqu'à 10,0 Md$ sur 10 ans — plafond de l'accord, pas une commande", "haute", {
      ids: ["MET-2017"],
      fs: "plafond-cadre",
      src: ["army-enterprise-palantir-2025"],
    }),
    ind("TITAN série : commande ferme Palantir (8 stations)", "127 M$", "haute", {
      ids: ["MET-2022"],
      fs: "commande-ferme",
      src: ["cpeisw-titan-2026"],
    }),
    ind("TITAN : commandes de série des deux industriels", "192 M$ — 127 M$ Palantir et 65 M$ Anduril, hors Phase 3", "moyenne", {
      ids: ["MET-2026"],
      fs: "commande-ferme",
      src: ["cpeisw-titan-2026"],
      note: "Somme des deux commandes de série : ne pas l'additionner aux montants individuels. N'inclut pas les 178 M$ de la Phase 3.",
    }),
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "TITAN s'est payé en deux temps. La Phase 3, attribuée en mars 2024, portait sur des prototypes pour 178,4 M$ ; la commande de série d'août-septembre 2026 porte sur huit stations pour 127 M$. Les deux montants ne s'additionnent pas à ceux d'Anduril sans précaution : la somme de 192 M$ du registre ne couvre que les deux commandes de série.",
      indicators: [
        ind("TITAN Phase 3 : commande Palantir", "178 M$ en Phase 3 de l'OTA — 178,4 M$ selon l'Army, 10 prototypes (6 mars 2024)", "haute", {
          ids: ["MET-2024"],
          fs: "commande-ferme",
          src: ["army-titan-prototype-2024"],
          note: "Antérieur aux commandes de série ; non inclus dans les 192 M$.",
        }),
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "Palantir est maître d'œuvre de TITAN, avec Anduril en co-traitant. Le registre ne documente ni goulet d'étranglement ni dépendance à un fournisseur étranger.",
      indicators: [
        ind("Rôle sur TITAN", "Maître d'œuvre ; Anduril co-traitant", "moyenne", {
          src: ["cpeisw-titan-2026"],
        }),
      ],
    },
  ],
  registryEntityIds: ["ENT-PALANTIR", "ENT-TITAN"],
  industrialChain: [
    { entityId: "ENT-TITAN", entityName: "TITAN (combat collaboratif multi-milieux)", actor: "Palantir", role: "Maitre_Oeuvre", country: "États-Unis", scope: "8 TITAN de série (127 M$)" },
    { entityId: "ENT-TITAN", entityName: "TITAN (combat collaboratif multi-milieux)", actor: "Anduril", role: "Co-traitant", country: "États-Unis", scope: "TITAN série (65 M$)" },
  ],
  sovereignty: [
    { entityId: "ENT-PALANTIR", scope: "Palantir", localContentRule: "Non_specifie", thirdPartyLock: "Non_specifie", sourceCodeAccess: "Non_specifie", chokepoints: [] },
  ],
  watchpoints: [
    { entityId: "ENT-TITAN", entityName: "TITAN (combat collaboratif multi-milieux)", horizon: "2027 – Janv. 2028", event: "8 TITAN série (Figure 4)" },
  ],
  timeline: [
    { date: "2024-03", label: "Le 6 mars 2024, la Phase 3 de TITAN est attribuée à Palantir : 178 M$ pour 10 prototypes.", kind: "jalon", metricIds: ["MET-2024"] },
    { date: "2025-07", label: "En juillet 2025, l'Army attribue à Palantir un accord d'entreprise plafonné à 10,0 Md$ sur 10 ans.", kind: "jalon", metricIds: ["MET-2017"] },
    { date: "2026-09", label: "En août-septembre 2026, commande de série TITAN auprès de Palantir : 127 M$.", kind: "jalon", metricIds: ["MET-2022"] },
  ],
  analystNote:
    "Le plafond de 10,0 Md$ est une autorisation maximale sur dix ans. Sont écartés de ce dossier, faute de source ouverte : les accords Navy (environ 1,0 Md$) et Royaume-Uni (1,5 Md£), la guidance de chiffre d'affaires 2026 et les commandes fédérales de l'exercice 2025, dont la nature — commandes ou revenus — reste ambiguë dans le registre.",
  sources: [
    src("army-enterprise-palantir-2025", "U.S. Army", "U.S. Army Awards Enterprise Service Agreement to Enhance Military Readiness and Drive Operational Efficiency", "officiel", "A", "2025-07-31", "https://www.army.mil/article/287506/"),
    src("cpeisw-titan-2026", "CPE IEW&S (U.S. Army)", "Army Announces Move to Production for TITAN", "officiel", "A", "2026-09-01", "https://cpeisw.army.mil/2026/09/01/army-announces-move-to-production-for-titan/"),
    src("army-titan-prototype-2024", "U.S. Army", "Army Tactical Intelligence Targeting Access Node (TITAN) Ground Station Prototype - Award", "officiel", "A", "2024-03-06", "https://www.army.mil/article/274301/army_tactical_intelligence_targeting_access_node_titan_ground_station_prototype_award"),
  ],
  updated: "2026-11-17",
};
