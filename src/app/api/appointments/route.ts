import { NextResponse } from "next/server";
import { DEMO_APPOINTMENTS, DEMO_SERVICES, DEMO_CUSTOMERS } from "@/lib/mock-data";
import { generateAppointmentCode } from "@/lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const date = searchParams.get("date");

  let list = DEMO_APPOINTMENTS;
  if (status) list = list.filter((a) => a.status === status);
  if (date) list = list.filter((a) => a.appointment_date === date);

  return NextResponse.json({ appointments: list, count: list.length });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer_id, staff_id, appointment_date, start_time, total_amount, promo_code, services, is_walk_in } = body;

    if (!customer_id || !appointment_date || !start_time) {
      return NextResponse.json(
        { error: "customer_id, appointment_date, and start_time are mandatory" },
        { status: 400 }
      );
    }

    // Check double-booking constraint: staff + date + start_time
    const conflict = DEMO_APPOINTMENTS.find(
      (a) =>
        a.staff_id === staff_id &&
        a.appointment_date === appointment_date &&
        a.start_time === start_time &&
        !["cancelled", "no_show"].includes(a.status)
    );

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
        const existingCust = DEMO_CUSTOMERS.find((c) => c.id === customer_id);
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
      id: `apt-${Date.now()}`,
      appointment_code,
      customer_id,
      staff_id,
      appointment_date,
      start_time,
      end_time: "15:00",
      status: "confirmed",
      total_amount: verifiedAmount,
      paid_amount: 0,
      payment_status: "pending",
      is_walk_in: Boolean(is_walk_in),
      created_at: new Date().toISOString(),
    };

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

