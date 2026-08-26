"use client";

import {
  THUNDART_INSPECTABLES,
  THUNDART_SOURCE_STATUS,
  activeThundartInspectionId,
  thundartInspectableById,
  type ThundartInspectionAction,
  type ThundartInspectionState,
} from "@/data/hud/thundart-inspection";
import type { ThundartSequenceState } from "@/data/hud/thundart";

export function ThundartInspectionPanel({
  sequenceState,
  inspection,
  dispatch,
  onToggle,
}: {
  sequenceState: ThundartSequenceState;
  inspection: ThundartInspectionState;
  dispatch: (action: ThundartInspectionAction) => void;
  onToggle: (id: (typeof THUNDART_INSPECTABLES)[number]["id"]) => void;
}) {
  const activeId = activeThundartInspectionId(inspection);
  const active = thundartInspectableById(activeId);
  const selectionMode = inspection.selectedId ? "ÉPINGLÉ" : active ? "APERÇU" : "—";

  return (
    <aside
      className="order-2 min-w-0 self-start border border-line bg-panel lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:h-[clamp(26rem,62vw,46rem)] lg:overflow-y-auto xl:h-[min(72vh,46rem)]"
      aria-labelledby="thundart-inspection-heading"
    >
      <div className="border-b border-line px-3 py-2.5 lg:px-4 lg:py-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
          Inspection accessible · vue 3D liée
        </p>
        <h3
          id="thundart-inspection-heading"
          className="mt-1 font-serif text-lg leading-tight text-ink lg:text-xl"
        >
          Sous-ensembles visibles
        </h3>
        <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-ink-faint lg:hidden">
          Documentation publique · représentation illustrative
        </p>
      </div>

      <dl className="hidden divide-y divide-line border-b border-line lg:block">
        {[
          ["SYSTEM", "THUNDART — DEMONSTRATION VIEW"],
          ["STATE", sequenceState.toUpperCase()],
          ["MODEL", "ILLUSTRATIVE 3D REPRESENTATION"],
          ["SOURCE STATUS", THUNDART_SOURCE_STATUS],
        ].map(([label, value]) => (
          <div key={label} className="grid grid-cols-[6.5rem_1fr] gap-3 px-4 py-2.5">
            <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-faint">
              {label}
            </dt>
            <dd className="min-w-0 font-mono text-[10px] uppercase leading-relaxed tracking-[0.08em] text-ink-dim">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <ul
        className="grid grid-cols-2 divide-x divide-y divide-line border-b border-line lg:block lg:divide-x-0 lg:divide-y"
        aria-label="Composants inspectables"
      >
        {THUNDART_INSPECTABLES.map((component) => {
          const activeComponent = component.id === activeId;
          const selected = component.id === inspection.selectedId;
          const descriptionId = `thundart-component-${component.id}-description`;

          return (
            <li key={component.id}>
              <button
                type="button"
                className={`group flex min-h-12 w-full items-center gap-2 border-l-2 px-3 py-2 text-left motion-safe:transition-colors lg:gap-3 lg:py-2.5 ${
                  selected
                    ? "border-accent bg-surface-2 text-ink"
                    : activeComponent
                      ? "border-stamp bg-surface text-ink"
                      : "border-transparent bg-panel text-ink-dim hover:bg-surface"
                }`}
                aria-label={component.label}
                aria-describedby={descriptionId}
                aria-pressed={selected}
                data-thundart-component={component.id}
                data-thundart-component-active={activeComponent ? "true" : "false"}
                onPointerEnter={(event) => {
                  if (event.pointerType === "touch") return;
                  dispatch({ type: "PREVIEW", id: component.id });
                }}
                onPointerLeave={() => dispatch({ type: "PREVIEW", id: null })}
                onFocus={() => dispatch({ type: "PREVIEW", id: component.id })}
                onBlur={() => dispatch({ type: "PREVIEW", id: null })}
                onClick={() => onToggle(component.id)}
              >
                <span
                  className={`h-px w-6 shrink-0 ${
                    activeComponent ? "bg-accent" : "bg-line-bright"
                  }`}
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1 font-mono text-[10px] uppercase tracking-[0.1em] lg:tracking-[0.13em]">
                  {component.label}
                </span>
                <span
                  className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink-faint"
                  aria-hidden="true"
                >
                  {selected ? "PIN" : activeComponent ? "VIEW" : "—"}
                </span>
                <span id={descriptionId} className="sr-only">
                  {component.description}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {active ? (
        <div className="border-t border-line px-3 py-2.5 lg:px-4 lg:py-3" aria-live="polite">
          <div className="flex items-center justify-between gap-3 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-faint">
            <span>Composant actif</span>
            <span>{selectionMode}</span>
          </div>
          <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-ink">
            {active.label}
          </p>
          <p className="mt-1 font-mono text-[10px] leading-relaxed text-ink-dim lg:min-h-10">
            {active.description}
          </p>
        </div>
      ) : (
        <div className="hidden border-t border-line px-4 py-3 lg:block" aria-live="polite">
          <div className="flex items-center justify-between gap-3 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-faint">
            <span>Composant actif</span>
            <span>{selectionMode}</span>
          </div>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink">—</p>
          <p className="mt-1 min-h-10 font-mono text-[10px] leading-relaxed text-ink-dim">
            NON DOCUMENTÉ
          </p>
        </div>
      )}

      <p className="border-t border-line px-3 py-2.5 font-mono text-[10px] leading-relaxed text-ink-faint lg:px-4 lg:py-3">
        Représentation illustrative. Aucun ciblage ou calcul opérationnel.
      </p>
    </aside>
  );
}
