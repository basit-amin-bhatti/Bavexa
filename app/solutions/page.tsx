import type { Metadata } from "next";
import { CompactAuditCta, IntegrationsSection, PageHero, SolutionSection } from "@/components/sections/HomeSections";

export const metadata: Metadata = {
  title: "Roofing Lead Conversion Solutions",
  description: "Explore BAVEXA lead response, qualification, SMS follow-up, inspection booking, phone handling, and CRM workflow capabilities for roofing companies.",
  alternates: { canonical: "/solutions" },
};

export default function SolutionsPage() {
  return <main><PageHero eyebrow="AI LEAD QUALIFICATION & FOLLOW-UP" title="One Lead-Conversion System Built Around Roofing." copy="Bring instant response, useful qualification, structured follow-up, inspection booking, and workflow context into one connected system." /><SolutionSection /><IntegrationsSection /><CompactAuditCta /></main>;
}
