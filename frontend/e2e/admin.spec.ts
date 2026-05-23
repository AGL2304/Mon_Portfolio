import { test, expect } from "@playwright/test";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@test.local";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "test-admin-password";

test.describe("Admin login flow", () => {
  test("redirige vers /admin/login quand non authentifie", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await expect(page).toHaveURL(/\/admin\/login$/);
    await expect(page.getByRole("heading", { name: /administrateur|admin/i }).first()).toBeVisible();
  });

  test("rejette des identifiants invalides", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel(/email/i).fill("wrong@example.com");
    await page.getByLabel(/mot de passe/i).fill("definitely-wrong");
    await page.getByRole("button", { name: /se connecter/i }).click();
    await expect(page.locator(".banner.err, [role=alert]").first()).toBeVisible({ timeout: 5000 });
    await expect(page).toHaveURL(/\/admin\/login$/);
  });

  test("accepte des identifiants valides et entre dans le dashboard", async ({ page }) => {
    test.skip(
      !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD,
      "ADMIN_EMAIL/ADMIN_PASSWORD non fournis — test happy-path skip",
    );
    await page.goto("/admin/login");
    await page.getByLabel(/email/i).fill(ADMIN_EMAIL);
    await page.getByLabel(/mot de passe/i).fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: /se connecter/i }).click();
    await expect(page).toHaveURL(/\/admin\/dashboard$/, { timeout: 10_000 });
  });
});
