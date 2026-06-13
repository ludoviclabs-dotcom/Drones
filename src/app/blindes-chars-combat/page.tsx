import type { Metadata } from "next";
import Link from "next/link";
import { systems } from "@/data/systems";
import {
  ARMORED_APS_LABELS,
  ARMORED_FAMILY_BLURBS,
  ARMORED_FAMILY_LABELS,
  ARMORED_STATUS_LABELS,
} from "@/data/labels";
import type {
  ArmoredApsStatus,
  ArmoredProgramStatus,
  ArmoredVehicleFamily,
} from "@/data/types";
import { ArmoredDossierFilter } from "@/components/armored-dossier-filter";
import { LegalNote } from "@/components/fiche-sections";
import { Narrative } from "@/components/narrative";
import { SectionMarker } from "@/components/primitives";
import { RegistrationMarks } from "@/components/registration-marks";
import { SafetyBoundaryBanner } from "@/components/safety-boundary-banner";
import { Stamp } from "@/components/stamp";

export const metadata: Metadata = {
  alternates: { canonical: "/blindes-chars-combat" },
  title: "Blindes & chars de combat",
  description:
    "Domaine Panoplie consacre aux chars de bataille, programmes blindes, modernisations, couts, MCO, supply chain, export et limites de preuve en OSINT strategique non operationnel.",
};

const FAMILY_ORDER: ArmoredVehicleFamily[] = [
  "MBT",
  "light-tank",
  "IFV",
  "APC",
  "support-vehicle",
  "program",
];

const STATUS_ORDER: ArmoredProgramStatus[] = [
  "modernized",
  "new-standard",
  "future-program",
  "low-transparency",
];

const APS_ORDER: ArmoredApsStatus[] = [
  "integrated",
  "optional",
  "planned",
  "none-public",
  "unknown",
];

const LEGAL_NOTE =
  "Le domaine Blindes & chars de combat reste strictement OSINT strategique : couts publics, modernisation, MCO, supply chain, munitions publiques, powerpacks, export, souverainete et limites de preuve. Aucune vulnerabilite exploitable, aucun angle d'attaque, aucun ciblage, aucune tactique urbaine, aucune procedure interarmes, aucun calcul balistique et aucune optimisation lethale ne sont fournis.";

function countFamily(family: ArmoredVehicleFamily) {
  return systems.filter((system) => system.armoredProfile?.family === family).length;
}

function countStatus(status: ArmoredProgramStatus) {
  return systems.filter((system) => system.armoredProfile?.programStatus === status)
    .length;
}

function countAps(apsStatus: ArmoredApsStatus) {
  return systems.filter((system) => system.armoredProfile?.protection.apsStatus === apsStatus)
    .length;
}

export default function BlindesCharsCombatPage() {
  const dossiers = systems.filter((system) => system.category === "armored-vehicle");
  const filterableDossiers = dossiers
    .filter((system) => system.armoredProfile)
    .map((system) => ({
      slug: system.slug,
      reference: system.reference,
      name: system.name,
      flag: system.flag,
      country: system.country,
      manufacturer: system.manufacturer,
      classLabel: system.classLabel,
      family: system.armoredProfile!.family,
      programStatus: system.armoredProfile!.programStatus,
      apsStatus: system.armoredProfile!.protection.apsStatus,
      loading: system.armoredProfile!.loading,
    }));

  const activeFamilies = FAMILY_ORDER.filter((family) => countFamily(family) > 0);
  const activeStatuses = STATUS_ORDER.filter((status) => countStatus(status) > 0);
  const activeAps = APS_ORDER.filter((apsStatus) => countAps(apsStatus) > 0);

  return (
    <div className="mx-auto max-w-[1000px] px-5 py-12">
      <header>
        <div className="flex flex-wrap items-center gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
            Domaine terrestre
          </p>
          <Stamp tone="ink" rotate={-3}>
            PNP-ARM
          </Stamp>
        </div>
        <h1 className="mt-4 font-serif text-5xl tracking-tight text-ink sm:text-6xl">
          Blindes &amp; chars de combat
        </h1>
        <p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-ink-dim">
          Chars de bataille, programmes blindes, modernisations, powerpacks,
          protection active, vetronique, couts de possession, MCO, supply chain,
          export et souverainete industrielle. Panoplie lit ces plateformes comme
          des objets politico-industriels, pas comme des modes d'emploi.
        </p>
        <p className="mt-4 max-w-2xl border-l-2 border-accent pl-4 font-serif text-base italic leading-relaxed text-ink-dim">
          Un canon, un APS ou une protection n'est jamais une instruction ici :
          c'est un claim public, source, date et replace dans son perimetre de
          preuve.
        </p>
      </header>

      <section className="mt-10">
        <SafetyBoundaryBanner variant="panel" />
      </section>

      <section className="mt-16">
        <SectionMarker
          index="01"
          label="Six axes de lecture"
          blurb="Famille, statut, protection, powerpack, vetronique, MCO/export."
        />
        <div className="mt-6 grid gap-px border border-line bg-line lg:grid-cols-3">
          {[
            ["Famille", "MBT, char leger, IFV, APC, soutien ou programme futur."],
            ["Statut", "Modernisation, nouveau standard, programme futur ou transparence reduite."],
            ["Protection", "Blindage public, kits modulaires et APS comme cout et integration."],
            ["Powerpack", "Moteur, transmission, pieces, obsolescences et maturite industrielle."],
            ["Vetronique", "Capteurs, electronique, reseaux C2 et integration logicielle."],
            ["MCO / export", "Depannage, stocks, munitions, formation, licences et production locale."],
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
          label="Familles documentees"
          blurb="Le MVP couvre surtout les MBT et programmes proches ; IFV/APC restent taxonomiques pour les prochains lots."
        />
        <div className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2">
          {activeFamilies.map((family) => (
            <div key={family} className="bg-panel p-5">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-mono text-sm uppercase tracking-[0.1em] text-ink">
                  {ARMORED_FAMILY_LABELS[family]}
                </h3>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                  {countFamily(family)} dossier{countFamily(family) > 1 ? "s" : ""}
                </span>
              </div>
              <p className="mt-2 font-serif text-sm leading-relaxed text-ink-dim">
                {ARMORED_FAMILY_BLURBS[family]}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-10 lg:grid-cols-[1fr_1fr]">
        <div>
          <SectionMarker
            index="03"
            label="Statuts programme"
            blurb="Maturite, volume et transparence avant toute comparaison."
          />
          <ol className="mt-6 grid gap-px border border-line bg-line">
            {activeStatuses.map((status) => (
              <li
                key={status}
                className="flex items-baseline justify-between gap-4 bg-panel p-4"
              >
                <span className="font-mono text-xs uppercase tracking-[0.12em] text-ink">
                  {ARMORED_STATUS_LABELS[status]}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                  {countStatus(status)}
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <SectionMarker
            index="04"
            label="Protection active"
            blurb="APS comme sous-systeme industriel, pas comme promesse tactique."
          />
          <ol className="mt-6 grid gap-px border border-line bg-line">
            {activeAps.map((apsStatus) => (
              <li
                key={apsStatus}
                className="flex items-baseline justify-between gap-4 bg-panel p-4"
              >
                <span className="font-mono text-xs uppercase tracking-[0.12em] text-ink">
                  {ARMORED_APS_LABELS[apsStatus]}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                  {countAps(apsStatus)}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mt-16">
        <SectionMarker
          index="05"
          label="Methode d'analyse"
          blurb="Comparer des parcs, des chaines et des packages, pas des engagements."
        />
        <Narrative
          className="mt-6 max-w-3xl"
          text={
            "Un char de combat n'est pas une fiche technique isolee. C'est un parc, un stock de pieces, des munitions, des moyens de depannage, des simulateurs, des ateliers, une chaine de powerpacks, des optiques, des formations, des retrofits et une politique export.\n\nPanoplie separe donc la plateforme seule, le package contractuel, la modernisation, le MCO, les munitions et la production locale. Les donnees sensibles ou exploitables sont exclues : pas de vulnerabilites, pas d'angles d'attaque, pas de ciblage, pas de tactique urbaine, pas de calcul balistique."
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
          blurb={`${dossiers.length} systemes documentes - MBT modernises, nouveaux standards et programmes a transparence reduite.`}
        />
        {filterableDossiers.length > 0 ? (
          <ArmoredDossierFilter dossiers={filterableDossiers} />
        ) : (
          <p className="mt-6 border border-dashed border-line-bright bg-panel/40 px-6 py-12 text-center font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">
            Dossiers en cours de redaction.
          </p>
        )}
      </section>

      <section className="mt-16">
        <div className="relative border border-line bg-panel p-8">
          <RegistrationMarks />
          <h2 className="font-serif text-2xl leading-tight text-ink">
            Lire le char comme une economie de parc
          </h2>
          <p className="mt-3 max-w-2xl font-serif text-base leading-relaxed text-ink-dim">
            Les cinq briques restent intactes : cout, finance, supply chain,
            geopolitique et export. Le domaine blindes ajoute une vigilance sur
            les powerpacks, optiques, APS, munitions 120/125 mm, depannage,
            disponibilite, retrofits, obsolescences et production locale.
          </p>
          <nav className="mt-5 flex flex-wrap gap-6">
            <Link
              href="/console"
              className="font-mono text-xs uppercase tracking-[0.16em] text-accent transition-colors hover:text-ink"
            >
              Voir la console OSINT -&gt;
            </Link>
            <Link
              href="/methodologie"
              className="font-mono text-xs uppercase tracking-[0.16em] text-ink-dim transition-colors hover:text-accent"
            >
              Lire la methodologie
            </Link>
          </nav>
        </div>
      </section>
    </div>
  );
}
