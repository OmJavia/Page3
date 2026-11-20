import { defineConfig, devices } from '@playwright/test';

/**
 * Page 3 – The Family Salon
 * Playwright E2E Test Configuration
 *
 * Run tests against http://localhost:3000.
 * Start the server first: npm run start  (or npm run dev)
 */
export default defineConfig({
  testDir: './tests',
  /* Run test files in parallel */
  fullyParallel: true,
  /* Fail build on CI if test.only was left in source */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Parallel workers */
  workers: process.env.CI ? 1 : 2,
  /* Reporters */
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],

  /* Shared settings */
  use: {
    baseURL: 'http://localhost:3000',
    /* Collect trace on first retry */
    trace: 'on-first-retry',
    /* Screenshots on failure */
    screenshot: 'only-on-failure',
    /* Video on first retry */
    video: 'on-first-retry',
    /* Default timeout for actions */
    actionTimeout: 10_000,
    /* Navigation timeout */
    navigationTimeout: 30_000,
  },

  /* Projects / browsers */
  projects: [
    // ── Desktop ────────────────────────────────────────────────
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Desktop Firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'Desktop Safari',
      use: { ...devices['Desktop Safari'] },
    },
    // ── Mobile ─────────────────────────────────────────────────
    {
      name: 'Mobile – Pixel 5 (412px)',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile – iPhone 14 (390px)',
      use: { ...devices['iPhone 14'] },
    },
    {
      name: 'Mobile – iPhone SE (375px)',
      use: { ...devices['iPhone SE'] },
    },
    // ── Tablet ─────────────────────────────────────────────────
    {
      name: 'Tablet – iPad (768px)',
      use: { ...devices['iPad (gen 7)'] },
    },
  ],

  /* Auto-start the production server before tests */
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
