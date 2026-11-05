import type { ComponentType } from "react";
import {
  AbsoluteFill,
  Series,
  interpolate,
  useCurrentFrame,
} from "remotion";
import {
  CHAPTERS,
  CHAPTER_FADE,
  FILM_DURATION,
  chapterAt,
  formatTimecode,
  type ChapterId,
} from "./timeline";
import { C, FONT, TRACKING } from "./theme";
import { FilmDrone, Grain, MonoLabel, useLayout } from "./primitives";
import type { FilmProps, SceneProps } from "./types";
import { OuvertureScene } from "./scenes/Ouverture";
import { DossierScene } from "./scenes/Dossier";
import { PreuveScene } from "./scenes/Preuve";
import { ComparerScene } from "./scenes/Comparer";
import { InstrumentsScene } from "./scenes/Instruments";
import { CadreScene } from "./scenes/Cadre";
import { FinalScene } from "./scenes/Final";

export const SCENES: Record<ChapterId, ComponentType<SceneProps>> = {
  ouverture: OuvertureScene,
  dossier: DossierScene,
  preuve: PreuveScene,
  comparer: ComparerScene,
  instruments: InstrumentsScene,
  cadre: CadreScene,
  "a-vous": FinalScene,
};

/** Fondu d'entrée/sortie d'un chapitre ; le dernier tient son image finale. */
function ChapterFade({
  duration,
  first,
  last,
  children,
}: {
  duration: number;
  first: boolean;
  last: boolean;
  children: React.ReactNode;
}) {
  const frame = useCurrentFrame();
  const fadeIn = first
    ? 1
    : interpolate(frame, [0, CHAPTER_FADE], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
  const fadeOut = last
    ? 1
    : interpolate(frame, [duration - CHAPTER_FADE, duration], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
  return (
    <AbsoluteFill style={{ opacity: Math.min(fadeIn, fadeOut) }}>
      {children}
    </AbsoluteFill>
  );
}

/**
 * Cartouche du film, au-dessus de tous les chapitres : titre courant,
 * minutage, mention de cadre et le drone, qui parcourt la ligne de vol au
 * rythme de la lecture — le fil conducteur demandé, au trait du site.
 */
function FilmChrome() {
  const frame = useCurrentFrame();
  const { layout, s, width } = useLayout();
  const chapter = chapterAt(frame);
  const progress = frame / (FILM_DURATION - 1);
  const portrait = layout === "portrait";

  const top = portrait ? 70 : 46;
  const railY = portrait ? 176 : 112;
  const railX0 = s.padX;
  const railX1 = width - s.padX;
  const droneSize = portrait ? 50 : 44;
  // Le drone tient sa ligne de vol avec une légère respiration (Math.sin).
  const bob = Math.sin(frame / 14) * 3;
  // Le drone entier reste dans les marges, du début à la dernière image.
  const droneX =
    railX0 + droneSize / 2 + (railX1 - railX0 - droneSize) * progress;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* En-tête : marque à gauche, chapitre courant à droite. */}
      <div
        style={{
          position: "absolute",
          left: s.padX,
          right: s.padX,
          top,
          display: "flex",
          flexDirection: portrait ? "column" : "row",
          justifyContent: "space-between",
          alignItems: portrait ? "flex-start" : "baseline",
          gap: portrait ? 10 : 24,
        }}
      >
        <span style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
          <span
            style={{
              fontFamily: FONT.serif,
              fontSize: s.micro * 1.6,
              color: C.ink,
              letterSpacing: "-0.01em",
            }}
          >
            Panoplie
          </span>
          <MonoLabel size={s.micro} style={{ letterSpacing: TRACKING.micro }}>
            Briefing
          </MonoLabel>
        </span>
        <MonoLabel size={s.micro} style={{ letterSpacing: TRACKING.micro }}>
          <span style={{ color: C.accent }}>{chapter.num}</span>
          {` / ${String(CHAPTERS.length).padStart(2, "0")} — ${
            // En 9:16, le libellé court tient sur une ligne.
            portrait ? chapter.label : chapter.title
          }`}
        </MonoLabel>
      </div>

      {/* Ligne de vol : filet, graduation par chapitre, drone-curseur. */}
      <div
        style={{
          position: "absolute",
          left: railX0,
          width: railX1 - railX0,
          top: railY,
          height: 2,
          background: C.line,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: railX0,
          width: (railX1 - railX0) * progress,
          top: railY,
          height: 2,
          background: C.accentDeep,
        }}
      />
      {CHAPTERS.slice(1).map((c) => (
        <div
          key={c.id}
          style={{
            position: "absolute",
            left: railX0 + ((railX1 - railX0) * c.from) / FILM_DURATION,
            top: railY - 6,
            width: 2,
            height: 14,
            background: frame >= c.from ? C.accentDeep : C.lineBright,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: droneX - droneSize / 2,
          top: railY - droneSize / 2 + bob,
          // Vue de dessus : le nez pointe vers la droite, sens de lecture.
          rotate: "90deg",
        }}
      >
        <FilmDrone size={droneSize} color={C.ink} strokeWidth={4} />
      </div>

      {/* Pied : minutage et cadre éthique, constants. */}
      <div
        style={{
          position: "absolute",
          left: s.padX,
          right: s.padX,
          bottom: portrait ? 90 : 48,
          display: "flex",
          flexDirection: portrait ? "column" : "row",
          justifyContent: "space-between",
          gap: portrait ? 8 : 24,
        }}
      >
        <MonoLabel size={s.micro} style={{ letterSpacing: TRACKING.micro }}>
          {formatTimecode(frame + 1)} / {formatTimecode(FILM_DURATION)}
        </MonoLabel>
        <MonoLabel size={s.micro} style={{ letterSpacing: TRACKING.micro }}>
          Sources ouvertes · aucun usage opérationnel
        </MonoLabel>
      </div>
    </AbsoluteFill>
  );
}

/** Composition principale : sept chapitres enchaînés sous un cartouche commun. */
export function PanoplieFilm({ data }: FilmProps) {
  return (
    <AbsoluteFill
      style={{
        background: C.bg,
        color: C.ink,
        fontFamily: FONT.sans,
        // Mêmes métriques dans le lecteur du site et au rendu MP4.
        lineHeight: 1.2,
        fontSize: 16,
        overflow: "hidden",
      }}
    >
      <Series>
        {CHAPTERS.map((chapter, i) => {
          const Scene = SCENES[chapter.id];
          return (
            <Series.Sequence
              key={chapter.id}
              name={`${chapter.num} · ${chapter.label}`}
              durationInFrames={chapter.durationInFrames}
            >
              <ChapterFade
                duration={chapter.durationInFrames}
                first={i === 0}
                last={i === CHAPTERS.length - 1}
              >
                <Scene data={data} />
              </ChapterFade>
            </Series.Sequence>
          );
        })}
      </Series>
      <FilmChrome />
      <Grain />
    </AbsoluteFill>
  );
}
