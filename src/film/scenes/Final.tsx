import { interpolateColors, useCurrentFrame } from "remotion";
import { formatCount } from "@/lib/format";
import type { SceneProps } from "../types";
import { FILM_FPS } from "../timeline";
import { C, FONT } from "../theme";
import {
  FilmDrone,
  MonoLabel,
  Reveal,
  Rule,
  SceneArea,
  Typewriter,
  ramp,
  useLayout,
} from "../primitives";

/**
 * 07 · À vous (7 s) — carton final, tenu à l'écran quand le lecteur s'arrête.
 * Page de titre du recueil : la marque, ce qu'il contient, l'invitation et
 * l'adresse (lisible dans un export MP4), la promesse en rappel. Le drone de
 * l'ouverture revient, petit, à la même place : la boucle est bouclée.
 * Aucun faux bouton : le lecteur du site pose ses vrais liens à la fin.
 *
 *   0–64     tracé du drone, légende de l'ouverture (50)
 *   8        surtitre
 *   16–48    la marque s'écrit de gauche à droite, filet cuivre en tête
 *   46       ce que contient le recueil
 *   66       « Ouvrez le recueil. » — « recueil » vire au cuivre (82–98)
 *   94–132   filet de pied, adresse tapée (curseur éteint à 132), promesse
 *   132–210  image tenue (image clé : 180 = image finale)
 */

const T = {
  drone: 0,
  droneDur: 64,
  caption: 50,
  kicker: 8,
  brand: 16,
  brandDur: 32,
  lede: 46,
  cta: 66,
  stress: 82,
  rule: 94,
  hostLabel: 98,
  host: 104,
  promise: 114,
} as const;

const HOST_CPS = 44;

const KICKER = "Observatoire en sources ouvertes";
const PROMISE = "Un système d'armes n'est jamais un simple achat.";

/** « 1 dossier », « 153 dossiers » — accord à la française (0 et 1 au singulier). */
function counted(value: number, singular: string, plural: string): string {
  return `${formatCount(value)} ${value > 1 ? plural : singular}`;
}

/** Corps de base, réduit si le texte (largeur en em) dépasse `maxWidth` px. */
function fitSize(base: number, maxWidth: number, widthEm: number): number {
  return widthEm > 0 ? Math.min(base, Math.floor(maxWidth / widthEm)) : base;
}

/** La marque, écrite par un essuyage de gauche à droite que mène un filet cuivre. */
function Brand({ name, size, at, dur }: { name: string; size: number; at: number; dur: number }) {
  const frame = useCurrentFrame();
  const p = ramp(frame, [at, at + dur]);
  const lead = ramp(frame, [at, at + 4]) * (1 - ramp(frame, [at + dur - 2, at + dur + 8]));
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <h1
        style={{
          margin: 0,
          fontFamily: FONT.serif,
          fontWeight: 400,
          fontSize: size,
          lineHeight: 1,
          letterSpacing: "-0.025em",
          color: C.ink,
          // Marges négatives : jambages et approches ne sont pas rognés en cours d'essuyage.
          clipPath: p < 1 ? `inset(-20% ${(1 - p) * 100}% -30% -5%)` : undefined,
        }}
      >
        {name}
      </h1>
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          left: `${p * 100}%`,
          top: "14%",
          width: 4,
          height: "86%",
          background: C.accent,
          opacity: lead,
        }}
      />
    </div>
  );
}

/**
 * Le drone de l'ouverture, revenu petit : même tracé, même légende. Pas de
 * crochets d'angle autour de la silhouette — ils liraient comme un cadre de visée.
 */
function DroneFigure({ size, captionSize }: { size: number; captionSize: number }) {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flexShrink: 0,
      }}
    >
      <FilmDrone
        size={size}
        draw={ramp(frame, [T.drone, T.drone + T.droneDur])}
        color={C.inkDim}
        strokeWidth={1.6}
      />
      <div
        style={{
          marginTop: 6,
          whiteSpace: "nowrap",
          opacity: ramp(frame, [T.caption, T.caption + 16]),
        }}
      >
        <MonoLabel size={captionSize}>Schématique · vue de dessus</MonoLabel>
      </div>
    </div>
  );
}

export function FinalScene({ data }: SceneProps) {
  const frame = useCurrentFrame();
  const { layout, s } = useLayout();
  const portrait = layout === "portrait";
  const { stats, site } = data;

  const hostEnd = T.host + Math.ceil((site.host.length / HOST_CPS) * FILM_FPS);
  const stress = interpolateColors(ramp(frame, [T.stress, T.stress + 16]), [0, 1], [C.ink, C.accent]);

  // Marque et adresse viennent des données : le corps se réduit si elles
  // s'allongent, pour ne jamais déborder (chasse moyenne Newsreader ≈ 0,47 em,
  // IBM Plex Mono = 0,6 em + interlettrage).
  const brandSize = fitSize(portrait ? 212 : 232, portrait ? 900 : 1080, site.name.length * 0.47);
  const ledeSize = portrait ? 48 : 44;
  const ctaSize = portrait ? 92 : 96;
  const hostSize = fitSize(portrait ? 56 : 54, portrait ? 900 : 760, site.host.length * 0.61);

  const kicker = (
    <Reveal at={T.kicker} y={12}>
      <MonoLabel color={C.accent}>{KICKER}</MonoLabel>
    </Reveal>
  );

  const lede = (
    <Reveal at={T.lede} y={16}>
      <p
        style={{
          margin: 0,
          fontFamily: FONT.sans,
          fontSize: ledeSize,
          lineHeight: 1.3,
          color: C.inkDim,
        }}
      >
        <span style={{ color: C.ink }}>{counted(stats.systems, "dossier", "dossiers")}</span>,{" "}
        <span style={{ color: C.ink }}>{counted(stats.domains, "domaine", "domaines")}</span>,
        <br />
        une même grille de lecture.
      </p>
    </Reveal>
  );

  const cta = (
    <Reveal at={T.cta} y={20}>
      <p
        style={{
          margin: 0,
          fontFamily: FONT.serif,
          fontWeight: 400,
          fontSize: ctaSize,
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
          color: C.ink,
        }}
      >
        Ouvrez le <em style={{ fontStyle: "italic", color: stress }}>recueil</em>.
      </p>
    </Reveal>
  );

  const host = (
    <div>
      <Reveal at={T.hostLabel} y={8}>
        <MonoLabel size={s.micro}>Le recueil en ligne</MonoLabel>
      </Reveal>
      <div
        style={{
          marginTop: 12,
          fontFamily: FONT.mono,
          fontSize: hostSize,
          lineHeight: 1.1,
          letterSpacing: "0.01em",
          color: C.accent,
          whiteSpace: "nowrap",
        }}
      >
        <Typewriter text={site.host} at={T.host} cps={HOST_CPS} caret={frame < hostEnd + 14} />
      </div>
    </div>
  );

  const promise = (
    <Reveal at={T.promise} y={12}>
      <p
        style={{
          margin: 0,
          fontFamily: FONT.serif,
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: s.body,
          lineHeight: 1.2,
          color: C.inkDim,
        }}
      >
        {PROMISE}
      </p>
    </Reveal>
  );

  if (portrait) {
    return (
      <SceneArea>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <DroneFigure size={300} captionSize={s.micro} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 64 }}>
          {kicker}
          <div style={{ marginTop: 18 }}>
            <Brand name={site.name} size={brandSize} at={T.brand} dur={T.brandDur} />
          </div>
          <div style={{ marginTop: 30 }}>{lede}</div>
          <div style={{ marginTop: 56 }}>{cta}</div>
        </div>
        <div style={{ flex: 1 }} />
        {promise}
        <Rule at={T.rule} dur={26} color={C.lineBright} style={{ marginTop: 34 }} />
        <div style={{ marginTop: 30 }}>{host}</div>
      </SceneArea>
    );
  }

  return (
    <SceneArea>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginTop: 20,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          {kicker}
          <div style={{ marginTop: 20 }}>
            <Brand name={site.name} size={brandSize} at={T.brand} dur={T.brandDur} />
          </div>
          <div style={{ marginTop: 26 }}>{lede}</div>
          <div style={{ marginTop: 44 }}>{cta}</div>
        </div>
        {/* Posé sur la ligne de l'appel : légende et « Ouvrez le recueil. » partagent leur ligne de base. */}
        <div style={{ marginBottom: 22 }}>
          <DroneFigure size={330} captionSize={s.micro} />
        </div>
      </div>
      <div style={{ flex: 1 }} />
      <Rule at={T.rule} dur={28} color={C.lineBright} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 48,
          marginTop: 28,
        }}
      >
        {host}
        <div style={{ textAlign: "right", paddingBottom: 6 }}>{promise}</div>
      </div>
    </SceneArea>
  );
}
