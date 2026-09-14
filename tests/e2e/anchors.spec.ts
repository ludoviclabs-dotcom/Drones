import { expect, test, type Page } from "@playwright/test";

/**
 * Ancres de page sous l'en-tête collant. Le seul décalage est le
 * `scroll-padding-top` du document (globals.css) : la cible s'arrête 0,75 rem
 * (12 px) sous l'en-tête. Un `scroll-margin-top` posé sur la cible s'y ajoute
 * au lieu de le remplacer : avec `scroll-mt-28`, le glossaire s'arrêtait 124 px
 * sous l'en-tête ; avec `scroll-mt-24`, le catalogue 108 px. Les planches HUD
 * vérifient leur propre ancre dans leurs specs.
 */

const ANCHORS = [
  // Cible des liens « Cadres & organismes » des fiches.
  { path: "/glossaire", id: "org-dsca" },
  // Cible du bouton « Ouvrir le recueil → » et du domaine Drones.
  { path: "/", id: "catalogue" },
] as const;

const VIEWPORTS = [
  { width: 375, height: 812 },
  { width: 1440, height: 900 },
] as const;

/**
 * Écart entre le haut de la cible et le bas de l'en-tête, défilement terminé.
 * Le document défile en douceur (`scroll-behavior: smooth`) : on attend qu'il
 * ait bougé, puis qu'il reste immobile vingt images de suite, pour mesurer la
 * position d'arrivée et non un point du trajet.
 */
async function landingGap(page: Page, id: string) {
  await page.waitForFunction(() => window.scrollY > 0);
  return page.evaluate(
    (id) =>
      new Promise<number | null>((resolve) => {
        let last = window.scrollY;
        let still = 0;
        const tick = () => {
          still = window.scrollY === last ? still + 1 : 0;
          last = window.scrollY;
          if (still < 20) {
            requestAnimationFrame(tick);
            return;
          }
          const header = document.querySelector("body > header")?.getBoundingClientRect();
          const target = document.getElementById(id)?.getBoundingClientRect();
          resolve(header && target ? target.top - header.bottom : null);
        };
        requestAnimationFrame(tick);
      }),
    id,
  );
}

function expectJustUnderHeader(gap: number | null) {
  expect(gap).not.toBeNull();
  expect(gap!).toBeGreaterThanOrEqual(0);
  expect(gap!).toBeLessThanOrEqual(24);
}

test.describe("Ancres — un seul décalage sous l’en-tête collant", () => {
  for (const viewport of VIEWPORTS) {
    for (const { path, id } of ANCHORS) {
      const url = `${path}#${id}`;

      test(`${viewport.width}px — ${url} par navigation dans la page`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto(path);
        await page.evaluate((hash) => {
          location.hash = hash;
        }, `#${id}`);
        expectJustUnderHeader(await landingGap(page, id));
      });

      test(`${viewport.width}px — ${url} au chargement de l’URL`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto(url);
        expectJustUnderHeader(await landingGap(page, id));
      });
    }
  }
});
