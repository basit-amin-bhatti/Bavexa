"use client";

import { ConversationProvider, useConversationControls, useConversationInput, useConversationMode, type Status } from "@elevenlabs/react";
import { Headphones, LoaderCircle, Mic, MicOff, PhoneOff } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createMikeCallSession } from "./callLifecycle";
import { getVoiceErrorMessage } from "./voiceErrors";
import { createVoiceConnectionAttempt, getVoiceFailureDiagnostic } from "./voiceConnection";
import styles from "./LiveDemo.module.css";

const MIKE_AGENT_ID = "agent_9101m53fkprcfhj9maxv0cxskq9v";
type Phase = "idle" | "starting" | "ending";

export function MikeVoiceAgent() {
  const [error, setError] = useState<string | null>(null);
  const reset = useCallback((message: string | null) => {
    setError(message);
  }, []);
  return <MikeVoiceSession error={error} onReset={reset} onClearError={() => setError(null)} />;
}

function MikeVoiceSession({ error, onReset, onClearError }: {
  error: string | null;
  onReset: (message: string | null) => void;
  onClearError: () => void;
}) {
  const session = useRef(createMikeCallSession());
  const connection = useRef(createVoiceConnectionAttempt());
  const failureHandled = useRef(false);
  const stage = useRef("idle");
  const startedAt = useRef(0);
  const mounted = useRef(true);
  const [phase, setPhase] = useState<Phase>("idle");
  const [transportStatus, setTransportStatus] = useState<Status>("disconnected");
  const transportRef = useRef<Status>("disconnected");

  const logLifecycle = useCallback((event: string) => {
    console.info("[BAVEXA voice] Lifecycle", JSON.stringify({ event, stage: stage.current, elapsedMs: startedAt.current ? Math.round(performance.now() - startedAt.current) : 0 }));
  }, []);

  useEffect(() => {
    const current = session.current;
    const attempt = connection.current;
    mounted.current = true;
    current.activate();
    return () => {
      if (startedAt.current) logLifecycle("provider-unmount");
      mounted.current = false; current.dispose(); attempt.cancel();
    };
  }, [logLifecycle]);

  const handleFailure = useCallback((problem: unknown, disconnect?: Parameters<typeof getVoiceFailureDiagnostic>[2]) => {
    if (!mounted.current || failureHandled.current) return;
    failureHandled.current = true;
    session.current.fail();
    connection.current.fail(problem);
    if (transportRef.current === "disconnected") setPhase("idle");
    logLifecycle("sdk-error");
    console.error("[BAVEXA voice] Connection failure", JSON.stringify(getVoiceFailureDiagnostic(problem, stage.current, disconnect)));
    // An SDK error is not a request to unmount/end the provider. In particular,
    // callbacks may fire while negotiation or SDK teardown is still in flight.
    // Let the SDK settle; only explicit hang-up/cancel/timeout requests teardown.
    onReset(getVoiceErrorMessage(problem));
  }, [onReset, logLifecycle]);

  const handleEnd = useCallback((connected: boolean) => {
    logLifecycle(connected ? "user-end-request" : "cancel-request");
    stage.current = "ending";
    setPhase("ending");
    if (!connected) { session.current.cancel(); connection.current.cancel(); }
    else session.current.requestEnd();
  }, [logLifecycle]);

  return (
    <ConversationProvider
      onConnect={({ conversationId }) => {
        if (!conversationId.trim()) { handleFailure("Missing conversation identifier"); return; }
        session.current.connect(conversationId);
        stage.current = "connected";
        logLifecycle("sdk-connected");
        connection.current.connected();
        setPhase("idle");
      }}
      onDisconnect={(details) => {
        logLifecycle("sdk-disconnected");
        const outcome = session.current.disconnect(details);
        if (outcome === "error" || details.reason === "error") handleFailure(details.reason === "error" ? details.message : "WebRTC signaling connection closed unexpectedly", details);
        else if (connection.current.pending) handleFailure("Connection closed before connecting");
        setPhase("idle");
      }}
      onMessage={({ role, message }) => {
        if (message.trim()) session.current.message(role);
      }}
      onStatusChange={({ status }) => {
        transportRef.current = status;
        setTransportStatus(status);
        logLifecycle(`sdk-status-${status}`);
        if (status === "disconnected") setPhase("idle");
      }}
      onError={(message, context: unknown) => handleFailure(context instanceof Error ? context : message)}
    >
      <MikeVoiceControls
        phase={phase}
        transportStatus={transportStatus}
        error={error}
        onStart={() => {
          startedAt.current = performance.now(); failureHandled.current = false;
          stage.current = "starting"; logLifecycle("start-request");
          session.current.begin(); onClearError(); setPhase("starting");
        }}
        startConnection={(startSession) => {
          stage.current = "connecting";
          return connection.current.start(startSession);
        }}
        onEnd={handleEnd}
        onFailure={handleFailure}
      />
    </ConversationProvider>
  );
}

function MikeVoiceControls({ phase, transportStatus, error, onStart, startConnection, onEnd, onFailure }: {
  phase: Phase;
  transportStatus: Status;
  error: string | null;
  onStart: () => void;
  startConnection: (startSession: () => void) => Promise<void>;
  onEnd: (connected: boolean) => void;
  onFailure: (problem: unknown) => void;
}) {
  const { startSession, endSession } = useConversationControls();
  const { isMuted, setMuted } = useConversationInput();
  const { isSpeaking } = useConversationMode();
  const starting = phase === "starting" || transportStatus === "connecting";
  const ending = phase === "ending";
  const connected = transportStatus === "connected";
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
      onEnd(false);
      endSession();
    }, 30_000);
    return () => window.clearTimeout(timeout);
  }, [phase, endSession, onFailure, onEnd]);

  const start = async () => {
    if (startLock.current || connected || starting || ending) return;
    startLock.current = true;
    onStart();
    try {
      if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) throw new Error("Unsupported secure context");
      if (!navigator.onLine) throw new Error("Network offline");
      // The installed SDK requests microphone permission before creating a connection,
      // and owns/reclaims its tracks. Do not run a second capture/stop cycle here.
      // The React hook returns void; this promise rejects from onError or a failed disconnect.
      await startConnection(() => startSession({ agentId: MIKE_AGENT_ID, connectionType: "webrtc" }));
    } catch (problem) {
      if (active.current && !(problem instanceof DOMException && problem.name === "AbortError")) onFailure(problem);
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
    try { setMuted(!isMuted); } catch (problem) { onFailure(problem); }
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
