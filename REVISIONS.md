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
