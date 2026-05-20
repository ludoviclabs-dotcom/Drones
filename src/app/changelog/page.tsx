import type { Metadata } from "next";
import { changelog } from "@/data/changelog";

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "Le journal des évolutions de Panoplie — données, fonctionnalités et corrections.",
};

export default function ChangelogPage() {
  return (
    <div className="mx-auto max-w-[820px] px-5 py-12">
      <header className="reveal">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
          Suivi
        </p>
        <h1 className="mt-4 font-serif text-5xl tracking-tight text-ink">
          Changelog
        </h1>
        <p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-ink-dim">
          Le journal des évolutions de Panoplie. Un produit de renseignement
          ouvert se juge aussi à la tenue de ses données dans le temps.
        </p>
      </header>

      <div className="mt-12 space-y-4">
        {changelog.map((entry) => (
          <article
            key={`${entry.date}-${entry.title}`}
            className="border border-line bg-panel p-6"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
                {entry.date}
              </span>
              <span className="h-px flex-1 bg-line" />
            </div>
            <h2 className="mt-3 font-serif text-2xl text-ink">{entry.title}</h2>
            <ul className="mt-3 space-y-1.5">
              {entry.items.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 font-serif text-[0.95rem] leading-relaxed text-ink-dim"
                >
                  <span className="text-accent">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
