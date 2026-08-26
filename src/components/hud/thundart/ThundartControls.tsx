"use client";

import {
  THUNDART_INITIAL_STATE,
  THUNDART_SEQUENCE_COPY,
  THUNDART_SEQUENCE_STATES,
  type ThundartSequenceAction,
  type ThundartSequenceState,
} from "@/data/hud/thundart";

export function ThundartControls({
  state,
  dispatch,
  reducedMotion,
}: {
  state: ThundartSequenceState;
  dispatch: (action: ThundartSequenceAction) => void;
  reducedMotion: boolean;
}) {
  const stateIndex = THUNDART_SEQUENCE_STATES.indexOf(state);
  const isFirst = state === THUNDART_INITIAL_STATE;
  const isLast = stateIndex === THUNDART_SEQUENCE_STATES.length - 1;
  const copy = THUNDART_SEQUENCE_COPY[state];

  return (
    <section
      className="flex min-w-0 flex-col border border-line bg-panel"
      aria-labelledby="thundart-sequence-heading"
    >
      <div className="border-b border-line px-4 py-3">
        <h3
          id="thundart-sequence-heading"
          className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-faint"
        >
          Séquence éditoriale
        </h3>
        <p
          className="mt-2 font-serif text-xl leading-tight text-ink"
          data-thundart-state={state}
          aria-live="polite"
        >
          {copy.label}
        </p>
        <p className="mt-2 min-h-11 font-mono text-[10px] leading-relaxed text-ink-dim">
          {copy.description}
        </p>
        {reducedMotion ? (
          <p className="mt-2 border-l border-stamp pl-2 font-mono text-[9px] uppercase leading-relaxed tracking-[0.12em] text-stamp">
            Mouvement réduit actif · poses appliquées sans transition
          </p>
        ) : null}
      </div>

      <ol className="grid grid-cols-2 gap-px bg-line sm:grid-cols-5">
        {THUNDART_SEQUENCE_STATES.map((item, index) => {
          const active = item === state;
          const passed = index < stateIndex;

          return (
            <li
              key={item}
              className={`min-w-0 bg-panel px-3 py-3 ${
                active ? "border-l-2 border-accent bg-surface-2" : "border-l-2 border-transparent"
              }`}
              aria-current={active ? "step" : undefined}
            >
              <span className="flex min-w-0 items-center gap-2">
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
                  className={`truncate font-mono text-[9px] uppercase tracking-[0.12em] ${
                    active ? "text-ink" : "text-ink-faint"
                  }`}
                >
                  {THUNDART_SEQUENCE_COPY[item].shortLabel}
                </span>
              </span>
            </li>
          );
        })}
      </ol>

      <div className="grid grid-cols-3 gap-px border-t border-line bg-line">
        <button
          type="button"
          className="min-h-12 bg-panel px-2 font-mono text-[9px] uppercase tracking-[0.12em] text-ink-dim motion-safe:transition-colors hover:bg-surface-2 hover:text-ink disabled:cursor-not-allowed disabled:text-ink-faint disabled:opacity-45"
          onClick={() => dispatch({ type: "PREVIOUS" })}
          disabled={isFirst}
        >
          Précédent
        </button>
        <button
          type="button"
          className="min-h-12 bg-panel px-2 font-mono text-[9px] uppercase tracking-[0.12em] text-ink-dim motion-safe:transition-colors hover:bg-surface-2 hover:text-ink"
          onClick={() => dispatch({ type: "RESET" })}
        >
          Réinitialiser
        </button>
        <button
          type="button"
          className="min-h-12 bg-accent-deep px-2 font-mono text-[9px] uppercase tracking-[0.12em] text-[#fff8e8] motion-safe:transition-colors hover:bg-[#8f4319] disabled:cursor-not-allowed disabled:bg-panel disabled:text-ink-faint disabled:opacity-45"
          onClick={() => dispatch({ type: "NEXT" })}
          disabled={isLast}
        >
          Suivant
        </button>
      </div>
    </section>
  );
}
