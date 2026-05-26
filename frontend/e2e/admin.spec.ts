import { test, expect } from "@playwright/test";
import { forceFrenchLang } from "./_helpers";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@test.local";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "test-admin-password";

test.describe("Admin login flow", () => {
  test.beforeEach(async ({ context }) => {
    // Force la langue FR pour stabiliser les selecteurs sur runner CI (locale en_US).
    await forceFrenchLang(context);
  });

  test("redirige vers /admin/login quand non authentifie", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await expect(page).toHaveURL(/\/admin\/login$/);
    await expect(
      page.getByRole("heading", { name: /administrateur|admin/i }).first(),
    ).toBeVisible();
  });

  test("rejette des identifiants invalides", async ({ page, context }) => {
    // Mock le endpoint d'auth pour renvoyer 401 deterministiquement sans backend.
    await context.route("**/api/auth/login", (route) =>
      route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ detail: "Email ou mot de passe invalide." }),
      }),
    );

    await page.goto("/admin/login");
    await page.getByLabel(/email/i).fill("wrong@example.com");
    await page.getByLabel(/mot de passe|password/i).fill("definitely-wrong");
    await page.getByRole("button", { name: /se connecter|sign in/i }).click();
    await expect(page.locator(".banner.err, [role=alert]").first()).toBeVisible({
      timeout: 5000,
    });
    await expect(page).toHaveURL(/\/admin\/login$/);
  });

  test("accepte des identifiants valides et entre dans le dashboard", async ({ page, context }) => {
    test.skip(
      !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD,
      "ADMIN_EMAIL/ADMIN_PASSWORD non fournis — test happy-path skip",
    );

    // Mock un login reussi (token bidon) pour eviter d'avoir besoin d'un backend reel.
    await context.route("**/api/auth/login", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          access_token: "test.jwt.token",
          token_type: "bearer",
        }),
      }),
    );
    // Mock egalement le content admin charge par le dashboard apres login.
    await context.route("**/api/admin/content", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          profile: {
            full_name: "Test",
            headline: "Test",
            short_bio: "Test",
            about: "Test",
            email: "t@t.com",
          },
          hero_tags: [],
          experiences: [],
          projects: [],
          skill_categories: [],
          certifications: [],
          interests: [],
        }),
      }),
    );

    await page.goto("/admin/login");
    await page.getByLabel(/email/i).fill(ADMIN_EMAIL);
    await page.getByLabel(/mot de passe|password/i).fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: /se connecter|sign in/i }).click();
    await expect(page).toHaveURL(/\/admin\/dashboard$/, { timeout: 10_000 });
  });
});
