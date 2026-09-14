"use client";

import { useCallback, useReducer, useRef, useState, type KeyboardEvent } from "react";
import dynamic from "next/dynamic";
import {
  PATRIOT_INITIAL_STATE,
  isFireModeLocked,
  patriotSequenceReducer,
  type PatriotFireMode,
} from "@/data/hud/patriot";
import {
  PATRIOT_INITIAL_INSPECTION_STATE,
  activePatriotInspectionId,
  patriotInspectionReducer,
  type PatriotInspectableId,
} from "@/data/hud/patriot-inspection";
// Hook générique (aucune logique propre à Thundart) : réutilisé tel quel.
import { usePrefersReducedMotion } from "../thundart/usePrefersReducedMotion";
import { PatriotControls } from "./PatriotControls";
import { PatriotInspectionPanel } from "./PatriotInspectionPanel";

const PatriotScene3D = dynamic(
  () => import("./PatriotScene3D").then((module) => module.PatriotScene3D),
  {
    ssr: false,
    loading: () => (
      <div
        className="relative grid h-[clamp(20rem,82vw,28rem)] min-w-0 place-items-center overflow-hidden border border-line bg-[#11100c] lg:h-[clamp(28rem,62vw,48rem)] xl:h-[min(74vh,48rem)]"
        role="group"
        aria-label="Vue 3D Patriot PAC-3 MSE en préparation"
        aria-describedby="patriot-a11y-description"
        data-patriot-motion="idle"
        data-patriot-asset="loading"
      >
        <p className="max-w-sm border border-line bg-panel/70 px-5 py-4 text-center font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-ink-dim">
          Préparation différée de la vue 3D locale
        </p>
      </div>
    ),
  },
);

export function PatriotExperience() {
  const experienceRef = useRef<HTMLElement>(null);
  const [sequenceState, dispatch] = useReducer(patriotSequenceReducer, PATRIOT_INITIAL_STATE);
  const [fireMode, setFireMode] = useState<PatriotFireMode>("single");
  const [inspection, dispatchInspection] = useReducer(
    patriotInspectionReducer,
    PATRIOT_INITIAL_INSPECTION_STATE,
  );
  const reducedMotion = usePrefersReducedMotion();
  const activeInspectionId = activePatriotInspectionId(inspection);

  const changeFireMode = useCallback(
    (mode: PatriotFireMode) => {
      // Défense en profondeur : le contrôle est déjà désactivé pendant le tir.
      if (isFireModeLocked(sequenceState)) return;
      setFireMode(mode);
    },
    [sequenceState],
  );
  const previewInspection = useCallback((id: PatriotInspectableId | null) => {
    dispatchInspection({ type: "PREVIEW", id });
  }, []);
  const toggleInspection = useCallback((id: PatriotInspectableId) => {
    dispatchInspection({ type: "TOGGLE", id });
  }, []);
  const togglePanelInspection = useCallback(
    (id: PatriotInspectableId) => {
      // Sous 1024 px, recaler la planche garde la vue et le bouton visibles.
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
      id="patriot-experience"
      ref={experienceRef}
      className="patriotExperience min-w-0"
      data-sequence-state={sequenceState}
      data-patriot-inspection={activeInspectionId ?? "none"}
      data-patriot-inspection-selected={inspection.selectedId ?? "none"}
      aria-labelledby="patriot-experience-heading"
      aria-describedby="patriot-a11y-description"
      onKeyDown={handleKeyDown}
    >
      <h2 id="patriot-experience-heading" className="sr-only">
        Planche technique 3D interactive Patriot PAC-3 MSE
      </h2>
      <p id="patriot-a11y-description" className="sr-only">
        Représentation illustrative. Aucun ciblage ou calcul opérationnel. Les
        sept états de la séquence se parcourent avec les boutons Précédent et
        Suivant ou directement par la liste des états. Les sous-ensembles se
        parcourent avec Tab et Shift+Tab, se prévisualisent au focus, s’épinglent
        avec Entrée ou Espace et se désélectionnent avec Échap.
      </p>

      <div className="flex min-w-0 flex-col gap-3 lg:grid lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 lg:col-start-1 lg:row-start-1">
          <PatriotScene3D
            sequenceState={sequenceState}
            fireMode={fireMode}
            reducedMotion={reducedMotion}
            activeInspectionId={activeInspectionId}
            selectedInspectionId={inspection.selectedId}
            onInspectionPreview={previewInspection}
            onInspectionToggle={toggleInspection}
          />
        </div>

        <div className="order-3 lg:col-start-1 lg:row-start-2">
          <PatriotControls
            state={sequenceState}
            dispatch={dispatch}
            fireMode={fireMode}
            onFireModeChange={changeFireMode}
            reducedMotion={reducedMotion}
          />
        </div>

        <PatriotInspectionPanel
          sequenceState={sequenceState}
          fireMode={fireMode}
          inspection={inspection}
          dispatch={dispatchInspection}
          onToggle={togglePanelInspection}
        />
      </div>
    </section>
  );
}
