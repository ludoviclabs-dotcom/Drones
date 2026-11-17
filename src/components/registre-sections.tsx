import { Fragment } from "react";
import type {
  IndustrialLink,
  ProgrammeNode,
  SovereigntyProfile,
  Watchpoint,
} from "@/data/types";
import {
  LOCAL_CONTENT_LABELS,
  REGISTRY_NODE_LABELS,
  SOURCE_CODE_ACCESS_LABELS,
  THIRD_PARTY_LOCK_LABELS,
} from "@/data/labels";

// Panneaux issus du registre « Souveraineté industrielle » : souveraineté,
// chaîne de valeur, échéances à surveiller, imbrication parent / enfant.
// Les valeurs sont reprises du registre sans reformulation ; quand le registre
// ne dit rien (`Non_specifie`), on écrit « non documenté » — jamais une
// déduction.

const ROLE_LABELS: Record<string, string> = {
  Maitre_Oeuvre: "Maître d'œuvre",
  "Co-traitant": "Co-traitant",
  "Sous-traitant_Rang_1": "Sous-traitant rang 1",
  Partenaire: "Partenaire",
  Actionnaire: "Actionnaire",
  Client: "Client",
  Motoriste: "Motoriste",
  Coproduction_Etrangere: "Coproduction étrangère",
  Propulseur_Energetique: "Propulseur énergétique",
  Usinage_Forge_Matiere: "Usinage, forge, matière",
};

export function roleLabel(role: string): string {
  return ROLE_LABELS[role] ?? role.replaceAll("_", " ");
}

function Fact({
  label,
  value,
  undocumented,
}: {
  label: string;
  value: string;
  undocumented: boolean;
}) {
  return (
    <div className="bg-panel p-4">
      <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
        {label}
      </dt>
      <dd
        className={`mt-1.5 font-mono text-sm ${
          undocumented ? "italic text-ink-faint" : "text-ink"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

export function SovereigntyPanel({ profile }: { profile: SovereigntyProfile }) {
  return (
    <div
      className="border border-line bg-surface"
      data-registry-entity={profile.entityId}
    >
      {profile.scope ? (
        <p className="border-b border-line px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
          {profile.scope}
        </p>
      ) : null}
      <dl className="grid gap-px bg-line sm:grid-cols-3">
        <Fact
          label="Règle de contenu local"
          value={LOCAL_CONTENT_LABELS[profile.localContentRule]}
          undocumented={profile.localContentRule === "Non_specifie"}
        />
        <Fact
          label="Verrou d'autorisation d'un tiers"
          value={THIRD_PARTY_LOCK_LABELS[profile.thirdPartyLock]}
          undocumented={profile.thirdPartyLock === "Non_specifie"}
        />
        <Fact
          label="Accès au code source et à la PI"
          value={SOURCE_CODE_ACCESS_LABELS[profile.sourceCodeAccess]}
          undocumented={profile.sourceCodeAccess === "Non_specifie"}
        />
      </dl>
      <div className="border-t border-line px-4 py-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
          Goulets d&apos;étranglement
        </p>
        {profile.chokepoints.length > 0 ? (
          <ul className="mt-2 space-y-1.5">
            {profile.chokepoints.map((item) => (
              <li
                key={item}
                className="font-serif text-sm leading-snug text-ink-dim"
              >
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 font-serif text-sm italic text-ink-faint">
            non documenté
          </p>
        )}
      </div>
    </div>
  );
}

/** Regroupe les lignes par entité, dans l'ordre de première apparition. */
function groupByEntity<T extends { entityId: string; entityName?: string }>(
  items: T[],
): { entityId: string; entityName?: string; items: T[] }[] {
  const groups: { entityId: string; entityName?: string; items: T[] }[] = [];
  for (const item of items) {
    let group = groups.find((g) => g.entityId === item.entityId);
    if (!group) {
      group = { entityId: item.entityId, entityName: item.entityName, items: [] };
      groups.push(group);
    }
    group.items.push(item);
  }
  return groups;
}

function EntityHeading({ name }: { name?: string }) {
  if (!name) return null;
  return (
    <li
      aria-hidden="true"
      className="border-b border-line bg-surface-2 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent"
    >
      {name}
    </li>
  );
}

export function IndustrialChainPanel({ links }: { links: IndustrialLink[] }) {
  const groups = groupByEntity(links);
  return (
    <ul className="border border-line bg-surface">
      {groups.map((group) => (
        <Fragment key={group.entityId}>
          {groups.length > 1 ? <EntityHeading name={group.entityName} /> : null}
          {group.items.map((link) => (
            <li
              key={`${link.entityId}|${link.actor}|${link.role}|${link.scope ?? ""}`}
              data-registry-entity={link.entityId}
              className="grid gap-x-4 gap-y-1 border-b border-line px-4 py-3 last:border-0 sm:grid-cols-[minmax(0,1.2fr)_auto_minmax(0,1.6fr)]"
            >
              <span className="font-mono text-sm text-ink">{link.actor}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                {roleLabel(link.role)}
                {link.country ? (
                  <span className="text-ink-faint"> · {link.country}</span>
                ) : null}
              </span>
              <span className="font-serif text-xs leading-snug text-ink-dim">
                {link.scope ?? "périmètre non précisé"}
              </span>
            </li>
          ))}
        </Fragment>
      ))}
    </ul>
  );
}

export function WatchpointsPanel({ items }: { items: Watchpoint[] }) {
  const groups = groupByEntity(items);
  return (
    <ul className="border border-line bg-surface">
      {groups.map((group) => (
        <Fragment key={group.entityId}>
          {groups.length > 1 ? <EntityHeading name={group.entityName} /> : null}
          {group.items.map((item) => (
            <li
              key={`${item.entityId}|${item.horizon}|${item.event}`}
              data-registry-entity={item.entityId}
              className="grid gap-x-4 gap-y-1 border-b border-line px-4 py-3 last:border-0 sm:grid-cols-[8rem_1fr]"
            >
              <span className="font-mono text-xs text-accent">{item.horizon}</span>
              <span className="font-serif text-sm leading-snug text-ink-dim">
                {item.event}
              </span>
            </li>
          ))}
        </Fragment>
      ))}
    </ul>
  );
}

function TreeNode({ node }: { node: ProgrammeNode }) {
  return (
    <li data-registry-entity={node.entityId}>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 py-1.5">
        <span className="font-mono text-sm text-ink">{node.name}</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
          {REGISTRY_NODE_LABELS[node.kind]}
        </span>
        {node.note ? (
          <span className="font-serif text-xs italic text-ink-faint">
            {node.note}
          </span>
        ) : null}
      </div>
      {node.children && node.children.length > 0 ? (
        <ul className="ml-3 border-l border-line-bright pl-4">
          {node.children.map((child) => (
            <TreeNode key={child.entityId} node={child} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function ProgrammeTreePanel({ nodes }: { nodes: ProgrammeNode[] }) {
  return (
    <ul className="border border-line bg-surface px-4 py-2">
      {nodes.map((node) => (
        <TreeNode key={node.entityId} node={node} />
      ))}
    </ul>
  );
}
