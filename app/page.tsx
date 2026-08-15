import type { Metadata } from "next";
import {
  AudienceSection,
  ComparisonSection,
  DemoSection,
  FounderSection,
  HeroSection,
  HowItWorksSection,
  IntegrationsSection,
  LeadFlowSection,
  ProblemSection,
  RoiSection,
  SolutionSection,
} from "@/components/sections/HomeSections";

export const metadata: Metadata = {
  title: { absolute: "BAVEXA | AI Lead Conversion System for Roofing Companies" },
  description: "BAVEXA helps roofing companies respond to leads, qualify opportunities, automate follow-up, and move more prospects toward booked roof inspections.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main>
      <HeroSection />
      <LeadFlowSection />
      <ProblemSection />
      <SolutionSection />
      <ComparisonSection />
      <HowItWorksSection />
      <RoiSection />
      <DemoSection />
      <IntegrationsSection />
      <FounderSection />
      <AudienceSection />
    </main>
  );
}
