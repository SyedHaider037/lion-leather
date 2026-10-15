"use server";

import { checkSpam } from "@/lib/forms/spam";
import { storefrontRequest } from "@/lib/shopify/client";
import { logger } from "@/lib/logger";

const CUSTOMER_CREATE_MUTATION = `#graphql
  mutation NewsletterSubscribe($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
` as const;

type CustomerCreateData = {
  customerCreate: {
    customer: { id: string } | null;
    customerUserErrors: {
      code: string | null;
      field: string[] | null;
      message: string;
    }[];
  };
};

export type SubscribeState = {
  status: "idle" | "success" | "error";
  message: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Saves a newsletter email as a Shopify customer with marketing consent.
 * The Storefront API has no password-less subscribe, so we create a customer
 * with a random password (the email then appears under Shopify → Customers).
 * Works while the store password is on; the classic /contact form does not.
 */
export async function subscribeToNewsletter(
  _prev: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  const spam = checkSpam(formData);
  if (spam === "honeypot") {
    // Look successful to a bot, but never create a customer.
    return { status: "success", message: "You’re on the list." };
  }
  if (spam !== "ok") {
    return {
      status: "error",
      message: "Please wait a moment and try again.",
    };
  }

  const email = String(formData.get("email") ?? "").trim();

  if (!EMAIL_RE.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  // Shopify caps customer passwords at 40 chars; keep this well under while
  // covering upper/lower/digit/symbol. The customer never uses it.
  const password = `Ll9!${crypto.randomUUID().replace(/-/g, "").slice(0, 20)}`;

  try {
    const data = await storefrontRequest<CustomerCreateData>(
      CUSTOMER_CREATE_MUTATION,
      { input: { email, password, acceptsMarketing: true } },
      { cache: "no-store" },
    );

    if (data.customerCreate.customer) {
      return { status: "success", message: "You’re on the list." };
    }

    // An existing email can't be re-created — for a newsletter that still
    // means they're subscribed, so treat it as success.
    const alreadyOnList = data.customerCreate.customerUserErrors.some(
      (e) => e.code === "TAKEN" || e.code === "CUSTOMER_DISABLED",
    );
    if (alreadyOnList) {
      return { status: "success", message: "You’re on the list." };
    }

    return {
      status: "error",
      message: "We couldn’t add you just now. Please try again.",
    };
  } catch (err) {
    logger.error("Newsletter subscribe failed", { action: "newsletter", err });
    return {
      status: "error",
      message: "We couldn’t add you just now. Please try again.",
    };
  }
}
