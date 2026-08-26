"use client";

import { useCallback, useReducer, type KeyboardEvent } from "react";
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
import { ThundartScene3D } from "./ThundartScene3D";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

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
