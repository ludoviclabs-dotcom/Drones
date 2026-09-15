import { describe, expect, it } from "vitest";
import { RAFALE_SEQUENCE_STATES } from "@/data/hud/rafale";
import {
  REDUCED_MOTION_DURATION_FACTOR,
  STEP_DURATIONS_MS,
  autoPlayStepDurationMs,
  isFinalRafaleStep,
  rafaleStepNumber,
} from "@/data/hud/rafale-autoplay";

describe("lecture automatique de la planche Rafale", () => {
  it("numérote les étapes comme la barre 01 → 06, une durée par étape", () => {
    RAFALE_SEQUENCE_STATES.forEach((state, index) => {
      expect(rafaleStepNumber(state)).toBe(index + 1);
    });
    // Autant d'entrées que d'étapes, ni plus ni moins : un état ajouté au récit
    // sans durée ferait échouer ce test plutôt que la lecture.
    expect(Object.keys(STEP_DURATIONS_MS).map(Number)).toEqual(
      RAFALE_SEQUENCE_STATES.map((_, index) => index + 1),
    );
    for (const duration of Object.values(STEP_DURATIONS_MS)) {
      expect(Number.isInteger(duration)).toBe(true);
      expect(duration).toBeGreaterThan(0);
    }
  });

  it("décompte chaque étape selon STEP_DURATIONS_MS, doublé en mouvement réduit", () => {
    expect(REDUCED_MOTION_DURATION_FACTOR).toBe(2);
    for (const state of RAFALE_SEQUENCE_STATES) {
      const duration = STEP_DURATIONS_MS[rafaleStepNumber(state)];
      expect(autoPlayStepDurationMs(state, false)).toBe(duration);
      expect(autoPlayStepDurationMs(state, true)).toBe(duration * 2);
    }
  });

  it("s'arrête sur Fin, la seule étape finale", () => {
    expect(RAFALE_SEQUENCE_STATES.filter(isFinalRafaleStep)).toEqual(["complete"]);
  });
});
