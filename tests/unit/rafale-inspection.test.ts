import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  RAFALE_ASSET_MANIFEST,
  RAFALE_ASSET_PATH,
  RAFALE_SCENARIOS,
  type RafaleLoadout,
} from "@/data/hud/rafale";
import {
  RAFALE_INITIAL_INSPECTION_STATE,
  RAFALE_INSPECTABLES,
  RAFALE_INSPECTABLE_IDS,
  RAFALE_INSPECTION_GROUP_COPY,
  RAFALE_SOURCES,
  RAFALE_SOURCE_STATUS,
  activeRafaleInspectionId,
  isInspectableCarried,
  isRafaleInspectableId,
  rafaleInspectableById,
  rafaleInspectablesFor,
  rafaleInspectionIdForNodeName,
  rafaleInspectionReducer,
  type RafaleInspectableId,
  type RafaleInspectionState,
  type RafaleSourceId,
} from "@/data/hud/rafale-inspection";
import { RAFALE_SHOTS } from "@/data/hud/rafale-launch";

const GLB_BUDGET_BYTES = 1024 * 1024;

/**
 * Vocabulaire proscrit (variante catalogue : `\bportée`, pour laisser passer
 * « emportée »), plus « NEZ » (no-escape zone) en capitales seulement.
 */
const BANNED =
  /\bportée|\bcible[rs]?\b|probabilit|altitude d.interception|guidage terminal|no.escape|non.échappement|\bPk\b|létal|neutralis|abattre|destruction/i;
const BANNED_CASE_SENSITIVE = /\bNEZ\b/;

type Vec3 = [number, number, number];
type Mat4 = number[];

type GltfNode = {
  name?: string;
  children?: number[];
  mesh?: number;
  translation?: number[];
  rotation?: number[];
  scale?: number[];
  matrix?: number[];
};

type GltfAccessor = {
  componentType: number;
  normalized?: boolean;
  min?: number[];
  max?: number[];
};

type GltfJson = {
  scene?: number;
  scenes: { nodes: number[] }[];
  nodes: GltfNode[];
  meshes: { primitives: { attributes: Record<string, number> }[] }[];
  accessors: GltfAccessor[];
  materials?: { name?: string }[];
  animations?: unknown[];
  extensionsUsed?: string[];
  extensionsRequired?: string[];
};

/** Lit le segment JSON d'un GLB (glTF 2.0 binaire), sans dépendance 3D. */
function readGlb(path: string): { bytes: number; json: GltfJson } {
  const buffer = readFileSync(path);
  if (
    buffer.toString("ascii", 0, 4) !== "glTF" ||
    buffer.readUInt32LE(4) !== 2 ||
    buffer.readUInt32LE(8) !== buffer.length ||
    buffer.toString("ascii", 16, 20) !== "JSON"
  ) {
    throw new Error(`${path} n’est pas un glTF 2.0 binaire complet`);
  }
  const length = buffer.readUInt32LE(12);
  return {
    bytes: buffer.length,
    json: JSON.parse(buffer.toString("utf8", 20, 20 + length)) as GltfJson,
  };
}

const GLB = readGlb(join(process.cwd(), "public", RAFALE_ASSET_PATH));
const NODES = GLB.json.nodes;
const NODE_NAMES = NODES.map((node) => node.name ?? "");

function nodeIndex(name: string): number {
  const index = NODE_NAMES.indexOf(name);
  if (index < 0) throw new Error(`nœud absent : ${name}`);
  return index;
}

function parentName(name: string): string | null {
  const index = nodeIndex(name);
  const parent = NODES.findIndex((node) => node.children?.includes(index));
  return parent < 0 ? null : NODE_NAMES[parent];
}

function isIdentityTransform(node: GltfNode): boolean {
  const same = (value: number[] | undefined, expected: number[]) =>
    !value || value.every((component, i) => Math.abs(component - expected[i]) < 1e-9);
  return (
    same(node.translation, [0, 0, 0]) &&
    same(node.rotation, [0, 0, 0, 1]) &&
    same(node.scale, [1, 1, 1]) &&
    same(node.matrix, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
  );
}

// --- Géométrie : boîtes englobantes lues dans les accesseurs POSITION ------

function composeTrs(translation: number[], rotation: number[], scale: number[]): Mat4 {
  const [x, y, z, w] = rotation;
  const [sx, sy, sz] = scale;
  return [
    (1 - 2 * (y * y + z * z)) * sx, 2 * (x * y + w * z) * sx, 2 * (x * z - w * y) * sx, 0,
    2 * (x * y - w * z) * sy, (1 - 2 * (x * x + z * z)) * sy, 2 * (y * z + w * x) * sy, 0,
    2 * (x * z + w * y) * sz, 2 * (y * z - w * x) * sz, (1 - 2 * (x * x + y * y)) * sz, 0,
    translation[0], translation[1], translation[2], 1,
  ];
}

function nodeMatrix(node: GltfNode, withTranslation = true): Mat4 {
  if (node.matrix) {
    const matrix = [...node.matrix];
    if (!withTranslation) matrix.splice(12, 3, 0, 0, 0);
    return matrix;
  }
  return composeTrs(
    withTranslation ? (node.translation ?? [0, 0, 0]) : [0, 0, 0],
    node.rotation ?? [0, 0, 0, 1],
    node.scale ?? [1, 1, 1],
  );
}

function multiply(a: Mat4, b: Mat4): Mat4 {
  const out = new Array<number>(16).fill(0);
  for (let column = 0; column < 4; column += 1) {
    for (let row = 0; row < 4; row += 1) {
      let sum = 0;
      for (let k = 0; k < 4; k += 1) sum += a[k * 4 + row] * b[column * 4 + k];
      out[column * 4 + row] = sum;
    }
  }
  return out;
}

function transformPoint(m: Mat4, p: Vec3): Vec3 {
  return [
    m[0] * p[0] + m[4] * p[1] + m[8] * p[2] + m[12],
    m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13],
    m[2] * p[0] + m[6] * p[1] + m[10] * p[2] + m[14],
  ];
}

/** Valeur réelle d'une borne d'accesseur (KHR_mesh_quantization : entiers normalisés). */
function dequantize(value: number, accessor: GltfAccessor): number {
  if (!accessor.normalized) return value;
  switch (accessor.componentType) {
    case 5120:
      return Math.max(value / 127, -1);
    case 5121:
      return value / 255;
    case 5122:
      return Math.max(value / 32767, -1);
    case 5123:
      return value / 65535;
    default:
      return value;
  }
}

type Box = { min: Vec3; max: Vec3 };

function subtreeBounds(index: number, matrix: Mat4, box: Box): Box {
  const node = NODES[index];
  if (node.mesh !== undefined) {
    for (const primitive of GLB.json.meshes[node.mesh].primitives) {
      const accessor = GLB.json.accessors[primitive.attributes.POSITION];
      if (!accessor?.min || !accessor.max) throw new Error(`POSITION sans bornes : ${node.name}`);
      const lo = accessor.min.map((v) => dequantize(v, accessor));
      const hi = accessor.max.map((v) => dequantize(v, accessor));
      for (const cx of [lo[0], hi[0]]) {
        for (const cy of [lo[1], hi[1]]) {
          for (const cz of [lo[2], hi[2]]) {
            const p = transformPoint(matrix, [cx, cy, cz]);
            for (let i = 0; i < 3; i += 1) {
              box.min[i] = Math.min(box.min[i], p[i]);
              box.max[i] = Math.max(box.max[i], p[i]);
            }
          }
        }
      }
    }
  }
  for (const child of node.children ?? []) {
    subtreeBounds(child, multiply(matrix, nodeMatrix(NODES[child])), box);
  }
  return box;
}

/**
 * Géométrie d'un nœud (et de ses descendants) autour de son PIVOT, dans
 * l'orientation de son parent : c'est le repère dans lequel la planche fait
 * tourner le nœud (`node.rotation.x = …`).
 */
function boundsAroundPivot(name: string): Box {
  const index = nodeIndex(name);
  return subtreeBounds(index, nodeMatrix(NODES[index], false), {
    min: [Infinity, Infinity, Infinity],
    max: [-Infinity, -Infinity, -Infinity],
  });
}

// ---------------------------------------------------------------------------

function catalogueText(id: RafaleInspectableId): string {
  const item = rafaleInspectableById(id)!;
  return [item.label, item.description, ...item.facts.map((f) => `${f.label} ${f.value}`)].join(" ");
}

describe("catalogue d’inspection Rafale", () => {
  it("décrit chaque sous-ensemble une seule fois, dans l’ordre déclaré", () => {
    expect(RAFALE_INSPECTABLES.map((item) => item.id)).toEqual([...RAFALE_INSPECTABLE_IDS]);
    expect(new Set(RAFALE_INSPECTABLE_IDS).size).toBe(RAFALE_INSPECTABLE_IDS.length);
    for (const item of RAFALE_INSPECTABLES) {
      expect(item.label).toBe(item.label.toUpperCase());
      expect(item.description.length, item.id).toBeGreaterThan(40);
      expect(item.facts.length, item.id).toBeGreaterThan(0);
      for (const fact of item.facts) {
        expect(fact.label.length).toBeGreaterThan(0);
        expect(fact.value.length).toBeGreaterThan(0);
        expect(["haute", "moyenne"]).toContain(fact.confidence);
      }
      expect(rafaleInspectableById(item.id)).toBe(item);
      expect(isRafaleInspectableId(item.id)).toBe(true);
      expect(RAFALE_INSPECTION_GROUP_COPY[item.group]).toBeTruthy();
    }
    expect(rafaleInspectableById(null)).toBeNull();
    expect(rafaleInspectableById("warhead" as RafaleInspectableId)).toBeNull();
    expect(isRafaleInspectableId("warhead")).toBe(false);
    expect(isRafaleInspectableId(null)).toBe(false);
  });

  it("appuie chaque sous-ensemble sur au moins une source déclarée, sans source orpheline", () => {
    const used = new Set<RafaleSourceId>();
    for (const item of RAFALE_INSPECTABLES) {
      expect(item.sources.length, item.id).toBeGreaterThan(0);
      expect(new Set(item.sources).size).toBe(item.sources.length);
      for (const source of item.sources) {
        expect(RAFALE_SOURCES[source]?.url, `${item.id} → ${source}`).toMatch(/^https:\/\//);
        used.add(source);
      }
    }
    expect([...used].sort()).toEqual(Object.keys(RAFALE_SOURCES).sort());
    for (const source of Object.values(RAFALE_SOURCES)) {
      expect(source.title.length).toBeGreaterThan(0);
      expect(source.publisher.length).toBeGreaterThan(0);
    }
  });

  it("n’expose ni performance d’engagement ni vocabulaire de ciblage", () => {
    for (const id of RAFALE_INSPECTABLE_IDS) {
      const text = catalogueText(id);
      expect(text, id).not.toMatch(BANNED);
      expect(text, id).not.toMatch(BANNED_CASE_SENSITIVE);
    }
    for (const copy of [RAFALE_SOURCE_STATUS, ...Object.values(RAFALE_INSPECTION_GROUP_COPY)]) {
      expect(copy).not.toMatch(BANNED);
      expect(copy).not.toMatch(BANNED_CASE_SENSITIVE);
    }
    expect(RAFALE_SOURCE_STATUS).toMatch(/SOURCES PUBLIQUES/);
    expect(RAFALE_SOURCE_STATUS).not.toMatch(/RAF-|HANDOFF/);
  });

  it("garde un repère de confiance « moyenne » sur les valeurs estimées ou divergentes", () => {
    const fact = (id: RafaleInspectableId, label: string) =>
      rafaleInspectableById(id)?.facts.find((candidate) => candidate.label === label);
    expect(fact("wing", "Envergure")?.confidence).toBe("moyenne");
    expect(fact("meteor", "Masse")?.confidence).toBe("moyenne");
    expect(fact("probe", "Gabarit")?.confidence).toBe("moyenne");
    expect(fact("gun", "Emplacement")?.confidence).toBe("moyenne");
  });

  it("range les emports à part, seuls sous-ensembles propres à une configuration", () => {
    const stores = RAFALE_INSPECTABLES.filter((item) => item.group === "stores").map((item) => item.id);
    expect(stores).toEqual(["meteor", "mica", "hammer", "talios", "tanks"]);
    for (const item of RAFALE_INSPECTABLES) {
      if (item.loadouts) expect(item.group, item.id).toBe("stores");
    }
  });

  it("ne propose que les emports visibles dans la configuration choisie", () => {
    const ids = (loadout: RafaleLoadout) => rafaleInspectablesFor(loadout).map((item) => item.id);
    expect(ids("air")).toEqual(
      RAFALE_INSPECTABLE_IDS.filter((id) => id !== "hammer" && id !== "talios"),
    );
    expect(ids("sead")).toEqual(RAFALE_INSPECTABLE_IDS.filter((id) => id !== "meteor"));
    for (const loadout of ["air", "sead"] as const) {
      for (const item of RAFALE_INSPECTABLES) {
        expect(isInspectableCarried(item, loadout)).toBe(ids(loadout).includes(item.id));
      }
    }
  });
});

describe("correspondance nœuds GLB → sous-ensembles", () => {
  it("relie les emports, spécifiques d’abord", () => {
    const expected: Record<string, RafaleInspectableId> = {
      RAF_Meteor_R: "meteor",
      RAF_Pylon_Meteor_L: "meteor",
      RAF_MicaIR_L: "mica",
      RAF_MicaEM_R: "mica",
      RAF_Pylon_Outer_R: "mica",
      RAF_Hammer_R: "hammer",
      RAF_Pylon_Mid_L: "hammer",
      RAF_Talios: "talios",
      RAF_Pylon_Fwd_R: "talios",
      RAF_Tank_L: "tanks",
      RAF_TankCenter: "tanks",
      RAF_Pylon_Inner_R: "tanks",
      RAF_Pylon_Center: "tanks",
    };
    for (const [name, id] of Object.entries(expected)) {
      expect(rafaleInspectionIdForNodeName(name), name).toBe(id);
    }
  });

  it("relie la cellule et ses capteurs", () => {
    const expected: Record<string, RafaleInspectableId> = {
      RAF_Radome: "radar",
      RAF_OSF: "osf",
      RAF_Canopy: "cockpit",
      RAF_CanopyFrame: "cockpit",
      RAF_Cockpit: "cockpit",
      RAF_Canard_L: "canards",
      RAF_Wing_L: "wing",
      RAF_Elevon_R_In: "wing",
      RAF_Engines: "engines",
      RAF_Fin: "spectra",
      RAF_Spectra: "spectra",
      RAF_Probe: "probe",
      RAF_Gun: "gun",
      RAF_Fuselage: "airframe",
      RAF_Intakes: "airframe",
      RAF_Spine: "airframe",
      RAF_Details: "airframe",
      RAF_Roundels: "airframe",
    };
    for (const [name, id] of Object.entries(expected)) {
      expect(rafaleInspectionIdForNodeName(name), name).toBe(id);
    }
  });

  it("ignore les nœuds de structure et les objets créés côté Web", () => {
    for (const name of [
      "RAF_Root",
      "RAF_Airframe",
      "RAF_Stores",
      "RAF_UI_Smoke",
      "RAF_UI_LaunchEffects",
      "RAF_UI_Flight",
      "PAT_Root",
      "raf_radome",
      "",
    ]) {
      expect(rafaleInspectionIdForNodeName(name), JSON.stringify(name)).toBeNull();
    }
  });
});

describe("réducteur d’inspection", () => {
  it("donne le même aperçu au survol et au focus clavier", () => {
    const preview = rafaleInspectionReducer(RAFALE_INITIAL_INSPECTION_STATE, {
      type: "PREVIEW",
      id: "radar",
    });
    expect(preview).toEqual({ previewId: "radar", selectedId: null });
    expect(activeRafaleInspectionId(preview)).toBe("radar");
    expect(rafaleInspectionReducer(preview, { type: "PREVIEW", id: "radar" })).toBe(preview);
    const cleared = rafaleInspectionReducer(preview, { type: "PREVIEW", id: null });
    expect(activeRafaleInspectionId(cleared)).toBeNull();
    const invalid = "warhead" as RafaleInspectableId;
    expect(rafaleInspectionReducer(preview, { type: "PREVIEW", id: invalid })).toBe(preview);
  });

  it("épingle, garde l’épingle pendant un autre aperçu, puis désépingle", () => {
    const selected = rafaleInspectionReducer(RAFALE_INITIAL_INSPECTION_STATE, {
      type: "TOGGLE",
      id: "meteor",
    });
    expect(selected.selectedId).toBe("meteor");
    const other = rafaleInspectionReducer(selected, { type: "PREVIEW", id: "gun" });
    expect(activeRafaleInspectionId(other)).toBe("meteor");
    expect(rafaleInspectionReducer(other, { type: "TOGGLE", id: "spectra" }).selectedId).toBe(
      "spectra",
    );
    const off = rafaleInspectionReducer(other, { type: "TOGGLE", id: "meteor" });
    expect(off.selectedId).toBeNull();
    expect(activeRafaleInspectionId(off)).toBe("gun");
  });

  it("choisit l’épingle avant l’aperçu", () => {
    const states: [RafaleInspectionState, RafaleInspectableId | null][] = [
      [{ previewId: null, selectedId: null }, null],
      [{ previewId: "radar", selectedId: null }, "radar"],
      [{ previewId: null, selectedId: "tanks" }, "tanks"],
      [{ previewId: "radar", selectedId: "tanks" }, "tanks"],
    ];
    for (const [state, active] of states) {
      expect(activeRafaleInspectionId(state)).toBe(active);
    }
  });

  it("Échap efface tout, et un identifiant inconnu ne change rien", () => {
    const busy = { previewId: "osf", selectedId: "wing" } as const;
    expect(rafaleInspectionReducer(busy, { type: "CLEAR_SELECTION" })).toEqual(
      RAFALE_INITIAL_INSPECTION_STATE,
    );
    expect(
      rafaleInspectionReducer(RAFALE_INITIAL_INSPECTION_STATE, { type: "CLEAR_SELECTION" }),
    ).toBe(RAFALE_INITIAL_INSPECTION_STATE);
    const clear: RafaleInspectionState = { previewId: null, selectedId: null };
    expect(rafaleInspectionReducer(clear, { type: "CLEAR_SELECTION" })).toBe(clear);
    const invalid = "warhead" as RafaleInspectableId;
    expect(
      rafaleInspectionReducer(RAFALE_INITIAL_INSPECTION_STATE, { type: "TOGGLE", id: invalid }),
    ).toBe(RAFALE_INITIAL_INSPECTION_STATE);
    expect(
      rafaleInspectionReducer(RAFALE_INITIAL_INSPECTION_STATE, { type: "PREVIEW", id: invalid }),
    ).toBe(RAFALE_INITIAL_INSPECTION_STATE);
  });
});

describe("contrat avec le GLB publié", () => {
  const manifest = RAFALE_ASSET_MANIFEST;
  const loadoutNodes = new Set<string>([...manifest.loadoutNodes.air, ...manifest.loadoutNodes.sead]);

  it("reste léger, sans animation, et ne demande que meshopt et la quantification", () => {
    expect(GLB.bytes).toBeLessThan(GLB_BUDGET_BYTES);
    expect([...(GLB.json.extensionsRequired ?? [])].sort()).toEqual([
      "EXT_meshopt_compression",
      "KHR_mesh_quantization",
    ]);
    // Aucun décodeur Draco à charger depuis un CDN.
    expect(GLB.json.extensionsUsed ?? []).not.toContain("KHR_draco_mesh_compression");
    // La planche anime tout par code : aucun clip embarqué.
    expect(GLB.json.animations ?? []).toHaveLength(0);
  });

  it("exporte les bandes de livrée des missiles", () => {
    // Bandes étroites (15 à 50 mm) : le pipeline découpe le profil à leurs
    // bords, sinon elles disparaissent de l'export sans erreur.
    const materials = new Set((GLB.json.materials ?? []).map((material) => material.name));
    expect(materials.has("RAF_MAT_BandYellow")).toBe(true);
    expect(materials.has("RAF_MAT_BandBrown")).toBe(true);
  });

  it("contient une seule fois chaque nœud piloté par la planche", () => {
    const driven = [
      manifest.rootNode,
      manifest.airframeNode,
      manifest.storesNode,
      ...Object.values(manifest.canardNodes),
      ...Object.values(manifest.elevonNodes),
      ...Object.values(manifest.shotNodes),
      ...manifest.loadoutNodes.air,
      ...manifest.loadoutNodes.sead,
    ];
    for (const name of driven) {
      expect(NODE_NAMES.filter((candidate) => candidate === name), name).toHaveLength(1);
    }
  });

  it("range la cellule et les emports sous une racine sans transformation", () => {
    const sceneRoots = GLB.json.scenes[GLB.json.scene ?? 0].nodes.map((index) => NODE_NAMES[index]);
    expect(sceneRoots).toEqual([manifest.rootNode]);
    expect(parentName(manifest.airframeNode)).toBe(manifest.rootNode);
    expect(parentName(manifest.storesNode)).toBe(manifest.rootNode);
    // La planche lit la position des munitions comme un point du repère avion.
    for (const name of [manifest.rootNode, manifest.airframeNode, manifest.storesNode]) {
      expect(isIdentityTransform(NODES[nodeIndex(name)]), name).toBe(true);
    }
    for (const name of [...Object.values(manifest.shotNodes), ...loadoutNodes]) {
      expect(parentName(name), name).toBe(manifest.storesNode);
    }
    for (const name of [...Object.values(manifest.canardNodes), ...Object.values(manifest.elevonNodes)]) {
      expect(parentName(name), name).toBe(manifest.airframeNode);
    }
  });

  it("rend chaque entrée du catalogue réellement désignable dans la scène", () => {
    const covered = new Set(
      NODE_NAMES.map(rafaleInspectionIdForNodeName).filter((id) => id !== null),
    );
    expect([...covered].sort()).toEqual([...RAFALE_INSPECTABLE_IDS].sort());
    const structural = new Set<string>([
      manifest.rootNode,
      manifest.airframeNode,
      manifest.storesNode,
    ]);
    for (const name of NODE_NAMES.filter((candidate) => candidate.startsWith("RAF_"))) {
      if (structural.has(name)) continue;
      expect(rafaleInspectionIdForNodeName(name), name).not.toBeNull();
    }
  });

  it("n’offre à l’inspection que ce qui est visible dans chaque configuration", () => {
    // Un nœud masqué cache aussi ses enfants (maillage sous son empty pivot).
    const hiddenBy = (name: string, hidden: ReadonlySet<string>): boolean => {
      for (let current: string | null = name; current; current = parentName(current)) {
        if (hidden.has(current)) return true;
      }
      return false;
    };
    for (const loadout of ["air", "sead"] as const) {
      const own = new Set<string>(manifest.loadoutNodes[loadout]);
      const other = new Set([...loadoutNodes].filter((name) => !own.has(name)));
      const visible = NODE_NAMES.filter((name) => !hiddenBy(name, other));
      const ids = new Set(visible.map(rafaleInspectionIdForNodeName).filter((id) => id !== null));
      expect([...ids].sort(), loadout).toEqual(
        rafaleInspectablesFor(loadout).map((item) => item.id).sort(),
      );
    }
  });

  it("modélise chaque munition tirée à sa longueur, tuyère à +longueur/2, sans rotation de repos", () => {
    for (const scenario of RAFALE_SCENARIOS) {
      const name = manifest.shotNodes[scenario];
      const node = NODES[nodeIndex(name)];
      // La planche écrase la rotation (`rotation.set(pitch, 0, 0)`) : elle doit être nulle au repos.
      expect(
        !node.rotation || node.rotation.every((v, i) => Math.abs(v - [0, 0, 0, 1][i]) < 1e-9),
        name,
      ).toBe(true);
      const box = boundsAroundPivot(name);
      const length = RAFALE_SHOTS[scenario].length;
      expect(box.max[2] - box.min[2], name).toBeCloseTo(length, 1);
      expect(Math.abs(box.max[2] - length / 2), name).toBeLessThan(0.05);
      // Corps sur l'axe, plus long que large.
      expect(box.max[0] - box.min[0]).toBeLessThan(length / 2);
      expect(box.max[1] - box.min[1]).toBeLessThan(length / 2);
    }
  });

  it("place chaque munition tirée là où le décrit son scénario", () => {
    const halfSpan = manifest.aircraft.span / 2;
    const at = (name: string) => NODES[nodeIndex(name)].translation ?? [0, 0, 0];
    // Meteor : « point d'emport arrière droit du fuselage ».
    const [mx, my, mz] = at(manifest.shotNodes.bvr);
    expect(mx).toBeGreaterThan(0);
    expect(mx).toBeLessThan(1.5);
    expect(my).toBeLessThan(0);
    expect(mz).toBeGreaterThan(0);
    // MICA IR : « rail de saumon gauche ».
    const [ix] = at(manifest.shotNodes.wvr);
    expect(ix).toBeLessThan(-(halfSpan - 0.5));
    // AASM : « largué sous la voilure » (droite), entre fuselage et saumon.
    const [hx, hy] = at(manifest.shotNodes.sead);
    expect(hx).toBeGreaterThan(1.5);
    expect(hx).toBeLessThan(halfSpan - 0.5);
    expect(hy).toBeLessThan(0);
  });

  it("fait pivoter chaque gouverne sur sa charnière, pas au milieu de sa géométrie", () => {
    // Élevons : origine sur la charnière (tools/rafale-3d/rafale3d/surfaces.py),
    // la gouverne entière en arrière de son pivot.
    for (const name of Object.values(manifest.elevonNodes)) {
      const box = boundsAroundPivot(name);
      expect(box.min[2], `${name} : bord d’attaque devant le pivot`).toBeGreaterThan(-0.05);
      expect(box.max[2], name).toBeGreaterThan(0.2);
    }
    // Plans canard monoblocs : pivot à l'emplanture, la surface vers l'extérieur.
    for (const name of Object.values(manifest.canardNodes)) {
      const node = NODES[nodeIndex(name)];
      const side = Math.sign(node.translation?.[0] ?? 0);
      expect(side, name).not.toBe(0);
      const box = boundsAroundPivot(name);
      const inboard = side > 0 ? -box.min[0] : box.max[0];
      const outboard = side > 0 ? box.max[0] : -box.min[0];
      expect(inboard, `${name} : débord vers le fuselage`).toBeLessThan(0.3);
      expect(outboard, name).toBeGreaterThan(1);
    }
  });

  it("garde les nœuds pilotés sans échelle ni maillage : la quantification reste sur l’enfant", () => {
    // meshopt ré-exprime chaque nœud de maillage sur sa boîte englobante
    // (translation + échelle) : un nœud piloté qui porterait lui-même le
    // maillage perdrait sa charnière et transmettrait l'échelle aux flammes.
    const driven = [
      ...Object.values(manifest.canardNodes),
      ...Object.values(manifest.elevonNodes),
      ...Object.values(manifest.shotNodes),
    ];
    for (const name of driven) {
      const node = NODES[nodeIndex(name)];
      expect(node.mesh, name).toBeUndefined();
      expect(node.matrix, name).toBeUndefined();
      expect(!node.scale || node.scale.every((v) => Math.abs(v - 1) < 1e-9), name).toBe(true);
      expect(node.children?.length ?? 0, name).toBeGreaterThan(0);
    }
  });
});
