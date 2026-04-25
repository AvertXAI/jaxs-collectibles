# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AvertXAI JaxsCollectibles is a Next.js 15 / React 19 e-commerce application for selling collectibles. It uses Supabase (PostgreSQL + Auth) as the backend and is deployed with the Next.js App Router.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint (v9 flat config)
```

No test runner is configured.

## Architecture

### The "Brain" Pattern

All backend logic lives in [brain/](brain/) as modular "mechanics" — never import Supabase directly in components or API routes. Two Supabase connection points exist:

- [brain/db/cortex.ts](brain/db/cortex.ts) — standard SSR client (respects RLS, user session)
- [brain/db/adminCortex.ts](brain/db/adminCortex.ts) — service-role client (bypasses RLS, admin-only)

Mechanics are organized by domain: `brain/admin/`, `brain/auth/`, `brain/cart/`, `brain/products/`, `brain/users/`. Each mechanic is a focused module (e.g., `taxMechanic.ts` handles 50-state tax calculation, `syncMechanic.ts` handles cart DB sync).

### Routing & Protection

- `app/` — Next.js App Router. Admin routes live under `app/admin/`.
- [proxy.ts](proxy.ts) — Next.js middleware that guards all `/admin` routes; runs before any page renders.
- [components/admin-session-guard.tsx](components/admin-session-guard.tsx) — client-side guard that logs out admins on tab-away or idle timeout.
- Auth flow uses Supabase with `app/auth/callback/` and `app/auth/confirm/` for OAuth/email confirmation.

### Client State

Two React Contexts wrap the app (both provided in [app/layout.tsx](app/layout.tsx)):

- [context/CartContext.tsx](context/CartContext.tsx) — cart state with optimistic UI; syncs to Supabase via `syncMechanic`.
- [context/IdentityContext.tsx](context/IdentityContext.tsx) — authenticated user state.

### Supabase Client Instances

| File | Where used |
|------|-----------|
| [lib/supabase/client.ts](lib/supabase/client.ts) | Client components |
| [lib/supabase/server.ts](lib/supabase/server.ts) | Server components / API routes |
| [brain/db/cortex.ts](brain/db/cortex.ts) | Brain mechanics (SSR) |
| [brain/db/adminCortex.ts](brain/db/adminCortex.ts) | Admin mechanics (service role) |

### Styling

- Tailwind CSS 3.4 with custom `jax` color palette (cream, midnight, lime, teal, turquoise, orange, gold, burgundy). Primary brand color: `#800020`.
- Dark mode is class-based (`darkMode: 'class'` in [tailwind.config.ts](tailwind.config.ts)).
- shadcn/ui components (new-york style) at `components/ui/`, Lucide icons.
- styled-components 6 is also installed alongside Tailwind.

## Key Conventions

- **Pre-built queries** live in [lib/queries.ts](lib/queries.ts) — check here before writing raw Supabase calls.
- **Error handling**: throw `BrainError` (from [brain/errors.ts](brain/errors.ts)) in mechanics; API routes catch and return structured responses.
- **Logging**: use [brain/logger.ts](brain/logger.ts) for traceable backend auditing.
- **Env validation**: [brain/envMechanic.ts](brain/envMechanic.ts) validates required env vars at startup.
- **Demo mode**: checkout has hardcoded demo interceptors for presentation stability — Stripe is not live.

## Environment Variables

Required in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` is used only in `adminCortex.ts` and must never be exposed to the client.

## Pending Work (from COMEPLETED.md / WORKLOG.md)

- Admin shipping control panel
- Stripe payment integration (currently demo-intercepted)
- Blog / authenticity system
- Full RLS audit on Supabase tables
