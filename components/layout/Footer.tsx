import Link from "next/link";

import { NewsletterForm } from "@/components/layout/NewsletterForm";
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
      { href: "/collections/belts", label: "Belts" },
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
      { href: "/size-guide/shoes", label: "Sizing Guide" },
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
  "inline-flex min-h-11 min-w-11 items-center text-caption font-light text-taupe transition-colors duration-200 ease-luxe hover:text-cognac";

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
    <footer className="border-t border-gold/30 bg-surface text-ink">
      <Container className="py-12 lg:py-20">
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

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <p className="text-eyebrow uppercase text-ink/80">{col.heading}</p>
              <ul className="mt-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <FooterLinkItem link={link} />
                  </li>
                ))}
                {col.heading === "Contact" ? (
                  <li className="pt-2 text-caption font-light text-taupe">
                    Lahore, Pakistan
                  </li>
                ) : null}
              </ul>
            </div>
          ))}
        </div>

        <NewsletterForm />

        <div className="mt-12">
          <p className="text-caption font-light text-taupe">
            © {new Date().getFullYear()} Lion Leather. All rights reserved.
          </p>
          <p className="mt-1 text-caption font-light text-taupe">
            <Link
              href="/privacy-policy"
              className="inline-flex min-h-11 items-center transition-colors duration-200 ease-luxe hover:text-cognac"
            >
              Privacy Policy
            </Link>
            {" · "}
            <Link
              href="/terms-of-service"
              className="inline-flex min-h-11 items-center transition-colors duration-200 ease-luxe hover:text-cognac"
            >
              Terms of Service
            </Link>
          </p>
        </div>
      </Container>
    </footer>
  );
}
