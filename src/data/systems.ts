import type { DefenseSystem } from "./types";
import { mq9Reaper } from "./systems/mq-9-reaper";
import { bayraktarTb2 } from "./systems/bayraktar-tb2";
import { shahed136 } from "./systems/shahed-136";
import { neuron } from "./systems/neuron";
import { rq4GlobalHawk } from "./systems/rq-4-global-hawk";
import { mq25Stingray } from "./systems/mq-25-stingray";
import { wingLoong2 } from "./systems/wing-loong-2";
import { maguraV5 } from "./systems/magura-v5";
import { harop } from "./systems/harop";

export const systems: DefenseSystem[] = [
  mq9Reaper,
  bayraktarTb2,
  shahed136,
  neuron,
  rq4GlobalHawk,
  mq25Stingray,
  wingLoong2,
  maguraV5,
  harop,
];

export const SYSTEMS_BY_SLUG: Record<string, DefenseSystem> = Object.fromEntries(
  systems.map((s) => [s.slug, s]),
);

export function getSystem(slug: string): DefenseSystem | undefined {
  return SYSTEMS_BY_SLUG[slug];
}

export function getSystemSlugs(): string[] {
  return systems.map((s) => s.slug);
}
