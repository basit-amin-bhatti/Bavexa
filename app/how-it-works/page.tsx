import type { Metadata } from "next";
import { LeadJourney } from "@/components/LeadJourney";
import { CompactAuditCta, ComparisonSection, HowItWorksSection, LeadFlowSection, PageHero } from "@/components/sections/HomeSections";

export const metadata: Metadata = {
  title: "How It Works",
  description: "See how BAVEXA responds to roofing leads, qualifies opportunities, follows up, books inspections, and updates the connected workflow.",
  alternates: { canonical: "/how-it-works" },
};

export default function HowItWorksPage() {
  return <main><PageHero eyebrow="HOW BAVEXA WORKS" title="A Clearer Path From New Lead to Booked Inspection." copy="BAVEXA keeps the response, qualification, follow-up, booking, and sales-team handoff connected around one roofing lead." aside={<LeadJourney />} /><LeadFlowSection /><HowItWorksSection showCta={false} /><ComparisonSection /><CompactAuditCta /></main>;
}
