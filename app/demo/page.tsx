import type { Metadata } from "next";
import { ArrowRight, CalendarDays, Check, FileSpreadsheet, Headphones, Layers3, ShieldCheck } from "lucide-react";
import { CalBookingButton } from "@/components/CalBookingButton";
import { LiveAiDemo } from "@/components/demo/LiveAiDemo";
import styles from "@/components/demo/LiveDemo.module.css";

const description = "Meet Mike, BAVEXA’s AI roofing receptionist. Explore the voice demo interface and example lead capture, inspection booking, and CRM workflows.";

export const metadata: Metadata = {
  title: "Live AI Demo — Meet Mike",
  description,
  alternates: { canonical: "/demo" },
  openGraph: {
    title: "Meet Mike — Your AI Roofing Receptionist | BAVEXA",
    description,
    url: "/demo",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "BAVEXA AI Lead Conversion System" }],
  },
  twitter: { card: "summary_large_image", title: "Live AI Demo — Meet Mike | BAVEXA", description, images: ["/og.png"] },
};

function AutomationExamples() {
  return (
    <div className={styles.resultGrid}>
      <article className={styles.resultCard}>
        <div className={styles.cardTop}><span className={styles.appIcon}><FileSpreadsheet size={21} aria-hidden="true" /></span><span className={styles.sampleLabel}>SAMPLE INTEGRATION PREVIEW</span></div>
        <h3>Lead Spreadsheet</h3>
        <p>Every detail, ready for your team.</p>
        <div className={styles.sheetPreview}>
          <div className={styles.previewBar}><FileSpreadsheet size={13} aria-hidden="true" /> Roofing lead log <span>EXAMPLE</span></div>
          <table>
            <caption className={styles.srOnly}>Example spreadsheet lead information</caption>
            <thead><tr><th scope="col">Field</th><th scope="col">Lead details</th></tr></thead>
            <tbody>
              <tr><th scope="row">Name</th><td>Jordan Taylor</td></tr>
              <tr><th scope="row">Service</th><td>Roof leak inspection</td></tr>
              <tr><th scope="row">Property</th><td>Residential</td></tr>
              <tr><th scope="row">Timeline</th><td>This week</td></tr>
            </tbody>
          </table>
        </div>
        <div className={styles.transcript}><span>EXAMPLE TRANSCRIPT</span><p>“We noticed a leak after the storm. Could someone come out to inspect the roof this week?”</p></div>
        <div className={styles.cardFoot}><Check size={14} aria-hidden="true" /> Lead details + conversation context</div>
      </article>

      <article className={styles.resultCard}>
        <div className={styles.cardTop}><span className={styles.appIcon}><CalendarDays size={21} aria-hidden="true" /></span><span className={styles.sampleLabel}>SAMPLE INTEGRATION PREVIEW</span></div>
        <h3>Inspection Calendar</h3>
        <p>A clear next step for the homeowner.</p>
        <div className={styles.calendarPreview}>
          <div className={styles.previewBar}>Inspection calendar <span>EXAMPLE</span></div>
          <div className={styles.calendarDate}><div><span>OCT</span><strong>21</strong></div><p>Wednesday<strong>10:30 – 11:15 AM</strong></p></div>
          <div className={styles.calendarEvent}><span>ROOF INSPECTION</span><strong>Jordan Taylor · Residential</strong><p>Roof leak after storm</p><small><CalendarDays size={13} aria-hidden="true" /> Sample inspection slot</small></div>
        </div>
        <div className={styles.cardFoot}><Check size={14} aria-hidden="true" /> Appointment + relevant lead details</div>
      </article>

      <article className={styles.resultCard}>
        <div className={styles.cardTop}><span className={styles.appIcon}><Layers3 size={21} aria-hidden="true" /></span><span className={styles.sampleLabel}>SAMPLE INTEGRATION PREVIEW</span></div>
        <h3>CRM Integration</h3>
        <p>Context your sales team can act on.</p>
        <div className={styles.crmPreview}>
          <div className={styles.previewBar}>Lead record <span>EXAMPLE</span></div>
          <div className={styles.crmContact}><span>JT</span><div><strong>Jordan Taylor</strong><small>Residential homeowner</small></div></div>
          <dl>
            <div><dt>Email</dt><dd>jordan@example.com</dd></div>
            <div><dt>Phone</dt><dd>(202) 555-0142</dd></div>
            <div><dt>Source</dt><dd>AI phone enquiry</dd></div>
            <div><dt>Lead status</dt><dd><span className={styles.qualified}><Check size={11} aria-hidden="true" /> Qualified</span></dd></div>
          </dl>
          <div className={styles.crmNext}><ArrowRight size={13} aria-hidden="true" /> Next step: roof inspection</div>
        </div>
        <div className={styles.cardFoot}><Check size={14} aria-hidden="true" /> Contact details + qualification status</div>
      </article>
    </div>
  );
}

export default function DemoPage() {
  return (
    <main className={styles.page}>
      <section className={styles.intro} aria-labelledby="mike-title">
        <div className="container">
          <div className={styles.introCopy}>
            <p className={styles.heroEyebrow}><Headphones size={14} aria-hidden="true" /> THE BAVEXA VOICE EXPERIENCE</p>
            <h1 id="mike-title">Meet Mike — Your <br className={styles.desktopBreak} /><span>AI Roofing Receptionist</span></h1>
            <p className={styles.subtitle}><span className={styles.desktopDescription}>Experience how BAVEXA answers roofing inquiries, qualifies leads, and helps book appointments — automatically, 24/7.</span><span className={styles.mobileDescription}>Meet your 24/7 AI receptionist for roofing inquiries, lead qualification, and inspection booking.</span></p>
            <p className={styles.introNote}>Explore the experience of speaking with an AI receptionist, from the first question to the next step.</p>
          </div>
        </div>
      </section>

      <LiveAiDemo examples={<AutomationExamples />} />

      <section className={styles.conversion} aria-labelledby="demo-consultation-title">
        <div className="container">
          <div className={styles.conversionCard}>
            <div><p className={styles.heroEyebrow}>YOUR ROOFING COMPANY. YOUR WORKFLOW.</p><h2 id="demo-consultation-title">Ready to Put AI to Work for Your Roofing Business?</h2><p>Talk with Basit about your lead process and see where BAVEXA could fit.</p></div>
            <div className={styles.conversionAction}><CalBookingButton label="Book a Free Consultation" className="button button-primary" /><span><ShieldCheck size={14} aria-hidden="true" /> Free strategy call · No obligation</span></div>
          </div>
        </div>
      </section>
    </main>
  );
}
