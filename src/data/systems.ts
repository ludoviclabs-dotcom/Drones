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
import { aarok } from "./systems/aarok";
import { eurodrone } from "./systems/eurodrone";
import { switchblade600 } from "./systems/switchblade-600";
import { heronTp } from "./systems/heron-tp";
import { hermes900 } from "./systems/hermes-900";
import { liutyi } from "./systems/liutyi";
import { helmaP } from "./systems/helma-p";
import { ironBeam } from "./systems/iron-beam";
import { dragonfire } from "./systems/dragonfire";
import { deMShorad } from "./systems/de-m-shorad";
import { ifpcHel } from "./systems/ifpc-hel";
import { skyranger30Hel } from "./systems/skyranger-30-hel";
import { laserNavalAllemand } from "./systems/laser-naval-mbda-rheinmetall";
import { helios } from "./systems/helios";

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
  aarok,
  eurodrone,
  switchblade600,
  heronTp,
  hermes900,
  liutyi,
  helmaP,
  ironBeam,
  dragonfire,
  deMShorad,
  ifpcHel,
  skyranger30Hel,
  laserNavalAllemand,
  helios,
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
