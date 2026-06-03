import type { Metadata } from "next";
import Link from "next/link";
import { systems } from "@/data/systems";
import { RADAR_ROLE_LABELS } from "@/data/labels";
import type { RadarRole } from "@/data/types";
import { IamdArchitecture } from "@/components/iamd-architecture";
import { SectionMarker } from "@/components/primitives";
import { Narrative } from "@/components/narrative";
import { RegistrationMarks } from "@/components/registration-marks";
import { Stamp } from "@/components/stamp";

export const metadata: Metadata = {
  alternates: { canonical: "/radars/architecture" },
  title: "Architecture IAMD",
  description:
    "Le radar dans l'IAMD — capteurs, commandement, effecteurs. Une lecture en réseau, pas en produit isolé.",
};

const SENSOR_ROLE_NOTES: [RadarRole, string][] = [
  [
    "alerte-avancee",
    "Couche supérieure de NATINAMDS. Alimente la connaissance stratégique partagée, sans piloter directement un tir.",
  ],
  [
    "multi-mission",
    "Capteur de batterie. Détecte, suit et fournit l'engagement quality data à l'effecteur GBAD le plus proche.",
  ],
  [
    "naval-mfr",
    "Architecture navale autonome — surveillance + conduite de tir + guidage missile dans le même capteur.",
  ],
  [
    "bmd",
    "Capteur spécialisé balistique — discrimination cible / leurre, alimentation des intercepteurs BMD haute altitude.",
  ],
  [
    "aeroporte-aesa",
    "Capteur de chasse — air-air, SAR, GMTI, EW/EA. Apporte mobilité et furtivité électromagnétique à la chaîne.",
  ],
  [
    "cuas",
    "Couche tactique drones / RAM — résolution fine, intégration intercepteur léger, complément aux GBAD.",
  ],
];

const C2_NOTES: [string, string][] = [
  [
    "NATINAMDS",
    "Cadre OTAN. Fédère les capteurs et effecteurs alliés sous une image aérienne reconnue commune.",
  ],
  [
    "IBCS",
    "C2 IAMD américain — fonde la doctrine AIAMD US Army et structure la prochaine décennie de la défense aérienne alliée Patriot.",
  ],
  [
    "Aegis",
    "C2 naval américain. Indissociable de SPY-6 et des intercepteurs SM-2 / SM-3 / SM-6.",
  ],
  [
    "NASAMS",
    "C2 de batterie norvégien / américain — flexible, hôte de multiples radars et effecteurs (AMRAAM, IRIS-T, Sidewinder).",
  ],
  [
    "SAMP-T",
    "C2 franco-italien — couplage Aster, intégration Eurosam. Cœur de l'autonomie SAM européenne.",
  ],
  [
    "Iron Dome",
    "C2 israélien — couplage Tamir / Stunner, employé contre roquettes, drones et menaces tactiques.",
  ],
];

export default function RadarsArchitecturePage() {
  const radarSystems = systems.filter((s) => s.category === "radar");
  const countByRole = (role: RadarRole) =>
    radarSystems.filter((s) => s.radarRole === role).length;

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-12">
      <header className="reveal">
        <div className="flex flex-wrap items-center gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
            Architecture IAMD
          </p>
          <Stamp tone="ink" rotate={-3}>
            CAPTEUR / C2 / EFFECTEUR
          </Stamp>
        </div>
        <h1 className="mt-4 font-serif text-5xl tracking-tight text-ink sm:text-6xl">
          La place du radar dans l'IAMD
        </h1>
        <p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-ink-dim">
          Un radar n'est jamais une capacité en soi. C'est un nœud d'un graphe
          — capteurs → commandement → effecteurs — dont la valeur réelle ne se
          lit qu'au niveau de l'architecture intégrée. Cette page rend ce
          graphe pédagogiquement lisible.
        </p>
        <p className="mt-4 max-w-2xl border-l-2 border-accent pl-4 font-serif text-base italic leading-relaxed text-ink-dim">
          La grille Panoplie écarte le fétichisme du chiffre de portée. Ce qui
          compte, c'est ce que le capteur voit, qui exploite la piste, avec
          quel délai et pour quel effecteur — donc dans quel réseau.
        </p>
      </header>

      <section className="mt-16">
        <SectionMarker
          index="01"
          label="Le graphe IAMD en une vue"
          blurb="Capteurs en gauche, commandement au centre, effecteurs à droite. Les liens représentent les cohérences doctrinales et techniques documentées."
        />
        <div className="mt-6 border border-line bg-panel p-6 sm:p-8">
          <RegistrationMarks />
          <IamdArchitecture className="w-full text-ink-dim" />
        </div>
        <p className="mt-4 max-w-3xl font-serif text-[0.95rem] leading-relaxed text-ink-dim">
          Ce graphe est délibérément pédagogique. Un capteur isolé peut nourrir
          plusieurs C2 ; chaque C2 désigne ses effecteurs propres ; les
          chaînes complètes — du capteur au tir — résultent d'un alignement
          doctrinal, industriel et politique simultané.
        </p>
      </section>

      <section className="mt-16">
        <SectionMarker
          index="02"
          label="Les six rôles de capteur"
          blurb="Chaque rôle a une mission distincte dans la chaîne. La grille Panoplie isole six familles, alignées sur la doctrine IAMD OTAN / IBCS."
        />
        <div className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2">
          {SENSOR_ROLE_NOTES.map(([role, blurb]) => (
            <div key={role} className="bg-panel p-5">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-mono text-sm uppercase tracking-[0.1em] text-ink">
                  {RADAR_ROLE_LABELS[role]}
                </h3>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                  {countByRole(role)} {countByRole(role) > 1 ? "dossiers" : "dossier"}
                </span>
              </div>
              <p className="mt-2 font-serif text-sm leading-relaxed text-ink-dim">
                {blurb}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <SectionMarker
          index="03"
          label="Les architectures de commandement"
          blurb="Les six C2 dominants documentés dans Panoplie. Adopter un capteur, c'est de fait adopter le ou les C2 auxquels il se connecte."
        />
        <div className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {C2_NOTES.map(([name, blurb]) => (
            <div key={name} className="bg-panel p-5">
              <h3 className="font-mono text-sm uppercase tracking-[0.1em] text-ink">
                {name}
              </h3>
              <p className="mt-2 font-serif text-sm leading-relaxed text-ink-dim">
                {blurb}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <SectionMarker
          index="04"
          label="Trois lectures pour les fiches"
          blurb="Pour chaque radar du catalogue, l'analyse Panoplie passe par les mêmes trois questions doctrinales."
        />
        <Narrative
          className="mt-6 max-w-3xl"
          text={
            "Que voit le capteur — bande, mode, portée publique, capacité multi-mission. Cette première lecture est technique mais limitée par ce qui est dicible publiquement.\n\nÀ quel C2 le capteur est-il connecté — NATINAMDS, IBCS, Aegis, NASAMS, SAMP-T, Iron Dome. Cette lecture conditionne mécaniquement la chaîne politique et industrielle dans laquelle s'inscrit le pays acheteur.\n\nQuels effecteurs reçoivent ses pistes — intercepteurs BMD, SAM longue / moyenne portée, VSHORAD / C-UAS, SEAD / air-air. Cette troisième lecture rend visible le couplage capteur-missile, central pour comprendre l'équation coût-effet réelle."
          }
        />
      </section>

      <section className="mt-16">
        <div className="relative border border-line bg-panel p-8">
          <RegistrationMarks />
          <h2 className="font-serif text-2xl leading-tight text-ink">
            Lire les radars comme un réseau, pas comme un catalogue
          </h2>
          <p className="mt-3 max-w-2xl font-serif text-base leading-relaxed text-ink-dim">
            Les fiches radars du catalogue Panoplie exposent chacune leur
            champ <code className="font-mono text-[0.9em] text-accent">integrationFrameworks</code> :
            la liste des C2 auxquels le capteur est documenté comme
            compatible. C'est l'entrée la plus utile pour passer d'une lecture
            « produit » à une lecture « réseau ».
          </p>
          <nav className="mt-5 flex flex-wrap gap-6">
            <Link
              href="/radars"
              className="font-mono text-xs uppercase tracking-[0.16em] text-accent transition-colors hover:text-ink"
            >
              Retour au domaine radars →
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
