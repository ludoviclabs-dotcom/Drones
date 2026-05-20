import type { Metadata } from "next";
import type { GlossaryTerm } from "@/data/types";
import { glossary } from "@/data/glossary";
import { organisms } from "@/data/organisms";
import { SectionMarker } from "@/components/primitives";

export const metadata: Metadata = {
  title: "Glossaire",
  description:
    "Lexique des termes et registre des organismes et cadres réglementaires cités sur Panoplie.",
};

const CATEGORY_LABELS: Record<GlossaryTerm["category"], string> = {
  technique: "Technique",
  commerce: "Commerce & acquisition",
  doctrine: "Doctrine & emploi",
  juridique: "Cadre juridique",
};

const CATEGORY_ORDER: GlossaryTerm["category"][] = [
  "technique",
  "doctrine",
  "commerce",
  "juridique",
];

export default function GlossairePage() {
  return (
    <div className="mx-auto max-w-[920px] px-5 py-12">
      <header className="reveal">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
          Référence
        </p>
        <h1 className="mt-4 font-serif text-5xl tracking-tight text-ink">
          Glossaire
        </h1>
        <p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-ink-dim">
          Le lexique et les organismes cités dans les fiches — construits au fil
          des systèmes documentés, sans viser l'exhaustivité.
        </p>
      </header>

      <section className="mt-14">
        <SectionMarker index="01" label="Lexique" />
        <div className="mt-6 space-y-10">
          {CATEGORY_ORDER.map((category) => {
            const terms = glossary.filter((t) => t.category === category);
            if (terms.length === 0) return null;
            return (
              <div key={category}>
                <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
                  {CATEGORY_LABELS[category]}
                </h3>
                <dl className="mt-3 border border-line">
                  {terms.map((term) => (
                    <div
                      key={term.slug}
                      className="border-b border-line px-5 py-4 last:border-0"
                    >
                      <dt className="flex items-baseline gap-2">
                        <span className="font-serif text-lg text-ink">
                          {term.term}
                        </span>
                        {term.acronym ? (
                          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent">
                            {term.acronym}
                          </span>
                        ) : null}
                      </dt>
                      <dd className="mt-1.5 font-serif text-[0.95rem] leading-relaxed text-ink-dim">
                        {term.definition}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-16">
        <SectionMarker
          index="02"
          label="Organismes &amp; cadres"
          blurb="Les institutions, régimes de contrôle et textes cités dans les briques."
        />
        <div className="mt-6 border border-line">
          {organisms.map((org) => (
            <div
              key={org.slug}
              id={`org-${org.slug}`}
              className="scroll-mt-28 border-b border-line px-5 py-4 last:border-0"
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-serif text-lg text-ink">{org.name}</span>
                {org.acronym ? (
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent">
                    {org.acronym}
                  </span>
                ) : null}
                <span className="font-mono text-[11px] text-ink-faint">
                  {org.scope}
                </span>
              </div>
              <p className="mt-1.5 font-serif text-[0.95rem] leading-relaxed text-ink-dim">
                {org.role}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
