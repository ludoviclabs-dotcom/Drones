import type { CSSProperties, ReactNode } from "react";
import { useCurrentFrame } from "remotion";
import type { FilmCompareRow, FilmGrade, SceneProps } from "../types";
import { C, FONT, GRADE_LABELS } from "../theme";
import {
  GradeChip,
  MonoLabel,
  Panel,
  Reveal,
  Rule,
  SceneArea,
  Stamp,
  ramp,
  useLayout,
} from "../primitives";

/**
 * 04 · Comparer (11 s) — deux dossiers sur la même grille. Les dimensions
 * s'inscrivent une à une en paliers A–E ; la lecture fait ressortir l'écart
 * le plus net et les égalités, le score global reste non calculé.
 *
 *   0–34    repère, titre, sous-titre
 *   34–70   le tableau se pose : cadre, filets de colonnes, en-têtes
 *   70–170  une dimension toutes les 16 images : libellé, palier gauche, droit
 *   176–204 lecture : écart maximal en cuivre, égalités notées
 *   196–222 ligne de total « Score global » : tampon « Non calculé »
 *   226–274 conclusion, légende des paliers
 *   274–330 synthèse stable (image clé : 300)
 */

const T = {
  kicker: 4,
  title: 10,
  subtitle: 24,
  table: 34,
  columns: 40,
  headLeft: 46,
  headRight: 54,
  rows: 70,
  /** Fenêtre d'inscription des lignes : la dernière part au plus tard ici. */
  rowsLast: 150,
  marker: 176,
  note: 182,
  tie: 190,
  score: 204,
  stamp: 214,
  conclusion: 226,
  legend: 242,
  legendStep: 4,
} as const;

/** Ordre des paliers : l'écart se compte en rangs, jamais en points. */
const ORDER: readonly FilmGrade[] = ["A", "B", "C", "D", "E"];

function gradeGap(row: FilmCompareRow): number {
  return Math.abs(ORDER.indexOf(row.left) - ORDER.indexOf(row.right));
}

function gapText(gap: number): string {
  return gap === 1 ? "Écart d'un palier" : `Écart de ${gap} paliers`;
}

type Reading = "max" | "tie" | null;

/**
 * Cellule de palier : pastille et libellé discret à côté (16:9) ; en 9:16,
 * pastille seule, centrée — la légende donne les libellés.
 */
function GradeCell({
  grade,
  at,
  chip,
  portrait,
  padX,
}: {
  grade: FilmGrade;
  at: number;
  chip: number;
  portrait: boolean;
  padX: number;
}) {
  const frame = useCurrentFrame();
  const { s } = useLayout();
  const p = ramp(frame, [at + 4, at + 18]);
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: portrait ? "center" : "flex-start",
        gap: 16,
        padding: `0 ${padX}px`,
      }}
    >
      <GradeChip grade={grade} at={at} size={chip} />
      {portrait ? null : (
        <span style={{ opacity: p, whiteSpace: "nowrap" }}>
          <MonoLabel
            size={s.micro}
            color={C.inkDim}
            style={{ letterSpacing: "0.14em" }}
          >
            {GRADE_LABELS[grade]}
          </MonoLabel>
        </span>
      )}
    </div>
  );
}

/** En-tête d'un dossier : nom en serif, référence et pays en capitales mono. */
function DossierHead({
  name,
  reference,
  country,
  at,
  padX,
  nameSize,
  portrait,
}: {
  name: string;
  reference: string;
  country: string;
  at: number;
  padX: number;
  nameSize: number;
  portrait: boolean;
}) {
  const { s } = useLayout();
  const tight: CSSProperties | undefined = portrait
    ? { letterSpacing: "0.1em" }
    : undefined;
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: `18px ${padX}px`,
        minWidth: 0,
      }}
    >
      <Reveal at={at} y={14}>
        <div
          style={{
            fontFamily: FONT.serif,
            fontWeight: 400,
            fontSize: nameSize,
            lineHeight: 1.05,
            letterSpacing: "-0.01em",
            color: C.ink,
          }}
        >
          {name}
        </div>
        <div
          style={{ marginTop: 10, display: "flex", flexDirection: "column" }}
        >
          <MonoLabel size={s.micro} style={tight}>
            {reference}
          </MonoLabel>
          <MonoLabel size={s.micro} color={C.inkDim} style={tight}>
            {country}
          </MonoLabel>
        </div>
      </Reveal>
    </div>
  );
}

/** Ligne du tableau : dimension, palier de chaque dossier, note de lecture. */
function CompareRow({
  row,
  at,
  reading,
  gap,
  columns,
  padX,
  chip,
  labelSize,
  portrait,
}: {
  row: FilmCompareRow;
  at: number;
  reading: Reading;
  gap: number;
  columns: string;
  padX: number;
  chip: number;
  labelSize: number;
  portrait: boolean;
}) {
  const frame = useCurrentFrame();
  const { s } = useLayout();
  const pLabel = ramp(frame, [at, at + 16]);
  const pMark = ramp(frame, [T.marker, T.marker + 20]);
  const pNote = ramp(
    frame,
    reading === "tie" ? [T.tie, T.tie + 14] : [T.note, T.note + 14],
  );

  let note: ReactNode = null;
  if (reading === "max") {
    note = (
      <MonoLabel size={s.micro} color={C.accent}>
        {gapText(gap)}
      </MonoLabel>
    );
  } else if (reading === "tie") {
    note = (
      <MonoLabel size={s.micro} color={C.inkDim}>
        À égalité
      </MonoLabel>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        flex: 1,
        minHeight: 0,
        display: "grid",
        gridTemplateColumns: columns,
      }}
    >
      {reading === "max" ? (
        <>
          {/* Repère de lecture : la ligne se relève, un filet cuivre la borde. */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: C.surface2,
              opacity: pMark,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 6,
              background: C.accent,
              transformOrigin: "center top",
              scale: `1 ${pMark}`,
            }}
          />
        </>
      ) : null}
      <Rule
        at={at - 2}
        dur={20}
        color={C.line}
        style={{ position: "absolute", top: 0, left: 0, right: 0 }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 6,
          padding: `0 ${padX}px`,
          minWidth: 0,
          opacity: pLabel,
          translate: `${(1 - pLabel) * -18}px 0`,
        }}
      >
        <span
          style={{
            fontFamily: FONT.serif,
            fontWeight: 400,
            fontSize: labelSize,
            lineHeight: 1.1,
            color: C.ink,
          }}
        >
          {row.label}
        </span>
        {/* La note occupe sa place dès l'entrée : le libellé ne saute pas. */}
        {note ? <span style={{ opacity: pNote }}>{note}</span> : null}
      </div>
      <GradeCell
        grade={row.left}
        at={at + 4}
        chip={chip}
        portrait={portrait}
        padX={portrait ? 8 : padX}
      />
      <GradeCell
        grade={row.right}
        at={at + 8}
        chip={chip}
        portrait={portrait}
        padX={portrait ? 8 : padX}
      />
    </div>
  );
}

/**
 * Légende des paliers A–E, pastilles et libellés du site : en grille de cinq,
 * libellé sous la pastille (9:16), ou en trois colonnes, libellé à côté (16:9).
 */
function Legend({ stacked }: { stacked: boolean }) {
  const frame = useCurrentFrame();
  const { s } = useLayout();
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${stacked ? ORDER.length : 3}, ${stacked ? "1fr" : "auto"})`,
        justifyContent: "start",
        columnGap: stacked ? 0 : 34,
        rowGap: 14,
      }}
    >
      {ORDER.map((grade, i) => {
        const at = T.legend + i * T.legendStep;
        return (
          <div
            key={grade}
            style={{
              display: "flex",
              flexDirection: stacked ? "column" : "row",
              alignItems: "center",
              gap: stacked ? 8 : 12,
            }}
          >
            <GradeChip grade={grade} at={at} size={s.micro * 2} />
            <span
              style={{
                opacity: ramp(frame, [at + 4, at + 16]),
                whiteSpace: "nowrap",
              }}
            >
              <MonoLabel
                size={s.micro}
                color={C.inkDim}
                style={{ letterSpacing: "0.14em" }}
              >
                {GRADE_LABELS[grade]}
              </MonoLabel>
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function ComparerScene({ data }: SceneProps) {
  const frame = useCurrentFrame();
  const { layout, s } = useLayout();
  const portrait = layout === "portrait";
  const { left, right, rows } = data.compare;

  // Lecture calculée : écart en rangs A<B<C<D<E, jamais additionné.
  const gaps = rows.map(gradeGap);
  const maxGap = Math.max(0, ...gaps);
  const readings: Reading[] = gaps.map((g) =>
    g === 0 ? "tie" : g === maxGap ? "max" : null,
  );
  const rowStep =
    rows.length > 1
      ? Math.min(16, Math.floor((T.rowsLast - T.rows) / (rows.length - 1)))
      : 0;

  // Largeurs mesurées : en 16:9, le titre tient en deux lignes dans la
  // colonne gauche, et le plus long libellé de dimension du registre sur une
  // ligne dans le tableau. En 9:16, les colonnes de pastilles restent serrées.
  const colW = portrait ? 200 : 258;
  const padX = 22;
  const columns = `1fr ${colW}px ${colW}px`;
  const chip = portrait ? 60 : 56;
  const labelSize = s.body;
  const footerH = portrait ? 108 : 104;

  const title = (
    <>
      <Reveal at={T.kicker} y={12}>
        <MonoLabel color={C.accent}>Comparateur</MonoLabel>
      </Reveal>
      <Reveal at={T.title} y={18} style={{ marginTop: 14 }}>
        <h2
          style={{
            margin: 0,
            fontFamily: FONT.serif,
            fontWeight: 400,
            fontSize: s.title,
            lineHeight: 1.04,
            letterSpacing: "-0.02em",
            color: C.ink,
          }}
        >
          <span style={{ whiteSpace: "nowrap" }}>Des paliers,</span>
          <br />
          <span style={{ whiteSpace: "nowrap" }}>pas un faux score.</span>
        </h2>
      </Reveal>
      <Reveal at={T.subtitle} y={12} style={{ marginTop: 16 }}>
        <p
          style={{
            margin: 0,
            fontFamily: FONT.sans,
            fontSize: s.body,
            lineHeight: 1.3,
            color: C.inkDim,
          }}
        >
          Comparer vaut mieux que décrire.
        </p>
      </Reveal>
    </>
  );

  const table = (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        opacity: ramp(frame, [T.table, T.table + 14]),
      }}
    >
      <Panel
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "visible",
        }}
      >
        {/* En-tête : la grille commune, puis les deux dossiers. */}
        <div
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: columns,
            minHeight: portrait ? 150 : 140,
            background: C.surface,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: `18px ${padX}px`,
              opacity: ramp(frame, [T.headLeft, T.headLeft + 14]),
            }}
          >
            <MonoLabel size={s.micro} color={C.accent}>
              Évaluation
            </MonoLabel>
            <MonoLabel size={s.micro}>Paliers A à E</MonoLabel>
          </div>
          <DossierHead
            {...left}
            at={T.headLeft}
            padX={portrait ? 14 : 12}
            nameSize={portrait ? 40 : 36}
            portrait={portrait}
          />
          <DossierHead
            {...right}
            at={T.headRight}
            padX={portrait ? 14 : 12}
            nameSize={portrait ? 40 : 36}
            portrait={portrait}
          />
        </div>
        <Rule at={T.headLeft} dur={24} color={C.lineBright} />

        <div
          style={{
            position: "relative",
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {rows.map((row, i) => (
            <CompareRow
              key={row.label}
              row={row}
              at={T.rows + i * rowStep}
              reading={readings[i]}
              gap={gaps[i]}
              columns={columns}
              padX={padX}
              chip={chip}
              labelSize={labelSize}
              portrait={portrait}
            />
          ))}
        </div>

        {/* Ligne de total : le score global reste volontairement vide. */}
        <div
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: columns,
            height: footerH,
          }}
        >
          {/* Le fond de la ligne de total se pose avec son double filet. */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: C.surface,
              opacity: ramp(frame, [T.score - 8, T.score + 10]),
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: 8,
              borderTop: `2px solid ${C.lineBright}`,
              borderBottom: `2px solid ${C.lineBright}`,
              transformOrigin: "left center",
              scale: `${ramp(frame, [T.score - 8, T.score + 14])} 1`,
            }}
          />
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 6,
              // Sous le double filet de total.
              padding: `8px ${padX}px 0`,
              opacity: ramp(frame, [T.score, T.score + 14]),
            }}
          >
            <span
              style={{
                fontFamily: FONT.serif,
                fontWeight: 400,
                fontSize: labelSize,
                lineHeight: 1.1,
                color: C.inkDim,
              }}
            >
              Score global
            </span>
            <MonoLabel size={s.micro}>Aucune moyenne</MonoLabel>
          </div>
          <div
            style={{
              position: "relative",
              gridColumn: "2 / 4",
              display: "flex",
              alignItems: "center",
              paddingTop: 8,
              justifyContent: "center",
            }}
          >
            <Stamp at={T.stamp} size={s.label}>
              Non calculé
            </Stamp>
          </div>
        </div>
        {/* Filets de colonnes, tracés de haut en bas, de l'en-tête à la ligne de total — au-dessus des lignes. */}
        {[colW * 2, colW].map((offset, i) => (
          <div
            key={offset}
            style={{
              position: "absolute",
              top: 0,
              bottom: footerH,
              right: offset,
              width: 2,
              background: C.line,
              transformOrigin: "center top",
              scale: `1 ${ramp(frame, [T.columns + i * 4, T.columns + i * 4 + 28])}`,
            }}
          />
        ))}
      </Panel>
    </div>
  );

  const conclusion = (
    <Reveal at={T.conclusion} y={16}>
      <p
        style={{
          margin: 0,
          fontFamily: FONT.serif,
          fontWeight: 400,
          fontSize: portrait ? 58 : 60,
          lineHeight: 1.1,
          letterSpacing: "-0.015em",
          color: C.ink,
        }}
      >
        On lit des{" "}
        <em style={{ fontStyle: "italic", color: C.accent }}>arbitrages</em>,
        <br />
        pas un vainqueur.
      </p>
    </Reveal>
  );

  if (portrait) {
    return (
      <SceneArea>
        {title}
        <div style={{ height: 40 }} />
        {table}
        <div style={{ marginTop: 34 }}>{conclusion}</div>
        <div style={{ marginTop: 32 }}>
          <Legend stacked />
        </div>
      </SceneArea>
    );
  }

  return (
    <SceneArea>
      <div style={{ flex: 1, minHeight: 0, display: "flex", gap: 52 }}>
        <div style={{ width: 612, display: "flex", flexDirection: "column" }}>
          {title}
          <div style={{ flex: 1 }} />
          {conclusion}
          <div style={{ flex: 1 }} />
          <Legend stacked={false} />
        </div>
        <div style={{ flex: 1, minWidth: 0, display: "flex" }}>{table}</div>
      </div>
    </SceneArea>
  );
}
