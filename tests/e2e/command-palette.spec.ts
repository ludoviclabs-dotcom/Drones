import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Palette ⌘K : le bouton « Rechercher » de l'en-tête et le raccourci ouvrent
 * un dialogue de recherche (systèmes, domaines, pages, glossaire), piloté au
 * clavier ; Échap referme et rend le focus.
 */

test.describe("Palette de recherche ⌘K", () => {
  test("raccourci clavier, recherche, Entrée ouvre la fiche", async ({
    page,
  }) => {
    await page.goto("/methodologie");
    await page.keyboard.press("ControlOrMeta+k");
    const dialog = page.getByRole("dialog", { name: "Rechercher dans Panoplie" });
    await expect(dialog).toBeVisible();
    const input = dialog.getByRole("combobox");
    await expect(input).toBeFocused();

    // Palette vide : suggestions domaines et pages.
    await expect(dialog.getByRole("group", { name: "Domaines" })).toBeVisible();

    await input.fill("rafale");
    const first = dialog.getByRole("option").first();
    await expect(first).toContainText("Rafale");
    await expect(first).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/systemes\/rafale$/);
    await expect(dialog).toBeHidden();
  });

  test("bouton de l'en-tête, flèches, Échap rend le focus", async ({ page }) => {
    await page.goto("/glossaire");
    const trigger = page
      .getByRole("banner")
      .getByRole("link", { name: /Rechercher/ });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Rechercher dans Panoplie" });
    await expect(dialog).toBeVisible();
    const input = dialog.getByRole("combobox");
    await input.fill("defense aerienne");
    await expect(dialog.getByRole("option").first()).toBeVisible();
    await page.keyboard.press("ArrowDown");
    await expect(dialog.getByRole("option").nth(1)).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("aucun résultat : message et repli vers le catalogue", async ({ page }) => {
    await page.goto("/glossaire");
    await page.keyboard.press("ControlOrMeta+k");
    const dialog = page.getByRole("dialog", { name: "Rechercher dans Panoplie" });
    await dialog.getByRole("combobox").fill("zzzzqqq");
    await expect(dialog).toContainText("Aucun résultat");
    await expect(
      dialog.getByRole("link", { name: "Catalogue et filtres →" }),
    ).toBeVisible();
  });

  test("terme du glossaire : ancre atteinte", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("ControlOrMeta+k");
    const dialog = page.getByRole("dialog", { name: "Rechercher dans Panoplie" });
    await dialog.getByRole("combobox").fill("MALE");
    await dialog
      .getByRole("group", { name: "Glossaire" })
      .getByRole("option")
      .first()
      .click();
    await expect(page).toHaveURL(/\/glossaire#terme-male$/);
  });

  test("accessibilité : palette ouverte sans violation sérieuse", async ({
    page,
  }) => {
    await page.goto("/methodologie");
    await page.keyboard.press("ControlOrMeta+k");
    const dialog = page.getByRole("dialog", { name: "Rechercher dans Panoplie" });
    await dialog.getByRole("combobox").fill("mbda");
    await expect(dialog.getByRole("option").first()).toBeVisible();
    const results = await new AxeBuilder({ page })
      .include("dialog")
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    expect(
      results.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      ),
    ).toEqual([]);
  });
});

test.describe("Fiche — renvois de sources", () => {
  test("un renvoi d'indicateur mène à son entrée de la liste", async ({
    page,
  }) => {
    await page.goto("/systemes/rafale");
    const mark = page.getByRole("link", { name: /^Source \d{2}$/ }).first();
    const name = (await mark.getAttribute("aria-label"))!;
    const href = (await mark.getAttribute("href"))!;
    const preview = page.locator(
      `[id="${await mark.getAttribute("aria-describedby")}"]`,
    );
    await expect(preview).toBeHidden();
    await mark.focus();
    await expect(preview).toBeVisible();
    await expect(preview).toContainText("Fiab.");
    await page.keyboard.press("Escape");
    await expect(preview).toBeHidden();
    await mark.click();
    const target = page.locator(href);
    await expect(target).toBeInViewport();
    await expect(target).toContainText(name.replace("Source ", ""));
    await expect(target).toContainText("Fiab.");
  });
});
