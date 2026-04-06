# Agent: Component Extraction

**Phase:** 1 (foundation — must complete before all other agents)
**Scope:** Extract shared components from `src/pages/books/index.astro`

## Context

The books index page is 1491 lines in a single file — HTML structure, ~400 lines of inline client JS, and ~600 lines of scoped CSS. This monolith must be decomposed before other agents can work on separate pieces without merge conflicts.

## Task

Create three new Astro components and update the books index to import them.

### 1. `src/components/BookCard.astro`

Extract the book card markup into a shared component. The card currently exists in 4 slightly different forms across the page (currently reading, reviewed, DNF, want-to-read). Unify them.

**Props:**
```typescript
interface Props {
  title: string;
  author: string;
  cover: string | null;
  coverGradient: string;
  slug: string;
  variant: 'reading' | 'reviewed' | 'dnf' | 'wishlist';
  // Optional — only used by some variants
  rating?: number | null;
  ratingText?: string | null;
  ratingLabel?: string | null;
  mood?: string | null;
  tags?: string[];
  series?: string;
  seriesNumber?: number;
  finishedLabel?: string;
}
```

**Variant behaviour:**
- `reading`: horizontal layout (cover left, text right), 80×120px cover, shows series label and mood
- `reviewed`: horizontal layout (for now — Phase 2b will change to vertical), 56×84px cover, shows rating + finish label + tags
- `dnf`: horizontal layout, 80×120px cover, dimmed opacity, shows mood
- `wishlist`: horizontal layout, placeholder cover only (no real cover expected), shows title + author

**Important:** The reviewed variant's card markup is also duplicated in the client-side `renderCard()` function inside the inline `<script>`. For now, extract the server-rendered version only. The client-side template will be addressed by the tech-debt agent in Phase 3b.

### 2. `src/components/SectionDivider.astro`

A simple botanical ornament divider for placing between page sections.

**Props:**
```typescript
interface Props {
  variant?: 'botanical' | 'simple' | 'dots';
}
```

**Default rendering:** A centred `❧` character flanked by thin horizontal rules extending to the sides. Use CSS for the rules (pseudo-elements or border on a flex container).

**Styling:**
- Colour: `var(--color-gold-light)` for rules, `var(--color-gold)` for the ornament
- Font: `var(--font-heading)`, italic
- Margin: `var(--space-8)` top and bottom
- The `simple` variant: just a thin horizontal rule in `var(--color-gold-light)`
- The `dots` variant: three centred dots (`· · ·`) in gold

### 3. `src/components/PageHeader.astro`

A framed page header component. For now, just a structural extraction — Phase 2a will add decoration.

**Props:**
```typescript
interface Props {
  title: string;
  intro?: string;
}
```

**Default rendering:** Same as current — centred h1 + italic intro paragraph. No decoration yet.

**Slot:** Include a default `<slot />` for optional extra content (e.g., collection summary line to be added later).

### 4. Update `src/pages/books/index.astro`

- Import and use all three new components
- Replace inline card markup with `<BookCard>` component calls
- Add `<SectionDivider>` between sections (not yet styled heavily — just structural)
- Replace the header block with `<PageHeader>`
- Move the card-related CSS into the BookCard component's scoped `<style>` block
- Move the divider CSS into SectionDivider
- Move the header CSS into PageHeader
- The page-level CSS in index.astro should shrink significantly

## Acceptance criteria

- [ ] `npm run build` passes with no errors
- [ ] The page renders visually identically to before (no regression)
- [ ] BookCard is used for all four card variants
- [ ] SectionDivider is placed between major sections
- [ ] PageHeader replaces the inline header
- [ ] The index.astro file is meaningfully shorter
- [ ] Each component has its styles scoped within its own `<style>` block

## Gotchas

- Astro scoped styles: when extracting CSS into a component, Astro scopes styles to that component automatically. This means selectors like `.book-card` inside BookCard.astro will only apply to markup rendered by that component. This is correct and desired.
- The `.reviewed-card` styles have many overrides (cover size, spacing, title size). These should stay on the BookCard component, gated by the `variant` prop via a CSS class.
- Do NOT touch the inline `<script>` block for the reviewed shelf JS. It references DOM classes like `.book-card`, `.reviewed-card`, etc. — these class names must remain unchanged so the client JS continues to work.
- The `renderCard()` function in the inline script builds cards via string concatenation using the same class names. Do not change those class names.
