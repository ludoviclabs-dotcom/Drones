import type { Metadata } from "next";
import type { RoadmapHorizon } from "@/data/types";
import { roadmap } from "@/data/roadmap";
import { ROADMAP_HORIZON_LABELS } from "@/data/labels";
import { SectionMarker } from "@/components/primitives";

export const metadata: Metadata = {
  alternates: { canonical: "/roadmap" },
  title: "Roadmap",
  description:
    "Ce qui est en cours, prochain et à l'étude pour Panoplie — la trajectoire de l'observatoire.",
};

const HORIZONS: RoadmapHorizon[] = ["en-cours", "prochain", "exploratoire"];

export default function RoadmapPage() {
  return (
    <div className="mx-auto max-w-[820px] px-5 py-12">
      <header className="reveal">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
          Suivi
        </p>
        <h1 className="mt-4 font-serif text-5xl tracking-tight text-ink">
          Roadmap
        </h1>
        <p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-ink-dim">
          La trajectoire de Panoplie, affichée ouvertement : ce qui est en
          cours, ce qui vient ensuite, et ce qui reste à l'étude.
        </p>
      </header>

      <div className="mt-12 space-y-10">
        {HORIZONS.map((horizon) => {
          const items = roadmap.filter((item) => item.horizon === horizon);
          if (items.length === 0) return null;
          return (
            <section key={horizon}>
              <SectionMarker index="—" label={ROADMAP_HORIZON_LABELS[horizon]} />
              <ul className="mt-6 grid gap-px border border-line bg-line">
                {items.map((item) => (
                  <li key={item.title} className="bg-panel p-5">
                    <h2 className="font-serif text-lg text-ink">{item.title}</h2>
                    <p className="mt-1.5 font-serif text-sm leading-relaxed text-ink-dim">
                      {item.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
