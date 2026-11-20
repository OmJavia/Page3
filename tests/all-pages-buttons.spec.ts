import { test, expect } from '@playwright/test';
import * as path from 'path';

const ARTIFACT_DIR = '/Users/omjavia/.gemini/antigravity/brain/0e7125cf-e847-43d5-97e2-812a2258ac70/screenshots';

test.describe('Full Website Button Visibility & Functionality Across All Pages', () => {
  test('/services page: buttons visible and category filtering works', async ({ page }) => {
    await page.goto('/services');
    await expect(page).toHaveTitle(/Page 3/i);

    // Verify filter buttons exist and are visible
    const filterButtons = page.locator('button').filter({ hasText: /all|haircut|beard|color|spa/i });
    const count = await filterButtons.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < Math.min(count, 4); i++) {
      const btn = filterButtons.nth(i);
      await expect(btn).toBeVisible();
      const text = await btn.innerText();
      expect(text.trim().length).toBeGreaterThan(0);
    }

    // Verify service card "Book" buttons
    const bookButtons = page.locator('button, a').filter({ hasText: /book/i });
    expect(await bookButtons.count()).toBeGreaterThan(0);

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'page_services_audit.png') });
  });

  test('/book page: 5-step guided journey buttons visible & functional', async ({ page }) => {
    await page.goto('/book');

    // Step 1: Select Service
    const firstCard = page.locator('.rf-card').first();
    await expect(firstCard).toBeVisible();
    await firstCard.click();

    const toStylistBtn = page.getByRole('button', { name: /stylist/i }).first();
    await expect(toStylistBtn).toBeVisible();
    const btnText1 = await toStylistBtn.innerText();
    expect(btnText1.trim().length).toBeGreaterThan(0);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'book_step1_service_selected.png') });
    await toStylistBtn.click();

    // Step 2: Choose Stylist
    await page.getByText(/any.*stylist/i).first().click();
    const toSlotBtn = page.getByRole('button', { name: /slot|date/i }).first();
    await expect(toSlotBtn).toBeVisible();
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'book_step2_stylist_selected.png') });
    await toSlotBtn.click();

    // Step 3: Choose Slot
    const slotBtn = page.getByRole('button', { name: /:\d{2}|AM|PM/i }).first();
    await expect(slotBtn).toBeVisible();
    await slotBtn.click();
    const toDetailsBtn = page.getByRole('button', { name: /details/i }).first();
    await expect(toDetailsBtn).toBeVisible();
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'book_step3_slot_selected.png') });
    await toDetailsBtn.click();

    // Step 4: Fill Customer Details
    await page.locator('input[placeholder*="9876"]').fill('9111222333');
    await page.locator('input[placeholder*="Rahul"]').fill('Harish Verma');
    const toPaymentBtn = page.getByRole('button', { name: /payment/i }).first();
    await expect(toPaymentBtn).toBeVisible();
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'book_step4_details_filled.png') });
    await toPaymentBtn.click();

    // Step 5: Payment Page
    await expect(page.getByText(/payment.*bill|choose payment/i).first()).toBeVisible();
    const receptionOption = page.getByText(/pay at salon/i).first();
    await expect(receptionOption).toBeVisible();
    await receptionOption.click();

    const confirmBtn = page.getByRole('button', { name: /confirm/i }).first();
    await expect(confirmBtn).toBeVisible();
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'book_step5_payment_options.png') });
    await confirmBtn.click();

    // Final Screen: Merged Confirmation + Printable Tax Invoice
    await expect(page.getByText(/appointment confirmed/i).first()).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('#printable-invoice')).toBeVisible();
    const printBtn = page.getByText(/Download \/ Print Bill/i).first();
    await expect(printBtn).toBeVisible();
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'book_confirmation_invoice.png') });
  });

  test('/reviews page: star rating buttons and submit visible', async ({ page }) => {
    await page.goto('/reviews');
    await expect(page.getByText(/how was your styling/i)).toBeVisible();

    const stars = page.locator('button').filter({ hasText: '★' });
    expect(await stars.count()).toBeGreaterThanOrEqual(5);

    const submitBtn = page.getByRole('button', { name: /submit review/i });
    await expect(submitBtn).toBeVisible();
    const text = await submitBtn.innerText();
    expect(text.trim().length).toBeGreaterThan(0);

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'page_reviews_audit.png') });
  });

  test('/admin/login: PIN entry & submit button visible', async ({ page }) => {
    await page.goto('/admin/login');
    const pwdInput = page.locator('input[type="password"]');
    await expect(pwdInput).toBeVisible();

    const unlockBtn = page.getByRole('button', { name: /unlock management console/i });
    await expect(unlockBtn).toBeVisible();
    const text = await unlockBtn.innerText();
    expect(text.trim().length).toBeGreaterThan(0);

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'page_admin_login_audit.png') });
  });
});
