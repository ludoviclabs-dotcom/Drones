import AxeBuilder from "@axe-core/playwright";
import { expect, test, type ConsoleMessage, type Page } from "@playwright/test";

/**
 * Planche Patriot PAC-3 MSE : chargement, récit en sept états, mode de tir,
 * inspection accessible et mise en page.
 *
 * Les parcours purement DOM (bornes du récit, verrou du mode de tir, clavier,
 * ordre de tabulation) tournent SANS WebGL : ils vérifient du même coup que la
 * planche reste utilisable dans ce cas, et n'imposent aucun rendu logiciel à
 * l'agent de test. Les parcours qui dépendent de la scène tournent en WebGL,
 * en mouvement réduit quand seul l'état final compte. Le mouvement réel est
 * couvert par patriot-motion.spec.ts.
 */

const ROUTE = "/hud/patriot-pac3-mse";
const ASSET_PATH = "/models/hud/patriot-pac3-mse.glb";
const TITLE = "Patriot PAC-3 MSE — batterie et lanceur en 3D";
const STATES = [
  "overview",
  "inspect",
  "emplace",
  "elevate",
  "fire",
  "launch",
  "complete",
] as const;
const COMPONENTS = [
  ["launcher", "LANCEUR M903"],
  ["canisters", "CONTENEURS PAC-3 MSE"],
  ["interceptor", "INTERCEPTEUR PAC-3 MSE"],
  ["trailer", "SEMI-REMORQUE M860A1"],
  ["power", "GROUPE ÉLECTROGÈNE"],
  ["eles", "ÉLECTRONIQUE DE LANCEMENT"],
  ["tractor", "TRACTEUR HEMTT M983"],
  ["radar", "RADAR AN/MPQ-65"],
  ["ecs", "POSTE DE CONDUITE DE TIR"],
  ["epp", "CENTRALE ÉLECTRIQUE EPP III"],
  ["amg", "MÂT D’ANTENNES OE-349"],
  ["launchers", "AUTRES LANCEURS"],
] as const;

const scene = (page: Page) => page.locator("[data-patriot-motion]");
const experience = (page: Page) => page.locator("[data-sequence-state]");
const step = (page: Page, state: (typeof STATES)[number]) =>
  page.locator(`[data-patriot-step="${state}"]`);
const component = (page: Page, name: string) =>
  page.getByRole("button", { name, exact: true });
const modeLabel = (page: Page, text: string) => page.locator("label", { hasText: text });

/**
 * Budget du test de glisser orbital en navigateur de test.
 *
 * C'est le seul test de cette spec qui fait rendre la scène en continu : chaque
 * pointermove relance une frame, et l'amortissement des contrôles en enchaîne
 * des dizaines d'autres après le relâchement. Ces frames sont rendues en
 * logiciel (SwiftShader, sur CPU : ~0,25 s l'image à cette taille, voir
 * PatriotScene3D) ; quand un autre worker rend une scène au même moment (une
 * transition de patriot-motion.spec.ts, par exemple), les navigateurs se
 * disputent le CPU et le test peut durer plusieurs fois plus longtemps que seul.
 * Le budget reste borné : un glisser qui ne se termine jamais échoue toujours.
 */
const ORBIT_DRAG_BUDGET_MS = 120_000;

function isLocalVercelTelemetry(message: ConsoleMessage) {
  const url = message.location().url;
  return (
    message.type() === "error" &&
    (url.includes("/_vercel/insights/") || url.includes("/_vercel/speed-insights/"))
  );
}

async function waitForAsset(page: Page) {
  await expect(scene(page)).toHaveAttribute("data-patriot-asset", "ready", {
    timeout: 45_000,
  });
}

async function openReduced(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(ROUTE);
  await waitForAsset(page);
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
  // La scène est montée (hydratée) et a constaté l'absence de WebGL.
  await expect(scene(page)).toHaveAttribute("data-patriot-asset", "unavailable");
}

/**
 * Charge la route et attend que la scène tranche : GLB monté (`ready`) ou
 * WebGL 2 absent (`unavailable`, détecté par la page elle-même). Renvoie vrai
 * si la scène 3D est disponible ; un échec de chargement (`error`) échoue.
 */
async function openScene(page: Page): Promise<boolean> {
  await page.goto(ROUTE);
  await expect(scene(page)).toHaveAttribute("data-patriot-asset", /^(ready|unavailable)$/, {
    timeout: 45_000,
  });
  return (await scene(page).getAttribute("data-patriot-asset")) === "ready";
}

/**
 * Attend que le modèle chargé ait été rendu au moins une fois.
 *
 * `data-patriot-asset="ready"` est posé dès le montage du modèle, qui peut
 * précéder sa première frame : le rayon d'un pointeur reçu entre les deux
 * partirait d'une caméra pas encore cadrée. Cette frame est demandée au
 * montage, donc avant nos deux rAF : quand le second s'exécute, elle est rendue.
 */
async function waitForModelFrame(page: Page) {
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }),
  );
}

/**
 * Le point du viewport atteint-il le canvas ? Comme un vrai pointeur,
 * `elementFromPoint` traverse les calques en `pointer-events: none` mais pas le
 * header sticky, et ne renvoie rien hors du viewport.
 */
function isOnCanvas(page: Page, point: { x: number; y: number }) {
  return page.evaluate(
    ({ x, y }) => document.elementFromPoint(x, y) instanceof HTMLCanvasElement,
    point,
  );
}

test.describe.configure({ mode: "default", timeout: 90_000 });

test.describe("Patriot — chargement et scène 3D", () => {
  test("répond en HTTP, rend le HTML côté serveur puis charge le GLB", async ({
    page,
    request,
  }) => {
    const response = await request.get(ROUTE);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain(TITLE);
    expect(html).toContain("Préparation différée de la vue 3D locale");
    expect(html).toContain("Représentation illustrative. Aucun ciblage ou calcul opérationnel.");
    expect(html).toContain("BreadcrumbList");
    const sitemap = await request.get("/sitemap.xml");
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
    await expect(page.getByRole("heading", { level: 1, name: TITLE })).toBeVisible();
    expect((await assetResponse).status()).toBe(200);
    await waitForAsset(page);
    await expect(page.locator("canvas")).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /\/hud\/patriot-pac3-mse$/,
    );
    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
  });

  test("chaque état se pose sans erreur, tir unitaire comme salve", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    await openReduced(page);

    for (const mode of ["Tir unitaire", "Salve « ripple »"]) {
      await page.getByRole("button", { name: "Réinitialiser" }).click();
      await modeLabel(page, mode).click();
      for (const state of STATES) {
        await step(page, state).click();
        await expect(experience(page)).toHaveAttribute("data-sequence-state", state);
        // Mouvement réduit : la pose est posée directement, sans transition.
        await expect(scene(page)).toHaveAttribute("data-patriot-motion", "idle");
      }
    }
    await expect(scene(page)).toHaveAttribute("data-patriot-fire-mode", "ripple");
    expect(pageErrors).toEqual([]);
  });

  test("les contrôles orbitaux ne s’offrent qu’au repos, dans les états d’observation", async ({
    page,
  }) => {
    await openReduced(page);
    const hint = page.getByText("Glisser · pivoter / molette · zoomer");
    await expect(hint).toBeVisible();
    await step(page, "elevate").click();
    await expect(hint).toBeHidden();
    await expect(page.getByText("Caméra verrouillée dans cet état")).toBeVisible();
    await step(page, "complete").click();
    await expect(hint).toBeVisible();
  });

  test("survol et focus donnent le même aperçu, le clic l’épingle, Échap le retire", async ({
    page,
  }) => {
    await page.goto(ROUTE);
    await waitForAsset(page);
    const launcher = component(page, "LANCEUR M903");

    await launcher.hover();
    await expect(experience(page)).toHaveAttribute("data-patriot-inspection", "launcher");
    await expect(scene(page)).toHaveAttribute("data-patriot-model-active", "launcher");
    await expect(launcher).toHaveAttribute("aria-pressed", "false");
    await page.getByRole("heading", { level: 1 }).hover();
    await expect(experience(page)).toHaveAttribute("data-patriot-inspection", "none");

    await launcher.focus();
    await expect(experience(page)).toHaveAttribute("data-patriot-inspection", "launcher");
    await launcher.click();
    await expect(launcher).toHaveAttribute("aria-pressed", "true");
    await expect(experience(page)).toHaveAttribute(
      "data-patriot-inspection-selected",
      "launcher",
    );
    await expect(scene(page)).toHaveAttribute("data-patriot-model-selected", "launcher");
    await page.keyboard.press("Escape");
    await expect(launcher).toHaveAttribute("aria-pressed", "false");
    await expect(scene(page)).toHaveAttribute("data-patriot-model-selected", "none");
  });

  test("l’intercepteur désigne ses conteneurs tant qu’il n’est pas tiré", async ({ page }) => {
    await openReduced(page);
    await component(page, "INTERCEPTEUR PAC-3 MSE").click();
    await expect(scene(page)).toContainText("PAC-3 MSE · CONTENEURS 04 ET 03");
    await step(page, "launch").click();
    await expect(scene(page)).toContainText("INTERCEPTEUR PAC-3 MSE");
    await expect(scene(page)).not.toContainText("CONTENEURS 04 ET 03");
  });

  test("un glisser sur la vue ne déclenche ni aperçu ni épingle", async ({ page }) => {
    test.setTimeout(ORBIT_DRAG_BUDGET_MS);
    test.skip(!(await openScene(page)), "WebGL 2 indisponible sur cet agent");
    // Le geste doit revenir aux contrôles orbitaux : ils ne sont actifs qu'au
    // repos, dans les états d'observation.
    await expect(page.getByText("Glisser · pivoter / molette · zoomer")).toBeVisible();
    await waitForModelFrame(page);

    // La planche est amenée sous le header, comme par son ancre (`instant`, car
    // le document défile en douceur) : le canvas y tient entier (~890 × 531 à
    // 1280 × 720), et c'est dans ce cadrage que les points du geste sont choisis.
    await page
      .locator("#patriot-experience")
      .evaluate((element) => element.scrollIntoView({ block: "start", behavior: "instant" }));
    const box = await page.locator("canvas").boundingBox();
    expect(box).not.toBeNull();
    // Le geste part des conteneurs du lanceur de tête. R3F ne livre `onClick`
    // qu'aux objets touchés au pointerdown : parti du sol nu entre les véhicules,
    // le geste ne recevrait aucun clic et ce test ne garderait rien. 20 px
    // franchissent le seuil de drag (6 px) sans quitter les conteneurs.
    const start = { x: box!.x + box!.width * 0.64, y: box!.y + box!.height * 0.6 };
    const end = { x: start.x + 20, y: start.y };
    for (const point of [start, end]) {
      expect(
        await isOnCanvas(page, point),
        `(${Math.round(point.x)}, ${Math.round(point.y)}) hors du canvas`,
      ).toBe(true);
    }

    // Le survol ouvre l'aperçu transitoire du sous-ensemble visé…
    await page.mouse.move(start.x, start.y);
    await expect(experience(page)).not.toHaveAttribute("data-patriot-inspection", "none");

    // … que le drag doit effacer dès le seuil franchi, avant tout relâchement.
    await page.mouse.down();
    await page.mouse.move(end.x, end.y);
    await expect(experience(page)).toHaveAttribute("data-patriot-inspection", "none");

    // R3F livre le clic qui clôt le geste à chaque mesh traversé par le rayon :
    // aucun ne doit épingler son sous-ensemble.
    await page.mouse.up();
    await expect(experience(page)).toHaveAttribute("data-patriot-inspection", "none");
    await expect(experience(page)).toHaveAttribute("data-patriot-inspection-selected", "none");
  });

  test("le repos ne contient aucune animation CSS infinie", async ({ page }) => {
    await page.goto(ROUTE);
    await waitForAsset(page);
    await expect(scene(page)).toHaveAttribute("data-patriot-motion", "idle");
    const infinite = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLElement>("body *"))
        .filter((element) => {
          const style = getComputedStyle(element);
          const names = style.animationName.split(",").map((value) => value.trim());
          const counts = style.animationIterationCount.split(",").map((value) => value.trim());
          return names.some(
            (name, index) => name !== "none" && (counts[index] ?? counts.at(-1)) === "infinite",
          );
        })
        .map((element) => element.tagName),
    );
    expect(infinite).toEqual([]);
  });
});

test.describe("Patriot — sans WebGL, la planche reste utilisable", () => {
  test("affiche un repli explicite, sans télécharger le GLB", async ({ page }) => {
    const pageErrors: string[] = [];
    const assetRequests: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("request", (request) => {
      if (request.url().endsWith(ASSET_PATH)) assetRequests.push(request.url());
    });
    await openWithoutWebGl(page);

    await expect(scene(page)).toContainText("La vue 3D requiert WebGL 2");
    await expect(
      page.getByText("Vue 3D indisponible sans WebGL 2 · contrôles et inspection utilisables"),
    ).toBeVisible();
    await expect(page.getByText("Glisser · pivoter / molette · zoomer")).toHaveCount(0);
    await expect(page.locator("[data-patriot-motion] canvas")).toHaveCount(0);
    expect(assetRequests).toEqual([]);
    expect(pageErrors).toEqual([]);
  });

  test("Suivant, Précédent, Réinitialiser et la liste des états restent bornés", async ({
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
      await expect(step(page, expected)).toHaveAttribute("aria-current", "step");
    }
    await expect(next).toBeDisabled();
    await expect(page.getByText("Planche terminée", { exact: true })).toBeVisible();

    await previous.click();
    await expect(experience(page)).toHaveAttribute("data-sequence-state", "launch");
    await step(page, "emplace").click();
    await expect(experience(page)).toHaveAttribute("data-sequence-state", "emplace");
    await expect(page.getByText("Mise en batterie", { exact: true })).toBeVisible();
    await reset.click();
    await expect(experience(page)).toHaveAttribute("data-sequence-state", "overview");
    await expect(previous).toBeDisabled();
  });

  test("le mode de tir se choisit avant la mise à feu, puis se verrouille", async ({
    page,
  }) => {
    await openWithoutWebGl(page);
    const single = page.getByRole("radio", { name: "Tir unitaire" });
    const ripple = page.getByRole("radio", { name: "Salve « ripple »" });

    await expect(single).toBeChecked();
    await modeLabel(page, "Salve « ripple »").click();
    await expect(ripple).toBeChecked();
    await expect(scene(page)).toHaveAttribute("data-patriot-fire-mode", "ripple");

    await step(page, "fire").click();
    await expect(ripple).toBeDisabled();
    await expect(single).toBeDisabled();
    await expect(
      page.getByText("Mode verrouillé pendant la séquence de tir · réinitialiser pour changer."),
    ).toBeVisible();
    // Un clic sur l'option verrouillée ne change rien.
    await modeLabel(page, "Tir unitaire").click({ force: true });
    await expect(scene(page)).toHaveAttribute("data-patriot-fire-mode", "ripple");

    await page.getByRole("button", { name: "Réinitialiser" }).click();
    await expect(single).toBeEnabled();
    await expect(ripple).toBeChecked();
  });

  test("expose les douze sous-ensembles et leurs sources", async ({ page }) => {
    await openWithoutWebGl(page);
    for (const [, name] of COMPONENTS) {
      await expect(component(page, name)).toHaveAttribute("aria-pressed", "false");
    }
    await component(page, "RADAR AN/MPQ-65").click();
    const panel = page.getByRole("complementary", { name: "Sous-ensembles visibles" });
    await expect(panel.getByText("conf. moyenne").first()).toBeVisible();
    await expect(panel.getByRole("link", { name: "RTX (Raytheon)" })).toHaveAttribute(
      "href",
      /^https:\/\/www\.rtx\.com\//,
    );
  });

  test("Entrée, Espace, Échap, Tab et les flèches restent natifs", async ({ page }) => {
    await openWithoutWebGl(page);
    const launcher = component(page, "LANCEUR M903");
    const canisters = component(page, "CONTENEURS PAC-3 MSE");

    await launcher.focus();
    await page.keyboard.press("Enter");
    await expect(launcher).toHaveAttribute("aria-pressed", "true");
    await page.keyboard.press("Enter");
    await expect(launcher).toHaveAttribute("aria-pressed", "false");
    await page.keyboard.press("Space");
    await expect(launcher).toHaveAttribute("aria-pressed", "true");
    await page.keyboard.press("Escape");
    await expect(launcher).toHaveAttribute("aria-pressed", "false");
    await page.keyboard.press("Tab");
    await expect(canisters).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(launcher).toBeFocused();

    // Groupe radio natif : une seule tabulation, les flèches changent le mode.
    await page.getByRole("radio", { name: "Tir unitaire" }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("radio", { name: "Salve « ripple »" })).toBeChecked();
  });

  test("la tabulation suit l’ordre de lecture de la planche", async ({ page }) => {
    await openWithoutWebGl(page);
    await page.locator('[data-patriot-fire-mode-option="single"]').focus();
    const order: string[] = [];
    for (let i = 0; i < 22; i += 1) {
      order.push(
        await page.evaluate(() => {
          const element = document.activeElement as HTMLElement | null;
          return (
            element?.dataset.patriotFireModeOption ??
            element?.dataset.patriotStep ??
            element?.dataset.patriotComponent ??
            element?.textContent?.trim() ??
            ""
          );
        }),
      );
      await page.keyboard.press("Tab");
    }
    // Précédent est désactivé sur le premier état : il sort de l'ordre.
    expect(order).toEqual([
      "single",
      ...STATES,
      "Réinitialiser",
      "Suivant",
      ...COMPONENTS.map(([id]) => id),
    ]);
  });
});

test.describe("Patriot — mise en page et accessibilité", () => {
  test("l’ancre de la planche reste sous l’en-tête collant", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(ROUTE);
    await waitForAsset(page);
    await page.locator("#patriot-experience").evaluate((element) => element.scrollIntoView());
    const clear = await page.evaluate(() => {
      const sceneBox = document.querySelector("[data-patriot-motion]")?.getBoundingClientRect();
      const headerBox = document.querySelector("header")?.getBoundingClientRect();
      return Boolean(sceneBox && headerBox && sceneBox.top >= headerBox.bottom);
    });
    expect(clear).toBe(true);
  });

  test("les liens croisés mènent à la planche", async ({ page }) => {
    await page.goto("/systemes/patriot-pac3-mse/xray");
    await expect(page.getByRole("link", { name: "Planche 3D interactive →" })).toHaveAttribute(
      "href",
      ROUTE,
    );
    await page.goto("/");
    await page.getByRole("contentinfo").getByRole("link", { name: "HUD Patriot" }).click();
    await expect(page).toHaveURL(new RegExp(`${ROUTE}$`));
  });

  for (const width of [375, 768, 1024, 1440, 1920]) {
    test(`${width}px — aucun débordement, cibles tactiles et ordre des blocs`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: width < 768 ? 900 : 1000 });
      await page.goto(ROUTE);
      await waitForAsset(page);

      const overflow = await page.evaluate(() => ({
        document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        main: (() => {
          const main = document.querySelector("main");
          return main ? main.scrollWidth - main.clientWidth : -1;
        })(),
      }));
      expect(overflow).toEqual({ document: 0, main: 0 });

      expect((await component(page, "LANCEUR M903").boundingBox())?.height).toBeGreaterThanOrEqual(48);
      expect((await step(page, "fire").boundingBox())?.height).toBeGreaterThanOrEqual(48);
      expect((await modeLabel(page, "Tir unitaire").boundingBox())?.height).toBeGreaterThanOrEqual(44);

      const sceneBox = (await scene(page).boundingBox())!;
      const panelBox = (await page
        .getByRole("complementary", { name: "Sous-ensembles visibles" })
        .boundingBox())!;
      if (width >= 1024) {
        expect(panelBox.x).toBeGreaterThan(sceneBox.x + sceneBox.width);
      } else {
        expect(panelBox.y).toBeGreaterThan(sceneBox.y);
      }
    });

    test(`axe WCAG 2.2 AA — ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: width < 768 ? 812 : 900 });
      await page.goto(ROUTE);
      await waitForAsset(page);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(
        results.violations
          .filter((violation) => violation.impact === "serious" || violation.impact === "critical")
          .map((violation) => `${violation.id} : ${violation.nodes.map((n) => n.target).join(" | ")}`),
      ).toEqual([]);
    });
  }
});
