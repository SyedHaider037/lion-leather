"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils/cn";

const NAV_LINKS = [
  { href: "/collections/footwear", label: "Shoes" },
  { href: "/collections/wallets", label: "Wallets" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function SearchIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.8-3.8" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden
    >
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
        .catch(() => {
          // Quietly keep the previous count.
        });
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
      className="absolute -right-1.5 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-camel text-[0.6rem] leading-none text-espresso"
      aria-hidden
    >
      {count > 9 ? "9+" : count}
    </span>
  );
}

function NavLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative text-eyebrow uppercase text-ink transition-colors duration-500 ease-luxe",
        "after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-tan after:transition-transform after:duration-500 after:ease-luxe",
        "hover:text-tan hover:after:origin-left hover:after:scale-x-100",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the overlays on navigation (state adjustment during render —
  // the React-documented pattern for reacting to a prop/route change).
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

  useEffect(() => {
    if (!overlayOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
        // Hand focus back so keyboard users aren't left on a hidden input.
        searchButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [overlayOpen]);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const solid = scrolled || overlayOpen;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500 ease-luxe",
        solid ? "border-gold/30 bg-espresso" : "border-transparent bg-transparent",
      )}
    >
      <Container className="grid h-18 grid-cols-[1fr_auto_1fr] items-center gap-6">
        {/* Left: nav (desktop) / menu toggle (mobile) */}
        <div className="flex items-center">
          <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.href} href={link.href}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="-ml-2 flex h-10 w-10 items-center justify-center text-ink transition-colors duration-500 hover:text-tan md:hidden"
          >
            {menuOpen ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                aria-hidden
              >
                <path d="M5 5l14 14M19 5L5 19" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                aria-hidden
              >
                <path d="M3.5 9h17M3.5 15h17" />
              </svg>
            )}
          </button>
        </div>

        {/* Center: wordmark */}
        <Link
          href="/"
          className="whitespace-nowrap font-serif text-lg font-light uppercase tracking-[0.3em] text-ink md:text-xl"
        >
          Lion Leather
        </Link>

        {/* Right: search + cart */}
        <div className="flex items-center justify-end gap-5">
          <button
            ref={searchButtonRef}
            type="button"
            onClick={() => {
              setMenuOpen(false);
              setSearchOpen((v) => !v);
            }}
            aria-label="Search"
            aria-expanded={searchOpen}
            className="flex h-10 w-10 items-center justify-center text-ink transition-colors duration-500 hover:text-tan"
          >
            <SearchIcon />
          </button>
          <Link
            href="/cart"
            aria-label="Your Selection"
            className="relative flex h-10 w-10 items-center justify-center text-ink transition-colors duration-500 hover:text-tan"
          >
            <BagIcon />
            <CartCount />
          </Link>
        </div>
      </Container>

      {/* Full-screen search overlay — large serif input, hairline underline */}
      <div
        className={cn(
          "fixed inset-0 top-18 z-40 flex flex-col bg-espresso transition-opacity duration-700 ease-luxe",
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
            <label
              htmlFor="header-search"
              className="text-eyebrow uppercase text-stone"
            >
              Search
            </label>
            <div className="mt-6 flex items-center gap-6 border-b border-ink/30 transition-colors duration-500 ease-luxe focus-within:border-tan">
              <input
                id="header-search"
                ref={searchInputRef}
                type="search"
                placeholder="What are you looking for?"
                tabIndex={searchOpen ? 0 : -1}
                className="w-full bg-transparent py-4 font-serif text-3xl font-light text-ink placeholder:text-stone/50 focus:outline-none sm:text-4xl [&::-webkit-search-cancel-button]:hidden"
              />
              <button
                type="submit"
                tabIndex={searchOpen ? 0 : -1}
                className="shrink-0 text-eyebrow uppercase text-ink transition-colors duration-500 hover:text-tan"
              >
                Search
              </button>
            </div>
            <p className="mt-6 text-caption font-light text-stone">
              Begin with a name, style, or material.
            </p>
          </form>
        </div>
      </div>

      {/* Mobile full-screen overlay menu — slow fade */}
      <div
        className={cn(
          "fixed inset-0 top-18 z-40 flex flex-col items-center justify-center gap-10 bg-espresso transition-opacity duration-700 ease-luxe md:hidden",
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!menuOpen}
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            tabIndex={menuOpen ? 0 : -1}
            className="font-serif text-3xl font-light text-ink transition-colors duration-500 hover:text-tan"
          >
            {link.label}
          </Link>
        ))}
        <span className="mt-4 h-px w-16 bg-gold/30" aria-hidden />
        <span className="select-none font-serif text-sm tracking-[0.3em] text-gold">
          LL
        </span>
      </div>
    </header>
  );
}
