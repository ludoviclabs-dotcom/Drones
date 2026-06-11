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

function sourceSummary(record: CostRecord): string {
  if (record.sources.length === 0) return "source à compléter";
  return record.sources.map((source) => source.publisher).join(" · ");
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

  const cards: [string, number, string][] = [
    [
      "Claims non opérationnels",
      claims.length,
      "Tous les claims exposés portent le périmètre stratégique et sourcé.",
    ],
    [
      "Claims sans source",
      missingSources.length,
      "À réduire en priorité dans les prochaines revues éditoriales.",
    ],
    [
      "Claims variables",
      variableClaims.length,
      "À recouper par périmètre, standard, date ou source primaire.",
    ],
  ];

  return (
    <div className="grid gap-px border border-line bg-line md:grid-cols-3">
      {cards.map(([label, value, detail]) => (
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

export function CostComparisonPanel({
  records,
  limit = 14,
}: {
  records: CostRecord[];
  limit?: number;
}) {
  const visible = records.slice(0, limit);

  return (
    <div className="overflow-x-auto border border-line">
      <table className="w-full min-w-[1040px] border-collapse">
        <thead>
          <tr className="border-b border-line bg-surface-2">
            {[
              "Système",
              "Type",
              "Montant",
              "Périmètre",
              "Année",
              "Incertitude",
              "Sources",
            ].map((column) => (
              <th
                key={column}
                scope="col"
                className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visible.map((record) => (
            <tr
              key={record.recordId}
              className="border-b border-line align-top last:border-0"
            >
              <td className="px-4 py-3 font-mono text-xs text-ink">
                <span className="block">{record.systemName}</span>
                <span className="mt-1 inline-block border border-line-bright px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-ink-faint">
                  {record.curated ? "curaté" : "extrait"}
                </span>
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
                <span>{record.perimeter}</span>
                {record.comparabilityLimit ? (
                  <span className="mt-1 block font-serif text-xs italic text-ink-faint">
                    {record.comparabilityLimit}
                  </span>
                ) : null}
                {record.normalizedNote ? (
                  <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.1em] text-accent">
                    {record.normalizedNote}
                  </span>
                ) : null}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-ink-dim">
                {record.year ?? "—"}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-ink-dim">
                {UNCERTAINTY_LABELS[record.uncertainty]}
              </td>
              <td className="px-4 py-3 font-serif text-xs leading-relaxed text-ink-faint">
                {sourceSummary(record)}
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
  limit = 12,
}: {
  candidates: ContradictionCandidate[];
  limit?: number;
}) {
  const visible = candidates.slice(0, limit);

  return (
    <div className="grid gap-px border border-line bg-line lg:grid-cols-2">
      {visible.map((candidate) => (
        <article key={candidate.id} className="bg-panel p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                {candidate.category} · {candidate.curated ? "éditorial" : "règle"}
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
          {candidate.claimA || candidate.claimB ? (
            <div className="mt-3 grid gap-px border border-line bg-line">
              {candidate.claimA ? (
                <p className="bg-surface px-3 py-2 font-serif text-xs leading-relaxed text-ink-dim">
                  {candidate.claimA}
                </p>
              ) : null}
              {candidate.claimB ? (
                <p className="bg-surface px-3 py-2 font-serif text-xs leading-relaxed text-ink-dim">
                  {candidate.claimB}
                </p>
              ) : null}
            </div>
          ) : null}
          <p className="mt-3 font-serif text-sm leading-relaxed text-ink-dim">
            {candidate.nature}
          </p>
          <p className="mt-2 font-serif text-xs italic leading-relaxed text-ink-faint">
            {candidate.nextCheck} · {candidate.sourceCount} source(s)
          </p>
          {candidate.sources.length > 0 ? (
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
              {candidate.sources.map((source) => source.publisher).join(" · ")}
            </p>
          ) : null}
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
