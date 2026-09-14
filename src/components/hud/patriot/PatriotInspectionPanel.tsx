"use client";

import {
  PATRIOT_INSPECTABLES,
  PATRIOT_INSPECTION_GROUP_COPY,
  PATRIOT_SOURCES,
  PATRIOT_SOURCE_STATUS,
  activePatriotInspectionId,
  patriotInspectableById,
  type PatriotInspectableGroup,
  type PatriotInspectableId,
  type PatriotInspectionAction,
  type PatriotInspectionState,
} from "@/data/hud/patriot-inspection";
import {
  PATRIOT_FIRE_MODE_COPY,
  type PatriotFireMode,
  type PatriotSequenceState,
} from "@/data/hud/patriot";

const GROUPS: readonly PatriotInspectableGroup[] = ["station", "battery"];

export function PatriotInspectionPanel({
  sequenceState,
  fireMode,
  inspection,
  dispatch,
  onToggle,
}: {
  sequenceState: PatriotSequenceState;
  fireMode: PatriotFireMode;
  inspection: PatriotInspectionState;
  dispatch: (action: PatriotInspectionAction) => void;
  onToggle: (id: PatriotInspectableId) => void;
}) {
  const activeId = activePatriotInspectionId(inspection);
  const active = patriotInspectableById(activeId);
  const selectionMode = inspection.selectedId ? "ÉPINGLÉ" : active ? "APERÇU" : "—";

  return (
    <aside
      className="order-2 min-w-0 self-start border border-line bg-panel lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:h-[clamp(28rem,62vw,48rem)] lg:overflow-y-auto xl:h-[min(74vh,48rem)]"
      aria-labelledby="patriot-inspection-heading"
    >
      <div className="border-b border-line px-3 py-2.5 lg:px-4 lg:py-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
          Inspection accessible · vue 3D liée
        </p>
        <h3
          id="patriot-inspection-heading"
          className="mt-1 font-serif text-lg leading-tight text-ink lg:text-xl"
        >
          Sous-ensembles visibles
        </h3>
      </div>

      <dl className="hidden divide-y divide-line border-b border-line lg:block">
        {[
          ["SYSTEM", "PATRIOT PAC-3 MSE — BATTERIE"],
          ["STATE", sequenceState.toUpperCase()],
          ["MODE", PATRIOT_FIRE_MODE_COPY[fireMode].label.toUpperCase()],
          ["SOURCE STATUS", PATRIOT_SOURCE_STATUS],
        ].map(([label, value]) => (
          <div key={label} className="grid grid-cols-[6.5rem_1fr] gap-3 px-4 py-2">
            <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-faint">
              {label}
            </dt>
            <dd className="min-w-0 font-mono text-[10px] uppercase leading-relaxed tracking-[0.08em] text-ink-dim">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      {GROUPS.map((group) => (
        <div key={group} className="border-b border-line">
          <p
            id={`patriot-group-${group}`}
            className="border-b border-line bg-surface px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-ink-faint lg:px-4"
          >
            {PATRIOT_INSPECTION_GROUP_COPY[group]}
          </p>
          <ul
            className="grid grid-cols-2 divide-x divide-y divide-line lg:block lg:divide-x-0 lg:divide-y"
            aria-labelledby={`patriot-group-${group}`}
          >
            {PATRIOT_INSPECTABLES.filter((item) => item.group === group).map((component) => {
              const activeComponent = component.id === activeId;
              const selected = component.id === inspection.selectedId;
              const descriptionId = `patriot-component-${component.id}-description`;
              return (
                <li key={component.id}>
                  <button
                    type="button"
                    className={`group flex min-h-12 w-full items-center gap-2 border-l-2 px-3 py-2 text-left motion-safe:transition-colors lg:gap-3 lg:py-2 ${
                      selected
                        ? "border-accent bg-surface-2 text-ink"
                        : activeComponent
                          ? "border-stamp bg-surface text-ink"
                          : "border-transparent bg-panel text-ink-dim hover:bg-surface"
                    }`}
                    aria-label={component.label}
                    aria-describedby={descriptionId}
                    aria-pressed={selected}
                    data-patriot-component={component.id}
                    data-patriot-component-active={activeComponent ? "true" : "false"}
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
                      className={`h-px w-5 shrink-0 ${activeComponent ? "bg-accent" : "bg-line-bright"}`}
                      aria-hidden="true"
                    />
                    <span className="min-w-0 flex-1 font-mono text-[10px] uppercase tracking-[0.08em] lg:tracking-[0.12em]">
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
        </div>
      ))}

      <div className="px-3 py-2.5 lg:px-4 lg:py-3" aria-live="polite">
        <div className="flex items-center justify-between gap-3 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-faint">
          <span>Composant actif</span>
          <span>{selectionMode}</span>
        </div>
        {active ? (
          <>
            <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-ink">
              {active.label}
            </p>
            <p className="mt-1 font-mono text-[10px] leading-relaxed text-ink-dim">
              {active.description}
            </p>
            <dl className="mt-2 divide-y divide-line border-y border-line">
              {active.facts.map((fact) => (
                <div key={fact.label} className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] gap-2 py-1.5">
                  <dt className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink-faint">
                    {fact.label}
                  </dt>
                  <dd className="font-mono text-[10px] text-ink-dim">
                    {fact.value}
                    {fact.confidence === "moyenne" ? (
                      <span className="ml-1.5 border border-line-bright px-1 font-mono text-[8px] uppercase tracking-[0.08em] text-stamp">
                        conf. moyenne
                      </span>
                    ) : null}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-ink-faint">
              Sources
            </p>
            <ul className="mt-1 space-y-1">
              {active.sources.map((id) => {
                const source = PATRIOT_SOURCES[id];
                return (
                  <li key={id} className="font-mono text-[10px] leading-snug text-ink-dim">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="underline decoration-line-bright underline-offset-2 motion-safe:transition-colors hover:text-accent"
                    >
                      {source.publisher}
                    </a>
                    <span className="text-ink-faint"> — {source.title}</span>
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink">—</p>
            <p className="mt-1 font-mono text-[10px] leading-relaxed text-ink-dim">
              Survoler, parcourir au clavier ou toucher un sous-ensemble pour l’identifier sur la vue 3D.
            </p>
          </>
        )}
      </div>

      <p className="border-t border-line px-3 py-2.5 font-mono text-[10px] leading-relaxed text-ink-faint lg:px-4 lg:py-3">
        Représentation illustrative. Aucun ciblage ou calcul opérationnel.
      </p>
    </aside>
  );
}
