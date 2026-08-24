"use client";

import {
  type CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  BarsPanel,
  CorePart,
  HudPanel,
  HudScene as Scene,
  LogPanel,
  MatrixPanel,
  RadialPanel,
  ReadoutPanel,
  Severity,
  SparklinePanel,
} from "./hud-scene";

const W = 1600;
const H = 900;
const PAD = 28;
const COL_W = 300;
const PANEL_H = 148;
const PANEL_GAP = 12;
const LEFT_X = PAD;
const RIGHT_X = W - PAD - COL_W;
const CORE_X0 = PAD + COL_W + 52;
const CORE_X1 = RIGHT_X - 52;
const CX = (CORE_X0 + CORE_X1) / 2;
const CORE_Y0 = 148;
const CORE_Y1 = 734;
const CALLOUT_L = CORE_X0 + 92;
const CALLOUT_R = CORE_X1 - 92;
const INNER_W = COL_W - 28;
const CONTENT_TOP = 48;
const CONTENT_BOTTOM = PANEL_H - 19;
const INNER_H = CONTENT_BOTTOM - CONTENT_TOP;
const PART_RX = 156;
const STROKE = {
  structure: 0.75,
  contour: 1.25,
  callout: 0.9,
} as const;
const PART_ASSEMBLY_MS = 900;
const PART_STAGGER_MS = 60;
const SERIES_TRANSITION_MS = 260;

export const HUD_THEME_TOKENS = {
  graphite: {
    ink: "#080d11",
    surface: "#101922",
    surfaceAlt: "#14212a",
    rule: "#31404b",
    ruleStrong: "#617985",
    text: "#dce7ed",
    muted: "#8aa0ad",
    data: "#57b6d5",
    nominal: "#6cab87",
    watch: "#c99131",
    alert: "#c95748",
  },
  blueprint: {
    ink: "#dce7ec",
    surface: "#e9f0f3",
    surfaceAlt: "#d2e0e6",
    rule: "#8ca1ab",
    ruleStrong: "#5d7784",
    text: "#10222c",
    muted: "#47616f",
    data: "#1d678a",
    nominal: "#2a6f52",
    watch: "#7d5c13",
    alert: "#9e3e31",
  },
} as const;

type HotTarget = { kind: "part" | "panel"; id: string } | null;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const finite = (value: number) => (Number.isFinite(value) ? value : 0);

const shorten = (value: string, max: number) =>
  value.length <= max ? value : `${value.slice(0, Math.max(0, max - 1))}…`;

const stateColor = (severity?: Severity) => {
  switch (severity) {
    case "alert":
      return "var(--hud-alert)";
    case "watch":
      return "var(--hud-warn)";
    case "offline":
      return "var(--hud-muted)";
    case "nominal":
      return "var(--hud-ok)";
    default:
      return "var(--hud-rule-strong)";
  }
};

const dataOrStateColor = (severity?: Severity) =>
  severity ? stateColor(severity) : "var(--hud-data)";

function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reducedMotion;
}

function useDisplayedSeries(series: number[], reducedMotion: boolean) {
  const seriesKey = series.map(finite).join("|");
  const target = useMemo(
    () => (seriesKey ? seriesKey.split("|").map(Number) : []),
    [seriesKey],
  );
  const previous = useRef(target);
  const frame = useRef<number | null>(null);
  const [displayed, setDisplayed] = useState(target);

  useEffect(() => {
    const from = previous.current;
    const changed =
      from.length !== target.length || from.some((value, index) => value !== target[index]);

    if (!changed) return;

    previous.current = target;

    if (reducedMotion || from.length !== target.length) {
      setDisplayed(target);
      return;
    }

    let start: number | undefined;
    const tick = (now: number) => {
      start ??= now;
      const progress = Math.min(1, (now - start) / SERIES_TRANSITION_MS);
      const eased = 1 - (1 - progress) ** 3;

      setDisplayed(from.map((value, index) => value + (target[index] - value) * eased));

      if (progress < 1) {
        frame.current = window.requestAnimationFrame(tick);
      }
    };

    frame.current = window.requestAnimationFrame(tick);
    return () => {
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    };
  }, [reducedMotion, target]);

  return displayed;
}

function polar(cx: number, cy: number, radius: number, degrees: number) {
  const radians = ((degrees - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  };
}

function arc(cx: number, cy: number, radius: number, from: number, to: number) {
  const start = polar(cx, cy, radius, to);
  const end = polar(cx, cy, radius, from);
  const largeArc = Math.abs(to - from) <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

function PartView({
  part,
  y,
  entryShift,
  entryDelay,
  active,
  patternId,
  onHot,
}: {
  part: CorePart;
  y: number;
  entryShift: number;
  entryDelay: number;
  active: boolean;
  patternId: string;
  onHot: (target: HotTarget) => void;
}) {
  const rx = PART_RX * clamp(part.scale ?? 1, 0.2, 1.3);
  const ry = rx * 0.3;
  const bodyHeight = part.shape === "core" ? 46 : 22;
  const stroke = active ? "var(--hud-text)" : stateColor(part.severity);
  const shell = part.shape === "shell";

  return (
    <g
      className="hudScene__target hudScene__part"
      style={
        {
          "--hud-part-entry-shift": `${entryShift}px`,
          "--hud-part-delay": `${entryDelay}ms`,
        } as CSSProperties
      }
      role="group"
      tabIndex={0}
      aria-label={`Pièce ${part.index} : ${part.label}`}
      onMouseEnter={() => onHot({ kind: "part", id: part.id })}
      onMouseLeave={() => onHot(null)}
      onFocus={() => onHot({ kind: "part", id: part.id })}
      onBlur={() => onHot(null)}
    >
      <path
        d={`M ${CX - rx} ${y} L ${CX - rx} ${y + bodyHeight} A ${rx} ${ry} 0 0 0 ${CX + rx} ${y + bodyHeight} L ${CX + rx} ${y} Z`}
        fill="var(--hud-surface)"
        fillOpacity={shell ? 0.12 : 0.72}
        stroke={stroke}
        strokeWidth={STROKE.contour}
        strokeDasharray={shell ? "6 4" : undefined}
      />
      <ellipse
        cx={CX}
        cy={y}
        rx={rx}
        ry={ry}
        fill="var(--hud-surface-alt)"
        fillOpacity={shell ? 0.16 : 0.82}
        stroke={stroke}
        strokeWidth={STROKE.contour}
        strokeDasharray={shell ? "6 4" : undefined}
      />

      {part.shape === "ring" && (
        <ellipse
          cx={CX}
          cy={y}
          rx={rx * 0.52}
          ry={ry * 0.52}
          fill="var(--hud-ink)"
          stroke={stroke}
          strokeWidth={STROKE.contour}
        />
      )}
      {part.shape === "lattice" && (
        <ellipse
          cx={CX}
          cy={y}
          rx={rx * 0.94}
          ry={ry * 0.94}
          fill={`url(#${patternId})`}
          stroke="none"
        />
      )}
      {part.shape === "core" && (
        <ellipse
          cx={CX}
          cy={y + bodyHeight / 2}
          rx={rx * 0.3}
          ry={ry * 0.3}
          fill={stroke}
          fillOpacity={0.24}
          stroke="none"
        />
      )}
      {part.shape === "boom" &&
        [-1, 1].flatMap((direction) =>
          [0, 1, 2].map((arm) => (
            <path
              key={`${direction}-${arm}`}
              d={`M ${CX + direction * rx * (0.28 + arm * 0.3)} ${y + ry * 0.45} q ${direction * 48} ${42 + arm * 12} ${direction * 25} ${98 + arm * 18}`}
              fill="none"
              stroke={stroke}
              strokeWidth={STROKE.contour}
              strokeOpacity={0.78}
            />
          )),
        )}
    </g>
  );
}

function CalloutLine({
  part,
  y,
  active,
}: {
  part: CorePart;
  y: number;
  active: boolean;
}) {
  if (!part.callout) return null;

  const left = part.callout.side === "left";
  const rx = PART_RX * clamp(part.scale ?? 1, 0.2, 1.3);
  const edge = left ? CX - rx : CX + rx;
  const marker = left ? CALLOUT_L : CALLOUT_R;
  const lineEnd = marker + (left ? 10 : -10);
  const labelX = (edge + lineEnd) / 2;
  const color = active ? "var(--hud-text)" : "var(--hud-rule-strong)";

  return (
    <g className="hudScene__callout" pointerEvents="none" aria-hidden="true">
      <line
        x1={edge}
        y1={y}
        x2={lineEnd}
        y2={y}
        stroke={color}
        strokeWidth={STROKE.callout}
      />
      <circle
        cx={marker}
        cy={y}
        r={10}
        fill="var(--hud-ink)"
        stroke={color}
        strokeWidth={STROKE.callout}
      />
      <text
        x={marker}
        y={y + 3.5}
        textAnchor="middle"
        fontSize={10}
        fill="var(--hud-text)"
        fontFamily="var(--hud-mono)"
      >
        {part.index}
      </text>
      <text
        x={labelX}
        y={y - 8}
        textAnchor="middle"
        fontSize={11}
        fill="var(--hud-text)"
        fontFamily="var(--hud-label)"
        letterSpacing={0.8}
      >
        {shorten(part.callout.text.toUpperCase(), 24)}
      </text>
      {part.callout.detail && (
        <text
          x={labelX}
          y={y + 14}
          textAnchor="middle"
          fontSize={9.5}
          fill="var(--hud-muted)"
          fontFamily="var(--hud-mono)"
        >
          {shorten(part.callout.detail, 26)}
        </text>
      )}
    </g>
  );
}

function EmptyPanel({ label }: { label: string }) {
  return (
    <text
      x={COL_W / 2}
      y={CONTENT_TOP + INNER_H / 2 + 4}
      textAnchor="middle"
      fontSize={11}
      fill="var(--hud-muted)"
      fontFamily="var(--hud-label)"
      letterSpacing={1.1}
    >
      {label}
    </text>
  );
}

function Sparkline({
  panel,
  reducedMotion,
}: {
  panel: SparklinePanel;
  reducedMotion: boolean;
}) {
  const series = useDisplayedSeries(panel.series, reducedMotion);
  if (series.length === 0) return <EmptyPanel label="AUCUNE SÉRIE" />;

  const domain = panel.band ? [...series, ...panel.band.map(finite)] : series;
  const max = Math.max(...domain);
  const min = Math.min(...domain);
  const span = max - min || 1;
  const xFor = (index: number) =>
    series.length === 1
      ? 14 + INNER_W / 2
      : 14 + (index / (series.length - 1)) * INNER_W;
  const yFor = (value: number) =>
    CONTENT_BOTTOM - ((value - min) / span) * INNER_H;
  const points = series
    .map((value, index) => `${xFor(index)},${yFor(value)}`)
    .join(" ");

  return (
    <>
      {panel.band && (
        <rect
          x={14}
          y={Math.min(yFor(panel.band[0]), yFor(panel.band[1]))}
          width={INNER_W}
          height={Math.max(1, Math.abs(yFor(panel.band[0]) - yFor(panel.band[1])))}
          fill="var(--hud-data)"
          fillOpacity={0.08}
          stroke="none"
        />
      )}
      <line
        x1={14}
        y1={CONTENT_BOTTOM}
        x2={14 + INNER_W}
        y2={CONTENT_BOTTOM}
        stroke="var(--hud-rule)"
        strokeWidth={STROKE.structure}
      />
      {series.length === 1 ? (
        <circle
          cx={xFor(0)}
          cy={yFor(series[0])}
          r={2.8}
          fill="var(--hud-data)"
        />
      ) : (
        <polyline
          points={points}
          fill="none"
          stroke="var(--hud-data)"
          strokeWidth={STROKE.contour}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      )}
      {panel.current !== undefined && (
        <text
          x={COL_W - 14}
          y={46}
          textAnchor="end"
          fontSize={15}
          fill="var(--hud-text)"
          fontFamily="var(--hud-mono)"
        >
          {finite(panel.current)}{panel.unit ? ` ${shorten(panel.unit, 8)}` : ""}
        </text>
      )}
    </>
  );
}

function Radial({ panel }: { panel: RadialPanel }) {
  const cx = COL_W / 2;
  const cy = CONTENT_TOP + INNER_H / 2 + 4;
  const radius = 39;
  const value = clamp(finite(panel.value), 0, 1);
  const end = -130 + value * 260;
  const color = panel.thresholds
    ? value >= panel.thresholds[1]
      ? "var(--hud-alert)"
      : value >= panel.thresholds[0]
        ? "var(--hud-warn)"
        : "var(--hud-ok)"
    : "var(--hud-data)";

  return (
    <>
      <path
        d={arc(cx, cy, radius, -130, 130)}
        fill="none"
        stroke="var(--hud-rule)"
        strokeWidth={STROKE.contour}
        strokeLinecap="round"
      />
      {value > 0 && (
        <path
          d={arc(cx, cy, radius, -130, end)}
          fill="none"
          stroke={color}
          strokeWidth={STROKE.contour}
          strokeLinecap="round"
        />
      )}
      <text
        x={cx}
        y={cy + 6}
        textAnchor="middle"
        fontSize={15}
        fill="var(--hud-text)"
        fontFamily="var(--hud-mono)"
      >
        {shorten(panel.label, 14)}
      </text>
    </>
  );
}

function Bars({ panel }: { panel: BarsPanel }) {
  if (panel.bars.length === 0) return <EmptyPanel label="AUCUNE BARRE" />;

  const values = panel.bars.map((bar) => Math.max(0, finite(bar.value)));
  const max = Math.max(...values, 1);
  const barWidth = INNER_W / (panel.bars.length * 1.65);
  const chartHeight = INNER_H - 15;

  return (
    <>
      {panel.unit && (
        <text
          x={COL_W - 14}
          y={46}
          textAnchor="end"
          fontSize={9.5}
          fill="var(--hud-muted)"
          fontFamily="var(--hud-mono)"
        >
          {shorten(panel.unit, 18)}
        </text>
      )}
      {panel.bars.map((bar, index) => {
        const x =
          14 + index * (INNER_W / panel.bars.length) + barWidth * 0.32;
        const height = (values[index] / max) * chartHeight;
        return (
          <g key={`${bar.label}-${index}`}>
            <rect
              x={x}
              y={CONTENT_BOTTOM - 15 - height}
              width={barWidth}
              height={height}
              fill={dataOrStateColor(bar.severity)}
              fillOpacity={0.82}
              stroke="none"
            />
            <text
              x={x + barWidth / 2}
              y={CONTENT_BOTTOM}
              textAnchor="middle"
              fontSize={9.5}
              fill="var(--hud-muted)"
              fontFamily="var(--hud-label)"
              letterSpacing={0.7}
            >
              {shorten(bar.label.toUpperCase(), 7)}
            </text>
          </g>
        );
      })}
    </>
  );
}

function Readout({ panel }: { panel: ReadoutPanel }) {
  if (panel.rows.length === 0) return <EmptyPanel label="AUCUNE MESURE" />;

  return (
    <>
      {panel.rows.slice(0, 4).map((row, index) => (
        <g key={`${row.label}-${index}`}>
          <text
            x={14}
            y={59 + index * 20}
            fontSize={11}
            fill="var(--hud-muted)"
            fontFamily="var(--hud-label)"
            letterSpacing={0.7}
          >
            {shorten(row.label.toUpperCase(), 22)}
          </text>
          <text
            x={COL_W - 14}
            y={59 + index * 20}
            textAnchor="end"
            fontSize={15}
            fill={row.severity ? stateColor(row.severity) : "var(--hud-text)"}
            fontFamily="var(--hud-mono)"
          >
            {shorten(row.value, 15)}
          </text>
        </g>
      ))}
    </>
  );
}

function Matrix({ panel }: { panel: MatrixPanel }) {
  const rowCount = panel.rows.length;
  const columnCount = Math.max(0, ...panel.rows.map((row) => row.length));
  if (rowCount === 0 || columnCount === 0) {
    return <EmptyPanel label="MATRICE VIDE" />;
  }

  const cellWidth = INNER_W / columnCount;
  const cellHeight = INNER_H / rowCount;

  return (
    <>
      {panel.rows.map((row, rowIndex) =>
        Array.from({ length: columnCount }, (_, columnIndex) => {
          const value = clamp(finite(row[columnIndex] ?? 0), 0, 1);
          return (
            <rect
              key={`${rowIndex}-${columnIndex}`}
              x={14 + columnIndex * cellWidth}
              y={CONTENT_TOP + rowIndex * cellHeight}
              width={Math.max(0, cellWidth - 2)}
              height={Math.max(0, cellHeight - 2)}
              fill="var(--hud-data)"
              fillOpacity={0.1 + value * 0.78}
              stroke="none"
            />
          );
        }),
      )}
    </>
  );
}

function Log({ panel }: { panel: LogPanel }) {
  if (panel.lines.length === 0) return <EmptyPanel label="JOURNAL VIDE" />;

  return (
    <>
      {panel.lines.slice(0, 5).map((line, index) => (
        <g key={`${line.t}-${line.text}-${index}`}>
          <text
            x={14}
            y={58 + index * 18}
            fontSize={9.5}
            fill="var(--hud-muted)"
            fontFamily="var(--hud-mono)"
          >
            {shorten(line.t, 7)}
          </text>
          <text
            x={70}
            y={58 + index * 18}
            fontSize={9.5}
            fill={line.severity ? stateColor(line.severity) : "var(--hud-text)"}
            fontFamily="var(--hud-mono)"
          >
            {shorten(line.text, 31)}
          </text>
        </g>
      ))}
    </>
  );
}

function PanelContent({
  panel,
  reducedMotion,
}: {
  panel: HudPanel;
  reducedMotion: boolean;
}) {
  switch (panel.kind) {
    case "sparkline":
      return <Sparkline panel={panel} reducedMotion={reducedMotion} />;
    case "radial":
      return <Radial panel={panel} />;
    case "bars":
      return <Bars panel={panel} />;
    case "readout":
      return <Readout panel={panel} />;
    case "matrix":
      return <Matrix panel={panel} />;
    case "log":
      return <Log panel={panel} />;
  }
}

function PanelView({
  panel,
  x,
  y,
  active,
  reducedMotion,
  onHot,
}: {
  panel: HudPanel;
  x: number;
  y: number;
  active: boolean;
  reducedMotion: boolean;
  onHot: (target: HotTarget) => void;
}) {
  return (
    <g
      className="hudScene__target"
      transform={`translate(${x} ${y})`}
      role="group"
      tabIndex={0}
      aria-label={`Panneau : ${panel.title}`}
      onMouseEnter={() => onHot({ kind: "panel", id: panel.id })}
      onMouseLeave={() => onHot(null)}
      onFocus={() => onHot({ kind: "panel", id: panel.id })}
      onBlur={() => onHot(null)}
    >
      <rect
        width={COL_W}
        height={PANEL_H}
        rx={1}
        fill="var(--hud-surface)"
        stroke={active ? "var(--hud-text)" : "var(--hud-rule)"}
        strokeWidth={STROKE.structure}
      />
      <line
        x1={0}
        y1={30}
        x2={COL_W}
        y2={30}
        stroke="var(--hud-rule)"
        strokeWidth={STROKE.structure}
      />
      <text
        x={14}
        y={20}
        fontSize={11}
        fill="var(--hud-text)"
        fontFamily="var(--hud-label)"
        letterSpacing={1}
      >
        {shorten(panel.title.toUpperCase(), panel.severity ? 28 : 31)}
      </text>
      {panel.severity && (
        <circle
          cx={COL_W - 14}
          cy={16}
          r={4}
          fill={stateColor(panel.severity)}
        />
      )}

      <PanelContent panel={panel} reducedMotion={reducedMotion} />

      {panel.source && (
        <text
          x={14}
          y={PANEL_H - 8}
          fontSize={9.5}
          fill="var(--hud-muted)"
          fontFamily="var(--hud-mono)"
          letterSpacing={0.55}
        >
          {`SOURCE · ${shorten(panel.source, 23)}`}
        </text>
      )}
      {panel.demo && (
        <text
          x={COL_W - 14}
          y={PANEL_H - 8}
          textAnchor="end"
          fontSize={9.5}
          fill="var(--hud-muted)"
          fontFamily="var(--hud-mono)"
          letterSpacing={1}
        >
          DEMO DATA
        </text>
      )}
    </g>
  );
}

export const HUD_REDUCED_MOTION_CSS = `
  @media (prefers-reduced-motion: reduce) {
    .hudScene *,
    .hudScene *::before,
    .hudScene *::after {
      animation: none !important;
      transition: none !important;
    }
  }
`;

const componentStyles = `
  .hudScene {
    --hud-label: "Arial Narrow", "Roboto Condensed", "Aptos Narrow", system-ui, sans-serif;
    --hud-mono: "IBM Plex Mono", "Cascadia Mono", ui-monospace, monospace;
    width: 100%;
    overflow-x: auto;
    overscroll-behavior-inline: contain;
    background: var(--hud-ink);
    border: 1px solid var(--hud-rule);
    color-scheme: dark;
    scrollbar-color: var(--hud-rule-strong) var(--hud-ink);
  }
  .hudScene--graphite {
    --hud-ink: ${HUD_THEME_TOKENS.graphite.ink};
    --hud-surface: ${HUD_THEME_TOKENS.graphite.surface};
    --hud-surface-alt: ${HUD_THEME_TOKENS.graphite.surfaceAlt};
    --hud-rule: ${HUD_THEME_TOKENS.graphite.rule};
    --hud-rule-strong: ${HUD_THEME_TOKENS.graphite.ruleStrong};
    --hud-text: ${HUD_THEME_TOKENS.graphite.text};
    --hud-muted: ${HUD_THEME_TOKENS.graphite.muted};
    --hud-data: ${HUD_THEME_TOKENS.graphite.data};
    --hud-ok: ${HUD_THEME_TOKENS.graphite.nominal};
    --hud-warn: ${HUD_THEME_TOKENS.graphite.watch};
    --hud-alert: ${HUD_THEME_TOKENS.graphite.alert};
  }
  .hudScene--blueprint {
    --hud-ink: ${HUD_THEME_TOKENS.blueprint.ink};
    --hud-surface: ${HUD_THEME_TOKENS.blueprint.surface};
    --hud-surface-alt: ${HUD_THEME_TOKENS.blueprint.surfaceAlt};
    --hud-rule: ${HUD_THEME_TOKENS.blueprint.rule};
    --hud-rule-strong: ${HUD_THEME_TOKENS.blueprint.ruleStrong};
    --hud-text: ${HUD_THEME_TOKENS.blueprint.text};
    --hud-muted: ${HUD_THEME_TOKENS.blueprint.muted};
    --hud-data: ${HUD_THEME_TOKENS.blueprint.data};
    --hud-ok: ${HUD_THEME_TOKENS.blueprint.nominal};
    --hud-warn: ${HUD_THEME_TOKENS.blueprint.watch};
    --hud-alert: ${HUD_THEME_TOKENS.blueprint.alert};
    color-scheme: light;
  }
  .hudScene svg {
    display: block;
    width: max(100%, 960px);
    height: auto;
    background: var(--hud-ink);
    shape-rendering: geometricPrecision;
    text-rendering: geometricPrecision;
  }
  .hudScene text {
    user-select: none;
  }
  .hudScene__target {
    cursor: crosshair;
    outline: none;
  }
  .hudScene__target:focus-visible {
    filter: drop-shadow(0 0 3px var(--hud-text));
  }
  .hudScene--enter .hudScene__part {
    animation: hudScene-part-assemble ${PART_ASSEMBLY_MS}ms cubic-bezier(0.22, 1, 0.36, 1) var(--hud-part-delay) both;
  }
  .hudScene--enter .hudScene__callout {
    animation: hudScene-callout-reveal 160ms ease-out var(--hud-callout-delay) both;
  }
  @keyframes hudScene-part-assemble {
    from { transform: translateY(var(--hud-part-entry-shift)); }
    to { transform: translateY(0); }
  }
  @keyframes hudScene-callout-reveal {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  ${HUD_REDUCED_MOTION_CSS}
  @media print {
    .hudScene {
      overflow: visible;
    }
    .hudScene svg {
      width: 100%;
    }
  }
`;

export default function HudScene({ scene }: { scene: Scene }) {
  const [hot, setHot] = useState<HotTarget>(null);
  const [hasEntered, setHasEntered] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const leftPanels = scene.panels.filter((panel) => panel.column === "left");
  const rightPanels = scene.panels.filter((panel) => panel.column === "right");
  const safeSceneId = scene.id.replace(/[^a-zA-Z0-9_-]/g, "-") || "hud-scene";
  const gridId = `${safeSceneId}-grid`;
  const latticeId = `${safeSceneId}-lattice`;
  const ariaLabel = scene.subtitle
    ? `${scene.title}. ${scene.subtitle}`
    : scene.title;

  const yOf = (part: CorePart, explosion = scene.core.explosion) => {
    const spread = clamp(explosion, 0, 1);
    const centered = 0.5 + (clamp(part.offset, 0, 1) - 0.5) * spread;
    return CORE_Y1 - centered * (CORE_Y1 - CORE_Y0);
  };

  const partIsActive = (part: CorePart) =>
    hot?.kind === "part"
      ? hot.id === part.id
      : hot?.kind === "panel"
        ? hot.id === part.panelRef
        : false;

  const panelIsActive = (panel: HudPanel) =>
    hot?.kind === "panel"
      ? hot.id === panel.id
      : hot?.kind === "part"
        ? scene.core.parts.some(
            (part) => part.id === hot.id && part.panelRef === panel.id,
          )
        : false;

  const partsBackToFront = [...scene.core.parts].sort(
    (a, b) => b.offset - a.offset || b.index - a.index,
  );
  const partsBottomToTop = [...scene.core.parts].sort(
    (a, b) => a.offset - b.offset || a.index - b.index,
  );
  const partMotionOrder = new Map(
    partsBottomToTop.map((part, index) => [part.id, index]),
  );
  const motionStyle = {
    "--hud-callout-delay": `${PART_ASSEMBLY_MS + Math.max(0, partsBottomToTop.length - 1) * PART_STAGGER_MS}ms`,
  } as CSSProperties;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setHasEntered(true));
    return () => window.cancelAnimationFrame(frame);
  }, [scene.id]);

  return (
    <div
      className={`hudScene hudScene--${scene.theme}${hasEntered ? " hudScene--enter" : ""}`}
      style={motionStyle}
    >
      <style>{componentStyles}</style>
      <svg
        viewBox="0 0 1600 900"
        role="img"
        aria-label={ariaLabel}
        preserveAspectRatio="xMidYMid meet"
      >
        <title>{ariaLabel}</title>
        <defs>
          <pattern
            id={gridId}
            width={40}
            height={40}
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M40 0 H0 V40"
              fill="none"
              stroke="var(--hud-rule)"
              strokeWidth={STROKE.structure}
              strokeOpacity={0.58}
            />
          </pattern>
          <pattern
            id={latticeId}
            width={14}
            height={12}
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M7 0 L14 3.5 L14 8.5 L7 12 L0 8.5 L0 3.5 Z"
              fill="none"
              stroke="var(--hud-rule-strong)"
              strokeWidth={STROKE.structure}
            />
          </pattern>
        </defs>

        <rect width={W} height={H} fill="var(--hud-ink)" />
        <rect
          x={CORE_X0}
          y={CORE_Y0 - 12}
          width={CORE_X1 - CORE_X0}
          height={CORE_Y1 - CORE_Y0 + 40}
          fill={`url(#${gridId})`}
          stroke="none"
        />

        <g aria-label="En-tête de la scène">
          <text
            x={PAD}
            y={43}
            fontSize={20}
            fill="var(--hud-text)"
            fontFamily="var(--hud-label)"
            letterSpacing={3}
          >
            {shorten(scene.title.toUpperCase(), 32)}
          </text>
          {scene.subtitle && (
            <text
              x={PAD}
              y={64}
              fontSize={11}
              fill="var(--hud-muted)"
              fontFamily="var(--hud-mono)"
            >
              {shorten(scene.subtitle, 64)}
            </text>
          )}
          {(scene.status ?? []).slice(0, 6).map((chip, index, chips) => (
            <g
              key={`${chip.label}-${index}`}
              transform={`translate(${W - PAD - (chips.length - index) * 144} 28)`}
            >
              <text
                x={0}
                y={11}
                fontSize={9}
                fill="var(--hud-muted)"
              fontFamily="var(--hud-label)"
              letterSpacing={1.3}
              >
                {shorten(chip.label.toUpperCase(), 14)}
              </text>
              <text
                x={0}
                y={31}
                fontSize={13}
                fill={chip.severity ? stateColor(chip.severity) : "var(--hud-text)"}
                fontFamily="var(--hud-mono)"
              >
                {shorten(chip.value, 15)}
              </text>
            </g>
          ))}
          <line
            x1={PAD}
            y1={84}
            x2={W - PAD}
            y2={84}
            stroke="var(--hud-rule)"
            strokeWidth={STROKE.structure}
          />
        </g>

        <line
          x1={CX}
          y1={CORE_Y0 - 24}
          x2={CX}
          y2={CORE_Y1 + 40}
          stroke="var(--hud-rule-strong)"
          strokeWidth={STROKE.structure}
          strokeDasharray="8 7"
          aria-hidden="true"
        />

        {partsBackToFront.map((part) => (
          <PartView
            key={part.id}
            part={part}
            y={yOf(part)}
            entryShift={yOf(part, 0) - yOf(part)}
            entryDelay={(partMotionOrder.get(part.id) ?? 0) * PART_STAGGER_MS}
            active={partIsActive(part)}
            patternId={latticeId}
            onHot={setHot}
          />
        ))}
        {partsBottomToTop.map((part) => (
          <CalloutLine
            key={`callout-${part.id}`}
            part={part}
            y={yOf(part)}
            active={partIsActive(part)}
          />
        ))}

        {leftPanels.map((panel, index) => (
          <PanelView
            key={panel.id}
            panel={panel}
            x={LEFT_X}
            y={104 + index * (PANEL_H + PANEL_GAP)}
            active={panelIsActive(panel)}
            reducedMotion={reducedMotion}
            onHot={setHot}
          />
        ))}
        {rightPanels.map((panel, index) => (
          <PanelView
            key={panel.id}
            panel={panel}
            x={RIGHT_X}
            y={104 + index * (PANEL_H + PANEL_GAP)}
            active={panelIsActive(panel)}
            reducedMotion={reducedMotion}
            onHot={setHot}
          />
        ))}

        {scene.bom && scene.bom.length > 0 && (
          <g transform={`translate(${CORE_X0} ${CORE_Y1 + 58})`}>
            <text
              x={0}
              y={0}
              fontSize={9.5}
              fill="var(--hud-muted)"
              fontFamily="var(--hud-label)"
              letterSpacing={1.6}
            >
              NOMENCLATURE
            </text>
            {scene.bom.slice(0, 6).map((entry, index) => (
              <g
                key={`${entry.ref}-${index}`}
                transform={`translate(${(index % 3) * 268} ${18 + Math.floor(index / 3) * 20})`}
              >
                <text
                  x={0}
                  y={0}
                  fontSize={9.5}
                  fill="var(--hud-muted)"
                  fontFamily="var(--hud-mono)"
                >
                  {String(entry.index).padStart(2, "0")} · {shorten(entry.ref, 12)}
                </text>
                <text
                  x={104}
                  y={0}
                  fontSize={10}
                  fill="var(--hud-text)"
                  fontFamily="var(--hud-label)"
                  letterSpacing={0.7}
                >
                  {shorten(entry.label.toUpperCase(), 19)}
                </text>
              </g>
            ))}
          </g>
        )}

        {scene.updatedAt && (
          <text
            x={W - PAD}
            y={H - 16}
            textAnchor="end"
            fontSize={9}
            fill="var(--hud-muted)"
            fontFamily="var(--hud-mono)"
          >
            MAJ {shorten(scene.updatedAt, 32)}
          </text>
        )}
      </svg>
    </div>
  );
}
