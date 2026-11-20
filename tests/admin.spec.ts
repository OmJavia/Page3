/**
 * admin.spec.ts
 * Page 3 – The Family Salon
 *
 * Tests:
 *   - Admin gatekeeper (unauthenticated → redirect to /admin/login)
 *   - Login form renders correctly
 *   - Wrong password is rejected
 *   - Correct password grants access to dashboard
 *   - Admin sub-pages are accessible after login
 *   - API routes require no body-breaking errors
 */
import { test, expect, Page } from '@playwright/test';

const ADMIN_PASSWORD = '9111';

// ── Gatekeeper ────────────────────────────────────────────────────────────────

test.describe('Admin – Gatekeeper', () => {
  const protectedRoutes = [
    '/admin/dashboard',
    '/admin/appointments',
    '/admin/customers',
    '/admin/checkout',
    '/admin/finance',
    '/admin/staff',
    '/admin/services',
    '/admin/settings',
    '/admin/retention',
  ];

  for (const route of protectedRoutes) {
    test(`unauthenticated access to ${route} redirects to login`, async ({
      page,
    }) => {
      // Clear any existing session cookies/storage
      await page.context().clearCookies();
      await page.goto(route);
      // Should land on login page (URL contains "login")
      await expect(page).toHaveURL(/login/, { timeout: 10_000 });
    });
  }
});

// ── Login page ────────────────────────────────────────────────────────────────

test.describe('Admin – Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/admin/login');
  });

  test('login page has password input', async ({ page }) => {
    await expect(page.getByRole('textbox', { name: /password/i }).or(
      page.locator('input[type="password"]')
    ).first()).toBeVisible();
  });

  test('login page has submit button', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: /login|sign in|enter|unlock/i }).first()
    ).toBeVisible();
  });

  test('wrong password shows error', async ({ page }) => {
    await page.locator('input[type="password"]').fill('0000');
    await page.getByRole('button', { name: /login|sign in|enter|unlock/i }).first().click();
    await expect(
      page.getByText(/incorrect|invalid|wrong|error/i).first()
    ).toBeVisible({ timeout: 5_000 });
  });

  test('correct password redirects to dashboard', async ({ page }) => {
    await page.locator('input[type="password"]').fill(ADMIN_PASSWORD);
    await page.getByRole('button', { name: /login|sign in|enter|unlock/i }).first().click();
    await expect(page).toHaveURL(/dashboard/, { timeout: 10_000 });
  });
});

// ── Dashboard (authenticated) ─────────────────────────────────────────────────

test.describe('Admin – Dashboard (authenticated)', () => {
  /** Log in once and reuse the session for all tests in this group. */
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/admin/login');
    await page.locator('input[type="password"]').fill(ADMIN_PASSWORD);
    await page.getByRole('button', { name: /login|sign in|enter|unlock/i }).first().click();
    await page.waitForURL(/dashboard/, { timeout: 10_000 });
  });

  test('dashboard shows key KPI cards', async ({ page }) => {
    // Dashboard should mention Today's appointments or revenue
    await expect(
      page.getByText(/today|appointment|revenue|customer/i).first()
    ).toBeVisible();
  });

  test('admin navigation links are present', async ({ page }) => {
    const links = ['appointment', 'customer', 'finance', 'staff'];
    for (const label of links) {
      await expect(
        page.getByRole('link', { name: new RegExp(label, 'i') }).first()
      ).toBeAttached();
    }
  });
});

// ── API Customers ─────────────────────────────────────────────────────────────

test.describe('API – /api/customers', () => {
  test('GET /api/customers returns JSON', async ({ request }) => {
    const res = await request.get('/api/customers');
    // May return 200 with list or 401, but must return JSON
    const body = await res.json();
    expect(typeof body).toBe('object');
  });

  test('lookup by phone returns masked PII', async ({ request }) => {
    // Use the demo customer phone from mock-data (9876543210 in DEMO_CUSTOMERS)
    const res = await request.get('/api/customers?phone=9876543210');
    if (res.status() === 200) {
      const body = await res.json();
      // Email should be masked (contains ***)
      if (body.email) {
        expect(body.email).toMatch(/\*{2,}/);
      }
    }
  });
});
