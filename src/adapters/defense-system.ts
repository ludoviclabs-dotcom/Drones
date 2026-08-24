import type { HudScene, ReadoutPanel, Severity } from "@/components/hud-scene";
import type { DefenseSystem, Grade, ScoreKey } from "@/data/types";

const DASH = "—";
const SYSTEMS_SOURCE = "Panoplie — catalogue des systèmes";
const VALID_GRADES = new Set<Grade>(["A", "B", "C", "D", "E"]);

const SCORE_LABELS: Record<ScoreKey, string> = {
  "efficacite-cout": "Efficacité-coût",
  survivabilite: "Survivabilité",
  exportabilite: "Exportabilité",
  "risque-industriel": "Risque industriel",
  maturite: "Maturité",
  "confiance-donnees": "Confiance données",
};

type ReadoutRow = ReadoutPanel["rows"][number];

function textOrDash(value: unknown): { value: string; severity?: Severity } {
  if (typeof value !== "string" || value.trim().length === 0) {
    return { value: DASH, severity: "offline" };
  }
  return { value };
}

function panelSeverity(rows: ReadoutRow[]): Severity {
  return rows.some((row) => row.severity === "offline")
    ? "offline"
    : rows.some((row) => row.severity === "alert")
      ? "alert"
      : rows.some((row) => row.severity === "watch")
        ? "watch"
        : "nominal";
}

function readout(
  id: string,
  title: string,
  column: "left" | "right",
  rows: ReadoutRow[],
): ReadoutPanel {
  return {
    id,
    kind: "readout",
    title,
    column,
    rows,
    severity: panelSeverity(rows),
    source: SYSTEMS_SOURCE,
  };
}

function offlineRow(label: string): ReadoutRow {
  return { label, value: DASH, severity: "offline" };
}

function indicatorRows(input: unknown): ReadoutRow[] {
  if (!Array.isArray(input) || input.length === 0) {
    return [offlineRow("Spécification")];
  }

  return input.slice(0, 4).map((indicator) => {
    if (!indicator || typeof indicator !== "object") {
      return offlineRow("Spécification");
    }

    const record = indicator as { label?: unknown; value?: unknown };
    const label = textOrDash(record.label);
    const value = textOrDash(record.value);

    if (label.severity || value.severity) {
      return offlineRow(label.severity ? "Spécification" : label.value);
    }

    return {
      label: label.value,
      value: value.value,
    };
  });
}

function scoreSeverity(grade: Grade): Severity {
  if (grade === "D" || grade === "E") return "alert";
  if (grade === "C") return "watch";
  return "nominal";
}

function scoreRows(input: unknown): ReadoutRow[] {
  if (!Array.isArray(input) || input.length === 0) {
    return [offlineRow("Score")];
  }

  return input.slice(0, 4).map((score) => {
    if (!score || typeof score !== "object") {
      return offlineRow("Score");
    }

    const record = score as { key?: unknown; grade?: unknown };
    const label =
      typeof record.key === "string" && record.key in SCORE_LABELS
        ? SCORE_LABELS[record.key as ScoreKey]
        : "Score";

    if (typeof record.grade !== "string" || !VALID_GRADES.has(record.grade as Grade)) {
      return offlineRow(label);
    }

    return {
      label,
      value: record.grade,
      severity: scoreSeverity(record.grade as Grade),
    };
  });
}

function sourceRows(input: unknown): ReadoutRow[] {
  if (!Array.isArray(input) || input.length === 0) {
    return [offlineRow("Source")];
  }

  return input.slice(0, 4).map((source) => {
    if (!source || typeof source !== "object") {
      return offlineRow("Source");
    }

    const record = source as { title?: unknown; publisher?: unknown };
    const title = textOrDash(record.title);
    const publisher = textOrDash(record.publisher);

    if (title.severity || publisher.severity) {
      return offlineRow(title.severity ? "Source" : title.value);
    }

    return {
      label: title.value,
      value: publisher.value,
    };
  });
}

/**
 * Source d'entrée : `DefenseSystem` dans `src/data/types.ts`, alimenté par
 * `src/data/systems.ts` (Panoplie — catalogue des systèmes).
 *
 * Correspondance des métriques :
 * - identité du système → `identity`
 * - `keySpecs` → `key-specs`
 * - `scores` → `scores`
 * - `sources` → `source-register`
 */
export function toDefenseSystemScene(input: DefenseSystem): HudScene {
  const system = input as unknown as Partial<DefenseSystem>;
  const name = textOrDash(system.name);
  const classLabel = textOrDash(system.classLabel);
  const country = textOrDash(system.country);
  const status = textOrDash(system.status);
  const updated = textOrDash(system.updated);

  const identityRows: ReadoutRow[] = [
    { label: "Référence", ...textOrDash(system.reference) },
    { label: "Fabricant", ...textOrDash(system.manufacturer) },
    { label: "Pays", ...country },
    { label: "Statut", ...status },
  ];

  return {
    id: typeof system.slug === "string" && system.slug ? `system-${system.slug}` : "system",
    title: name.value.toUpperCase().slice(0, 32),
    subtitle: `${classLabel.value} · ${country.value}`,
    theme: "graphite",
    status: [
      { label: "CLASSE", value: classLabel.value, severity: classLabel.severity },
      { label: "ÉTAT", value: status.value, severity: status.severity },
      { label: "MAJ", value: updated.value, severity: updated.severity },
    ],
    core: {
      metaphor: "cartouche de lecture documentaire à étages",
      axis: "vertical",
      explosion: 0.68,
      parts: [
        {
          id: "identity-part",
          index: 1,
          label: "Identification",
          shape: "disc",
          offset: 0.1,
          scale: 0.72,
          callout: { side: "left", text: "Identification" },
          panelRef: "identity",
        },
        {
          id: "key-specs-part",
          index: 2,
          label: "Spécifications",
          shape: "disc",
          offset: 0.31,
          scale: 0.9,
          callout: { side: "left", text: "Spécifications" },
          panelRef: "key-specs",
        },
        {
          id: "scores-part",
          index: 3,
          label: "Évaluation",
          shape: "core",
          offset: 0.52,
          scale: 1,
          callout: { side: "right", text: "Évaluation" },
          panelRef: "scores",
        },
        {
          id: "sources-part",
          index: 4,
          label: "Registre des sources",
          shape: "ring",
          offset: 0.73,
          scale: 1.06,
          callout: { side: "right", text: "Registre sources" },
          panelRef: "source-register",
        },
        {
          id: "synthesis-part",
          index: 5,
          label: "Restitution",
          shape: "shell",
          offset: 0.93,
          scale: 0.78,
          callout: { side: "left", text: "Restitution" },
        },
      ],
    },
    panels: [
      readout("identity", "Identité", "left", identityRows),
      readout("key-specs", "Spécifications", "left", indicatorRows(system.keySpecs)),
      readout("scores", "Évaluation", "right", scoreRows(system.scores)),
      readout("source-register", "Registre des sources", "right", sourceRows(system.sources)),
    ],
    updatedAt: updated.severity ? undefined : updated.value,
  };
}
