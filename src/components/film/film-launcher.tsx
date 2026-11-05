"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { FILM_SECONDS } from "@/film/timeline";
import type { FilmData } from "@/film/types";

/**
 * Point d'entrée du briefing sur l'accueil : un bouton discret dans le hero,
 * une fenêtre modale native (<dialog>) et, à la première visite, une simple
 * invitation non bloquante — pas d'ouverture forcée.
 *
 * Pourquoi pas d'ouverture automatique : une surimpression plein écran à
 * l'arrivée masque le contenu (pénalité « interstitiel intrusif » côté
 * moteurs de recherche, en particulier sur mobile), retarde l'interaction
 * et s'ajoute au bandeau de cadre déjà présent. L'invitation laisse le choix ;
 * `?demo=1` ouvre directement le film pour un lien envoyé à un prospect.
 *
 * Le lecteur (Remotion + composition) n'est téléchargé qu'à l'ouverture.
 */

const FilmPlayer = dynamic(() => import("./film-player"), {
  ssr: false,
  loading: () => (
    <div className="flex aspect-video w-full items-center justify-center border border-line-bright bg-panel font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">
      Chargement du briefing…
    </div>
  ),
});

/** Mémoire de visite : « vu » (film ouvert) ou « ignore » (invitation refusée). */
export const FILM_STORAGE_KEY = "panoplie:briefing";
/** Délai avant l'invitation de première visite. */
const INVITE_DELAY_MS = 4000;

function readVisit(): string | null {
  try {
    return window.localStorage.getItem(FILM_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeVisit(value: "vu" | "ignore") {
  try {
    window.localStorage.setItem(FILM_STORAGE_KEY, value);
  } catch {
    // Stockage indisponible (navigation privée stricte) : sans conséquence.
  }
}

export function FilmLauncher({
  data,
  invite = false,
}: {
  data: FilmData;
  /** Proposer le film aux nouveaux visiteurs (accueil uniquement). */
  invite?: boolean;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState("hero");
  const [startChapter, setStartChapter] = useState<string | undefined>();
  const [showInvite, setShowInvite] = useState(false);

  const openFilm = useCallback((from: string, chapter?: string) => {
    setSource(from);
    setStartChapter(chapter);
    setShowInvite(false);
    writeVisit("vu");
    setOpen(true);
  }, []);

  const closeFilm = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  // Ouverture/fermeture de la modale native, verrou de défilement.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!open) return;
    if (!dialog.open) dialog.showModal();
    document.documentElement.style.overflow = "hidden";
    // Libéré aussi si la page est quittée film ouvert (bouton Retour).
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      setOpen(false);
      // Retire ?demo=1 de l'adresse : un rechargement ne rouvre pas le film.
      const url = new URL(window.location.href);
      if (url.searchParams.has("demo")) {
        url.searchParams.delete("demo");
        url.searchParams.delete("chapitre");
        window.history.replaceState(window.history.state, "", url);
      }
      // Sans défilement : un lien de fin (« /#catalogue ») garde sa cible.
      triggerRef.current?.focus({ preventScroll: true });
    };
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  // Lien direct (?demo=1[&chapitre=preuve]) puis, à défaut, invitation.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("demo") === "1") {
      // Ouverture après le montage : la modale existe, l'adresse est lue.
      const timer = window.setTimeout(
        () => openFilm("lien", params.get("chapitre") ?? undefined),
        0,
      );
      return () => window.clearTimeout(timer);
    }
    if (!invite || readVisit()) return;
    // Relu à l'échéance : un film ouvert entre-temps annule l'invitation.
    const timer = window.setTimeout(() => {
      if (!readVisit()) setShowInvite(true);
    }, INVITE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [invite, openFilm]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => openFilm("hero")}
        className="group inline-flex min-h-11 items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink transition-colors hover:text-accent"
        aria-haspopup="dialog"
      >
        <span
          aria-hidden="true"
          className="inline-flex h-8 w-8 items-center justify-center border border-accent text-accent transition-colors group-hover:bg-accent group-hover:text-bg"
        >
          <svg width="10" height="10" viewBox="0 0 12 12">
            <path d="M2 1 L11 6 L2 11 Z" fill="currentColor" />
          </svg>
        </span>
        <span>
          Voir le briefing <span className="text-ink-faint">· {FILM_SECONDS} s</span>
        </span>
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="briefing-titre"
        className="m-auto max-h-[100dvh] w-[calc(100%-1rem)] max-w-[1180px] overflow-y-auto border border-line-bright bg-bg p-4 text-ink backdrop:bg-[#0b0b08]/85 sm:w-[calc(100%-2rem)] sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 id="briefing-titre" className="font-serif text-2xl leading-tight text-ink sm:text-3xl">
              Panoplie en {FILM_SECONDS} secondes
            </h2>
            <p className="mt-1 hidden font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint sm:block">
              Données du registre · sources ouvertes · Échap pour fermer
            </p>
          </div>
          <button
            type="button"
            onClick={closeFilm}
            className="inline-flex min-h-11 shrink-0 items-center gap-2 border border-line-bright px-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink transition-colors hover:border-accent hover:text-accent"
          >
            Fermer <span aria-hidden="true">×</span>
          </button>
        </div>
        {open ? (
          <div className="mt-2">
            <FilmPlayer
              data={data}
              variant="dialog"
              startChapter={startChapter}
              onClose={closeFilm}
              source={source}
            />
          </div>
        ) : null}
      </dialog>

      {showInvite && !open ? (
        <section
          aria-label="Briefing de première visite"
          className="fixed inset-x-4 bottom-4 z-30 border border-line-bright bg-panel p-4 shadow-[0_12px_40px_rgba(0,0,0,0.45)] sm:inset-x-auto sm:right-6 sm:w-[22rem]"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
            Première visite
          </p>
          <p className="mt-2 font-serif text-xl leading-snug text-ink">
            Panoplie en {FILM_SECONDS} secondes.
          </p>
          <p className="mt-1 text-sm leading-relaxed text-ink-dim">
            Un dossier, ses sources, ses limites — avec les données du registre.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => openFilm("invitation")}
              className="inline-flex min-h-11 items-center border border-accent bg-accent px-4 font-mono text-[11px] uppercase tracking-[0.16em] text-bg transition-colors hover:border-ink hover:bg-ink"
            >
              Voir le briefing
            </button>
            <button
              type="button"
              onClick={() => {
                writeVisit("ignore");
                setShowInvite(false);
              }}
              className="inline-flex min-h-11 items-center border border-line-bright px-4 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-dim transition-colors hover:border-accent hover:text-accent"
            >
              Plus tard
            </button>
          </div>
        </section>
      ) : null}
    </>
  );
}
