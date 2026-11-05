import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Briefing vidéo — film Remotion lu dans une modale native depuis l'accueil,
 * ou dans la page partageable `/demo`. Commandes du site (chapitres, lecture,
 * clavier), lien direct `?demo=1`, mouvement réduit, invitation de première
 * visite et lecture en 9:16 sur téléphone.
 */

const TRIGGER = /Voir le briefing/;

async function openFromHero(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: TRIGGER }).first().click();
  const dialog = page.getByRole("dialog", { name: /Panoplie en \d+ secondes/ });
  await expect(dialog).toBeVisible();
  const player = page.locator("[data-film-player]");
  await expect(player).toBeVisible({ timeout: 30_000 });
  return { dialog, player };
}

test.describe("Briefing vidéo", () => {
  test("s'ouvre depuis le hero, se pilote par chapitres et au clavier", async ({
    page,
  }) => {
    const { dialog, player } = await openFromHero(page);
    await expect(player).toHaveAttribute("data-state", "playing");
    await expect(player).toHaveAttribute("data-chapter", "ouverture");

    // Saut direct au chapitre 3 par la barre de chapitres.
    const chapter3 = page.getByRole("button", { name: "Chapitre 03 : La preuve" });
    await chapter3.click();
    await expect(player).toHaveAttribute("data-chapter", "preuve");
    await expect(chapter3).toHaveAttribute("aria-current", "step");
    await expect(page.locator("[data-film-caption]")).toContainText("source");

    // Flèches : chapitre suivant ; pause sur le bouton dédié.
    await player.press("ArrowRight");
    await expect(player).toHaveAttribute("data-chapter", "comparer");
    await page.getByRole("button", { name: "Pause", exact: true }).click();
    await expect(player).toHaveAttribute("data-state", "paused");

    const results = await new AxeBuilder({ page })
      .include("dialog")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    const serious = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    expect(
      serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`),
    ).toEqual([]);

    // Échap ferme la modale et rend le focus au déclencheur.
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(page.getByRole("button", { name: TRIGGER }).first()).toBeFocused();
  });

  test("propose les liens de sortie à la fin du film", async ({ page }) => {
    const { player } = await openFromHero(page);
    await page.getByRole("button", { name: "Chapitre 07 : À vous" }).click();
    await expect(player).toHaveAttribute("data-state", "ended", { timeout: 15_000 });
    await expect(page.getByRole("link", { name: "Ouvrir le recueil →" }).last()).toBeVisible();
    await page.getByRole("button", { name: "Revoir", exact: true }).click();
    await expect(player).toHaveAttribute("data-chapter", "ouverture");
  });

  test("?demo=1 ouvre le film sur le chapitre demandé, puis s'efface de l'adresse", async ({
    page,
  }) => {
    await page.goto("/?demo=1&chapitre=comparer");
    const player = page.locator("[data-film-player]");
    await expect(player).toBeVisible({ timeout: 30_000 });
    await expect(player).toHaveAttribute("data-chapter", "comparer");
    await page.keyboard.press("Escape");
    await expect(page).toHaveURL(/\/$/);
  });

  test("lit la version 9:16 sur téléphone, sans débordement", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const { player } = await openFromHero(page);
    await expect(player).toHaveAttribute("data-orientation", "portrait");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
  });
});

test.describe("Briefing vidéo — mouvement réduit", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("pas de lecture automatique ; on avance d'image clé en image clé", async ({
    page,
  }) => {
    const { player } = await openFromHero(page);
    await expect(player).toHaveAttribute("data-state", "paused");
    await page.getByRole("button", { name: /Chapitre suivant/ }).click();
    await expect(player).toHaveAttribute("data-chapter", "dossier");
    await expect(player).toHaveAttribute("data-state", "paused");
  });
});

test.describe("Briefing vidéo — première visite", () => {
  // Stockage vide : le visiteur n'a encore ni vu ni refusé le film.
  test.use({ storageState: { cookies: [], origins: [] } });

  test("invite sans bloquer la page, une seule fois", async ({ page }) => {
    await page.goto("/");
    const invite = page.getByRole("region", { name: "Briefing de première visite" });
    await expect(invite).toBeVisible({ timeout: 10_000 });
    // Non modale : la page reste utilisable.
    await expect(page.getByRole("link", { name: "Ouvrir le recueil →" }).first()).toBeEnabled();
    await invite.getByRole("button", { name: "Plus tard" }).click();
    await expect(invite).toBeHidden();
    await page.reload();
    await page.waitForTimeout(5_000);
    await expect(invite).toBeHidden();
  });
});

test.describe("Page /demo", () => {
  test("présente le film, sa transcription et les liens par chapitre", async ({ page }) => {
    await page.goto("/demo");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /Panoplie en \d+ secondes/,
    );
    await expect(page.locator("[data-film-player]")).toBeVisible({ timeout: 30_000 });
    await expect(page.locator("ol li[id^=transcription-]")).toHaveCount(7);

    // Les liens de la transcription repositionnent le lecteur (ancre).
    await page.locator("#transcription-comparer").getByRole("link").click();
    await expect(page.locator("[data-film-player]")).toHaveAttribute(
      "data-chapter",
      "comparer",
      { timeout: 30_000 },
    );

    await page.goto("/demo?chapitre=preuve");
    await expect(page.locator("[data-film-player]")).toHaveAttribute(
      "data-chapter",
      "preuve",
      { timeout: 30_000 },
    );

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    const serious = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    expect(
      serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`),
    ).toEqual([]);
  });
});
