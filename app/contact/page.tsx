import type { Metadata } from "next";
import { AuditSection } from "@/components/sections/HomeSections";

export const metadata: Metadata = {
  title: "Free AI Lead Conversion Audit",
  description: "Request a free audit of your roofing company’s lead response, follow-up, qualification, inspection booking, and CRM handoff process.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <main className="contact-page"><section className="contact-intro"><div className="container"><span>FREE AI LEAD CONVERSION AUDIT</span><h1>See Where Roofing Leads May Be Slipping Through.</h1><p>A practical review of your response, qualification, follow-up, booking, and CRM handoff process.</p></div></section><AuditSection /></main>;
}
