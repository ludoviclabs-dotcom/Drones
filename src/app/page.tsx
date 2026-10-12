import type { Metadata } from "next";
import Link from "next/link";
import { systems, SYSTEMS_BY_SLUG } from "@/data/systems";
import { DOMAINS } from "@/data/domains";
import {
  BRICK_ANGLE_LABELS,
  BRICK_ORDER,
  SCORE_LABELS,
  SOURCE_TYPE_LABELS,
} from "@/data/labels";
import { HUD_BOARDS, HUD_INDEX_PATH } from "@/data/hud/boards";
import { INDUSTRIAL_GRAPH_PILOT } from "@/data/panoplie-workflows";
import { HudBoardCard } from "@/components/hud/hud-board-card";
import { SystemCard } from "@/components/system-card";
import { CatalogueFilter } from "@/components/catalogue-filter";
import { SectionMarker } from "@/components/primitives";
import { HeroPlate, heroCallouts } from "@/components/home/hero-plate";
import { DossierDemo, type DemoAngle } from "@/components/home/dossier-demo";
import { DomainIndex } from "@/components/home/domain-index";
import {
  HudBoardRow,
  IndustrialGraphExcerpt,
  ScoreCompareTable,
} from "@/components/home/instruments";
import { EvidencePanel } from "@/components/home/evidence-panel";
import { getEvidenceStats } from "@/lib/claims";
import { formatCount, formatDateFr } from "@/lib/format";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/** Dossier de la démonstration quand la planche de tête n'en illustre aucun. */
const DEMO_FALLBACK_SLUG = "rafale";
/** Second dossier de l'extrait du comparateur — même domaine, lecture contrastée. */
const COMPARE_SLUG = "gripen";
/** Systèmes du graphe pilote repris dans l'extrait de l'accueil. */
const GRAPH_SYSTEM_IDS = ["mq9", "tb2", "eurodrone"] as const;
/** Cartes visibles avant dépliage du catalogue. */
const CATALOGUE_PREVIEW = 6;

const BTN_PRIMARY =
  "inline-flex min-h-12 items-center justify-center border border-accent bg-accent px-6 font-mono text-xs uppercase tracking-[0.16em] text-bg transition-colors hover:border-ink hover:bg-ink";
const BTN_SECONDARY =
  "inline-flex min-h-12 items-center justify-center border border-line-bright px-6 font-mono text-xs uppercase tracking-[0.16em] text-ink transition-colors hover:border-accent hover:text-accent";
const LINK_ACCENT =
  "inline-flex min-h-11 items-center font-mono text-[11px] uppercase tracking-[0.16em] text-accent transition-colors hover:text-ink";
const LINK_DIM =
  "inline-flex min-h-11 items-center font-mono text-[11px] uppercase tracking-[0.16em] text-ink-dim transition-colors hover:text-accent";

const pad = (n: number) => String(n).padStart(2, "0");

/** Première phrase d'un narratif — l'accroche de l'onglet. */
function firstSentence(text: string): string {
  const match = text.match(/^[^.!?]+[.!?]/);
  return match ? match[0].trim() : text;
}

export default function Home() {
  const stats = getEvidenceStats();

  // La planche de tête du registre est le visuel du hero ; le dossier qu'elle
  // illustre devient celui de la démonstration et des repères annotés.
  const [heroBoard, spotlightBoard, ...otherBoards] = HUD_BOARDS;
  const demoSystem =
    SYSTEMS_BY_SLUG[heroBoard.systemSlugs?.[0] ?? DEMO_FALLBACK_SLUG] ??
    systems[0];
  const compareSystem = SYSTEMS_BY_SLUG[COMPARE_SLUG];

  const sourceById = new Map(demoSystem.sources.map((s) => [s.id, s] as const));
  const angles: DemoAngle[] = BRICK_ORDER.flatMap((key, i) => {
    const brick = demoSystem.bricks.find((b) => b.key === key);
    if (!brick) return [];
    return [
      {
        key,
        num: pad(i + 1),
        label: BRICK_ANGLE_LABELS[key],
        lede: firstSentence(brick.narrative),
        narrative: brick.narrative,
        indicators: brick.indicators.map((indicator) => ({
          label: indicator.label,
          value: indicator.value,
          confidence: indicator.confidence,
          // Même règle que le registre de preuves : explicite, sinon dérivé.
          status:
            indicator.status ??
            (indicator.confidence === "haute" ? "verifie" : "a-recouper"),
          note: indicator.note,
          sources: (indicator.sources ?? []).flatMap((id) => {
            const source = sourceById.get(id);
            return source
              ? [
                  {
                    publisher: source.publisher,
                    type: SOURCE_TYPE_LABELS[source.type].toLowerCase(),
                    reliability: source.reliability,
                  },
                ]
              : [];
          }),
        })),
      },
    ];
  });
  const demoScores = demoSystem.scores.map((score) => ({
    key: score.key,
    label: SCORE_LABELS[score.key],
    grade: score.grade,
  }));
  const exampleSource =
    demoSystem.sources.find((s) => s.reliability === "A") ??
    demoSystem.sources[0];

  const domains = DOMAINS.map((domain) => ({
    ...domain,
    count: systems.filter((s) => s.category === domain.category).length,
  }));

  const ribbon = [
    { label: "Systèmes documentés", value: stats.systems },
    { label: "Domaines", value: domains.length },
    { label: "Sources indexées", value: stats.sources },
    { label: "Affirmations tracées", value: stats.claims },
    { label: "Affirmations vérifiées", value: stats.byStatus.verifie, accent: true },
  ];

  return (
    <div>
      {/* ===== 01 · Hero asymétrique ===== */}
      <section
        aria-labelledby="hero-title"
        className="mx-auto max-w-[1180px] px-5 pb-14 pt-12 sm:pt-16 lg:pb-16 lg:pt-20"
      >
        <div className="grid gap-12 lg:grid-cols-[7fr_5fr] lg:items-start lg:gap-16">
          <div className="flex flex-col gap-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
              01 — Observatoire en sources ouvertes · Éd. 2026
            </p>
            <h1
              id="hero-title"
              className="max-w-[12ch] font-serif text-[2.75rem] leading-[1.02] tracking-[-0.02em] text-ink sm:text-6xl lg:text-[4.75rem] xl:text-[5.25rem]"
            >
              Un système d'armes n'est jamais un{" "}
              <em className="italic text-accent">simple achat</em>.
            </h1>
            <p className="max-w-[54ch] font-sans text-lg leading-relaxed text-ink-dim">
              Coût, financement, chaîne industrielle, géopolitique, export :
              cinq lectures appliquées à {stats.systems} systèmes de défense, à
              partir de sources ouvertes, notées et datées.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="#catalogue" className={BTN_PRIMARY}>
                Ouvrir le recueil →
              </Link>
              <Link href={HUD_INDEX_PATH} className={BTN_SECONDARY}>
                Voir les planches techniques →
              </Link>
            </div>
            <p className="flex flex-wrap gap-x-5 gap-y-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
              <span>OSINT</span>
              <span aria-hidden="true">·</span>
              <span>Sources ouvertes</span>
              <span aria-hidden="true">·</span>
              <span>Analyse — pas d'usage opérationnel</span>
            </p>
          </div>

          <HeroPlate
            board={heroBoard}
            index={1}
            total={HUD_BOARDS.length}
            callouts={heroCallouts(demoSystem)}
          />
        </div>

        {/* Ruban de compteurs — dérivés du registre de preuves, jamais saisis. */}
        <dl className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-5">
          {ribbon.map((stat) => (
            <div key={stat.label} className="bg-panel px-5 py-4">
              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
                {stat.label}
              </dt>
              <dd
                className={`mt-1.5 font-mono text-[1.75rem] leading-none ${
                  stat.accent ? "text-accent" : "text-ink"
                }`}
                data-countup={stat.value}
              >
                {formatCount(stat.value)}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ===== 02 · Démonstration : un dossier, cinq angles ===== */}
      <section
        id="demonstration"
        aria-labelledby="demo-title"
        className="border-y border-line bg-surface py-16 sm:py-20"
      >
        <div className="reveal mx-auto max-w-[1180px] px-5">
          <SectionMarker index="02" label="Démonstration" />
          <h2
            id="demo-title"
            className="mt-5 font-serif text-4xl leading-[1.08] tracking-tight text-ink sm:text-5xl"
          >
            Un dossier, cinq angles.
          </h2>
          <p className="mt-3 max-w-[60ch] font-sans text-[17px] leading-relaxed text-ink-dim">
            Le {demoSystem.name}, lu comme Panoplie lit chaque système : le
            même parcours, de la facture au régime d'export. Choisissez un
            angle.
          </p>
          <div className="mt-10">
            <DossierDemo
              system={{
                slug: demoSystem.slug,
                name: demoSystem.name,
                reference: demoSystem.reference,
                manufacturer: demoSystem.manufacturer,
                classLabel: demoSystem.classLabel,
                updatedLabel: demoSystem.updated
                  ? formatDateFr(demoSystem.updated)
                  : undefined,
              }}
              angles={angles}
              scores={demoScores}
            />
          </div>
        </div>
      </section>

      {/* ===== 03 · Index éditorial des domaines ===== */}
      <section
        id="domaines"
        aria-labelledby="domaines-title"
        className="py-16 sm:py-20"
      >
        <div className="reveal mx-auto max-w-[1180px] px-5">
          <SectionMarker index="03" label="Index" />
          <h2
            id="domaines-title"
            className="mt-5 font-serif text-4xl leading-[1.08] tracking-tight text-ink sm:text-5xl"
          >
            {domains.length === 11 ? "Onze" : domains.length} domaines, une
            même grille.
          </h2>
          <p className="mt-3 max-w-[56ch] font-sans text-[17px] leading-relaxed text-ink-dim">
            Chaque domaine est lu avec les cinq mêmes angles. Survolez ou
            sélectionnez un domaine pour en lire l'aperçu.
          </p>
          <div className="mt-10">
            <DomainIndex domains={domains} initial={demoSystem.category} />
          </div>
          <Link href="/domaines" className={`${LINK_ACCENT} mt-6`}>
            Tous les domaines →
          </Link>
        </div>
      </section>

      {/* ===== 04 · Instruments : planches, comparateur, graphe ===== */}
      <section
        id="instruments"
        aria-labelledby="instruments-title"
        className="border-y border-line bg-panel py-16 sm:py-20"
      >
        <div className="reveal mx-auto max-w-[1180px] px-5">
          <SectionMarker index="04" label="Instruments" />
          <h2
            id="instruments-title"
            className="mt-5 font-serif text-4xl leading-[1.08] tracking-tight text-ink sm:text-5xl"
          >
            Manipuler, comparer, relier.
          </h2>
          <p className="mt-3 max-w-[60ch] font-sans text-[17px] leading-relaxed text-ink-dim">
            Trois instruments pour passer du dossier à l'analyse : les planches
            techniques, le comparateur et le graphe des dépendances
            industrielles.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-[7fr_5fr] lg:items-start">
            <div className="flex flex-col border border-line bg-bg">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                <span className="text-accent">Planches techniques</span>
                <span>
                  {HUD_BOARDS.length} planches · WebGL 2 ou vignette statique
                </span>
              </div>
              <div className="p-4 sm:p-5">
                <HudBoardCard board={spotlightBoard} headingLevel={3} />
                <div className="mt-4">
                  {otherBoards.map((board) => (
                    <HudBoardRow key={board.slug} board={board} />
                  ))}
                </div>
                <Link href={HUD_INDEX_PATH} className={`${LINK_ACCENT} mt-3`}>
                  Toutes les planches →
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="border border-line bg-bg">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                  <span className="text-accent">Comparateur</span>
                  <span>2 à 3 dossiers</span>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-2xl leading-tight text-ink">
                    Comparer vaut mieux que décrire.
                  </h3>
                  {compareSystem ? (
                    <div className="mt-4">
                      <ScoreCompareTable left={demoSystem} right={compareSystem} />
                    </div>
                  ) : null}
                  <Link href="/comparateur" className={`${LINK_ACCENT} mt-3`}>
                    Ouvrir le comparateur →
                  </Link>
                </div>
              </div>

              <div className="border border-line bg-bg">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                  <span className="text-accent">Graphe industriel</span>
                  <span>Pilote · {INDUSTRIAL_GRAPH_PILOT.title}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-2xl leading-tight text-ink">
                    Qui dépend de qui.
                  </h3>
                  <IndustrialGraphExcerpt systemIds={GRAPH_SYSTEM_IDS} />
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                    Systèmes · industriels · pays — niveau public, sans détail
                    de fabrication
                  </p>
                  <div className="flex flex-wrap gap-x-6">
                    <Link href="/industrial-graph" className={LINK_ACCENT}>
                      Ouvrir le graphe →
                    </Link>
                    <Link href="/matrice" className={LINK_DIM}>
                      Matrice
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 05 · Sources, datation, confiance — insert papier ===== */}
      <section id="methode" aria-labelledby="methode-title">
        <EvidencePanel example={exampleSource} />
      </section>

      {/* ===== 06 · Recherche et catalogue ===== */}
      <section
        id="catalogue"
        aria-labelledby="catalogue-title"
        className="border-t border-line py-16 sm:py-20"
      >
        <div className="mx-auto max-w-[1180px] px-5">
          <SectionMarker index="06" label="Catalogue" />
          <h2
            id="catalogue-title"
            className="mt-5 font-serif text-4xl leading-[1.08] tracking-tight text-ink sm:text-5xl"
          >
            Chercher dans les {systems.length} dossiers.
          </h2>
          <p className="mt-3 max-w-[60ch] font-sans text-[17px] leading-relaxed text-ink-dim">
            Du drone MALE à la munition rôdeuse, du laser haute énergie au
            chasseur de combat, du missile au bâtiment naval — chaque dossier
            ouvre sur place.
          </p>
          <div className="mt-8">
            <CatalogueFilter
              initialLimit={CATALOGUE_PREVIEW}
              entries={systems.map((system) => {
                const autonomyProfile = system.autonomyProfile;
                const battlefieldFunctions =
                  autonomyProfile?.battlefieldFunctions ?? [];
                const autonomyModes = autonomyProfile?.autonomyModes ?? [];
                return {
                  slug: system.slug,
                  category: system.category,
                  autonomyModes,
                  battlefieldFunctions,
                  hasCounterUas: battlefieldFunctions.includes("counter-uas"),
                  haystack:
                    `${system.name} ${system.country} ${system.manufacturer} ${system.classLabel} ${battlefieldFunctions.join(" ")} ${autonomyModes.join(" ")}`.toLowerCase(),
                  card: <SystemCard system={system} />,
                };
              })}
            />
          </div>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2">
            <Link href="/domaines" className={LINK_DIM}>
              Parcourir par domaine
            </Link>
            <Link href="/comparateur" className={LINK_DIM}>
              Comparer des dossiers
            </Link>
            <Link href="/methodologie" className={LINK_DIM}>
              Lire la méthodologie
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
