import {
  EXPORT_BRIEFS,
  INDUSTRIAL_GRAPH_PILOT,
  STRATEGIC_PORTFOLIO,
  UPDATE_REVIEW_QUEUE,
  type ExportBrief,
  type IndustrialEdge,
  type IndustrialNode,
  type UpdateCandidate,
} from "@/data/panoplie-workflows";

const NODE_TOKENS: Record<IndustrialNode["kind"], string> = {
  system: "var(--color-accent)",
  company: "var(--color-source)",
  country: "var(--color-nonoperational)",
  program: "var(--color-ai)",
  source: "var(--color-grade-a)",
};

const EDGE_LABELS: Record<IndustrialEdge["relation"], string> = {
  produces: "produit",
  funds: "finance",
  exports: "exporte",
  depends_on: "dépend de",
  documents: "documente",
};

const UPDATE_LABELS: Record<UpdateCandidate["kind"], string> = {
  new_claim: "nouveau claim",
  modified_claim: "claim modifié",
  contradicted_claim: "claim contredit",
  obsolete_claim: "claim obsolète",
};

const UPDATE_TOKENS: Record<UpdateCandidate["kind"], string> = {
  new_claim: "var(--color-source)",
  modified_claim: "var(--color-accent)",
  contradicted_claim: "var(--color-grade-e)",
  obsolete_claim: "var(--color-ink-faint)",
};

function nodesByKind(kind: IndustrialNode["kind"]): IndustrialNode[] {
  return INDUSTRIAL_GRAPH_PILOT.nodes.filter((node) => node.kind === kind);
}

function nodeLabel(id: string): string {
  return INDUSTRIAL_GRAPH_PILOT.nodes.find((node) => node.id === id)?.label ?? id;
}

export function IndustrialGraphPanel() {
  const columns: [IndustrialNode["kind"], string][] = [
    ["system", "Systèmes"],
    ["company", "Industriels"],
    ["country", "Pays / zones"],
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-px border border-line bg-line lg:grid-cols-3">
        {columns.map(([kind, label]) => (
          <section key={kind} className="bg-panel p-5">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
              {label}
            </h3>
            <div className="mt-4 space-y-px border border-line bg-line">
              {nodesByKind(kind).map((node) => (
                <article key={node.id} className="bg-surface p-3">
                  <p
                    className="font-mono text-[11px] uppercase tracking-[0.12em]"
                    style={{ color: NODE_TOKENS[node.kind] }}
                  >
                    {node.label}
                  </p>
                  <p className="mt-1 font-serif text-xs leading-relaxed text-ink-dim">
                    {node.detail}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="overflow-x-auto border border-line">
        <table className="w-full min-w-[760px] border-collapse">
          <thead>
            <tr className="border-b border-line bg-surface-2">
              {["Relation", "Confiance", "Sources"].map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INDUSTRIAL_GRAPH_PILOT.edges.map((edge) => (
              <tr
                key={`${edge.from}-${edge.to}-${edge.relation}`}
                className="border-b border-line last:border-0"
              >
                <td className="px-4 py-3 font-serif text-sm text-ink">
                  {nodeLabel(edge.from)}{" "}
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent">
                    {EDGE_LABELS[edge.relation]}
                  </span>{" "}
                  {nodeLabel(edge.to)}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-ink-dim">
                  {edge.confidence}
                </td>
                <td className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                  {edge.sourceIds.join(" · ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function UpdateReviewQueue({ limit = 12 }: { limit?: number }) {
  return (
    <div className="grid gap-px border border-line bg-line lg:grid-cols-2">
      {UPDATE_REVIEW_QUEUE.slice(0, limit).map((candidate) => (
        <article key={candidate.id} className="bg-panel p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p
                className="font-mono text-[10px] uppercase tracking-[0.14em]"
                style={{ color: UPDATE_TOKENS[candidate.kind] }}
              >
                {UPDATE_LABELS[candidate.kind]}
              </p>
              <h3 className="mt-1 font-serif text-lg leading-tight text-ink">
                {candidate.systemName}
              </h3>
            </div>
            <span className="border border-line-bright px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-dim">
              {candidate.confidence}
            </span>
          </div>
          <p className="mt-3 font-serif text-sm leading-relaxed text-ink-dim">
            {candidate.summary}
          </p>
          <p className="mt-2 font-serif text-xs italic leading-relaxed text-ink-faint">
            Action proposée : {candidate.proposedAction}
          </p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-accent">
            {candidate.sourceLabel}
          </p>
        </article>
      ))}
    </div>
  );
}

export function ExportBriefPanel({
  briefs = EXPORT_BRIEFS,
}: {
  briefs?: ExportBrief[];
}) {
  return (
    <div className="grid gap-px border border-line bg-line lg:grid-cols-2">
      {briefs.map((brief) => (
        <article key={brief.id} className="bg-panel p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
            Brief export non juridique
          </p>
          <h3 className="mt-2 font-serif text-2xl text-ink">{brief.country}</h3>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint">
            {brief.systems.join(" · ")}
          </p>
          <p className="mt-4 font-serif text-sm leading-relaxed text-ink-dim">
            {brief.generalFrame}
          </p>
          <div className="mt-4 grid gap-px border border-line bg-line">
            {[
              ["Restrictions publiques", brief.knownRestrictions],
              ["Dépendances", brief.dependencies],
              ["Incertitudes", brief.uncertainties],
              ["Validation juridique", brief.legalValidation],
            ].map(([label, items]) => (
              <div key={label as string} className="bg-surface p-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                  {label as string}
                </p>
                <p className="mt-1 font-serif text-xs leading-relaxed text-ink-dim">
                  {(items as string[]).join(" · ")}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-accent">
            Sources : {brief.sourceLabels.join(" · ")}
          </p>
        </article>
      ))}
    </div>
  );
}

export function PortfolioComparatorPanel() {
  return (
    <div className="overflow-x-auto border border-line">
      <table className="w-full min-w-[1120px] border-collapse">
        <thead>
          <tr className="border-b border-line bg-surface-2">
            {[
              "Système",
              "Coût",
              "Finance",
              "Supply chain",
              "Export",
              "Maturité",
              "Sources",
              "Note",
            ].map((column) => (
              <th
                key={column}
                scope="col"
                className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {STRATEGIC_PORTFOLIO.map((system) => (
            <tr key={system.systemId} className="border-b border-line align-top last:border-0">
              <td className="px-4 py-3">
                <p className="font-serif text-sm text-ink">{system.name}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                  {system.country} · {system.classLabel}
                </p>
              </td>
              <td className="px-4 py-3 font-serif text-xs leading-relaxed text-ink-dim">
                {system.criteria.cost}
              </td>
              <td className="px-4 py-3 font-serif text-xs leading-relaxed text-ink-dim">
                {system.criteria.finance}
              </td>
              <td className="px-4 py-3 font-serif text-xs leading-relaxed text-ink-dim">
                {system.criteria.supplyChain}
              </td>
              <td className="px-4 py-3 font-serif text-xs leading-relaxed text-ink-dim">
                {system.criteria.export}
              </td>
              <td className="px-4 py-3 font-serif text-xs leading-relaxed text-ink-dim">
                {system.criteria.maturity}
              </td>
              <td className="px-4 py-3 font-serif text-xs leading-relaxed text-ink-dim">
                {system.criteria.sourceConfidence}
              </td>
              <td className="px-4 py-3 font-serif text-xs italic leading-relaxed text-ink-faint">
                {system.notes}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
