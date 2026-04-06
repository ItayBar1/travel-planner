```markdown
# Design System: The Digital Scripter

## 1. Overview & Creative North Star: "The Neon Calligrapher"
This design system rejects the clinical sterility of modern SaaS. Our Creative North Star is **"The Neon Calligrapher"**—a fusion of ancient storytelling traditions and futuristic urban energy. We are building a "Digital Scripter" that feels like a high-end travel journal discovered in a Neo-Tokyo tea house.

To break the "template" look:
- **Intentional Asymmetry:** Avoid centered, balanced grids. Shift content blocks slightly off-axis.
- **Layered Scrapbooking:** Elements should overlap. A photo might bleed over a text block; a glass card might partially obscure a background motif.
- **Organic Geometry:** Move away from perfect rectangles. Use "hand-drawn" border radii and fluid, CSS-generated shapes that mimic ink bleeds or clouds.

---

## 2. Colors: Tropical Neon & Textured Depths
The palette is a high-contrast dialogue between a dark, tactile void and electric, tropical highlights.

### The Palette
- **Primary (`#52f2f5`):** Our "Electric Cyan." Use for primary actions and glowing focal points.
- **Secondary (`#ff734c`):** "Sunset Orange." Use for energy, urgency, and highlighting "must-see" journal entries.
- **Tertiary (`#ff9bf8`):** "Orchid Neon." Reserved for whimsical flourishes and storytelling accents.
- **Surface & Background (`#0c0e10`):** The "Silk Ink." This is not a flat black; it represents a deep, textured dark silk.

### The "No-Line" Rule
**Explicit Prohibition:** 1px solid borders are strictly forbidden for sectioning. 
- Boundaries must be defined by background shifts. Use `surface-container-low` against a `surface` background to create a "pocket" in the journal.
- Instead of lines, use vertical whitespace or a subtle color bleed to separate content.

### Glass & Gradient Rule
To achieve the "Digital Concierge" feel, use **Glassmorphism**:
- **Background Blur:** Apply `backdrop-filter: blur(12px)` to floating panels.
- **Signature Glow:** Use a subtle gradient (e.g., `primary` to `primary_container`) for main CTAs. This adds a "soul" to the UI that flat colors lack.

---

## 3. Typography: The Storyteller’s Contrast
We use a dual-font strategy to balance the "scrapbook" personality with "concierge" utility.

- **Display & Headlines (Noto Serif):** Our expressive voice. Use `display-lg` through `headline-sm` for titles and narrative beats. This serif provides the "journal" feel—it should feel bold and authoritative.
- **Utility & Interface (Plus Jakarta Sans):** Our operational voice. Use for `title` and `body` scales. It ensures high legibility for itineraries and travel tips.
- **Meta-Data (Manrope):** Use the `label` scales for secondary technical info (timestamps, coordinates, tags).

**RTL Note:** For Hebrew, ensure the serif maintains its weight. Character tracking should be slightly tightened for headers to maintain the "inked" look.

---

## 4. Elevation & Depth: Tonal Layering
We do not use structural lines; we use light and shadow.

- **The Layering Principle:** Depth is achieved by "stacking" surface tiers. Place a `surface-container-highest` card atop a `surface-container-low` section. The contrast creates a natural lift.
- **Ambient Shadows:** Shadows must be "Ghost Shadows." Use the `on_surface` color at 5% opacity with a blur of `40px` to `60px`. This mimics a soft glow rather than a harsh drop shadow.
- **Ghost Borders:** If containment is required for accessibility, use `outline_variant` at **15% opacity**. It should be felt, not seen.
- **The "Wabi-Sabi" Edge:** Apply non-uniform border radii from our scale (e.g., `border-radius: 2rem 1rem 3rem 1.5rem`) to containers to give them a hand-cut, organic paper feel.

---

## 5. Components

### Buttons
- **Primary:** High-vibrancy `primary` background with `on_primary` text. Use an organic border-radius (`lg`) and a `primary_container` outer glow on hover.
- **Secondary:** Transparent background with a `secondary` "Ghost Border" and a subtle `0.05` alpha fill.

### Cards (The "Journal Entry")
- **Style:** Forbid dividers. Use `surface-container-high` as the base. 
- **Header:** Use `headline-sm` (Serif) for the location name.
- **Interaction:** On hover, the card should slightly "tilt" (rotate 1deg) and increase its `backdrop-filter` intensity.

### Custom Scrollbars
- **Track:** Transparent.
- **Thumb:** `primary_dim` with an organic `full` radius. The thumb should be narrow, resembling a thin silk thread.

### Chips (Travel Tags)
- Use `tertiary_container` for the background with `on_tertiary_container` text.
- **Shape:** Use the `sm` radius for a slightly irregular, "torn sticker" look.

### Input Fields
- **Base:** Minimalist. Only a bottom "ink line" using `outline_variant` at 40% opacity.
- **Focus:** The line expands and glows with the `primary` color. Helper text uses `body-sm`.

---

## 6. Do’s and Don’ts

### Do:
- **Embrace White Space:** Give the "ink" room to breathe.
- **Mix Directions:** In LTR, let some images float right; in RTL (Hebrew), flip the logic but maintain the asymmetrical "stagger."
- **Use Motifs:** Use `secondary` or `tertiary` colors to create subtle CSS shapes (circles, semicircles) that sit *behind* content to act as visual anchors.

### Don’t:
- **Don't use 90-degree corners:** Avoid `none` in the roundedness scale unless it’s for a full-bleed background texture.
- **Don't use pure grey:** Every "neutral" should be tinted with a hint of teal or orchid to maintain the "Tropical Neon" atmosphere.
- **Don't use standard Dividers:** If you need to separate two sections, use a `32px` vertical gap or a subtle background color shift from `surface-container-low` to `surface-container-lowest`.

---

## 7. Spacing & Rhythm
The system relies on a fluid, breathing rhythm.
- **Component Padding:** Always use `lg` (2rem) for internal card padding to ensure the "Glass" effect doesn't feel cramped.
- **Section Spacing:** Use oversized gaps (4rem+) between major journal chapters to signify a change in the travel narrative.```