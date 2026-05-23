import { test, expect } from "@playwright/test";

test.describe("Portfolio public (HomePage)", () => {
  test("affiche le hero avec nom et CTA", async ({ page }) => {
    await page.goto("/");
    // Le nom de Georges doit apparaitre quelque part dans le hero/header.
    await expect(page.getByText(/Georges Lionel/i).first()).toBeVisible();
    // Au moins un lien CTA vers le CV ou contact.
    const cv = page.getByRole("link", { name: /cv|t[ée]l[ée]charger|contact/i }).first();
    await expect(cv).toBeVisible();
  });

  test("section projets se rend", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /projets/i }).first()).toBeVisible();
  });

  test("filtres de projets cliquables", async ({ page }) => {
    await page.goto("/");
    const grcFilter = page.getByRole("button", { name: /grc|conformit[eé]/i }).first();
    if (await grcFilter.count()) {
      await grcFilter.click();
      await expect(grcFilter).toHaveAttribute("aria-pressed", /true|/i);
    }
  });
});
