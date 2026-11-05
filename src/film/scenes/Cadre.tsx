import { interpolateColors, useCurrentFrame } from "remotion";
import type { SceneProps } from "../types";
import { C, FONT } from "../theme";
import {
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
 * 06 · Le cadre (8 s) — ce que le recueil s'autorise et ce qu'il s'interdit.
 * Trois affirmations en serif, trois limites explicites, le tampon d'archive ;
 * en colonne secondaire, l'index des domaines lus sur la même grille.
 *
 *   4–90     trois temps : sources ouvertes, niveau capacitaire, aucun usage
 *            opérationnel (le temps précédent s'efface d'un cran)
 *   20–100   index des domaines, en cascade
 *   96       glose : comprendre un système, pas l'employer
 *   110–164  « Hors champ » : trois limites, une toutes les 14 images
 *   160–180  les trois temps reviennent à pleine intensité
 *   166–174  tampon « Analyse — diffusion publique » : le cartouche et le pied
 *            répètent déjà « aucun usage opérationnel », le tampon porte le
 *            volet « public » du cadre
 *   180–240  synthèse stable (image clé : 210)
 */

const T = {
  kicker: 4,
  beats: [12, 40, 68],
  gloss: 96,
  index: 20,
  indexTitle: 26,
  rows: 36,
  rowStep: 5,
  limits: 110,
  limitStep: 14,
  restore: 160,
  stamp: 166,
} as const;

const LIMITS = [
  "Pas d'aide au ciblage",
  "Pas de paramètre tactique",
  "Pas de contournement des contrôles export",
] as const;

/** Intensité d'un temps : plein quand il arrive, en retrait au suivant, plein à la synthèse. */
function beatColor(frame: number, i: number): string {
  const next = T.beats[i + 1];
  const recede = next === undefined ? 0 : ramp(frame, [next, next + 14]);
  const dim = recede * (1 - ramp(frame, [T.restore, T.restore + 20]));
  return interpolateColors(dim, [0, 1], [C.ink, C.inkDim]);
}

/** Limite explicite : tiret tracé en cuivre sombre, puis la ligne mono. */
function LimitLine({
  text,
  at,
  size,
  tracking,
}: {
  text: string;
  at: number;
  size: number;
  tracking: string;
}) {
  const frame = useCurrentFrame();
  const p = ramp(frame, [at + 4, at + 20]);
  const lineHeight = size * 1.35;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `${Math.round(size * 1.3)}px 1fr`,
        columnGap: Math.round(size * 0.8),
        alignItems: "start",
      }}
    >
      <Rule
        at={at}
        dur={12}
        color={C.accentDeep}
        style={{ marginTop: lineHeight / 2 - 1 }}
      />
      <div style={{ opacity: p, translate: `${(1 - p) * -14}px 0` }}>
        <MonoLabel color={C.ink} size={size} style={{ letterSpacing: tracking }}>
          {text}
        </MonoLabel>
      </div>
    </div>
  );
}

/** Index des domaines : panneau secondaire, entrées en cascade. */
function DomainIndex({
  domains,
  count,
  portrait,
}: {
  domains: string[];
  count: number;
  portrait: boolean;
}) {
  const frame = useCurrentFrame();
  const { s } = useLayout();
  return (
    <Panel
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: portrait ? "26px 32px 14px" : "30px 30px 16px",
        opacity: ramp(frame, [T.index, T.index + 16]),
      }}
    >
      <Reveal at={T.indexTitle} y={10}>
        <MonoLabel size={s.micro}>Index du recueil</MonoLabel>
        <div
          style={{
            marginTop: 8,
            fontFamily: FONT.serif,
            fontWeight: 400,
            fontSize: s.body,
            lineHeight: 1.12,
            letterSpacing: "-0.02em",
            color: C.ink,
          }}
        >
          {count} domaines, une même grille
        </div>
      </Reveal>
      <Rule at={T.indexTitle + 4} dur={22} color={C.lineBright} style={{ marginTop: 18 }} />
      <ol
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {domains.map((domain, i) => {
          const p = ramp(frame, [T.rows + i * T.rowStep, T.rows + i * T.rowStep + 14]);
          return (
            <li
              key={domain}
              style={{
                flex: 1,
                display: "grid",
                gridTemplateColumns: `${Math.round(s.micro * 2.3)}px 1fr`,
                alignItems: "center",
                borderTop: i === 0 ? "none" : `2px solid ${C.line}`,
                opacity: p,
                translate: `${(1 - p) * 12}px 0`,
              }}
            >
              <MonoLabel size={s.micro} style={{ opacity: 0.6 }}>
                {String(i + 1).padStart(2, "0")}
              </MonoLabel>
              <MonoLabel
                size={s.micro}
                style={{ letterSpacing: "0.07em", whiteSpace: "nowrap" }}
              >
                {domain}
              </MonoLabel>
            </li>
          );
        })}
      </ol>
    </Panel>
  );
}

export function CadreScene({ data }: SceneProps) {
  const frame = useCurrentFrame();
  const { layout, s } = useLayout();
  const portrait = layout === "portrait";
  const { stats, domains } = data;

  const heroSize = portrait ? s.title : Math.round(s.title * 1.1);

  const statement = (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Reveal at={T.kicker} y={10}>
        <MonoLabel color={C.accent}>Cadre éditorial</MonoLabel>
      </Reveal>
      <div
        style={{
          marginTop: portrait ? 26 : 22,
          fontFamily: FONT.serif,
          fontWeight: 400,
          fontSize: heroSize,
          lineHeight: 1.06,
          letterSpacing: "-0.02em",
        }}
      >
        <Reveal at={T.beats[0]} y={18} dur={20}>
          <span style={{ color: beatColor(frame, 0) }}>Sources ouvertes.</span>
        </Reveal>
        <Reveal at={T.beats[1]} y={18} dur={20}>
          <span style={{ color: beatColor(frame, 1) }}>Niveau capacitaire.</span>
        </Reveal>
        <Reveal at={T.beats[2]} y={18} dur={20}>
          <span style={{ color: beatColor(frame, 2) }}>
            Aucun usage{" "}
            <em style={{ color: C.accent, fontStyle: "italic" }}>opérationnel</em>.
          </span>
        </Reveal>
      </div>
      <Reveal at={T.gloss} y={12} style={{ marginTop: portrait ? 28 : 26 }}>
        <span
          style={{
            fontFamily: FONT.sans,
            fontSize: s.body,
            lineHeight: 1.3,
            color: C.inkDim,
          }}
        >
          Comprendre un système, pas l'employer.
        </span>
      </Reveal>
    </div>
  );

  const limits = (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          opacity: ramp(frame, [T.limits - 6, T.limits + 10]),
        }}
      >
        <MonoLabel size={s.micro} style={{ whiteSpace: "nowrap" }}>
          Hors champ
        </MonoLabel>
        <Rule at={T.limits - 2} dur={26} color={C.line} style={{ flex: 1 }} />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: portrait ? 16 : 14,
          marginTop: portrait ? 22 : 18,
        }}
      >
        {LIMITS.map((text, i) => (
          <LimitLine
            key={text}
            text={text}
            at={T.limits + 6 + i * T.limitStep}
            // En 9:16, la plus longue limite tient ainsi sur une ligne.
            size={portrait ? s.label - 2 : s.label}
            tracking={portrait ? "0.1em" : "0.14em"}
          />
        ))}
      </div>
      {/* Le tampon pivoté déborde de sa boîte : la marge basse l'y ramène. */}
      <div style={{ marginTop: portrait ? 44 : 42, marginBottom: 20, paddingLeft: 6 }}>
        <Stamp at={T.stamp} rotate={-3} size={s.label}>
          Analyse — diffusion publique
        </Stamp>
      </div>
    </div>
  );

  const index = (
    <DomainIndex domains={domains} count={stats.domains} portrait={portrait} />
  );

  if (portrait) {
    return (
      <SceneArea>
        {statement}
        <div style={{ marginTop: 52 }}>{limits}</div>
        <div style={{ marginTop: 52, flex: 1, display: "flex" }}>{index}</div>
      </SceneArea>
    );
  }

  return (
    <SceneArea
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 580px",
        columnGap: 64,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
        {statement}
        <div style={{ flex: 1 }} />
        {limits}
      </div>
      <div style={{ display: "flex", minWidth: 0 }}>{index}</div>
    </SceneArea>
  );
}
