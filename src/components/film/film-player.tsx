"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import { Player, type PlayerRef } from "@remotion/player";
import { track } from "@vercel/analytics";
import { PanoplieFilm } from "@/film/PanoplieFilm";
import {
  CHAPTERS,
  FILM_DURATION,
  FILM_FPS,
  FILM_HEIGHT,
  FILM_WIDTH,
  chapterAt,
  chapterById,
  formatTimecode,
  type Chapter,
} from "@/film/timeline";
import type { FilmData } from "@/film/types";

/**
 * Lecteur du briefing — chargé à la demande (jamais dans le bundle initial).
 *
 * Le film est une composition Remotion rendue en direct : nette à toute
 * taille, alimentée par les données du registre, et pilotable image par image.
 * Les commandes sont celles du site, pas celles de Remotion : barre de
 * chapitres cliquable, lecture/pause, chapitre précédent/suivant, rejouer,
 * sous-titre éditorial lu par les lecteurs d'écran.
 *
 * Mouvement réduit : pas de lecture automatique ; chaque chapitre s'ouvre sur
 * son image clé, et l'on avance chapitre par chapitre comme dans un diaporama.
 * La lecture reste possible, à la demande.
 *
 * Licence : @remotion/player est gratuit pour un particulier ou une structure
 * de trois personnes au plus ; au-delà, une licence entreprise Remotion est
 * requise (https://remotion.dev/license).
 */

export type FilmPlayerVariant = "dialog" | "page";


const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
// Écran étroit et vertical : la composition 9:16 reste lisible sur téléphone.
const PORTRAIT_QUERY = "(max-width: 640px) and (orientation: portrait)";
// Téléphone tenu à l'horizontale : peu de hauteur, le film prime.
const SHORT_QUERY = "(max-height: 520px)";

function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

const BTN =
  "inline-flex min-h-11 items-center justify-center gap-2 border border-line-bright px-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40";
const BTN_ICON =
  "inline-flex h-11 w-11 items-center justify-center border border-line-bright text-ink transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40";

function PlayIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2 1 L11 6 L2 11 Z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <rect x="2" y="1" width="3" height="10" fill="currentColor" />
      <rect x="7" y="1" width="3" height="10" fill="currentColor" />
    </svg>
  );
}

function StepIcon({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      aria-hidden="true"
      style={direction === "prev" ? { transform: "scaleX(-1)" } : undefined}
    >
      <path d="M1 1 L8 6 L1 11 Z" fill="currentColor" />
      <rect x="9" y="1" width="2" height="10" fill="currentColor" />
    </svg>
  );
}

export interface FilmPlayerProps {
  data: FilmData;
  variant: FilmPlayerVariant;
  /** Identifiant de chapitre de départ (`preuve`…), sinon le début. */
  startChapter?: string;
  /** Fermer le lecteur (variante dialog). */
  onClose?: () => void;
  /** Origine de l'ouverture, pour la mesure d'audience. */
  source?: string;
}

export default function FilmPlayer({
  data,
  variant,
  startChapter,
  onClose,
  source = "inconnue",
}: FilmPlayerProps) {
  const playerRef = useRef<PlayerRef>(null);
  const reduced = useMediaQuery(REDUCED_QUERY);
  const portrait = useMediaQuery(PORTRAIT_QUERY);
  const short = useMediaQuery(SHORT_QUERY);

  const start = startChapter ? chapterById(startChapter) : undefined;
  const startFrame = start
    ? start.from + (reduced ? start.keyFrame : 0)
    : reduced
      ? CHAPTERS[0].keyFrame
      : 0;

  const [frame, setFrame] = useState(startFrame);
  // `autoPlay` démarre avant l'abonnement aux évènements : état initial aligné.
  const [playing, setPlaying] = useState(!reduced);
  const [ended, setEnded] = useState(false);

  // Abonnement aux évènements du lecteur — la source de vérité est le Player.
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    const onFrame = (e: { detail: { frame: number } }) => {
      setFrame(e.detail.frame);
      setPlaying(player.isPlaying());
    };
    const onSeeked = (e: { detail: { frame: number } }) => {
      setFrame(e.detail.frame);
      setEnded(false);
    };
    const onPlay = () => {
      setPlaying(true);
      setEnded(false);
    };
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      setPlaying(false);
      setEnded(true);
      track("briefing_termine", { source });
    };
    // Nouvelle instance (orientation) : réaligner l'état sur le lecteur.
    const sync = window.setTimeout(() => setPlaying(player.isPlaying()), 0);
    player.addEventListener("frameupdate", onFrame);
    player.addEventListener("seeked", onSeeked);
    player.addEventListener("play", onPlay);
    player.addEventListener("pause", onPause);
    player.addEventListener("ended", onEnded);
    return () => {
      window.clearTimeout(sync);
      player.removeEventListener("frameupdate", onFrame);
      player.removeEventListener("seeked", onSeeked);
      player.removeEventListener("play", onPlay);
      player.removeEventListener("pause", onPause);
      player.removeEventListener("ended", onEnded);
    };
    // Le Player est recréé quand l'orientation change : on se réabonne.
  }, [portrait, source]);

  // Mesure de l'ouverture (la lecture automatique passe par `autoPlay`).
  useEffect(() => {
    track("briefing_ouvert", { source });
    // Volontairement au montage seulement.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = chapterAt(frame);
  const currentIndex = CHAPTERS.indexOf(current);

  /**
   * Aller à une image et lire. Remotion reprend seul la lecture après un
   * `seekTo()` lancé pendant la lecture : un `play()` en plus laisserait sa
   * reprise en attente, et le film repartirait du début une fois terminé.
   */
  const seekAndPlay = useCallback((target: number) => {
    const player = playerRef.current;
    if (!player) return;
    const wasPlaying = player.isPlaying();
    player.seekTo(target);
    if (!wasPlaying) player.play();
  }, []);

  /** Mouvement réduit : se poser sur une image fixe, sans lecture. */
  const showStill = useCallback((target: number) => {
    const player = playerRef.current;
    if (!player) return;
    player.pause();
    player.seekTo(target);
  }, []);

  const goTo = useCallback(
    (chapter: Chapter) => {
      setEnded(false);
      if (reduced) showStill(chapter.from + chapter.keyFrame);
      else seekAndPlay(chapter.from);
    },
    [reduced, seekAndPlay, showStill],
  );

  const toggle = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    if (ended) {
      seekAndPlay(0);
      return;
    }
    player.toggle();
  }, [ended, seekAndPlay]);

  const replay = useCallback(() => {
    setEnded(false);
    if (reduced) showStill(CHAPTERS[0].keyFrame);
    else seekAndPlay(0);
  }, [reduced, seekAndPlay, showStill]);

  const prev = CHAPTERS[currentIndex - 1];
  const next = CHAPTERS[currentIndex + 1];

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    // Les champs et boutons gardent leur comportement natif (Entrée, Espace).
    // Alt+← (retour du navigateur) et autres raccourcis restent au navigateur.
    if (e.altKey || e.metaKey || e.ctrlKey) return;
    const target = e.target as HTMLElement;
    const onControl = target.closest("button, a") !== null;
    if (e.key === "ArrowRight" && next) {
      e.preventDefault();
      goTo(next);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      // Comme un lecteur : revenir au début du chapitre, puis au précédent.
      // En mouvement réduit, on est toujours sur une image clé : chapitre précédent.
      const within = frame - current.from;
      if (reduced) goTo(prev ?? current);
      else goTo(within > FILM_FPS || !prev ? current : prev);
    } else if ((e.key === " " || e.key === "k") && !onControl) {
      e.preventDefault();
      toggle();
    } else if (e.key === "Home") {
      e.preventDefault();
      replay();
    }
  };

  const width = portrait ? FILM_HEIGHT : FILM_WIDTH;
  const height = portrait ? FILM_WIDTH : FILM_HEIGHT;
  // Le film tient dans la hauteur disponible sans défilement.
  // Le film tient dans la hauteur visible ; en modale, titre, chapitres,
  // commandes et sous-titre restent à l'écran (le sous-titre défile sur
  // téléphone, où le film prime).
  const frameBudget = short
    ? "max(calc(100dvh - 6rem), 60dvh)"
    : portrait
    ? "calc(100dvh - 13rem)"
    : variant === "dialog"
      ? "calc(100dvh - 19rem)"
      : "calc(100dvh - 18rem)";
  const maxWidth = `min(100%, calc(${frameBudget} * ${width / height}))`;

  // Objet stable : sans lui, la composition se rend deux fois par image.
  const inputProps = useMemo(() => ({ data }), [data]);
  // Fin du film, ou dernière image clé atteinte en mouvement réduit.
  const showEnd = ended || (reduced && !next);

  return (
    <div
      className="flex flex-col gap-4"
      onKeyDown={onKeyDown}
      // Focusable : Espace et K pilotent la lecture depuis le lecteur lui-même.
      tabIndex={0}
      role="group"
      aria-label="Lecteur du briefing"
      data-film-player=""
      data-chapter={current.id}
      data-orientation={portrait ? "portrait" : "paysage"}
      data-state={ended ? "ended" : playing ? "playing" : "paused"}
    >
      {/* Barre de chapitres : un segment par chapitre, proportionnel à sa durée. */}
      <nav aria-label="Chapitres du briefing">
        <ol className="flex gap-1">
          {CHAPTERS.map((chapter, i) => {
            const fill =
              i < currentIndex
                ? 1
                : i > currentIndex
                  ? 0
                  : (frame - chapter.from) / chapter.durationInFrames;
            const active = i === currentIndex;
            return (
              <li
                key={chapter.id}
                className="min-w-0"
                style={{ flexGrow: chapter.durationInFrames, flexBasis: 0 }}
              >
                <button
                  type="button"
                  onClick={() => goTo(chapter)}
                  aria-current={active ? "step" : undefined}
                  aria-label={`Chapitre ${chapter.num} : ${chapter.label}`}
                  className="group flex min-h-11 w-full flex-col justify-center gap-2 pb-1 pt-3 text-left md:min-h-0"
                >
                  <span className="relative block h-[3px] w-full overflow-hidden bg-line-bright">
                    <span
                      className="absolute inset-y-0 left-0 bg-accent"
                      style={{ width: `${Math.min(1, Math.max(0, fill)) * 100}%` }}
                    />
                  </span>
                  <span
                    className={`hidden truncate font-mono text-[10px] uppercase tracking-[0.16em] transition-colors group-hover:text-accent md:block ${
                      active ? "text-ink" : "text-ink-faint"
                    }`}
                  >
                    <span className={active ? "text-accent" : undefined}>
                      {chapter.num}
                    </span>{" "}
                    {chapter.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Le film est décoratif pour les lecteurs d'écran : sous-titre et
          transcription en portent le texte, sans titres qui changent à chaque image. */}
      <div className="mx-auto w-full" style={{ maxWidth }} aria-hidden="true">
        <Player
          // Nouvelle instance si l'orientation change (dimensions de composition).
          key={portrait ? "portrait" : "paysage"}
          ref={playerRef}
          component={PanoplieFilm}
          inputProps={inputProps}
          durationInFrames={FILM_DURATION}
          fps={FILM_FPS}
          compositionWidth={width}
          compositionHeight={height}
          initialFrame={ended ? 0 : Math.min(frame, FILM_DURATION - 1)}
          // Film sans bande-son : déclaré muet, le lecteur n'attend pas le
          // contexte audio (bloqué sans geste) et la lecture automatique part.
          initiallyMuted
          // Une nouvelle instance (orientation) ne relance que ce qui jouait.
          autoPlay={!reduced && playing && !ended}
          controls={false}
          clickToPlay
          doubleClickToFullscreen
          spaceKeyToPlayOrPause={false}
          numberOfSharedAudioTags={0}
          moveToBeginningWhenEnded={false}
          style={{ width: "100%", display: "block" }}
          className="border border-line-bright bg-bg"
        />

      </div>

      {/* Fin du film : les sorties s'ajoutent sous le carton final, sans le masquer. */}
      {showEnd ? (
        <div
          className="flex flex-wrap items-center gap-3 border-y border-line-bright py-3"
          data-film-end=""
        >
          <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
            Fin du briefing
          </span>
          <Link
            href="/#catalogue"
            onClick={onClose}
            className="inline-flex min-h-11 items-center border border-accent bg-accent px-5 font-mono text-[11px] uppercase tracking-[0.16em] text-bg transition-colors hover:border-ink hover:bg-ink"
          >
            Ouvrir le recueil →
          </Link>
          <Link href="/comparateur" onClick={onClose} className={BTN}>
            Comparer des dossiers
          </Link>
          <Link href="/console" onClick={onClose} className={BTN}>
            Console OSINT
          </Link>
          <button type="button" onClick={replay} className={BTN}>
            Revoir
          </button>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={toggle}
          className={`${BTN} min-w-[7.5rem]`}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
          <span>{playing ? "Pause" : ended ? "Revoir" : "Lecture"}</span>
        </button>
        <button
          type="button"
          onClick={() => prev && goTo(prev)}
          disabled={!prev}
          className={BTN_ICON}
          aria-label={prev ? `Chapitre précédent : ${prev.label}` : "Chapitre précédent"}
        >
          <StepIcon direction="prev" />
        </button>
        <button
          type="button"
          onClick={() => next && goTo(next)}
          disabled={!next}
          className={BTN_ICON}
          aria-label={next ? `Chapitre suivant : ${next.label}` : "Chapitre suivant"}
        >
          <StepIcon direction="next" />
        </button>
        <span className="ml-1 font-mono text-[11px] tabular-nums tracking-[0.12em] text-ink-faint">
          {/* Images déjà montrées : la dernière affiche la durée totale. */}
          {formatTimecode(frame + 1)} / {formatTimecode(FILM_DURATION)}
        </span>
        {reduced ? (
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
            · Mouvement réduit : images clés
          </span>
        ) : null}
      </div>

      {/* Sous-titre éditorial du chapitre — annoncé à chaque changement. */}
      <p
        aria-live="polite"
        data-film-caption=""
        className="max-w-[72ch] border-l-2 border-accent pl-4 font-sans text-[15px] leading-relaxed text-ink-dim"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
          {current.num} · {current.label}
        </span>
        <br />
        {current.caption(data)}
      </p>
    </div>
  );
}
