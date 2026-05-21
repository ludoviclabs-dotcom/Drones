import type { GlossaryTerm } from "@/data/types";

/**
 * Terme de glossaire en ligne — soulignement pointillé et infobulle au survol
 * ou au focus clavier. Sans JavaScript : l'infobulle est purement CSS, donc
 * compatible avec le rendu serveur du fil de lecture.
 */
export function GlossaryRef({
  term,
  children,
}: {
  term: GlossaryTerm;
  children: React.ReactNode;
}) {
  const tooltipId = `glo-${term.slug}`;
  return (
    <span className="group/glo relative inline-block">
      <abbr
        tabIndex={0}
        aria-describedby={tooltipId}
        className="cursor-help border-b border-dotted border-accent/60 text-ink no-underline outline-none transition-colors hover:border-accent focus-visible:border-solid focus-visible:border-accent"
      >
        {children}
      </abbr>
      <span
        role="tooltip"
        id={tooltipId}
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 border border-line-bright bg-surface-2 p-3 text-left opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.5)] transition-opacity duration-150 group-hover/glo:opacity-100 group-focus-within/glo:opacity-100"
      >
        <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
          {term.term}
          {term.acronym ? ` · ${term.acronym}` : ""}
        </span>
        <span className="mt-1.5 block font-serif text-xs not-italic leading-relaxed text-ink-dim">
          {term.definition}
        </span>
      </span>
    </span>
  );
}
