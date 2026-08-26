"use client";

import { useReducer } from "react";
import {
  THUNDART_INITIAL_STATE,
  thundartSequenceReducer,
} from "@/data/hud/thundart";
import { ThundartControls } from "./ThundartControls";
import { ThundartScene3D } from "./ThundartScene3D";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

export function ThundartExperience() {
  const [sequenceState, dispatch] = useReducer(
    thundartSequenceReducer,
    THUNDART_INITIAL_STATE,
  );
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section
      className="grid min-w-0 gap-3 xl:grid-cols-[minmax(0,1fr)_19rem]"
      data-sequence-state={sequenceState}
      aria-labelledby="thundart-experience-heading"
    >
      <h2 id="thundart-experience-heading" className="sr-only">
        Prototype 3D interactif Thundart
      </h2>
      <ThundartScene3D
        sequenceState={sequenceState}
        reducedMotion={reducedMotion}
      />
      <ThundartControls
        state={sequenceState}
        dispatch={dispatch}
        reducedMotion={reducedMotion}
      />
    </section>
  );
}
