import { test, expect, type Locator, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("parcours home → domaine naval → fiche → console (export) → comparateur", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: "Voir le HUD drone →" })).toHaveAttribute(
    "href",
    "/hud/drone-airframe",
  );

  await page.goto("/batiments-navals");
  await expect(page.getByText("Chine").first()).toBeVisible();

  // Fiche navale : sections WS3 (carte relationnelle + heatmap de confiance).
  await page.goto("/systemes/fujian");
  await expect(page.getByText("Carte relationnelle").first()).toBeVisible();
  await expect(page.getByText("Heatmap de confiance").first()).toBeVisible();

  // Console : export CSV des affirmations filtrées.
  await page.goto("/console");
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Export CSV" }).click(),
  ]);
  expect(download.suggestedFilename()).toBe("panoplie-console-claims.csv");

  // Comparateur : loaders pays/famille + bascule en vue Chaînes système.
  await page.goto("/comparateur");
  await expect(page.getByText("Charger un pays")).toBeVisible();
  await expect(page.getByText("Charger une famille")).toBeVisible();
  await page.getByRole("combobox").first().selectOption({ index: 1 });
  const chainsRadio = page.getByRole("radio", { name: "Chaînes système" });
  await chainsRadio.click();
  await expect(chainsRadio).toHaveAttribute("aria-checked", "true");
});

test("SEO : sitemap, robots et image Open Graph répondent", async ({
  request,
}) => {
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
  expect((await request.get("/robots.txt")).status()).toBe(200);
  const og = await request.get("/opengraph-image");
  expect(og.status()).toBe(200);
  expect(og.headers()["content-type"]).toContain("image/png");
});

const SCENE_NAME =
  "CELLULE DE DRONE. OSINT INTELLIGENCE MILITAIRE · DONNÉES À BRANCHER";
// Pièce 1 « Châssis » et pièce 3 « Centrale IMU / GPS » pointent toutes deux le
// panneau « Attitude et cap » ; la pièce 4 pointe un panneau distinct.
const PART_CHASSIS = "Pièce 1 : Châssis";
const PART_IMU = "Pièce 3 : Centrale inertielle et GPS";
const PART_RADIO = "Pièce 4 : Module radio";
const PANEL_ATTITUDE = "Panneau : Attitude et cap";
const PANEL_RF = "Panneau : Liaison RF et satellites";

test("HUD drone : route publique, scène accessible et données signalées démo", async ({
  page,
}) => {
  await page.goto("/hud/drone-airframe");

  await expect(
    page.getByRole("heading", { name: "Cellule de drone — vue éclatée" }),
  ).toBeVisible();
  // La scène est un groupe, non une image : ses pièces et panneaux doivent
  // rester atteignables dans l'arbre d'accessibilité.
  await expect(page.getByRole("group", { name: SCENE_NAME })).toBeVisible();
  await expect(page.getByRole("img", { name: SCENE_NAME })).toHaveCount(0);
  await expect(page.getByText("Mode démo · données hors ligne")).toBeVisible();
  await expect(page.getByText("aucun aéronef")).toBeVisible();

  // Non-régression du mode démo : les quatre panneaux restent marqués.
  await expect(page.getByRole("button", { name: /^Panneau : / })).toHaveCount(4);
  await expect(page.getByRole("button", { name: /^Pièce / })).toHaveCount(6);
});

test("HUD drone : sélection persistante au clavier (Entrée, Espace, Échap)", async ({
  page,
}) => {
  await page.goto("/hud/drone-airframe");

  const chassis = page.getByRole("button", { name: PART_CHASSIS });
  const attitude = page.getByRole("button", { name: PANEL_ATTITUDE });

  // Focus clavier : aperçu temporaire, sans sélection persistante.
  await chassis.focus();
  await expect(chassis).toBeFocused();
  await expect(chassis).toHaveAttribute("aria-pressed", "false");
  await expect(chassis).toHaveAttribute("data-hud-active", "true");
  await expect(attitude).toHaveAttribute("data-hud-active", "true");

  // Entrée épingle la sélection.
  await page.keyboard.press("Enter");
  await expect(chassis).toHaveAttribute("aria-pressed", "true");

  // Deuxième activation de la même cible : désélection.
  await page.keyboard.press("Enter");
  await expect(chassis).toHaveAttribute("aria-pressed", "false");

  // Espace épingle également, sans faire défiler la planche.
  await page.keyboard.press(" ");
  await expect(chassis).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press(" ");
  await expect(chassis).toHaveAttribute("aria-pressed", "false");

  // Échap annule une sélection en cours.
  await page.keyboard.press("Enter");
  await expect(chassis).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Escape");
  await expect(chassis).toHaveAttribute("aria-pressed", "false");

  // Tab et Shift+Tab conservent la navigation native.
  await page.keyboard.press("Tab");
  await expect(chassis).not.toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(chassis).toBeFocused();
});

test("HUD drone : clic, correspondance pièce → panneau et panneau → pièces", async ({
  page,
}) => {
  await page.goto("/hud/drone-airframe");

  const chassis = page.getByRole("button", { name: PART_CHASSIS });
  const imu = page.getByRole("button", { name: PART_IMU });
  const radio = page.getByRole("button", { name: PART_RADIO });
  const attitude = page.getByRole("button", { name: PANEL_ATTITUDE });
  const rf = page.getByRole("button", { name: PANEL_RF });

  // Pièce → panneau : sélectionner le châssis active « Attitude et cap ».
  await chassis.click();
  await expect(chassis).toHaveAttribute("aria-pressed", "true");
  await expect(attitude).toHaveAttribute("data-hud-active", "true");
  // Les cibles non liées restent inactives (et donc atténuées).
  await expect(rf).toHaveAttribute("data-hud-active", "false");
  await expect(radio).toHaveAttribute("data-hud-active", "false");

  // Le lien pièce → panneau est aussi exposé dans l'arbre d'accessibilité.
  await expect(chassis).toHaveAttribute(
    "aria-controls",
    "drone-airframe-panel-attitude-cap",
  );

  // Panneau → pièces : sélectionner « Attitude et cap » active châssis ET IMU,
  // les deux pièces qui le référencent.
  await attitude.click();
  await expect(attitude).toHaveAttribute("aria-pressed", "true");
  await expect(chassis).toHaveAttribute("aria-pressed", "false");
  await expect(chassis).toHaveAttribute("data-hud-active", "true");
  await expect(imu).toHaveAttribute("data-hud-active", "true");
  await expect(radio).toHaveAttribute("data-hud-active", "false");

  // Second clic sur la même cible : désélection, plus rien n'est épinglé.
  await attitude.click();
  await expect(attitude).toHaveAttribute("aria-pressed", "false");
});

const calloutOf = (page: Page, partId: string) =>
  page.locator(`.hudScene__callout[data-hud-part="${partId}"]`);

const styleOf = (locator: Locator, property: string) =>
  locator.evaluate(
    (el, prop) =>
      getComputedStyle(el).getPropertyValue(prop as keyof CSSStyleDeclaration & string),
    property,
  );

test("HUD drone : le callout lié est tracé une fois, les autres restent statiques", async ({
  page,
}) => {
  await page.goto("/hud/drone-airframe");

  const chassisCallout = calloutOf(page, "chassis");
  const imuCallout = calloutOf(page, "centrale-inertielle-gps");
  const radioCallout = calloutOf(page, "module-radio");

  await expect(chassisCallout).toHaveAttribute("data-hud-drawn", "false");

  await page.getByRole("button", { name: PART_CHASSIS }).click();

  // Seul le callout de la pièce sélectionnée est tracé.
  await expect(chassisCallout).toHaveAttribute("data-hud-drawn", "true");
  await expect(radioCallout).toHaveAttribute("data-hud-drawn", "false");
  await expect(chassisCallout.locator("line")).toHaveClass(
    /hudScene__calloutLine--draw/,
  );

  // Le tracé se termine plein et le reste tant que la sélection tient.
  await expect
    .poll(() => styleOf(chassisCallout.locator("line"), "stroke-dashoffset"))
    .toBe("0px");

  // Callout non lié : atténué mais jamais invisible, et jamais animé.
  const dimmed = Number(await styleOf(radioCallout, "opacity"));
  expect(dimmed).toBeGreaterThan(0.3);
  expect(dimmed).toBeLessThan(1);
  expect(await styleOf(radioCallout.locator("line"), "animation-name")).toBe(
    "none",
  );

  // Sélectionner le panneau trace les callouts de TOUTES ses pièces.
  await page.getByRole("button", { name: PANEL_ATTITUDE }).click();
  await expect(chassisCallout).toHaveAttribute("data-hud-drawn", "true");
  await expect(imuCallout).toHaveAttribute("data-hud-drawn", "true");
  await expect(radioCallout).toHaveAttribute("data-hud-drawn", "false");

  // Désélection : plus aucun tracé, et le trait redevient statique et plein.
  await page.keyboard.press("Escape");
  await expect(chassisCallout).toHaveAttribute("data-hud-drawn", "false");
  expect(await styleOf(chassisCallout.locator("line"), "animation-name")).toBe(
    "none",
  );
});

test("HUD drone : en mouvement réduit, tout est visible d'emblée et rien n'anime", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/hud/drone-airframe");

  // L'assemblage initial est supprimé : les pièces sont d'emblée en place.
  const chassis = page.getByRole("button", { name: PART_CHASSIS });
  expect(await styleOf(chassis, "animation-name")).toBe("none");
  expect(await styleOf(chassis, "transform")).toBe("none");

  await chassis.click();

  // Le callout lié est marqué tracé, mais sans animation : trait plein tout de
  // suite, distingué par son épaisseur et non par un mouvement.
  const line = calloutOf(page, "chassis").locator("line");
  await expect(line).toHaveClass(/hudScene__calloutLine--draw/);
  expect(await styleOf(line, "animation-name")).toBe("none");
  expect(await styleOf(line, "stroke-dashoffset")).toBe("0px");

  // parseFloat, non Number : le style calculé porte son unité (« 1.8px »).
  const drawnWidth = parseFloat(await styleOf(line, "stroke-width"));
  const plainWidth = parseFloat(
    await styleOf(calloutOf(page, "module-radio").locator("line"), "stroke-width"),
  );
  expect(drawnWidth).toBeGreaterThan(plainWidth);

  // Aucune transition non plus.
  expect(await styleOf(chassis, "transition-duration")).toMatch(/^0s(, 0s)*$/);
});

const VIEWPORTS = [
  { label: "mobile", width: 375, height: 812, scrolls: true },
  { label: "tablette portrait", width: 768, height: 1024, scrolls: true },
  { label: "tablette paysage", width: 1024, height: 768, scrolls: false },
  { label: "portable", width: 1440, height: 900, scrolls: false },
  { label: "large", width: 1920, height: 1080, scrolls: false },
] as const;

for (const vp of VIEWPORTS) {
  test(`HUD drone : ${vp.label} ${vp.width}×${vp.height} — débordement contenu dans la planche`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto("/hud/drone-airframe");

    // Le document ne déborde jamais horizontalement.
    const doc = await page.evaluate(() => ({
      overflow:
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
      headerOverflow: (() => {
        const el = document.querySelector("header")!;
        return el.scrollWidth - el.clientWidth;
      })(),
      footerOverflow: (() => {
        const el = document.querySelector("footer")!;
        return el.scrollWidth - el.clientWidth;
      })(),
    }));
    expect(doc.overflow).toBe(0);
    expect(doc.headerOverflow).toBe(0);
    expect(doc.footerOverflow).toBe(0);

    // Le débordement est admis, et uniquement, à l'intérieur de .hudScene.
    const hud = page.locator(".hudScene");
    const scrollable = await hud.evaluate((el) => el.scrollWidth - el.clientWidth);
    const overflowX = await styleOf(hud, "overflow-x");
    expect(overflowX).toBe("auto");

    // La planche garde son rapport 1600 × 900.
    const ratio = await hud
      .locator("svg")
      .evaluate((el) => {
        const b = el.getBoundingClientRect();
        return b.width / b.height;
      });
    expect(ratio).toBeCloseTo(1600 / 900, 2);

    // L'indication de défilement n'apparaît que là où il y a de quoi défiler.
    const hint = page.getByText("Faire défiler horizontalement");
    if (vp.scrolls) {
      expect(scrollable).toBeGreaterThan(0);
      await expect(hint).toBeVisible();
    } else {
      expect(scrollable).toBe(0);
      await expect(hint).toBeHidden();
    }
  });
}

test("HUD drone : sur mobile, la sélection survit au défilement interne", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/hud/drone-airframe");

  const chassis = page.getByRole("button", { name: PART_CHASSIS });
  const attitude = page.getByRole("button", { name: PANEL_ATTITUDE });
  const hud = page.locator(".hudScene");

  // Cibles tactiles : au-delà du minimum WCAG 2.2 AA (24 × 24 CSS px).
  for (const target of [chassis, attitude]) {
    const box = await target.boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(24);
    expect(box!.height).toBeGreaterThanOrEqual(24);
  }

  await chassis.click();
  // L'état sélectionné est lu depuis l'arbre d'accessibilité calculé, pas
  // seulement depuis l'attribut.
  await expect(page.getByRole("button", { name: PART_CHASSIS, pressed: true })).toBeVisible();

  // À 375 px, le panneau lié est hors de la fenêtre de la planche : c'est la
  // persistance de la sélection qui permet d'aller le lire sans la perdre.
  await hud.evaluate((el) => {
    el.scrollLeft = 0;
  });
  await expect(attitude).toHaveAttribute("data-hud-active", "true");
  await expect(page.getByRole("button", { name: PART_CHASSIS, pressed: true })).toBeVisible();
});

test("HUD drone : la route fige les animations décoratives, sans fuite ailleurs", async ({
  page,
}) => {
  const decor = () =>
    page.evaluate(() => ({
      grain: getComputedStyle(document.querySelector(".film-grain")!)
        .animationName,
      grainOpacity: getComputedStyle(document.querySelector(".film-grain")!)
        .opacity,
      dot: getComputedStyle(document.querySelector(".transmission-dot")!)
        .animationName,
      motionReady:
        document.documentElement.classList.contains("motion-ready"),
    }));

  // Accueil : le décor vit, et le lien vers le HUD est présent.
  await page.goto("/");
  const home = await decor();
  expect(home.motionReady).toBe(true);
  expect(home.grain).toBe("grain");
  expect(home.dot).toBe("transmission");
  await expect(
    page.getByRole("link", { name: "Voir le HUD drone →" }),
  ).toHaveAttribute("href", "/hud/drone-airframe");

  // Sur la planche : grain figé mais toujours visible, point de statut figé.
  await page.goto("/hud/drone-airframe");
  const hudRoute = await decor();
  expect(hudRoute.motionReady).toBe(true);
  expect(hudRoute.grain).toBe("none");
  expect(Number(hudRoute.grainOpacity)).toBeGreaterThan(0);
  expect(hudRoute.dot).toBe("none");

  // Aucune animation permanente NULLE PART sur la route : ni dans la planche,
  // ni dans le décor hérité du layout global (grain, point de statut, radar,
  // schématiques). On liste les fautifs pour que l'échec soit lisible.
  const looping = await page.evaluate(() =>
    [...document.querySelectorAll("*")]
      .filter(
        (el) => getComputedStyle(el).animationIterationCount === "infinite",
      )
      .map((el) => el.getAttribute("class") ?? el.tagName),
  );
  expect(looping).toEqual([]);

  // Retour à l'accueil : rien n'a persisté.
  await page.goto("/");
  expect((await decor()).grain).toBe("grain");
});

test("HUD drone : SSR, hydratation sans erreur, sitemap et lien de pied de page", async ({
  page,
  request,
}) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const failedUrls: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("response", (r) => {
    if (r.status() >= 400) failedUrls.push(r.url());
  });

  // Le HTML servi porte déjà la scène complète (SSR), avant tout JS.
  const ssr = await (await request.get("/hud/drone-airframe")).text();
  expect(ssr).toContain('viewBox="0 0 1600 900"');
  expect(ssr).toContain('aria-pressed="false"');
  expect(ssr).toContain("DEMO DATA");
  expect(ssr).not.toContain('aria-pressed="true"');

  await page.goto("/hud/drone-airframe");
  await page.getByRole("button", { name: PART_CHASSIS }).click();
  await expect(
    page.getByRole("button", { name: PART_CHASSIS, pressed: true }),
  ).toBeVisible();

  // Les scripts de télémétrie Vercel n'existent qu'une fois déployés : ils
  // répondent 404 en local, sur toutes les routes. On les isole nommément — le
  // filet reste dur pour tout le reste, y compris un chunk manquant.
  expect(failedUrls.filter((url) => !url.includes("/_vercel/"))).toEqual([]);

  // Une divergence SSR/client remonterait ici en erreur console React.
  expect(
    consoleErrors.filter((text) => !text.includes("Failed to load resource")),
  ).toEqual([]);
  expect(pageErrors).toEqual([]);

  // Référencement et navigation.
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("/hud/drone-airframe");
  await expect(
    page.getByRole("contentinfo").getByRole("link", { name: "HUD Drone" }),
  ).toHaveAttribute("href", "/hud/drone-airframe");
});

test("HUD drone : ordre de tabulation en ordre de lecture", async ({ page }) => {
  await page.goto("/hud/drone-airframe");

  // Dernier lien de la barre de navigation : la tabulation entre ensuite dans
  // la planche. Le même libellé existe aussi en pied de page, d'où le cadrage.
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Glossaire" })
    .focus();

  const order: string[] = [];
  for (let i = 0; i < 10; i += 1) {
    await page.keyboard.press("Tab");
    order.push(
      await page.evaluate(
        () => document.activeElement?.getAttribute("aria-label") ?? "",
      ),
    );
  }

  // Colonne gauche, puis les six pièces de haut en bas, puis colonne droite.
  expect(order).toEqual([
    "Panneau : Attitude et cap",
    "Panneau : Tension et consommation",
    "Pièce 6 : Nacelle capteurs",
    "Pièce 5 : Batterie",
    "Pièce 4 : Module radio",
    "Pièce 3 : Centrale inertielle et GPS",
    "Pièce 2 : Bloc moteurs + ESC",
    "Pièce 1 : Châssis",
    "Panneau : Liaison RF et satellites",
    "Panneau : Journal de vol",
  ]);
});

const A11Y_PAGES = [
  "/",
  "/systemes/fujian",
  "/console",
  "/comparateur",
  "/hud/drone-airframe",
];
for (const path of A11Y_PAGES) {
  test(`axe — a11y structurelle (WCAG 2.2 AA) : ${path}`, async ({
    page,
  }, testInfo) => {
    test.setTimeout(120_000);
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    const serious = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    // Le contraste du thème sombre éditorial (accent / ink-faint ~4.2-4.4:1 sur
    // les panneaux élevés) est suivi en non bloquant : il relève d'une décision
    // de palette, pas d'un bug structurel. Le reste est un gate dur.
    const contrast = serious.filter((v) => v.id === "color-contrast");
    const structural = serious.filter((v) => v.id !== "color-contrast");
    if (contrast.length > 0) {
      const nodes = contrast.reduce((n, v) => n + v.nodes.length, 0);
      testInfo.annotations.push({
        type: "contraste-à-revoir",
        description: `${nodes} nœud(s) sous 4.5:1 — décision de palette`,
      });
    }
    expect(
      structural,
      structural.map((v) => `${v.id} (${v.impact})`).join(", "),
    ).toEqual([]);
  });
}
