import { describe, expect, it } from "vitest";

import {
  checkSpam,
  HONEYPOT_FIELD,
  MIN_FILL_MS,
  STARTED_AT_FIELD,
} from "@/lib/forms/spam";

const NOW = 1_800_000_000_000;

function form(fields: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

describe("checkSpam", () => {
  it("passes a normal submission", () => {
    const data = form({ [STARTED_AT_FIELD]: String(NOW - MIN_FILL_MS - 1000) });
    expect(checkSpam(data, NOW)).toBe("ok");
  });

  it("rejects a filled honeypot", () => {
    const data = form({
      [HONEYPOT_FIELD]: "http://spam.example",
      [STARTED_AT_FIELD]: String(NOW - 60_000),
    });
    expect(checkSpam(data, NOW)).toBe("honeypot");
  });

  it("ignores a honeypot that only holds spaces", () => {
    const data = form({
      [HONEYPOT_FIELD]: "   ",
      [STARTED_AT_FIELD]: String(NOW - 60_000),
    });
    expect(checkSpam(data, NOW)).toBe("ok");
  });

  it("rejects a submission that was too fast", () => {
    const data = form({ [STARTED_AT_FIELD]: String(NOW - 500) });
    expect(checkSpam(data, NOW)).toBe("too-fast");
  });

  it("accepts exactly the minimum time", () => {
    const data = form({ [STARTED_AT_FIELD]: String(NOW - MIN_FILL_MS) });
    expect(checkSpam(data, NOW)).toBe("ok");
  });

  it("rejects a missing or invalid start time", () => {
    expect(checkSpam(form({}), NOW)).toBe("missing-time");
    expect(checkSpam(form({ [STARTED_AT_FIELD]: "abc" }), NOW)).toBe(
      "missing-time",
    );
    expect(checkSpam(form({ [STARTED_AT_FIELD]: "0" }), NOW)).toBe(
      "missing-time",
    );
  });
});
