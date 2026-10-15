// Basic bot protection for forms, with no third-party service: a hidden
// honeypot field that humans never fill, and a minimum time between the form
// appearing and being submitted. Use checkSpam() inside the server action.

import { MIN_FILL_MS } from "@/lib/constants";

export const HONEYPOT_FIELD = "website";
export const STARTED_AT_FIELD = "startedAt";

// The minimum fill time lives in lib/constants.ts; re-exported here for callers.
export { MIN_FILL_MS };

export type SpamVerdict = "ok" | "honeypot" | "too-fast" | "missing-time";

export function checkSpam(formData: FormData, now = Date.now()): SpamVerdict {
  if (String(formData.get(HONEYPOT_FIELD) ?? "").trim() !== "") {
    return "honeypot";
  }

  const startedAt = Number(formData.get(STARTED_AT_FIELD));
  // Set by the browser once the form is on screen; bots that post straight to
  // the action (or submit before the page is interactive) leave it empty.
  if (!Number.isFinite(startedAt) || startedAt <= 0) return "missing-time";

  return now - startedAt < MIN_FILL_MS ? "too-fast" : "ok";
}
