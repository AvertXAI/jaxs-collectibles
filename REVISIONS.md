# REVISIONS.md — AvertXAI JaxsCollectibles
## Revision & Hotfix Log

---

## [2026-04-24 — Session Start] — INIT: CLAUDE.md & Project Documentation

- **Type:** Standard
- **Issue:** No CLAUDE.md existed for AI-assisted development guidance.
- **Fix:** Created `CLAUDE.md` documenting build commands, the Brain/Cortex architecture, route protection pattern, context providers, Supabase client instances, styling conventions, and pending work.
- **Files:** `CLAUDE.md`

---

## [2026-04-24] — FIX: SSH Agent Not Available in Non-Interactive Shells

- **Type:** Hotfix
- **Issue:** `git push` failed with `Permission denied (publickey)` when invoked from Claude Code's bash tool because `SSH_AUTH_SOCK` is only exported in interactive terminal sessions (sourced via `.bashrc`), not non-interactive shells.
- **Fix:** Created `~/.ssh/git_ssh.sh` wrapper that sources `~/.ssh/agent.env` before each SSH call. Added `GIT_SSH_COMMAND` env var pointing to the wrapper in `.claude/settings.json` so all Claude Code git operations use the wrapper.
- **Files:** `~/.ssh/git_ssh.sh`, `.claude/settings.json`

---

## [2026-04-24] — CONFIG: Disable Co-Authored-By Attribution in Commits

- **Type:** Config change
- **Issue:** Claude Code was appending `Co-Authored-By: Claude` trailers to all git commits by default.
- **Fix:** Set `"includeCoAuthoredBy": false` in `.claude/settings.json`.
- **Files:** `.claude/settings.json`

---

## [2026-04-24] — CHORE: .gitignore — Exclude `code - copy (5)` Folder

- **Type:** Standard
- **Issue:** Duplicate dev folder `code - copy (5)` present in repo root risked being tracked.
- **Fix:** Added `code - copy (5)/` entry to `.gitignore`.
- **Files:** `.gitignore`

---

## [2026-04-24 — Phase 1] — FEAT: JSON Data Layer (Boilerplate Demo)

- **Type:** Feature / Conversion
- **Issue:** Boilerplate demo requires zero-dependency data storage — no Supabase, no PostgreSQL.
- **Fix:** Created flat-file JSON data layer:
  - `lib/data/products.json` — 50 pre-seeded products with all fields (id, slug, category, availability, price, stock, description, images, coa, created_at)
  - `lib/data/db.ts` — server-only CRUD module: `getProducts()`, `getProductBySlug()`, `addProduct()`, `updateProduct()`, `deleteProduct()`
- **Files:** `lib/data/products.json`, `lib/data/db.ts`

---

## [2026-04-24 — Phase 2] — FEAT: Auth Removal (Boilerplate Demo)

- **Type:** Feature / Conversion
- **Issue:** Supabase Auth and all session-gating must be stripped for the boilerplate demo. All visitors get full owner-level access with no login required.
- **Fix:**
  - `proxy.ts` — stripped all auth/role checks, now a passthrough middleware
  - All `/app/auth/*` pages and route handlers (11 files) — replaced with `redirect('/')` stubs
  - `app/layout.tsx` — removed `SupabaseProvider`, `IdentityProvider`, `AdminSessionGuard`, `AuthConfirmation`
  - `components/supabase-provider.tsx` — replaced with a mock client that returns empty data for all queries (allows gradual migration of shop pages in Phase 3)
  - `context/IdentityContext.tsx` — hardcoded to always return `role: 'owner'`, `loading: false`
  - `components/admin-session-guard.tsx` — null stub (no idle/tab-away timeouts)
  - `components/auth-confirmation.tsx` — null stub
  - `components/admin-toolbar.tsx` — always visible, God Mode badge always active, no signOut
  - `components/header.tsx` — removed Login/Logout buttons (no auth concept in demo)
  - `app/admin/layout.tsx` — removed auth gate, renders children directly
  - `app/admin/dashboard/page.tsx` — `isOwner` hardcoded `true`, removed `supabase.auth.getUser()` call
  - `app/admin/users/page.tsx` — replaced with demo stub showing single owner row
- **Files:** 13 files modified (see above)

---

## [2026-04-24 — Phase 3] — FEAT: Shop Pages & Admin Inventory Rewired to JSON Store

- **Type:** Feature / Conversion
- **Issue:** Shop pages (`/shop`, `/shop/[slug]`, `/admin/shop`) and `AddProductForm` still called `useSupabase()`, which returned an empty mock — all inventory showed blank in the boilerplate demo.
- **Fix:**
  - `app/api/products/route.ts` (new) — GET all products with pagination (`?page=X&limit=Y`) from `lib/data/db.ts`
  - `app/api/products/[id]/route.ts` (updated) — added GET handler using `getProductBySlug()`; replaced PATCH Supabase call with `updateProduct()` from db.ts
  - `app/api/admin/products/route.ts` (new) — POST new product; saves uploaded image to `/public/uploads/`, calls `addProduct()`
  - `app/api/admin/products/[id]/route.ts` (new) — DELETE handler using `deleteProduct()`
  - `app/api/admin/purge/route.ts` (updated) — replaced Supabase purge with `fs.writeFileSync(dbPath, '[]')` (clears products.json)
  - `app/api/admin/seed/route.ts` (updated) — replaced Supabase seed with copy from `lib/data/products-seed.json` → `products.json`
  - `lib/data/products-seed.json` (new) — immutable 50-product backup used by seed route to restore after purge
  - `app/shop/page.tsx` — removed `useSupabase`, fetches from `/api/products?page=X`
  - `app/shop/[slug]/page.tsx` — removed `useSupabase` multi-step lookup; fetches from `/api/products/[slug]`; preserves `demo-*` override logic
  - `app/admin/shop/page.tsx` — removed `useSupabase`; fetches from `/api/products?limit=1000`; deletes via DELETE `/api/admin/products/[id]`; accepts `onSuccess` callback to refresh list after add
  - `components/admin/add-product-form.tsx` — removed auth check and `useSupabase`; always renders (demo = always owner); POSTs FormData to `/api/admin/products`; accepts `onSuccess` prop
- **Files:** 11 files modified/created (see above)

---

## [2026-04-24 — Phase 5] — CHORE: Remove Supabase Environment & Config

- **Type:** Cleanup
- **Issue:** `next.config.ts` still allowed Supabase image hostnames as remote patterns; `package.json` still listed all three `@supabase` packages as dependencies.
- **Fix:**
  - `next.config.ts` — removed `**.supabase.co` remotePattern
  - `package.json` — removed `@supabase/auth-helpers-nextjs`, `@supabase/ssr`, `@supabase/supabase-js` from dependencies
- **Files:** `next.config.ts`, `package.json`

---

## [2026-04-24 — Phase 6] — CHORE: Delete Dead Supabase Files & Stub Brain Cortex

- **Type:** Cleanup
- **Issue:** 22+ orphaned files still imported `@supabase` packages (removed in Phase 5). Brain cortex modules (`brain/db/cortex.ts`, `brain/db/adminCortex.ts`) still used real Supabase clients, breaking all admin API routes at build time.
- **Fix:**
  - `brain/db/cortex.ts` — replaced real Supabase SSR client with no-op mock; exports `mockBrainClient` for reuse
  - `brain/db/adminCortex.ts` — replaced real Supabase service-role client; re-exports `mockBrainClient` from cortex.ts
  - `app/protected/page.tsx` — stubbed to `redirect('/')`
  - `app/faq/page.tsx` — replaced direct Supabase call with fetch from `/api/faq`
  - `app/api/faq/route.ts` (new) — public GET from `lib/data/faqs-db.ts`
  - `app/api/admin/faq/route.ts` — rewired GET/POST/PATCH/DELETE to `lib/data/faqs-db.ts` (fully functional FAQ CRUD)
  - `lib/data/faqs.json` (new) — 6 pre-seeded demo FAQ entries
  - `lib/data/faqs-db.ts` (new) — FAQ CRUD module (same pattern as products db.ts)
  - **Deleted 22 files:** `lib/supabase/` (3), `lib/supabaseClient.ts`, `components/tutorial/` (5), `components/supabase-logo.tsx`, `components/hero.tsx`, `components/next-logo.tsx`, `components/auth-button.tsx`, `components/forgot-password-form.tsx`, `components/login-form.tsx`, `components/logout-button.tsx`, `components/sign-up-form.tsx`, `components/update-password-form.tsx`, `components/deploy-button.tsx`, `components/env-var-warning.tsx`, `components/shop-grid.tsx`, `components/inventory-grid.tsx`
- **Files:** 7 modified/created, 22 deleted

---

## [2026-04-24] — CHORE: Remove Blog & Contact Pages and Header Links

- **Type:** Cleanup
- **Issue:** Blog and Contact Us were placeholder links pointing to `/under-construction`. Admin had non-functional Blog / Ledger and Inbox / Tickets sidebar sections.
- **Fix:**
  - `components/header.tsx` — removed Blog and Contact Us links from both desktop and mobile navs
  - `app/admin/dashboard/page.tsx` — removed Blog / Ledger and Inbox / Tickets from sidebar; removed unused `FileText` import
  - Deleted `app/admin/blog/` and `app/admin/contact/` directories
- **Files:** 2 modified, 2 directories deleted
