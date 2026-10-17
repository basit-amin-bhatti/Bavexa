import assert from "node:assert/strict";
import test from "node:test";
import { getVoiceErrorMessage } from "../components/demo/voiceErrors";

test("voice errors give useful microphone, browser, and network guidance", () => {
  const denied = new Error("User denied permission"); denied.name = "NotAllowedError";
  assert.match(getVoiceErrorMessage(denied), /site settings/);
  const missing = new Error("Requested device not found"); missing.name = "NotFoundError";
  assert.match(getVoiceErrorMessage(missing), /No microphone/);
  assert.match(getVoiceErrorMessage("NotReadableError"), /other apps/);
  assert.match(getVoiceErrorMessage("Unsupported secure context"), /HTTPS/);
  assert.match(getVoiceErrorMessage("Connection timed out"), /internet/);
});

test("voice errors never reveal internal provider messages", () => {
  for (const problem of ["Internal auth failure: private-key=secret", { payload: "secret" }, null]) {
    assert.equal(getVoiceErrorMessage(problem), "We couldn’t connect to Mike. Please try again in a moment.");
  }
});
