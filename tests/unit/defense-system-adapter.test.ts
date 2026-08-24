import { describe, expect, it } from "vitest";

import { toDefenseSystemScene } from "@/adapters/defense-system";
import { validateScene, type ReadoutPanel } from "@/components/hud-scene";
import { mq9Reaper } from "@/data/systems/mq-9-reaper";
import type { DefenseSystem, Grade } from "@/data/types";

const DASH = "—";

function panel(scene: ReturnType<typeof toDefenseSystemScene>, id: string): ReadoutPanel {
  const candidate = scene.panels.find((item) => item.id === id);

  if (!candidate || candidate.kind !== "readout") {
    throw new Error(`Panneau de lecture introuvable : ${id}`);
  }

  return candidate;
}

describe("toDefenseSystemScene", () => {
  it("adapte un système renseigné sans enfreindre le contrat HUD", () => {
    const scene = toDefenseSystemScene(mq9Reaper);
    const identity = panel(scene, "identity");

    expect(validateScene(scene)).toEqual([]);
    expect(scene.panels).toHaveLength(4);
    expect(scene.panels.every((item) => item.source === "Panoplie — catalogue des systèmes")).toBe(
      true,
    );
    expect(identity.rows).toContainEqual(
      expect.objectContaining({ label: "Référence", value: mq9Reaper.reference }),
    );
  });

  it("signale toute donnée manquante sans lui substituer une valeur", () => {
    const incomplete: DefenseSystem = {
      ...mq9Reaper,
      reference: "",
      manufacturer: "",
      country: "",
      status: "",
      updated: "",
      keySpecs: [],
      scores: [],
      sources: [],
    };
    const scene = toDefenseSystemScene(incomplete);

    expect(validateScene(scene)).toEqual([]);
    expect(panel(scene, "identity").severity).toBe("offline");

    for (const id of ["key-specs", "scores", "source-register"]) {
      const readout = panel(scene, id);

      expect(readout.severity).toBe("offline");
      expect(readout.rows[0]).toMatchObject({ value: DASH, severity: "offline" });
    }
  });

  it("met hors ligne une note hors bornes au lieu de l'afficher", () => {
    const outOfBounds: DefenseSystem = {
      ...mq9Reaper,
      scores: [{ ...mq9Reaper.scores[0], grade: "Z" as Grade }],
    };
    const scene = toDefenseSystemScene(outOfBounds);
    const scores = panel(scene, "scores");

    expect(validateScene(scene)).toEqual([]);
    expect(scores.severity).toBe("offline");
    expect(scores.rows[0]).toMatchObject({ value: DASH, severity: "offline" });
  });
});
