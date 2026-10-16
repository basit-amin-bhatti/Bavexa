import assert from "node:assert/strict";
import test from "node:test";
import { createCompletedCallGate, reportMikeCallLifecycle, subscribeToMikeCallLifecycle } from "../components/demo/callLifecycle";

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
