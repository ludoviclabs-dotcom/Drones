import type { EvidenceStats, Claim } from "@/lib/claims";
import type { CostRecord } from "@/lib/cost-records";
import type { ContradictionCandidate } from "@/lib/contradictions";
import { CATEGORY_LABELS } from "@/data/labels";
import { SOURCE_CONFIDENCE_META } from "@/lib/source-confidence";

const UNCERTAINTY_LABELS: Record<CostRecord["uncertainty"], string> = {
  low: "faible",
  medium: "moyenne",
  high: "haute",
};

const SEVERITY_TOKEN: Record<ContradictionCandidate["severity"], string> = {
  faible: "var(--color-grade-c)",
  moyenne: "var(--color-grade-d)",
  forte: "var(--color-grade-e)",
};

function formatAmount(record: CostRecord): string {
  if (record.amount === null || record.currency === "N/A") return "Non normalisé";
  if (record.amount >= 1_000_000_000) {
    return `${(record.amount / 1_000_000_000).toFixed(1)} Md ${record.currency}`;
  }
  if (record.amount >= 1_000_000) {
    return `${(record.amount / 1_000_000).toFixed(1)} M ${record.currency}`;
  }
  return `${record.amount.toLocaleString("fr-FR")} ${record.currency}`;
}

export function AuditMetricsPanel({ stats }: { stats: EvidenceStats }) {
  return (
    <div className="grid gap-px border border-line bg-line lg:grid-cols-2">
      <div className="bg-panel p-5">
        <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-ink">
          Couverture par domaine
        </h3>
        <dl className="mt-4 grid gap-px border border-line bg-line sm:grid-cols-2">
          {Object.entries(stats.byCategory).map(([category, count]) => (
            <div key={category} className="bg-surface p-3">
              <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
              </dt>
              <dd className="mt-1 font-serif text-2xl text-ink">{count}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="bg-panel p-5">
        <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-ink">
          Confiance des sources
        </h3>
        <dl className="mt-4 space-y-px border border-line bg-line">
          {Object.entries(stats.sourceConfidence).map(([band, count]) => {
            const meta =
              SOURCE_CONFIDENCE_META[band as keyof typeof SOURCE_CONFIDENCE_META];
            return (
              <div
                key={band}
                className="flex items-center justify-between bg-surface p-3"
              >
                <dt className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-dim">
                  <span
                    className="h-2 w-2"
                    style={{ backgroundColor: meta.token }}
                    aria-hidden="true"
                  />
                  {meta.label}
                </dt>
                <dd className="font-mono text-sm text-ink">{count}</dd>
              </div>
            );
          })}
        </dl>
      </div>
    </div>
  );
}

export function ClaimAuditSummary({ claims }: { claims: Claim[] }) {
  const missingSources = claims.filter((claim) => claim.sources.length === 0);
  const variableClaims = claims.filter((claim) => claim.status === "variable");

  return (
    <div className="grid gap-px border border-line bg-line md:grid-cols-3">
      {[
        ["Claims non opérationnels", claims.length, "Tous les claims exposés portent le marqueur de périmètre."],
        ["Claims sans source", missingSources.length, "À réduire en priorité dans les prochaines revues."],
        ["Claims variables", variableClaims.length, "À recouper par périmètre, standard ou date."],
      ].map(([label, value, detail]) => (
        <article key={label} className="bg-panel p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
            {label}
          </p>
          <p className="mt-2 font-serif text-4xl text-ink">{value}</p>
          <p className="mt-2 font-serif text-sm leading-relaxed text-ink-dim">
            {detail}
          </p>
        </article>
      ))}
    </div>
  );
}

export function CostComparisonPanel({ records }: { records: CostRecord[] }) {
  const visible = records.slice(0, 14);

  return (
    <div className="overflow-x-auto border border-line">
      <table className="w-full min-w-[860px] border-collapse">
        <thead>
          <tr className="border-b border-line bg-surface-2">
            {["Système", "Type", "Montant", "Périmètre", "Année", "Incertitude"].map(
              (column) => (
                <th
                  key={column}
                  scope="col"
                  className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint"
                >
                  {column}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {visible.map((record, index) => (
            <tr
              key={`${record.systemId}-${record.perimeter}-${index}`}
              className="border-b border-line align-top last:border-0"
            >
              <td className="px-4 py-3 font-mono text-xs text-ink">
                {record.systemName}
              </td>
              <td className="px-4 py-3 font-mono text-[11px] text-ink-dim">
                {record.costType}
              </td>
              <td className="px-4 py-3">
                <p className="font-mono text-xs text-ink">{formatAmount(record)}</p>
                <p className="mt-1 font-serif text-xs italic text-ink-faint">
                  {record.rawValue}
                </p>
              </td>
              <td className="px-4 py-3 font-serif text-sm text-ink-dim">
                {record.perimeter}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-ink-dim">
                {record.year ?? "—"}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-ink-dim">
                {UNCERTAINTY_LABELS[record.uncertainty]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ContradictionMatrixPanel({
  candidates,
}: {
  candidates: ContradictionCandidate[];
}) {
  return (
    <div className="grid gap-px border border-line bg-line lg:grid-cols-2">
      {candidates.slice(0, 12).map((candidate) => (
        <article key={candidate.id} className="bg-panel p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                {candidate.category}
              </p>
              <h3 className="mt-1 font-serif text-lg leading-tight text-ink">
                {candidate.systemName}
              </h3>
            </div>
            <span
              className="border border-line-bright px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-dim"
              style={{ color: SEVERITY_TOKEN[candidate.severity] }}
            >
              {candidate.severity}
            </span>
          </div>
          <p className="mt-3 font-mono text-xs text-ink">{candidate.point}</p>
          <p className="mt-2 font-serif text-sm leading-relaxed text-ink-dim">
            {candidate.nature}
          </p>
          <p className="mt-2 font-serif text-xs italic leading-relaxed text-ink-faint">
            {candidate.nextCheck} · {candidate.sourceCount} source(s)
          </p>
        </article>
      ))}
      {candidates.length === 0 ? (
        <p className="bg-panel p-6 font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">
          Aucune divergence candidate détectée par les règles MVP.
        </p>
      ) : null}
    </div>
  );
}
