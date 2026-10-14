import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

import { CartLineItem } from "@/components/cart/CartLineItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { ButtonLink } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import {
  cartLineRemoveSchema,
  cartLineUpdateSchema,
  getCart,
  removeCartLines,
  updateCartLines,
} from "@/lib/cart/api";
import { getCartIdFromCookie } from "@/lib/cart/session";
import { formatMoney } from "@/lib/utils/money";

export const metadata = {
  title: "Your Selection",
};

export const dynamic = "force-dynamic";

export default async function CartPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; notice?: string }>;
}) {
  const sp = await searchParams;
  const hasError = sp?.error === "1";
  const stockLimited = sp?.notice === "stock";
  const cartId = await getCartIdFromCookie();
  const cart = cartId ? await getCart(cartId) : null;

  async function updateCartItemQuantity(formData: FormData) {
    "use server";

    const cartId = await getCartIdFromCookie();
    const input = cartLineUpdateSchema.safeParse({
      lineId: String(formData.get("lineId") ?? ""),
      quantity: Number(formData.get("quantity") ?? 0),
    });

    if (!cartId || !input.success) return;
    const { lineId, quantity: nextQuantity } = input.data;

    try {
      if (nextQuantity <= 0) {
        await removeCartLines({ cartId, lineIds: [lineId] });
        revalidatePath("/cart");
        redirect("/cart");
      }

      const updated = await updateCartLines({
        cartId,
        lines: [{ id: lineId, quantity: nextQuantity }],
      });

      // Shopify silently clamps to available stock (no userError). Surface a
      // calm notice when the requested quantity couldn't be honoured.
      const line = updated.lines.nodes.find((l) => l.id === lineId);
      const clamped = line ? line.quantity < nextQuantity : false;

      revalidatePath("/cart");
      redirect(clamped ? "/cart?notice=stock" : "/cart");
    } catch (e) {
      // NEXT_REDIRECT is expected behavior — never treat it as an error.
      if (isRedirectError(e)) throw e;
      console.error(e);
      redirect("/cart?error=1");
    }
  }

  async function removeCartItem(formData: FormData) {
    "use server";

    const cartId = await getCartIdFromCookie();
    const input = cartLineRemoveSchema.safeParse({
      lineId: String(formData.get("lineId") ?? ""),
    });
    if (!cartId || !input.success) return;
    const { lineId } = input.data;

    try {
      await removeCartLines({ cartId, lineIds: [lineId] });
      revalidatePath("/cart");
      redirect("/cart");
    } catch (e) {
      // NEXT_REDIRECT is expected behavior — never treat it as an error.
      if (isRedirectError(e)) throw e;
      console.error(e);
      redirect("/cart?error=1");
    }
  }

  return (
    <Section>
      {!cart || cart.totalQuantity === 0 ? (
        <div className="mx-auto max-w-md text-center">
          <Divider className="mx-auto max-w-[12rem]" />
          <Heading as="h1" tone="title" className="mt-10">
            Your collection awaits.
          </Heading>
          <p className="mt-6 text-body font-light text-taupe">
            Carefully chosen pieces belong here — ready when you are.
          </p>
          <div className="mt-10">
            <ButtonLink href="/collections/footwear" variant="outline">
              Explore Collection
            </ButtonLink>
          </div>
        </div>
      ) : (
        <>
          <Eyebrow>Cart</Eyebrow>
          <Heading as="h1" className="mt-6">
            Your Selection
          </Heading>
          <p className="mt-6 max-w-xl text-body font-light text-taupe">
            Carefully chosen pieces, ready to be yours.
          </p>

          {hasError ? (
            <div className="mt-10 border-t border-error/40 pt-4">
              <p className="text-caption text-error">
                We couldn’t update your selection just now. Please try again.
              </p>
            </div>
          ) : stockLimited ? (
            <div className="mt-10 border-t border-gold/30 pt-4">
              <p className="text-caption text-taupe">
                That’s all we currently have of this piece.
              </p>
            </div>
          ) : null}

          <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-16">
            <div className="space-y-8">
              {cart.lines.nodes.map((line) => (
                <CartLineItem
                  key={line.id}
                  line={line}
                  price={formatMoney(
                    line.merchandise.price.amount,
                    line.merchandise.price.currencyCode,
                  )}
                  onUpdateQuantity={updateCartItemQuantity}
                  onRemoveLine={removeCartItem}
                />
              ))}
            </div>

            <CartSummary
              subtotal={formatMoney(
                cart.cost.subtotalAmount.amount,
                cart.cost.subtotalAmount.currencyCode,
              )}
              checkoutUrl={cart.checkoutUrl}
            />
          </div>
        </>
      )}
    </Section>
  );
}
