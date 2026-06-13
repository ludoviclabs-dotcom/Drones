import type {
  ArmoredStructuredProfile,
  ArtilleryStructuredProfile,
  Brick,
  CCAReading,
  EditorialBlocks,
  Indicator,
  NavalStructuredProfile,
  Score,
  SourceRef,
  SpaceStructuredProfile,
} from "@/data/types";
import {
  ARMORED_APS_LABELS,
  ARMORED_FAMILY_LABELS,
  ARMORED_LOADING_LABELS,
  ARMORED_STATUS_LABELS,
  ARTILLERY_ARCHITECTURE_LABELS,
  ARTILLERY_BARREL_LABELS,
  ARTILLERY_CALIBER_LABELS,
  ARTILLERY_CARRIER_LABELS,
  ARTILLERY_INTEROP_LABELS,
  ARTILLERY_LOADING_LABELS,
  BRICK_BLURBS,
  BRICK_LABELS,
  NAVAL_MISSION_LABELS,
  RELIABILITY_LABELS,
  SCORE_LABELS,
  SPACE_MISSION_LABELS,
  SPACE_ORBIT_LABELS,
  SPACE_PAYLOAD_LABELS,
  SOURCE_TYPE_LABELS,
} from "@/data/labels";
import { ORGANISMS_BY_SLUG } from "@/data/organisms";
import { ConfidenceMark, GradeBadge, SectionMarker } from "./primitives";
import { Narrative } from "./narrative";
import { SourceConfidenceBadge } from "./source-confidence-badge";
import { SourceConfidenceDetails } from "./source-confidence-panel";

export function IndicatorPanel({
  indicators,
  title = "Indicateurs",
}: {
  indicators: Indicator[];
  title?: string;
}) {
  return (
    <div className="border border-line bg-surface">
      <div className="border-b border-line px-4 py-2.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
          {title}
        </span>
      </div>
      <div>
        {indicators.map((ind) => (
          <div
            key={ind.label}
            className="border-b border-line px-4 py-3 last:border-0"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-mono text-xs text-ink-dim">{ind.label}</span>
              <ConfidenceMark confidence={ind.confidence} />
            </div>
            <div className="mt-1 font-mono text-sm text-ink">{ind.value}</div>
            {ind.note ? (
              <p className="mt-1.5 font-serif text-xs italic leading-snug text-ink-faint">
                {ind.note}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function OrganismRefs({ slugs }: { slugs: string[] }) {
  const items = slugs
    .map((slug) => ORGANISMS_BY_SLUG[slug])
    .filter(Boolean);
  if (items.length === 0) return null;
  return (
    <div className="mt-3 border border-line bg-surface">
      <div className="border-b border-line px-4 py-2.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
          Cadres &amp; organismes
        </span>
      </div>
      <ul>
        {items.map((org) => (
          <li key={org.slug} className="border-b border-line last:border-0">
            <a
              href={`/glossaire#org-${org.slug}`}
              className="block px-4 py-2.5 transition-colors hover:bg-surface-2"
            >
              <span className="font-mono text-xs text-accent">
                {org.acronym ?? org.name}
              </span>
              <span className="ml-2 font-mono text-[11px] text-ink-faint">
                {org.scope}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BrickSection({
  brick,
  index,
}: {
  brick: Brick;
  index: string;
}) {
  return (
    <section className="border-t border-line pt-8">
      <SectionMarker
        index={index}
        label={BRICK_LABELS[brick.key]}
        blurb={BRICK_BLURBS[brick.key]}
      />
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.55fr_1fr]">
        <Narrative text={brick.narrative} />
        <div>
          <IndicatorPanel indicators={brick.indicators} />
          {brick.organisms && brick.organisms.length > 0 ? (
            <OrganismRefs slugs={brick.organisms} />
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function ScoreGrid({ scores }: { scores: Score[] }) {
  return (
    <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
      {scores.map((score) => (
        <div key={score.key} className="bg-panel p-5">
          <div className="flex items-start justify-between gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-dim">
              {SCORE_LABELS[score.key]}
            </span>
            <GradeBadge grade={score.grade} />
          </div>
          <p className="mt-3 font-serif text-sm leading-relaxed text-ink-dim">
            {score.rationale}
          </p>
        </div>
      ))}
    </div>
  );
}

export function EditorialTriptych({
  editorial,
}: {
  editorial: EditorialBlocks;
}) {
  const blocks = [
    { label: "Mythe vs réalité", text: editorial.mythVsReality },
    { label: "Meilleur emploi", text: editorial.bestUseCase },
    { label: "Point faible", text: editorial.weakPoint },
  ].filter((b) => b.text);
  return (
    <div className="grid gap-px border border-line bg-line md:grid-cols-3">
      {blocks.map((block) => (
        <div key={block.label} className="bg-panel p-5">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
            {block.label}
          </span>
          <p className="mt-3 font-serif text-[0.95rem] leading-relaxed text-ink/90">
            {block.text}
          </p>
        </div>
      ))}
    </div>
  );
}

export function AnalystNote({ note }: { note: string }) {
  return (
    <figure className="border-l-2 border-accent bg-paper px-7 py-6">
      <figcaption className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-paper-dim">
        Note d'analyste
      </figcaption>
      <blockquote className="mt-3 font-serif text-lg italic leading-relaxed text-ink-paper">
        {note}
      </blockquote>
    </figure>
  );
}

// Rubriques de la lecture CCA — ordre d'affichage, leconCCA traitée à part en
// exergue. Co-localisées comme `navalRows`, sans passer par labels.ts.
const CCA_RUBRICS: [keyof Omit<CCAReading, "leconCCA">, string][] = [
  ["natureEconomique", "Nature économique"],
  ["problemeCosting", "Problème de costing"],
  ["inducteursCout", "Inducteurs de coûts"],
  ["modeAcquisition", "Mode d'acquisition"],
  ["risqueBudgetaire", "Risque budgétaire"],
  ["kpiPilotage", "KPI de pilotage"],
];

export function CCAReadingPanel({ reading }: { reading: CCAReading }) {
  return (
    <div>
      <div className="grid gap-px border border-line bg-line sm:grid-cols-2">
        {CCA_RUBRICS.map(([key, label]) => (
          <div key={key} className="bg-panel p-5">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
              {label}
            </span>
            <p className="mt-2 font-serif text-sm leading-relaxed text-ink">
              {reading[key]}
            </p>
          </div>
        ))}
      </div>
      <figure className="mt-4 border-l-2 border-accent bg-paper px-7 py-6">
        <figcaption className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-paper-dim">
          Leçon de gestion
        </figcaption>
        <blockquote className="mt-3 font-serif text-lg italic leading-relaxed text-ink-paper">
          {reading.leconCCA}
        </blockquote>
      </figure>
    </div>
  );
}

export function LegalNote({ note }: { note: string }) {
  return (
    <figure
      className="border-l-2 bg-paper px-7 py-6"
      style={{ borderColor: "var(--color-stamp)" }}
    >
      <figcaption className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-paper-dim">
        Cadre juridique
      </figcaption>
      <p className="mt-3 font-serif text-base leading-relaxed text-ink-paper">
        {note}
      </p>
    </figure>
  );
}

export function SpecsPanel({ specs }: { specs: Indicator[] }) {
  return (
    <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
      {specs.map((spec) => (
        <div key={spec.label} className="bg-panel p-4">
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
              {spec.label}
            </span>
            <ConfidenceMark confidence={spec.confidence} />
          </div>
          <p className="mt-1.5 font-mono text-sm text-ink">{spec.value}</p>
          {spec.note ? (
            <p className="mt-1 font-serif text-xs italic leading-snug text-ink-faint">
              {spec.note}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function joinList(items?: string[]): string | null {
  return items && items.length > 0 ? items.join(" · ") : null;
}

function navalRows(profile: NavalStructuredProfile): [string, string | null][] {
  const platform = profile.platform;
  const combat = profile.combatSystem;
  const sensors = profile.sensors;
  const effectors = profile.effectors;
  const propulsion = profile.propulsion;
  const industrial = profile.industrial;
  const sustainment = profile.sustainment;
  const exportProfile = profile.export;

  const rows: [string, string | null][] = [
    [
      "Mission dominante",
      platform.missions.map((mission) => NAVAL_MISSION_LABELS[mission]).join(" · "),
    ],
    ["Déplacement", platform.displacement ?? null],
    ["Équipage", platform.crew ?? null],
    ["Aviation embarquée", joinList(platform.aviation)],
    ["CMS", combat ? `${combat.cms} · ${combat.family}` : null],
    ["Baseline / réseau", joinList([combat?.baseline, ...(combat?.tacticalLinks ?? [])].filter(Boolean) as string[])],
    [
      "BMD",
      combat?.ballisticMissileDefense === undefined
        ? null
        : combat.ballisticMissileDefense
          ? "Capacité ou intégration BMD affichée publiquement"
          : "Pas de rôle BMD public central",
    ],
    ["Radar principal", sensors?.radarPrimary ?? null],
    [
      "Sonar",
      joinList([sensors?.hullSonar, sensors?.towedSonar].filter(Boolean) as string[]),
    ],
    ["Guerre électronique", joinList(sensors?.esm)],
    [
      "VLS / missiles",
      joinList([
        effectors?.vlsCells,
        effectors?.vlsType,
        joinList(effectors?.sam),
        joinList(effectors?.antiShipMissiles),
      ].filter(Boolean) as string[]),
    ],
    ["ASM / artillerie", joinList([joinList(effectors?.antiSubWeapons), joinList(effectors?.navalGuns), joinList(effectors?.ciws)].filter(Boolean) as string[])],
    [
      "Propulsion",
      propulsion
        ? joinList([
            propulsion.architecture,
            joinList(propulsion.primeMovers),
            propulsion.maxSpeed,
          ].filter(Boolean) as string[])
        : null,
    ],
    ["Maître d'oeuvre", industrial?.primeContractor ?? null],
    ["Chantiers", joinList(industrial?.shipyards)],
    [
      "Sous-systèmes",
      industrial?.suppliers
        ?.map((supplier) => `${supplier.subsystem}: ${supplier.supplier}`)
        .join(" · ") ?? null,
    ],
    ["Coût public", sustainment?.unitCost ?? sustainment?.programCost ?? null],
    ["MCO / soutien", sustainment?.sustainmentNotes ?? null],
    ["Régime export", exportProfile?.regimeSummary ?? null],
    [
      "Exposition ITAR",
      exportProfile?.itarExposure
        ? exportProfile.itarExposure === "elevee"
          ? "élevée"
          : exportProfile.itarExposure
        : null,
    ],
  ];

  return rows.filter(([, value]) => value);
}

export function NavalArchitecturePanel({
  profile,
}: {
  profile: NavalStructuredProfile;
}) {
  return (
    <div className="grid gap-px border border-line bg-line md:grid-cols-2">
      {navalRows(profile).map(([label, value]) => (
        <div key={label} className="bg-panel p-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
            {label}
          </span>
          <p className="mt-1.5 font-serif text-sm leading-relaxed text-ink">
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}

function spaceRows(profile: SpaceStructuredProfile): [string, string | null][] {
  const { missions, orbit, payloads, architecture, resilienceNotes, sovereigntyNotes } =
    profile;

  const rows: [string, string | null][] = [
    [
      "Missions",
      missions.map((mission) => SPACE_MISSION_LABELS[mission]).join(" · "),
    ],
    [
      "Orbite publique",
      orbit.classes.map((orbitClass) => SPACE_ORBIT_LABELS[orbitClass]).join(" · "),
    ],
    ["Altitude", orbit.altitude ?? null],
    ["Inclinaison", orbit.inclination ?? null],
    ["Limite orbitale", orbit.notes ?? null],
    [
      "Charges utiles",
      payloads
        .map((payload) =>
          [
            SPACE_PAYLOAD_LABELS[payload.type],
            payload.name,
            payload.supplier,
          ]
            .filter(Boolean)
            .join(" · "),
        )
        .join(" · "),
    ],
    [
      "Segment spatial",
      joinList(
        [
          architecture.constellationSize,
          architecture.satellitesLaunched,
          architecture.formationFlying ? "Vol en formation public" : null,
        ].filter(Boolean) as string[],
      ),
    ],
    ["Segment sol", joinList(architecture.groundSegment)],
    ["Chaîne de données", architecture.dataChain],
    ["Lancement", joinList(architecture.launchDependency)],
    ["Continuité", architecture.serviceContinuityNotes ?? null],
    ["Résilience", resilienceNotes ?? null],
    ["Souveraineté", sovereigntyNotes ?? null],
  ];

  return rows.filter(([, value]) => value);
}

export function SpaceArchitecturePanel({
  profile,
}: {
  profile: SpaceStructuredProfile;
}) {
  return (
    <div className="grid gap-px border border-line bg-line md:grid-cols-2">
      {spaceRows(profile).map(([label, value]) => (
        <div key={label} className="bg-panel p-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
            {label}
          </span>
          <p className="mt-1.5 font-serif text-sm leading-relaxed text-ink">
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}

function artilleryRows(profile: ArtilleryStructuredProfile): [string, string | null][] {
  const { ammunition, sustainment } = profile;
  const rows: [string, string | null][] = [
    ["Porteur", ARTILLERY_CARRIER_LABELS[profile.carrier]],
    ["Architecture", ARTILLERY_ARCHITECTURE_LABELS[profile.architecture]],
    ["Calibre", ARTILLERY_CALIBER_LABELS[profile.caliber]],
    ["Tube", ARTILLERY_BARREL_LABELS[profile.barrelLength]],
    ["Chargement", ARTILLERY_LOADING_LABELS[profile.loading]],
    ["Interopérabilité", ARTILLERY_INTEROP_LABELS[profile.interopStatus]],
    ["Protection équipage", profile.crewProtection],
    ["FCS / conduite de tir", profile.fcs],
    ["C2 / réseau", profile.c2],
    ["Munitions publiques", joinList(ammunition.families)],
    ["Munitions guidées", joinList(ammunition.guidedFamilies)],
    ["Périmètre source", ammunition.sourcePerimeter],
    ["Avertissement munitions", ammunition.caution ?? null],
    ["Véhicule ravitaillement", sustainment.resupplyVehicle ?? null],
    ["Usure tubes", sustainment.tubeWearNotes ?? null],
    ["Maintenance / MCO", sustainment.maintenanceNotes ?? null],
    ["Production", sustainment.productionNotes ?? null],
    ["Chaîne industrielle", profile.industrialNotes],
    ["Coût public", profile.costNotes ?? null],
    ["Export", profile.exportNotes ?? null],
    ["Garde-fou", profile.safetyBoundary ?? null],
  ];

  return rows.filter(([, value]) => value);
}

export function ArtilleryArchitecturePanel({
  profile,
}: {
  profile: ArtilleryStructuredProfile;
}) {
  return (
    <div className="grid gap-px border border-line bg-line md:grid-cols-2">
      {artilleryRows(profile).map(([label, value]) => (
        <div key={label} className="bg-panel p-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
            {label}
          </span>
          <p className="mt-1.5 font-serif text-sm leading-relaxed text-ink">
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}

function armoredRows(profile: ArmoredStructuredProfile): [string, string | null][] {
  const { armament, protection, mobility, support } = profile;
  const rows: [string, string | null][] = [
    ["Famille", ARMORED_FAMILY_LABELS[profile.family]],
    ["Statut programme", ARMORED_STATUS_LABELS[profile.programStatus]],
    ["Equipage", profile.crew],
    ["Canon principal public", armament.mainGun],
    ["Armement secondaire", joinList(armament.secondary)],
    ["Chargement", ARMORED_LOADING_LABELS[profile.loading]],
    ["Munitions publiques", joinList(armament.ammunitionFamilies)],
    ["Perimetre source", armament.sourcePerimeter],
    ["Avertissement munitions", armament.caution ?? null],
    ["Protection passive", protection.passive],
    ["Protection modulaire", protection.modular ?? null],
    [
      "APS",
      joinList(
        [
          ARMORED_APS_LABELS[protection.apsStatus],
          protection.apsName,
        ].filter(Boolean) as string[],
      ),
    ],
    ["Survivabilite equipage", protection.crewSurvivabilityNotes ?? null],
    ["Powerpack", mobility.powerpack],
    ["Transmission", mobility.transmission ?? null],
    ["Mobilite publique", mobility.mobilityNotes ?? null],
    ["Vetronique", profile.vetronics],
    ["C2 / reseau", profile.c2],
    ["MCO", support.mcoNotes],
    ["Depannage / soutien", support.recoverySupport ?? null],
    ["Modernisation", support.modernizationNotes ?? null],
    ["Production locale", support.localProductionNotes ?? null],
    ["Chaine industrielle", profile.industrialNotes],
    ["Cout public", profile.costNotes ?? null],
    ["Export", profile.exportNotes ?? null],
    ["Garde-fou", profile.safetyBoundary ?? null],
  ];

  return rows.filter(([, value]) => value);
}

export function ArmoredArchitecturePanel({
  profile,
}: {
  profile: ArmoredStructuredProfile;
}) {
  return (
    <div className="grid gap-px border border-line bg-line md:grid-cols-2">
      {armoredRows(profile).map(([label, value]) => (
        <div key={label} className="bg-panel p-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
            {label}
          </span>
          <p className="mt-1.5 font-serif text-sm leading-relaxed text-ink">
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}

export function SourceList({ sources }: { sources: SourceRef[] }) {
  return (
    <ol className="border border-line">
      {sources.map((src, i) => (
        <li
          key={src.id}
          className="flex items-start gap-4 border-b border-line px-4 py-3 last:border-0"
        >
          <span className="font-mono text-xs text-ink-faint">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="flex-1">
            <p className="font-serif text-sm text-ink">{src.title}</p>
            <p className="mt-0.5 font-mono text-[11px] text-ink-faint">
              {src.publisher} · {SOURCE_TYPE_LABELS[src.type]}
              {src.date ? ` · ${src.date}` : ""}
            </p>
            <SourceConfidenceDetails source={src} />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <SourceConfidenceBadge source={src} />
            <span
              className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-dim"
              title={`Fiabilité ${src.reliability} — ${RELIABILITY_LABELS[src.reliability]}`}
            >
              Fiab. {src.reliability}
            </span>
          </div>
          {src.url ? (
            <a
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 font-mono text-xs text-accent transition-colors hover:text-ink"
              aria-label={`Ouvrir la source : ${src.title}`}
            >
              ↗
            </a>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
