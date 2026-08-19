"use client";

import { CheckCircle2, LoaderCircle } from "lucide-react";
import { FormEvent, useRef, useState } from "react";

type FormStatus = "idle" | "loading" | "success" | "error";
type FieldName = "fullName" | "email" | "company" | "website" | "helpWith" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;

const helpOptions = [
  "Lead Response",
  "Missed-Call Follow-Up",
  "Lead Qualification",
  "SMS Follow-Up",
  "Inspection Booking",
  "CRM Automation",
  "Complete BAVEXA System",
  "Not Sure / Want Advice",
] as const;

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const WEB3FORMS_ACCESS_KEY = "bd867f6c-0d5b-420b-9a9a-1ff422c5f235";
const SUCCESS_MESSAGE = "Thanks — your message has been sent to the founder. We’ll get back to you shortly.";
const ERROR_MESSAGE = "We couldn’t send your message right now. Please try again shortly.";

function validateForm(data: FormData) {
  const values = Object.fromEntries(data.entries()) as Record<string, string>;
  const errors: FieldErrors = {};

  if (!values.fullName?.trim()) errors.fullName = "Please enter your full name.";
  if (!values.email?.trim()) {
    errors.email = "Please enter your work email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Please enter a valid work email.";
  }
  if (!values.company?.trim()) errors.company = "Please enter your roofing company.";
  if (values.website?.trim()) {
    try {
      const url = new URL(values.website);
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
    } catch {
      errors.website = "Please enter a valid website URL, including https://.";
    }
  }
  if (!helpOptions.includes(values.helpWith as (typeof helpOptions)[number])) {
    errors.helpWith = "Please select what you need help with.";
  }
  if (!values.message?.trim()) {
    errors.message = "Please enter a message.";
  } else if (values.message.trim().length < 10) {
    errors.message = "Please add a little more detail.";
  }

  return errors;
}

export function ContactMessageForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const submittingRef = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const nextErrors = validateForm(formData);

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setStatus("idle");
      const firstInvalidField = Object.keys(nextErrors)[0] as FieldName;
      (form.elements.namedItem(firstInvalidField) as HTMLElement | null)?.focus();
      return;
    }

    setErrors({});
    submittingRef.current = true;
    setStatus("loading");
    setStatusMessage("");

    try {
      const workEmail = String(formData.get("email") || "").trim();
      const website = String(formData.get("website") || "").trim();
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: "New BAVEXA Website Enquiry",
          from_name: "BAVEXA Website",
          replyto: workEmail,
          "Full Name": String(formData.get("fullName") || "").trim(),
          email: workEmail,
          "Roofing Company": String(formData.get("company") || "").trim(),
          ...(website ? { Website: website } : {}),
          "What do you need help with?": String(formData.get("helpWith") || "").trim(),
          Message: String(formData.get("message") || "").trim(),
          botcheck: Boolean(formData.get("botcheck")),
        }),
      });
      const body = await response.json() as { success?: boolean; message?: string };
      if (!response.ok || body.success !== true) throw new Error(body.message || ERROR_MESSAGE);

      setStatus("success");
      setStatusMessage(SUCCESS_MESSAGE);
      form.reset();
    } catch (error) {
      setStatus("error");
      setStatusMessage(error instanceof Error && error.message ? error.message : ERROR_MESSAGE);
    } finally {
      submittingRef.current = false;
    }
  }

  if (status === "success") {
    return (
      <div className="contact-form-success" role="status">
        <CheckCircle2 size={38} aria-hidden="true" />
        <h3>Message sent.</h3>
        <p>{statusMessage}</p>
        <button type="button" onClick={() => setStatus("idle")}>Send another message</button>
      </div>
    );
  }

  const errorFor = (field: FieldName) => errors[field] ? `${field}-error` : undefined;

  return (
    <form className="contact-message-form" onSubmit={handleSubmit} noValidate>
      <div className="contact-form-grid">
        <label className="contact-field">
          <span>Full Name *</span>
          <input name="fullName" type="text" autoComplete="name" aria-invalid={Boolean(errors.fullName)} aria-describedby={errorFor("fullName")} placeholder="Your full name" />
          {errors.fullName ? <small id="fullName-error">{errors.fullName}</small> : null}
        </label>
        <label className="contact-field">
          <span>Work Email *</span>
          <input name="email" type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errorFor("email")} placeholder="you@company.com" />
          {errors.email ? <small id="email-error">{errors.email}</small> : null}
        </label>
        <label className="contact-field">
          <span>Roofing Company *</span>
          <input name="company" type="text" autoComplete="organization" aria-invalid={Boolean(errors.company)} aria-describedby={errorFor("company")} placeholder="Company name" />
          {errors.company ? <small id="company-error">{errors.company}</small> : null}
        </label>
        <label className="contact-field">
          <span>Website <em>(optional)</em></span>
          <input name="website" type="url" autoComplete="url" aria-invalid={Boolean(errors.website)} aria-describedby={errorFor("website")} placeholder="https://" />
          {errors.website ? <small id="website-error">{errors.website}</small> : null}
        </label>
        <label className="contact-field contact-field-wide">
          <span>What do you need help with? *</span>
          <select name="helpWith" defaultValue="" aria-invalid={Boolean(errors.helpWith)} aria-describedby={errorFor("helpWith")}>
            <option value="" disabled>Select an area</option>
            {helpOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
          {errors.helpWith ? <small id="helpWith-error">{errors.helpWith}</small> : null}
        </label>
        <label className="contact-field contact-field-wide">
          <span>Message *</span>
          <textarea name="message" rows={5} aria-invalid={Boolean(errors.message)} aria-describedby={errorFor("message")} placeholder="Tell us about your current lead process and where you need help." />
          {errors.message ? <small id="message-error">{errors.message}</small> : null}
        </label>
      </div>
      <label className="hp-field" aria-hidden="true">Leave this field empty<input name="botcheck" type="checkbox" tabIndex={-1} autoComplete="off" /></label>
      {status === "error" ? <p className="contact-form-error" role="alert">{statusMessage}</p> : null}
      <button className="contact-form-submit" type="submit" disabled={status === "loading"}>
        {status === "loading" ? <><LoaderCircle className="spin" aria-hidden="true" /> SENDING…</> : <>SEND MESSAGE <span aria-hidden="true">→</span></>}
      </button>
    </form>
  );
}
