"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { ProductGrid } from "@/components/product/ProductGrid";
import type { ProductCard } from "@/lib/shopify/queries/products";

type ApiResponse = { products: ProductCard[] };

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(t);
  }, [value, delayMs]);

  return debounced;
}

function CalmNotice({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-t border-gold/30 pt-10">
      <p className="text-body font-light text-taupe">{children}</p>
    </div>
  );
}

export function SearchClient({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlQuery = (searchParams.get("q") ?? initialQuery ?? "").trim();
  const [value, setValue] = useState(urlQuery);
  const debounced = useDebouncedValue(value, 300);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ProductCard[]>([]);
  const [error, setError] = useState<string | null>(null);

  const hasQuery = debounced.trim().length > 0;
  const queryForApi = debounced.trim();

  const endpoint = useMemo(() => {
    const qs = new URLSearchParams();
    qs.set("q", queryForApi);
    qs.set("first", "24");
    return `/api/search?${qs.toString()}`;
  }, [queryForApi]);

  useEffect(() => {
    // Keep URL in sync (shareable /search?q=)
    const next = value.trim();
    const current = (searchParams.get("q") ?? "").trim();
    if (next !== current) {
      const qs = new URLSearchParams(searchParams.toString());
      if (next) qs.set("q", next);
      else qs.delete("q");
      router.replace(`/search?${qs.toString()}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, router]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setError(null);
      setResults([]);

      if (!hasQuery) return;

      setLoading(true);
      try {
        const res = await fetch(endpoint, { method: "GET" });
        if (!res.ok) throw new Error(`Search HTTP ${res.status}`);
        const json = (await res.json()) as ApiResponse;
        if (!cancelled) setResults(json.products ?? []);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Search failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [endpoint, hasQuery]);

  return (
    <div className="mt-12">
      <label className="grid gap-3">
        <span className="sr-only">Search</span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search the collection"
          className="w-full max-w-xl border-b border-cognac/40 bg-transparent py-3 font-serif text-2xl font-light text-ink placeholder:text-taupe/60 transition-colors duration-500 ease-luxe focus:border-cognac focus:outline-none"
        />
      </label>

      <div className="mt-14">
        {loading ? (
          <CalmNotice>Searching…</CalmNotice>
        ) : error ? (
          <CalmNotice>
            Something interrupted the search. Please try again.
          </CalmNotice>
        ) : !hasQuery ? (
          <CalmNotice>Begin with a name, style, or material.</CalmNotice>
        ) : results.length ? (
          <ProductGrid products={results} columns={3} />
        ) : (
          <CalmNotice>Nothing matches just yet — try another word.</CalmNotice>
        )}
      </div>
    </div>
  );
}
