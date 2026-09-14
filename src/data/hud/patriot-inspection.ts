/**
 * Catalogue d'inspection de la planche Patriot PAC-3 MSE.
 *
 * Chaque sous-ensemble correspond à des nœuds réels du GLB (préfixes ASCII
 * stables, voir tools/patriot-3d). Les descriptions ne reprennent que des
 * éléments publics et sourcés ; un repère de confiance « moyenne » est signalé
 * comme tel. Rien ici ne décrit un fonctionnement interne, une performance
 * d'engagement ou une procédure.
 */

export const PATRIOT_INSPECTABLE_IDS = [
  "launcher",
  "canisters",
  "interceptor",
  "trailer",
  "power",
  "eles",
  "tractor",
  "radar",
  "ecs",
  "epp",
  "amg",
  "launchers",
] as const;

export type PatriotInspectableId = (typeof PATRIOT_INSPECTABLE_IDS)[number];

export type PatriotConfidence = "haute" | "moyenne";

export type PatriotFact = {
  readonly label: string;
  readonly value: string;
  readonly confidence: PatriotConfidence;
};

export type PatriotInspectableGroup = "station" | "battery";

export type PatriotInspectable = {
  readonly id: PatriotInspectableId;
  readonly group: PatriotInspectableGroup;
  readonly label: string;
  readonly description: string;
  readonly facts: readonly PatriotFact[];
  readonly sources: readonly PatriotSourceId[];
};

export const PATRIOT_SOURCES = {
  "fm-3-01-85": {
    title: "FM 3-01.85, Patriot Battalion and Battery Operations (2002), annexe B",
    publisher: "US Army (via GlobalSecurity)",
    url: "https://www.globalsecurity.org/space/library/policy/army/fm/3-01-85/appb.htm",
  },
  "lm-mse-brief": {
    title: "PAC-3 MSE — présentation partenaires (2024)",
    publisher: "Lockheed Martin",
    url: "https://www.lockheedmartin.com/content/dam/lockheed-martin/mfc/documents/pac-3/24-09790-iamd-pac-3-mse-partner-ppt--updates_r2.pdf",
  },
  "lm-pac3": {
    title: "PAC-3 — page produit",
    publisher: "Lockheed Martin",
    url: "https://www.lockheedmartin.com/en-us/products/pac-3-advanced-air-defense-missile.html",
  },
  "gs-mse": {
    title: "PAC-3 Missile Segment Enhancement (MSE)",
    publisher: "GlobalSecurity",
    url: "https://www.globalsecurity.org/space/systems/patriot-ac-3-mse.htm",
  },
  "wp-de-patriot": {
    title: "MIM-104 Patriot",
    publisher: "Wikipedia (DE)",
    url: "https://de.wikipedia.org/wiki/MIM-104_Patriot",
  },
  "rtx-ltamds": {
    title: "LTAMDS — Lower Tier Air and Missile Defense Sensor",
    publisher: "RTX (Raytheon)",
    url: "https://www.rtx.com/raytheon/what-we-do/integrated-air-and-missile-defense/ltamds",
  },
  "lm-ripple-2024": {
    title: "PAC-3 Engages Advanced Target in Flight Test (4 novembre 2024)",
    publisher: "Lockheed Martin",
    url: "https://news.lockheedmartin.com/2024-11-04-pac-3-engages-advanced-target-in-flight-test-supporting-u-s-army-modernization-strategy",
  },
  "csis-patriot": {
    title: "Patriot — Missile Threat",
    publisher: "CSIS",
    url: "https://missilethreat.csis.org/system/patriot/",
  },
} as const;

export type PatriotSourceId = keyof typeof PATRIOT_SOURCES;

export const PATRIOT_INSPECTABLES: readonly PatriotInspectable[] = [
  {
    id: "launcher",
    group: "station",
    label: "LANCEUR M903",
    description:
      "Tourelle de gisement, masse élevée articulée à l’arrière et relevée par deux vérins au site fixe de tir, mât de liaison vers le poste de conduite de tir.",
    facts: [
      { label: "Gisement", value: "± 110° par tourelle", confidence: "haute" },
      { label: "Site de tir", value: "fixe, ≈ 38°", confidence: "moyenne" },
      { label: "Liaison", value: "fibre optique ou radio (VHF)", confidence: "haute" },
    ],
    sources: ["fm-3-01-85", "wp-de-patriot"],
  },
  {
    id: "canisters",
    group: "station",
    label: "CONTENEURS PAC-3 MSE",
    description:
      "Douze conteneurs individuels « One-Pack », en trois rangées de quatre. Le conteneur sert à la fois d’emballage, de stockage et de tube de lancement.",
    facts: [
      { label: "Capacité", value: "12 MSE par lanceur", confidence: "haute" },
      { label: "Mixte", value: "6 MSE + 8 PAC-3 CRI", confidence: "haute" },
      { label: "Enveloppe de pile", value: "≈ 2,15 × 1,98 × 6,10 m", confidence: "haute" },
    ],
    sources: ["lm-mse-brief", "gs-mse", "fm-3-01-85"],
  },
  {
    id: "interceptor",
    group: "station",
    label: "INTERCEPTEUR PAC-3 MSE",
    description:
      "Intercepteur « hit-to-kill » : destruction par impact direct. Gouvernes arrière repliables, déployées à la sortie du tube. Livrée d’essai reprise des photographies publiques de tirs.",
    facts: [
      { label: "Moteur", value: "double impulsion, Ø 11,4 in", confidence: "haute" },
      { label: "Longueur", value: "≈ 5,2 m (estimation)", confidence: "moyenne" },
      { label: "Autodirecteur", value: "actif, bande Ka", confidence: "moyenne" },
    ],
    sources: ["lm-mse-brief", "lm-pac3"],
  },
  {
    id: "trailer",
    group: "station",
    label: "SEMI-REMORQUE M860A1",
    description:
      "Porte-lanceur à essieux en tandem et col de cygne, posé en batterie sur quatre stabilisateurs à patins.",
    facts: [
      { label: "Gabarit lanceur", value: "≈ 10,3 × 2,9 m", confidence: "haute" },
      { label: "Stabilisateurs", value: "4, pente jusqu’à 10°", confidence: "haute" },
    ],
    sources: ["fm-3-01-85"],
  },
  {
    id: "power",
    group: "station",
    label: "GROUPE ÉLECTROGÈNE",
    description:
      "Groupe diesel porté par le col de cygne, avec plateformes de travail latérales : le lanceur est autonome en énergie.",
    facts: [{ label: "Puissance", value: "15 kW, 400 Hz", confidence: "haute" }],
    sources: ["fm-3-01-85"],
  },
  {
    id: "eles",
    group: "station",
    label: "ÉLECTRONIQUE DE LANCEMENT",
    description:
      "L’ELES (Enhanced Launcher Electronics System), entre le lanceur et le col de cygne, fait l’interface entre le poste de conduite de tir et les conteneurs.",
    facts: [{ label: "Remplace", value: "le LEM, même emplacement", confidence: "haute" }],
    sources: ["fm-3-01-85"],
  },
  {
    id: "tractor",
    group: "battery",
    label: "TRACTEUR HEMTT M983",
    description:
      "Tracteur 8 × 8 de la famille HEMTT. Il amène la station de lancement, puis il est dételé en position de tir.",
    facts: [{ label: "Gabarit", value: "≈ 8,9 × 2,6 × 2,8 m", confidence: "haute" }],
    sources: ["fm-3-01-85"],
  },
  {
    id: "radar",
    group: "battery",
    label: "RADAR AN/MPQ-65",
    description:
      "Radar multifonction à antenne réseau, dressé en batterie à l’avant de son abri. Petites antennes IFF, TVM et annuleurs de lobes secondaires sur la même face. Successeur annoncé : LTAMDS, couverture 360°.",
    facts: [
      { label: "Bande", value: "C (G OTAN)", confidence: "moyenne" },
      { label: "Réseau dressé", value: "67,5°", confidence: "haute" },
    ],
    sources: ["fm-3-01-85", "rtx-ltamds"],
  },
  {
    id: "ecs",
    group: "battery",
    label: "POSTE DE CONDUITE DE TIR",
    description:
      "Abri AN/MSQ-132 (ECS) sur camion 5 t. Le tir y est commandé à distance : aucun personnel ne reste au lanceur.",
    facts: [{ label: "Gabarit", value: "≈ 9,8 × 2,7 × 3,6 m", confidence: "haute" }],
    sources: ["fm-3-01-85"],
  },
  {
    id: "epp",
    group: "battery",
    label: "CENTRALE ÉLECTRIQUE EPP III",
    description:
      "Deux groupes électrogènes sur porteur HEMTT M977, qui alimentent le radar et le poste de conduite de tir.",
    facts: [{ label: "Puissance", value: "2 × 150 kW, 400 Hz", confidence: "haute" }],
    sources: ["fm-3-01-85"],
  },
  {
    id: "amg",
    group: "battery",
    label: "MÂT D’ANTENNES OE-349",
    description:
      "Quatre antennes en deux paires, en tête d’un mât télescopique (représenté partiellement déployé). Il relie la batterie aux autres éléments du réseau.",
    facts: [{ label: "Hauteur maximale", value: "≈ 30,8 m", confidence: "haute" }],
    sources: ["fm-3-01-85"],
  },
  {
    id: "launchers",
    group: "battery",
    label: "AUTRES LANCEURS",
    description:
      "Lanceurs déjà en batterie. Les lanceurs déportés restent dans le secteur de surveillance du radar ; la disposition représentée est illustrative et compressée.",
    facts: [{ label: "Par batterie", value: "6 à 8 selon les sources", confidence: "moyenne" }],
    sources: ["fm-3-01-85", "csis-patriot"],
  },
];

export const PATRIOT_INSPECTION_GROUP_COPY: Record<PatriotInspectableGroup, string> = {
  station: "Station de lancement M903",
  battery: "Batterie",
};

export const PATRIOT_SOURCE_STATUS =
  "SOURCES PUBLIQUES · REPRÉSENTATION ILLUSTRATIVE";

export type PatriotInspectionState = {
  readonly previewId: PatriotInspectableId | null;
  readonly selectedId: PatriotInspectableId | null;
};

export type PatriotInspectionAction =
  | { type: "PREVIEW"; id: PatriotInspectableId | null }
  | { type: "TOGGLE"; id: PatriotInspectableId }
  | { type: "CLEAR_SELECTION" };

export const PATRIOT_INITIAL_INSPECTION_STATE: PatriotInspectionState = {
  previewId: null,
  selectedId: null,
};

export function isPatriotInspectableId(value: unknown): value is PatriotInspectableId {
  return (
    typeof value === "string" &&
    PATRIOT_INSPECTABLE_IDS.some((candidate) => candidate === value)
  );
}

export function patriotInspectionReducer(
  state: PatriotInspectionState,
  action: PatriotInspectionAction,
): PatriotInspectionState {
  switch (action.type) {
    case "PREVIEW":
      return action.id === null || isPatriotInspectableId(action.id)
        ? { ...state, previewId: action.id }
        : state;
    case "TOGGLE":
      return isPatriotInspectableId(action.id)
        ? { ...state, selectedId: state.selectedId === action.id ? null : action.id }
        : state;
    case "CLEAR_SELECTION":
      return state.selectedId === null && state.previewId === null
        ? state
        : PATRIOT_INITIAL_INSPECTION_STATE;
  }
}

export function activePatriotInspectionId(
  state: PatriotInspectionState,
): PatriotInspectableId | null {
  return state.selectedId ?? state.previewId;
}

export function patriotInspectableById(
  id: PatriotInspectableId | null,
): PatriotInspectable | null {
  return PATRIOT_INSPECTABLES.find((candidate) => candidate.id === id) ?? null;
}

/**
 * Correspondance nœud GLB → sous-ensemble. Le lanceur principal porte le
 * préfixe PAT_LS1, les lanceurs figés PAT_LS2..4, le tracteur PAT_TR1/PAT_TR2.
 * L'ordre des tests compte : les préfixes les plus spécifiques d'abord.
 */
export function patriotInspectionIdForNodeName(
  nodeName: string,
): PatriotInspectableId | null {
  if (nodeName.startsWith("PAT_LS1_Missile_")) return "interceptor";
  if (
    nodeName.startsWith("PAT_LS1_Canister") ||
    nodeName.startsWith("PAT_LS1_Cover")
  ) {
    return "canisters";
  }
  if (
    nodeName.startsWith("PAT_LS1_Turret") ||
    nodeName.startsWith("PAT_LS1_Launcher") ||
    nodeName.startsWith("PAT_LS1_Actuator") ||
    nodeName.startsWith("PAT_LS1_Mast")
  ) {
    return "launcher";
  }
  if (nodeName.startsWith("PAT_LS1_PowerUnit")) return "power";
  if (nodeName.startsWith("PAT_LS1_ELES")) return "eles";
  if (
    nodeName.startsWith("PAT_LS1_Trailer") ||
    nodeName.startsWith("PAT_LS1_Wheel_") ||
    nodeName.startsWith("PAT_LS1_Outrigger_") ||
    nodeName.startsWith("PAT_LS1_Leg")
  ) {
    return "trailer";
  }
  if (/^PAT_LS[2-9]/.test(nodeName)) return "launchers";
  if (nodeName.startsWith("PAT_TR")) return "tractor";
  if (nodeName.startsWith("PAT_RS")) return "radar";
  if (nodeName.startsWith("PAT_ECS")) return "ecs";
  if (nodeName.startsWith("PAT_EPP")) return "epp";
  if (nodeName.startsWith("PAT_AMG")) return "amg";
  return null;
}
