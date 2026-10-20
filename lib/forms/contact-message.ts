// The contact form has no email backend. Instead it opens a WhatsApp chat with
// the message already written. Everything that decides what happens on submit
// lives here as plain functions, so it can be tested without a browser.
//
// Nothing here logs: names, emails and message text must never reach a log.

import { z } from "zod";

import { checkSpam } from "@/lib/forms/spam";
import { buildWhatsappUrl } from "@/lib/site-config";

/** Longest text kept from each field (in characters). */
export const CONTACT_LIMITS = { name: 80, email: 120, message: 1000 } as const;

export const contactSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().pipe(z.email()),
  message: z.string().trim().min(1),
});

export type ContactFields = z.infer<typeof contactSchema>;

/** Trims, collapses line breaks and spaces, and cuts to `max` characters. */
function clip(text: string, max: number, keepLineBreaks = false): string {
  const tidy = keepLineBreaks ? text.trim() : text.replace(/\s+/g, " ").trim();
  const chars = Array.from(tidy);
  if (chars.length <= max) return tidy;
  return chars
    .slice(0, max - 1)
    .join("")
    .trimEnd()
    .concat("…");
}

/** The text that is pre-filled in the WhatsApp chat. */
export function buildContactMessage({
  name,
  email,
  message,
}: ContactFields): string {
  const who = `${clip(name, CONTACT_LIMITS.name)} (${clip(email, CONTACT_LIMITS.email)})`;
  return [
    `Hi Lion Leather, I'm ${who}.`,
    "",
    clip(message, CONTACT_LIMITS.message, true),
  ].join("\n");
}

/** A wa.me link with the message URL-encoded. */
export function buildContactWhatsappUrl(
  fields: ContactFields,
  number?: string,
): string {
  return buildWhatsappUrl(number, buildContactMessage(fields));
}

export type ContactSubmission =
  /** Everything is fine: open this link. */
  | { status: "ok"; url: string }
  /** The hidden field was filled: do nothing and say nothing. */
  | { status: "bot" }
  /** Submitted faster than a person could type. */
  | { status: "too-fast" }
  /** A field is empty or the email is not an email. */
  | { status: "invalid" };

/** Runs the spam checks and validation, then builds the WhatsApp link. */
export function prepareContactSubmission(
  formData: FormData,
  now = Date.now(),
): ContactSubmission {
  const verdict = checkSpam(formData, now);
  if (verdict === "honeypot") return { status: "bot" };
  if (verdict !== "ok") return { status: "too-fast" };

  const parsed = contactSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
  });
  if (!parsed.success) return { status: "invalid" };

  return { status: "ok", url: buildContactWhatsappUrl(parsed.data) };
}
