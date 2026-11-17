import { ind, src } from "../systems/registry-helpers";
import type { ActorDossier } from "./types";

// Anduril — dossier d'acteur issu du registre « Souveraineté industrielle » du
// 17/11/2026. Règle de lecture : un plafond d'accord-cadre n'est jamais une
// commande ferme. Le plafond de 1,8 Md$ de NGC2 n'est pas appelé « sous-plafond »
// de l'accord de 20 Md$ : l'audit du registre (17/11/2026) note qu'aucune source
// ouverte n'établit ce rattachement.

export const anduril: ActorDossier = {
  slug: "anduril",
  name: "Anduril",
  reference: "PNP-ACT-004",
  kind: "defense-tech",
  country: "États-Unis",
  flag: "🇺🇸",
  tagline:
    "Un plafond de 20,0 Md$ à l'Army, mais des commandes fermes qui se comptent en centaines de millions : NGC2 à 162,8 M$, TITAN à 65 M$.",
  summary:
    "Anduril Industries, basée à Costa Mesa en Californie, est l'un des deux « neo-primes » de la défense tech américaine retenus par l'US Army avec Palantir. En mars 2026, l'Army lui a attribué un accord d'entreprise dont le plafond atteint 20,0 Md$ : c'est une autorisation maximale, pas un engagement de dépense.\n\nCe que l'Army a commandé ferme est d'un autre ordre. Sur NGC2, le réseau de commandement de nouvelle génération, Anduril détient un contrat dont la période de base atteint 162,8 M$, après 100 M$ de prototype en juillet 2025 ; sur TITAN, la station de ciblage au sol, une commande de série de 65 M$ en août 2026, en co-traitance de Palantir. Le dossier sépare ces trois niveaux — plafond, plafond de contrat, commande ferme — parce que les additionner donnerait un chiffre qu'aucune source n'écrit.",
  keyFigures: [
    ind("Accord d'entreprise de l'Army (mars 2026)", "Jusqu'à 20,0 Md$ — plafond de l'accord, pas une commande", "haute", {
      ids: ["MET-2009"],
      fs: "plafond-cadre",
      src: ["army-enterprise-anduril-2026"],
    }),
    ind("NGC2 : montant engagé ferme (Anduril)", "162,8 M$ — période de base du contrat attribué le 30 septembre 2026, le reste en options", "haute", {
      ids: ["MET-2012"],
      fs: "commande-ferme",
      src: ["militarytimes-ngc2-2026"],
      note: "Le registre ne tranche pas si ce montant inclut les 100 M$ de juillet 2025.",
    }),
    ind("TITAN série : commande ferme Anduril (août 2026)", "65 M$", "haute", {
      ids: ["MET-2014"],
      fs: "commande-ferme",
      src: ["cpeisw-titan-2026"],
    }),
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Trois montants se superposent sans s'additionner. Le plafond de 20,0 Md$ borne l'accord d'entreprise de l'Army. Le contrat NGC2 est plafonné à 1,8 Md$ sur 5 ans, dont 162,8 M$ sont fermes sur la période de base. Aucune source ouverte ne rattache le plafond NGC2 à l'accord de 20 Md$ : l'additionner à l'accord, ou le déduire, serait une hypothèse.",
      indicators: [
        ind("NGC2 : plafond du contrat Anduril", "Jusqu'à 1,8 Md$ sur 5 ans — plafond du contrat, pas une commande", "haute", {
          ids: ["MET-2010"],
          fs: "plafond-cadre",
          src: ["militarytimes-ngc2-2026"],
          note: "Aucune source ouverte ne rattache ce plafond à l'accord d'entreprise de 20 Md$ ; « sous-plafond » est le terme du seul rapport d'origine.",
        }),
        ind("NGC2 : commande du prototype (juillet 2025)", "100 M$", "haute", {
          ids: ["MET-2013"],
          fs: "commande-ferme",
          src: ["army-ngc2-prototype-2025"],
        }),
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "Anduril produit avec des sous-traitants américains : Hadrian assure l'usinage de précision. Sur TITAN, elle est co-traitante de Palantir, maître d'œuvre de la commande de série. Le registre ne documente ni goulet d'étranglement ni dépendance à un fournisseur étranger.",
      indicators: [
        ind("Usinage de précision", "Hadrian (États-Unis)", "moyenne"),
        ind("Rôle sur TITAN", "Co-traitant de Palantir, maître d'œuvre", "moyenne", {
          src: ["cpeisw-titan-2026"],
        }),
      ],
    },
  ],
  registryEntityIds: ["ENT-ANDURIL", "ENT-NGC2", "ENT-TITAN"],
  industrialChain: [
    { entityId: "ENT-ANDURIL", entityName: "Anduril Industries (Costa Mesa, CA)", actor: "Hadrian", role: "Usinage_Forge_Matiere", country: "États-Unis", scope: "Usinage de précision" },
    { entityId: "ENT-TITAN", entityName: "TITAN (combat collaboratif multi-milieux)", actor: "Palantir", role: "Maitre_Oeuvre", country: "États-Unis", scope: "8 TITAN de série (127 M$)" },
    { entityId: "ENT-TITAN", entityName: "TITAN (combat collaboratif multi-milieux)", actor: "Anduril", role: "Co-traitant", country: "États-Unis", scope: "TITAN série (65 M$)" },
  ],
  sovereignty: [
    { entityId: "ENT-ANDURIL", scope: "Anduril", localContentRule: "Non_specifie", thirdPartyLock: "Non_specifie", sourceCodeAccess: "Non_specifie", chokepoints: [] },
  ],
  watchpoints: [
    { entityId: "ENT-TITAN", entityName: "TITAN (combat collaboratif multi-milieux)", horizon: "2027 – Janv. 2028", event: "8 TITAN série (Figure 4)" },
  ],
  timeline: [
    { date: "2025-07", label: "En juillet 2025, l'Army commande à Anduril le prototype NGC2 pour 100 M$.", kind: "jalon", metricIds: ["MET-2013"] },
    { date: "2026-03", label: "En mars 2026, accord d'entreprise de l'Army avec Anduril, plafonné à 20,0 Md$.", kind: "jalon", metricIds: ["MET-2009"] },
    { date: "2026-08", label: "En août 2026, commande ferme de série TITAN auprès d'Anduril : 65 M$.", kind: "jalon", metricIds: ["MET-2014"] },
    { date: "2026-09", label: "Le 30 septembre 2026, attribution du contrat NGC2 : 162,8 M$ ferme sur la période de base.", kind: "jalon", metricIds: ["MET-2012"] },
  ],
  analystNote:
    "Le plafond de 20,0 Md$ se lit comme une autorisation maximale : ce que l'Army a engagé ferme sur NGC2 et TITAN se compte en centaines de millions de dollars. Sont écartés de ce dossier, faute de source ouverte : l'indice de valeur de marché cité par le registre et le statut de l'usine Arsenal-1.",
  sources: [
    src("army-enterprise-anduril-2026", "U.S. Army", "U.S. Army awards enterprise contract for IT commercial solutions", "officiel", "A", "2026-03-13", "https://www.army.mil/article/291074/u_s_army_awards_enterprise_contract_for_it_commercial_solutions"),
    src("militarytimes-ngc2-2026", "Military Times (Army Times)", "Anduril awarded contract to expand US Army's next-gen battlefield command system", "presse", "B", "2026-10-13", "https://www.militarytimes.com/industry/techwatch/2026/10/13/anduril-awarded-contract-to-expand-us-armys-next-gen-battlefield-command-system/"),
    src("army-ngc2-prototype-2025", "U.S. Army", "Army announces Next Generation Command and Control (NGC2) prototype award", "officiel", "A", "2025-07-18", "https://www.army.mil/article/287180/army_announces_next_generation_command_and_control_ngc2_prototype_award"),
    src("cpeisw-titan-2026", "CPE IEW&S (U.S. Army)", "Army Announces Move to Production for TITAN", "officiel", "A", "2026-09-01", "https://cpeisw.army.mil/2026/09/01/army-announces-move-to-production-for-titan/"),
  ],
  updated: "2026-11-17",
};
