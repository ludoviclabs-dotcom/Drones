"use client";

import { useEffect, useId, useState } from "react";
import { formatNoteNumber, type SourceNote } from "@/lib/source-notes";
import { ReliabilityMark } from "./primitives";

/**
 * Renvois de sources — un numéro discret par source au lieu de la mention en
 * toutes lettres. Chaque numéro est un lien vers son entrée dans la liste ;
 * le survol ou le focus clavier ouvre un aperçu (titre, éditeur, type, date,
 * fiabilité). L'aperçu reste ouvert tant que le pointeur est sur le numéro ou
 * sur lui, Échap le referme : critères WCAG 1.4.13. Sans JavaScript, le lien
 * d'ancre suffit.
 */
export function SourceMarks({
  notes,
  align = "start",
}: {
  notes: SourceNote[];
  /** Côté d'ancrage de l'aperçu : `end` quand le renvoi est en fin de ligne. */
  align?: "start" | "end";
}) {
  if (notes.length === 0) return null;
  return (
    <span className="inline-flex flex-wrap items-baseline gap-1">
      {notes.map((note) => (
        <SourceMark key={note.anchor} note={note} align={align} />
      ))}
    </span>
  );
}

function SourceMark({
  note,
  align,
}: {
  note: SourceNote;
  align: "start" | "end";
}) {
  const [open, setOpen] = useState(false);
  const previewId = useId();
  const num = formatNoteNumber(note.n);

  // Échap referme l'aperçu seulement. La fiche en surimpression écoute Échap
  // en capture sur `document` : on l'intercepte plus tôt, en capture sur
  // `window`, et seulement tant que l'aperçu est ouvert.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      event.preventDefault();
      setOpen(false);
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open]);

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <a
        href={`#${note.anchor}`}
        aria-label={`Source ${num}`}
        aria-describedby={previewId}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="inline-flex min-w-[1.6rem] justify-center px-0.5 font-mono text-[10px] leading-5 tracking-[0.04em] text-accent underline decoration-accent/40 underline-offset-2 transition-colors hover:text-ink hover:decoration-ink"
      >
        {num}
      </a>
      <span
        id={previewId}
        role="tooltip"
        hidden={!open}
        className={`absolute bottom-full z-40 w-64 max-w-[calc(100vw-2.5rem)] pb-2 normal-case tracking-normal ${
          align === "end" ? "right-0" : "left-0"
        }`}
      >
        <span className="block border border-line-bright bg-surface-2 px-3.5 py-3 text-left shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
          <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
            Source {num}
          </span>
          <span className="mt-1.5 block font-serif text-sm leading-snug text-ink">
            {note.title}
          </span>
          <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">
            {note.publisher} · {note.typeLabel}
            {note.date ? ` · ${note.date}` : ""}
          </span>
          <span className="mt-2.5 flex">
            <ReliabilityMark reliability={note.reliability} />
          </span>
        </span>
      </span>
    </span>
  );
}
