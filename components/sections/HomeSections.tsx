import Image from "next/image";
import {
  ArrowDown,
  ArrowRight,
  CalendarCheck2,
  Check,
  CircleCheck,
  Clock3,
  DatabaseZap,
  MapPinCheck,
  MessageSquareText,
  PhoneMissed,
  RefreshCw,
  SearchCheck,
  Send,
  Target,
  Webhook,
  Workflow,
} from "lucide-react";
import { AuditForm } from "@/components/AuditForm";
import { CalBookingButton } from "@/components/CalBookingButton";
import { ContactMessageForm } from "@/components/ContactMessageForm";
import { DemoExperience } from "@/components/DemoExperience";
import { FounderPortrait } from "@/components/FounderPortrait";
import { LeadJourney } from "@/components/LeadJourney";
import { RoiCalculator } from "@/components/RoiCalculator";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  howItWorks,
  problems,
  siteConfig,
  solutions,
} from "@/content/site";

const problemIcons = [PhoneMissed, Clock3, MessageSquareText, RefreshCw, SearchCheck, CalendarCheck2];
const solutionIcons = [Clock3, PhoneMissed, MessageSquareText, SearchCheck, CalendarCheck2, DatabaseZap];
const integrationIcons = [Send, MessageSquareText, DatabaseZap, CalendarCheck2, Workflow, Webhook];

export function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-photo" aria-hidden="true">
        <Image src="/images/roofing-hero.jpg" alt="" fill priority sizes="(max-width: 900px) 100vw, 47vw" />
      </div>
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="hero-eyebrow"><span /> SECONDS MATTER IN ROOFING</p>
          <h1>Respond to Every Roofing Lead in <em>Seconds—<span className="hero-hours">24/7</span></em></h1>
          <p className="hero-support">BAVEXA responds to new roofing leads within seconds, 24/7—helping you book the inspection before they call another roofer.</p>
          <div className="hero-actions">
            <CalBookingButton className="button button-primary" />
            <Button href={siteConfig.ctas.secondaryHref} variant="secondary">{siteConfig.ctas.secondary}</Button>
          </div>
          <p className="hero-reassurance"><CircleCheck size={16} aria-hidden="true" /> No pressure. We’ll simply show you where leads may be slipping through the cracks.</p>
        </div>
        <div className="hero-product"><LeadJourney /></div>
      </div>
      <a className="hero-scroll" href="#system" aria-label="Scroll to see the BAVEXA system"><span>SEE THE SYSTEM</span><ArrowDown size={16} aria-hidden="true" /></a>
    </section>
  );
}

export function ProblemSection() {
  return (
    <section className="section problem-section">
      <div className="container">
        <div className="section-split-heading">
          <SectionHeading eyebrow="THE LEAD LEAKAGE PROBLEM" title="How Many Roofing Leads Are You Losing?" />
          <p>You already paid to generate the opportunity.<br /><strong>The problem is what happens after the lead comes in.</strong></p>
        </div>
        <div className="problem-layout">
          <figure className="roofing-photo-card">
            <Image src="/images/roofing-inspection.jpg" alt="Roofing contractors working on a residential roof" fill sizes="(max-width: 900px) 100vw, 38vw" />
            <figcaption><span>WHEN THE TEAM IS BUSY</span><strong>The next lead is still choosing who to call back.</strong></figcaption>
          </figure>
          <div className="problem-grid">
            {problems.map((problem, index) => {
              const Icon = problemIcons[index];
              return <article className="problem-card" key={problem.title}><Icon aria-hidden="true" /><div><h3>{problem.title}</h3><p>{problem.copy}</p></div></article>;
            })}
          </div>
        </div>
        <p className="closing-message"><span /> Every missed call or delayed response creates another opportunity for the prospect to move on.</p>
      </div>
    </section>
  );
}

export function SolutionSection() {
  return (
    <section className="section dark-section solution-section" id="system">
      <div className="container">
        <div className="solution-heading-row">
          <SectionHeading theme="dark" eyebrow="THE BAVEXA AI LEAD CONVERSION SYSTEM" title={<>One Connected System.<br />More Opportunities Captured.</>} copy="From instant response and missed-call recovery through follow-up, qualification, inspection booking, and CRM updates, every step keeps the same roofing lead moving forward." />
          <div className="system-pill"><span>MARKETING</span><ArrowRight size={14} /><strong>BAVEXA</strong><ArrowRight size={14} /><span>SALES TEAM</span></div>
        </div>
        <div className="solution-grid">
          {solutions.map((solution, index) => {
            const Icon = solutionIcons[index];
            return <article className="solution-card" key={solution.title}><span className="solution-index">0{index + 1}</span><Icon aria-hidden="true" /><h3>{solution.title}</h3><p>{solution.copy}</p>{index === 3 ? <div className="qualification-tags"><span>Service area</span><span>Roof issue</span><span>Timeline</span><span>Readiness</span></div> : null}</article>;
          })}
        </div>
      </div>
    </section>
  );
}

export function ComparisonSection() {
  const without = ["Lead comes in", "Response delayed", "Call/text missed", "Follow-up inconsistent", "Homeowner contacts another roofer", "Opportunity lost"];
  const withBavexa = ["Lead comes in", "Response within seconds", "Lead qualified", "Automated follow-up", "Inspection Booked", "CRM updated"];
  return (
    <section className="section comparison-section">
      <div className="container">
        <SectionHeading align="center" eyebrow="A MORE CONSISTENT RESPONSE PROCESS" title="What Changes With BAVEXA." copy="BAVEXA helps you get more value from the roofing leads you’re already generating." />
        <div className="comparison-grid">
          <article className="comparison-card comparison-before"><div className="comparison-title"><span>WITHOUT BAVEXA</span><i>Manual gaps</i></div><ol>{without.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>)}</ol></article>
          <article className="comparison-card comparison-after"><div className="comparison-title"><span>WITH BAVEXA</span><i>Connected workflow</i></div><ol>{withBavexa.map((item, index) => <li key={item}><span>{index === 4 ? <Check size={13} aria-hidden="true" /> : String(index + 1).padStart(2, "0")}</span>{item}</li>)}</ol></article>
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  return (
    <section className="section how-section" id="how-it-works">
      <div className="container">
        <div className="section-split-heading">
          <SectionHeading eyebrow="HOW IT WORKS" title="From New Lead to Booked Inspection." copy="BAVEXA responds, qualifies, follows up, and books roofing leads automatically—so your team can focus on closing jobs." />
        </div>
        <ol className="how-list">
          {howItWorks.map((step, index) => (
            <li key={step.number}><span className="how-number">{step.number}</span><div className="how-icon">{[<PhoneMissed key="1" />, <MessageSquareText key="2" />, <SearchCheck key="3" />, <CalendarCheck2 key="4" />][index]}</div><div><h3>{step.title}</h3><p>{step.copy}</p></div>{index < howItWorks.length - 1 ? <span className="how-line" /> : null}</li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function RoiSection() {
  return (
    <section className="section roi-section">
      <div className="container">
        <SectionHeading align="center" eyebrow="INTERACTIVE LEAD LEAKAGE CALCULATOR" title="What Could Missed Leads Be Costing You?" copy="Use your own numbers to estimate the value of roofing opportunities currently slipping through your response and follow-up process." />
        <RoiCalculator />
      </div>
    </section>
  );
}

export function DemoSection() {
  return (
    <section className="section demo-section" id="demo">
      <div className="container demo-layout">
        <div className="demo-copy">
          <SectionHeading theme="dark" eyebrow="60-SECOND PRODUCT DEMO" title="See a Roofing Lead Move Through BAVEXA." copy="Watch the complete journey from first contact to qualified inspection opportunity." />
          <ol className="demo-stage-inline">{["Incoming Lead", "AI Conversation", "Qualification", "SMS Follow-Up", "Inspection Booking", "CRM Update"].map((stage, index) => <li key={stage}><span>{String(index + 1).padStart(2, "0")}</span>{stage}</li>)}</ol>
          <p className="demo-sound-note">No autoplay. No customer footage. Just the product workflow.</p>
        </div>
        <DemoExperience />
      </div>
    </section>
  );
}

export function IntegrationsSection() {
  return (
    <section className="section integrations-section">
      <div className="container">
        <SectionHeading align="center" eyebrow="CONNECTED WORKFLOWS" title="Works With the Tools Your Roofing Team Already Uses." copy="BAVEXA connects with your existing lead sources, messaging, CRM, scheduling, and automation tools—so you don’t have to rebuild your workflow." />
        <div className="integration-row">{siteConfig.integrations.map((item, index) => { const Icon = integrationIcons[index]; return <div key={item}><Icon aria-hidden="true" /><span>{item}</span></div>; })}</div>
        <p className="integration-note">Exact integrations are confirmed during your audit.</p>
      </div>
    </section>
  );
}

export function FounderContactSection() {
  return (
    <section className="section founder-contact-section" id="contact">
      <div className="container founder-contact-grid">
        <div className="founder-call-panel">
          <span className="founder-contact-eyebrow"><CalendarCheck2 size={17} aria-hidden="true" /> SPEAK WITH THE FOUNDER</span>
          <h2>Find Where Your Roofing Leads Are Slipping Away.</h2>
          <p>Book a free strategy call with Basit Amin Bhatti, Founder of BAVEXA, and explore how your lead response, qualification, follow-up, and inspection booking process could be improved.</p>
          <div className="founder-call-action">
            <CalBookingButton className="button button-primary founder-contact-cta" />
            <span><Check size={14} aria-hidden="true" /> 30 minutes <i aria-hidden="true">·</i> No obligation</span>
          </div>
        </div>
        <div className="contact-message-card">
          <span className="contact-message-eyebrow">CONTACT BAVEXA</span>
          <h2>Send a Message.</h2>
          <p>Tell us what you need help with and we’ll point you toward the right next step.</p>
          <ContactMessageForm />
        </div>
      </div>
    </section>
  );
}

export function FounderSection() {
  const founder = siteConfig.founder;

  return (
    <section className="section founder-section" id="founder">
      <div className="container founder-card">
        <FounderPortrait />
        <div className="founder-copy">
          <span className="eyebrow">MEET THE FOUNDER</span>
          <h2>{founder.name}</h2>
          <p className="founder-role">{founder.role} · {founder.positioning}</p>
          <blockquote>“{founder.message}”</blockquote>
          <a href={founder.website} target="_blank" rel="noreferrer">{founder.cta}</a>
        </div>
        <div className="founder-brand-relationship" aria-hidden="true">
          <span>THE EXPERT</span>
          <strong>Basit</strong>
          <ArrowRight />
          <span>THE SYSTEM</span>
          <strong>BAVEXA</strong>
        </div>
      </div>
    </section>
  );
}

export function AuditSection() {
  return (
    <section className="section audit-section" id="audit">
      <div className="container audit-layout">
        <div className="audit-copy">
          <SectionHeading theme="dark" eyebrow="FREE AI LEAD CONVERSION AUDIT" title="Find the Gaps in Your Roofing Lead Process." copy="We’ll identify where your roofing business may be losing leads and show you where AI could help create a faster, more consistent conversion process." />
          <div className="audit-deliverables">
            <span>YOUR AUDIT LOOKS AT</span>
            <ul><li><MapPinCheck aria-hidden="true" />Lead response gaps</li><li><MessageSquareText aria-hidden="true" />Follow-up consistency</li><li><Target aria-hidden="true" />Qualification process</li><li><Workflow aria-hidden="true" />Booking and CRM handoff</li></ul>
          </div>
          <p className="audit-reassurance"><Check size={15} aria-hidden="true" /> No pressure. No generic AI pitch. Just a practical review of your current process.</p>
        </div>
        <div className="audit-form-card"><div className="form-card-head"><span>GET YOUR FREE AUDIT</span><i>Typically takes 2 minutes</i></div><AuditForm /></div>
      </div>
    </section>
  );
}
