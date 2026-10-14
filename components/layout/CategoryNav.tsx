"use client";

import Link from "next/link";
import { useRef } from "react";

import { useFocusTrap } from "@/lib/hooks/useFocusTrap";
import { cn } from "@/lib/utils/cn";

const CATEGORIES = [
  { href: "/collections/footwear", label: "Shoes" },
  { href: "/collections/wallets", label: "Wallets" },
  { href: "/collections/bags", label: "Bags" },
  { href: "/collections/belts", label: "Belts" },
  { href: "/collections", label: "All" },
];

const SECONDARY = [
  { href: "/about", label: "About" },
  { href: "/craft", label: "The Craft" },
  { href: "/leather-care", label: "Care" },
  { href: "/contact", label: "Contact" },
];

export function CategoryNav({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLElement>(null);
  useFocusTrap(open, panelRef, onClose);

  return (
    <div
      className={cn("fixed inset-0 z-[55]", open ? "" : "pointer-events-none")}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-ink/40 transition-opacity duration-500 ease-luxe",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      <nav
        ref={panelRef}
        aria-label="Categories"
        inert={!open}
        className={cn(
          "absolute inset-y-0 left-0 flex w-full flex-col bg-paper transition-transform duration-500 ease-luxe sm:w-80",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-taupe/30 px-6 py-5">
          <span className="text-eyebrow uppercase text-taupe">Menu</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="text-ink transition-colors duration-500 hover:text-cognac"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-10">
          <p className="text-eyebrow uppercase text-taupe">Collections</p>
          <ul className="mt-6 space-y-4">
            {CATEGORIES.map((c) => (
              <li key={c.href}>
                <Link
                  href={c.href}
                  className="font-serif text-3xl font-medium text-ink transition-colors duration-500 ease-luxe hover:text-cognac"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="my-9 h-px bg-taupe/30" />

          <p className="text-eyebrow uppercase text-taupe">House</p>
          <ul className="mt-5 space-y-3">
            {SECONDARY.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="text-body font-light text-taupe transition-colors duration-500 ease-luxe hover:text-cognac"
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-gold/30 px-6 py-6 text-center">
          <span className="select-none font-serif text-sm tracking-[0.3em] text-gold">
            LL
          </span>
        </div>
      </nav>
    </div>
  );
}
