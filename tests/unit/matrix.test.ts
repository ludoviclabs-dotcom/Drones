import { describe, expect, it } from "vitest";
import { getMatrixPoints } from "@/lib/matrix";
import { systems } from "@/data/systems";

describe("getMatrixPoints", () => {
  const points = getMatrixPoints();

  it("produit un point par système", () => {
    expect(points).toHaveLength(systems.length);
  });

  it("borne chaque coordonnée dans [6, 94]", () => {
    for (const p of points) {
      expect(p.x).toBeGreaterThanOrEqual(6);
      expect(p.x).toBeLessThanOrEqual(94);
      expect(p.y).toBeGreaterThanOrEqual(6);
      expect(p.y).toBeLessThanOrEqual(94);
    }
  });
});
