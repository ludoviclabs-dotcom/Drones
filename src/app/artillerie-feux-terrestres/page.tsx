import type { Metadata } from "next";
import Link from "next/link";
import { systems } from "@/data/systems";
import {
  ARTILLERY_ARCHITECTURE_LABELS,
  ARTILLERY_CARRIER_BLURBS,
  ARTILLERY_CARRIER_LABELS,
  ARTILLERY_CALIBER_LABELS,
  ARTILLERY_LOADING_LABELS,
} from "@/data/labels";
import type {
  ArtilleryArchitecture,
  ArtilleryCaliber,
  ArtilleryCarrier,
  ArtilleryLoading,
} from "@/data/types";
import { ArtilleryDossierFilter } from "@/components/artillery-dossier-filter";
import { LegalNote } from "@/components/fiche-sections";
import { Narrative } from "@/components/narrative";
import { SectionMarker } from "@/components/primitives";
import { RegistrationMarks } from "@/components/registration-marks";
import { SafetyBoundaryBanner } from "@/components/safety-boundary-banner";
import { Stamp } from "@/components/stamp";

export const metadata: Metadata = {
  alternates: { canonical: "/artillerie-feux-terrestres" },
  title: "Artillerie & feux terrestres",
  description:
    "Domaine Panoplie consacré aux obusiers automoteurs, systèmes 155 mm sur camion, modules téléopérés et systèmes 105 mm mobiles, en OSINT stratégique non opérationnel.",
};

const CARRIER_ORDER: ArtilleryCarrier[] = [
  "tracked-heavy",
  "truck-4x4",
  "truck-6x6",
  "truck-8x8",
  "armored-8x8",
  "light-vehicle",
  "towed",
];

const ARCHITECTURE_ORDER: ArtilleryArchitecture[] = [
  "open-mount",
  "protected-cab",
  "protected-turret",
  "remote-module",
  "light-system",
];

const CALIBER_ORDER: ArtilleryCaliber[] = ["105mm", "122mm", "152mm", "155mm"];
const LOADING_ORDER: ArtilleryLoading[] = [
  "manual",
  "assisted",
  "semi-automatic",
  "automatic",
];

const LEGAL_NOTE =
  "Le domaine Artillerie & feux terrestres reste strictement OSINT stratégique : coût, financement, supply chain, munitions publiques, maintenance, export, souveraineté industrielle et limites de preuve. Aucune table balistique, aucun calcul de tir, aucune coordonnée, aucune procédure de contre-batterie, aucun ciblage et aucune optimisation d'emploi ne sont fournis.";

function countCarrier(carrier: ArtilleryCarrier) {
  return systems.filter((system) => system.artilleryProfile?.carrier === carrier).length;
}

function countArchitecture(architecture: ArtilleryArchitecture) {
  return systems.filter((system) => system.artilleryProfile?.architecture === architecture)
    .length;
}

function countCaliber(caliber: ArtilleryCaliber) {
  return systems.filter((system) => system.artilleryProfile?.caliber === caliber).length;
}

function countLoading(loading: ArtilleryLoading) {
  return systems.filter((system) => system.artilleryProfile?.loading === loading).length;
}

export default function ArtillerieFeuxTerrestresPage() {
  const dossiers = systems.filter((system) => system.category === "artillery");
  const filterableDossiers = dossiers
    .filter((system) => system.artilleryProfile)
    .map((system) => ({
      slug: system.slug,
      reference: system.reference,
      name: system.name,
      flag: system.flag,
      country: system.country,
      classLabel: system.classLabel,
      carrier: system.artilleryProfile!.carrier,
      architecture: system.artilleryProfile!.architecture,
      caliber: system.artilleryProfile!.caliber,
      barrelLength: system.artilleryProfile!.barrelLength,
      loading: system.artilleryProfile!.loading,
    }));

  const activeCarriers = CARRIER_ORDER.filter((carrier) => countCarrier(carrier) > 0);
  const activeArchitectures = ARCHITECTURE_ORDER.filter(
    (architecture) => countArchitecture(architecture) > 0,
  );
  const activeCalibers = CALIBER_ORDER.filter((caliber) => countCaliber(caliber) > 0);
  const activeLoadings = LOADING_ORDER.filter((loading) => countLoading(loading) > 0);

  return (
    <div className="mx-auto max-w-[1000px] px-5 py-12">
      <header>
        <div className="flex flex-wrap items-center gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
            Domaine terrestre
          </p>
          <Stamp tone="ink" rotate={-3}>
            PNP-ART
          </Stamp>
        </div>
        <h1 className="mt-4 font-serif text-5xl tracking-tight text-ink sm:text-6xl">
          Artillerie &amp; feux terrestres
        </h1>
        <p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-ink-dim">
          Obusiers automoteurs, canons sur camion, modules 155 mm, systèmes 105 mm
          mobiles, munitions publiques, tubes, maintenance, supply chain et export.
          Panoplie lit ces systèmes comme des programmes industriels et budgétaires,
          pas comme des outils de conduite de tir.
        </p>
        <p className="mt-4 max-w-2xl border-l-2 border-accent pl-4 font-serif text-base italic leading-relaxed text-ink-dim">
          Ici, une donnée de portée ou de cadence n'est jamais une instruction :
          c'est un claim public, sourcé, daté, dépendant d'un périmètre de munition
          et volontairement séparé de tout emploi tactique.
        </p>
      </header>

      <section className="mt-10">
        <SafetyBoundaryBanner variant="panel" />
      </section>

      <section className="mt-16">
        <SectionMarker
          index="01"
          label="Cinq axes de lecture"
          blurb="Porteur, protection, calibre, automatisation et munitions publiques."
        />
        <div className="mt-6 grid gap-px border border-line bg-line lg:grid-cols-5">
          {[
            ["Porteur", "Chenillé lourd, camion 6x6/8x8, blindé 8x8 ou système léger."],
            ["Protection", "Cabine, tourelle, module téléopéré ou affût ouvert."],
            ["Calibre", "105 mm et 155 mm dans ce MVP, avec mention des tubes publics."],
            ["Automatisation", "Chargement manuel, assisté, semi-automatique ou automatique."],
            ["Munitions", "Familles publiques et prudence sur le périmètre source."],
          ].map(([label, text]) => (
            <div key={label} className="bg-panel p-5">
              <h3 className="font-mono text-sm uppercase tracking-[0.1em] text-ink">
                {label}
              </h3>
              <p className="mt-2 font-serif text-sm leading-relaxed text-ink-dim">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <SectionMarker
          index="02"
          label="Porteurs documentés"
          blurb="La plateforme change le coût, le soutien, l'emport, la protection et l'industrialisation."
        />
        <div className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2">
          {activeCarriers.map((carrier) => (
            <div key={carrier} className="bg-panel p-5">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-mono text-sm uppercase tracking-[0.1em] text-ink">
                  {ARTILLERY_CARRIER_LABELS[carrier]}
                </h3>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                  {countCarrier(carrier)} dossier{countCarrier(carrier) > 1 ? "s" : ""}
                </span>
              </div>
              <p className="mt-2 font-serif text-sm leading-relaxed text-ink-dim">
                {ARTILLERY_CARRIER_BLURBS[carrier]}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-10 lg:grid-cols-[1fr_1fr]">
        <div>
          <SectionMarker
            index="03"
            label="Architectures"
            blurb="Protection et intégration, sans conclusion tactique."
          />
          <ol className="mt-6 grid gap-px border border-line bg-line">
            {activeArchitectures.map((architecture) => (
              <li key={architecture} className="flex items-baseline justify-between gap-4 bg-panel p-4">
                <span className="font-mono text-xs uppercase tracking-[0.12em] text-ink">
                  {ARTILLERY_ARCHITECTURE_LABELS[architecture]}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                  {countArchitecture(architecture)}
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <SectionMarker
            index="04"
            label="Calibres & chargement"
            blurb="Interopérabilité et maintenance plus que performance."
          />
          <div className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2">
            <ol className="grid gap-px bg-line">
              {activeCalibers.map((caliber) => (
                <li key={caliber} className="flex items-baseline justify-between gap-4 bg-panel p-4">
                  <span className="font-mono text-xs uppercase tracking-[0.12em] text-ink">
                    {ARTILLERY_CALIBER_LABELS[caliber]}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                    {countCaliber(caliber)}
                  </span>
                </li>
              ))}
            </ol>
            <ol className="grid gap-px bg-line">
              {activeLoadings.map((loading) => (
                <li key={loading} className="flex items-baseline justify-between gap-4 bg-panel p-4">
                  <span className="font-mono text-xs uppercase tracking-[0.12em] text-ink">
                    {ARTILLERY_LOADING_LABELS[loading]}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                    {countLoading(loading)}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <SectionMarker
          index="05"
          label="Méthode d'analyse"
          blurb="Comparer des programmes, pas des procédures."
        />
        <Narrative
          className="mt-6 max-w-3xl"
          text={
            "Le domaine artillerie impose une discipline stricte : une même désignation peut couvrir un porteur différent, une variante de tube, un lot de munitions, une conduite de tir, un véhicule de ravitaillement, une production locale et un stock initial de pièces. Panoplie sépare donc le système, le package contractuel et le coût de possession.\n\nLes fiches ne publient pas de tables balistiques, de solutions de tir, de coordonnées, de séquences d'emploi, de contre-batterie ou d'optimisation. Les données techniques restent des claims publics reliés à leurs sources et à leurs limites."
          }
        />
      </section>

      <section className="mt-16">
        <SectionMarker
          index="06"
          label="Cadre de prudence"
          blurb="Un domaine utile, mais sensible."
        />
        <div className="mt-6">
          <LegalNote note={LEGAL_NOTE} />
        </div>
      </section>

      <section className="mt-16">
        <SectionMarker
          index="07"
          label="Les dossiers du domaine"
          blurb={`${dossiers.length} systèmes documentés - obusiers chenillés, canons sur camion, modules téléopérés et système 105 mm mobile.`}
        />
        {filterableDossiers.length > 0 ? (
          <ArtilleryDossierFilter dossiers={filterableDossiers} />
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
            Lire le feu comme une chaîne industrielle
          </h2>
          <p className="mt-3 max-w-2xl font-serif text-base leading-relaxed text-ink-dim">
            Les cinq briques restent inchangées : coût, finance, supply chain,
            géopolitique et export. Le domaine ajoute une vigilance plus forte
            sur les stocks 155 mm, les tubes, la maintenance, les véhicules de
            ravitaillement, l'automatisation et les limites des sources constructeur.
          </p>
          <nav className="mt-5 flex flex-wrap gap-6">
            <Link
              href="/console"
              className="font-mono text-xs uppercase tracking-[0.16em] text-accent transition-colors hover:text-ink"
            >
              Voir la console OSINT →
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
