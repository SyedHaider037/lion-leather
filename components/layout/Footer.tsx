import Link from "next/link";

import { Container } from "@/components/ui/Container";

const WHATSAPP_URL = "https://wa.me/923000000000";

type FooterLink = { href: string; label: string; external?: boolean };

const COLUMNS: { heading: string; links: FooterLink[] }[] = [
  {
    heading: "Shop",
    links: [
      { href: "/collections", label: "New Arrivals" },
      { href: "/collections", label: "Gift Sets" },
      { href: "/collections/footwear", label: "Shoes" },
      { href: "/collections/wallets", label: "Wallets" },
      { href: "/search", label: "Search" },
    ],
  },
  {
    heading: "House",
    links: [
      { href: "/about", label: "Our Story" },
      { href: "/cart", label: "Your Selection" },
    ],
  },
  {
    heading: "Care",
    links: [
      { href: "/leather-care", label: "Leather Care" },
      { href: "/sizing-guide", label: "Sizing Guide" },
      { href: "/shipping-returns", label: "Shipping & Returns" },
      { href: "/faq", label: "FAQ" },
      { href: "/track-order", label: "Track Order" },
    ],
  },
  {
    heading: "Contact",
    links: [
      { href: "/contact", label: "Write to Us" },
      { href: WHATSAPP_URL, label: "WhatsApp +92 300 0000000 →", external: true },
      {
        href: "mailto:hello@example.com",
        label: "hello@example.com",
        external: true,
      },
    ],
  },
];

const linkClass =
  "text-caption font-light text-cream/80 transition-colors duration-500 ease-luxe hover:text-tan";

function FooterLinkItem({ link }: { link: FooterLink }) {
  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noreferrer noopener"
        className={linkClass}
      >
        {link.label}
      </a>
    );
  }
  return (
    <Link href={link.href} className={linkClass}>
      {link.label}
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="bg-ink text-cream">
      <Container className="py-16 lg:py-24">
        {/* Signature motif: gold hairline with centered LL monogram */}
        <div className="flex items-center gap-6" role="separator">
          <span className="h-px flex-1 bg-gold/30" />
          <span
            aria-hidden
            className="select-none font-serif text-sm tracking-[0.3em] text-gold"
          >
            LL
          </span>
          <span className="h-px flex-1 bg-gold/30" />
        </div>

        <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <p className="text-eyebrow uppercase text-cream/60">{col.heading}</p>
              <ul className="mt-6 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <FooterLinkItem link={link} />
                  </li>
                ))}
                {col.heading === "Contact" ? (
                  <li className="pt-2 text-caption font-light text-cream/60">
                    Lahore, Pakistan
                  </li>
                ) : null}
              </ul>
            </div>
          ))}
        </div>

        <form className="mt-16 max-w-md" aria-label="Newsletter">
          <label
            htmlFor="newsletter-email"
            className="text-eyebrow uppercase text-cream/60"
          >
            Newsletter
          </label>
          <div className="mt-4 flex items-center gap-4 border-b border-cream/30 transition-colors duration-500 ease-luxe focus-within:border-gold">
            <input
              id="newsletter-email"
              type="email"
              name="email"
              placeholder="Your email address"
              autoComplete="email"
              className="w-full bg-transparent py-3 text-body font-light text-cream placeholder:text-cream/50 focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 text-eyebrow uppercase text-cream transition-colors duration-500 ease-luxe hover:text-tan"
            >
              Subscribe
            </button>
          </div>
        </form>

        <div className="mt-16">
          <p className="text-caption font-light text-cream/60">
            © {new Date().getFullYear()} Lion Leather. All rights reserved.
          </p>
          <p className="mt-3 text-caption font-light text-cream/60">
            <Link
              href="/privacy-policy"
              className="transition-colors duration-500 ease-luxe hover:text-tan"
            >
              Privacy Policy
            </Link>
            {" · "}
            <Link
              href="/terms-of-service"
              className="transition-colors duration-500 ease-luxe hover:text-tan"
            >
              Terms of Service
            </Link>
          </p>
        </div>
      </Container>
    </footer>
  );
}
