import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  type EasingFunction,
} from "remotion";
import { formatCount } from "@/lib/format";
import {
  C,
  CONFIDENCE_LEVEL,
  EASE_OUT,
  FONT,
  GRADE_COLORS,
  SCALE,
  TRACKING,
  type FilmScale,
} from "./theme";
import type { FilmConfidence, FilmGrade, FilmLayout } from "./types";

/**
 * Primitives du film — toutes pilotées par `useCurrentFrame()` : aucune
 * transition ni animation CSS, sinon le rendu image par image, la mise en
 * pause et le saut de chapitre divergeraient.
 */

/** Orientation et échelle typographique de la composition courante. */
export function useLayout(): {
  layout: FilmLayout;
  s: FilmScale;
  width: number;
  height: number;
} {
  const { width, height } = useVideoConfig();
  const layout: FilmLayout = height > width ? "portrait" : "paysage";
  return { layout, s: SCALE[layout], width, height };
}

/**
 * Zone utile d'un chapitre : sous le cartouche, au-dessus du pied, dans les
 * marges latérales. Toute scène pose son contenu dedans.
 */
export function SceneArea({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  const { s } = useLayout();
  return (
    <AbsoluteFill
      style={{
        padding: `${s.padTop}px ${s.padX}px ${s.padBottom}px`,
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      {children}
    </AbsoluteFill>
  );
}

/**
 * Fichier de `public/` (« /images/hud/x.webp ») : servi tel quel par le site
 * dans le lecteur, préfixé par le serveur de rendu au rendu MP4.
 */
export function filmAsset(src: string): string {
  return staticFile(src.replace(/^\/+/, ""));
}

/** Interpolation bornée — la forme utilisée partout dans le film. */
export function ramp(
  frame: number,
  range: [number, number],
  output: [number, number] = [0, 1],
  easing: EasingFunction = EASE_OUT,
): number {
  return interpolate(frame, range, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
}

/** Apparition fondu + montée, à partir de l'image `at` (relative à la séquence). */
export function Reveal({
  at,
  dur = 18,
  y = 24,
  x = 0,
  style,
  children,
}: {
  at: number;
  dur?: number;
  y?: number;
  x?: number;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const frame = useCurrentFrame();
  const p = ramp(frame, [at, at + dur]);
  return (
    <div
      style={{
        opacity: p,
        translate: `${(1 - p) * x}px ${(1 - p) * y}px`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Étiquette mono capitales — la voix « dossier » du site. */
export function MonoLabel({
  children,
  color = C.inkFaint,
  size,
  style,
}: {
  children: ReactNode;
  color?: string;
  size?: number;
  style?: CSSProperties;
}) {
  const { s } = useLayout();
  return (
    <span
      style={{
        fontFamily: FONT.mono,
        fontSize: size ?? s.label,
        letterSpacing: TRACKING.label,
        textTransform: "uppercase",
        color,
        lineHeight: 1.35,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/** Filet horizontal tracé de gauche à droite. */
export function Rule({
  at,
  dur = 24,
  color = C.lineBright,
  thickness = 2,
  style,
}: {
  at: number;
  dur?: number;
  color?: string;
  thickness?: number;
  style?: CSSProperties;
}) {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        height: thickness,
        background: color,
        transformOrigin: "left center",
        scale: `${ramp(frame, [at, at + dur])} 1`,
        ...style,
      }}
    />
  );
}

/** Repère de section du site : « 02  DÉMONSTRATION ———— ». */
export function SectionMarker({
  index,
  label,
  at,
  tone = "dark",
}: {
  index: string;
  label: string;
  at: number;
  tone?: "dark" | "paper";
}) {
  const frame = useCurrentFrame();
  const { s } = useLayout();
  const p = ramp(frame, [at, at + 16]);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: s.label * 0.9,
        opacity: p,
      }}
    >
      <MonoLabel color={tone === "paper" ? C.accentPaper : C.accent}>
        {index}
      </MonoLabel>
      <MonoLabel
        color={tone === "paper" ? C.inkPaper : C.ink}
        style={{ letterSpacing: "0.24em" }}
      >
        {label}
      </MonoLabel>
      <Rule
        at={at + 6}
        dur={30}
        color={tone === "paper" ? C.linePaper : C.lineBright}
        style={{ flex: 1 }}
      />
    </div>
  );
}

/** Texte tapé caractère par caractère, curseur bloc clignotant. */
export function Typewriter({
  text,
  at,
  cps = 38,
  caret = true,
  style,
}: {
  text: string;
  at: number;
  /** Caractères par seconde. */
  cps?: number;
  caret?: boolean;
  style?: CSSProperties;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shown = Math.max(
    0,
    Math.min(text.length, Math.floor(((frame - at) / fps) * cps)),
  );
  const typing = shown < text.length;
  const blinkOn = Math.floor(frame / 15) % 2 === 0;
  return (
    <span style={style}>
      {text.slice(0, shown)}
      {/* Curseur de largeur nulle dans le flux : le texte ne bouge pas. */}
      {caret && frame >= at && (typing || blinkOn) ? (
        <span
          aria-hidden="true"
          style={{ display: "inline-block", width: 0, position: "relative" }}
        >
          <span
            style={{
              position: "absolute",
              left: "0.06em",
              top: "-0.82em",
              width: "0.42em",
              height: "0.92em",
              background: C.accent,
            }}
          />
        </span>
      ) : null}
      {/* Le reste occupe déjà sa place : la ligne ne se recompose pas. */}
      <span style={{ visibility: "hidden" }}>{text.slice(shown)}</span>
    </span>
  );
}

/**
 * Tracé progressif d'un chemin SVG : poser `pathLength={1}` sur le chemin et
 * étaler ces propriétés dans son `style`.
 */
export function strokeDraw(
  frame: number,
  at: number,
  dur: number,
): CSSProperties {
  return {
    strokeDasharray: 1,
    strokeDashoffset: 1 - ramp(frame, [at, at + dur]),
  };
}

/** Compteur qui monte jusqu'à `value`, mis en forme à la française. */
export function CountUp({
  value,
  at,
  dur = 36,
  style,
}: {
  value: number;
  at: number;
  dur?: number;
  style?: CSSProperties;
}) {
  const frame = useCurrentFrame();
  const current = ramp(frame, [at, at + dur], [0, value]);
  return (
    <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>
      {formatCount(current)}
    </span>
  );
}

/** Les trois barres de confiance du site : haute ███, moyenne ██░, faible █░░. */
export function ConfidenceDashes({
  confidence,
  at,
  tone = "dark",
  size = 1,
}: {
  confidence: FilmConfidence;
  at: number;
  tone?: "dark" | "paper";
  size?: number;
}) {
  const frame = useCurrentFrame();
  const level = CONFIDENCE_LEVEL[confidence];
  const on = tone === "paper" ? C.accentPaper : C.accent;
  const off = tone === "paper" ? C.linePaper : C.lineBright;
  return (
    <span style={{ display: "inline-flex", gap: 8 * size }} aria-hidden="true">
      {[0, 1, 2].map((i) => {
        const p = ramp(frame, [at + i * 6, at + i * 6 + 10]);
        return (
          <span
            key={i}
            style={{
              width: 30 * size,
              height: 7 * size,
              background: i < level ? on : off,
              opacity: 0.25 + 0.75 * p,
            }}
          />
        );
      })}
    </span>
  );
}

/** Tampon d'archive qui s'abat sur le document. */
export function Stamp({
  children,
  at,
  color = C.stamp,
  rotate = -4,
  size,
}: {
  children: ReactNode;
  at: number;
  color?: string;
  rotate?: number;
  size?: number;
}) {
  const frame = useCurrentFrame();
  const { s } = useLayout();
  const p = ramp(frame, [at, at + 8]);
  return (
    <span
      style={{
        display: "inline-block",
        border: `4px solid ${color}`,
        color,
        padding: "0.35em 0.7em",
        fontFamily: FONT.mono,
        fontWeight: 600,
        fontSize: size ?? s.label * 1.15,
        letterSpacing: TRACKING.label,
        textTransform: "uppercase",
        opacity: frame < at ? 0 : 0.35 + 0.65 * p,
        rotate: `${rotate}deg`,
        scale: String(1.7 - 0.7 * p),
      }}
    >
      {children}
    </span>
  );
}

/** Palier A–E : lettre sur pavé de la couleur du palier. */
export function GradeChip({
  grade,
  at,
  size = 64,
}: {
  grade: FilmGrade;
  at: number;
  size?: number;
}) {
  const frame = useCurrentFrame();
  const p = ramp(frame, [at, at + 12]);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        background: GRADE_COLORS[grade],
        color: C.ink,
        fontFamily: FONT.mono,
        fontWeight: 600,
        fontSize: size * 0.5,
        opacity: p,
        scale: String(0.6 + 0.4 * p),
      }}
    >
      {grade}
    </span>
  );
}

/** Marques de repérage d'imprimeur aux quatre angles — signature « dossier ». */
export function RegistrationMarks({
  inset = 0,
  size = 22,
  color = C.lineBright,
  weight = 2,
}: {
  inset?: number;
  size?: number;
  color?: string;
  weight?: number;
}) {
  const corner = (pos: CSSProperties): CSSProperties => ({
    position: "absolute",
    width: size,
    height: size,
    borderColor: color,
    borderStyle: "solid",
    borderWidth: 0,
    ...pos,
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <span style={corner({ left: inset, top: inset, borderLeftWidth: weight, borderTopWidth: weight })} />
      <span style={corner({ right: inset, top: inset, borderRightWidth: weight, borderTopWidth: weight })} />
      <span style={corner({ left: inset, bottom: inset, borderLeftWidth: weight, borderBottomWidth: weight })} />
      <span style={corner({ right: inset, bottom: inset, borderRightWidth: weight, borderBottomWidth: weight })} />
    </AbsoluteFill>
  );
}

/** Panneau du site : fond légèrement relevé, filet, marques de repérage. */
export function Panel({
  children,
  style,
  tone = "dark",
  marks = true,
}: {
  children: ReactNode;
  style?: CSSProperties;
  tone?: "dark" | "paper";
  marks?: boolean;
}) {
  return (
    <div
      style={{
        position: "relative",
        background: tone === "paper" ? C.paper : C.panel,
        border: `2px solid ${tone === "paper" ? C.linePaper : C.lineBright}`,
        ...style,
      }}
    >
      {marks ? (
        <RegistrationMarks
          inset={-2}
          color={tone === "paper" ? C.inkPaperDim : C.inkFaint}
        />
      ) : null}
      {children}
    </div>
  );
}

const NOISE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E";

/** Grain de film : texture fixe décalée toutes les deux images (déterministe). */
export function Grain({ opacity = 0.07 }: { opacity?: number }) {
  const frame = useCurrentFrame();
  const step = Math.floor(frame / 2);
  // Décalages pseudo-aléatoires mais reproductibles d'une lecture à l'autre.
  const x = (step * 73) % 220;
  const y = (step * 151) % 220;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundImage: `url("${NOISE}")`,
        backgroundPosition: `${x}px ${y}px`,
        opacity,
        mixBlendMode: "overlay",
      }}
    />
  );
}

/**
 * Le drone du film — d'après la schématique « eurodrone » de
 * `components/system-schematic.tsx` (vue de dessus, dessin au trait), pour
 * rester dans la grammaire graphique du site. `draw` (0→1) trace la silhouette.
 */
export function FilmDrone({
  size,
  draw = 1,
  color = C.ink,
  accent = C.accent,
  strokeWidth = 1.6,
  style,
}: {
  size: number;
  draw?: number;
  color?: string;
  accent?: string;
  strokeWidth?: number;
  style?: CSSProperties;
}) {
  const dash = (delay: number): CSSProperties => {
    const p = Math.min(1, Math.max(0, (draw - delay) / (1 - delay)));
    return { strokeDasharray: 1, strokeDashoffset: 1 - p };
  };
  return (
    <svg
      viewBox="0 0 240 240"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={style}
    >
      <line
        x1="120"
        y1="20"
        x2="120"
        y2="226"
        stroke={accent}
        strokeWidth={strokeWidth * 0.6}
        strokeDasharray="2 5"
        style={{ opacity: Math.min(1, draw * 2) }}
      />
      <rect x="111" y="34" width="18" height="172" rx="9" pathLength={1} style={dash(0)} />
      <circle cx="120" cy="45" r="9" pathLength={1} style={dash(0.15)} />
      <path d="M26 106 L111 98 L111 114 L28 122 Z" pathLength={1} style={dash(0.2)} />
      <path d="M214 106 L129 98 L129 114 L212 122 Z" pathLength={1} style={dash(0.2)} />
      <rect x="70" y="99" width="13" height="26" rx="3" pathLength={1} style={dash(0.45)} />
      <rect x="157" y="99" width="13" height="26" rx="3" pathLength={1} style={dash(0.45)} />
      <path d="M112 192 L88 218" pathLength={1} style={dash(0.55)} />
      <path d="M128 192 L152 218" pathLength={1} style={dash(0.55)} />
      <ellipse cx="120" cy="208" rx="20" ry="4" stroke={accent} pathLength={1} style={dash(0.65)} />
    </svg>
  );
}
