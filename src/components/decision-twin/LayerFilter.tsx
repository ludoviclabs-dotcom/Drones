"use client";

import type {
  DecisionTwinLayer,
  DecisionTwinLayerDefinition,
} from "@/data/decision-twin/types";

export type ActiveLayer = DecisionTwinLayer | "all";

export function LayerFilter({
  layers,
  activeLayer,
  onChange,
}: {
  layers: DecisionTwinLayerDefinition[];
  activeLayer: ActiveLayer;
  onChange: (layer: ActiveLayer) => void;
}) {
  const options: Array<{ id: ActiveLayer; label: string }> = [
    { id: "all", label: "Toutes" },
    ...layers.map((layer) => ({ id: layer.id, label: layer.label })),
  ];

  return (
    <div className="flex flex-wrap gap-2" aria-label="Filtres de couches">
      {options.map((option) => {
        const isActive = option.id === activeLayer;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.id)}
            className={`h-9 border px-3 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
              isActive
                ? "border-accent bg-accent text-bg"
                : "border-line-bright text-ink-dim hover:border-accent hover:text-accent"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
