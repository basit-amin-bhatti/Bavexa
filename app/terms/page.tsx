import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Terms", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return <main className="legal-page"><div className="container legal-content"><span className="eyebrow">LEGAL</span><h1>Terms of Use</h1><p className="legal-updated">Last updated: August 11, 2026</p><h2>Website use</h2><p>This website provides general information about BAVEXA and its AI lead conversion system for roofing companies. You may use the website only for lawful purposes.</p><h2>No guaranteed outcomes</h2><p>Illustrations, calculator outputs, workflows, and product examples are informational only. BAVEXA does not guarantee revenue, conversion rates, booked inspections, or other business outcomes.</p><h2>Roofing decisions</h2><p>BAVEXA supports lead response and sales workflows. It does not diagnose roofs, provide structural advice, replace licensed roofing professionals, or determine whether work is required.</p><h2>Intellectual property</h2><p>Website copy, design, branding, and product materials are owned by or licensed to BAVEXA and may not be reused without permission.</p><h2>Contact</h2><p>Questions about these terms can be sent through the <Link href="/contact">contact page</Link>. These terms should be reviewed by qualified counsel before production launch in any specific jurisdiction.</p></div></main>;
}
