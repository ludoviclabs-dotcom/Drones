import type { Metadata } from "next";
import { UPDATE_REVIEW_QUEUE } from "@/data/panoplie-workflows";
import { UpdateReviewQueue } from "@/components/panoplie-workflow-panels";
import { SafetyBoundaryBanner } from "@/components/safety-boundary-banner";
import { SectionMarker } from "@/components/primitives";
import { StatGrid, type Stat } from "@/components/stat-cards";

export const metadata: Metadata = {
  alternates: { canonical: "/updates" },
  title: "File de revue OSINT",
  description:
    "MVP Update Agent Panoplie : nouvelles sources et propositions de mise à jour sans publication automatique.",
};

export default function UpdatesPage() {
  const cards: Stat[] = [
    { label: "Mises à jour simulées", value: UPDATE_REVIEW_QUEUE.length },
    {
      label: "À valider",
      value: UPDATE_REVIEW_QUEUE.length,
      hint: "Aucune publication automatique.",
    },
    {
      label: "Claims contredits",
      value: UPDATE_REVIEW_QUEUE.filter((item) => item.kind === "contradicted_claim")
        .length,
    },
    {
      label: "Confiance haute",
      value: UPDATE_REVIEW_QUEUE.filter((item) => item.confidence === "haute").length,
    },
  ];

  return (
    <div className="mx-auto max-w-[1180px] px-5 py-12">
      <header className="reveal">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
          Update Agent MVP
        </p>
        <h1 className="mt-4 font-serif text-5xl tracking-tight text-ink">
          File de revue OSINT
        </h1>
        <p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-ink-dim">
          Une file éditoriale simulée : nouvelle source, claim modifié ou
          divergence possible, puis validation humaine avant intégration.
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
          label="Propositions à valider"
          blurb="Workflow Proposed → reviewed → applied / rejected, sans publication automatique."
        />
        <div className="mt-6">
          <UpdateReviewQueue limit={UPDATE_REVIEW_QUEUE.length} />
        </div>
      </section>
    </div>
  );
}
