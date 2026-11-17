import type { DefenseSystem } from "../types";
import { fedSources } from "./fed-interceptor-sources";
import { ind, scoreSet } from "./registry-helpers";

// HYDEF — fiche issue du registre « Souveraineté industrielle » (17/11/2026).
// Même cadre que HYDIS, son concurrent à l'appel FED : chaque chiffre porte son
// metric_id, son statut et sa source ; un champ non documenté s'écrit ainsi.

export const hydef: DefenseSystem = {
  slug: "hydef",
  name: "HYDEF",
  designation:
    "Intercepteur endo-atmosphérique mené par SMS (Espagne), coordination technique Diehl Defence (Allemagne) — alias HYDEF2",
  reference: "PNP-MSL-017",
  category: "missile",
  missileRole: "SAM",
  classLabel: "Intercepteur anti-hypersonique endo-atmosphérique (concept)",
  country: "Europe — Espagne, Allemagne, Pologne, Belgique, Norvège",
  flag: "🇪🇺",
  manufacturer: "Sistemas de Misiles de España (SMS) · Diehl Defence · consortium européen",
  introduced: "Concept — première étape close fin octobre 2026",
  status:
    "Phase 1 de concept ; concurrent de HYDIS à l'appel FED « Endo-Atmospheric Interceptor » — décision de la Commission attendue le 30 novembre 2026",
  acquisitionModes: ["cooperatif"],
  tagline:
    "L'autre concept d'intercepteur européen anti-hypersonique : un consortium conduit par l'Espagne, avec Diehl, face à HYDIS de MBDA.",
  summary:
    "HYDEF est le projet d'intercepteur endo-atmosphérique conduit par l'espagnol Sistemas de Misiles de España (SMS), avec Diehl Defence pour la coordination technique, cinq États participants et un consortium de plus petite taille que celui de HYDIS. Il concourt avec HYDIS à l'appel du Fonds européen de défense « Endo-Atmospheric Interceptor » : un seul des deux sera financé en phase 2.\n\nPour Panoplie, HYDEF est le miroir de HYDIS : même absence de prix, mêmes chiffres de presse, mais une répartition des financements différente — l'essentiel de l'argent public de la phase 1 vient du FED, les États y contribuent peu. Le montant que les États engageraient en phase 2 n'est pas communiqué.",
  keySpecs: [
    ind("Chef de file", "Sistemas de Misiles de España (SMS)", "haute", { src: ["sener-hydef"] }),
    ind("Coordination technique", "Diehl Defence (Allemagne)", "moyenne", { src: ["defence-industry-hydef-review"] }),
    ind("États participants", "Cinq États (Espagne, Allemagne, Pologne, Belgique, Norvège)", "moyenne", { ids: ["MET-0074"], fs: "presse", src: ["breaking-eai-1106"] }),
    ind("Revue préliminaire des exigences chez Diehl", "26/08/2026", "moyenne", { ids: ["MET-0075"], fs: "presse", src: ["defence-industry-hydef-review"] }),
    ind("Technologies critiques « Block 0 »", "Maturité d'au moins TRL 3", "moyenne", { ids: ["MET-0076"], fs: "presse", src: ["defence-industry-hydef-review"] }),
    ind("Clôture de la première étape (réunion de Madrid)", "22 octobre ; fin octobre 2026", "faible", { ids: ["MET-0077"], fs: "presse", src: ["breaking-eai-1106"], note: "Le registre donne deux dates, 22 octobre et fin octobre 2026 : elles ne sont pas départagées." }),
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "HYDEF n'a ni prix unitaire ni coût de série : le coût se lit en argent public de phase d'étude. En phase 1, l'essentiel vient du Fonds européen de défense ; la contribution des États est faible. Le total est un calcul d'après deux chiffres de presse, signalé « (calc.) ».",
      indicators: [
        ind("Phase 1 — financement FED", "≈ 100 M€", "moyenne", { ids: ["MET-0072"], fs: "presse", src: ["sener-hydef"] }),
        ind("Phase 1 — financement des États", "≈ 10 M€", "moyenne", { ids: ["MET-0073"], fs: "presse", src: ["defence-industry-hydef-amendment"] }),
        ind("Phase 1 — total public", "Environ 110 M€ (≈ 100 + ≈ 10) (calc.)", "moyenne", { ids: ["MET-0071"], fs: "calcule", src: ["metadefense-hydis-hydef"] }),
        ind("Phase 2 — contribution des États", "n.c.", "haute", { note: "Le montant que les États de HYDEF engageraient en phase 2 n'est pas communiqué (échéance : engagements fermes avant mi-2027).", fs: "non-communique" }),
      ],
    },
    {
      key: "finance",
      narrative:
        "Le FED finance l'essentiel de la phase 1 ; les États participants engagent des montants modestes. Les engagements fermes des États, attendus avant mi-2027, ne sont pas chiffrés pour HYDEF. La durée prévue de la phase de concept est de trois ans pour chaque projet, la phase 2 débutant à partir de 2027.",
      indicators: [
        ind("Enveloppe FED — phase 2 (un seul projet)", "100 M€", "moyenne", { ids: ["MET-0040"], fs: "presse", src: ["metadefense-hydis-hydef"] }),
        ind("Durée de la phase de concept", "Trois ans pour chaque projet", "moyenne", { ids: ["MET-0044"], fs: "presse", src: ["navalnews-hydis-grant"] }),
        ind("Début de la phase 2", "À partir de 2027", "moyenne", { ids: ["MET-0045"], fs: "presse", src: ["breaking-eai-1106"] }),
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "SMS est chef de file ; Diehl Defence assure la coordination technique ; Nammo, Navantia et GMV sont cités comme industriels du consortium, sans répartition de lots publiée. Le registre ne documente aucun goulot d'étranglement ni verrou d'un tiers.",
      indicators: [
        ind("Chef de file", "Sistemas de Misiles de España (SMS) — Espagne", "haute", { src: ["sener-hydef"] }),
        ind("Industriels cités", "Diehl Defence, Nammo, Navantia, GMV", "moyenne", { src: ["defence-industry-hydef-review"], note: "Liste du registre ; la répartition des lots n'est pas publique." }),
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "HYDEF représente la coalition ibéro-nordique et centre-européenne face à la coalition franco-italienne de HYDIS. L'Allemagne apparaît dans les deux projets en phase 1 — Diehl d'un côté, les États de l'autre — ce qui rend sa position de phase 2 déterminante.",
      indicators: [
        ind("Concurrent", "HYDIS (MBDA) — appel FED « Endo-Atmospheric Interceptor »", "haute", { src: ["breaking-eai-1106"] }),
        ind("Décision de la Commission", "Attendue le 30 novembre 2026 — non publiée au 17/11/2026", "moyenne", { ids: ["MET-0041"], fs: "presse", src: ["defensenews-hydis-1105"] }),
        ind("Mise en service visée (intercepteur européen retenu)", "≈ 2035 ; « vers le milieu des années 2030 » ; démonstrateur TRL 6 visé en 2030", "faible", { ids: ["MET-0047", "MET-0046"], fs: "presse", src: ["defencematters-eai"], note: "Projection pour l'intercepteur européen retenu, non spécifique à HYDEF." }),
      ],
    },
    {
      key: "export",
      narrative:
        "Rien n'est documenté sur le contrôle des exportations ou la propriété intellectuelle de HYDEF : projet de concept financé par des fonds européens, sans règle de contenu local ni verrou d'un tiers précisé par les sources.",
      indicators: [
        ind("Régime export et propriété intellectuelle", "non documenté", "faible"),
      ],
    },
  ],
  scores: scoreSet({
    "efficacite-cout": ["D", "Aucun coût unitaire ni de série publié : l'évaluation ne porte que sur le financement public des phases d'étude."],
    survivabilite: ["D", "Concept en phase 1 : aucune capacité démontrée, technologies critiques à TRL 3 au moins."],
    exportabilite: ["D", "Régime d'export et propriété intellectuelle non documentés ; projet multinational financé par le FED."],
    "risque-industriel": ["C", "Consortium plus restreint que celui de HYDIS ; un seul projet sera financé en phase 2 et la contribution des États n'est pas communiquée."],
    maturite: ["D", "Première étape close fin octobre 2026 ; technologies critiques « Block 0 » à TRL 3 au moins ; prototype TRL 6 visé."],
    "confiance-donnees": ["C", "Chiffres de la presse spécialisée et du coordinateur ; montant de la phase 2 non communiqué."],
  }),
  editorial: {
    mythVsReality:
      "Le mythe : le meilleur concept l'emportera sur ses seuls mérites techniques. La réalité : l'appel FED arbitre autant des coalitions d'États et de financements que des performances, qu'aucune source ne documente de façon recoupée.",
    bestUseCase:
      "Comparer, côte à côte avec HYDIS, le montage industriel et financier de deux candidats à un même appel européen.",
    weakPoint:
      "Le financement des États en phase 2 n'est pas communiqué ; les performances ne sont pas publiées.",
    analystNote:
      "À suivre après le 30 novembre 2026 : le projet retenu, le sort de l'écarté, et la contribution effective des États de HYDEF avant mi-2027.",
  },
  operators: ["Programme européen — Espagne, Allemagne, Pologne, Belgique, Norvège (phase 1)"],
  theatres: ["Aucun — concept en phase d'étude"],
  timeline: [
    { date: "2022-07", label: "Sener annonce diriger le projet principal HYDEF au titre du Fonds européen de défense (≈ 100 M€).", kind: "jalon", metricIds: ["MET-0072"] },
    { date: "2024-05", label: "Premier avenant à la convention de subvention HYDEF signé (≈ 10 M€ des États participants).", kind: "jalon", metricIds: ["MET-0073"] },
    { date: "2026-08", label: "Revue préliminaire des exigences de HYDEF chez Diehl le 26/08/2026.", kind: "jalon", metricIds: ["MET-0075"] },
    { date: "2026-10", label: "Première étape de HYDEF close lors de la réunion de Madrid, le 22 octobre ou fin octobre 2026.", kind: "jalon", metricIds: ["MET-0077"] },
    { date: "2026-11", label: "Décision de la Commission sur l'appel FED attendue le 30 novembre 2026.", kind: "debat", metricIds: ["MET-0041"] },
  ],
  registryEntityIds: ["ENT-HYDEF", "ENT-FED-INTERCEPTEUR-ENDO"],
  programmeTree: [
    { entityId: "ENT-FED-INTERCEPTEUR-ENDO", name: "Appel FED « Endo-Atmospheric Interceptor » (intercepteur endo-atmosphérique)", kind: "Programme_Cadre", children: [
      { entityId: "ENT-HYDIS", name: "HYDIS", kind: "Munition_Effecteur" },
      { entityId: "ENT-HYDEF", name: "HYDEF", kind: "Munition_Effecteur" },
    ] },
  ],
  industrialChain: [
    { entityId: "ENT-HYDEF", entityName: "HYDEF", actor: "Sistemas de Misiles de España (SMS)", role: "Maitre_Oeuvre", country: "Espagne", scope: "Chef de file du consortium" },
    { entityId: "ENT-HYDEF", entityName: "HYDEF", actor: "Diehl Defence", role: "Co-traitant", country: "Allemagne", scope: "Coordination technique" },
    { entityId: "ENT-HYDEF", entityName: "HYDEF", actor: "Nammo", role: "Partenaire", scope: "Industriel cité dans le consortium" },
    { entityId: "ENT-HYDEF", entityName: "HYDEF", actor: "Navantia", role: "Partenaire", scope: "Industriel cité dans le consortium" },
    { entityId: "ENT-HYDEF", entityName: "HYDEF", actor: "GMV", role: "Partenaire", scope: "Industriel cité dans le consortium" },
  ],
  sovereignty: [
    { entityId: "ENT-HYDEF", localContentRule: "Cooperation_Multinationale", thirdPartyLock: "Non_specifie", sourceCodeAccess: "Non_specifie", chokepoints: [] },
  ],
  watchpoints: [
    { entityId: "ENT-FED-INTERCEPTEUR-ENDO", entityName: "Appel FED « Endo-Atmospheric Interceptor » (intercepteur endo-atmosphérique)", horizon: "30 nov. 2026", event: "Décision de la Commission : choix du projet financé par l'enveloppe de 100 M€ ; sort du projet écarté." },
    { entityId: "ENT-FED-INTERCEPTEUR-ENDO", entityName: "Appel FED « Endo-Atmospheric Interceptor » (intercepteur endo-atmosphérique)", horizon: "Avant mi-2027", event: "Engagements fermes des États : les 133 M€ annoncés par MBDA, et la contribution des États de HYDEF (n.c.)." },
    { entityId: "ENT-FED-INTERCEPTEUR-ENDO", entityName: "Appel FED « Endo-Atmospheric Interceptor » (intercepteur endo-atmosphérique)", horizon: "Phase 2", event: "Place de l'Allemagne : départ de HYDIS ou maintien dans les deux projets." },
    { entityId: "ENT-FED-INTERCEPTEUR-ENDO", entityName: "Appel FED « Endo-Atmospheric Interceptor » (intercepteur endo-atmosphérique)", horizon: "2029-2030", event: "Premier vol à pleine échelle : démonstrateur annoncé avant fin 2029 par MBDA ; niveau TRL 6 visé en 2030 par la Commission." },
    { entityId: "ENT-HYDEF", entityName: "HYDEF", horizon: "Avant mi-2027", event: "Engagements fermes des États : contribution des États de HYDEF (n.c.)." },
  ],
  sources: fedSources([
    "breaking-eai-1106",
    "defensenews-hydis-1105",
    "navalnews-hydis-grant",
    "metadefense-hydis-hydef",
    "sener-hydef",
    "defence-industry-hydef-amendment",
    "defence-industry-hydef-review",
    "defencematters-eai",
  ]),
  updated: "2026-11-17",
};
