"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";

const WHATSAPP_URL = "https://wa.me/923000000000";

const inputClass =
  "w-full border border-cream/15 bg-surface px-4 py-3 text-body font-light text-cream placeholder:text-stone transition-colors duration-500 ease-luxe focus:border-camel focus:outline-none";

const whatsappLinkClass =
  "text-ink underline decoration-gold/50 underline-offset-4 transition-colors duration-500 ease-luxe hover:text-tan";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-eyebrow uppercase text-ink">{label}</span>
      {children}
    </label>
  );
}

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  // No email backend yet: capture the message visually, then surface the
  // WhatsApp fallback so the enquiry still reaches us quickly.
  if (submitted) {
    return (
      <div className="mt-14 border-t border-gold/30 pt-10">
        <p className="text-body font-light text-stone">
          Thanks for reaching out. For now, please WhatsApp us directly for a
          faster response.
        </p>
        <p className="mt-6">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer noopener"
            className={whatsappLinkClass}
          >
            WhatsApp +92 300 0000000 →
          </a>
        </p>
      </div>
    );
  }

  return (
    <>
      <form
        className="mt-14 space-y-10"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
      >
        <div className="grid gap-10 sm:grid-cols-2">
          <Field label="Name">
            <input
              className={inputClass}
              name="name"
              autoComplete="name"
              required
            />
          </Field>
          <Field label="Email">
            <input
              className={inputClass}
              type="email"
              name="email"
              autoComplete="email"
              required
            />
          </Field>
        </div>
        <Field label="Message">
          <textarea
            className={`${inputClass} min-h-36 resize-y`}
            name="message"
            required
          />
        </Field>

        <div className="pt-2">
          <Button type="submit">Send Message</Button>
          <p className="mt-4 text-caption text-stone">
            Your details are used only to reply.
          </p>
        </div>
      </form>

      <p className="mt-12 border-t border-gold/30 pt-8 text-body font-light text-stone">
        Prefer WhatsApp? Message us on{" "}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer noopener"
          className={whatsappLinkClass}
        >
          +92 300 0000000 →
        </a>
      </p>
    </>
  );
}
