"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import {
  RAFALE_INITIAL_STATE,
  RAFALE_SCENARIOS,
  RAFALE_SCENARIO_COPY,
  RAFALE_SEQUENCE_COPY,
  RAFALE_SEQUENCE_STATES,
  isScenarioLocked,
  rafaleStateIndex,
  type RafaleScenario,
  type RafaleSequenceAction,
  type RafaleSequenceState,
} from "@/data/hud/rafale";
import type { RafaleAutoPlay } from "./useRafaleAutoPlay";

export function RafaleControls({
  state,
  dispatch,
  scenario,
  onScenarioChange,
  reducedMotion,
  autoPlay,
}: {
  state: RafaleSequenceState;
  dispatch: (action: RafaleSequenceAction) => void;
  scenario: RafaleScenario;
  onScenarioChange: (scenario: RafaleScenario) => void;
  reducedMotion: boolean;
  autoPlay: Pick<RafaleAutoPlay, "playing" | "countdownMs" | "toggle">;
}) {
  const stateIndex = rafaleStateIndex(state);
  const isFirst = state === RAFALE_INITIAL_STATE;
  const isLast = stateIndex === RAFALE_SEQUENCE_STATES.length - 1;
  const copy = RAFALE_SEQUENCE_COPY[state];
  const scenarioLocked = isScenarioLocked(state);
  const previousRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const autoPlayRef = useRef<HTMLButtonElement>(null);
  // La lecture automatique peut atteindre Fin pendant que Suivant a le focus :
  // le navigateur l'en prive dès qu'il est désactivé, et le focus passe alors
  // au bouton de lecture au lieu de retomber sur <body>. Écouteur natif : ce
  // blur survient pendant le commit de React, qui n'émet alors aucun onBlur.
  useEffect(() => {
    const next = nextRef.current;
    if (!next) return;
    const handOver = () => {
      if (next.disabled) autoPlayRef.current?.focus();
    };
    next.addEventListener("blur", handOver);
    return () => next.removeEventListener("blur", handOver);
  }, []);
  // Atteindre une extrémité désactive le bouton qui a le focus : il passe à
  // l'autre bouton au lieu de retomber sur <body>.
  const step = (
    event: MouseEvent<HTMLButtonElement>,
    type: "PREVIOUS" | "NEXT",
    reachesEnd: boolean,
  ) => {
    if (reachesEnd && document.activeElement === event.currentTarget) {
      (type === "NEXT" ? previousRef : nextRef).current?.focus();
    }
    dispatch({ type });
  };

  return (
    <section
      className="flex min-w-0 flex-col border border-line bg-panel"
      aria-labelledby="rafale-sequence-heading"
    >
      <div className="grid gap-3 border-b border-line px-4 py-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] xl:items-start">
        <div className="min-w-0">
          <h3
            id="rafale-sequence-heading"
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint"
          >
            Séquence illustrative · capteurs, séparation, départ
          </h3>
          <p
            className="mt-2 font-serif text-xl leading-tight text-ink"
            data-rafale-state={state}
            aria-live="polite"
          >
            {copy.label}
          </p>
          <p className="mt-2 min-h-11 font-mono text-[10px] leading-relaxed text-ink-dim">
            {copy.description}
          </p>
          {reducedMotion ? (
            <p className="mt-2 border-l border-stamp pl-2 font-mono text-[10px] uppercase leading-relaxed tracking-[0.1em] text-stamp">
              Mouvement réduit actif · poses appliquées sans transition
            </p>
          ) : null}
        </div>

        <fieldset className="min-w-0 border border-line px-3 pb-3 pt-1">
          <legend className="px-1 font-mono text-[9px] uppercase tracking-[0.16em] text-ink-faint">
            Scénario illustré
          </legend>
          <div className="mt-1 grid gap-px bg-line sm:grid-cols-3">
            {RAFALE_SCENARIOS.map((option) => {
              const checked = option === scenario;
              return (
                <label
                  key={option}
                  className={`relative flex min-h-11 cursor-pointer items-center justify-center px-2 py-1.5 text-center font-mono text-[10px] uppercase leading-snug tracking-[0.06em] motion-safe:transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-[-2px] has-[:focus-visible]:outline-accent ${
                    checked
                      ? "bg-surface-2 text-ink shadow-[inset_0_-2px_0_var(--color-accent)]"
                      : "bg-panel text-ink-dim hover:bg-surface hover:text-ink"
                  } ${scenarioLocked ? "cursor-not-allowed" : ""} ${scenarioLocked && !checked ? "opacity-45" : ""}`}
                >
                  <input
                    type="radio"
                    name="rafale-scenario"
                    value={option}
                    checked={checked}
                    disabled={scenarioLocked}
                    className="sr-only"
                    data-rafale-scenario-option={option}
                    onChange={() => onScenarioChange(option)}
                  />
                  {RAFALE_SCENARIO_COPY[option].label}
                </label>
              );
            })}
          </div>
          <p className="mt-2 font-mono text-[9px] leading-relaxed text-ink-faint">
            {scenarioLocked
              ? "Scénario verrouillé pendant la séquence de tir · réinitialiser pour changer."
              : RAFALE_SCENARIO_COPY[scenario].description}
          </p>
        </fieldset>
      </div>

      <ol
        className="grid grid-cols-2 gap-px bg-line sm:grid-cols-3 lg:grid-cols-6"
        aria-label="États de la séquence"
      >
        {RAFALE_SEQUENCE_STATES.map((item, index) => {
          const active = item === state;
          const passed = index < stateIndex;
          return (
            <li key={item} className="relative min-w-0 bg-panel">
              <button
                type="button"
                className={`flex min-h-12 w-full min-w-0 items-center gap-2 border-l-2 px-3 py-2.5 text-left motion-safe:transition-colors hover:bg-surface ${
                  active ? "border-accent bg-surface-2" : "border-transparent"
                }`}
                aria-current={active ? "step" : undefined}
                aria-label={`${String(index + 1).padStart(2, "0")} · ${RAFALE_SEQUENCE_COPY[item].shortLabel} — ${RAFALE_SEQUENCE_COPY[item].label}`}
                data-rafale-step={item}
                onClick={() => dispatch({ type: "GOTO", state: item })}
              >
                <span
                  className={`grid h-5 w-5 shrink-0 place-items-center border font-mono text-[8px] ${
                    active
                      ? "border-accent text-accent"
                      : passed
                        ? "border-stamp text-stamp"
                        : "border-line-bright text-ink-faint"
                  }`}
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className={`truncate font-mono text-[10px] uppercase tracking-[0.08em] ${
                    active ? "text-ink" : "text-ink-faint"
                  }`}
                  aria-hidden="true"
                >
                  {RAFALE_SEQUENCE_COPY[item].shortLabel}
                </span>
              </button>
              {active && autoPlay.playing ? (
                // Clé : une nouvelle durée (mouvement réduit basculé) relance la barre.
                <AutoPlayProgress key={autoPlay.countdownMs ?? "hold"} durationMs={autoPlay.countdownMs} />
              ) : null}
            </li>
          );
        })}
      </ol>

      {/* Sous 640 px, quatre boutons ne tiennent pas sur une ligne : la lecture
          automatique passe dessous, sur toute la largeur. */}
      <div className="grid grid-cols-3 gap-px border-t border-line bg-line sm:grid-cols-4">
        <button
          type="button"
          className="min-h-12 bg-panel px-2 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-dim motion-safe:transition-colors hover:bg-surface-2 hover:text-ink disabled:cursor-not-allowed disabled:text-ink-faint disabled:opacity-45"
          ref={previousRef}
          onClick={(event) => step(event, "PREVIOUS", stateIndex === 1)}
          disabled={isFirst}
        >
          Précédent
        </button>
        <button
          type="button"
          className="min-h-12 bg-panel px-2 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-dim motion-safe:transition-colors hover:bg-surface-2 hover:text-ink"
          onClick={() => dispatch({ type: "RESET" })}
        >
          Réinitialiser
        </button>
        <button
          type="button"
          className="min-h-12 bg-accent-deep px-2 font-mono text-[10px] uppercase tracking-[0.1em] text-[#fff8e8] motion-safe:transition-colors hover:bg-[#8f4319] disabled:cursor-not-allowed disabled:bg-panel disabled:text-ink-faint disabled:opacity-45"
          ref={nextRef}
          onClick={(event) => step(event, "NEXT", stateIndex === RAFALE_SEQUENCE_STATES.length - 2)}
          disabled={isLast}
        >
          Suivant
        </button>
        <button
          type="button"
          className={`col-span-3 flex min-h-12 items-center justify-center gap-2 px-2 font-mono text-[10px] uppercase tracking-[0.1em] motion-safe:transition-colors sm:col-span-1 ${
            autoPlay.playing
              ? "bg-surface-2 text-ink shadow-[inset_0_-2px_0_var(--color-accent)] hover:bg-surface"
              : "bg-panel text-ink-dim hover:bg-surface-2 hover:text-ink"
          }`}
          ref={autoPlayRef}
          data-rafale-autoplay={autoPlay.playing ? "playing" : "idle"}
          onClick={autoPlay.toggle}
        >
          <AutoPlayIcon playing={autoPlay.playing} />
          {autoPlay.playing ? "Pause" : "Lecture auto"}
        </button>
      </div>
    </section>
  );
}

function AutoPlayIcon({ playing }: { playing: boolean }) {
  return (
    <svg
      viewBox="0 0 10 10"
      className="h-2.5 w-2.5 shrink-0 fill-current"
      aria-hidden="true"
      focusable="false"
    >
      {playing ? <path d="M2 1h2.2v8H2zM5.8 1H8v8H5.8z" /> : <path d="M2.5 1 9 5 2.5 9z" />}
    </svg>
  );
}

/**
 * Décompte de l'étape active pendant la lecture automatique : un filet qui se
 * remplit en `durationMs`, la durée même du minuteur. Il reste vide (`null`)
 * tant que la vue 3D se charge ou se recompose : le décompte l'attend.
 */
function AutoPlayProgress({ durationMs }: { durationMs: number | null }) {
  return (
    <span
      className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-line-bright"
      aria-hidden="true"
      data-rafale-autoplay-progress={durationMs === null ? "waiting" : "running"}
    >
      {durationMs === null ? null : (
        <span
          className="block h-full origin-left bg-accent"
          style={{ animation: `hud-autoplay-fill ${durationMs}ms linear forwards` }}
        />
      )}
    </span>
  );
}
