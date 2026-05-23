import type { BrickKey, Confidence } from "@/data/types";

export type DecisionTwinLayer = BrickKey | "sources";

export type DecisionTwinRisk = "low" | "medium" | "high" | "critical";

export type DecisionTwinNodeType =
  | "component"
  | "supplier"
  | "country"
  | "system"
  | "source"
  | "confidence";

export interface DecisionTwinPosition2d {
  x: number;
  y: number;
}

export interface DecisionTwinPosition3d {
  x: number;
  y: number;
  z: number;
}

export interface DecisionTwinNode {
  id: string;
  label: string;
  type: DecisionTwinNodeType;
  layer: DecisionTwinLayer;
  risk: DecisionTwinRisk;
  confidence: Confidence;
  claim: string;
  evidence: string;
  sourceLabel?: string;
  sourceUrl?: string;
  limitation: string;
  nextAction: string;
  position2d: DecisionTwinPosition2d;
  position3d?: DecisionTwinPosition3d;
  metadata?: Record<string, string | number | boolean | null>;
}

export interface DecisionTwinLayerDefinition {
  id: DecisionTwinLayer;
  label: string;
  summary: string;
}

export interface EvidencePack {
  id: string;
  title: string;
  scenarioId: string;
  generatedAt: string;
  summary: string;
  nodes: DecisionTwinNode[];
  limitations: string[];
  recommendedActions: string[];
}

export interface PanoplieXrayScenario {
  id: string;
  systemSlug: string;
  title: string;
  subtitle: string;
  isMock: boolean;
  generatedAt: string;
  layers: DecisionTwinLayerDefinition[];
  nodes: DecisionTwinNode[];
  limitations: string[];
  recommendedActions: string[];
}
