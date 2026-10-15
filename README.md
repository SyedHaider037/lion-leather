# Lion Leather

[![CI](https://github.com/SyedHaider037/lion-leather/actions/workflows/ci.yml/badge.svg)](https://github.com/SyedHaider037/lion-leather/actions/workflows/ci.yml)

A headless e-commerce storefront for premium leather footwear and accessories, built on Next.js and the Shopify Storefront API.

> **Work in progress.** "Lion Leather" is a working title and may change. The project is under active development, not production-ready, and not a finished product.

## Stack

- Next.js 16 (App Router) and React 19
- TypeScript
- Tailwind CSS 4
- Shopify Storefront API (GraphQL), accessed server-side
- zod for environment validation

## Getting started

Requires Node.js 20.9 or newer (a requirement of Next.js 16). Running the tests needs Node.js 22.12 or newer (a requirement of Vitest 5).

```bash
npm install
cp .env.example .env.local   # then fill in your own values
npm run dev
```

The dev server runs on http://localhost:3000. You need a Shopify store with the Storefront API enabled and a Storefront API access token.

## Environment variables

Names only; see `.env.example` for placeholders. Never commit `.env.local`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `SHOPIFY_STORE_DOMAIN` | yes | Store hostname (`your-store.myshopify.com`), used for Storefront API calls. Server-only. |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | yes | Storefront API public access token, sent from the server. |
| `SHOPIFY_STOREFRONT_API_VERSION` | no | Storefront API version. Defaults to `2025-01`. |
| `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` | no | Public store hostname for checkout links, if different from the server domain. |
| `NEXT_PUBLIC_SITE_URL` | no | Public origin of the site, used for metadata, `robots.txt` and the sitemap. |

## Scripts

- `npm run dev`: start the development server
- `npm run build`: production build
- `npm run start`: serve the production build
- `npm run lint`: run ESLint
- `npm run typecheck`: type-check with `tsc --noEmit`
- `npm test`: run the unit tests (Vitest)

## Project layout

```
app/          Routes (App Router): home, collections, products, cart, search,
              content pages, API routes, robots and sitemap
components/   UI by area: cart, home, layout, product, search, ui
lib/          shopify/ (Storefront client, queries, fragments), cart/ (cookie
              session and cart actions), newsletter/, utils/, hooks/, env.ts
public/       Static assets
```

## How it works

- Product and collection pages are fetched on the server from the Storefront API and revalidated every 60 seconds.
- The cart is a Shopify cart. Its id is kept in an httpOnly cookie, and checkout happens on Shopify through the cart's `checkoutUrl`.
- The newsletter form saves the email as a Shopify customer with marketing consent.

## Known limitations

- The contact form does not send anything yet; it only shows a confirmation message. Email delivery still needs a provider.
- "Track order" opens a pre-filled WhatsApp message rather than looking up an order.
- Automated tests are limited to 35 Vitest unit tests (run `npm test`); there are no end-to-end tests.
- Collection pages expect the Shopify collection handles `wallets`, `belts`, `footwear` and `bags`; they show an empty state if a collection does not exist in the store.
- Site copy, policies and brand details are placeholders pending real business content.

## What comes next

- Email delivery for the contact form
- Production site URL, analytics and final brand name
