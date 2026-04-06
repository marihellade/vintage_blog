# Agent: Page Header

**Phase:** 2a (parallel with 2b, 2c, 2d)
**Scope:** `src/components/PageHeader.astro`, top of `src/pages/books/index.astro`
**Depends on:** Phase 1 (component extraction) complete

## Context

The books page currently opens with a plain `<h1>Book Diary</h1>` and one italic paragraph. There is no visual framing, no decorative entry, no sense of arriving in a special room. The page needs an atmospheric header that establishes identity without being so tall it pushes content below the fold.

## Task

Redesign the `PageHeader.astro` component to include decorative framing, and update its usage in the books index.

### Visual design

The header should feel like a section sign in a beautifully kept bookshop — hand-lettered, framed, warm.

**Elements:**
1. **Decorative border frame** — CSS-only (no images). A double-line border or a single solid border with a dashed inner border (similar to the reviewed shelf frame pattern already in use). Use `var(--color-gold-light)` for the outer border, `rgba(200, 152, 78, 0.15)` for the dashed inner.
2. **Title** — "Book Diary" at `var(--text-3xl)`, italic, Cormorant Garamond. Centred.
3. **Ornamental accent** — A small `❧` or `✦` above or below the title, in `var(--color-gold)`. Small, not dominant.
4. **Intro text** — The existing italic paragraph, centred, max-width 560px.
5. **Collection summary** — A new line below the intro: "N books reviewed · N series in progress". Computed from the existing `allBooks` data. Style: `var(--font-accent)`, small caps, `var(--text-xs)`, `var(--color-ink-soft)`, letter-spacing `0.1em`.
6. **Background** — Subtle warm gradient, slightly different from the page background. Use `var(--gradient-surface-warm)` or similar.
7. **Padding** — Generous: `var(--space-8)` vertical, `var(--space-6)` horizontal.
8. **Border radius** — `var(--radius-md)`.

### Props update

```typescript
interface Props {
  title: string;
  intro?: string;
  stats?: string; // e.g., "8 books reviewed · 2 series in progress"
}
```

The stats string should be computed in the index.astro frontmatter and passed as a prop:
```typescript
const statsLine = `${finished.length} books reviewed · ${seriesMap.size} series in progress`;
```

### Mobile behaviour

- Remove the decorative inner dashed border on screens below 720px
- Reduce padding to `var(--space-4)`
- Keep the title, intro, and stats — just simpler framing

### What NOT to do

- Do not use a background image or large SVG illustration
- Do not make the header taller than ~220px on desktop (content must stay reachable)
- Do not use sparkle effects or animation
- Do not change the page title text or intro paragraph copy

## Acceptance criteria

- [ ] The header has a visible decorative frame (border + optional inner accent)
- [ ] The collection summary line appears and shows correct counts
- [ ] The header uses only CSS for decoration (no image assets)
- [ ] Mobile rendering is simpler but still present
- [ ] The header does not push the "Currently Reading" section below the fold on a 1440×1100 viewport
- [ ] `npm run build` passes
- [ ] Run `/style-guardian` skill to verify aesthetic alignment

## Reference

Look at the reviewed shelf frame for visual language reference:
```css
/* From the existing reviewed-shelf-body styles */
border: 1px solid var(--color-gold-light);
border-radius: var(--radius-md);
background: var(--gradient-surface-warm);
box-shadow: 0 2px 14px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(200, 152, 78, 0.07);
/* Inner dashed accent */
content: '';
position: absolute;
inset: 4px;
border: 1px dashed rgba(200, 152, 78, 0.15);
```

The page header should use a similar visual language — warm, framed, candlelit.
