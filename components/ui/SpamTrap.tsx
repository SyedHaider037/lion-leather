"use client";

import { useEffect, useRef } from "react";

import { HONEYPOT_FIELD, STARTED_AT_FIELD } from "@/lib/forms/spam";

/**
 * Hidden anti-spam fields for a form: an off-screen honeypot that people never
 * see, and a timestamp set in the browser when the form appears. The server
 * action checks both with checkSpam() from lib/forms/spam.ts.
 */
export function SpamTrap() {
  const startedAt = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Set on mount (not during render) so server and client HTML match.
    if (startedAt.current) startedAt.current.value = String(Date.now());
  }, []);

  return (
    <>
      <div
        aria-hidden
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
      >
        <label>
          Leave this field empty
          <input
            type="text"
            name={HONEYPOT_FIELD}
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </label>
      </div>
      <input ref={startedAt} type="hidden" name={STARTED_AT_FIELD} />
    </>
  );
}
