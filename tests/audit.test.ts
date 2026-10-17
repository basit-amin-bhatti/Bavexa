import assert from "node:assert/strict";
import test from "node:test";
import { POST } from "../app/api/audit/route";
import type { TestContext } from "node:test";

function request(body: string) {
  return new Request("http://localhost/api/audit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
}

test("audit rejects malformed JSON and non-object payloads without throwing", async () => {
  for (const body of ["{", "null", "[]", '"text"', "42", "true"]) {
    assert.equal((await POST(request(body))).status, 400);
  }
});

const validLead = { fullName: " Test Visitor ", company: "Example Roofing", email: "visitor@example.com", phone: "2025550142", monthlyLeadVolume: "1-25", challenge: "Follow-up" };

function configureMockWebhook(t: TestContext) {
  const previousUrl = process.env.LEAD_WEBHOOK_URL;
  const previousSecret = process.env.LEAD_WEBHOOK_SECRET;
  t.after(() => {
    if (previousUrl === undefined) delete process.env.LEAD_WEBHOOK_URL; else process.env.LEAD_WEBHOOK_URL = previousUrl;
    if (previousSecret === undefined) delete process.env.LEAD_WEBHOOK_SECRET; else process.env.LEAD_WEBHOOK_SECRET = previousSecret;
  });
  const send = t.mock.method(globalThis, "fetch", async () => new Response(null, { status: 200 }));
  process.env.LEAD_WEBHOOK_URL = "https://webhook.example.test/receiver";
  delete process.env.LEAD_WEBHOOK_SECRET;
  return send;
}

test("audit enforces origin, JSON content type, streamed size, and field limits", async (t) => {
  const send = configureMockWebhook(t);
  const body = JSON.stringify(validLead);
  assert.equal((await POST(new Request("https://bavexa.tech/api/audit", { method: "POST", headers: { "Content-Type": "application/json", Origin: "https://attacker.example" }, body }))).status, 403);
  assert.equal((await POST(new Request("https://bavexa.tech/api/audit", { method: "POST", headers: { "Content-Type": "text/plain" }, body }))).status, 415);
  assert.equal((await POST(request(JSON.stringify({ ...validLead, company: "x".repeat(201) })))).status, 400);
  assert.equal((await POST(request(JSON.stringify({ ...validLead, extra: "x".repeat(17_000) })))).status, 413);
  assert.equal((await POST(request(JSON.stringify({ ...validLead, website: "javascript:alert(1)" })))).status, 400);
  assert.equal(send.mock.callCount(), 0);
});

test("audit forwards only allowed fields and server metadata with timeout and no redirects", async (t) => {
  const send = configureMockWebhook(t);
  process.env.LEAD_WEBHOOK_SECRET = "a".repeat(40);
  const response = await POST(request(JSON.stringify({ ...validLead, email: " visitor@example.com ", admin: true, webhookUrl: "https://attacker.example", source: "untrusted", submittedAt: "untrusted" })));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  const [, options] = send.mock.calls[0].arguments as unknown as [string, RequestInit];
  const forwarded = JSON.parse(String(options.body));
  assert.equal(forwarded.fullName, "Test Visitor");
  assert.equal(forwarded.email, "visitor@example.com");
  assert.equal(forwarded.source, "bavexa.tech");
  assert.notEqual(forwarded.submittedAt, "untrusted");
  assert.equal(forwarded.admin, undefined);
  assert.equal(forwarded.webhookUrl, undefined);
  assert.equal(options.redirect, "error");
  assert.ok(options.signal instanceof AbortSignal);
  assert.equal(new Headers(options.headers).get("X-Bavexa-Webhook-Secret"), "a".repeat(40));
});

test("audit fails closed for missing/unsafe config and keeps provider errors private", async (t) => {
  const send = configureMockWebhook(t);
  for (const destination of ["", "http://internal.example", "https://user:password@example.test"]) {
    process.env.LEAD_WEBHOOK_URL = destination;
    const response = await POST(request(JSON.stringify(validLead)));
    assert.equal(response.status, 503);
    assert.doesNotMatch(JSON.stringify(await response.json()), /LEAD_WEBHOOK|password|internal/);
  }
  assert.equal(send.mock.callCount(), 0);
  process.env.LEAD_WEBHOOK_URL = "https://webhook.example.test/receiver";
  send.mock.mockImplementation(async () => { throw new Error("private provider credential"); });
  const failed = await POST(request(JSON.stringify(validLead)));
  assert.equal(failed.status, 502);
  assert.doesNotMatch(JSON.stringify(await failed.json()), /private provider/);
});

test("audit rejects missing required fields and invalid email", async () => {
  assert.equal((await POST(request("{}"))).status, 400);
  const response = await POST(request(JSON.stringify({
    fullName: "Test Visitor",
    company: "Example Roofing",
    email: "not-an-email",
    phone: "2025550142",
    monthlyLeadVolume: "1-25",
    challenge: "Follow-up",
  })));
  assert.equal(response.status, 400);
  assert.match((await response.json()).message, /email/);
});
