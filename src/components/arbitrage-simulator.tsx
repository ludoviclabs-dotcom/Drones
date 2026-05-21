"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Grade, Score, ScoreKey } from "@/data/types";
import { GRADE_META, SCORE_LABELS } from "@/data/labels";

// Forme allégée — le simulateur n'a besoin que de l'identité et des paliers.
export interface SimSystem {
  slug: string;
  name: string;
  flag: string;
  classLabel: string;
  scores: Score[];
}

const GRADE_VALUE: Record<Grade, number> = { A: 4, B: 3, C: 2, D: 1, E: 0 };

const CRITERIA: ScoreKey[] = [
  "efficacite-cout",
  "survivabilite",
  "exportabilite",
  "risque-industriel",
  "maturite",
  "confiance-donnees",
];

const WEIGHT_LABELS = ["Écarté", "Accessoire", "Important", "Décisif"];

/**
 * Outil de pondération : l'utilisateur règle l'importance des six critères ;
 * la sortie est une lecture pondérée des paliers, assortie des points de
 * vigilance de chaque système. Ce n'est jamais une recommandation d'achat.
 */
export function ArbitrageSimulator({ systems }: { systems: SimSystem[] }) {
  const [weights, setWeights] = useState<Record<string, number>>(() =>
    Object.fromEntries(CRITERIA.map((key) => [key, 2])),
  );

  const total = CRITERIA.reduce((sum, key) => sum + weights[key], 0);

  const readings = useMemo(() => {
    if (total === 0) return [];
    return systems
      .map((system) => {
        const byKey = new Map(system.scores.map((s) => [s.key, s]));
        let acc = 0;
        for (const key of CRITERIA) {
          const score = byKey.get(key);
          acc += (score ? GRADE_VALUE[score.grade] : 0) * weights[key];
        }
        const vigilance = CRITERIA.map((key) => byKey.get(key)).filter(
          (s): s is Score =>
            s !== undefined && (s.grade === "D" || s.grade === "E"),
        );
        return { system, reading: acc / total, vigilance };
      })
      .sort((a, b) => b.reading - a.reading);
  }, [systems, weights, total]);

  return (
    <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
      <div>
        <div className="border border-line bg-panel">
          <div className="border-b border-line px-4 py-2.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
              Vos priorités
            </span>
          </div>
          {CRITERIA.map((key) => (
            <div
              key={key}
              className="border-b border-line px-4 py-3 last:border-0"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-dim">
                {SCORE_LABELS[key]}
              </span>
              <div className="mt-2 flex">
                {WEIGHT_LABELS.map((label, weight) => {
                  const on = weights[key] === weight;
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() =>
                        setWeights((prev) => ({ ...prev, [key]: weight }))
                      }
                      aria-pressed={on}
                      className={`-ml-px flex-1 border px-1 py-1 font-mono text-[9px] uppercase tracking-[0.04em] transition-colors first:ml-0 ${
                        on
                          ? "relative z-10 border-accent bg-accent/15 text-accent"
                          : "border-line-bright text-ink-faint hover:text-ink-dim"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 font-serif text-xs italic leading-relaxed text-ink-faint">
          Réglez l&apos;importance de chaque critère. La lecture se recalcule
          aussitôt — rien n&apos;est envoyé, rien n&apos;est enregistré.
        </p>
      </div>

      <div>
        {total === 0 ? (
          <div className="border border-dashed border-line-bright bg-panel/40 px-6 py-16 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">
              Aucune priorité retenue
            </p>
            <p className="mt-2 font-serif text-sm italic leading-relaxed text-ink-dim">
              Donnez de l&apos;importance à au moins un critère pour obtenir une
              lecture.
            </p>
          </div>
        ) : (
          <>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
              Lecture pondérée — ce que vos priorités font ressortir
            </p>
            <div className="mt-3 space-y-2.5">
              {readings.map((entry, i) => (
                <div
                  key={entry.system.slug}
                  className="border border-line bg-panel p-4"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <span className="flex items-baseline gap-2.5">
                      <span className="font-mono text-[11px] text-ink-faint">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm">{entry.system.flag}</span>
                      <Link
                        href={`/systemes/${entry.system.slug}`}
                        className="font-serif text-lg text-ink transition-colors hover:text-accent"
                      >
                        {entry.system.name}
                      </Link>
                      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                        {entry.system.classLabel}
                      </span>
                    </span>
                    <span className="font-mono text-sm text-ink-dim">
                      {entry.reading.toFixed(1)}{" "}
                      <span className="text-ink-faint">/ 4</span>
                    </span>
                  </div>
                  <div className="mt-2.5 h-2 bg-line">
                    <div
                      className="h-full bg-accent"
                      style={{ width: `${(entry.reading / 4) * 100}%` }}
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                      Points de vigilance
                    </span>
                    {entry.vigilance.length > 0 ? (
                      entry.vigilance.map((score) => (
                        <span
                          key={score.key}
                          className="border px-1.5 py-0.5 font-mono text-[10px]"
                          style={{
                            borderColor: GRADE_META[score.grade].token,
                            color: GRADE_META[score.grade].token,
                          }}
                        >
                          {SCORE_LABELS[score.key]} · {score.grade}
                        </span>
                      ))
                    ) : (
                      <span className="font-mono text-[10px] text-ink-dim">
                        Aucun palier fragile (D–E)
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
