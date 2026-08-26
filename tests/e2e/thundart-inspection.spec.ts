import { expect, test, type Page } from "@playwright/test";

const ROUTE = "/hud/thundart";
const COMPONENTS = [
  "VEHICLE",
  "LAUNCHER BASE",
  "LAUNCHER RACK",
  "CANISTER GROUP",
  "DEMONSTRATION PROJECTILE",
] as const;

const experience = (page: Page) => page.locator("[data-thundart-inspection]");
const scene = (page: Page) => page.locator("[data-thundart-motion]");
const componentButton = (page: Page, name: (typeof COMPONENTS)[number]) =>
  page.getByRole("button", { name });

test.describe.configure({ mode: "default", timeout: 60_000 });

test.describe("Thundart — HUD technique accessible", () => {
  test("expose le système, la source et cinq composants dans le DOM", async ({
    page,
  }) => {
    await page.goto(ROUTE);

    await expect(
      page.getByRole("heading", { name: "Thundart — inspection extérieure 3D" }),
    ).toBeVisible();
    await expect(
      page.getByText(
        "Représentation illustrative. Aucun ciblage ou calcul opérationnel.",
        { exact: true },
      ),
    ).toBeVisible();
    await expect(
      page.getByText("THUNDART — DEMONSTRATION VIEW").first(),
    ).toBeVisible();
    await expect(page.getByText("DOCUMENTÉ · HANDOFF THD-01")).toBeVisible();

    for (const name of COMPONENTS) {
      await expect(componentButton(page, name)).toHaveAttribute(
        "aria-pressed",
        "false",
      );
    }
  });

  test("survol et focus donnent le même aperçu, le clic l’épingle", async ({
    page,
  }) => {
    await page.goto(ROUTE);
    const vehicle = componentButton(page, "VEHICLE");

    await vehicle.hover();
    await expect(experience(page)).toHaveAttribute(
      "data-thundart-inspection",
      "vehicle",
    );
    await expect(scene(page)).toHaveAttribute(
      "data-thundart-model-active",
      "vehicle",
    );
    await expect(vehicle).toHaveAttribute("aria-pressed", "false");

    await page.getByRole("heading", { level: 1 }).hover();
    await expect(experience(page)).toHaveAttribute(
      "data-thundart-inspection",
      "none",
    );

    await vehicle.focus();
    await expect(experience(page)).toHaveAttribute(
      "data-thundart-inspection",
      "vehicle",
    );
    await vehicle.click();
    await expect(vehicle).toHaveAttribute("aria-pressed", "true");
    await expect(experience(page)).toHaveAttribute(
      "data-thundart-inspection-selected",
      "vehicle",
    );
    await expect(scene(page)).toHaveAttribute(
      "data-thundart-model-selected",
      "vehicle",
    );
  });

  test("Entrée, Espace, Échap, Tab et Shift+Tab restent natifs", async ({
    page,
  }) => {
    await page.goto(ROUTE);
    const vehicle = componentButton(page, "VEHICLE");
    const base = componentButton(page, "LAUNCHER BASE");

    await vehicle.focus();
    await page.keyboard.press("Enter");
    await expect(vehicle).toHaveAttribute("aria-pressed", "true");
    await page.keyboard.press("Enter");
    await expect(vehicle).toHaveAttribute("aria-pressed", "false");

    await page.keyboard.press("Space");
    await expect(vehicle).toHaveAttribute("aria-pressed", "true");
    await page.keyboard.press("Escape");
    await expect(vehicle).toHaveAttribute("aria-pressed", "false");

    await page.keyboard.press("Tab");
    await expect(base).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(vehicle).toBeFocused();
  });

  test("la sélection n’ajoute aucun mouvement en mode réduit", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(ROUTE);
    const rack = componentButton(page, "LAUNCHER RACK");

    await expect(scene(page)).toHaveAttribute(
      "data-thundart-reduced-motion",
      "true",
    );
    await expect(scene(page)).toHaveAttribute("data-thundart-motion", "idle");
    await rack.click();
    await expect(rack).toHaveAttribute("aria-pressed", "true");
    await expect(scene(page)).toHaveAttribute("data-thundart-motion", "idle");
    expect(await rack.evaluate((element) => getComputedStyle(element).transitionDuration)).toBe(
      "0s",
    );
  });

  for (const width of [375, 430, 768, 1024, 1440, 1920]) {
    test(`${width}px — aucun débordement et cibles tactiles utilisables`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: width < 768 ? 900 : 1000 });
      await page.goto(ROUTE);
      await expect(scene(page)).toHaveAttribute("data-thundart-asset", "ready", {
        timeout: 30_000,
      });

      const layout = await page.evaluate(() => ({
        documentOverflow:
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
        mainOverflow: (() => {
          const main = document.querySelector("main");
          return main ? main.scrollWidth - main.clientWidth : -1;
        })(),
      }));
      expect(layout).toEqual({ documentOverflow: 0, mainOverflow: 0 });

      const box = await componentButton(page, "VEHICLE").boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(48);

      const sceneBox = await scene(page).boundingBox();
      const panelBox = await page
        .getByRole("complementary", { name: "Sous-ensembles visibles" })
        .boundingBox();
      if (width >= 1024) {
        expect(panelBox!.x).toBeGreaterThan(sceneBox!.x + sceneBox!.width);
      } else {
        expect(panelBox!.y).toBeGreaterThan(sceneBox!.y);
      }
    });
  }
});
