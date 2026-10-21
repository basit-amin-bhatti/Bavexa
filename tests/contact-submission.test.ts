import assert from "node:assert/strict";
import test from "node:test";
import { submitContact } from "../lib/contact-submission";
import { web3FormsAccessKey } from "../content/contact";

const lead = { fullName: " Test Visitor ", email: "visitor@example.com", company: "Example Roofing", phone: "+1 (202) 555-0142", message: "Roofing business\nLooking for help with bookings." };

test("Web3Forms receives every existing field and the configured public key, without a subject or extras", async (t) => {
  const send = t.mock.method(globalThis, "fetch", async () => Response.json({ success: true }));
  await submitContact({ ...lead, companyFax: "", subject: "ignored", access_key: "untrusted", admin: true });
  assert.equal(send.mock.callCount(), 1);
  const [url, options] = send.mock.calls[0].arguments as unknown as [string, RequestInit];
  assert.equal(url, "https://api.web3forms.com/submit");
  assert.equal(options.method, "POST");
  assert.equal(new Headers(options.headers).get("Accept"), "application/json");
  assert.ok(options.signal instanceof AbortSignal);
  assert.deepEqual(JSON.parse(String(options.body)), { ...lead, fullName: "Test Visitor", access_key: web3FormsAccessKey });
});

test("Web3Forms cannot be called for invalid fields or a filled honeypot", async (t) => {
  const send = t.mock.method(globalThis, "fetch", async () => Response.json({ success: true }));
  for (const payload of [{ ...lead, email: "invalid" }, { ...lead, message: "" }, { ...lead, companyFax: "spam" }]) await assert.rejects(submitContact(payload));
  assert.equal(send.mock.callCount(), 0);
});

test("Web3Forms success waits for explicit provider confirmation", async (t) => {
  let confirm!: (response: Response) => void;
  t.mock.method(globalThis, "fetch", () => new Promise<Response>((resolve) => { confirm = resolve; }));
  let completed = false;
  const pending = submitContact(lead).then(() => { completed = true; });
  await Promise.resolve();
  assert.equal(completed, false);
  confirm(Response.json({ success: true }));
  await pending;
  assert.equal(completed, true);
});

test("Web3Forms rejects unsuccessful, malformed and non-boolean confirmations, then allows retry", async (t) => {
  const send = t.mock.method(globalThis, "fetch", async () => Response.json({ success: false }));
  for (const body of [{ success: false }, { success: "true" }, {}, null]) {
    send.mock.mockImplementation(async () => Response.json(body));
    await assert.rejects(submitContact(lead));
  }
  send.mock.mockImplementation(async () => Response.json({ success: true }, { status: 500 }));
  await assert.rejects(submitContact(lead));
  send.mock.mockImplementation(async () => new Response("not JSON"));
  await assert.rejects(submitContact(lead));
  send.mock.mockImplementation(async () => Response.json({ success: false }, { status: 429 }));
  await assert.rejects(submitContact(lead), /wait a moment/);
  send.mock.mockImplementation(async () => { throw new TypeError("Network failure"); });
  await assert.rejects(submitContact(lead));
  send.mock.mockImplementation(async () => { throw new DOMException("Timeout", "TimeoutError"); });
  await assert.rejects(submitContact(lead));
  send.mock.mockImplementation(async () => Response.json({ success: true }));
  await submitContact({ ...lead, phone: "" });
});
