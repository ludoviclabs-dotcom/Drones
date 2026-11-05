"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useSyncExternalStore } from "react";
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
  // Le dernier lien suivi (ancre) prime sur le paramètre d'arrivée.
  return window.location.hash.replace(/^#/, "") || params.get("chapitre") || "";
}

export function FilmStage({ data }: { data: FilmData }) {
  // `null` au rendu serveur : le lecteur ne se monte qu'une fois l'adresse lue.
  const start = useSyncExternalStore<string | null>(
    subscribeToLocation,
    readStartChapter,
    () => null,
  );
  const stageRef = useRef<HTMLDivElement>(null);
  // Un lien de chapitre de la transcription ramène le lecteur à l'écran.
  useEffect(() => {
    const onHash = () =>
      stageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  if (start === null) return <StagePlaceholder />;
  return (
    <div ref={stageRef} className="scroll-mt-24">
    <FilmPlayer
      // Un nouveau lien de chapitre relance le lecteur sur ce chapitre.
      key={start}
      data={data}
      variant="page"
      startChapter={start || undefined}
      source="page-demo"
    />
    </div>
  );
}
