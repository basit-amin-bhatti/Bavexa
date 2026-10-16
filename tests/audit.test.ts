import assert from "node:assert/strict";
import test from "node:test";
import { POST } from "../app/api/audit/route";

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
