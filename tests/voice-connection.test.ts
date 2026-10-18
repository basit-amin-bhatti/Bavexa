import assert from "node:assert/strict";
import test from "node:test";
import { createVoiceConnectionAttempt, getVoiceFailureDiagnostic } from "../components/demo/voiceConnection";

test("awaits the real connected callback rather than a void SDK return", async () => {
  const connection = createVoiceConnectionAttempt();
  let starts = 0;
  let resolved = false;
  const started = connection.start(() => { starts++; });
  void started.then(() => { resolved = true; });
  assert.equal(connection.start(() => { starts++; }), started);
  await Promise.resolve();
  assert.equal(resolved, false);
  assert.equal(starts, 1);
  connection.connected();
  await started;
  assert.equal(resolved, true);
  assert.equal(connection.pending, false);
});

test("propagates synchronous and asynchronous SDK failures to the awaiting catch", async () => {
  const connection = createVoiceConnectionAttempt();
  const error = new Error("WebRTC signalling failed");
  await assert.rejects(connection.start(() => { throw error; }), error);
  const started = connection.start(() => {});
  connection.fail(error);
  await assert.rejects(started, error);
  connection.connected(); // A late callback cannot turn the rejection into success.
});

test("cancellation rejects a pending connection and a later retry can connect", async () => {
  const connection = createVoiceConnectionAttempt();
  const cancelled = connection.start(() => {});
  connection.cancel();
  await assert.rejects(cancelled, { name: "AbortError" });
  const retry = connection.start(() => {});
  connection.connected();
  await retry;
});

test("console diagnostics retain failure category/status without exposing provider payloads", () => {
  const diagnostic = getVoiceFailureDiagnostic(new Error("Failed to fetch conversation token: API returned 403 https://example.test/?token=private-credential"), "connecting");
  assert.deepEqual(diagnostic, { stage: "connecting", transport: "webrtc", category: "token-request", httpStatus: 403 });
  assert.doesNotMatch(JSON.stringify(diagnostic), /private|example|token=/);
  assert.equal(getVoiceFailureDiagnostic("ICE connection failed", "connecting").category, "webrtc");
  assert.deepEqual(getVoiceFailureDiagnostic("WebRTC signaling closed", "connected", { reason: "agent", context: { type: "close", code: 1006 } }), {
    stage: "connected", transport: "webrtc", category: "webrtc", sdkDisconnectReason: "agent", context: "close", closeCode: 1006,
  });
});
