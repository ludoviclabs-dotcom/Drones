import { expect, test, type Page } from "@playwright/test";

/**
 * La séquence Patriot est pilotée UNIQUEMENT par les changements d'état, comme
 * la planche Thundart. Ces tests vérifient dans un vrai navigateur ce que les
 * tests unitaires prouvent sur la logique pure : chaque transition démarre sur
 * un changement d'état et se fige ensuite, rien ne bouge au repos, et une
 * interruption laisse toujours la planche dans un état déterministe.
 */

const ROUTE = "/hud/patriot-pac3-mse";
const NEXT = "Suivant";
const PREVIOUS = "Précédent";
const RESET = "Réinitialiser";

const scene = (page: Page) => page.locator("[data-patriot-motion]");
const experience = (page: Page) => page.locator("[data-sequence-state]");
const motionOf = (page: Page) => scene(page).getAttribute("data-patriot-motion");

async function hasWebGl(page: Page) {
  return page.evaluate(() => {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  });
}

async function openScene(page: Page) {
  await page.goto(ROUTE);
  await expect(scene(page)).toHaveAttribute("data-patriot-asset", "ready", {
    timeout: 45_000,
  });
}

/**
 * Budget d'une transition en navigateur de test. Le WebGL y est souvent rendu
 * en logiciel ; le pas de temps plafonné par frame (`MAX_FRAME_STEP_MS`) étire
 * alors la transition au lieu de la sauter. La mise en batterie dure ~5,5 s
 * nominales : le budget reste large, mais borné — une transition qui ne se
 * termine jamais échoue toujours.
 */
const TRANSITION_BUDGET_MS = 60_000;

/** Attend un repos STABLE (plusieurs lectures consécutives « idle »). */
async function settle(page: Page, timeoutMs = TRANSITION_BUDGET_MS) {
  const deadline = Date.now() + timeoutMs;
  let stable = 0;
  while (Date.now() < deadline) {
    stable = (await motionOf(page)) === "idle" ? stable + 1 : 0;
    if (stable >= 6) return;
    await page.waitForTimeout(120);
  }
  throw new Error("la transition ne s’est jamais stabilisée");
}

/** Journalise chaque bascule d'état et de mouvement via MutationObserver. */
async function recordTransitions(page: Page) {
  await page.evaluate(() => {
    const box = document.querySelector("[data-patriot-motion]");
    const host = document.querySelector("[data-sequence-state]");
    if (!box || !host) throw new Error("scène introuvable");
    const entry = () =>
      `${host.getAttribute("data-sequence-state")}/${box.getAttribute("data-patriot-motion")}`;
    const log: string[] = [entry()];
    (window as unknown as { __patLog: string[] }).__patLog = log;
    const observer = new MutationObserver(() => log.push(entry()));
    observer.observe(box, { attributes: true, attributeFilter: ["data-patriot-motion"] });
    observer.observe(host, { attributes: true, attributeFilter: ["data-sequence-state"] });
  });
}

const readTransitions = (page: Page) =>
  page.evaluate(() => (window as unknown as { __patLog?: string[] }).__patLog ?? []);

async function waitForTransition(page: Page, entry: string, timeoutMs = TRANSITION_BUDGET_MS) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if ((await readTransitions(page)).includes(entry)) return;
    await page.waitForTimeout(80);
  }
  throw new Error(
    `bascule « ${entry} » jamais observée — journal : ${(await readTransitions(page)).join(" | ")}`,
  );
}

// Transitions chronométrées dans un contexte WebGL : sérialisées dans un seul
// worker pour que les contextes ne se privent pas mutuellement de frames.
test.describe.configure({ mode: "default", timeout: 4 * TRANSITION_BUDGET_MS + 30_000 });

test.describe("Patriot — séquence pilotée par l’état", () => {
  test("met en batterie puis élève le lanceur, et ne bouge plus au repos", async ({ page }) => {
    await openScene(page);
    test.skip(!(await hasWebGl(page)), "WebGL indisponible sur cet agent");
    await recordTransitions(page);
    expect(await motionOf(page)).toBe("idle");

    for (const expected of ["inspect", "emplace", "elevate"]) {
      await page.getByRole("button", { name: NEXT }).click();
      await expect(experience(page)).toHaveAttribute("data-sequence-state", expected);
      await waitForTransition(page, `${expected}/running`);
      await settle(page);
    }

    // Repos réel : aucune boucle décorative, le journal reste figé.
    const before = (await readTransitions(page)).length;
    await page.waitForTimeout(2500);
    const log = await readTransitions(page);
    expect(log.length).toBe(before);
    for (const expected of ["inspect", "emplace", "elevate"]) {
      expect(log).toContain(`${expected}/running`);
      expect(log).toContain(`${expected}/idle`);
    }
    expect(log.at(-1)).toBe("elevate/idle");
  });

  test("mise à feu puis départ en salve : se jouent, puis se figent", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    // Mise en place directe (mouvement réduit), puis retour au mouvement
    // normal : changer le réglage ne doit lancer aucune transition.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openScene(page);
    test.skip(!(await hasWebGl(page)), "WebGL indisponible sur cet agent");
    await page.locator("label", { hasText: "Salve « ripple »" }).click();
    await page.locator('[data-patriot-step="elevate"]').click();
    await expect(experience(page)).toHaveAttribute("data-sequence-state", "elevate");
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect(scene(page)).toHaveAttribute("data-patriot-reduced-motion", "false");
    await recordTransitions(page);
    await page.waitForTimeout(600);
    expect(await readTransitions(page)).toEqual(["elevate/idle"]);

    for (const expected of ["fire", "launch"]) {
      await page.getByRole("button", { name: NEXT }).click();
      await expect(experience(page)).toHaveAttribute("data-sequence-state", expected);
      await waitForTransition(page, `${expected}/running`);
      await settle(page);
    }
    expect((await readTransitions(page)).at(-1)).toBe("launch/idle");
    await expect(scene(page)).toHaveAttribute("data-patriot-fire-mode", "ripple");
    expect(pageErrors).toEqual([]);
  });

  test("réinitialiser pendant la mise en batterie ramène proprement à la batterie", async ({
    page,
  }) => {
    await openScene(page);
    test.skip(!(await hasWebGl(page)), "WebGL indisponible sur cet agent");
    await recordTransitions(page);

    await page.getByRole("button", { name: NEXT }).click();
    await settle(page);
    // Le clip de mise en batterie est long : on coupe réellement en plein vol.
    await page.getByRole("button", { name: NEXT }).click();
    await waitForTransition(page, "emplace/running");
    await page.getByRole("button", { name: RESET }).click();
    await expect(experience(page)).toHaveAttribute("data-sequence-state", "overview");
    await settle(page);

    // La planche reste utilisable : on repart en avant tout de suite.
    await page.getByRole("button", { name: NEXT }).click();
    await expect(experience(page)).toHaveAttribute("data-sequence-state", "inspect");
    await settle(page);
  });

  test("une rafale de clics converge vers un état unique et stable", async ({ page }) => {
    await openScene(page);
    test.skip(!(await hasWebGl(page)), "WebGL indisponible sur cet agent");
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));

    // Aucun temps d'arrêt : chaque changement coupe le précédent en plein vol.
    for (const label of [NEXT, NEXT, PREVIOUS, RESET, NEXT, NEXT, PREVIOUS]) {
      const button = page.getByRole("button", { name: label });
      await expect(button).toBeEnabled();
      await button.click();
      await page.waitForTimeout(45);
    }
    // overview →×2 emplace → inspect → RESET overview →×2 emplace → inspect.
    await expect(experience(page)).toHaveAttribute("data-sequence-state", "inspect");
    await settle(page);
    expect(errors).toEqual([]);

    await page.getByRole("button", { name: RESET }).click();
    await settle(page);
    await expect(experience(page)).toHaveAttribute("data-sequence-state", "overview");
  });
});
