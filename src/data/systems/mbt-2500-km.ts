import type { DefenseSystem } from "../types";
import { ind, scoreSet, src } from "./registry-helpers";

// Missile balistique terrestre (MBT) de classe 2 500 km — fiche issue du
// registre « Souveraineté industrielle » du 17/11/2026. Les montants viennent de
// la loi de programmation actualisée et du PLF 2027 ; les chiffres qui ne
// reposent que sur un blog (mêmes montants repris sans source officielle) ne sont
// pas cités.

export const mbt2500: DefenseSystem = {
  slug: "mbt-2500-km",
  name: "Missile balistique terrestre (MBT) — classe 2 500 km",
  designation: "Missile balistique conventionnel sol-sol — programme 146",
  reference: "PNP-MSL-021",
  category: "missile",
  missileRole: "SSM",
  classLabel: "Missile balistique conventionnel sol-sol (programme)",
  country: "France",
  flag: "🇫🇷",
  manufacturer: "Non attribué — organisation industrielle arrêtée en 2028",
  introduced: "Capacité opérationnelle initiale 2030–2031",
  status:
    "Étude de levée de risques à l'automne 2026 ; lancement en réalisation en 2028 ; attribution à l'armée de Terre rapportée le 24 octobre 2026",
  acquisitionModes: ["production-nationale"],
  tagline:
    "Le futur missile balistique conventionnel français de classe 2 500 km : une étude de levée de risques en 2026, la réalisation en 2028, aucune quantité divulguée.",
  summary:
    "Le missile balistique terrestre (MBT) est un programme français de missile balistique conventionnel sol-sol, étudié jusqu'à la classe 2 500 km. La loi de programmation actualisée de 2026 en fixe le calendrier : une étude de levée de risques notifiée à l'automne 2026, le lancement en réalisation en 2028, une capacité opérationnelle initiale en 2030–2031 et la production en série en 2035–2036. L'armée de Terre en aurait la mise en œuvre, selon Opex360 le 24 octobre 2026.\n\nPour Panoplie, c'est le cas où le budget parle et pas l'industrie : l'enveloppe, le rythme de crédits et les jalons sont publics, mais ni la quantité cible ni le montant final ni le maître d'œuvre ne le sont. Deux équipes industrielles — ArianeGroup avec Thales — figurent dans le registre comme offre « B-Strike ».",
  keySpecs: [
    ind("Classe de portée", "Missile balistique terrestre (MBT) de classe 2 500 km", "haute", { ids: ["MET-1311"], fs: "officiel", src: ["loi-2026-791-loda"] }),
    ind("Trame opérative étudiée à la demande du Sénat", "500 à 1 500 km", "moyenne", { ids: ["MET-1000"], fs: "officiel", src: ["senat-dissuasion-avancee"] }),
    ind("Quantité cible", "n.c.", "haute", { ids: ["MET-1312"], fs: "non-communique", src: ["loi-2026-791-loda"], note: "La cible de quantité n'est pas divulguée." }),
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le coût du MBT se lit en autorisations d'engagement, jamais en prix unitaire. L'enveloppe globale inscrite au programme 146 est de 1,5 Md€ d'autorisations d'engagement ; pour 2027, 79,3 M€ d'AE et 65,2 M€ de crédits de paiement sont demandés. Le montant final du programme n'est pas arrêté.",
      indicators: [
        ind("Enveloppe globale (programme 146)", "1,5 Md€ d'autorisations d'engagement au P146", "moyenne", { ids: ["MET-1313"], fs: "requete-budgetaire", src: ["loi-2026-791-loda"], note: "Requête budgétaire (PLF 2027), non votée." }),
        ind("Crédits demandés pour 2027", "79,3 M€ d'AE et 65,2 M€ de CP", "moyenne", { ids: ["MET-1314", "MET-1315"], fs: "requete-budgetaire", src: ["loi-2026-791-loda"] }),
        ind("Étude de levée de risques — crédits 2026", "15,6 M€ ouverts en 2026", "haute", { ids: ["MET-1002"], fs: "officiel", src: ["loi-2026-791-loda"] }),
        ind("Engagement initial prévu (budget 2026)", "≈ 1,0 Md€ — « le milliard français du balistique »", "faible", { ids: ["MET-0360"], fs: "requete-budgetaire", src: ["arms-control-today-medium-range"], note: "Chiffre d'une revue spécialisée, antérieur à l'enveloppe de 1,5 Md€ d'AE du PLF 2027 : deux périmètres distincts." }),
        ind("Montant final du programme", "n.c.", "haute", { ids: ["MET-0359"], fs: "non-communique", src: ["an-avis-3394-mbt"], note: "Le montant final n'est pas arrêté dans les sources citées." }),
      ],
    },
    {
      key: "finance",
      narrative:
        "Le calendrier est fixé par la loi de programmation actualisée : étude de levée de risques à l'automne 2026, réalisation en 2028, capacité initiale en 2030–2031, série en 2035–2036. L'organisation industrielle ne sera formellement arrêtée qu'en 2028.",
      indicators: [
        ind("Étude de levée de risques", "Notifiée à l'automne 2026", "haute", { ids: ["MET-1001"], fs: "officiel", src: ["loi-2026-791-loda"] }),
        ind("Lancement en réalisation", "2028", "haute", { ids: ["MET-1003"], fs: "officiel", src: ["loi-2026-791-loda"] }),
        ind("Capacité opérationnelle initiale", "2030–2031", "haute", { ids: ["MET-0354"], fs: "officiel", src: ["loi-2026-791-jorf", "loi-2026-791-loda"] }),
        ind("Production en série", "2035–2036", "haute", { ids: ["MET-0355"], fs: "officiel", src: ["loi-2026-791-jorf", "loi-2026-791-loda"] }),
        ind("Attribution à l'armée de Terre", "Confirmée le 24 octobre 2026", "moyenne", { ids: ["MET-1014"], fs: "presse", src: ["opex360-mbt"] }),
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "Aucun maître d'œuvre n'est attribué : l'organisation industrielle sera arrêtée en 2028. Le registre cite l'offre « B-Strike » d'ArianeGroup et de Thales comme candidate, sans en faire un contrat.",
      indicators: [
        ind("Organisation industrielle", "Arrêtée en 2028 — maître d'œuvre non attribué", "moyenne", { ids: ["MET-1013"], fs: "presse", src: ["opex360-mbt"] }),
        ind("Offre citée", "ArianeGroup (offre B-Strike) avec Thales", "faible", { src: ["opex360-mbt"], note: "Offre industrielle, pas un marché." }),
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Le MBT s'inscrit dans le débat sur la dissuasion avancée et la défense de l'Europe : le Sénat a demandé l'étude d'une trame opérative de 500 à 1 500 km. Le registre ne documente ni verrou d'un tiers ni règle de contenu local.",
      indicators: [
        ind("Portée prioritaire", "Jusqu'à la classe 2 500 km", "moyenne", { ids: ["MET-0999"], fs: "officiel", src: ["senat-dissuasion-avancee"] }),
      ],
    },
    {
      key: "export",
      narrative:
        "Rien n'est documenté sur l'export du MBT, le contenu local ou l'accès au code source : le programme est national et n'a pas de maître d'œuvre.",
      indicators: [ind("Régime export et accès au code source", "non documenté", "faible")],
    },
  ],
  scores: scoreSet({
    "efficacite-cout": ["D", "Enveloppe en autorisations d'engagement, mais ni quantité cible ni montant final : aucun coût unitaire ne peut être lu."],
    survivabilite: ["D", "Aucune donnée publique de survivabilité ; programme au stade de l'étude de levée de risques."],
    exportabilite: ["D", "Aucun élément d'export documenté ; programme national sans maître d'œuvre."],
    "risque-industriel": ["C", "Maître d'œuvre non attribué avant 2028 ; offre candidate ArianeGroup / Thales seulement."],
    maturite: ["E", "Étude de levée de risques en 2026 ; capacité initiale visée en 2030–2031, série en 2035–2036."],
    "confiance-donnees": ["B", "Calendrier et crédits inscrits dans la loi et le PLF ; quantité et montant final non communiqués."],
  }),
  editorial: {
    mythVsReality:
      "Le mythe : un budget annoncé vaut une capacité. La réalité : une enveloppe d'autorisations d'engagement, une étude de levée de risques et un maître d'œuvre qui ne sera choisi qu'en 2028.",
    bestUseCase:
      "Lire un programme où le calendrier légal et les crédits sont publics, et où l'industriel, la quantité et le coût final ne le sont pas.",
    weakPoint:
      "Aucune quantité cible, aucun maître d'œuvre, aucun montant final : la fiche ne peut rien dire du coût d'un missile.",
    analystNote:
      "À suivre : la notification de l'étude de levée de risques à l'automne 2026, puis le lancement en réalisation et l'arrêt de l'organisation industrielle en 2028.",
  },
  operators: ["France — armée de Terre (prévu)"],
  theatres: ["Aucun — programme en étude"],
  timeline: [
    { date: "2026-10", label: "Attribution du MBT à l'armée de Terre confirmée le 24 octobre 2026 selon Opex360.", kind: "jalon", metricIds: ["MET-1014"] },
    { date: "2028", label: "Lancement en réalisation du MBT en 2028 et arrêt de l'organisation industrielle.", kind: "jalon", metricIds: ["MET-1003"] },
    { date: "2030", label: "Capacité opérationnelle initiale visée en 2030–2031.", kind: "jalon", metricIds: ["MET-0354"] },
    { date: "2035", label: "Production en série visée en 2035–2036.", kind: "jalon", metricIds: ["MET-0355"] },
  ],
  registryEntityIds: ["ENT-MISSILE-BALISTIQUE-SOL-SOL"],
  industrialChain: [
    { entityId: "ENT-MISSILE-BALISTIQUE-SOL-SOL", entityName: "Missile balistique conventionnel sol-sol", actor: "ArianeGroup", role: "Partenaire", country: "France", scope: "Offre B-Strike" },
    { entityId: "ENT-MISSILE-BALISTIQUE-SOL-SOL", entityName: "Missile balistique conventionnel sol-sol", actor: "Thales", role: "Partenaire", country: "France", scope: "Offre avec ArianeGroup" },
  ],
  sovereignty: [
    { entityId: "ENT-MISSILE-BALISTIQUE-SOL-SOL", localContentRule: "Non_specifie", thirdPartyLock: "Non_specifie", sourceCodeAccess: "Non_specifie", chokepoints: [] },
  ],
  watchpoints: [
    { entityId: "ENT-MISSILE-BALISTIQUE-SOL-SOL", entityName: "Missile balistique conventionnel sol-sol", horizon: "2026-2036", event: "Missile balistique conventionnel : études de levée de risques, contrat de réalisation et tenue des objectifs de capacité initiale et de série." },
    { entityId: "ENT-MISSILE-BALISTIQUE-SOL-SOL", entityName: "Missile balistique conventionnel sol-sol", horizon: "Automne 2026", event: "Notification de l'étude de levée de risques" },
    { entityId: "ENT-MISSILE-BALISTIQUE-SOL-SOL", entityName: "Missile balistique conventionnel sol-sol", horizon: "2028", event: "Lancement en réalisation et organisation industrielle définitive" },
    { entityId: "ENT-MISSILE-BALISTIQUE-SOL-SOL", entityName: "Missile balistique conventionnel sol-sol", horizon: "2030–2031", event: "Capacité opérationnelle initiale" },
    { entityId: "ENT-MISSILE-BALISTIQUE-SOL-SOL", entityName: "Missile balistique conventionnel sol-sol", horizon: "2035–2036", event: "Production en série" },
    { entityId: "ENT-MISSILE-BALISTIQUE-SOL-SOL", entityName: "Missile balistique conventionnel sol-sol", horizon: "2028", event: "Lancement en réalisation et arrêt de l'organisation industrielle" },
    { entityId: "ENT-MISSILE-BALISTIQUE-SOL-SOL", entityName: "Missile balistique conventionnel sol-sol", horizon: "2030–2031", event: "Capacité initiale" },
    { entityId: "ENT-MISSILE-BALISTIQUE-SOL-SOL", entityName: "Missile balistique conventionnel sol-sol", horizon: "2035–2036", event: "Série" },
  ],
  sources: [
    src("loi-2026-791-loda", "Légifrance", "Loi n° 2026-791 du 16 août 2026 actualisant la programmation militaire", "officiel", "A", "2026-08-16", "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000054694832/2026-10-25"),
    src("loi-2026-791-jorf", "Journal officiel (Légifrance)", "Loi n° 2026-791 du 16/08/2026 (LPM actualisée), JORF — rapport annexé", "officiel", "A", "2026-08-18", "https://www.legifrance.gouv.fr/jorf/id/JORFSCTA000054694833"),
    src("senat-dissuasion-avancee", "Sénat — rapport d'information", "« La dissuasion avancée » : renforcer la défense de l'Europe", "institution", "A", undefined, "https://www.senat.fr/rap/r25-950/r25-950_mono.html"),
    src("an-avis-3394-mbt", "Assemblée nationale — commission de la défense", "Avis n° 3394 sur le projet de loi de finances pour 2027, tome IV « Préparation et emploi des forces : forces terrestres »", "officiel", "A", "2026-10-22", "https://www.assemblee-nationale.fr/dyn/17/rapports/cion_def/l17b3394-tiv_rapport-avis.pdf"),
    src("opex360-mbt", "Opex360", "Le futur missile balistique terrestre devrait finalement être mis en œuvre par l'armée de Terre", "presse", "C", "2026-10-24", "https://www.opex360.com/2026/10/24/le-futur-missile-balistique-terrestre-devrait-finalement-etre-mis-en-oeuvre-par-larmee-de-terre/"),
    src("arms-control-today-medium-range", "Arms Control Today (Xiaodon Liang, Naomi Satoh)", "Europe Seeks Medium-Range Missile Response", "think-tank", "B", "2026-01", "https://www.armscontrol.org/act/2026-01/news/europe-seeks-medium-range-missile-response"),
  ],
  updated: "2026-11-17",
};
