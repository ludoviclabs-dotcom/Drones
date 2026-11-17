import type { DefenseSystem } from "../types";
import { ind, scoreSet, src } from "./registry-helpers";

// Tomahawk — fiche issue du registre « Souveraineté industrielle » du
// 17/11/2026. La requête FY2027 reprend les totaux vérifiés du CRS, pas ceux du
// PDF d'origine, et indique le périmètre.

export const tomahawk: DefenseSystem = {
  slug: "tomahawk",
  name: "Tomahawk (TLAM / MST)",
  designation: "Missile de croisière de frappe à longue portée — RTX",
  reference: "PNP-MSL-023",
  category: "missile",
  missileRole: "SSM",
  classLabel: "Missile de croisière de frappe (munition de la marine américaine)",
  country: "États-Unis",
  flag: "🇺🇸",
  manufacturer: "RTX",
  introduced: "En service",
  status:
    "En service ; requête FY2027 de 785 missiles ; achat allemand envisagé avec les lanceurs Typhon — vote du Bundestag à suivre",
  acquisitionModes: ["FMS"],
  tagline:
    "Le missile de croisière américain dont la consommation de la guerre contre l'Iran a fait un enjeu de stocks, et que l'Allemagne veut acquérir avec des lanceurs Typhon.",
  summary:
    "Le Tomahawk (TLAM / MST) est le missile de croisière de frappe de RTX utilisé par la marine américaine. Selon le CSIS, les forces navales américaines en ont tiré plus de 1 000 en 39 jours pendant la guerre contre l'Iran ; la requête budgétaire FY2027 en demande 785 pour un total de 5 880,3 M$. L'Allemagne prévoit, d'après une source unique, d'en acheter avec des lanceurs Typhon pour environ 3,4 Md€ de planification, sous réserve d'un accord de Washington.\n\nPour Panoplie, le Tomahawk est la référence des volumes : il fixe l'ordre de grandeur auquel le registre compare d'autres programmes (MdCN, frappe terrestre). La fiche distingue les consommations constatées, la requête budgétaire non votée et l'achat allemand en planification.",
  keySpecs: [
    ind("Maître d'œuvre", "RTX", "haute", { src: ["csis-last-rounds"] }),
    ind("Tomahawk tirés — guerre contre l'Iran", "Plus de 1 000 en 39 jours par les forces navales américaines", "moyenne", { ids: ["MET-0333", "MET-0334"], fs: "presse", src: ["csis-last-rounds"], note: "Le Washington Post compte plus de 850 tirs sur le premier mois." }),
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le coût du Tomahawk se lit dans les lignes budgétaires américaines : quantités et crédits par exercice. Les totaux FY2027 sont ceux du CRS pour la demande complète (mandatory + discretionary), pas ceux du PDF d'origine, qui divergeaient.",
      indicators: [
        ind("Requête FY2027 — volume", "785 missiles (727 mandatory + 58 discretionary)", "haute", { ids: ["MET-1906"], fs: "requete-budgetaire", src: ["crs-r49023-tlam"], note: "La requête n'est pas votée ; le CNAS cite 815 en FY27, sans préciser le périmètre." }),
        ind("Requête FY2027 — crédits", "5 880,3 M$ — total de la demande (3,87 + 2,01 Md$)", "haute", { ids: ["MET-1907"], fs: "requete-budgetaire", src: ["crs-r49023-tlam"], note: "Le PDF d'origine donnait 5 804 M$ ; la ligne WPN Tomahawk seule est d'environ 3,0 Md$ selon Naval News. On retient le total vérifié du CRS." }),
        ind("FY2025 — achats", "38 missiles pour 593 M$", "moyenne", { ids: ["MET-1902", "MET-1903"], fs: "officiel", src: ["overview-book-fy27"] }),
        ind("FY2026 — achats", "55 missiles pour 1 036 M$", "moyenne", { ids: ["MET-1904", "MET-1905"], fs: "officiel", src: ["overview-book-fy27"] }),
      ],
    },
    {
      key: "finance",
      narrative:
        "Le passage de 55 missiles en FY2026 à 785 demandés en FY2027 change l'échelle du programme. Côté allemand, l'achat de Tomahawk et de lanceurs Typhon est chiffré à environ 3,4 Md€ en planification — une estimation à source unique, dont les quantités ne sont pas publiées.",
      indicators: [
        ind("Achat allemand — planification", "Environ 3,4 Md€ pour des Tomahawk et des lanceurs Typhon", "faible", { ids: ["MET-0320"], fs: "source-unique", src: ["army-recognition-de-tlam", "defence-industry-de-tlam"], note: "Estimation de planification rapportée d'après Politico ; quantités non publiées." }),
        ind("Achat allemand — quantités", "n.c.", "haute", { ids: ["MET-0322"], fs: "non-communique", src: ["army-recognition-de-tlam"] }),
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "RTX est maître d'œuvre. Le registre ne détaille ni sous-traitants ni goulots d'étranglement : la tension sur les stocks est lue dans les tirs, pas dans la chaîne industrielle.",
      indicators: [ind("Maître d'œuvre", "RTX", "haute", { src: ["csis-last-rounds"] })],
    },
    {
      key: "geopolitique",
      narrative:
        "La guerre contre l'Iran a rendu le Tomahawk visible comme munition rare. Pour l'Allemagne, l'acquisition suppose l'accord de Washington : Berlin a confirmé l'accord avec Washington le 10 juillet 2026, selon une source unique.",
      indicators: [
        ind("Accord de Washington", "Confirmation par Berlin de l'accord avec Washington le 10 juillet 2026", "faible", { ids: ["MET-0321"], fs: "source-unique", src: ["army-recognition-de-tlam"] }),
      ],
    },
    {
      key: "export",
      narrative:
        "Le registre note un verrou d'un tiers pour le Tomahawk et l'achat allemand : l'accord de Washington est requis. Règle de contenu local et accès au code source ne sont pas documentés.",
      indicators: [ind("Verrou d'un tiers", "Accord de Washington requis", "moyenne", { note: "Valeur du registre (bloc souveraineté ci-dessous)." })],
    },
  ],
  scores: scoreSet({
    "efficacite-cout": ["C", "Coût suivi par exercice budgétaire américain, mais le périmètre diffère selon les sources (785 ou 815 missiles en FY27)."],
    survivabilite: ["D", "Aucune donnée de survivabilité au registre."],
    exportabilite: ["C", "Accord de Washington requis pour l'achat allemand ; quantités non publiées."],
    "risque-industriel": ["C", "Consommation de plus de 1 000 missiles en 39 jours : tension sur les stocks, chaîne non détaillée."],
    maturite: ["A", "Missile en service, tiré en volume pendant la guerre contre l'Iran."],
    "confiance-donnees": ["B", "Requête FY2027 vérifiée sur le CRS ; achat allemand à source unique."],
  }),
  editorial: {
    mythVsReality:
      "Le mythe : un missile en service est un missile disponible. La réalité : plus de 1 000 tirés en 39 jours, 55 achetés en FY2026, 785 demandés en FY2027 — l'écart des stocks est le sujet.",
    bestUseCase:
      "Servir de référence de volume pour lire des programmes de frappe européens.",
    weakPoint:
      "Le périmètre de la requête FY2027 varie selon les sources, et l'achat allemand repose sur une source unique.",
    analystNote:
      "À suivre : le vote du Bundestag sur les montants Tomahawk et Typhon, et le sort de la requête FY2027 au Congrès.",
  },
  operators: ["États-Unis — US Navy", "Allemagne (achat envisagé)"],
  theatres: ["Guerre contre l'Iran — plus de 1 000 Tomahawk tirés en 39 jours"],
  timeline: [
    { date: "2026-04", label: "Le CSIS publie son bilan des munitions : plus de 1 000 Tomahawk tirés en 39 jours contre l'Iran.", kind: "emploi", metricIds: ["MET-0333", "MET-0334"] },
    { date: "2026-07", label: "Berlin confirme l'accord avec Washington le 10 juillet 2026 pour l'achat de Tomahawk et de Typhon (source unique).", kind: "export", metricIds: ["MET-0321"] },
    { date: "2026-09", label: "Achat allemand de Tomahawk et de lanceurs Typhon chiffré à environ 3,4 Md€ en planification (source unique).", kind: "export", metricIds: ["MET-0320"] },
  ],
  registryEntityIds: ["ENT-TOMAHAWK", "ENT-DE-TOMAHAWK-TYPHON"],
  sovereignty: [
    { entityId: "ENT-TOMAHAWK", scope: "Tomahawk", localContentRule: "Non_specifie", thirdPartyLock: "Accord_Washington_Requis", sourceCodeAccess: "Non_specifie", chokepoints: [] },
    { entityId: "ENT-DE-TOMAHAWK-TYPHON", scope: "Achat allemand de Tomahawk et de lanceurs Typhon", localContentRule: "Non_specifie", thirdPartyLock: "Accord_Washington_Requis", sourceCodeAccess: "Non_specifie", chokepoints: [] },
  ],
  watchpoints: [
    { entityId: "ENT-DE-TOMAHAWK-TYPHON", entityName: "Achat allemand de Tomahawk et de lanceurs Typhon", horizon: "À suivre", event: "Vote du Bundestag : les 12 Md€ et les 3,4 Md€ de Tomahawk et de Typhon." },
  ],
  sources: [
    src("csis-last-rounds", "CSIS (Mark F. Cancian, Chris H. Park)", "Last Rounds? Status of Key Munitions at the Iran War Ceasefire", "think-tank", "B", "2026-04-21", "https://www.csis.org/analysis/last-rounds-status-key-munitions-iran-war-ceasefire"),
    src("crs-r49023-tlam", "Congressional Research Service", "FY2027 Defense Budget: Funding for Selected Weapon Systems (CRS R49023)", "institution", "A", "2026-09-03", "https://www.everycrsreport.com/reports/R49023.html"),
    src("overview-book-fy27", "DoW (Department of War)", "FY 2027 Budget Request Overview Book, Figure 3.4", "officiel", "A", undefined),
    src("army-recognition-de-tlam", "Army Recognition (d'après Politico)", "Germany plans €3.4B U.S. Tomahawk and Typhon missiles acquisition for deep strikes", "presse", "D", "2026-09-15", "https://www.armyrecognition.com/news/army-news/2026/germany-plans-eur3-4b-u-s-tomahawk-and-typhon-missiles-acquisition-for-deep-strikes"),
    src("defence-industry-de-tlam", "defence-industry.eu (d'après Politico)", "Germany turns to €3.4 billion Typhon and Tomahawk purchase to field 2,500-kilometer strike capability after U.S. cancels deployment", "presse", "D", "2026-09-14", "https://defence-industry.eu/germany-turns-to-e3-4-billion-typhon-and-tomahawk-purchase-to-field-2500-kilometer-strike-capability-after-u-s-cancels-deployment/"),
  ],
  updated: "2026-11-17",
};
