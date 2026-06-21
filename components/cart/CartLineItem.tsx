"use client";

import Image from "next/image";
import { useEffect } from "react";

import { SubmitButton } from "@/components/ui/SubmitButton";
import type { CartLine } from "@/lib/shopify/queries/cart";

export function CartLineItem({
  cartId,
  line,
  price,
  onUpdateQuantity,
  onRemoveLine,
}: {
  cartId: string;
  line: CartLine;
  price: string;
  onUpdateQuantity: (formData: FormData) => void;
  onRemoveLine: (formData: FormData) => void;
}) {
  const img = line.merchandise.image;

  // Quantity changes redirect back to /cart (no pathname change), so the
  // header count can't rely on navigation — announce every server-confirmed
  // quantity change, and the line's removal, to keep the badge in sync.
  useEffect(() => {
    window.dispatchEvent(new Event("cart:updated"));
  }, [line.quantity]);

  useEffect(() => {
    return () => {
      window.dispatchEvent(new Event("cart:updated"));
    };
  }, []);

  return (
    <div className="border-b border-gold/30 pb-6">
      <div className="flex gap-6">
        <div className="relative h-28 w-24 shrink-0 overflow-hidden bg-surface">
          {img ? (
            <Image
              src={img.url}
              alt={img.altText ?? line.merchandise.product.title}
              fill
              sizes="96px"
              className="object-cover"
            />
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-serif text-lg font-light text-ink">
            {line.merchandise.product.title}
          </p>
          <p className="mt-1 text-eyebrow uppercase text-taupe">
            {line.merchandise.title}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <p className="text-caption text-taupe">{price}</p>

            <div className="flex items-center gap-1">
              <form action={onUpdateQuantity}>
                <input type="hidden" name="cartId" value={cartId} />
                <input type="hidden" name="lineId" value={line.id} />
                <input
                  type="hidden"
                  name="quantity"
                  value={Math.max(0, line.quantity - 1)}
                />
                <SubmitButton
                  variant="link"
                  className="h-10 w-10 after:hidden"
                  pendingText="−"
                  aria-label="Decrease quantity"
                >
                  −
                </SubmitButton>
              </form>

              <div className="min-w-8 text-center text-caption text-ink">
                {line.quantity}
              </div>

              <form action={onUpdateQuantity}>
                <input type="hidden" name="cartId" value={cartId} />
                <input type="hidden" name="lineId" value={line.id} />
                <input
                  type="hidden"
                  name="quantity"
                  value={line.quantity + 1}
                />
                <SubmitButton
                  variant="link"
                  className="h-10 w-10 after:hidden"
                  pendingText="+"
                  aria-label="Increase quantity"
                >
                  +
                </SubmitButton>
              </form>

              <form action={onRemoveLine} className="ml-4">
                <input type="hidden" name="cartId" value={cartId} />
                <input type="hidden" name="lineId" value={line.id} />
                <SubmitButton variant="link" pendingText="…">
                  Remove
                </SubmitButton>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
