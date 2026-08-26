export const THUNDART_ASSET_PATH = "/models/hud/thundart.glb";

export const THUNDART_SEQUENCE_STATES = [
  "overview",
  "inspect",
  "configure",
  "departure",
  "complete",
] as const;

export type ThundartSequenceState =
  (typeof THUNDART_SEQUENCE_STATES)[number];

export type ThundartSequenceAction =
  | { type: "NEXT" }
  | { type: "PREVIOUS" }
  | { type: "RESET" };

export const THUNDART_INITIAL_STATE: ThundartSequenceState = "overview";

export const THUNDART_SEQUENCE_COPY: Record<
  ThundartSequenceState,
  { label: string; shortLabel: string; description: string }
> = {
  overview: {
    label: "Vue d’ensemble",
    shortLabel: "Vue",
    description: "Lecture générale de la silhouette et de son implantation.",
  },
  inspect: {
    label: "Inspection extérieure",
    shortLabel: "Inspection",
    description:
      "Cadrage rapproché des sous-ensembles extérieurs visibles. Observation libre.",
  },
  configure: {
    label: "Configuration illustrative",
    shortLabel: "Config.",
    description:
      "Lecture visuelle d’une seconde configuration de présentation du rack.",
  },
  departure: {
    label: "Séparation illustrative",
    shortLabel: "Séparation",
    description:
      "Écartement graphique du projectile de démonstration, sans physique ni trajectoire.",
  },
  complete: {
    label: "Planche terminée",
    shortLabel: "Fin",
    description: "Arrêt sur image. Dernier état déterministe du parcours.",
  },
};

export const THUNDART_ASSET_MANIFEST = {
  nodeCount: 24,
  meshNodeCount: 21,
  rootNode: "THD_Root",
  animationClips: ["THD_CONFIGURE_DEMO", "THD_DEPARTURE_DEMO"],
} as const;

export function isThundartSequenceState(
  value: unknown,
): value is ThundartSequenceState {
  return (
    typeof value === "string" &&
    THUNDART_SEQUENCE_STATES.some((state) => state === value)
  );
}

export function thundartSequenceReducer(
  state: ThundartSequenceState,
  action: ThundartSequenceAction,
): ThundartSequenceState {
  if (!isThundartSequenceState(state)) {
    return THUNDART_INITIAL_STATE;
  }

  const index = THUNDART_SEQUENCE_STATES.indexOf(state);

  switch (action.type) {
    case "NEXT":
      return THUNDART_SEQUENCE_STATES[
        Math.min(index + 1, THUNDART_SEQUENCE_STATES.length - 1)
      ];
    case "PREVIOUS":
      return THUNDART_SEQUENCE_STATES[Math.max(index - 1, 0)];
    case "RESET":
      return THUNDART_INITIAL_STATE;
  }
}
