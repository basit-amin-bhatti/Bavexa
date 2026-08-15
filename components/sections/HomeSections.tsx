import Image from "next/image";
import {
  ArrowDown,
  ArrowRight,
  CalendarCheck2,
  Check,
  CircleCheck,
  Clock3,
  DatabaseZap,
  Headphones,
  MapPinCheck,
  MessageSquareText,
  PhoneMissed,
  RefreshCw,
  SearchCheck,
  Send,
  Target,
  Workflow,
} from "lucide-react";
import { AuditForm } from "@/components/AuditForm";
import { CalBookingButton } from "@/components/CalBookingButton";
import { DemoExperience } from "@/components/DemoExperience";
import { FounderPortrait } from "@/components/FounderPortrait";
import { LeadJourney } from "@/components/LeadJourney";
import { RoiCalculator } from "@/components/RoiCalculator";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  audiences,
  howItWorks,
  leadFlow,
  problems,
  siteConfig,
  solutions,
} from "@/content/site";

const problemIcons = [PhoneMissed, Clock3, MessageSquareText, RefreshCw, SearchCheck, CalendarCheck2];
const solutionIcons = [Clock3, Headphones, PhoneMissed, SearchCheck, MessageSquareText, CalendarCheck2, DatabaseZap];
const integrationIcons = [Headphones, MessageSquareText, DatabaseZap, Send, CalendarCheck2, Workflow];

export function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-photo" aria-hidden="true">
        <Image src="/images/roofing-hero.jpg" alt="" fill priority sizes="100vw" />
      </div>
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="hero-eyebrow"><span /> AI LEAD CONVERSION SYSTEM FOR ROOFING COMPANIES</p>
          <h1>Turn More Roofing Leads Into <em>Booked Inspections.</em></h1>
          <p className="hero-support">We help roofing companies respond to every lead faster and turn more inquiries into booked roof inspections.</p>
          <div className="hero-actions">
            <Button href="/contact">{siteConfig.ctas.primary}</Button>
            <Button href={siteConfig.ctas.secondaryHref} variant="secondary">{siteConfig.ctas.secondary}</Button>
          </div>
          <p className="hero-reassurance"><CircleCheck size={16} aria-hidden="true" /> No pressure. We’ll simply show you where leads may be slipping through the cracks.</p>
        </div>
        <div className="hero-product"><LeadJourney /></div>
      </div>
      <a className="hero-scroll" href="#lead-flow" aria-label="Scroll to see the BAVEXA lead flow"><span>SEE THE SYSTEM</span><ArrowDown size={16} aria-hidden="true" /></a>
    </section>
  );
}

export function LeadFlowSection() {
  return (
    <section className="lead-flow-section" id="lead-flow" aria-labelledby="lead-flow-heading">
      <div className="container">
        <div className="flow-intro"><span>THE BAVEXA WORKFLOW</span><h2 id="lead-flow-heading">One connected path from enquiry to sales-team context.</h2></div>
        <ol className="lead-flow-list">
          {leadFlow.map((item, index) => (
            <li key={item}>
              <span className={index === 4 ? "flow-number flow-success" : "flow-number"}>{index === 4 ? <Check size={16} aria-hidden="true" /> : String(index + 1).padStart(2, "0")}</span>
              <strong>{item}</strong>
              {index < leadFlow.length - 1 ? <ArrowRight className="flow-arrow" aria-hidden="true" /> : null}
            </li>
          ))}
        </ol>
      </div>
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
    <section className="section dark-section solution-section" id="solutions">
      <div className="container">
        <div className="solution-heading-row">
          <SectionHeading theme="dark" eyebrow="THE BAVEXA AI LEAD CONVERSION SYSTEM" title={<>One AI System.<br />More Opportunities Captured.</>} copy="BAVEXA sits between your marketing and sales team—responding, qualifying, following up, booking, and passing useful context forward." />
          <div className="system-pill"><span>MARKETING</span><ArrowRight size={14} /><strong>BAVEXA</strong><ArrowRight size={14} /><span>SALES TEAM</span></div>
        </div>
        <div className="solution-grid">
          {solutions.map((solution, index) => {
            const Icon = solutionIcons[index];
            return <article className={`solution-card ${index === 3 ? "solution-card-featured" : ""}`} key={solution.title}><span className="solution-index">0{index + 1}</span><Icon aria-hidden="true" /><h3>{solution.title}</h3><p>{solution.copy}</p>{index === 3 ? <div className="qualification-tags"><span>Service area</span><span>Roof issue</span><span>Timeline</span><span>Readiness</span></div> : null}</article>;
          })}
        </div>
      </div>
    </section>
  );
}

export function ComparisonSection() {
  const without = ["Lead comes in", "Office busy", "Call missed", "Lead waits", "Follow-up delayed", "Opportunity goes cold"];
  const withBavexa = ["Lead comes in", "Response begins", "Lead engaged", "Information collected", "Follow-up continues", "Inspection booked", "Team receives context"];
  return (
    <section className="section comparison-section">
      <div className="container">
        <SectionHeading align="center" eyebrow="A MORE CONSISTENT RESPONSE PROCESS" title="Before vs. After BAVEXA" copy="The difference is not more leads. It’s a clearer path for the opportunities already entering your business." />
        <div className="comparison-grid">
          <article className="comparison-card comparison-before"><div className="comparison-title"><span>WITHOUT BAVEXA</span><i>Manual gaps</i></div><ol>{without.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>)}</ol></article>
          <article className="comparison-card comparison-after"><div className="comparison-title"><span>WITH BAVEXA</span><i>Connected workflow</i></div><ol>{withBavexa.map((item, index) => <li key={item}><span>{index === 5 ? <Check size={13} aria-hidden="true" /> : String(index + 1).padStart(2, "0")}</span>{item}</li>)}</ol></article>
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
          <SectionHeading eyebrow="HOW IT WORKS" title="From New Lead to Booked Inspection." copy="BAVEXA supports the response process around your team, so promising conversations keep moving." />
        </div>
        <ol className="how-list">
          {howItWorks.map((step, index) => (
            <li key={step.number}><span className="how-number">{step.number}</span><div className="how-icon">{[<PhoneMissed key="1" />, <MessageSquareText key="2" />, <SearchCheck key="3" />, <RefreshCw key="4" />, <CalendarCheck2 key="5" />][index]}</div><div><h3>{step.title}</h3><p>{step.copy}</p></div>{index < howItWorks.length - 1 ? <span className="how-line" /> : null}</li>
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

export function AudienceSection() {
  return (
    <section className="section audience-section">
      <div className="container audience-grid">
        <div className="audience-copy">
          <SectionHeading eyebrow="BUILT FOR ROOFING" title="Built for Roofing Companies That Want to Grow." copy="Whether you run a focused local team or operate across multiple locations, BAVEXA is designed around the way roofing opportunities arrive and move." />
          <ul>{audiences.map((item) => <li key={item}><Check size={15} aria-hidden="true" />{item}</li>)}</ul>
          <Button href="/contact">See where leads may be leaking</Button>
        </div>
        <aside className="booking-cta-card" aria-labelledby="booking-cta-title">
          <div className="booking-cta-content">
            <span className="booking-cta-kicker"><CalendarCheck2 size={16} aria-hidden="true" /> Speak With the Founder</span>
            <h3 id="booking-cta-title">Let’s Find Where Your Roofing Leads Are Slipping Away.</h3>
            <p>Book a free strategy call with Basit Amin Bhatti, Founder of BAVEXA, and explore how your lead response, qualification, follow-up, and inspection booking process could be improved.</p>
          </div>
          <div className="booking-cta-action">
            <CalBookingButton />
            <p><Check size={14} aria-hidden="true" /> Free strategy call <span aria-hidden="true">·</span> No obligation</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export function IntegrationsSection() {
  return (
    <section className="section integrations-section">
      <div className="container">
        <SectionHeading align="center" eyebrow="CONNECTED WORKFLOWS" title="Fits Into the Way Your Team Already Works." copy="BAVEXA connects capabilities around your existing lead process where supported—without implying a one-size-fits-all stack." />
        <div className="integration-row">{siteConfig.integrations.map((item, index) => { const Icon = integrationIcons[index]; return <div key={item}><Icon aria-hidden="true" /><span>{item}</span></div>; })}</div>
        <p className="integration-note">Exact connections are confirmed during your audit. No third-party partnership or platform support is implied here.</p>
      </div>
    </section>
  );
}

export function FounderSection() {
  const founder = siteConfig.founder;
  return (
    <section className="section founder-section" id="about">
      <div className="container founder-card">
        <FounderPortrait />
        <div className="founder-copy">
          <span className="eyebrow">MEET THE FOUNDER</span>
          <h2>{founder.name}</h2>
          <p className="founder-role">{founder.role} · {founder.positioning}</p>
          <blockquote>“{founder.message}”</blockquote>
          <a href={founder.website} target="_blank" rel="noreferrer">{founder.cta}</a>
        </div>
        <div className="founder-brand-relationship"><span>THE EXPERT</span><strong>Basit</strong><ArrowRight aria-hidden="true" /><span>THE SYSTEM</span><strong>BAVEXA</strong></div>
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
