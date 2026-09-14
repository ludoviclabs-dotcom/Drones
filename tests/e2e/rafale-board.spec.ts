import AxeBuilder from "@axe-core/playwright";
import { expect, test, type ConsoleMessage, type Page } from "@playwright/test";

/**
 * Planche Rafale F4 · Meteor : rendu serveur, récit en six états, scénarios
 * d'emport, inspection accessible et mise en page.
 *
 * Les parcours purement DOM (bornes du récit, verrou du scénario, filtrage des
 * emports, clavier, ordre de tabulation, liens directs) tournent SANS WebGL :
 * ils vérifient du même coup que la planche reste utilisable dans ce cas, et
 * n'imposent aucun rendu logiciel à l'agent de test. La mise en page et l'audit
 * axe acceptent les deux issues de la scène — GLB monté ou repli sans WebGL 2 —
 * dont la hauteur est la même. Le mouvement réel, le GLB et les gestes
 * orbitaux sont couverts par rafale-motion.spec.ts.
 */

const ROUTE = "/hud/rafale-f4-meteor";
const ASSET_PATH = "/models/hud/rafale-f4.glb";
const TITLE = "Rafale F4 — chasseur et tir Meteor en 3D";
const STATES = [
  "overview",
  "inspect",
  "sensors",
  "release",
  "launch",
  "complete",
] as const;
type RafaleState = (typeof STATES)[number];

const SCENARIO_LABELS = {
  bvr: "Interception BVR · Meteor",
  wvr: "Combat rapproché · MICA IR",
  sead: "SEAD · AASM Hammer",
} as const;
type Scenario = keyof typeof SCENARIO_LABELS;

/** Libellés du catalogue, tels que le panneau les expose (nom accessible). */
const COMPONENT_LABELS = {
  radar: "RADÔME · RADAR RBE2 AESA",
  osf: "OPTRONIQUE SECTEUR FRONTAL",
  cockpit: "VERRIÈRE ET COCKPIT",
  canards: "PLANS CANARD",
  wing: "VOILURE DELTA ET ÉLEVONS",
  airframe: "CELLULE ET ENTRÉES D’AIR",
  engines: "MOTEURS M88 · TUYÈRES",
  spectra: "DÉRIVE ET SPECTRA",
  probe: "PERCHE DE RAVITAILLEMENT",
  gun: "CANON DE 30 MM",
  meteor: "MISSILE METEOR",
  mica: "MISSILES MICA IR ET EM",
  hammer: "AASM HAMMER",
  talios: "NACELLE TALIOS",
  tanks: "RÉSERVOIRS ET PYLÔNES",
} as const;
type ComponentId = keyof typeof COMPONENT_LABELS;

const AIRFRAME: readonly ComponentId[] = [
  "radar",
  "osf",
  "cockpit",
  "canards",
  "wing",
  "airframe",
  "engines",
  "spectra",
  "probe",
  "gun",
];
/** Configuration air-air (BVR et WVR) : treize sous-ensembles, ni AASM ni Talios. */
const AIR_COMPONENTS: readonly ComponentId[] = [...AIRFRAME, "meteor", "mica", "tanks"];
/** Configuration air-sol (SEAD) : quatorze sous-ensembles, sans Meteor. */
const SEAD_COMPONENTS: readonly ComponentId[] = [
  ...AIRFRAME,
  "mica",
  "hammer",
  "talios",
  "tanks",
];

const SCENARIO_LOCK =
  "Scénario verrouillé pendant la séquence de tir · réinitialiser pour changer.";
const UNAVAILABLE_STATUS =
  "Vue 3D indisponible sans WebGL 2 · contrôles et inspection utilisables";

const scene = (page: Page) => page.locator("[data-rafale-motion]");
const experience = (page: Page) => page.locator("[data-sequence-state]");
const step = (page: Page, state: RafaleState) =>
  page.locator(`[data-rafale-step="${state}"]`);
const component = (page: Page, id: ComponentId) =>
  page.getByRole("button", { name: COMPONENT_LABELS[id], exact: true });
const scenarioRadio = (page: Page, scenario: Scenario) =>
  page.getByRole("radio", { name: SCENARIO_LABELS[scenario] });
const scenarioLabel = (page: Page, scenario: Scenario) =>
  page.locator("label", { hasText: SCENARIO_LABELS[scenario] });
const panel = (page: Page) =>
  page.getByRole("complementary", { name: "Sous-ensembles visibles" });
const panelComponents = (page: Page) => panel(page).locator("[data-rafale-component]");
const panelIds = (page: Page) =>
  panelComponents(page).evaluateAll((buttons) =>
    buttons.map((button) => button.getAttribute("data-rafale-component")),
  );

function isLocalVercelTelemetry(message: ConsoleMessage) {
  const url = message.location().url;
  return (
    message.type() === "error" &&
    (url.includes("/_vercel/insights/") || url.includes("/_vercel/speed-insights/"))
  );
}

/**
 * Attend que la scène tranche : GLB monté (`ready`) ou WebGL 2 absent
 * (`unavailable`, constaté par la page elle-même). Un échec de chargement
 * (`error`) fait échouer l'attente.
 */
async function waitForScene(page: Page) {
  await expect(scene(page)).toHaveAttribute("data-rafale-asset", /^(ready|unavailable)$/, {
    timeout: 45_000,
  });
}

/** Navigateur sans WebGL : aucun contexte WebGL ne peut être créé. */
async function disableWebGl(page: Page) {
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
}

async function openWithoutWebGl(page: Page, path: string = ROUTE) {
  await disableWebGl(page);
  await page.goto(path);
  // La scène est montée (hydratée) et a constaté l'absence de WebGL 2. Le
  // module de la scène (three, R3F) se charge quand même : délai plus large
  // que celui d'une assertion ordinaire.
  await expect(scene(page)).toHaveAttribute("data-rafale-asset", "unavailable", {
    timeout: 15_000,
  });
}

test.describe.configure({ mode: "default", timeout: 90_000 });

test.describe("Rafale — chargement et rendu serveur", () => {
  test("répond en HTTP, rend le HTML côté serveur et ne monte qu’une vue", async ({
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
    // Les contrôles sont rendus côté serveur, scénarios compris.
    for (const label of Object.values(SCENARIO_LABELS)) expect(html).toContain(label);
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

    const navigation = await page.goto(ROUTE);
    expect(navigation?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1, name: TITLE })).toBeVisible();
    await waitForScene(page);
    // Un seul canvas quand le GLB est monté ; aucun dans le repli sans WebGL 2.
    const ready = (await scene(page).getAttribute("data-rafale-asset")) === "ready";
    await expect(page.locator("canvas")).toHaveCount(ready ? 1 : 0);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /\/hud\/rafale-f4-meteor$/,
    );
    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
  });

  test("le repos ne contient aucune animation CSS infinie", async ({ page }) => {
    await page.goto(ROUTE);
    await waitForScene(page);
    await expect(scene(page)).toHaveAttribute("data-rafale-motion", "idle");
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

test.describe("Rafale — sans WebGL, la planche reste utilisable", () => {
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
      if (new URL(request.url()).pathname === ASSET_PATH) assetRequests.push(request.url());
    });
    await openWithoutWebGl(page);

    await expect(scene(page)).toHaveAttribute("data-rafale-render-profile", "none");
    await expect(scene(page)).toHaveAttribute("data-rafale-motion", "idle");
    await expect(scene(page)).toContainText("La vue 3D requiert WebGL 2");
    await expect(page.getByText(UNAVAILABLE_STATUS)).toBeVisible();
    await expect(page.getByText("Chargement de l’asset GLB local")).toHaveCount(0);
    await expect(page.getByText("Glisser · pivoter / molette · zoomer")).toHaveCount(0);
    await expect(page.locator("[data-rafale-motion] canvas")).toHaveCount(0);

    // Plus aucune requête en vol : l'absence du GLB est un fait, pas une course.
    await page.waitForLoadState("networkidle");
    expect(assetRequests).toEqual([]);
    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
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
      await expect(page.locator("[data-rafale-state]")).toHaveAttribute(
        "data-rafale-state",
        expected,
      );
      // Sans scène, aucune transition ne démarre : l'état est posé directement.
      await expect(scene(page)).toHaveAttribute("data-rafale-motion", "idle");
    }
    await expect(next).toBeDisabled();
    await expect(page.getByText("Planche terminée", { exact: true })).toBeVisible();
    await expect(scene(page)).toHaveAttribute(
      "aria-label",
      `Vue 3D Rafale F4. État : Planche terminée. Scénario : ${SCENARIO_LABELS.bvr}.`,
    );

    await previous.click();
    await expect(experience(page)).toHaveAttribute("data-sequence-state", "launch");
    await step(page, "sensors").click();
    await expect(experience(page)).toHaveAttribute("data-sequence-state", "sensors");
    await expect(step(page, "sensors")).toHaveAttribute("aria-current", "step");
    await expect(step(page, "launch")).not.toHaveAttribute("aria-current", "step");
    await expect(page.getByText("Capteurs et fusion de données", { exact: true })).toBeVisible();
    await reset.click();
    await expect(experience(page)).toHaveAttribute("data-sequence-state", "overview");
    await expect(previous).toBeDisabled();
    await expect(page.getByText(UNAVAILABLE_STATUS)).toBeVisible();
  });

  test("le scénario se choisit avant la séparation, puis se verrouille", async ({ page }) => {
    await openWithoutWebGl(page);
    const radios = (Object.keys(SCENARIO_LABELS) as Scenario[]).map((scenario) =>
      scenarioRadio(page, scenario),
    );

    await expect(scenarioRadio(page, "bvr")).toBeChecked();
    await expect(scene(page)).toHaveAttribute("data-rafale-scenario", "bvr");
    await scenarioLabel(page, "wvr").click();
    await expect(scenarioRadio(page, "wvr")).toBeChecked();
    await expect(scene(page)).toHaveAttribute("data-rafale-scenario", "wvr");

    // Les capteurs précèdent la séparation : le choix reste ouvert.
    await step(page, "sensors").click();
    await expect(experience(page)).toHaveAttribute("data-sequence-state", "sensors");
    for (const radio of radios) await expect(radio).toBeEnabled();
    await expect(page.getByText(SCENARIO_LOCK)).toHaveCount(0);

    // De la séparation à la fin, le scénario est verrouillé.
    for (const state of ["release", "launch", "complete"] as const) {
      await step(page, state).click();
      await expect(experience(page)).toHaveAttribute("data-sequence-state", state);
      for (const radio of radios) await expect(radio).toBeDisabled();
      await expect(page.getByText(SCENARIO_LOCK)).toBeVisible();
    }
    // Un clic sur une option verrouillée ne change rien.
    await scenarioLabel(page, "bvr").click({ force: true });
    await expect(scene(page)).toHaveAttribute("data-rafale-scenario", "wvr");
    await expect(scenarioRadio(page, "wvr")).toBeChecked();

    await page.getByRole("button", { name: "Réinitialiser" }).click();
    await expect(experience(page)).toHaveAttribute("data-sequence-state", "overview");
    for (const radio of radios) await expect(radio).toBeEnabled();
    await expect(scenarioRadio(page, "wvr")).toBeChecked();
    await expect(page.getByText(SCENARIO_LOCK)).toHaveCount(0);
  });

  test("survol et focus donnent le même aperçu, le clic l’épingle, Échap le retire", async ({
    page,
  }) => {
    await openWithoutWebGl(page);
    const radar = component(page, "radar");

    await radar.hover();
    await expect(experience(page)).toHaveAttribute("data-rafale-inspection", "radar");
    await expect(scene(page)).toHaveAttribute("data-rafale-model-active", "radar");
    await expect(radar).toHaveAttribute("data-rafale-component-active", "true");
    await expect(radar).toHaveAttribute("aria-pressed", "false");
    await page.getByRole("heading", { level: 1 }).hover();
    await expect(experience(page)).toHaveAttribute("data-rafale-inspection", "none");
    await expect(radar).toHaveAttribute("data-rafale-component-active", "false");

    await radar.focus();
    await expect(experience(page)).toHaveAttribute("data-rafale-inspection", "radar");
    await radar.click();
    await expect(radar).toHaveAttribute("aria-pressed", "true");
    await expect(experience(page)).toHaveAttribute("data-rafale-inspection-selected", "radar");
    await expect(scene(page)).toHaveAttribute("data-rafale-model-selected", "radar");
    await page.keyboard.press("Escape");
    await expect(radar).toHaveAttribute("aria-pressed", "false");
    await expect(experience(page)).toHaveAttribute("data-rafale-inspection-selected", "none");
    await expect(scene(page)).toHaveAttribute("data-rafale-model-selected", "none");
  });

  test("expose les treize sous-ensembles de la configuration air-air et leurs sources", async ({
    page,
  }) => {
    await openWithoutWebGl(page);
    await expect(panelComponents(page)).toHaveCount(AIR_COMPONENTS.length);
    expect(await panelIds(page)).toEqual(AIR_COMPONENTS);
    for (const id of AIR_COMPONENTS) {
      await expect(component(page, id)).toHaveAttribute("aria-pressed", "false");
    }

    await component(page, "meteor").click();
    await expect(panel(page).getByText("conf. moyenne").first()).toBeVisible();
    // Nom accessible « éditeur — titre » : les deux sources MBDA restent distinctes.
    await expect(
      panel(page).getByRole("link", { name: "MBDA — METEOR", exact: true }),
    ).toHaveAttribute("href", /^https:\/\/www\.mbda-systems\.com\//);
    await expect(
      panel(page).getByRole("link", { name: "MBDA — METEOR — fiche technique 2023", exact: true }),
    ).toHaveAttribute("href", /^https:\/\/www\.mbda-systems\.com\/.+datasheet\.pdf$/);
    await expect(
      panel(page).getByRole("link", {
        name: "Ministère des Armées — DGA — Missile Meteor",
        exact: true,
      }),
    ).toHaveAttribute("href", /^https:\/\/www\.defense\.gouv\.fr\//);
  });

  test("la mission SEAD retire le Meteor du panneau et y ajoute l’AASM et le Talios", async ({
    page,
  }) => {
    await openWithoutWebGl(page);
    await expect(panelComponents(page)).toHaveCount(AIR_COMPONENTS.length);
    for (const id of ["hammer", "talios"] as const) {
      await expect(panel(page).locator(`[data-rafale-component="${id}"]`)).toHaveCount(0);
    }

    await scenarioLabel(page, "sead").click();
    await expect(scene(page)).toHaveAttribute("data-rafale-scenario", "sead");
    await expect(scene(page)).toHaveAttribute(
      "aria-label",
      `Vue 3D Rafale F4. État : Rafale F4 en vol. Scénario : ${SCENARIO_LABELS.sead}.`,
    );
    await expect(panelComponents(page)).toHaveCount(SEAD_COMPONENTS.length);
    expect(await panelIds(page)).toEqual(SEAD_COMPONENTS);
    await expect(panel(page).locator('[data-rafale-component="meteor"]')).toHaveCount(0);

    // Retour à l'air-air : le panneau retrouve ses treize sous-ensembles.
    await scenarioLabel(page, "bvr").click();
    await expect(panelComponents(page)).toHaveCount(AIR_COMPONENTS.length);
    expect(await panelIds(page)).toEqual(AIR_COMPONENTS);
  });

  test("changer de scénario retire la désignation d’un emport qui n’est plus emporté", async ({
    page,
  }) => {
    await openWithoutWebGl(page);

    // Le Meteor, épinglé en BVR, reste emporté en combat rapproché.
    await component(page, "meteor").click();
    await expect(component(page, "meteor")).toHaveAttribute("aria-pressed", "true");
    await expect(experience(page)).toHaveAttribute("data-rafale-inspection-selected", "meteor");
    await scenarioLabel(page, "wvr").click();
    await expect(scene(page)).toHaveAttribute("data-rafale-scenario", "wvr");
    await expect(experience(page)).toHaveAttribute("data-rafale-inspection-selected", "meteor");

    // En SEAD, il n'est plus sous l'avion : la désignation tombe.
    await scenarioLabel(page, "sead").click();
    await expect(scene(page)).toHaveAttribute("data-rafale-scenario", "sead");
    await expect(experience(page)).toHaveAttribute("data-rafale-inspection-selected", "none");
    await expect(experience(page)).toHaveAttribute("data-rafale-inspection", "none");
    await expect(scene(page)).toHaveAttribute("data-rafale-model-selected", "none");
    await expect(scene(page)).toHaveAttribute("data-rafale-model-active", "none");
    await expect(component(page, "meteor")).toHaveCount(0);

    // Même règle dans l'autre sens : l'AASM épinglé tombe au retour en BVR…
    await component(page, "hammer").click();
    await expect(experience(page)).toHaveAttribute("data-rafale-inspection-selected", "hammer");
    await scenarioLabel(page, "bvr").click();
    await expect(scene(page)).toHaveAttribute("data-rafale-scenario", "bvr");
    await expect(experience(page)).toHaveAttribute("data-rafale-inspection-selected", "none");

    // … tandis qu'un sous-ensemble de la cellule reste désigné partout.
    await component(page, "radar").click();
    await scenarioLabel(page, "sead").click();
    await expect(scene(page)).toHaveAttribute("data-rafale-scenario", "sead");
    await expect(experience(page)).toHaveAttribute("data-rafale-inspection-selected", "radar");
    await expect(component(page, "radar")).toHaveAttribute("aria-pressed", "true");
  });

  test("Entrée, Espace, Échap, Tab et les flèches restent natifs", async ({ page }) => {
    await openWithoutWebGl(page);
    const radar = component(page, "radar");
    const osf = component(page, "osf");

    await radar.focus();
    await page.keyboard.press("Enter");
    await expect(radar).toHaveAttribute("aria-pressed", "true");
    await page.keyboard.press("Enter");
    await expect(radar).toHaveAttribute("aria-pressed", "false");
    await page.keyboard.press("Space");
    await expect(radar).toHaveAttribute("aria-pressed", "true");
    await page.keyboard.press("Escape");
    await expect(radar).toHaveAttribute("aria-pressed", "false");
    await expect(experience(page)).toHaveAttribute("data-rafale-inspection-selected", "none");
    await page.keyboard.press("Tab");
    await expect(osf).toBeFocused();
    await expect(experience(page)).toHaveAttribute("data-rafale-inspection", "osf");
    await page.keyboard.press("Shift+Tab");
    await expect(radar).toBeFocused();

    // Groupe radio natif : une seule tabulation, les flèches changent le scénario.
    await scenarioRadio(page, "bvr").focus();
    await page.keyboard.press("ArrowRight");
    await expect(scenarioRadio(page, "wvr")).toBeChecked();
    await expect(scene(page)).toHaveAttribute("data-rafale-scenario", "wvr");
  });

  test("la tabulation suit l’ordre de lecture de la planche", async ({ page }) => {
    await openWithoutWebGl(page);
    await page.locator('[data-rafale-scenario-option="bvr"]').focus();
    const expected = ["bvr", ...STATES, "Réinitialiser", "Suivant", ...AIR_COMPONENTS];
    const order: string[] = [];
    for (let i = 0; i < expected.length; i += 1) {
      order.push(
        await page.evaluate(() => {
          const element = document.activeElement as HTMLElement | null;
          return (
            element?.dataset.rafaleScenarioOption ??
            element?.dataset.rafaleStep ??
            element?.dataset.rafaleComponent ??
            element?.textContent?.trim() ??
            ""
          );
        }),
      );
      await page.keyboard.press("Tab");
    }
    // Précédent est désactivé sur le premier état : il sort de l'ordre.
    expect(order).toEqual(expected);
  });

  test("le lien direct ?scenario=sead ouvre la planche en mission SEAD", async ({ page }) => {
    await openWithoutWebGl(page, `${ROUTE}?scenario=sead`);
    await expect(scene(page)).toHaveAttribute("data-rafale-scenario", "sead");
    await expect(scenarioRadio(page, "sead")).toBeChecked();
    await expect(panelComponents(page)).toHaveCount(SEAD_COMPONENTS.length);
    expect(await panelIds(page)).toEqual(SEAD_COMPONENTS);
    // Le paramètre ne crée pas une seconde page aux yeux des moteurs.
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /\/hud\/rafale-f4-meteor$/,
    );

    // Le scénario du lien reste un choix initial : on en change librement.
    await scenarioLabel(page, "wvr").click();
    await expect(scene(page)).toHaveAttribute("data-rafale-scenario", "wvr");

    // Une valeur inconnue est ignorée : scénario par défaut.
    await page.goto(`${ROUTE}?scenario=patriot`);
    await expect(scene(page)).toHaveAttribute("data-rafale-asset", "unavailable", {
      timeout: 15_000,
    });
    await expect(scene(page)).toHaveAttribute("data-rafale-scenario", "bvr");
    await expect(scenarioRadio(page, "bvr")).toBeChecked();
  });

  test("les entrées de l’accueil ouvrent la planche dans leur scénario", async ({ page }) => {
    await disableWebGl(page);
    await page.goto("/");
    // Navigation côté client : l'URL change après le rendu de la planche.
    await page.locator(`a[href="${ROUTE}?scenario=wvr"]`).click();
    await expect(page).toHaveURL(/\/hud\/rafale-f4-meteor\?scenario=wvr$/);
    await expect(scene(page)).toHaveAttribute("data-rafale-asset", "unavailable", {
      timeout: 15_000,
    });
    await expect(scene(page)).toHaveAttribute("data-rafale-scenario", "wvr");
    await expect(scenarioRadio(page, "wvr")).toBeChecked();
  });
});

test.describe("Rafale — mise en page et accessibilité", () => {
  for (const viewport of [
    { width: 375, height: 812 },
    { width: 1440, height: 900 },
  ]) {
    test(`${viewport.width}px — l’ancre pose la planche juste sous l’en-tête collant`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto(ROUTE);
      await waitForScene(page);
      // `instant` : le document défile en douceur, la mesure doit porter sur la
      // position d'arrivée et non sur un point du trajet.
      await page
        .locator("#rafale-experience")
        .evaluate((element) => element.scrollIntoView({ block: "start", behavior: "instant" }));
      const gap = await page.evaluate(() => {
        const sceneBox = document.querySelector("[data-rafale-motion]")?.getBoundingClientRect();
        const headerBox = document.querySelector("header")?.getBoundingClientRect();
        return sceneBox && headerBox ? sceneBox.top - headerBox.bottom : null;
      });
      // Un seul décalage d'ancre, le `scroll-padding-top` du document : la vue
      // s'arrête 0,75 rem (12 px) sous l'en-tête. Un `scroll-margin-top` posé sur
      // la planche s'y ajoutait et la laissait ~89 px plus bas.
      expect(gap).not.toBeNull();
      expect(gap!).toBeGreaterThanOrEqual(0);
      expect(gap!).toBeLessThanOrEqual(24);
    });
  }

  test("les liens croisés mènent à la planche", async ({ page }) => {
    for (const system of ["rafale", "meteor"]) {
      await page.goto(`/systemes/${system}/xray`);
      await expect(page.getByRole("link", { name: "Planche 3D interactive →" })).toHaveAttribute(
        "href",
        ROUTE,
      );
    }
    await page.goto("/");
    await page.getByRole("contentinfo").getByRole("link", { name: "HUD Rafale" }).click();
    await expect(page).toHaveURL(new RegExp(`${ROUTE}$`));
  });

  for (const width of [375, 768, 1024, 1440, 1920]) {
    test(`${width}px — aucun débordement, cibles tactiles et ordre des blocs`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: width < 768 ? 900 : 1000 });
      await page.goto(ROUTE);
      await waitForScene(page);

      const overflow = await page.evaluate(() => ({
        document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        main: (() => {
          const main = document.querySelector("main");
          return main ? main.scrollWidth - main.clientWidth : -1;
        })(),
      }));
      expect(overflow).toEqual({ document: 0, main: 0 });

      expect((await component(page, "radar").boundingBox())?.height).toBeGreaterThanOrEqual(48);
      expect((await step(page, "release").boundingBox())?.height).toBeGreaterThanOrEqual(48);
      for (const scenario of Object.keys(SCENARIO_LABELS) as Scenario[]) {
        expect(
          (await scenarioLabel(page, scenario).boundingBox())?.height,
        ).toBeGreaterThanOrEqual(44);
      }

      const sceneBox = (await scene(page).boundingBox())!;
      const panelBox = (await panel(page).boundingBox())!;
      const controlsBox = (await page
        .locator('section[aria-labelledby="rafale-sequence-heading"]')
        .boundingBox())!;
      if (width >= 1024) {
        // Panneau à droite de la vue, contrôles sous la vue.
        expect(panelBox.x).toBeGreaterThan(sceneBox.x + sceneBox.width);
        expect(controlsBox.y).toBeGreaterThan(sceneBox.y + sceneBox.height - 1);
      } else {
        // Une colonne : la vue, le panneau, puis les contrôles.
        expect(panelBox.y).toBeGreaterThan(sceneBox.y);
        expect(controlsBox.y).toBeGreaterThan(panelBox.y);
      }
    });

    test(`axe WCAG 2.2 AA — ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: width < 768 ? 812 : 900 });
      await page.goto(ROUTE);
      await waitForScene(page);
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
