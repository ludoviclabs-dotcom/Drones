import { describe, expect, it } from "vitest";
import { PATRIOT_ASSET_MANIFEST } from "@/data/hud/patriot";
import {
  PATRIOT_LAUNCH_TIMING,
  PATRIOT_PARTICLE_BUDGET,
  TRAIL_EXTENT,
  TUBE_EXIT_TIME,
  TUBE_EXIT_TRAVEL,
  createLaunchParticleSet,
  flameFlicker,
  ignitionFlash,
  ignitionTime,
  missileLaunchState,
  missileTailPoint,
  missileTravel,
  mulberry32,
  sampleDebris,
  samplePuff,
  tauForTravel,
  type LaunchGeometry,
} from "@/data/hud/patriot-launch";

// Tube incliné à 38° vers -Z, culot en retrait de 0,3 m dans un conteneur de
// 6,1 m : même repère que la scène Web.
const ELEVATION = (38 * Math.PI) / 180;
const AXIS = [0, Math.sin(ELEVATION), -Math.cos(ELEVATION)] as const;
const REAR = [0.4, 2.2, 1.5] as const;
const along = (from: readonly number[], s: number) =>
  [from[0] + AXIS[0] * s, from[1] + AXIS[1] * s, from[2] + AXIS[2] * s] as const;
const GEOMETRY: LaunchGeometry = {
  rear: REAR,
  front: along(REAR, PATRIOT_ASSET_MANIFEST.canisterLength),
  axis: AXIS,
  tail: along(REAR, PATRIOT_ASSET_MANIFEST.missileTailOffset),
};

describe("déplacement de l’intercepteur dans l’axe du tube", () => {
  it("reste nul avant le premier mouvement, puis croît continûment", () => {
    expect(missileTravel(-1)).toBe(0);
    expect(missileTravel(0)).toBe(0);
    expect(missileTravel(PATRIOT_LAUNCH_TIMING.ignitionDelayS)).toBe(0);
    expect(missileTravel(Number.NaN)).toBe(0);
    let previous = 0;
    for (let tau = 0; tau <= PATRIOT_LAUNCH_TIMING.endS; tau += 0.01) {
      const s = missileTravel(tau);
      expect(s).toBeGreaterThanOrEqual(previous);
      previous = s;
    }
  });

  it("quitte le tube exactement à la longueur utile du conteneur", () => {
    expect(TUBE_EXIT_TRAVEL).toBeCloseTo(
      PATRIOT_ASSET_MANIFEST.canisterLength - PATRIOT_ASSET_MANIFEST.missileTailOffset,
      10,
    );
    expect(missileTravel(TUBE_EXIT_TIME)).toBeCloseTo(TUBE_EXIT_TRAVEL, 9);
    // Continuité de part et d’autre de la sortie du tube.
    const before = missileTravel(TUBE_EXIT_TIME - 1e-7);
    const after = missileTravel(TUBE_EXIT_TIME + 1e-7);
    expect(after - before).toBeLessThan(1e-4);
  });

  it("s’inverse exactement, dans le tube comme après", () => {
    expect(tauForTravel(0)).toBe(PATRIOT_LAUNCH_TIMING.ignitionDelayS);
    for (const s of [0.5, 2, TUBE_EXIT_TRAVEL, 12, 80, 400]) {
      expect(missileTravel(tauForTravel(s))).toBeCloseTo(s, 7);
    }
  });

  it("fige l’intercepteur en sortie de tube à la « Mise à feu », encore dans le cadre au « Départ »", () => {
    const atFire = missileTravel(PATRIOT_LAUNCH_TIMING.fireFreezeS);
    const { canisterLength, missileLength, missileTailOffset } = PATRIOT_ASSET_MANIFEST;
    // Le nez dépasse de l’opercule avant, le culot est encore dans le tube.
    expect(missileTailOffset + atFire + missileLength).toBeGreaterThan(canisterLength);
    expect(atFire).toBeLessThan(TUBE_EXIT_TRAVEL);
    const atLaunch = missileTravel(PATRIOT_LAUNCH_TIMING.launchFreezeS);
    expect(atLaunch).toBeGreaterThan(30);
    expect(atLaunch).toBeLessThan(90);
  });
});

describe("états des intercepteurs A et B", () => {
  it("n’arme le conteneur 03 qu’en salve « ripple »", () => {
    expect(ignitionTime("A", "single")).toBe(0);
    expect(ignitionTime("A", "ripple")).toBe(0);
    expect(ignitionTime("B", "single")).toBeNull();
    expect(ignitionTime("B", "ripple")).toBe(PATRIOT_LAUNCH_TIMING.rippleIntervalS);
    for (const t of [0, 0.5, 2, PATRIOT_LAUNCH_TIMING.endS]) {
      expect(missileLaunchState("B", "single", t)).toEqual({
        armed: false,
        ignited: false,
        travel: 0,
        fins: 0,
        flame: 0,
        rearCoverGone: false,
        frontCoverGone: false,
      });
      expect(ignitionFlash("B", "single", t)).toBe(0);
      expect(missileTailPoint("B", GEOMETRY, "single", t)).toBeNull();
    }
  });

  it("garde l’intercepteur B au repos avant son allumage", () => {
    const beforeB = missileLaunchState("B", "ripple", PATRIOT_LAUNCH_TIMING.rippleIntervalS - 0.01);
    expect(beforeB.armed).toBe(true);
    expect(beforeB.ignited).toBe(false);
    expect(beforeB.travel).toBe(0);
    expect(beforeB.rearCoverGone).toBe(false);
  });

  it("ouvre l’opercule arrière à l’allumage, l’avant peu après", () => {
    const ignition = missileLaunchState("A", "single", 0);
    expect(ignition.ignited).toBe(true);
    expect(ignition.rearCoverGone).toBe(true);
    expect(ignition.frontCoverGone).toBe(false);
    const later = missileLaunchState("A", "single", PATRIOT_LAUNCH_TIMING.frontCoverBreakS);
    expect(later.frontCoverGone).toBe(true);
  });

  it("ne déplie les gouvernes qu’après la sortie du tube", () => {
    expect(missileLaunchState("A", "single", TUBE_EXIT_TIME - 0.01).fins).toBe(0);
    expect(
      missileLaunchState("A", "single", TUBE_EXIT_TIME + PATRIOT_LAUNCH_TIMING.finDeployS + 0.01)
        .fins,
    ).toBe(1);
    const mid = missileLaunchState(
      "A",
      "single",
      TUBE_EXIT_TIME + PATRIOT_LAUNCH_TIMING.finDeployS / 2,
    ).fins;
    expect(mid).toBeGreaterThan(0);
    expect(mid).toBeLessThan(1);
  });

  it("place le culot sur l’axe du tube", () => {
    const t = 0.8;
    const point = missileTailPoint("A", GEOMETRY, "single", t)!;
    const s = missileTravel(t);
    expect(point[0]).toBeCloseTo(GEOMETRY.tail[0] + AXIS[0] * s, 9);
    expect(point[1]).toBeCloseTo(GEOMETRY.tail[1] + AXIS[1] * s, 9);
    expect(point[2]).toBeCloseTo(GEOMETRY.tail[2] + AXIS[2] * s, 9);
  });
});

describe("éclairs et scintillement", () => {
  it("borne l’éclair d’allumage dans [0, 1]", () => {
    expect(ignitionFlash("A", "single", 0)).toBe(0);
    expect(ignitionFlash("A", "single", 0.05)).toBeCloseTo(1, 9);
    for (let t = 0; t < 4; t += 0.013) {
      const flash = ignitionFlash("A", "ripple", t);
      expect(flash).toBeGreaterThanOrEqual(0);
      expect(flash).toBeLessThanOrEqual(1);
    }
    expect(ignitionFlash("A", "single", 3)).toBeLessThan(0.01);
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

describe("particules", () => {
  it("tire ses nombres d’une graine, sans Math.random", () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    const seq = Array.from({ length: 8 }, () => a());
    expect(Array.from({ length: 8 }, () => b())).toEqual(seq);
    for (const value of seq) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
    expect(createLaunchParticleSet(7)).toEqual(createLaunchParticleSet(7));
    expect(createLaunchParticleSet(7)).not.toEqual(createLaunchParticleSet(8));
  });

  it("respecte le budget déclaré, pour chaque intercepteur", () => {
    const set = createLaunchParticleSet();
    for (const slot of ["A", "B"] as const) {
      const puffs = set.puffs.filter((puff) => puff.slot === slot);
      expect(puffs.filter((puff) => puff.kind === "exhaust")).toHaveLength(
        PATRIOT_PARTICLE_BUDGET.exhaust,
      );
      expect(puffs.filter((puff) => puff.kind === "muzzle")).toHaveLength(
        PATRIOT_PARTICLE_BUDGET.muzzle,
      );
      expect(puffs.filter((puff) => puff.kind === "trail")).toHaveLength(
        PATRIOT_PARTICLE_BUDGET.trail,
      );
      expect(set.debris.filter((debris) => debris.slot === slot)).toHaveLength(
        PATRIOT_PARTICLE_BUDGET.debris,
      );
    }
  });

  it("émet la traînée derrière l’intercepteur, jamais devant", () => {
    const set = createLaunchParticleSet();
    for (const puff of set.puffs.filter((p) => p.kind === "trail")) {
      expect(puff.along).toBeGreaterThan(TUBE_EXIT_TRAVEL);
      expect(puff.along).toBeLessThanOrEqual(TUBE_EXIT_TRAVEL + 0.6 + TRAIL_EXTENT);
      expect(missileTravel(puff.spawn)).toBeCloseTo(puff.along, 6);
    }
  });

  it("n’échantillonne rien avant l’émission, ni pour un créneau qui ne tire pas", () => {
    const set = createLaunchParticleSet();
    const exhaustA = set.puffs.find((p) => p.slot === "A" && p.kind === "exhaust")!;
    const exhaustB = set.puffs.find((p) => p.slot === "B" && p.kind === "exhaust")!;
    expect(samplePuff(exhaustA, GEOMETRY, "single", 0)).toBeNull();
    expect(samplePuff(exhaustB, GEOMETRY, "single", 5)).toBeNull();
    expect(samplePuff(exhaustB, GEOMETRY, "ripple", 5)).not.toBeNull();
    for (const debris of set.debris.filter((d) => d.slot === "B")) {
      expect(sampleDebris(debris, GEOMETRY, "single", 0.5).visible).toBe(false);
    }
  });

  it("garde chaque bouffée au-dessus du sol, de taille et d’opacité bornées", () => {
    const set = createLaunchParticleSet();
    for (const t of [0.2, 0.36, 1.6, 4, PATRIOT_LAUNCH_TIMING.endS]) {
      for (const puff of set.puffs) {
        const sample = samplePuff(puff, GEOMETRY, "ripple", t);
        if (!sample) continue;
        expect(sample.y).toBeGreaterThanOrEqual(sample.size * 0.8 - 1e-9);
        expect(sample.size).toBeGreaterThan(0);
        expect(sample.size).toBeLessThanOrEqual(puff.r1 + 1e-9);
        expect(sample.opacity).toBeGreaterThanOrEqual(0);
        expect(sample.opacity).toBeLessThanOrEqual(1);
        expect(sample.heat).toBeGreaterThanOrEqual(0);
        expect(sample.heat).toBeLessThanOrEqual(1);
      }
    }
  });

  it("est une fonction pure du temps", () => {
    const set = createLaunchParticleSet();
    const puff = set.puffs[37];
    expect(samplePuff(puff, GEOMETRY, "ripple", 2.2)).toEqual(
      samplePuff(puff, GEOMETRY, "ripple", 2.2),
    );
    const debris = set.debris[3];
    expect(sampleDebris(debris, GEOMETRY, "single", 0.4)).toEqual(
      sampleDebris(debris, GEOMETRY, "single", 0.4),
    );
  });

  it("fait retomber les éclats d’opercule, puis les masque", () => {
    const set = createLaunchParticleSet();
    for (const debris of set.debris.filter((d) => d.slot === "A")) {
      const start = debris.rearBlast ? 0 : PATRIOT_LAUNCH_TIMING.frontCoverBreakS;
      expect(sampleDebris(debris, GEOMETRY, "single", start).visible).toBe(false);
      const early = sampleDebris(debris, GEOMETRY, "single", start + 0.05);
      if (early.visible) expect(early.y).toBeGreaterThanOrEqual(0);
      expect(sampleDebris(debris, GEOMETRY, "single", start + 3).visible).toBe(false);
    }
  });
});
