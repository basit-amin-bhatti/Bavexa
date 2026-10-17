/** Frontend-only bridge for verified voice SDK callbacks; never emit from a button click. */
export type MikeCallEvent =
  | { type: "connected"; callId: string }
  | { type: "disconnected"; callId: string; outcome: "completed" | "cancelled" | "error" };

type Listener = (event: MikeCallEvent) => void;
const listeners = new Set<Listener>();

export function subscribeToMikeCallLifecycle(listener: Listener) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

/** Call exclusively from the real agent's connected/disconnected callbacks. */
export function reportMikeCallLifecycle(event: MikeCallEvent) {
  if (!event.callId.trim()) return;
  for (const listener of listeners) listener(event);
}

/** A session must connect before a successful disconnect can open the preview. */
export function createCompletedCallGate(onCompleted: (callId: string) => void): Listener {
  const connected = new Set<string>();
  const ended = new Set<string>();

  return (event) => {
    if (!event.callId.trim() || ended.has(event.callId)) return;
    if (event.type === "connected") {
      connected.add(event.callId);
      return;
    }

    const wasConnected = connected.delete(event.callId);
    ended.add(event.callId);
    if (wasConnected && event.outcome === "completed") onCompleted(event.callId);
  };
}

/** Maps verified SDK callbacks to the preview gate, suppressing failed/cancelled sessions. */
export function createMikeCallSession(report: Listener = reportMikeCallLifecycle) {
  let callId: string | null = null;
  let failed = false;
  let cancelled = false;
  let disposed = false;

  return {
    activate() { disposed = false; },
    begin() { callId = null; failed = false; cancelled = false; },
    connect(id: string) {
      if (disposed || cancelled || failed || !id.trim()) return;
      callId = id;
      report({ type: "connected", callId: id });
    },
    fail() { failed = true; },
    cancel() { cancelled = true; },
    dispose() { disposed = true; callId = null; },
    disconnect(reason: "user" | "agent" | "error") {
      const id = callId;
      callId = null;
      if (disposed || !id) return;
      report({
        type: "disconnected",
        callId: id,
        outcome: failed || reason === "error" ? "error" : cancelled ? "cancelled" : "completed",
      });
    },
  };
}
