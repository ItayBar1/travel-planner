# Plan: Southeast Asia Travel Planner

> Source PRD: PRD.md

## Architectural decisions

- **Routes:** `/` → Timeline (default), `/map`, `/budget`, `/checklist`. Stop Details renders as a drawer overlay on top of any route — no separate URL.
- **Schema (Supabase):**
  - `stops` — id, name, country, start_date, end_date, order_index, lat, lng, type
  - `transport` — id, from_stop_id, to_stop_id, type, duration_hours, cost, notes
  - `activities` — id, stop_id, name, type (activity | restaurant | reminder), day_index (nullable), url (nullable), lat (nullable), lng (nullable)
  - `expenses` — id, amount, currency, category, description, date (nullable), stop_id (nullable)
  - `checklist_items` — id, label, category, done
- **Key models:** `Stop`, `Transport`, `Activity`, `Expense`, `ChecklistItem`
- **Stop ordering:** `order_index` integer column on `stops`; drag & drop reorders by updating `order_index` values, not by array position
- **Auth:** Basic protection only — no full user system. Single environment-variable secret or Supabase row-level security with a hardcoded user ID.
- **RTL + dark mode:** Applied globally from day one via Tailwind `dir="rtl"` on `<html>` and `dark` class toggle. All components must respect both from their first render.
- **Currency:** stored as a `currency` string column alongside `amount`; conversion is out of scope for now.
- **Testing:** Jest + React Testing Library for unit/integration tests. Tests cover external behavior, not implementation details, and are order-independent.

---

## Phase 1: Foundation

**User stories:** 34, 35, 36, 37, 38

### What to build

A working Next.js app skeleton that a user can open and navigate. All four tabs exist (Timeline, Map, Budget, Checklist) with empty placeholder screens. The Supabase schema is created and the client is wired up. RTL and dark mode are active globally. The bottom navbar (mobile) and sidebar (desktop) are in place. A basic auth guard (env-variable secret or Supabase RLS) protects write operations. Testing infrastructure is configured and a smoke test passes.

### Acceptance criteria

- [ ] `npm run dev` starts the app without errors
- [ ] Navigating between the four tabs works on both mobile and desktop viewports
- [ ] Layout is RTL (`dir="rtl"`) and dark mode toggle persists across page reloads
- [ ] Mobile shows a bottom navbar; desktop shows a sidebar or top navbar
- [ ] All Supabase tables (`stops`, `transport`, `activities`, `expenses`, `checklist_items`) exist with the schema above
- [ ] Supabase client is initialized and can perform a test read without errors
- [ ] Basic auth protection is in place (unauthenticated users cannot mutate data)
- [ ] `npm test` runs and a smoke test passes
- [ ] `npm run lint` passes with no errors

---

## Phase 2: Timeline + Stop Details

**User stories:** 1, 2, 3, 4, 5, 6, 9, 10, 11, 12, 13, 14, 15

### What to build

The full Timeline screen: a vertical chronological list alternating Stop cards and Transport rows, loaded from Supabase. Users can add, edit, and delete stops and transports. Stops can be reordered via drag & drop, which persists `order_index` to Supabase. Clicking a stop opens a drawer overlay showing the stop's activities, restaurants, and reminders — each of which can be added, edited, deleted, and optionally linked to a specific day or given a URL. The drawer is accessible from the timeline and will later also be accessible from the map.

### Acceptance criteria

- [ ] Timeline renders all stops in `order_index` order with name, date range, and duration
- [ ] Transport rows appear between consecutive stops showing type, duration, and cost
- [ ] User can add a new stop (name, country, dates, type); it appears in the correct position
- [ ] User can edit and delete an existing stop
- [ ] User can add a transport between two stops (type, duration, cost, notes)
- [ ] Drag & drop reorder persists to Supabase (`order_index` updated correctly)
- [ ] Clicking a stop opens the Stop Details drawer
- [ ] Drawer shows activities, restaurants, and reminders in separate sections
- [ ] User can add/edit/delete an activity; optional fields (URL, day index) work correctly
- [ ] User can add/edit/delete a restaurant; optional URL works
- [ ] User can add/edit/delete a reminder
- [ ] Closing the drawer returns to the timeline without data loss
- [ ] All text, labels, and UI strings are in Hebrew
- [ ] Integration tests cover: add/edit/delete stop, reorder two stops, add activity to stop, open/close drawer

---

## Phase 3: Timeline Enhancements

**User stories:** 7, 8

### What to build

Two enhancements to the timeline. First, transports already support manual duration — this phase ensures the timeline displays a computed "end date" or "arrival date" derived from departure date + duration, and the UI makes this visible. Second, activities can be marked as timed events (a specific date + time, for pre-booked tickets), which causes them to render as a distinct event row in the timeline on the correct day, visually distinct from general activities.

### Acceptance criteria

- [ ] Transport rows display computed arrival date/time based on departure + duration
- [ ] An activity can be given a specific date and time ("timed event")
- [ ] Timed events appear as a distinct row in the timeline on their scheduled day, within the correct stop
- [ ] Timed events are visually distinguishable from general activities in the drawer and timeline
- [ ] Editing a timed event's date/time updates its position in the timeline immediately

---

## Phase 4: Map Module

**User stories:** 16, 17, 18, 19, 20

### What to build

A Google Maps view showing all stops as markers connected by polylines in trip order. Each stop type (city, attraction, transport hub, etc.) uses a distinct icon and color. Clicking a marker opens a Maps info window with stop name, stay duration, and a list of planned activities, plus a button to open the Stop Details drawer. Activity markers (from activities with lat/lng) can optionally appear within a city's area.

### Acceptance criteria

- [ ] Map loads and renders without errors on both mobile and desktop
- [ ] All stops appear as markers at their correct lat/lng coordinates
- [ ] Markers are colored/iconed by stop type
- [ ] Polylines connect stops in `order_index` order
- [ ] Clicking a marker opens an info window with: stop name, date range, activity list
- [ ] Info window has a button/link that opens the Stop Details drawer
- [ ] Activities with lat/lng set appear as secondary markers on the map
- [ ] Transport polylines indicate transport type (tooltip or line style)

---

## Phase 5: Budget Module

**User stories:** 21, 22, 23, 24, 25

### What to build

A Budget screen with a full expense table. Users can add, edit, and delete expenses. Each expense has amount, currency, category (accommodation / food / transport / attractions / other), description, and optional date and stop reference. The screen shows a total sum and a per-category breakdown. The data model is generic enough to support future filtering by stop or date without schema changes.

### Acceptance criteria

- [ ] Budget screen shows a table of all expenses
- [ ] User can add an expense (amount, currency, category, description; date and stop are optional)
- [ ] User can edit any field of an existing expense
- [ ] User can delete an expense
- [ ] Total sum across all expenses is displayed and updates immediately on add/edit/delete
- [ ] Per-category totals are displayed for all five categories
- [ ] `stop_id` and `date` columns exist in the schema and are persisted when provided
- [ ] Unit tests cover: budget sum calculation, per-category sum, add/edit/delete expense

---

## Phase 6: Checklist Module

**User stories:** 26, 27, 28, 29

### What to build

A pre-trip checklist screen with items grouped by category (gear, documents, health, etc.). Users can toggle items done/not-done, add new items to any category, and delete items. The checklist is general (not per-stop).

### Acceptance criteria

- [ ] Checklist screen shows all items grouped by category
- [ ] User can toggle any item between done and not-done; state persists to Supabase
- [ ] User can add a new item to an existing or new category
- [ ] User can delete an item
- [ ] Done items are visually distinct (strikethrough or muted style)
- [ ] Progress indicator (e.g., "12/30 הושלמו") is shown per category or overall

---

## Phase 7: Offline & Sync

**User stories:** 30, 31, 32, 33

### What to build

Offline support for read-only use during the trip. A Service Worker caches the app shell so the app loads without a network. An IndexedDB layer mirrors all Supabase data locally and is kept in sync. When the app detects it's offline, the default route switches from Map to Timeline. When connectivity is restored, the app syncs pending writes (if any) back to Supabase automatically.

### Acceptance criteria

- [ ] App loads and displays timeline data when the device is offline
- [ ] Service Worker caches the app shell (HTML, JS, CSS)
- [ ] IndexedDB holds a local copy of all stops, activities, transport, expenses, and checklist items
- [ ] Offline detection switches the default/home tab to Timeline (not Map)
- [ ] On reconnect, the app re-syncs with Supabase and updates local data
- [ ] No data loss occurs during an offline → online transition
- [ ] An "אתה במצב אופליין" (offline mode) indicator is visible to the user when disconnected
