import { describe, expect, it } from "vitest";
import {
  PATRIOT_SEQUENCE_STATES,
  type PatriotSequenceState,
} from "@/data/hud/patriot";
import { PATRIOT_LAUNCH_TIMING } from "@/data/hud/patriot-launch";
import {
  PATRIOT_CAMERA_POSES,
  PATRIOT_CLIP_POSES,
  PATRIOT_LAUNCH_CLOCK,
  PATRIOT_MOTION_TIMING,
  buildPatriotMotionPlan,
  easeInOut,
  everyStateHasMotionPose,
  framingScaleForAspect,
  isInstantPlan,
  launchSegmentMs,
  launchTimeAt,
  patriotPoseForState,
  samplePatriotMotion,
  trackingWeight,
  type PatriotMotionPlan,
  type PatriotMotionSample,
} from "@/data/hud/patriot-motion";

const CLIPS = { emplaceMs: 6625, elevateMs: 3958 };

function planBetween(
  from: PatriotSequenceState,
  to: PatriotSequenceState,
  reducedMotion = false,
): PatriotMotionPlan {
  return buildPatriotMotionPlan(patriotPoseForState(from), patriotPoseForState(to), CLIPS, {
    reducedMotion,
  });
}

function runPlan(plan: PatriotMotionPlan, stepMs: number | (() => number)) {
  let elapsed = 0;
  let frames = 0;
  let last = samplePatriotMotion(plan, 0);
  while (!last.done) {
    if (frames > 200_000) throw new Error("plan non convergent");
    const step = typeof stepMs === "function" ? stepMs() : stepMs;
    elapsed = Math.min(elapsed + step, plan.totalMs);
    last = samplePatriotMotion(plan, elapsed);
    frames += 1;
  }
  return { sample: last, frames };
}

function poseOfSample(sample: PatriotMotionSample) {
  return {
    camera: sample.camera,
    emplace: sample.emplace,
    elevate: sample.elevate,
    launch: sample.launch,
  };
}

describe("poses de mouvement Patriot", () => {
  it("définit un cadrage et un avancement de clips pour chaque état", () => {
    expect(everyStateHasMotionPose()).toBe(true);
  });

  it("n’engage la mise à feu qu’après la mise en batterie et l’élévation", () => {
    for (const state of PATRIOT_SEQUENCE_STATES) {
      const pose = PATRIOT_CLIP_POSES[state];
      if (pose.launch > 0) {
        expect(pose.emplace).toBe(1);
        expect(pose.elevate).toBe(1);
      }
      if (pose.elevate > 0) expect(pose.emplace).toBe(1);
    }
    expect(PATRIOT_CLIP_POSES.overview).toEqual({ emplace: 0, elevate: 0, launch: 0 });
    expect(PATRIOT_CLIP_POSES.inspect).toEqual({ emplace: 0, elevate: 0, launch: 0 });
  });

  it("fait progresser chaque canal de façon monotone le long du récit", () => {
    for (let i = 1; i < PATRIOT_SEQUENCE_STATES.length; i += 1) {
      const a = PATRIOT_CLIP_POSES[PATRIOT_SEQUENCE_STATES[i - 1]];
      const b = PATRIOT_CLIP_POSES[PATRIOT_SEQUENCE_STATES[i]];
      expect(b.emplace).toBeGreaterThanOrEqual(a.emplace);
      expect(b.elevate).toBeGreaterThanOrEqual(a.elevate);
      expect(b.launch).toBeGreaterThanOrEqual(a.launch);
    }
    expect(PATRIOT_CLIP_POSES.fire.launch).toBe(PATRIOT_LAUNCH_TIMING.fireFreezeS);
    expect(PATRIOT_CLIP_POSES.launch.launch).toBe(PATRIOT_LAUNCH_TIMING.launchFreezeS);
    expect(PATRIOT_CLIP_POSES.complete.launch).toBe(PATRIOT_LAUNCH_TIMING.endS);
  });

  it("donne un cadrage distinct à chaque état, caméra au-dessus du sol", () => {
    const keys = new Set(
      PATRIOT_SEQUENCE_STATES.map((state) => JSON.stringify(PATRIOT_CAMERA_POSES[state])),
    );
    expect(keys.size).toBe(PATRIOT_SEQUENCE_STATES.length);
    for (const state of PATRIOT_SEQUENCE_STATES) {
      expect(PATRIOT_CAMERA_POSES[state].position[1]).toBeGreaterThan(2);
    }
  });
});

describe("plans de transition", () => {
  it("atteint exactement la pose finale pour toutes les paires d’états", () => {
    for (const from of PATRIOT_SEQUENCE_STATES) {
      for (const to of PATRIOT_SEQUENCE_STATES) {
        const { sample } = runPlan(planBetween(from, to), 16.7);
        expect(poseOfSample(sample)).toEqual(patriotPoseForState(to));
        expect(sample.track).toBe(0);
      }
    }
  });

  it("reste instantané sous mouvement réduit, avec exactement la même information", () => {
    for (const from of PATRIOT_SEQUENCE_STATES) {
      for (const to of PATRIOT_SEQUENCE_STATES) {
        const plan = planBetween(from, to, true);
        expect(isInstantPlan(plan)).toBe(true);
        expect(poseOfSample(samplePatriotMotion(plan, 0))).toEqual(
          poseOfSample(runPlan(planBetween(from, to), 33).sample),
        );
      }
    }
  });

  it("ne dépend pas du framerate", () => {
    const plan = planBetween("overview", "complete");
    let toggle = false;
    const irregular = () => {
      toggle = !toggle;
      return toggle ? 7 : 41;
    };
    const a = runPlan(plan, 10).sample;
    const b = runPlan(plan, 4).sample;
    const c = runPlan(plan, irregular).sample;
    expect(a).toEqual(b);
    expect(a).toEqual(c);
    // Pureté : même temps écoulé, même pose.
    expect(samplePatriotMotion(plan, 1234)).toEqual(samplePatriotMotion(plan, 1234));
  });

  it("enchaîne mise en batterie, élévation puis allumage en marche avant", () => {
    const plan = planBetween("inspect", "fire");
    const emplace = plan.segments.find((s) => s.channel === "emplace")!;
    const elevate = plan.segments.find((s) => s.channel === "elevate")!;
    const launch = plan.segments.find((s) => s.channel === "launch")!;
    expect(elevate.startMs).toBeGreaterThanOrEqual(emplace.startMs + emplace.durationMs);
    expect(launch.startMs).toBeGreaterThanOrEqual(elevate.startMs + elevate.durationMs);
    expect(plan.trackLaunch).toBe(false);
  });

  it("ne « rembobine » jamais un départ : la chronologie de tir revient d’un coup", () => {
    const plan = planBetween("complete", "elevate");
    const launch = plan.segments.find((s) => s.channel === "launch")!;
    expect(launch.durationMs).toBe(0);
    expect(samplePatriotMotion(plan, 0).launch).toBe(0);
  });

  it("redescend puis défait la mise en batterie, plus vite qu’à l’aller", () => {
    const back = planBetween("elevate", "inspect");
    const forward = planBetween("inspect", "elevate");
    const elevateBack = back.segments.find((s) => s.channel === "elevate")!;
    const emplaceBack = back.segments.find((s) => s.channel === "emplace")!;
    expect(emplaceBack.startMs).toBeGreaterThanOrEqual(
      elevateBack.startMs + elevateBack.durationMs,
    );
    expect(back.totalMs).toBeLessThan(forward.totalMs);
    expect(PATRIOT_MOTION_TIMING.elevateRewindMs).toBeLessThan(CLIPS.elevateMs);
  });

  it("borne la durée de chaque pas du récit", () => {
    for (let i = 1; i < PATRIOT_SEQUENCE_STATES.length; i += 1) {
      const forward = planBetween(PATRIOT_SEQUENCE_STATES[i - 1], PATRIOT_SEQUENCE_STATES[i]);
      const backward = planBetween(PATRIOT_SEQUENCE_STATES[i], PATRIOT_SEQUENCE_STATES[i - 1]);
      expect(forward.totalMs).toBeLessThanOrEqual(8000);
      expect(backward.totalMs).toBeLessThanOrEqual(3000);
    }
    expect(planBetween("complete", "overview").totalMs).toBeLessThanOrEqual(3000);
  });

  it("suit l’intercepteur pendant le départ, puis rend la main au cadrage de l’état", () => {
    const plan = planBetween("fire", "launch");
    expect(plan.trackLaunch).toBe(true);
    const mid = samplePatriotMotion(plan, plan.totalMs * 0.4);
    expect(mid.track).toBeGreaterThan(0.9);
    expect(samplePatriotMotion(plan, plan.totalMs).track).toBe(0);
    expect(trackingWeight(0)).toBe(0);
    expect(trackingWeight(1)).toBe(0);
  });

  it("repart sans à-coup d’une transition interrompue", () => {
    const first = planBetween("emplace", "elevate");
    const cut = samplePatriotMotion(first, first.totalMs * 0.37);
    const resumed = buildPatriotMotionPlan(poseOfSample(cut), patriotPoseForState("inspect"), CLIPS);
    const start = samplePatriotMotion(resumed, 0);
    expect(start.emplace).toBeCloseTo(cut.emplace, 10);
    expect(start.elevate).toBeCloseTo(cut.elevate, 10);
    expect(start.camera).toEqual(cut.camera);
    expect(poseOfSample(runPlan(resumed, 16).sample)).toEqual(patriotPoseForState("inspect"));
  });
});

describe("horloge de tir", () => {
  it("ralentit l’allumage puis le départ, et revient au temps réel", () => {
    expect(PATRIOT_LAUNCH_CLOCK.map(([, , rate]) => rate)).toEqual([0.4, 0.6, 1]);
    expect(launchSegmentMs(0, PATRIOT_LAUNCH_TIMING.fireFreezeS)).toBeCloseTo(900, 6);
    expect(
      launchSegmentMs(PATRIOT_LAUNCH_TIMING.launchFreezeS, PATRIOT_LAUNCH_TIMING.endS),
    ).toBeCloseTo((PATRIOT_LAUNCH_TIMING.endS - PATRIOT_LAUNCH_TIMING.launchFreezeS) * 1000, 6);
  });

  it("est l’inverse exact de sa propre durée, et monotone", () => {
    const pairs: [number, number][] = [
      [0, PATRIOT_LAUNCH_TIMING.endS],
      [0, PATRIOT_LAUNCH_TIMING.fireFreezeS],
      [PATRIOT_LAUNCH_TIMING.fireFreezeS, PATRIOT_LAUNCH_TIMING.launchFreezeS],
      [0.2, 3.1],
    ];
    for (const [from, to] of pairs) {
      const total = launchSegmentMs(from, to);
      expect(launchTimeAt(from, to, total)).toBeCloseTo(to, 9);
      expect(launchTimeAt(from, to, 0)).toBeCloseTo(from, 9);
      let previous = from;
      for (let ms = 0; ms <= total; ms += total / 50) {
        const t = launchTimeAt(from, to, ms);
        expect(t).toBeGreaterThanOrEqual(previous - 1e-9);
        previous = t;
      }
    }
  });
});

describe("primitives", () => {
  it("amortit sans dépasser et recule sur les cadres étroits", () => {
    expect(easeInOut(0)).toBe(0);
    expect(easeInOut(1)).toBe(1);
    expect(easeInOut(0.5)).toBeCloseTo(0.5, 10);
    expect(framingScaleForAspect(1.6)).toBe(1);
    expect(framingScaleForAspect(0.5)).toBe(2);
    expect(framingScaleForAspect(0.2)).toBe(2);
    expect(framingScaleForAspect(Number.NaN)).toBe(1);
  });
});
