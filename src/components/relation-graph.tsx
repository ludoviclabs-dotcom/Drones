import type { NavalStructuredProfile } from "@/data/types";

// Carte relationnelle d'un système naval : plateforme → capteurs → CMS/C2 →
// effecteurs → industriels. Lecture en chaîne (le navire comme nœud d'un
// système de systèmes). Rendu serveur, texte réel et accessible.

interface Lane {
  key: string;
  title: string;
  items: string[];
  anchor?: boolean;
}

function buildLanes(profile: NavalStructuredProfile, name: string): Lane[] {
  const clean = (values: (string | undefined | null)[]): string[] =>
    values.filter((v): v is string => Boolean(v && v.trim()));

  const vls = profile.effectors?.vlsType
    ? [profile.effectors.vlsCells, profile.effectors.vlsType]
        .filter(Boolean)
        .join(" · ")
    : undefined;

  return [
    {
      key: "plateforme",
      title: "Plateforme",
      anchor: true,
      items: clean([
        name,
        profile.platform.displacement,
        profile.propulsion?.architecture,
      ]),
    },
    {
      key: "capteurs",
      title: "Capteurs",
      items: clean([
        profile.sensors?.radarPrimary,
        ...(profile.sensors?.radarSecondary ?? []),
        profile.sensors?.hullSonar,
        profile.sensors?.towedSonar,
        ...(profile.sensors?.esm ?? []),
      ]),
    },
    {
      key: "cms",
      title: "CMS / C2",
      items: clean([
        profile.combatSystem?.cms,
        profile.combatSystem?.baseline,
        ...(profile.combatSystem?.tacticalLinks ?? []),
      ]),
    },
    {
      key: "effecteurs",
      title: "Effecteurs",
      items: clean([
        vls,
        ...(profile.effectors?.sam ?? []),
        ...(profile.effectors?.antiShipMissiles ?? []),
        ...(profile.effectors?.antiSubWeapons ?? []),
        ...(profile.effectors?.navalGuns ?? []),
        ...(profile.effectors?.ciws ?? []),
      ]),
    },
    {
      key: "industriels",
      title: "Industriels",
      items: clean([
        profile.industrial?.primeContractor,
        ...(profile.industrial?.suppliers?.map(
          (s) => `${s.supplier}${s.country ? ` (${s.country})` : ""}`,
        ) ?? []),
      ]),
    },
  ];
}

export function RelationGraph({
  profile,
  name,
}: {
  profile: NavalStructuredProfile;
  name: string;
}) {
  const lanes = buildLanes(profile, name);

  return (
    <div
      role="group"
      aria-label={`Carte relationnelle de ${name} : plateforme, capteurs, CMS/C2, effecteurs, industriels`}
      className="overflow-x-auto"
    >
      <div className="flex min-w-[760px] items-stretch">
        {lanes.map((lane, i) => (
          <div key={lane.key} className="flex flex-1 items-stretch">
            <div
              className={`flex flex-1 flex-col border bg-panel p-3 ${
                lane.anchor ? "border-accent" : "border-line-bright"
              }`}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                {lane.title}
              </span>
              <ul className="mt-2 space-y-1.5">
                {lane.items.length > 0 ? (
                  lane.items.map((item, j) => (
                    <li
                      key={`${lane.key}-${j}`}
                      className="border border-line bg-surface px-2 py-1 font-mono text-[10px] leading-snug text-ink-dim"
                    >
                      {item}
                    </li>
                  ))
                ) : (
                  <li className="font-mono text-[10px] text-ink-faint">
                    Non documenté
                  </li>
                )}
              </ul>
            </div>
            {i < lanes.length - 1 ? (
              <span
                aria-hidden="true"
                className="flex items-center px-1 font-mono text-ink-faint"
              >
                →
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
