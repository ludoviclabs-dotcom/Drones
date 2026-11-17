import type { DefenseSystem } from "../types";
import { ind, scoreSet, src } from "./registry-helpers";

// FLP-T 150 (Thales / ArianeGroup) — offre non retenue face à Thundart.
// Fiche issue du registre « Souveraineté industrielle » du 17/11/2026.

export const flpT150: DefenseSystem = {
  slug: "flp-t-150",
  name: "FLP-T 150",
  designation: "Offre Thales / ArianeGroup de frappe longue portée terrestre — lanceur X-Fire",
  reference: "PNP-MSL-020",
  category: "missile",
  missileRole: "SSM",
  classLabel: "Offre de frappe longue portée terrestre (non retenue)",
  country: "France",
  flag: "🇫🇷",
  manufacturer: "Thales · ArianeGroup",
  introduced: "Premier tir le 5 mai 2026",
  status:
    "Offre non retenue : écartée au profit du Thundart de Safran et MBDA le 15 juin 2026 selon un blog spécialisé",
  acquisitionModes: ["production-nationale"],
  tagline:
    "L'offre concurrente du Thundart : un lanceur d'ArianeGroup et Thales testé le 5 mai 2026, avec une portée annoncée supérieure à 150 km, non retenue par la DGA.",
  summary:
    "La FLP-T 150 est l'offre de Thales et ArianeGroup à la consultation de frappe longue portée terrestre de la DGA. ArianeGroup et Thales ont annoncé un premier tir réussi le 5 mai 2026, avec une portée opérationnelle supérieure à 150 km. Quelques semaines plus tard, le 15 juin 2026, la DGA a retenu le Thundart de Safran et MBDA.\n\nPour Panoplie, la fiche conserve une offre perdante parce qu'elle éclaire la décision : même cadre national, deux co-traitants français, une portée annoncée du même ordre que celle de l'offre retenue. Le registre ne documente ni prix, ni quantités, ni devenir industriel de l'offre.",
  keySpecs: [
    ind("Portée opérationnelle annoncée", "Supérieure à 150 km", "moyenne", { ids: ["MET-0351"], fs: "officiel", src: ["arianegroup-thales-tir"], note: "Annonce des industriels, pas une performance démontrée en service." }),
    ind("Premier tir", "5 mai 2026 (Île du Levant)", "moyenne", { ids: ["MET-0353"], fs: "officiel", src: ["arianegroup-thales-tir"] }),
    ind("Industriels", "Thales · ArianeGroup", "haute", { src: ["arianegroup-thales-tir"] }),
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Aucun coût n'est publié pour la FLP-T 150 : ni prix de l'offre, ni coût de développement, ni quantités. Le registre n'en documente pas, et la fiche ne les déduit pas du Thundart.",
      indicators: [ind("Coût de l'offre", "non documenté", "faible")],
    },
    {
      key: "finance",
      narrative:
        "La consultation s'est jouée entre deux offres nationales ; la DGA a retenu celle de Safran et MBDA le 15 juin 2026. Le registre ne renseigne aucun financement propre de la FLP-T 150.",
      indicators: [
        ind("Issue de la consultation", "Offre FLP-T 150 écartée face au Thundart de Safran et MBDA le 15 juin 2026", "faible", { ids: ["MET-1480"], fs: "presse", src: ["lima-b-strike"], note: "Source du registre : un blog spécialisé ; la sélection du Thundart par la DGA est, elle, confirmée par MBDA." }),
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "Thales et ArianeGroup sont cités comme co-traitants de l'offre, « non retenue ». Le registre ne documente aucun autre fournisseur.",
      indicators: [ind("Co-traitants", "Thales · ArianeGroup — offre non retenue", "moyenne", { src: ["arianegroup-thales-tir"] })],
    },
    {
      key: "geopolitique",
      narrative:
        "La FLP-T 150 montre que la frappe longue portée terrestre est devenue un sujet de concurrence industrielle nationale : deux équipes françaises, une seule sélectionnée.",
      indicators: [ind("Concurrent retenu", "Thundart (Safran · MBDA)", "haute", { src: ["arianegroup-thales-tir"] })],
    },
    {
      key: "export",
      narrative:
        "Rien n'est documenté sur l'export, le contenu local, un veto d'un tiers ou l'accès au code source de la FLP-T 150.",
      indicators: [ind("Régime export et accès au code source", "non documenté", "faible")],
    },
  ],
  scores: scoreSet({
    "efficacite-cout": ["D", "Aucun coût publié pour l'offre."],
    survivabilite: ["D", "Aucune donnée publique de survivabilité ; portée annoncée par les industriels."],
    exportabilite: ["D", "Aucun élément d'export documenté ; offre non retenue."],
    "risque-industriel": ["C", "Deux co-traitants français, mais aucun débouché national connu après la sélection du Thundart."],
    maturite: ["C", "Premier tir réussi le 5 mai 2026 ; offre non retenue."],
    "confiance-donnees": ["C", "Annonces industrielles officielles pour le tir et la portée ; issue de la consultation rapportée par un blog."],
  }),
  editorial: {
    mythVsReality:
      "Le mythe : un tir réussi suffit à gagner un programme. La réalité : la FLP-T 150 a tiré le 5 mai 2026 et a pourtant été écartée le 15 juin au profit du Thundart.",
    bestUseCase:
      "Lire une consultation d'armement à deux offres nationales : mêmes portées annoncées, un seul retenu.",
    weakPoint:
      "L'issue de la consultation est rapportée par un blog spécialisé ; aucun coût n'est publié.",
    analystNote:
      "Pas de suite connue au registre pour l'offre non retenue.",
  },
  operators: ["Aucun — offre non retenue"],
  theatres: ["Aucun — offre non retenue"],
  timeline: [
    { date: "2026-05", label: "Premier tir de la FLP-T 150 le 5 mai 2026 (Île du Levant).", kind: "jalon", metricIds: ["MET-0353"] },
    { date: "2026-06", label: "Offre FLP-T 150 écartée face au Thundart le 15 juin 2026.", kind: "debat", metricIds: ["MET-1480"] },
  ],
  registryEntityIds: ["ENT-FLP-T150", "ENT-THUNDART"],
  industrialChain: [
    { entityId: "ENT-FLP-T150", entityName: "FLP-T 150", actor: "Thales", role: "Co-traitant", country: "France", scope: "Offre FLP-T 150 (non retenue)" },
    { entityId: "ENT-FLP-T150", entityName: "FLP-T 150", actor: "ArianeGroup", role: "Co-traitant", country: "France", scope: "Offre FLP-T 150 (non retenue)" },
  ],
  sovereignty: [
    { entityId: "ENT-FLP-T150", localContentRule: "Non_specifie", thirdPartyLock: "Non_specifie", sourceCodeAccess: "Non_specifie", chokepoints: [] },
  ],
  sources: [
    src("arianegroup-thales-tir", "ArianeGroup et Thales", "Long-range land strike: ArianeGroup and Thales conduct first successful firing in line with French forces' ambitions", "constructeur", "B", "2026-05-12", "https://ariane.group/en/news/long-range-land-strike-arianegroup-and-thales-conduct-first-successful-firing-in-line-with-french-forces-ambitions"),
    src("lima-b-strike", "Lima Groupe (blog)", "Billet de blog sur le B-Strike d'ArianeGroup (intitulé tiré de l'adresse ; titre non fourni au registre)", "presse", "D", undefined, "https://www.limagroupe.com/blog/b-strike-arianegroup-missile-2500-km/"),
  ],
  updated: "2026-11-17",
};
