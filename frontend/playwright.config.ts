import { defineConfig, devices } from "@playwright/test";

/**
 * Configuration Playwright pour le portfolio.
 *
 * - Lance Vite (`npm run dev`) automatiquement avant les tests E2E.
 * - Suppose qu'un backend FastAPI tourne sur :8000 (lancer `uvicorn app.main:app`
 *   ou `docker compose up backend db` en parallele).
 *
 * Variables d'env utiles :
 *   E2E_BASE_URL   (defaut http://localhost:5173)
 *   ADMIN_EMAIL    (defaut admin@test.local)
 *   ADMIN_PASSWORD (defaut test-admin-password)
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",

  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
