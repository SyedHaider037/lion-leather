"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { SpamTrap } from "@/components/ui/SpamTrap";
import { prepareContactSubmission } from "@/lib/forms/contact-message";
import {
  CONTACT_EMAIL,
  WHATSAPP_NUMBER,
  WHATSAPP_URL,
} from "@/lib/site-config";

const inputClass =
  "w-full border border-ink/15 bg-surface px-4 py-3 text-body font-light text-ink placeholder:text-taupe transition-colors duration-200 ease-luxe focus:border-cognac focus:outline-none";

const whatsappLinkClass =
  "text-ink underline decoration-gold/50 underline-offset-4 transition-colors duration-200 ease-luxe hover:text-cognac";

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

type Notice = "wait" | "invalid" | null;

export function ContactForm() {
  // The WhatsApp link for the message the visitor just wrote, once it was opened.
  const [openedUrl, setOpenedUrl] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice>(null);

  // There is no email backend: the message is handed to WhatsApp, which the
  // visitor sends themselves. Nothing is stored or logged here.
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = prepareContactSubmission(new FormData(e.currentTarget));

    if (result.status === "bot") return;
    if (result.status !== "ok") {
      setNotice(result.status === "too-fast" ? "wait" : "invalid");
      return;
    }

    setNotice(null);
    setOpenedUrl(result.url);
    window.open(result.url, "_blank", "noopener,noreferrer");
  }

  if (openedUrl) {
    return (
      <div className="mt-14 border-t border-gold/30 pt-10">
        <p className="text-body font-light text-taupe">
          Opening WhatsApp so you can send your message. Nothing has been sent
          yet.
        </p>
        <p className="mt-6">
          <a
            href={openedUrl}
            target="_blank"
            rel="noreferrer noopener"
            className={whatsappLinkClass}
          >
            WhatsApp didn’t open? Open it here →
          </a>
        </p>
        <p className="mt-6 text-body font-light text-taupe">
          Or email us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className={whatsappLinkClass}>
            {CONTACT_EMAIL}
          </a>
        </p>
      </div>
    );
  }

  return (
    <>
      <form className="mt-14 space-y-10" onSubmit={handleSubmit}>
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
          <Button type="submit">Message on WhatsApp</Button>
          <p className="mt-4 text-caption text-taupe">
            This opens WhatsApp with your message ready to send.
          </p>
          {notice ? (
            <p role="alert" className="mt-4 text-caption text-cognac">
              {notice === "wait"
                ? "Please wait a moment and try again."
                : "Please fill in every field with a valid email address."}
            </p>
          ) : null}
        </div>
        <SpamTrap />
      </form>

      <p className="mt-12 border-t border-gold/30 pt-8 text-body font-light text-taupe">
        Prefer WhatsApp? Message us on{" "}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer noopener"
          className={whatsappLinkClass}
        >
          {WHATSAPP_NUMBER} →
        </a>
        , or email{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className={whatsappLinkClass}>
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    </>
  );
}
