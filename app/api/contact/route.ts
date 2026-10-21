import { NextResponse } from "next/server";
import { contactSuccessMessage, validateContact } from "@/lib/contact";

const MAX_BODY_BYTES = 16_384;
function reply(message: string, status: number, errors?: ReturnType<typeof validateContact>["errors"]) {
  return NextResponse.json({ success: status === 200, message, ...(errors ? { errors } : {}) }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") return reply("Please submit JSON form data.", 415);
  const origin = request.headers.get("origin");
  if ((origin && origin !== new URL(request.url).origin) || request.headers.get("sec-fetch-site") === "cross-site") return reply("This request is not allowed.", 403);

  let payload: Record<string, unknown>;
  try {
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
    } finally { reader.releaseLock(); }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    const parsed: unknown = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return reply("Please submit a valid contact form.", 400);
    payload = parsed as Record<string, unknown>;
  } catch (error) {
    return reply(error instanceof RangeError ? "The form is too large." : "Please submit a valid contact form.", error instanceof RangeError ? 413 : 400);
  }
  if (payload.companyFax) return reply("We couldn’t send your message. Please try again.", 400);
  const { values, errors } = validateContact(payload);
  if (Object.keys(errors).length) return reply("Please check the highlighted fields.", 400, errors);

  const unavailable = "The contact form is temporarily unavailable. Please try again later.";
  const webhookUrl = process.env.LEAD_WEBHOOK_URL;
  if (!webhookUrl) return reply(unavailable, 503);
  const webhookSecret = process.env.LEAD_WEBHOOK_SECRET;
  try {
    const destination = new URL(webhookUrl);
    if (destination.protocol !== "https:" || destination.username || destination.password || (webhookSecret && webhookSecret.length < 32)) return reply(unavailable, 503);
  } catch { return reply(unavailable, 503); }
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(webhookSecret ? { "X-Bavexa-Webhook-Secret": webhookSecret } : {}) },
      body: JSON.stringify({ ...values, source: "bavexa.tech", form: "contact", submittedAt: new Date().toISOString() }),
      redirect: "error",
      signal: AbortSignal.timeout(8_000),
      cache: "no-store",
    });
    if (!response.ok) throw new Error();
    return reply(contactSuccessMessage, 200);
  } catch { return reply("We couldn’t send your message right now. Please try again shortly.", 502); }
}
