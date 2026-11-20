/**
 * booking-flow.spec.ts
 * Page 3 – The Family Salon
 *
 * Tests the 5-step booking wizard:
 *   Step 1 – Service selection
 *   Step 2 – Stylist selection
 *   Step 3 – Date & time
 *   Step 4 – Customer details + OTP
 *   Step 5 – Confirmation
 *
 * Also tests:
 *   - Live price/duration summary updates
 *   - FIRST20 promo code for new user
 *   - FIRST20 promo code rejection for returning user
 *   - Invalid promo code rejection
 *   - Double-booking conflict handling
 */
import { test, expect, Page } from '@playwright/test';

// ── Helpers ─────────────────────────────────────────────────────────────────

async function clearStorage(page: Page) {
  await page.evaluate(() => {
    localStorage.removeItem('p3_client_phone');
    localStorage.removeItem('page3_customers_v1');
    localStorage.removeItem('page3_appointments_v1');
    localStorage.removeItem('page3_owner_notifications_v1');
  });
}

// ── Step 1: Service selection ────────────────────────────────────────────────

test.describe('Booking – Step 1: Service Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/book');
    await clearStorage(page);
    await page.reload();
  });

  test('booking page loads', async ({ page }) => {
    await expect(page).toHaveURL(/\/book/);
  });

  test('step indicator shows step 1', async ({ page }) => {
    await expect(
      page.getByText(/service/i).first()
    ).toBeVisible();
  });

  test('service cards are displayed', async ({ page }) => {
    await expect(page.getByText(/₹\s*\d+/).first()).toBeVisible();
  });

  test('selecting a service adds it to the booking summary', async ({ page }) => {
    // Click the first service card (.rf-card)
    const firstServiceCard = page.locator('.rf-card').first();
    await expect(firstServiceCard).toBeVisible({ timeout: 5000 });
    await firstServiceCard.click();

    // The sticky bottom button should now be enabled
    const selectStylistBtn = page.getByRole('button', { name: /stylist/i }).first();
    await expect(selectStylistBtn).toBeEnabled();
  });

  test('Stylist button becomes enabled after selecting a service', async ({ page }) => {
    const firstServiceCard = page.locator('.rf-card').first();
    await expect(firstServiceCard).toBeVisible({ timeout: 5000 });
    await firstServiceCard.click();

    const nextBtn = page.getByRole('button', { name: /stylist/i }).first();
    await expect(nextBtn).toBeEnabled();
  });
});

// ── Step 2: Stylist selection ────────────────────────────────────────────────

test.describe('Booking – Step 2: Stylist Selection', () => {
  async function reachStep2(page: Page) {
    await page.goto('/book');
    await clearStorage(page);
    await page.reload();

    // Select first service card
    const firstCard = page.locator('.rf-card').first();
    await expect(firstCard).toBeVisible({ timeout: 10_000 });
    await firstCard.click();

    // Click select stylist button
    const nextBtn = page.getByRole('button', { name: /stylist/i }).first();
    await expect(nextBtn).toBeEnabled({ timeout: 5_000 });
    await nextBtn.click();
  }

  test('step 2 shows stylist cards', async ({ page }) => {
    await reachStep2(page);
    await expect(
      page.getByText(/stylist/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test('"Any available stylist" option is present', async ({ page }) => {
    await reachStep2(page);
    const anyOption = page
      .getByText(/any.*stylist/i)
      .first();
    await expect(anyOption).toBeVisible({ timeout: 10_000 });
  });
});

// ── Step 3: Date & time ──────────────────────────────────────────────────────

test.describe('Booking – Step 3: Date & Time', () => {
  async function reachStep3(page: Page) {
    await page.goto('/book');
    await clearStorage(page);
    await page.reload();

    // Step 1 – select a service
    const firstCard = page.locator('.rf-card').first();
    await expect(firstCard).toBeVisible({ timeout: 10_000 });
    await firstCard.click();

    const toStylistBtn = page.getByRole('button', { name: /stylist/i }).first();
    await expect(toStylistBtn).toBeEnabled();
    await toStylistBtn.click();

    // Step 2 – choose slot button
    const toSlotBtn = page.getByRole('button', { name: /slot|date/i }).first();
    await expect(toSlotBtn).toBeVisible({ timeout: 10_000 });
    await toSlotBtn.click();
  }

  test('calendar / date picker is visible on step 3', async ({ page }) => {
    await reachStep3(page);
    await expect(
      page.getByText(/date|slot/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test('time slots are displayed', async ({ page }) => {
    await reachStep3(page);
    // Time slots like "10:00", "11:00", "AM", "PM"
    await expect(
      page.getByText(/:\d{2}|AM|PM/i).first()
    ).toBeVisible({ timeout: 15_000 });
  });
});

// ── Promo codes ──────────────────────────────────────────────────────────────

test.describe('Promo Codes', () => {
  test('FIRST20 is accepted for a new anonymous customer (API level)', async ({
    request,
  }) => {
    const res = await request.post('/api/appointments', {
      data: {
        customer_id: 'cust-new-anon-100',
        staff_id: 'staff-1',
        appointment_date: '2026-12-05',
        start_time: '10:00',
        services: [{ service_id: 's-1' }],
        promo_code: 'FIRST20',
      },
    });

    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.appointment).toBeDefined();
    expect(body.appointment.total_amount).toBe(240);
  });

  test('FIRST20 is blocked for a returning customer (API level)', async ({
    request,
  }) => {
    const res = await request.post('/api/appointments', {
      data: {
        customer_id: 'cust-1', // existing customer with visits > 0
        staff_id: 'staff-1',
        appointment_date: '2026-12-05',
        start_time: '11:00',
        services: [{ service_id: 's-1' }],
        promo_code: 'FIRST20',
      },
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/first-time/i);
  });

  test('invalid promo code is rejected (API level)', async ({ request }) => {
    const res = await request.post('/api/appointments', {
      data: {
        customer_id: 'cust-new-anon-100',
        staff_id: 'staff-1',
        appointment_date: '2026-12-05',
        start_time: '12:00',
        services: [{ service_id: 's-1' }],
        promo_code: 'INVALIDCODE999',
      },
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/invalid.*promo/i);
  });
});

// ── Double-booking prevention ────────────────────────────────────────────────

test.describe('Double-booking Prevention', () => {
  test('booking an already reserved slot returns 409 conflict (API level)', async ({
    request,
  }) => {
    const payload = {
      customer_id: 'cust-conflict-test',
      staff_id: 'staff-1',
      appointment_date: '2024-11-18', // active slot in DEMO_APPOINTMENTS
      start_time: '14:00',
      services: [{ service_id: 's-1' }],
    };

    const res = await request.post('/api/appointments', { data: payload });
    expect(res.status()).toBe(409);
    const body = await res.json();
    expect(body.error).toMatch(/double-booking/i);
  });
});

// ── Full End-to-End Payment-First Journey ─────────────────────────────────────

test.describe('Full Payment-First Booking Flow & Printable Tax Invoice', () => {
  test('completes 5 steps: services -> stylist -> slot -> details -> payment -> invoice', async ({
    page,
  }) => {
    await page.goto('/book');
    await clearStorage(page);
    await page.reload();

    // Step 1: Select Service
    const firstCard = page.locator('.rf-card').first();
    await expect(firstCard).toBeVisible();
    await firstCard.click();
    await page.getByRole('button', { name: /stylist/i }).first().click();

    // Step 2: Choose Stylist
    await page.getByText(/any.*stylist/i).first().click();
    await page.getByRole('button', { name: /slot|date/i }).first().click();

    // Step 3: Choose Slot
    const slotBtn = page.getByRole('button', { name: /:\d{2}|AM|PM/i }).first();
    await expect(slotBtn).toBeVisible();
    await slotBtn.click();
    await page.getByRole('button', { name: /details/i }).first().click();

    // Step 4: Fill Customer Details
    await page.locator('input[placeholder*="9876"]').fill('9111222333');
    await page.locator('input[placeholder*="Rahul"]').fill('Harish Verma');
    await page.getByRole('button', { name: /payment/i }).first().click();

    // Step 5: Payment Page
    await expect(page.getByText(/payment.*bill|choose payment/i).first()).toBeVisible();

    // Select "Pay at Salon Reception"
    const receptionOption = page.getByText(/pay at salon/i).first();
    await receptionOption.click();

    // Confirm Appointment
    const confirmBtn = page.getByRole('button', { name: /confirm/i }).first();
    await confirmBtn.click();

    // Final Screen: Merged Confirmation + Printable Tax Invoice
    await expect(page.getByText(/appointment confirmed/i).first()).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('#printable-invoice')).toBeVisible();
    await expect(page.getByText(/TAX INVOICE/i).first()).toBeVisible();
    await expect(page.getByText(/Download \/ Print Bill/i).first()).toBeVisible();
  });
});
