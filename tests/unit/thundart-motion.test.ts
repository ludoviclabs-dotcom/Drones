import { describe, expect, it } from "vitest";
import {
  THUNDART_INITIAL_STATE,
  THUNDART_SEQUENCE_STATES,
  thundartSequenceReducer,
  type ThundartSequenceAction,
  type ThundartSequenceState,
} from "@/data/hud/thundart";
import {
  buildThundartMotionPlan,
  cameraDistanceForPose,
  easeInOut,
  everyStateHasMotionPose,
  flashPulse,
  framingScaleForAspect,
  isInstantPlan,
  sameCameraPose,
  sampleThundartMotion,
  thundartFinalPose,
  thundartPoseForState,
  THUNDART_CAMERA_POSES,
  THUNDART_CLIP_POSES,
  THUNDART_MOTION_TIMING,
  type ThundartMotionPlan,
  type ThundartMotionPose,
} from "@/data/hud/thundart-motion";

const CLIPS = { configureMs: 2458, departureMs: 1958 };

function poseOf(state: ThundartSequenceState): ThundartMotionPose {
  return thundartPoseForState(state);
}

function planBetween(
  from: ThundartSequenceState,
  to: ThundartSequenceState,
  reducedMotion = false,
): ThundartMotionPlan {
  return buildThundartMotionPlan(poseOf(from), poseOf(to), CLIPS, {
    reducedMotion,
  });
}

/** Rejoue un plan par pas fixes, comme le ferait la boucle de rendu. */
function runPlan(plan: ThundartMotionPlan, stepMs: number) {
  let elapsed = 0;
  let frames = 0;
  let last = sampleThundartMotion(plan, 0);
  while (!last.done) {
    if (frames > 100_000) throw new Error("plan non convergent");
    elapsed = Math.min(elapsed + stepMs, plan.totalMs);
    last = sampleThundartMotion(plan, elapsed);
    frames += 1;
  }
  return { sample: last, frames };
}

describe("poses de mouvement Thundart", () => {
  it("définit un cadrage et un avancement de clips pour chaque état", () => {
    expect(everyStateHasMotionPose()).toBe(true);
    for (const state of THUNDART_SEQUENCE_STATES) {
      expect(THUNDART_CAMERA_POSES[state]).toBeDefined();
      expect(THUNDART_CLIP_POSES[state]).toBeDefined();
    }
  });

  it("n’utilise que des avancements de clips bornés à 0 ou 1", () => {
    for (const state of THUNDART_SEQUENCE_STATES) {
      const { configure, departure } = THUNDART_CLIP_POSES[state];
      expect([0, 1]).toContain(configure);
      expect([0, 1]).toContain(departure);
    }
  });

  it("respecte la sémantique éditoriale des cinq états", () => {
    // Rien n’est engagé avant `configure` ; la séparation n’apparaît qu’à
    // `departure` ; `complete` est un arrêt sur image de la même géométrie.
    expect(THUNDART_CLIP_POSES.overview).toEqual({
      configure: 0,
      departure: 0,
    });
    expect(THUNDART_CLIP_POSES.inspect).toEqual({ configure: 0, departure: 0 });
    expect(THUNDART_CLIP_POSES.configure).toEqual({
      configure: 1,
      departure: 0,
    });
    expect(THUNDART_CLIP_POSES.departure).toEqual({
      configure: 1,
      departure: 1,
    });
    expect(THUNDART_CLIP_POSES.complete).toEqual(
      THUNDART_CLIP_POSES.departure,
    );
  });

  it("conserve les poses déjà validées et resserre la frame COMPLETE", () => {
    expect(THUNDART_CAMERA_POSES.overview).toEqual({
      position: [12.5, 7.5, -14.5],
      target: [0, 1.65, 0],
    });
    expect(THUNDART_CAMERA_POSES.inspect).toEqual({
      position: [13.5, 7.0, 14.5],
      target: [0, 1.9, 1.0],
    });
    expect(THUNDART_CAMERA_POSES.configure).toEqual({
      position: [14.5, 8.2, 14.0],
      target: [0, 3.0, 1.5],
    });
    expect(THUNDART_CAMERA_POSES.departure).toEqual({
      position: [19.5, 11.0, 16.5],
      target: [-0.4, 4.8, 2.5],
    });

    expect(THUNDART_CAMERA_POSES.complete).not.toEqual(
      THUNDART_CAMERA_POSES.departure,
    );
    expect(cameraDistanceForPose(THUNDART_CAMERA_POSES.complete)).toBeLessThan(
      cameraDistanceForPose(THUNDART_CAMERA_POSES.departure),
    );
    expect(cameraDistanceForPose(THUNDART_CAMERA_POSES.complete)).toBeLessThan(
      25,
    );
  });
});

describe("construction des plans", () => {
  it("ne produit aucun mouvement quand l’état ne change pas", () => {
    for (const state of THUNDART_SEQUENCE_STATES) {
      const plan = planBetween(state, state);
      expect(plan.segments).toHaveLength(0);
      expect(plan.totalMs).toBe(0);
      expect(isInstantPlan(plan)).toBe(true);
    }
  });

  it("overview → inspect ne recompose que le cadrage", () => {
    const plan = planBetween("overview", "inspect");
    expect(plan.segments.map((s) => s.channel)).toEqual(["camera"]);
    expect(plan.totalMs).toBe(THUNDART_MOTION_TIMING.cameraMs);
  });

  it("inspect → configure joue le clip du rack à sa durée réelle", () => {
    const plan = planBetween("inspect", "configure");
    const configure = plan.segments.find((s) => s.channel === "configure");
    expect(configure).toBeDefined();
    expect(configure?.durationMs).toBe(CLIPS.configureMs);
    expect(configure?.startMs).toBe(THUNDART_MOTION_TIMING.configureLeadMs);
    expect(plan.segments.some((s) => s.channel === "departure")).toBe(false);
    expect(plan.segments.some((s) => s.channel === "flash")).toBe(false);
  });

  it("configure → departure marque une courte pause puis sépare, avec flash", () => {
    const plan = planBetween("configure", "departure");
    const departure = plan.segments.find((s) => s.channel === "departure");
    const flash = plan.segments.find((s) => s.channel === "flash");

    expect(departure?.startMs).toBe(THUNDART_MOTION_TIMING.departurePauseMs);
    expect(departure?.durationMs).toBe(CLIPS.departureMs);
    // Le flash est calé sur le début exact de la séparation.
    expect(flash?.startMs).toBe(departure?.startMs);
    expect(flash?.durationMs).toBe(THUNDART_MOTION_TIMING.flashMs);
    // Le rack ne rejoue pas : il est déjà dans sa configuration.
    expect(plan.segments.some((s) => s.channel === "configure")).toBe(false);
  });

  it("departure → complete est un arrêt sur image : la géométrie ne bouge pas", () => {
    const plan = planBetween("departure", "complete");
    expect(plan.segments.map((s) => s.channel)).toEqual(["camera"]);
    expect(plan.to.configure).toBe(plan.from.configure);
    expect(plan.to.departure).toBe(plan.from.departure);
  });

  it("rembobine le projectile avant le rack en marche arrière", () => {
    const plan = planBetween("complete", "overview");
    const departure = plan.segments.find((s) => s.channel === "departure");
    const configure = plan.segments.find((s) => s.channel === "configure");

    expect(departure).toBeDefined();
    expect(configure).toBeDefined();
    expect(departure!.startMs).toBeLessThan(configure!.startMs);
    expect(departure!.startMs + departure!.durationMs).toBeLessThanOrEqual(
      configure!.startMs,
    );
    // Aucun flash en marche arrière : il ne signale qu’un départ.
    expect(plan.segments.some((s) => s.channel === "flash")).toBe(false);
  });

  it("rembobine plus vite qu’il n’avance", () => {
    const forward = planBetween("inspect", "configure");
    const backward = planBetween("configure", "inspect");
    const forwardClip = forward.segments.find((s) => s.channel === "configure");
    const backwardClip = backward.segments.find(
      (s) => s.channel === "configure",
    );
    expect(backwardClip!.durationMs).toBeLessThan(forwardClip!.durationMs);
    expect(backwardClip!.durationMs).toBe(
      THUNDART_MOTION_TIMING.configureRewindMs,
    );
  });

  it("reste court sur toutes les transitions réellement atteignables", () => {
    // Seuls NEXT, PREVIOUS et RESET peuvent produire une transition : on ne
    // borne donc que celles-là, pas les sauts d’état impossibles.
    const reachable: Array<[ThundartSequenceState, ThundartSequenceState]> = [];
    for (const from of THUNDART_SEQUENCE_STATES) {
      for (const action of [
        { type: "NEXT" },
        { type: "PREVIOUS" },
        { type: "RESET" },
      ] as ThundartSequenceAction[]) {
        reachable.push([from, thundartSequenceReducer(from, action)]);
      }
    }

    let longest = 0;
    for (const [from, to] of reachable) {
      longest = Math.max(longest, planBetween(from, to).totalMs);
    }

    expect(reachable.length).toBe(THUNDART_SEQUENCE_STATES.length * 3);
    expect(longest).toBeGreaterThan(0);
    expect(longest).toBeLessThanOrEqual(3000);
  });

  it("échelonne la durée sur un plan partiel (interruption en cours de course)", () => {
    const partial = buildThundartMotionPlan(
      { camera: THUNDART_CAMERA_POSES.configure, configure: 0.5, departure: 0 },
      poseOf("inspect"),
      CLIPS,
    );
    const clip = partial.segments.find((s) => s.channel === "configure");
    // Rembobiner une demi-course coûte une demi-durée : le rythme est constant.
    expect(clip?.durationMs).toBeCloseTo(
      0.5 * THUNDART_MOTION_TIMING.configureRewindMs,
      6,
    );
  });
});

describe("échantillonnage déterministe", () => {
  it("atteint exactement la pose finale de l’état visé", () => {
    for (const from of THUNDART_SEQUENCE_STATES) {
      for (const to of THUNDART_SEQUENCE_STATES) {
        const plan = planBetween(from, to);
        const sample = sampleThundartMotion(plan, plan.totalMs);
        const expected = thundartFinalPose(to);

        expect(sample.done).toBe(true);
        expect(sample.configure).toBe(expected.configure);
        expect(sample.departure).toBe(expected.departure);
        expect(sample.camera).toEqual(expected.camera);
        expect(sample.flash).toBe(0);
      }
    }
  });

  it("donne la même pose finale quel que soit le pas de temps", () => {
    const plan = planBetween("configure", "departure");
    const slow = runPlan(plan, 100); // ~10 fps
    const fast = runPlan(plan, 4); // ~250 fps
    const uneven = runPlan(plan, 37);

    expect(slow.sample).toEqual(fast.sample);
    expect(uneven.sample).toEqual(fast.sample);
    expect(slow.sample.configure).toBe(1);
    expect(slow.sample.departure).toBe(1);
  });

  it("est une fonction pure du temps écoulé", () => {
    const plan = planBetween("inspect", "configure");
    for (const t of [0, 120, 500, 1234, 2000, plan.totalMs]) {
      expect(sampleThundartMotion(plan, t)).toEqual(
        sampleThundartMotion(plan, t),
      );
    }
  });

  it("progresse de façon monotone sur chaque canal de clip", () => {
    const plan = planBetween("overview", "configure");
    let previous = -1;
    for (let t = 0; t <= plan.totalMs; t += 25) {
      const value = sampleThundartMotion(plan, t).configure;
      expect(value).toBeGreaterThanOrEqual(previous);
      previous = value;
    }
  });

  it("borne les temps hors plage sans jamais dépasser la pose finale", () => {
    const plan = planBetween("configure", "departure");
    expect(sampleThundartMotion(plan, -500).departure).toBe(
      plan.from.departure,
    );
    expect(sampleThundartMotion(plan, plan.totalMs * 10).departure).toBe(1);
    expect(sampleThundartMotion(plan, Number.NaN).done).toBe(true);
  });

  it("garde le projectile immobile pendant la pause visuelle", () => {
    const plan = planBetween("configure", "departure");
    const pause = THUNDART_MOTION_TIMING.departurePauseMs;
    expect(sampleThundartMotion(plan, pause - 1).departure).toBe(0);
    expect(sampleThundartMotion(plan, pause).departure).toBe(0);
    expect(sampleThundartMotion(plan, pause + 400).departure).toBeGreaterThan(0);
  });

  it("n’allume le flash que pendant la séparation, et jamais à la fin", () => {
    const plan = planBetween("configure", "departure");
    const start = THUNDART_MOTION_TIMING.departurePauseMs;
    expect(sampleThundartMotion(plan, start).flash).toBe(0);
    expect(
      sampleThundartMotion(plan, start + THUNDART_MOTION_TIMING.flashMs / 2)
        .flash,
    ).toBeGreaterThan(0);
    expect(
      sampleThundartMotion(plan, start + THUNDART_MOTION_TIMING.flashMs).flash,
    ).toBe(0);
    expect(sampleThundartMotion(plan, plan.totalMs).flash).toBe(0);
  });

  it("termine en un nombre fini de frames, même à pas très fin", () => {
    for (const from of THUNDART_SEQUENCE_STATES) {
      for (const to of THUNDART_SEQUENCE_STATES) {
        const plan = planBetween(from, to);
        if (isInstantPlan(plan)) {
          expect(sampleThundartMotion(plan, 0).done).toBe(true);
          continue;
        }
        const { frames } = runPlan(plan, 1);
        expect(frames).toBeLessThanOrEqual(Math.ceil(plan.totalMs) + 1);
      }
    }
  });
});

describe("mouvement réduit", () => {
  it("rend chaque transition instantanée sans segment", () => {
    for (const from of THUNDART_SEQUENCE_STATES) {
      for (const to of THUNDART_SEQUENCE_STATES) {
        const plan = planBetween(from, to, true);
        expect(plan.totalMs).toBe(0);
        expect(plan.segments).toHaveLength(0);
        expect(isInstantPlan(plan)).toBe(true);
      }
    }
  });

  it("livre exactement la même information que le mouvement complet", () => {
    for (const from of THUNDART_SEQUENCE_STATES) {
      for (const to of THUNDART_SEQUENCE_STATES) {
        const reduced = sampleThundartMotion(planBetween(from, to, true), 0);
        const full = planBetween(from, to);
        const complete = sampleThundartMotion(full, full.totalMs);

        expect(reduced.camera).toEqual(complete.camera);
        expect(reduced.configure).toBe(complete.configure);
        expect(reduced.departure).toBe(complete.departure);
      }
    }
  });

  it("n’émet jamais de flash", () => {
    const plan = planBetween("configure", "departure", true);
    expect(plan.segments.some((s) => s.channel === "flash")).toBe(false);
    for (const t of [0, 10, 1000]) {
      expect(sampleThundartMotion(plan, t).flash).toBe(0);
    }
  });
});

describe("interruption et réinitialisation", () => {
  it("réinitialise depuis n’importe quel point d’une transition en cours", () => {
    const running = planBetween("configure", "departure");

    for (const cut of [0, 120, 640, 1500, running.totalMs]) {
      const mid = sampleThundartMotion(running, cut);
      const interrupted = buildThundartMotionPlan(
        {
          camera: mid.camera,
          configure: mid.configure,
          departure: mid.departure,
        },
        poseOf(THUNDART_INITIAL_STATE),
        CLIPS,
      );
      const settled = sampleThundartMotion(interrupted, interrupted.totalMs);

      expect(settled.done).toBe(true);
      expect(settled.configure).toBe(0);
      expect(settled.departure).toBe(0);
      expect(settled.camera).toEqual(THUNDART_CAMERA_POSES.overview);
    }
  });

  it("repart de la pose réelle en cours, sans à-coup", () => {
    const running = planBetween("inspect", "configure");
    const mid = sampleThundartMotion(running, 900);
    const interrupted = buildThundartMotionPlan(
      { camera: mid.camera, configure: mid.configure, departure: mid.departure },
      poseOf("overview"),
      CLIPS,
    );

    // Le nouveau plan démarre exactement là où l’ancien avait été coupé.
    expect(sampleThundartMotion(interrupted, 0).configure).toBeCloseTo(
      mid.configure,
      10,
    );
    expect(sampleThundartMotion(interrupted, 0).camera).toEqual(mid.camera);
  });

  it("converge vers la pose de l’état final après une rafale de changements", () => {
    const actions: ThundartSequenceAction[] = [
      { type: "NEXT" },
      { type: "NEXT" },
      { type: "NEXT" },
      { type: "PREVIOUS" },
      { type: "NEXT" },
      { type: "RESET" },
      { type: "NEXT" },
      { type: "NEXT" },
    ];

    let state: ThundartSequenceState = THUNDART_INITIAL_STATE;
    let pose = poseOf(state);

    for (const action of actions) {
      const next = thundartSequenceReducer(state, action);
      // Chaque changement coupe le précédent après seulement 60 ms.
      const plan = buildThundartMotionPlan(pose, poseOf(next), CLIPS);
      const cut = sampleThundartMotion(plan, 60);
      pose = {
        camera: cut.camera,
        configure: cut.configure,
        departure: cut.departure,
      };
      state = next;
    }

    // Dernier changement laissé aller jusqu’au bout : la pose doit être exacte.
    const final = buildThundartMotionPlan(pose, poseOf(state), CLIPS);
    const settled = sampleThundartMotion(final, final.totalMs);

    // L’invariant est l’alignement sur l’état atteint par le reducer, quel
    // qu’il soit — la rafale ne doit laisser aucune pose intermédiaire.
    expect(state).toBe("configure");
    expect(settled.configure).toBe(THUNDART_CLIP_POSES[state].configure);
    expect(settled.departure).toBe(THUNDART_CLIP_POSES[state].departure);
    expect(sameCameraPose(settled.camera, THUNDART_CAMERA_POSES[state])).toBe(
      true,
    );
  });

  it("atteint la même pose finale par le chemin long ou par un saut direct", () => {
    let stepwise = poseOf("overview");
    for (const state of ["inspect", "configure", "departure", "complete"] as const) {
      const plan = buildThundartMotionPlan(stepwise, poseOf(state), CLIPS);
      const sample = sampleThundartMotion(plan, plan.totalMs);
      stepwise = {
        camera: sample.camera,
        configure: sample.configure,
        departure: sample.departure,
      };
    }

    const direct = sampleThundartMotion(
      buildThundartMotionPlan(poseOf("overview"), poseOf("complete"), CLIPS),
      Number.POSITIVE_INFINITY,
    );

    expect(stepwise.configure).toBe(direct.configure);
    expect(stepwise.departure).toBe(direct.departure);
    expect(stepwise.camera).toEqual(direct.camera);
  });
});

describe("primitives numériques", () => {
  it("easeInOut est borné, monotone et ancré aux extrémités", () => {
    expect(easeInOut(0)).toBe(0);
    expect(easeInOut(1)).toBe(1);
    expect(easeInOut(-3)).toBe(0);
    expect(easeInOut(4)).toBe(1);
    let previous = -1;
    for (let t = 0; t <= 1.0001; t += 0.02) {
      const value = easeInOut(t);
      expect(value).toBeGreaterThanOrEqual(previous);
      expect(value).toBeLessThanOrEqual(1);
      previous = value;
    }
  });

  it("flashPulse s’éteint aux deux bords et culmine à 1", () => {
    expect(flashPulse(0)).toBe(0);
    expect(flashPulse(1)).toBe(0);
    expect(flashPulse(0.16)).toBeCloseTo(1, 6);
    let peak = 0;
    for (let t = 0; t <= 1; t += 0.01) {
      const value = flashPulse(t);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(1);
      peak = Math.max(peak, value);
    }
    expect(peak).toBeCloseTo(1, 6);
  });

  it("framingScaleForAspect recule seulement sur les cadres étroits", () => {
    expect(framingScaleForAspect(16 / 9)).toBe(1);
    expect(framingScaleForAspect(1)).toBe(1);
    expect(framingScaleForAspect(0.5)).toBe(2);
    expect(framingScaleForAspect(0.2)).toBe(2.1); // borné
    expect(framingScaleForAspect(0)).toBe(1);
    expect(framingScaleForAspect(Number.NaN)).toBe(1);
  });
});
