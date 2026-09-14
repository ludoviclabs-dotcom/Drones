import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  RAFALE_ASSET_MANIFEST,
  RAFALE_ASSET_PATH,
  RAFALE_SCENARIOS,
  RAFALE_SEQUENCE_STATES,
  type RafaleScenario,
  type RafaleSequenceState,
} from "@/data/hud/rafale";
import { shotCenter, type Vec3 } from "@/data/hud/rafale-launch";
import {
  RAFALE_DESIGN_ASPECT,
  framingScaleForAspect,
  rafalePoseForState,
} from "@/data/hud/rafale-motion";

/**
 * Cadrages projetés : chaque pose finale est rejouée comme le fait la planche
 * (poses dans le repère de l'avion, inclinaison appliquée au groupe de vol,
 * caméra à l'horizon du monde, champ vertical de 34°, recul des cadres
 * étroits) pour vérifier que ce qu'annonce l'état reste dans le cadre.
 */

const FOV_DEG = 34;
/** Colonne de 1 024 px, format de réglage (1 440 px), écran 16:9. */
const ASPECTS = [1, RAFALE_DESIGN_ASPECT, 16 / 9] as const;
const MARGIN_X = 0.97;
const MARGIN_Y = 0.95;

/**
 * Gabarit de cadrage de la cellule (repère avion, nez vers -Z) : pointe du
 * nez, sortie des tuyères, sommet de dérive, saumons, ventre. Lu sur la
 * spec du pipeline (stations y = 8,3 - s, envergure 10,90 m).
 */
const AIRFRAME: Record<string, Vec3> = {
  nose: [0, 0.2, -8.3],
  nozzles: [0, -0.1, 7],
  finTop: [0, 2.9, 6.8],
  wingRight: [5.45, -0.1, 4.3],
  wingLeft: [-5.45, -0.1, 4.3],
  belly: [0, -1.4, 0],
};
const CENTER: Vec3 = [0, 0, 0];

/** Ce que chaque état doit montrer entièrement. */
function subjects(
  scenario: RafaleScenario,
  state: RafaleSequenceState,
  rest: Vec3,
  launch: number,
): Record<string, Vec3> {
  const shot = { shot: shotCenter(scenario, rest, launch) };
  switch (state) {
    case "overview":
    case "sensors":
    case "complete":
      return AIRFRAME;
    case "inspect":
      return { nose: AIRFRAME.nose, center: CENTER };
    case "release":
      return { center: CENTER, ...shot };
    case "launch":
      return { ...AIRFRAME, ...shot };
  }
}

type GltfNode = { name?: string; translation?: number[] };

function shotRests(): Record<RafaleScenario, Vec3> {
  const bytes = readFileSync(join(process.cwd(), "public", RAFALE_ASSET_PATH));
  const length = bytes.readUInt32LE(12);
  const json = JSON.parse(bytes.subarray(20, 20 + length).toString("utf8")) as {
    nodes: GltfNode[];
  };
  const at = (name: string): Vec3 => {
    const node = json.nodes.find((candidate) => candidate.name === name);
    if (!node) throw new Error(`nœud absent : ${name}`);
    const [x = 0, y = 0, z = 0] = node.translation ?? [];
    return [x, y, z];
  };
  return {
    bvr: at(RAFALE_ASSET_MANIFEST.shotNodes.bvr),
    wvr: at(RAFALE_ASSET_MANIFEST.shotNodes.wvr),
    sead: at(RAFALE_ASSET_MANIFEST.shotNodes.sead),
  };
}

const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: Vec3, b: Vec3): Vec3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const normalize = (a: Vec3): Vec3 => {
  const l = Math.hypot(...a);
  return [a[0] / l, a[1] / l, a[2] / l];
};
/** Groupe de vol : `rotation.z = -bank`. */
const toWorld = (p: Vec3, bankDeg: number): Vec3 => {
  const angle = (-bankDeg * Math.PI) / 180;
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]];
};

function project(
  scenario: RafaleScenario,
  state: RafaleSequenceState,
  aspect: number,
  point: Vec3,
) {
  const pose = rafalePoseForState(state, scenario);
  const scale = framingScaleForAspect(aspect);
  const target = pose.camera.target;
  const eye: Vec3 = [
    target[0] + (pose.camera.position[0] - target[0]) * scale,
    target[1] + (pose.camera.position[1] - target[1]) * scale,
    target[2] + (pose.camera.position[2] - target[2]) * scale,
  ];
  const eyeWorld = toWorld(eye, pose.bank);
  const forward = normalize(sub(toWorld(target, pose.bank), eyeWorld));
  const right = normalize(cross(forward, [0, 1, 0]));
  const up = cross(right, forward);
  const v = sub(toWorld(point, pose.bank), eyeWorld);
  const depth = dot(v, forward);
  const tanV = Math.tan(((FOV_DEG / 2) * Math.PI) / 180);
  return {
    depth,
    x: dot(v, right) / (depth * tanV * aspect),
    y: dot(v, up) / (depth * tanV),
  };
}

describe("cadrages projetés de la planche Rafale", () => {
  const rests = shotRests();

  it("garde dans le cadre ce que montre chaque état, du format carré au 16:9", () => {
    const misses: string[] = [];
    for (const scenario of RAFALE_SCENARIOS) {
      for (const state of RAFALE_SEQUENCE_STATES) {
        const launch = rafalePoseForState(state, scenario).launch;
        const points = subjects(scenario, state, rests[scenario], launch);
        for (const aspect of ASPECTS) {
          for (const [name, point] of Object.entries(points)) {
            const { depth, x, y } = project(scenario, state, aspect, point);
            if (depth <= 0 || Math.abs(x) > MARGIN_X || Math.abs(y) > MARGIN_Y) {
              misses.push(
                `${scenario}/${state} @${aspect.toFixed(2)} ${name} (${x.toFixed(2)}, ${y.toFixed(2)})`,
              );
            }
          }
        }
      }
    }
    expect(misses).toEqual([]);
  });

  it("recule sur un cadre étroit sans changer la visée", () => {
    const narrow = project("sead", "launch", 1, rafalePoseForState("launch", "sead").camera.target);
    expect(Math.abs(narrow.x)).toBeLessThan(1e-9);
    expect(Math.abs(narrow.y)).toBeLessThan(1e-9);
    expect(framingScaleForAspect(1)).toBeGreaterThan(1);
  });
});
