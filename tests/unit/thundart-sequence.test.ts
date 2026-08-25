import { describe, expect, it } from "vitest";
import {
  THUNDART_INITIAL_STATE,
  THUNDART_SEQUENCE_STATES,
  isThundartSequenceState,
  thundartSequenceReducer,
  type ThundartSequenceState,
} from "@/data/hud/thundart";

describe("machine d’état Thundart", () => {
  it("conserve l’ordre éditorial attendu", () => {
    expect(THUNDART_SEQUENCE_STATES).toEqual([
      "overview",
      "inspect",
      "configure",
      "departure",
      "complete",
    ]);
  });

  it("NEXT avance d’un état et reste borné sur complete", () => {
    let state: ThundartSequenceState = THUNDART_INITIAL_STATE;

    for (const expected of THUNDART_SEQUENCE_STATES.slice(1)) {
      state = thundartSequenceReducer(state, { type: "NEXT" });
      expect(state).toBe(expected);
    }

    expect(thundartSequenceReducer(state, { type: "NEXT" })).toBe("complete");
  });

  it("PREVIOUS recule d’un état et reste borné sur overview", () => {
    expect(thundartSequenceReducer("complete", { type: "PREVIOUS" })).toBe(
      "departure",
    );
    expect(thundartSequenceReducer("overview", { type: "PREVIOUS" })).toBe(
      "overview",
    );
  });

  it("RESET revient toujours à overview", () => {
    for (const state of THUNDART_SEQUENCE_STATES) {
      expect(thundartSequenceReducer(state, { type: "RESET" })).toBe(
        THUNDART_INITIAL_STATE,
      );
    }
  });

  it("refuse tout état invalide et revient à un état connu", () => {
    expect(isThundartSequenceState("unknown")).toBe(false);
    expect(isThundartSequenceState(undefined)).toBe(false);
    expect(
      thundartSequenceReducer("unknown" as ThundartSequenceState, {
        type: "NEXT",
      }),
    ).toBe(THUNDART_INITIAL_STATE);
    expect(
      THUNDART_SEQUENCE_STATES.every(isThundartSequenceState),
    ).toBe(true);
  });
});
