"use client";

import Link from "next/link";
import { useState } from "react";
import type { MatrixPoint } from "@/lib/matrix";
import { DomainChips, type DomainValue } from "./domain-filter";

const QUADRANTS = [
  { pos: "left-3 top-3", align: "text-left", text: "Souverain · effet élevé" },
  {
    pos: "right-3 top-3",
    align: "text-right",
    text: "Dépendant · effet élevé",
  },
  {
    pos: "left-3 bottom-3",
    align: "text-left",
    text: "Souverain · effet mesuré",
  },
  {
    pos: "right-3 bottom-3",
    align: "text-right",
    text: "Dépendant · effet mesuré",
  },
];

/**
 * Nuage de points à deux axes. Survol ou focus isole un système ; le point
 * renvoie au dossier. Coordonnées dérivées des paliers (voir lib/matrix).
 */
export function MatrixPlot({ points }: { points: MatrixPoint[] }) {
  const [active, setActive] = useState<string | null>(null);
  const [domain, setDomain] = useState<DomainValue>("all");

  const shown = points.filter(
    (point) => domain === "all" || point.category === domain,
  );

  return (
    <div>
      <div className="mb-5 flex justify-center">
        <DomainChips value={domain} onChange={setDomain} />
      </div>

      <div className="mx-auto flex max-w-[720px] gap-3">
        <div className="flex items-center">
          <span className="rotate-180 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint [writing-mode:vertical-rl]">
            Effet par rapport au coût →
          </span>
        </div>

        <div className="flex-1">
          <div className="relative aspect-square w-full border border-line-bright bg-panel">
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-line" />
            <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-line" />

            {QUADRANTS.map((quadrant) => (
              <span
                key={quadrant.text}
                className={`pointer-events-none absolute ${quadrant.pos} ${quadrant.align} max-w-[44%] font-mono text-[10px] uppercase leading-tight tracking-[0.12em] text-ink-dim`}
              >
                {quadrant.text}
              </span>
            ))}

            {shown.map((point) => {
              const dimmed = active !== null && active !== point.slug;
              const labelLeft = point.x > 55;
              return (
                <Link
                  key={point.slug}
                  href={`/systemes/${point.slug}`}
                  onMouseEnter={() => setActive(point.slug)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(point.slug)}
                  onBlur={() => setActive(null)}
                  className={`group absolute -translate-x-1/2 -translate-y-1/2 outline-none transition-opacity hover:z-20 focus-visible:z-20 ${
                    dimmed ? "opacity-25" : "opacity-100"
                  }`}
                  style={{ left: `${point.x}%`, top: `${100 - point.y}%` }}
                >
                  <span className="block h-3.5 w-3.5 rotate-45 border border-accent bg-accent/35 transition-transform duration-150 group-hover:scale-[1.6] group-focus-visible:scale-[1.6]" />
                  <span
                    className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap border border-line bg-surface px-1.5 py-0.5 font-mono text-[10px] text-ink-dim transition-colors group-hover:border-accent group-hover:text-ink group-focus-visible:border-accent group-focus-visible:text-ink ${
                      labelLeft ? "right-full mr-2.5" : "left-full ml-2.5"
                    }`}
                  >
                    {point.flag} {point.name}
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
            <span>← Autonomie industrielle</span>
            <span>Dépendance géopolitique →</span>
          </div>
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="mt-4 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
          Aucun système dans ce domaine.
        </p>
      ) : null}
    </div>
  );
}
