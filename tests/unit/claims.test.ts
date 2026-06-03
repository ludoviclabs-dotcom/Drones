import { describe, expect, it } from "vitest";
import { getAllClaims, getEvidenceStats } from "@/lib/claims";

describe("registre de preuves", () => {
  const claims = getAllClaims();
  const stats = getEvidenceStats();

  it("dérive des affirmations et aligne le compteur", () => {
    expect(claims.length).toBeGreaterThan(0);
    expect(stats.claims).toBe(claims.length);
  });

  it("la ventilation par statut couvre exactement le total", () => {
    const sum =
      stats.byStatus.verifie +
      stats.byStatus["a-recouper"] +
      stats.byStatus.variable;
    expect(sum).toBe(stats.claims);
  });

  it("la ventilation par confiance couvre exactement le total", () => {
    const sum =
      stats.byConfidence.haute +
      stats.byConfidence.moyenne +
      stats.byConfidence.faible;
    expect(sum).toBe(stats.claims);
  });

  it("la date d'arrêté du registre est au format ISO court", () => {
    expect(stats.updated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
