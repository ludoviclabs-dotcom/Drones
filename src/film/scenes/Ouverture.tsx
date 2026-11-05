import { useCurrentFrame } from "remotion";
import type { SceneProps } from "../types";
import { FILM_FPS } from "../timeline";
import { C, FONT } from "../theme";
import {
  CountUp,
  FilmDrone,
  MonoLabel,
  Reveal,
  Rule,
  SceneArea,
  Typewriter,
  ramp,
  useLayout,
} from "../primitives";

const LEAD = "Un système d'armes n'est jamais un ";
const STRESS = "simple achat";
const TYPE_AT = 40;
const TYPE_CPS = 34;
const STRESS_AT = TYPE_AT + Math.ceil((LEAD.length / TYPE_CPS) * FILM_FPS);
const STRESS_END = STRESS_AT + Math.ceil((STRESS.length / TYPE_CPS) * FILM_FPS);
const RIBBON_AT = 150;

/**
 * 01 · Ouverture (9 s) — le drone se trace au trait, la promesse du site
 * s'écrit, puis le ruban de compteurs du registre se remplit.
 *
 *   0–70    tracé de la schématique (eurodrone, vue de dessus)
 *   40–90   titre tapé, « simple achat » en italique cuivre
 *   150–220 ruban : systèmes, sources, affirmations tracées, vérifiées
 *   240     image clé : tout est posé
 */
export function OuvertureScene({ data }: SceneProps) {
  const frame = useCurrentFrame();
  const { layout, s } = useLayout();
  const portrait = layout === "portrait";
  const { stats } = data;

  const ribbon = [
    { label: "Systèmes documentés", value: stats.systems },
    { label: "Sources indexées", value: stats.sources },
    { label: "Affirmations tracées", value: stats.claims },
    { label: "Vérifiées", value: stats.verified, accent: true },
  ];

  const droneSize = portrait ? 400 : 470;
  const drone = (
    <div
      style={{
        position: "relative",
        width: droneSize,
        opacity: 0.9 - 0.4 * ramp(frame, [RIBBON_AT - 30, RIBBON_AT + 20]),
      }}
    >
      <FilmDrone
        size={droneSize}
        draw={ramp(frame, [0, 70])}
        color={C.inkDim}
        strokeWidth={1.4}
      />
      <div
        style={{
          marginTop: 4,
          textAlign: "center",
          whiteSpace: "nowrap",
          opacity: ramp(frame, [50, 70]),
        }}
      >
        <MonoLabel size={s.micro}>Schématique · vue de dessus</MonoLabel>
      </div>
    </div>
  );

  return (
    <SceneArea>
      {portrait ? (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
          {drone}
        </div>
      ) : (
        <div
          style={{
            position: "absolute",
            right: s.padX,
            top: s.padTop + 10,
          }}
        >
          {drone}
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: portrait ? 40 : 34,
          marginTop: portrait ? 70 : 40,
          maxWidth: portrait ? "100%" : 1180,
        }}
      >
        <Reveal at={8} y={12}>
          <MonoLabel color={C.accent}>
            Observatoire en sources ouvertes
            {/* En 9:16, deux lignes franches plutôt qu'un retour imposé. */}
            {portrait ? <br /> : " · "}
            {stats.domains} domaines
          </MonoLabel>
        </Reveal>

        <h1
          style={{
            margin: 0,
            fontFamily: FONT.serif,
            fontWeight: 400,
            fontSize: s.display,
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
            color: C.ink,
          }}
        >
          <Typewriter text={LEAD} at={TYPE_AT} cps={TYPE_CPS} caret={false} />
          <em style={{ color: C.accent, fontStyle: "italic" }}>
            <Typewriter text={STRESS} at={STRESS_AT} cps={TYPE_CPS} caret={frame < RIBBON_AT} />
          </em>
          <span style={{ opacity: ramp(frame, [STRESS_END, STRESS_END + 4]) }}>.</span>
        </h1>
      </div>

      <div style={{ flex: 1 }} />

      {/* Ruban de compteurs — dérivés du registre, jamais saisis. */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: portrait ? "1fr 1fr" : "repeat(4, 1fr)",
          border: `2px solid ${C.line}`,
          background: C.line,
          gap: 2,
          opacity: ramp(frame, [RIBBON_AT - 2, RIBBON_AT + 14]),
          translate: `0 ${(1 - ramp(frame, [RIBBON_AT - 2, RIBBON_AT + 18])) * 20}px`,
        }}
      >
        {ribbon.map((item, i) => (
          <div key={item.label} style={{ background: C.panel, padding: "26px 30px" }}>
            <MonoLabel
              size={s.micro}
              style={{ whiteSpace: "nowrap", letterSpacing: "0.14em" }}
            >
              {item.label}
            </MonoLabel>
            <div
              style={{
                marginTop: 14,
                fontFamily: FONT.mono,
                fontSize: s.figure,
                lineHeight: 1,
                color: item.accent ? C.accent : C.ink,
              }}
            >
              <CountUp value={item.value} at={RIBBON_AT + 6 + i * 10} dur={44} />
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          marginTop: 24,
        }}
      >
        <Rule at={200} dur={20} color={C.accentDeep} style={{ width: 120 }} />
        <span style={{ opacity: ramp(frame, [206, 222]) }}>
          <MonoLabel size={s.micro}>Registre arrêté au {stats.updatedLabel}</MonoLabel>
        </span>
      </div>
    </SceneArea>
  );
}
