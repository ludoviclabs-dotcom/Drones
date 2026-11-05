import "./fonts";
import type { ComponentType } from "react";
import { AbsoluteFill, Composition, Folder } from "remotion";
import { PanoplieFilm, SCENES } from "../PanoplieFilm";
import { C, FONT } from "../theme";
import { buildFilmData } from "../build-film-data";
import type { SceneProps } from "../types";
import {
  CHAPTERS,
  FILM_DURATION,
  FILM_FPS,
  FILM_HEIGHT,
  FILM_WIDTH,
} from "../timeline";

/**
 * Racine Remotion — Studio (`npm run film:studio`) et rendus MP4
 * (`npm run film:render`, `npm run film:render:portrait`).
 *
 * Les données sont lues dans le registre au moment du bundle : un rendu MP4
 * reprend toujours les chiffres du site au commit courant.
 */
const data = buildFilmData();

/**
 * Un chapitre seul dans le Studio : sur le fond et la typographie du film
 * (sinon l'export d'image d'un chapitre sort sur fond transparent).
 */
function onFilmGround(Scene: ComponentType<SceneProps>) {
  function ChapterOnGround(props: SceneProps) {
    return (
      <AbsoluteFill style={{ background: C.bg, color: C.ink, fontFamily: FONT.sans }}>
        <Scene {...props} />
      </AbsoluteFill>
    );
  }
  return ChapterOnGround;
}

const CHAPTER_COMPONENTS = Object.fromEntries(
  CHAPTERS.map((chapter) => [chapter.id, onFilmGround(SCENES[chapter.id])]),
);

export function RemotionRoot() {
  return (
    <>
      <Composition
        id="PanoplieFilm"
        component={PanoplieFilm}
        width={FILM_WIDTH}
        height={FILM_HEIGHT}
        fps={FILM_FPS}
        durationInFrames={FILM_DURATION}
        defaultProps={{ data }}
      />
      <Composition
        id="PanoplieFilm-Portrait"
        component={PanoplieFilm}
        width={FILM_HEIGHT}
        height={FILM_WIDTH}
        fps={FILM_FPS}
        durationInFrames={FILM_DURATION}
        defaultProps={{ data }}
      />
      <Folder name="Chapitres">
        {CHAPTERS.map((chapter) => (
          <Composition
            key={chapter.id}
            id={`Chapitre-${chapter.num}-${chapter.id}`}
            component={CHAPTER_COMPONENTS[chapter.id]}
            width={FILM_WIDTH}
            height={FILM_HEIGHT}
            fps={FILM_FPS}
            durationInFrames={chapter.durationInFrames}
            defaultProps={{ data }}
          />
        ))}
      </Folder>
    </>
  );
}
