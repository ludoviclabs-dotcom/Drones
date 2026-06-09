import type { Metadata } from "next";
import Link from "next/link";
import { systems } from "@/data/systems";
import {
  ORBIT_LABELS,
  SATELLITE_BLURBS,
  SATELLITE_LABELS,
  SATELLITE_ORDER,
} from "@/data/labels";
import type { SatelliteClass } from "@/data/types";
import { LegalNote } from "@/components/fiche-sections";
import { Narrative } from "@/components/narrative";
import { SectionMarker } from "@/components/primitives";
import { RegistrationMarks } from "@/components/registration-marks";
import { Stamp } from "@/components/stamp";

export const metadata: Metadata = {
  title: "Spatial militaire",
  description:
    "Observation, écoute électromagnétique, télécommunications, navigation, alerte avancée et surveillance de l'espace — les satellites lus comme des architectures de souveraineté, de dépendance et de résilience.",
};

// Cycle d'analyse spatial — calqué sur ARCHITECTURE_LAYERS naval, adapté.
const SPACE_ARCHITECTURE_LAYERS: [string, string][] = [
  [
    "Segment spatial",
    "Satellite, bus, charge utile, durée de vie, propulsion, masse — la partie en orbite.",
  ],
  [
    "Segment sol",
    "Centres mission, stations de réception, chaîne de traitement et diffusion aux utilisateurs.",
  ],
  [
    "Lanceur",
    "Accès à l'espace, dépendance industrielle et politique au fournisseur de lancement.",
  ],
  [
    "Résilience",
    "Brouillage, cyber, débris, redondance, stratégie de remplacement et continuité de service.",
  ],
];

// Chaîne critique — calquée sur NAVAL_SUPPLY_CHAIN, vocabulaire spatial.
const SPACE_SUPPLY_CHAIN = [
  {
    link: "Bus satellite",
    suppliers:
      "Plateformes Spacebus, Eurostar, A2100, LM2100, OneSat — base européenne et US dominante",
  },
  {
    link: "Charge utile",
    suppliers:
      "Optique (Thales Alenia, Airbus, BAE), SAR, antennes SATCOM, autodirecteurs RF",
  },
  {
    link: "Composants critiques",
    suppliers:
      "Horloges atomiques PNT, semi-conducteurs durcis radiation, optronique grande résolution",
  },
  {
    link: "Lanceur",
    suppliers: "Arianespace, ULA, SpaceX, Vega, Soyouz (historique) — souveraineté d'accès",
  },
  {
    link: "Segment sol",
    suppliers: "Stations de réception, centres mission, traitement image, diffusion",
  },
  {
    link: "Chiffrement / liaisons",
    suppliers:
      "Modems durcis, anti-brouillage, chiffrement souverain — dépendance NSA / ANSSI selon nation",
  },
  {
    link: "Export / contrôle",
    suppliers:
      "ITAR composants US, EAR dual-use, Wassenaar, MTCR composants lanceurs",
  },
  {
    link: "MCO orbital",
    suppliers:
      "Surveillance opérationnelle, manoeuvres station-keeping, fin de vie, remplacement satellite",
  },
];

const LEGAL_NOTE =
  "Les fiches spatiales restent une lecture OSINT stratégique. Elles documentent l'orbite générique, la mission publique, le segment sol au niveau facilités annoncées, le lanceur et la résilience publiquement discutée. Elles ne fournissent ni TLE temps réel, ni éphémérides exploitables, ni fenêtres de passage, ni coordonnées précises de stations sensibles, ni paramètres détaillés de liaison, ni méthodes de brouillage ou d'interception, ni résolutions classifiées.";

export default function SpatialPage() {
  const dossiers = systems.filter((s) => s.category === "spatial");
  const countByClass = (cls: SatelliteClass) =>
    dossiers.filter((s) => s.satelliteClass === cls).length;
  const orbitInventory = Array.from(
    new Set(
      dossiers
        .flatMap((s) => s.spaceProfile?.orbit.classes ?? [])
        .map((o) => o),
    ),
  );

  return (
    <div className="mx-auto max-w-[1000px] px-5 py-12">
      <header className="reveal">
        <div className="flex flex-wrap items-center gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
            Domaine transversal
          </p>
          <Stamp tone="ink" rotate={-3}>
            PNP-SP
          </Stamp>
        </div>
        <h1 className="mt-4 font-serif text-5xl tracking-tight text-ink sm:text-6xl">
          Spatial militaire
        </h1>
        <p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-ink-dim">
          Observation, écoute, télécommunications, navigation, alerte avancée et
          surveillance de l&apos;espace. Le domaine spatial de Panoplie lit
          chaque satellite comme une architecture : orbite, charge utile,
          segment sol, lanceur, résilience — pas comme un simple objet en orbite.
        </p>
        <p className="mt-4 max-w-2xl border-l-2 border-accent pl-4 font-serif text-base italic leading-relaxed text-ink-dim">
          La valeur d&apos;un système spatial militaire ne vient pas du satellite
          isolé. Elle vient du cycle complet : commande, acquisition, descente
          de données, traitement, diffusion, et de la souveraineté que ce cycle
          engage.
        </p>
      </header>

      <section className="mt-16">
        <SectionMarker
          index="01"
          label="Familles de mission"
          blurb="La taxonomie spatiale croise mission dominante, orbite et charge utile — les trois axes de lecture du domaine."
        />
        <div className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2">
          {SATELLITE_ORDER.map((cls) => {
            const count = countByClass(cls);
            return (
              <div key={cls} className="bg-panel p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-mono text-sm uppercase tracking-[0.1em] text-ink">
                    {SATELLITE_LABELS[cls]}
                  </h3>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                    {count} {count > 1 ? "dossiers" : "dossier"}
                  </span>
                </div>
                <p className="mt-2 font-serif text-sm leading-relaxed text-ink-dim">
                  {SATELLITE_BLURBS[cls]}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-16">
        <SectionMarker
          index="02"
          label="Orbites documentées"
          blurb="Les orbites présentes dans les dossiers publiés — chaque classe implique un arbitrage couverture / résolution / latence."
        />
        <div className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {orbitInventory.length > 0 ? (
            orbitInventory.map((orbit) => (
              <div key={orbit} className="bg-panel p-4">
                <span className="font-mono text-sm uppercase tracking-[0.12em] text-ink">
                  {ORBIT_LABELS[orbit]}
                </span>
              </div>
            ))
          ) : (
            <div className="bg-panel p-4 font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">
              Aucun dossier publié à ce stade.
            </div>
          )}
        </div>
      </section>

      <section className="mt-16">
        <SectionMarker
          index="03"
          label="Satellite → mission → réseau"
          blurb="Le satellite n'est qu'un nœud visible d'un système plus vaste — exactement comme un navire ou un radar moderne."
        />
        <Narrative
          className="mt-6 max-w-3xl"
          text={
            "Panoplie sépare volontairement trois niveaux pour lire un satellite militaire. Le segment spatial porte les contraintes physiques : orbite, masse, propulsion, durée de vie, charge utile. La mission porte l'effet militaire produit : observation, écoute, communications, navigation, alerte. Le réseau porte la chaîne de service : segment sol, cycle de renseignement, partage allié, latence d'exploitation, intégration au C2.\n\nC'est cette lecture qui permet de comparer un satellite d'observation français (CSO/MUSIS), une constellation SIGINT (CERES), un satellite de télécommunications (Syracuse IV) ou un satellite de navigation (Galileo PRS, GPS III) — pas par tonnage ou résolution annoncée, mais par le rapport entre mission, orbite, segment sol, souveraineté et résilience."
          }
        />
      </section>

      <section className="mt-16">
        <SectionMarker
          index="04"
          label="Cinq briques + architecture orbitale"
          blurb="Les fiches spatiales reprennent la grille Panoplie et lui ajoutent un profil structuré propre au domaine."
        />
        <div className="mt-6 grid gap-px border border-line bg-line md:grid-cols-2">
          {SPACE_ARCHITECTURE_LAYERS.map(([term, detail]) => (
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
        <p className="mt-6 max-w-3xl font-serif text-[1.05rem] leading-[1.75] text-ink/90">
          Les cinq briques Panoplie restent inchangées — coût, finance, supply
          chain, géopolitique, export. Le domaine spatial ajoute une attention
          plus forte à l&apos;orbite, au segment sol, au lanceur et à la
          résilience contre brouillage, cyber et menaces contre-spatiales.
        </p>
      </section>

      <section className="mt-16">
        <SectionMarker
          index="05"
          label="Chaîne spatiale critique"
          blurb="Les dépendances se cachent souvent dans le bus, la charge utile, les composants durcis, le lanceur, le segment sol et le chiffrement."
        />
        <p className="mt-6 max-w-3xl font-serif text-[1.05rem] leading-[1.75] text-ink/90">
          La base industrielle spatiale assemble des objets très différents :
          structure mécanique, propulsion, électronique durcie, capteurs
          optiques ou RF, lanceurs, stations sol et chiffrement souverain. Pour
          Panoplie, un satellite militaire est donc aussi une carte de
          dépendances — pas une fiche technique.
        </p>
        <ol className="mt-6 grid gap-px border border-line bg-line md:grid-cols-2">
          {SPACE_SUPPLY_CHAIN.map((item, i) => (
            <li key={item.link} className="bg-panel p-4">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[10px] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-ink">
                  {item.link}
                </h3>
              </div>
              <p className="mt-2 font-serif text-sm leading-relaxed text-ink-dim">
                {item.suppliers}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16">
        <SectionMarker
          index="06"
          label="Cadre de prudence"
          blurb="Le spatial militaire est l'un des domaines où la frontière entre OSINT responsable et donnée opérationnelle est la plus mince — Panoplie l'inscrit explicitement."
        />
        <div className="mt-6">
          <LegalNote note={LEGAL_NOTE} />
        </div>
      </section>

      <section className="mt-16">
        <SectionMarker
          index="07"
          label="Les dossiers du domaine"
          blurb={`${dossiers.length} satellite${dossiers.length > 1 ? "s" : ""} documenté${dossiers.length > 1 ? "s" : ""} — observation, écoute électromagnétique et télécommunications souveraines au lancement du domaine.`}
        />
        {dossiers.length > 0 ? (
          <div className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2">
            {dossiers.map((s) => (
              <Link
                key={s.slug}
                href={`/systemes/${s.slug}`}
                className="group bg-panel p-5 transition-colors hover:bg-surface"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
                    {s.reference}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                    {s.satelliteClass
                      ? SATELLITE_LABELS[s.satelliteClass]
                      : ""}
                  </span>
                </div>
                <h3 className="mt-3 font-serif text-2xl leading-tight text-ink transition-colors group-hover:text-accent">
                  {s.flag} {s.name}
                </h3>
                <p className="mt-2 font-mono text-[11px] text-ink-faint">
                  {s.country} · {s.manufacturer}
                </p>
                <p className="mt-3 font-serif text-sm leading-relaxed text-ink-dim">
                  {s.tagline}
                </p>
                <span className="mt-4 inline-block font-mono text-[10px] uppercase tracking-[0.16em] text-accent opacity-0 transition-opacity group-hover:opacity-100">
                  Ouvrir →
                </span>
              </Link>
            ))}
          </div>
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
            Les cinq briques Panoplie restent inchangées : coût, finance, supply
            chain, géopolitique et export. Le domaine spatial ajoute une couche
            « architecture orbitale » (orbite, charge utile, segment sol,
            lanceur, résilience) et une vigilance éditoriale plus forte —
            l&apos;OSINT spatial est rarement à un clic de l&apos;information
            opérationnelle.
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
