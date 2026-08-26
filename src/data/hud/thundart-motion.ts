import {
  THUNDART_SEQUENCE_STATES,
  type ThundartSequenceState,
} from "./thundart";

/**
 * Logique de mouvement de la planche Thundart — pure et déterministe.
 *
 * Principe directeur : NO STATE CHANGE = NO MOTION. Rien ici ne produit de
 * mouvement par lui-même. Un plan n'existe que si l'état séquentiel change, et
 * il se termine sur une pose exacte. Aucune boucle décorative, aucune animation
 * d'attente, aucun `Math.random`, aucune dépendance au framerate : échantillonner
 * un plan au même temps écoulé rend toujours exactement la même pose.
 *
 * Cadre éditorial inchangé : la « configuration » et la « séparation » sont des
 * lectures visuelles illustratives. Aucune trajectoire, aucune balistique,
 * aucune cible, aucune physique n'est représentée ni calculée.
 */

export type Vec3 = readonly [number, number, number];

export type ThundartCameraPose = {
  readonly position: Vec3;
  readonly target: Vec3;
};

/** Pose complète de la planche : cadrage + avancement normalisé des deux clips. */
export type ThundartMotionPose = {
  readonly camera: ThundartCameraPose;
  /** Avancement 0..1 du clip GLB `THD_CONFIGURE_DEMO`. */
  readonly configure: number;
  /** Avancement 0..1 du clip GLB `THD_DEPARTURE_DEMO`. */
  readonly departure: number;
};

export type ThundartMotionChannel =
  | "camera"
  | "configure"
  | "departure"
  | "flash";

export type ThundartMotionSegment = {
  readonly channel: ThundartMotionChannel;
  readonly startMs: number;
  readonly durationMs: number;
  readonly from: number;
  readonly to: number;
};

export type ThundartMotionPlan = {
  readonly from: ThundartMotionPose;
  readonly to: ThundartMotionPose;
  readonly totalMs: number;
  readonly segments: readonly ThundartMotionSegment[];
};

export type ThundartMotionSample = {
  readonly camera: ThundartCameraPose;
  readonly configure: number;
  readonly departure: number;
  /** Intensité 0..1 du flash graphique de séparation. */
  readonly flash: number;
  readonly done: boolean;
};

/** Durées des clips embarqués dans le GLB, en millisecondes. */
export type ThundartClipDurations = {
  readonly configureMs: number;
  readonly departureMs: number;
};

/**
 * Durées lues dans `public/models/hud/thundart.glb`. Elles ne servent
 * que de repli : à l'exécution, les durées réelles des `AnimationClip` chargés
 * sont utilisées, pour que le mouvement reste aligné si l'asset est régénéré.
 */
export const THUNDART_FALLBACK_CLIP_DURATIONS: ThundartClipDurations = {
  configureMs: 2458,
  departureMs: 1958,
};

/**
 * Réglages de transition. Volontairement courts et prévisibles : un déplacement
 * doit être lisible, interruptible et justifié par le changement d'état.
 */
export const THUNDART_MOTION_TIMING = {
  /** Recomposition du cadrage. Identique dans les deux sens. */
  cameraMs: 560,
  /** Le cadrage prend une légère avance sur l'animation du rack. */
  configureLeadMs: 120,
  /** Courte pause visuelle avant la séparation illustrative. */
  departurePauseMs: 320,
  /** Respiration entre deux clips lors d'un retour en arrière. */
  rewindGapMs: 140,
  /** Retours en arrière : plus rapides, ce n'est pas le propos de la planche. */
  configureRewindMs: 900,
  departureRewindMs: 700,
  /** Flash graphique bref accompagnant le début de la séparation. */
  flashMs: 420,
} as const;

/**
 * Cadrages par état. Chaque déplacement sert la lecture des sous-ensembles :
 * trois-quarts avant pour la silhouette, trois-quarts arrière pour les huit
 * conteneurs, recul progressif quand le rack puis le projectile montent dans
 * le cadre. Aucun orbit automatique, aucun zoom permanent, aucun tremblement.
 */
export const THUNDART_CAMERA_POSES: Record<
  ThundartSequenceState,
  ThundartCameraPose
> = {
  // Silhouette générale, trois-quarts avant (cadrage de référence).
  overview: { position: [12.5, 7.5, -14.5], target: [0, 1.65, 0] },
  // Bascule en trois-quarts arrière : c'est de là que les huit conteneurs, le
  // cadre du rack et les quatre essieux se lisent en une seule vue.
  inspect: { position: [13.5, 7.0, 14.5], target: [0, 1.9, 1.0] },
  // Le rack occupe désormais le haut du cadre : on recule et on prend un peu
  // de hauteur pour qu'il tienne entier.
  configure: { position: [14.5, 8.2, 14.0], target: [0, 3.0, 1.5] },
  // Cadre nettement élargi : la séparation illustrative sort du gabarit du
  // véhicule et doit rester entièrement visible.
  departure: { position: [19.5, 11.0, 16.5], target: [-0.4, 4.8, 2.5] },
  // Frame finale : la géométrie reste figée, mais ce trois-quarts arrière est
  // volontairement plus proche que « departure ». Rack, véhicule et projectile
  // séparé restent ainsi lisibles ensemble sans conclure par un recul.
  complete: { position: [17.8, 9.8, 16.8], target: [-0.25, 4.1, 1.6] },
};

/** Distance euclidienne d'un cadrage, utile pour borner les poses finales. */
export function cameraDistanceForPose(pose: ThundartCameraPose): number {
  const [px, py, pz] = pose.position;
  const [tx, ty, tz] = pose.target;
  return Math.hypot(px - tx, py - ty, pz - tz);
}

/** Avancement des clips GLB pour chaque état. Toujours 0 ou 1 : pas d'état intermédiaire. */
export const THUNDART_CLIP_POSES: Record<
  ThundartSequenceState,
  { readonly configure: number; readonly departure: number }
> = {
  overview: { configure: 0, departure: 0 },
  inspect: { configure: 0, departure: 0 },
  configure: { configure: 1, departure: 0 },
  departure: { configure: 1, departure: 1 },
  complete: { configure: 1, departure: 1 },
};

export function thundartPoseForState(
  state: ThundartSequenceState,
): ThundartMotionPose {
  const clips = THUNDART_CLIP_POSES[state];
  return {
    camera: THUNDART_CAMERA_POSES[state],
    configure: clips.configure,
    departure: clips.departure,
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

/** Amorti symétrique, sans dépassement : un mouvement mécanique sobre. */
export function easeInOut(t: number): number {
  const p = clamp01(t);
  return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
}

/** Attaque rapide puis extinction quadratique. Vaut 0 aux deux bords. */
export function flashPulse(t: number): number {
  const p = clamp01(t);
  if (p <= 0 || p >= 1) return 0;
  const attack = 0.16;
  if (p < attack) return p / attack;
  const decay = (p - attack) / (1 - attack);
  return (1 - decay) * (1 - decay);
}

/**
 * Recul supplémentaire sur les viewports étroits. Purement géométrique : à
 * champ vertical constant, un cadre plus haut que large voit moins en largeur.
 * Déterministe pour un ratio donné.
 */
export function framingScaleForAspect(aspect: number): number {
  if (!Number.isFinite(aspect) || aspect <= 0) return 1;
  if (aspect >= 1) return 1;
  return Math.min(2.1, 1 / aspect);
}

function sameVec3(a: Vec3, b: Vec3, epsilon = 1e-4): boolean {
  return (
    Math.abs(a[0] - b[0]) < epsilon &&
    Math.abs(a[1] - b[1]) < epsilon &&
    Math.abs(a[2] - b[2]) < epsilon
  );
}

export function sameCameraPose(
  a: ThundartCameraPose,
  b: ThundartCameraPose,
): boolean {
  return sameVec3(a.position, b.position) && sameVec3(a.target, b.target);
}

// ---------------------------------------------------------------------------
// Construction du plan
// ---------------------------------------------------------------------------

/**
 * Construit le plan menant de `from` à `to`.
 *
 * Ordre choisi : en marche avant on configure le rack puis on sépare le
 * projectile ; en marche arrière le projectile réintègre son conteneur avant
 * que le rack ne redescende. Aucun clip ne joue « tout seul » : chaque canal
 * est une interpolation bornée vers une valeur cible.
 *
 * En mouvement réduit, le plan est instantané (`totalMs === 0`, aucun segment) :
 * l'échantillonnage rend directement la pose finale. L'information est la même,
 * seule l'interpolation disparaît — et le flash avec elle.
 */
export function buildThundartMotionPlan(
  from: ThundartMotionPose,
  to: ThundartMotionPose,
  clips: ThundartClipDurations = THUNDART_FALLBACK_CLIP_DURATIONS,
  options: { reducedMotion?: boolean } = {},
): ThundartMotionPlan {
  if (options.reducedMotion) {
    return { from, to, totalMs: 0, segments: [] };
  }

  const timing = THUNDART_MOTION_TIMING;
  const segments: ThundartMotionSegment[] = [];

  if (!sameCameraPose(from.camera, to.camera)) {
    segments.push({
      channel: "camera",
      startMs: 0,
      durationMs: timing.cameraMs,
      from: 0,
      to: 1,
    });
  }

  const configureDelta = to.configure - from.configure;
  const departureDelta = to.departure - from.departure;

  const configureMs =
    Math.abs(configureDelta) *
    (configureDelta > 0
      ? Math.max(1, clips.configureMs)
      : timing.configureRewindMs);
  const departureMs =
    Math.abs(departureDelta) *
    (departureDelta > 0
      ? Math.max(1, clips.departureMs)
      : timing.departureRewindMs);

  const pushClip = (
    channel: "configure" | "departure",
    startMs: number,
    durationMs: number,
    fromValue: number,
    toValue: number,
  ) => {
    segments.push({ channel, startMs, durationMs, from: fromValue, to: toValue });
    return startMs + durationMs;
  };

  if (departureDelta < 0) {
    // Marche arrière : le projectile réintègre son conteneur en premier.
    const afterDeparture = pushClip(
      "departure",
      0,
      departureMs,
      from.departure,
      to.departure,
    );
    if (configureMs > 0) {
      pushClip(
        "configure",
        afterDeparture + timing.rewindGapMs,
        configureMs,
        from.configure,
        to.configure,
      );
    }
  } else {
    let cursor = 0;
    if (configureMs > 0) {
      cursor = pushClip(
        "configure",
        timing.configureLeadMs,
        configureMs,
        from.configure,
        to.configure,
      );
    }
    if (departureMs > 0) {
      const startMs = cursor + timing.departurePauseMs;
      pushClip("departure", startMs, departureMs, from.departure, to.departure);
      if (departureDelta > 0) {
        // Flash graphique bref, calé sur le début de la séparation.
        segments.push({
          channel: "flash",
          startMs,
          durationMs: timing.flashMs,
          from: 0,
          to: 1,
        });
      }
    }
  }

  const totalMs = segments.reduce(
    (max, segment) => Math.max(max, segment.startMs + segment.durationMs),
    0,
  );

  return { from, to, totalMs, segments };
}

// ---------------------------------------------------------------------------
// Échantillonnage
// ---------------------------------------------------------------------------

function segmentProgress(
  segment: ThundartMotionSegment,
  elapsedMs: number,
): number {
  if (segment.durationMs <= 0) return 1;
  return clamp01((elapsedMs - segment.startMs) / segment.durationMs);
}

function findSegment(
  plan: ThundartMotionPlan,
  channel: ThundartMotionChannel,
): ThundartMotionSegment | undefined {
  return plan.segments.find((segment) => segment.channel === channel);
}

function sampleClip(
  plan: ThundartMotionPlan,
  channel: "configure" | "departure",
  elapsedMs: number,
): number {
  const segment = findSegment(plan, channel);
  // Pas de segment = le canal ne change pas sur cette transition : `to` vaut
  // alors déjà `from`. C'est aussi le cas du plan instantané en mouvement
  // réduit, où rendre `to` est exactement le comportement voulu.
  if (!segment) return clamp01(plan.to[channel]);
  return clamp01(
    lerp(segment.from, segment.to, easeInOut(segmentProgress(segment, elapsedMs))),
  );
}

function sampleCamera(
  plan: ThundartMotionPlan,
  elapsedMs: number,
): ThundartCameraPose {
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
 * Échantillonne un plan à un temps écoulé donné. Fonction pure : même plan +
 * même temps = même pose, quel que soit le framerate. Au-delà de `totalMs` la
 * pose retournée est exactement `plan.to`.
 */
export function sampleThundartMotion(
  plan: ThundartMotionPlan,
  elapsedMs: number,
): ThundartMotionSample {
  const clamped = Number.isFinite(elapsedMs)
    ? Math.max(0, Math.min(elapsedMs, plan.totalMs))
    : plan.totalMs;
  const done = clamped >= plan.totalMs;

  if (done) {
    return {
      camera: plan.to.camera,
      configure: clamp01(plan.to.configure),
      departure: clamp01(plan.to.departure),
      flash: 0,
      done: true,
    };
  }

  const flashSegment = findSegment(plan, "flash");

  return {
    camera: sampleCamera(plan, clamped),
    configure: sampleClip(plan, "configure", clamped),
    departure: sampleClip(plan, "departure", clamped),
    flash: flashSegment
      ? flashPulse(segmentProgress(flashSegment, clamped))
      : 0,
    done: false,
  };
}

/** Un plan instantané ne produit aucune frame animée. */
export function isInstantPlan(plan: ThundartMotionPlan): boolean {
  return plan.totalMs <= 0;
}

/**
 * Pose finale garantie pour un état, indépendamment du chemin parcouru. Sert de
 * référence aux tests : le même état doit toujours produire la même pose.
 */
export function thundartFinalPose(
  state: ThundartSequenceState,
): ThundartMotionPose {
  return thundartPoseForState(state);
}

/** Tous les états ont un cadrage et un avancement de clips définis. */
export function everyStateHasMotionPose(): boolean {
  return THUNDART_SEQUENCE_STATES.every(
    (state) =>
      Boolean(THUNDART_CAMERA_POSES[state]) && Boolean(THUNDART_CLIP_POSES[state]),
  );
}
