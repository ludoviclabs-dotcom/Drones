import { expect, test, type ConsoleMessage, type Page } from "@playwright/test";

/**
 * La séquence Rafale est pilotée UNIQUEMENT par les changements d'état, comme
 * les planches Thundart et Patriot. Ces tests vérifient dans un vrai
 * navigateur ce que les tests unitaires prouvent sur la logique pure : chaque
 * transition démarre sur un changement d'état et se fige ensuite, rien ne
 * bouge au repos, le réglage « mouvement réduit » pose l'état sans transition
 * et ne relance jamais rien à lui seul, et une interruption laisse toujours la
 * planche dans un état déterministe. S'y ajoutent le chargement du GLB local,
 * la caméra offerte à l'utilisateur au seul repos des états d'observation, et
 * un glisser orbital qui n'inspecte rien.
 *
 * Sans WebGL 2, chaque test se saute proprement : la planche elle-même le
 * constate (`data-rafale-asset="unavailable"`), et le repli est couvert par
 * rafale-board.spec.ts.
 */

const ROUTE = "/hud/rafale-f4-meteor";
const ASSET_PATH = "/models/hud/rafale-f4.glb";
const NEXT = "Suivant";
const PREVIOUS = "Précédent";
const RESET = "Réinitialiser";
const STATES = [
  "overview",
  "inspect",
  "sensors",
  "release",
  "launch",
  "complete",
] as const;
type RafaleState = (typeof STATES)[number];
/** États où l'observation libre est permise, au repos seulement. */
const OBSERVATION_STATES: ReadonlySet<RafaleState> = new Set<RafaleState>([
  "overview",
  "inspect",
  "complete",
]);
const SCENARIOS = [
  { id: "bvr", label: "Interception BVR · Meteor" },
  { id: "wvr", label: "Combat rapproché · MICA IR" },
  { id: "sead", label: "SEAD · AASM Hammer" },
] as const;
const ORBIT_HINT = "Glisser · pivoter / molette · zoomer";
const CAMERA_LOCKED = "Caméra verrouillée dans cet état";

const scene = (page: Page) => page.locator("[data-rafale-motion]");
const experience = (page: Page) => page.locator("[data-sequence-state]");
const motionOf = (page: Page) => scene(page).getAttribute("data-rafale-motion");
const step = (page: Page, state: RafaleState) =>
  page.locator(`[data-rafale-step="${state}"]`);

function isLocalVercelTelemetry(message: ConsoleMessage) {
  const url = message.location().url;
  return (
    message.type() === "error" &&
    (url.includes("/_vercel/insights/") || url.includes("/_vercel/speed-insights/"))
  );
}

/**
 * Charge la route et attend que la scène tranche : GLB monté (`ready`) ou
 * WebGL 2 absent (`unavailable`, détecté par la page elle-même). Renvoie vrai
 * si la scène 3D est disponible ; un échec de chargement (`error`) échoue.
 */
async function openScene(page: Page): Promise<boolean> {
  await page.goto(ROUTE);
  await expect(scene(page)).toHaveAttribute("data-rafale-asset", /^(ready|unavailable)$/, {
    timeout: 45_000,
  });
  return (await scene(page).getAttribute("data-rafale-asset")) === "ready";
}

/**
 * Budget d'une transition en navigateur de test. Le WebGL y est souvent rendu
 * en logiciel ; le pas de temps plafonné par frame étire alors la transition
 * au lieu de la sauter. Le départ vers la fin dure 4,8 à 5,2 s nominales selon
 * le scénario : le budget reste large, mais borné — une transition qui ne se
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
    const box = document.querySelector("[data-rafale-motion]");
    const host = document.querySelector("[data-sequence-state]");
    if (!box || !host) throw new Error("scène introuvable");
    const entry = () =>
      `${host.getAttribute("data-sequence-state")}/${box.getAttribute("data-rafale-motion")}`;
    const log: string[] = [entry()];
    (window as unknown as { __rafLog: string[] }).__rafLog = log;
    const observer = new MutationObserver(() => log.push(entry()));
    observer.observe(box, { attributes: true, attributeFilter: ["data-rafale-motion"] });
    observer.observe(host, { attributes: true, attributeFilter: ["data-sequence-state"] });
  });
}

const readTransitions = (page: Page) =>
  page.evaluate(() => (window as unknown as { __rafLog?: string[] }).__rafLog ?? []);

/**
 * Attend qu'une bascule précise ait été observée : le journal ne rate rien,
 * alors qu'un état transitoire comme « running » peut échapper à un sondage.
 */
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
 * Deux rAF : la frame demandée au montage du modèle est rendue, la caméra est
 * cadrée avant que le premier pointeur ne lance un rayon.
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
 * `elementFromPoint` traverse les calques en `pointer-events: none` mais pas
 * le header collant, et ne renvoie rien hors du viewport.
 */
function isOnCanvas(page: Page, point: { x: number; y: number }) {
  return page.evaluate(
    ({ x, y }) => document.elementFromPoint(x, y) instanceof HTMLCanvasElement,
    point,
  );
}

// Transitions chronométrées dans un contexte WebGL : sérialisées dans un seul
// worker pour que les contextes ne se privent pas mutuellement de frames.
// `mode: "default"` n'entraîne pas le saut des suivants en cas d'échec.
test.describe.configure({ mode: "default", timeout: 4 * TRANSITION_BUDGET_MS + 30_000 });

test.describe("Rafale — séquence pilotée par l’état", () => {
  test("charge le GLB local et ne monte qu’une vue, sans erreur", async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error" && !isLocalVercelTelemetry(message)) {
        consoleErrors.push(message.text());
      }
    });
    page.on("pageerror", (error) => pageErrors.push(error.message));
    // Attente rattrapée : sans WebGL 2, le GLB n'est jamais demandé et le test
    // se saute avant de la consommer.
    const assetResponse = page
      .waitForResponse((candidate) => new URL(candidate.url()).pathname === ASSET_PATH, {
        timeout: 45_000,
      })
      .catch(() => null);

    test.skip(!(await openScene(page)), "WebGL 2 indisponible sur cet agent");
    expect((await assetResponse)?.status()).toBe(200);
    await expect(page.locator("canvas")).toHaveCount(1);
    await expect(scene(page).locator("canvas")).toHaveCount(1);
    await expect(scene(page)).toHaveAttribute(
      "data-rafale-render-profile",
      /^(hardware|software)$/,
    );
    await expect(scene(page)).toHaveAttribute("data-rafale-motion", "idle");
    await expect(page.getByText("Pose figée · aucune animation en attente")).toBeVisible();
    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
  });

  test("vole, s’inspecte, déploie ses capteurs puis sépare le Meteor, et ne bouge plus au repos", async ({
    page,
  }) => {
    test.skip(!(await openScene(page)), "WebGL 2 indisponible sur cet agent");
    await recordTransitions(page);
    expect(await motionOf(page)).toBe("idle");

    for (const expected of ["inspect", "sensors", "release"] as const) {
      await page.getByRole("button", { name: NEXT }).click();
      await expect(experience(page)).toHaveAttribute("data-sequence-state", expected);
      await waitForTransition(page, `${expected}/running`);
      await settle(page);
      // Au repos, la caméra n'est offerte que dans les états d'observation.
      await expect(
        page.getByText(OBSERVATION_STATES.has(expected) ? ORBIT_HINT : CAMERA_LOCKED),
      ).toBeVisible();
      // La légende des secteurs symboliques ne vit que dans l'état « capteurs ».
      if (expected === "sensors") {
        await expect(scene(page)).toContainText("secteurs symboliques, sans échelle");
      } else {
        await expect(scene(page)).not.toContainText("secteurs symboliques");
      }
    }

    // Repos réel : aucune boucle décorative, le journal reste figé.
    const before = (await readTransitions(page)).length;
    await page.waitForTimeout(2500);
    const log = await readTransitions(page);
    expect(log.length).toBe(before);
    for (const expected of ["inspect", "sensors", "release"]) {
      expect(log).toContain(`${expected}/running`);
      expect(log).toContain(`${expected}/idle`);
    }
    expect(log.at(-1)).toBe("release/idle");
  });

  for (const scenario of SCENARIOS) {
    test(`${scenario.label} — allumage, départ puis fin se jouent, puis se figent`, async ({
      page,
    }) => {
      const pageErrors: string[] = [];
      page.on("pageerror", (error) => pageErrors.push(error.message));

      // Mise en place directe (mouvement réduit), puis retour au mouvement
      // normal : changer le réglage ne doit lancer aucune transition.
      await page.emulateMedia({ reducedMotion: "reduce" });
      test.skip(!(await openScene(page)), "WebGL 2 indisponible sur cet agent");
      await page.locator("label", { hasText: scenario.label }).click();
      await expect(scene(page)).toHaveAttribute("data-rafale-scenario", scenario.id);
      await step(page, "release").click();
      await expect(experience(page)).toHaveAttribute("data-sequence-state", "release");
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await expect(scene(page)).toHaveAttribute("data-rafale-reduced-motion", "false");
      await recordTransitions(page);
      await page.waitForTimeout(600);
      expect(await readTransitions(page)).toEqual(["release/idle"]);

      for (const expected of ["launch", "complete"]) {
        await page.getByRole("button", { name: NEXT }).click();
        await expect(experience(page)).toHaveAttribute("data-sequence-state", expected);
        await waitForTransition(page, `${expected}/running`);
        await settle(page);
      }
      expect((await readTransitions(page)).at(-1)).toBe("complete/idle");
      await expect(scene(page)).toHaveAttribute("data-rafale-scenario", scenario.id);
      await expect(page.getByText("Pose figée · aucune animation en attente")).toBeVisible();
      // Seul le Meteor porte une liaison de données, tracée après son départ.
      if (scenario.id === "bvr") {
        await expect(scene(page)).toContainText("Liaison de données du Meteor");
      } else {
        await expect(scene(page)).not.toContainText("Liaison de données");
      }

      // Dans l'autre sens aussi, le réglage seul ne rejoue rien.
      const settled = (await readTransitions(page)).length;
      await page.emulateMedia({ reducedMotion: "reduce" });
      await expect(scene(page)).toHaveAttribute("data-rafale-reduced-motion", "true");
      await page.waitForTimeout(600);
      expect((await readTransitions(page)).slice(settled)).toEqual([]);
      expect(pageErrors).toEqual([]);
    });
  }

  test("mouvement réduit : pose finale immédiate, aucune transition", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    test.skip(!(await openScene(page)), "WebGL 2 indisponible sur cet agent");
    await expect(scene(page)).toHaveAttribute("data-rafale-reduced-motion", "true");
    await expect(
      page.getByText("Mouvement réduit actif · poses appliquées sans transition"),
    ).toBeVisible();
    await expect(page.getByText("Mouvement réduit · poses appliquées directement")).toBeVisible();
    await recordTransitions(page);

    for (const expected of STATES.slice(1)) {
      await page.getByRole("button", { name: NEXT }).click();
      await expect(experience(page)).toHaveAttribute("data-sequence-state", expected);
      // Pas d'attente de stabilisation : la pose est censée être déjà posée.
      expect(await motionOf(page)).toBe("idle");
    }
    await page.getByRole("button", { name: RESET }).click();
    await expect(experience(page)).toHaveAttribute("data-sequence-state", "overview");

    // L'information est la même — les six états sont parcourus — mais aucune
    // interpolation n'a eu lieu.
    const log = await readTransitions(page);
    expect(log.filter((entry) => entry.endsWith("/running"))).toEqual([]);
    expect(log.at(-1)).toBe("overview/idle");
  });

  test("réinitialiser pendant le départ ramène proprement au vol", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    test.skip(!(await openScene(page)), "WebGL 2 indisponible sur cet agent");
    await step(page, "launch").click();
    await expect(experience(page)).toHaveAttribute("data-sequence-state", "launch");
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect(scene(page)).toHaveAttribute("data-rafale-reduced-motion", "false");
    await recordTransitions(page);

    // Le départ vers la fin dure environ 5 s : on coupe réellement en plein
    // vol. La coupure part de la page même, dès que la transition démarre :
    // les attentes d'actionnabilité de Playwright (deux images stables)
    // peuvent dépasser la transition quand le WebGL est rendu en logiciel sur
    // un poste chargé.
    await page.evaluate((resetLabel) => {
      const box = document.querySelector("[data-rafale-motion]");
      const host = document.querySelector("[data-sequence-state]");
      if (!box || !host) throw new Error("scène introuvable");
      const observer = new MutationObserver(() => {
        if (
          host.getAttribute("data-sequence-state") !== "complete" ||
          box.getAttribute("data-rafale-motion") !== "running"
        ) {
          return;
        }
        observer.disconnect();
        const reset = [...document.querySelectorAll("button")].find(
          (button) => button.textContent?.trim() === resetLabel,
        );
        if (!reset) throw new Error("bouton de réinitialisation introuvable");
        reset.click();
      });
      observer.observe(box, { attributes: true, attributeFilter: ["data-rafale-motion"] });
    }, RESET);
    await page.getByRole("button", { name: NEXT }).click();
    await waitForTransition(page, "complete/running");
    await expect(experience(page)).toHaveAttribute("data-sequence-state", "overview");
    await settle(page);
    const log = await readTransitions(page);
    expect(log.slice(log.indexOf("complete/running"))).not.toContain("complete/idle");
    expect(log.at(-1)).toBe("overview/idle");

    // La planche reste utilisable : verrou du scénario levé, on repart en avant.
    await expect(page.getByRole("radio", { name: "SEAD · AASM Hammer" })).toBeEnabled();
    await page.getByRole("button", { name: NEXT }).click();
    await expect(experience(page)).toHaveAttribute("data-sequence-state", "inspect");
    await settle(page);
    expect((await readTransitions(page)).at(-1)).toBe("inspect/idle");
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
    // overview →×2 sensors → inspect → RESET overview →×2 sensors → inspect.
    await expect(experience(page)).toHaveAttribute("data-sequence-state", "inspect");
    await settle(page);
    expect(errors).toEqual([]);

    await page.getByRole("button", { name: RESET }).click();
    await settle(page);
    await expect(experience(page)).toHaveAttribute("data-sequence-state", "overview");
  });
});

test.describe("Rafale — caméra et gestes orbitaux", () => {
  test("les contrôles orbitaux ne s’offrent qu’au repos, dans les états d’observation", async ({
    page,
  }) => {
    // Mouvement réduit : chaque état est au repos dès qu'il est posé.
    await page.emulateMedia({ reducedMotion: "reduce" });
    test.skip(!(await openScene(page)), "WebGL 2 indisponible sur cet agent");
    const hint = page.getByText(ORBIT_HINT);
    const locked = page.getByText(CAMERA_LOCKED);

    for (const state of STATES) {
      await step(page, state).click();
      await expect(experience(page)).toHaveAttribute("data-sequence-state", state);
      if (OBSERVATION_STATES.has(state)) {
        await expect(hint).toBeVisible();
        await expect(locked).toHaveCount(0);
      } else {
        await expect(hint).toHaveCount(0);
        await expect(locked).toBeVisible();
      }
    }
  });

  test("un glisser sur la vue ne déclenche ni aperçu ni épingle", async ({ page }) => {
    test.skip(!(await openScene(page)), "WebGL 2 indisponible sur cet agent");
    // Le geste doit revenir aux contrôles orbitaux : actifs au repos, en vue
    // d'ensemble.
    await expect(page.getByText(ORBIT_HINT)).toBeVisible();
    await waitForModelFrame(page);

    // À 1280 × 720, la vue déborde sous la ligne de flottaison : la planche est
    // amenée sous l'en-tête, comme par son ancre (`instant`, car le document
    // défile en douceur), et tout le geste doit tomber sur le canvas.
    await page
      .locator("#rafale-experience")
      .evaluate((element) => element.scrollIntoView({ block: "start", behavior: "instant" }));
    const box = await page.locator("canvas").boundingBox();
    expect(box).not.toBeNull();

    // Le glisser part d'un sous-ensemble : en vue d'ensemble, la caméra vise
    // le milieu de l'avion, dont le survol ouvre un aperçu.
    let start: { x: number; y: number } | null = null;
    for (const [fx, fy] of [
      [0.5, 0.5],
      [0.46, 0.52],
      [0.54, 0.48],
      [0.5, 0.56],
      [0.5, 0.44],
    ]) {
      const point = { x: box!.x + box!.width * fx, y: box!.y + box!.height * fy };
      if (!(await isOnCanvas(page, point))) continue;
      await page.mouse.move(point.x, point.y);
      for (let i = 0; i < 10 && !start; i += 1) {
        if ((await experience(page).getAttribute("data-rafale-inspection")) !== "none") {
          start = point;
        } else {
          await page.waitForTimeout(100);
        }
      }
      if (start) break;
    }
    expect(start, "aucun sous-ensemble survolé au centre de la vue").not.toBeNull();
    const end = { x: start!.x + box!.width * 0.2, y: start!.y + box!.height * 0.08 };
    const mid = { x: (start!.x + end.x) / 2, y: (start!.y + end.y) / 2 };
    for (const point of [mid, end]) {
      expect(
        await isOnCanvas(page, point),
        `(${Math.round(point.x)}, ${Math.round(point.y)}) hors du canvas`,
      ).toBe(true);
    }

    await page.mouse.down();
    // Le premier pas franchit le seuil de glisser (6 px) : l'aperçu transitoire
    // doit tomber dès ce moment, avant tout relâchement.
    await page.mouse.move(mid.x, mid.y);
    await expect(experience(page)).toHaveAttribute("data-rafale-inspection", "none");
    // Le second arrive pendant l'orbite établie et peut survoler d'autres
    // sous-ensembles : aucun ne doit ouvrir d'aperçu, et le clic qui clôt le
    // geste ne doit rien épingler.
    await page.mouse.move(end.x, end.y);
    await page.mouse.up();

    await expect(experience(page)).toHaveAttribute("data-rafale-inspection", "none");
    await expect(experience(page)).toHaveAttribute("data-rafale-inspection-selected", "none");
    await expect(scene(page)).toHaveAttribute("data-rafale-model-selected", "none");
  });
});
