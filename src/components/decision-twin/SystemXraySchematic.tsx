"use client";

import type { DecisionTwinNode } from "@/data/decision-twin/types";
import { SystemSchematic } from "@/components/system-schematic";

export function SystemXraySchematic({
  slug,
  nodes,
  selectedNodeId,
  onSelectNode,
}: {
  slug: string;
  nodes: DecisionTwinNode[];
  selectedNodeId?: string;
  onSelectNode: (node: DecisionTwinNode) => void;
}) {
  return (
    <div className="relative min-h-[420px] overflow-hidden border border-line bg-surface">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, color-mix(in srgb, var(--color-accent) 16%, transparent), transparent 38%), linear-gradient(115deg, transparent 0 44%, color-mix(in srgb, var(--color-line-bright) 55%, transparent) 45% 46%, transparent 47% 100%)",
        }}
      />
      <div className="pointer-events-none absolute inset-x-8 top-7 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
        <span>X-Ray 2.5D</span>
        <span>Non operationnel</span>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-[300px] w-[300px]">
          <div className="absolute inset-8 rounded-full border border-line-bright opacity-40" />
          <div className="absolute inset-2 rounded-full border border-line opacity-50" />
          <SystemSchematic
            slug={slug}
            live
            className="absolute inset-0 h-full w-full text-accent"
          />
        </div>
      </div>
      <div className="absolute inset-0">
        {nodes.map((node) => {
          const isSelected = node.id === selectedNodeId;
          return (
            <button
              key={node.id}
              type="button"
              onClick={() => onSelectNode(node)}
              className={`absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 border font-mono text-[10px] transition-all ${
                isSelected
                  ? "z-20 scale-110 border-accent bg-accent text-bg shadow-lg"
                  : "z-10 border-line-bright bg-bg/85 text-ink hover:border-accent hover:text-accent"
              }`}
              style={{
                left: `${node.position2d.x}%`,
                top: `${node.position2d.y}%`,
              }}
              aria-label={`Ouvrir la preuve: ${node.label}`}
            >
              {node.label.slice(0, 2).toUpperCase()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
