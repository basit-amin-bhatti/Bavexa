"use client";

import { ConversationProvider, useConversationControls, useConversationInput, useConversationMode, useConversationStatus } from "@elevenlabs/react";
import { Headphones, LoaderCircle, Mic, MicOff, PhoneOff } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createMikeCallSession } from "./callLifecycle";
import { getVoiceErrorMessage } from "./voiceErrors";
import styles from "./LiveDemo.module.css";

const MIKE_AGENT_ID = "agent_9101m53fkprcfhj9maxv0cxskq9v";
type Phase = "idle" | "starting" | "ending";

export function MikeVoiceAgent() {
  const [attempt, setAttempt] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const reset = useCallback((message: string | null) => {
    setError(message);
    setAttempt(value => value + 1);
  }, []);
  return <MikeVoiceSession key={attempt} error={error} onReset={reset} onClearError={() => setError(null)} />;
}

function MikeVoiceSession({ error, onReset, onClearError }: {
  error: string | null;
  onReset: (message: string | null) => void;
  onClearError: () => void;
}) {
  const session = useRef(createMikeCallSession());
  const mounted = useRef(true);
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    const current = session.current;
    mounted.current = true;
    current.activate();
    return () => { mounted.current = false; current.dispose(); };
  }, []);

  const handleFailure = useCallback((problem: unknown) => {
    if (!mounted.current) return;
    session.current.fail();
    // A fresh provider clears any pending SDK lock, making retry/cancel reliable.
    // Its cleanup ends the old session and releases owned media tracks.
    onReset(getVoiceErrorMessage(problem));
  }, [onReset]);

  return (
    <ConversationProvider
      onConnect={({ conversationId }) => {
        session.current.connect(conversationId);
        setPhase("idle");
      }}
      onDisconnect={(details) => {
        session.current.disconnect(details.reason);
        if (details.reason === "error") handleFailure(details.message);
        setPhase("idle");
      }}
      onStatusChange={({ status }) => {
        if (status === "disconnected") setPhase("idle");
      }}
      onError={(message, context: unknown) => handleFailure(context instanceof Error ? context : message)}
    >
      <MikeVoiceControls
        phase={phase}
        error={error}
        onStart={() => { session.current.begin(); onClearError(); setPhase("starting"); }}
        onEnd={(connected) => {
          if (!connected) { session.current.cancel(); onReset(null); }
          else setPhase("ending");
        }}
        onFailure={handleFailure}
      />
    </ConversationProvider>
  );
}

function MikeVoiceControls({ phase, error, onStart, onEnd, onFailure }: {
  phase: Phase;
  error: string | null;
  onStart: () => void;
  onEnd: (connected: boolean) => void;
  onFailure: (problem: unknown) => void;
}) {
  const { startSession, endSession } = useConversationControls();
  const { status } = useConversationStatus();
  const { isMuted, setMuted } = useConversationInput();
  const { isSpeaking } = useConversationMode();
  const starting = phase === "starting" || status === "connecting";
  const ending = phase === "ending";
  const connected = status === "connected";
  const startLock = useRef(false);
  const active = useRef(true);

  useEffect(() => {
    active.current = true;
    return () => { active.current = false; };
  }, []);

  useEffect(() => {
    if (phase !== "starting") return;
    const timeout = window.setTimeout(() => {
      onFailure("Connection timed out");
      endSession();
    }, 30_000);
    return () => window.clearTimeout(timeout);
  }, [phase, endSession, onFailure]);

  const start = async () => {
    if (startLock.current || connected || starting || ending) return;
    startLock.current = true;
    onStart();
    try {
      if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) throw new Error("Unsupported secure context");
      if (!navigator.onLine) throw new Error("Network offline");
      // Ask before opening a paid session; release this preflight stream immediately.
      // The SDK owns the actual call's media tracks and their cleanup.
      const microphone = await navigator.mediaDevices.getUserMedia({ audio: true });
      microphone.getTracks().forEach(track => track.stop());
      if (!active.current) return; // Cancelled, timed out, or navigated away during the prompt.
      startSession({ agentId: MIKE_AGENT_ID, connectionType: "webrtc" });
    } catch (problem) {
      onFailure(problem);
    } finally {
      // The SDK also guards duplicate in-flight starts.
      startLock.current = false;
    }
  };

  const stop = () => {
    onEnd(connected);
    endSession();
  };

  const toggleMute = () => {
    try { setMuted(!isMuted); } catch (problem) { onFailure(problem); endSession(); }
  };

  const stateLabel = ending ? "ENDING CALL" : starting ? "CONNECTING" : connected ? isSpeaking ? "MIKE IS SPEAKING" : isMuted ? "MICROPHONE MUTED" : "LISTENING TO YOU" : "READY TO TALK";

  return (
    <>
      <div className={styles.agentBar}><span><Headphones size={14} aria-hidden="true" /> BAVEXA / MIKE</span><span className={styles.previewBadge}>{stateLabel}</span></div>
      <div className={styles.agentBody}>
        <div className={styles.avatar} aria-hidden="true"><span className={styles.avatarRing} /><span className={styles.avatarCore}>{isMuted && connected ? <MicOff size={36} strokeWidth={1.5} /> : <Mic size={36} strokeWidth={1.5} />}</span></div>
        <h2>Hey, I’m Mike.</h2>
        <p>BAVEXA’s AI Roofing Receptionist.</p>
        <div className={`${styles.voiceBars} ${connected && isSpeaking ? styles.voiceBarsSpeaking : ""}`} aria-hidden="true">{[8, 15, 23, 13, 31, 42, 24, 17, 34, 25, 13, 21, 9].map((height, index) => <i key={index} style={{ height, animationDelay: `${index * 60}ms` }} />)}</div>
        <div className={connected || starting ? styles.callControls : undefined}>
          {connected ? (
            <button className={`button button-primary ${styles.talkButton}`} type="button" onClick={stop} disabled={ending}><PhoneOff size={17} aria-hidden="true" /><span>{ending ? "Ending Call…" : "End Call"}</span></button>
          ) : (
            <button className={`button button-primary ${styles.talkButton}`} type="button" onClick={start} disabled={starting || ending} aria-busy={starting || ending} aria-describedby="mike-microphone-note">{starting || ending ? <LoaderCircle size={17} aria-hidden="true" /> : <Mic size={17} aria-hidden="true" />}<span>{ending ? "Ending Call…" : starting ? "Connecting to Mike…" : "Talk to Mike — Start Free Demo"}</span></button>
          )}
          {connected ? <button className={styles.muteButton} type="button" onClick={toggleMute} disabled={ending} aria-pressed={isMuted} aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}>{isMuted ? <MicOff size={17} aria-hidden="true" /> : <Mic size={17} aria-hidden="true" />}<span>{isMuted ? "Unmute" : "Mute"}</span></button> : starting && !ending ? <button className={styles.muteButton} type="button" onClick={stop}>Cancel</button> : null}
        </div>
        <p className={styles.microphoneNote} id="mike-microphone-note" role="status" aria-live="polite">{connected ? isSpeaking ? "Mike is speaking. You can interrupt naturally." : isMuted ? "Your microphone is muted. Unmute when you’re ready." : "Mike is listening. Go ahead and ask a roofing question." : starting ? "Allow microphone access when your browser asks." : "No signup required. Use your microphone to talk with Mike."}</p>
        {error ? <p className={styles.voiceError} role="alert">{error}</p> : null}
      </div>
    </>
  );
}
