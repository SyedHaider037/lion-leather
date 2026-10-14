import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";

import { CartDrawer } from "@/components/cart/CartDrawer";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getSiteUrl } from "@/lib/env";

import "./globals.css";

// Variable font: keep the optical-size axis so large display text engages a
// higher optical size (via font-optical-sizing: auto). Weight stays variable
// (450–500 applied at the component level).
const display = Fraunces({
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  // "./" resolves to each page's own URL against metadataBase.
  alternates: { canonical: "./" },
  title: {
    default: "Lion Leather",
    template: "%s · Lion Leather",
  },
  description:
    "Premium leather footwear and accessories — timeless elegance for the modern gentleman.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    siteName: "Lion Leather",
    type: "website",
    locale: "en_US",
    title: "Lion Leather",
    description:
      "Premium leather footwear and accessories — timeless elegance for the modern gentleman.",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // The inline script below adds the "js" class before hydration, so the
      // class list intentionally differs from the server HTML.
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper font-sans text-ink">
        {/* Marks JS availability before first paint: scroll-reveal hiding is
            gated on html.js so content is never hidden when JS can't run. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js');",
          }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:border focus:border-cognac focus:bg-paper focus:px-5 focus:py-3 focus:text-eyebrow focus:uppercase focus:text-ink"
        >
          Skip to content
        </a>
        <Header />
        <main id="main-content" tabIndex={-1} className="flex-1 pt-18 focus:outline-none">
          {children}
        </main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
