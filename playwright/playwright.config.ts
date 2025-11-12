import { defineConfig, devices } from "@playwright/test";

/**
 * Centrale Playwright configuratie voor alle projecten
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./Ag-grid",
  /* Maximum tijd voor één test */
  timeout: 30 * 1000,
  expect: {
    /* Maximum tijd voor expect assertions */
    timeout: 5000,
  },
  /* Testen parallel uitvoeren */
  fullyParallel: true,
  /* Fail de build op CI als je testen hebt gemist */
  forbidOnly: !!process.env.CI,
  /* Retry op CI */
  retries: process.env.CI ? 2 : 0,
  /* Opties voor workers */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter configuratie */
  reporter: "html",
  /* Shared settings voor alle projecten */
  use: {
    /* Base URL voor navigatie */
    baseURL: "http://localhost:8000",
    /* Trace op retry */
    trace: "on-first-retry",
    /* Screenshot bij failure */
    screenshot: "only-on-failure",
  },

  /* Configureer projecten voor verschillende browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  /* Web server configuratie - start server voor tests */
  /* BELANGRIJK: Server moet vanuit ROOT directory starten */
  webServer: {
    command: "npx serve -l 8000",
    cwd: "..",
    url: "http://localhost:8000",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});

