"use client";

import type {
  EvidencePack,
  PanoplieXrayScenario,
} from "@/data/decision-twin/types";

function buildEvidencePack(scenario: PanoplieXrayScenario): EvidencePack {
  return {
    id: `${scenario.id}-pack`,
    title: `${scenario.title} — Evidence Pack`,
    scenarioId: scenario.id,
    generatedAt: new Date().toISOString(),
    summary: scenario.subtitle,
    nodes: scenario.nodes,
    limitations: scenario.limitations,
    recommendedActions: scenario.recommendedActions,
  };
}

function toMarkdown(pack: EvidencePack): string {
  const nodeSections = pack.nodes
    .map(
      (node) => `## ${node.label}

- Couche: ${node.layer}
- Risque: ${node.risk}
- Confiance: ${node.confidence}
- Claim: ${node.claim}
- Preuve: ${node.evidence}
- Source: ${node.sourceLabel ?? "Non renseignee"}${node.sourceUrl ? ` (${node.sourceUrl})` : ""}
- Limite: ${node.limitation}
- Action suivante: ${node.nextAction}`,
    )
    .join("\n\n");

  return `# ${pack.title}

Genere le ${pack.generatedAt}

${pack.summary}

## Limites

${pack.limitations.map((item) => `- ${item}`).join("\n")}

## Actions recommandees

${pack.recommendedActions.map((item) => `- ${item}`).join("\n")}

${nodeSections}
`;
}

function downloadFile(filename: string, mimeType: string, content: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function ExportEvidencePackButton({
  scenario,
}: {
  scenario: PanoplieXrayScenario;
}) {
  const basename = `panoplie-xray-${scenario.systemSlug}`;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => {
          const pack = buildEvidencePack(scenario);
          downloadFile(
            `${basename}.json`,
            "application/json",
            JSON.stringify(pack, null, 2),
          );
        }}
        className="h-10 border border-accent px-3 font-mono text-[10px] uppercase tracking-[0.14em] text-accent transition-colors hover:bg-accent hover:text-bg"
      >
        Export JSON
      </button>
      <button
        type="button"
        onClick={() => {
          const pack = buildEvidencePack(scenario);
          downloadFile(`${basename}.md`, "text/markdown", toMarkdown(pack));
        }}
        className="h-10 border border-line-bright px-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-dim transition-colors hover:border-accent hover:text-accent"
      >
        Export Markdown
      </button>
    </div>
  );
}
