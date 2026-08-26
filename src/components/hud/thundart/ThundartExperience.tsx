"use client";

import { useCallback, useReducer, type KeyboardEvent } from "react";
import dynamic from "next/dynamic";
import {
  THUNDART_INITIAL_STATE,
  thundartSequenceReducer,
} from "@/data/hud/thundart";
import {
  THUNDART_INITIAL_INSPECTION_STATE,
  activeThundartInspectionId,
  thundartInspectionReducer,
  type ThundartInspectableId,
} from "@/data/hud/thundart-inspection";
import { ThundartControls } from "./ThundartControls";
import { ThundartInspectionPanel } from "./ThundartInspectionPanel";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

const ThundartScene3D = dynamic(
  () =>
    import("./ThundartScene3D").then((module) => module.ThundartScene3D),
  {
    ssr: false,
    loading: () => (
      <div
        className="relative grid h-[clamp(26rem,62vw,46rem)] min-w-0 place-items-center overflow-hidden border border-line bg-[#11100c] xl:h-[min(72vh,46rem)]"
        role="group"
        aria-label="Vue 3D Thundart en préparation"
        aria-describedby="thundart-a11y-description"
        data-thundart-motion="idle"
        data-thundart-asset="loading"
      >
        <p className="max-w-sm border border-line bg-panel/70 px-5 py-4 text-center font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-ink-dim">
          Préparation différée de la vue 3D locale
        </p>
      </div>
    ),
  },
);

export function ThundartExperience() {
  const [sequenceState, dispatch] = useReducer(
    thundartSequenceReducer,
    THUNDART_INITIAL_STATE,
  );
  const [inspection, dispatchInspection] = useReducer(
    thundartInspectionReducer,
    THUNDART_INITIAL_INSPECTION_STATE,
  );
  const reducedMotion = usePrefersReducedMotion();
  const activeInspectionId = activeThundartInspectionId(inspection);

  const previewInspection = useCallback((id: ThundartInspectableId | null) => {
    dispatchInspection({ type: "PREVIEW", id });
  }, []);
  const toggleInspection = useCallback((id: ThundartInspectableId) => {
    dispatchInspection({ type: "TOGGLE", id });
  }, []);
  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Escape") return;
    dispatchInspection({ type: "CLEAR_SELECTION" });
  }, []);

  return (
    <section
      className="thundartExperience grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1fr)_18rem] xl:grid-cols-[minmax(0,1fr)_19rem]"
      data-sequence-state={sequenceState}
      data-thundart-inspection={activeInspectionId ?? "none"}
      data-thundart-inspection-selected={inspection.selectedId ?? "none"}
      aria-labelledby="thundart-experience-heading"
      aria-describedby="thundart-a11y-description"
      onKeyDown={handleKeyDown}
    >
      <h2 id="thundart-experience-heading" className="sr-only">
        Planche technique 3D interactive Thundart
      </h2>
      <p id="thundart-a11y-description" className="sr-only">
        Représentation illustrative. Aucun ciblage ou calcul opérationnel. Les
        composants visibles peuvent être parcourus avec Tab et Shift+Tab,
        prévisualisés au focus, épinglés avec Entrée ou Espace et désélectionnés
        avec Échap.
      </p>

      <div className="grid min-w-0 content-start gap-3">
        <ThundartScene3D
          sequenceState={sequenceState}
          reducedMotion={reducedMotion}
          activeInspectionId={activeInspectionId}
          selectedInspectionId={inspection.selectedId}
          onInspectionPreview={previewInspection}
          onInspectionToggle={toggleInspection}
        />
        <ThundartControls
          state={sequenceState}
          dispatch={dispatch}
          reducedMotion={reducedMotion}
        />
      </div>

      <ThundartInspectionPanel
        sequenceState={sequenceState}
        inspection={inspection}
        dispatch={dispatchInspection}
      />
    </section>
  );
}
