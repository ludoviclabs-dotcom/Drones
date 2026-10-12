import { expect, test, type Page } from "@playwright/test";

/**
 * Point d'entrée des planches techniques : l'index `/hud`, le lien de
 * navigation « Planches », la vitrine de l'accueil et le fil d'Ariane de chaque
 * planche. Avant ce lot, la planche Thundart n'était atteignable que par un lien
 * de pied de page et `/hud` répondait 404.
 */

const BOARDS = [
  {
    name: "Rafale F4 — chasseur et tir Meteor en 3D",
    href: "/hud/rafale-f4-meteor",
  },
  {
    name: "Patriot PAC-3 MSE — batterie et lanceur en 3D",
    href: "/hud/patriot-pac3-mse",
  },
  { name: "Thundart — inspection extérieure 3D", href: "/hud/thundart" },
  { name: "Cellule de drone — vue éclatée", href: "/hud/drone-airframe" },
] as const;

const cardOf = (page: Page, href: string) =>
  page.locator(`article[data-hud-board="${href.split("/").at(-1)}"]`);

test.describe("Planches techniques — point d’entrée", () => {
  test("/hud répond, se rend côté serveur et présente chaque planche", async ({
    page,
    request,
  }) => {
    const response = await request.get("/hud");
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain("Planches techniques");
    expect(html).toContain("BreadcrumbList");
    for (const board of BOARDS) expect(html).toContain(board.name);

    await page.goto("/hud");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /\/hud$/,
    );

    for (const board of BOARDS) {
      await expect(page.getByRole("link", { name: board.name })).toHaveAttribute(
        "href",
        board.href,
      );
      // La vignette est une vraie image chargée, pas un cadre vide.
      const image = cardOf(page, board.href).locator("img");
      await expect(image).toHaveAttribute("alt", /.{20,}/);
      await expect
        .poll(() => image.evaluate((img: HTMLImageElement) => img.naturalWidth))
        .toBeGreaterThan(0);
    }
  });

  test("toute la carte est cliquable, mais le lien garde un nom court", async ({
    page,
  }) => {
    await page.goto("/hud");
    const image = cardOf(page, "/hud/thundart").locator("img");
    await image.scrollIntoViewIfNeeded();
    const box = (await image.boundingBox())!;
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;

    // Au centre de la vignette, c'est bien le lien (étiré) qui reçoit le
    // pointeur — l'image ne capte pas le clic.
    const topmost = await page.evaluate(
      ([px, py]) => document.elementFromPoint(px, py)?.closest("a")?.getAttribute("href"),
      [x, y],
    );
    expect(topmost).toBe("/hud/thundart");

    // Vrai clic souris à cet endroit, hors du titre.
    await page.mouse.click(x, y);
    await expect(page).toHaveURL(/\/hud\/thundart$/);
  });

  test("le focus clavier d’une carte reste visible", async ({ page }) => {
    await page.goto("/hud");
    const target = "/hud/thundart";
    let reached = false;
    for (let i = 0; i < 40 && !reached; i += 1) {
      await page.keyboard.press("Tab");
      reached = await page.evaluate(
        (href) => document.activeElement?.getAttribute("href") === href,
        target,
      );
    }
    expect(reached).toBe(true);
    const outline = await cardOf(page, target).evaluate((article) => {
      const style = getComputedStyle(article);
      return { style: style.outlineStyle, width: parseFloat(style.outlineWidth) };
    });
    expect(outline.style).not.toBe("none");
    expect(outline.width).toBeGreaterThan(0);
  });

  test("la navigation principale mène aux planches", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("banner").getByRole("navigation");
    // « Planches techniques » vit dans le groupe Visualisations : fermé au
    // repos, ouvert au clic (et au survol, au focus), avec son état annoncé.
    const group = nav.getByRole("button", { name: "Visualisations" });
    await expect(group).toHaveAttribute("aria-expanded", "false");
    await group.click();
    await expect(group).toHaveAttribute("aria-expanded", "true");
    const link = nav.getByRole("link", { name: "Planches techniques" });
    await expect(link).toHaveAttribute("href", "/hud");
    await link.click();
    await expect(page).toHaveURL(/\/hud$/);
  });

  test("la navigation se parcourt au clavier : flèches, Échap, focus rendu", async ({
    page,
  }) => {
    await page.goto("/");
    const nav = page.getByRole("banner").getByRole("navigation");
    const group = nav.getByRole("button", { name: "Visualisations" });
    await group.focus();
    // Le focus sur le bouton déplie le groupe ; Flèche bas entre dans la liste.
    await expect(group).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("ArrowDown");
    await expect(
      nav.getByRole("link", { name: "Planches techniques" }),
    ).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(nav.getByRole("link", { name: "Matrice" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(group).toBeFocused();
    await expect(group).toHaveAttribute("aria-expanded", "false");
  });

  for (const width of [1024, 1280, 1440]) {
    test(`${width}px — les quatre groupes tiennent dans l’en-tête, sans rognage`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);
      const nav = await page.evaluate(() => {
        const el = document.querySelector("header nav")!;
        const box = el.getBoundingClientRect();
        const visible = [...el.querySelectorAll("a, button")].filter(
          (node) => node.getClientRects().length > 0,
        );
        return {
          overflow: el.scrollWidth - el.clientWidth,
          groups: visible
            .filter((node) => node.tagName === "BUTTON")
            .map((node) => node.textContent?.trim()),
          clipped: visible
            .filter((node) => {
              const rect = node.getBoundingClientRect();
              return rect.left < box.left - 1 || rect.right > box.right + 1;
            })
            .map((node) => node.textContent?.trim()),
        };
      });
      expect(nav.groups).toEqual([
        "Explorer",
        "Visualisations",
        "Outils d’analyse",
        "Méthodologie",
      ]);
      expect(nav.clipped).toEqual([]);
      expect(nav.overflow).toBeLessThanOrEqual(0);
    });
  }

  for (const width of [375, 768]) {
    test(`${width}px — le volet mobile liste toutes les entrées des groupes`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const nav = page.getByRole("banner").getByRole("navigation");
      // Sur petit écran, les groupes ne sont pas affichés en ligne.
      await expect(nav.getByRole("button", { name: "Visualisations" })).toBeHidden();
      const menu = nav.getByRole("button", { name: "Menu" });
      await expect(menu).toHaveAttribute("aria-expanded", "false");
      await menu.click();
      await expect(menu).toHaveAttribute("aria-expanded", "true");
      const planches = nav.getByRole("link", { name: "Planches techniques" });
      await expect(planches).toBeVisible();
      await expect(planches).toHaveAttribute("href", "/hud");
      await expect(nav.getByRole("link", { name: "Glossaire" })).toBeVisible();
      await planches.click();
      await expect(page).toHaveURL(/\/hud$/);
    });
  }

  test("l’accueil montre la planche de tête dès l’arrivée, et mène à chacune", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await expect(
      page.getByRole("link", { name: "Voir les planches techniques →" }),
    ).toHaveAttribute("href", "/hud");
    for (const board of BOARDS) {
      const link = page.getByRole("link", { name: board.name });
      await expect(link).toHaveAttribute("href", board.href);
    }
    // La planche de tête du registre est le visuel du hero : visible dans le
    // premier écran, sans défilement, à côté du titre et des actions.
    const plate = cardOf(page, "/hud/rafale-f4-meteor");
    const plateTop = await plate.evaluate((el) => el.getBoundingClientRect().top);
    expect(plateTop).toBeLessThan(900);
    const h1 = await page
      .getByRole("heading", { level: 1 })
      .evaluate((el) => el.getBoundingClientRect().bottom);
    expect(h1).toBeLessThan(900);
    // Sa vignette est une vraie image, annotée de repères tirés du dossier.
    const image = plate.locator("img");
    await expect(image).toHaveAttribute("alt", /.{20,}/);
    await expect
      .poll(() => image.evaluate((img: HTMLImageElement) => img.naturalWidth))
      .toBeGreaterThan(0);
    await expect(plate.locator(".hero-callout")).toHaveCount(3);

    // Ses entrées directes ouvrent la planche dans chacun des trois scénarios,
    // et passent au-dessus du lien étiré de la carte.
    const entries = plate
      .getByRole("list", { name: "Entrer directement dans un scénario" })
      .getByRole("link");
    await expect(entries).toHaveCount(3);
    expect(
      await entries.evaluateAll((links) =>
        links.map((link) => link.getAttribute("href")),
      ),
    ).toEqual([
      "/hud/rafale-f4-meteor?scenario=bvr",
      "/hud/rafale-f4-meteor?scenario=wvr",
      "/hud/rafale-f4-meteor?scenario=sead",
    ]);
    const sead = entries.nth(2);
    await sead.scrollIntoViewIfNeeded();
    const seadBox = (await sead.boundingBox())!;
    const topmost = await page.evaluate(
      ([px, py]) =>
        document.elementFromPoint(px, py)?.closest("a")?.getAttribute("href"),
      [seadBox.x + seadBox.width / 2, seadBox.y + seadBox.height / 2],
    );
    expect(topmost).toBe("/hud/rafale-f4-meteor?scenario=sead");

    // Les autres planches vivent dans la séquence Instruments : la deuxième du
    // registre en vedette, les suivantes en lignes, dans l'ordre du registre.
    const spotlight = cardOf(page, "/hud/patriot-pac3-mse");
    await expect(spotlight).toHaveCount(1);
    const order = await page
      .locator("#instruments a[href^='/hud/']")
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    expect(order).toEqual(["/hud/patriot-pac3-mse", "/hud/thundart", "/hud/drone-airframe"]);
  });

  for (const board of BOARDS) {
    test(`${board.href} ramène à l’index par son fil d’Ariane`, async ({
      page,
    }) => {
      await page.goto(board.href);
      const crumbs = page.getByRole("navigation", { name: "Fil d’Ariane" });
      await expect(crumbs.locator('[aria-current="page"]')).toBeVisible();
      await crumbs.getByRole("link", { name: "Planches techniques" }).click();
      await expect(page).toHaveURL(/\/hud$/);
    });
  }

  test("375px — cartes empilées, lisibles, sans débordement", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/hud");
    const layout = await page.evaluate((count) => {
      const cards = [...document.querySelectorAll("article[data-hud-board]")];
      const boxes = cards.map((c) => c.getBoundingClientRect());
      return {
        overflow:
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
        stacked:
          boxes.length === count &&
          boxes.every((box, i) => i === 0 || box.top >= boxes[i - 1].bottom),
        minWidth: Math.min(...boxes.map((b) => b.width)),
      };
    }, BOARDS.length);
    expect(layout.overflow).toBe(0);
    expect(layout.stacked).toBe(true);
    expect(layout.minWidth).toBeGreaterThan(300);
  });

  test("1440px — la grille de l’index ne laisse aucune carte orpheline", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/hud");
    // Cartes par rangée, dans l'ordre du DOM : trois colonnes seulement quand
    // elles tombent juste (4 planches = 2 × 2), jamais une carte seule en bas.
    const rows = await page.evaluate(() => {
      const counts = new Map<number, number>();
      for (const card of document.querySelectorAll("article[data-hud-board]")) {
        const top = Math.round(card.getBoundingClientRect().top);
        counts.set(top, (counts.get(top) ?? 0) + 1);
      }
      return [...counts.values()];
    });
    expect(rows.reduce((sum, count) => sum + count, 0)).toBe(BOARDS.length);
    expect(rows[0]).toBeGreaterThan(1);
    expect(rows).toEqual(rows.map(() => rows[0]));
  });
});
