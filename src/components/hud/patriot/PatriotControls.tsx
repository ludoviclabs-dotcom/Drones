"use client";

import {
  PATRIOT_FIRE_MODES,
  PATRIOT_FIRE_MODE_COPY,
  PATRIOT_INITIAL_STATE,
  PATRIOT_SEQUENCE_COPY,
  PATRIOT_SEQUENCE_STATES,
  isFireModeLocked,
  patriotStateIndex,
  type PatriotFireMode,
  type PatriotSequenceAction,
  type PatriotSequenceState,
} from "@/data/hud/patriot";

export function PatriotControls({
  state,
  dispatch,
  fireMode,
  onFireModeChange,
  reducedMotion,
}: {
  state: PatriotSequenceState;
  dispatch: (action: PatriotSequenceAction) => void;
  fireMode: PatriotFireMode;
  onFireModeChange: (mode: PatriotFireMode) => void;
  reducedMotion: boolean;
}) {
  const stateIndex = patriotStateIndex(state);
  const isFirst = state === PATRIOT_INITIAL_STATE;
  const isLast = stateIndex === PATRIOT_SEQUENCE_STATES.length - 1;
  const copy = PATRIOT_SEQUENCE_COPY[state];
  const modeLocked = isFireModeLocked(state);

  return (
    <section
      className="flex min-w-0 flex-col border border-line bg-panel"
      aria-labelledby="patriot-sequence-heading"
    >
      <div className="grid gap-3 border-b border-line px-4 py-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
        <div className="min-w-0">
          <h3
            id="patriot-sequence-heading"
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint"
          >
            Séquence illustrative · préparation, mise à feu, départ
          </h3>
          <p
            className="mt-2 font-serif text-xl leading-tight text-ink"
            data-patriot-state={state}
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

        <fieldset className="min-w-0 border border-line px-3 pb-3 pt-1 md:w-64">
          <legend className="px-1 font-mono text-[9px] uppercase tracking-[0.16em] text-ink-faint">
            Mode de tir illustré
          </legend>
          <div className="mt-1 grid grid-cols-2 gap-px bg-line">
            {PATRIOT_FIRE_MODES.map((mode) => {
              const checked = mode === fireMode;
              return (
                <label
                  key={mode}
                  className={`relative flex min-h-11 cursor-pointer items-center justify-center px-2 text-center font-mono text-[10px] uppercase tracking-[0.08em] motion-safe:transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-[-2px] has-[:focus-visible]:outline-accent ${
                    checked
                      ? "bg-surface-2 text-ink shadow-[inset_0_-2px_0_var(--color-accent)]"
                      : "bg-panel text-ink-dim hover:bg-surface hover:text-ink"
                  } ${modeLocked ? "cursor-not-allowed" : ""} ${modeLocked && !checked ? "opacity-45" : ""}`}
                >
                  <input
                    type="radio"
                    name="patriot-fire-mode"
                    value={mode}
                    checked={checked}
                    disabled={modeLocked}
                    className="sr-only"
                    data-patriot-fire-mode-option={mode}
                    onChange={() => onFireModeChange(mode)}
                  />
                  {PATRIOT_FIRE_MODE_COPY[mode].label}
                </label>
              );
            })}
          </div>
          <p className="mt-2 font-mono text-[9px] leading-relaxed text-ink-faint">
            {modeLocked
              ? "Mode verrouillé pendant la séquence de tir · réinitialiser pour changer."
              : PATRIOT_FIRE_MODE_COPY[fireMode].description}
          </p>
        </fieldset>
      </div>

      <ol className="grid grid-cols-2 gap-px bg-line sm:grid-cols-4 lg:grid-cols-7" aria-label="États de la séquence">
        {PATRIOT_SEQUENCE_STATES.map((item, index) => {
          const active = item === state;
          const passed = index < stateIndex;
          return (
            <li key={item} className="min-w-0 bg-panel">
              <button
                type="button"
                className={`flex min-h-12 w-full min-w-0 items-center gap-2 border-l-2 px-3 py-2.5 text-left motion-safe:transition-colors hover:bg-surface ${
                  active ? "border-accent bg-surface-2" : "border-transparent"
                }`}
                aria-current={active ? "step" : undefined}
                aria-label={`${String(index + 1).padStart(2, "0")} · ${PATRIOT_SEQUENCE_COPY[item].shortLabel} — ${PATRIOT_SEQUENCE_COPY[item].label}`}
                data-patriot-step={item}
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
                  {PATRIOT_SEQUENCE_COPY[item].shortLabel}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="grid grid-cols-3 gap-px border-t border-line bg-line">
        <button
          type="button"
          className="min-h-12 bg-panel px-2 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-dim motion-safe:transition-colors hover:bg-surface-2 hover:text-ink disabled:cursor-not-allowed disabled:text-ink-faint disabled:opacity-45"
          onClick={() => dispatch({ type: "PREVIOUS" })}
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
          onClick={() => dispatch({ type: "NEXT" })}
          disabled={isLast}
        >
          Suivant
        </button>
      </div>
    </section>
  );
}
