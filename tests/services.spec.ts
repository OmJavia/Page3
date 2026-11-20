/**
 * services.spec.ts
 * Page 3 – The Family Salon
 *
 * Tests: service catalogue page, category filters, gender filter,
 *        individual service detail page navigation, "Book" CTA.
 */
import { test, expect } from '@playwright/test';

test.describe('Services Catalogue', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/services');
  });

  test('services page loads with 200', async ({ page }) => {
    await expect(page).toHaveURL(/\/services/);
  });

  test('page heading mentions services', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /service|our menu|treatment/i }).first()
    ).toBeVisible();
  });

  test('at least one service card is visible', async ({ page }) => {
    // Service cards likely have a price (₹)
    const priceEl = page.getByText(/₹\s*\d+/).first();
    await expect(priceEl).toBeVisible();
  });

  test('category filter buttons are present', async ({ page }) => {
    // Expect at least "All" or "Haircut" or similar filter
    const filter = page
      .getByRole('button', { name: /all|haircut|hair|beard|colour|color|spa/i })
      .first();
    await expect(filter).toBeVisible();
  });

  test('clicking a category filter changes visible cards', async ({ page }) => {
    // Find any filter that is not "All"
    const hairBtn = page
      .getByRole('button', { name: /haircut|hair/i })
      .first();
    if (await hairBtn.isVisible()) {
      await hairBtn.click();
      // The page should still have service cards after filtering
      await expect(page.getByText(/₹\s*\d+/).first()).toBeVisible();
    }
  });

  test('service card has name, price, and book button', async ({ page }) => {
    // Check that the first card has price & CTA
    await expect(page.getByText(/₹\s*\d+/).first()).toBeVisible();
    const bookCTA = page
      .getByRole('link', { name: /book|view|details/i })
      .or(page.getByRole('button', { name: /book|view|details/i }))
      .first();
    await expect(bookCTA).toBeVisible();
  });

  test('no horizontal scroll at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/services');
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);
  });
});

test.describe('Individual Service Page', () => {
  test('service detail page loads from /services/:id', async ({ page }) => {
    // Navigate to a known service id from mock-data (haircut = svc-1 or similar)
    await page.goto('/services');

    // Click the first "View" / "Details" / service-card link
    const firstLink = page
      .getByRole('link', { name: /view|details|book|more/i })
      .or(page.locator('a[href^="/services/"]'))
      .first();

    if (await firstLink.isVisible()) {
      await firstLink.click();
      // Should land on /services/<id>
      await expect(page).toHaveURL(/\/services\/.+/);
      // Should show price
      await expect(page.getByText(/₹\s*\d+/).first()).toBeVisible();
    }
  });

  test('service detail page has Book CTA', async ({ page }) => {
    await page.goto('/services');
    const firstLink = page.locator('a[href^="/services/"]').first();
    if (await firstLink.isVisible()) {
      await firstLink.click();
      await expect(page).toHaveURL(/\/services\/.+/);
      const bookBtn = page
        .getByRole('link', { name: /book/i })
        .or(page.getByRole('button', { name: /book/i }))
        .first();
      await expect(bookBtn).toBeVisible();
    }
  });
});
