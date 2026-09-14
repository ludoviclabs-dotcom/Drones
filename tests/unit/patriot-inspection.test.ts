import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { PATRIOT_ASSET_MANIFEST, PATRIOT_ASSET_PATH } from "@/data/hud/patriot";
import {
  PATRIOT_INITIAL_INSPECTION_STATE,
  PATRIOT_INSPECTABLES,
  PATRIOT_INSPECTABLE_IDS,
  PATRIOT_SOURCES,
  PATRIOT_SOURCE_STATUS,
  activePatriotInspectionId,
  isPatriotInspectableId,
  patriotInspectableById,
  patriotInspectionIdForNodeName,
  patriotInspectionReducer,
  type PatriotInspectableId,
} from "@/data/hud/patriot-inspection";
import { PATRIOT_FALLBACK_CLIP_DURATIONS } from "@/data/hud/patriot-motion";

const GLB_BUDGET_BYTES = 1024 * 1024;

type GltfJson = {
  nodes: { name?: string }[];
  animations: {
    name: string;
    channels: { target: { node: number } }[];
    samplers: { input: number }[];
  }[];
  accessors: { max?: number[] }[];
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

const GLB = readGlb(join(process.cwd(), "public", PATRIOT_ASSET_PATH));
const NODE_NAMES = GLB.json.nodes.map((node) => node.name ?? "");

function clip(name: string) {
  const animation = GLB.json.animations.find((candidate) => candidate.name === name);
  if (!animation) throw new Error(`clip absent : ${name}`);
  const duration = Math.max(
    ...animation.samplers.map((sampler) => GLB.json.accessors[sampler.input]?.max?.[0] ?? 0),
  );
  const targets = new Set(animation.channels.map((channel) => NODE_NAMES[channel.target.node]));
  return { duration, targets: [...targets] };
}

describe("catalogue d’inspection Patriot", () => {
  it("décrit chaque sous-ensemble une seule fois, dans l’ordre déclaré", () => {
    expect(PATRIOT_INSPECTABLES.map((item) => item.id)).toEqual([...PATRIOT_INSPECTABLE_IDS]);
    for (const item of PATRIOT_INSPECTABLES) {
      expect(item.label).toBe(item.label.toUpperCase());
      expect(item.description.length).toBeGreaterThan(40);
      expect(item.facts.length).toBeGreaterThan(0);
      expect(patriotInspectableById(item.id)).toBe(item);
    }
    expect(patriotInspectableById(null)).toBeNull();
  });

  it("appuie chaque sous-ensemble sur au moins une source déclarée", () => {
    for (const item of PATRIOT_INSPECTABLES) {
      expect(item.sources.length).toBeGreaterThan(0);
      for (const source of item.sources) {
        expect(PATRIOT_SOURCES[source]?.url).toMatch(/^https:\/\//);
      }
    }
  });

  it("n’expose ni performance d’engagement ni vocabulaire de ciblage", () => {
    for (const item of PATRIOT_INSPECTABLES) {
      const text = [item.description, ...item.facts.map((f) => `${f.label} ${f.value}`)].join(" ");
      expect(text).not.toMatch(/\bportée|\bcible[rs]?\b|probabilit|altitude d.interception/i);
    }
    expect(PATRIOT_SOURCE_STATUS).toMatch(/SOURCES PUBLIQUES/);
    expect(PATRIOT_SOURCE_STATUS).not.toMatch(/PAT-|HANDOFF/);
  });

  it("garde un repère de confiance « moyenne » sur les valeurs estimées", () => {
    const fact = (id: PatriotInspectableId, label: string) =>
      patriotInspectableById(id)?.facts.find((candidate) => candidate.label === label);
    expect(fact("launcher", "Site de tir")?.confidence).toBe("moyenne");
    expect(fact("interceptor", "Longueur")?.confidence).toBe("moyenne");
    expect(fact("interceptor", "Autodirecteur")?.confidence).toBe("moyenne");
    expect(fact("radar", "Bande")?.confidence).toBe("moyenne");
  });
});

describe("correspondance nœuds GLB → sous-ensembles", () => {
  it("relie les noms du lanceur principal, spécifiques d’abord", () => {
    expect(patriotInspectionIdForNodeName("PAT_LS1_Missile_A_Fin3")).toBe("interceptor");
    expect(patriotInspectionIdForNodeName("PAT_LS1_Canister_04")).toBe("canisters");
    expect(patriotInspectionIdForNodeName("PAT_LS1_CoverFront_03")).toBe("canisters");
    expect(patriotInspectionIdForNodeName("PAT_LS1_MastTop")).toBe("launcher");
    expect(patriotInspectionIdForNodeName("PAT_LS1_ActuatorRod_L")).toBe("launcher");
    expect(patriotInspectionIdForNodeName("PAT_LS1_PowerUnit")).toBe("power");
    expect(patriotInspectionIdForNodeName("PAT_LS1_ELES")).toBe("eles");
    expect(patriotInspectionIdForNodeName("PAT_LS1_LegSleeve_R")).toBe("trailer");
    expect(patriotInspectionIdForNodeName("PAT_LS1_Outrigger_FL_Foot")).toBe("trailer");
  });

  it("relie la batterie, et ignore les nœuds de structure", () => {
    expect(patriotInspectionIdForNodeName("PAT_LS3")).toBe("launchers");
    expect(patriotInspectionIdForNodeName("PAT_TR2_Wheel_4R")).toBe("tractor");
    expect(patriotInspectionIdForNodeName("PAT_RS_Array")).toBe("radar");
    expect(patriotInspectionIdForNodeName("PAT_ECS")).toBe("ecs");
    expect(patriotInspectionIdForNodeName("PAT_EPP")).toBe("epp");
    expect(patriotInspectionIdForNodeName("PAT_AMG")).toBe("amg");
    expect(patriotInspectionIdForNodeName("PAT_Root")).toBeNull();
    expect(patriotInspectionIdForNodeName("PAT_Battery")).toBeNull();
    expect(patriotInspectionIdForNodeName("PAT_LS1")).toBeNull();
    expect(patriotInspectionIdForNodeName("PAT_UI_Smoke")).toBeNull();
  });
});

describe("réducteur d’inspection", () => {
  it("donne le même aperçu au survol et au focus clavier", () => {
    const preview = patriotInspectionReducer(PATRIOT_INITIAL_INSPECTION_STATE, {
      type: "PREVIEW",
      id: "radar",
    });
    expect(activePatriotInspectionId(preview)).toBe("radar");
    expect(
      activePatriotInspectionId(
        patriotInspectionReducer(preview, { type: "PREVIEW", id: null }),
      ),
    ).toBeNull();
  });

  it("épingle, garde l’épingle pendant un autre aperçu, puis désépingle", () => {
    const selected = patriotInspectionReducer(PATRIOT_INITIAL_INSPECTION_STATE, {
      type: "TOGGLE",
      id: "interceptor",
    });
    const other = patriotInspectionReducer(selected, { type: "PREVIEW", id: "tractor" });
    expect(activePatriotInspectionId(other)).toBe("interceptor");
    expect(
      patriotInspectionReducer(other, { type: "TOGGLE", id: "interceptor" }).selectedId,
    ).toBeNull();
  });

  it("Échap efface tout, et un identifiant inconnu ne change rien", () => {
    const busy = { previewId: "amg", selectedId: "ecs" } as const;
    expect(patriotInspectionReducer(busy, { type: "CLEAR_SELECTION" })).toEqual(
      PATRIOT_INITIAL_INSPECTION_STATE,
    );
    expect(
      patriotInspectionReducer(PATRIOT_INITIAL_INSPECTION_STATE, { type: "CLEAR_SELECTION" }),
    ).toBe(PATRIOT_INITIAL_INSPECTION_STATE);
    const invalid = "warhead" as PatriotInspectableId;
    expect(isPatriotInspectableId(invalid)).toBe(false);
    expect(
      patriotInspectionReducer(PATRIOT_INITIAL_INSPECTION_STATE, { type: "TOGGLE", id: invalid }),
    ).toBe(PATRIOT_INITIAL_INSPECTION_STATE);
    expect(
      patriotInspectionReducer(PATRIOT_INITIAL_INSPECTION_STATE, { type: "PREVIEW", id: invalid }),
    ).toBe(PATRIOT_INITIAL_INSPECTION_STATE);
  });
});

describe("contrat avec le GLB publié", () => {
  it("reste léger et ne demande que meshopt et la quantification", () => {
    expect(GLB.bytes).toBeLessThan(GLB_BUDGET_BYTES);
    expect([...(GLB.json.extensionsRequired ?? [])].sort()).toEqual([
      "EXT_meshopt_compression",
      "KHR_mesh_quantization",
    ]);
    // Aucun décodeur Draco à charger depuis un CDN.
    expect(GLB.json.extensionsUsed ?? []).not.toContain("KHR_draco_mesh_compression");
  });

  it("contient une seule fois chaque nœud piloté par la planche", () => {
    const manifest = PATRIOT_ASSET_MANIFEST;
    const driven = [
      manifest.rootNode,
      manifest.heroStation,
      manifest.heroTractor,
      manifest.launcherNode,
      manifest.turretNode,
      ...Object.values(manifest.missileNodes),
      ...Object.values(manifest.liveCanisters),
      ...Object.values(manifest.coverNodes).flatMap((cover) => [cover.front, cover.rear]),
    ];
    for (const name of driven) {
      expect(NODE_NAMES.filter((candidate) => candidate === name), name).toHaveLength(1);
    }
  });

  it("rend chaque entrée du catalogue réellement désignable dans la scène", () => {
    const covered = new Set(
      NODE_NAMES.map(patriotInspectionIdForNodeName).filter((id) => id !== null),
    );
    expect([...covered].sort()).toEqual([...PATRIOT_INSPECTABLE_IDS].sort());
    for (const name of NODE_NAMES.filter((candidate) => candidate.startsWith("PAT_LS1_"))) {
      expect(patriotInspectionIdForNodeName(name), name).not.toBeNull();
    }
  });

  it("expose les quatre clips, aux durées de repli déclarées", () => {
    const clips = PATRIOT_ASSET_MANIFEST.animationClips;
    expect(GLB.json.animations.map((animation) => animation.name).sort()).toEqual(
      Object.values(clips).sort(),
    );
    expect(clip(clips.emplace).duration * 1000).toBeCloseTo(
      PATRIOT_FALLBACK_CLIP_DURATIONS.emplaceMs,
      -1,
    );
    expect(clip(clips.elevate).duration * 1000).toBeCloseTo(
      PATRIOT_FALLBACK_CLIP_DURATIONS.elevateMs,
      -1,
    );
  });

  it("n’anime que ce que chaque clip doit animer", () => {
    const clips = PATRIOT_ASSET_MANIFEST.animationClips;
    for (const target of clip(clips.finsA).targets) {
      expect(target).toMatch(/^PAT_LS1_Missile_A_Fin\d$/);
    }
    for (const target of clip(clips.finsB).targets) {
      expect(target).toMatch(/^PAT_LS1_Missile_B_Fin\d$/);
    }
    // L'élévation ne touche ni la remorque ni les intercepteurs : ils suivent
    // le lanceur par filiation.
    const elevate = clip(clips.elevate).targets;
    expect(elevate).toContain(PATRIOT_ASSET_MANIFEST.turretNode);
    expect(elevate).toContain(PATRIOT_ASSET_MANIFEST.launcherNode);
    for (const target of elevate) {
      expect(target).not.toMatch(/Missile|Trailer|Canister/);
    }
    // La mise en batterie déplace le tracteur et les stabilisateurs, jamais le lanceur.
    const emplace = clip(clips.emplace).targets;
    expect(emplace).toContain(PATRIOT_ASSET_MANIFEST.heroTractor);
    expect(emplace.some((target) => target.startsWith("PAT_LS1_Outrigger_"))).toBe(true);
    expect(emplace).not.toContain(PATRIOT_ASSET_MANIFEST.launcherNode);
  });
});
