import { describe, expect, it } from "vitest";
import {
  PATRIOT_ASSET_MANIFEST,
  PATRIOT_FIRE_MODES,
  PATRIOT_INITIAL_STATE,
  PATRIOT_SEQUENCE_COPY,
  PATRIOT_SEQUENCE_STATES,
  isFireModeLocked,
  isPatriotSequenceState,
  patriotSequenceReducer,
  type PatriotSequenceState,
} from "@/data/hud/patriot";

describe("séquence de la planche Patriot", () => {
  it("suit l’ordre du récit, de la batterie à l’arrêt sur image final", () => {
    expect(PATRIOT_SEQUENCE_STATES).toEqual([
      "overview",
      "inspect",
      "emplace",
      "elevate",
      "fire",
      "launch",
      "complete",
    ]);
    expect(PATRIOT_INITIAL_STATE).toBe("overview");
  });

  it("avance, recule et se réinitialise dans les bornes", () => {
    let state: PatriotSequenceState = PATRIOT_INITIAL_STATE;
    for (const expected of PATRIOT_SEQUENCE_STATES.slice(1)) {
      state = patriotSequenceReducer(state, { type: "NEXT" });
      expect(state).toBe(expected);
    }
    expect(patriotSequenceReducer(state, { type: "NEXT" })).toBe("complete");
    expect(patriotSequenceReducer("overview", { type: "PREVIOUS" })).toBe("overview");
    expect(patriotSequenceReducer("fire", { type: "PREVIOUS" })).toBe("elevate");
    expect(patriotSequenceReducer("launch", { type: "RESET" })).toBe("overview");
  });

  it("accepte un accès direct à un état connu, et rien d’autre", () => {
    expect(patriotSequenceReducer("overview", { type: "GOTO", state: "fire" })).toBe("fire");
    expect(
      patriotSequenceReducer("inspect", {
        type: "GOTO",
        state: "armed" as unknown as PatriotSequenceState,
      }),
    ).toBe("inspect");
  });

  it("revient à l’état initial si l’état courant est invalide", () => {
    expect(
      patriotSequenceReducer("bogus" as unknown as PatriotSequenceState, { type: "NEXT" }),
    ).toBe("overview");
    expect(isPatriotSequenceState("launch")).toBe(true);
    expect(isPatriotSequenceState("target")).toBe(false);
  });

  it("verrouille le mode de tir pendant et après la mise à feu", () => {
    const locked = PATRIOT_SEQUENCE_STATES.filter(isFireModeLocked);
    expect(locked).toEqual(["fire", "launch", "complete"]);
    expect(PATRIOT_FIRE_MODES).toEqual(["single", "ripple"]);
  });

  it("décrit chaque état sans vocabulaire de ciblage", () => {
    for (const state of PATRIOT_SEQUENCE_STATES) {
      const copy = PATRIOT_SEQUENCE_COPY[state];
      expect(copy.label.length).toBeGreaterThan(3);
      expect(copy.description.length).toBeGreaterThan(20);
      expect(`${copy.label} ${copy.description}`).not.toMatch(/\bcible[rs]?\b|guidage terminal|portée/i);
    }
  });

  it("déclare le contrat de nœuds et de clips attendu du GLB", () => {
    expect(PATRIOT_ASSET_MANIFEST.animationClips).toEqual({
      emplace: "PAT_EMPLACE",
      elevate: "PAT_ELEVATE",
      finsA: "PAT_FINS_A",
      finsB: "PAT_FINS_B",
    });
    expect(PATRIOT_ASSET_MANIFEST.liveCanisters).toEqual({
      A: "PAT_LS1_Canister_04",
      B: "PAT_LS1_Canister_03",
    });
  });
});
