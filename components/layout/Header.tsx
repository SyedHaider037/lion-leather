"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { CategoryNav } from "@/components/layout/CategoryNav";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils/cn";

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
      <path d="M3.5 8h17M3.5 16h17" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.8-3.8" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
      <path d="M5 8h14l-1.2 12.2a1.5 1.5 0 0 1-1.5 1.3H7.7a1.5 1.5 0 0 1-1.5-1.3L5 8Z" />
      <path d="M8.5 10V6.5a3.5 3.5 0 0 1 7 0V10" />
    </svg>
  );
}

function CartCount() {
  const [count, setCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      fetch("/api/cart/count", { cache: "no-store" })
        .then((res) => (res.ok ? res.json() : null))
        .then((json: { count?: number } | null) => {
          if (!cancelled && json && typeof json.count === "number") {
            setCount(json.count);
          }
        })
        .catch(() => {});
    };
    load();
    window.addEventListener("cart:updated", load);
    return () => {
      cancelled = true;
      window.removeEventListener("cart:updated", load);
    };
  }, [pathname]);

  if (count <= 0) return null;
  return (
    <span
      className="absolute -right-1.5 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-cognac text-[0.6rem] leading-none text-paper"
      aria-hidden
    >
      {count > 9 ? "9+" : count}
    </span>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close overlays on navigation (state adjustment during render).
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
    setSearchOpen(false);
  }

  const overlayOpen = menuOpen || searchOpen;

  useEffect(() => {
    document.body.style.overflow = overlayOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [overlayOpen]);

  // Search overlay: Esc closes and returns focus (menu handles its own trap).
  useEffect(() => {
    if (!searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        searchButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const solid = scrolled || overlayOpen;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500 ease-luxe",
        solid ? "border-taupe/30 bg-paper" : "border-transparent bg-transparent",
      )}
    >
      <Container className="grid h-18 grid-cols-[1fr_auto_1fr] items-center gap-2 min-[440px]:gap-6">
        {/* Left: menu trigger → category nav */}
        <div className="flex items-center">
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => {
              setSearchOpen(false);
              setMenuOpen(true);
            }}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="-ml-2 flex min-h-11 min-w-11 items-center justify-center gap-2 px-2 py-1 text-ink transition-colors duration-500 ease-luxe hover:text-cognac"
          >
            <MenuIcon />
            <span className="hidden text-eyebrow uppercase md:inline">Menu</span>
          </button>
        </div>

        {/* Center: wordmark */}
        <Link
          href="/"
          className="inline-flex min-h-11 items-center whitespace-nowrap font-serif text-sm font-light uppercase tracking-[0.18em] text-ink min-[440px]:text-lg min-[440px]:tracking-[0.3em] md:text-xl"
        >
          Lion Leather
        </Link>

        {/* Right: search + cart */}
        <div className="flex items-center justify-end gap-1 min-[440px]:gap-5">
          <button
            ref={searchButtonRef}
            type="button"
            onClick={() => {
              setMenuOpen(false);
              setSearchOpen((v) => !v);
            }}
            aria-label="Search"
            aria-expanded={searchOpen}
            className="flex h-11 w-11 items-center justify-center text-ink transition-colors duration-500 hover:text-cognac"
          >
            <SearchIcon />
          </button>
          <Link
            href="/cart"
            aria-label="Your Selection"
            onClick={(e) => {
              e.preventDefault();
              window.dispatchEvent(new Event("cart:open"));
            }}
            className="relative flex h-11 w-11 items-center justify-center text-ink transition-colors duration-500 hover:text-cognac"
          >
            <BagIcon />
            <CartCount />
          </Link>
        </div>
      </Container>

      {/* Full-screen search overlay */}
      <div
        className={cn(
          "fixed inset-0 top-18 z-40 flex flex-col bg-paper transition-opacity duration-700 ease-luxe",
          searchOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!searchOpen}
      >
        <div className="flex flex-1 items-center justify-center px-6">
          <form
            className="w-full max-w-2xl"
            onSubmit={(e) => {
              e.preventDefault();
              const q = searchInputRef.current?.value.trim() ?? "";
              setSearchOpen(false);
              router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
            }}
          >
            <label htmlFor="header-search" className="text-eyebrow uppercase text-taupe">
              Search
            </label>
            <div className="mt-6 flex items-center gap-6 border-b border-cognac/40 transition-colors duration-500 ease-luxe focus-within:border-cognac">
              <input
                id="header-search"
                ref={searchInputRef}
                type="search"
                placeholder="What are you looking for?"
                tabIndex={searchOpen ? 0 : -1}
                className="w-full bg-transparent py-4 font-serif text-3xl font-light text-ink placeholder:text-taupe/60 focus:outline-none sm:text-4xl [&::-webkit-search-cancel-button]:hidden"
              />
              <button
                type="submit"
                tabIndex={searchOpen ? 0 : -1}
                className="shrink-0 text-eyebrow uppercase text-ink transition-colors duration-500 hover:text-cognac"
              >
                Search
              </button>
            </div>
            <p className="mt-6 text-caption font-light text-taupe">
              Begin with a name, style, or material.
            </p>
          </form>
        </div>
      </div>

      <CategoryNav
        open={menuOpen}
        onClose={() => {
          setMenuOpen(false);
          menuButtonRef.current?.focus();
        }}
      />
    </header>
  );
}
