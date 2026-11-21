/**
 * concurrent-booking.spec.ts
 * Page 3 – The Family Salon
 *
 * Rigorous backend tests for:
 * 1. Concurrent double-booking conflict detection (HTTP 409).
 * 2. Server-side price tampering validation against catalog.
 * 3. Server-side promo code verification (FIRST20 & DEWAS10).
 * 4. Input validation on mandatory fields.
 */
import { test, expect } from '@playwright/test';

test.describe('Backend Booking Integrity & Concurrent Conflict Tests', () => {
  test('simultaneous booking requests on the same slot result in one 201 and one 409', async ({
    request,
  }) => {
    const testDate = `2024-12-${Math.floor(10 + Math.random() * 18)}`;
    const testTime = '11:30';
    const staffId = 'staff-1';

    const payloadA = {
      customer_id: 'cust-concurrent-A',
      customer_name: 'Customer A',
      customer_phone: '9876543210',
      staff_id: staffId,
      appointment_date: testDate,
      start_time: testTime,
      services: [{ service_id: 's-1' }],
      total_amount: 300,
    };

    const payloadB = {
      customer_id: 'cust-concurrent-B',
      customer_name: 'Customer B',
      customer_phone: '9123456789',
      staff_id: staffId,
      appointment_date: testDate,
      start_time: testTime,
      services: [{ service_id: 's-1' }],
      total_amount: 300,
    };

    // Fire both requests simultaneously
    const [resA, resB] = await Promise.all([
      request.post('/api/appointments', { data: payloadA }),
      request.post('/api/appointments', { data: payloadB }),
    ]);

    const statuses = [resA.status(), resB.status()].sort();
    expect(statuses).toEqual([201, 409]);

    const conflictRes = resA.status() === 409 ? resA : resB;
    const conflictBody = await conflictRes.json();
    expect(conflictBody.error).toMatch(/double-booking/i);
  });

  test('server enforces catalog price overriding tampered client-side amount', async ({
    request,
  }) => {
    // Client claims service s-1 (which costs ₹300 in catalog) only costs ₹1
    const tamperedPayload = {
      customer_id: 'cust-tamper-test',
      customer_name: 'Tamper Client',
      customer_phone: '9876500000',
      staff_id: 'staff-2',
      appointment_date: '2024-12-28',
      start_time: '16:00',
      services: [{ service_id: 's-1' }], // catalog price is ₹300
      total_amount: 1, // Tampered client price!
    };

    const res = await request.post('/api/appointments', { data: tamperedPayload });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.price_verified).toBe(true);
    // Server must have calculated 300, not 1
    expect(body.appointment.total_amount).toBe(300);
  });

  test('server applies valid DEWAS10 promo code correctly', async ({ request }) => {
    const payload = {
      customer_id: 'cust-promo-dewas',
      customer_name: 'Dewas Promo Client',
      customer_phone: '9876500001',
      staff_id: 'staff-2',
      appointment_date: '2024-12-29',
      start_time: '17:00',
      services: [{ service_id: 's-1' }], // ₹300
      promo_code: 'DEWAS10',
    };

    const res = await request.post('/api/appointments', { data: payload });
    expect(res.status()).toBe(201);
    const body = await res.json();
    // 10% off on 300 = 270
    expect(body.appointment.total_amount).toBe(270);
  });

  test('server rejects invalid promo code with HTTP 400', async ({ request }) => {
    const payload = {
      customer_id: 'cust-invalid-promo',
      customer_name: 'Invalid Promo Client',
      customer_phone: '9876500002',
      staff_id: 'staff-2',
      appointment_date: '2024-12-30',
      start_time: '18:00',
      services: [{ service_id: 's-1' }],
      promo_code: 'FAKEPROMO99',
    };

    const res = await request.post('/api/appointments', { data: payload });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/invalid.*promo/i);
  });

  test('server rejects missing mandatory booking parameters with HTTP 400', async ({
    request,
  }) => {
    const invalidPayload = {
      customer_id: '',
      appointment_date: '2024-12-30',
    };

    const res = await request.post('/api/appointments', { data: invalidPayload });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/mandatory/i);
  });
});
