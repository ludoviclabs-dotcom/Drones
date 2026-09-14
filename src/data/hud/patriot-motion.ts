import {
  PATRIOT_SEQUENCE_STATES,
  type PatriotSequenceState,
} from "./patriot";
import { PATRIOT_LAUNCH_TIMING } from "./patriot-launch";

/**
 * Logique de mouvement de la planche Patriot — pure et déterministe.
 *
 * Même contrat que la planche Thundart : NO STATE CHANGE = NO MOTION. Un plan
 * n'existe que si l'état change ; il se termine sur une pose exacte ; aucune
 * `Math.random`, aucune dépendance au framerate. Quatre canaux :
 *
 * - `camera`  : cadrage (position + cible), amorti symétrique ;
 * - `emplace` : avancement 0..1 du clip GLB `PAT_EMPLACE` (mise en batterie) ;
 * - `elevate` : avancement 0..1 du clip GLB `PAT_ELEVATE` (gisement + site) ;
 * - `launch`  : temps de la chronologie illustrative de tir (secondes).
 *
 * En marche avant, les canaux s'enchaînent dans l'ordre du récit. En marche
 * arrière, la chronologie de tir revient d'un coup (on ne « rembobine » pas un
 * départ), puis le lanceur redescend et la mise en batterie se défait, plus
 * vite qu'à l'aller.
 */

export type Vec3 = readonly [number, number, number];

export type PatriotCameraPose = {
  readonly position: Vec3;
  readonly target: Vec3;
};

export type PatriotMotionPose = {
  readonly camera: PatriotCameraPose;
  readonly emplace: number;
  readonly elevate: number;
  readonly launch: number;
};

export type PatriotMotionChannel = "camera" | "emplace" | "elevate" | "launch";

export type PatriotMotionSegment = {
  readonly channel: PatriotMotionChannel;
  readonly startMs: number;
  readonly durationMs: number;
  readonly from: number;
  readonly to: number;
};

export type PatriotMotionPlan = {
  readonly from: PatriotMotionPose;
  readonly to: PatriotMotionPose;
  readonly totalMs: number;
  readonly segments: readonly PatriotMotionSegment[];
  /** Vrai si la caméra suit l'intercepteur pendant le départ. */
  readonly trackLaunch: boolean;
};

export type PatriotMotionSample = {
  readonly camera: PatriotCameraPose;
  readonly emplace: number;
  readonly elevate: number;
  readonly launch: number;
  /** Poids 0..1 du suivi de l'intercepteur par la cible caméra. */
  readonly track: number;
  readonly done: boolean;
};

/** Durées des clips du GLB (ms). Repli si le fichier ne les expose pas. */
export type PatriotClipDurations = {
  readonly emplaceMs: number;
  readonly elevateMs: number;
};

export const PATRIOT_FALLBACK_CLIP_DURATIONS: PatriotClipDurations = {
  emplaceMs: 6625,
  elevateMs: 3958,
};

export const PATRIOT_MOTION_TIMING = {
  cameraMs: 950,
  /** Lecture de la mise en batterie : le clip est joué un peu plus vite. */
  emplaceRate: 1.25,
  emplaceLeadMs: 250,
  elevateLeadMs: 200,
  /** Pause d'« armement » avant l'allumage, lanceur au site de tir. */
  armingMs: 420,
  gapMs: 140,
  emplaceRewindMs: 1500,
  elevateRewindMs: 1100,
} as const;

/**
 * Horloge de tir par paliers : l'allumage est montré à ×0,4, le départ à
 * ×0,6, la suite en temps réel. [début, fin, cadence] en temps de chronologie.
 */
export const PATRIOT_LAUNCH_CLOCK: readonly (readonly [number, number, number])[] = [
  [0, PATRIOT_LAUNCH_TIMING.fireFreezeS, 0.4],
  [PATRIOT_LAUNCH_TIMING.fireFreezeS, PATRIOT_LAUNCH_TIMING.launchFreezeS, 0.6],
  [PATRIOT_LAUNCH_TIMING.launchFreezeS, Number.POSITIVE_INFINITY, 1],
];

/**
 * Cadrages par état, en coordonnées de la scène Web (Y vers le haut, avant du
 * lanceur vers -Z). Chaque déplacement sert la lecture : vue haute de la
 * batterie, trois-quarts arrière du lanceur, profil pour le départ du
 * tracteur, contre-plongée pour l'élévation, plan serré de l'allumage, plan
 * arrière qui accompagne le départ, plan large final.
 */
export const PATRIOT_CAMERA_POSES: Record<PatriotSequenceState, PatriotCameraPose> = {
  overview: { position: [60, 42, -38], target: [-2, 1, 17] },
  inspect: { position: [12.5, 6.2, 12], target: [0, 2.3, -2] },
  emplace: { position: [23, 8.5, 3], target: [-1.5, 1.6, -6.5] },
  elevate: { position: [17, 5.5, -14], target: [0.5, 4.2, -1] },
  fire: { position: [18.5, 7, -13], target: [0.5, 5, -1.5] },
  // Perpendiculaire à l'axe de tir : lanceur en bas, intercepteur A (≈ 58 m
  // d'avance au temps figé) en haut du cadre.
  launch: { position: [80, 27, -3], target: [6, 21, -22] },
  // Plan large final : la batterie en bas à gauche, la traînée qui monte.
  complete: { position: [98, 40, 50], target: [6, 28, -30] },
};

export const PATRIOT_CLIP_POSES: Record<
  PatriotSequenceState,
  { readonly emplace: number; readonly elevate: number; readonly launch: number }
> = {
  overview: { emplace: 0, elevate: 0, launch: 0 },
  inspect: { emplace: 0, elevate: 0, launch: 0 },
  emplace: { emplace: 1, elevate: 0, launch: 0 },
  elevate: { emplace: 1, elevate: 1, launch: 0 },
  fire: { emplace: 1, elevate: 1, launch: PATRIOT_LAUNCH_TIMING.fireFreezeS },
  launch: { emplace: 1, elevate: 1, launch: PATRIOT_LAUNCH_TIMING.launchFreezeS },
  complete: { emplace: 1, elevate: 1, launch: PATRIOT_LAUNCH_TIMING.endS },
};

export function patriotPoseForState(state: PatriotSequenceState): PatriotMotionPose {
  const clips = PATRIOT_CLIP_POSES[state];
  return { camera: PATRIOT_CAMERA_POSES[state], ...clips };
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

/** Recul supplémentaire sur les cadres plus hauts que larges (borné). */
export function framingScaleForAspect(aspect: number): number {
  if (!Number.isFinite(aspect) || aspect <= 0) return 1;
  if (aspect >= 1) return 1;
  return Math.min(2.0, 1 / aspect);
}

function sameVec3(a: Vec3, b: Vec3, epsilon = 1e-4): boolean {
  return (
    Math.abs(a[0] - b[0]) < epsilon &&
    Math.abs(a[1] - b[1]) < epsilon &&
    Math.abs(a[2] - b[2]) < epsilon
  );
}

export function sameCameraPose(a: PatriotCameraPose, b: PatriotCameraPose): boolean {
  return sameVec3(a.position, b.position) && sameVec3(a.target, b.target);
}

export function cameraDistance(pose: PatriotCameraPose): number {
  const [px, py, pz] = pose.position;
  const [tx, ty, tz] = pose.target;
  return Math.hypot(px - tx, py - ty, pz - tz);
}

// ---------------------------------------------------------------------------
// Horloge de tir : ralenti de l'allumage, temps réel ensuite
// ---------------------------------------------------------------------------

/** Durée réelle (ms) pour avancer la chronologie de `from` à `to` (to > from). */
export function launchSegmentMs(from: number, to: number): number {
  let seconds = 0;
  for (const [start, end, rate] of PATRIOT_LAUNCH_CLOCK) {
    const span = Math.min(to, end) - Math.max(from, start);
    if (span > 0) seconds += span / rate;
  }
  return seconds * 1000;
}

/** Temps de chronologie atteint après `elapsedMs` réelles sur un segment. */
export function launchTimeAt(from: number, to: number, elapsedMs: number): number {
  let remaining = Math.max(0, elapsedMs) / 1000;
  let t = from;
  for (const [start, end, rate] of PATRIOT_LAUNCH_CLOCK) {
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

export function buildPatriotMotionPlan(
  from: PatriotMotionPose,
  to: PatriotMotionPose,
  clips: PatriotClipDurations = PATRIOT_FALLBACK_CLIP_DURATIONS,
  options: { reducedMotion?: boolean } = {},
): PatriotMotionPlan {
  if (options.reducedMotion) {
    return { from, to, totalMs: 0, segments: [], trackLaunch: false };
  }
  const timing = PATRIOT_MOTION_TIMING;
  const segments: PatriotMotionSegment[] = [];
  const push = (
    channel: PatriotMotionChannel,
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

  const dEmplace = to.emplace - from.emplace;
  const dElevate = to.elevate - from.elevate;
  const dLaunch = to.launch - from.launch;
  let trackLaunch = false;

  const retreating = dLaunch < 0 || dElevate < 0 || dEmplace < 0;
  if (retreating) {
    // La chronologie de tir revient instantanément (segment de durée nulle).
    if (dLaunch !== 0) push("launch", 0, 0, from.launch, to.launch);
    let cursor = 0;
    if (dElevate < 0) {
      cursor = push("elevate", cursor, Math.abs(dElevate) * timing.elevateRewindMs,
        from.elevate, to.elevate);
    }
    if (dEmplace < 0) {
      const start = cursor > 0 ? cursor + timing.gapMs : 0;
      cursor = push("emplace", start, Math.abs(dEmplace) * timing.emplaceRewindMs,
        from.emplace, to.emplace);
    }
    // Un plan mixte (saut arrière puis avant sur un autre canal) reste borné :
    // les canaux qui progressent démarrent après les retours.
    if (dElevate > 0) {
      cursor = push("elevate", cursor + timing.gapMs,
        dElevate * Math.max(1, clips.elevateMs), from.elevate, to.elevate);
    }
    if (dEmplace > 0) {
      push("emplace", cursor + timing.gapMs,
        (dEmplace * Math.max(1, clips.emplaceMs)) / timing.emplaceRate,
        from.emplace, to.emplace);
    }
  } else {
    let cursor = 0;
    if (dEmplace > 0) {
      cursor = push("emplace", timing.emplaceLeadMs,
        (dEmplace * Math.max(1, clips.emplaceMs)) / timing.emplaceRate,
        from.emplace, to.emplace);
    }
    if (dElevate > 0) {
      const start = cursor > 0 ? cursor + timing.gapMs : timing.elevateLeadMs;
      cursor = push("elevate", start, dElevate * Math.max(1, clips.elevateMs),
        from.elevate, to.elevate);
    }
    if (dLaunch > 0) {
      const start = Math.max(cursor, from.launch === 0 ? timing.cameraMs * 0.4 : 0) +
        (from.launch === 0 ? timing.armingMs : 0);
      push("launch", start, launchSegmentMs(from.launch, to.launch), from.launch, to.launch);
      trackLaunch = to.launch > PATRIOT_LAUNCH_TIMING.fireFreezeS + 1e-6;
    }
  }

  const totalMs = segments.reduce(
    (max, segment) => Math.max(max, segment.startMs + segment.durationMs),
    0,
  );
  return { from, to, totalMs, segments, trackLaunch };
}

// ---------------------------------------------------------------------------
// Échantillonnage
// ---------------------------------------------------------------------------

function findSegment(
  plan: PatriotMotionPlan,
  channel: PatriotMotionChannel,
): PatriotMotionSegment | undefined {
  return plan.segments.find((segment) => segment.channel === channel);
}

function segmentProgress(segment: PatriotMotionSegment, elapsedMs: number): number {
  if (segment.durationMs <= 0) return elapsedMs >= segment.startMs ? 1 : 0;
  return clamp01((elapsedMs - segment.startMs) / segment.durationMs);
}

function sampleClip(
  plan: PatriotMotionPlan,
  channel: "emplace" | "elevate",
  elapsedMs: number,
): number {
  const segment = findSegment(plan, channel);
  if (!segment) return clamp01(plan.to[channel]);
  // Lecture LINÉAIRE : l'amorti est déjà écrit dans les clips Blender.
  return clamp01(lerp(segment.from, segment.to, segmentProgress(segment, elapsedMs)));
}

function sampleLaunch(plan: PatriotMotionPlan, elapsedMs: number): number {
  const segment = findSegment(plan, "launch");
  if (!segment) return plan.to.launch;
  if (segment.to <= segment.from || segment.durationMs <= 0) {
    return elapsedMs >= segment.startMs ? segment.to : segment.from;
  }
  return launchTimeAt(segment.from, segment.to, elapsedMs - segment.startMs);
}

function sampleCamera(plan: PatriotMotionPlan, elapsedMs: number): PatriotCameraPose {
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
 * Poids du suivi de l'intercepteur : monte vite, tient, puis s'éteint avant la
 * fin du segment — la pose finale reste exactement le cadrage de l'état.
 */
export function trackingWeight(progress: number): number {
  const p = clamp01(progress);
  return smoothstep(0.02, 0.14, p) * (1 - smoothstep(0.58, 0.96, p));
}

function sampleTrack(plan: PatriotMotionPlan, elapsedMs: number): number {
  if (!plan.trackLaunch) return 0;
  const segment = findSegment(plan, "launch");
  if (!segment || segment.durationMs <= 0) return 0;
  return trackingWeight(segmentProgress(segment, elapsedMs));
}

export function samplePatriotMotion(
  plan: PatriotMotionPlan,
  elapsedMs: number,
): PatriotMotionSample {
  const clamped = Number.isFinite(elapsedMs)
    ? Math.max(0, Math.min(elapsedMs, plan.totalMs))
    : plan.totalMs;
  const done = clamped >= plan.totalMs;
  if (done) {
    return {
      camera: plan.to.camera,
      emplace: clamp01(plan.to.emplace),
      elevate: clamp01(plan.to.elevate),
      launch: plan.to.launch,
      track: 0,
      done: true,
    };
  }
  return {
    camera: sampleCamera(plan, clamped),
    emplace: sampleClip(plan, "emplace", clamped),
    elevate: sampleClip(plan, "elevate", clamped),
    launch: sampleLaunch(plan, clamped),
    track: sampleTrack(plan, clamped),
    done: false,
  };
}

export function isInstantPlan(plan: PatriotMotionPlan): boolean {
  return plan.totalMs <= 0;
}

export function everyStateHasMotionPose(): boolean {
  return PATRIOT_SEQUENCE_STATES.every(
    (state) => Boolean(PATRIOT_CAMERA_POSES[state]) && Boolean(PATRIOT_CLIP_POSES[state]),
  );
}
