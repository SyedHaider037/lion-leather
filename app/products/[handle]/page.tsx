import Link from "next/link";
import { redirect } from "next/navigation";

import { MobileAddToCartBar } from "@/components/product/MobileAddToCartBar";
import { ProductGallery } from "@/components/product/ProductGallery";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { addLinesOrCreateCart } from "@/lib/cart/actions";
import { getCartIdFromCookie, setCartIdCookie } from "@/lib/cart/session";
import { storefrontRequest } from "@/lib/shopify/client";
import {
  PRODUCT_BY_HANDLE_QUERY,
  type ProductByHandleQueryData,
} from "@/lib/shopify/queries/products";
import { cn } from "@/lib/utils/cn";
import { formatMoney } from "@/lib/utils/money";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const resolvedParams = await params;
  const rawHandle = resolvedParams?.handle;
  const handle =
    typeof rawHandle === "string" ? decodeURIComponent(rawHandle).trim() : "";
  if (!handle) return { title: "Product" };

  try {
    const data = await storefrontRequest<ProductByHandleQueryData>(
      PRODUCT_BY_HANDLE_QUERY,
      { handle },
    );
    const product = data.product;
    if (!product) return { title: "Product not found" };

    const description =
      product.shortDescription?.value?.trim() ||
      product.description.trim().split(/\n+/)[0] ||
      `${product.title} — Lion Leather.`;
    return {
      title: product.title,
      description,
      openGraph: {
        title: product.title,
        description,
        images: product.featuredImage
          ? [
              {
                url: product.featuredImage.url,
                alt: product.featuredImage.altText ?? product.title,
              },
            ]
          : undefined,
      },
    };
  } catch {
    return { title: "Product" };
  }
}

function parseFeatures(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 8);
}

function ProductNotFound() {
  return (
    <Section className="pt-14 sm:pt-20">
      <Eyebrow>Product</Eyebrow>
      <Heading as="h1" className="mt-6">
        Product not found
      </Heading>
      <p className="mt-6 max-w-xl text-body font-light text-stone">
        The piece you’re looking for isn’t available.
      </p>
    </Section>
  );
}

const CARE_COPY =
  "Wipe gently with a soft, dry cloth after wearing. Condition the leather every few months, keep away from direct heat, and store with cedar trees or in the dust bag provided. Leather deepens in character with time — let it.";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const resolvedParams = await params;
  const rawHandle = resolvedParams?.handle;
  const handle =
    typeof rawHandle === "string" ? decodeURIComponent(rawHandle).trim() : "";

  if (!handle) {
    return <ProductNotFound />;
  }

  let product: ProductByHandleQueryData["product"] = null;
  try {
    const data = await storefrontRequest<ProductByHandleQueryData>(
      PRODUCT_BY_HANDLE_QUERY,
      { handle },
    );
    product = data.product;
  } catch (err) {
    console.error("[PDP] Storefront error", err);
  }

  if (!product) {
    return <ProductNotFound />;
  }

  const images = product.images.nodes.length
    ? product.images.nodes
    : product.featuredImage
      ? [product.featuredImage]
      : [];

  const variantNodes = product.variants.edges.map((e) => e.node);
  const firstVariant =
    variantNodes.find((v) => v.availableForSale) ?? variantNodes[0];

  if (!firstVariant) {
    return <ProductNotFound />;
  }

  const price = formatMoney(firstVariant.price.amount, firstVariant.price.currencyCode);
  const shortDescription =
    product.shortDescription?.value?.trim() ||
    product.description.trim().split(/\n+/)[0] ||
    "A refined essential crafted for formal occasions and timeless style.";

  const features = parseFeatures(product.features?.value);
  const productVariantEdges = product.variants.edges;

  // Hide the selector for single-variant products (Shopify's "Default Title").
  const hasVariantChoices =
    variantNodes.length > 1 ||
    (variantNodes.length === 1 && variantNodes[0].title !== "Default Title");
  const selectorLabel =
    product.options.length === 1 ? product.options[0].name : "Variant";

  const detailsText = product.description.trim();

  async function addToCart(formData: FormData) {
    "use server";

    // Honor the selected variant; fall back to the first variant
    // (edges[0].node.id) exactly as before if nothing valid was chosen.
    const selected = String(formData.get("variantId") ?? "");
    const variantId = productVariantEdges.some((e) => e.node.id === selected)
      ? selected
      : (productVariantEdges[0]?.node?.id ?? firstVariant.id);

    const existingCartId = await getCartIdFromCookie();

    // If the cookie's cart has expired or been deleted, this transparently
    // starts a fresh cart with the same line instead of throwing.
    const { cart, created } = await addLinesOrCreateCart({
      cartId: existingCartId,
      lines: [{ merchandiseId: variantId, quantity: 1 }],
    });

    if (created) await setCartIdCookie(cart.id);

    redirect("/cart");
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: shortDescription,
    image: images.map((i) => i.url),
    brand: { "@type": "Brand", name: "Lion Leather" },
    offers: {
      "@type": "Offer",
      priceCurrency: firstVariant.price.currencyCode,
      price: Number(firstVariant.price.amount),
      availability: firstVariant.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <Section className="bg-white pt-14 sm:pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Sticky gallery */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <ProductGallery images={images} title={product.title} />
        </div>

        <div className="lg:pt-2">
          <Eyebrow>Lion Leather</Eyebrow>
          <Heading as="h1" tone="title" className="mt-6">
            {product.title}
          </Heading>

          <p className="mt-6 text-body text-ink">{price}</p>

          <p className="mt-8 max-w-xl text-body font-light text-stone">
            {shortDescription}
          </p>

          {features.length ? (
            <ul className="mt-10">
              {features.map((f) => (
                <li
                  key={f}
                  className="border-t border-gold/30 py-3 text-eyebrow uppercase text-ink last:border-b"
                >
                  {f}
                </li>
              ))}
            </ul>
          ) : null}

          <form action={addToCart} id="pdp-add-form" className="mt-12">
            {hasVariantChoices ? (
              <fieldset className="mb-10">
                <legend className="text-eyebrow uppercase text-ink">
                  {selectorLabel}
                </legend>
                <div className="mt-4 flex flex-wrap gap-3">
                  {variantNodes.map((v) => (
                    <label
                      key={v.id}
                      className={cn(
                        "border px-5 py-3 text-eyebrow uppercase transition-colors duration-500 ease-luxe",
                        "has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold",
                        v.availableForSale
                          ? "cursor-pointer border-ink/40 text-ink hover:border-ink has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-cream"
                          : "cursor-not-allowed border-ink/15 text-stone/60 line-through",
                      )}
                    >
                      <input
                        type="radio"
                        name="variantId"
                        value={v.id}
                        defaultChecked={v.id === firstVariant.id}
                        disabled={!v.availableForSale}
                        className="sr-only"
                      />
                      {v.title}
                    </label>
                  ))}
                </div>

                <Link
                  href="/sizing-guide"
                  className="mt-5 inline-block text-eyebrow uppercase text-stone transition-colors duration-500 ease-luxe hover:text-tan"
                >
                  Size Guide →
                </Link>
              </fieldset>
            ) : null}

            <SubmitButton
              id="pdp-add-button"
              className="w-full justify-center"
              pendingText="Adding…"
            >
              Add to Selection
            </SubmitButton>
          </form>

          <p className="mt-6 text-center text-caption font-light text-stone">
            For weddings, the office, and every occasion in between.
          </p>
          <p className="mt-2 text-center text-caption text-stone">
            Secure &amp; Seamless Checkout
          </p>

          {/* Details / care accordion */}
          <div className="mt-14 border-t border-gold/30">
            {detailsText ? (
              <details className="group border-b border-gold/30">
                <summary className="flex cursor-pointer list-none items-center justify-between py-5 text-eyebrow uppercase text-ink [&::-webkit-details-marker]:hidden">
                  Details
                  <span
                    aria-hidden
                    className="font-serif text-lg font-light text-stone transition-transform duration-500 ease-luxe group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="whitespace-pre-line pb-6 text-body font-light text-stone">
                  {detailsText}
                </p>
              </details>
            ) : null}

            <details className="group border-b border-gold/30">
              <summary className="flex cursor-pointer list-none items-center justify-between py-5 text-eyebrow uppercase text-ink [&::-webkit-details-marker]:hidden">
                Care
                <span
                  aria-hidden
                  className="font-serif text-lg font-light text-stone transition-transform duration-500 ease-luxe group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="pb-6 text-body font-light text-stone">
                {CARE_COPY}
              </p>
            </details>
          </div>
        </div>
      </div>

      <MobileAddToCartBar
        productName={product.title}
        formId="pdp-add-form"
        anchorId="pdp-add-button"
      />
    </Section>
  );
}
