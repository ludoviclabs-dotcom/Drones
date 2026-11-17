import { describe, expect, it } from "vitest";
import { extractMonetaryAmount } from "@/lib/cost-extraction";

const amount = (t: string) => extractMonetaryAmount(t);

describe("extractMonetaryAmount — ce qui n'est pas un montant", () => {
  it.each([
    ["année", "Commandes nationales et europeennes, reconstitution post-2022"],
    ["année entre parenthèses", "Programme de plusieurs milliards d'euros — six frégates commandées (2024)"],
    ["calibre", "KNDS France, porteurs, tubes 155 mm, électronique, munitions"],
    ["format NxN", "MCO influencé par porteur 8x8, automatisation et stock de pièces"],
    ["sigle C2", "BAE Systems Bofors, porteurs, intégration C2 et munitions 155 mm"],
    ["« cadence » ne contient pas CAD", "Soutien SCOMBA/IAFCL/SPY-7 et cadence Ferrol à suivre."],
    ["« capteur » ne contient pas EUR", "Coût capteur intégré dans le coût plateforme — ≈ 10 à 15 % du coût frégate"],
    ["quantité de roquettes", "Coût par pod (6 roquettes) — programme Army P-1"],
    ["pourcentage", "estimation analyste ≈ 50 % du coût total sur 25-30 ans"],
    ["« plusieurs centaines de millions » sans nombre", "système naval complet à plusieurs centaines de millions"],
    ["année du budget", "L'arbitrage de coût relève de la décision de 2027"],
  ])("%s → aucun montant", (_nom, texte) => {
    expect(amount(texte)).toBeNull();
  });
});

describe("extractMonetaryAmount — ce qui est un montant, avec sa devise d'origine", () => {
  it.each([
    ["7,1 Md€ HT — 20 systèmes / 60 drones", 7_100_000_000, "EUR"],
    ["≈ 33,9 M$ par intercepteur — gross weapon system FY2025", 33_900_000, "USD"],
    ["33,864 M$ par intercepteur", 33_864_000, "USD"],
    ["≥ 1 580 Md$ sur le cycle de vie de la flotte", 1_580_000_000_000, "USD"],
    ["OTAN AGS — 5 RQ-4D, contrat ≈ 1,7 Md$ (2012)", 1_700_000_000, "USD"],
    ["≈ US$13 Md ordre public de grandeur", 13_000_000_000, "USD"],
    ["≈ US$4,3–4,5 Md avec VPM", 4_300_000_000, "USD"],
    ["≈ €4,3 Md / 5 navires", 4_300_000_000, "EUR"],
    ["≈ 2 Md£ pour la phase Mk2", 2_000_000_000, "GBP"],
    ["316 M£ — deux premiers systèmes de série", 316_000_000, "GBP"],
    ["20,7 milliards USD", 20_700_000_000, "USD"],
    ["12 milliards d'euros", 12_000_000_000, "EUR"],
    ["> 100 000 $ le coup", 100_000, "USD"],
    ["5–10 M€ par appareil", 5_000_000, "EUR"],
    ["≈ 350 à 950 M$ par capteur selon configuration", 350_000_000, "USD"],
    ["De l'ordre de 80–120 M€ selon la version et le lot", 80_000_000, "EUR"],
    ["≈ 600 M$ de location (2018) + 166 M$ d'armement (2022)", 600_000_000, "USD"],
    ["Plus de 20 Md$ attribués à Boeing", 20_000_000_000, "USD"],
    ["≈ 0,48 M$ par missile", 480_000, "USD"],
    ["3 203 missiles pour 13 960 M$", 13_960_000_000, "USD"],
  ])("« %s »", (texte, attendu, devise) => {
    expect(amount(texte)).toEqual({ amount: attendu, currency: devise });
  });

  it("garde la devise écrite — jamais de conversion", () => {
    expect(amount("≈ 805 M$ (2018, 4 vecteurs EDM)")?.currency).toBe("USD");
    expect(amount("jusqu'à 20,0 Md$")?.currency).toBe("USD");
    expect(amount("≈ 3,2 Md€ pour 3 unités (contrat 2024)")?.currency).toBe("EUR");
    expect(amount("≈ 8 000 ₹")?.currency).toBe("INR");
  });
});
