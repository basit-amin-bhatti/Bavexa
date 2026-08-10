import { NextResponse } from "next/server";

const requiredFields = ["fullName", "company", "email", "phone", "monthlyLeadVolume", "challenge"] as const;

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json() as Record<string, unknown>;
  } catch {
    return NextResponse.json({ message: "Please submit a valid form." }, { status: 400 });
  }

  if (payload.companyFax) return NextResponse.json({ message: "Thanks." });
  const missing = requiredFields.some((field) => typeof payload[field] !== "string" || !String(payload[field]).trim());
  if (missing) return NextResponse.json({ message: "Please complete all required fields." }, { status: 400 });

  const email = String(payload.email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ message: "Please enter a valid business email." }, { status: 400 });
  }

  const webhookUrl = process.env.LEAD_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ message: "The audit form is not connected yet. Please add LEAD_WEBHOOK_URL before accepting submissions." }, { status: 503 });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, source: "bavexa.tech", submittedAt: new Date().toISOString() }),
    });
    if (!response.ok) throw new Error(`Webhook responded with ${response.status}`);
    return NextResponse.json({ message: "We’ll review your lead-conversion process and be in touch with the next step." });
  } catch {
    return NextResponse.json({ message: "We couldn’t send your request right now. Please try again shortly." }, { status: 502 });
  }
}
