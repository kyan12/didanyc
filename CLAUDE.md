# CLAUDE.md — DIDA NYC Headless Storefront

## Project
Headless Shopify storefront for DIDA NYC (https://didanyc.com).
Next.js App Router + Shopify Storefront API + Payload CMS (future).

## Stack
- **Framework**: Next.js (App Router, TypeScript, Turbopack)
- **Commerce**: Shopify Storefront API (GraphQL)
- **Hosting**: Vercel
- **CMS**: Payload (future — content pages, blog)
- **Styling**: CSS Modules with design tokens

## Architecture
- `src/lib/shopify.ts` — Shopify Storefront API client (GraphQL)
- `src/lib/shopify/` — Query fragments, types, cart mutations
- `src/components/` — Reusable UI components
- `src/app/` — Next.js routes
- `src/app/api/webhooks/shopify/` — Shopify webhook for ISR revalidation

## Key Patterns
- **SSG + ISR**: Product/collection pages use `generateStaticParams` + `revalidate`
- **Cart**: Storefront API cart mutations (createCart, addToCart, updateCart)
- **Variants**: PDP handles variant selection with URL params
- **Webhooks**: Shopify sends product/inventory updates → Next.js revalidates

## Commands
- `pnpm dev` — local dev
- `pnpm build` — production build
- `pnpm typecheck` — TypeScript check
- `pnpm lint` — ESLint

## Conventions
- CSS Modules (not Tailwind)
- Server Components by default, `"use client"` only when needed
- All Shopify queries in `src/lib/shopify/`
- Types generated from Shopify GraphQL schema
