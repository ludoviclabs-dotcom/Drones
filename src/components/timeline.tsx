import type { TimelineEvent, TimelineKind } from "@/data/types";
import { TIMELINE_KIND_LABELS } from "@/data/labels";

// Frise verticale — jalons, emplois, exportations et débats d'un système.
// Tri chronologique par comparaison lexicographique des dates « YYYY[-MM] ».

const KIND_COLOR: Record<TimelineKind, string> = {
  jalon: "var(--color-accent)",
  emploi: "var(--color-grade-d)",
  export: "var(--color-stamp)",
  debat: "var(--color-grade-c)",
};

export function Timeline({ events }: { events: TimelineEvent[] }) {
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <ol className="ml-1">
      {sorted.map((event, i) => (
        <li
          key={`${event.date}-${i}`}
          className="relative border-l border-line-bright pb-7 pl-6 last:pb-1"
        >
          <span
            aria-hidden="true"
            className="absolute left-0 top-1 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-2 bg-bg"
            style={{ borderColor: KIND_COLOR[event.kind] }}
          />
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
            <span className="font-mono text-xs font-semibold text-accent">
              {event.date}
            </span>
            <span
              className="font-mono text-[9px] uppercase tracking-[0.16em]"
              style={{ color: KIND_COLOR[event.kind] }}
            >
              {TIMELINE_KIND_LABELS[event.kind]}
            </span>
          </div>
          <p className="mt-1 font-serif text-sm leading-relaxed text-ink-dim">
            {event.label}
          </p>
        </li>
      ))}
    </ol>
  );
}
