import type { Grade, Score } from "@/data/types";
import { GRADE_META, SCORE_LABELS } from "@/data/labels";

const GRADE_LEVEL: Record<Grade, number> = { A: 5, B: 4, C: 3, D: 2, E: 1 };

// Relevé de paliers — visualise les six évaluations en barres segmentées.
// Honnête : la barre ne fait que montrer le palier (A–E), aucun chiffrage.
export function ScoreProfile({
  scores,
  showLabels = true,
}: {
  scores: Score[];
  showLabels?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      {scores.map((score) => {
        const level = GRADE_LEVEL[score.grade];
        const meta = GRADE_META[score.grade];
        return (
          <div key={score.key} className="flex items-center gap-3">
            {showLabels ? (
              <span className="w-36 shrink-0 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-dim">
                {SCORE_LABELS[score.key]}
              </span>
            ) : null}
            <div className="flex flex-1 gap-[3px]">
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  className="h-2.5 flex-1"
                  style={{
                    backgroundColor:
                      n <= level ? meta.token : "var(--color-line)",
                  }}
                />
              ))}
            </div>
            <span className="w-4 shrink-0 text-center font-mono text-xs font-semibold text-ink-dim">
              {score.grade}
            </span>
          </div>
        );
      })}
    </div>
  );
}
