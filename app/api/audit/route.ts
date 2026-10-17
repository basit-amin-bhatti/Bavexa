import { NextResponse } from "next/server";

const requiredFields = ["fullName", "company", "email", "phone", "monthlyLeadVolume", "challenge"] as const;
const fieldLimits = { fullName: 200, company: 200, email: 254, phone: 80, monthlyLeadVolume: 80, challenge: 200, website: 2048, crm: 200 } as const;
const MAX_BODY_BYTES = 16_384;

function reply(message: string, status = 200) {
  return NextResponse.json({ message }, { status, headers: { "Cache-Control": "no-store" } });
}

async function readBody(request: Request) {
  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES) throw new RangeError();
  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_BODY_BYTES) {
        void reader.cancel().catch(() => {});
        throw new RangeError();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const body = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(body)) as unknown;
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
  if (contentType !== "application/json") return reply("Please submit JSON form data.", 415);
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return reply("This request is not allowed.", 403);
  if (request.headers.get("sec-fetch-site") === "cross-site") return reply("This request is not allowed.", 403);

  let payload: Record<string, unknown>;
  try {
    const value = await readBody(request);
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return reply("Please submit a valid form.", 400);
    }
    payload = value as Record<string, unknown>;
  } catch (error) {
    return reply(error instanceof RangeError ? "The form is too large." : "Please submit a valid form.", error instanceof RangeError ? 413 : 400);
  }

  if (payload.companyFax) return reply("Thanks.");
  const missing = requiredFields.some((field) => typeof payload[field] !== "string" || !String(payload[field]).trim());
  if (missing) return reply("Please complete all required fields.", 400);

  const lead: Record<string, string> = {};
  for (const [field, limit] of Object.entries(fieldLimits)) {
    const value = payload[field];
    if (value === undefined) continue;
    if (typeof value !== "string" || value.length > limit || Array.from(value).some(character => character.charCodeAt(0) < 32 && !["\t", "\n", "\r"].includes(character))) {
      return reply("Please check the form fields and try again.", 400);
    }
    lead[field] = value.trim();
  }

  const email = lead.email;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return reply("Please enter a valid business email.", 400);
  }
  if (lead.website) {
    try {
      const website = new URL(lead.website);
      if (!["http:", "https:"].includes(website.protocol) || website.username || website.password) throw new Error();
    } catch { return reply("Please enter a valid website URL.", 400); }
  }

  const webhookUrl = process.env.LEAD_WEBHOOK_URL;
  if (!webhookUrl) {
    return reply("The audit form is temporarily unavailable. Please try again later.", 503);
  }

  try {
    const destination = new URL(webhookUrl);
    if (destination.protocol !== "https:" || destination.username || destination.password) return reply("The audit form is temporarily unavailable. Please try again later.", 503);
    const webhookSecret = process.env.LEAD_WEBHOOK_SECRET;
    if (webhookSecret && webhookSecret.length < 32) return reply("The audit form is temporarily unavailable. Please try again later.", 503);
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(webhookSecret ? { "X-Bavexa-Webhook-Secret": webhookSecret } : {}) },
      body: JSON.stringify({ ...lead, source: "bavexa.tech", submittedAt: new Date().toISOString() }),
      redirect: "error",
      signal: AbortSignal.timeout(8_000),
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Webhook responded with ${response.status}`);
    return reply("We’ll review your lead-conversion process and be in touch with the next step.");
  } catch {
    return reply("We couldn’t send your request right now. Please try again shortly.", 502);
  }
}
