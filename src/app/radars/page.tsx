import type { Metadata } from "next";
import Link from "next/link";
import { systems } from "@/data/systems";
import { RADAR_ROLE_BLURBS, RADAR_ROLE_LABELS } from "@/data/labels";
import type { RadarRole } from "@/data/types";
import { SectionMarker } from "@/components/primitives";
import { Narrative } from "@/components/narrative";
import { SystemSchematic } from "@/components/system-schematic";
import { RegistrationMarks } from "@/components/registration-marks";
import { Stamp } from "@/components/stamp";

export const metadata: Metadata = {
  alternates: { canonical: "/radars" },
  title: "Radars",
  description:
    "Le domaine des radars — alerte avancée, multi-mission, naval, BMD, aéroporté AESA, C-UAS. Coût réel, chaîne industrielle, régimes d'export et place dans les architectures IAMD.",
};

// Six rôles structurants — affichés en ouverture, lus à la même grille que
// les autres domaines (coût, finance, supply chain, géopolitique, export).
const ROLE_ORDER: RadarRole[] = [
  "alerte-avancee",
  "multi-mission",
  "naval-mfr",
  "bmd",
  "aeroporte-aesa",
  "cuas",
];

// Typologie des coûts radar — un radar n'a pas un prix unique. Les contrats
// publics distinguent capteur, batterie, soutien initial et MCO pluriannuel ;
// l'upgrade logiciel pèse autant que le matériel sur trente ans.
const COST_LAYERS: [string, string][] = [
  [
    "Capteur seul",
    "Antenne, panneaux, calculateurs et générateur — la brique radar nue, telle qu'elle est parfois citée dans les brochures.",
  ],
  [
    "Batterie complète",
    "Capteur + C2 + liaisons + véhicules de soutien + atelier de maintenance — ce qu'un État achète réellement quand il commande « un radar ».",
  ],
  [
    "Soutien initial",
    "Lot initial de rechanges, formation des opérateurs, documentation, simulateurs — souvent 15 à 25 % du prix capteur la première année.",
  ],
  [
    "MCO pluriannuel",
    "Maintenance, pièces consommables, refonte mi-vie, modernisation logicielle — sur trente ans, ce poste dépasse fréquemment le coût initial.",
  ],
  [
    "Upgrade logiciel et baseline",
    "Ajout de modes, ECCM, nouvelles formes d'onde, IFF Mode 5, cyberdurcissement — le capteur évolue par standards successifs, parfois sans changer le matériel.",
  ],
  [
    "Munitions associées",
    "Pour les radars de batterie sol-air, le coût-effet ne se lit qu'avec l'intercepteur — un radar à 30 M€ qui guide des missiles à 3 M$ la pièce n'a pas la même équation qu'un radar C-UAS qui guide des effecteurs à 50 k€.",
  ],
];

// Chaîne industrielle critique — chokepoints partagés entre familles AESA.
// La base TRM, le GaN, le packaging RF et les processeurs sont des nœuds
// largement communs, identifiés dans les communications publiques RTX, Saab,
// Thales, Leonardo, Hensoldt et IAI ELTA.
const SUPPLY_CHAIN = [
  "Modules T/R (TRM)",
  "Semiconducteurs RF GaN",
  "Packaging RF avancé",
  "Refroidissement / thermal",
  "Calculateurs DSP / FPGA",
  "Logiciel de traitement",
  "IFF · liaisons · cyber",
  "Génération d'énergie",
];

// Régimes d'export applicables aux radars — ITAR US, MTCR pour certains
// capteurs longue portée et BMD, Wassenaar pour les biens duaux et capteurs
// avancés, Position commune UE, contrôles nationaux.
const EXPORT_REGIMES: [string, string][] = [
  [
    "ITAR (US)",
    "Capteurs et composants américains soumis à autorisation Department of State — clauses end-user et contrôle de ré-export. Concerne SPY-6, AN/TPY-2, LTAMDS, AN/APG-81, KuRFS.",
  ],
  [
    "MTCR — corrélation",
    "Les radars eux-mêmes ne relèvent pas directement du MTCR, mais leur capacité à guider des effecteurs MTCR-Catégorie I peut conditionner certaines exportations couplées (intercepteur + capteur).",
  ],
  [
    "Wassenaar — biens duaux",
    "Capteurs avancés, composants AESA, GaN, processeurs de signal et logiciels associés relèvent fréquemment de l'Arrangement de Wassenaar — contrôles nationaux harmonisés entre 42 États participants.",
  ],
  [
    "Position commune UE 2008/944/PESC",
    "Huit critères — droits humains, stabilité régionale, intentions affichées — appliqués par chaque État membre aux licences radar. Concerne les exports Thales, Leonardo, Hensoldt, Saab, MBDA-Eurosam.",
  ],
  [
    "Contrôles nationaux européens",
    "Licences DGA (France), BAFA (Allemagne), ECJU (Royaume-Uni), Farnesina/UAMA (Italie) — superposées aux mécanismes UE et multilatéraux.",
  ],
  [
    "Régime israélien",
    "Ministère de la Défense (DECA) — autorisation préalable obligatoire, sensibilité particulière des capteurs ELTA Green Pine et MF-STAR, partage de technologie souvent encadré par accords G2G.",
  ],
];

// Note méthodologique — ce qui est et n'est pas publié dans les sources
// ouvertes radar. Ce passage rappelle ce que Panoplie peut et ne peut pas
// affirmer dans les fiches du domaine.
const METHOD_NOTE =
  "Les radars sont, dans le catalogue Panoplie, le segment où la frontière du dicible publiquement est la plus stricte. Les industriels publient volontiers les rôles, la bande, l'architecture générale et certaines portées ; ils ne publient quasiment jamais la PRF exacte, les formes d'onde détaillées, les algorithmes ECCM, le nombre précis de modules T/R, les budgets thermiques ou les discriminants de suivi. Sur ces points, les fiches affichent « non précisé publiquement » plutôt qu'une fausse précision.";

export default function RadarsPage() {
  const dossiers = systems.filter((s) => s.category === "radar");
  const countByRole = (role: RadarRole) =>
    dossiers.filter((s) => s.radarRole === role).length;

  return (
    <div className="mx-auto max-w-[1000px] px-5 py-12">
      <header className="reveal">
        <div className="flex flex-wrap items-center gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
            Domaine transversal
          </p>
          <Stamp tone="ink" rotate={-3}>
            PNP-RD
          </Stamp>
        </div>
        <h1 className="mt-4 font-serif text-5xl tracking-tight text-ink sm:text-6xl">
          Radars
        </h1>
        <p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-ink-dim">
          Alerte avancée, multi-mission, naval, BMD, aéroporté AESA, C-UAS. Un
          domaine que Panoplie ouvre avec huit dossiers d'ancrage, lus à la
          même grille que les drones, les lasers, les avions de combat et les
          missiles — coût, finance, supply chain, géopolitique, export.
        </p>
        <p className="mt-4 max-w-2xl border-l-2 border-accent pl-4 font-serif text-base italic leading-relaxed text-ink-dim">
          Un radar n'est jamais une capacité en soi : c'est un capteur dans un
          réseau, un nœud d'une architecture IAMD, et un objet de souveraineté
          industrielle. La grille Panoplie le lit comme tel — pas comme une
          fiche technique de portée et de bande.
        </p>
      </header>

      <section className="mt-16">
        <SectionMarker
          index="01"
          label="Six rôles, une grille"
          blurb="Alerte avancée, multi-mission, naval, BMD, aéroporté AESA, C-UAS — les six segments du domaine, et leurs sujets propres."
        />
        <div className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2">
          {ROLE_ORDER.map((role) => {
            const count = countByRole(role);
            return (
              <div key={role} className="bg-panel p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-mono text-sm uppercase tracking-[0.1em] text-ink">
                    {RADAR_ROLE_LABELS[role]}
                  </h3>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                    {count} {count > 1 ? "dossiers" : "dossier"}
                  </span>
                </div>
                <p className="mt-2 font-serif text-sm leading-relaxed text-ink-dim">
                  {RADAR_ROLE_BLURBS[role]}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-16">
        <SectionMarker
          index="02"
          label="Capteur → standard logiciel → réseau"
          blurb="Un même radar évolue par baselines, et ne vaut que par le C2 et les effecteurs auxquels il est connecté."
        />
        <Narrative
          className="mt-6 max-w-3xl"
          text={
            "Un radar se lit à trois niveaux. Le capteur — Ground Master, SPY, EL/M, ECRS, AN/TPY — porte une famille industrielle et doctrinale. Le standard logiciel — SPY-6(V)1 vs (V)2 vs (V)4, Mk2 vs Mk1, Block II vs Block I — porte une capacité datée. Le réseau — NATINAMDS, IBCS, NASAMS, SAMP/T, Iron Dome, Aegis — porte la valeur opérationnelle réelle.\n\nDans les architectures IAMD modernes, la valeur ne réside ni dans la portée brute, ni dans le nombre de modules T/R : elle réside dans la latence d'intégration, la qualité d'engagement transmissible et la résilience du chemin de données. C'est pourquoi les fiches Panoplie consacrent une part importante de la lecture à la brique géopolitique et au cadre d'intégration."
          }
        />
      </section>

      <section className="mt-16">
        <SectionMarker
          index="03"
          label="Les couches de coût"
          blurb="Un radar n'a pas un prix — il a plusieurs types de coûts publics, et son cycle de vie peut peser plus que le ticket d'entrée."
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
          Les chiffres publiés dans les fiches précisent toujours la couche
          considérée — un GM200 à ≈14,5 M€ unitaire (contrat danois public)
          n'est pas comparable tel quel à un AN/TPY-2 sans inclure la
          batterie THAAD complète et son intégration C2.
        </p>
      </section>

      <section className="mt-16">
        <SectionMarker
          index="04"
          label="La chaîne industrielle critique"
          blurb="Huit chokepoints partagés entre familles AESA — la base TRM et le GaN sont communs à Thales, RTX, Leonardo, Saab, Hensoldt, IAI."
        />
        <p className="mt-6 max-w-3xl font-serif text-[1.05rem] leading-[1.75] text-ink/90">
          La valeur d'un radar AESA moderne ne réside plus dans l'antenne seule
          mais dans l'ensemble TRM + microélectronique RF + packaging + calcul
          + logiciel + refroidissement + alimentation + cybersécurité +
          liaisons. RTX, Saab et Thales mettent publiquement l'accent sur le
          GaN, sur l'intégration verticale RF et sur la logique
          « software-defined aperture ». Le risque industriel principal n'est
          plus la mécanique d'antenne, mais l'accès aux composants RF avancés
          et la cadence des fonderies.
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
          blurb="ITAR, Wassenaar, Position commune UE, contrôles nationaux — les radars cumulent plusieurs régimes superposés."
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
          label="Ce que les sources publiques disent — et taisent"
          blurb="Sur les radars, la frontière du dicible publiquement est étroite. Panoplie préfère « non précisé publiquement » à une fausse précision."
        />
        <div className="mt-6 border-l-2 border-accent bg-panel/60 p-6">
          <p className="font-serif text-base leading-relaxed text-ink-dim">
            {METHOD_NOTE}
          </p>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
            Champs typiquement non publiés : PRF · formes d'onde · pulse
            compression · MTI / STAP · algorithmes ECCM · nombre exact de TRM
            · architecture thermique · baselines logicielles.
          </p>
        </div>
      </section>

      <section className="mt-16">
        <SectionMarker
          index="07"
          label="Les dossiers du domaine"
          blurb={`${dossiers.length} radars documentés — France, États-Unis, Israël, Suède, Europe coopérative.`}
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
            mêmes règles que pour les autres domaines. Pour les radars, la
            prudence porte sur quatre points : portée publique souvent
            variable selon la cible et le profil, performances ECCM
            partiellement classifiées, dépendances industrielles GaN /
            packaging RF mal documentées par les industriels, et place dans le
            C2 qui détermine la valeur opérationnelle réelle.
          </p>
          <nav className="mt-5 flex flex-wrap gap-6">
            <Link
              href="/radars/architecture"
              className="font-mono text-xs uppercase tracking-[0.16em] text-accent transition-colors hover:text-ink"
            >
              Voir l'architecture IAMD →
            </Link>
            <Link
              href="/comparateur"
              className="font-mono text-xs uppercase tracking-[0.16em] text-ink-dim transition-colors hover:text-accent"
            >
              Comparer les systèmes
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
