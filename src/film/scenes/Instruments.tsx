import type { CSSProperties, ReactNode } from "react";
import { Easing, Img, useCurrentFrame } from "remotion";
import type { FilmBoard, FilmGraphRow, SceneProps } from "../types";
import { C, EASE_IN_OUT, FONT, type FilmScale } from "../theme";
import {
  MonoLabel,
  RegistrationMarks,
  Reveal,
  Rule,
  SceneArea,
  SectionMarker,
  filmAsset,
  ramp,
  useLayout,
} from "../primitives";

/**
 * 05 · Instruments (12 s) — passer du dossier à l'analyse : la planche-contact
 * des modèles 3D, passée à la loupe une planche après l'autre, puis le graphe
 * industriel qui relie chaque système à son industriel et à son pays.
 *
 *   0–24    titre « Manipuler, comparer, relier. »
 *   14–70   A · planche-contact : quatre vignettes, Ken Burns lent
 *   28–146  loupe : chaque planche agrandie tour à tour, case active au cuivre
 *   146–172 la loupe se replie dans sa case
 *   170–290 B · graphe : colonnes, boîtes, liens tracés, relations
 *   290–308 mention de cadre ; 308–360 synthèse stable (image clé : 330)
 */

const T = {
  title: 2,
  kicker: 12,
  markerA: 14,
  cells: 22,
  cellStep: 8,
  mentionA: 70,
  loupeIn: 28,
  flight: 146,
  flightDur: 26,
  markerB: 170,
  lede: 176,
  heads: 182,
  rows: 192,
  rowStep: 30,
  mentionB: 290,
  /** Fin du mouvement Ken Burns : l'image se pose avant la synthèse. */
  kenBurnsEnd: 318,
} as const;

/** Fondu enchaîné entre deux planches de la loupe. */
const SLIDE_FADE = 8;
/** Tracé d'un lien du graphe. */
const LINK_DUR = 20;
/** Agrandissement Ken Burns (1 → 1,06) et dérive maximale (part de la largeur). */
const KB_SCALE = 0.06;
const KB_DRIFT = 0.025;
/** Sens de dérive de chaque vignette : jamais deux voisines dans le même sens. */
const KB_DIRS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
];
/** La planche-contact est une grille 2 × 2, le graphe tient trois lignes. */
const MAX_BOARDS = 4;
const MAX_ROWS = 3;

const KB_EASE = Easing.inOut(Easing.sin);

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Géométrie de la scène, en pixels de la zone utile (sous le cartouche). */
interface Geo {
  /** Haut des deux blocs (repères de section A et B). */
  blocksTop: number;
  /** Planche-contact. */
  cellW: number;
  imgH: number;
  gapX: number;
  rowGap: number;
  captionH: number;
  gridTop: number;
  gridW: number;
  /** Haut de la mention « Représentations illustratives ». */
  mentionA: number;
  /** Bloc B (graphe) — occupé par la loupe pendant la première moitié. */
  b: Rect;
  /** Image de la loupe. */
  loupe: Rect;
  /** Légende de la loupe : sous l'image (16:9) ou à sa droite (9:16). */
  loupeCaption: Rect;
  titleSize: number;
  kindSize: number;
  nodeSize: number;
  /** Marge intérieure des boîtes, largeur minimale des liens. */
  nodePad: string;
  linkMin: number;
  /** Largeur maximale de la colonne « Industriel » (le nom passe à la ligne). */
  companyMax?: number;
  graphRowGap: number;
}

const HEAD = 52;

function geometry(portrait: boolean, w: number, h: number, s: FilmScale): Geo {
  if (portrait) {
    const blocksTop = 192;
    const gapX = 24;
    const cellW = (w - gapX) / 2;
    const imgH = Math.round((cellW * 9) / 16);
    const captionH = 118;
    const rowGap = 20;
    const gridTop = blocksTop + HEAD;
    const gridBottom = gridTop + 2 * (imgH + captionH) + rowGap;
    const mentionA = gridBottom + 14;
    const bTop = mentionA + 56;
    const loupe = { x: 0, y: bTop + HEAD, w: 640, h: 360 };
    return {
      blocksTop,
      cellW,
      imgH,
      gapX,
      rowGap,
      captionH,
      gridTop,
      gridW: w,
      mentionA,
      b: { x: 0, y: bTop, w, h: h - bTop },
      loupe,
      loupeCaption: {
        x: loupe.w + 28,
        y: loupe.y,
        w: w - loupe.w - 28,
        h: loupe.h,
      },
      titleSize: 34,
      kindSize: s.micro,
      nodeSize: 30,
      nodePad: "12px 14px",
      linkMin: 128,
      companyMax: 212,
      graphRowGap: 16,
    };
  }
  const blocksTop = 120;
  const gapX = 24;
  const cellW = 302;
  const imgH = Math.round((cellW * 9) / 16);
  const captionH = 109;
  const rowGap = 18;
  const gridTop = blocksTop + HEAD;
  const gridW = cellW * 2 + gapX;
  const mention = Math.ceil(s.micro * 1.35);
  const bX = gridW + 60;
  const bW = w - bX;
  const loupe = { x: bX, y: gridTop, w: bW, h: Math.round((bW * 9) / 16) };
  return {
    blocksTop,
    cellW,
    imgH,
    gapX,
    rowGap,
    captionH,
    gridTop,
    gridW,
    mentionA: h - mention,
    b: { x: bX, y: blocksTop, w: bW, h: h - blocksTop },
    loupe,
    loupeCaption: { x: bX, y: loupe.y + loupe.h + 14, w: bW, h: 44 },
    titleSize: 30,
    kindSize: s.micro,
    nodeSize: 30,
    nodePad: "14px 18px",
    linkMin: 140,
    graphRowGap: 32,
  };
}

/** Case `index` de la planche-contact (deux colonnes). */
function cellRect(geo: Geo, index: number): Rect {
  const col = index % 2;
  const row = Math.floor(index / 2);
  return {
    x: col * (geo.cellW + geo.gapX),
    y: geo.gridTop + row * (geo.imgH + geo.captionH + geo.rowGap),
    w: geo.cellW,
    h: geo.imgH,
  };
}

/** « Rafale F4 — chasseur et tir Meteor en 3D » → « Rafale F4 ». */
function shortTitle(title: string): string {
  return title.split(/\s+[—–]\s+/)[0] ?? title;
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** Image d'une planche, recadrée 16:9, en lent mouvement Ken Burns. */
function KenBurnsImg({
  board,
  progress,
  dir,
  width,
}: {
  board: FilmBoard;
  progress: number;
  dir: readonly [number, number];
  width: number;
}) {
  const drift = KB_DRIFT * width * progress;
  return (
    <Img
      src={filmAsset(board.src)}
      alt=""
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        scale: String(1 + KB_SCALE * progress),
        translate: `${dir[0] * drift}px ${dir[1] * drift * 0.6}px`,
      }}
    />
  );
}

/** Vignette de la planche-contact : cadre, numéro, légende. */
function BoardCell({
  board,
  index,
  rect,
  geo,
  at,
  active,
}: {
  board: FilmBoard;
  index: number;
  rect: Rect;
  geo: Geo;
  at: number;
  /** 0–1 : la planche est à la loupe. */
  active: number;
}) {
  const frame = useCurrentFrame();
  const { s } = useLayout();
  const p = ramp(frame, [at, at + 18]);
  const caption = ramp(frame, [at + 8, at + 24]);
  const kb = ramp(frame, [at, T.kenBurnsEnd], [0, 1], KB_EASE);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: rect.x,
          top: rect.y,
          width: rect.w,
          height: rect.h,
          overflow: "hidden",
          background: C.panel,
          opacity: p,
          translate: `0 ${(1 - p) * 16}px`,
        }}
      >
        <KenBurnsImg
          board={board}
          progress={kb}
          dir={KB_DIRS[index % KB_DIRS.length]}
          width={rect.w}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: `2px solid ${C.lineBright}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: `3px solid ${C.accent}`,
            opacity: active,
          }}
        />
        {/* Numéro de vue, comme sur une planche-contact. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            padding: "2px 10px 2px 9px",
            background: C.bg,
            display: "grid",
          }}
        >
          <MonoLabel size={s.micro} color={C.inkDim} style={{ gridArea: "1 / 1" }}>
            {pad2(index + 1)}
          </MonoLabel>
          <MonoLabel
            size={s.micro}
            color={C.accent}
            style={{ gridArea: "1 / 1", opacity: active }}
          >
            {pad2(index + 1)}
          </MonoLabel>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: rect.x,
          top: rect.y + rect.h + 10,
          width: rect.w,
          opacity: caption,
        }}
      >
        <div
          style={{
            fontFamily: FONT.serif,
            fontWeight: 400,
            fontSize: geo.titleSize,
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
            color: C.ink,
            whiteSpace: "nowrap",
          }}
        >
          {shortTitle(board.title)}
        </div>
        {/* « Modélisation 3D · tir illustratif » : un segment par ligne. */}
        {board.kind.split(/\s+·\s+/).map((part, i) => (
          <MonoLabel
            key={part}
            size={geo.kindSize}
            style={{
              display: "block",
              marginTop: i === 0 ? 4 : 0,
              letterSpacing: "0.14em",
            }}
          >
            {part}
          </MonoLabel>
        ))}
      </div>
    </>
  );
}

/** Mention de cadre : filet cuivre court, capitales mono. */
function Mention({ at, children }: { at: number; children: ReactNode }) {
  const frame = useCurrentFrame();
  const { s } = useLayout();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      <Rule at={at} dur={16} color={C.accentDeep} style={{ width: 56 }} />
      <span style={{ opacity: ramp(frame, [at + 4, at + 18]), whiteSpace: "nowrap" }}>
        <MonoLabel size={s.micro}>{children}</MonoLabel>
      </span>
    </div>
  );
}

/** Boîte du graphe : nom au serif, filet. */
function GraphNode({
  at,
  strong = false,
  size,
  pad,
  maxWidth,
  children,
}: {
  at: number;
  strong?: boolean;
  size: number;
  pad: string;
  maxWidth?: number;
  children: ReactNode;
}) {
  const frame = useCurrentFrame();
  const p = ramp(frame, [at, at + 14]);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        maxWidth,
        padding: pad,
        border: `2px solid ${strong ? C.inkFaint : C.lineBright}`,
        background: strong ? C.surface : C.panel,
        fontFamily: FONT.serif,
        fontWeight: 400,
        fontSize: size,
        lineHeight: 1.15,
        color: C.ink,
        opacity: p,
        translate: `0 ${(1 - p) * 10}px`,
      }}
    >
      {children}
    </div>
  );
}

/** Lien orienté du graphe, tracé vers le système, relation posée dessus. */
function GraphLink({
  at,
  toward,
  label,
}: {
  at: number;
  /** Côté du système : la flèche y pointe. */
  toward: "right" | "left";
  label: string;
}) {
  const frame = useCurrentFrame();
  const { s } = useLayout();
  const p = ramp(frame, [at, at + LINK_DUR], [0, 1], EASE_IN_OUT);
  const head = ramp(frame, [at + LINK_DUR - 6, at + LINK_DUR]);
  const text = ramp(frame, [at + 8, at + 22]);
  const right = toward === "right";
  const inset = 8;
  return (
    <div style={{ position: "relative", minWidth: 0 }}>
      <div
        style={{
          position: "absolute",
          left: inset,
          right: inset,
          top: "50%",
          marginTop: -1,
          height: 2,
          background: C.inkFaint,
          transformOrigin: right ? "left center" : "right center",
          scale: `${p} 1`,
        }}
      />
      <svg
        width={12}
        height={18}
        viewBox="0 0 12 18"
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          marginTop: -9,
          ...(right ? { right: inset - 1 } : { left: inset - 1 }),
          opacity: head,
        }}
      >
        <polyline
          points={right ? "1,1 11,9 1,17" : "11,1 1,9 11,17"}
          fill="none"
          stroke={C.inkFaint}
          strokeWidth={2}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: "50%",
          marginBottom: 9,
          textAlign: "center",
          opacity: text,
        }}
      >
        <MonoLabel
          size={s.micro}
          color={C.inkDim}
          style={{ letterSpacing: "0.1em", whiteSpace: "nowrap" }}
        >
          {label}
        </MonoLabel>
      </div>
    </div>
  );
}

/** Graphe industriel : Industriel → Système ← Pays, une ligne par système. */
function IndustrialGraph({ rows, geo }: { rows: FilmGraphRow[]; geo: Geo }) {
  const frame = useCurrentFrame();
  const { s } = useLayout();
  const heads = ramp(frame, [T.heads, T.heads + 14]);
  const { linkMin } = geo;
  const head = (label: string, column: number) => (
    <div style={{ gridColumn: column, opacity: heads, paddingBottom: 2 }}>
      <MonoLabel size={s.micro} style={{ whiteSpace: "nowrap" }}>
        {label}
      </MonoLabel>
    </div>
  );
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `auto minmax(${linkMin}px, 1fr) auto minmax(${linkMin}px, 1fr) auto`,
        rowGap: geo.graphRowGap,
        alignItems: "stretch",
      }}
    >
      {head("Industriel", 1)}
      {head("Système", 3)}
      {head("Pays", 5)}
      {rows.map((row, i) => {
        const base = T.rows + i * T.rowStep;
        return (
          <div key={row.system} style={{ display: "contents" }}>
            {row.company ? (
              <GraphNode
                at={base + 4}
                size={geo.nodeSize}
                pad={geo.nodePad}
                maxWidth={geo.companyMax}
              >
                {row.company.label}
              </GraphNode>
            ) : (
              <div />
            )}
            {row.company ? (
              <GraphLink at={base + 10} toward="right" label={row.company.relation} />
            ) : (
              <div />
            )}
            <GraphNode at={base} strong size={geo.nodeSize} pad={geo.nodePad}>
              <span style={{ whiteSpace: "nowrap" }}>{row.system}</span>
            </GraphNode>
            {row.country ? (
              <GraphLink at={base + 14} toward="left" label={row.country.relation} />
            ) : (
              <div />
            )}
            {row.country ? (
              <GraphNode at={base + 8} size={geo.nodeSize} pad={geo.nodePad}>
                <span style={{ whiteSpace: "nowrap" }}>{row.country.label}</span>
              </GraphNode>
            ) : (
              <div />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function InstrumentsScene({ data }: SceneProps) {
  const frame = useCurrentFrame();
  const { layout, s, width, height } = useLayout();
  const portrait = layout === "portrait";
  const areaW = width - 2 * s.padX;
  const areaH = height - s.padTop - s.padBottom;
  const geo = geometry(portrait, areaW, areaH, s);

  const boards = data.boards.slice(0, MAX_BOARDS);
  const rows = data.graph.slice(0, MAX_ROWS);
  const count = boards.length;
  const last = count - 1;

  // Loupe : chaque planche y passe tour à tour, en fondu enchaîné.
  const slide = count > 0 ? (T.flight - T.loupeIn) / count : 0;
  const slideAt = (i: number) => T.loupeIn + i * slide;
  const shown = boards.map((_, i) =>
    i === 0 ? 1 : ramp(frame, [slideAt(i), slideAt(i) + SLIDE_FADE]),
  );
  const loupeIn = ramp(frame, [T.loupeIn, T.loupeIn + 14]);
  const landed = T.flight + T.flightDur;
  const weight = boards.map((_, i) => {
    const inn = i === 0 ? loupeIn : shown[i];
    const out =
      i === last
        ? ramp(frame, [landed, landed + 14])
        : shown[i + 1];
    return inn * (1 - out);
  });
  // Légendes : fondu sortant puis entrant, jamais deux textes superposés.
  const captionWeight = boards.map((_, i) => {
    const inn =
      i === 0 ? loupeIn : ramp(frame, [slideAt(i) + 3, slideAt(i) + 11]);
    const out =
      i === last ? 0 : ramp(frame, [slideAt(i + 1) - 4, slideAt(i + 1) + 2]);
    return inn * (1 - out);
  });
  const current = weight.reduce(
    (best, w, i) => (w > weight[best] ? i : best),
    0,
  );

  // Repli de la loupe dans la case de la dernière planche.
  // Les deux axes sont décalés pour contourner les autres vignettes : en
  // 16:9 la loupe descend d'abord puis glisse vers sa case ; en 9:16 elle
  // rejoint d'abord la colonne de droite, puis remonte.
  const target = cellRect(geo, Math.max(0, last));
  const early = ramp(frame, [T.flight, landed - 8], [0, 1], EASE_IN_OUT);
  const late = ramp(frame, [T.flight + 10, landed], [0, 1], EASE_IN_OUT);
  // L'image prend la taille de sa case pendant le premier mouvement.
  const k = 1 + (target.w / geo.loupe.w - 1) * early;
  const dx = (target.x - geo.loupe.x) * (portrait ? early : late);
  const dy = (target.y - geo.loupe.y) * (portrait ? late : early);
  const loupeChrome = 1 - ramp(frame, [T.flight - 8, T.flight + 4]);
  const loupeOpacity = loupeIn * (1 - ramp(frame, [landed - 6, landed]));
  const loupeKb = ramp(frame, [T.loupeIn, landed], [0, 1], Easing.linear);

  const titleStyle: CSSProperties = {
    margin: 0,
    fontFamily: FONT.serif,
    fontWeight: 400,
    fontSize: s.title,
    lineHeight: 1.02,
    letterSpacing: "-0.02em",
    color: C.ink,
  };
  const titleLines = portrait
    ? ["Manipuler, comparer,", "relier."]
    : ["Manipuler, comparer, relier."];

  return (
    <SceneArea>
      <div style={{ position: "relative", flex: 1 }}>
        {/* Titre, mention d'intention alignée sur la dernière ligne. */}
        <Reveal at={T.title} y={14} style={{ position: "absolute", left: 0, right: 0, top: 0 }}>
          {titleLines.map((line, i) =>
            i < titleLines.length - 1 ? (
              <h2 key={line} style={titleStyle}>
                {line}
              </h2>
            ) : (
              <div
                key={line}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  gap: 24,
                }}
              >
                <h2 style={titleStyle}>{line}</h2>
                <span style={{ opacity: ramp(frame, [T.kicker, T.kicker + 16]) }}>
                  <MonoLabel color={C.inkDim}>Du dossier à l'analyse</MonoLabel>
                </span>
              </div>
            ),
          )}
        </Reveal>

        {/* A · Planche-contact. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: geo.blocksTop,
            width: geo.gridW,
          }}
        >
          <SectionMarker index="A" label="Planches techniques" at={T.markerA} />
        </div>
        {boards.map((board, i) => (
          <BoardCell
            key={board.src}
            board={board}
            index={i}
            rect={cellRect(geo, i)}
            geo={geo}
            at={T.cells + i * T.cellStep}
            active={weight[i]}
          />
        ))}
        <div style={{ position: "absolute", left: 0, top: geo.mentionA }}>
          <Mention at={T.mentionA}>Représentations illustratives</Mention>
        </div>

        {/* Loupe : la planche active, agrandie, avant de laisser place au graphe. */}
        {count > 0 ? (
          <>
            <div
              style={{
                position: "absolute",
                left: geo.b.x,
                top: geo.b.y,
                display: "flex",
                alignItems: "baseline",
                gap: 14,
                opacity: loupeIn * loupeChrome,
              }}
            >
              <MonoLabel>Planche</MonoLabel>
              <MonoLabel color={C.accent}>{pad2(current + 1)}</MonoLabel>
              <MonoLabel>/ {pad2(count)}</MonoLabel>
            </div>
            <div
              style={{
                position: "absolute",
                left: geo.loupe.x,
                top: geo.loupe.y,
                width: geo.loupe.w,
                height: geo.loupe.h,
                transformOrigin: "0 0",
                translate: `${dx + (1 - loupeIn) * 24}px ${dy}px`,
                scale: String(k),
                opacity: loupeOpacity,
              }}
            >
              <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: C.panel }}>
                {boards.map((board, i) => (
                  <div key={board.src} style={{ position: "absolute", inset: 0, opacity: shown[i] }}>
                    <KenBurnsImg
                      board={board}
                      progress={loupeKb}
                      dir={KB_DIRS[(i + 1) % KB_DIRS.length]}
                      width={geo.loupe.w}
                    />
                  </div>
                ))}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    border: `2px solid ${C.lineBright}`,
                  }}
                />
              </div>
              <div style={{ opacity: loupeChrome }}>
                <RegistrationMarks inset={-12} color={C.inkFaint} />
              </div>
            </div>
            {boards.map((board, i) => (
              <div
                key={board.src}
                style={{
                  position: "absolute",
                  left: geo.loupeCaption.x,
                  top: geo.loupeCaption.y,
                  width: geo.loupeCaption.w,
                  opacity: captionWeight[i] * loupeChrome,
                  fontFamily: FONT.serif,
                  fontWeight: 400,
                  fontSize: portrait ? 32 : 34,
                  lineHeight: 1.18,
                  letterSpacing: "-0.01em",
                  color: C.ink,
                }}
              >
                {board.title}
              </div>
            ))}
          </>
        ) : null}

        {/* B · Graphe industriel. */}
        <div
          style={{
            position: "absolute",
            left: geo.b.x,
            top: geo.b.y,
            width: geo.b.w,
            height: geo.b.h,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <SectionMarker index="B" label="Graphe industriel" at={T.markerB} />
          {portrait ? null : (
            <Reveal at={T.lede} y={12} style={{ marginTop: HEAD - Math.ceil(s.label * 1.35) }}>
              <p
                style={{
                  margin: 0,
                  fontFamily: FONT.sans,
                  fontSize: s.body,
                  lineHeight: 1.3,
                  color: C.inkDim,
                }}
              >
                Chaque système, relié à l'industriel qui le produit et au pays qui le porte.
              </p>
            </Reveal>
          )}
          <div style={{ marginTop: portrait ? HEAD - Math.ceil(s.label * 1.35) : 40 }}>
            <IndustrialGraph rows={rows} geo={geo} />
          </div>
          <div style={{ flex: 1 }} />
          <Mention at={T.mentionB}>Niveau public, sans détail de fabrication</Mention>
        </div>
      </div>
    </SceneArea>
  );
}
