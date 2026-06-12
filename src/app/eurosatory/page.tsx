import type { Metadata } from "next";
import Link from "next/link";
import { systems } from "@/data/systems";
import { DOMAINS } from "@/data/domains";
import { getEvidenceStats } from "@/lib/claims";
import { primaryCountry } from "@/lib/grouping";
import { DomainEmblem } from "@/components/domain-emblem";
import { SectionMarker } from "@/components/primitives";
import { RegistrationMarks } from "@/components/registration-marks";
import { Stamp } from "@/components/stamp";
import { StatGrid, type Stat } from "@/components/stat-cards";

export const metadata: Metadata = {
  alternates: { canonical: "/eurosatory" },
  title: "Panoplie pour EuroSatory 2026",
  description:
    "La lecture rapide de Panoplie pour EuroSatory : observatoire OSINT multi-domaines des systèmes de défense — sourcé, daté, comparable. Promesse, méthode, domaines, démo en cinq minutes.",
};

const BRICKS = [
  ["Coût", "Acquisition, cycle de vie, MCO — le coût complet, pas le prix catalogue."],
  ["Finance", "Canal d'acquisition (FMS, national, coopératif), cycles budgétaires."],
  ["Supply chain", "Dépendances industrielles, fournisseurs critiques, concentration."],
  ["Géopolitique", "Rôle stratégique, autonomie, signal d'alliance, interopérabilité."],
  ["Export", "Régime de contrôle (ITAR, MTCR), attractivité, contraintes de réexport."],
] as const;

const SCORES = [
  "Efficacité-coût",
  "Survivabilité",
  "Exportabilité",
  "Risque industriel",
  "Maturité",
  "Confiance des données",
] as const;

const DEMO_STEPS = [
  [
    "Home multi-domaines",
    "Des domaines extensibles, des compteurs dérivés des données — pas un catalogue marketing.",
    "/",
  ],
  [
    "Ouvrir un dossier naval",
    "Une fiche-dossier : plateforme, capteurs, CMS, effecteurs, industriels, export.",
    "/systemes/fremm-france",
  ],
  [
    "Auditer une affirmation",
    "La Console : chaque affirmation tracée à sa source, sa confiance, son statut.",
    "/console",
  ],
  [
    "Comparer entre pays",
    "Confronter deux ou trois systèmes — par pays, par famille, ou en chaîne système.",
    "/comparateur",
  ],
  [
    "Lire la décision",
    "Lecture industrielle, budgétaire, d'export et d'interopérabilité — non opérationnelle.",
    "/methodologie",
  ],
] as const;

const USE_CASES = [
  [
    "Comparer",
    "Deux frégates, deux pays, brique par brique — sans faux score chiffré.",
    "/comparateur",
    "Ouvrir le comparateur",
  ],
  [
    "Auditer",
    "Remonter n'importe quelle affirmation jusqu'à sa source et son niveau de confiance.",
    "/console",
    "Ouvrir la Console",
  ],
  [
    "Naviguer",
    "Entrer par domaine et par pays — marines, spatial, feux terrestres, une grille unique.",
    "/batiments-navals",
    "Ouvrir le naval",
  ],
] as const;

export default function EurosatoryPage() {
  const stats = getEvidenceStats();
  const domains = DOMAINS.map((domain) => ({
    ...domain,
    count: systems.filter((s) => s.category === domain.category).length,
  }));
  const navalCountries = new Set(
    systems
      .filter((s) => s.category === "naval-vessel")
      .map((s) => primaryCountry(s.country)),
  ).size;

  const cards: Stat[] = [
    { label: "Systèmes documentés", value: stats.systems },
    { label: "Sources indexées", value: stats.sources },
    { label: "Affirmations tracées", value: stats.claims },
    { label: "Affirmations vérifiées", value: stats.byStatus.verifie },
  ];

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-12">
      {/* Couverture — one-pager */}
      <header className="reveal relative border border-line-bright bg-panel">
        <RegistrationMarks />
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-6 py-2.5">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
            Panoplie — dossier de présentation
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
            EuroSatory · 15–19 juin 2026 · Paris-Nord Villepinte
          </span>
        </div>
        <div className="p-8 sm:p-10">
          <h1 className="font-serif text-4xl leading-[1.05] tracking-tight text-ink sm:text-5xl">
            Un observatoire OSINT des systèmes de défense —{" "}
            <span className="italic text-accent">sourcé, daté, comparable</span>.
          </h1>
          <p className="mt-6 max-w-2xl font-serif text-lg leading-relaxed text-ink-dim">
            Panoplie lit les systèmes de défense non comme des fiches techniques,
            mais comme des objets de coût, de finance, de chaîne industrielle, de
            géopolitique et d'export — à partir de sources ouvertes, sans contenu
            opérationnel. Chaque affirmation est tracée, notée et datée.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Stamp tone="accent" rotate={-3}>
              OSINT
            </Stamp>
            <Stamp tone="ink" rotate={2}>
              Multi-domaines
            </Stamp>
            <Stamp tone="dim" rotate={-1}>
              {navalCountries} marines · {domains.length} domaines
            </Stamp>
          </div>
          <div className="mt-8">
            <StatGrid stats={cards} />
          </div>
        </div>
      </header>

      <section className="mt-16">
        <SectionMarker
          index="01"
          label="Ce que fait Panoplie"
          blurb="Une plateforme d'analyse stratégique, industrielle et financière — pas un catalogue."
        />
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <p className="font-serif text-[1.05rem] leading-[1.75] text-ink/90">
            Panoplie répond à une question simple et rarement traitée
            sérieusement : derrière un système d'armes, quel coût réel, quel
            financement, quelle dépendance industrielle, quelle position
            géopolitique, quel régime d'export ? La réponse est rendue lisible,
            comparable et auditable.
          </p>
          <p className="font-serif text-[1.05rem] leading-[1.75] text-ink/90">
            Le parti pris : peu de systèmes, mais mieux documentés ; pas de faux
            scores chiffrés, mais des paliers argumentés ; pas d'exhaustivité,
            mais une confiance des données affichée. C'est ce qui distingue
            Panoplie d'un catalogue technique ou marketing.
          </p>
        </div>
      </section>

      <section className="mt-16">
        <SectionMarker
          index="02"
          label="La méthode"
          blurb="Cinq briques de lecture, six paliers d'évaluation A–E, un registre de preuves."
        />
        <div className="mt-6 grid gap-px border border-line bg-line md:grid-cols-2">
          <div className="bg-panel p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
              Cinq briques
            </p>
            <ul className="mt-3 space-y-2">
              {BRICKS.map(([name, detail], i) => (
                <li key={name} className="flex gap-3">
                  <span className="font-mono text-[11px] text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="font-mono text-xs uppercase tracking-[0.12em] text-ink">
                      {name}
                    </span>
                    <span className="mt-0.5 block font-serif text-sm leading-relaxed text-ink-dim">
                      {detail}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-panel p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
              Six paliers d'évaluation (A → E)
            </p>
            <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {SCORES.map((label) => (
                <li
                  key={label}
                  className="border border-line px-3 py-2 font-mono text-[11px] text-ink-dim"
                >
                  {label}
                </li>
              ))}
            </ul>
            <p className="mt-4 font-serif text-sm italic leading-relaxed text-ink-faint">
              Chaque palier est argumenté ; aucun n'est un score chiffré. La
              confiance des données est elle-même un palier.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <SectionMarker
          index="03"
          label="Domaines couverts"
          blurb={`${systems.length} dossiers, ${domains.length} domaines, ${navalCountries} marines documentées.`}
        />
        <div className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2">
          {domains.map((domain) => (
            <Link
              key={domain.href}
              href={domain.href}
              className="group flex items-center gap-4 bg-panel p-5 transition-colors hover:bg-surface-2"
            >
              <DomainEmblem
                category={domain.category}
                className="h-12 w-12 shrink-0 text-ink-faint transition-colors group-hover:text-accent"
              />
              <span className="min-w-0 flex-1">
                <span className="block font-mono text-xs uppercase tracking-[0.16em] text-accent">
                  {domain.label}
                </span>
                <span className="mt-1 block font-mono text-[11px] text-ink-faint">
                  {domain.count} dossiers
                </span>
              </span>
              <span className="font-mono text-ink-faint transition-colors group-hover:text-accent">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <SectionMarker
          index="04"
          label="Trois cas d'usage"
          blurb="Comparer, auditer, naviguer — la preuve au premier clic."
        />
        <div className="mt-6 grid gap-px border border-line bg-line md:grid-cols-3">
          {USE_CASES.map(([title, detail, href, cta]) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col bg-panel p-5 transition-colors hover:bg-surface-2"
            >
              <span className="font-serif text-xl text-ink group-hover:text-accent">
                {title}
              </span>
              <span className="mt-2 flex-1 font-serif text-sm leading-relaxed text-ink-dim">
                {detail}
              </span>
              <span className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint transition-colors group-hover:text-accent">
                {cta} →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <SectionMarker
          index="05"
          label="Démo en cinq minutes"
          blurb="Le parcours de présentation, étape par étape."
        />
        <ol className="mt-6 grid gap-px border border-line bg-line">
          {DEMO_STEPS.map(([title, detail, href], i) => (
            <li key={href} className="bg-panel">
              <Link
                href={href}
                className="group flex items-baseline gap-4 p-5 transition-colors hover:bg-surface-2"
              >
                <span className="font-mono text-sm font-semibold text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1">
                  <span className="font-serif text-lg text-ink group-hover:text-accent">
                    {title}
                  </span>
                  <span className="mt-1 block font-serif text-sm leading-relaxed text-ink-dim">
                    {detail}
                  </span>
                </span>
                <span className="font-mono text-ink-faint transition-colors group-hover:text-accent">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16">
        <SectionMarker index="06" label="Cadre éthique" />
        <div className="mt-6 border-l-2 border-accent bg-panel p-6">
          <p className="max-w-2xl font-serif text-[1.05rem] leading-[1.75] text-ink/90">
            Panoplie reste une lecture stratégique, industrielle et financière à
            partir de sources ouvertes. Pas d'aide au ciblage, pas de paramètres
            tactiques exploitables, pas de procédures d'emploi ni de maintenance,
            pas de place de marché. Toute fiche se tient à un niveau capacitaire,
            industriel, budgétaire, doctrinal et public.
          </p>
        </div>
      </section>

      <section className="mt-16">
        <div className="relative border border-line bg-panel p-8">
          <RegistrationMarks />
          <h2 className="font-serif text-2xl leading-tight text-ink">
            Discuter de Panoplie à EuroSatory
          </h2>
          <p className="mt-3 max-w-2xl font-serif text-base leading-relaxed text-ink-dim">
            Démonstration en cinq minutes, lecture méthodologique en dix, audit
            d'un dossier en trente. La plateforme est en ligne et explorable
            dès maintenant.
          </p>
          <nav className="mt-5 flex flex-wrap gap-6">
            <Link
              href="/comparateur"
              className="font-mono text-xs uppercase tracking-[0.16em] text-accent transition-colors hover:text-ink"
            >
              Lancer une comparaison →
            </Link>
            <Link
              href="/methodologie"
              className="font-mono text-xs uppercase tracking-[0.16em] text-ink-dim transition-colors hover:text-accent"
            >
              Lire la méthodologie
            </Link>
            <a
              href="mailto:ludoviclabs@gmail.com"
              className="font-mono text-xs uppercase tracking-[0.16em] text-ink-dim transition-colors hover:text-accent"
            >
              Contact
            </a>
          </nav>
        </div>
      </section>
    </div>
  );
}
