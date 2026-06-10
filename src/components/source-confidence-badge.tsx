import type { SourceRef } from "@/data/types";
import {
  scoreSource,
  SOURCE_CONFIDENCE_META,
} from "@/lib/source-confidence";

export function SourceConfidenceBadge({ source }: { source: SourceRef }) {
  const score = scoreSource(source);
  const meta = SOURCE_CONFIDENCE_META[score.band];

  return (
    <span
      className="inline-flex items-center gap-1.5 border border-line-bright px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-dim"
      title={`${score.label} · ${score.score}/100 · ${score.reasons.join(" · ")}`}
    >
      <span
        className="h-1.5 w-1.5 shrink-0"
        style={{ backgroundColor: meta.token }}
        aria-hidden="true"
      />
      {score.score}
    </span>
  );
}
