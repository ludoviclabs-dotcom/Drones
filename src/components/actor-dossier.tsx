import Link from "next/link";
import {
  AnalystNote,
  IndicatorPanel,
  SourceList,
} from "@/components/fiche-sections";
import {
  IndustrialChainPanel,
  ProgrammeTreePanel,
  SovereigntyPanel,
  WatchpointsPanel,
} from "@/components/registre-sections";
import { Narrative } from "@/components/narrative";
import { SectionMarker } from "@/components/primitives";
import { RegistrationMarks } from "@/components/registration-marks";
import { Stamp } from "@/components/stamp";
import { GlitchText } from "@/components/glitch-text";
import { ReadingProgress } from "@/components/reading-progress";
import { Timeline } from "@/components/timeline";
import type { ActorDossier } from "@/data/actors/types";
import {
  ACTOR_BRICK_BLURBS,
  ACTOR_BRICK_LABELS,
  ACTOR_KIND_LABELS,
  BRICK_ORDER,
} from "@/data/labels";
import { getSystem } from "@/data/systems";
import { buildSourceIndex } from "@/lib/source-notes";

/**
 * Corps d'un dossier d'acteur — groupe industriel ou entreprise de défense
 * tech. Même grammaire que le dossier d'un système (renvois numérotés, statut
 * de chaque chiffre, blocs du registre), sans paliers d'évaluation ni X-Ray :
 * un acteur ne se note pas comme une arme, il se lit par son capital, ses
 * contrats et ce qu'il reste à suivre.
 */
export function ActorDossierView({ actor }: { actor: ActorDossier }) {
  const sourcePrefix = `acteur-${actor.slug}`;
  const sourceIndex = buildSourceIndex(actor.sources, sourcePrefix);

  const bricks = [...actor.bricks].sort(
    (a, b) => BRICK_ORDER.indexOf(a.key) - BRICK_ORDER.indexOf(b.key),
  );
  const related = (actor.relatedSystems ?? [])
    .map((slug) => getSystem(slug))
    .filter((system): system is NonNullable<typeof system> => Boolean(system));

  let counter = 0;
  const nextIndex = () => String(++counter).padStart(2, "0");
  const idxSummary = nextIndex();
  const idxFigures = nextIndex();
  const brickBase = counter;
  counter += bricks.length;
  const idxTree = actor.programmeTree?.length ? nextIndex() : null;
  const idxChain = actor.industrialChain?.length ? nextIndex() : null;
  const idxSovereignty = actor.sovereignty?.length ? nextIndex() : null;
  const idxWatchpoints = actor.watchpoints?.length ? nextIndex() : null;
  const idxAnalyst = actor.analystNote ? nextIndex() : null;
  const idxRelated = related.length > 0 ? nextIndex() : null;
  const idxTimeline = actor.timeline?.length ? nextIndex() : null;
  const idxSources = nextIndex();

  const identity = [
    { label: "Pays", value: `${actor.flag} ${actor.country}` },
    { label: "Nature", value: ACTOR_KIND_LABELS[actor.kind] },
    { label: "Entités du registre", value: String(actor.registryEntityIds.length) },
    { label: "Sources citées", value: String(actor.sources.length) },
  ];

  return (
    <article className="mx-auto max-w-[1100px] px-5 py-10">
      <ReadingProgress />
      <Link
        href="/acteurs"
        className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-dim transition-colors hover:text-accent"
      >
        ← Tous les acteurs
      </Link>

      <header className="reveal relative mt-5 border border-line-bright bg-panel">
        <RegistrationMarks />
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-2.5">
          <span className="inline-block font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
            {actor.reference}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
            Dossier acteur · Mise à jour {actor.updated}
          </span>
        </div>
        <div className="p-7">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-dim">
            {ACTOR_KIND_LABELS[actor.kind]}
          </span>
          <h1 className="mt-3 font-serif text-5xl leading-[0.98] tracking-tight text-ink sm:text-6xl">
            <GlitchText>{actor.name}</GlitchText>
          </h1>
          <p className="mt-5 max-w-2xl font-serif text-xl italic leading-snug text-ink-dim">
            {actor.tagline}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Stamp tone="ink" rotate={-3}>
              {ACTOR_KIND_LABELS[actor.kind]}
            </Stamp>
            <Stamp tone="accent" rotate={3}>
              OSINT
            </Stamp>
          </div>
        </div>
        <dl className="grid border-t border-line sm:grid-cols-4">
          {identity.map((row, i) => (
            <div
              key={row.label}
              className={`border-line px-4 py-3 ${
                i < identity.length - 1 ? "border-b sm:border-b-0 sm:border-r" : ""
              }`}
            >
              <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                {row.label}
              </dt>
              <dd className="mt-1 font-mono text-xs text-ink">{row.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <section className="mt-16">
        <SectionMarker index={idxSummary} label="Résumé exécutif" />
        <Narrative text={actor.summary} className="mt-6 max-w-3xl" />
      </section>

      <section className="mt-16">
        <SectionMarker
          index={idxFigures}
          label="Chiffres clés"
          blurb="Chaque chiffre porte son statut — officiel, presse, source unique, calculé, plafond ou n.c. — et renvoie à sa source."
        />
        <div className="mt-6 max-w-3xl">
          <IndicatorPanel
            indicators={actor.keyFigures}
            title="Chiffres clés"
            sourceIndex={sourceIndex}
          />
        </div>
      </section>

      <div className="mt-16 space-y-12">
        {bricks.map((brick, i) => (
          <section key={brick.key} className="border-t border-line pt-8">
            <SectionMarker
              index={String(brickBase + i + 1).padStart(2, "0")}
              label={ACTOR_BRICK_LABELS[brick.key]}
              blurb={ACTOR_BRICK_BLURBS[brick.key]}
            />
            <div className="mt-6 grid gap-8 lg:grid-cols-[1.55fr_1fr]">
              <Narrative text={brick.narrative} />
              <IndicatorPanel
                indicators={brick.indicators}
                sourceIndex={sourceIndex}
              />
            </div>
          </section>
        ))}
      </div>

      {idxTree && actor.programmeTree ? (
        <section className="mt-16">
          <SectionMarker
            index={idxTree}
            label="Structure du groupe"
            blurb="Imbrication parent / enfant du registre : filiales, plateformes et programmes rattachés."
          />
          <div className="mt-6">
            <ProgrammeTreePanel nodes={actor.programmeTree} />
          </div>
        </section>
      ) : null}

      {idxChain && actor.industrialChain ? (
        <section className="mt-16">
          <SectionMarker
            index={idxChain}
            label="Actionnaires, clients, partenaires"
            blurb="Qui est lié à l'acteur, avec son rôle et son périmètre — repris du registre, sans reclassement."
          />
          <div className="mt-6">
            <IndustrialChainPanel links={actor.industrialChain} />
          </div>
        </section>
      ) : null}

      {idxSovereignty && actor.sovereignty ? (
        <section className="mt-16">
          <SectionMarker
            index={idxSovereignty}
            label="Souveraineté & contrôle"
            blurb="Contenu local, verrou d'un tiers, accès au code source : lus dans le registre, jamais déduits. « Non documenté » signifie que les sources ne le disent pas."
          />
          <div className="mt-6 space-y-6">
            {actor.sovereignty.map((profile) => (
              <SovereigntyPanel key={profile.entityId} profile={profile} />
            ))}
          </div>
        </section>
      ) : null}

      {idxWatchpoints && actor.watchpoints ? (
        <section className="mt-16">
          <SectionMarker
            index={idxWatchpoints}
            label="Jalons à surveiller"
            blurb="Échéances à venir ou non tranchées à la date du registre — rien ne les présente comme acquises."
          />
          <div className="mt-6">
            <WatchpointsPanel items={actor.watchpoints} />
          </div>
        </section>
      ) : null}

      {idxAnalyst && actor.analystNote ? (
        <section className="mt-16">
          <SectionMarker index={idxAnalyst} label="Note d'analyste" />
          <div className="mt-6">
            <AnalystNote note={actor.analystNote} />
          </div>
        </section>
      ) : null}

      {idxRelated ? (
        <section className="mt-16">
          <SectionMarker
            index={idxRelated}
            label="Systèmes du catalogue"
            blurb="Les dossiers de systèmes que cet acteur construit ou fournit."
          />
          <ul className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {related.map((system) => (
              <li key={system.slug} className="bg-panel">
                <Link
                  href={`/systemes/${system.slug}`}
                  className="block px-4 py-3 transition-colors hover:bg-surface-2"
                >
                  <span className="font-mono text-sm text-ink">{system.name}</span>
                  <span className="mt-1 block font-mono text-[11px] text-ink-faint">
                    {system.classLabel}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {idxTimeline && actor.timeline ? (
        <section className="mt-16">
          <SectionMarker
            index={idxTimeline}
            label="Trajectoire"
            blurb="Repères datés tirés du dossier — la signature, l'annonce ou l'échéance, jamais l'issue."
          />
          <div className="mt-6 max-w-2xl">
            <Timeline events={actor.timeline} />
          </div>
        </section>
      ) : null}

      <section className="mt-16">
        <SectionMarker
          index={idxSources}
          label="Sources"
          blurb="Chaque source est notée de A (fiable) à D (douteuse). Les numéros renvoient aux chiffres du dossier ; les données restent des informations open source."
        />
        <div className="mt-6">
          <SourceList sources={actor.sources} anchorPrefix={sourcePrefix} />
        </div>
      </section>

      <nav className="mt-16 flex flex-wrap gap-6 border-t border-line pt-6">
        <Link
          href="/acteurs"
          className="font-mono text-xs uppercase tracking-[0.16em] text-accent transition-colors hover:text-ink"
        >
          ← Tous les acteurs
        </Link>
        <Link
          href="/methodologie"
          className="font-mono text-xs uppercase tracking-[0.16em] text-ink-dim transition-colors hover:text-accent"
        >
          Comment lire ces données ?
        </Link>
      </nav>
    </article>
  );
}
