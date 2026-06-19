import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function CartSummary({
  subtotal,
  checkoutUrl,
}: {
  subtotal: string;
  checkoutUrl: string;
}) {
  return (
    <aside className="h-fit border border-gold/30 p-8">
      <Eyebrow className="text-ink">Summary</Eyebrow>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-caption text-stone">Subtotal</p>
        <p className="text-caption text-ink">{subtotal}</p>
      </div>

      <div className="mt-10">
        <ButtonLink href={checkoutUrl} className="w-full justify-center">
          Proceed to Checkout
        </ButtonLink>
        <p className="mt-4 text-center text-caption text-stone">
          Secure &amp; Seamless Checkout
        </p>
      </div>
    </aside>
  );
}
