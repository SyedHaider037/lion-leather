"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  cartRemoveLineAction,
  cartUpdateLineAction,
} from "@/lib/cart/actions";
import { useFocusTrap } from "@/lib/hooks/useFocusTrap";
import type { Cart } from "@/lib/shopify/queries/cart";
import { cn } from "@/lib/utils/cn";
import { formatMoney } from "@/lib/utils/money";

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useFocusTrap(open, panelRef, () => setOpen(false));

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cart", { cache: "no-store" });
      const json = (await res.json()) as { cart: Cart | null };
      setCart(json.cart);
    } catch {
      // Leave the previous cart in place on failure.
    } finally {
      setLoading(false);
    }
  }, []);

  // Open from the header; refresh on external cart changes.
  useEffect(() => {
    const onOpen = () => {
      setOpen(true);
      void refresh();
    };
    const onUpdated = () => void refresh();
    window.addEventListener("cart:open", onOpen);
    window.addEventListener("cart:updated", onUpdated);
    return () => {
      window.removeEventListener("cart:open", onOpen);
      window.removeEventListener("cart:updated", onUpdated);
    };
  }, [refresh]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  async function mutate(fn: () => Promise<Cart | null>) {
    setBusy(true);
    try {
      const updated = await fn();
      setCart(updated);
      window.dispatchEvent(new Event("cart:updated"));
    } finally {
      setBusy(false);
    }
  }

  const lines = cart?.lines.nodes ?? [];
  const isEmpty = !cart || cart.totalQuantity === 0;

  return (
    <div
      className={cn("fixed inset-0 z-[70]", open ? "" : "pointer-events-none")}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={cn(
          "absolute inset-0 bg-ink/40 transition-opacity duration-500 ease-luxe",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Panel */}
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Your selection"
        className={cn(
          "absolute inset-y-0 right-0 flex w-full flex-col bg-paper transition-transform duration-500 ease-luxe sm:w-[420px]",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <header className="flex items-center justify-between border-b border-gold/30 px-6 py-5">
          <p className="text-eyebrow uppercase text-ink">Your Selection</p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="text-ink transition-colors duration-500 hover:text-cognac"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>
        </header>

        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
            <span className="select-none font-serif text-sm tracking-[0.3em] text-gold">
              LL
            </span>
            <p className="font-serif text-2xl font-medium text-ink">
              Your collection awaits.
            </p>
            <Link
              href="/collections/footwear"
              onClick={() => setOpen(false)}
              className="border border-ink/40 px-8 py-3 text-eyebrow uppercase tracking-[0.15em] text-ink transition-all duration-500 ease-luxe hover:border-cognac hover:bg-cognac hover:text-paper"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <ul className="space-y-6">
                {lines.map((line) => (
                  <li
                    key={line.id}
                    className="flex gap-4 border-b border-gold/30 pb-6"
                  >
                    <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-surface">
                      {line.merchandise.image ? (
                        <Image
                          src={line.merchandise.image.url}
                          alt={line.merchandise.image.altText ?? line.merchandise.product.title}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-serif text-base font-medium text-ink">
                        {line.merchandise.product.title}
                      </p>
                      <p className="mt-1 text-eyebrow uppercase text-taupe">
                        {line.merchandise.title}
                      </p>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 text-ink">
                          <button
                            type="button"
                            disabled={busy}
                            aria-label="Decrease quantity"
                            onClick={() => mutate(() => cartUpdateLineAction(line.id, line.quantity - 1))}
                            className="h-7 w-7 border border-ink/30 transition-colors duration-300 hover:border-cognac hover:text-cognac disabled:opacity-40"
                          >
                            −
                          </button>
                          <span className="min-w-6 text-center text-caption">{line.quantity}</span>
                          <button
                            type="button"
                            disabled={busy}
                            aria-label="Increase quantity"
                            onClick={() => mutate(() => cartUpdateLineAction(line.id, line.quantity + 1))}
                            className="h-7 w-7 border border-ink/30 transition-colors duration-300 hover:border-cognac hover:text-cognac disabled:opacity-40"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-caption text-taupe">
                          {formatMoney(line.merchandise.price.amount, line.merchandise.price.currencyCode)}
                        </p>
                      </div>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => mutate(() => cartRemoveLineAction(line.id))}
                        className="mt-3 text-caption text-taupe underline-offset-4 transition-colors duration-300 hover:text-cognac disabled:opacity-40"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <footer className="border-t border-gold/30 px-6 py-6">
              <div className="flex items-center justify-between">
                <p className="text-eyebrow uppercase text-taupe">Subtotal</p>
                <p className="text-caption text-ink">
                  {formatMoney(cart.cost.subtotalAmount.amount, cart.cost.subtotalAmount.currencyCode)}
                </p>
              </div>

              <a
                href={cart.checkoutUrl}
                className="mt-5 flex h-14 w-full items-center justify-center border border-cognac bg-cognac text-eyebrow uppercase tracking-[0.15em] text-paper transition-all duration-500 ease-luxe hover:brightness-110"
              >
                Proceed to Checkout
              </a>

              {/* Express pay — presented on Shopify's secure checkout */}
              <div className="mt-3 grid grid-cols-2 gap-3">
                <a
                  href={cart.checkoutUrl}
                  className="flex h-11 items-center justify-center border border-ink/30 text-eyebrow uppercase tracking-[0.12em] text-ink transition-colors duration-500 ease-luxe hover:border-cognac hover:text-cognac"
                >
                  Shop Pay
                </a>
                <a
                  href={cart.checkoutUrl}
                  className="flex h-11 items-center justify-center border border-ink/30 text-eyebrow uppercase tracking-[0.12em] text-ink transition-colors duration-500 ease-luxe hover:border-cognac hover:text-cognac"
                >
                  Apple Pay
                </a>
              </div>

              <p className="mt-3 text-center text-caption font-light text-taupe">
                Secure &amp; seamless checkout
              </p>
            </footer>
          </>
        )}

        {loading ? (
          <div className="absolute inset-x-0 top-16 text-center text-caption text-taupe">
            Updating…
          </div>
        ) : null}
      </aside>
    </div>
  );
}
