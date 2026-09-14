/**
 * Planche Patriot PAC-3 MSE — modèle de séquence, pur et testable.
 *
 * Sept états pilotent la planche. Les trois derniers mettent en scène une
 * mise à feu et un départ ILLUSTRATIFS : aucune cible, aucune trajectoire
 * calculée, aucune balistique, aucune procédure. La chronologie visuelle est
 * un choix de lecture, calé sur rien de réel.
 */

export const PATRIOT_ASSET_PATH = "/models/hud/patriot-pac3-mse.glb";

export const PATRIOT_SEQUENCE_STATES = [
  "overview",
  "inspect",
  "emplace",
  "elevate",
  "fire",
  "launch",
  "complete",
] as const;

export type PatriotSequenceState = (typeof PATRIOT_SEQUENCE_STATES)[number];

export type PatriotSequenceAction =
  | { type: "NEXT" }
  | { type: "PREVIOUS" }
  | { type: "RESET" }
  | { type: "GOTO"; state: PatriotSequenceState };

export const PATRIOT_INITIAL_STATE: PatriotSequenceState = "overview";

export const PATRIOT_SEQUENCE_COPY: Record<
  PatriotSequenceState,
  { label: string; shortLabel: string; description: string }
> = {
  overview: {
    label: "Vue d’ensemble de la batterie",
    shortLabel: "Batterie",
    description:
      "Radar, poste de conduite de tir, centrale électrique, mât d’antennes et lanceurs, en disposition illustrative compressée. Le lanceur n° 1 arrive attelé à son tracteur.",
  },
  inspect: {
    label: "Inspection du lanceur M903",
    shortLabel: "Inspection",
    description:
      "Cadrage rapproché de la station de lancement : semi-remorque, tourelle, douze conteneurs PAC-3 MSE, groupe électrogène. Observation libre.",
  },
  emplace: {
    label: "Mise en batterie",
    shortLabel: "Mise en batt.",
    description:
      "Béquilles, dételage et départ du tracteur, déploiement des quatre stabilisateurs, sortie du mât de liaison. Lecture visuelle, sans valeur de procédure.",
  },
  elevate: {
    label: "Orientation et élévation",
    shortLabel: "Élévation",
    description:
      "La tourelle s’oriente et le lanceur monte au site fixe publié. L’équipe a quitté le site : le tir se commande à distance.",
  },
  fire: {
    label: "Mise à feu",
    shortLabel: "Mise à feu",
    description:
      "Arrêt sur image à l’allumage : jet par l’arrière du conteneur, rupture de l’opercule avant, l’intercepteur sort du tube.",
  },
  launch: {
    label: "Départ illustratif",
    shortLabel: "Départ",
    description:
      "L’intercepteur quitte le lanceur, gouvernes dépliées, dans l’axe du tube. Aucune trajectoire n’est calculée ni représentée au-delà de ce départ.",
  },
  complete: {
    label: "Planche terminée",
    shortLabel: "Fin",
    description:
      "Arrêt sur image final : lanceur au site de tir, conteneur vide, panache figé.",
  },
};

/** Mode d'illustration du tir : un intercepteur, ou deux en « ripple ». */
export const PATRIOT_FIRE_MODES = ["single", "ripple"] as const;
export type PatriotFireMode = (typeof PATRIOT_FIRE_MODES)[number];

export const PATRIOT_FIRE_MODE_COPY: Record<
  PatriotFireMode,
  { label: string; description: string }
> = {
  single: {
    label: "Tir unitaire",
    description: "Un intercepteur, conteneur 04.",
  },
  ripple: {
    // Espaces insécables : le guillemet fermant ne part jamais seul à la ligne.
    label: "Salve « ripple »",
    description:
      "Deux intercepteurs à quelques secondes d’intervalle (conteneurs 04 puis 03). Mode d’engagement publiquement documenté ; l’intervalle affiché est un choix de lecture.",
  },
};

/** Le mode se choisit avant la mise à feu ; il est verrouillé ensuite. */
export function isFireModeLocked(state: PatriotSequenceState): boolean {
  return state === "fire" || state === "launch" || state === "complete";
}

export const PATRIOT_ASSET_MANIFEST = {
  rootNode: "PAT_Root",
  heroStation: "PAT_LS1",
  heroTractor: "PAT_TR1",
  launcherNode: "PAT_LS1_Launcher",
  turretNode: "PAT_LS1_Turret",
  missileNodes: { A: "PAT_LS1_Missile_A", B: "PAT_LS1_Missile_B" },
  liveCanisters: { A: "PAT_LS1_Canister_04", B: "PAT_LS1_Canister_03" },
  coverNodes: {
    A: { front: "PAT_LS1_CoverFront_04", rear: "PAT_LS1_CoverRear_04" },
    B: { front: "PAT_LS1_CoverFront_03", rear: "PAT_LS1_CoverRear_03" },
  },
  animationClips: {
    emplace: "PAT_EMPLACE",
    elevate: "PAT_ELEVATE",
    finsA: "PAT_FINS_A",
    finsB: "PAT_FINS_B",
  },
  /** Longueur du conteneur (m) le long de son axe local. */
  canisterLength: 6.1,
  /** Recul du culot dans le conteneur (m). */
  missileTailOffset: 0.3,
  /** Longueur de l'intercepteur (m, gabarit public approché). */
  missileLength: 5.2,
  /** Site fixe de tir publié (°), confiance moyenne. */
  elevationDeg: 38,
} as const;

export function isPatriotSequenceState(
  value: unknown,
): value is PatriotSequenceState {
  return (
    typeof value === "string" &&
    PATRIOT_SEQUENCE_STATES.some((state) => state === value)
  );
}

export function patriotSequenceReducer(
  state: PatriotSequenceState,
  action: PatriotSequenceAction,
): PatriotSequenceState {
  if (!isPatriotSequenceState(state)) return PATRIOT_INITIAL_STATE;
  const index = PATRIOT_SEQUENCE_STATES.indexOf(state);

  switch (action.type) {
    case "NEXT":
      return PATRIOT_SEQUENCE_STATES[
        Math.min(index + 1, PATRIOT_SEQUENCE_STATES.length - 1)
      ];
    case "PREVIOUS":
      return PATRIOT_SEQUENCE_STATES[Math.max(index - 1, 0)];
    case "RESET":
      return PATRIOT_INITIAL_STATE;
    case "GOTO":
      return isPatriotSequenceState(action.state) ? action.state : state;
  }
}

export function patriotStateIndex(state: PatriotSequenceState): number {
  return PATRIOT_SEQUENCE_STATES.indexOf(state);
}
