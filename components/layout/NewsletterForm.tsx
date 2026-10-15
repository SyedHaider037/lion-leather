"use client";

import { useActionState } from "react";

import { SpamTrap } from "@/components/ui/SpamTrap";
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
    <form action={formAction} className="mt-12 max-w-md" aria-label="Newsletter">
      <SpamTrap />
      <label
        htmlFor="newsletter-email"
        className="text-eyebrow uppercase text-ink/65"
      >
        Newsletter
      </label>
      <div className="mt-4 flex items-center gap-4 border-b border-ink/30 transition-colors duration-500 ease-luxe focus-within:border-cognac">
        <input
          id="newsletter-email"
          type="email"
          name="email"
          required
          placeholder="Your email address"
          autoComplete="email"
          disabled={pending || done}
          className="w-full bg-transparent py-3 text-body font-light text-ink placeholder:text-taupe focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={pending || done}
          className="min-h-11 shrink-0 text-eyebrow uppercase text-ink transition-colors duration-500 ease-luxe hover:text-cognac disabled:opacity-50"
        >
          {pending ? "…" : "Subscribe"}
        </button>
      </div>
      {state.message ? (
        <p
          aria-live="polite"
          className="mt-3 text-caption font-light text-ink/70"
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
