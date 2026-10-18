# Mike live voice investigation — October 19, 2026

## Evidence and limits

- Owner-observed Chrome Network: `livekit.rtc.elevenlabs.io/rtc/v1` upgrades with HTTP 101 from `https://bavexa.vercel.app`. It subsequently closes abnormally (1006). No `/validate` response is confirmed. This rules out the previously considered v1-handshake-404 diagnosis for this attempt; no protocol override or dependency downgrade was applied.
- Owner-observed Console: `error reading from signal stream`, brief connected state, and `could not createOffer with closed peer connection`.
- Installed LiveKit `PCTransport.createAndSendOffer()` logs the last warning **after** observing an absent/closed peer and returns. That warning alone does not identify who closed the peer. HTTP 101 likewise does not prove successful ICE/media negotiation.
- The automation browser could not complete microphone access. No successful live conversation or ICE state transition was independently certified. Live tests must use the deployed allowed hostname, not require a localhost allowlist change.

## Verified application defects and local fixes

1. **Error-driven teardown:** `handleFailure → onReset → setAttempt → keyed MikeVoiceSession remount` forced `ConversationProvider` cleanup on every SDK error. The installed provider cleanup sets `shouldEndRef` and ends either its existing conversation or the pending start as soon as it resolves. This is an unconditional teardown path, not proof of the initial cause of the owner's 1006. Removed the changing key/remount and automatic error-path end calls. Errors now report without destroying the provider; explicit cancel/end/timeout and real page unmount retain SDK-managed cleanup. No guessed ICE, server, or security change.
2. **Overlapping microphone ownership:** the application acquired and immediately stopped a preflight stream, then the SDK acquired its own preliminary stream and microphone. The installed SDK already requests permission before creating its connection and owns all capture cleanup. Removed the redundant application capture/stop cycle; this is a verified duplication, not a proven cause of 1006.
3. **Startup promise handling:** React SDK 1.18's hook returns void. A lifecycle adapter awaits verified callbacks and propagates synchronous/startup errors, instead of pretending `await` on a void return observes negotiation. SDK startup rejection clears its own lock. Retry does not replace a negotiating provider.
4. **False completion popup:** the installed WebRTC adapter maps a generic room disconnect to `reason: "agent"`; later error events can be ignored by its one-shot disconnect handler. BAVEXA previously discarded context and counted all such agent disconnects as success. The gate now requires both user/agent activity plus an explicit visitor hang-up or agent `end_call`; generic close, abnormal code, errors, cancellation and unmount never count as completion. Only boolean activity flags are retained.

## Production verification still required

These changes were initially verified locally. A successful deployment alone does not prove that the initial remote signaling failure is fixed. In Chrome on the production hostname after deployment, inspect the ordered `[BAVEXA voice] Lifecycle` events and the first Network/SDK failure:

- `sdk-error` or `sdk-disconnected` **before** any local end/cancel/timeout/unmount means that local teardown was not the initial trigger.
- A local teardown event **before** transport failure identifies the caller and elapsed time, including the explicit 30-second timeout.
- If signaling upgrades but media fails, capture the ICE state/failure and first underlying exception (redact query strings, tokens, SDP/IP addresses and transcripts). Do not infer a TURN or protocol issue from 1006 alone.
- Verify one sustained spoken exchange, Mute/Unmute, clean End Call and exactly one sample popup. Repeat with cancellation and an immediate failed connection; neither may open the popup.

No UI/CSS, security configuration, agent configuration, webhook, calendar, CRM or other backend integration was changed. The initial investigation made no Git commit/push/deployment; subsequent owner-authorized publication does not certify live audio or ICE connectivity.

## Local verification

Production build, standalone TypeScript, ESLint and all 25 tests passed. Coverage includes awaited SDK callbacks, retry/cancel behavior, abnormal agent-labelled closures, completed-conversation gating, and structural regressions preventing error-driven keyed remounts and duplicate application microphone capture. Structural/unit tests do not prove live WebRTC connectivity.
