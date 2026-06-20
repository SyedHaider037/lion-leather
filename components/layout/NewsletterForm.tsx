"use client";

import { useActionState } from "react";

import {
  subscribeToNewsletter,
  type SubscribeState,
} from "@/lib/newsletter/actions";

const initialState: SubscribeState = { status: "idle", message: "" };

export function NewsletterForm() {
  const [state, formAction, pending] = useActionState(
    subscribeToNewsletter,
    initialState,
  );

  const done = state.status === "success";

  return (
    <form action={formAction} className="mt-16 max-w-md" aria-label="Newsletter">
      <label
        htmlFor="newsletter-email"
        className="text-eyebrow uppercase text-cream/60"
      >
        Newsletter
      </label>
      <div className="mt-4 flex items-center gap-4 border-b border-cream/30 transition-colors duration-500 ease-luxe focus-within:border-camel">
        <input
          id="newsletter-email"
          type="email"
          name="email"
          required
          placeholder="Your email address"
          autoComplete="email"
          disabled={pending || done}
          className="w-full bg-transparent py-3 text-body font-light text-cream placeholder:text-cream/50 focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={pending || done}
          className="shrink-0 text-eyebrow uppercase tracking-[0.15em] text-cream transition-colors duration-500 ease-luxe hover:text-tan disabled:opacity-50"
        >
          {pending ? "…" : "Subscribe"}
        </button>
      </div>
      {state.message ? (
        <p
          aria-live="polite"
          className="mt-3 text-caption font-light text-cream/70"
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
