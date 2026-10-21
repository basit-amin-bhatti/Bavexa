import assert from "node:assert/strict";
import test, { type TestContext } from "node:test";
import { readFileSync } from "node:fs";
import { POST } from "../app/api/contact/route";
import { contactFields, contactSuccessMessage, validateContact } from "../lib/contact";

const lead = { fullName: " Test Visitor ", email: " visitor@example.com ", company: "Example Roofing", message: " We run a roofing company.\nWe need help with missed calls. " };
function request(payload: unknown, headers: Record<string, string> = {}) {
  return new Request("https://bavexa.tech/api/contact", { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(payload) });
}
function setup(t: TestContext) {
  const url = process.env.LEAD_WEBHOOK_URL;
  const secret = process.env.LEAD_WEBHOOK_SECRET;
  t.after(() => {
    if (url === undefined) delete process.env.LEAD_WEBHOOK_URL; else process.env.LEAD_WEBHOOK_URL = url;
    if (secret === undefined) delete process.env.LEAD_WEBHOOK_SECRET; else process.env.LEAD_WEBHOOK_SECRET = secret;
  });
  process.env.LEAD_WEBHOOK_URL = "https://webhook.example.test/contact";
  delete process.env.LEAD_WEBHOOK_SECRET;
  return t.mock.method(globalThis, "fetch", async () => new Response(null, { status: 200 }));
}

test("contact preserves the three required contact fields and optional phone, with a required message", () => {
  assert.deepEqual(contactFields.filter((field) => field.required).map((field) => field.name), ["fullName", "email", "company", "message"]);
  assert.deepEqual(contactFields.filter((field) => !field.required).map((field) => field.name), ["phone"]);
  assert.deepEqual(validateContact(lead).errors, {});
  assert.deepEqual(validateContact({ ...lead, company: "roofing.example.com", phone: "" }).errors, {});
  assert.deepEqual(validateContact({ ...lead, phone: "+1 (202) 555-0142" }).errors, {});
});

test("contact validates whitespace, email, field types, lengths and control characters", () => {
  for (const field of ["fullName", "email", "company"] as const) assert.ok(validateContact({ ...lead, [field]: " " }).errors[field]);
  assert.ok(validateContact({ ...lead, email: "not-an-email" }).errors.email);
  assert.ok(validateContact({ ...lead, phone: 123 }).errors.phone);
  assert.ok(validateContact({ ...lead, company: "x".repeat(201) }).errors.company);
  assert.ok(validateContact({ ...lead, fullName: "Name\nInjected" }).errors.fullName);
});

test("contact submits only approved fields and confirms success after delivery", async (t) => {
  const send = setup(t);
  process.env.LEAD_WEBHOOK_SECRET = "a".repeat(40);
  const result = await POST(request({ ...lead, monthlyLeadVolume: "ignored", crm: "ignored", admin: true, source: "untrusted" }));
  assert.equal(result.status, 200);
  assert.deepEqual(await result.json(), { success: true, message: contactSuccessMessage });
  assert.equal(result.headers.get("Cache-Control"), "no-store");
  const [url, options] = send.mock.calls[0].arguments as unknown as [string, RequestInit];
  const forwarded = JSON.parse(String(options.body));
  assert.equal(url, "https://webhook.example.test/contact");
  assert.equal(forwarded.fullName, "Test Visitor");
  assert.equal(forwarded.email, "visitor@example.com");
  assert.equal(forwarded.message, lead.message.trim());
  assert.equal(forwarded.phone, "");
  assert.equal(forwarded.form, "contact");
  assert.equal(forwarded.source, "bavexa.tech");
  assert.ok(Date.parse(forwarded.submittedAt));
  for (const field of ["monthlyLeadVolume", "crm", "admin"]) assert.equal(forwarded[field], undefined);
  assert.equal(options.redirect, "error");
  assert.ok(options.signal instanceof AbortSignal);
  assert.equal(new Headers(options.headers).get("X-Bavexa-Webhook-Secret"), "a".repeat(40));
});

test("contact requires a message, supports multiple lines, and rejects invalid messages before delivery", async (t) => {
  const send = setup(t);
  for (const message of [undefined, "", " \n\t ", 42, "x".repeat(4001), "Message\u0000text"]) {
    const result = await POST(request({ ...lead, message }));
    assert.equal(result.status, 400);
    assert.ok((await result.json()).errors.message);
  }
  assert.equal(send.mock.callCount(), 0);
  assert.deepEqual(validateContact({ ...lead, message: "Roofing business\r\n\tLooking for help with bookings." }).errors, {});
  assert.deepEqual(validateContact({ ...lead, message: "x".repeat(4000) }).errors, {});
  const field = contactFields.find(({ name }) => name === "message");
  assert.equal(field?.label, "How Can We Help?");
  assert.equal(field?.placeholder, "Tell us about your roofing business, the challenges you're facing, or how we can help.");
  const source = readFileSync(new URL("../components/ContactForm.tsx", import.meta.url), "utf8");
  assert.match(source, /<textarea[^>]*rows=\{4\}/);
  const css = readFileSync(new URL("../components/ContactForm.module.css", import.meta.url), "utf8");
  assert.match(css, /grid-column: 1 \/ -1/);
});

test("contact rejects invalid requests and bots without sending a message", async (t) => {
  const send = setup(t);
  for (const payload of [null, [], "text", {}, { ...lead, email: "invalid" }, { ...lead, companyFax: "spam" }]) assert.equal((await POST(request(payload))).status, 400);
  const badJson = new Request("https://bavexa.tech/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{" });
  assert.equal((await POST(badJson)).status, 400);
  assert.equal((await POST(request(lead, { Origin: "https://attacker.example" }))).status, 403);
  assert.equal((await POST(request(lead, { "Sec-Fetch-Site": "cross-site" }))).status, 403);
  assert.equal((await POST(request(lead, { "Content-Type": "text/plain" }))).status, 415);
  assert.equal((await POST(request({ ...lead, extra: "x".repeat(17_000) }))).status, 413);
  assert.equal(send.mock.callCount(), 0);
});

test("contact never reports success for missing or unsafe webhook configuration", async (t) => {
  const send = setup(t);
  for (const url of ["", "invalid-url", "http://internal.example", "https://user:password@example.test"]) {
    process.env.LEAD_WEBHOOK_URL = url;
    const result = await POST(request(lead));
    assert.equal(result.status, 503);
    const body = await result.json();
    assert.equal(body.success, false);
    assert.doesNotMatch(body.message, /audit|LEAD_WEBHOOK|password|internal/i);
  }
  process.env.LEAD_WEBHOOK_URL = "https://webhook.example.test/contact";
  process.env.LEAD_WEBHOOK_SECRET = "short";
  assert.equal((await POST(request(lead))).status, 503);
  assert.equal(send.mock.callCount(), 0);
});

test("contact keeps delivery failures private and allows retry", async (t) => {
  const send = setup(t);
  send.mock.mockImplementation(async () => new Response(null, { status: 500 }));
  assert.equal((await POST(request(lead))).status, 502);
  send.mock.mockImplementation(async () => { throw new Error("private provider credential"); });
  const body = await (await POST(request(lead))).json();
  assert.equal(body.success, false);
  assert.doesNotMatch(body.message, /private provider|audit/i);
  send.mock.mockImplementation(async () => new Response(null, { status: 200 }));
  assert.equal((await POST(request(lead))).status, 200);
});

test("contact page metadata and form copy are contact-focused", () => {
  const page = readFileSync(new URL("../app/contact/page.tsx", import.meta.url), "utf8");
  const form = readFileSync(new URL("../components/ContactForm.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(page, /audit/i);
  assert.doesNotMatch(form.replace('className="audit-form"', ""), /audit/i);
  assert.match(form, /await submitContact\(/);
});

test("contact confirmation, duplicate protection and retry preserve truthful submission states", () => {
  assert.equal(contactSuccessMessage, "Thanks for reaching out! Our team will get back to you soon.");
  const form = readFileSync(new URL("../components/ContactForm.tsx", import.meta.url), "utf8");
  assert.match(form, /if \(submitting.current\) return/);
  assert.match(form, /submitting.current = true;\s*setStatus\("loading"\)/);
  assert.match(form, /disabled=\{status === "loading"\}/);
  assert.match(form, /role="status">Sending message…/);
  assert.match(form, /status === "error" \? "Try Again"/);
  assert.match(form, /className="form-error" role="alert"/);
  assert.match(form, /finally \{\s*submitting.current = false/);
  assert.equal((form.match(/form.reset\(\)/g) || []).length, 1);
  assert.ok(form.indexOf("await submitContact(") < form.indexOf("form.reset()"));
  assert.match(form, /form.reset\(\);\s*setMessage\(contactSuccessMessage\);\s*setStatus\("success"\)/);
  const catchBlock = form.slice(form.indexOf("} catch (error)"), form.indexOf("} finally"));
  assert.doesNotMatch(catchBlock, /reset\(|setStatus\("success"\)/);
  assert.match(form, /className="form-success" role="status" tabIndex=\{-1\}/);
});
