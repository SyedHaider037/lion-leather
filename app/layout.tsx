import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://lionleather.pk",
  ),
  title: {
    default: "Lion Leather",
    template: "%s · Lion Leather",
  },
  description:
    "Premium leather footwear and accessories — timeless elegance for the modern gentleman.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
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
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-cream font-sans text-ink">
        {/* Marks JS availability before first paint: scroll-reveal hiding is
            gated on html.js so content is never hidden when JS can't run. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js');",
          }}
        />
        <Header />
        <main className="flex-1 pt-18">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
