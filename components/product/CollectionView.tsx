"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { ProductGrid } from "@/components/product/ProductGrid";
import { useFocusTrap } from "@/lib/hooks/useFocusTrap";
import { cn } from "@/lib/utils/cn";
import type { FilterableProduct } from "@/lib/shopify/queries/collections";

type SortKey = "featured" | "price-asc" | "price-desc";

const PRICE_BUCKETS = [
  { id: "u5", label: "Under PKR 5,000", min: 0, max: 5000 },
  { id: "5-10", label: "PKR 5,000 – 10,000", min: 5000, max: 10000 },
  { id: "10+", label: "PKR 10,000 & above", min: 10000, max: Infinity },
];

const SORTS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "price-asc", label: "Price, Low to High" },
  { key: "price-desc", label: "Price, High to Low" },
];

const priceOf = (p: FilterableProduct) =>
  Number(p.priceRange.minVariantPrice.amount);
const inBucket = (p: FilterableProduct, b: (typeof PRICE_BUCKETS)[number]) => {
  const v = priceOf(p);
  return v >= b.min && v < b.max;
};
const uniqueSorted = (xs: string[]) =>
  [...new Set(xs.filter(Boolean))].sort((a, b) => a.localeCompare(b));

function toggle(set: Set<string>, value: string) {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

function FacetGroup({
  heading,
  options,
  selected,
  onToggle,
}: {
  heading: string;
  options: { value: string; label: string }[];
  selected: Set<string>;
  onToggle: (value: string) => void;
}) {
  if (!options.length) return null;
  return (
    <div className="border-t border-gold/30 py-6">
      <p className="text-eyebrow uppercase text-taupe">{heading}</p>
      <ul className="mt-4 space-y-3">
        {options.map((o) => (
          <li key={o.value}>
            <label className="flex min-h-11 cursor-pointer items-center gap-3 text-caption font-light text-ink">
              <input
                type="checkbox"
                checked={selected.has(o.value)}
                onChange={() => onToggle(o.value)}
                className="h-4 w-4 shrink-0 appearance-none border border-ink/40 bg-transparent transition-colors duration-200 ease-luxe checked:border-cognac checked:bg-cognac focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cognac"
              />
              {o.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CollectionView({ products }: { products: FilterableProduct[] }) {
  const [category, setCategory] = useState<Set<string>>(new Set());
  const [colour, setColour] = useState<Set<string>>(new Set());
  const [leather, setLeather] = useState<Set<string>>(new Set());
  const [price, setPrice] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<SortKey>("featured");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useFocusTrap(drawerOpen, drawerRef, () => setDrawerOpen(false));

  const categories = useMemo(
    () => uniqueSorted(products.map((p) => p.productType)),
    [products],
  );
  const colours = useMemo(
    () => uniqueSorted(products.flatMap((p) => p.tags ?? [])),
    [products],
  );
  const leathers = useMemo(
    () => uniqueSorted(products.map((p) => p.leatherType?.value ?? "")),
    [products],
  );
  const priceBuckets = useMemo(
    () => PRICE_BUCKETS.filter((b) => products.some((p) => inBucket(p, b))),
    [products],
  );

  const hasFacets =
    categories.length || colours.length || leathers.length || priceBuckets.length;

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (category.size && !category.has(p.productType)) return false;
      if (colour.size && !(p.tags ?? []).some((t) => colour.has(t))) return false;
      if (leather.size && !(p.leatherType?.value && leather.has(p.leatherType.value)))
        return false;
      if (
        price.size &&
        !PRICE_BUCKETS.some((b) => price.has(b.id) && inBucket(p, b))
      )
        return false;
      return true;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => priceOf(a) - priceOf(b));
    else if (sort === "price-desc")
      list = [...list].sort((a, b) => priceOf(b) - priceOf(a));
    return list;
  }, [products, category, colour, leather, price, sort]);

  const pills = [
    ...[...category].map((v) => ({ v, label: v, onClear: () => setCategory((s) => toggle(s, v)) })),
    ...[...colour].map((v) => ({ v: `c-${v}`, label: v, onClear: () => setColour((s) => toggle(s, v)) })),
    ...[...leather].map((v) => ({ v: `l-${v}`, label: v, onClear: () => setLeather((s) => toggle(s, v)) })),
    ...[...price].map((id) => ({
      v: `p-${id}`,
      label: PRICE_BUCKETS.find((b) => b.id === id)?.label ?? id,
      onClear: () => setPrice((s) => toggle(s, id)),
    })),
  ];

  const clearAll = () => {
    setCategory(new Set());
    setColour(new Set());
    setLeather(new Set());
    setPrice(new Set());
  };

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const facets = (
    <>
      <FacetGroup
        heading="Category"
        options={categories.map((c) => ({ value: c, label: c }))}
        selected={category}
        onToggle={(v) => setCategory((s) => toggle(s, v))}
      />
      <FacetGroup
        heading="Colour"
        options={colours.map((c) => ({ value: c, label: c }))}
        selected={colour}
        onToggle={(v) => setColour((s) => toggle(s, v))}
      />
      <FacetGroup
        heading="Leather Type"
        options={leathers.map((c) => ({ value: c, label: c }))}
        selected={leather}
        onToggle={(v) => setLeather((s) => toggle(s, v))}
      />
      <FacetGroup
        heading="Price"
        options={priceBuckets.map((b) => ({ value: b.id, label: b.label }))}
        selected={price}
        onToggle={(v) => setPrice((s) => toggle(s, v))}
      />
    </>
  );

  return (
    <div className="lg:grid lg:grid-cols-[264px_1fr] lg:gap-12">
      {/* Desktop sticky, independently scrollable sidebar */}
      {hasFacets ? (
        <aside className="hidden lg:block">
          <div className="sticky top-28 max-h-[calc(100vh-9rem)] overflow-y-auto pr-2">
            <p className="text-eyebrow uppercase text-ink">Filter</p>
            {facets}
          </div>
        </aside>
      ) : null}

      <div>
        {/* Controls row: mobile filter button + sort */}
        <div className="flex items-center justify-between gap-4">
          {hasFacets ? (
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="inline-flex min-h-11 items-center text-eyebrow uppercase text-ink transition-colors duration-200 ease-luxe hover:text-cognac lg:hidden"
            >
              Filter{pills.length ? ` (${pills.length})` : ""}
            </button>
          ) : (
            <span className="lg:hidden" />
          )}

          <label className="ml-auto flex items-center gap-3 text-eyebrow uppercase text-taupe">
            <span className="hidden sm:inline">Sort</span>
            <select
              aria-label="Sort products"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="border-b border-ink/30 bg-transparent min-h-11 py-1 text-eyebrow uppercase text-ink transition-colors duration-200 ease-luxe focus-visible:border-cognac focus-visible:outline-none"
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key} className="bg-paper text-ink">
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Active filter pills */}
        {pills.length ? (
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {pills.map((p) => (
              <button
                key={p.v}
                type="button"
                onClick={p.onClear}
                className="inline-flex min-h-11 items-center gap-2 border border-cognac bg-cognac/15 px-4 py-1 text-caption text-ink transition-colors duration-200 ease-luxe hover:bg-cognac hover:text-paper"
              >
                {p.label}
                <span aria-hidden>×</span>
                <span className="sr-only">Remove filter</span>
              </button>
            ))}
            <button
              type="button"
              onClick={clearAll}
              className="ml-1 inline-flex min-h-11 items-center text-caption text-taupe underline-offset-4 transition-colors duration-200 ease-luxe hover:text-cognac"
            >
              Clear all
            </button>
          </div>
        ) : null}

        <div className="mt-10">
          {filtered.length ? (
            <ProductGrid products={filtered} columns={4} centerWhenSparse={false} />
          ) : (
            <p className="py-16 text-center text-body font-light text-taupe">
              No pieces match these filters.
            </p>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          drawerOpen ? "" : "pointer-events-none",
        )}
        aria-hidden={!drawerOpen}
        inert={!drawerOpen}
      >
        <div
          onClick={() => setDrawerOpen(false)}
          className={cn(
            "absolute inset-0 bg-ink/40 transition-opacity duration-[260ms] ease-luxe",
            drawerOpen ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Filter"
          className={cn(
            "absolute inset-y-0 left-0 flex w-[85%] max-w-xs flex-col bg-surface transition-transform duration-[260ms] ease-luxe",
            drawerOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-gold/30 px-6 py-4">
            <p className="text-eyebrow uppercase text-ink">Filter</p>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close filters"
              className="text-ink transition-colors duration-200 hover:text-cognac"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
                <path d="M5 5l14 14M19 5L5 19" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6">{facets}</div>
          <div className="border-t border-gold/30 px-6 py-4">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="w-full border border-cognac bg-cognac py-3 text-eyebrow uppercase text-paper transition-all duration-200 ease-luxe hover:brightness-110"
            >
              Show {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
