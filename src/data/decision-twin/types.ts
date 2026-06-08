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

/**
 * Couverture éditoriale d'un X-Ray.
 * - "edited" : scénario produit par un builder dédié — hotspots, claims,
 *   positions choisis manuellement à partir des briques sourcées du dossier.
 * - "auto"   : scénario produit par `genericNodes()` — 6 hotspots dérivés
 *   automatiquement des briques (1 par couche + 1 node système), sans curation.
 *
 * Affiché à l'utilisateur via un stamp dans le header X-Ray, pour qu'il sache
 * immédiatement s'il consulte une lecture éditoriale ou une agrégation auto.
 */
export type DecisionTwinCoverage = "edited" | "auto";

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
  coverage: DecisionTwinCoverage;
}
