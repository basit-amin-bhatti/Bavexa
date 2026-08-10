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
  Sparkles,
  Target,
  Workflow,
} from "lucide-react";
import { AuditForm } from "@/components/AuditForm";
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
  outcomes,
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
            <Button href="/how-it-works" variant="secondary">{siteConfig.ctas.secondary}</Button>
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
    <section className="section dark-section solution-section">
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

export function HowItWorksSection({ showCta = true }: { showCta?: boolean }) {
  return (
    <section className="section how-section">
      <div className="container">
        <div className="section-split-heading">
          <SectionHeading eyebrow="HOW IT WORKS" title="From New Lead to Booked Inspection." copy="BAVEXA supports the response process around your team, so promising conversations keep moving." />
          {showCta ? <Button href="/how-it-works" variant="secondary">Explore the full workflow</Button> : null}
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

export function DemoSection({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`section demo-section ${compact ? "demo-section-compact" : ""}`}>
      <div className="container demo-layout">
        <div className="demo-copy">
          <SectionHeading theme="dark" eyebrow="60-SECOND PRODUCT DEMO" title="See a Roofing Lead Move Through BAVEXA." copy="Watch the complete journey from first contact to qualified inspection opportunity." />
          <ol className="demo-stage-inline">{["Incoming Lead", "AI Conversation", "Qualification", "SMS Follow-Up", "Inspection Booking", "CRM Update"].map((stage, index) => <li key={stage}><span>{String(index + 1).padStart(2, "0")}</span>{stage}</li>)}</ol>
          <p className="demo-sound-note">No autoplay. No customer footage. Just the product workflow.</p>
        </div>
        <DemoExperience compact={compact} />
      </div>
    </section>
  );
}

export function OutcomesSection() {
  return (
    <section className="section outcomes-section">
      <div className="container">
        <div className="section-split-heading">
          <SectionHeading eyebrow="OPERATIONAL OUTCOMES" title="Designed to Help Your Team Capture More of What You’re Already Generating." />
          <p className="illustrative-note"><Sparkles size={15} aria-hidden="true" /> Product interface below is illustrative—not customer performance data.</p>
        </div>
        <div className="outcomes-dashboard">
          <div className="dashboard-topbar"><span>LEAD CONVERSION OVERVIEW</span><div><i /> Workflow active</div></div>
          <div className="outcome-grid">
            {outcomes.map((outcome, index) => (
              <article key={outcome}><span>{["RESPONSE", "SPEED", "QUALITY", "BOOKING", "EFFICIENCY", "CONTEXT"][index]}</span><strong>{outcome}</strong><div className={`outcome-visual visual-${index + 1}`}><i /><i /><i /><i /></div><p>{[
                "More enquiries enter an active conversation.",
                "New leads receive an earlier first touch.",
                "The team sees useful qualification context.",
                "Suitable prospects get a clear next step.",
                "Structured sequences reduce repetitive chasing.",
                "Lead status and conversation details stay cleaner.",
              ][index]}</p></article>
            ))}
          </div>
        </div>
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
        <figure className="audience-photo"><Image src="/images/roofing-commercial.jpg" alt="Roofing professional inspecting a modern commercial building roof" fill sizes="(max-width: 900px) 100vw, 48vw" /><figcaption><strong>Residential + commercial</strong><span>One consistent lead-conversion process</span></figcaption></figure>
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
    <section className="section founder-section">
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

export function AboutSection() {
  return (
    <section className="section about-section">
      <div className="container about-grid">
        <div><span className="about-mark">B</span><p>AI Lead Qualification<br />&amp; Follow-Up</p></div>
        <div><span className="eyebrow">ABOUT BAVEXA</span><h2>Built to Fix the Gap Between Lead Generation and Sales.</h2></div>
        <div><p>Roofing companies spend money generating leads, but opportunities can still be lost because calls are missed, responses are delayed, follow-up becomes inconsistent, or the next step never gets booked.</p><p>BAVEXA uses AI and automation to help roofing companies respond, qualify, follow up with, and move suitable prospects toward booked roof inspections.</p><strong>Founded by Basit Amin Bhatti, BAVEXA is focused specifically on helping roofing companies create a faster and more consistent lead-conversion process.</strong></div>
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

export function FinalCtaSection() {
  return (
    <section className="final-cta-section">
      <div className="container final-cta-grid">
        <div><span className="eyebrow">CAPTURE MORE OF WHAT YOU ALREADY HAVE</span><h2>You Don’t Necessarily Need More Roofing Leads.<br /><em>You Need to Capture More of the Ones You Already Have.</em></h2></div>
        <div><p>See where opportunities may be slipping through your current process and what a faster lead-response system could look like.</p><div className="final-actions"><Button href="/contact">{siteConfig.ctas.primary}</Button><Button href="/demo" variant="dark">{siteConfig.ctas.demo}</Button></div></div>
      </div>
    </section>
  );
}

export function PageHero({ eyebrow, title, copy, aside }: { eyebrow: string; title: string; copy: string; aside?: React.ReactNode }) {
  return (
    <section className="page-hero"><div className="container page-hero-grid"><div><span className="hero-eyebrow"><i />{eyebrow}</span><h1>{title}</h1><p>{copy}</p><div className="hero-actions"><Button href="/contact">{siteConfig.ctas.primary}</Button><Button href="/demo" variant="secondary">Watch the Demo</Button></div></div>{aside ? <div>{aside}</div> : null}</div></section>
  );
}

export function CompactAuditCta() {
  return <section className="compact-audit-cta"><div className="container"><div><span>FREE LEAD CONVERSION AUDIT</span><h2>See where roofing leads may be slipping through.</h2></div><Button href="/contact">Get Your Free Audit</Button></div></section>;
}
