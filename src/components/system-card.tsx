import Link from "next/link";
import type { DefenseSystem } from "@/data/types";
import { isXrayEdited } from "@/data/decision-twin/coverage";
import { GradeBadge } from "./primitives";
import { SystemSchematic } from "./system-schematic";
import { RegistrationMarks } from "./registration-marks";

export function SystemCard({ system }: { system: DefenseSystem }) {
  const hasEditedXray = isXrayEdited(system.slug);
  return (
    <Link
      href={`/systemes/${system.slug}`}
      className="group relative flex flex-col border border-line bg-panel transition-colors hover:border-line-bright"
    >
      <RegistrationMarks />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-[4.5rem] z-10 -rotate-[18deg] scale-90 border-[1.5px] border-accent/0 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-accent/0 transition-all duration-300 ease-out group-hover:-rotate-[9deg] group-hover:scale-100 group-hover:border-accent/40 group-hover:text-accent/70"
      >
        Déclassifié
      </span>

      <div className="flex items-center justify-between border-b border-line px-5 py-2.5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
            {system.reference}
          </span>
          {hasEditedXray ? (
            <span
              className="border border-accent/60 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-accent/80"
              title="System X-Ray — lecture éditoriale disponible"
            >
              X-Ray
            </span>
          ) : null}
        </div>
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
