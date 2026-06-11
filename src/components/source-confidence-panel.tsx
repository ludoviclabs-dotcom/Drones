import type { SourceRef } from "@/data/types";
import { RELIABILITY_LABELS, SOURCE_TYPE_LABELS } from "@/data/labels";
import { systems } from "@/data/systems";
import {
  scoreSource,
  sourceKey,
  SOURCE_CONFIDENCE_META,
} from "@/lib/source-confidence";
import { SourceConfidenceBadge } from "./source-confidence-badge";

function getAllSources(): SourceRef[] {
  const byKey = new Map<string, SourceRef>();

  for (const system of systems) {
    for (const source of system.sources) {
      byKey.set(sourceKey(source), source);
    }
  }

  return Array.from(byKey.values());
}

function sortByScore(sources: SourceRef[]): SourceRef[] {
  return [...sources].sort((a, b) => scoreSource(b).score - scoreSource(a).score);
}

export function SourceConfidenceDetails({ source }: { source: SourceRef }) {
  const score = scoreSource(source);
  const meta = SOURCE_CONFIDENCE_META[score.band];

  return (
    <details className="mt-2 border border-line bg-surface-2 px-3 py-2">
      <summary className="cursor-pointer list-none font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
        Score source · {score.score}/100 · {score.label}
      </summary>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        <p className="font-serif text-xs leading-relaxed text-ink-dim">
          Type : {SOURCE_TYPE_LABELS[source.type]} · Fiabilité {source.reliability} (
          {RELIABILITY_LABELS[source.reliability]}).
        </p>
        <p className="font-serif text-xs leading-relaxed text-ink-dim">
          {source.date ? `Date publiée : ${source.date}.` : "Date absente."}{" "}
          {source.url ? "URL publique disponible." : "URL publique non renseignée."}
        </p>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {score.reasons.map((reason) => (
          <span
            key={reason}
            className="border border-line-bright px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-ink-dim"
            style={{ borderColor: meta.token }}
          >
            {reason}
          </span>
        ))}
      </div>
    </details>
  );
}

export function SourceConfidencePanel({
  sources,
  limit = 18,
}: {
  sources?: SourceRef[];
  limit?: number;
}) {
  const visible = sortByScore(sources ?? getAllSources()).slice(0, limit);

  return (
    <div className="overflow-x-auto border border-line">
      <table className="w-full min-w-[920px] border-collapse">
        <thead>
          <tr className="border-b border-line bg-surface-2">
            {["Source", "Type", "Score", "Date", "Lecture"].map((column) => (
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
          {visible.map((source) => {
            const score = scoreSource(source);
            return (
              <tr key={sourceKey(source)} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  <p className="font-serif text-sm text-ink">{source.title}</p>
                  <p className="mt-1 font-mono text-[11px] text-ink-faint">
                    {source.publisher}
                  </p>
                </td>
                <td className="px-4 py-3 font-mono text-[11px] text-ink-dim">
                  {SOURCE_TYPE_LABELS[source.type]}
                </td>
                <td className="px-4 py-3">
                  <SourceConfidenceBadge source={source} />
                </td>
                <td className="px-4 py-3 font-mono text-xs text-ink-dim">
                  {source.date ?? "—"}
                </td>
                <td className="px-4 py-3 font-serif text-xs leading-relaxed text-ink-faint">
                  {score.reasons.join(" · ")}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
