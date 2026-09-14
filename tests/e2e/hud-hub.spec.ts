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
    await expect(nav.getByRole("link", { name: "Planches" })).toHaveAttribute(
      "href",
      "/hud",
    );
    await nav.getByRole("link", { name: "Planches" }).click();
    await expect(page).toHaveURL(/\/hud$/);
  });

  for (const width of [768, 1024]) {
    test(`${width}px — aucun lien de navigation n’est rogné à gauche`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const clipped = await page.evaluate(() => {
        const nav = document.querySelector("header nav")!;
        const left = nav.getBoundingClientRect().left;
        return [...nav.querySelectorAll("a")]
          .filter((a) => a.getBoundingClientRect().left < left - 1)
          .map((a) => a.textContent?.trim());
      });
      // Avant correction, EuroSatory (et à 768 px Domaines et Comparateur)
      // débordait à gauche, hors de portée du défilement.
      expect(clipped).toEqual([]);
    });
  }

  for (const width of [1280, 1440]) {
    test(`${width}px — tous les liens de navigation tiennent sans défilement`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      // Mesure en régime établi : pendant l'échange de police, la police de
      // repli est bien plus large et ferait déborder n'importe quelle barre.
      await page.evaluate(() => document.fonts.ready);
      const nav = await page.evaluate(() => {
        const el = document.querySelector("header nav")!;
        const box = el.getBoundingClientRect();
        const links = [...el.querySelectorAll("a")];
        return {
          overflow: el.scrollWidth - el.clientWidth,
          cut: links
            .filter((a) => a.getBoundingClientRect().right > box.right + 1)
            .map((a) => a.textContent?.trim()),
          headroom: Math.round(links[0].getBoundingClientRect().left - box.left),
        };
      });
      // Sur bureau, l'en-tête plafonne à 1180 px : les neuf liens doivent y
      // tenir entiers, sans qu'aucun ne soit rogné à droite.
      expect(nav.cut, `marge avant le premier lien : ${nav.headroom}px`).toEqual([]);
      expect(nav.overflow).toBeLessThanOrEqual(0);
    });
  }

  test("l’accueil montre chaque planche dès l’arrivée", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await expect(
      page.getByRole("link", { name: "Voir les planches techniques →" }),
    ).toHaveAttribute("href", "/hud");
    for (const board of BOARDS) {
      const link = page.getByRole("link", { name: board.name });
      await expect(link).toHaveAttribute("href", board.href);
    }
    // Les vignettes commencent dans le premier écran, sans défilement.
    const teasers = page.locator("article[data-hud-board]");
    const teaserTop = await teasers
      .first()
      .evaluate((el) => el.getBoundingClientRect().top);
    expect(teaserTop).toBeLessThan(900);

    // La planche la plus récente (tête du registre) devient la grande vignette
    // du bas ; les autres gardent la grille, dans l'ordre du DOM : [Patriot en
    // pleine largeur, Thundart, Drone, Rafale]. Nombre impair dans la grille :
    // la première vignette occupe toute la largeur, les suivantes vont par
    // deux — aucune vignette orpheline en fin de grille.
    const boxes = await teasers.evaluateAll((els) =>
      els.map((el) => {
        const { top, left, right, width } = el.getBoundingClientRect();
        return { top, left, right, width };
      }),
    );
    expect(boxes).toHaveLength(BOARDS.length);
    expect(Math.round(boxes[0].width)).toBe(
      Math.round(boxes[2].right - boxes[1].left),
    );
    expect(Math.round(boxes[1].top)).toBe(Math.round(boxes[2].top));

    // La grande vignette ferme la colonne : même largeur que la grille, sous
    // elle, et son pied rejoint celui de la colonne gauche du hero, sans bande
    // vide face au sommaire des domaines.
    const spotlight = page.locator('article[data-hud-teaser="spotlight"]');
    await expect(spotlight).toHaveCount(1);
    await expect(spotlight).toHaveAttribute("data-hud-board", "rafale-f4-meteor");
    expect(await teasers.last().getAttribute("data-hud-teaser")).toBe(
      "spotlight",
    );
    expect(Math.round(boxes[3].width)).toBe(Math.round(boxes[0].width));
    expect(boxes[3].top).toBeGreaterThan(boxes[2].top);
    // Les deux pieds sont mesurés ensemble : un échange de police qui
    // relancerait la mise en page les déplacerait d'un même mouvement.
    const feet = await spotlight.evaluate((article) => {
      // Colonne gauche du hero : l'ancêtre qui porte le titre de l'accueil.
      const hero = article.closest("div:has(> h1)");
      if (!hero) return null;
      const box = hero.getBoundingClientRect();
      const style = getComputedStyle(hero);
      return {
        spotlight: article.getBoundingClientRect().bottom,
        column:
          box.bottom -
          parseFloat(style.paddingBottom) -
          parseFloat(style.borderBottomWidth),
      };
    });
    expect(feet).not.toBeNull();
    expect(Math.abs(feet!.spotlight - feet!.column)).toBeLessThanOrEqual(2);

    // Ses entrées directes ouvrent la planche dans chacun des trois scénarios,
    // et passent au-dessus du lien étiré de la carte.
    const entries = spotlight
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
