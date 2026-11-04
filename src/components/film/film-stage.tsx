"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import type { FilmData } from "@/film/types";

/**
 * Le lecteur posé dans la page `/demo` (et non en surimpression). Le chapitre
 * de départ se lit dans l'adresse : `/demo?chapitre=preuve` ou `/demo#preuve`.
 */

const FilmPlayer = dynamic(() => import("./film-player"), {
  ssr: false,
  loading: () => <StagePlaceholder />,
});

function StagePlaceholder() {
  return (
    <div className="flex aspect-video w-full items-center justify-center border border-line-bright bg-panel font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">
      Chargement du briefing…
    </div>
  );
}

function subscribeToLocation(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("popstate", onChange);
  };
}

function readStartChapter(): string {
  const params = new URLSearchParams(window.location.search);
  return params.get("chapitre") ?? window.location.hash.replace(/^#/, "");
}

export function FilmStage({ data }: { data: FilmData }) {
  // `null` au rendu serveur : le lecteur ne se monte qu'une fois l'adresse lue.
  const start = useSyncExternalStore<string | null>(
    subscribeToLocation,
    readStartChapter,
    () => null,
  );
  if (start === null) return <StagePlaceholder />;
  return (
    <FilmPlayer
      // Un nouveau lien de chapitre relance le lecteur sur ce chapitre.
      key={start}
      data={data}
      variant="page"
      startChapter={start || undefined}
      source="page-demo"
    />
  );
}
