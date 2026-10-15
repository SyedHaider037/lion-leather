import { describe, expect, it } from "vitest";

import { createLogger, redact, type LogLevel } from "@/lib/logger";

const FIXED_TIME = new Date("2026-01-02T03:04:05.000Z");

function capture(minLevel: LogLevel) {
  const lines: { level: LogLevel; entry: Record<string, unknown> }[] = [];
  const log = createLogger({
    minLevel,
    now: () => FIXED_TIME,
    write: (level, line) => lines.push({ level, entry: JSON.parse(line) }),
  });
  return { log, lines };
}

describe("logger levels", () => {
  it("prints each message as one JSON line with time, level and msg", () => {
    const { log, lines } = capture("debug");
    log.info("cart loaded", { count: 3 });
    expect(lines).toHaveLength(1);
    expect(lines[0].entry).toEqual({
      time: "2026-01-02T03:04:05.000Z",
      level: "info",
      msg: "cart loaded",
      count: 3,
    });
  });

  it("drops messages below the minimum level", () => {
    const { log, lines } = capture("warn");
    log.debug("a");
    log.info("b");
    log.warn("c");
    log.error("d");
    expect(lines.map((l) => l.level)).toEqual(["warn", "error"]);
  });

  it("keeps debug for development and drops it at info", () => {
    const dev = capture("debug");
    dev.log.debug("x");
    expect(dev.lines).toHaveLength(1);

    const prod = capture("info");
    prod.log.debug("x");
    expect(prod.lines).toHaveLength(0);
  });

  it("does not let the context overwrite the standard fields", () => {
    const { log, lines } = capture("debug");
    log.info("real", { msg: "fake", level: "debug", time: "never" });
    expect(lines[0].entry).toMatchObject({
      msg: "real",
      level: "info",
      time: "2026-01-02T03:04:05.000Z",
    });
  });
});

describe("redaction", () => {
  it.each([
    "token",
    "accessToken",
    "Authorization",
    "email",
    "customerEmail",
    "phone",
    "password",
    "cookie",
    "x-api-key",
  ])("hides the value under the key %s", (key) => {
    expect(redact({ [key]: "secret-value" })).toEqual({ [key]: "[redacted]" });
  });

  it("hides sensitive keys in nested objects and arrays", () => {
    const out = redact({
      request: { headers: { authorization: "Bearer abc" } },
      items: [{ email: "a@b.co", id: 1 }],
    });
    expect(JSON.stringify(out)).not.toMatch(/abc|a@b\.co/);
    expect(out).toMatchObject({ items: [{ id: 1 }] });
  });

  it("masks emails and bearer tokens inside text", () => {
    const out = redact({
      note: "failed for someone@example.com with Bearer abc.def",
    });
    expect(JSON.stringify(out)).not.toMatch(/someone@example|abc\.def/);
  });

  it("turns an Error into name and message, and masks the message", () => {
    const err = new Error("could not add someone@example.com");
    const out = redact({ err }) as { err: Record<string, string> };
    expect(out.err.name).toBe("Error");
    expect(out.err.message).toBe("could not add [redacted]");
  });

  it("never prints a secret that was passed in the context or the message", () => {
    const { log, lines } = capture("debug");
    log.error("login for someone@example.com failed", {
      token: "shpat_supersecret",
      user: { phone: "+92 300 0000000", name: "ok" },
    });
    const text = JSON.stringify(lines[0].entry);
    expect(text).not.toMatch(/someone@example|supersecret|0000000/);
    expect(text).toContain('"name":"ok"');
  });

  it("stops at a maximum depth instead of looping", () => {
    const loop: Record<string, unknown> = {};
    loop.self = loop;
    expect(() => JSON.stringify(redact({ loop }))).not.toThrow();
  });
});
