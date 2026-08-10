"use client";

import { CheckCircle2, LoaderCircle } from "lucide-react";
import { FormEvent, useState } from "react";

type FormStatus = "idle" | "loading" | "success" | "error";

const challenges = ["Missed calls", "Slow response", "Follow-up", "Qualification", "Appointment booking", "CRM workflow", "Not sure yet"];

export function AuditForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await response.json() as { message?: string };
      if (!response.ok) throw new Error(body.message || "We couldn’t send your request right now.");
      setStatus("success");
      setMessage(body.message || "Your audit request has been received.");
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "We couldn’t send your request right now.");
    }
  }

  if (status === "success") {
    return (
      <div className="form-success" role="status">
        <CheckCircle2 size={34} aria-hidden="true" />
        <h3>Audit request received.</h3>
        <p>{message}</p>
        <button type="button" onClick={() => setStatus("idle")}>Send another request</button>
      </div>
    );
  }

  return (
    <form className="audit-form" onSubmit={handleSubmit} noValidate={false}>
      <div className="form-grid">
        <label><span>Full Name *</span><input name="fullName" type="text" autoComplete="name" required placeholder="Your full name" /></label>
        <label><span>Roofing Company Name *</span><input name="company" type="text" autoComplete="organization" required placeholder="Company name" /></label>
        <label><span>Business Email *</span><input name="email" type="email" autoComplete="email" required placeholder="you@company.com" /></label>
        <label><span>Phone *</span><input name="phone" type="tel" autoComplete="tel" required placeholder="(555) 000-0000" /></label>
        <label><span>Website</span><input name="website" type="url" autoComplete="url" placeholder="https://" /></label>
        <label><span>Monthly Lead Volume *</span><select name="monthlyLeadVolume" required defaultValue=""><option value="" disabled>Select a range</option><option>Under 25</option><option>25–50</option><option>51–100</option><option>101–250</option><option>251–500</option><option>500+</option></select></label>
        <label><span>Current CRM</span><input name="crm" type="text" placeholder="CRM or current workflow" /></label>
        <label><span>Biggest Lead Conversion Challenge *</span><select name="challenge" required defaultValue=""><option value="" disabled>Select a challenge</option>{challenges.map((item) => <option key={item}>{item}</option>)}</select></label>
      </div>
      <label className="hp-field" aria-hidden="true">Leave this field empty<input name="companyFax" type="text" tabIndex={-1} autoComplete="off" /></label>
      {status === "error" ? <p className="form-error" role="alert">{message}</p> : null}
      <button className="form-submit" type="submit" disabled={status === "loading"}>
        {status === "loading" ? <><LoaderCircle className="spin" aria-hidden="true" /> Sending request…</> : <>Get My Free Audit <span aria-hidden="true">→</span></>}
      </button>
      <p className="form-privacy">No pressure or obligation. We’ll use your details only to review your lead-conversion process and contact you about the audit.</p>
    </form>
  );
}
