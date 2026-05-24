"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import type { PanoplieXrayScenario } from "@/data/decision-twin/types";
import type { DefenseSystem } from "@/data/types";
import { WIREFRAME_3D_SPECS, GLB_AVAILABLE_SLUGS } from "@/data/aviation-3d";
import { SectionMarker } from "@/components/primitives";
import { RegistrationMarks } from "@/components/registration-marks";
import { Stamp } from "@/components/stamp";
import { EvidenceDrawer } from "./EvidenceDrawer";
import { ExportEvidencePackButton } from "./ExportEvidencePackButton";
import { type ActiveLayer, LayerFilter } from "./LayerFilter";
import { SystemXraySchematic } from "./SystemXraySchematic";

const SystemXray3DView = dynamic(
  () => import("./SystemXray3DView").then((m) => m.SystemXray3DView),
  {
    ssr: false,
    loading: () => (
      <div className="flex aspect-square w-full items-center justify-center border border-line bg-surface font-mono text-xs uppercase tracking-[0.18em] text-ink-faint">
        chargement 3D…
      </div>
    ),
  },
);

type ViewMode = "2d" | "3d";

export function SystemXrayView({
  system,
  scenario,
}: {
  system: DefenseSystem;
  scenario: PanoplieXrayScenario;
}) {
  const [activeLayer, setActiveLayer] = useState<ActiveLayer>("all");
  const [selectedNodeId, setSelectedNodeId] = useState(
    scenario.nodes[0]?.id ?? "",
  );
  const [viewMode, setViewMode] = useState<ViewMode>("2d");

  const wireframeSpec = WIREFRAME_3D_SPECS[system.slug];
  const hasGlb = GLB_AVAILABLE_SLUGS.has(system.slug);
  const has3D = Boolean(wireframeSpec);

  const filteredNodes = useMemo(() => {
    if (activeLayer === "all") return scenario.nodes;
    return scenario.nodes.filter((node) => node.layer === activeLayer);
  }, [activeLayer, scenario.nodes]);

  const selectedNode =
    filteredNodes.find((node) => node.id === selectedNodeId) ??
    filteredNodes[0] ??
    scenario.nodes[0];

  return (
    <article className="mx-auto max-w-[1180px] px-5 py-10">
      <header className="relative border border-line-bright bg-panel">
        <RegistrationMarks />
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-2.5">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
            {system.reference} · System X-Ray
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
            OSINT · non operationnel · non prescriptif
          </span>
        </div>
        <div className="grid gap-px bg-line md:grid-cols-[1.35fr_0.85fr]">
          <div className="bg-panel p-7">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-dim">
              {system.classLabel}
            </span>
            <h1 className="mt-3 font-serif text-5xl leading-[0.98] text-ink sm:text-6xl">
              {scenario.title}
            </h1>
            <p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-ink-dim">
              {scenario.subtitle}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Stamp tone="accent" rotate={-2}>
                {system.country}
              </Stamp>
              <Stamp tone="ink" rotate={2}>
                {system.manufacturer}
              </Stamp>
              <Stamp tone="dim" rotate={-1}>
                Dossier source
              </Stamp>
            </div>
          </div>
          <div className="grid bg-panel sm:grid-cols-2 md:grid-cols-1">
            {[
              ["Hotspots", scenario.nodes.length],
              ["Couches", scenario.layers.length],
              ["Sources", system.sources.length],
              ["Mise a jour", system.updated],
            ].map(([label, value]) => (
              <div key={label} className="border-b border-line px-5 py-4 last:border-b-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                  {label}
                </p>
                <p className="mt-1 font-mono text-lg text-ink">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <section className="mt-10">
        <SectionMarker
          index="01"
          label="Vue X-Ray"
          blurb="La silhouette reste volontairement pedagogique: elle sert a naviguer dans les preuves, pas a decrire un systeme exploitable."
        />
        <div className="mt-6 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <LayerFilter
              layers={scenario.layers}
              activeLayer={activeLayer}
              onChange={setActiveLayer}
            />
            {has3D && (
              <div
                role="group"
                aria-label="Mode d'affichage"
                className="inline-flex border border-line-bright bg-panel"
              >
                {(["2d", "3d"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setViewMode(mode)}
                    className={`px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
                      viewMode === mode
                        ? "bg-accent text-panel"
                        : "text-ink-dim hover:bg-surface"
                    }`}
                  >
                    {mode === "2d" ? "Schématique 2D" : "Vue 3D"}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.45fr_0.9fr]">
            {has3D && viewMode === "3d" ? (
              <SystemXray3DView
                spec={wireframeSpec}
                glbPath={hasGlb ? `/models/aviation/${system.slug}.glb` : undefined}
                nodes={filteredNodes}
                selectedNodeId={selectedNode?.id}
                onSelectNode={(node) => setSelectedNodeId(node.id)}
              />
            ) : (
              <SystemXraySchematic
                slug={system.slug}
                nodes={filteredNodes}
                selectedNodeId={selectedNode?.id}
                onSelectNode={(node) => setSelectedNodeId(node.id)}
              />
            )}
            <EvidenceDrawer node={selectedNode} />
          </div>
        </div>
      </section>

      <section className="mt-12">
        <SectionMarker
          index="02"
          label="Fallback preuve"
          blurb="La liste ci-dessous reste disponible pour mobile, accessibilite et lecture sans interaction graphique."
        />
        <div className="mt-6 overflow-hidden border border-line">
          <div className="grid grid-cols-[1fr_auto_auto] gap-px bg-line text-left font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
            <div className="bg-surface px-3 py-2">Hotspot</div>
            <div className="bg-surface px-3 py-2">Couche</div>
            <div className="bg-surface px-3 py-2">Risque</div>
          </div>
          <div className="divide-y divide-line bg-panel">
            {filteredNodes.map((node) => (
              <button
                key={node.id}
                type="button"
                onClick={() => setSelectedNodeId(node.id)}
                className={`grid w-full grid-cols-[1fr_auto_auto] gap-3 px-3 py-3 text-left transition-colors ${
                  node.id === selectedNode?.id
                    ? "bg-surface-2"
                    : "hover:bg-surface"
                }`}
              >
                <span>
                  <span className="block font-mono text-xs text-ink">
                    {node.label}
                  </span>
                  <span className="mt-1 block max-w-2xl font-serif text-xs leading-relaxed text-ink-faint">
                    {node.claim}
                  </span>
                </span>
                <span className="self-start border border-line-bright px-2 py-1 font-mono text-[10px] uppercase text-ink-dim">
                  {node.layer}
                </span>
                <span className="self-start border border-line-bright px-2 py-1 font-mono text-[10px] uppercase text-ink-dim">
                  {node.risk}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-12">
        <SectionMarker
          index="03"
          label="Evidence Pack"
          blurb="Export local et partageable: le pack conserve les sources, limites et actions recommandees."
        />
        <div className="mt-6 border border-line bg-panel p-5">
          <ExportEvidencePackButton scenario={scenario} />
          <ul className="mt-5 space-y-2 font-serif text-sm leading-relaxed text-ink-dim">
            {scenario.limitations.map((limitation) => (
              <li key={limitation}>- {limitation}</li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  );
}
