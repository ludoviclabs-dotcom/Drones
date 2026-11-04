import "./fonts";
import { Composition, Folder } from "remotion";
import { PanoplieFilm, SCENES } from "../PanoplieFilm";
import { buildFilmData } from "../build-film-data";
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
            component={SCENES[chapter.id]}
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
