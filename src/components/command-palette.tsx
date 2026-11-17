"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useEffectEvent,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from "react";
import { SEARCH_HREF } from "@/data/navigation";
import {
  SEARCH_KIND_LABELS,
  defaultEntries,
  groupByKind,
  searchEntries,
  type SearchEntry,
} from "@/lib/search";

const INDEX_URL = "/api/search-index";

type IndexStatus = "idle" | "loading" | "ready" | "error";

function subscribeNothing() {
  return () => {};
}

function readIsMac(): boolean {
  const nav = navigator as Navigator & {
    userAgentData?: { platform?: string };
  };
  return /mac|iphone|ipad|ipod/i.test(
    nav.userAgentData?.platform || nav.platform || "",
  );
}

/** Une autre surimpression est ouverte (fiche, briefing) : le raccourci s'efface. */
function otherOverlayOpen(own: HTMLDialogElement | null): boolean {
  return Array.from(
    document.querySelectorAll('[aria-modal="true"], dialog[open]'),
  ).some((el) => el !== own);
}

/**
 * Palette de recherche ⌘K / Ctrl K — systèmes, domaines, pages et glossaire,
 * sans quitter l'écran en cours.
 *
 * Lien « Rechercher » de l'en-tête + `<dialog>` natif (piège de focus,
 * Échap et retour du focus fournis par le navigateur). Le champ est une
 * combobox ARIA 1.2 : flèches pour parcourir, Entrée pour ouvrir. L'index
 * (JSON statique) n'est téléchargé qu'au premier survol, focus ou ouverture.
 */
export function CommandPalette({ onOpen }: { onOpen?: () => void }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const [status, setStatus] = useState<IndexStatus>("idle");
  // `null` au rendu serveur : l'indication de raccourci n'apparaît qu'une
  // fois la plateforme connue (⌘ sur Mac, Ctrl ailleurs).
  const isMac = useSyncExternalStore(subscribeNothing, readIsMac, () => null);
  const baseId = useId();
  const listId = `${baseId}-list`;
  const optionId = (i: number) => `${baseId}-opt-${i}`;

  function load() {
    if (status === "loading" || status === "ready") return;
    setStatus("loading");
    fetch(INDEX_URL)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<SearchEntry[]>;
      })
      .then((entries) => {
        setIndex(entries);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }

  function openPalette() {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    onOpen?.();
    setQuery("");
    setActive(0);
    dialog.showModal();
    inputRef.current?.focus();
    load();
  }

  function closePalette() {
    dialogRef.current?.close();
  }

  function go(entry: SearchEntry) {
    closePalette();
    router.push(entry.href);
  }

  const onGlobalKeyDown = useEffectEvent((event: globalThis.KeyboardEvent) => {
    if (
      !(event.metaKey || event.ctrlKey) ||
      event.altKey ||
      event.shiftKey ||
      event.key.toLowerCase() !== "k"
    ) {
      return;
    }
    const dialog = dialogRef.current;
    if (dialog?.open) {
      event.preventDefault();
      closePalette();
      return;
    }
    if (otherOverlayOpen(dialog)) return;
    event.preventDefault();
    openPalette();
  });

  useEffect(() => {
    const handler = (event: globalThis.KeyboardEvent) => onGlobalKeyDown(event);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const trimmed = query.trim();
  const results = index
    ? trimmed
      ? searchEntries(index, trimmed)
      : defaultEntries(index)
    : [];
  const groups = groupByKind(results);
  const flat = groups.flatMap((group) => group.entries);
  const offsets = groups.map((_, gi) =>
    groups.slice(0, gi).reduce((sum, group) => sum + group.entries.length, 0),
  );
  const activeIndex = flat.length ? Math.min(active, flat.length - 1) : -1;

  function moveTo(next: number) {
    if (flat.length === 0) return;
    const target = (next + flat.length) % flat.length;
    setActive(target);
    document
      .getElementById(optionId(target))
      ?.scrollIntoView({ block: "nearest" });
  }

  function onInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveTo(activeIndex + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveTo(activeIndex - 1);
        break;
      case "Enter": {
        const entry = flat[activeIndex];
        if (entry) {
          event.preventDefault();
          go(entry);
        }
        break;
      }
      default:
    }
  }

  let announcement = "";
  if (status === "loading") announcement = "Chargement de l'index…";
  else if (status === "error") announcement = "Index de recherche indisponible.";
  else if (status === "ready" && trimmed)
    announcement =
      flat.length === 0
        ? "Aucun résultat."
        : `${flat.length} résultat${flat.length > 1 ? "s" : ""}.`;

  const shortcut = isMac === null ? null : isMac ? "⌘K" : "Ctrl K";

  return (
    <>
      {/* Lien vers le catalogue tant que le script n'a pas pris la main
          (ou pour l'ouvrir dans un nouvel onglet) ; sinon, il ouvre la palette. */}
      <a
        href={SEARCH_HREF}
        onClick={(event) => {
          if (
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey ||
            event.button !== 0
          ) {
            return;
          }
          event.preventDefault();
          openPalette();
        }}
        onPointerEnter={load}
        onFocus={load}
        aria-haspopup="dialog"
        aria-keyshortcuts="Meta+K Control+K"
        className="ml-2 inline-flex min-h-11 items-center gap-2 border border-line-bright px-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-dim transition-colors hover:border-accent hover:text-accent"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="16.5" y1="16.5" x2="21" y2="21" />
        </svg>
        <span className="sr-only sm:not-sr-only">Rechercher</span>
        {shortcut ? (
          <kbd
            aria-hidden="true"
            className="hidden border border-line px-1.5 font-mono text-[10px] normal-case tracking-[0.04em] text-ink-faint md:inline"
          >
            {shortcut}
          </kbd>
        ) : null}
      </a>

      <dialog
        ref={dialogRef}
        aria-labelledby={`${baseId}-label`}
        onClick={(event) => {
          // Clic sur le fond (le `<dialog>` lui-même, hors du panneau).
          if (event.target === event.currentTarget) closePalette();
        }}
        className="m-0 mx-auto mt-[10vh] max-h-[78vh] w-[min(42rem,calc(100vw-2rem))] border border-line-bright bg-surface p-0 text-ink shadow-[0_24px_60px_rgba(0,0,0,0.55)] backdrop:bg-[rgba(12,11,7,0.74)] open:flex open:flex-col"
      >
        <div className="border-b border-line px-4 pb-3 pt-3.5">
          <label
            id={`${baseId}-label`}
            htmlFor={`${baseId}-input`}
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent"
          >
            Rechercher dans Panoplie
          </label>
          <div className="mt-2 flex items-center gap-3">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
              className="shrink-0 text-ink-faint"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" />
            </svg>
            <input
              ref={inputRef}
              id={`${baseId}-input`}
              type="text"
              role="combobox"
              aria-expanded={flat.length > 0}
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={
                activeIndex >= 0 ? optionId(activeIndex) : undefined
              }
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="go"
              placeholder="Rafale, MBDA, défense aérienne, ITAR…"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActive(0);
              }}
              onKeyDown={onInputKeyDown}
              className="min-h-11 w-full min-w-0 bg-transparent font-sans text-base text-ink outline-none placeholder:text-ink-faint"
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div role="listbox" id={listId} aria-label="Résultats">
            {groups.map((group, gi) => (
              <div
                key={group.kind}
                role="group"
                aria-labelledby={`${baseId}-group-${group.kind}`}
              >
                <div
                  id={`${baseId}-group-${group.kind}`}
                  role="presentation"
                  className="px-4 pb-1.5 pt-3.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint"
                >
                  {SEARCH_KIND_LABELS[group.kind]}
                </div>
                {group.entries.map((entry, ei) => {
                  const i = offsets[gi] + ei;
                  const selected = i === activeIndex;
                  return (
                    <div
                      key={`${entry.kind}-${entry.href}`}
                      id={optionId(i)}
                      role="option"
                      aria-selected={selected}
                      onMouseMove={() => {
                        if (!selected) setActive(i);
                      }}
                      onClick={() => go(entry)}
                      className={`flex min-h-11 cursor-pointer flex-col justify-center gap-0.5 px-4 py-2 ${
                        selected
                          ? "bg-surface-2 shadow-[inset_2px_0_0_var(--color-accent)]"
                          : ""
                      }`}
                    >
                      <span className="font-serif text-[15px] leading-snug text-ink">
                        {entry.title}
                      </span>
                      {entry.subtitle ? (
                        <span className="truncate font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">
                          {entry.subtitle}
                        </span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {status === "loading" ? (
            <p className="px-4 py-6 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
              Chargement de l&apos;index…
            </p>
          ) : null}
          {status === "error" ? (
            <p className="px-4 py-6 font-sans text-sm text-ink-dim">
              L&apos;index de recherche n&apos;a pas pu être chargé. Le
              catalogue et ses filtres restent disponibles.
            </p>
          ) : null}
          {status === "ready" && trimmed && flat.length === 0 ? (
            <p className="px-4 py-6 font-sans text-sm text-ink-dim">
              Aucun résultat pour « {trimmed} ». Essayez un industriel, un
              pays, un acronyme — ou filtrez le catalogue.
            </p>
          ) : null}

          {/* Dernière ligne de la liste : le repli vers les filtres complets.
              Seul élément focalisable de la zone défilante, il lui donne aussi
              un accès clavier au-delà des flèches du champ. */}
          <div className="border-t border-line px-4 py-1">
            <Link
              href={SEARCH_HREF}
              onClick={closePalette}
              className="inline-flex min-h-11 items-center font-mono text-[10px] uppercase tracking-[0.14em] text-accent transition-colors hover:text-ink"
            >
              Catalogue et filtres →
            </Link>
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          {announcement}
        </p>

        <div className="hidden items-center gap-4 border-t border-line px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint sm:flex">
          <span>
            <kbd className="border border-line px-1 normal-case">↑</kbd>{" "}
            <kbd className="border border-line px-1 normal-case">↓</kbd>{" "}
            parcourir
          </span>
          <span>
            <kbd className="border border-line px-1 normal-case">Entrée</kbd>{" "}
            ouvrir
          </span>
          <span>
            <kbd className="border border-line px-1 normal-case">Échap</kbd>{" "}
            fermer
          </span>
        </div>
      </dialog>
    </>
  );
}
