import { NextResponse } from "next/server";
import { DEMO_CUSTOMERS } from "@/lib/mock-data";
import { generateCustomerCode } from "@/lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get("phone");
  const authHeader = request.headers.get("authorization");

  if (phone) {
    const customer = DEMO_CUSTOMERS.find((c) => c.phone.includes(phone));
    if (!customer) {
      return NextResponse.json({ customer: null, found: false });
    }
    // Mask / sanitize sensitive CRM memory for public client checks
    return NextResponse.json({
      customer: {
        id: customer.id,
        full_name: customer.full_name,
        customer_category: customer.customer_category,
        loyalty_points: customer.loyalty_points,
      },
      found: true,
    });
  }

  // Bulk customer directory access requires authorization in production
  if (process.env.NODE_ENV === "production" && !authHeader) {
    return NextResponse.json(
      { error: "Unauthorized. Bulk customer directory requires admin authorization." },
      { status: 401 }
    );
  }

  return NextResponse.json({ customers: DEMO_CUSTOMERS, count: DEMO_CUSTOMERS.length });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { full_name, phone, gender, date_of_birth, email, notes, marketing_consent, notification_consent } = body;

    if (!full_name || !phone || !gender) {
      return NextResponse.json(
        { error: "full_name, phone, and gender are mandatory fields" },
        { status: 400 }
      );
    }

    // Check duplicate phone number
    const existing = DEMO_CUSTOMERS.find((c) => c.phone === phone);
    if (existing) {
      return NextResponse.json(
        { error: "A customer with this phone number already exists", customer: existing },
        { status: 409 }
      );
    }

    const customer_code = generateCustomerCode();
    const newCustomer = {
      id: `cust-${Date.now()}`,
      customer_code,
      full_name,
      phone,
      gender,
      date_of_birth: date_of_birth || null,
      email: email || null,
      notes: notes || null,
      marketing_consent: Boolean(marketing_consent),
      notification_consent: notification_consent !== false,
      first_visit_date: null,
      last_visit_date: null,
      total_visits: 0,
      total_spent: 0,
      customer_category: "new" as const,
      loyalty_points: 0,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json(
      { message: "Customer profile created successfully", customer: newCustomer },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create customer" }, { status: 500 });
  }
}

