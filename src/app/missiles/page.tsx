import type { Metadata } from "next";
import Link from "next/link";
import { systems } from "@/data/systems";
import { MISSILE_ROLE_BLURBS, MISSILE_ROLE_LABELS } from "@/data/labels";
import type { MissileRole } from "@/data/types";
import { SectionMarker } from "@/components/primitives";
import { Narrative } from "@/components/narrative";
import { LegalNote } from "@/components/fiche-sections";
import { SystemSchematic } from "@/components/system-schematic";
import { RegistrationMarks } from "@/components/registration-marks";
import { Stamp } from "@/components/stamp";

export const metadata: Metadata = {
  title: "Missiles",
  description:
    "Le domaine des missiles — air-air, air-surface, surface-surface, surface-air et SEAD. Coût réel, chaîne industrielle, régimes d'export et cadre juridique du droit des conflits armés.",
};

// Cinq rôles structurants — affichés en ouverture, lus à la même grille que
// les autres domaines (coût, finance, supply chain, géopolitique, export).
const ROLE_ORDER: MissileRole[] = ["AAM", "ASM", "SSM", "SAM", "ARM"];

// Typologie des coûts — un missile n'a pas un prix unique. Les documents
// budgétaires US distinguent flyaway, net procurement, gross weapon system ;
// les contrats européens publient plutôt par batterie ou par enveloppe.
const COST_LAYERS: [string, string][] = [
  [
    "Flyaway",
    "Le coût de la munition seule — souvent cité sans canister, ingénierie de production ni system engineering.",
  ],
  [
    "Net procurement",
    "Coût budgétaire moyen tel qu'il figure dans les justifications DoD — production complète, canister inclus.",
  ],
  [
    "Gross weapon system",
    "Inclut en plus l'ingénierie de production, l'obsolescence et le system engineering — valeur la plus haute.",
  ],
  [
    "Coût européen par enveloppe",
    "Programmes européens : coût publié par batterie, par contrat ou par lot industriel — pas missile à missile.",
  ],
  [
    "Coût de soutien",
    "MRO, certification, MLR — un missile vieillit, son entretien pèse autant que sa production initiale.",
  ],
  [
    "Coût par tir",
    "Carburant ou intercepteurs réellement consommés — utile pour comparer doctrines, pas pour comparer munitions.",
  ],
];

// Chaîne industrielle critique — chokepoints partagés entre familles.
// Tirés des rapports GAO, des justifications DoD et des annonces MBDA / RTX
// sur la montée en cadence post-Ukraine.
const SUPPLY_CHAIN = [
  "Propergol solide (SRM)",
  "Ramjet / ducted rocket",
  "Autodirecteur RF actif / AESA",
  "Imageur IR / IIR",
  "INS · GNSS · datalink",
  "Warhead · fuze",
  "Canister · intégration",
  "MRO · refurbishment (MLR)",
];

// Régimes d'export — l'ITAR américain, le MTCR multilatéral, la Position
// commune UE et l'ATT (Arms Trade Treaty) couvrent quatre logiques distinctes.
const EXPORT_REGIMES: [string, string][] = [
  [
    "ITAR (US)",
    "Defense articles sous autorisation américaine — autorisation préalable, clauses end-user, ré-export contrôlé.",
  ],
  [
    "MTCR — Catégorie I",
    "Missiles capables d'emporter ≥ 500 kg à ≥ 300 km — présomption forte de refus, transferts soumis à contrôle multilatéral.",
  ],
  [
    "MTCR — Catégorie II",
    "Sous-systèmes et autres missiles — contrôle au cas par cas, exigences d'utilisation finale.",
  ],
  [
    "Position commune UE 2008/944/PESC",
    "Huit critères — droits humains, stabilité régionale, intentions affichées — appliqués par chaque État membre.",
  ],
  [
    "Arms Trade Treaty (ATT)",
    "Article 2 — couvre explicitement missiles et lanceurs ; interdit le transfert en cas de violations graves anticipées.",
  ],
  [
    "Régimes nationaux européens",
    "Contrôles français, britannique, italien, allemand — superposés aux mécanismes UE et multilatéraux.",
  ],
];

// Cadre du droit international humanitaire — repris du CICR. Les missiles
// ne sont pas interdits en tant que tels, mais leur usage est borné par
// trois principes structurants — la fiche-domaine doit le poser explicitement.
const LEGAL_NOTE =
  "Les missiles ne sont pas interdits en tant qu'objets par le droit international humanitaire. Leur emploi reste néanmoins borné par les principes de distinction (entre combattants et civils, entre objectifs militaires et biens civils), de proportionnalité (entre l'avantage militaire attendu et les dommages incidents prévisibles) et de précautions dans l'attaque. Le CICR rappelle en particulier que l'emploi d'armes explosives à effets étendus en zone peuplée pose un risque élevé d'effets indiscriminés.";

export default function MissilesPage() {
  const dossiers = systems.filter((s) => s.category === "missile");
  const countByRole = (role: MissileRole) =>
    dossiers.filter((s) => s.missileRole === role).length;

  return (
    <div className="mx-auto max-w-[1000px] px-5 py-12">
      <header className="reveal">
        <div className="flex flex-wrap items-center gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
            Domaine transversal
          </p>
          <Stamp tone="ink" rotate={-3}>
            PNP-MSL
          </Stamp>
        </div>
        <h1 className="mt-4 font-serif text-5xl tracking-tight text-ink sm:text-6xl">
          Missiles
        </h1>
        <p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-ink-dim">
          Air-air, air-surface, surface-surface, surface-air et SEAD. Un domaine
          que Panoplie ouvre avec huit dossiers d'ancrage, lus à la même grille
          que les drones, les lasers et les avions de combat — coût, finance,
          supply chain, géopolitique, export.
        </p>
        <p className="mt-4 max-w-2xl border-l-2 border-accent pl-4 font-serif text-base italic leading-relaxed text-ink-dim">
          Un missile n'est ni un effecteur ni un produit isolés : c'est une
          munition critique, un objet industriel sous contrainte, et un objet
          de contrôle politique. La grille Panoplie le lit comme tel — pas
          comme un classement de portées.
        </p>
      </header>

      <section className="mt-16">
        <SectionMarker
          index="01"
          label="Cinq rôles, une grille"
          blurb="Air-air, air-surface, surface-surface, surface-air, SEAD — les cinq segments du domaine, et leurs sujets propres."
        />
        <div className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2">
          {ROLE_ORDER.map((role) => {
            const count = countByRole(role);
            return (
              <div key={role} className="bg-panel p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-mono text-sm uppercase tracking-[0.1em] text-ink">
                    {MISSILE_ROLE_LABELS[role]}
                  </h3>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                    {count} {count > 1 ? "dossiers" : "dossier"}
                  </span>
                </div>
                <p className="mt-2 font-serif text-sm leading-relaxed text-ink-dim">
                  {MISSILE_ROLE_BLURBS[role]}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-16">
        <SectionMarker
          index="02"
          label="Famille → variante → emploi"
          blurb="Un même nom recouvre des munitions très différentes — Aster 30 et Aster 30 B1NT ne sont pas le même missile."
        />
        <Narrative
          className="mt-6 max-w-3xl"
          text={
            "Un missile se lit à trois niveaux. La famille — AMRAAM, Meteor, Aster, AARGM — porte une identité industrielle et doctrinale. La variante — AIM-120D-3, Aster 30 B1NT, AGM-88G — porte une capacité datée et un standard logiciel. L'emploi — air-air sur Rafale, surface-launch via NASAMS, soute interne F-35 — porte la mission réelle.\n\nPlusieurs missiles du domaine sont explicitement multi-emploi. AMRAAM équipe avions et batteries NASAMS. Aster 30 équipe frégates et batteries SAMP/T. SCALP / Storm Shadow est intégré sur Rafale, Tornado, Typhoon. La fiche s'organise par famille, mais la lecture honore les trois niveaux."
          }
        />
      </section>

      <section className="mt-16">
        <SectionMarker
          index="03"
          label="Les couches de coût"
          blurb="Un missile n'a pas un prix — il a plusieurs types de coûts publics, souvent non comparables."
        />
        <div className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2">
          {COST_LAYERS.map(([term, detail]) => (
            <div key={term} className="bg-panel p-5">
              <h3 className="font-mono text-sm uppercase tracking-[0.1em] text-ink">
                {term}
              </h3>
              <p className="mt-2 font-serif text-sm leading-relaxed text-ink-dim">
                {detail}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-6 max-w-3xl font-serif text-[0.95rem] leading-relaxed text-ink-dim">
          Les chiffres publiés dans les fiches précisent toujours le type de
          coût — flyaway, net procurement, gross weapon system ou enveloppe —
          parce qu'un PAC-3 MSE à 5,6 M$ (net procurement) n'est pas comparable
          tel quel à un Meteor non publié.
        </p>
      </section>

      <section className="mt-16">
        <SectionMarker
          index="04"
          label="La chaîne industrielle critique"
          blurb="Huit chokepoints partagés entre familles — la base SRM est commune à AMRAAM, PAC-3, PrSM et JAGM."
        />
        <p className="mt-6 max-w-3xl font-serif text-[1.05rem] leading-[1.75] text-ink/90">
          La cadence de production missilière est devenue un enjeu stratégique
          de premier plan depuis 2022. Les rapports GAO sur la base américaine
          du propergol solide, les annonces MBDA sur le doublement de la
          production Aster, l'expansion de la cadence PAC-3 — tous documentent
          la même tension : la demande excède la chaîne, et la reconstitution
          des stocks alliés est devenue une priorité industrielle.
        </p>
        <ol className="mt-6 flex flex-wrap gap-2">
          {SUPPLY_CHAIN.map((link, i) => (
            <li
              key={link}
              className="flex items-center gap-2 border border-line bg-surface px-3 py-2 font-mono text-[11px] text-ink-dim"
            >
              <span className="text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              {link}
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16">
        <SectionMarker
          index="05"
          label="Régimes d'export et contrôles"
          blurb="ITAR, MTCR, ATT, Position commune UE — quatre logiques superposées qui décident qui peut acheter quoi."
        />
        <div className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2">
          {EXPORT_REGIMES.map(([term, detail]) => (
            <div key={term} className="bg-panel p-5">
              <h3 className="font-mono text-sm uppercase tracking-[0.1em] text-ink">
                {term}
              </h3>
              <p className="mt-2 font-serif text-sm leading-relaxed text-ink-dim">
                {detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <SectionMarker
          index="06"
          label="Cadre juridique — droit des conflits armés"
          blurb="Les missiles ne sont pas interdits ; leur emploi est borné par trois principes structurants."
        />
        <div className="mt-6">
          <LegalNote note={LEGAL_NOTE} />
        </div>
      </section>

      <section className="mt-16">
        <SectionMarker
          index="07"
          label="Les dossiers du domaine"
          blurb={`${dossiers.length} missiles documentés — France, Royaume-Uni, États-Unis, Italie, Europe coopérative.`}
        />
        {dossiers.length > 0 ? (
          <ul className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2">
            {dossiers.map((system) => (
              <li key={system.slug} className="bg-panel">
                <Link
                  href={`/systemes/${system.slug}`}
                  className="group flex items-center gap-4 p-5"
                >
                  <SystemSchematic
                    slug={system.slug}
                    className="h-14 w-14 shrink-0 text-ink-faint transition-colors group-hover:text-accent"
                  />
                  <span className="flex-1">
                    <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                      {system.reference}
                    </span>
                    <span className="block font-serif text-xl text-ink transition-colors group-hover:text-accent">
                      {system.name}
                    </span>
                    <span className="block font-mono text-[10px] text-ink-faint">
                      {system.flag} {system.country} · {system.classLabel}
                    </span>
                  </span>
                  <span className="font-mono text-ink-faint transition-colors group-hover:text-accent">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 border border-dashed border-line-bright bg-panel/40 px-6 py-12 text-center font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">
            Dossiers en cours de rédaction.
          </p>
        )}
      </section>

      <section className="mt-16">
        <div className="relative border border-line bg-panel p-8">
          <RegistrationMarks />
          <h2 className="font-serif text-2xl leading-tight text-ink">
            Lire ces dossiers avec la bonne grille
          </h2>
          <p className="mt-3 max-w-2xl font-serif text-base leading-relaxed text-ink-dim">
            Les paliers d'évaluation et la confiance des données obéissent aux
            mêmes règles que pour les autres domaines. Pour les missiles, la
            prudence porte sur trois points : portée publique souvent variable
            selon le profil de tir, performances ECCM partiellement
            classifiées, et coût qui ne se lit qu'avec sa méthode.
          </p>
          <nav className="mt-5 flex flex-wrap gap-6">
            <Link
              href="/comparateur"
              className="font-mono text-xs uppercase tracking-[0.16em] text-accent transition-colors hover:text-ink"
            >
              Comparer les systèmes →
            </Link>
            <Link
              href="/methodologie"
              className="font-mono text-xs uppercase tracking-[0.16em] text-ink-dim transition-colors hover:text-accent"
            >
              Lire la méthodologie
            </Link>
          </nav>
        </div>
      </section>
    </div>
  );
}
