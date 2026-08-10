import type { Metadata } from "next";
import { AboutSection, AudienceSection, CompactAuditCta, FounderSection, PageHero } from "@/components/sections/HomeSections";

export const metadata: Metadata = {
  title: "About",
  description: "BAVEXA is a focused AI lead conversion system for roofing companies, founded by Basit Amin Bhatti.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <main><PageHero eyebrow="ABOUT BAVEXA" title="Focused on the Gap Between Roofing Lead Generation and Sales." copy="BAVEXA helps roofing companies create a faster, more consistent response and follow-up process—while keeping their sales team in control." /><AboutSection /><FounderSection /><AudienceSection /><CompactAuditCta /></main>;
}
