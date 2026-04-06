# Agent: Section Structure

**Phase:** 2d (parallel with 2a, 2b, 2c)
**Scope:** Section ordering and dividers in `src/pages/books/index.astro`
**Depends on:** Phase 1 (component extraction) complete

## Context

The current section order on the books page is:

1. Currently Reading
2. Series I'm Following
3. Reviewed (the main shelf)
4. DNF
5. Want to Read
6. Browse by Mood (dead — non-functional tags)

The reviewed section — the primary browse surface — sits third. The "Browse by Mood" section is a static tag cloud that looks interactive but does nothing.

## Task

### 1. Reorder sections

New order:

1. **Currently Reading** — keep at top (personal, timely, usually 1-2 items)
2. **Reviewed** — promote to second position (the main content)
3. **Series I'm Following** — move below reviewed
4. **DNF** — keep after series
5. **Want to Read** — keep at bottom

### 2. Remove "Browse by Mood" section

Delete the entire bottom section:

```astro
<!-- This block should be removed entirely -->
{allTags.length > 0 && (
  <section class="book-section tags-section">
    <h2 class="section-title">Browse by mood</h2>
    <div class="tag-row">
      {allTags.map(tag => <span class="tag">{tag}</span>)}
    </div>
  </section>
)}
```

Also remove the `allTags` computation from the frontmatter since it's only used by this section:
```typescript
const allTags = [...new Set(allBooks.flatMap(b => b.data.tags))].sort();
```

And remove the `.tags-section` CSS.

### 3. Add SectionDivider components between sections

Place `<SectionDivider />` between each major section:

```astro
{reading.length > 0 && (
  <section>...</section>
)}

<SectionDivider variant="botanical" />

{finished.length > 0 && (
  <section>...</section>
)}

<SectionDivider variant="simple" />

{seriesMap.size > 0 && (
  <section>...</section>
)}

<SectionDivider variant="dots" />

<!-- DNF and Want to Read sections -->
```

Use the `botanical` variant (the ❧ ornament) for the main divider between Currently Reading and Reviewed. Use `simple` and `dots` variants for lower sections to create a visual hierarchy — the top of the page gets the most decoration, the bottom gets simpler dividers.

### 4. Section heading refinement

Each section heading (h2.section-title) should have a thin gold rule below it:

```css
.section-title {
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--color-gold-light);
  margin-bottom: var(--space-4);
}
```

This gives headings more visual weight and helps sections feel structurally defined.

## What NOT to do

- Do not change any content within sections (card markup, filter UI, etc.)
- Do not change the series tracker internal layout
- Do not change the DNF or Want to Read card layouts
- Do not add new sections
- Do not modify the client-side JS

## Acceptance criteria

- [ ] Section order matches: Currently Reading → Reviewed → Series → DNF → Want to Read
- [ ] "Browse by Mood" section is completely removed (markup, data, CSS)
- [ ] SectionDivider components appear between major sections
- [ ] Section headings have a gold underline
- [ ] `npm run build` passes
- [ ] The page still renders correctly with all sections populated

## Gotchas

- The `allTags` variable is used ONLY by the "Browse by Mood" section. Removing that section means `allTags` can be safely deleted. However, `reviewedTags` (computed separately from `reviewedBooksData`) is used by the mood filter pills in the reviewed section — do NOT remove `reviewedTags`.
- SectionDividers should not appear if the section above them is empty (no books in that status). Wrap them in the same conditional as the section: `{reading.length > 0 && <SectionDivider />}` before the reviewed section, etc.
