"use client";

import { ArrowDown, ArrowRight, CalendarCheck2, Check, Database, Headphones, Info, MessageSquare, MessagesSquare, Mic, Sparkles, UserRoundCheck, UserRoundPlus } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { PostCallPreviewModal } from "./PostCallPreviewModal";
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

function MikeAgentPlaceholder() {
  // Replace this isolated panel with the ElevenLabs widget once the agent is approved.
  // No microphone access, recording, or simulated call is started by this placeholder.
  return (
    <div className={styles.agentPanel}>
      <div className={styles.agentBar}><span><Headphones size={14} aria-hidden="true" /> BAVEXA / MIKE</span><span className={styles.previewBadge}>INTERFACE PREVIEW</span></div>
      <div className={styles.agentBody}>
        <div className={styles.avatar} aria-hidden="true"><span className={styles.avatarRing} /><span className={styles.avatarCore}><Mic size={36} strokeWidth={1.5} /></span></div>
        <h2>Hey, I’m Mike.</h2>
        <p>BAVEXA’s AI Roofing Receptionist.</p>
        <div className={styles.voiceBars} aria-hidden="true">{[8, 15, 23, 13, 31, 42, 24, 17, 34, 25, 13, 21, 9].map((height, index) => <i key={index} style={{ height }} />)}</div>
        <button className={`button button-primary ${styles.talkButton}`} type="button" aria-describedby="mike-microphone-note"><Mic size={17} aria-hidden="true" /><span>Talk to Mike — Start Free Demo</span></button>
        <p className={styles.microphoneNote} id="mike-microphone-note">No signup required. Use your microphone to talk with Mike.</p>
      </div>
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
      <section className={styles.experience} aria-label="Mike voice demo preview">
        <div className="container">
          <div className={styles.workspace}>
            <MikeAgentPlaceholder />
            <div className={styles.conversationGuide}>
              <p className={styles.heroEyebrow}>A CONVERSATION, NOT A CONTACT FORM</p>
              <h2>A helpful first response.<br /><span>A clear next step.</span></h2>
              <ul className={styles.capabilities}>
                <li><Check size={15} aria-hidden="true" /> Answers common roofing enquiries</li>
                <li><Check size={15} aria-hidden="true" /> Captures property, issue, and timeline</li>
                <li><Check size={15} aria-hidden="true" /> Helps find a suitable inspection time</li>
              </ul>
              <div className={styles.questionList}><span>TRY ASKING MIKE</span>{sampleQuestions.map((question) => <p key={question}><span aria-hidden="true">“</span>{question}<span aria-hidden="true">”</span></p>)}</div>
              <p className={styles.disclosure}><Info size={16} aria-hidden="true" /><span>Mike is an AI assistant demonstrating a fictional roofing company. This demo does not provide roofing diagnoses or book real inspections.</span></p>
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
