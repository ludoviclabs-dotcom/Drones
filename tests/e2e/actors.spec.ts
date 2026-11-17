import { test, expect } from "@playwright/test";

/**
 * Section /acteurs — groupes industriels et défense tech. Les trois lectures
 * qui comptent : le prix d'un rachat non officiel est signalé comme tel, un
 * plafond d'accord-cadre ne passe jamais pour une commande, et une donnée que
 * le registre ne documente pas est dite « non documentée ».
 */

test.describe("Acteurs", () => {
  test("l'index liste les cinq dossiers et chaque lien s'ouvre", async ({ page }) => {
    await page.goto("/acteurs");
    await expect(page.getByRole("heading", { level: 1, name: "Acteurs" })).toBeVisible();
    const cards = page.locator("a[href^='/acteurs/']");
    await expect(cards).toHaveCount(5);
    for (const slug of ["knds", "exail", "eurenco", "anduril", "palantir"]) {
      await expect(page.locator(`a[href='/acteurs/${slug}']`)).toHaveCount(1);
    }
    await cards.first().click();
    await expect(page).toHaveURL(/\/acteurs\/knds$/);
    await expect(page.getByRole("heading", { level: 1, name: "KNDS" })).toBeVisible();
  });

  test("KNDS : le prix du rachat est un chiffre de presse à source unique", async ({ page }) => {
    await page.goto("/acteurs/knds");
    const prix = page.locator("div[data-metric-ids='MET-0002']");
    await expect(prix).toContainText("6,6 Md€");
    await expect(prix).toContainText("non officiel");
    await expect(prix).toContainText("source unique");
    // La valeur écartée est signalée, non fusionnée.
    await expect(prix).toContainText("6,5 Md€");
    // Le budget de juin est un plafond budgétaire, pas un prix.
    await expect(page.locator("div[data-metric-ids='MET-0004']")).toContainText("pas un prix");
  });

  test("Anduril : le plafond de 20,0 Md$ n'est pas une commande", async ({ page }) => {
    await page.goto("/acteurs/anduril");
    const plafond = page.locator("div[data-metric-ids='MET-2009']");
    await expect(plafond).toContainText("Jusqu'à 20,0 Md$");
    await expect(plafond).toContainText("pas une commande");
    await expect(plafond).toContainText("plafond");
    // Le plafond NGC2 n'est pas présenté comme un sous-plafond établi.
    const ngc2 = page.locator("div[data-metric-ids='MET-2010']");
    await expect(ngc2).toContainText("Jusqu'à 1,8 Md$");
    await expect(ngc2).toContainText("Aucune source ouverte");
  });

  test("Exail : 3,9 Md€ est une valeur d'entreprise", async ({ page }) => {
    await page.goto("/acteurs/exail");
    await expect(page.locator("div[data-metric-ids='MET-0284']")).toContainText(
      "valeur d'entreprise",
    );
    await expect(page.locator("div[data-metric-ids='MET-0285']")).toContainText("(calc.)");
  });

  test("un chiffre non communiqué s'écrit « n.c. » et une donnée absente « non documenté »", async ({
    page,
  }) => {
    await page.goto("/acteurs/exail");
    await expect(page.locator("div[data-metric-ids='MET-0247']")).toContainText("n.c.");
    await page.goto("/acteurs/anduril");
    await expect(page.getByText("non documenté").first()).toBeVisible();
  });

  test("slug inconnu : page introuvable", async ({ page }) => {
    const response = await page.goto("/acteurs/inconnu");
    expect(response?.status()).toBe(404);
  });

  test("la navigation, le plan du site et la palette mènent aux acteurs", async ({
    page,
    request,
  }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).toContain("/acteurs/knds");
    expect(sitemap).toContain("/acteurs/palantir");

    await page.goto("/methodologie");
    await page.keyboard.press("ControlOrMeta+k");
    const dialog = page.getByRole("dialog", { name: "Rechercher dans Panoplie" });
    await dialog.getByRole("combobox").fill("knds");
    await expect(dialog.getByRole("option").first()).toContainText("KNDS");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/acteurs\/knds$/);
  });
});
