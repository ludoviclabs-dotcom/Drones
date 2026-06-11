import type { Metadata } from "next";
import { STRATEGIC_PORTFOLIO } from "@/data/panoplie-workflows";
import { PortfolioComparatorPanel } from "@/components/panoplie-workflow-panels";
import { SafetyBoundaryBanner } from "@/components/safety-boundary-banner";
import { SectionMarker } from "@/components/primitives";
import { StatGrid, type Stat } from "@/components/stat-cards";

export const metadata: Metadata = {
  alternates: { canonical: "/portefeuille" },
  title: "Comparateur portefeuille stratégique",
  description:
    "Comparateur stratégique non opérationnel Panoplie : coût, finance, supply chain, export, maturité et qualité des sources.",
};

export default function PortfolioPage() {
  const cards: Stat[] = [
    { label: "Systèmes comparés", value: STRATEGIC_PORTFOLIO.length },
    { label: "Critères", value: 6 },
    { label: "Périmètre", value: "stratégique" },
    { label: "Efficacité militaire", value: "exclue" },
  ];

  return (
    <div className="mx-auto max-w-[1180px] px-5 py-12">
      <header className="reveal">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
          Portefeuille
        </p>
        <h1 className="mt-4 font-serif text-5xl tracking-tight text-ink">
          Comparateur stratégique
        </h1>
        <p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-ink-dim">
          Comparaison non opérationnelle : coûts, financement, dépendances
          industrielles, export, maturité programme et qualité des sources.
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
          label="Lecture portefeuille"
          blurb="La table compare les contraintes stratégiques et industrielles ; elle ne recommande aucun emploi tactique."
        />
        <div className="mt-6">
          <PortfolioComparatorPanel />
        </div>
      </section>
    </div>
  );
}
