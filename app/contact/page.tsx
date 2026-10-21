import type { Metadata } from "next";
import { ContactSection } from "@/components/sections/HomeSections";

export const metadata: Metadata = {
  title: "Contact BAVEXA",
  description: "Talk with BAVEXA about an AI roofing receptionist that helps your team respond to inquiries, qualify leads, and book inspections.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <main className="contact-page"><section className="contact-intro"><div className="container"><span>CONTACT BAVEXA</span><h1>Let’s Talk About Your Roofing Business.</h1><p>Explore how an AI receptionist could support your lead response, qualification, and inspection booking.</p></div></section><ContactSection /></main>;
}
