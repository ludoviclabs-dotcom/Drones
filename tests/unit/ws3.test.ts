import { describe, expect, it } from "vitest";
import type { Claim } from "@/lib/claims";
import {
  freshnessBand,
  getSystemSectionConfidence,
  isPrimaryClaim,
} from "@/lib/claims";
import { claimsToCsv, claimsToJson } from "@/lib/export";
import { familyLabel, primaryCountry } from "@/lib/grouping";
import { NAVAL_VESSEL_LABELS } from "@/data/labels";

function makeClaim(overrides: Partial<Claim> = {}): Claim {
  return {
    systemSlug: "x",
    systemName: "Système, X",
    systemReference: "PNP-NS-001",
    category: "naval-vessel",
    scope: "cout",
    label: 'Coût "complet"',
    value: "A · B, C",
    confidence: "moyenne",
    status: "a-recouper",
    sources: [
      {
        id: "s1",
        title: "T",
        publisher: "Naval News",
        type: "presse",
        reliability: "B",
      },
    ],
    date: "2026-06-01",
    ...overrides,
  };
}

describe("export — CSV / JSON", () => {
  it("échappe guillemets et séparateurs et préfixe un BOM", () => {
    const csv = claimsToCsv([makeClaim()]);
    expect(csv.startsWith("﻿")).toBe(true);
    expect(csv).toContain("reference,systeme");
    // La valeur contient une virgule et un point médian → cellule entre guillemets.
    expect(csv).toContain('"A · B, C"');
    // Le label contient des guillemets → doublés et entourés.
    expect(csv).toContain('"Coût ""complet"""');
  });

  it("produit un JSON parsable et structuré", () => {
    const parsed = JSON.parse(claimsToJson([makeClaim()]));
    expect(parsed).toHaveLength(1);
    expect(parsed[0].reference).toBe("PNP-NS-001");
    expect(parsed[0].sources[0].publisher).toBe("Naval News");
  });
});

describe("fraîcheur", () => {
  const now = new Date("2026-06-03T00:00:00Z");
  it("classe par paliers d'âge", () => {
    expect(freshnessBand("2026-06-01", now)).toBe("frais");
    expect(freshnessBand("2026-01-01", now)).toBe("recent");
    expect(freshnessBand("2025-06-01", now)).toBe("a-rafraichir");
    expect(freshnessBand("2024-01-01", now)).toBe("perime");
  });
});

describe("source primaire", () => {
  it("reconnaît producteur / institution / officiel comme primaires", () => {
    expect(
      isPrimaryClaim(
        makeClaim({
          sources: [
            { id: "a", title: "t", publisher: "p", type: "institution", reliability: "A" },
          ],
        }),
      ),
    ).toBe(true);
    expect(
      isPrimaryClaim(
        makeClaim({
          sources: [
            { id: "a", title: "t", publisher: "p", type: "think-tank", reliability: "B" },
          ],
        }),
      ),
    ).toBe(false);
  });
});

describe("grouping", () => {
  it("extrait le pays principal", () => {
    expect(primaryCountry("France · Italie")).toBe("France");
    expect(primaryCountry("Allemagne")).toBe("Allemagne");
  });
  it("mappe la famille navale et retombe sur classLabel sinon", () => {
    expect(
      familyLabel({
        category: "naval-vessel",
        classLabel: "Z",
        navalVesselClass: "fregate",
      }),
    ).toBe(NAVAL_VESSEL_LABELS.fregate);
    expect(familyLabel({ category: "drone", classLabel: "MALE export" })).toBe(
      "MALE export",
    );
  });
});

describe("confiance par section", () => {
  it("renvoie des bandes valides pour un dossier réel", () => {
    const sections = getSystemSectionConfidence("fremm-france");
    expect(sections.length).toBeGreaterThan(0);
    for (const section of sections) {
      expect(["solide", "moyen", "fragile"]).toContain(section.band);
      expect(section.score).toBeGreaterThanOrEqual(1);
      expect(section.score).toBeLessThanOrEqual(3);
      expect(section.count).toBeGreaterThan(0);
    }
  });
});
