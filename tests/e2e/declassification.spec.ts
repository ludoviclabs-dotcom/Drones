import { test, expect } from "@playwright/test";

// Transition « Déclassification » : depuis le catalogue, la fiche s'ouvre en
// surimpression (route interceptée), prend le focus, piège Tab, se referme à
// Échap en rendant le focus à la carte ; l'accès direct sert la page complète.

test("catalogue → fiche en surimpression → Échap rend la carte", async ({
  page,
}) => {
  await page.goto("/");
  const card = page.locator('#catalogue a[href="/systemes/rafale"]').first();
  await card.scrollIntoViewIfNeeded();
  const scrollBefore = await page.evaluate(() => window.scrollY);

  await card.click();
  const dialog = page.getByRole("dialog", { name: "Rafale" });
  await expect(dialog).toBeVisible();
  await expect(page).toHaveURL(/\/systemes\/rafale$/);
  await expect(page.locator("#dossier-titre")).toBeFocused();
  await expect(page).toHaveTitle("Rafale — Panoplie");
  await expect(dialog.locator("[data-dossier-panel]")).toHaveAttribute(
    "aria-busy",
    "false",
  );
  // Le catalogue sort du parcours clavier pendant la lecture.
  expect(await page.evaluate(() => document.querySelector("main")?.inert)).toBe(
    true,
  );
  for (let i = 0; i < 30; i += 1) await page.keyboard.press("Tab");
  expect(
    await page.evaluate(
      () => !!document.activeElement?.closest('[role="dialog"]'),
    ),
  ).toBe(true);

  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(page).toHaveURL(/\/$/);
  await expect(card).toBeFocused();
  await expect(page).not.toHaveTitle("Rafale — Panoplie");
  await expect(card).toHaveAttribute("data-dossier-visited", "");
  expect(await page.evaluate(() => window.scrollY)).toBe(scrollBefore);
});

test("fiche en surimpression : le bouton de fermeture ramène au catalogue", async ({
  page,
}) => {
  await page.goto("/");
  const card = page.locator('#catalogue a[href="/systemes/meteor"]').first();
  await card.scrollIntoViewIfNeeded();
  await card.click();
  const dialog = page.getByRole("dialog", { name: "Meteor" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Fermer le dossier" }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page).toHaveURL(/\/$/);
});

test("accès direct à une fiche : page complète, sans surimpression", async ({
  page,
}) => {
  await page.goto("/systemes/rafale");
  await expect(
    page.getByRole("heading", { level: 1, name: "Rafale" }),
  ).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
