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

/**
 * Budget d'immobilisation après un drag orbital. L'amortissement d'OrbitControls
 * (`enableDamping`) se compte en frames, pas en temps : le plafond de pas du
 * profil `software` ne l'abrège pas, et il enchaîne une centaine de frames après
 * le relâchement, bien plus qu'une transition. Budget double.
 */
const ORBIT_SETTLE_BUDGET_MS = 2 * TRANSITION_BUDGET_MS;

/**
 * Écart entre deux captures comparées. Il couvre largement une frame logicielle,
 * même ralentie par la contention : en deux secondes, une caméra encore amortie
 * change forcément l'image.
 */
const STILL_WINDOW_MS = 2_000;

/**
 * Capture le canvas une fois l'image immobile : deux captures identiques.
 * Capture de page découpée plutôt que `locator.screenshot()`, qui peut défiler
 * de lui-même pour montrer l'élément : ici, c'est le test qui fixe la position.
 */
async function stillCanvasShot(page: Page, timeoutMs = ORBIT_SETTLE_BUDGET_MS) {
  const box = await page.locator("canvas").boundingBox();
  if (!box) throw new Error("canvas introuvable");
  const shoot = () => page.screenshot({ clip: box });
  const deadline = Date.now() + timeoutMs;
  let previous = await shoot();
  while (Date.now() < deadline) {
    await page.waitForTimeout(STILL_WINDOW_MS);
    const current = await shoot();
    if (current.equals(previous)) return current;
    previous = current;
  }
  throw new Error("le canvas ne s’est jamais immobilisé");
}

/**
 * Part des pixels, de 0 à 1, nettement différents entre deux captures PNG. Le
 * navigateur les décode, sans dépendance ajoutée ; un écart de moins de 24
 * niveaux par canal est ignoré.
 */
async function changedShare(page: Page, first: Buffer, second: Buffer) {
  return page.evaluate(
    async ([a, b]) => {
      const pixels = async (base64: string) => {
        const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
        const bitmap = await createImageBitmap(new Blob([bytes], { type: "image/png" }));
        const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
        const context = canvas.getContext("2d");
        if (!context) throw new Error("contexte 2D indisponible");
        context.drawImage(bitmap, 0, 0);
        return context.getImageData(0, 0, bitmap.width, bitmap.height).data;
      };
      const [x, y] = await Promise.all([pixels(a), pixels(b)]);
      if (x.length !== y.length) return 1;
      let changed = 0;
      for (let i = 0; i < x.length; i += 4) {
        if (
          Math.abs(x[i] - y[i]) > 24 ||
          Math.abs(x[i + 1] - y[i + 1]) > 24 ||
          Math.abs(x[i + 2] - y[i + 2]) > 24
        ) {
          changed += 1;
        }
      }
      return changed / (x.length / 4);
    },
    [first.toString("base64"), second.toString("base64")] as const,
  );
}

// Transitions chronométrées dans un contexte WebGL : sérialisées dans un seul
// worker pour que les contextes ne se privent pas mutuellement de frames.
test.describe.configure({ mode: "default", timeout: 4 * TRANSITION_BUDGET_MS + 30_000 });

test.describe("Patriot — séquence pilotée par l’état", () => {
  test("met en batterie puis élève le lanceur, et ne bouge plus au repos", async ({ page }) => {
    test.skip(!(await openScene(page)), "WebGL 2 indisponible sur cet agent");
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
    test.skip(!(await openScene(page)), "WebGL 2 indisponible sur cet agent");
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
    test.skip(!(await openScene(page)), "WebGL 2 indisponible sur cet agent");
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
    test.skip(!(await openScene(page)), "WebGL 2 indisponible sur cet agent");
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

  test("défiler la page conserve l’orbite de l’utilisateur", async ({ page }) => {
    test.skip(!(await openScene(page)), "WebGL 2 indisponible sur cet agent");

    // La planche sous le header, comme par son ancre (`instant` : le document
    // défile en douceur). Le canvas y tient entier, avec de la marge pour le
    // petit aller-retour de défilement plus bas.
    await page
      .locator("#patriot-experience")
      .evaluate((element) => element.scrollIntoView({ block: "start", behavior: "instant" }));
    const preset = await stillCanvasShot(page);

    // Orbite par un drag sur le fond, au-dessus de la batterie : aucun
    // sous-ensemble n'est survolé, donc aucun aperçu ne vient teinter les captures.
    const box = await page.locator("canvas").boundingBox();
    expect(box).not.toBeNull();
    await page.mouse.move(box!.x + box!.width * 0.2, box!.y + box!.height * 0.12);
    await page.mouse.down();
    await page.mouse.move(box!.x + box!.width * 0.55, box!.y + box!.height * 0.12, { steps: 2 });
    await page.mouse.up();
    await page.mouse.move(0, 0);
    await expect(experience(page)).toHaveAttribute("data-patriot-inspection", "none");
    const orbited = await stillCanvasShot(page);
    // Sans orbite réelle, la comparaison finale ne prouverait rien.
    expect(await changedShare(page, preset, orbited)).toBeGreaterThan(0.05);

    // R3F suit le défilement de son conteneur (mesure temporisée à 50 ms) :
    // chaque étape attend une image immobile, et la comparaison se fait à la
    // même position de page.
    await page.evaluate(() => window.scrollBy({ top: -24, behavior: "instant" }));
    await stillCanvasShot(page);
    await page.evaluate(() => window.scrollBy({ top: 24, behavior: "instant" }));
    const afterScroll = await stillCanvasShot(page);
    expect(await changedShare(page, orbited, afterScroll)).toBeLessThan(0.005);
  });
});
