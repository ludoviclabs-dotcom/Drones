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
import { rafale } from "./systems/rafale";
import { mirage2000 } from "./systems/mirage-2000";
import { f22Raptor } from "./systems/f-22-raptor";
import { f35 } from "./systems/f-35";
import { f15ex } from "./systems/f-15ex";
import { superHornet } from "./systems/super-hornet";
import { ea18gGrowler } from "./systems/ea-18g-growler";
import { gripen } from "./systems/gripen";
import { eurofighterTyphoon } from "./systems/eurofighter-typhoon";
import { j20 } from "./systems/j-20";
import { j35 } from "./systems/j-35";
import { kaan } from "./systems/kaan";
import { f47 } from "./systems/f-47";
import { scafFcas } from "./systems/scaf-fcas";
import { gcapTempest } from "./systems/gcap-tempest";

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
  rafale,
  mirage2000,
  f22Raptor,
  f35,
  f15ex,
  superHornet,
  ea18gGrowler,
  gripen,
  eurofighterTyphoon,
  j20,
  j35,
  kaan,
  f47,
  scafFcas,
  gcapTempest,
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
