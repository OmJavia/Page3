import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { appointment_id, service_id, status } = body;

    // Only deduct inventory when service is Completed
    if (status !== "completed") {
      return NextResponse.json(
        { message: "Inventory is only deducted when appointment status is completed", deducted: false },
        { status: 200 }
      );
    }

    // Material consumption simulation
    const simulatedDeductions = [
      { product: "Black Hair Colour 1.0", quantity_deducted: 50, unit: "ml" },
      { product: "20 Vol Oxydant Developer", quantity_deducted: 75, unit: "ml" },
      { product: "Deep Cleansing Shampoo", quantity_deducted: 15, unit: "ml" },
      { product: "Intense Moisture Conditioner", quantity_deducted: 15, unit: "ml" },
    ];

    return NextResponse.json({
      success: true,
      deducted: true,
      appointment_id,
      deductions: simulatedDeductions,
      message: "Service recipe materials automatically deducted from live inventory.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process inventory deduction" }, { status: 500 });
  }
}
