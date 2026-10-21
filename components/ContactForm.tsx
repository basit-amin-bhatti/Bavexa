"use client";

import { CheckCircle2, LoaderCircle } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { contactFields, contactSuccessMessage, validateContact, type ContactErrors } from "@/lib/contact";
import { submitContact } from "@/lib/contact-submission";
import styles from "./ContactForm.module.css";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<ContactErrors>({});
  const submitting = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));
    const { values, errors: nextErrors } = validateContact(payload);
    setErrors(nextErrors);
    setMessage("");
    if (Object.keys(nextErrors).length) {
      setStatus("idle");
      (form.elements.namedItem(Object.keys(nextErrors)[0]) as HTMLInputElement | HTMLTextAreaElement | null)?.focus();
      return;
    }
    submitting.current = true;
    setStatus("loading");
    try {
      await submitContact({ ...values, companyFax: payload.companyFax });
      form.reset();
      setMessage(contactSuccessMessage);
      setStatus("success");
    } catch (error) {
      setMessage(error instanceof Error && error.name === "Error" ? error.message : "We couldn’t send your message. Please try again shortly.");
      setStatus("error");
    } finally {
      submitting.current = false;
    }
  }

  if (status === "success") {
    return <div className="form-success" role="status" tabIndex={-1} ref={(node) => { node?.focus(); }}><CheckCircle2 size={34} aria-hidden="true" /><h3>Message sent.</h3><p>{message}</p><button type="button" onClick={() => { setStatus("idle"); setMessage(""); }}>Send another message</button></div>;
  }

  return (
    <form className="audit-form" onSubmit={handleSubmit} noValidate aria-busy={status === "loading"}>
      <div className="form-grid">
        {contactFields.map(({ label, type, ...field }) => {
          const errorId = `contact-${field.name}-error`;
          const controlProps = { ...field, "aria-invalid": Boolean(errors[field.name]), "aria-describedby": errors[field.name] ? errorId : undefined, onChange: () => setErrors((previous) => ({ ...previous, [field.name]: undefined })) };
          return <label key={field.name} className={type === "textarea" ? styles.messageField : undefined}>
            <span>{label} {field.required ? "*" : "(optional)"}</span>
            {type === "textarea" ? <textarea {...controlProps} rows={4} className={styles.message} /> : <input {...controlProps} type={type} />}
            {errors[field.name] ? <small id={errorId} role="alert" style={{ color: "var(--danger)", fontSize: ".7rem" }}>{errors[field.name]}</small> : null}
          </label>;
        })}
      </div>
      <label className="hp-field" aria-hidden="true">Leave this field empty<input name="companyFax" type="text" tabIndex={-1} autoComplete="off" /></label>
      {status === "error" ? <p className="form-error" role="alert">{message}</p> : null}
      <button className="form-submit" type="submit" disabled={status === "loading"}>{status === "loading" ? <><LoaderCircle className="spin" aria-hidden="true" /><span role="status">Sending message…</span></> : <>{status === "error" ? "Try Again" : "Contact Our Team"} <span aria-hidden="true">→</span></>}</button>
      <p className="form-privacy">We’ll use your details only to respond to your inquiry about BAVEXA. No pressure or obligation.</p>
    </form>
  );
}
