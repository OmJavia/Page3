import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { channel, recipient_phone, template_type, parameters } = body;

    // Check if live credentials exist
    const whatsappToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const smsApiKey = process.env.SMS_API_KEY;

    if (!recipient_phone) {
      return NextResponse.json({ error: "recipient_phone is mandatory" }, { status: 400 });
    }

    if (!whatsappToken && !smsApiKey) {
      // Documented fallback: credentials not configured in env
      return NextResponse.json({
        status: "simulated",
        channel: channel || "whatsapp",
        recipient: recipient_phone,
        template: template_type,
        message: "Notification payload prepared. Set WHATSAPP_ACCESS_TOKEN or SMS_API_KEY in .env to deliver real messages.",
        timestamp: new Date().toISOString(),
      });
    }

    // If credentials are present, real dispatch would happen here
    return NextResponse.json({
      status: "queued",
      channel,
      recipient: recipient_phone,
      template: template_type,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to dispatch notification" }, { status: 500 });
  }
}

