import AxeBuilder from "@axe-core/playwright";
import { expect, test, type ConsoleMessage, type Page } from "@playwright/test";

const ROUTE = "/hud/thundart";
const ASSET_PATH = "/models/hud/thundart.glb";
const scene = (page: Page) => page.locator("[data-thundart-motion]");
const experience = (page: Page) => page.locator("[data-sequence-state]");

function isLocalVercelTelemetry(message: ConsoleMessage) {
  const url = message.location().url;
  return (
    message.type() === "error" &&
    (url.includes("/_vercel/insights/") ||
      url.includes("/_vercel/speed-insights/"))
  );
}

async function waitForAsset(page: Page) {
  await expect(scene(page)).toHaveAttribute("data-thundart-asset", "ready", {
    timeout: 30_000,
  });
}

test.describe.configure({ mode: "default", timeout: 90_000 });

test.describe("Thundart — candidate Preview", () => {
  test("répond en HTTP, livre le HTML essentiel puis charge le GLB", async ({
    page,
    request,
  }) => {
    const response = await request.get(ROUTE);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain("Thundart — inspection extérieure 3D");
    expect(html).toContain("THUNDART — DEMONSTRATION VIEW");
    expect(html).toContain("Préparation différée de la vue 3D locale");
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    expect(await sitemap.text()).toContain(ROUTE);

    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error" && !isLocalVercelTelemetry(message)) {
        consoleErrors.push(message.text());
      }
    });
    page.on("pageerror", (error) => pageErrors.push(error.message));

    const assetResponse = page.waitForResponse((candidate) =>
      candidate.url().endsWith(ASSET_PATH),
    );
    const navigation = await page.goto(ROUTE);
    expect(navigation?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { name: "Thundart — inspection extérieure 3D" }),
    ).toBeVisible();
    await expect(
      page.getByText("THUNDART — DEMONSTRATION VIEW").first(),
    ).toBeVisible();
    expect((await assetResponse).status()).toBe(200);
    await waitForAsset(page);
    await expect(page.locator("canvas")).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /\/hud\/thundart$/,
    );
    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
  });

  test("NEXT, PREVIOUS, RESET et double clic convergent sans ambiguïté", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(ROUTE);
    await waitForAsset(page);

    const next = page.getByRole("button", { name: "Suivant" });
    const previous = page.getByRole("button", { name: "Précédent" });
    const reset = page.getByRole("button", { name: "Réinitialiser" });

    await next.click();
    await expect(experience(page)).toHaveAttribute("data-sequence-state", "inspect");
    await previous.click();
    await expect(experience(page)).toHaveAttribute("data-sequence-state", "overview");

    await next.dblclick();
    await expect(experience(page)).toHaveAttribute("data-sequence-state", "configure");
    await next.click();
    await expect(experience(page)).toHaveAttribute("data-sequence-state", "departure");
    await reset.click();
    await expect(experience(page)).toHaveAttribute("data-sequence-state", "overview");
    await expect(scene(page)).toHaveAttribute("data-thundart-motion", "idle");
  });

  test("COMPLETE atteint une frame finale distincte et borne NEXT", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(ROUTE);
    await waitForAsset(page);

    const next = page.getByRole("button", { name: "Suivant" });
    for (let step = 0; step < 4; step += 1) await next.click();

    await expect(experience(page)).toHaveAttribute("data-sequence-state", "complete");
    await expect(scene(page)).toHaveAttribute("data-thundart-motion", "idle");
    await expect(next).toBeDisabled();
    await expect(page.getByText("Planche terminée", { exact: true })).toBeVisible();
  });

  test("l’ancre de la planche reste sous le header sticky", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(ROUTE);
    await waitForAsset(page);
    await page.locator("#thundart-experience").evaluate((element) =>
      element.scrollIntoView(),
    );

    const clearOfHeader = await page.evaluate(() => {
      const sceneBox = document
        .querySelector("[data-thundart-motion]")
        ?.getBoundingClientRect();
      const headerBox = document.querySelector("header")?.getBoundingClientRect();
      return Boolean(sceneBox && headerBox && sceneBox.top >= headerBox.bottom);
    });
    expect(clearOfHeader).toBe(true);
  });

  test("navigation, retour, reload et resize conservent une page stable", async ({
    page,
  }) => {
    await page.goto("/");
    await page
      .getByRole("contentinfo")
      .getByRole("link", { name: "HUD Thundart" })
      .click();
    await expect(page).toHaveURL(new RegExp(`${ROUTE}$`));
    await waitForAsset(page);

    await page.reload();
    await waitForAsset(page);
    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await page.goForward();
    await waitForAsset(page);

    await page.getByRole("button", { name: "LAUNCHER RACK" }).click();
    for (const width of [1440, 375, 768, 1024, 1920]) {
      await page.setViewportSize({ width, height: width < 768 ? 812 : 900 });
      await expect(experience(page)).toHaveAttribute(
        "data-thundart-inspection-selected",
        "launcher-rack",
      );
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth,
        ),
      ).toBe(0);
    }
  });

  test("tap, Escape et tabulation complète restent accessibles", async ({
    browser,
  }) => {
    const context = await browser.newContext({
      baseURL: "http://localhost:3000",
      hasTouch: true,
      viewport: { width: 375, height: 812 },
    });
    const page = await context.newPage();
    try {
      await page.goto(ROUTE);
      await waitForAsset(page);

      const vehicle = page.getByRole("button", { name: "VEHICLE" });
      await vehicle.tap();
      await expect(vehicle).toHaveAttribute("aria-pressed", "true");
      await page.keyboard.press("Escape");
      await expect(vehicle).toHaveAttribute("aria-pressed", "false");

      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.getByRole("button", { name: "Suivant" }).click();
      const expectedOrder = [
        "Précédent",
        "Réinitialiser",
        "Suivant",
        "VEHICLE",
        "LAUNCHER BASE",
        "LAUNCHER RACK",
        "CANISTER GROUP",
        "DEMONSTRATION PROJECTILE",
      ];
      await page.getByRole("button", { name: expectedOrder[0] }).focus();
      for (const name of expectedOrder) {
        await expect(page.getByRole("button", { name })).toBeFocused();
        await page.keyboard.press("Tab");
      }
      expect(
        await page.evaluate(() =>
          Boolean(document.activeElement?.closest("[data-sequence-state]")),
        ),
      ).toBe(false);
      await page.keyboard.press("Shift+Tab");
      await expect(
        page.getByRole("button", { name: "DEMONSTRATION PROJECTILE" }),
      ).toBeFocused();
    } finally {
      await context.close();
    }
  });

  test("le repos ne contient aucune animation CSS infinie", async ({ page }) => {
    await page.goto(ROUTE);
    await waitForAsset(page);
    await expect(scene(page)).toHaveAttribute("data-thundart-motion", "idle");

    const infiniteAnimations = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLElement>("body *"))
        .filter((element) => {
          const style = getComputedStyle(element);
          const names = style.animationName.split(",").map((value) => value.trim());
          const iterations = style.animationIterationCount
            .split(",")
            .map((value) => value.trim());
          return names.some(
            (name, index) =>
              name !== "none" &&
              (iterations[index] ?? iterations.at(-1)) === "infinite",
          );
        })
        .map((element) => ({
          tag: element.tagName,
          className: element.className,
        })),
    );
    expect(infiniteAnimations).toEqual([]);
  });

  for (const width of [375, 768, 1024, 1440, 1920]) {
    test(`axe WCAG 2.2 AA — ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: width < 768 ? 812 : 900 });
      await page.goto(ROUTE);
      await waitForAsset(page);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(
        results.violations.filter(
          (violation) =>
            violation.impact === "serious" || violation.impact === "critical",
        ),
      ).toEqual([]);
    });
  }
});
