import type { DecisionTwinNode } from "@/data/decision-twin/types";
import { CONFIDENCE_META } from "@/data/labels";
import type { ReactNode } from "react";

const RISK_META: Record<
  DecisionTwinNode["risk"],
  { label: string; className: string }
> = {
  low: {
    label: "Risque bas",
    className: "border-grade-a/55 text-grade-a",
  },
  medium: {
    label: "Risque moyen",
    className: "border-grade-c/55 text-grade-c",
  },
  high: {
    label: "Risque haut",
    className: "border-grade-d/55 text-grade-d",
  },
  critical: {
    label: "Risque critique",
    className: "border-grade-e/65 text-grade-e",
  },
};

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="border-b border-line px-4 py-3 last:border-0">
      <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
        {label}
      </dt>
      <dd className="mt-1.5 font-serif text-sm leading-relaxed text-ink-dim">
        {value}
      </dd>
    </div>
  );
}

export function EvidenceDrawer({ node }: { node?: DecisionTwinNode }) {
  if (!node) {
    return (
      <aside className="border border-line bg-panel">
        <div className="border-b border-line px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
            Evidence drawer
          </p>
        </div>
        <div className="p-5 font-serif text-sm leading-relaxed text-ink-dim">
          Selectionnez un hotspot pour lire sa preuve, sa limite et l'action
          suivante.
        </div>
      </aside>
    );
  }

  const risk = RISK_META[node.risk];
  const confidence = CONFIDENCE_META[node.confidence];

  return (
    <aside className="sticky top-5 border border-line bg-panel">
      <div className="border-b border-line px-4 py-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
          Evidence drawer
        </p>
        <h2 className="mt-2 font-serif text-2xl leading-tight text-ink">
          {node.label}
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <span
            className={`border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${risk.className}`}
          >
            {risk.label}
          </span>
          <span className="border border-line-bright px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-dim">
            {confidence.label}
          </span>
        </div>
      </div>
      <dl>
        <Field label="Claim" value={node.claim} />
        <Field label="Preuve" value={node.evidence} />
        <Field
          label="Source"
          value={
            node.sourceUrl ? (
              <a
                href={node.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent transition-colors hover:text-ink"
              >
                {node.sourceLabel ?? node.sourceUrl}
              </a>
            ) : (
              (node.sourceLabel ?? "Aucune URL publique associee")
            )
          }
        />
        <Field label="Limite" value={node.limitation} />
        <Field label="Action suivante" value={node.nextAction} />
      </dl>
    </aside>
  );
}
