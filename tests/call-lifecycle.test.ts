import assert from "node:assert/strict";
import test from "node:test";
import { createCompletedCallGate, createMikeCallSession, reportMikeCallLifecycle, subscribeToMikeCallLifecycle } from "../components/demo/callLifecycle";

test("does not open on initialization or a disconnect before connecting", () => {
  const completed: string[] = [];
  const gate = createCompletedCallGate((id) => completed.push(id));
  assert.deepEqual(completed, []);
  gate({ type: "disconnected", callId: "unconnected", outcome: "completed" });
  gate({ type: "disconnected", callId: "cancelled", outcome: "cancelled" });
  gate({ type: "connected", callId: "cancelled" });
  gate({ type: "disconnected", callId: "cancelled", outcome: "completed" });
  assert.deepEqual(completed, []);
});

test("opens once for each connected, completed call and ignores duplicates", () => {
  const completed: string[] = [];
  const gate = createCompletedCallGate((id) => completed.push(id));
  for (const callId of ["first", "second"]) {
    gate({ type: "connected", callId });
    gate({ type: "disconnected", callId, outcome: "completed" });
    gate({ type: "disconnected", callId, outcome: "completed" });
    gate({ type: "connected", callId });
    gate({ type: "disconnected", callId, outcome: "completed" });
  }
  assert.deepEqual(completed, ["first", "second"]);
});

test("ignores errors, cancellations, mismatched sessions, and empty identifiers", () => {
  const completed: string[] = [];
  const gate = createCompletedCallGate((id) => completed.push(id));
  for (const outcome of ["error", "cancelled"] as const) {
    gate({ type: "connected", callId: outcome });
    gate({ type: "disconnected", callId: outcome, outcome });
  }
  gate({ type: "connected", callId: "active" });
  gate({ type: "disconnected", callId: "other", outcome: "completed" });
  gate({ type: "connected", callId: " " });
  gate({ type: "disconnected", callId: " ", outcome: "completed" });
  assert.deepEqual(completed, []);
});

test("the frontend bridge delivers events only to current subscribers", () => {
  const completed: string[] = [];
  const unsubscribe = subscribeToMikeCallLifecycle(createCompletedCallGate((id) => completed.push(id)));
  reportMikeCallLifecycle({ type: "connected", callId: "live-session" });
  reportMikeCallLifecycle({ type: "disconnected", callId: "live-session", outcome: "completed" });
  unsubscribe();
  reportMikeCallLifecycle({ type: "connected", callId: "unmounted" });
  reportMikeCallLifecycle({ type: "disconnected", callId: "unmounted", outcome: "completed" });
  assert.deepEqual(completed, ["live-session"]);
});

test("SDK sessions open previews only after a real connection and clean hang-up", () => {
  const completed: string[] = [];
  const session = createMikeCallSession(createCompletedCallGate(id => completed.push(id)));
  session.begin();
  session.disconnect({ reason: "user" });
  assert.deepEqual(completed, []);
  for (const reason of ["user", "agent"] as const) {
    session.begin();
    session.connect(`real-${reason}`);
    session.message("agent"); session.message("user");
    if (reason === "user") session.requestEnd();
    const details = reason === "user" ? { reason } : { reason, context: { type: "end_call" } };
    session.disconnect(details);
    session.disconnect(details);
  }
  assert.deepEqual(completed, ["real-user", "real-agent"]);
});

test("SDK errors, cancelled connection attempts, and unmounts never open previews", () => {
  const completed: string[] = [];
  const session = createMikeCallSession(createCompletedCallGate(id => completed.push(id)));
  session.begin(); session.cancel(); session.connect("late-connection"); session.disconnect({ reason: "user" });
  session.begin(); session.connect("network-failure"); session.disconnect({ reason: "error" });
  session.begin(); session.connect("callback-failure"); session.fail(); session.disconnect({ reason: "user" });
  session.begin(); session.fail(); session.connect("failed-start"); session.disconnect({ reason: "user" });
  session.begin(); session.connect("navigation-away"); session.dispose(); session.disconnect({ reason: "user" });
  assert.deepEqual(completed, []);
  session.activate(); session.begin(); session.connect("retry");
  session.message("agent"); session.message("user");
  session.disconnect({ reason: "agent", context: { type: "end_call" } });
  assert.deepEqual(completed, ["retry"]);
});

test("brief connection and SDK agent-labelled signaling closures never show results", () => {
  const completed: string[] = [];
  const session = createMikeCallSession(createCompletedCallGate(id => completed.push(id)));
  session.begin(); session.connect("brief");
  session.disconnect({ reason: "agent", context: { type: "close", code: 1006 } });
  session.begin(); session.connect("active-then-failed");
  session.message("agent"); session.message("user");
  session.disconnect({ reason: "agent", context: { type: "close" } });
  session.begin(); session.connect("hangup-after-no-conversation"); session.requestEnd();
  session.disconnect({ reason: "user" });
  assert.deepEqual(completed, []);
});

test("abnormal close and errors override conversation activity and intended hangup", () => {
  const completed: string[] = [];
  const session = createMikeCallSession(createCompletedCallGate(id => completed.push(id)));
  for (const failed of [false, true]) {
    session.begin(); session.connect(`failed-${failed}`);
    session.message("agent"); session.message("user"); session.requestEnd();
    if (failed) session.fail();
    session.disconnect({ reason: "agent", context: { type: "end_call" }, closeCode: 1006 });
  }
  assert.deepEqual(completed, []);
});
