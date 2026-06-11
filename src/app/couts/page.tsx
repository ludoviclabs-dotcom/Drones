import type { Metadata } from "next";
import { getCostRecords } from "@/lib/cost-records";
import { CostComparisonPanel } from "@/components/audit-console-panels";
import { SafetyBoundaryBanner } from "@/components/safety-boundary-banner";
import { SectionMarker } from "@/components/primitives";
import { StatGrid, type Stat } from "@/components/stat-cards";

export const metadata: Metadata = {
  alternates: { canonical: "/couts" },
  title: "Coûts publics",
  description:
    "Comparateur public coût et TCO Panoplie : acquisition, programme, cycle de vie, périmètre, incertitude et sources.",
};

export default function CostsPage() {
  const records = getCostRecords();
  const curated = records.filter((record) => record.curated).length;
  const currencies = new Set(records.map((record) => record.currency)).size;
  const highUncertainty = records.filter(
    (record) => record.uncertainty === "high",
  ).length;

  const cards: Stat[] = [
    { label: "Lignes coût", value: records.length },
    { label: "Curatées", value: curated },
    { label: "Devises", value: currencies },
    { label: "Incertitude haute", value: highUncertainty },
  ];

  return (
    <div className="mx-auto max-w-[1180px] px-5 py-12">
      <header className="reveal">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
          Coûts publics / TCO
        </p>
        <h1 className="mt-4 font-serif text-5xl tracking-tight text-ink">
          Comparateur de coûts publics
        </h1>
        <p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-ink-dim">
          Acquisition, programme, maintenance ou cycle de vie : chaque montant
          reste attaché à son périmètre, sa date, sa devise et ses limites de
          comparabilité.
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
          label="Registre coût"
          blurb="Aucune comparaison d'efficacité militaire : uniquement coûts publics, sources, périmètres et incertitudes."
        />
        <div className="mt-6">
          <CostComparisonPanel records={records} limit={records.length} />
        </div>
      </section>
    </div>
  );
}
