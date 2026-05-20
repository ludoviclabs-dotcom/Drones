import type { DefenseSystem } from "./types";
import { mq9Reaper } from "./systems/mq-9-reaper";
import { bayraktarTb2 } from "./systems/bayraktar-tb2";
import { shahed136 } from "./systems/shahed-136";

export const systems: DefenseSystem[] = [mq9Reaper, bayraktarTb2, shahed136];

export const SYSTEMS_BY_SLUG: Record<string, DefenseSystem> = Object.fromEntries(
  systems.map((s) => [s.slug, s]),
);

export function getSystem(slug: string): DefenseSystem | undefined {
  return SYSTEMS_BY_SLUG[slug];
}

export function getSystemSlugs(): string[] {
  return systems.map((s) => s.slug);
}
