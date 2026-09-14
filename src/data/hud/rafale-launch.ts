import type { RafaleScenario } from "./rafale";

/**
 * Chronologie illustrative de la séparation et du départ — fonctions pures.
 *
 * Tout est exprimé dans le REPÈRE DE L'AVION (scène Web : +X aile droite, +Y
 * haut, nez vers -Z) et en fonction du temps de chronologie `t` (secondes,
 * t = 0 à l'ordre de séparation). Même `t`, même image : aucune
 * `Math.random`, des graines fixes.
 *
 * Ce n'est PAS un modèle physique. La munition s'éloigne dans l'axe de
 * l'avion avec des accélérations choisies pour la lecture, dans un ralenti
 * assumé (l'écoulement d'air relatif est très inférieur à une vitesse de vol
 * réelle) ; aucune cible, aucune trajectoire guidée, aucun domaine de tir.
 */

export type Vec3 = readonly [number, number, number];

/**
 * Écoulement d'air relatif (m/s) dans le repère de l'avion : la fumée, une
 * fois émise, recule à cette vitesse. Ralenti de lecture, sans valeur réelle.
 */
export const RAFALE_AIRFLOW = 55;

export type RafaleShotKind = "ejection" | "rail" | "drop";

export type RafaleShotProfile = {
  readonly kind: RafaleShotKind;
  /** Allumage du propulseur (s après l'ordre de séparation). */
  readonly ignitionS: number;
  /** Temps figés des états « séparation », « départ » et « fin ». */
  readonly releaseFreezeS: number;
  readonly launchFreezeS: number;
  readonly endS: number;
  /** Durée de combustion fumigène après l'allumage (s). */
  readonly burnS: number;
  /** Phase entretenue (statoréacteur du Meteor) : flamme réduite, sillage léger. */
  readonly sustain: boolean;
  /** Accélération relative illustrative après l'allumage (m/s²). */
  readonly accel: number;
  /** Longueur de la munition (m) : la tuyère est à +longueur/2 sur Z local. */
  readonly length: number;
};

export const RAFALE_SHOTS: Record<RafaleScenario, RafaleShotProfile> = {
  // Meteor : éjection sous le fuselage, allumage une fois dégagé, propulseur
  // d'accélération fumigène puis statoréacteur (sillage léger).
  bvr: {
    kind: "ejection",
    ignitionS: 0.42,
    releaseFreezeS: 0.3,
    launchFreezeS: 1.6,
    endS: 6.4,
    burnS: 2.6,
    sustain: true,
    accel: 42,
    length: 3.65,
  },
  // MICA IR : départ du rail de saumon, moteur allumé sur le rail.
  wvr: {
    kind: "rail",
    ignitionS: 0.02,
    releaseFreezeS: 0.14,
    launchFreezeS: 1.3,
    endS: 5.6,
    burnS: 2.2,
    sustain: false,
    accel: 64,
    length: 3.1,
  },
  // AASM Hammer : largage sous la voilure, puis allumage du propulseur du kit.
  sead: {
    kind: "drop",
    ignitionS: 0.9,
    releaseFreezeS: 0.45,
    launchFreezeS: 2.2,
    endS: 7.4,
    burnS: 2.4,
    sustain: false,
    accel: 24,
    length: 3.1,
  },
};

/** Constantes de lecture des trois modes de séparation. */
export const RAFALE_SEPARATION = {
  /** Éjection : course verticale (m) et constante de temps (s). */
  ejectDrop: 1.7,
  ejectTau: 0.26,
  /** Recul par traînée avant l'allumage (m/s²) — la munition « décroche » un peu. */
  dragDrift: 1.4,
  /** Rail : longueur de rail (m), puis léger décrochement sous l'axe (m). */
  railLength: 1.6,
  railSettle: 0.28,
  /** Largage : vitesse d'éjection (m/s) et pesanteur relative (m/s²). */
  dropEjectSpeed: 2.4,
  gravity: 9.81,
  /** Descente en plané sous propulseur (m/s) et constante d'établissement (s). */
  glideDescent: 3.2,
  glideTau: 0.6,
} as const;

function clamp01(v: number): number {
  if (!Number.isFinite(v)) return 0;
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

export type ShotState = {
  /** Déplacement depuis le point d'emport, repère avion (m). */
  readonly offset: Vec3;
  /** Tangage de la munition (rad, négatif = nez vers le bas). */
  readonly pitch: number;
  /** Intensité de la flamme 0..1. */
  readonly flame: number;
  readonly released: boolean;
  readonly ignited: boolean;
};

export const RESTING_SHOT: ShotState = {
  offset: [0, 0, 0],
  pitch: 0,
  flame: 0,
  released: false,
  ignited: false,
};

/** Déplacement vertical (m, négatif vers le bas) d'une munition éjectée. */
function ejectionDrop(t: number): number {
  const s = RAFALE_SEPARATION;
  return -s.ejectDrop * (1 - Math.exp(-t / s.ejectTau));
}

/** Descente d'une munition larguée, puis mise en plané sous propulseur. */
function dropHeight(t: number, ignition: number): number {
  const s = RAFALE_SEPARATION;
  const before = Math.min(t, ignition);
  const fall = -(s.dropEjectSpeed * before + 0.5 * s.gravity * before * before);
  if (t <= ignition) return fall;
  const tau = t - ignition;
  const vIgn = -(s.dropEjectSpeed + s.gravity * ignition);
  const vGlide = -s.glideDescent;
  return fall + vGlide * tau + (vIgn - vGlide) * s.glideTau * (1 - Math.exp(-tau / s.glideTau));
}

/** Avance le long de l'axe (m, positif vers l'avant) après l'allumage. */
export function forwardTravel(scenario: RafaleScenario, t: number): number {
  const shot = RAFALE_SHOTS[scenario];
  const s = RAFALE_SEPARATION;
  if (!(t > 0)) return 0;
  const ignition = shot.ignitionS;
  // Avant l'allumage : léger recul par traînée (sauf départ sur rail).
  const drift = shot.kind === "rail" ? 0 : -0.5 * s.dragDrift * Math.min(t, ignition) ** 2;
  if (t <= ignition) return drift;
  const tau = t - ignition;
  const vDrift = shot.kind === "rail" ? 0 : -s.dragDrift * ignition;
  return drift + vDrift * tau + 0.5 * shot.accel * tau * tau;
}

/** État de la munition du scénario à l'instant `t` de la chronologie. */
export function shotState(scenario: RafaleScenario, t: number): ShotState {
  if (!(t > 0)) return RESTING_SHOT;
  const shot = RAFALE_SHOTS[scenario];
  const s = RAFALE_SEPARATION;
  const tau = t - shot.ignitionS;
  const ignited = tau >= 0;
  const travel = forwardTravel(scenario, t);
  let dy = 0;
  let pitch = 0;
  if (shot.kind === "ejection") {
    dy = ejectionDrop(t);
    // Léger piqué à l'éjection, qui se résorbe une fois le moteur allumé.
    pitch = -0.07 * (t / (t + 0.18)) * Math.exp(-Math.max(0, tau) / 0.5);
  } else if (shot.kind === "rail") {
    const exit = Math.sqrt((2 * s.railLength) / shot.accel) + shot.ignitionS;
    dy = t > exit ? -s.railSettle * (1 - Math.exp(-(t - exit) / 0.4)) : 0;
  } else {
    dy = dropHeight(t, shot.ignitionS);
    pitch = -0.13 * (1 - Math.exp(-t / 0.5));
  }
  let flame = 0;
  if (ignited) {
    const rise = clamp01(tau / 0.06);
    if (tau <= shot.burnS) flame = rise;
    else if (shot.sustain) flame = 0.42;
    else flame = clamp01(1 - (tau - shot.burnS) / 0.3);
  }
  return { offset: [0, dy, -travel], pitch, flame, released: true, ignited };
}

/**
 * Position de la tuyère (repère avion) : point d'emport + déplacement + demi-
 * longueur vers l'arrière, inclinée par le tangage de la munition.
 */
export function nozzlePoint(scenario: RafaleScenario, rest: Vec3, t: number): Vec3 {
  const state = shotState(scenario, t);
  const half = RAFALE_SHOTS[scenario].length / 2;
  // Rotation autour de X : l'arrière (+Z local) remonte quand le nez pique.
  const cy = -Math.sin(state.pitch) * half;
  const cz = Math.cos(state.pitch) * half;
  return [
    rest[0] + state.offset[0],
    rest[1] + state.offset[1] + cy,
    rest[2] + state.offset[2] + cz,
  ];
}

/** Centre de la munition (repère avion), pour le cadrage. */
export function shotCenter(scenario: RafaleScenario, rest: Vec3, t: number): Vec3 {
  const state = shotState(scenario, t);
  return [rest[0] + state.offset[0], rest[1] + state.offset[1], rest[2] + state.offset[2]];
}

// ---------------------------------------------------------------------------
// Particules de fumée, à graine fixe
// ---------------------------------------------------------------------------

/** Générateur pseudo-aléatoire à graine (mulberry32) : aucune `Math.random`. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Oscillation bornée de la flamme, déterministe. */
export function flameFlicker(t: number, seed = 0): number {
  const a = Math.sin(t * 43.1 + seed * 1.7);
  const b = Math.sin(t * 71.3 + seed * 3.1);
  const c = Math.sin(t * 17.9 + seed * 0.7);
  return 0.95 + 0.06 * a + 0.04 * b + 0.03 * c;
}

export type PuffKind = "puff" | "blast" | "trail" | "sustain";

export type PuffSeed = {
  readonly kind: PuffKind;
  /** Temps d'émission (s) : après l'ordre de séparation pour « puff », après l'allumage sinon. */
  readonly spawn: number;
  readonly dir: Vec3;
  readonly speed: number;
  readonly r0: number;
  readonly r1: number;
  readonly grow: number;
  readonly life: number;
  readonly alpha: number;
  readonly jitter: Vec3;
  readonly shade: number;
};

export const RAFALE_PARTICLE_BUDGET = {
  puff: 14,
  blast: 34,
  trail: 560,
  sustain: 600,
} as const;

function randomUnit(rand: () => number): Vec3 {
  const z = rand() * 2 - 1;
  const a = rand() * Math.PI * 2;
  const r = Math.sqrt(1 - z * z);
  return [r * Math.cos(a), z, r * Math.sin(a)];
}

/** Décalage de graine par scénario : trois sillages distincts. */
const RAFALE_SHOT_SEED_OFFSET: Record<RafaleScenario, number> = { bvr: 0, wvr: 101, sead: 202 };

/** Graines des bouffées d'un scénario. Déterministe pour une graine donnée. */
export function createShotParticles(scenario: RafaleScenario, seed = 2027): readonly PuffSeed[] {
  const shot = RAFALE_SHOTS[scenario];
  const rand = mulberry32(seed + RAFALE_SHOT_SEED_OFFSET[scenario]);
  const budget = RAFALE_PARTICLE_BUDGET;
  const puffs: PuffSeed[] = [];
  const jitter = (): Vec3 => [rand() - 0.5, rand() - 0.5, rand() - 0.5];

  // Bouffée de séparation : gaz d'éjection ou fumée de rail au point d'emport.
  for (let i = 0; i < budget.puff; i += 1) {
    puffs.push({
      kind: "puff",
      spawn: (shot.kind === "rail" ? shot.ignitionS : 0) + 0.12 * (i / budget.puff),
      dir: randomUnit(rand),
      speed: 1.5 + rand() * 2.5,
      r0: 0.18 + rand() * 0.2,
      r1: 0.7 + rand() * 0.8,
      grow: 0.5 + rand() * 0.8,
      life: 1.6 + rand() * 1.4,
      alpha: 0.22 + rand() * 0.18,
      jitter: jitter(),
      shade: rand(),
    });
  }
  // Allumage : boule de fumée chaude autour de la tuyère.
  for (let i = 0; i < budget.blast; i += 1) {
    puffs.push({
      kind: "blast",
      spawn: 0.01 + 0.18 * Math.pow(i / budget.blast, 1.4),
      dir: randomUnit(rand),
      speed: 3 + rand() * 5,
      r0: 0.3 + rand() * 0.35,
      r1: 1.4 + rand() * 1.6,
      grow: 0.4 + rand() * 0.6,
      life: 3.5 + rand() * 2.5,
      alpha: 0.3 + rand() * 0.2,
      jitter: jitter(),
      shade: rand(),
    });
  }
  // Sillage de combustion : émission régulière pendant la combustion.
  for (let i = 0; i < budget.trail; i += 1) {
    const u = (i + 0.5) / budget.trail;
    puffs.push({
      kind: "trail",
      spawn: 0.03 + shot.burnS * u,
      dir: randomUnit(rand),
      speed: 0.4 + rand() * 1.1,
      r0: 0.36 + rand() * 0.24,
      r1: 1.8 + rand() * 1.4,
      grow: 1.3 + rand() * 2.2,
      life: 7 + rand() * 5,
      alpha: (0.46 - 0.12 * u) * (0.8 + rand() * 0.4),
      jitter: jitter(),
      shade: rand(),
    });
  }
  // Phase entretenue (Meteor) : sillage plus clair et plus ténu.
  if (shot.sustain) {
    const span = shot.endS - shot.ignitionS - shot.burnS;
    for (let i = 0; i < budget.sustain; i += 1) {
      const u = (i + 0.5) / budget.sustain;
      puffs.push({
        kind: "sustain",
        spawn: shot.burnS + span * u,
        dir: randomUnit(rand),
        speed: 0.3 + rand() * 0.6,
        r0: 0.22 + rand() * 0.15,
        r1: 1.1 + rand() * 0.7,
        grow: 1.0 + rand() * 1.5,
        life: 4 + rand() * 3,
        alpha: 0.1 + rand() * 0.07,
        jitter: jitter(),
        shade: 0.6 + rand() * 0.4,
      });
    }
  }
  return puffs;
}


export type SmokeSample = {
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly size: number;
  readonly opacity: number;
  /** 0 = fumée froide, 1 = fumée éclairée par la flamme. */
  readonly heat: number;
  readonly shade: number;
};

/**
 * Échantillonne une bouffée à l'instant `t`. Renvoie null si elle n'est pas
 * encore émise ou si elle s'est éteinte. `rest` = point d'emport (centre de la
 * munition au repos, repère avion).
 */
export function samplePuff(
  puff: PuffSeed,
  scenario: RafaleScenario,
  rest: Vec3,
  t: number,
): SmokeSample | null {
  const shot = RAFALE_SHOTS[scenario];
  const born = puff.kind === "puff" ? puff.spawn : shot.ignitionS + puff.spawn;
  const age = t - born;
  if (!(age > 0)) return null;
  // Point d'émission : tuyère pour la combustion, centre de la munition pour
  // la bouffée de séparation.
  const origin =
    puff.kind === "puff" ? shotCenter(scenario, rest, born) : nozzlePoint(scenario, rest, born);
  const k = puff.kind === "trail" || puff.kind === "sustain" ? 1.2 : 2.4;
  const drag = (1 - Math.exp(-k * age)) / k;
  const spread = puff.kind === "trail" ? 0.3 : 0.2;
  // Jet vers l'arrière de la munition, puis la fumée reste dans l'air : elle
  // recule à la vitesse de l'écoulement relatif.
  const back = puff.kind === "blast" || puff.kind === "trail" ? 1.8 : 0;
  const x = origin[0] + puff.dir[0] * puff.speed * drag + puff.jitter[0] * spread;
  const y = origin[1] + puff.dir[1] * puff.speed * drag + puff.jitter[1] * spread + 0.12 * age;
  const z =
    origin[2] +
    (puff.dir[2] * puff.speed + back) * drag +
    puff.jitter[2] * spread +
    RAFALE_AIRFLOW * age;
  const size = puff.r0 + (puff.r1 - puff.r0) * (1 - Math.exp(-age / puff.grow));
  const fadeIn = clamp01(age / 0.08);
  const opacity = puff.alpha * fadeIn * Math.exp(-age / puff.life);
  const heat =
    puff.kind === "puff" ? 0 : clamp01(1 - age / (puff.kind === "blast" ? 0.35 : 0.14));
  return { x, y, z, size, opacity, heat, shade: puff.shade };
}
