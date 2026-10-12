import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Accueil refondu — six séquences : hero, démonstration d'un dossier en cinq
 * angles, index des domaines, instruments, méthode, catalogue. Le titre et les
 * actions sont visibles sans défilement ; les panneaux se pilotent au clavier ;
 * le catalogue se déplie sur place.
 */

test.describe("Accueil — six séquences", () => {
  for (const [width, height] of [
    [1440, 900],
    [375, 812],
  ] as const) {
    test(`${width}px — titre et actions dans le premier écran, sans débordement`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height });
      await page.goto("/");
      const h1 = page.getByRole("heading", { level: 1 });
      await expect(h1).toContainText(
        "Un système d'armes n'est jamais un simple achat.",
      );
      const primary = page.getByRole("link", { name: "Ouvrir le recueil →" });
      await expect(primary).toHaveAttribute("href", "#catalogue");
      const boxes = await Promise.all([
        h1.boundingBox(),
        primary.boundingBox(),
        page.getByRole("link", { name: "Voir les planches techniques →" }).boundingBox(),
      ]);
      for (const box of boxes) {
        expect(box).not.toBeNull();
        expect(box!.y + box!.height).toBeLessThanOrEqual(height);
      }
      // Sur mobile, le message et les actions précèdent le visuel.
      if (width < 768) {
        const plate = await page
          .locator('article[data-hud-board="rafale-f4-meteor"]')
          .boundingBox();
        expect(plate!.y).toBeGreaterThan(boxes[1]!.y + boxes[1]!.height);
      }
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow).toBe(0);
      // Les six séquences sont là, dans l'ordre.
      const ids = await page
        .locator("main section[id]")
        .evaluateAll((nodes) => nodes.map((node) => node.id));
      expect(ids).toEqual([
        "demonstration",
        "domaines",
        "instruments",
        "methode",
        "catalogue",
      ]);
    });
  }

  test("démonstration : cinq angles, panneau commuté au clic et au clavier", async ({
    page,
  }) => {
    await page.goto("/");
    const tabs = page.getByRole("tablist", { name: "Les cinq angles de lecture" });
    await expect(tabs.getByRole("tab")).toHaveText([
      /Coût/,
      /Financement/,
      /Chaîne industrielle/,
      /Géopolitique/,
      /Export/,
    ]);
    const panel = page.getByRole("tabpanel");
    await expect(panel).toContainText("Angle 01 — Coût");
    await expect(panel).toContainText("Coût d'acquisition unitaire");
    await expect(panel).toContainText("Source : Air & Cosmos");

    await tabs.getByRole("tab", { name: /Export/ }).click();
    await expect(panel).toContainText("Angle 05 — Export");
    await expect(panel).toContainText("Régime applicable");
    await expect(
      tabs.getByRole("tab", { name: /Export/ }),
    ).toHaveAttribute("aria-selected", "true");

    // Clavier : Début, Flèche bas, Fin.
    await tabs.getByRole("tab", { name: /Export/ }).focus();
    await page.keyboard.press("Home");
    await expect(panel).toContainText("Angle 01 — Coût");
    await page.keyboard.press("ArrowDown");
    await expect(panel).toContainText("Angle 02 — Financement");
    await expect(tabs.getByRole("tab", { name: /Financement/ })).toBeFocused();
    await page.keyboard.press("End");
    await expect(panel).toContainText("Angle 05 — Export");

    // Le dossier complet reste à un lien.
    await expect(
      panel.getByRole("link", { name: "Ouvrir le dossier complet →" }),
    ).toHaveAttribute("href", "/systemes/rafale");
  });

  test("index des domaines : onze lignes, aperçu suivant le focus", async ({
    page,
  }) => {
    await page.goto("/");
    const list = page.getByRole("list", { name: "Domaines" });
    await expect(list.getByRole("link")).toHaveCount(11);
    const preview = page.locator("#domaines aside");
    await expect(preview).toContainText("Aviation de combat");
    await list.getByRole("link", { name: /Radars/ }).focus();
    await expect(preview).toContainText("Radars");
    await expect(
      preview.getByRole("link", { name: "Ouvrir le domaine →" }),
    ).toHaveAttribute("href", "/radars");
    await expect(
      list.getByRole("link", { name: /Drones & munitions rôdeuses/ }),
    ).toHaveAttribute("href", "/#catalogue");
  });

  test("instruments : extrait du comparateur et du graphe, sans 3D chargée", async ({
    page,
  }) => {
    await page.goto("/");
    const section = page.locator("#instruments");
    await expect(section.getByRole("table")).toContainText("Exportabilité");
    await expect(section.getByRole("link", { name: "Ouvrir le comparateur →" })).toHaveAttribute(
      "href",
      "/comparateur",
    );
    await expect(
      section.getByRole("img", { name: /Extrait du graphe industriel/ }),
    ).toBeVisible();
    await expect(section.getByRole("link", { name: "Ouvrir le graphe →" })).toHaveAttribute(
      "href",
      "/industrial-graph",
    );
    // Aucun contexte WebGL sur l'accueil : les planches y sont des vignettes.
    expect(await page.locator("canvas").count()).toBe(0);
  });

  test("méthode : effectifs dérivés du registre, exemple scoré", async ({
    page,
  }) => {
    await page.goto("/");
    const section = page.locator("#methode");
    await expect(section).toContainText("Confiance des données");
    await expect(section).toContainText("Fiabilité des sources");
    await expect(section).toContainText("Sources datées");
    await expect(section).toContainText(/Score \d+ \/ 100/);
    await expect(section.getByRole("link", { name: "Lire la méthodologie →" })).toHaveAttribute(
      "href",
      "/methodologie",
    );
  });

  test("catalogue : aperçu puis dépliage sur place, recherche qui déplie d'office", async ({
    page,
  }) => {
    await page.goto("/");
    const cards = page.locator("#catalogue a[href^='/systemes/']:visible");
    await expect(cards).toHaveCount(6);
    const expand = page.getByRole("button", { name: /Afficher les \d+ autres dossiers/ });
    await expect(expand).toHaveAttribute("aria-expanded", "false");
    await expand.click();
    await expect(cards).toHaveCount(153);
    await expect(expand).toHaveCount(0);
    await page.getByRole("button", { name: "Replier le catalogue ↑" }).click();
    await expect(cards).toHaveCount(6);

    // Une recherche montre tous ses résultats, aperçu ou non.
    await page.getByRole("searchbox").fill("rafale");
    await expect(cards.first()).toHaveAttribute("href", "/systemes/rafale");
    expect(await cards.count()).toBeGreaterThanOrEqual(1);
    await expect(expand).toHaveCount(0);
  });

  test("accessibilité : aucune violation structurelle sérieuse", async ({ page }) => {
    test.setTimeout(120_000);
    await page.goto("/");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    const serious = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    const structural = serious.filter((v) => v.id !== "color-contrast");
    expect(
      structural.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`),
    ).toEqual([]);
    // Le contraste est un gate dur sur l'accueil refondu : chaque couple
    // texte/fond y a été choisi pour AA.
    const contrast = serious.filter((v) => v.id === "color-contrast");
    expect(
      contrast.flatMap((v) => v.nodes.map((n) => n.target.join(" "))),
    ).toEqual([]);
  });
});
