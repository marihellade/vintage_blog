# Agent: Interaction Fixes

**Phase:** 3a (parallel with 3b)
**Scope:** Client-side JS in `src/pages/books/index.astro`, card tag markup
**Depends on:** Phase 2b (reviewed shelf) and Phase 2c (filter restyle) complete

## Context

The reviewed shelf cards show 1-2 tags per card (e.g., "fantasy", "romantasy"). These tags are styled as coloured pills and look interactive, but clicking them does nothing. Users expect them to filter — they should.

## Task

### 1. Make card tags clickable

Currently, tags in reviewed cards are rendered as `<span class="tag">`:

```html
<span class="tag">fantasy</span>
```

Change them to `<button>` elements with a data attribute:

```html
<button type="button" class="tag reviewed-card-tag" data-tag-filter="fantasy">fantasy</button>
```

Update in **both** places:
1. The Astro template (server-rendered cards)
2. The `renderCard()` function in the client-side JS

### 2. Add click handler for card tags

In the client-side event delegation block (the `document.addEventListener('click', ...)` handler), add a case for card tags:

```typescript
const cardTag = target?.closest('.reviewed-card-tag[data-tag-filter]');

if (cardTag instanceof HTMLButtonElement) {
  const nextTag = cardTag.dataset.tagFilter;
  if (!nextTag || nextTag === currentTag) {
    return;
  }
  currentTag = nextTag;
  currentPage = 1;
  void render({ animate: true });

  // Scroll the filter area into view so the user sees the active filter
  const filterBlock = document.querySelector('.reviewed-controls');
  if (filterBlock) {
    filterBlock.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  return;
}
```

### 3. Style card tag buttons

The tags-as-buttons must look identical to the current tag spans. Add:

```css
.reviewed-card-tag {
  appearance: none;
  border: none;
  background: inherit;
  color: inherit;
  font: inherit;
  padding: inherit;
  cursor: pointer;
}

.reviewed-card-tag:hover,
.reviewed-card-tag:focus-visible {
  border-color: var(--color-gold);
  color: var(--color-cream);
  outline: none;
}
```

Inherit from the existing `.tag` class styling. The only visual difference is a hover state and a pointer cursor.

### 4. Sync tag filter state

When a card tag is clicked, the corresponding tag pill in the filter area should also become active (`is-active`). The existing `updateControls()` function already handles this — it toggles `is-active` on all `[data-tag-filter]` buttons based on `currentTag`. So clicking a card tag → setting `currentTag` → calling `render()` → `updateControls()` will automatically sync the filter pills.

However, if the clicked tag is in the "collapsed" overflow group (hidden by the "+ more" toggle), it should be revealed:

```typescript
// After setting currentTag, ensure the tag is visible
if (currentTag !== 'all') {
  const matchingPill = tagButtons.find(
    (btn) => btn instanceof HTMLButtonElement && btn.dataset.tagFilter === currentTag
  );
  if (matchingPill instanceof HTMLButtonElement && matchingPill.hidden) {
    extraFiltersVisible = true;
  }
}
```

## What NOT to do

- Do not add new filter types or filter UI
- Do not change the filter logic (year, tag, sort)
- Do not modify the pagination behaviour
- Do not change existing tag styling (colour, size, border) — only add hover/focus for buttons

## Acceptance criteria

- [ ] Clicking a tag on a reviewed card activates that tag as the mood filter
- [ ] The filter pill row updates to show the clicked tag as active
- [ ] If the tag was in the collapsed overflow, the overflow expands to show it
- [ ] The filter area scrolls into view when a card tag is clicked
- [ ] Card tags have a pointer cursor and hover/focus state
- [ ] Card tag buttons are accessible (focusable, no outline suppression without replacement)
- [ ] All existing filter interactions still work
- [ ] `npm run build` passes

## Gotchas

- The `renderCard()` function builds cards as HTML strings. Tags in that function must become `<button>` elements with the correct class and data attribute. Make sure to escape the tag text with `escapeHtml()`.
- The event delegation handler uses `event.target?.closest(...)`. The new `.reviewed-card-tag` selector must be checked BEFORE the general `[data-tag-filter]` check, because card tags also have `data-tag-filter`. Add the card-tag check first in the handler chain, or use the `.reviewed-card-tag` class to distinguish.
- On mobile, the scroll-into-view for the filter area should use `block: 'nearest'` not `block: 'start'` to avoid jarring jumps.
