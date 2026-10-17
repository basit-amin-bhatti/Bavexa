/** Never expose provider payloads, keys, or internal connection details in public errors. */
export function getVoiceErrorMessage(error: unknown): string {
  const name = error instanceof Error ? error.name : "";
  const message = error instanceof Error ? error.message : typeof error === "string" ? error : "";
  const detail = `${name} ${message}`.toLowerCase();
  if (/notallowed|permission|denied|securityerror/.test(detail)) {
    return "Microphone access was blocked. Allow the microphone in your browser’s site settings, then try again.";
  }
  if (/notfound|devicesnotfound|no.*microphone|no.*audio.*device/.test(detail)) {
    return "No microphone was found. Connect a microphone and try again.";
  }
  if (/notreadable|trackstarterror|in use|could not start audio/.test(detail)) {
    return "Your microphone could not start. Close other apps using it and try again.";
  }
  if (/secure context|https|unsupported/.test(detail)) {
    return "Voice calling needs a supported browser on HTTPS or localhost. Try a current browser with microphone access.";
  }
  if (/timeout|timed out|network|offline/.test(detail)) {
    return "The call could not connect. Check your internet connection and try again.";
  }
  return "We couldn’t connect to Mike. Please try again in a moment.";
}
