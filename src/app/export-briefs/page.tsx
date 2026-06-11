import type { Metadata } from "next";
import { EXPORT_BRIEFS } from "@/data/panoplie-workflows";
import { ExportBriefPanel } from "@/components/panoplie-workflow-panels";
import { SafetyBoundaryBanner } from "@/components/safety-boundary-banner";
import { SectionMarker } from "@/components/primitives";
import { StatGrid, type Stat } from "@/components/stat-cards";

export const metadata: Metadata = {
  alternates: { canonical: "/export-briefs" },
  title: "Briefs export non juridiques",
  description:
    "Briefs export publics et non juridiques Panoplie : restrictions, dépendances, incertitudes et validation juriste.",
};

export default function ExportBriefsPage() {
  const cards: Stat[] = [
    { label: "Briefs", value: EXPORT_BRIEFS.length },
    {
      label: "Pays",
      value: new Set(EXPORT_BRIEFS.map((brief) => brief.country)).size,
    },
    {
      label: "Systèmes cités",
      value: new Set(EXPORT_BRIEFS.flatMap((brief) => brief.systems)).size,
    },
    { label: "Statut", value: "non juridique" },
  ];

  return (
    <div className="mx-auto max-w-[1180px] px-5 py-12">
      <header className="reveal">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
          Export
        </p>
        <h1 className="mt-4 font-serif text-5xl tracking-tight text-ink">
          Briefs export non juridiques
        </h1>
        <p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-ink-dim">
          Des notes publiques prudentes : cadre général, restrictions connues,
          dépendances et points à valider par juriste, sans conseil d'export et
          sans contournement.
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
          label="Cadres publics"
          blurb="Ces briefs ne sont pas des avis juridiques et ne remplacent pas une validation spécialisée."
        />
        <div className="mt-6">
          <ExportBriefPanel />
        </div>
      </section>
    </div>
  );
}
