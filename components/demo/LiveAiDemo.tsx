"use client";

import { ArrowDown, ArrowRight, CalendarCheck2, Check, Database, Info, MessageSquare, MessagesSquare, Sparkles, UserRoundCheck, UserRoundPlus } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { PostCallPreviewModal } from "./PostCallPreviewModal";
import { MikeVoiceAgent } from "./MikeVoiceAgent";
import { createCompletedCallGate, subscribeToMikeCallLifecycle } from "./callLifecycle";
import styles from "./LiveDemo.module.css";

const sampleQuestions = [
  "I have a roof leak. Can you help?",
  "Do you handle storm damage inspections?",
  "Can I book a roof inspection this week?",
];

const agentWorkflow = [
  { label: "New Lead", icon: UserRoundPlus },
  { label: "AI Response", icon: MessageSquare },
  { label: "Qualified", icon: UserRoundCheck },
  { label: "Follow-up", icon: MessagesSquare },
  { label: "Booked", icon: CalendarCheck2 },
  { label: "CRM Updated", icon: Database },
];

function MikeAgentPanel() {
  return (
    <div className={styles.agentPanel}>
      <MikeVoiceAgent />
      <ol className={styles.agentFooter} aria-label="BAVEXA lead conversion workflow">
        {agentWorkflow.map(({ label, icon: Icon }, index) => (
          <li key={label} className={styles.workflowStep}>
            <span className={styles.workflowMarker}><span>{String(index + 1).padStart(2, "0")}</span><Icon size={14} strokeWidth={1.7} aria-hidden="true" /></span>
            <b>{label}</b>
            {index < agentWorkflow.length - 1 ? <ArrowRight size={11} className={styles.workflowArrow} aria-hidden="true" /> : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function LiveAiDemo({ examples }: { examples: ReactNode }) {
  const [postCallOpen, setPostCallOpen] = useState(false);

  useEffect(() => {
    const gate = createCompletedCallGate(() => setPostCallOpen(true));
    return subscribeToMikeCallLifecycle(gate);
  }, []);

  return (
    <>
      <section className={styles.experience} aria-label="Mike live voice demo">
        <div className="container">
          <div className={styles.workspace}>
            <MikeAgentPanel />
            <div className={styles.conversationGuide}>
              <p className={`${styles.heroEyebrow} ${styles.desktopExistingCopy}`}>A CONVERSATION, NOT A CONTACT FORM</p>
              <h2>A helpful first response.<br /><span>A clear next step.</span></h2>
              <ul className={styles.capabilities}>
                <li><Check size={15} aria-hidden="true" /><span className={styles.desktopExistingCopy}>Answers common roofing enquiries</span><span className={styles.desktopRefinedCopy}>Answers roofing questions</span></li>
                <li><Check size={15} aria-hidden="true" /><span className={styles.desktopExistingCopy}>Captures property, issue, and timeline</span><span className={styles.desktopRefinedCopy}>Captures key lead details</span></li>
                <li><Check size={15} aria-hidden="true" /><span className={styles.desktopExistingCopy}>Helps find a suitable inspection time</span><span className={styles.desktopRefinedCopy}>Helps book inspections</span></li>
              </ul>
              <div className={styles.questionList}><span>TRY ASKING MIKE</span>{sampleQuestions.map((question) => <p key={question}><span aria-hidden="true">“</span>{question}<span aria-hidden="true">”</span></p>)}</div>
              <p className={styles.disclosure}><Info size={16} aria-hidden="true" /><span className={styles.desktopExistingCopy}>Mike is an AI assistant demonstrating a fictional roofing company. This demo does not provide roofing diagnoses or book real inspections.</span><span className={styles.desktopRefinedCopy}>AI demo for a fictional roofing company. No roofing diagnoses or real inspection bookings.</span></p>
            </div>
          </div>
          <div className={styles.experienceBridge}><span>THE CONVERSATION IS JUST THE START</span><ArrowDown size={16} aria-hidden="true" /></div>
        </div>
      </section>

      <section className={styles.automation} aria-labelledby="automation-title">
        <div className="container">
          <div className={styles.automationHeading}>
            <p className="eyebrow"><Sparkles size={14} aria-hidden="true" /> BEYOND THE CALL</p>
            <h2 id="automation-title">From conversation to team-ready context.</h2>
            <p>Sample integration previews — not results from your call.</p>
          </div>
          <div id="demo-automation-results" className={styles.results}>
            {examples}
          </div>
          <p className={styles.integrationNote}>Nothing is saved or synchronized. Real integrations are configured for customers after purchase.</p>
        </div>
      </section>
      <PostCallPreviewModal open={postCallOpen} onClose={() => setPostCallOpen(false)}>
        {examples}
      </PostCallPreviewModal>
    </>
  );
}
