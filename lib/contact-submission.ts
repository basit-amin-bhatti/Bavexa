import { web3FormsAccessKey } from "../content/contact";
import { validateContact } from "./contact";

const submissionError = "We couldn’t send your message. Please try again shortly.";

export async function submitContact(payload: Record<string, unknown>) {
  const { values, errors } = validateContact(payload);
  if (payload.companyFax || Object.keys(errors).length) throw new Error("Please check your details and try again.");

  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ ...values, access_key: web3FormsAccessKey }),
    signal: AbortSignal.timeout(12_000),
  });
  const body: unknown = await response.json();
  if (!response.ok || !body || typeof body !== "object" || !("success" in body) || body.success !== true) {
    throw new Error(response.status === 429 ? "We couldn’t send your message because too many requests were received. Please wait a moment and try again." : submissionError);
  }
}
