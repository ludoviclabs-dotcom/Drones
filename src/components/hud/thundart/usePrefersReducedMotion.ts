"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function getMediaQuery(): MediaQueryList | null {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return null;
  }
  return window.matchMedia(QUERY);
}

function subscribe(onChange: () => void): () => void {
  const query = getMediaQuery();
  if (!query) return () => undefined;
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  return getMediaQuery()?.matches ?? false;
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * Suit `prefers-reduced-motion: reduce`, y compris si l'utilisateur change son
 * réglage système en cours de session. Rend `false` au rendu serveur, puis la
 * vraie valeur après hydratation.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
