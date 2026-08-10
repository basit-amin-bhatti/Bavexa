import type { Metadata } from "next";
import {
  AboutSection,
  AudienceSection,
  AuditSection,
  ComparisonSection,
  DemoSection,
  FinalCtaSection,
  FounderSection,
  HeroSection,
  HowItWorksSection,
  IntegrationsSection,
  LeadFlowSection,
  OutcomesSection,
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
      <OutcomesSection />
      <AudienceSection />
      <IntegrationsSection />
      <FounderSection />
      <AboutSection />
      <AuditSection />
      <FinalCtaSection />
    </main>
  );
}
