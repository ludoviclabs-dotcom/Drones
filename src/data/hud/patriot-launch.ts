import {
  PATRIOT_ASSET_MANIFEST,
  type PatriotFireMode,
} from "./patriot";

/**
 * Chronologie ILLUSTRATIVE de la mise à feu et du départ — pure et
 * déterministe.
 *
 * Tout est fonction d'un temps de chronologie `t` (secondes) et de graines
 * fixes : même `t` ⇒ même image, quel que soit le framerate. Rien ici n'est un
 * modèle physique : les accélérations, durées et panaches sont des choix de
 * lecture visuelle, calés sur aucune donnée réelle. Aucune cible, aucune
 * trajectoire au-delà de l'axe du tube, aucune balistique.
 */

export type Vec3 = readonly [number, number, number];

export type LaunchSlot = "A" | "B";

export const PATRIOT_LAUNCH_SLOTS: readonly LaunchSlot[] = ["A", "B"];

export const PATRIOT_LAUNCH_TIMING = {
  /** Délai visuel entre l'allumage et le premier mouvement (s). */
  ignitionDelayS: 0.04,
  /** Accélération illustrative dans le tube (m/s²). */
  tubeAccel: 60,
  /** Accélération illustrative après la sortie du tube (m/s²). */
  flightAccel: 36,
  /** Dépliage des gouvernes après la sortie du culot (s). */
  finDeployS: 0.33,
  /** Intervalle de la salve « ripple » : choix de lecture, non documenté. */
  rippleIntervalS: 1.25,
  /** Rupture de l'opercule avant après l'allumage (s). */
  frontCoverBreakS: 0.1,
  /** Temps de chronologie figé par l'état « Mise à feu ». */
  fireFreezeS: 0.36,
  /** Temps figé par l'état « Départ » : l'intercepteur A est encore dans le cadre. */
  launchFreezeS: 1.6,
  /** Temps figé par l'état « Fin ». */
  endS: 7.4,
} as const;

/** Distance (m) que le culot parcourt avant de quitter le tube. */
export const TUBE_EXIT_TRAVEL =
  PATRIOT_ASSET_MANIFEST.canisterLength - PATRIOT_ASSET_MANIFEST.missileTailOffset;

/** Allumage du créneau `slot` dans le mode donné (null = pas de tir). */
export function ignitionTime(
  slot: LaunchSlot,
  mode: PatriotFireMode,
): number | null {
  if (slot === "A") return 0;
  return mode === "ripple" ? PATRIOT_LAUNCH_TIMING.rippleIntervalS : null;
}

const TUBE_EXIT_TAU = Math.sqrt(
  (2 * TUBE_EXIT_TRAVEL) / PATRIOT_LAUNCH_TIMING.tubeAccel,
);
const TUBE_EXIT_SPEED = PATRIOT_LAUNCH_TIMING.tubeAccel * TUBE_EXIT_TAU;

/**
 * Avance (m) du culot le long de l'axe du tube, `tau` secondes après
 * l'allumage. Continue, monotone, nulle avant le premier mouvement.
 */
export function missileTravel(tau: number): number {
  const t = tau - PATRIOT_LAUNCH_TIMING.ignitionDelayS;
  if (!Number.isFinite(t) || t <= 0) return 0;
  if (t <= TUBE_EXIT_TAU) return 0.5 * PATRIOT_LAUNCH_TIMING.tubeAccel * t * t;
  const u = t - TUBE_EXIT_TAU;
  return (
    TUBE_EXIT_TRAVEL +
    TUBE_EXIT_SPEED * u +
    0.5 * PATRIOT_LAUNCH_TIMING.flightAccel * u * u
  );
}

/** Inverse de `missileTravel` : instant (après allumage) où l'avance vaut `s`. */
export function tauForTravel(s: number): number {
  const delay = PATRIOT_LAUNCH_TIMING.ignitionDelayS;
  if (s <= 0) return delay;
  if (s <= TUBE_EXIT_TRAVEL) {
    return delay + Math.sqrt((2 * s) / PATRIOT_LAUNCH_TIMING.tubeAccel);
  }
  const a = 0.5 * PATRIOT_LAUNCH_TIMING.flightAccel;
  const b = TUBE_EXIT_SPEED;
  const c = TUBE_EXIT_TRAVEL - s;
  const u = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
  return delay + TUBE_EXIT_TAU + u;
}

/** Instant (après allumage) où le culot quitte le tube. */
export const TUBE_EXIT_TIME = PATRIOT_LAUNCH_TIMING.ignitionDelayS + TUBE_EXIT_TAU;

export type MissileLaunchState = {
  /** Le créneau participe au tir dans ce mode. */
  readonly armed: boolean;
  /** L'allumage a eu lieu. */
  readonly ignited: boolean;
  /** Avance du culot le long de l'axe (m). */
  readonly travel: number;
  /** Avancement 0..1 du dépliage des gouvernes. */
  readonly fins: number;
  /** Intensité 0..1 de la flamme au culot. */
  readonly flame: number;
  readonly rearCoverGone: boolean;
  readonly frontCoverGone: boolean;
};

const INERT: MissileLaunchState = {
  armed: false,
  ignited: false,
  travel: 0,
  fins: 0,
  flame: 0,
  rearCoverGone: false,
  frontCoverGone: false,
};

export function missileLaunchState(
  slot: LaunchSlot,
  mode: PatriotFireMode,
  t: number,
): MissileLaunchState {
  const ignition = ignitionTime(slot, mode);
  if (ignition === null) return INERT;
  const tau = t - ignition;
  if (!(tau >= 0)) return { ...INERT, armed: true };
  const timing = PATRIOT_LAUNCH_TIMING;
  return {
    armed: true,
    ignited: true,
    travel: missileTravel(tau),
    fins: clamp01((tau - TUBE_EXIT_TIME) / timing.finDeployS),
    flame: clamp01(tau / 0.06),
    rearCoverGone: true,
    frontCoverGone: tau >= timing.frontCoverBreakS,
  };
}

/** Intensité 0..1 de l'éclair d'allumage (attaque brève, extinction lente). */
export function ignitionFlash(slot: LaunchSlot, mode: PatriotFireMode, t: number): number {
  const ignition = ignitionTime(slot, mode);
  if (ignition === null) return 0;
  const tau = t - ignition;
  if (tau <= 0) return 0;
  if (tau < 0.05) return tau / 0.05;
  return Math.exp(-(tau - 0.05) / 0.45);
}

/**
 * Scintillement déterministe de la flamme (somme de sinus incommensurables),
 * borné dans [0.82, 1.08]. Pur : fonction du seul temps.
 */
export function flameFlicker(t: number, seed = 0): number {
  const s =
    Math.sin(t * 43.1 + seed * 1.7) * 0.5 +
    Math.sin(t * 71.7 + seed * 2.3) * 0.3 +
    Math.sin(t * 19.3 + seed * 0.9) * 0.2;
  return 0.95 + s * 0.13;
}

// ---------------------------------------------------------------------------
// Géométrie de tir (fournie par la scène) et particules
// ---------------------------------------------------------------------------

/** Repère monde d'un tube de tir, lu sur le modèle une fois le lanceur élevé. */
export type LaunchGeometry = {
  /** Centre de l'extrémité arrière du conteneur (sortie du jet). */
  readonly rear: Vec3;
  /** Centre de l'extrémité avant (sortie de l'intercepteur). */
  readonly front: Vec3;
  /** Axe unitaire du tube, vers l'avant. */
  readonly axis: Vec3;
  /** Culot de l'intercepteur au repos. */
  readonly tail: Vec3;
};

export type LaunchGeometries = Readonly<Record<LaunchSlot, LaunchGeometry>>;

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

type PuffKind = "exhaust" | "muzzle" | "trail";

type PuffSeed = {
  readonly slot: LaunchSlot;
  readonly kind: PuffKind;
  /** Temps d'émission relatif à l'allumage (s). */
  readonly spawn: number;
  /** Avance le long de l'axe au point d'émission (traînée) (m). */
  readonly along: number;
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

type DebrisSeed = {
  readonly slot: LaunchSlot;
  readonly rearBlast: boolean;
  readonly offset: Vec3;
  readonly velocity: Vec3;
  readonly spin: Vec3;
  readonly size: number;
};

export type LaunchParticleSet = {
  readonly puffs: readonly PuffSeed[];
  readonly debris: readonly DebrisSeed[];
};

export const PATRIOT_PARTICLE_BUDGET = {
  exhaust: 120,
  muzzle: 24,
  trail: 420,
  debris: 14,
} as const;

/** Distance maximale (m) le long de l'axe sur laquelle la traînée est émise. */
export const TRAIL_EXTENT = 440;

function randomUnit(rand: () => number): Vec3 {
  const z = rand() * 2 - 1;
  const a = rand() * Math.PI * 2;
  const r = Math.sqrt(1 - z * z);
  return [r * Math.cos(a), z, r * Math.sin(a)];
}

/** Graines des particules, calculées une fois. Déterministe pour une graine donnée. */
export function createLaunchParticleSet(seed = 1776): LaunchParticleSet {
  const rand = mulberry32(seed);
  const puffs: PuffSeed[] = [];
  const debris: DebrisSeed[] = [];
  const budget = PATRIOT_PARTICLE_BUDGET;

  for (const slot of PATRIOT_LAUNCH_SLOTS) {
    // Nuage d'échappement : le jet sort par l'arrière du tube, frappe le sol
    // et s'étale. Émission dense au début, qui se prolonge le temps que
    // l'intercepteur quitte le tube.
    for (let i = 0; i < budget.exhaust; i += 1) {
      const u = i / budget.exhaust;
      // Les premières bouffées forment la boule de feu : rapides, elles
      // gonflent en quelques dixièmes de seconde.
      const blast = u < 0.35;
      puffs.push({
        slot,
        kind: "exhaust",
        spawn: 0.012 + 1.3 * Math.pow(u, 1.7),
        along: 0,
        dir: randomUnit(rand),
        speed: (blast ? 14 : 9) + rand() * 16,
        r0: 0.5 + rand() * 0.6,
        r1: 2.6 + rand() * 4.4,
        grow: blast ? 0.35 + rand() * 0.55 : 1.2 + rand() * 2.2,
        life: 15 + rand() * 9,
        alpha: 0.3 + rand() * 0.22,
        jitter: [rand() - 0.5, rand() - 0.5, rand() - 0.5],
        shade: rand(),
      });
    }
    for (let i = 0; i < budget.muzzle; i += 1) {
      puffs.push({
        slot,
        kind: "muzzle",
        spawn: 0.08 + 0.5 * (i / budget.muzzle),
        along: 0,
        dir: randomUnit(rand),
        speed: 4 + rand() * 8,
        r0: 0.3 + rand() * 0.3,
        r1: 1.4 + rand() * 1.5,
        grow: 1.0 + rand() * 1.4,
        life: 9 + rand() * 5,
        alpha: 0.3 + rand() * 0.2,
        jitter: [rand() - 0.5, rand() - 0.5, rand() - 0.5],
        shade: rand(),
      });
    }
    // Traînée : dense à la sortie du tube, plus espacée et plus large en
    // s'éloignant (les bouffées lointaines sont aussi les plus anciennes).
    for (let i = 0; i < budget.trail; i += 1) {
      const u = (i + 0.5) / budget.trail;
      const along = TUBE_EXIT_TRAVEL + 0.6 + TRAIL_EXTENT * Math.pow(u, 1.5);
      puffs.push({
        slot,
        kind: "trail",
        spawn: tauForTravel(along),
        along,
        dir: randomUnit(rand),
        speed: 0.5 + rand() * 1.2,
        // Rayon initial supérieur à l'espacement : la traînée jeune est
        // déjà continue derrière l'intercepteur.
        r0: 0.5 + along * 0.004,
        r1: 1.2 + along * 0.011 + rand() * 0.7,
        grow: 1.5 + rand() * 2.5,
        life: 20 + rand() * 10,
        alpha: (0.5 - 0.22 * u) * (0.8 + rand() * 0.4),
        jitter: [rand() - 0.5, rand() - 0.5, rand() - 0.5],
        shade: rand(),
      });
    }
    for (let i = 0; i < budget.debris; i += 1) {
      const rearBlast = i < 5;
      debris.push({
        slot,
        rearBlast,
        offset: [(rand() - 0.5) * 0.4, (rand() - 0.5) * 0.5, 0],
        velocity: [
          (rand() - 0.5) * 7,
          (rand() - 0.5) * 5,
          rearBlast ? 6 + rand() * 6 : 9 + rand() * 12,
        ],
        spin: [(rand() - 0.5) * 18, (rand() - 0.5) * 18, (rand() - 0.5) * 18],
        size: 0.12 + rand() * 0.14,
      });
    }
  }
  return { puffs, debris };
}

/** Vent illustratif constant (m/s), sans prétention météorologique. */
export const PATRIOT_WIND: Vec3 = [1.1, 0, 0.35];

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

function clamp01(v: number): number {
  if (!Number.isFinite(v)) return 0;
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function norm(v: Vec3): Vec3 {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
}

/** Base orthonormée (u, w) perpendiculaire à l'axe, stable. */
function sideBasis(axis: Vec3): [Vec3, Vec3] {
  const up: Vec3 = Math.abs(axis[1]) < 0.95 ? [0, 1, 0] : [1, 0, 0];
  const u = norm([
    up[1] * axis[2] - up[2] * axis[1],
    up[2] * axis[0] - up[0] * axis[2],
    up[0] * axis[1] - up[1] * axis[0],
  ]);
  const w = norm([
    axis[1] * u[2] - axis[2] * u[1],
    axis[2] * u[0] - axis[0] * u[2],
    axis[0] * u[1] - axis[1] * u[0],
  ]);
  return [u, w];
}

const GROUND_Y = 0;

/**
 * Échantillonne une bouffée à l'instant `t`. Renvoie null si elle n'est pas
 * encore émise, si son créneau ne tire pas, ou si elle s'est éteinte.
 */
export function samplePuff(
  puff: PuffSeed,
  geom: LaunchGeometry,
  mode: PatriotFireMode,
  t: number,
): SmokeSample | null {
  const ignition = ignitionTime(puff.slot, mode);
  if (ignition === null) return null;
  const age = t - ignition - puff.spawn;
  if (!(age > 0)) return null;
  const k = puff.kind === "trail" ? 0.9 : 2.2;
  const drag = (1 - Math.exp(-k * age)) / k;
  const axis = geom.axis;
  const [u, w] = sideBasis(axis);

  let origin: Vec3;
  let dir: Vec3;
  if (puff.kind === "exhaust") {
    // Jet vers l'arrière du tube (donc vers le sol), cône d'ouverture large.
    origin = geom.rear;
    dir = norm([
      -axis[0] + puff.dir[0] * 0.95,
      -axis[1] + puff.dir[1] * 0.95,
      -axis[2] + puff.dir[2] * 0.95,
    ]);
  } else if (puff.kind === "muzzle") {
    origin = geom.front;
    dir = norm([
      axis[0] * 0.6 + puff.dir[0],
      axis[1] * 0.6 + puff.dir[1],
      axis[2] * 0.6 + puff.dir[2],
    ]);
  } else {
    origin = [
      geom.tail[0] + axis[0] * puff.along,
      geom.tail[1] + axis[1] * puff.along,
      geom.tail[2] + axis[2] * puff.along,
    ];
    dir = puff.dir;
  }

  const jitter = puff.kind === "trail" ? 0.35 : 0.25;
  let x = origin[0] + dir[0] * puff.speed * drag + (u[0] * puff.jitter[0] + w[0] * puff.jitter[1]) * jitter;
  let y = origin[1] + dir[1] * puff.speed * drag + (u[1] * puff.jitter[0] + w[1] * puff.jitter[1]) * jitter;
  let z = origin[2] + dir[2] * puff.speed * drag + (u[2] * puff.jitter[0] + w[2] * puff.jitter[1]) * jitter;

  // Dérive lente et ascendance de la fumée tiède.
  const rise = puff.kind === "trail" ? 0.25 : 0.55;
  x += PATRIOT_WIND[0] * age;
  z += PATRIOT_WIND[2] * age;
  y += rise * age;

  const size = puff.r0 + (puff.r1 - puff.r0) * (1 - Math.exp(-age / puff.grow));

  // Le jet qui frappe le sol s'étale horizontalement au lieu de s'enfoncer.
  // Plancher proche du rayon : le billboard ne coupe presque pas le sol.
  const floor = GROUND_Y + size * 0.8;
  if (y < floor) {
    const excess = floor - y;
    const hx = x - origin[0];
    const hz = z - origin[2];
    const hl = Math.hypot(hx, hz) || 1;
    x += (hx / hl) * excess * 0.9;
    z += (hz / hl) * excess * 0.9;
    y = floor;
  }

  const fadeIn = clamp01(age / (puff.kind === "trail" ? 0.2 : 0.1));
  const opacity = puff.alpha * fadeIn * Math.exp(-age / puff.life);
  const heat =
    puff.kind === "trail"
      ? clamp01(1 - age / 0.18)
      : clamp01(1 - age / (puff.kind === "exhaust" ? 0.45 : 0.25));

  return { x, y, z, size, opacity, heat, shade: puff.shade };
}

export type DebrisSample = {
  readonly visible: boolean;
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly rx: number;
  readonly ry: number;
  readonly rz: number;
  readonly size: number;
};

const HIDDEN_DEBRIS: DebrisSample = {
  visible: false,
  x: 0,
  y: 0,
  z: 0,
  rx: 0,
  ry: 0,
  rz: 0,
  size: 0,
};

/** Éclat d'opercule : trajectoire parabolique ILLUSTRATIVE, courte. */
export function sampleDebris(
  debris: DebrisSeed,
  geom: LaunchGeometry,
  mode: PatriotFireMode,
  t: number,
): DebrisSample {
  const ignition = ignitionTime(debris.slot, mode);
  if (ignition === null) return HIDDEN_DEBRIS;
  const start = debris.rearBlast ? 0 : PATRIOT_LAUNCH_TIMING.frontCoverBreakS;
  const age = t - ignition - start;
  if (!(age > 0) || age > 2.6) return HIDDEN_DEBRIS;
  const axis = geom.axis;
  const [u, w] = sideBasis(axis);
  const along = debris.rearBlast ? -1 : 1;
  const origin = debris.rearBlast ? geom.rear : geom.front;
  const v = debris.velocity;
  const vx = u[0] * v[0] + w[0] * v[1] + axis[0] * v[2] * along;
  const vy = u[1] * v[0] + w[1] * v[1] + axis[1] * v[2] * along;
  const vz = u[2] * v[0] + w[2] * v[1] + axis[2] * v[2] * along;
  const ox = origin[0] + u[0] * debris.offset[0] + w[0] * debris.offset[1];
  const oy = origin[1] + u[1] * debris.offset[0] + w[1] * debris.offset[1];
  const oz = origin[2] + u[2] * debris.offset[0] + w[2] * debris.offset[1];
  const y = oy + vy * age - 4.9 * age * age;
  if (y < GROUND_Y) return HIDDEN_DEBRIS;
  return {
    visible: true,
    x: ox + vx * age,
    y,
    z: oz + vz * age,
    rx: debris.spin[0] * age,
    ry: debris.spin[1] * age,
    rz: debris.spin[2] * age,
    size: debris.size,
  };
}

/**
 * Point monde du culot d'un intercepteur à l'instant `t` (null s'il ne tire
 * pas). Sert au cadrage et à l'ancrage de la flamme.
 */
export function missileTailPoint(
  slot: LaunchSlot,
  geom: LaunchGeometry,
  mode: PatriotFireMode,
  t: number,
): Vec3 | null {
  const state = missileLaunchState(slot, mode, t);
  if (!state.armed) return null;
  const s = state.travel;
  return [
    geom.tail[0] + geom.axis[0] * s,
    geom.tail[1] + geom.axis[1] * s,
    geom.tail[2] + geom.axis[2] * s,
  ];
}
