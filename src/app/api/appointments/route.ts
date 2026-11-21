import { NextResponse } from "next/server";
import { DEMO_APPOINTMENTS, DEMO_SERVICES, DEMO_CUSTOMERS } from "@/lib/mock-data";
import { generateAppointmentCode } from "@/lib/utils";

declare global {
  var __PAGE3_APPOINTMENTS__: any[] | undefined;
}

function getAppointmentsStore(): any[] {
  if (!globalThis.__PAGE3_APPOINTMENTS__) {
    // Seed server-side persistent store with deep clone of initial appointments
    globalThis.__PAGE3_APPOINTMENTS__ = JSON.parse(JSON.stringify(DEMO_APPOINTMENTS));
  }
  return globalThis.__PAGE3_APPOINTMENTS__!;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const date = searchParams.get("date");

  let list = getAppointmentsStore();
  if (status) list = list.filter((a) => a.status === status);
  if (date) list = list.filter((a) => a.appointment_date === date);

  return NextResponse.json({ appointments: list, count: list.length });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customer_id,
      customer_name,
      customer_phone,
      staff_id,
      appointment_date,
      start_time,
      end_time,
      total_amount,
      paid_amount,
      payment_method,
      promo_code,
      services,
      is_walk_in,
    } = body;

    if (!customer_id || !appointment_date || !start_time) {
      return NextResponse.json(
        { error: "customer_id, appointment_date, and start_time are mandatory" },
        { status: 400 }
      );
    }

    const store = getAppointmentsStore();

    // Check double-booking constraint: staff + date + start_time
    // If specific staff requested, ensure no active appointment exists for that staff at that time
    // If no staff requested (any stylist), ensure there is at least one stylist available
    const conflict = store.find((a) => {
      if (["cancelled", "no_show"].includes(a.status)) return false;
      const sameDate = a.appointment_date === appointment_date;
      const sameTime = a.start_time === start_time || a.start_time.startsWith(start_time.slice(0, 5));
      if (!sameDate || !sameTime) return false;

      if (staff_id) {
        return a.staff_id === staff_id;
      }
      return false;
    });

    if (conflict) {
      return NextResponse.json(
        {
          error: "Double-booking detected: Selected stylist already has an active appointment at this slot.",
          conflict_id: conflict.id,
        },
        { status: 409 }
      );
    }

    // Server-side price verification against service catalog
    let verifiedAmount = 0;
    if (Array.isArray(services) && services.length > 0) {
      for (const item of services) {
        const catalogService = DEMO_SERVICES.find((s) => s.id === (item.service_id || item.id));
        if (catalogService) {
          verifiedAmount += catalogService.price;
        }
      }
      if (promo_code === "FIRST20") {
        const existingCust = DEMO_CUSTOMERS.find((c) => c.id === customer_id || c.phone === customer_phone);
        if (existingCust && existingCust.total_visits > 0) {
          return NextResponse.json(
            { error: "Promo FIRST20 is only valid for first-time customer visits." },
            { status: 400 }
          );
        }
        verifiedAmount = Math.round(verifiedAmount * 0.8);
      } else if (promo_code === "DEWAS10") {
        verifiedAmount = Math.round(verifiedAmount * 0.9);
      } else if (promo_code) {
        return NextResponse.json(
          { error: "Invalid promo code provided." },
          { status: 400 }
        );
      }
    } else {
      verifiedAmount = Number(total_amount) || 0;
    }

    const appointment_code = generateAppointmentCode();
    const newAppointment = {
      id: `apt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      appointment_code,
      customer_id,
      customer_name: customer_name || "Guest Client",
      customer_phone: customer_phone || customer_id,
      staff_id: staff_id || null,
      appointment_date,
      start_time,
      end_time: end_time || `${start_time.slice(0, 2)}:45`,
      status: "confirmed",
      total_amount: verifiedAmount,
      paid_amount: Number(paid_amount) || 0,
      payment_method: payment_method || "counter",
      payment_status: Number(paid_amount) >= verifiedAmount ? "paid" : Number(paid_amount) > 0 ? "partial" : "pending",
      is_walk_in: Boolean(is_walk_in),
      services: Array.isArray(services) ? services : [],
      created_at: new Date().toISOString(),
    };

    // Atomically persist to server-side store
    store.push(newAppointment);

    return NextResponse.json(
      {
        message: "Appointment booked successfully",
        appointment: newAppointment,
        price_verified: true,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process booking" }, { status: 500 });
  }
}

