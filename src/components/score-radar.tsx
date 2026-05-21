import type { Grade, Score, ScoreKey } from "@/data/types";

// Diagramme radar — superpose le profil de paliers de plusieurs systèmes sur
// six axes. Lit la forme d'une capacité d'un coup d'œil ; complète, sans les
// remplacer, les barres segmentées du tableau.

const GRADE_LEVEL: Record<Grade, number> = { A: 5, B: 4, C: 3, D: 2, E: 1 };

const AXES: { key: ScoreKey; label: string }[] = [
  { key: "efficacite-cout", label: "Eff. / coût" },
  { key: "survivabilite", label: "Survie" },
  { key: "exportabilite", label: "Export" },
  { key: "risque-industriel", label: "Risque ind." },
  { key: "maturite", label: "Maturité" },
  { key: "confiance-donnees", label: "Confiance" },
];

const SIZE = 340;
const C = SIZE / 2;
const MAX_R = 104;
const LABEL_R = MAX_R + 24;

export interface RadarSeries {
  name: string;
  color: string;
  scores: Score[];
}

function at(axisIndex: number, radius: number): [number, number] {
  const angle = (axisIndex / AXES.length) * 2 * Math.PI - Math.PI / 2;
  return [C + radius * Math.cos(angle), C + radius * Math.sin(angle)];
}

function polygon(radii: number[]): string {
  return radii.map((r, i) => at(i, r).join(",")).join(" ");
}

export function ScoreRadar({ series }: { series: RadarSeries[] }) {
  const rings = [1, 2, 3, 4, 5].map((lvl) =>
    polygon(AXES.map(() => (lvl / 5) * MAX_R)),
  );

  return (
    <figure className="flex flex-col items-center">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full max-w-[360px]"
        role="img"
        aria-label="Diagramme radar des six paliers d'évaluation pour les systèmes sélectionnés."
      >
        {rings.map((points, i) => (
          <polygon
            key={i}
            points={points}
            fill={i === 4 ? "var(--color-surface)" : "none"}
            stroke="var(--color-line)"
            strokeWidth="1"
          />
        ))}

        {AXES.map((axis, i) => {
          const [x, y] = at(i, MAX_R);
          const [lx, ly] = at(i, LABEL_R);
          const anchor = lx < C - 6 ? "end" : lx > C + 6 ? "start" : "middle";
          return (
            <g key={axis.key}>
              <line
                x1={C}
                y1={C}
                x2={x}
                y2={y}
                stroke="var(--color-line)"
                strokeWidth="1"
              />
              <text
                x={lx}
                y={ly}
                textAnchor={anchor}
                dominantBaseline="middle"
                style={{
                  fontSize: "9px",
                  letterSpacing: "0.04em",
                  fill: "var(--color-ink-faint)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {axis.label}
              </text>
            </g>
          );
        })}

        {series.map((entry) => {
          const radii = AXES.map((axis) => {
            const score = entry.scores.find((s) => s.key === axis.key);
            return ((score ? GRADE_LEVEL[score.grade] : 0) / 5) * MAX_R;
          });
          return (
            <g key={entry.name}>
              <polygon
                points={polygon(radii)}
                fill={entry.color}
                fillOpacity="0.13"
                stroke={entry.color}
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              {radii.map((r, i) => {
                const [x, y] = at(i, r);
                return <circle key={i} cx={x} cy={y} r="2.6" fill={entry.color} />;
              })}
            </g>
          );
        })}
      </svg>

      <figcaption className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-1.5">
        {series.map((entry) => (
          <span key={entry.name} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5"
              style={{ backgroundColor: entry.color }}
              aria-hidden="true"
            />
            <span className="font-mono text-[11px] text-ink-dim">
              {entry.name}
            </span>
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
