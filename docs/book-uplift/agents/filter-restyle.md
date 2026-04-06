# Agent: Filter Restyle

**Phase:** 2c (parallel with 2a, 2b, 2d)
**Scope:** Filter-related CSS and markup in the reviewed section of `src/pages/books/index.astro`
**Depends on:** Phase 1 (component extraction) complete

## Context

The reviewed shelf filter controls (Year pills, Mood/Tag pills, Sort toggle) currently look like SaaS admin tooling — rounded pill buttons with active states in a horizontal bar. They are functionally correct but visually foreign to the site's art-nouveau, apothecary, dark-academia aesthetic.

The goal is to restyle the filters so they feel like an editorial index or card catalogue rather than a toolbar. No changes to filter logic or behaviour.

## Task

### 1. Restyle year pills

The year pills are fine structurally (there are few of them — All, 2026, 2025, Undated). Just warm them up:

- Replace `border-radius: 999px` with `border-radius: var(--radius-sm)` (4px — less pill-like, more label-like)
- Add a subtle box-shadow on active: `box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);`
- Change the active state background from solid `var(--color-sage-dark)` to a subtler `rgba(154, 191, 158, 0.25)` with a gold bottom border: `border-bottom: 2px solid var(--color-gold);`
- Active text colour: `var(--color-cream)` instead of `var(--color-parchment)`
- Keep the font family, size, and letter-spacing

### 2. Restyle mood/tag pills

These are the larger problem — 14+ pills in a flat row. Restyle:

- Same border-radius change: `var(--radius-sm)` instead of `999px`
- Add a left-side accent mark on active tags: use a `::before` pseudo-element with a small vertical gold bar (`width: 2px; height: 60%; background: var(--color-gold);`)
- Change the active background to `rgba(212, 133, 58, 0.15)` (warmer, less opaque)
- Make the inactive pills slightly more transparent and lower-contrast so the active one stands out more
- The "+ more" toggle: style as an underlined text link rather than a pill: `border: none; background: none; text-decoration: underline; text-decoration-color: var(--color-gold-light); color: var(--color-ink-soft);`

### 3. Add a subtle group frame

Wrap the entire filter controls area in a subtle frame to distinguish it from the book grid:

```css
.reviewed-controls {
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-gold-light);
  margin-bottom: var(--space-6);
}
```

This separates the filter "header" from the book grid visually — like a catalogue drawer label strip.

### 4. Restyle sort controls

The sort options ("Latest first", "Highest rated") should feel like typeset labels, not buttons:

- Remove any remaining button-like styling
- Active sort option: `color: var(--color-gold); border-bottom: 1px solid currentColor;` (already close to this, verify)
- Add a small separator between sort options: a `·` character or thin vertical rule
- The "Sort" label should use `var(--font-heading)` italic instead of `var(--font-accent)` small caps — this makes it feel more editorial and less like a toolbar label

### 5. Filter label refinement

The "Year" and "Mood" labels above the pill rows:

- Change font to `var(--font-heading)` italic (from `var(--font-accent)` small caps)
- Increase size slightly: `0.82rem` (from `0.72rem`)
- Colour: keep `var(--color-ink-soft)`
- This shifts the labels from "toolbar heading" energy to "catalogue index heading" energy

## What NOT to do

- Do not change filter behaviour or JS logic
- Do not change the number of visible filters or implement tag curation (that's a roadmap item)
- Do not add new filter types (rating, author, etc.)
- Do not change the HTML structure of buttons or their data attributes — the client JS relies on them
- Do not change the `is-active` class name or `aria-pressed` attributes

## Acceptance criteria

- [ ] Year and tag pills have squared-off corners (radius-sm), not rounded pills
- [ ] Active states feel warmer and more editorial (gold accents, not flat fills)
- [ ] The "+ more" toggle looks like a text link, not a pill button
- [ ] Sort labels feel typeset, not toolbar-like
- [ ] Filter area has a visible bottom border separating it from the grid
- [ ] All existing filter interactions still work (year, tag, sort, expand/collapse)
- [ ] `npm run build` passes
- [ ] Run `/style-guardian` skill to verify aesthetic alignment

## Gotchas

- The client JS uses `classList.toggle('is-active', ...)` to manage active states. Do not change this class name.
- The `[data-year-filter]`, `[data-tag-filter]`, and `[data-sort]` selectors are used by the client JS. Do not change these data attributes.
- The `#reviewed-filter-toggle` button has its text changed by JS (`+ N more` / `− fewer`). Do not interfere with this behaviour.
- The `.reviewed-pill--tag` and `.reviewed-pill--more` classes are used for specific colour treatments. These can be restyled but the class names must remain.
