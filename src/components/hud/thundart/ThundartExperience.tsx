"use client";

import { useCallback, useReducer, useRef, type KeyboardEvent } from "react";
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
        className="relative grid h-[clamp(19rem,80vw,26rem)] min-w-0 place-items-center overflow-hidden border border-line bg-[#11100c] lg:h-[clamp(26rem,62vw,46rem)] xl:h-[min(72vh,46rem)]"
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
  const experienceRef = useRef<HTMLElement>(null);
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
  const togglePanelInspection = useCallback(
    (id: ThundartInspectableId) => {
      // Sous 1024 px, les boutons suivent la vue dans le flux normal. Recaler
      // la planche à son ancre conserve à la fois le modèle et le composant
      // actif dans le viewport, sans rendre le canvas flottant.
      if (window.matchMedia("(max-width: 1023px)").matches) {
        experienceRef.current?.scrollIntoView({ block: "start" });
      }
      toggleInspection(id);
    },
    [toggleInspection],
  );
  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Escape") return;
    dispatchInspection({ type: "CLEAR_SELECTION" });
  }, []);

  return (
    <section
      id="thundart-experience"
      ref={experienceRef}
      className="thundartExperience min-w-0"
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

      <div className="flex min-w-0 flex-col gap-3 lg:grid lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start xl:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="min-w-0 lg:col-start-1 lg:row-start-1">
          <ThundartScene3D
            sequenceState={sequenceState}
            reducedMotion={reducedMotion}
            activeInspectionId={activeInspectionId}
            selectedInspectionId={inspection.selectedId}
            onInspectionPreview={previewInspection}
            onInspectionToggle={toggleInspection}
          />
        </div>

        <div className="order-3 lg:col-start-1 lg:row-start-2">
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
          onToggle={togglePanelInspection}
        />
      </div>
    </section>
  );
}
