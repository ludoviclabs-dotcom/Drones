import type { DefenseSystem } from "../types";
import { fedSources } from "./fed-interceptor-sources";
import { ind, scoreSet } from "./registry-helpers";

// HYDIS — fiche issue du registre « Souveraineté industrielle » (17/11/2026).
// Chaque chiffre porte son metric_id, son statut et sa source ; rien n'est
// déduit : un champ que le registre ne documente pas s'écrit « non documenté ».

export const hydis: DefenseSystem = {
  slug: "hydis",
  name: "HYDIS (« Aquila »)",
  designation:
    "Hypersonic Defence Interceptor Study · intercepteur endo-atmosphérique mené par MBDA — à ne pas confondre avec l'Aquila de l'OTAN (APSS)",
  reference: "PNP-MSL-016",
  category: "missile",
  missileRole: "SAM",
  classLabel: "Intercepteur anti-hypersonique endo-atmosphérique (concept)",
  country: "Europe — France, Italie, Pays-Bas, Allemagne",
  flag: "🇪🇺",
  manufacturer: "MBDA (chef de file) · consortium européen",
  introduced: "Concept — phase 1 jusqu'en mai 2027",
  status:
    "Phase 1 de concept ; concurrent de HYDEF à l'appel FED « Endo-Atmospheric Interceptor » — décision de la Commission attendue le 30 novembre 2026",
  acquisitionModes: ["cooperatif"],
  tagline:
    "Un concept d'intercepteur européen anti-hypersonique, mené par MBDA et mis en concurrence avec HYDEF : un seul des deux sera financé en phase 2.",
  summary:
    "HYDIS (Hypersonic Defence Interceptor Study) est le projet d'intercepteur endo-atmosphérique conduit par MBDA, avec la France, l'Italie, les Pays-Bas et l'Allemagne en phase 1. Il concourt avec HYDEF, porté par l'espagnol SMS et l'allemand Diehl, à l'appel du Fonds européen de défense « Endo-Atmospheric Interceptor » : la Commission ne financera qu'un projet en phase 2 et doit trancher fin novembre 2026.\n\nPour Panoplie, c'est un objet de concept — aucun prix unitaire, aucune capacité qualifiée — dont l'intérêt tient au montage : financement public mixte FED / États, consortium d'une dizaine d'industriels et d'instituts, place de l'Allemagne ouverte en phase 2. Son surnom « Aquila » n'a aucun rapport avec la capacité spatiale OTAN APSS / Aquila.",
  keySpecs: [
    ind("Rôle", "Intercepteur anti-hypersonique endo-atmosphérique (« intercepteur anti-hypersonique européen »)", "moyenne", { src: ["breaking-eai-1106"] }),
    ind("Longueur", "Environ 7 m", "faible", { ids: ["MET-0057"], fs: "presse", src: ["breaking-eai-1106"], note: "Dimension de concept rapportée par la presse ; non confirmée par un document programme." }),
    ind("Vitesse maximale", "Jusqu'à Mach 17 en haute altitude", "faible", { ids: ["MET-0058"], fs: "presse", src: ["breaking-eai-1106"], note: "Performance de concept, non démontrée." }),
    ind("Étages — selon Defense News", "Quatre étages", "faible", { ids: ["MET-0055"], fs: "presse", src: ["defensenews-hydis-1105"], note: "Meta-Defense donne trois étages : les sources divergent, aucune n'est retenue sur l'autre." }),
    ind("Étages — selon Meta-Defense", "Trois étages", "faible", { ids: ["MET-0056"], fs: "presse", src: ["metadefense-hydis-hydef"] }),
    ind("Revue finale du concept", "Validée le 10/07/2026", "moyenne", { ids: ["MET-0053"], fs: "presse", src: ["defensenews-hydis-0713"] }),
    ind("Maturité visée en phase 1", "TRL 3 au moins", "moyenne", { ids: ["MET-0054"], fs: "presse", src: ["breaking-eai-1106"] }),
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "HYDIS n'a pas de prix : ni coût unitaire ni coût de série n'existent à ce stade. Le coût se lit en argent public engagé par phase d'étude — enveloppe du Fonds européen de défense, contributions des États — et en engagements annoncés pour la phase 2.\n\nDeux totaux figurent au registre comme calculs d'après des chiffres de presse : ils sont signalés « (calc.) » et n'ont pas valeur de budget.",
      indicators: [
        ind("Phase 1 — financement FED", "80 M€", "moyenne", { ids: ["MET-0049"], fs: "presse", src: ["navalnews-hydis-grant", "ec-defis-hydis2"] }),
        ind("Phase 1 — financement des États", "57 M€", "moyenne", { ids: ["MET-0050"], fs: "presse", src: ["defensenews-hydis-1105"], note: "Defense News (juillet 2026) donne « environ 60 M€ » : écart non tranché." }),
        ind("Phase 1 — total public", "137 M€ (80 + 57) (calc.)", "moyenne", { ids: ["MET-0048"], fs: "calcule", src: ["defensenews-hydis-1105"] }),
        ind("Phase 2 — enveloppe FED (un seul projet)", "100 M€", "moyenne", { ids: ["MET-0040"], fs: "presse", src: ["metadefense-hydis-hydef"] }),
        ind("Phase 2 — financement annoncé par MBDA", "133 M€ (onze États, si HYDIS est retenu)", "moyenne", { ids: ["MET-0059"], fs: "presse", src: ["defensenews-hydis-1105"], note: "Annonce de l'industriel, non confirmée par des engagements fermes d'États." }),
        ind("Phase 2 — total public", "233 M€ (100 + 133) (calc.)", "moyenne", { ids: ["MET-0060"], fs: "calcule", src: ["breaking-eai-1106"] }),
      ],
    },
    {
      key: "finance",
      narrative:
        "Le financement est mixte : le FED apporte une enveloppe, les États participants un complément. La phase 1 de concept dure jusqu'en mai 2027 ; la phase 2 est prévue de mi-2027 à mi-2029, mais seul un des deux projets concurrents sera retenu. L'engagement ferme des États, avant mi-2027, reste à venir.",
      indicators: [
        ind("États participants — phase 1", "Quatre États (France, Italie, Pays-Bas, Allemagne)", "moyenne", { ids: ["MET-0052"], fs: "presse", src: ["navalnews-hydis-grant"] }),
        ind("États contributeurs annoncés — phase 2", "Onze États", "moyenne", { ids: ["MET-0061"], fs: "presse", src: ["defensenews-hydis-1105"] }),
        ind("Pays du projet élargi — phase 2", "Dix-sept pays, sans l'Allemagne", "moyenne", { ids: ["MET-0062"], fs: "presse", src: ["defensenews-hydis-1105"] }),
        ind("Fin de la phase 1 (concept)", "Jusqu'à mai 2027", "moyenne", { ids: ["MET-0070"], fs: "presse", src: ["defensenews-hydis-1105"] }),
        ind("Phase 2", "De mi-2027 à mi-2029", "moyenne", { ids: ["MET-0069"], fs: "presse", src: ["breaking-eai-1106"] }),
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "MBDA est chef de file d'un consortium qui réunit des industriels et des instituts de plusieurs pays : propulsion, autodirecteur, structures, essais. Le registre cite chacun comme « industriel cité dans le consortium », sans ventiler les lots : on ne déduit donc aucune répartition du travail.",
      indicators: [
        ind("Chef de file", "MBDA", "haute", { src: ["defensenews-hydis-1105"] }),
        ind("Consortium cité", "Saab, Thales, Leonardo, Avio, ArianeGroup, Roxel, Lynred, GKN Fokker, TNO, FOI", "moyenne", { src: ["defensenews-hydis-1105"], note: "Liste du registre ; la répartition des lots n'est pas publique." }),
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "HYDIS et HYDEF font de l'appel FED un test d'autonomie européenne face aux menaces hypersoniques : deux concepts concurrents, deux coalitions d'États. La place de l'Allemagne, présente dans les deux projets en phase 1, est une question ouverte pour la phase 2.",
      indicators: [
        ind("Concurrent", "HYDEF (SMS / Diehl) — appel FED « Endo-Atmospheric Interceptor »", "haute", { src: ["breaking-eai-1106"] }),
        ind("Décision de la Commission", "Attendue le 30 novembre 2026 — non publiée au 17/11/2026", "moyenne", { ids: ["MET-0041"], fs: "presse", src: ["defensenews-hydis-1105"] }),
        ind("Place de l'Allemagne", "Départ de HYDIS ou maintien dans les deux projets : question ouverte en phase 2", "faible", { src: ["breaking-eai-1106"] }),
      ],
    },
    {
      key: "export",
      narrative:
        "Rien n'est documenté sur le contrôle des exportations ou sur l'accès à la propriété intellectuelle de HYDIS : le projet est un concept financé par des fonds européens. Aucune règle de contenu local, aucun verrou d'un tiers, aucun accès au code source n'est précisé par les sources — on ne les déduit pas.",
      indicators: [
        ind("Régime export et propriété intellectuelle", "non documenté", "faible"),
      ],
    },
  ],
  scores: scoreSet({
    "efficacite-cout": ["D", "Aucun coût unitaire ni de série publié : l'évaluation ne porte que sur le financement public des phases d'étude."],
    survivabilite: ["D", "Concept en phase 1 : aucune capacité démontrée ; vitesse et dimensions sont des chiffres de presse."],
    exportabilite: ["D", "Régime d'export et propriété intellectuelle non documentés ; projet multinational financé par le FED."],
    "risque-industriel": ["C", "Consortium large, mais un seul projet sera financé en phase 2 et la place de l'Allemagne reste ouverte."],
    maturite: ["D", "Objectif TRL 3 en phase 1 ; démonstrateur complet annoncé avant fin 2029 par MBDA, TRL 6 visé en 2030 par la Commission."],
    "confiance-donnees": ["C", "Chiffres de la presse spécialisée, parfois divergents (trois ou quatre étages, 57 ou environ 60 M€) ; seul le financement FED est recoupé par la Commission."],
  }),
  editorial: {
    mythVsReality:
      "Le mythe : l'Europe aurait déjà son intercepteur anti-hypersonique. La réalité : un concept en phase d'étude, mis en concurrence avec un autre, dont un seul sera financé pour la suite.",
    bestUseCase:
      "Lire le montage financier et industriel d'un programme européen de défense antimissile avant tout prototype.",
    weakPoint:
      "Presque tous les chiffres techniques viennent de la presse spécialisée et divergent d'une source à l'autre.",
    analystNote:
      "À suivre après le 30 novembre 2026 : le choix de la Commission, les engagements fermes des États avant mi-2027 et le rôle de l'Allemagne en phase 2.",
  },
  operators: ["Programme européen — France, Italie, Pays-Bas, Allemagne (phase 1)"],
  theatres: ["Aucun — concept en phase d'étude"],
  timeline: [
    { date: "2023-12", label: "Projet FED HYDIS² confié à l'OCCAR (80 M€ du Fonds européen de défense).", kind: "jalon", metricIds: ["MET-0049"] },
    { date: "2026-07", label: "Revue finale du concept HYDIS validée le 10/07/2026.", kind: "jalon", metricIds: ["MET-0053"] },
    { date: "2026-11", label: "Décision de la Commission sur l'appel FED attendue le 30 novembre 2026.", kind: "debat", metricIds: ["MET-0041"] },
    { date: "2029", label: "Vol d'un démonstrateur complet annoncé par MBDA avant fin 2029.", kind: "jalon", metricIds: ["MET-0068"] },
    { date: "2030", label: "Démonstrateur de niveau TRL 6 visé en 2030 par la Commission.", kind: "jalon", metricIds: ["MET-0046"] },
  ],
  registryEntityIds: ["ENT-HYDIS", "ENT-FED-INTERCEPTEUR-ENDO"],
  programmeTree: [
    { entityId: "ENT-FED-INTERCEPTEUR-ENDO", name: "Appel FED « Endo-Atmospheric Interceptor » (intercepteur endo-atmosphérique)", kind: "Programme_Cadre", children: [
      { entityId: "ENT-HYDIS", name: "HYDIS", kind: "Munition_Effecteur" },
      { entityId: "ENT-HYDEF", name: "HYDEF", kind: "Munition_Effecteur" },
    ] },
  ],
  industrialChain: [
    { entityId: "ENT-HYDIS", entityName: "HYDIS", actor: "MBDA", role: "Maitre_Oeuvre", country: "Europe", scope: "Chef de file" },
    { entityId: "ENT-HYDIS", entityName: "HYDIS", actor: "Saab", role: "Partenaire", scope: "Industriel cité dans le consortium" },
    { entityId: "ENT-HYDIS", entityName: "HYDIS", actor: "Thales", role: "Partenaire", scope: "Industriel cité dans le consortium" },
    { entityId: "ENT-HYDIS", entityName: "HYDIS", actor: "Leonardo", role: "Partenaire", scope: "Industriel cité dans le consortium" },
    { entityId: "ENT-HYDIS", entityName: "HYDIS", actor: "Avio", role: "Partenaire", scope: "Industriel cité dans le consortium" },
    { entityId: "ENT-HYDIS", entityName: "HYDIS", actor: "ArianeGroup", role: "Partenaire", scope: "Industriel cité dans le consortium" },
    { entityId: "ENT-HYDIS", entityName: "HYDIS", actor: "Roxel", role: "Partenaire", scope: "Industriel cité dans le consortium" },
    { entityId: "ENT-HYDIS", entityName: "HYDIS", actor: "Lynred", role: "Partenaire", scope: "Industriel cité dans le consortium" },
    { entityId: "ENT-HYDIS", entityName: "HYDIS", actor: "GKN Fokker", role: "Partenaire", scope: "Industriel cité dans le consortium" },
    { entityId: "ENT-HYDIS", entityName: "HYDIS", actor: "TNO", role: "Partenaire", scope: "Industriel cité dans le consortium" },
    { entityId: "ENT-HYDIS", entityName: "HYDIS", actor: "FOI", role: "Partenaire", scope: "Industriel cité dans le consortium" },
  ],
  sovereignty: [
    { entityId: "ENT-HYDIS", localContentRule: "Cooperation_Multinationale", thirdPartyLock: "Non_specifie", sourceCodeAccess: "Non_specifie", chokepoints: [] },
  ],
  watchpoints: [
    { entityId: "ENT-FED-INTERCEPTEUR-ENDO", entityName: "Appel FED « Endo-Atmospheric Interceptor » (intercepteur endo-atmosphérique)", horizon: "30 nov. 2026", event: "Décision de la Commission : choix du projet financé par l'enveloppe de 100 M€ ; sort du projet écarté." },
    { entityId: "ENT-FED-INTERCEPTEUR-ENDO", entityName: "Appel FED « Endo-Atmospheric Interceptor » (intercepteur endo-atmosphérique)", horizon: "Avant mi-2027", event: "Engagements fermes des États : les 133 M€ annoncés par MBDA, et la contribution des États de HYDEF (n.c.)." },
    { entityId: "ENT-FED-INTERCEPTEUR-ENDO", entityName: "Appel FED « Endo-Atmospheric Interceptor » (intercepteur endo-atmosphérique)", horizon: "Phase 2", event: "Place de l'Allemagne : départ de HYDIS ou maintien dans les deux projets." },
    { entityId: "ENT-FED-INTERCEPTEUR-ENDO", entityName: "Appel FED « Endo-Atmospheric Interceptor » (intercepteur endo-atmosphérique)", horizon: "2029-2030", event: "Premier vol à pleine échelle : démonstrateur annoncé avant fin 2029 par MBDA ; niveau TRL 6 visé en 2030 par la Commission." },
    { entityId: "ENT-HYDIS", entityName: "HYDIS", horizon: "Avant mi-2027", event: "Engagements fermes des États : les 133 M€ annoncés par MBDA." },
    { entityId: "ENT-HYDIS", entityName: "HYDIS", horizon: "Phase 2", event: "Place de l'Allemagne : départ de HYDIS ou maintien dans les deux projets." },
    { entityId: "ENT-HYDIS", entityName: "HYDIS", horizon: "2029-2030", event: "Premier vol à pleine échelle : démonstrateur annoncé avant fin 2029 par MBDA ; niveau TRL 6 visé en 2030 par la Commission." },
  ],
  sources: fedSources([
    "breaking-eai-1106",
    "defensenews-hydis-1105",
    "defensenews-hydis-0713",
    "navalnews-hydis-grant",
    "metadefense-hydis-hydef",
    "ec-defis-hydis2",
    "defencematters-eai",
  ]),
  updated: "2026-11-17",
};
