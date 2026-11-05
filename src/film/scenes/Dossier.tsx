import { interpolateColors, useCurrentFrame } from "remotion";
import type { FilmAngle, SceneProps } from "../types";
import { C, EASE_IN_OUT, FONT } from "../theme";
import {
  ConfidenceDashes,
  MonoLabel,
  RegistrationMarks,
  Reveal,
  SceneArea,
  ramp,
  useLayout,
} from "../primitives";

/** Premier angle actif. */
const ANGLES_AT = 28;
/** Bascule vers la synthèse : tout le parcours tient entre les deux. */
const SYNTH_AT = 344;
/** Temps de lecture plancher d'un angle ; le reste suit la longueur du narratif. */
const MIN_DWELL = 42;
const SWAP_OUT = 8;
const SWAP_IN = 12;

/**
 * Géométrie par orientation, en pixels de composition. `mainH` est la hauteur
 * attendue de la zone liste + panneau : elle ne sert qu'à choisir le corps du
 * narratif, pour que le plus long tienne sans faire varier le panneau.
 */
const GEOM = {
  paysage: {
    listW: 500,
    gap: 56,
    head: 58,
    row0: 0,
    padIn: 50,
    numW: 54,
    rowPadL: 30,
    rowPadR: 24,
    mainH: 628,
    innerW: 1620,
  },
  portrait: {
    listW: 0,
    gap: 30,
    head: 60,
    row0: 72,
    padIn: 36,
    numW: 60,
    rowPadL: 28,
    rowPadR: 28,
    mainH: 1240,
    innerW: 900,
  },
} as const;

/** Nombre de lignes d'un texte coupé aux mots, à `perLine` caractères. */
function wrapLines(text: string, perLine: number): number {
  let lines = 1;
  let current = 0;
  for (const word of text.split(/\s+/)) {
    if (current === 0) current = word.length;
    else if (current + 1 + word.length <= perLine) current += 1 + word.length;
    else {
      lines += 1;
      current = word.length;
    }
  }
  return lines;
}

/** Plus grand corps (≤ max) pour lequel tous les textes tiennent dans la boîte. */
function fitSize({
  texts,
  boxW,
  maxLines,
  boxH,
  max,
  min,
  lineHeight,
  em,
}: {
  texts: string[];
  boxW: number;
  maxLines?: number;
  boxH?: number;
  max: number;
  min: number;
  lineHeight: number;
  /** Chasse moyenne d'un caractère, en em (estimation prudente). */
  em: number;
}): number {
  for (let size = Math.round(max); size > min; size -= 1) {
    const perLine = Math.max(8, Math.floor(boxW / (size * em)));
    const lines = Math.max(...texts.map((t) => wrapLines(t, perLine)));
    const fitsLines = maxLines === undefined || lines <= maxLines;
    const fitsHeight = boxH === undefined || lines * size * lineHeight <= boxH;
    if (fitsLines && fitsHeight) return size;
  }
  return Math.round(min);
}

/**
 * Fenêtres d'affichage des angles : un plancher commun, le reste du temps
 * réparti selon la longueur du narratif (le plus long se lit plus longtemps).
 */
function schedule(angles: FilmAngle[]): { from: number; to: number }[] {
  const n = Math.max(1, angles.length);
  const span = SYNTH_AT - ANGLES_AT;
  const floor = Math.min(MIN_DWELL, span / n);
  const extra = span - floor * n;
  const weights = angles.map((a) => Math.max(1, a.lede.length));
  const total = weights.reduce((sum, w) => sum + w, 0);
  const windows: { from: number; to: number }[] = [];
  let t = ANGLES_AT;
  for (const w of weights) {
    const next = t + floor + (extra * w) / total;
    windows.push({ from: Math.round(t), to: Math.round(next) });
    t = next;
  }
  return windows;
}

/**
 * 02 · Un dossier, cinq angles (15 s) — le parcours de lecture de la
 * démonstration d'accueil, rejoué sur un dossier réel, puis replié en
 * tableau de synthèse.
 *
 *   0–28     en-tête du dossier, titre, liste des angles, cadre du panneau
 *   28–344   les cinq angles se succèdent (50 à 75 images selon le narratif)
 *   344–394  le panneau cède la place au tableau de synthèse des indicateurs
 *   394–450  synthèse figée ; image clé à 420
 */
export function DossierScene({ data }: SceneProps) {
  const frame = useCurrentFrame();
  const { layout, s } = useLayout();
  const portrait = layout === "portrait";
  const g = portrait ? GEOM.portrait : GEOM.paysage;
  const { dossier } = data;
  const angles = dossier.angles;
  const n = angles.length;
  const windows = schedule(angles);
  const total = String(n).padStart(2, "0");

  // — Corps et hauteurs dérivés de la géométrie —
  const labelSize = portrait ? s.body : Math.round(s.body * 1.15);
  const subH = Math.ceil(s.micro * 1.4);
  const valueLH = 1.22;
  const panelW = portrait ? g.innerW : g.innerW - g.listW - g.gap;
  const panelInnerW = panelW - 4 - g.padIn * 2;
  // Colonne « valeur » de la synthèse : la plus étroite des deux mises en page.
  const synthValueW = portrait
    ? g.innerW - g.rowPadL - g.rowPadR - g.numW
    : g.innerW - g.listW - 2 - 72 - 190;
  const valueSize = fitSize({
    texts: angles.map((a) => a.indicator.value),
    boxW: Math.min(panelInnerW, synthValueW),
    maxLines: 2,
    max: s.body,
    min: s.body * 0.85,
    lineHeight: valueLH,
    em: 0.52,
  });
  const valueBlockH = Math.ceil(valueSize * valueLH * 2);
  const indPadT = 22;
  const indPadB = 24;
  const indLabelH = Math.ceil(s.label * 1.35);
  const indH = indPadT + indLabelH + 12 + valueBlockH + indPadB;
  const panelTop0 = portrait ? g.head + n * g.row0 + g.gap : 0;
  const panelH = g.mainH - panelTop0;
  const ledePadT = 32;
  const ledePadB = 18;
  const ledeLH = 1.3;
  const ledeSize = fitSize({
    texts: angles.map((a) => a.lede),
    boxW: panelInnerW,
    boxH: panelH - g.head - indH - ledePadT - ledePadB,
    max: s.body * 1.2,
    min: s.body,
    lineHeight: ledeLH,
    em: 0.46,
  });

  // — Bascule vers la synthèse —
  const pRead = ramp(frame, [SYNTH_AT, SYNTH_AT + SWAP_OUT]);
  /** Croissance des rangées (portrait) : la liste prend toute la hauteur. */
  const pGrow = ramp(frame, [SYNTH_AT + 2, SYNTH_AT + 30], [0, 1], EASE_IN_OUT);
  const pHead = ramp(frame, [SYNTH_AT + 10, SYNTH_AT + 22]);
  /** L'en-tête de liste passe le relais : sortie franche avant l'entrée. */
  const pHeadOut = ramp(frame, [SYNTH_AT + 2, SYNTH_AT + 9]);
  const pLit = ramp(frame, [SYNTH_AT + 4, SYNTH_AT + 20]);
  const synAt = (i: number) => SYNTH_AT + 10 + i * 4;
  const synRow = (i: number) => ramp(frame, [synAt(i), synAt(i) + 16]);
  /**
   * Ouverture des lignes ajoutées (hauteur). En portrait, bornée par la
   * croissance des rangées : le contenu ne déborde jamais sur la voisine.
   */
  const synOpen = (i: number) => {
    const open = ramp(frame, [synAt(i) - 6, synAt(i) + 8]);
    return portrait ? Math.min(open, pGrow) : open;
  };
  /** Apparition, une fois la ligne presque ouverte : pas de glyphe rogné. */
  const synShow = (i: number) =>
    synRow(i) * Math.min(1, Math.max(0, (synOpen(i) - 0.7) / 0.3));

  const frameIn = ramp(frame, [10, 24]);
  /*
   * Cadre : il s'efface avec le panneau de lecture, puis revient d'un bloc
   * autour du tableau de synthèse — aucun bord en mouvement ne traverse le
   * texte de la liste.
   */
  const frameSwap = SYNTH_AT + 10;
  const swapped = frame >= frameSwap;
  const frameOpacity = swapped
    ? ramp(frame, [SYNTH_AT + 24, SYNTH_AT + 38])
    : frameIn * (1 - ramp(frame, [SYNTH_AT, SYNTH_AT + 8]));
  const frameLeft = portrait || swapped ? 0 : g.listW + g.gap;
  const frameTop = swapped ? 0 : panelTop0;
  const list0 = g.head + n * g.row0;

  /** Présence du contenu d'un angle dans le panneau (fondu enchaîné sec). */
  const presence = (i: number) => {
    const { from, to } = windows[i];
    const end = i < n - 1 ? to : SYNTH_AT + SWAP_OUT;
    return (
      ramp(frame, [from, from + SWAP_IN]) *
      (1 - ramp(frame, [end - SWAP_OUT, end]))
    );
  };
  /** Angle actif dans la liste : filet cuivre, encre claire. */
  const active = (i: number) => {
    const { from, to } = windows[i];
    const end = i < n - 1 ? to : SYNTH_AT;
    return ramp(frame, [from - 6, from + 6]) * (1 - ramp(frame, [end - 6, end + 6]));
  };

  // — En-tête du dossier —
  const identity = portrait ? (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <MonoLabel>
        <span style={{ color: C.accent }}>{dossier.reference}</span>
        {" · "}
        <span style={{ color: C.ink }}>{dossier.name}</span>
      </MonoLabel>
      <MonoLabel size={s.micro}>
        {`${dossier.manufacturer} · ${dossier.classLabel} · ${dossier.country}`}
      </MonoLabel>
    </div>
  ) : (
    <MonoLabel>
      <span style={{ color: C.accent }}>{dossier.reference}</span>
      {" · "}
      <span style={{ color: C.ink }}>{dossier.name}</span>
      {` · ${dossier.manufacturer} · ${dossier.classLabel} · ${dossier.country}`}
    </MonoLabel>
  );

  const header = (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <Reveal at={2} y={10}>
        {identity}
      </Reveal>
      <div
        style={{
          display: "flex",
          flexDirection: portrait ? "column" : "row",
          justifyContent: "space-between",
          alignItems: portrait ? "flex-start" : "baseline",
          gap: portrait ? 8 : 40,
        }}
      >
        <Reveal at={6} y={16}>
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
            Un dossier, cinq angles.
          </h2>
        </Reveal>
        {dossier.updatedLabel ? (
          <Reveal at={14} y={8}>
            <MonoLabel size={s.micro} style={{ whiteSpace: "nowrap" }}>
              Dossier révisé le {dossier.updatedLabel}
            </MonoLabel>
          </Reveal>
        ) : null}
      </div>
    </div>
  );

  // — Cadre : panneau de lecture, puis cadre du tableau de synthèse —
  const frameBox = (
    <div
      style={{
        position: "absolute",
        left: frameLeft,
        top: frameTop,
        right: 0,
        bottom: 0,
        background: C.panel,
        border: `2px solid ${C.lineBright}`,
        opacity: frameOpacity,
      }}
    >
      <RegistrationMarks inset={-2} color={C.inkFaint} />
    </div>
  );

  // — Panneau de lecture : bandeau, narratif, indicateur —
  const reading = (
    <div
      style={{
        position: "absolute",
        left: portrait ? 0 : g.listW + g.gap,
        right: 0,
        top: panelTop0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        padding: 2,
        opacity: frameIn * (1 - pRead),
      }}
    >
      <div
        style={{
          position: "relative",
          height: g.head,
          flex: "none",
          borderBottom: `2px solid ${C.line}`,
        }}
      >
        {angles.map((a, i) => (
          <div
            key={a.key}
            style={{
              position: "absolute",
              inset: `0 ${g.padIn}px`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 24,
              opacity: presence(i),
            }}
          >
            <MonoLabel color={C.accent} style={{ letterSpacing: "0.22em" }}>
              Angle {a.num} — {a.label}
            </MonoLabel>
            {portrait ? null : (
              <MonoLabel size={s.micro}>
                {a.num} / {total}
              </MonoLabel>
            )}
          </div>
        ))}
      </div>

      <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
        {angles.map((a, i) => {
          const p = presence(i);
          const rise = ramp(frame, [windows[i].from, windows[i].from + 16]);
          return (
            // Zone de hauteur fixe : un narratif court se centre, un long la remplit.
            <div
              key={a.key}
              style={{
                position: "absolute",
                inset: `${ledePadT}px ${g.padIn}px ${ledePadB}px`,
                display: "flex",
                alignItems: "center",
                opacity: p,
                translate: `0 ${(1 - rise) * 14}px`,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontFamily: FONT.serif,
                  fontWeight: 400,
                  fontSize: ledeSize,
                  lineHeight: ledeLH,
                  letterSpacing: "-0.005em",
                  color: C.ink,
                }}
              >
                {a.lede}
              </p>
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "relative",
          height: indH,
          flex: "none",
          borderTop: `2px solid ${C.line}`,
        }}
      >
        {angles.map((a, i) => {
          const from = windows[i].from;
          const p = presence(i);
          return (
            <div
              key={a.key}
              style={{
                position: "absolute",
                inset: `${indPadT}px ${g.padIn}px ${indPadB}px`,
                display: "flex",
                flexDirection: "column",
                gap: 12,
                opacity: p,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 24,
                  opacity: ramp(frame, [from + 6, from + 18]),
                }}
              >
                <MonoLabel style={{ letterSpacing: "0.14em" }}>
                  {a.indicator.label}
                </MonoLabel>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 20,
                    flex: "none",
                  }}
                >
                  <ConfidenceDashes confidence={a.indicator.confidence} at={from + 14} />
                  <span style={{ opacity: ramp(frame, [from + 24, from + 34]) }}>
                    <MonoLabel color={C.inkDim}>{a.indicator.statusLabel}</MonoLabel>
                  </span>
                </span>
              </div>
              <div
                style={{
                  fontFamily: FONT.sans,
                  fontSize: valueSize,
                  lineHeight: valueLH,
                  color: C.ink,
                  opacity: ramp(frame, [from + 10, from + 22]),
                }}
              >
                {a.indicator.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // — Liste des angles : devient la première colonne du tableau —
  const list = (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: portrait ? "100%" : g.listW,
        height: portrait
          ? `calc(${list0}px + ${pGrow} * (100% - ${list0}px))`
          : "100%",
        display: "grid",
        gridTemplateRows: `${g.head}px repeat(${n}, minmax(0, 1fr))`,
        borderBottom: `2px solid ${C.line}`,
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          paddingLeft: g.rowPadL,
          paddingRight: g.rowPadR,
          opacity: ramp(frame, [10, 24]),
        }}
      >
        <span style={{ opacity: 1 - pHeadOut }}>
          <MonoLabel size={s.micro}>Angles de lecture</MonoLabel>
        </span>
        <span style={{ position: "absolute", left: g.rowPadL, opacity: pHead }}>
          <MonoLabel size={s.micro} color={C.accent}>
            Synthèse du dossier
          </MonoLabel>
        </span>
        {portrait ? (
          <span style={{ marginLeft: "auto", opacity: pHead }}>
            <MonoLabel size={s.micro}>Confiance · statut</MonoLabel>
          </span>
        ) : null}
      </div>

      {angles.map((a, i) => {
        const rowIn = ramp(frame, [12 + i * 3, 28 + i * 3]);
        const act = active(i);
        const lit = Math.max(act, pLit);
        const syn = synRow(i);
        const open = synOpen(i);
        const show = synShow(i);
        return (
          <div
            key={a.key}
            style={{
              position: "relative",
              borderTop: `2px solid ${C.line}`,
              paddingLeft: g.rowPadL,
              paddingRight: g.rowPadR,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              minHeight: 0,
              opacity: rowIn,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                left: 0,
                top: -2,
                bottom: 0,
                width: 4,
                background: C.accent,
                transformOrigin: "center top",
                scale: `1 ${act}`,
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                translate: `${(1 - rowIn) * -14}px 0`,
              }}
            >
              <MonoLabel color={C.accent} style={{ width: g.numW, flex: "none" }}>
                {a.num}
              </MonoLabel>
              <span
                style={{
                  fontFamily: FONT.serif,
                  fontWeight: 400,
                  fontSize: labelSize,
                  lineHeight: 1.12,
                  letterSpacing: "-0.01em",
                  color: interpolateColors(lit, [0, 1], [C.inkDim, C.ink]),
                }}
              >
                {a.label}
              </span>
              {portrait ? (
                <span
                  style={{
                    marginLeft: "auto",
                    alignSelf: "center",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 18,
                    flex: "none",
                    opacity: syn,
                  }}
                >
                  <ConfidenceDashes
                    confidence={a.indicator.confidence}
                    at={synAt(i) + 4}
                  />
                  <MonoLabel color={C.inkDim}>{a.indicator.statusLabel}</MonoLabel>
                </span>
              ) : null}
            </div>
            <div
              style={{
                maxHeight: open * subH,
                marginTop: open * 6,
                paddingLeft: g.numW,
                overflow: "hidden",
                opacity: show,
              }}
            >
              <MonoLabel size={s.micro} style={{ letterSpacing: "0.14em" }}>
                {a.indicator.label}
              </MonoLabel>
            </div>
            {portrait ? (
              <div
                style={{
                  maxHeight: open * valueBlockH,
                  marginTop: open * 8,
                  paddingLeft: g.numW,
                  overflow: "hidden",
                  fontFamily: FONT.sans,
                  fontSize: valueSize,
                  lineHeight: valueLH,
                  color: C.ink,
                  opacity: show,
                }}
              >
                {a.indicator.value}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );

  // — Synthèse paysage : valeur, confiance et statut, alignés sur la liste —
  const synthesis = portrait ? null : (
    <>
      <div
        style={{
          position: "absolute",
          left: g.listW - 2,
          top: 0,
          bottom: 0,
          width: 2,
          background: C.line,
          transformOrigin: "center top",
          scale: `1 ${pHead}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: g.listW,
          right: 2,
          top: 0,
          bottom: 0,
          display: "grid",
          gridTemplateRows: `${g.head}px repeat(${n}, minmax(0, 1fr))`,
          // Même filet bas que la liste : les deux grilles restent alignées.
          borderBottom: "2px solid transparent",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 36px",
            opacity: pHead,
          }}
        >
          <MonoLabel size={s.micro}>Valeur relevée</MonoLabel>
          <MonoLabel size={s.micro}>Confiance · statut</MonoLabel>
        </div>
        {angles.map((a, i) => {
          const syn = synRow(i);
          return (
            <div
              key={a.key}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) auto",
                alignItems: "center",
                columnGap: 30,
                padding: "0 36px",
                borderTop: `2px solid ${C.line}`,
                opacity: syn,
                translate: `${(1 - syn) * 18}px 0`,
              }}
            >
              <div
                style={{
                  fontFamily: FONT.sans,
                  fontSize: valueSize,
                  lineHeight: valueLH,
                  color: C.ink,
                }}
              >
                {a.indicator.value}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 12,
                }}
              >
                <ConfidenceDashes confidence={a.indicator.confidence} at={synAt(i) + 4} />
                <MonoLabel color={C.inkDim}>{a.indicator.statusLabel}</MonoLabel>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );

  return (
    <SceneArea>
      {header}
      <div
        style={{
          position: "relative",
          flex: 1,
          minHeight: 0,
          marginTop: portrait ? 36 : 30,
        }}
      >
        {frameBox}
        {reading}
        {synthesis}
        {list}
      </div>
    </SceneArea>
  );
}
