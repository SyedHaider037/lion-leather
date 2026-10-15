// Contact details shown on the site. They come from the environment so no real
// number or address lives in the repository; the defaults are placeholders.

const DEFAULT_WHATSAPP_NUMBER = "+92 300 0000000";
const DEFAULT_CONTACT_EMAIL = "hello@example.com";

/** WhatsApp number as it should be displayed, e.g. "+92 300 0000000". */
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_NUMBER;

/** Support email address. */
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || DEFAULT_CONTACT_EMAIL;

/**
 * Builds a wa.me link from a phone number (digits only), optionally with a
 * pre-filled message.
 */
export function buildWhatsappUrl(
  number: string = WHATSAPP_NUMBER,
  message?: string,
): string {
  const url = `https://wa.me/${number.replace(/\D/g, "")}`;
  return message ? `${url}?text=${encodeURIComponent(message)}` : url;
}

/** wa.me link for the site's WhatsApp number. */
export const WHATSAPP_URL = buildWhatsappUrl();
