"use client";

import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from "react";
import dynamic from "next/dynamic";
import {
  RAFALE_INITIAL_STATE,
  isScenarioLocked,
  loadoutForScenario,
  rafaleSequenceReducer,
  scenarioFromSearch,
  type RafaleScenario,
  type RafaleSequenceAction,
} from "@/data/hud/rafale";
import {
  RAFALE_INITIAL_INSPECTION_STATE,
  activeRafaleInspectionId,
  isInspectableCarried,
  rafaleInspectableById,
  rafaleInspectionReducer,
  type RafaleInspectableId,
} from "@/data/hud/rafale-inspection";
// Hook générique (aucune logique propre à Thundart) : réutilisé tel quel.
import { usePrefersReducedMotion } from "../thundart/usePrefersReducedMotion";
import { RafaleControls } from "./RafaleControls";
import { RafaleInspectionPanel } from "./RafaleInspectionPanel";
import { useRafaleAutoPlay } from "./useRafaleAutoPlay";

const RafaleScene3D = dynamic(
  () => import("./RafaleScene3D").then((module) => module.RafaleScene3D),
  {
    ssr: false,
    loading: () => (
      <div
        className="relative grid h-[clamp(20rem,82vw,28rem)] min-w-0 place-items-center overflow-hidden border border-line bg-[#11100c] lg:h-[clamp(28rem,62vw,48rem)] xl:h-[min(74vh,48rem)]"
        role="group"
        aria-label="Vue 3D Rafale F4 en préparation"
        aria-describedby="rafale-a11y-description"
        data-rafale-motion="idle"
        data-rafale-asset="loading"
      >
        <p className="max-w-sm border border-line bg-panel/70 px-5 py-4 text-center font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-ink-dim">
          Préparation différée de la vue 3D locale
        </p>
      </div>
    ),
  },
);

/** Scénario demandé par un lien direct (`?scenario=`) : lu côté client seulement. */
function subscribeToLocation() {
  return () => undefined;
}

function readLocationScenario(): RafaleScenario | null {
  return scenarioFromSearch(window.location.search);
}

function readServerScenario(): RafaleScenario | null {
  return null;
}

export function RafaleExperience() {
  const experienceRef = useRef<HTMLElement>(null);
  const [sequenceState, dispatch] = useReducer(rafaleSequenceReducer, RAFALE_INITIAL_STATE);
  const linkedScenario = useSyncExternalStore(
    subscribeToLocation,
    readLocationScenario,
    readServerScenario,
  );
  const [chosenScenario, setChosenScenario] = useState<RafaleScenario | null>(null);
  const scenario: RafaleScenario = chosenScenario ?? linkedScenario ?? "bvr";
  const [inspection, dispatchInspection] = useReducer(
    rafaleInspectionReducer,
    RAFALE_INITIAL_INSPECTION_STATE,
  );
  const reducedMotion = usePrefersReducedMotion();
  const activeInspectionId = activeRafaleInspectionId(inspection);
  const [transitionRunning, setTransitionRunning] = useState(false);

  // Avance d'une étape. Le bouton Suivant et la lecture automatique passent
  // tous deux par cette fonction ; la logique des étapes reste dans le réducteur.
  const nextStep = useCallback(() => dispatch({ type: "NEXT" }), []);
  const restartSequence = useCallback(() => dispatch({ type: "RESET" }), []);
  const autoPlay = useRafaleAutoPlay({
    state: sequenceState,
    reducedMotion,
    transitionRunning,
    nextStep,
    restart: restartSequence,
  });
  const stopAutoPlay = autoPlay.stop;

  const changeScenario = useCallback(
    (next: RafaleScenario) => {
      // Défense en profondeur : le contrôle est déjà désactivé pendant le tir.
      if (isScenarioLocked(sequenceState)) return;
      // Un emport retiré par la nouvelle configuration ne reste pas désigné.
      const inspected = rafaleInspectableById(activeInspectionId);
      if (inspected && !isInspectableCarried(inspected, loadoutForScenario(next))) {
        dispatchInspection({ type: "CLEAR_SELECTION" });
      }
      setChosenScenario(next);
    },
    [activeInspectionId, sequenceState],
  );
  // Toute commande manuelle (Précédent, Suivant, Réinitialiser, liste des
  // états, scénario) reprend la main : la lecture automatique s'arrête avant
  // que l'action ne s'applique.
  const dispatchManually = useCallback(
    (action: RafaleSequenceAction) => {
      stopAutoPlay();
      if (action.type === "NEXT") nextStep();
      else dispatch(action);
    },
    [nextStep, stopAutoPlay],
  );
  const changeScenarioManually = useCallback(
    (next: RafaleScenario) => {
      stopAutoPlay();
      changeScenario(next);
    },
    [changeScenario, stopAutoPlay],
  );
  const previewInspection = useCallback((id: RafaleInspectableId | null) => {
    dispatchInspection({ type: "PREVIEW", id });
  }, []);
  const toggleInspection = useCallback((id: RafaleInspectableId) => {
    dispatchInspection({ type: "TOGGLE", id });
  }, []);
  const togglePanelInspection = useCallback(
    (id: RafaleInspectableId) => {
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
  // Un clic dans la vue 3D laisse le focus sur <body> (le canevas n'est pas
  // focalisable) : Échap doit quand même désépingler. Rien n'est capté quand
  // un autre élément de la page a le focus.
  const hasSelection = inspection.selectedId !== null;
  useEffect(() => {
    if (!hasSelection) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      const focused = document.activeElement;
      if (focused && focused !== document.body) return;
      dispatchInspection({ type: "CLEAR_SELECTION" });
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [hasSelection]);

  return (
    <section
      id="rafale-experience"
      ref={experienceRef}
      className="rafaleExperience min-w-0"
      data-sequence-state={sequenceState}
      data-rafale-inspection={activeInspectionId ?? "none"}
      data-rafale-inspection-selected={inspection.selectedId ?? "none"}
      aria-labelledby="rafale-experience-heading"
      aria-describedby="rafale-a11y-description"
      onKeyDown={handleKeyDown}
    >
      <h2 id="rafale-experience-heading" className="sr-only">
        Planche technique 3D interactive Rafale F4
      </h2>
      <p id="rafale-a11y-description" className="sr-only">
        Représentation illustrative. Aucun ciblage ou calcul opérationnel. Les
        six états de la séquence se parcourent avec les boutons Précédent et
        Suivant ou directement par la liste des états ; Lecture auto les
        enchaîne seule, et toute autre commande l’interrompt. Le scénario se
        choisit avant la séparation. Les sous-ensembles se parcourent avec Tab et
        Shift+Tab, se prévisualisent au focus, s’épinglent avec Entrée ou Espace
        et se désélectionnent avec Échap.
      </p>

      <div className="flex min-w-0 flex-col gap-3 lg:grid lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 lg:col-start-1 lg:row-start-1">
          <RafaleScene3D
            sequenceState={sequenceState}
            scenario={scenario}
            reducedMotion={reducedMotion}
            activeInspectionId={activeInspectionId}
            selectedInspectionId={inspection.selectedId}
            onInspectionPreview={previewInspection}
            onInspectionToggle={toggleInspection}
            onTransitionChange={setTransitionRunning}
          />
        </div>

        <div className="order-3 lg:col-start-1 lg:row-start-2">
          <RafaleControls
            state={sequenceState}
            dispatch={dispatchManually}
            scenario={scenario}
            onScenarioChange={changeScenarioManually}
            reducedMotion={reducedMotion}
            autoPlay={autoPlay}
          />
        </div>

        <RafaleInspectionPanel
          sequenceState={sequenceState}
          scenario={scenario}
          inspection={inspection}
          dispatch={dispatchInspection}
          onToggle={togglePanelInspection}
        />
      </div>
    </section>
  );
}
