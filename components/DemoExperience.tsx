"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check, Clock3, Play, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const demoStages = ["Incoming Lead", "AI Conversation", "Qualification", "SMS Follow-Up", "Inspection Booking", "CRM Update"];

export function DemoExperience({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    dialog?.focus();
    document.body.style.overflow = "hidden";

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab" || !dialog) return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>("button, a[href], video[controls], [tabindex]:not([tabindex='-1'])"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
      previous?.focus();
    };
  }, [open]);

  return (
    <>
      <button className={`demo-poster ${compact ? "demo-poster-compact" : ""}`} type="button" onClick={() => setOpen(true)} aria-label="Open the 60-second BAVEXA workflow demo">
        <div className="demo-browser-bar"><i /><i /><i /><span>bavexa / lead-conversion</span><em>LIVE PREVIEW</em></div>
        <div className="demo-canvas">
          <div className="demo-lead-list">
            <span>ROOFING LEADS</span>
            <div className="demo-person active"><b>SM</b><span>Sarah M.<small>Roof leak after storm</small></span><i>NOW</i></div>
            <div className="demo-person"><b>JW</b><span>James W.<small>Roof replacement</small></span><i>12m</i></div>
            <div className="demo-person"><b>LT</b><span>Lisa T.<small>Commercial inspection</small></span><i>28m</i></div>
          </div>
          <div className="demo-thread">
            <span className="demo-thread-label">CONVERSATION ACTIVE</span>
            <div className="demo-message">Hi Sarah — is this a residential property?</div>
            <div className="demo-message reply">Yes. The roof began leaking after the storm.</div>
            <div className="demo-summary"><Check size={14} aria-hidden="true" /> Qualified · inspection options sent</div>
          </div>
          <div className="demo-booking">
            <span>INSPECTION</span><strong>Tue · 10:30 AM</strong><i><Check size={13} aria-hidden="true" /> BOOKED</i>
          </div>
          <span className="play-control"><Play fill="currentColor" aria-hidden="true" /></span>
          <span className="demo-duration"><Clock3 size={13} aria-hidden="true" /> 60-SECOND DEMO</span>
        </div>
        <span className="demo-watch">Watch the workflow <ArrowRight size={17} aria-hidden="true" /></span>
      </button>

      <AnimatePresence>
        {open ? <DemoModal onClose={() => setOpen(false)} dialogRef={dialogRef} /> : null}
      </AnimatePresence>
    </>
  );
}

function DemoModal({ onClose, dialogRef }: { onClose: () => void; dialogRef: React.RefObject<HTMLDivElement | null> }) {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const displayedStep = reduceMotion ? demoStages.length - 1 : step;

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => setStep((current) => (current + 1) % demoStages.length), 1200);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  return (
    <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
      <motion.div
        className="demo-modal"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-modal-title"
        tabIndex={-1}
        initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.98 }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div><span>PRODUCT WALKTHROUGH</span><h2 id="demo-modal-title">A roofing lead moving through BAVEXA</h2></div>
          <button type="button" onClick={onClose} aria-label="Close demo"><X aria-hidden="true" /></button>
        </div>
        <div className="modal-workflow">
          <div className="modal-video-placeholder">
            <span className="demo-stage-count">{String(displayedStep + 1).padStart(2, "0")} / 06</span>
            <motion.div key={displayedStep} initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="active-demo-stage">
              <span>{demoStages[displayedStep]}</span>
              <strong>{[
                "New enquiry: roof leak after storm",
                "BAVEXA responds and starts the conversation",
                "Property, issue, location, and timeline captured",
                "A structured next step keeps the lead engaged",
                "Tuesday at 10:30 AM selected",
                "Status and conversation context sent to the team",
              ][displayedStep]}</strong>
              <i><Check size={16} aria-hidden="true" /> Workflow active</i>
            </motion.div>
            <div className="demo-progress"><span style={{ width: `${((displayedStep + 1) / demoStages.length) * 100}%` }} /></div>
          </div>
          <ol className="modal-stage-list">
            {demoStages.map((stage, index) => (
              <li key={stage} className={index <= displayedStep ? "active" : ""}><span>{String(index + 1).padStart(2, "0")}</span>{stage}{index <= displayedStep ? <Check size={14} aria-hidden="true" /> : null}</li>
            ))}
          </ol>
        </div>
        <div className="modal-note">
          <p><strong>Demo-ready setup.</strong> Add <code>/public/demo/bavexa-demo.mp4</code> to replace this product walkthrough with the final 60-second video.</p>
          <a href="/contact">Get your free audit <ArrowRight size={15} aria-hidden="true" /></a>
        </div>
      </motion.div>
    </motion.div>
  );
}
