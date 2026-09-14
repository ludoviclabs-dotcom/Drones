import {
  RAFALE_SCENARIOS,
  RAFALE_SEQUENCE_STATES,
  type RafaleScenario,
  type RafaleSequenceState,
} from "./rafale";
import { RAFALE_SHOTS } from "./rafale-launch";

/**
 * Logique de mouvement de la planche Rafale — pure et déterministe.
 *
 * Même contrat que les planches Thundart et Patriot : NO STATE CHANGE = NO
 * MOTION. Un plan n'existe que si l'état change ; il se termine sur une pose
 * exacte ; aucune `Math.random`, aucune dépendance au framerate. Quatre canaux :
 *
 * - `camera`  : cadrage (position + cible) dans le REPÈRE DE L'AVION ;
 * - `bank`    : inclinaison de l'avion (degrés, positif = aile droite basse) ;
 * - `sensors` : présence 0..1 des secteurs symboliques des capteurs ;
 * - `launch`  : temps de la chronologie illustrative de tir (secondes).
 *
 * En marche arrière, la chronologie de tir revient d'un coup (on ne
 * « rembobine » pas un départ), puis l'avion revient à plat.
 */

export type Vec3 = readonly [number, number, number];

export type RafaleCameraPose = {
  readonly position: Vec3;
  readonly target: Vec3;
};

export type RafaleMotionPose = {
  readonly camera: RafaleCameraPose;
  readonly bank: number;
  readonly sensors: number;
  readonly launch: number;
};

export type RafaleMotionChannel = "camera" | "bank" | "sensors" | "launch";

export type RafaleMotionSegment = {
  readonly channel: RafaleMotionChannel;
  readonly startMs: number;
  readonly durationMs: number;
  readonly from: number;
  readonly to: number;
};

export type RafaleMotionPlan = {
  readonly scenario: RafaleScenario;
  readonly from: RafaleMotionPose;
  readonly to: RafaleMotionPose;
  readonly totalMs: number;
  readonly segments: readonly RafaleMotionSegment[];
  /** Vrai si la caméra suit la munition pendant le départ. */
  readonly trackLaunch: boolean;
};

export type RafaleMotionSample = {
  readonly camera: RafaleCameraPose;
  readonly bank: number;
  readonly sensors: number;
  readonly launch: number;
  /** Poids 0..1 du suivi de la munition par la cible caméra. */
  readonly track: number;
  readonly done: boolean;
};

export const RAFALE_MOTION_TIMING = {
  cameraMs: 1000,
  bankMs: 1300,
  bankRewindMs: 900,
  sensorsInMs: 700,
  sensorsInLeadMs: 350,
  sensorsOutMs: 400,
  /** Temps d'« armement » avant l'ordre de séparation. */
  armingMs: 260,
} as const;

/**
 * Horloge de tir par paliers : la séparation est montrée au ralenti (×0,35),
 * l'allumage et le départ à ×0,6, la suite en temps réel.
 */
export function launchClock(scenario: RafaleScenario): readonly (readonly [number, number, number])[] {
  const shot = RAFALE_SHOTS[scenario];
  return [
    [0, shot.releaseFreezeS, 0.35],
    [shot.releaseFreezeS, shot.launchFreezeS, 0.6],
    [shot.launchFreezeS, Number.POSITIVE_INFINITY, 1],
  ];
}

/**
 * Cadrages par état, dans le repère de l'avion (Y vers le haut, nez vers -Z).
 * Vue d'ensemble trois-quarts avant, inspection rapprochée, vue arrière
 * haute pour les capteurs, gros plan du point d'emport pour la séparation,
 * plan arrière qui accompagne le départ, plan large final.
 */
const SHARED_POSES = {
  overview: { position: [15, 4.6, -15.5], target: [0, -0.3, 0.2] },
  inspect: { position: [9.5, 3.8, -12.5], target: [0.4, 0.5, -2.6] },
  sensors: { position: [7, 8, 23], target: [0, 0, -16] },
} as const satisfies Record<string, RafaleCameraPose>;

export const RAFALE_CAMERA_POSES: Record<
  RafaleScenario,
  Record<RafaleSequenceState, RafaleCameraPose>
> = {
  bvr: {
    ...SHARED_POSES,
    // Trois-quarts arrière droit, un peu sous l'aile : le Meteor qui s'éjecte.
    release: { position: [8.5, -2.2, 10.5], target: [0.6, -1.3, 0.8] },
    // Poursuite, légèrement à droite et au-dessus : l'avion au centre, le
    // Meteor qui prend de l'avance devant l'aile droite.
    launch: { position: [5, 3, 24], target: [0.8, -1.2, -18] },
    complete: { position: [-22, 8, 30], target: [1, -1, -22] },
  },
  wvr: {
    ...SHARED_POSES,
    // Poses exprimées dans le repère de l'avion incliné à 55° : elles
    // correspondent, dans le monde, à une caméra en arrière et au-dessus de
    // l'avion (capteurs, l'aile gauche basse restant dans le cadre), en
    // arrière et au-dessus du saumon gauche (séparation), en poursuite
    // (départ), puis devant l'avion en regardant vers l'arrière (fin) : le
    // MICA, propulseur éteint, est déjà loin ; son sillage est resté dans
    // l'air, derrière l'avion.
    sensors: { position: [5, 9, 28], target: [-1, -2, -4] },
    release: { position: [-3.9, 8.2, 14], target: [-3.4, 0.3, 1.5] },
    launch: { position: [-3.2, 11.5, 26], target: [-2.5, 0.5, -22] },
    complete: { position: [-0.3, 14.4, -30], target: [-1.6, -1.1, 30] },
  },
  sead: {
    ...SHARED_POSES,
    // Sous l'aile droite, trois-quarts arrière : largage de l'AASM.
    release: { position: [9.5, -2.8, 11], target: [2.6, -1.8, 0.8] },
    // Profil droit, en recul : l'avion en haut du cadre, l'AASM qui plonge
    // devant et plus bas, tous deux entiers.
    launch: { position: [40, -3, 6], target: [1.5, -6.5, -4] },
    // Fin : l'AASM, propulseur éteint, est loin devant et plus bas ; plan
    // de face, en regardant le sillage resté derrière l'avion.
    complete: { position: [12, 9, -30], target: [0, -4, 30] },
  },
};

/** Inclinaison (°) : seul le combat rapproché met l'avion en virage. */
export const RAFALE_BANK: Record<RafaleScenario, Record<RafaleSequenceState, number>> = {
  bvr: { overview: 0, inspect: 0, sensors: 0, release: 0, launch: 0, complete: 0 },
  wvr: { overview: 0, inspect: 0, sensors: -55, release: -55, launch: -55, complete: -55 },
  sead: { overview: 0, inspect: 0, sensors: 0, release: 0, launch: 0, complete: 0 },
};

export function rafaleLaunchTimeForState(
  scenario: RafaleScenario,
  state: RafaleSequenceState,
): number {
  const shot = RAFALE_SHOTS[scenario];
  if (state === "release") return shot.releaseFreezeS;
  if (state === "launch") return shot.launchFreezeS;
  if (state === "complete") return shot.endS;
  return 0;
}

export function rafalePoseForState(
  state: RafaleSequenceState,
  scenario: RafaleScenario,
): RafaleMotionPose {
  return {
    camera: RAFALE_CAMERA_POSES[scenario][state],
    bank: RAFALE_BANK[scenario][state],
    sensors: state === "sensors" ? 1 : 0,
    launch: rafaleLaunchTimeForState(scenario, state),
  };
}

// ---------------------------------------------------------------------------
// Primitives numériques
// ---------------------------------------------------------------------------

export function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

export function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

export function easeInOut(t: number): number {
  const p = clamp01(t);
  return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

/**
 * Format de cadre pour lequel les poses sont réglées (la vue à 1 440 px de
 * large). Le champ vertical est fixe : un cadre plus étroit voit moins large.
 */
export const RAFALE_DESIGN_ASPECT = 1.55;

/**
 * Recul supplémentaire sur les cadres plus étroits que le format de réglage
 * (colonne de 1 024 px, téléphone) : la couverture horizontale reste celle
 * du réglage. Borné pour les cadres très hauts.
 */
export function framingScaleForAspect(aspect: number): number {
  if (!Number.isFinite(aspect) || aspect <= 0) return 1;
  if (aspect >= RAFALE_DESIGN_ASPECT) return 1;
  return Math.min(2.0, RAFALE_DESIGN_ASPECT / aspect);
}

function sameVec3(a: Vec3, b: Vec3, epsilon = 1e-4): boolean {
  return (
    Math.abs(a[0] - b[0]) < epsilon &&
    Math.abs(a[1] - b[1]) < epsilon &&
    Math.abs(a[2] - b[2]) < epsilon
  );
}

export function sameCameraPose(a: RafaleCameraPose, b: RafaleCameraPose): boolean {
  return sameVec3(a.position, b.position) && sameVec3(a.target, b.target);
}

// ---------------------------------------------------------------------------
// Horloge de tir : ralenti de la séparation, temps réel ensuite
// ---------------------------------------------------------------------------

/** Durée réelle (ms) pour avancer la chronologie de `from` à `to` (to > from). */
export function launchSegmentMs(scenario: RafaleScenario, from: number, to: number): number {
  let seconds = 0;
  for (const [start, end, rate] of launchClock(scenario)) {
    const span = Math.min(to, end) - Math.max(from, start);
    if (span > 0) seconds += span / rate;
  }
  return seconds * 1000;
}

/** Temps de chronologie atteint après `elapsedMs` réelles sur un segment. */
export function launchTimeAt(
  scenario: RafaleScenario,
  from: number,
  to: number,
  elapsedMs: number,
): number {
  let remaining = Math.max(0, elapsedMs) / 1000;
  let t = from;
  for (const [start, end, rate] of launchClock(scenario)) {
    if (t >= to) break;
    if (t >= end) continue;
    const stop = Math.min(to, end);
    const needed = (stop - Math.max(t, start)) / rate;
    if (remaining <= needed) return Math.min(to, Math.max(t, start) + remaining * rate);
    remaining -= needed;
    t = stop;
  }
  return Math.min(to, t);
}

// ---------------------------------------------------------------------------
// Construction du plan
// ---------------------------------------------------------------------------

export function buildRafaleMotionPlan(
  scenario: RafaleScenario,
  from: RafaleMotionPose,
  to: RafaleMotionPose,
  options: { reducedMotion?: boolean } = {},
): RafaleMotionPlan {
  if (options.reducedMotion) {
    return { scenario, from, to, totalMs: 0, segments: [], trackLaunch: false };
  }
  const timing = RAFALE_MOTION_TIMING;
  const segments: RafaleMotionSegment[] = [];
  const push = (
    channel: RafaleMotionChannel,
    startMs: number,
    durationMs: number,
    fromValue: number,
    toValue: number,
  ) => {
    segments.push({ channel, startMs, durationMs, from: fromValue, to: toValue });
    return startMs + durationMs;
  };

  if (!sameCameraPose(from.camera, to.camera)) {
    push("camera", 0, timing.cameraMs, 0, 1);
  }

  const dBank = to.bank - from.bank;
  const dSensors = to.sensors - from.sensors;
  const dLaunch = to.launch - from.launch;
  let trackLaunch = false;

  if (dSensors > 0) {
    push("sensors", timing.sensorsInLeadMs, dSensors * timing.sensorsInMs, from.sensors, to.sensors);
  } else if (dSensors < 0) {
    push("sensors", 0, Math.abs(dSensors) * timing.sensorsOutMs, from.sensors, to.sensors);
  }

  if (dLaunch < 0) {
    // La chronologie de tir revient instantanément (segment de durée nulle),
    // puis l'avion revient à son inclinaison.
    push("launch", 0, 0, from.launch, to.launch);
    if (dBank !== 0) {
      push("bank", 0, (Math.abs(dBank) / 55) * timing.bankRewindMs, from.bank, to.bank);
    }
  } else {
    let cursor = 0;
    if (dBank !== 0) {
      cursor = push("bank", 0, Math.max(400, (Math.abs(dBank) / 55) * timing.bankMs),
        from.bank, to.bank);
    }
    if (dLaunch > 0) {
      const start =
        Math.max(from.launch === 0 ? Math.max(cursor, timing.cameraMs * 0.45) : 0, 0) +
        (from.launch === 0 ? timing.armingMs : 0);
      push("launch", start, launchSegmentMs(scenario, from.launch, to.launch),
        from.launch, to.launch);
      trackLaunch = to.launch > RAFALE_SHOTS[scenario].releaseFreezeS + 1e-6;
    }
  }

  const totalMs = segments.reduce(
    (max, segment) => Math.max(max, segment.startMs + segment.durationMs),
    0,
  );
  return { scenario, from, to, totalMs, segments, trackLaunch };
}

// ---------------------------------------------------------------------------
// Échantillonnage
// ---------------------------------------------------------------------------

function findSegment(
  plan: RafaleMotionPlan,
  channel: RafaleMotionChannel,
): RafaleMotionSegment | undefined {
  return plan.segments.find((segment) => segment.channel === channel);
}

function segmentProgress(segment: RafaleMotionSegment, elapsedMs: number): number {
  if (segment.durationMs <= 0) return elapsedMs >= segment.startMs ? 1 : 0;
  return clamp01((elapsedMs - segment.startMs) / segment.durationMs);
}

function sampleEased(
  plan: RafaleMotionPlan,
  channel: "bank" | "sensors",
  elapsedMs: number,
): number {
  const segment = findSegment(plan, channel);
  if (!segment) return plan.to[channel];
  return lerp(segment.from, segment.to, easeInOut(segmentProgress(segment, elapsedMs)));
}

function sampleLaunch(plan: RafaleMotionPlan, elapsedMs: number): number {
  const segment = findSegment(plan, "launch");
  if (!segment) return plan.to.launch;
  if (segment.to <= segment.from || segment.durationMs <= 0) {
    return elapsedMs >= segment.startMs ? segment.to : segment.from;
  }
  return launchTimeAt(plan.scenario, segment.from, segment.to, elapsedMs - segment.startMs);
}

function sampleCamera(plan: RafaleMotionPlan, elapsedMs: number): RafaleCameraPose {
  const segment = findSegment(plan, "camera");
  if (!segment) return plan.to.camera;
  const t = easeInOut(segmentProgress(segment, elapsedMs));
  const a = plan.from.camera;
  const b = plan.to.camera;
  return {
    position: [
      lerp(a.position[0], b.position[0], t),
      lerp(a.position[1], b.position[1], t),
      lerp(a.position[2], b.position[2], t),
    ],
    target: [
      lerp(a.target[0], b.target[0], t),
      lerp(a.target[1], b.target[1], t),
      lerp(a.target[2], b.target[2], t),
    ],
  };
}

/**
 * Poids du suivi de la munition : monte vite, tient, puis s'éteint avant la
 * fin du segment — la pose finale reste exactement le cadrage de l'état.
 */
export function trackingWeight(progress: number): number {
  const p = clamp01(progress);
  return smoothstep(0.02, 0.14, p) * (1 - smoothstep(0.58, 0.96, p));
}

function sampleTrack(plan: RafaleMotionPlan, elapsedMs: number): number {
  if (!plan.trackLaunch) return 0;
  const segment = findSegment(plan, "launch");
  if (!segment || segment.durationMs <= 0) return 0;
  return trackingWeight(segmentProgress(segment, elapsedMs));
}

export function sampleRafaleMotion(
  plan: RafaleMotionPlan,
  elapsedMs: number,
): RafaleMotionSample {
  const clamped = Number.isFinite(elapsedMs)
    ? Math.max(0, Math.min(elapsedMs, plan.totalMs))
    : plan.totalMs;
  const done = clamped >= plan.totalMs;
  if (done) {
    return {
      camera: plan.to.camera,
      bank: plan.to.bank,
      sensors: clamp01(plan.to.sensors),
      launch: plan.to.launch,
      track: 0,
      done: true,
    };
  }
  return {
    camera: sampleCamera(plan, clamped),
    bank: sampleEased(plan, "bank", clamped),
    sensors: clamp01(sampleEased(plan, "sensors", clamped)),
    launch: sampleLaunch(plan, clamped),
    track: sampleTrack(plan, clamped),
    done: false,
  };
}

export function isInstantPlan(plan: RafaleMotionPlan): boolean {
  return plan.totalMs <= 0;
}

export function everyStateHasMotionPose(): boolean {
  return RAFALE_SCENARIOS.every((scenario) =>
    RAFALE_SEQUENCE_STATES.every(
      (state) =>
        Boolean(RAFALE_CAMERA_POSES[scenario][state]) &&
        Number.isFinite(RAFALE_BANK[scenario][state]),
    ),
  );
}
