import type { DefenseSystem } from "../types";
import { ind, scoreSet, src } from "./registry-helpers";

// Typhon (lanceur) — fiche issue du registre « Souveraineté industrielle » du
// 17/11/2026. Le registre ne documente aucune caractéristique technique du
// lanceur : la fiche ne porte que l'achat allemand et le contrôle américain.

export const typhon: DefenseSystem = {
  slug: "typhon",
  name: "Typhon (lanceur)",
  designation: "Lanceur américain — achat allemand avec les Tomahawk",
  reference: "PNP-MSL-024",
  category: "missile",
  missileRole: "SSM",
  classLabel: "Lanceur de missiles de frappe",
  country: "États-Unis",
  flag: "🇺🇸",
  manufacturer: "Non précisé au registre",
  introduced: "Non documenté",
  status:
    "Achat allemand envisagé avec des Tomahawk : environ 3,4 Md€ en planification (source unique), accord de Washington requis, quantités non publiées",
  acquisitionModes: ["FMS"],
  tagline:
    "Un lanceur américain dont le registre ne dit presque rien — sinon que l'Allemagne veut l'acheter avec des Tomahawk, et que Washington doit y consentir.",
  summary:
    "Le Typhon est un lanceur de frappe américain. Le registre « Souveraineté industrielle » ne lui attribue aucune caractéristique technique, aucun industriel et aucun chiffre propre : il n'apparaît qu'à travers l'achat allemand de Tomahawk et de lanceurs Typhon, estimé à environ 3,4 Md€ en planification selon une source unique, et soumis à un accord de Washington.\n\nPour Panoplie, la fiche est volontairement mince. Elle fixe ce qui est dit — un achat envisagé, un verrou américain, un vote du Bundestag à venir — et marque comme « non documenté » tout le reste, plutôt que de le compléter de mémoire.",
  keySpecs: [
    ind("Nature", "Lanceur (Typhon)", "moyenne", { src: ["army-recognition-de-typhon"] }),
    ind("Caractéristiques techniques", "non documenté", "faible"),
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Aucun prix de lanceur n'est documenté. Le seul montant du registre concerne l'achat allemand dans son ensemble — Tomahawk et Typhon réunis — et il s'agit d'une estimation de planification à source unique.",
      indicators: [
        ind("Achat allemand — Tomahawk et Typhon", "Environ 3,4 Md€ (estimation de planification)", "faible", { ids: ["MET-0320"], fs: "source-unique", src: ["army-recognition-de-typhon", "defence-industry-de-typhon"], note: "Montant global, non ventilé entre missiles et lanceurs ; rapporté d'après Politico." }),
        ind("Prix du lanceur", "non documenté", "faible"),
      ],
    },
    {
      key: "finance",
      narrative:
        "Le financement allemand reste à voter : le registre signale à suivre le vote du Bundestag sur des montants de 12 Md€ et de 3,4 Md€ pour les Tomahawk et les Typhon. Les quantités ne sont pas publiées.",
      indicators: [
        ind("Quantités de Typhon achetées par l'Allemagne", "n.c.", "haute", { ids: ["MET-0322"], fs: "non-communique", src: ["army-recognition-de-typhon"], note: "Les quantités de Tomahawk et de Typhon ne sont pas publiées." }),
        ind("Vote du Bundestag", "À suivre : les 12 Md€ et les 3,4 Md€ de Tomahawk et de Typhon", "faible", { src: ["army-recognition-de-typhon"] }),
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "Aucun industriel, aucun sous-traitant ni goulot d'étranglement n'est documenté pour le Typhon.",
      indicators: [ind("Chaîne d'approvisionnement", "non documenté", "faible")],
    },
    {
      key: "geopolitique",
      narrative:
        "L'achat allemand est subordonné à un accord de Washington, que Berlin a confirmé le 10 juillet 2026 selon une source unique. L'Allemagne cherche ainsi une capacité de frappe à longue portée, rapportée à 2 500 km par une des sources, après l'annulation d'un déploiement américain.",
      indicators: [
        ind("Accord de Washington", "Confirmation par Berlin de l'accord avec Washington le 10 juillet 2026", "faible", { ids: ["MET-0321"], fs: "source-unique", src: ["army-recognition-de-typhon"] }),
      ],
    },
    {
      key: "export",
      narrative:
        "Le registre note un verrou d'un tiers : l'accord de Washington est requis pour l'achat allemand de Typhon. Règle de contenu local et accès au code source ne sont pas documentés.",
      indicators: [ind("Verrou d'un tiers", "Accord de Washington requis", "moyenne", { note: "Valeur du registre (bloc souveraineté ci-dessous)." })],
    },
  ],
  scores: scoreSet({
    "efficacite-cout": ["D", "Aucun prix de lanceur ; montant allemand global à source unique."],
    survivabilite: ["D", "Aucune donnée de survivabilité au registre."],
    exportabilite: ["C", "Export soumis à l'accord de Washington, confirmé par Berlin le 10 juillet 2026 selon une source unique."],
    "risque-industriel": ["D", "Aucune chaîne documentée ; dépendance explicite à un accord américain."],
    maturite: ["D", "Aucune donnée de maturité au registre ; achat allemand en planification."],
    "confiance-donnees": ["E", "Presque rien de documenté ; l'unique montant repose sur une source unique."],
  }),
  editorial: {
    mythVsReality:
      "Le mythe : un équipement évoqué dans la presse est un équipement documenté. La réalité : pour le Typhon, le registre ne contient ni caractéristique, ni industriel, ni prix — seulement un achat envisagé et un verrou américain.",
    bestUseCase:
      "Montrer, dans le catalogue, un équipement dont le contrôle américain est plus documenté que la technique.",
    weakPoint:
      "Presque tout est « non documenté » ; l'unique montant est une estimation à source unique.",
    analystNote:
      "À compléter par une source officielle américaine ou allemande avant toute comparaison.",
  },
  operators: ["Allemagne (achat envisagé)"],
  theatres: ["Aucun — achat en planification"],
  timeline: [
    { date: "2026-07", label: "Berlin confirme l'accord avec Washington le 10 juillet 2026 pour l'achat de Tomahawk et de Typhon (source unique).", kind: "export", metricIds: ["MET-0321"] },
    { date: "2026-09", label: "Achat allemand de Tomahawk et de lanceurs Typhon chiffré à environ 3,4 Md€ en planification (source unique).", kind: "export", metricIds: ["MET-0320"] },
  ],
  registryEntityIds: ["ENT-TYPHON", "ENT-DE-TOMAHAWK-TYPHON"],
  sovereignty: [
    { entityId: "ENT-TYPHON", scope: "Typhon (lanceur)", localContentRule: "Non_specifie", thirdPartyLock: "Accord_Washington_Requis", sourceCodeAccess: "Non_specifie", chokepoints: [] },
  ],
  watchpoints: [
    { entityId: "ENT-DE-TOMAHAWK-TYPHON", entityName: "Achat allemand de Tomahawk et de lanceurs Typhon", horizon: "À suivre", event: "Vote du Bundestag : les 12 Md€ et les 3,4 Md€ de Tomahawk et de Typhon." },
  ],
  sources: [
    src("army-recognition-de-typhon", "Army Recognition (d'après Politico)", "Germany plans €3.4B U.S. Tomahawk and Typhon missiles acquisition for deep strikes", "presse", "D", "2026-09-15", "https://www.armyrecognition.com/news/army-news/2026/germany-plans-eur3-4b-u-s-tomahawk-and-typhon-missiles-acquisition-for-deep-strikes"),
    src("defence-industry-de-typhon", "defence-industry.eu (d'après Politico)", "Germany turns to €3.4 billion Typhon and Tomahawk purchase to field 2,500-kilometer strike capability after U.S. cancels deployment", "presse", "D", "2026-09-14", "https://defence-industry.eu/germany-turns-to-e3-4-billion-typhon-and-tomahawk-purchase-to-field-2500-kilometer-strike-capability-after-u-s-cancels-deployment/"),
  ],
  updated: "2026-11-17",
};
