"use client";

import { motion, useReducedMotion } from "motion/react";
import { CalendarCheck, Check, MessageSquareText, PhoneCall, UserRoundCheck } from "lucide-react";
import { useEffect, useState } from "react";

const stages = [
  { label: "New lead", icon: PhoneCall },
  { label: "AI response", icon: MessageSquareText },
  { label: "Qualified", icon: UserRoundCheck },
  { label: "Follow-up", icon: MessageSquareText },
  { label: "Booked", icon: CalendarCheck },
  { label: "CRM updated", icon: Check },
];

export function LeadJourney() {
  const reduceMotion = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0);
  const displayedStep = reduceMotion ? stages.length - 1 : activeStep;

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => {
      setActiveStep((step) => (step + 1) % stages.length);
    }, 950);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  return (
    <div className="journey-card" aria-label="Animated BAVEXA lead conversion journey">
      <div className="journey-topbar">
        <span className="journey-live"><i /> LIVE WORKFLOW</span>
        <span>Average first touch</span>
        <strong>Instant</strong>
      </div>

      <div className="journey-body">
        <ol className="journey-rail" aria-label="Lead stages">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const isComplete = index <= displayedStep;
            return (
              <li key={stage.label} className={isComplete ? "stage-complete" : ""} aria-current={index === displayedStep ? "step" : undefined}>
                <motion.span
                  className="stage-icon"
                  animate={{ scale: index === displayedStep && !reduceMotion ? [1, 1.12, 1] : 1 }}
                  transition={{ duration: 0.45 }}
                >
                  <Icon size={15} aria-hidden="true" />
                </motion.span>
                <span>{stage.label}</span>
              </li>
            );
          })}
        </ol>

        <div className="lead-workspace">
          <div className="new-lead-card">
            <div className="card-label"><span>NEW ROOFING LEAD</span><strong>Just now</strong></div>
            <div className="lead-person">
              <span className="avatar">SM</span>
              <div><strong>Sarah M.</strong><span>Roof leak after storm</span></div>
              <span className="source-pill">Web lead</span>
            </div>
          </div>

          <div className={`conversation-card ${displayedStep >= 1 ? "panel-active" : ""}`}>
            <div className="conversation-head">
              <div><span className="status-dot" />BAVEXA CONVERSATION</div>
              <span>SMS</span>
            </div>
            <div className="chat-bubble">Hi Sarah — I can help get a roof inspection started. Is this a residential property?</div>
            <div className="chat-bubble chat-reply">Yes, it’s our home. The leak started after last night’s storm.</div>
          </div>

          <div className="qualification-grid">
            <div className={`qualification-card ${displayedStep >= 2 ? "panel-active" : ""}`}>
              <span className="card-label">QUALIFICATION</span>
              {[
                "Service area confirmed",
                "Residential property",
                "Roofing issue captured",
                "Timeline captured",
              ].map((item, index) => (
                <div key={item} className={displayedStep >= Math.min(4, index + 2) ? "check-visible" : ""}>
                  <Check size={13} aria-hidden="true" /> {item}
                </div>
              ))}
            </div>
            <div className={`booking-card ${displayedStep >= 4 ? "panel-active" : ""}`}>
              <span className="card-label">ROOF INSPECTION</span>
              <strong>Tuesday · 10:30 AM</strong>
              <span className="booked-state"><Check size={13} aria-hidden="true" /> BOOKED</span>
            </div>
          </div>

          <div className={`crm-strip ${displayedStep >= 5 ? "panel-active" : ""}`}>
            <span><Check size={14} aria-hidden="true" /> CRM updated</span>
            <span>Owner notified</span>
            <span>Context attached</span>
          </div>
        </div>
      </div>
    </div>
  );
}
