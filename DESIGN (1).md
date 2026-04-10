# Design System Specification: The Ethereal Tech Editorial

## 1. Overview & Creative North Star
**Creative North Star: "The Digital Curator"**

This design system is engineered to move beyond the utilitarian "SaaS dashboard" and into the realm of high-end, editorial digital experiences for BERACORE. It rejects the standard, rigid grid in favor of a sophisticated interplay between deep tonal space and vibrant, luminescent accents. 

By leveraging **intentional asymmetry**, we create a visual narrative that feels bespoke rather than templated. We utilize overlapping elements, expansive negative space, and extreme typographic scale to signal authority and innovation. This is not just a UI; it is a premium environment where technology meets high-fidelity craftsmanship.

---

## 2. Colors & Surface Philosophy

The palette is anchored in a profound `background` (#0f0d16), providing a canvas for vibrant, neon-inflected accents and deep purple gradients.

### The "No-Line" Rule
Traditional 1px solid borders are strictly prohibited for defining sections. Boundaries must be articulated through:
1.  **Tonal Shifts:** Transitioning from `surface` (#0f0d16) to `surface_container_low` (#14121c).
2.  **Luminous Gradients:** Using subtle glows to imply a boundary rather than hard lines.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—stacked sheets of frosted glass.
*   **Base:** `surface` (The deep void).
*   **In-Page Sections:** `surface_container_low` for large content blocks.
*   **Interactive Cards:** `surface_container` or `surface_container_high`.
*   **Floating Modals/Popovers:** `surface_bright` with a 20px backdrop blur.

### The "Glass & Gradient" Rule
To achieve the BERACORE signature look, main CTAs and hero elements must use gradients. 
*   **Primary CTA Gradient:** Linear transition from `primary` (#b6a0ff) to `primary_dim` (#7e51ff).
*   **Secondary Glows:** Use `secondary` (#00e3fd) as a low-opacity radial gradient behind key icons or metrics to create a "pulsing" tech aesthetic.

---

## 3. Typography: The Editorial Edge

The system employs a dual-typeface strategy to balance futuristic character with high-performance readability.

*   **Display & Headlines (Space Grotesk):** This is our "Brand Voice." Its bold, geometric terminals convey a technical, high-end precision. Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) for hero headers to command immediate attention.
*   **Body & Labels (Manrope):** Chosen for its warmth and clarity. Manrope bridges the gap between technical and human. 
*   **Visual Hierarchy:** Always pair a `headline-lg` in `on_surface` with a `body-md` in `on_surface_variant` (#aea9b6) to create depth through color, not just size.

---

## 4. Elevation & Depth: Tonal Layering

We eschew traditional "box shadows" in favor of environmental lighting.

*   **The Layering Principle:** Depth is achieved by stacking. A `surface_container_lowest` (#000000) card placed on a `surface_container_low` (#14121c) background creates an "inset" feel, while a `surface_bright` card creates an "elevated" feel.
*   **Ambient Shadows:** For floating elements, use a "Nebula Shadow": a blur of 40px-60px at 6% opacity, using the `primary` token color instead of black. This creates a natural, atmospheric lift.
*   **The "Ghost Border" Fallback:** If a container requires definition against a complex background, use the `outline_variant` (#494651) at **15% opacity**. It should be felt, not seen.
*   **Glassmorphism:** Apply to navigation bars and floating action menus. Use `surface` at 60% opacity with a `backdrop-filter: blur(12px)`.

---

## 5. Components

### Buttons
*   **Primary:** Solid `primary` gradient, `roundness-full`, `label-md` uppercase typography. Transition: subtle scale-up (1.02x) on hover.
*   **Secondary:** Ghost style. Transparent background, 1px `Ghost Border`, `on_surface` text.
*   **Tertiary:** `on_surface_variant` text with no container; `secondary` (#00e3fd) 2px underline on hover.

### Cards & Lists
*   **Rule:** No dividers. Separate items using 32px of vertical white space or a 1-step shift in `surface_container` tokens.
*   **Interactions:** Cards should exhibit a "Glass-Lift" on hover—increasing backdrop blur and shifting from `surface_container` to `surface_bright`.

### Input Fields
*   **Style:** `surface_container_lowest` backgrounds with a `Ghost Border`.
*   **Active State:** The border transitions to a 1px `primary` glow. Helper text must use `label-sm` in `on_surface_variant`.

### Featured Project Tiles
*   Use large-scale imagery with an overlay gradient: `surface` (100% opacity at bottom) to `surface` (0% opacity at top). This allows `title-lg` text to sit legibly over the image.

---

## 6. Do's and Don'ts

### Do
*   **Do** use extreme negative space to separate different service offerings.
*   **Do** use `secondary` (#00e3fd) sparingly as a "data accent" (e.g., small icons, status pips, or progress bars).
*   **Do** implement micro-motions: elements should gently float or fade in with a `cubic-bezier(0.22, 1, 0.36, 1)` easing.

### Don't
*   **Don't** use pure white (#ffffff) for text. Always use `on_surface` (#f5eefc) to prevent eye strain on dark backgrounds.
*   **Don't** use standard "drop shadows" (black, high opacity). They break the futuristic glass aesthetic.
*   **Don't** use sharp corners. Every container must follow the `roundness-md` (0.75rem) or `roundness-lg` (1rem) scale to maintain a premium, approachable feel.
*   **Don't** use dividers or lines to separate content. Let the typography and tonal surfaces do the work.