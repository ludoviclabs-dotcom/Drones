import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  RAFALE_ASSET_MANIFEST,
  RAFALE_SCENARIOS,
  type RafaleScenario,
} from "@/data/hud/rafale";
import {
  RAFALE_PARTICLE_BUDGET,
  RAFALE_SEPARATION,
  RAFALE_SHOTS,
  RESTING_SHOT,
  createShotParticles,
  flameFlicker,
  forwardTravel,
  mulberry32,
  nozzlePoint,
  samplePuff,
  shotCenter,
  shotState,
  type PuffSeed,
  type Vec3,
} from "@/data/hud/rafale-launch";

// Points d'emport au repos, repère avion (+X aile droite, +Y haut, nez vers -Z) :
// mêmes ordres de grandeur que les nœuds du GLB.
const REST: Record<RafaleScenario, Vec3> = {
  bvr: [0.74, -0.93, 2.6],
  wvr: [-5.31, -0.12, 3.8],
  sead: [3.05, -0.61, 2.95],
};

/** Instant d'émission d'une bouffée (s de chronologie). */
function bornAt(puff: PuffSeed, scenario: RafaleScenario): number {
  return puff.kind === "puff" ? puff.spawn : RAFALE_SHOTS[scenario].ignitionS + puff.spawn;
}

function range(from: number, to: number, step: number): number[] {
  const values: number[] = [];
  for (let i = 0; from + i * step <= to + 1e-12; i += 1) values.push(from + i * step);
  return values;
}

describe("profils de tir", () => {
  it("ordonne séparation, départ et fin, allumage compris avant le départ", () => {
    for (const scenario of RAFALE_SCENARIOS) {
      const shot = RAFALE_SHOTS[scenario];
      expect(shot.releaseFreezeS).toBeGreaterThan(0);
      expect(shot.launchFreezeS).toBeGreaterThan(shot.releaseFreezeS);
      expect(shot.endS).toBeGreaterThan(shot.launchFreezeS);
      expect(shot.ignitionS).toBeGreaterThan(0);
      expect(shot.ignitionS).toBeLessThan(shot.launchFreezeS);
      expect(shot.ignitionS + shot.burnS).toBeLessThan(shot.endS);
      expect(shot.accel).toBeGreaterThan(0);
    }
    expect(RAFALE_SCENARIOS.map((scenario) => RAFALE_SHOTS[scenario].kind)).toEqual([
      "ejection",
      "rail",
      "drop",
    ]);
    expect(RAFALE_SCENARIOS.filter((scenario) => RAFALE_SHOTS[scenario].sustain)).toEqual(["bvr"]);
  });

  it("reprend les longueurs de munition du manifeste", () => {
    const { lengths } = RAFALE_ASSET_MANIFEST;
    expect(RAFALE_SHOTS.bvr.length).toBe(lengths.meteor);
    expect(RAFALE_SHOTS.wvr.length).toBe(lengths.mica);
    expect(RAFALE_SHOTS.sead.length).toBe(lengths.hammer);
  });
});

describe("état de la munition le long de la chronologie", () => {
  it("reste au repos tant que l’ordre de séparation n’est pas donné", () => {
    for (const scenario of RAFALE_SCENARIOS) {
      for (const t of [0, -0.5, Number.NEGATIVE_INFINITY, Number.NaN]) {
        expect(shotState(scenario, t)).toBe(RESTING_SHOT);
        expect(forwardTravel(scenario, t)).toBe(0);
      }
    }
    expect(RESTING_SHOT).toEqual({
      offset: [0, 0, 0],
      pitch: 0,
      flame: 0,
      released: false,
      ignited: false,
    });
  });

  it("fige la séparation avant l’allumage, sauf au départ du rail", () => {
    for (const scenario of RAFALE_SCENARIOS) {
      const state = shotState(scenario, RAFALE_SHOTS[scenario].releaseFreezeS);
      expect(state.released, scenario).toBe(true);
      expect(state.ignited, scenario).toBe(scenario === "wvr");
      if (!state.ignited) expect(state.flame).toBe(0);
    }
  });

  it("montre au « départ » une munition allumée, devant son point d’emport", () => {
    for (const scenario of RAFALE_SCENARIOS) {
      const shot = RAFALE_SHOTS[scenario];
      const atLaunch = shotState(scenario, shot.launchFreezeS);
      expect(atLaunch.ignited, scenario).toBe(true);
      expect(atLaunch.flame).toBeGreaterThan(0);
      expect(atLaunch.offset[2], scenario).toBeLessThan(0);
      expect(atLaunch.offset[0]).toBe(0);
      const atEnd = shotState(scenario, shot.endS);
      expect(atEnd.offset[2]).toBeLessThan(atLaunch.offset[2]);
      for (const t of range(0.01, shot.endS, 0.01)) {
        expect(shotState(scenario, t).offset[2]).toBe(-forwardTravel(scenario, t));
      }
    }
  });

  it("ne passe jamais devant son point d’emport avant l’allumage", () => {
    for (const scenario of RAFALE_SCENARIOS) {
      const shot = RAFALE_SHOTS[scenario];
      for (const t of range(0.001, shot.ignitionS, 0.001)) {
        expect(forwardTravel(scenario, t), `${scenario} @ ${t}`).toBeLessThanOrEqual(0);
      }
    }
  });

  it("avance sans à-coup à l’allumage, puis de façon monotone dès que la poussée l’emporte", () => {
    const s = RAFALE_SEPARATION;
    for (const scenario of RAFALE_SCENARIOS) {
      const shot = RAFALE_SHOTS[scenario];
      // Continuité de part et d'autre de l'allumage.
      const before = forwardTravel(scenario, shot.ignitionS - 1e-7);
      const after = forwardTravel(scenario, shot.ignitionS + 1e-7);
      expect(Math.abs(after - before), scenario).toBeLessThan(1e-4);
      // La vitesse de recul acquise par traînée est conservée à l'allumage :
      // elle s'annule quand la poussée l'emporte, après un recul centimétrique.
      const driftSpeed = shot.kind === "rail" ? 0 : s.dragDrift * shot.ignitionS;
      const takeover = shot.ignitionS + driftSpeed / shot.accel;
      const dip = forwardTravel(scenario, shot.ignitionS) - forwardTravel(scenario, takeover);
      expect(dip, scenario).toBeGreaterThanOrEqual(0);
      expect(dip, scenario).toBeLessThan(0.05);
      let previous = forwardTravel(scenario, takeover);
      for (const t of range(takeover, shot.endS, 0.005)) {
        const travel = forwardTravel(scenario, t);
        expect(travel, `${scenario} @ ${t}`).toBeGreaterThanOrEqual(previous - 1e-12);
        previous = travel;
      }
      expect(previous).toBeGreaterThan(0);
    }
  });

  it("borne l’intensité de la flamme dans [0, 1], éteinte avant l’allumage", () => {
    for (const scenario of RAFALE_SCENARIOS) {
      const shot = RAFALE_SHOTS[scenario];
      for (const t of range(-0.5, shot.endS + 2, 0.01)) {
        const { flame, ignited } = shotState(scenario, t);
        expect(flame).toBeGreaterThanOrEqual(0);
        expect(flame).toBeLessThanOrEqual(1);
        if (!ignited) expect(flame).toBe(0);
      }
      const afterBurn = shotState(scenario, shot.ignitionS + shot.burnS + 0.5).flame;
      if (shot.sustain) {
        // Statoréacteur du Meteor : flamme réduite mais entretenue.
        expect(afterBurn).toBeGreaterThan(0);
        expect(afterBurn).toBeLessThan(1);
      } else {
        expect(afterBurn).toBe(0);
      }
    }
  });

  it("fait descendre l’AASM largué dès la séparation, sans jamais remonter", () => {
    const shot = RAFALE_SHOTS.sead;
    expect(shot.kind).toBe("drop");
    expect(shotState("sead", shot.releaseFreezeS).offset[1]).toBeLessThan(0);
    let previous = 0;
    for (const t of range(0.01, shot.endS, 0.01)) {
      const y = shotState("sead", t).offset[1];
      expect(y, `sead @ ${t}`).toBeLessThan(previous);
      previous = y;
    }
  });

  it("éjecte le Meteor vers le bas, sur une course bornée", () => {
    let previous = 0;
    for (const t of range(0.01, RAFALE_SHOTS.bvr.endS, 0.01)) {
      const y = shotState("bvr", t).offset[1];
      expect(y).toBeLessThan(previous);
      expect(y).toBeGreaterThanOrEqual(-RAFALE_SEPARATION.ejectDrop);
      previous = y;
    }
    expect(shotState("bvr", RAFALE_SHOTS.bvr.releaseFreezeS).offset[1]).toBeLessThan(0);
  });

  it("garde le MICA IR sur son rail tant qu’il le parcourt", () => {
    for (const t of range(0.005, RAFALE_SHOTS.wvr.endS, 0.005)) {
      const y = shotState("wvr", t).offset[1];
      if (forwardTravel("wvr", t) < RAFALE_SEPARATION.railLength - 1e-9) {
        expect(y, `wvr @ ${t}`).toBe(0);
      } else {
        expect(y).toBeLessThanOrEqual(0);
        expect(y).toBeGreaterThanOrEqual(-RAFALE_SEPARATION.railSettle);
      }
      expect(shotState("wvr", t).pitch).toBe(0);
    }
  });
});

describe("tuyère et centre de la munition", () => {
  it("place la tuyère à une demi-longueur derrière le centre, inclinée avec la munition", () => {
    for (const scenario of RAFALE_SCENARIOS) {
      const rest = REST[scenario];
      const half = RAFALE_SHOTS[scenario].length / 2;
      expect(shotCenter(scenario, rest, 0)).toEqual(rest);
      expect(nozzlePoint(scenario, rest, 0)).toEqual([rest[0], rest[1], rest[2] + half]);
      for (const t of range(0.02, RAFALE_SHOTS[scenario].endS, 0.02)) {
        const state = shotState(scenario, t);
        const center = shotCenter(scenario, rest, t);
        const nozzle = nozzlePoint(scenario, rest, t);
        expect(center).toEqual([
          rest[0] + state.offset[0],
          rest[1] + state.offset[1],
          rest[2] + state.offset[2],
        ]);
        const dy = nozzle[1] - center[1];
        const dz = nozzle[2] - center[2];
        expect(nozzle[0]).toBe(center[0]);
        expect(dz, `${scenario} @ ${t}`).toBeGreaterThan(0);
        expect(dz).toBeCloseTo(half, 1);
        expect(Math.hypot(dy, dz)).toBeCloseTo(half, 9);
        // Nez vers le bas (tangage négatif) : l'arrière remonte.
        if (state.pitch < 0) expect(dy).toBeGreaterThan(0);
      }
    }
  });
});

describe("particules", () => {
  it("tire ses nombres d’une graine, dans [0, 1)", () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    const seq = Array.from({ length: 10_000 }, () => a());
    expect(Array.from({ length: 10_000 }, () => b())).toEqual(seq);
    for (const value of seq) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
    const mean = seq.reduce((sum, value) => sum + value, 0) / seq.length;
    expect(mean).toBeGreaterThan(0.45);
    expect(mean).toBeLessThan(0.55);
    expect(mulberry32(43)()).not.toBe(mulberry32(42)());
  });

  it("produit le même sillage pour la même graine, un autre pour une autre graine", () => {
    for (const scenario of RAFALE_SCENARIOS) {
      expect(createShotParticles(scenario, 7)).toEqual(createShotParticles(scenario, 7));
      expect(createShotParticles(scenario, 7)).not.toEqual(createShotParticles(scenario, 8));
      expect(createShotParticles(scenario)).toEqual(createShotParticles(scenario));
    }
    expect(createShotParticles("wvr")).not.toEqual(createShotParticles("sead"));
  });

  it("respecte le budget déclaré, la phase entretenue n’existant que pour le Meteor", () => {
    for (const scenario of RAFALE_SCENARIOS) {
      const puffs = createShotParticles(scenario);
      const count = (kind: PuffSeed["kind"]) => puffs.filter((puff) => puff.kind === kind).length;
      expect(count("puff")).toBe(RAFALE_PARTICLE_BUDGET.puff);
      expect(count("blast")).toBe(RAFALE_PARTICLE_BUDGET.blast);
      expect(count("trail")).toBe(RAFALE_PARTICLE_BUDGET.trail);
      expect(count("sustain"), scenario).toBe(scenario === "bvr" ? RAFALE_PARTICLE_BUDGET.sustain : 0);
    }
  });

  it("émet chaque bouffée avant l’arrêt sur image final, la phase entretenue après la combustion", () => {
    for (const scenario of RAFALE_SCENARIOS) {
      const shot = RAFALE_SHOTS[scenario];
      for (const puff of createShotParticles(scenario)) {
        const born = bornAt(puff, scenario);
        expect(born).toBeGreaterThanOrEqual(0);
        expect(born).toBeLessThan(shot.endS);
        if (puff.kind === "sustain") {
          expect(born).toBeGreaterThanOrEqual(shot.ignitionS + shot.burnS);
        }
      }
    }
  });

  it("n’échantillonne rien avant l’émission, puis part du point d’émission", () => {
    for (const scenario of RAFALE_SCENARIOS) {
      const rest = REST[scenario];
      for (const puff of createShotParticles(scenario)) {
        const born = bornAt(puff, scenario);
        expect(samplePuff(puff, scenario, rest, born - 0.01)).toBeNull();
        expect(samplePuff(puff, scenario, rest, born)).toBeNull();
        const first = samplePuff(puff, scenario, rest, born + 1e-6);
        expect(first).not.toBeNull();
        // Combustion : à la tuyère ; séparation : au centre de la munition.
        const origin =
          puff.kind === "puff"
            ? shotCenter(scenario, rest, born)
            : nozzlePoint(scenario, rest, born);
        expect(Math.abs(first!.x - origin[0])).toBeLessThan(0.16);
        expect(Math.abs(first!.y - origin[1])).toBeLessThan(0.16);
        expect(Math.abs(first!.z - origin[2])).toBeLessThan(0.16);
      }
    }
  });

  it("fait reculer la fumée avec l’écoulement d’air, en grossissant, d’opacité bornée", () => {
    for (const scenario of RAFALE_SCENARIOS) {
      const rest = REST[scenario];
      for (const puff of createShotParticles(scenario)) {
        const born = bornAt(puff, scenario);
        let previous: ReturnType<typeof samplePuff> = null;
        for (const age of [0.05, 0.5, 1.5, 3]) {
          const sample = samplePuff(puff, scenario, rest, born + age);
          expect(sample).not.toBeNull();
          expect(sample!.opacity).toBeGreaterThanOrEqual(0);
          expect(sample!.opacity).toBeLessThanOrEqual(1);
          expect(sample!.heat).toBeGreaterThanOrEqual(0);
          expect(sample!.heat).toBeLessThanOrEqual(1);
          expect(sample!.size).toBeGreaterThan(0);
          expect(sample!.size).toBeLessThanOrEqual(puff.r1 + 1e-9);
          if (previous) {
            expect(sample!.z, `${scenario}/${puff.kind} âge ${age}`).toBeGreaterThan(previous.z);
            expect(sample!.size).toBeGreaterThan(previous.size);
          }
          previous = sample;
        }
      }
    }
  });

  it("laisse le sillage derrière la munition à l’arrêt sur image final", () => {
    for (const scenario of RAFALE_SCENARIOS) {
      const rest = REST[scenario];
      const end = RAFALE_SHOTS[scenario].endS;
      const nozzle = nozzlePoint(scenario, rest, end);
      for (const puff of createShotParticles(scenario)) {
        if (puff.kind !== "trail" && puff.kind !== "sustain") continue;
        const sample = samplePuff(puff, scenario, rest, end);
        expect(sample).not.toBeNull();
        expect(sample!.z, `${scenario}/${puff.kind}`).toBeGreaterThan(nozzle[2]);
      }
    }
  });

  it("est une fonction pure du temps", () => {
    const puffs = createShotParticles("bvr");
    const puff = puffs[237];
    expect(samplePuff(puff, "bvr", REST.bvr, 2.2)).toEqual(samplePuff(puff, "bvr", REST.bvr, 2.2));
    expect(shotState("sead", 1.7)).toEqual(shotState("sead", 1.7));
  });

  it("fait scintiller la flamme dans [0,82 ; 1,08], de façon pure", () => {
    for (let t = 0; t < 10; t += 0.007) {
      const value = flameFlicker(t, 3);
      expect(value).toBeGreaterThanOrEqual(0.82);
      expect(value).toBeLessThanOrEqual(1.08);
    }
    expect(flameFlicker(1.234, 2)).toBe(flameFlicker(1.234, 2));
  });
});

describe("déterminisme du code de la planche", () => {
  /** Retire commentaires de bloc et de ligne (sans toucher aux URL « https:// »). */
  function stripComments(source: string): string {
    return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");
  }

  function sources(dir: string, pattern: RegExp) {
    const root = join(process.cwd(), dir);
    return readdirSync(root)
      .filter((name) => pattern.test(name))
      .map((name) => ({ name: `${dir}/${name}`, text: readFileSync(join(root, name), "utf8") }));
  }

  it("n’appelle jamais Math.random, ni dans les données ni dans les effets", () => {
    const data = sources("src/data/hud", /^rafale.*\.ts$/);
    expect(data.map((file) => file.name)).toEqual(
      expect.arrayContaining([
        "src/data/hud/rafale.ts",
        "src/data/hud/rafale-inspection.ts",
        "src/data/hud/rafale-launch.ts",
        "src/data/hud/rafale-motion.ts",
      ]),
    );
    const components = sources("src/components/hud/rafale", /\.tsx?$/);
    expect(components.length).toBeGreaterThan(0);
    for (const file of [...data, ...components]) {
      expect(file.text, file.name).not.toMatch(/Math\.random\s*\(/);
      expect(stripComments(file.text), file.name).not.toMatch(/Math\s*\.\s*random/);
    }
  });
});
