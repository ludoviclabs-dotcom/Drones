import type { Metadata } from "next";
import Link from "next/link";
import { systems } from "@/data/systems";
import {
  SPACE_MISSION_BLURBS,
  SPACE_MISSION_LABELS,
  SPACE_ORBIT_LABELS,
  SPACE_PAYLOAD_LABELS,
} from "@/data/labels";
import type {
  SpaceMission,
  SpaceOrbitClass,
  SpacePayloadType,
} from "@/data/types";
import { LegalNote } from "@/components/fiche-sections";
import { Narrative } from "@/components/narrative";
import { SectionMarker } from "@/components/primitives";
import { RegistrationMarks } from "@/components/registration-marks";
import { SafetyBoundaryBanner } from "@/components/safety-boundary-banner";
import { SpaceDossierFilter } from "@/components/space-dossier-filter";
import { Stamp } from "@/components/stamp";

export const metadata: Metadata = {
  alternates: { canonical: "/spatial-militaire" },
  title: "Spatial militaire & satellites",
  description:
    "Domaine Panoplie consacré aux satellites militaires et gouvernementaux : observation, ROEM, SATCOM, PNT, OPIR, SDA/SSA, coûts publics, sources et limites de preuve.",
};

const MISSION_ORDER: SpaceMission[] = [
  "observation",
  "sigint",
  "satcom",
  "pnt",
  "missile-warning",
  "sda-ssa",
  "metoc",
  "maritime-surveillance",
  "data-relay",
];

const ORBIT_ORDER: SpaceOrbitClass[] = [
  "LEO",
  "MEO",
  "GEO",
  "GSO",
  "SSO",
  "polar",
  "HEO",
  "Molniya",
  "multi-orbit",
  "ground-network",
  "unknown",
];

const PAYLOAD_ORDER: SpacePayloadType[] = [
  "optical",
  "infrared",
  "SAR",
  "RF-SIGINT",
  "COMINT",
  "ELINT",
  "SATCOM-X",
  "SATCOM-Ka",
  "SATCOM-EHF",
  "PNT",
  "OPIR",
  "space-surveillance",
  "AIS",
  "hosted-payload",
];

const LEGAL_NOTE =
  "Le domaine spatial de Panoplie reste strictement OSINT stratégique : missions publiques, orbites de classe, charges utiles au niveau descriptif, coût, industrie, export et limites de preuve. Aucune donnée orbitale sensible, aucun TLE temps réel, aucun suivi de passage, aucun ciblage et aucune aide contre-spatiale ne sont fournis.";

function countMission(mission: SpaceMission) {
  return systems.filter((system) => system.spaceProfile?.missions.includes(mission)).length;
}

function countOrbit(orbit: SpaceOrbitClass) {
  return systems.filter((system) => system.spaceProfile?.orbit.classes.includes(orbit)).length;
}

function countPayload(payload: SpacePayloadType) {
  return systems.filter((system) =>
    system.spaceProfile?.payloads.some((item) => item.type === payload),
  ).length;
}

export default function SpatialMilitairePage() {
  const dossiers = systems.filter((system) => system.category === "space");
  const filterableDossiers = dossiers
    .filter((system) => system.spaceProfile)
    .map((system) => ({
      slug: system.slug,
      reference: system.reference,
      name: system.name,
      flag: system.flag,
      country: system.country,
      classLabel: system.classLabel,
      missions: system.spaceProfile!.missions,
      orbits: system.spaceProfile!.orbit.classes,
      payloads: system.spaceProfile!.payloads.map((payload) => payload.type),
    }));

  const activeMissions = MISSION_ORDER.filter((mission) => countMission(mission) > 0);
  const activeOrbits = ORBIT_ORDER.filter((orbit) => countOrbit(orbit) > 0);
  const activePayloads = PAYLOAD_ORDER.filter((payload) => countPayload(payload) > 0);

  return (
    <div className="mx-auto max-w-[1000px] px-5 py-12">
      <header>
        <div className="flex flex-wrap items-center gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
            Domaine transversal
          </p>
          <Stamp tone="ink" rotate={-3}>
            PNP-SP
          </Stamp>
        </div>
        <h1 className="mt-4 font-serif text-5xl tracking-tight text-ink sm:text-6xl">
          Spatial militaire &amp; satellites
        </h1>
        <p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-ink-dim">
          Observation, ROEM, communications sécurisées, PNT, alerte avancée,
          connaissance de situation spatiale et services gouvernementaux. Le
          domaine spatial lit chaque système comme une architecture publique :
          segment spatial, segment sol, chaîne de données, coût, souveraineté,
          export et qualité des sources.
        </p>
        <p className="mt-4 max-w-2xl border-l-2 border-accent pl-4 font-serif text-base italic leading-relaxed text-ink-dim">
          Ici, une orbite n'est jamais une coordonnée exploitable : Panoplie
          conserve la classe publique et retire tout ce qui pourrait permettre
          le suivi opérationnel.
        </p>
      </header>

      <section className="mt-10">
        <SafetyBoundaryBanner variant="panel" />
      </section>

      <section className="mt-16">
        <SectionMarker
          index="01"
          label="Trois axes de lecture"
          blurb="Mission, orbite et charge utile : une taxonomie lisible, sans paramètres sensibles."
        />
        <div className="mt-6 grid gap-px border border-line bg-line lg:grid-cols-3">
          <div className="bg-panel p-5">
            <h3 className="font-mono text-sm uppercase tracking-[0.1em] text-ink">
              Missions
            </h3>
            <p className="mt-2 font-serif text-sm leading-relaxed text-ink-dim">
              Ce que le système produit ou soutient : image, signal, PNT,
              communications, alerte ou situation spatiale.
            </p>
          </div>
          <div className="bg-panel p-5">
            <h3 className="font-mono text-sm uppercase tracking-[0.1em] text-ink">
              Orbites publiques
            </h3>
            <p className="mt-2 font-serif text-sm leading-relaxed text-ink-dim">
              LEO, MEO, GEO, SSO, HEO ou réseau sol. La fiche ne publie jamais
              de TLE, d'éphéméride ou de passage exploitable.
            </p>
          </div>
          <div className="bg-panel p-5">
            <h3 className="font-mono text-sm uppercase tracking-[0.1em] text-ink">
              Charges utiles
            </h3>
            <p className="mt-2 font-serif text-sm leading-relaxed text-ink-dim">
              Optique, SAR, RF-SIGINT, SATCOM, PNT, OPIR ou SSA : uniquement
              au niveau descriptif et sourcé.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <SectionMarker
          index="02"
          label="Missions documentées"
          blurb="La grille vient des usages publics des agences spatiales, ministères et organisations alliées."
        />
        <div className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2">
          {activeMissions.map((mission) => (
            <div key={mission} className="bg-panel p-5">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-mono text-sm uppercase tracking-[0.1em] text-ink">
                  {SPACE_MISSION_LABELS[mission]}
                </h3>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                  {countMission(mission)} dossier{countMission(mission) > 1 ? "s" : ""}
                </span>
              </div>
              <p className="mt-2 font-serif text-sm leading-relaxed text-ink-dim">
                {SPACE_MISSION_BLURBS[mission]}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-10 lg:grid-cols-[1fr_1fr]">
        <div>
          <SectionMarker
            index="03"
            label="Orbites"
            blurb="Classes publiques seulement."
          />
          <ol className="mt-6 grid gap-px border border-line bg-line">
            {activeOrbits.map((orbit) => (
              <li key={orbit} className="flex items-baseline justify-between gap-4 bg-panel p-4">
                <span className="font-mono text-xs uppercase tracking-[0.12em] text-ink">
                  {SPACE_ORBIT_LABELS[orbit]}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                  {countOrbit(orbit)}
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <SectionMarker
            index="04"
            label="Charges utiles"
            blurb="Typologie de payload, pas paramètres exploitables."
          />
          <ol className="mt-6 grid gap-px border border-line bg-line">
            {activePayloads.map((payload) => (
              <li key={payload} className="flex items-baseline justify-between gap-4 bg-panel p-4">
                <span className="font-mono text-xs uppercase tracking-[0.12em] text-ink">
                  {SPACE_PAYLOAD_LABELS[payload]}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                  {countPayload(payload)}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mt-16">
        <SectionMarker
          index="05"
          label="Architecture publique"
          blurb="Le satellite n'est qu'un élément : le sol, les terminaux, le lancement et la gouvernance comptent autant."
        />
        <Narrative
          className="mt-6 max-w-3xl"
          text={
            "Panoplie sépare volontairement la mission du segment spatial. Une capacité spatiale existe par l'ensemble de sa chaîne : satellite, charge utile, lancement, contrôle sol, traitement, terminaux, accès aux données, règles de partage et renouvellement. C'est cette lecture qui permet de comparer CSO, CERES, Syracuse IV, Galileo PRS, AEHF, SBIRS, Skynet 6 ou IRIS² sans basculer dans une logique tactique.\n\nLes fiches privilégient donc le coût public, le périmètre programme, la supply chain, la souveraineté et les limites de preuve. Quand une donnée est trop fine, dynamique ou exploitable, elle n'entre pas dans le modèle."
          }
        />
      </section>

      <section className="mt-16">
        <SectionMarker
          index="06"
          label="Cadre de prudence"
          blurb="Domaine sensible, garde-fou permanent."
        />
        <div className="mt-6">
          <LegalNote note={LEGAL_NOTE} />
        </div>
      </section>

      <section className="mt-16">
        <SectionMarker
          index="07"
          label="Les dossiers du domaine"
          blurb={`${dossiers.length} systèmes documentés - observation, ROEM, SATCOM, PNT, alerte avancée, SDA/SSA et connectivité gouvernementale.`}
        />
        {filterableDossiers.length > 0 ? (
          <SpaceDossierFilter dossiers={filterableDossiers} />
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
            Lire les satellites comme des programmes
          </h2>
          <p className="mt-3 max-w-2xl font-serif text-base leading-relaxed text-ink-dim">
            Les cinq briques Panoplie restent inchangées : coût, finance,
            supply chain, géopolitique et export. Le domaine spatial ajoute une
            attention plus forte aux segments sol, aux services, à la
            souveraineté PNT/SATCOM et à la fraîcheur des sources.
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
