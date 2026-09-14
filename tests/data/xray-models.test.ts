import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { ConvexHull } from "three/examples/jsm/math/ConvexHull.js";
import { describe, expect, it } from "vitest";
import { systems } from "@/data/systems";
import {
  GLB_AVAILABLE_SLUGS,
  XRAY_MODEL_OVERRIDES,
  type XrayModelOverride,
} from "@/data/aviation-3d";
import { buildPanoplieXrayScenario } from "@/data/decision-twin/panoplie-xray";
import type { DecisionTwinNode } from "@/data/decision-twin/types";

// Alignement des repères X-Ray sur les GLB placés.
//
// Décode chaque GLB comme la vue (GLTFLoader + décodeur meshopt, sans WebGL),
// applique son placement (`XRAY_MODEL_OVERRIDES`) et vérifie que chaque
// repère tombe dans l'enveloppe convexe de la pièce qu'il désigne — une
// boîte alignée sur les axes laisserait passer un point hors d'un panneau
// incliné.

/** Pièce du GLB (nom de nœud) sous chaque repère, par suffixe d'id. */
const HOTSPOT_PARTS: Record<string, Record<string, string>> = {
  // Asset de la planche Rafale : un maillage à plusieurs matériaux devient un
  // groupe dont chaque primitive est nommée `<maillage>_<n>`.
  rafale: {
    fuselage: "RAF_Spine",
    verriere: "RAF_Canopy",
    radar: "RAF_Radome",
    spectra: "RAF_Spectra_1",
    canards: "RAF_Canard_L_1",
    voilure: "RAF_Wing_L_1",
    moteur: "RAF_Engines_1",
    asmpa: "RAF_TankCenter_Mesh",
  },
  "f-35": {
    fuselage: "F35A_Fuselage_Main",
    verriere: "F35A_Canopy",
    "sensor-fusion": "F35A_EOTS_UnderNose",
    stealth: "F35A_Intake_Left",
    "internal-bay": "F35A_Fuselage_Main",
    "wing-edge": "F35A_Wing_Right",
    "engine-f135": "F35A_Engine_Nozzle",
    tr3: "F35A_Fuselage_Main",
  },
  meteor: {
    ramjet: "Corps",
    seeker: "Nez_Ogive",
    range: "PriseDair_G",
    warhead: "Corps",
  },
  "scalp-storm-shadow": {
    system: "Ecope_Dorsale",
    cout: "Corps_Furtif",
    finance: "Aile_G",
    "supply-chain": "Aile_D",
    geopolitique: "Derive_Verticale",
    export: "Stab_G",
  },
  "sea-fire": {
    "aesa-panel": "Panneau_N",
    range: "Radome",
    "multi-mission": "Superstructure",
    "gan-thales": "Panneau_W",
    platforms: "Base_Pont", // frégates porteuses : le pont du modèle
  },
  "gm400-alpha": {
    system: "Hub_Waveguide",
    cout: "Antenne_IFF",
    finance: "Epaule_G",
    "supply-chain": "Epaule_D",
    geopolitique: "Plateforme_Rotative",
    export: "Shelter",
  },
  "an-tpy-2": {
    system: "Antenne_Principale",
    cout: "Antenne_Principale",
    finance: "Cabine_Commande",
    "supply-chain": "Module_Annexe_G",
    geopolitique: "Remorque",
    export: "Yoke_G",
  },
  "giraffe-4a": {
    system: "Mat_Section_2",
    cout: "Tete_Antenne",
    finance: "Module_Generation",
    "supply-chain": "Porte_Acces",
    geopolitique: "Mat_Section_1",
    export: "Embase_Mat",
  },
  ltamds: {
    system: "Panneau_Principal",
    cout: "Panneau_Principal",
    finance: "Panneau_Secondaire_D",
    "supply-chain": "Remorque",
    geopolitique: "Embase_Centrale",
    export: "Remorque",
  },
};

/** Tolérance hors de la pièce : le rayon d'un repère (sphère de 0,05). */
const MARGIN = 0.05;
/**
 * Distance minimale entre un repère de contexte (fournisseur, pays, sources)
 * et le modèle : collé à une pièce, il semblerait la désigner.
 */
const CLEARANCE = 0.1;
const SPEC_TO_GLTF = new THREE.Euler(-Math.PI / 2, 0, 0);
const MODEL_DIRS = ["aviation", "missiles", "radars"];

/** GLB lu par la vue : celui du placement s'il en désigne un, sinon celui du dossier. */
function viewGlbFile(slug: string, override: XrayModelOverride): string {
  return override.glbPath
    ? path.join(process.cwd(), "public", override.glbPath)
    : glbFile(slug);
}

function glbFile(slug: string): string {
  const found = MODEL_DIRS.map((dir) =>
    path.join(process.cwd(), "public", "models", dir, `${slug}.glb`),
  ).filter((file) => existsSync(file));
  expect(found, `GLB ${slug}`).toHaveLength(1);
  return found[0];
}

/** Extensions exigées, lues dans le segment JSON sans décoder le GLB. */
function requiredExtensions(file: string): string[] {
  const glb = readFileSync(file);
  const jsonLength = glb.readUInt32LE(12);
  const json = JSON.parse(glb.subarray(20, 20 + jsonLength).toString("utf8"));
  return json.extensionsRequired ?? [];
}

/** Enveloppe convexe de chaque pièce (nœud nommé), GLB placé comme dans la vue. */
async function placedPartHulls(
  file: string,
  override: XrayModelOverride,
): Promise<Map<string, ConvexHull>> {
  const glb = readFileSync(file);
  const gltf = await new GLTFLoader()
    .setMeshoptDecoder(MeshoptDecoder)
    .parseAsync(glb.buffer.slice(glb.byteOffset, glb.byteOffset + glb.byteLength), "");
  // Nœuds retirés par la vue (autre configuration d'emport).
  for (const name of override.hiddenNodes ?? []) {
    gltf.scene.getObjectByName(name)?.removeFromParent();
  }
  const placed = new THREE.Group();
  const [rx, ry, rz] = override.rotation ?? [0, 0, 0];
  placed.rotation.set(rx, ry, rz);
  placed.scale.setScalar(override.scale);
  placed.add(gltf.scene);
  placed.updateMatrixWorld(true);

  const points = new Map<string, THREE.Vector3[]>();
  placed.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    // La compression meshopt peut glisser un nœud sans nom sous le nœud nommé.
    const name = object.name || object.parent?.name || "";
    const position = object.geometry.getAttribute("position");
    const list = points.get(name) ?? [];
    for (let i = 0; i < position.count; i++) {
      list.push(new THREE.Vector3().fromBufferAttribute(position, i).applyMatrix4(object.matrixWorld));
    }
    points.set(name, list);
  });
  // Une pièce plane (vitre, disque) n'a pas d'intérieur : les plans de son
  // enveloppe dégénérée sont arbitraires et fausseraient les écarts.
  return new Map(
    [...points]
      .map(([name, list]) => [name, new ConvexHull().setFromPoints(list)] as const)
      .filter(([, hull]) => hullVolume(hull) > 1e-7),
  );
}

/** Volume d'une enveloppe convexe fermée (théorème de la divergence). */
function hullVolume(hull: ConvexHull): number {
  return hull.faces.reduce(
    (sum, face) => sum + (face.area * face.normal.dot(face.midpoint)) / 3,
    0,
  );
}

/** Écart du point à l'enveloppe par les plans des faces (≤ 0 à l'intérieur). */
function gapToHull(hull: ConvexHull, point: THREE.Vector3): number {
  return Math.max(...hull.faces.map((face) => face.normal.dot(point) - face.constant));
}

/** Repère dans le repère de la scène, tel que la vue le tourne. */
function scenePoint(node: DecisionTwinNode): THREE.Vector3 {
  const { x, y, z } = node.position3d ?? { x: 0, y: 0, z: 0 };
  return new THREE.Vector3(x, y, z).applyEuler(SPEC_TO_GLTF);
}

async function loadPlacedScenarios() {
  await MeshoptDecoder.ready;
  return Promise.all(
    Object.entries(XRAY_MODEL_OVERRIDES).map(async ([slug, override]) => {
      const system = systems.find((s) => s.slug === slug);
      if (!system) throw new Error(`dossier ${slug} absent du catalogue`);
      const scenario = buildPanoplieXrayScenario(system);
      // Repères à poser : les composants d'un dossier édité, tous ceux d'une
      // lecture auto, et ceux qu'une pièce du modèle représente. Les autres
      // (fournisseur, pays, sources) orbitent.
      const declared = HOTSPOT_PARTS[slug] ?? {};
      const anchored = scenario.nodes.filter(
        (node) =>
          scenario.coverage === "auto" ||
          node.type === "component" ||
          node.id.slice(slug.length + 1) in declared,
      );
      const hulls = await placedPartHulls(viewGlbFile(slug, override), override);
      return { slug, scenario, anchored, hulls };
    }),
  );
}

let placedScenariosCache: ReturnType<typeof loadPlacedScenarios> | undefined;

/** Scénario, repères à poser et pièces décodées de chaque modèle placé (une fois). */
function placedScenarios() {
  placedScenariosCache ??= loadPlacedScenarios();
  return placedScenariosCache;
}

describe("modèles 3D System X-Ray", () => {
  it("aucun GLB X-Ray n'exige Draco (décodeur servi par un CDN)", () => {
    for (const slug of GLB_AVAILABLE_SLUGS) {
      expect(requiredExtensions(glbFile(slug)), slug).not.toContain(
        "KHR_draco_mesh_compression",
      );
    }
  });

  it("chaque placement vise un GLB disponible", () => {
    for (const slug of Object.keys(XRAY_MODEL_OVERRIDES)) {
      expect(GLB_AVAILABLE_SLUGS.has(slug), slug).toBe(true);
    }
  });

  it("chaque repère posé sur un modèle placé tombe sur sa pièce", async () => {
    const offenders: string[] = [];
    for (const { slug, anchored, hulls } of await placedScenarios()) {
      const parts = HOTSPOT_PARTS[slug] ?? {};
      expect(anchored.length, slug).toBeGreaterThan(0);
      for (const node of anchored) {
        const partName = parts[node.id.slice(slug.length + 1)];
        const hull = partName ? hulls.get(partName) : undefined;
        if (!partName || !hull) {
          offenders.push(`${node.id} : pièce ${partName ?? "non déclarée"} introuvable`);
          continue;
        }
        const gap = gapToHull(hull, scenePoint(node));
        if (gap > MARGIN) offenders.push(`${node.id} : ${gap.toFixed(2)} hors de ${partName}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it("les repères de contexte restent à l'écart du modèle", async () => {
    const offenders: string[] = [];
    for (const { scenario, anchored, hulls } of await placedScenarios()) {
      for (const node of scenario.nodes) {
        if (anchored.includes(node)) continue;
        for (const [partName, hull] of hulls) {
          const gap = gapToHull(hull, scenePoint(node));
          if (gap < CLEARANCE) offenders.push(`${node.id} : ${gap.toFixed(2)} de ${partName}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});
