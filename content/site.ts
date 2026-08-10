export const siteConfig = {
  brand: {
    name: "BAVEXA",
    positioning: "AI Lead Conversion System for Roofing Companies",
    url: "https://bavexa.tech",
  },
  nav: [
    { label: "How It Works", href: "/how-it-works" },
    { label: "Solutions", href: "/solutions" },
    { label: "Demo", href: "/demo" },
    { label: "About", href: "/about" },
  ],
  ctas: {
    primary: "Get Your Free AI Lead Conversion Audit",
    primaryShort: "Get Free AI Audit",
    primaryHref: "/contact",
    secondary: "See How It Works",
    secondaryHref: "/how-it-works",
    demo: "Watch the 60-Second Demo",
    demoHref: "/demo",
  },
  founder: {
    name: "Basit Amin Bhatti",
    role: "Founder, BAVEXA",
    positioning: "AI Growth Partner for Roofing Companies",
    image: "/images/founder.jpg",
    imageEnabled: false,
    website: "https://basitaminbhatti.me",
    message:
      "I built BAVEXA to help roofing companies stop losing valuable leads through missed calls, slow responses, poor qualification, and weak follow-up.",
    cta: "Meet Basit →",
  },
  integrations: [
    "AI Voice",
    "SMS",
    "CRM",
    "Lead Sources",
    "Appointment Scheduling",
    "Automation",
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

export const leadFlow = [
  "Lead Contacts You",
  "AI Responds",
  "Lead Qualified",
  "Follow-Up",
  "Inspection Booked",
  "CRM Updated",
] as const;

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
    title: "AI Phone Handling",
    copy: "Where enabled, handle initial inbound conversations and capture useful information.",
  },
  {
    title: "Missed-Call Text Back",
    copy: "Automatically continue missed conversations through SMS.",
  },
  {
    title: "AI Lead Qualification",
    copy: "Collect service type, roof issue, service area, timeline, inspection preference, and readiness—without diagnosing roofing or structural issues.",
  },
  {
    title: "AI SMS Follow-Up",
    copy: "Keep promising prospects engaged through structured, consistent follow-up.",
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
    title: "Lead Contacts You",
    copy: "A homeowner calls, texts, or submits an enquiry.",
  },
  {
    number: "02",
    title: "BAVEXA Responds",
    copy: "The system starts the conversation while interest is fresh.",
  },
  {
    number: "03",
    title: "BAVEXA Qualifies",
    copy: "Relevant information is collected for the sales team.",
  },
  {
    number: "04",
    title: "Follow-Up Happens Automatically",
    copy: "Structured SMS keeps the conversation moving.",
  },
  {
    number: "05",
    title: "Inspection Gets Booked",
    copy: "Qualified opportunities are moved toward available inspection appointments.",
  },
] as const;

export const outcomes = [
  "More Leads Answered",
  "Faster Response",
  "More Qualified Opportunities",
  "More Inspection Opportunities",
  "Less Manual Follow-Up",
  "Cleaner CRM Information",
] as const;

export const audiences = [
  "Residential Roofing Companies",
  "Commercial Roofing Companies",
  "Roofing Contractors",
  "Growing Roofing Sales Teams",
  "Multi-Location Roofing Businesses",
] as const;
