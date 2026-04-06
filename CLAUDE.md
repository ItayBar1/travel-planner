# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev          # start dev server (localhost:3000)
npm run lint         # ESLint (must pass before committing)
npm test             # run all Jest tests
npx jest --testPathPatterns=<pattern>   # run a single test file (Jest 30 — note --testPathPatterns not --testPathPattern)
```

## Architecture

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Supabase (PostgreSQL) · React 19

**Routes:** `app/page.tsx` (Timeline, default) · `app/map/` · `app/budget/` · `app/checklist/`

All pages are Server Components that fetch from Supabase, pass data as props to Client Components, and return a `<main>` element. `AppShell` (right sidebar on desktop, bottom nav on mobile) wraps every page via `app/layout.tsx`.

**Two Supabase clients — use the right one:**
- `lib/supabase/server.ts` — `async createClient()` — Server Components and Server Actions only (uses `next/headers` cookies)
- `lib/supabase/client.ts` — `createClient()` — Client Components only (`createBrowserClient`)

**Server Actions** live in `app/actions/` with `'use server'` at the top of each file. All mutating actions call `revalidatePath('/')` to refresh server-rendered data. Call them from Client Components as plain async functions (not via form `action=`), wrapped in `startTransition` for pending state.

**Pending / loading state:** use `useTransition` — `const [isPending, startTransition] = useTransition()`. Don't use `useState(false)` for loading booleans; calling a `setState` function synchronously inside `useEffect` triggers the `react-hooks/set-state-in-effect` lint rule.

**Drag & drop** (`@dnd-kit/core` + `@dnd-kit/sortable`): `useSortable` is used directly inside `StopCard`. Put `{...listeners}` only on the drag handle element (not the whole card) so click events still fire normally. Use `activationConstraint: { distance: 8 }` on `PointerSensor`.

## Tailwind v4

No `tailwind.config.ts`. All design tokens are declared in `app/globals.css` under `@theme inline { ... }` and consumed as CSS custom properties:

```tsx
// Always reference tokens via var(), not Tailwind color utilities
className="text-[var(--color-primary)] bg-[var(--color-surface-container)]"
```

Design system rules (Digital Scripter / Neon Silk Scrapbook):
- **No 1px solid borders** — use background-color shifts or ghost borders at 15% opacity
- **Organic border radii** — e.g. `rounded-[1.5rem_0.75rem_2rem_1rem]`
- **Glassmorphism** on floating panels — `backdrop-blur-sm` or `backdrop-filter: blur(12px)`
- Font vars: `--font-display` (Noto Serif) · `--font-body` (Plus Jakarta Sans) · `--font-meta` (Manrope)

## RTL

`dir="rtl"` is set on `<html>` globally. Use CSS logical properties so layout is direction-aware:
- `ps-` / `pe-` (padding-inline-start/end) instead of `pl-` / `pr-`
- `start-` / `end-` for positioning instead of `left-` / `right-`
- Flexbox row direction is automatically reversed in RTL

## Testing

Tests live in `__tests__/`. The jest config uses `testMatch: ["**/__tests__/**/*.test.ts?(x)"]`.

When testing Client Components that use `@dnd-kit`, mock the entire library (it uses browser APIs unavailable in jsdom). Mock `useActivities` hook rather than mocking the Supabase browser client directly.

## Database schema

Defined in `supabase/migrations/0001_initial_schema.sql`. Key relationships:
- `transport.from_stop_id` / `to_stop_id` → `stops(id) ON DELETE CASCADE`
- `activities.stop_id` → `stops(id) ON DELETE CASCADE`
- `expenses.stop_id` → `stops(id) ON DELETE SET NULL`
- `stops.order_index` is the sort key; drag & drop updates it via `reorderStops()` in `app/actions/stops.ts`

## Project plan

The phased implementation plan (Phases 1–7) is in `plans/travel-planner.md`. Completed: Phase 1 (foundation) and Phase 2 (Timeline + Stop Details). Next: Phase 3 (timed events + transport arrival dates).
