import type { Metadata } from "next";
import Link from "next/link";
import { actors } from "@/data/actors";
import { ACTOR_KIND_LABELS } from "@/data/labels";
import { FigureStatusMark } from "@/components/primitives";
import type { ActorKind } from "@/data/actors/types";

export const metadata: Metadata = {
  alternates: { canonical: "/acteurs" },
  title: "Acteurs",
  description:
    "Les groupes industriels et les entreprises de défense tech derrière les systèmes : capital, chiffres, contrats, chaîne de valeur et jalons à surveiller.",
};

const KIND_ORDER: ActorKind[] = ["groupe-industriel", "defense-tech"];

export default function ActeursPage() {
  return (
    <div className="mx-auto max-w-[1000px] px-5 py-12">
      <header className="reveal">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
          Industrie
        </p>
        <h1 className="mt-4 font-serif text-5xl tracking-tight text-ink sm:text-6xl">
          Acteurs
        </h1>
        <p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-ink-dim">
          Derrière chaque système, un groupe ou une entreprise : qui détient le
          capital, ce qui est publié, ce qui reste estimé. {actors.length}{" "}
          dossiers, lus avec les mêmes règles que les systèmes — chaque chiffre
          porte son statut et sa source, un plafond n&apos;est jamais présenté
          comme une commande.
        </p>
      </header>

      {KIND_ORDER.map((kind) => {
        const group = actors.filter((actor) => actor.kind === kind);
        if (group.length === 0) return null;
        return (
          <section key={kind} className="mt-12">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint">
              {ACTOR_KIND_LABELS[kind]}
            </h2>
            <ul className="mt-4 grid gap-px border border-line bg-line">
              {group.map((actor) => {
                const lead = actor.keyFigures[0];
                return (
                  <li key={actor.slug} className="bg-panel">
                    <Link
                      href={`/acteurs/${actor.slug}`}
                      className="group grid gap-4 p-6 transition-colors hover:bg-surface-2 sm:grid-cols-[minmax(0,1fr)_18rem] sm:gap-8 sm:p-8"
                    >
                      <div className="min-w-0">
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                          {actor.reference} · {actor.flag} {actor.country}
                        </p>
                        <h3 className="mt-2 font-serif text-3xl text-ink transition-colors group-hover:text-accent">
                          {actor.name}
                        </h3>
                        <p className="mt-3 max-w-xl font-serif text-[1.02rem] leading-relaxed text-ink-dim">
                          {actor.tagline}
                        </p>
                      </div>
                      <div className="flex flex-col justify-between gap-3 sm:items-end sm:text-right">
                        {lead ? (
                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                              {lead.label}
                            </p>
                            <p className="mt-1 flex items-baseline gap-2 font-mono text-sm text-ink sm:justify-end">
                              <FigureStatusMark status={lead.figureStatus} />
                              <span>{lead.value}</span>
                            </p>
                          </div>
                        ) : null}
                        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
                          Ouvrir le dossier →
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <section className="mt-12 border-t border-line pt-6">
        <p className="max-w-2xl font-serif text-sm italic leading-relaxed text-ink-faint">
          Les dossiers d&apos;acteurs ne sont pas notés par paliers : un groupe
          ne se compare pas à une arme. Ils suivent le registre «&nbsp;Souveraineté
          industrielle&nbsp;» et la{" "}
          <Link
            href="/methodologie"
            className="text-accent transition-colors hover:text-ink"
          >
            méthodologie
          </Link>{" "}
          de Panoplie. Les systèmes qu&apos;ils construisent sont dans le{" "}
          <Link
            href="/domaines"
            className="text-accent transition-colors hover:text-ink"
          >
            catalogue
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
