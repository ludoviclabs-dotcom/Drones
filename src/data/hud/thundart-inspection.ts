export const THUNDART_INSPECTABLE_IDS = [
  "vehicle",
  "launcher-base",
  "launcher-rack",
  "canister-group",
  "demonstration-projectile",
] as const;

export type ThundartInspectableId =
  (typeof THUNDART_INSPECTABLE_IDS)[number];

export type ThundartInspectable = {
  id: ThundartInspectableId;
  label: string;
  description: string;
};

export const THUNDART_INSPECTABLES: readonly ThundartInspectable[] = [
  {
    id: "vehicle",
    label: "VEHICLE",
    description:
      "Ensemble porteur extérieur regroupant la cabine, le châssis et les essieux visibles.",
  },
  {
    id: "launcher-base",
    label: "LAUNCHER BASE",
    description: "Plateau extérieur reliant le véhicule au rack de démonstration.",
  },
  {
    id: "launcher-rack",
    label: "LAUNCHER RACK",
    description: "Cadre extérieur portant le groupe de conteneurs visible.",
  },
  {
    id: "canister-group",
    label: "CANISTER GROUP",
    description: "Huit conteneurs visibles répartis en deux rangées de quatre.",
  },
  {
    id: "demonstration-projectile",
    label: "DEMONSTRATION PROJECTILE",
    description: "Élément illustratif visible dans le premier conteneur.",
  },
] as const;

// Formulation produit : la provenance reste explicitement illustrative sans
// exposer les identifiants internes des handoffs dans l'interface publique.
export const THUNDART_SOURCE_STATUS =
  "DOCUMENTATION PUBLIQUE · REPRÉSENTATION ILLUSTRATIVE";

export type ThundartInspectionState = {
  previewId: ThundartInspectableId | null;
  selectedId: ThundartInspectableId | null;
};

export type ThundartInspectionAction =
  | { type: "PREVIEW"; id: ThundartInspectableId | null }
  | { type: "TOGGLE"; id: ThundartInspectableId }
  | { type: "CLEAR_SELECTION" };

export const THUNDART_INITIAL_INSPECTION_STATE: ThundartInspectionState = {
  previewId: null,
  selectedId: null,
};

export function isThundartInspectableId(
  value: unknown,
): value is ThundartInspectableId {
  return (
    typeof value === "string" &&
    THUNDART_INSPECTABLE_IDS.some((candidate) => candidate === value)
  );
}

export function thundartInspectionReducer(
  state: ThundartInspectionState,
  action: ThundartInspectionAction,
): ThundartInspectionState {
  switch (action.type) {
    case "PREVIEW":
      return action.id === null || isThundartInspectableId(action.id)
        ? { ...state, previewId: action.id }
        : state;
    case "TOGGLE":
      return isThundartInspectableId(action.id)
        ? {
            ...state,
            selectedId: state.selectedId === action.id ? null : action.id,
          }
        : state;
    case "CLEAR_SELECTION":
      // Échap est une désélection explicite : il efface aussi un aperçu résiduel
      // (par exemple lorsque le pointeur reste au-dessus d'un bouton) pour que
      // le modèle et son repère local reviennent réellement à l'état neutre.
      return state.selectedId === null && state.previewId === null
        ? state
        : THUNDART_INITIAL_INSPECTION_STATE;
  }
}

export function activeThundartInspectionId(
  state: ThundartInspectionState,
): ThundartInspectableId | null {
  return state.selectedId ?? state.previewId;
}

export function thundartInspectableById(
  id: ThundartInspectableId | null,
): ThundartInspectable | null {
  return THUNDART_INSPECTABLES.find((candidate) => candidate.id === id) ?? null;
}

export function thundartInspectionIdForNodeName(
  nodeName: string,
): ThundartInspectableId | null {
  if (nodeName.startsWith("THD_Rocket_Demo")) {
    return "demonstration-projectile";
  }
  if (nodeName.startsWith("THD_Canister_")) return "canister-group";
  if (nodeName.startsWith("THD_Launcher_Rack")) return "launcher-rack";
  if (nodeName.startsWith("THD_Launcher_Base")) return "launcher-base";
  if (
    nodeName.startsWith("THD_Vehicle") ||
    nodeName.startsWith("THD_Axles") ||
    nodeName.startsWith("THD_Wheel_") ||
    nodeName.startsWith("THD_Cab") ||
    nodeName.startsWith("THD_Chassis")
  ) {
    return "vehicle";
  }
  return null;
}
