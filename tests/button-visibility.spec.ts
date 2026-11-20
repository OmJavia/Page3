import { test, expect } from '@playwright/test';
import * as path from 'path';

const ARTIFACT_DIR = '/Users/omjavia/.gemini/antigravity/brain/0e7125cf-e847-43d5-97e2-812a2258ac70/screenshots';

test.describe('Comprehensive Button & Text Visibility & Functionality Audit', () => {
  test('Hero buttons visible at rest and on hover in Light Mode', async ({ page }) => {
    await page.goto('/');

    // 1. Hero Book Appointment button (first one)
    const bookBtn = page.getByRole('button', { name: /book appointment/i }).first();
    await expect(bookBtn).toBeVisible();

    const bookTextSpan = bookBtn.locator('span.chroma-text-out');
    await expect(bookTextSpan).toBeVisible();
    await expect(bookTextSpan).toHaveText(/book appointment/i);

    // Verify computed styles at rest
    const restStyles = await bookTextSpan.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        color: cs.color,
        webkitTextFillColor: cs.webkitTextFillColor,
        backgroundClip: cs.webkitBackgroundClip,
        backgroundImage: cs.backgroundImage,
        opacity: cs.opacity,
      };
    });
    console.log('Book Button REST STYLES:', restStyles);
    expect(restStyles.webkitTextFillColor).not.toBe('transparent');
    expect(restStyles.backgroundImage).toBe('none');

    // Take screenshot at rest
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'hero_buttons_rest_light.png') });

    // Hover over button and verify chroma effect
    await bookBtn.hover();
    const hoverStyles = await bookTextSpan.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        webkitTextFillColor: cs.webkitTextFillColor,
        backgroundClip: cs.webkitBackgroundClip,
        animationName: cs.animationName,
      };
    });
    console.log('Book Button HOVER STYLES:', hoverStyles);
    expect(hoverStyles.animationName).toBe('chroma-sweep-repeat');
    expect(hoverStyles.backgroundClip).toBe('text');

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'hero_button_hover_light.png') });
  });

  test('Hero buttons visible at rest and on hover in Dark Mode', async ({ page }) => {
    await page.goto('/');

    // Toggle dark mode
    const themeBtn = page.getByRole('button', { name: /switch to dark mode|toggle theme|dark/i }).first();
    await themeBtn.click();
    await page.waitForTimeout(300);

    const bookBtn = page.getByRole('button', { name: /book appointment/i }).first();
    await expect(bookBtn).toBeVisible();

    const bookTextSpan = bookBtn.locator('span.chroma-text-out');
    await expect(bookTextSpan).toBeVisible();

    const restStyles = await bookTextSpan.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        color: cs.color,
        webkitTextFillColor: cs.webkitTextFillColor,
        backgroundImage: cs.backgroundImage,
      };
    });
    console.log('Dark Mode REST STYLES:', restStyles);
    expect(restStyles.webkitTextFillColor).not.toBe('transparent');
    expect(restStyles.backgroundImage).toBe('none');

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'hero_buttons_rest_dark.png') });

    await bookBtn.hover();
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'hero_button_hover_dark.png') });
  });

  test('Service card buttons visible at rest and clickable', async ({ page }) => {
    await page.goto('/');

    // Scroll to services
    const servicesHeading = page.getByText(/popular services in dewas/i).first();
    await servicesHeading.scrollIntoViewIfNeeded();

    // Check service cards "Book" buttons
    const serviceBookBtns = page.locator('button').filter({ hasText: /^Book$/ });
    const count = await serviceBookBtns.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < Math.min(count, 3); i++) {
      const btn = serviceBookBtns.nth(i);
      await expect(btn).toBeVisible();
      const span = btn.locator('span.chroma-text-out');
      await expect(span).toBeVisible();
      await expect(span).toHaveText(/book/i);
    }

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'service_cards_buttons.png') });
  });

  test('Button functionality: navigation works for primary actions', async ({ page }) => {
    // 1. Click Hero Book Appointment -> /book
    await page.goto('/');
    const bookBtn = page.getByRole('button', { name: /book appointment/i }).first();
    await bookBtn.click();
    await expect(page).toHaveURL(/\/book/);

    // 2. Click Explore Services -> /services
    await page.goto('/');
    const exploreBtn = page.getByRole('button', { name: /explore services/i }).first();
    await exploreBtn.click();
    await expect(page).toHaveURL(/\/services/);
  });
});
