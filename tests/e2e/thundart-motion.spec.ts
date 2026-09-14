import { test, expect, type Page } from "@playwright/test";

/**
 * THD-03 — la séquence Thundart est pilotée UNIQUEMENT par les changements
 * d'état. Ces tests vérifient dans un vrai navigateur ce que les tests unitaires
 * prouvent sur la logique pure : rien ne bouge sans action, le mouvement réduit
 * supprime les transitions sans rien retirer à l'information, et une
 * interruption laisse toujours la planche dans un état déterministe.
 */

const ROUTE = "/hud/thundart";
const NEXT = "Suivant";
const PREVIOUS = "Précédent";
const RESET = "Réinitialiser";

const scene = (page: Page) => page.locator("[data-thundart-motion]");
const experience = (page: Page) => page.locator("[data-sequence-state]");

const motionOf = (page: Page) => scene(page).getAttribute("data-thundart-motion");

async function hasWebGl(page: Page) {
  return page.evaluate(() => {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  });
}

/** Charge la route et attend que l'asset GLB soit réellement monté. */
async function openScene(page: Page) {
  await page.goto(ROUTE);
  await expect(scene(page)).toHaveAttribute("data-thundart-asset", "ready", {
    timeout: 30_000,
  });
}

/**
 * Budget d'une transition en navigateur de test.
 *
 * Les navigateurs de test rendent le WebGL en logiciel (SwiftShader, sur CPU).
 * La scène y prend le profil de rendu `software` (voir `render-profile.ts`) :
 * sans anticrénelage ni ombres, une frame coûte ~80 ms au lieu de ~160 ms, et
 * le pas de temps plafonné à 200 ms (au lieu de 64 ms, voir
 * `MAX_FRAME_STEP_MS`) garde « configure » (2,6 s nominales) à ~2,6 s en local,
 * contre ~7 s auparavant et plus de 15 s sur les runners CI. Le budget reste
 * large pour les runners lents, et borné : une transition qui ne se termine
 * jamais échoue toujours.
 */
const TRANSITION_BUDGET_MS = 45_000;

/**
 * Attend un repos STABLE. Juste après un clic, l'attribut vaut encore « idle »
 * tant que React n'a pas commité le passage à « running » : exiger plusieurs
 * lectures consécutives évite de conclure trop tôt.
 */
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
    const box = document.querySelector("[data-thundart-motion]");
    const host = document.querySelector("[data-sequence-state]");
    if (!box || !host) throw new Error("scène introuvable");

    const entry = () =>
      `${host.getAttribute("data-sequence-state")}/${box.getAttribute("data-thundart-motion")}`;
    const log: string[] = [entry()];
    (window as unknown as { __thdLog: string[] }).__thdLog = log;

    const observer = new MutationObserver(() => log.push(entry()));
    observer.observe(box, {
      attributes: true,
      attributeFilter: ["data-thundart-motion"],
    });
    observer.observe(host, {
      attributes: true,
      attributeFilter: ["data-sequence-state"],
    });
  });
}

const readTransitions = (page: Page) =>
  page.evaluate(
    () => (window as unknown as { __thdLog?: string[] }).__thdLog ?? [],
  );

/**
 * Attend qu'une bascule précise ait été observée.
 *
 * On interroge le journal du MutationObserver plutôt que l'attribut : un état
 * transitoire comme « running » peut échapper à un sondage régulier, alors que
 * l'observateur, lui, ne rate rien.
 */
async function waitForTransition(
  page: Page,
  entry: string,
  timeoutMs = TRANSITION_BUDGET_MS,
) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if ((await readTransitions(page)).includes(entry)) return;
    await page.waitForTimeout(80);
  }
  throw new Error(
    `bascule « ${entry} » jamais observée — journal : ${(
      await readTransitions(page)
    ).join(" | ")}`,
  );
}

/**
 * Budget d'immobilisation après un drag orbital.
 *
 * L'amortissement d'OrbitControls (`enableDamping`) se compte en frames, pas
 * en temps : le plafond de pas du profil `software` ne l'abrège pas, et il
 * enchaîne une centaine de frames après le relâchement, bien plus qu'une
 * transition comme « configure ». Même raison, budget double.
 */
const ORBIT_SETTLE_BUDGET_MS = 2 * TRANSITION_BUDGET_MS;

/**
 * Écart entre deux captures comparées. Il couvre largement une frame
 * logicielle, même ralentie par la contention : en deux secondes, une caméra
 * encore amortie change forcément l'image.
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
 * Part des pixels, de 0 à 1, nettement différents entre deux captures PNG.
 * Le navigateur les décode, sans dépendance ajoutée ; un écart de moins de
 * 24 niveaux par canal est ignoré.
 */
async function changedShare(page: Page, first: Buffer, second: Buffer) {
  return page.evaluate(
    async ([a, b]) => {
      const pixels = async (base64: string) => {
        const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
        const bitmap = await createImageBitmap(
          new Blob([bytes], { type: "image/png" }),
        );
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

// Ces tests chronomètrent de vraies transitions dans un contexte WebGL. Lancés
// en parallèle, plusieurs contextes se privent mutuellement de frames et les
// mesures deviennent ininterprétables. `mode: "default"` les sérialise dans un
// seul worker — contrairement à `"serial"`, un échec n'entraîne pas le saut des
// suivants, donc rien n'est masqué.
// Quatre transitions au plus par test, chacune bornée par son budget.
test.describe.configure({
  mode: "default",
  timeout: 4 * TRANSITION_BUDGET_MS + 30_000,
});

test.describe("Thundart — séquence pilotée par l’état", () => {
  test("progresse état par état, puis retombe au repos", async ({ page }) => {
    await openScene(page);
    test.skip(!(await hasWebGl(page)), "WebGL indisponible sur cet agent");
    await recordTransitions(page);

    await expect(experience(page)).toHaveAttribute(
      "data-sequence-state",
      "overview",
    );
    expect(await motionOf(page)).toBe("idle");

    for (const expected of ["inspect", "configure", "departure", "complete"]) {
      await page.getByRole("button", { name: NEXT }).click();
      await expect(experience(page)).toHaveAttribute(
        "data-sequence-state",
        expected,
      );
      await settle(page);
    }

    // Chaque état a bien traversé une transition, puis s’est figé.
    const log = await readTransitions(page);
    for (const expected of ["inspect", "configure", "departure", "complete"]) {
      expect(log).toContain(`${expected}/running`);
      expect(log).toContain(`${expected}/idle`);
    }
    expect(log.at(-1)).toBe("complete/idle");
  });

  test("ne bouge pas tant que l’état ne change pas", async ({ page }) => {
    await openScene(page);
    test.skip(!(await hasWebGl(page)), "WebGL indisponible sur cet agent");

    // On se place sur un état atteint après transition, pour prouver que le
    // repos est réel et pas seulement l’absence de démarrage.
    await page.getByRole("button", { name: NEXT }).click();
    await settle(page);
    await recordTransitions(page);

    const before = (await readTransitions(page)).length;
    await page.waitForTimeout(2500);

    // Aucune boucle décorative, aucune animation d’attente : le journal est figé.
    expect((await readTransitions(page)).length).toBe(before);
    expect(await motionOf(page)).toBe("idle");
  });

  test("mouvement réduit : pose finale immédiate, aucune transition", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openScene(page);
    test.skip(!(await hasWebGl(page)), "WebGL indisponible sur cet agent");

    await expect(scene(page)).toHaveAttribute(
      "data-thundart-reduced-motion",
      "true",
    );
    await expect(
      page.getByText("Mouvement réduit actif", { exact: false }),
    ).toBeVisible();
    await recordTransitions(page);

    for (const expected of ["inspect", "configure", "departure", "complete"]) {
      await page.getByRole("button", { name: NEXT }).click();
      await expect(experience(page)).toHaveAttribute(
        "data-sequence-state",
        expected,
      );
      // Pas d’attente de stabilisation : la pose est censée être déjà posée.
      expect(await motionOf(page)).toBe("idle");
    }

    // L’information est la même — on parcourt bien les cinq états — mais
    // aucune interpolation n’a eu lieu.
    const log = await readTransitions(page);
    expect(log.filter((entry) => entry.endsWith("/running"))).toEqual([]);
    expect(log.at(-1)).toBe("complete/idle");
  });

  test("réinitialiser pendant une transition ramène proprement à overview", async ({
    page,
  }) => {
    await openScene(page);
    test.skip(!(await hasWebGl(page)), "WebGL indisponible sur cet agent");
    await recordTransitions(page);

    await page.getByRole("button", { name: NEXT }).click();
    await settle(page);

    // `inspect → configure` joue le clip long du rack : on attend d'être
    // réellement en mouvement avant de couper, sinon le test ne prouverait rien.
    await page.getByRole("button", { name: NEXT }).click();
    await waitForTransition(page, "configure/running");

    await page.getByRole("button", { name: RESET }).click();
    await expect(experience(page)).toHaveAttribute(
      "data-sequence-state",
      "overview",
    );
    await settle(page);
    expect(await motionOf(page)).toBe("idle");

    // La planche reste utilisable : on peut repartir en avant tout de suite.
    await page.getByRole("button", { name: NEXT }).click();
    await expect(experience(page)).toHaveAttribute(
      "data-sequence-state",
      "inspect",
    );
    await settle(page);
  });

  test("une rafale de clics converge vers un état unique et stable", async ({
    page,
  }) => {
    await openScene(page);
    test.skip(!(await hasWebGl(page)), "WebGL indisponible sur cet agent");

    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));

    // Aucune attente de stabilisation entre les clics : chaque changement coupe
    // le précédent en plein vol. La séquence évite volontairement les bornes
    // (NEXT sur `complete`, PREVIOUS sur `overview`) pour que l'échec éventuel
    // porte sur le mouvement, pas sur un bouton désactivé.
    for (const label of [
      NEXT,
      NEXT,
      NEXT,
      PREVIOUS,
      PREVIOUS,
      RESET,
      NEXT,
      NEXT,
    ]) {
      const button = page.getByRole("button", { name: label });
      await expect(button).toBeEnabled();
      await button.click();
      await page.waitForTimeout(45);
    }

    // Le reducer est déterministe : overview →×3 departure →×2 inspect →
    // RESET overview →×2 configure.
    await expect(experience(page)).toHaveAttribute(
      "data-sequence-state",
      "configure",
    );
    await settle(page);
    expect(await motionOf(page)).toBe("idle");
    expect(errors).toEqual([]);

    // Aucun clip resté en course : un dernier RESET repart et se fige aussi.
    await page.getByRole("button", { name: RESET }).click();
    await settle(page);
    await expect(experience(page)).toHaveAttribute(
      "data-sequence-state",
      "overview",
    );
  });

  test("les contrôles orbitaux ne sont actifs qu’au repos, dans les états d’observation", async ({
    page,
  }) => {
    await openScene(page);
    test.skip(!(await hasWebGl(page)), "WebGL indisponible sur cet agent");

    const hint = page.getByText("Glisser · pivoter / molette · zoomer");
    await expect(hint).toBeVisible();

    // En `configure`, la caméra appartient à la séquence, pas à l’utilisateur.
    await page.getByRole("button", { name: NEXT }).click();
    await settle(page);
    await page.getByRole("button", { name: NEXT }).click();
    await settle(page);
    await expect(hint).toBeHidden();
    await expect(
      page.getByText("Caméra verrouillée dans cet état"),
    ).toBeVisible();
  });

  test("défiler la page conserve l’orbite de l’utilisateur", async ({ page }) => {
    await openScene(page);
    test.skip(!(await hasWebGl(page)), "WebGL indisponible sur cet agent");

    // La planche sous le header, comme par son ancre (`instant` : le document
    // défile en douceur). Le canvas y tient entier, avec de la marge pour le
    // petit aller-retour de défilement plus bas.
    await page
      .locator("#thundart-experience")
      .evaluate((element) =>
        element.scrollIntoView({ block: "start", behavior: "instant" }),
      );
    const preset = await stillCanvasShot(page);

    // Orbite par un drag sur le fond, au-dessus du véhicule : aucun composant
    // n'est survolé, donc aucun aperçu ne vient teinter les captures.
    const box = await page.locator("canvas").boundingBox();
    expect(box).not.toBeNull();
    await page.mouse.move(box!.x + box!.width * 0.2, box!.y + box!.height * 0.12);
    await page.mouse.down();
    await page.mouse.move(box!.x + box!.width * 0.55, box!.y + box!.height * 0.12, {
      steps: 2,
    });
    await page.mouse.up();
    await page.mouse.move(0, 0);
    await expect(experience(page)).toHaveAttribute(
      "data-thundart-inspection",
      "none",
    );
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
