# Design System: The Nocturnal Nomad

## 1. Overview & Creative North Star
**Creative North Star: "The Digital Concierge"**
This design system moves beyond the rigid utility of a standard travel app to create an editorial, journal-like experience. We are blending the precision of a high-end productivity suite with the soulful, evocative nature of a personal travel diary. 

To break the "template" look, we utilize **intentional asymmetry**. For example, the 240px RTL sidebar shouldn't just be a vertical bar; it should feel like a floating pane. We embrace high-contrast typography scales—pairing massive, thin display headers with dense, utilitarian metadata—to create a sense of hierarchy that feels curated rather than generated.

---

## 2. Colors & Surface Logic
The palette is rooted in the deep obsidian of a South-East Asian night, punctuated by the neon luminescence of its metropolitan hubs.

### The "No-Line" Rule
**Borders are a failure of hierarchy.** In this system, 1px solid borders for sectioning are strictly prohibited. Boundaries must be defined through:
1. **Background Color Shifts:** Use `surface-container-low` (#191B22) sitting on `background` (#111319).
2. **Tonal Transitions:** Use soft gradients to imply change in context.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of "Synthetic Obsidian."
*   **Base Layer:** `surface` (#111319) – The desk on which everything sits.
*   **Secondary Layer:** `surface-container` (#1E1F26) – Major layout blocks.
*   **Action Layer:** `surface-container-high` (#282A30) – Interactive cards and modals.
*   **The Glass Rule:** For floating navigation or top-level overlays, use a semi-transparent `surface-bright` (#373940) at 60% opacity with a `20px` backdrop-blur to create depth without visual clutter.

### Signature Textures
Main CTAs must not be flat. Apply a subtle linear gradient (45deg) from `primary` (#C4C0FF) to `primary-container` (#8781FF) to provide a "lit-from-within" glow.

---

## 3. Typography
We use a dual-font strategy to balance character with readability.

*   **Display & Headlines (Plus Jakarta Sans):** Our "Editorial" voice. Used for city names, dates, and major section titles. The wide apertures feel modern and open.
    *   *Display-LG (3.5rem):* Reserved for hero moments (e.g., "Bangkok, Thailand").
*   **Titles & Body (Be Vietnam Pro / Heebo):** Our "Functional" voice. Chosen for its exceptional legibility at small scales and robust RTL support.
    *   *Title-MD (1.125rem):* For card headers and itinerary items.
    *   *Body-MD (0.875rem):* Optimized for long-form journal entries and checklist notes.

---

## 4. Elevation & Depth
Depth is conveyed through **Tonal Layering**, not structural lines.

*   **The Layering Principle:** To lift an element, move it up the surface tier. A card shouldn't have a border; it should simply be one step "brighter" than its background (e.g., a `surface-container-highest` card on a `surface-container` background).
*   **Ambient Shadows:** Use shadows only for "True Elevation" (elements floating over others).
    *   *Token:* `0 4px 24px rgba(0, 0, 0, 0.4)`
    *   *Sophisticated approach:* Tint the shadow with a hint of `primary` to make the dark mode feel "rich" rather than "muddy."
*   **The Ghost Border Fallback:** If an element lacks sufficient contrast (e.g., an image on a dark background), use the `outline-variant` (#464555) at **15% opacity**. Never 100%.

---

## 5. Components

### Buttons
*   **Primary:** 12px radius. Gradient fill (`primary` to `primary-container`). White text (`on-primary`).
*   **Secondary:** Ghost style. No background, `outline-variant` ghost border (20% opacity), `primary` text.
*   **Tertiary:** Text only. `on-surface-variant` color.

### Interactive Timeline (Signature Component)
Instead of a line, use a **Vertical Gradient Path**. The "dot" for the current event should use `secondary-fixed` (#62FAE3) with a soft outer glow (drop shadow) to indicate the present moment in the itinerary.

### Cards (Travel Itinerary)
*   **Rule:** No dividers between card sections.
*   **Separation:** Use `8px` of vertical whitespace or a subtle background shift to `surface-container-lowest` for the footer area of a card.
*   **Category Accents:** Use a 4px wide vertical "color-pill" on the start edge (right side for RTL) to denote the transport type (e.g., Flight: #4F9EFF).

### Input Fields
*   **Style:** 10px radius. `surface-container-highest` background.
*   **Active State:** No heavy border change. Use a `1px` glow in `secondary` (#44E2CD) and a soft inner shadow to imply the field has been "pressed into" the interface.

---

## 6. Do's and Don'ts

### Do
*   **Embrace Whitespace:** South-East Asian travel is hectic; the app should be a calm sanctuary. Use generous `32px` padding on major containers.
*   **RTL Intentionality:** Ensure the 240px sidebar is anchored to the right. Align typography to the right, but keep "Progress Bars" and "Price Charts" flowing logically for the data type.
*   **Color as Meaning:** Only use the Category Colors for specific logistics (Flight, Food, etc.). Use the `primary` purple-blue for all UI-related actions.

### Don't
*   **Don't use pure black (#000):** It kills the depth. Stick to the `surface` tokens provided.
*   **Don't use dividers:** If you feel the need to "separate" two things, increase the margin by `4px` or change the background tone.
*   **Don't use high-contrast borders:** They create visual noise that distracts from the "Journal" aesthetic.