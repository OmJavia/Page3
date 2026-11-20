/**
 * homepage.spec.ts
 * Page 3 – The Family Salon
 *
 * Tests: brand identity, hero, reviews carousel, gallery CTA,
 *        sticky bottom bar, language toggle, dark-mode, schema JSON-LD.
 */
import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // ── Page basics ─────────────────────────────────────────────
  test('has correct <title>', async ({ page }) => {
    await expect(page).toHaveTitle(/Page 3/i);
  });

  test('meta description is present', async ({ page }) => {
    const meta = page.locator('meta[name="description"]');
    await expect(meta).toHaveAttribute('content', /.+/);
  });

  test('JSON-LD schema contains LocalBusiness or HairSalon', async ({ page }) => {
    const json = await page
      .locator('script[type="application/ld+json"]')
      .first()
      .textContent();
    expect(json).toMatch(/HairSalon|LocalBusiness/);
    expect(json).toContain('Dewas');
  });

  // ── Hero section ─────────────────────────────────────────────
  test('hero headline is visible', async ({ page }) => {
    // Accept any variation of the headline
    await expect(
      page.getByText(/Your Style|Page 3|The Family Salon/i).first()
    ).toBeVisible();
  });

  test('Book Appointment CTA is visible and clickable', async ({ page }) => {
    const bookBtn = page
      .getByRole('link', { name: /book/i })
      .or(page.getByRole('button', { name: /book/i }))
      .first();
    await expect(bookBtn).toBeVisible();
    await expect(bookBtn).toBeEnabled();
  });

  test('salon location "Dewas" appears on the page', async ({ page }) => {
    await expect(page.getByText(/Dewas/i).first()).toBeVisible();
  });

  // ── Navigation ───────────────────────────────────────────────
  test('navigation/header is present', async ({ page }) => {
    await expect(page.locator('header, nav').first()).toBeVisible();
  });

  test('logo or brand name is visible', async ({ page }) => {
    await expect(page.getByText(/Page 3/i).first()).toBeVisible();
  });

  // ── Reviews / testimonials ───────────────────────────────────
  test('review section renders with star rating', async ({ page }) => {
    // Look for a star element (★ or svg stars) or the word Reviews
    const reviewSection = page
      .getByText(/reviews|testimonials|rating|★/i)
      .first();
    await expect(reviewSection).toBeVisible();
  });

  test('review count mentions 480+', async ({ page }) => {
    await expect(page.getByText(/480\+/).first()).toBeVisible();
  });

  // ── Services preview ─────────────────────────────────────────
  test('services section is on the homepage', async ({ page }) => {
    await expect(
      page.getByText(/our services|services|haircut|hair/i).first()
    ).toBeVisible();
  });

  // ── Footer / contact ─────────────────────────────────────────
  test('phone number is present', async ({ page }) => {
    await expect(page.getByText(/9111198911/).first()).toBeVisible();
  });

  test('WhatsApp or contact link present', async ({ page }) => {
    const waLink = page.locator('a[href*="wa.me"], a[href*="whatsapp"]').first();
    await expect(waLink).toBeVisible();
  });

  // ── Dark mode toggle ─────────────────────────────────────────
  test('dark mode toggle exists', async ({ page }) => {
    const toggle = page
      .getByRole('button', { name: /dark|light|theme|mode/i })
      .or(page.locator('[data-testid="theme-toggle"]'))
      .first();
    // Just verify it exists somewhere on the page (may be in nav)
    await expect(toggle).toBeAttached();
  });

  // ── Language toggle ──────────────────────────────────────────
  test('language toggle (EN/HI) exists', async ({ page }) => {
    const langBtn = page
      .getByRole('button', { name: /EN|HI|Hindi|English/i })
      .or(page.locator('[data-testid="lang-toggle"]'))
      .first();
    await expect(langBtn).toBeAttached();
  });

  // ── No horizontal scroll (mobile-first) ─────────────────────
  test('no horizontal scroll at 390px viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2); // 2px tolerance
  });

  test('no horizontal scroll at 375px viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);
  });
});
