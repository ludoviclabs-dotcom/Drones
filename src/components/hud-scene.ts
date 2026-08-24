export type ThemeName = "graphite" | "blueprint";

export type Severity = "nominal" | "watch" | "alert" | "offline";

export type PartShape =
  | "core"
  | "disc"
  | "ring"
  | "shell"
  | "lattice"
  | "boom";

export interface Callout {
  side: "left" | "right";
  text: string;
  detail?: string;
}

export interface CorePart {
  id: string;
  index: number;
  label: string;
  shape: PartShape;
  offset: number;
  scale?: number;
  severity?: Severity;
  callout?: Callout;
  panelRef?: string;
}

export interface CoreObject {
  metaphor: string;
  axis: "vertical" | "diagonal";
  explosion: number;
  parts: CorePart[];
}

interface PanelBase {
  id: string;
  title: string;
  column: "left" | "right";
  severity?: Severity;
  source?: string;
  demo?: boolean;
}

export interface SparklinePanel extends PanelBase {
  kind: "sparkline";
  series: number[];
  unit?: string;
  current?: number;
  band?: [number, number];
}

export interface RadialPanel extends PanelBase {
  kind: "radial";
  value: number;
  label: string;
  thresholds?: [number, number];
}

export interface BarsPanel extends PanelBase {
  kind: "bars";
  bars: { label: string; value: number; severity?: Severity }[];
  unit?: string;
}

export interface ReadoutPanel extends PanelBase {
  kind: "readout";
  rows: { label: string; value: string; severity?: Severity }[];
}

export interface MatrixPanel extends PanelBase {
  kind: "matrix";
  rows: number[][];
  xLabels?: string[];
  yLabels?: string[];
}

export interface LogPanel extends PanelBase {
  kind: "log";
  lines: { t: string; text: string; severity?: Severity }[];
}

export type HudPanel =
  | SparklinePanel
  | RadialPanel
  | BarsPanel
  | ReadoutPanel
  | MatrixPanel
  | LogPanel;

export interface StatusChip {
  label: string;
  value: string;
  severity?: Severity;
}

export interface BomEntry {
  index: number;
  ref: string;
  label: string;
  qty?: string;
}

export interface HudScene {
  id: string;
  title: string;
  subtitle?: string;
  theme: ThemeName;
  status?: StatusChip[];
  core: CoreObject;
  panels: HudPanel[];
  bom?: BomEntry[];
  updatedAt?: string;
}

export function validateScene(scene: HudScene): string[] {
  const errors: string[] = [];
  const partIds = new Set(scene.core.parts.map((part) => part.id));
  const panelIds = new Set(scene.panels.map((panel) => panel.id));

  if (scene.panels.length < 3 || scene.panels.length > 6) {
    errors.push(`panels: ${scene.panels.length} — attendu entre 3 et 6.`);
  }
  if (partIds.size !== scene.core.parts.length) {
    errors.push("core.parts: identifiants dupliqués.");
  }
  for (const part of scene.core.parts) {
    if (part.offset < 0 || part.offset > 1) {
      errors.push(`part ${part.id}: offset hors de [0,1].`);
    }
    if (part.panelRef && !panelIds.has(part.panelRef)) {
      errors.push(`part ${part.id}: panelRef "${part.panelRef}" introuvable.`);
    }
  }
  for (const panel of scene.panels) {
    if (!panel.source && !panel.demo) {
      errors.push(
        `panel ${panel.id}: ni source ni demo — donnée non traçable, rendu refusé.`,
      );
    }
  }
  for (const entry of scene.bom ?? []) {
    if (!scene.core.parts.some((part) => part.index === entry.index)) {
      errors.push(`bom ${entry.index}: aucune pièce ne porte ce numéro.`);
    }
  }
  return errors;
}
