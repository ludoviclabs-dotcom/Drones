import type { Metadata } from "next";
import { INDUSTRIAL_GRAPH_PILOT } from "@/data/panoplie-workflows";
import { IndustrialGraphPanel } from "@/components/panoplie-workflow-panels";
import { SafetyBoundaryBanner } from "@/components/safety-boundary-banner";
import { SectionMarker } from "@/components/primitives";
import { StatGrid, type Stat } from "@/components/stat-cards";

export const metadata: Metadata = {
  alternates: { canonical: "/industrial-graph" },
  title: "Graphe industriel public",
  description:
    "MVP Industrial Graph Panoplie : systèmes, industriels, pays et dépendances publiques sans détail de fabrication.",
};

export default function IndustrialGraphPage() {
  const cards: Stat[] = [
    { label: "Domaine pilote", value: INDUSTRIAL_GRAPH_PILOT.title },
    { label: "Nœuds", value: INDUSTRIAL_GRAPH_PILOT.nodes.length },
    { label: "Relations", value: INDUSTRIAL_GRAPH_PILOT.edges.length },
    {
      label: "Périmètre",
      value: "public",
      hint: "Industriel, pays, programmes et dépendances déclarées.",
    },
  ];

  return (
    <div className="mx-auto max-w-[1180px] px-5 py-12">
      <header className="reveal">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
          Supply chain
        </p>
        <h1 className="mt-4 font-serif text-5xl tracking-tight text-ink">
          Graphe industriel public
        </h1>
        <p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-ink-dim">
          Un premier graphe de dépendances publiques sur drones et munitions
          rôdeuses : industriels, pays, relations export et points de dépendance
          ouverts.
        </p>
      </header>

      <div className="mt-8">
        <SafetyBoundaryBanner variant="panel" />
      </div>

      <div className="mt-8">
        <StatGrid stats={cards} />
      </div>

      <section className="mt-14">
        <SectionMarker
          index="01"
          label={INDUSTRIAL_GRAPH_PILOT.title}
          blurb={INDUSTRIAL_GRAPH_PILOT.blurb}
        />
        <div className="mt-6">
          <IndustrialGraphPanel />
        </div>
      </section>
    </div>
  );
}
