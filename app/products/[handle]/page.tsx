import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import {
  AddToCartForm,
  type AddToCartState,
} from "@/components/product/AddToCartForm";
import { MobileAddToCartBar } from "@/components/product/MobileAddToCartBar";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SelectedVariant } from "@/components/product/SelectedVariant";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { addLinesOrCreateCart } from "@/lib/cart/api";
import { getCartIdFromCookie, setCartIdCookie } from "@/lib/cart/session";
import { storefrontRequest } from "@/lib/shopify/client";
import {
  PRODUCT_BY_HANDLE_QUERY,
  PRODUCT_RECOMMENDATIONS_QUERY,
  type ProductByHandleQueryData,
  type ProductCard,
  type ProductRecommendationsData,
} from "@/lib/shopify/queries/products";
import { getSizeGuideHref } from "@/lib/size-guides";
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
      twitter: product.featuredImage
        ? {
            card: "summary_large_image",
            title: product.title,
            description,
            images: [product.featuredImage.url],
          }
        : undefined,
    };
  } catch {
    return { title: "Product" };
  }
}

/**
 * Shopify descriptions arrive with bullets glued to the prior word
 * ("wear• Premium", "Features:- Slim"). Put each bullet on its own line
 * without splitting hyphenated words like "full-grain".
 */
function formatDescription(raw: string): string {
  return raw
    .replace(/\s*•\s*/g, "\n• ")
    .replace(/([^\s])-\s+(?=\S)/g, "$1\n- ")
    .replace(/\n{2,}/g, "\n")
    .trim();
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
      <p className="mt-6 max-w-xl text-body font-light text-taupe">
        The piece you’re looking for isn’t available.
      </p>
    </Section>
  );
}

const CARE_COPY =
  "Wipe gently with a soft, dry cloth after wearing. Condition the leather every few months, keep away from direct heat, and store with cedar trees or in the dust bag provided. Leather deepens in character with time — let it.";

const WHATSAPP_URL = "https://wa.me/923000000000";

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
    notFound();
  }

  let product: ProductByHandleQueryData["product"] = null;
  let fetchFailed = false;
  try {
    const data = await storefrontRequest<ProductByHandleQueryData>(
      PRODUCT_BY_HANDLE_QUERY,
      { handle },
    );
    product = data.product;
  } catch (err) {
    console.error("[PDP] Storefront error", err);
    fetchFailed = true;
  }

  if (!product) {
    // A real 404 only when Shopify answered "no such product"; an API outage
    // keeps the soft message so a temporary failure is not cached as a 404.
    if (!fetchFailed) notFound();
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

  const soldOut = !variantNodes.some((v) => v.availableForSale);

  const category = product.collections.nodes[0] ?? null;
  const sizeGuideHref = getSizeGuideHref(
    product.collections.nodes.map((c) => c.handle),
  );
  const macroImage = images[1] ?? images[0] ?? null;

  let related: ProductCard[] = [];
  try {
    const rec = await storefrontRequest<ProductRecommendationsData>(
      PRODUCT_RECOMMENDATIONS_QUERY,
      { productId: product.id },
    );
    related = (rec.productRecommendations ?? [])
      .filter((p) => p.handle !== product?.handle)
      .slice(0, 4);
  } catch (err) {
    console.error("[PDP] recommendations error", err);
  }

  const price = formatMoney(firstVariant.price.amount, firstVariant.price.currencyCode);
  const formattedDescription = formatDescription(product.description);
  const shortDescription =
    product.shortDescription?.value?.trim() ||
    formattedDescription.split(/\n+/)[0] ||
    "A refined essential crafted for formal occasions and timeless style.";

  const features = parseFeatures(product.features?.value);
  const productVariantEdges = product.variants.edges;

  // Hide the selector for single-variant products (Shopify's "Default Title").
  const hasVariantChoices =
    variantNodes.length > 1 ||
    (variantNodes.length === 1 && variantNodes[0].title !== "Default Title");
  const selectorLabel =
    product.options.length === 1 ? product.options[0].name : "Variant";

  const detailsText = formattedDescription;

  async function addToCart(
    _prev: AddToCartState,
    formData: FormData,
  ): Promise<AddToCartState> {
    "use server";

    // Honor the selected variant; fall back to the first variant
    // (edges[0].node.id) exactly as before if nothing valid was chosen.
    const selected = String(formData.get("variantId") ?? "");
    const variantId = productVariantEdges.some((e) => e.node.id === selected)
      ? selected
      : (productVariantEdges[0]?.node?.id ?? firstVariant.id);

    try {
      const existingCartId = await getCartIdFromCookie();

      // If the cookie's cart has expired or been deleted, this transparently
      // starts a fresh cart with the same line instead of throwing.
      const { cart, created } = await addLinesOrCreateCart({
        cartId: existingCartId,
        lines: [{ merchandiseId: variantId, quantity: 1 }],
      });

      if (created) await setCartIdCookie(cart.id);
    } catch (err) {
      console.error("[PDP] Add to cart failed", err);
      return {
        error:
          "We couldn't add this to your selection. It may be sold out. Please try again.",
      };
    }

    // Outside the try/catch: redirect() works by throwing.
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
    <Section className="pt-14 sm:pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-8 text-eyebrow uppercase text-taupe">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="transition-colors duration-500 ease-luxe hover:text-cognac">
              Home
            </Link>
          </li>
          {category ? (
            <>
              <li aria-hidden>/</li>
              <li>
                <Link
                  href={`/collections/${category.handle}`}
                  className="transition-colors duration-500 ease-luxe hover:text-cognac"
                >
                  {category.title}
                </Link>
              </li>
            </>
          ) : null}
          <li aria-hidden>/</li>
          <li className="text-ink">{product.title}</li>
        </ol>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Gallery column scrolls; the info column is sticky */}
        <div>
          <ProductGallery images={images} title={product.title} />
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start lg:pt-2">
          <Eyebrow>Lion Leather</Eyebrow>
          <Heading as="h1" tone="title" className="mt-6">
            {product.title}
          </Heading>

          <p className="mt-6 text-body text-ink">{price}</p>

          <p className="mt-8 max-w-xl text-body font-light text-taupe">
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

          <AddToCartForm action={addToCart} id="pdp-add-form">
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
                        "border px-6 py-3 text-eyebrow uppercase transition-colors duration-500 ease-luxe",
                        "has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold",
                        v.availableForSale
                          ? "cursor-pointer border-ink/40 text-ink hover:border-ink has-[:checked]:border-cognac has-[:checked]:bg-cognac has-[:checked]:text-paper"
                          : "cursor-not-allowed border-ink/15 text-taupe/60 line-through",
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
                      {v.availableForSale ? null : (
                        <span className="sr-only"> (sold out)</span>
                      )}
                    </label>
                  ))}
                </div>

                <SelectedVariant
                  label={selectorLabel}
                  initial={firstVariant.title}
                />

                {sizeGuideHref ? (
                  <Link
                    href={sizeGuideHref}
                    className="mt-4 inline-block text-eyebrow uppercase text-taupe transition-colors duration-500 ease-luxe hover:text-cognac"
                  >
                    Size Guide →
                  </Link>
                ) : null}
              </fieldset>
            ) : null}

            {soldOut ? (
              <Button
                id="pdp-add-button"
                type="button"
                disabled
                className="w-full justify-center"
              >
                Sold out
              </Button>
            ) : (
              <SubmitButton
                id="pdp-add-button"
                className="w-full justify-center"
                pendingText="Adding…"
              >
                Add to Selection
              </SubmitButton>
            )}
          </AddToCartForm>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-caption font-light text-taupe">
            <span>Ships from Lahore, Pakistan</span>
            <span aria-hidden className="text-gold/50">·</span>
            <span>Secure checkout via Shopify</span>
            <span aria-hidden className="text-gold/50">·</span>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="transition-colors duration-500 ease-luxe hover:text-cognac"
            >
              Questions? WhatsApp us
            </a>
          </div>

          {/* Spec list (metafields) */}
          {product.leatherType?.value || product.dimensions?.value ? (
            <dl className="mt-12 border-t border-gold/30">
              {product.leatherType?.value ? (
                <div className="flex items-baseline justify-between gap-6 border-b border-gold/30 py-3">
                  <dt className="text-eyebrow uppercase text-taupe">Leather</dt>
                  <dd className="text-caption text-ink">
                    {product.leatherType.value}
                  </dd>
                </div>
              ) : null}
              {product.dimensions?.value ? (
                <div className="flex items-baseline justify-between gap-6 border-b border-gold/30 py-3">
                  <dt className="text-eyebrow uppercase text-taupe">
                    Dimensions
                  </dt>
                  <dd className="text-caption text-ink">
                    {product.dimensions.value}
                  </dd>
                </div>
              ) : null}
            </dl>
          ) : null}

          {/* Details / care accordion */}
          <div className="mt-14 border-t border-gold/30">
            {detailsText ? (
              <details className="group border-b border-gold/30">
                <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-eyebrow uppercase text-ink [&::-webkit-details-marker]:hidden">
                  Details
                  <span
                    aria-hidden
                    className="font-serif text-lg font-light text-taupe transition-transform duration-500 ease-luxe group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="whitespace-pre-line pb-6 text-body font-light text-taupe">
                  {detailsText}
                </p>
              </details>
            ) : null}

            <details className="group border-b border-gold/30">
              <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-eyebrow uppercase text-ink [&::-webkit-details-marker]:hidden">
                Care
                <span
                  aria-hidden
                  className="font-serif text-lg font-light text-taupe transition-transform duration-500 ease-luxe group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="pb-6 text-body font-light text-taupe">
                {CARE_COPY}
              </p>
            </details>
          </div>
        </div>
      </div>

      {/* Materiality moment — a large macro frame with a one-line caption */}
      {macroImage ? (
        <Reveal variant="scale" className="mt-24">
          <PhotoFrame
            image={macroImage}
            alt={macroImage.altText ?? `${product.title} — leather detail`}
            aspect="aspect-[3/2]"
            sizes="100vw"
          />
          <p className="mt-6 max-w-md font-serif text-h3 font-light italic text-taupe">
            The grain deepens with wear — a patina that becomes yours alone.
          </p>
        </Reveal>
      ) : null}

      {related.length ? (
        <div className="mt-24 border-t border-gold/30 pt-16">
          <SectionTitle
            eyebrow="More to explore"
            title="You may also like"
          />
          <div className="mt-12">
            <ProductGrid products={related} columns={4} centerWhenSparse={false} />
          </div>
        </div>
      ) : null}

      <MobileAddToCartBar
        productName={product.title}
        formId="pdp-add-form"
        anchorId="pdp-add-button"
        soldOut={soldOut}
      />
    </Section>
  );
}
