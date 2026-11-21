import { test, expect } from '@playwright/test';
import * as path from 'path';

const ARTIFACT_DIR = '/Users/omjavia/.gemini/antigravity/brain/0e7125cf-e847-43d5-97e2-812a2258ac70/screenshots';

test.describe('Invoice Print & Services Visibility Test', () => {
  test('emulates print and verifies service item and figures', async ({ page }) => {
    await page.goto('/book');

    // Step 1: Select Service (e.g. Haircut)
    const firstCard = page.locator('.rf-card').first();
    await firstCard.click();
    const serviceTitle = await firstCard.locator('h3, h4').first().innerText();
    console.log('Selected service:', serviceTitle);

    // Step 2: Stylist
    await page.getByRole('button', { name: /stylist/i }).first().click();
    await page.getByText(/any.*stylist/i).first().click();

    // Step 3: Slot
    await page.getByRole('button', { name: /slot|date/i }).first().click();
    const slotBtn = page.getByRole('button', { name: /:\d{2}|AM|PM/i }).first();
    await slotBtn.click();

    // Step 4: Details
    await page.getByRole('button', { name: /details/i }).first().click();
    await page.locator('input[placeholder*="9876"]').fill('9111222333');
    await page.locator('input[placeholder*="Rahul"]').fill('Harish Verma');

    // Step 5: Payment
    await page.getByRole('button', { name: /payment/i }).first().click();
    await page.getByText(/pay at salon/i).first().click();
    await page.getByRole('button', { name: /confirm/i }).first().click();

    // Confirmation / Invoice
    await page.waitForSelector('#printable-invoice');

    // Emulate Print Media
    await page.emulateMedia({ media: 'print' });
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'invoice_print_light.png'), fullPage: true });

    // Check the table rows in the invoice
    const rows = await page.locator('#printable-invoice tbody tr').all();
    console.log(`Found ${rows.length} rows in invoice table in LIGHT MODE`);
    for (const r of rows) {
      const text = await r.innerText();
      const isVisible = await r.isVisible();
      const style = await r.evaluate(el => {
        const cs = window.getComputedStyle(el);
        const td = el.querySelector('td');
        const tdCs = td ? window.getComputedStyle(td) : null;
        return {
          rowColor: cs.color,
          tdColor: tdCs?.color,
          tdFill: tdCs?.webkitTextFillColor,
          display: cs.display,
          visibility: cs.visibility
        };
      });
      console.log('Row text in light print:', JSON.stringify(text), 'visible:', isVisible, style);
    }

    // Now test DARK mode print
    await page.emulateMedia({ media: 'screen' });
    // Switch to dark mode
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    await page.emulateMedia({ media: 'print' });
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'invoice_print_dark.png'), fullPage: true });

    const rowsDark = await page.locator('#printable-invoice tbody tr').all();
    console.log(`Found ${rowsDark.length} rows in invoice table in DARK MODE`);
    for (const r of rowsDark) {
      const text = await r.innerText();
      const isVisible = await r.isVisible();
      const style = await r.evaluate(el => {
        const cs = window.getComputedStyle(el);
        const td = el.querySelector('td');
        const tdCs = td ? window.getComputedStyle(td) : null;
        return {
          rowColor: cs.color,
          tdColor: tdCs?.color,
          tdFill: tdCs?.webkitTextFillColor,
          display: cs.display,
          visibility: cs.visibility
        };
      });
      console.log('Row text in dark print:', JSON.stringify(text), 'visible:', isVisible, style);
    }
  });
});
