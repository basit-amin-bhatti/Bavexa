import type { Metadata } from "next";
import { CompactAuditCta, DemoSection, LeadFlowSection, PageHero } from "@/components/sections/HomeSections";

export const metadata: Metadata = {
  title: "60-Second Product Demo",
  description: "Watch a roofing lead move from first contact through qualification, follow-up, inspection booking, and CRM update with BAVEXA.",
  alternates: { canonical: "/demo" },
};

export default function DemoPage() {
  return <main><PageHero eyebrow="BAVEXA PRODUCT DEMO" title="Watch a Roofing Lead Move Through the Complete Workflow." copy="See how a new enquiry receives a response, gets qualified, stays engaged, and gets a path toward a booked roof inspection." /><DemoSection compact /><LeadFlowSection /><CompactAuditCta /></main>;
}
