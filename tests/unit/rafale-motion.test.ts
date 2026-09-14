import { describe, expect, it } from "vitest";
import {
  RAFALE_SCENARIOS,
  RAFALE_SEQUENCE_STATES,
  rafaleStateIndex,
  type RafaleScenario,
  type RafaleSequenceState,
} from "@/data/hud/rafale";
import { RAFALE_SHOTS } from "@/data/hud/rafale-launch";
import {
  RAFALE_BANK,
  RAFALE_CAMERA_POSES,
  RAFALE_DESIGN_ASPECT,
  RAFALE_MOTION_TIMING,
  buildRafaleMotionPlan,
  clamp01,
  easeInOut,
  everyStateHasMotionPose,
  framingScaleForAspect,
  isInstantPlan,
  launchClock,
  launchSegmentMs,
  launchTimeAt,
  rafaleLaunchTimeForState,
  rafalePoseForState,
  sameCameraPose,
  sampleRafaleMotion,
  smoothstep,
  trackingWeight,
  type RafaleMotionPlan,
  type RafaleMotionSample,
} from "@/data/hud/rafale-motion";

const OBSERVATION_STATES = ["overview", "inspect", "sensors"] as const;

function planBetween(
  scenario: RafaleScenario,
  from: RafaleSequenceState,
  to: RafaleSequenceState,
  reducedMotion = false,
): RafaleMotionPlan {
  return buildRafaleMotionPlan(
    scenario,
    rafalePoseForState(from, scenario),
    rafalePoseForState(to, scenario),
    { reducedMotion },
  );
}

/** Rejoue un plan à pas fixe ou irrégulier ; garde chaque échantillon visité. */
function runPlan(plan: RafaleMotionPlan, stepMs: number | (() => number)) {
  let elapsed = 0;
  let frames = 0;
  let last = sampleRafaleMotion(plan, 0);
  const visited = new Map<number, RafaleMotionSample>([[0, last]]);
  while (!last.done) {
    if (frames > 200_000) throw new Error("plan non convergent");
    const step = typeof stepMs === "function" ? stepMs() : stepMs;
    elapsed = Math.min(elapsed + step, plan.totalMs);
    last = sampleRafaleMotion(plan, elapsed);
    visited.set(elapsed, last);
    frames += 1;
  }
  return { sample: last, frames, visited };
}

function irregularSteps() {
  let toggle = false;
  return () => {
    toggle = !toggle;
    return toggle ? 7 : 41;
  };
}

function poseOfSample(sample: RafaleMotionSample) {
  return {
    camera: sample.camera,
    bank: sample.bank,
    sensors: sample.sensors,
    launch: sample.launch,
  };
}

function segment(plan: RafaleMotionPlan, channel: RafaleMotionPlan["segments"][number]["channel"]) {
  return plan.segments.find((candidate) => candidate.channel === channel);
}

describe("poses de mouvement Rafale", () => {
  it("définit un cadrage, une inclinaison et un temps de tir pour chaque scénario et chaque état", () => {
    expect(everyStateHasMotionPose()).toBe(true);
    for (const scenario of RAFALE_SCENARIOS) {
      for (const state of RAFALE_SEQUENCE_STATES) {
        const pose = rafalePoseForState(state, scenario);
        const numbers = [
          ...pose.camera.position,
          ...pose.camera.target,
          pose.bank,
          pose.sensors,
          pose.launch,
        ];
        expect(pose.camera.position).toHaveLength(3);
        expect(pose.camera.target).toHaveLength(3);
        for (const value of numbers) expect(Number.isFinite(value), `${scenario}/${state}`).toBe(true);
      }
    }
  });

  it("donne un cadrage distinct à chaque état, dans chaque scénario", () => {
    for (const scenario of RAFALE_SCENARIOS) {
      const keys = new Set(
        RAFALE_SEQUENCE_STATES.map((state) => JSON.stringify(RAFALE_CAMERA_POSES[scenario][state])),
      );
      expect(keys.size, scenario).toBe(RAFALE_SEQUENCE_STATES.length);
      for (let i = 1; i < RAFALE_SEQUENCE_STATES.length; i += 1) {
        const a = RAFALE_CAMERA_POSES[scenario][RAFALE_SEQUENCE_STATES[i - 1]];
        const b = RAFALE_CAMERA_POSES[scenario][RAFALE_SEQUENCE_STATES[i]];
        expect(sameCameraPose(a, b)).toBe(false);
      }
    }
  });

  it("garde le même cadrage d’observation quel que soit le scénario choisi", () => {
    for (const state of OBSERVATION_STATES) {
      for (const scenario of RAFALE_SCENARIOS) {
        // Capteurs en combat rapproché : l'avion est déjà incliné à 55°, le
        // cadrage est repris pour garder l'aile basse dans le champ.
        if (scenario === "wvr" && state === "sensors") continue;
        expect(
          sameCameraPose(RAFALE_CAMERA_POSES[scenario][state], RAFALE_CAMERA_POSES.bvr[state]),
          `${scenario}/${state}`,
        ).toBe(true);
      }
    }
    expect(
      sameCameraPose(RAFALE_CAMERA_POSES.wvr.sensors, RAFALE_CAMERA_POSES.bvr.sensors),
    ).toBe(false);
  });

  it("n’incline l’avion qu’en combat rapproché, à partir des capteurs", () => {
    for (const scenario of RAFALE_SCENARIOS) {
      for (const state of RAFALE_SEQUENCE_STATES) {
        const bank = RAFALE_BANK[scenario][state];
        const banked = scenario === "wvr" && rafaleStateIndex(state) >= rafaleStateIndex("sensors");
        if (banked) {
          expect(bank, `${scenario}/${state}`).not.toBe(0);
          expect(Math.abs(bank)).toBeLessThanOrEqual(90);
          expect(bank).toBe(RAFALE_BANK.wvr.sensors);
        } else {
          expect(bank, `${scenario}/${state}`).toBe(0);
        }
        expect(rafalePoseForState(state, scenario).bank).toBe(bank);
      }
    }
  });

  it("n’affiche les secteurs des capteurs que dans l’état « capteurs »", () => {
    for (const scenario of RAFALE_SCENARIOS) {
      for (const state of RAFALE_SEQUENCE_STATES) {
        expect(rafalePoseForState(state, scenario).sensors).toBe(state === "sensors" ? 1 : 0);
      }
    }
  });

  it("fait progresser la chronologie de tir le long du récit, sur les temps figés déclarés", () => {
    for (const scenario of RAFALE_SCENARIOS) {
      const shot = RAFALE_SHOTS[scenario];
      const times = RAFALE_SEQUENCE_STATES.map((state) => rafalePoseForState(state, scenario).launch);
      for (let i = 1; i < times.length; i += 1) {
        expect(times[i], scenario).toBeGreaterThanOrEqual(times[i - 1]);
      }
      expect(times).toEqual([0, 0, 0, shot.releaseFreezeS, shot.launchFreezeS, shot.endS]);
      for (const state of RAFALE_SEQUENCE_STATES) {
        expect(rafaleLaunchTimeForState(scenario, state)).toBe(
          rafalePoseForState(state, scenario).launch,
        );
      }
    }
  });
});

describe("plans de transition", () => {
  it("atteint exactement la pose finale pour toutes les paires d’états, dans chaque scénario", () => {
    for (const scenario of RAFALE_SCENARIOS) {
      for (const from of RAFALE_SEQUENCE_STATES) {
        for (const to of RAFALE_SEQUENCE_STATES) {
          const { sample } = runPlan(planBetween(scenario, from, to), 16.7);
          expect(poseOfSample(sample), `${scenario}: ${from} → ${to}`).toEqual(
            rafalePoseForState(to, scenario),
          );
          expect(sample.track).toBe(0);
          expect(sample.done).toBe(true);
        }
      }
    }
  });

  it("ne bouge pas sans changement d’état", () => {
    for (const scenario of RAFALE_SCENARIOS) {
      for (const state of RAFALE_SEQUENCE_STATES) {
        const plan = planBetween(scenario, state, state);
        expect(plan.segments).toEqual([]);
        expect(isInstantPlan(plan)).toBe(true);
      }
    }
  });

  it("reste instantané sous mouvement réduit, avec exactement la même information", () => {
    for (const scenario of RAFALE_SCENARIOS) {
      for (const from of RAFALE_SEQUENCE_STATES) {
        for (const to of RAFALE_SEQUENCE_STATES) {
          const plan = planBetween(scenario, from, to, true);
          expect(isInstantPlan(plan)).toBe(true);
          expect(plan.segments).toEqual([]);
          expect(plan.trackLaunch).toBe(false);
          const first = sampleRafaleMotion(plan, 0);
          expect(first.done).toBe(true);
          expect(poseOfSample(first)).toEqual(
            poseOfSample(runPlan(planBetween(scenario, from, to), 33).sample),
          );
        }
      }
    }
  });

  it("borne chaque pas du récit en marche avant", () => {
    for (const scenario of RAFALE_SCENARIOS) {
      for (let i = 1; i < RAFALE_SEQUENCE_STATES.length; i += 1) {
        const from = RAFALE_SEQUENCE_STATES[i - 1];
        const to = RAFALE_SEQUENCE_STATES[i];
        const plan = planBetween(scenario, from, to);
        expect(plan.totalMs, `${scenario}: ${from} → ${to}`).toBeGreaterThan(0);
        expect(plan.totalMs, `${scenario}: ${from} → ${to}`).toBeLessThanOrEqual(10_000);
        const { sample } = runPlan(plan, 16.7);
        expect(poseOfSample(sample)).toEqual(rafalePoseForState(to, scenario));
      }
    }
  });

  it("ne « rembobine » jamais un départ : la chronologie revient d’un coup, en 3 s au plus", () => {
    for (const scenario of RAFALE_SCENARIOS) {
      const retreats: [RafaleSequenceState, RafaleSequenceState][] = [];
      for (let i = 1; i < RAFALE_SEQUENCE_STATES.length; i += 1) {
        retreats.push([RAFALE_SEQUENCE_STATES[i], RAFALE_SEQUENCE_STATES[i - 1]]);
      }
      retreats.push(["complete", "overview"], ["launch", "inspect"]);
      for (const [from, to] of retreats) {
        const plan = planBetween(scenario, from, to);
        const label = `${scenario}: ${from} → ${to}`;
        expect(plan.totalMs, label).toBeLessThanOrEqual(3000);
        const target = rafalePoseForState(to, scenario);
        if (target.launch < rafalePoseForState(from, scenario).launch) {
          const launch = segment(plan, "launch");
          expect(launch, label).toBeDefined();
          expect(launch?.durationMs, label).toBe(0);
          expect(launch?.startMs, label).toBe(0);
          expect(sampleRafaleMotion(plan, 0).launch, label).toBe(target.launch);
        }
        expect(plan.trackLaunch).toBe(false);
      }
    }
  });

  it("remet l’avion à plat plus vite qu’il ne s’est incliné, après un départ", () => {
    const back = planBetween("wvr", "complete", "overview");
    const forward = planBetween("wvr", "inspect", "sensors");
    const bankBack = segment(back, "bank");
    const bankForward = segment(forward, "bank");
    expect(bankBack?.durationMs).toBeCloseTo(RAFALE_MOTION_TIMING.bankRewindMs, 9);
    expect(bankForward?.durationMs).toBeCloseTo(RAFALE_MOTION_TIMING.bankMs, 9);
    expect(bankBack!.durationMs).toBeLessThan(bankForward!.durationMs);
  });

  it("n’ordonne la séparation qu’une fois l’avion incliné et le temps d’armement écoulé", () => {
    for (const scenario of RAFALE_SCENARIOS) {
      for (const from of ["overview", "inspect", "sensors"] as const) {
        const plan = planBetween(scenario, from, "release");
        const launch = segment(plan, "launch")!;
        const bank = segment(plan, "bank");
        expect(launch.startMs).toBeGreaterThanOrEqual(RAFALE_MOTION_TIMING.armingMs);
        if (bank) expect(launch.startMs).toBeGreaterThanOrEqual(bank.startMs + bank.durationMs);
        // La séparation figée n'est pas suivie par la caméra : on regarde le point d'emport.
        expect(plan.trackLaunch).toBe(false);
      }
    }
    expect(segment(planBetween("wvr", "inspect", "release"), "bank")).toBeDefined();
  });

  it("ne dépend pas du framerate : même temps écoulé, même échantillon", () => {
    for (const scenario of RAFALE_SCENARIOS) {
      const plan = planBetween(scenario, "overview", "complete");
      const a = runPlan(plan, 10);
      const b = runPlan(plan, 4);
      const c = runPlan(plan, irregularSteps());
      const shared = [...a.visited.keys()].filter((ms) => b.visited.has(ms) && c.visited.has(ms));
      expect(shared.length, scenario).toBeGreaterThan(10);
      expect(shared).toContain(plan.totalMs);
      for (const ms of shared) {
        expect(b.visited.get(ms), `${scenario} @ ${ms} ms`).toEqual(a.visited.get(ms));
        expect(c.visited.get(ms), `${scenario} @ ${ms} ms`).toEqual(a.visited.get(ms));
      }
      expect(a.sample).toEqual(b.sample);
      expect(a.sample).toEqual(c.sample);
      // Pureté : même temps écoulé, même pose.
      expect(sampleRafaleMotion(plan, 1234)).toEqual(sampleRafaleMotion(plan, 1234));
    }
  });

  it("suit la munition pendant le départ, puis rend la main au cadrage de l’état", () => {
    for (const scenario of RAFALE_SCENARIOS) {
      for (const [from, to] of [
        ["release", "launch"],
        ["launch", "complete"],
      ] as const) {
        const plan = planBetween(scenario, from, to);
        expect(plan.trackLaunch, `${scenario}: ${from} → ${to}`).toBe(true);
        const launch = segment(plan, "launch")!;
        const mid = sampleRafaleMotion(plan, launch.startMs + launch.durationMs * 0.4);
        expect(mid.track).toBeGreaterThan(0.9);
        expect(sampleRafaleMotion(plan, plan.totalMs).track).toBe(0);
      }
    }
    expect(trackingWeight(0)).toBe(0);
    expect(trackingWeight(1)).toBe(0);
    for (let p = 0; p <= 1; p += 0.01) {
      const weight = trackingWeight(p);
      expect(weight).toBeGreaterThanOrEqual(0);
      expect(weight).toBeLessThanOrEqual(1);
    }
  });

  it("repart sans à-coup d’une transition interrompue", () => {
    // Mise en virage et apparition des capteurs coupées en route, retour à la vue d'ensemble.
    const first = planBetween("wvr", "inspect", "sensors");
    const cut = sampleRafaleMotion(first, first.totalMs * 0.37);
    expect(cut.done).toBe(false);
    const resumed = buildRafaleMotionPlan("wvr", poseOfSample(cut), rafalePoseForState("overview", "wvr"));
    const start = sampleRafaleMotion(resumed, 0);
    expect(start.camera).toEqual(cut.camera);
    expect(start.bank).toBeCloseTo(cut.bank, 10);
    expect(start.sensors).toBeCloseTo(cut.sensors, 10);
    expect(start.launch).toBe(cut.launch);
    expect(poseOfSample(runPlan(resumed, 16).sample)).toEqual(rafalePoseForState("overview", "wvr"));
  });

  it("reprend un départ interrompu là où il en était", () => {
    const first = planBetween("bvr", "release", "launch");
    const cut = sampleRafaleMotion(first, first.totalMs * 0.5);
    expect(cut.launch).toBeGreaterThan(RAFALE_SHOTS.bvr.releaseFreezeS);
    expect(cut.launch).toBeLessThan(RAFALE_SHOTS.bvr.launchFreezeS);
    const resumed = buildRafaleMotionPlan("bvr", poseOfSample(cut), rafalePoseForState("complete", "bvr"));
    const start = sampleRafaleMotion(resumed, 0);
    expect(start.launch).toBeCloseTo(cut.launch, 10);
    expect(start.camera).toEqual(cut.camera);
    expect(poseOfSample(runPlan(resumed, 16).sample)).toEqual(rafalePoseForState("complete", "bvr"));
  });
});

describe("horloge de tir", () => {
  it("ralentit la séparation, puis le départ, et revient au temps réel", () => {
    for (const scenario of RAFALE_SCENARIOS) {
      const shot = RAFALE_SHOTS[scenario];
      const clock = launchClock(scenario);
      expect(clock.map(([, , rate]) => rate)).toEqual([0.35, 0.6, 1]);
      expect(clock[0][0]).toBe(0);
      for (let i = 1; i < clock.length; i += 1) expect(clock[i][0]).toBe(clock[i - 1][1]);
      expect(clock[clock.length - 1][1]).toBe(Number.POSITIVE_INFINITY);
      expect(launchSegmentMs(scenario, 0, shot.releaseFreezeS)).toBeCloseTo(
        (shot.releaseFreezeS / 0.35) * 1000,
        6,
      );
      expect(launchSegmentMs(scenario, shot.launchFreezeS, shot.endS)).toBeCloseTo(
        (shot.endS - shot.launchFreezeS) * 1000,
        6,
      );
    }
  });

  it("est l’inverse exact de sa propre durée, monotone et bornée", () => {
    for (const scenario of RAFALE_SCENARIOS) {
      const shot = RAFALE_SHOTS[scenario];
      const pairs: [number, number][] = [
        [0, shot.endS],
        [0, shot.releaseFreezeS],
        [shot.releaseFreezeS, shot.launchFreezeS],
        [shot.launchFreezeS, shot.endS],
        [0.2, 3.1],
      ];
      for (const [from, to] of pairs) {
        const total = launchSegmentMs(scenario, from, to);
        expect(total).toBeGreaterThan(0);
        expect(launchTimeAt(scenario, from, to, total), `${scenario} ${from}→${to}`).toBeCloseTo(to, 9);
        expect(launchTimeAt(scenario, from, to, 0)).toBeCloseTo(from, 9);
        expect(launchTimeAt(scenario, from, to, -50)).toBeCloseTo(from, 9);
        expect(launchTimeAt(scenario, from, to, total * 3)).toBe(to);
        let previous = from;
        for (let ms = 0; ms <= total; ms += total / 50) {
          const t = launchTimeAt(scenario, from, to, ms);
          expect(t).toBeGreaterThanOrEqual(previous - 1e-9);
          expect(t).toBeLessThanOrEqual(to + 1e-9);
          previous = t;
        }
      }
    }
  });
});

describe("primitives", () => {
  it("amortit sans dépasser et recule sur les cadres étroits", () => {
    expect(easeInOut(0)).toBe(0);
    expect(easeInOut(1)).toBe(1);
    expect(easeInOut(0.5)).toBeCloseTo(0.5, 10);
    expect(easeInOut(-1)).toBe(0);
    expect(easeInOut(2)).toBe(1);
    expect(clamp01(Number.NaN)).toBe(0);
    expect(clamp01(1.5)).toBe(1);
    expect(smoothstep(0, 1, 0.5)).toBeCloseTo(0.5, 10);
    expect(framingScaleForAspect(1.6)).toBe(1);
    expect(framingScaleForAspect(RAFALE_DESIGN_ASPECT)).toBe(1);
    expect(framingScaleForAspect(1)).toBeCloseTo(RAFALE_DESIGN_ASPECT, 10);
    expect(framingScaleForAspect(0.5)).toBe(2);
    expect(framingScaleForAspect(0.2)).toBe(2);
    expect(framingScaleForAspect(0)).toBe(1);
    expect(framingScaleForAspect(Number.NaN)).toBe(1);
  });
});
