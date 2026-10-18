/** React SDK 1.18 startSession returns void. Await its verified lifecycle, not that void return. */
export function createVoiceConnectionAttempt() {
  let pending: { promise: Promise<void>; resolve: () => void; reject: (problem: unknown) => void } | null = null;

  return {
    start(startSession: () => void): Promise<void> {
      if (pending) return pending.promise;
      let resolve!: () => void;
      let reject!: (problem: unknown) => void;
      const promise = new Promise<void>((onConnected, onFailure) => { resolve = onConnected; reject = onFailure; });
      pending = { promise, resolve, reject };
      try { startSession(); } catch (problem) { this.fail(problem); }
      return promise;
    },
    connected() {
      const attempt = pending;
      pending = null;
      attempt?.resolve();
    },
    fail(problem: unknown) {
      const attempt = pending;
      pending = null;
      attempt?.reject(problem);
    },
    cancel() {
      this.fail(new DOMException("Connection cancelled", "AbortError"));
    },
    get pending() { return pending !== null; },
  };
}

/** Allowlisted diagnostic fields only: no token, URL, transcript, or raw provider payload. */
export function getVoiceFailureDiagnostic(problem: unknown, stage: string, disconnect?: {
  reason: "user" | "agent" | "error";
  context?: { type: string; code?: number };
  closeCode?: number;
}) {
  const name = problem instanceof Error ? problem.name : "";
  const message = problem instanceof Error ? problem.message : typeof problem === "string" ? problem : "";
  const detail = `${name} ${message}`.toLowerCase();
  const status = /(?:returned|status|http)\s*[:=]?\s*(4\d\d|5\d\d)\b/i.exec(message)?.[1];
  const category = /notallowed|permission|denied|notfound|notreadable/.test(detail) ? "microphone"
    : /secure context|unsupported/.test(detail) ? "browser"
    : /conversation token|signed url/.test(detail) ? "token-request"
    : /\bice\b|peerconnection|webrtc|signall?ing|\brtc\b|\broom\b/.test(detail) ? "webrtc"
    : /timeout|timed out/.test(detail) ? "timeout"
    : /network|offline|fetch/.test(detail) ? "network" : "sdk";
  const closeCode = disconnect?.closeCode ?? disconnect?.context?.code;
  const context = disconnect?.context?.type;
  return {
    stage, transport: "webrtc", category,
    ...(status ? { httpStatus: Number(status) } : {}),
    ...(disconnect ? { sdkDisconnectReason: disconnect.reason } : {}),
    ...(context && ["close", "end_call", "connection_state_changed"].includes(context) ? { context } : {}),
    ...(Number.isInteger(closeCode) ? { closeCode } : {}),
  };
}
