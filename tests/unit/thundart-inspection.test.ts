import { describe, expect, it } from "vitest";
import {
  THUNDART_INITIAL_INSPECTION_STATE,
  THUNDART_INSPECTABLES,
  THUNDART_SOURCE_STATUS,
  activeThundartInspectionId,
  isThundartInspectableId,
  thundartInspectionIdForNodeName,
  thundartInspectionReducer,
  type ThundartInspectableId,
} from "@/data/hud/thundart-inspection";

describe("inspection accessible Thundart", () => {
  it("déclare uniquement les cinq sous-ensembles extérieurs autorisés", () => {
    expect(THUNDART_INSPECTABLES.map(({ id, label }) => ({ id, label }))).toEqual([
      { id: "vehicle", label: "VEHICLE" },
      { id: "launcher-base", label: "LAUNCHER BASE" },
      { id: "launcher-rack", label: "LAUNCHER RACK" },
      { id: "canister-group", label: "CANISTER GROUP" },
      {
        id: "demonstration-projectile",
        label: "DEMONSTRATION PROJECTILE",
      },
    ]);
  });

  it("relie les noms réels du GLB à leur sous-ensemble", () => {
    expect(thundartInspectionIdForNodeName("THD_Chassis")).toBe("vehicle");
    expect(thundartInspectionIdForNodeName("THD_Wheel_R4")).toBe("vehicle");
    expect(thundartInspectionIdForNodeName("THD_Launcher_Base")).toBe(
      "launcher-base",
    );
    expect(thundartInspectionIdForNodeName("THD_Launcher_Rack")).toBe(
      "launcher-rack",
    );
    expect(thundartInspectionIdForNodeName("THD_Canister_08")).toBe(
      "canister-group",
    );
    expect(thundartInspectionIdForNodeName("THD_Rocket_Demo")).toBe(
      "demonstration-projectile",
    );
    expect(thundartInspectionIdForNodeName("THD_Root")).toBeNull();
  });

  it("produit le même aperçu pour le survol et le focus", () => {
    const fromPointer = thundartInspectionReducer(
      THUNDART_INITIAL_INSPECTION_STATE,
      { type: "PREVIEW", id: "launcher-rack" },
    );
    const fromFocus = thundartInspectionReducer(
      THUNDART_INITIAL_INSPECTION_STATE,
      { type: "PREVIEW", id: "launcher-rack" },
    );

    expect(fromPointer).toEqual(fromFocus);
    expect(activeThundartInspectionId(fromPointer)).toBe("launcher-rack");
  });

  it("active le même mode d’inspection pour le projectile en aperçu et en sélection", () => {
    const preview = thundartInspectionReducer(
      THUNDART_INITIAL_INSPECTION_STATE,
      { type: "PREVIEW", id: "demonstration-projectile" },
    );
    const selected = thundartInspectionReducer(preview, {
      type: "TOGGLE",
      id: "demonstration-projectile",
    });

    expect(activeThundartInspectionId(preview)).toBe(
      "demonstration-projectile",
    );
    expect(activeThundartInspectionId(selected)).toBe(
      "demonstration-projectile",
    );
  });

  it("n’expose aucun code de handoff dans le statut public", () => {
    expect(THUNDART_SOURCE_STATUS).toMatch(/DOCUMENTATION PUBLIQUE/);
    expect(THUNDART_SOURCE_STATUS).not.toMatch(/THD-|HANDOFF/);
  });

  it("épingle et désépingle une cible sans perdre la logique d’aperçu", () => {
    const preview = thundartInspectionReducer(
      THUNDART_INITIAL_INSPECTION_STATE,
      { type: "PREVIEW", id: "vehicle" },
    );
    const selected = thundartInspectionReducer(preview, {
      type: "TOGGLE",
      id: "vehicle",
    });
    const otherPreview = thundartInspectionReducer(selected, {
      type: "PREVIEW",
      id: "canister-group",
    });

    expect(selected.selectedId).toBe("vehicle");
    expect(activeThundartInspectionId(otherPreview)).toBe("vehicle");
    expect(
      thundartInspectionReducer(otherPreview, { type: "TOGGLE", id: "vehicle" })
        .selectedId,
    ).toBeNull();
  });

  it("Échap désélectionne sans créer d’état invalide", () => {
    const selected = {
      previewId: null,
      selectedId: "launcher-base",
    } as const;
    expect(
      thundartInspectionReducer(selected, { type: "CLEAR_SELECTION" }),
    ).toEqual({ previewId: null, selectedId: null });

    const invalid = "not-a-component" as ThundartInspectableId;
    expect(isThundartInspectableId(invalid)).toBe(false);
    expect(
      thundartInspectionReducer(THUNDART_INITIAL_INSPECTION_STATE, {
        type: "TOGGLE",
        id: invalid,
      }),
    ).toBe(THUNDART_INITIAL_INSPECTION_STATE);
  });
});
