"use client";

import Link from "next/link";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
} from "react";
import { NAV_GROUPS, SEARCH_HREF, type NavGroup } from "@/data/navigation";

/**
 * Navigation principale — quatre groupes en en-tête.
 *
 * Sur bureau, chaque groupe est un bouton qui déplie ses entrées au survol, au
 * focus clavier et au clic (tactile) ; Échap referme et rend le focus au
 * bouton, les flèches parcourent les entrées. Sous 1024 px, un seul bouton
 * ouvre un volet qui liste tous les groupes. L'état est porté par React, pas
 * par un `:hover` CSS, pour que `aria-expanded` dise toujours vrai. Suivre
 * une entrée referme ce qui est ouvert : la navigation est côté client, la
 * barre reste montée d'une route à l'autre.
 */
export function SiteNav() {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const menuId = useId();
  const closeAll = () => {
    setOpenGroup(null);
    setMenuOpen(false);
  };

  // Un clic hors de la barre referme le groupe ouvert au clic.
  useEffect(() => {
    if (openGroup === null) return;
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return;
      setOpenGroup(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [openGroup]);

  return (
    <nav
      ref={rootRef}
      aria-label="Navigation principale"
      className="flex min-w-0 flex-1 items-center justify-end gap-1"
    >
      <ul className="hidden items-center gap-0.5 lg:flex">
        {NAV_GROUPS.map((group, index) => (
          <DesktopGroup
            key={group.id}
            group={group}
            alignEnd={index >= NAV_GROUPS.length - 2}
            open={openGroup === group.id}
            onOpen={() => setOpenGroup(group.id)}
            onToggle={() =>
              setOpenGroup((current) => (current === group.id ? null : group.id))
            }
            onClose={() => setOpenGroup(null)}
            onNavigate={closeAll}
          />
        ))}
      </ul>

      <Link
        href={SEARCH_HREF}
        onClick={closeAll}
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
      </Link>

      <button
        type="button"
        aria-expanded={menuOpen}
        aria-controls={menuId}
        onClick={() => setMenuOpen((open) => !open)}
        className="inline-flex h-11 w-11 items-center justify-center border border-line-bright text-ink transition-colors hover:border-accent hover:text-accent lg:hidden"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          {menuOpen ? (
            <>
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </>
          ) : (
            <>
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </>
          )}
        </svg>
        <span className="sr-only">Menu</span>
      </button>

      {/* Volet mobile : sous l'en-tête, pleine largeur, groupes en titres. */}
      <div
        id={menuId}
        hidden={!menuOpen}
        className="absolute inset-x-0 top-full max-h-[calc(100dvh-var(--site-header-offset))] overflow-y-auto border-b border-line bg-bg lg:hidden"
      >
        <div className="mx-auto grid max-w-[1180px] gap-6 px-5 py-6 sm:grid-cols-2">
          {NAV_GROUPS.map((group) => (
            <div key={group.id}>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                {group.label}
              </p>
              <ul className="mt-1">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={closeAll}
                      className="flex min-h-11 items-center font-sans text-[15px] text-ink transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}

function DesktopGroup({
  group,
  alignEnd,
  open,
  onOpen,
  onToggle,
  onClose,
  onNavigate,
}: {
  group: NavGroup;
  alignEnd: boolean;
  open: boolean;
  onOpen: () => void;
  onToggle: () => void;
  onClose: () => void;
  onNavigate: () => void;
}) {
  const itemRef = useRef<HTMLLIElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  const links = () =>
    Array.from(
      itemRef.current?.querySelectorAll<HTMLAnchorElement>("ul a") ?? [],
    );

  function onFocus(event: FocusEvent<HTMLLIElement>) {
    // Le focus arrive de l'extérieur : le groupe s'ouvre. Un retour au bouton
    // depuis une entrée (Échap) ne le rouvre pas.
    if (itemRef.current?.contains(event.relatedTarget as Node | null)) return;
    onOpen();
  }

  function onBlur(event: FocusEvent<HTMLLIElement>) {
    // Le focus quitte le groupe (bouton et entrées) : il se referme.
    if (itemRef.current?.contains(event.relatedTarget as Node | null)) return;
    onClose();
  }

  function onKeyDown(event: KeyboardEvent<HTMLLIElement>) {
    const items = links();
    const index = items.indexOf(document.activeElement as HTMLAnchorElement);
    switch (event.key) {
      case "Escape":
        event.preventDefault();
        onClose();
        triggerRef.current?.focus();
        break;
      case "ArrowDown":
        event.preventDefault();
        onOpen();
        // Depuis le bouton (index -1), la première entrée ; sinon la suivante.
        items[Math.min(index + 1, items.length - 1)]?.focus();
        break;
      case "ArrowUp":
        event.preventDefault();
        if (index <= 0) triggerRef.current?.focus();
        else items[index - 1]?.focus();
        break;
      case "Home":
        if (index < 0) return;
        event.preventDefault();
        items[0]?.focus();
        break;
      case "End":
        if (index < 0) return;
        event.preventDefault();
        items[items.length - 1]?.focus();
        break;
      default:
    }
  }

  return (
    <li
      ref={itemRef}
      className="relative"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
        // Le clic ouvre, toujours : à la souris le survol a déjà ouvert et un
        // basculement refermerait ; au toucher, c'est l'ouverture qui compte.
        // Fermeture : Échap, clic hors de la barre, sortie du pointeur ou du
        // focus.
        onClick={onOpen}
        className={`inline-flex min-h-11 items-center gap-1.5 px-3 font-sans text-[13px] font-medium transition-colors ${
          open ? "text-ink" : "text-ink-dim hover:text-ink"
        }`}
      >
        {group.label}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
          className={`text-ink-faint transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M2 3.5 L5 6.5 L8 3.5" />
        </svg>
      </button>
      <ul
        id={menuId}
        hidden={!open}
        className={`absolute top-full z-50 min-w-[250px] border border-line-bright bg-panel py-2 shadow-[0_18px_40px_rgba(0,0,0,0.45)] ${
          alignEnd ? "right-0" : "left-0"
        }`}
      >
        {group.links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onNavigate}
              className="block px-4 py-2 font-sans text-sm text-ink transition-colors hover:bg-surface-2 hover:text-accent focus-visible:bg-surface-2 focus-visible:text-accent"
            >
              {link.label}
              {link.hint ? (
                <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                  {link.hint}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}
