import type { Metadata } from "next";
import { getAllClaims, getEvidenceStats } from "@/lib/claims";
import { getCostRecords } from "@/lib/cost-records";
import { getContradictionCandidates } from "@/lib/contradictions";
import {
  AuditMetricsPanel,
  ClaimAuditSummary,
  ContradictionMatrixPanel,
  CostComparisonPanel,
} from "@/components/audit-console-panels";
import { SectionMarker } from "@/components/primitives";
import { SafetyBoundaryBanner } from "@/components/safety-boundary-banner";
import { StatGrid, type Stat } from "@/components/stat-cards";
import { ConsoleTable } from "@/components/console-table";

export const metadata: Metadata = {
  alternates: { canonical: "/console" },
  title: "Console OSINT",
  description:
    "Registre de preuves filtrable — chaque affirmation publiée par Panoplie, tracée, sourcée et statuée.",
};

export default function ConsolePage() {
  const claims = getAllClaims();
  const stats = getEvidenceStats();
  const costRecords = getCostRecords();
  const contradictionCandidates = getContradictionCandidates(claims);

  const cards: Stat[] = [
    { label: "Systèmes documentés", value: stats.systems },
    { label: "Sources indexées", value: stats.sources },
    { label: "Affirmations", value: stats.claims },
    { label: "Sans source", value: stats.claimsWithoutSources },
    { label: "Affirmations variables", value: stats.byStatus.variable },
    { label: "Confiance haute", value: stats.byConfidence.haute },
    { label: "Affirmations vérifiées", value: stats.byStatus.verifie },
    { label: "Sources fortes", value: stats.sourceConfidence.forte },
  ];

  return (
    <div className="mx-auto max-w-[1180px] px-5 py-12">
      <header className="reveal">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
          Outil
        </p>
        <h1 className="mt-4 font-serif text-5xl tracking-tight text-ink">
          Console OSINT
        </h1>
        <p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-ink-dim">
          Le registre de preuves : chaque affirmation publiée par Panoplie,
          rattachée à sa source, son niveau de confiance et son statut. Les
          compteurs sont dérivés des données — aucun n'est saisi à la main.
        </p>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
          Registre arrêté au {stats.updated}
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
          label="Audit méthodologique"
          blurb="Vue dérivée des données : couverture, sources, statuts de revue et trous de preuve."
        />
        <div className="mt-6 space-y-6">
          <ClaimAuditSummary claims={claims} />
          <AuditMetricsPanel stats={stats} />
        </div>
      </section>

      <section className="mt-14">
        <SectionMarker
          index="02"
          label="Coûts publics / TCO"
          blurb="MVP déterministe : extraction des coûts publics, périmètres et incertitudes déjà présents dans les fiches."
        />
        <div className="mt-6">
          <CostComparisonPanel records={costRecords} />
        </div>
      </section>

      <section className="mt-14">
        <SectionMarker
          index="03"
          label="Contradiction Matrix MVP"
          blurb="Divergences candidates à vérifier : coût, calendrier, export et industriel. La matrice ne conclut pas automatiquement."
        />
        <div className="mt-6">
          <ContradictionMatrixPanel candidates={contradictionCandidates} />
        </div>
      </section>

      <section className="mt-14">
        <SectionMarker
          index="04"
          label="Registre de preuves"
          blurb="Filtrer par système, brique, niveau de confiance ou statut."
        />
        <div className="mt-6">
          <ConsoleTable claims={claims} />
        </div>
      </section>
    </div>
  );
}
