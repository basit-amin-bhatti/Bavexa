export const siteConfig = {
  brand: {
    name: "BAVEXA",
    positioning: "AI Lead Conversion System for Roofing Companies",
    url: "https://bavexa.tech",
  },
  nav: [
    { label: "System", href: "/#system" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Live AI Demo", href: "/demo" },
    { label: "Founder", href: "/#founder" },
  ],
  ctas: {
    primary: "BOOK A FREE ROOFING GROWTH CALL",
    secondary: "Talk to Mike — Free AI Demo",
    secondaryHref: "/demo",
  },
  founder: {
    name: "Basit Amin Bhatti",
    role: "Founder, BAVEXA",
    positioning: "AI Growth Partner for Roofing Companies",
    image: "/images/founder.png",
    imageEnabled: true,
    website: "https://basitaminbhatti.me",
    message:
      "I built BAVEXA to help roofing companies stop losing valuable leads through missed calls, slow responses, poor qualification, and weak follow-up.",
    cta: "Meet Basit →",
  },
  integrations: [
    "Lead Sources",
    "SMS",
    "CRM",
    "Appointment Scheduling",
    "Automation",
    "Webhooks / API",
  ],
  socialProof: {
    enabled: false,
    testimonials: [],
    logos: [],
    caseStudies: [],
  },
  pricing: {
    enabled: false,
    trialDays: 14,
    minimumMonthly: 297,
    maximumMonthly: 497,
  },
} as const;

export const problems = [
  {
    title: "Missed Calls",
    copy: "Your team may be on a roof, driving, inspecting a property, or helping another customer.",
  },
  {
    title: "Slow Response",
    copy: "The prospect continues contacting contractors while the enquiry waits.",
  },
  {
    title: "Unanswered Texts",
    copy: "A homeowner replies after hours and the conversation stalls.",
  },
  {
    title: "Weak Follow-Up",
    copy: "A lead does not immediately book and slowly disappears from the team’s attention.",
  },
  {
    title: "Poor Qualification",
    copy: "Salespeople waste time chasing prospects that may not be a good fit.",
  },
  {
    title: "Booking Friction",
    copy: "A prospect shows interest but nobody converts the conversation into an inspection.",
  },
] as const;

export const solutions = [
  {
    title: "Instant Lead Response",
    copy: "Engage new enquiries without waiting for someone to manually respond.",
  },
  {
    title: "Missed-Call Text-Back",
    copy: "Automatically continue missed conversations through SMS.",
  },
  {
    title: "AI SMS Follow-Up",
    copy: "Keep promising prospects engaged through structured, consistent follow-up.",
  },
  {
    title: "AI Lead Qualification",
    copy: "Collect service type, roof issue, service area, timeline, inspection preference, and readiness—without diagnosing roofing or structural issues.",
  },
  {
    title: "Inspection Booking",
    copy: "Move qualified prospects toward available roof inspection slots.",
  },
  {
    title: "CRM Updates",
    copy: "Send relevant lead information, status, and context into the connected workflow where supported.",
  },
] as const;

export const howItWorks = [
  {
    number: "01",
    title: "Lead Contacts Your Roofing Company",
    copy: "A homeowner calls, texts, or submits a lead.",
  },
  {
    number: "02",
    title: "BAVEXA Responds Instantly",
    copy: "Respond within seconds, 24/7, while the lead is still interested.",
  },
  {
    number: "03",
    title: "AI Qualifies & Follows Up",
    copy: "Collect the important lead details and automatically keep the conversation moving.",
  },
  {
    number: "04",
    title: "Inspection Booked + CRM Updated",
    copy: "Move qualified leads into available inspection slots and automatically update the CRM.",
  },
] as const;
