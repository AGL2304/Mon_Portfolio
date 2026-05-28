import { BrowserContext, Page, expect } from "@playwright/test";

/**
 * Helpers partages entre les specs E2E.
 *
 * - `forceFrenchLang(context)` : force la langue FR via localStorage AVANT que
 *   l'app charge. Sans ca, le runner CI (locale en_US) demarre l'app en anglais
 *   et les regex FR des tests ne matchent plus.
 * - `mockPublicApi(context)` : intercepte /api/public/content et renvoie un
 *   contenu minimal. Permet aux tests E2E de tourner SANS backend reel.
 */

export async function forceFrenchLang(context: BrowserContext): Promise<void> {
  await context.addInitScript(() => {
    try {
      window.localStorage.setItem("portfolio.lang", "fr");
    } catch {
      // localStorage indisponible (mode privé strict) : tant pis
    }
  });
}

export const MOCK_CONTENT = {
  profile: {
    full_name: "Georges Lionel ANANI",
    headline: "Alternant Cybersécurité GRC",
    tagline: "M1 · École-IT Amiens",
    short_bio: "Étudiant Mastère Architectures Systèmes — spécialisation GRC.",
    about: "Bio courte pour les tests E2E.",
    availability: "Alternance Septembre 2026",
    location: "Île-de-France · École à Amiens",
    address: "",
    phone: "",
    email: "test@example.com",
    github_url: "https://github.com/AGL2304",
    linkedin_url: "https://www.linkedin.com/in/test",
    tryhackme_url: "https://tryhackme.com/p/agl23",
    cv_url: "/api/public/cv",
    profile_image: "",
    english_level: "C1",
  },
  hero_tags: ["ISO 27001", "DORA", "RGPD"],
  experiences: [
    {
      id: "test-exp",
      title: "Stagiaire test",
      company: "Test Corp",
      location: "Paris",
      period: "Janvier 2026 — Aujourd'hui",
      current: true,
      highlights: ["Bullet test"],
    },
  ],
  projects: [
    {
      id: "p1",
      title: "Projet GRC test",
      date: "2026",
      categories: ["grc"],
      description: "Description test",
      technologies: ["FastAPI", "React"],
      repository_url: "https://github.com/test/p1",
      private_note: null,
    },
    {
      id: "p2",
      title: "Projet Security test",
      date: "2025",
      categories: ["security"],
      description: "Description test 2",
      technologies: ["Python"],
      repository_url: null,
      private_note: "Privé",
    },
  ],
  skill_categories: [
    {
      id: "normes-reglementations",
      title: "Normes & Réglementations",
      items: ["ISO 27001", "DORA"],
    },
  ],
  certifications: [
    {
      id: "c1",
      title: "TryHackMe Top 1%",
      subtitle: "agl23",
      description: "Test",
      in_progress: false,
    },
  ],
  interests: [
    {
      id: "i1",
      title: "Veille cyber",
      description: "DORA, NIS 2",
      emoji: "📡",
    },
  ],
};

export async function mockPublicApi(context: BrowserContext): Promise<void> {
  await context.route("**/api/public/content", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_CONTENT),
    }),
  );
}

/** Setup standard pour les pages publiques : langue FR + API mockee. */
export async function setupPublicPage(context: BrowserContext): Promise<void> {
  await forceFrenchLang(context);
  await mockPublicApi(context);
}

/**
 * Attendre que l'app React soit montee (hero visible). Utile apres un goto
 * pour eviter les flaky tests si le mock met du temps a etre servi.
 */
export async function waitForHero(page: Page): Promise<void> {
  await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible({
    timeout: 10_000,
  });
}
