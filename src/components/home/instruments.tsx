import Image from "next/image";
import Link from "next/link";
import type { HudBoard } from "@/data/hud/boards";
import type { DefenseSystem } from "@/data/types";
import { SCORE_LABELS } from "@/data/labels";
import {
  INDUSTRIAL_GRAPH_PILOT,
  type IndustrialEdge,
  type IndustrialNode,
} from "@/data/panoplie-workflows";
import { GradeBadge } from "@/components/primitives";

/** Ligne compacte d'accès à une planche : vignette, titre, repères. */
export function HudBoardRow({ board }: { board: HudBoard }) {
  return (
    <Link
      href={board.href}
      className="group flex items-center gap-4 border-t border-line py-3 transition-colors"
    >
      <Image
        src={board.preview.src}
        alt=""
        width={96}
        height={54}
        unoptimized
        className="h-[54px] w-24 shrink-0 border border-line object-cover opacity-90 group-hover:opacity-100"
      />
      <span className="min-w-0 flex-1">
        <span className="block font-serif text-lg leading-tight text-ink transition-colors group-hover:text-accent">
          {board.title}
        </span>
        <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
          {board.features.slice(0, 2).join(" · ")}
        </span>
      </span>
      <span className="font-mono text-[11px] text-accent" aria-hidden="true">
        →
      </span>
    </Link>
  );
}

/** Six paliers de deux dossiers, côte à côte — l'extrait du comparateur. */
export function ScoreCompareTable({
  left,
  right,
}: {
  left: DefenseSystem;
  right: DefenseSystem;
}) {
  return (
    <table className="w-full border-collapse font-mono text-[11px]">
      <thead>
        <tr className="text-ink-faint">
          <th
            scope="col"
            className="border-b border-line py-2 text-left font-medium uppercase tracking-[0.12em]"
          >
            Palier
          </th>
          <th
            scope="col"
            className="border-b border-line py-2 text-center font-medium uppercase tracking-[0.12em]"
          >
            {left.name}
          </th>
          <th
            scope="col"
            className="border-b border-line py-2 text-center font-medium uppercase tracking-[0.12em]"
          >
            {right.name}
          </th>
        </tr>
      </thead>
      <tbody className="text-ink-dim">
        {left.scores.map((score) => {
          const other = right.scores.find((item) => item.key === score.key);
          return (
            <tr key={score.key}>
              <th
                scope="row"
                className="border-b border-line py-2 pr-3 text-left font-normal"
              >
                {SCORE_LABELS[score.key]}
              </th>
              <td className="border-b border-line py-1.5 text-center">
                <GradeBadge grade={score.grade} size="sm" />
              </td>
              <td className="border-b border-line py-1.5 text-center">
                {other ? <GradeBadge grade={other.grade} size="sm" /> : "—"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

const RELATION_LABELS: Record<IndustrialEdge["relation"], string> = {
  produces: "produit",
  funds: "finance",
  exports: "exporte",
  depends_on: "dépend de",
  documents: "documente",
};

const NODE_STROKE: Partial<Record<IndustrialNode["kind"], string>> = {
  system: "var(--color-accent)",
  company: "var(--color-ink-faint)",
  country: "var(--color-stamp)",
};
const NODE_STROKE_DEFAULT = "var(--color-line-bright)";

const BOX_W = 150;
const BOX_H = 28;
const COLS = [10, 196, 382] as const;
const ROW_GAP = 56;

interface GraphRow {
  system: IndustrialNode;
  company?: { node: IndustrialNode; relation: IndustrialEdge["relation"] };
  country?: { node: IndustrialNode; relation: IndustrialEdge["relation"] };
}

/**
 * Extrait du graphe industriel public : pour quelques systèmes du pilote,
 * l'industriel qui le produit et le pays qui l'exporte ou le finance. Les
 * nœuds et relations sont lus dans `INDUSTRIAL_GRAPH_PILOT`, jamais ajoutés.
 */
export function IndustrialGraphExcerpt({
  systemIds,
}: {
  systemIds: readonly string[];
}) {
  const byId = new Map(
    INDUSTRIAL_GRAPH_PILOT.nodes.map((node) => [node.id, node] as const),
  );
  const rows: GraphRow[] = systemIds.flatMap((id) => {
    const system = byId.get(id);
    if (!system) return [];
    const pick = (kind: IndustrialNode["kind"]) => {
      const edge = INDUSTRIAL_GRAPH_PILOT.edges.find(
        (item) => item.to === id && byId.get(item.from)?.kind === kind,
      );
      const node = edge ? byId.get(edge.from) : undefined;
      return edge && node ? { node, relation: edge.relation } : undefined;
    };
    return [{ system, company: pick("company"), country: pick("country") }];
  });

  const height = rows.length * ROW_GAP - (ROW_GAP - BOX_H) + 12;
  const description = rows
    .map((row) =>
      [
        row.company
          ? `${row.company.node.label} ${RELATION_LABELS[row.company.relation]} ${row.system.label}`
          : null,
        row.country
          ? `${row.country.node.label} ${RELATION_LABELS[row.country.relation]} ${row.system.label}`
          : null,
      ]
        .filter(Boolean)
        .join(" ; "),
    )
    .join(". ");

  return (
    <svg
      viewBox={`0 0 ${COLS[2] + BOX_W + 10} ${height}`}
      role="img"
      aria-label={`Extrait du graphe industriel : ${description}.`}
      className="mt-4 block h-auto w-full"
      fontFamily="var(--font-mono)"
      fontSize="10"
    >
      {rows.map((row, i) => {
        const y = 6 + i * ROW_GAP;
        const mid = y + BOX_H / 2;
        const cells: { node: IndustrialNode; x: number }[] = [
          { node: row.system, x: COLS[0] },
          ...(row.company ? [{ node: row.company.node, x: COLS[1] }] : []),
          ...(row.country ? [{ node: row.country.node, x: COLS[2] }] : []),
        ];
        return (
          <g key={row.system.id}>
            {row.company ? (
              <line
                x1={COLS[0] + BOX_W}
                y1={mid}
                x2={COLS[1]}
                y2={mid}
                stroke="var(--color-line-bright)"
              />
            ) : null}
            {row.country ? (
              <line
                x1={COLS[1] + BOX_W}
                y1={mid}
                x2={COLS[2]}
                y2={mid}
                stroke="var(--color-line-bright)"
                strokeDasharray={row.country.relation === "funds" ? "3 4" : undefined}
              />
            ) : null}
            {cells.map(({ node, x }) => (
              <g key={node.id}>
                <rect
                  x={x}
                  y={y}
                  width={BOX_W}
                  height={BOX_H}
                  fill="var(--color-panel)"
                  stroke={NODE_STROKE[node.kind] ?? NODE_STROKE_DEFAULT}
                />
                <text
                  x={x + BOX_W / 2}
                  y={mid + 3.5}
                  textAnchor="middle"
                  fill="var(--color-ink)"
                >
                  {node.label}
                </text>
              </g>
            ))}
          </g>
        );
      })}
    </svg>
  );
}
