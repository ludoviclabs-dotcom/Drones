import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { formatCount } from "@/lib/format";
import type { FilmConfidence, SceneProps } from "../types";
import { chapterById } from "../timeline";
import { C, CONFIDENCE_LEVEL, FONT } from "../theme";
import {
  ConfidenceDashes,
  CountUp,
  MonoLabel,
  RegistrationMarks,
  Reveal,
  Rule,
  SceneArea,
  SectionMarker,
  Stamp,
  Typewriter,
  ramp,
  strokeDraw,
  useLayout,
} from "../primitives";

/**
 * 03 · La preuve (14 s) — insert papier, comme la section Méthode du site :
 * une affirmation réelle du registre remonte à sa source, à sa date et à son
 * niveau de confiance, puis reçoit son tampon de statut.
 *
 *   0–40    la feuille se pose, repère de section, titre
 *   44–90   01 Affirmation : dossier, angle, libellé, valeur tapée
 *   96–190  fil cuivre → 02 Source : éditeur, type, titre, fiabilité, date
 *   196–260 fil cuivre → 03 Confiance : trois barres, libellé, échelle
 *   268     le tampon du statut s'abat sur l'affirmation
 *   296–366 ligne de registre : affirmations tracées, vérifiées, sources
 *   366–420 synthèse stable (image clé : 390)
 */

const T = {
  marker: 6,
  title: 14,
  claim: 44,
  claimValue: 58,
  thread1: 96,
  source: 118,
  sourceTitle: 132,
  reliability: 152,
  date: 170,
  thread2: 196,
  confidence: 220,
  dashes: 230,
  confidenceLabel: 244,
  scale: 252,
  stamp: 268,
  registry: 296,
} as const;

const THREAD_DUR = 26;
const SCALE_LEVELS: FilmConfidence[] = ["haute", "moyenne", "faible"];

/** Passage du titre souligné au cuivre quand le maillon correspondant se pose. */
function Underlined({ at, children }: { at: number; children: ReactNode }) {
  const frame = useCurrentFrame();
  const p = ramp(frame, [at, at + 20]);
  return (
    <span
      style={{
        whiteSpace: "nowrap",
        backgroundImage: `linear-gradient(${C.accentPaper}, ${C.accentPaper})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "0 92%",
        backgroundSize: `${p * 100}% 0.05em`,
      }}
    >
      {children}
    </span>
  );
}

/**
 * Compteur à largeur réservée : la valeur finale, invisible, tient la place,
 * pour que la ligne de registre ne bouge pas pendant le comptage.
 */
function StableCount({ value, at, dur }: { value: number; at: number; dur: number }) {
  return (
    <span style={{ display: "inline-grid", fontVariantNumeric: "tabular-nums" }}>
      <span style={{ gridArea: "1 / 1", visibility: "hidden" }}>{formatCount(value)}</span>
      <CountUp value={value} at={at} dur={dur} style={{ gridArea: "1 / 1", textAlign: "right" }} />
    </span>
  );
}

/** Maillon de la chaîne : carton d'archive, filet, marques de repérage. */
function ChainCard({
  index,
  label,
  at,
  pad,
  aside,
  overlay,
  children,
  style,
}: {
  index: string;
  label: string;
  at: number;
  pad: number;
  aside?: ReactNode;
  /** Élément posé en absolu dans le carton (hors flux). */
  overlay?: ReactNode;
  children: ReactNode;
  style?: CSSProperties;
}) {
  const frame = useCurrentFrame();
  const { layout, s } = useLayout();
  const portrait = layout === "portrait";
  const p = ramp(frame, [at, at + 18]);
  const shift = (1 - p) * 22;
  return (
    <div
      style={{
        position: "relative",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        padding: pad,
        background: C.paper,
        border: `2px solid ${C.linePaper}`,
        opacity: p,
        translate: portrait ? `0 ${shift}px` : `${-shift}px 0`,
        ...style,
      }}
    >
      <RegistrationMarks inset={-2} color={C.inkPaperDim} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: s.label * 0.7 }}>
          <MonoLabel color={C.accentPaper}>{index}</MonoLabel>
          <MonoLabel color={C.inkPaper} style={{ letterSpacing: "0.2em" }}>
            {label}
          </MonoLabel>
        </span>
        {aside}
      </div>
      {children}
      {overlay}
    </div>
  );
}

/**
 * Fil cuivre entre deux maillons : il part du bord du carton, se trace, et
 * se ferme sur un œillet à l'arrivée.
 */
function Thread({
  at,
  vertical,
  length,
  offset,
}: {
  at: number;
  vertical: boolean;
  /** Longueur du fil, en px. */
  length: number;
  /** Position du fil sur l'axe transverse (hauteur de l'en-tête des cartons). */
  offset: number;
}) {
  const frame = useCurrentFrame();
  const r = 6;
  const start = ramp(frame, [at, at + 4]);
  const end = ramp(frame, [at + THREAD_DUR - 4, at + THREAD_DUR]);
  const w = vertical ? offset * 2 : length;
  const h = vertical ? length : offset * 2;
  const d = vertical ? `M${offset} 0 V${length}` : `M0 ${offset} H${length}`;
  const [x0, y0] = vertical ? [offset, r] : [r, offset];
  const [x1, y1] = vertical ? [offset, length - r] : [length - r, offset];
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      aria-hidden="true"
      style={{ display: "block", overflow: "visible" }}
    >
      <path
        d={d}
        pathLength={1}
        fill="none"
        stroke={C.accentPaper}
        strokeWidth={3}
        style={strokeDraw(frame, at, THREAD_DUR)}
      />
      <circle cx={x0} cy={y0} r={r} fill={C.accentPaper} opacity={start} />
      <circle
        cx={x1}
        cy={y1}
        r={r}
        fill={C.paper}
        stroke={C.accentPaper}
        strokeWidth={3}
        opacity={end}
      />
    </svg>
  );
}

/** Ligne clé / valeur d'une fiche : clé mono, valeur serif. */
function Field({
  at,
  name,
  keyWidth,
  children,
}: {
  at: number;
  name: string;
  keyWidth: number;
  children: ReactNode;
}) {
  const { s } = useLayout();
  return (
    <Reveal at={at} y={10} dur={14}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
        <MonoLabel
          size={s.micro}
          color={C.inkPaperDim}
          style={{ width: keyWidth, flexShrink: 0 }}
        >
          {name}
        </MonoLabel>
        <span
          style={{
            fontFamily: FONT.serif,
            fontSize: s.body,
            lineHeight: 1.2,
            color: C.inkPaper,
          }}
        >
          {children}
        </span>
      </div>
    </Reveal>
  );
}

export function PreuveScene({ data }: SceneProps) {
  const frame = useCurrentFrame();
  const { layout, s } = useLayout();
  const portrait = layout === "portrait";
  const { proof, stats, dossier } = data;
  const { source } = proof;
  const chapter = chapterById("preuve");
  const level = CONFIDENCE_LEVEL[proof.confidence];

  // La feuille se pose entre deux bandes sombres : le cartouche (encre claire)
  // reste lisible en haut, le pied en bas — un document posé sur la table.
  const sheet = portrait
    ? { top: s.padTop - 10, bottom: s.padBottom - 22, side: 40 }
    : { top: s.padTop - 10, bottom: s.padBottom - 35, side: s.padX - 60 };
  const settle = ramp(frame, [0, 20]);
  const lift = (1 - settle) * 20;

  const pad = portrait ? 26 : 28;
  const headerMid = pad + (s.label * 1.35) / 2;
  const connector = portrait ? 40 : 48;
  const titleSize = portrait ? s.title * 0.9 : s.title * 0.86;

  // Le tampon fait légèrement plier le carton de l'affirmation à l'impact.
  const impact =
    ramp(frame, [T.stamp + 5, T.stamp + 8]) - ramp(frame, [T.stamp + 8, T.stamp + 18]);

  const registry = [
    { label: "affirmations tracées", value: stats.claims },
    { label: "vérifiées", value: stats.verified, accent: true },
    { label: "sources indexées", value: stats.sources },
  ];

  const stamp = (
    <Stamp at={T.stamp} color={C.accentPaper} rotate={-6} size={s.label * 1.25}>
      {proof.statusLabel}
    </Stamp>
  );

  const claimCard = (
    <ChainCard
      index="01"
      label="Affirmation"
      at={T.claim}
      pad={pad}
      // En 9:16, le tampon se pose sur l'en-tête du carton, hors flux.
      aside={
        portrait ? (
          <span
            style={{ height: 0, display: "flex", alignItems: "center", translate: "0 16px" }}
          >
            {stamp}
          </span>
        ) : undefined
      }
    >
      <Reveal at={T.claim + 6} y={8} dur={14} style={{ marginTop: portrait ? 18 : 20 }}>
        <MonoLabel size={s.micro} color={C.inkPaperDim}>
          {dossier.name} · {proof.angleLabel}
        </MonoLabel>
      </Reveal>
      <Reveal at={T.claim + 10} y={8} dur={14} style={{ marginTop: 6 }}>
        <span
          style={{
            fontFamily: FONT.sans,
            fontSize: s.body,
            fontWeight: 500,
            lineHeight: 1.2,
            color: C.inkPaper,
          }}
        >
          {proof.claimLabel}
        </span>
      </Reveal>
      <div
        style={{
          marginTop: portrait ? 10 : 14,
          fontFamily: FONT.serif,
          fontWeight: 400,
          fontSize: portrait ? s.figure * 0.82 : s.figure * 0.75,
          lineHeight: 1.1,
          letterSpacing: "-0.015em",
          color: C.inkPaper,
        }}
      >
        <Typewriter text={proof.value} at={T.claimValue} cps={44} caret={false} />
      </div>
      {portrait ? null : (
        <div
          style={{
            marginTop: "auto",
            paddingTop: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <Reveal at={T.claim + 14} y={0} dur={14}>
            <MonoLabel size={s.micro} color={C.inkPaperDim}>
              Statut au registre
            </MonoLabel>
          </Reveal>
          <span style={{ marginRight: -4 }}>{stamp}</span>
        </div>
      )}
    </ChainCard>
  );

  const keyWidth = s.micro * 9;
  const sourceCard = (
    <ChainCard
      index="02"
      label="Source"
      at={T.source}
      pad={pad}
      aside={
        <Reveal at={T.source + 10} y={0} dur={12}>
          <span
            style={{
              display: "inline-block",
              border: `2px solid ${C.linePaper}`,
              padding: "4px 12px",
            }}
          >
            <MonoLabel size={s.micro} color={C.inkPaperDim}>
              {source.typeLabel}
            </MonoLabel>
          </span>
        </Reveal>
      }
    >
      <Reveal at={T.source + 6} y={8} dur={14} style={{ marginTop: portrait ? 14 : 16 }}>
        <span
          style={{
            fontFamily: FONT.serif,
            fontSize: s.body * 1.15,
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
            color: C.inkPaper,
          }}
        >
          {source.publisher}
        </span>
      </Reveal>
      <Reveal at={T.sourceTitle} y={8} dur={16} style={{ marginTop: 8 }}>
        <span
          style={{
            display: "block",
            fontFamily: FONT.serif,
            fontStyle: "italic",
            fontSize: portrait ? s.body * 0.92 : s.body * 0.95,
            lineHeight: 1.22,
            color: C.inkPaperDim,
          }}
        >
          {`«\u00A0${source.title}\u00A0»`}
        </span>
      </Reveal>
      <Rule
        at={T.reliability - 6}
        dur={18}
        color={C.linePaper}
        style={{ marginTop: portrait ? 16 : 18, marginBottom: portrait ? 12 : 14 }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: portrait ? 4 : 6 }}>
        <Field at={T.reliability} name="Fiabilité" keyWidth={keyWidth}>
          <span style={{ fontFamily: FONT.mono, fontWeight: 600 }}>{source.reliability}</span>
          {` — ${source.reliabilityLabel}`}
        </Field>
        <Field at={T.date} name="Publication" keyWidth={keyWidth}>
          {source.dateLabel ? (
            source.dateLabel
          ) : (
            // Honnêteté du registre : une date absente n'est jamais déduite.
            <span style={{ fontStyle: "italic", color: C.inkPaperDim }}>
              date non publiée
            </span>
          )}
        </Field>
      </div>
    </ChainCard>
  );

  const confidenceMain = (
    <div
      style={{
        marginTop: portrait ? 18 : 26,
        display: "flex",
        flexDirection: "column",
        gap: portrait ? 14 : 16,
      }}
    >
      <ConfidenceDashes
        confidence={proof.confidence}
        at={T.dashes}
        tone="paper"
        size={2}
      />
      <Reveal at={T.confidenceLabel} y={8} dur={14}>
        <span
          style={{
            fontFamily: FONT.serif,
            fontSize: s.body * 1.15,
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
            color: C.inkPaper,
          }}
        >
          {proof.confidenceLabel}
        </span>
      </Reveal>
    </div>
  );

  // Échelle du site, le niveau de l'affirmation en encre pleine.
  const confidenceScale = (
    <Reveal at={T.scale} y={8} dur={14}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {SCALE_LEVELS.map((c) => {
          const current = CONFIDENCE_LEVEL[c] === level;
          return (
            <div
              key={c}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                opacity: current ? 1 : 0.62,
              }}
            >
              <ConfidenceDashes confidence={c} at={T.scale} tone="paper" size={0.8} />
              <MonoLabel size={s.micro} color={current ? C.inkPaper : C.inkPaperDim}>
                {c}
              </MonoLabel>
            </div>
          );
        })}
      </div>
    </Reveal>
  );

  const confidenceCard = (
    <ChainCard
      index="03"
      label="Confiance"
      at={T.confidence}
      pad={pad}
      // En 9:16, l'échelle se range à droite du carton, hors flux.
      overlay={
        portrait ? (
          <div style={{ position: "absolute", right: pad + 10, bottom: pad }}>
            {confidenceScale}
          </div>
        ) : undefined
      }
    >
      {confidenceMain}
      {portrait ? null : (
        <div style={{ marginTop: "auto", paddingTop: 18 }}>{confidenceScale}</div>
      )}
    </ChainCard>
  );

  const thread = (at: number) => (
    <div style={{ paddingLeft: portrait ? headerMid - 6 : 0 }}>
      <Thread
        at={at}
        vertical={portrait}
        length={connector}
        offset={portrait ? 6 : headerMid}
      />
    </div>
  );

  return (
    <>
      {/* La feuille, posée sur la table graphite. */}
      <AbsoluteFill style={{ background: C.bg }}>
        <div
          style={{
            position: "absolute",
            left: sheet.side,
            right: sheet.side,
            top: sheet.top,
            bottom: sheet.bottom,
            background: C.paper,
            boxShadow: "0 18px 48px rgba(0, 0, 0, 0.45)",
            // La feuille se pose sans glisser : elle ne mord ni le cartouche ni le pied.
            scale: String(0.985 + 0.015 * settle),
          }}
        />
      </AbsoluteFill>

      <SceneArea style={{ translate: `0 ${lift}px` }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            paddingTop: portrait ? 16 : 22,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <div style={{ flex: 1 }}>
              <SectionMarker
                index={chapter?.num ?? "03"}
                label="Méthode"
                at={T.marker}
                tone="paper"
              />
            </div>
            {portrait ? null : (
              <Reveal at={T.marker + 14} y={0} dur={14}>
                <MonoLabel size={s.micro} color={C.inkPaperDim}>
                  Extrait du registre · {dossier.reference}
                </MonoLabel>
              </Reveal>
            )}
          </div>

          <Reveal at={T.title} y={16} dur={24} style={{ marginTop: portrait ? 20 : 22 }}>
            <h2
              style={{
                margin: 0,
                // En 16:9, la coupure tombe après « une date ».
                maxWidth: portrait ? "100%" : titleSize * 18,
                fontFamily: FONT.serif,
                fontWeight: 400,
                fontSize: titleSize,
                lineHeight: 1.06,
                letterSpacing: "-0.02em",
                color: C.inkPaper,
              }}
            >
              Chaque chiffre porte <Underlined at={T.source + 4}>une source</Underlined>,{" "}
              <Underlined at={T.date + 2}>une date</Underlined> et{" "}
              <Underlined at={T.dashes}>un niveau de confiance</Underlined>.
            </h2>
          </Reveal>

          {/* Chaîne de preuve : affirmation → source → confiance. */}
          <div
            style={{
              marginTop: portrait ? 28 : 34,
              display: "grid",
              gridTemplateColumns: portrait
                ? "minmax(0, 1fr)"
                : `minmax(0, 1fr) ${connector}px minmax(0, 1.48fr) ${connector}px minmax(0, 0.68fr)`,
              gridTemplateRows: portrait
                ? `auto ${connector}px auto ${connector}px auto`
                : "auto",
              alignItems: "stretch",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                translate: `0 ${impact * 3}px`,
              }}
            >
              {claimCard}
            </div>
            {thread(T.thread1)}
            <div style={{ display: "flex", flexDirection: "column" }}>{sourceCard}</div>
            {thread(T.thread2)}
            <div style={{ display: "flex", flexDirection: "column" }}>{confidenceCard}</div>
          </div>

          <div style={{ flex: 1, minHeight: portrait ? 24 : 28 }} />

          {/* Ligne de registre — compteurs dérivés, jamais saisis. */}
          <Rule at={T.registry} dur={24} color={C.linePaper} />
          <div
            style={{
              marginTop: portrait ? 20 : 18,
              display: portrait ? "grid" : "flex",
              gridTemplateColumns: portrait ? "repeat(3, minmax(0, 1fr))" : undefined,
              alignItems: portrait ? "start" : "baseline",
              gap: portrait ? 20 : 56,
            }}
          >
            {portrait ? null : (
              <Reveal at={T.registry + 4} y={0} dur={14}>
                <MonoLabel size={s.micro} color={C.inkPaper}>
                  Au registre
                </MonoLabel>
              </Reveal>
            )}
            {registry.map((item, i) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  flexDirection: portrait ? "column" : "row",
                  alignItems: portrait ? "flex-start" : "baseline",
                  gap: portrait ? 8 : 16,
                  opacity: ramp(frame, [T.registry + 8 + i * 10, T.registry + 20 + i * 10]),
                }}
              >
                <span
                  style={{
                    fontFamily: FONT.mono,
                    fontSize: s.figure * 0.8,
                    lineHeight: 1,
                    color: item.accent ? C.accentPaper : C.inkPaper,
                  }}
                >
                  <StableCount value={item.value} at={T.registry + 10 + i * 10} dur={40} />
                </span>
                <MonoLabel size={s.micro} color={C.inkPaperDim}>
                  {item.label}
                </MonoLabel>
              </div>
            ))}
          </div>
        </div>
      </SceneArea>
    </>
  );
}
