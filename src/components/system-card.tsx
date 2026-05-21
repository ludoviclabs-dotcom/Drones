import Link from "next/link";
import type { DefenseSystem } from "@/data/types";
import { GradeBadge } from "./primitives";
import { SystemSchematic } from "./system-schematic";
import { RegistrationMarks } from "./registration-marks";

export function SystemCard({ system }: { system: DefenseSystem }) {
  return (
    <Link
      href={`/systemes/${system.slug}`}
      className="group relative flex flex-col border border-line bg-panel transition-colors hover:border-line-bright"
    >
      <RegistrationMarks />

      <div className="flex items-center justify-between border-b border-line px-5 py-2.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
          {system.reference}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
          {system.classLabel}
        </span>
      </div>

      <div className="flex items-center justify-center border-b border-line py-7">
        <SystemSchematic
          slug={system.slug}
          live
          className="h-28 w-28 text-ink-faint transition-colors duration-300 group-hover:text-accent"
        />
      </div>

      <div className="flex-1 p-5">
        <div className="flex items-baseline gap-2">
          <span className="text-base leading-none">{system.flag}</span>
          <h3 className="font-serif text-2xl leading-tight text-ink transition-colors group-hover:text-accent">
            {system.name}
          </h3>
        </div>
        <p className="mt-1 font-mono text-[11px] text-ink-faint">
          {system.country} · {system.manufacturer}
        </p>
        <p className="mt-3.5 font-serif text-[0.95rem] leading-relaxed text-ink-dim">
          {system.tagline}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-line px-5 py-3">
        <div className="flex gap-1" aria-hidden>
          {system.scores.map((s) => (
            <GradeBadge key={s.key} grade={s.grade} size="sm" />
          ))}
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent opacity-0 transition-opacity group-hover:opacity-100">
          Ouvrir →
        </span>
      </div>
    </Link>
  );
}
