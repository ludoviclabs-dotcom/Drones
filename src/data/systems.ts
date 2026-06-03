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
import { meteor } from "./systems/meteor";
import { aim120Amraam } from "./systems/aim-120-amraam";
import { scalpStormShadow } from "./systems/scalp-storm-shadow";
import { jagm } from "./systems/jagm";
import { prsm } from "./systems/prsm";
import { aster30B1nt } from "./systems/aster-30-b1nt";
import { pac3Mse } from "./systems/pac-3-mse";
import { aargmEr } from "./systems/aargm-er";
import { aim9x } from "./systems/aim-9x";
import { micaNg } from "./systems/mica-ng";
import { nsm } from "./systems/nsm";
import { gmlrs } from "./systems/gmlrs";
import { camm } from "./systems/camm";
import { irisTSlm } from "./systems/iris-t-slm";
import { thaad } from "./systems/thaad";
import { gm200 } from "./systems/gm200";
import { gm400Alpha } from "./systems/gm400-alpha";
import { spy6 } from "./systems/spy-6";
import { anTpy2 } from "./systems/an-tpy-2";
import { ltamds } from "./systems/ltamds";
import { elm2084Mmr } from "./systems/elm-2084-mmr";
import { ecrsMk2 } from "./systems/ecrs-mk2";
import { giraffe4a } from "./systems/giraffe-4a";
import { seaFire } from "./systems/sea-fire";
import { smartLMm } from "./systems/smart-l-mm";
import { rat31dl } from "./systems/rat-31dl";
import { greenPine } from "./systems/green-pine";
import { mfStar } from "./systems/mf-star";
import { anApg81 } from "./systems/an-apg-81";
import { kurfs } from "./systems/kurfs";
import { charlesDeGaulle } from "./systems/charles-de-gaulle";
import { fremmFrance } from "./systems/fremm-france";
import { fdiAmiralRonarch } from "./systems/fdi-amiral-ronarch";
import { gowindCorvette } from "./systems/gowind-corvette";
import { scorpene } from "./systems/scorpene";
import { opv87 } from "./systems/opv-87";
import {
  arleighBurkeFlightIii,
  f110Bonifaz,
  fremmCarloBergamini,
  geraldRFord,
  mistralPha,
  queenElizabethCarrier,
  type26Frigate,
  virginiaBlockV,
} from "./systems/naval-multinational";
import { sachsenF124, f126Niedersachsen, type212cd } from "./systems/naval-germany";
import { mayaClass, izumoKaga, taigeiClass } from "./systems/naval-japan";
import { kdxIiiBatchIi, kssIii, dokdoMarado } from "./systems/naval-korea";
import { fujian, type055, type075 } from "./systems/naval-china";

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
  meteor,
  aim120Amraam,
  scalpStormShadow,
  jagm,
  prsm,
  aster30B1nt,
  pac3Mse,
  aargmEr,
  aim9x,
  micaNg,
  nsm,
  gmlrs,
  camm,
  irisTSlm,
  thaad,
  gm200,
  gm400Alpha,
  spy6,
  anTpy2,
  ltamds,
  elm2084Mmr,
  ecrsMk2,
  giraffe4a,
  seaFire,
  smartLMm,
  rat31dl,
  greenPine,
  mfStar,
  anApg81,
  kurfs,
  charlesDeGaulle,
  fremmFrance,
  fdiAmiralRonarch,
  gowindCorvette,
  scorpene,
  opv87,
  mistralPha,
  geraldRFord,
  arleighBurkeFlightIii,
  virginiaBlockV,
  queenElizabethCarrier,
  type26Frigate,
  fremmCarloBergamini,
  f110Bonifaz,
  // Allemagne
  sachsenF124,
  f126Niedersachsen,
  type212cd,
  // Japon
  mayaClass,
  izumoKaga,
  taigeiClass,
  // Corée du Sud
  kdxIiiBatchIi,
  kssIii,
  dokdoMarado,
  // Chine
  fujian,
  type055,
  type075,
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
