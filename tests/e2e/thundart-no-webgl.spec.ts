import AxeBuilder from "@axe-core/playwright";
import { expect, test, type ConsoleMessage, type Page } from "@playwright/test";

/**
 * Thundart sans WebGL 2 : la planche reste lisible et pilotable.
 *
 * three.js 0.184 exige WebGL 2. Sans détection préalable, R3F créait le rendu
 * dans un effet asynchrone dont l'échec échappait à toute frontière d'erreur :
 * la vue restait vide sur « Chargement de l’asset GLB local » et le GLB était
 * téléchargé pour rien. Ici, aucun contexte WebGL ne peut être créé ; on
 * vérifie le repli explicite, puis que la séquence et l'inspection restent
 * utilisables sans la scène.
 */

const ROUTE = "/hud/thundart";
const ASSET_PATH = "/models/hud/thundart.glb";
const STATES = ["overview", "inspect", "configure", "departure", "complete"] as const;
const COMPONENTS = [
  "VEHICLE",
  "LAUNCHER BASE",
  "LAUNCHER RACK",
  "CANISTER GROUP",
  "DEMONSTRATION PROJECTILE",
] as const;
const UNAVAILABLE_STATUS =
  "Vue 3D indisponible sans WebGL 2 · contrôles et inspection utilisables";

const scene = (page: Page) => page.locator("[data-thundart-motion]");
const experience = (page: Page) => page.locator("[data-sequence-state]");
const componentButton = (page: Page, name: (typeof COMPONENTS)[number]) =>
  page.getByRole("button", { name, exact: true });

function isLocalVercelTelemetry(message: ConsoleMessage) {
  const url = message.location().url;
  return (
    message.type() === "error" &&
    (url.includes("/_vercel/insights/") ||
      url.includes("/_vercel/speed-insights/"))
  );
}

/** Navigateur sans WebGL : aucun contexte WebGL ne peut être créé. */
async function openWithoutWebGl(page: Page) {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
      configurable: true,
      value(this: HTMLCanvasElement, type: string, ...rest: unknown[]) {
        if (/webgl/i.test(type)) return null;
        return Reflect.apply(original, this, [type, ...rest]);
      },
    });
  });
  await page.goto(ROUTE);
  // La scène est montée et a constaté l'absence de WebGL 2.
  await expect(scene(page)).toHaveAttribute("data-thundart-asset", "unavailable");
}

test.describe.configure({ mode: "default", timeout: 60_000 });

test.describe("Thundart — sans WebGL, la planche reste utilisable", () => {
  test("affiche un repli explicite, sans télécharger le GLB ni lever d’erreur", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    const assetRequests: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error" && !isLocalVercelTelemetry(message)) {
        consoleErrors.push(message.text());
      }
    });
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("request", (request) => {
      if (new URL(request.url()).pathname === ASSET_PATH) {
        assetRequests.push(request.url());
      }
    });

    await openWithoutWebGl(page);
    await expect(scene(page)).toHaveAttribute("data-thundart-render-profile", "none");
    await expect(scene(page)).toHaveAttribute("data-thundart-motion", "idle");
    await expect(scene(page)).toContainText("La vue 3D requiert WebGL 2");
    await expect(page.getByText(UNAVAILABLE_STATUS)).toBeVisible();
    await expect(page.getByText("Chargement de l’asset GLB local")).toHaveCount(0);
    await expect(page.getByText("Glisser · pivoter / molette · zoomer")).toHaveCount(0);
    await expect(scene(page).locator("canvas")).toHaveCount(0);

    // Plus aucune requête en vol : l'absence du GLB est un fait, pas une course.
    await page.waitForLoadState("networkidle");
    expect(assetRequests).toEqual([]);
    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
  });

  test("Suivant, Précédent et Réinitialiser parcourent les cinq états", async ({
    page,
  }) => {
    await openWithoutWebGl(page);
    const next = page.getByRole("button", { name: "Suivant" });
    const previous = page.getByRole("button", { name: "Précédent" });
    const reset = page.getByRole("button", { name: "Réinitialiser" });

    await expect(previous).toBeDisabled();
    for (const expected of STATES.slice(1)) {
      await next.click();
      await expect(experience(page)).toHaveAttribute("data-sequence-state", expected);
      // Sans scène, aucune transition ne démarre : l'état est posé directement.
      await expect(scene(page)).toHaveAttribute("data-thundart-motion", "idle");
    }
    await expect(next).toBeDisabled();
    await expect(scene(page)).toHaveAttribute(
      "aria-label",
      "Vue 3D Thundart. État : Planche terminée.",
    );
    await expect(page.getByText("Planche terminée", { exact: true })).toBeVisible();

    await previous.click();
    await expect(experience(page)).toHaveAttribute("data-sequence-state", "departure");
    await reset.click();
    await expect(experience(page)).toHaveAttribute("data-sequence-state", "overview");
    await expect(previous).toBeDisabled();
    await expect(page.getByText(UNAVAILABLE_STATUS)).toBeVisible();
  });

  test("l’inspection des cinq composants reste pilotable au pointeur et au clavier", async ({
    page,
  }) => {
    await openWithoutWebGl(page);
    for (const name of COMPONENTS) {
      await expect(componentButton(page, name)).toHaveAttribute("aria-pressed", "false");
    }
    const vehicle = componentButton(page, "VEHICLE");

    await vehicle.hover();
    await expect(experience(page)).toHaveAttribute("data-thundart-inspection", "vehicle");
    await expect(scene(page)).toHaveAttribute("data-thundart-model-active", "vehicle");
    await vehicle.click();
    await expect(vehicle).toHaveAttribute("aria-pressed", "true");
    await expect(scene(page)).toHaveAttribute("data-thundart-model-selected", "vehicle");
    await page.keyboard.press("Escape");
    await expect(vehicle).toHaveAttribute("aria-pressed", "false");
    await expect(scene(page)).toHaveAttribute("data-thundart-model-selected", "none");

    await vehicle.focus();
    await page.keyboard.press("Enter");
    await expect(vehicle).toHaveAttribute("aria-pressed", "true");
    await page.keyboard.press("Space");
    await expect(vehicle).toHaveAttribute("aria-pressed", "false");
    await page.keyboard.press("Tab");
    await expect(componentButton(page, "LAUNCHER BASE")).toBeFocused();
    await expect(experience(page)).toHaveAttribute(
      "data-thundart-inspection",
      "launcher-base",
    );

    const projectile = componentButton(page, "DEMONSTRATION PROJECTILE");
    await projectile.click();
    await expect(projectile).toHaveAttribute("aria-pressed", "true");
    await expect(scene(page)).toHaveAttribute("data-thundart-projectile-visual", "active");
    await expect(scene(page)).toContainText("DEMONSTRATION PROJECTILE · TUBE 01");
  });

  for (const width of [375, 1440]) {
    test(`${width}px — repli sans débordement, axe WCAG 2.2 AA`, async ({ page }) => {
      await page.setViewportSize({ width, height: width < 768 ? 812 : 900 });
      await openWithoutWebGl(page);
      await expect(scene(page)).toContainText("La vue 3D requiert WebGL 2");

      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth,
        ),
      ).toBe(0);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(
        results.violations
          .filter(
            (violation) =>
              violation.impact === "serious" || violation.impact === "critical",
          )
          .map(
            (violation) =>
              `${violation.id} : ${violation.nodes.map((node) => node.target).join(" | ")}`,
          ),
      ).toEqual([]);
    });
  }
});
