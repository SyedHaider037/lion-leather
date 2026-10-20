import { describe, expect, it } from "vitest";

import {
  buildContactMessage,
  buildContactWhatsappUrl,
  CONTACT_LIMITS,
  prepareContactSubmission,
} from "@/lib/forms/contact-message";
import {
  HONEYPOT_FIELD,
  MIN_FILL_MS,
  STARTED_AT_FIELD,
} from "@/lib/forms/spam";

const NOW = 1_800_000_000_000;
const NUMBER = "+92 300 0000000";

const fields = {
  name: "Ayesha Khan",
  email: "ayesha@example.com",
  message: "Do you have the bifold wallet in tan?",
};

function form(
  values: Record<string, string>,
  startedAgoMs = MIN_FILL_MS + 1000,
) {
  const data = new FormData();
  data.set(STARTED_AT_FIELD, String(NOW - startedAgoMs));
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

function decode(url: string) {
  // searchParams.get already undoes the percent-encoding.
  return new URL(url).searchParams.get("text") ?? "";
}

describe("buildContactMessage", () => {
  it("writes name, email and message", () => {
    expect(buildContactMessage(fields)).toBe(
      "Hi Lion Leather, I'm Ayesha Khan (ayesha@example.com).\n\nDo you have the bifold wallet in tan?",
    );
  });

  it("trims every field and keeps line breaks in the message", () => {
    const text = buildContactMessage({
      name: "  Ayesha   Khan \n",
      email: " ayesha@example.com ",
      message: "\n  Line one\nLine two  \n",
    });
    expect(text).toBe(
      "Hi Lion Leather, I'm Ayesha Khan (ayesha@example.com).\n\nLine one\nLine two",
    );
  });

  it("cuts each field to its limit and marks the cut", () => {
    const text = buildContactMessage({
      name: "n".repeat(500),
      email: "e".repeat(500),
      message: "m".repeat(5000),
    });
    const [intro, , body] = text.split("\n");
    expect(body).toHaveLength(CONTACT_LIMITS.message);
    expect(body.endsWith("…")).toBe(true);
    expect(intro).toContain("n".repeat(CONTACT_LIMITS.name - 1) + "…");
    expect(intro).toContain("e".repeat(CONTACT_LIMITS.email - 1) + "…");
  });

  it("does not split an emoji when it cuts", () => {
    const text = buildContactMessage({
      ...fields,
      message: "😀".repeat(CONTACT_LIMITS.message + 10),
    });
    expect(text).not.toMatch(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])/);
  });
});

describe("buildContactWhatsappUrl", () => {
  it("points at wa.me with the digits of the number", () => {
    const url = buildContactWhatsappUrl(fields, NUMBER);
    expect(url.startsWith("https://wa.me/923000000000?text=")).toBe(true);
  });

  it("URL-encodes the text so it survives a round trip", () => {
    const tricky = { ...fields, message: "Size 9 & 10? 100% #1\nthanks" };
    const url = buildContactWhatsappUrl(tricky, NUMBER);
    expect(url).not.toMatch(/[ \n#]/);
    expect(decode(url)).toBe(buildContactMessage(tricky));
  });
});

describe("prepareContactSubmission", () => {
  it("returns a WhatsApp link for a valid submission", () => {
    const result = prepareContactSubmission(form(fields), NOW);
    expect(result.status).toBe("ok");
    if (result.status === "ok") {
      expect(result.url).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
      expect(decode(result.url)).toBe(buildContactMessage(fields));
    }
  });

  it("ignores a bot that filled the honeypot", () => {
    const data = form({ ...fields, [HONEYPOT_FIELD]: "http://spam.example" });
    expect(prepareContactSubmission(data, NOW)).toEqual({ status: "bot" });
  });

  it("asks the visitor to wait when the form was sent too fast", () => {
    expect(prepareContactSubmission(form(fields, 500), NOW)).toEqual({
      status: "too-fast",
    });
  });

  it("treats a missing start time as too fast", () => {
    const data = new FormData();
    for (const [key, value] of Object.entries(fields)) data.set(key, value);
    expect(prepareContactSubmission(data, NOW)).toEqual({ status: "too-fast" });
  });

  it.each([
    ["an empty name", { ...fields, name: "   " }],
    ["an empty message", { ...fields, message: "" }],
    ["a bad email", { ...fields, email: "not-an-email" }],
    ["a missing email", { name: fields.name, message: fields.message }],
  ])("rejects %s", (_label, values) => {
    expect(prepareContactSubmission(form(values), NOW)).toEqual({
      status: "invalid",
    });
  });
});
