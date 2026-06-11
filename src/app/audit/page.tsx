import type { Metadata } from "next";
import { getAllClaims, getEvidenceStats } from "@/lib/claims";
import { getContradictionCandidates } from "@/lib/contradictions";
import {
  AuditMetricsPanel,
  ClaimAuditSummary,
  ContradictionMatrixPanel,
} from "@/components/audit-console-panels";
import { SourceConfidencePanel } from "@/components/source-confidence-panel";
import { SafetyBoundaryBanner } from "@/components/safety-boundary-banner";
import { SectionMarker } from "@/components/primitives";
import { StatGrid, type Stat } from "@/components/stat-cards";

export const metadata: Metadata = {
  alternates: { canonical: "/audit" },
  title: "Audit méthodologique",
  description:
    "Console d'audit Panoplie : sources, claims, contradictions, limites et qualité des preuves.",
};

export default function AuditPage() {
  const claims = getAllClaims();
  const stats = getEvidenceStats();
  const contradictions = getContradictionCandidates(claims);

  const cards: Stat[] = [
    { label: "Sources indexées", value: stats.sources },
    { label: "Claims tracés", value: stats.claims },
    { label: "Vérifiés", value: stats.byStatus.verifie },
    { label: "À recouper", value: stats.byStatus["a-recouper"] },
    { label: "Variables", value: stats.byStatus.variable },
    { label: "Sans source", value: stats.claimsWithoutSources },
    { label: "Contradictions MVP", value: contradictions.length },
    { label: "Dernière revue", value: stats.updated },
  ];

  return (
    <div className="mx-auto max-w-[1180px] px-5 py-12">
      <header className="reveal">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
          Méthodologie
        </p>
        <h1 className="mt-4 font-serif text-5xl tracking-tight text-ink">
          Audit Panoplie
        </h1>
        <p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-ink-dim">
          Une console de preuve non opérationnelle : couverture par domaine,
          qualité source, claims variables et divergences à vérifier avant toute
          synthèse stratégique.
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
          label="Registre méthodologique"
          blurb="Compteurs dérivés des données : pas de saisie manuelle des métriques de preuve."
        />
        <div className="mt-6 space-y-6">
          <ClaimAuditSummary claims={claims} />
          <AuditMetricsPanel stats={stats} />
        </div>
      </section>

      <section className="mt-14">
        <SectionMarker
          index="02"
          label="Source Confidence Engine"
          blurb="Score v1 déterministe : fiabilité, type de source, fraîcheur, date et URL publique."
        />
        <div className="mt-6">
          <SourceConfidencePanel limit={24} />
        </div>
      </section>

      <section className="mt-14">
        <SectionMarker
          index="03"
          label="Contradictions à vérifier"
          blurb="Matrice éditoriale et règles simples : elle signale les divergences, sans conclure automatiquement."
        />
        <div className="mt-6">
          <ContradictionMatrixPanel candidates={contradictions} limit={16} />
        </div>
      </section>
    </div>
  );
}
