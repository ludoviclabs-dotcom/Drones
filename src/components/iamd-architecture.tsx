import type { RadarRole } from "@/data/types";

// Architecture IAMD — vue d'ensemble pédagogique du graphe Capteurs → C2 →
// Effecteurs. Style SVG inline hand-drawn, cohérent avec les schématiques
// système (system-schematic.tsx) et les emblèmes domaine (domain-emblem.tsx).
//
// Pour mettre en relief la position d'un radar particulier, passer son
// `radarRole` à `highlightRadarRole`. Pour souligner les chemins C2,
// utiliser `highlightFrameworks` (clés correspondant à integrationFrameworks
// des fiches).

type SensorKey = RadarRole;
type C2Key =
  | "NATINAMDS"
  | "IBCS"
  | "Aegis"
  | "NASAMS"
  | "SAMP-T"
  | "Iron Dome";
type EffectorKey =
  | "SAM longue portée"
  | "SAM moyenne portée"
  | "VSHORAD / C-UAS"
  | "Intercepteurs BMD"
  | "SEAD / Air-air";

const SENSOR_LABELS: Record<SensorKey, string> = {
  "alerte-avancee": "Alerte avancée",
  "multi-mission": "Multi-mission",
  "naval-mfr": "Naval MFR",
  bmd: "BMD",
  "aeroporte-aesa": "Aéroporté",
  cuas: "C-UAS",
};

const C2_ORDER: C2Key[] = [
  "NATINAMDS",
  "IBCS",
  "Aegis",
  "NASAMS",
  "SAMP-T",
  "Iron Dome",
];

const EFFECTOR_ORDER: EffectorKey[] = [
  "Intercepteurs BMD",
  "SAM longue portée",
  "SAM moyenne portée",
  "VSHORAD / C-UAS",
  "SEAD / Air-air",
];

const SENSOR_ORDER: SensorKey[] = [
  "alerte-avancee",
  "multi-mission",
  "naval-mfr",
  "bmd",
  "aeroporte-aesa",
  "cuas",
];

// Position des nœuds dans le viewBox 800×520
const SENSOR_X = 90;
const C2_X = 400;
const EFFECTOR_X = 710;

const SENSOR_Y: Record<SensorKey, number> = {
  "alerte-avancee": 60,
  "multi-mission": 140,
  "naval-mfr": 220,
  bmd: 300,
  "aeroporte-aesa": 380,
  cuas: 460,
};

const C2_Y: Record<C2Key, number> = {
  NATINAMDS: 60,
  IBCS: 140,
  Aegis: 220,
  NASAMS: 300,
  "SAMP-T": 380,
  "Iron Dome": 460,
};

const EFFECTOR_Y: Record<EffectorKey, number> = {
  "Intercepteurs BMD": 80,
  "SAM longue portée": 180,
  "SAM moyenne portée": 270,
  "VSHORAD / C-UAS": 360,
  "SEAD / Air-air": 450,
};

// Liens capteur → C2 : modèle simplifié des cohérences doctrinales publiques.
// Un capteur peut être branché à plusieurs C2, ce qui reflète la réalité
// observée (le GM200 par exemple est compatible NATINAMDS, NASAMS et SAMP-T).
const SENSOR_TO_C2: Record<SensorKey, C2Key[]> = {
  "alerte-avancee": ["NATINAMDS", "Aegis"],
  "multi-mission": ["NATINAMDS", "IBCS", "NASAMS", "SAMP-T"],
  "naval-mfr": ["Aegis", "NATINAMDS"],
  bmd: ["NATINAMDS", "IBCS"],
  "aeroporte-aesa": ["NATINAMDS", "Aegis"],
  cuas: ["IBCS", "NATINAMDS", "Iron Dome"],
};

// Liens C2 → effecteur : cohérences les plus structurantes documentées.
const C2_TO_EFFECTOR: Record<C2Key, EffectorKey[]> = {
  NATINAMDS: [
    "Intercepteurs BMD",
    "SAM longue portée",
    "SAM moyenne portée",
    "SEAD / Air-air",
  ],
  IBCS: [
    "Intercepteurs BMD",
    "SAM longue portée",
    "SAM moyenne portée",
    "VSHORAD / C-UAS",
  ],
  Aegis: [
    "Intercepteurs BMD",
    "SAM longue portée",
    "SAM moyenne portée",
  ],
  NASAMS: ["SAM moyenne portée", "VSHORAD / C-UAS"],
  "SAMP-T": ["SAM longue portée", "SAM moyenne portée"],
  "Iron Dome": ["VSHORAD / C-UAS", "SAM moyenne portée"],
};

export function IamdArchitecture({
  highlightRadarRole,
  highlightFrameworks,
  className = "",
}: {
  highlightRadarRole?: RadarRole;
  highlightFrameworks?: string[];
  className?: string;
}) {
  const highlightedC2 = new Set<C2Key>(
    (highlightFrameworks ?? []).filter((f): f is C2Key =>
      C2_ORDER.includes(f as C2Key),
    ),
  );

  const isSensorLit = (s: SensorKey) => s === highlightRadarRole;
  const isC2Lit = (c: C2Key) =>
    highlightedC2.has(c) ||
    (highlightRadarRole != null && SENSOR_TO_C2[highlightRadarRole].includes(c));
  const isLinkSensorC2Lit = (s: SensorKey, c: C2Key) =>
    isSensorLit(s) && SENSOR_TO_C2[s].includes(c);
  const isEffectorLit = (e: EffectorKey) => {
    if (highlightRadarRole == null && highlightedC2.size === 0) return false;
    const litC2 = new Set<C2Key>(highlightedC2);
    if (highlightRadarRole != null) {
      for (const c of SENSOR_TO_C2[highlightRadarRole]) litC2.add(c);
    }
    return [...litC2].some((c) => C2_TO_EFFECTOR[c].includes(e));
  };
  const isLinkC2EffectorLit = (c: C2Key, e: EffectorKey) =>
    isC2Lit(c) && C2_TO_EFFECTOR[c].includes(e);

  return (
    <svg
      viewBox="0 0 800 520"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-label="Architecture IAMD — graphe capteurs, C2 et effecteurs"
      role="img"
    >
      {/* Bandeaux de colonnes */}
      <g className="text-ink-faint" stroke="currentColor" fill="none">
        <line x1={SENSOR_X} y1={20} x2={SENSOR_X} y2={500} strokeDasharray="2 6" />
        <line x1={C2_X} y1={20} x2={C2_X} y2={500} strokeDasharray="2 6" />
        <line x1={EFFECTOR_X} y1={20} x2={EFFECTOR_X} y2={500} strokeDasharray="2 6" />
      </g>

      <g
        fontFamily="ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.14em"
        textAnchor="middle"
        className="fill-accent"
        stroke="none"
      >
        <text x={SENSOR_X} y={14}>CAPTEURS</text>
        <text x={C2_X} y={14}>COMMANDEMENT</text>
        <text x={EFFECTOR_X} y={14}>EFFECTEURS</text>
      </g>

      {/* Liens capteur → C2 */}
      <g>
        {SENSOR_ORDER.flatMap((sensor) =>
          SENSOR_TO_C2[sensor].map((c2) => {
            const lit = isLinkSensorC2Lit(sensor, c2);
            return (
              <line
                key={`s-${sensor}-${c2}`}
                x1={SENSOR_X + 70}
                y1={SENSOR_Y[sensor]}
                x2={C2_X - 70}
                y2={C2_Y[c2]}
                stroke="currentColor"
                strokeOpacity={lit ? 1 : 0.18}
                className={lit ? "text-accent" : "text-ink-faint"}
                strokeWidth={lit ? 1.5 : 0.8}
              />
            );
          }),
        )}
      </g>

      {/* Liens C2 → effecteur */}
      <g>
        {C2_ORDER.flatMap((c2) =>
          C2_TO_EFFECTOR[c2].map((e) => {
            const lit = isLinkC2EffectorLit(c2, e);
            return (
              <line
                key={`e-${c2}-${e}`}
                x1={C2_X + 70}
                y1={C2_Y[c2]}
                x2={EFFECTOR_X - 70}
                y2={EFFECTOR_Y[e]}
                stroke="currentColor"
                strokeOpacity={lit ? 1 : 0.18}
                className={lit ? "text-accent" : "text-ink-faint"}
                strokeWidth={lit ? 1.5 : 0.8}
              />
            );
          }),
        )}
      </g>

      {/* Nœuds capteurs */}
      <g>
        {SENSOR_ORDER.map((sensor) => {
          const lit = isSensorLit(sensor);
          return (
            <g key={`sn-${sensor}`}>
              <rect
                x={SENSOR_X - 70}
                y={SENSOR_Y[sensor] - 18}
                width={140}
                height={36}
                rx={2}
                stroke="currentColor"
                strokeWidth={lit ? 1.6 : 1}
                fill={lit ? "rgba(210, 104, 60, 0.12)" : "transparent"}
                className={lit ? "text-accent" : "text-ink-dim"}
              />
              <text
                x={SENSOR_X}
                y={SENSOR_Y[sensor] + 4}
                fontFamily="ui-monospace, monospace"
                fontSize="11"
                letterSpacing="0.08em"
                textAnchor="middle"
                stroke="none"
                className={lit ? "fill-accent" : "fill-ink"}
              >
                {SENSOR_LABELS[sensor]}
              </text>
            </g>
          );
        })}
      </g>

      {/* Nœuds C2 */}
      <g>
        {C2_ORDER.map((c2) => {
          const lit = isC2Lit(c2);
          return (
            <g key={`c-${c2}`}>
              <rect
                x={C2_X - 70}
                y={C2_Y[c2] - 18}
                width={140}
                height={36}
                rx={2}
                stroke="currentColor"
                strokeWidth={lit ? 1.6 : 1}
                fill={lit ? "rgba(210, 104, 60, 0.12)" : "transparent"}
                className={lit ? "text-accent" : "text-ink-dim"}
              />
              <text
                x={C2_X}
                y={C2_Y[c2] + 4}
                fontFamily="ui-monospace, monospace"
                fontSize="11"
                letterSpacing="0.08em"
                textAnchor="middle"
                stroke="none"
                className={lit ? "fill-accent" : "fill-ink"}
              >
                {c2}
              </text>
            </g>
          );
        })}
      </g>

      {/* Nœuds effecteurs */}
      <g>
        {EFFECTOR_ORDER.map((e) => {
          const lit = isEffectorLit(e);
          return (
            <g key={`e-${e}`}>
              <rect
                x={EFFECTOR_X - 80}
                y={EFFECTOR_Y[e] - 18}
                width={160}
                height={36}
                rx={2}
                stroke="currentColor"
                strokeWidth={lit ? 1.6 : 1}
                fill={lit ? "rgba(210, 104, 60, 0.12)" : "transparent"}
                className={lit ? "text-accent" : "text-ink-dim"}
              />
              <text
                x={EFFECTOR_X}
                y={EFFECTOR_Y[e] + 4}
                fontFamily="ui-monospace, monospace"
                fontSize="11"
                letterSpacing="0.08em"
                textAnchor="middle"
                stroke="none"
                className={lit ? "fill-accent" : "fill-ink"}
              >
                {e}
              </text>
            </g>
          );
        })}
      </g>

      {/* Légende bas */}
      <g
        fontFamily="ui-monospace, monospace"
        fontSize="9"
        letterSpacing="0.12em"
        className="fill-ink-faint"
        stroke="none"
        textAnchor="middle"
      >
        <text x={400} y={510}>
          Graphe pédagogique — un capteur peut alimenter plusieurs C2 ; chaque C2 désigne ses effecteurs propres.
        </text>
      </g>
    </svg>
  );
}
