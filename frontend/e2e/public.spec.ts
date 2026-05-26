import { test, expect } from "@playwright/test";
import { setupPublicPage, waitForHero } from "./_helpers";

test.describe("Portfolio public (HomePage)", () => {
  test.beforeEach(async ({ context }) => {
    await setupPublicPage(context);
  });

  test("affiche le hero avec nom et CTA", async ({ page }) => {
    await page.goto("/");
    await waitForHero(page);
    // Le nom de Georges doit apparaitre quelque part dans le hero/header.
    await expect(page.getByText(/Georges Lionel/i).first()).toBeVisible();
    // Au moins un lien CTA vers le CV ou contact.
    const cv = page.getByRole("link", { name: /cv|t[ée]l[ée]charger|contact|r[ée]sum/i }).first();
    await expect(cv).toBeVisible();
  });

  test("section projets se rend", async ({ page }) => {
    await page.goto("/");
    await waitForHero(page);
    // En FR : "Projets publiés." — selecteur tolerant FR/EN au cas ou.
    await expect(page.getByRole("heading", { name: /projets|projects/i }).first()).toBeVisible();
  });

  test("filtres de projets cliquables", async ({ page }) => {
    await page.goto("/");
    await waitForHero(page);
    const grcFilter = page.getByRole("button", { name: /^GRC|conformit[eé]|compliance/i }).first();
    if (await grcFilter.count()) {
      await grcFilter.click();
    }
  });

  test("toggle de langue FR -> EN change l'UI", async ({ page }) => {
    await page.goto("/");
    await waitForHero(page);
    // Initialement en FR : verifier qu'on voit "Projets" dans la nav
    await expect(page.getByRole("link", { name: /^Projets$/ }).first()).toBeVisible();
    // Cliquer le bouton EN
    await page
      .getByRole("button", { name: /english|EN/i })
      .first()
      .click();
    // Apres bascule : "Projects" en EN dans la nav
    await expect(page.getByRole("link", { name: /^Projects$/ }).first()).toBeVisible({
      timeout: 3000,
    });
  });

  test("section GRC accessible depuis la nav", async ({ page }) => {
    await page.goto("/");
    await waitForHero(page);
    // L'eyebrow "// 03. Livrables GRC" ou "// 03. Open-source GRC..." doit etre visible.
    await expect(page.getByText(/livrables grc|open-source grc deliverables/i).first()).toBeVisible(
      { timeout: 5000 },
    );
  });
});
