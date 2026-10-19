import type { Metadata } from "next";
import { PricingSection } from "@/components/sections/PricingSection";
import {
  ComparisonSection,
  DemoSection,
  FounderContactSection,
  FounderSection,
  HeroSection,
  HowItWorksSection,
  IntegrationsSection,
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
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <ComparisonSection />
      <DemoSection />
      <RoiSection />
      <IntegrationsSection />
      <PricingSection />
      <FounderContactSection />
      <FounderSection />
    </main>
  );
}
