import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Privacy", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return <main className="legal-page"><div className="container legal-content"><span className="eyebrow">LEGAL</span><h1>Privacy Policy</h1><p className="legal-updated">Last updated: August 11, 2026</p><h2>Information we collect</h2><p>When you request an audit or contact BAVEXA, we may collect the information you provide, including your name, company, business contact details, website, lead volume, CRM, and lead-conversion challenge.</p><h2>How we use information</h2><p>We use this information to review your request, communicate with you, prepare the requested audit, improve our services, and protect the site from misuse.</p><h2>Sharing</h2><p>We do not sell personal information. Information may be processed by service providers that help us operate the website and respond to requests, subject to appropriate safeguards.</p><h2>Retention and choices</h2><p>We retain information only as long as reasonably needed for the purposes described here or as required by law. You may contact us to request access, correction, or deletion where applicable.</p><h2>Contact</h2><p>For privacy questions, use the <Link href="/contact">contact form</Link>. This policy should be reviewed by qualified counsel before production launch in any specific jurisdiction.</p></div></main>;
}
