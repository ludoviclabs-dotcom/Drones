import { describe, expect, it } from "vitest";
import { getCostRecords, type CostRecord } from "@/lib/cost-records";

// Page /couts — le parseur ne doit jamais fabriquer un coût. Un nombre n'est
// un montant que s'il est accolé à une devise ou une unité monétaire explicite ;
// une année, un calibre ou un format « 8x8 » n'en est pas un. Tests écrits sur
// les cas relevés en production le 17/11/2026 (panoplie_ecarts_site.csv,
// PAN-006, PAN-007, PAN-014, PAN-017).

const records = getCostRecords();

function lignes(systemId: string, extrait: string): CostRecord[] {
  const trouvees = records.filter(
    (r) => r.systemId === systemId && r.rawValue.includes(extrait),
  );
  expect(trouvees.length, `${systemId} : aucune ligne contenant « ${extrait} »`).toBeGreaterThan(0);
  return trouvees;
}

describe("/couts — les cinq cas relevés en production", () => {
  it("Leopard 2A8 : l'année 2022 n'est pas un coût (« 2 022 EUR »)", () => {
    for (const r of lignes("leopard-2a8", "post-2022")) {
      expect(r.amount, r.rawValue).toBeNull();
      expect(r.currency).toBe("N/A");
    }
  });

  it("CAESAR 6x6 / Mk2 : le calibre 155 mm n'est pas un coût (« 155 EUR »)", () => {
    for (const r of lignes("caesar-mk2", "155 mm")) {
      expect(r.amount, r.rawValue).toBeNull();
    }
  });

  it("CAESAR 8x8 et RCH 155 : « 8x8 » n'est pas un coût (« 8 EUR »)", () => {
    for (const r of lignes("caesar-8x8", "8x8")) expect(r.amount, r.rawValue).toBeNull();
    for (const r of lignes("rch-155", "8x8")) expect(r.amount, r.rawValue).toBeNull();
  });

  it("F126 : l'année 2024 n'est pas un montant (« 2024.0 Md EUR »)", () => {
    // La ligne d'origine (« plusieurs milliards d'euros — six frégates
    // commandées (2024) ») est couverte, texte à l'appui, par
    // cost-extraction.test.ts ; ici, aucune ligne F126 ne peut valoir un
    // montant de plusieurs milliers de milliards, et les montants du registre
    // sont repris tels quels, en euros.
    const f126 = records.filter((r) => r.systemId === "f126-niedersachsen");
    expect(f126.length).toBeGreaterThan(0);
    for (const r of f126) {
      if (r.amount !== null) expect(r.amount, r.rawValue).toBeLessThan(100e9);
    }
    const prevu = lignes("f126-niedersachsen", "Environ 10 Md€ pour six frégates")[0];
    expect(prevu.amount).toBe(10e9);
    expect(prevu.currency).toBe("EUR");
    const besoin = lignes("f126-niedersachsen", "Plus de 18 Md€")[0];
    expect(besoin.amount).toBe(18e9);
  });
});

describe("/couts — même défaut, autres lignes", () => {
  it("ARCHER : « C2 » n'est pas 2 EUR", () => {
    for (const r of lignes("archer", "intégration C2")) expect(r.amount, r.rawValue).toBeNull();
  });

  it("aucune devise n'est lue dans un mot (« cadence » ≠ CAD, « capteur » ≠ EUR)", () => {
    for (const r of lignes("leopard-2a8", "cadence")) expect(r.currency).not.toBe("CAD");
    for (const r of lignes("f110-bonifaz", "cadence")) expect(r.currency).not.toBe("CAD");
  });
});

const MARQUEUR_MONETAIRE = /[€$£₹]|\b(?:EUR|USD|GBP|CAD|INR|AUD)\b|\b(?:euros?|dollars?|livres sterling|roupies?)\b/i;

describe("/couts — invariants sur toutes les lignes extraites", () => {
  const extraites = records.filter((r) => !r.curated);

  it("un montant extrait suppose une devise ou une unité monétaire explicite dans la valeur", () => {
    const fautives = extraites
      .filter((r) => r.amount !== null && !MARQUEUR_MONETAIRE.test(r.rawValue))
      .map((r) => `${r.systemId} → ${r.amount} ${r.currency} ← « ${r.rawValue} »`);
    expect(fautives, fautives.join("\n")).toEqual([]);
  });

  it("une ligne avec montant a une devise connue (jamais « N/A »)", () => {
    const fautives = extraites
      .filter((r) => r.amount !== null && r.currency === "N/A")
      .map((r) => `${r.systemId} ← « ${r.rawValue} »`);
    expect(fautives, fautives.join("\n")).toEqual([]);
  });

  it("la devise d'une ligne est celle écrite dans la valeur, sans substitution", () => {
    const fautives = extraites
      .filter((r) => {
        if (r.amount === null) return false;
        const euro = /€|\bEUR\b|\beuros?\b/i.test(r.rawValue);
        const dollar = /\$|\bUSD\b|\bdollars?\b/i.test(r.rawValue);
        const livre = /£|\bGBP\b/i.test(r.rawValue);
        if (r.currency === "EUR") return !euro;
        if (r.currency === "USD") return !dollar;
        if (r.currency === "GBP") return !livre;
        return false;
      })
      .map((r) => `${r.systemId} → ${r.currency} ← « ${r.rawValue} »`);
    expect(fautives, fautives.join("\n")).toEqual([]);
  });

  it("un montant en dollars n'est jamais affiché en euros (THAAD, AN/TPY-2, Gerald R. Ford…)", () => {
    const thaad = extraites.filter((r) => r.systemId === "thaad" && /M\$/.test(r.rawValue));
    expect(thaad.length).toBeGreaterThan(0);
    for (const r of thaad) expect(r.currency, r.rawValue).toBe("USD");
  });
});
