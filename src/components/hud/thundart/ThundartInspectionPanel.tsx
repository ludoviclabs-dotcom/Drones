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
}: {
  sequenceState: ThundartSequenceState;
  inspection: ThundartInspectionState;
  dispatch: (action: ThundartInspectionAction) => void;
}) {
  const activeId = activeThundartInspectionId(inspection);
  const active = thundartInspectableById(activeId);
  const selectionMode = inspection.selectedId ? "ÉPINGLÉ" : active ? "APERÇU" : "—";

  return (
    <aside
      className="min-w-0 self-start border border-line bg-panel lg:h-[clamp(26rem,62vw,46rem)] lg:overflow-y-auto xl:h-[min(72vh,46rem)]"
      aria-labelledby="thundart-inspection-heading"
    >
      <div className="border-b border-line px-4 py-3">
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent">
          Inspection accessible
        </p>
        <h3
          id="thundart-inspection-heading"
          className="mt-1 font-serif text-xl leading-tight text-ink"
        >
          Sous-ensembles visibles
        </h3>
      </div>

      <dl className="divide-y divide-line border-b border-line">
        {[
          ["SYSTEM", "THUNDART — DEMONSTRATION VIEW"],
          ["STATE", sequenceState.toUpperCase()],
          ["MODEL", "ILLUSTRATIVE 3D REPRESENTATION"],
          ["SOURCE STATUS", THUNDART_SOURCE_STATUS],
        ].map(([label, value]) => (
          <div key={label} className="grid grid-cols-[6.5rem_1fr] gap-3 px-4 py-2.5">
            <dt className="font-mono text-[8px] uppercase tracking-[0.16em] text-ink-faint">
              {label}
            </dt>
            <dd className="min-w-0 font-mono text-[9px] uppercase leading-relaxed tracking-[0.08em] text-ink-dim">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <ul className="divide-y divide-line" aria-label="Composants inspectables">
        {THUNDART_INSPECTABLES.map((component) => {
          const activeComponent = component.id === activeId;
          const selected = component.id === inspection.selectedId;
          const descriptionId = `thundart-component-${component.id}-description`;

          return (
            <li key={component.id}>
              <button
                type="button"
                className={`group flex min-h-12 w-full items-center gap-3 border-l-2 px-3 py-2.5 text-left motion-safe:transition-colors ${
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
                onClick={() => dispatch({ type: "TOGGLE", id: component.id })}
              >
                <span
                  className={`h-px w-6 shrink-0 ${
                    activeComponent ? "bg-accent" : "bg-line-bright"
                  }`}
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1 font-mono text-[9px] uppercase tracking-[0.13em]">
                  {component.label}
                </span>
                <span
                  className="font-mono text-[8px] uppercase tracking-[0.12em] text-ink-faint"
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

      <div className="border-t border-line px-4 py-3" aria-live="polite">
        <div className="flex items-center justify-between gap-3 font-mono text-[8px] uppercase tracking-[0.16em] text-ink-faint">
          <span>Composant actif</span>
          <span>{selectionMode}</span>
        </div>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink">
          {active?.label ?? "—"}
        </p>
        <p className="mt-1 min-h-10 font-mono text-[9px] leading-relaxed text-ink-dim">
          {active?.description ?? "NON DOCUMENTÉ"}
        </p>
      </div>

      <p className="border-t border-line px-4 py-3 font-mono text-[9px] leading-relaxed text-ink-faint">
        Représentation illustrative. Aucun ciblage ou calcul opérationnel.
      </p>
    </aside>
  );
}
