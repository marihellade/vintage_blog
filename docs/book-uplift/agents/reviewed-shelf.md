# Agent: Reviewed Shelf Redesign

**Phase:** 2b (parallel with 2a, 2c, 2d)
**Scope:** `src/components/BookCard.astro` (reviewed variant), reviewed section CSS
**Depends on:** Phase 1 (component extraction) complete

## Context

The reviewed shelf is the centrepiece of the books page. Currently it uses a horizontal card layout with 56×84px covers — far too small. The cards are in a 2-column grid showing 4 books per page. The design direction calls for vertical cards (cover on top, text below) with larger covers and 6 books per page.

## Task

### 1. Redesign the reviewed card layout

Change the BookCard `reviewed` variant from horizontal to vertical:

**Current layout:**
```
[cover 56×84] [title          ]
              [author         ]
              [rating · date  ]
              [tag] [tag]      
```

**New layout:**
```
[     cover 130×195      ]
[title                   ]
[author                  ]
[mood descriptor, italic ]
[rating · finished date  ]
[tag] [tag]              
```

**Cover sizing:**
- Desktop: `width: 130px; height: 195px` (approximately 2:3 ratio, like a paperback)
- Mobile (≤720px): `width: 100px; height: 150px`
- The cover should be centred within the card
- Keep the existing `object-fit: cover` and border-radius
- Keep the placeholder gradient system for books without cover images

**Mood descriptor:**
- Display `book.mood` as a new line below the author
- Style: `font-style: italic; font-size: 0.82rem; color: var(--color-ink-soft); line-height: 1.3;`
- Clamp to 2 lines with `-webkit-line-clamp: 2`
- This field already exists in the data model (e.g., "dragons, war college, slow burn, brutal")

**Card styling:**
- Card background: `var(--gradient-surface-card)`
- Card border: `1px solid var(--color-gold-light)`
- Card padding: `var(--space-4)`
- Border radius: `var(--radius-md)`
- Text alignment: left-aligned (not centred — editorial, not product)
- Card hover: `translateY(-3px)`, increased shadow, subtle gold border glow:
  ```css
  .reviewed-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5), 0 0 12px rgba(200, 152, 78, 0.12);
    border-color: var(--color-gold);
  }
  ```
- Respect `prefers-reduced-motion` — disable transform on hover if motion is reduced

### 2. Update grid layout

**Desktop (≥1024px):** `grid-template-columns: repeat(3, 1fr)`
**Tablet (721px–1023px):** `grid-template-columns: repeat(2, 1fr)`
**Mobile (≤720px):** `grid-template-columns: 1fr` (single column, full-width cards)

Gap: `var(--space-6)` on desktop, `var(--space-4)` on mobile.

### 3. Books per page: 4 → 6

Update the `BOOKS_PER_PAGE` constant from `4` to `6`.

Also update the client-side `booksPerPage` constant in the inline script to `6`.

**Important:** Both the server-rendered initial page AND the client-side JS use this value. They must match.

### 4. Update the client-side `renderCard()` function

The inline `<script>` contains a `renderCard()` function that builds reviewed cards via string concatenation. This function must be updated to match the new vertical layout:

- Add the mood line: `<p class="mood-line reviewed-card-mood">${escapeHtml(book.mood || '')}</p>` (only if mood exists)
- Reorder markup: cover → title → author → mood → rating/date → tags
- Remove the horizontal flex layout classes, use vertical flow

### 5. Update grid height measurement

The `measureStableGridHeight()` function pre-calculates grid height to prevent layout shift. With the new vertical layout and 6-per-page count, the measurement must still work. No logic changes needed, but verify that the measurement div `.reviewed-grid--measure` uses the same column count.

## Acceptance criteria

- [ ] Reviewed cards display in vertical layout (cover top, text below)
- [ ] Covers are 130×195px on desktop, 100×150px on mobile
- [ ] Mood descriptor appears on cards that have mood data
- [ ] Grid shows 3 columns desktop, 2 tablet, 1 mobile
- [ ] 6 books per page (both server-rendered and client-side)
- [ ] Hover state works with lift + shadow + gold glow
- [ ] Page flip animation still works correctly
- [ ] `prefers-reduced-motion` is respected
- [ ] Placeholder gradient covers look good at the larger size
- [ ] `npm run build` passes
- [ ] Run `/ui-review` skill to verify visual result

## Gotchas

- The server-rendered initial cards and the client-rendered cards (via `renderCard()`) must produce identical markup. If the server template changes, the client template must change to match.
- The `measureStableGridHeight()` function iterates all pages and measures grid height. With vertical cards and 6 per page, the grid will be taller. The function should still work correctly since it measures actual rendered height.
- The cover border `border: 1px solid rgba(200, 152, 78, 0.14)` should be kept — it helps covers stand out against the dark card background.
- The `--reviewed-cover-width` and `--reviewed-cover-height` CSS custom properties are used by both the cover and placeholder. Update both values.
