# Book Uplift — Phased Plan

## Dependency graph

```
Phase 1: Component Extraction (sequential — foundation for everything else)
  └── component-extraction agent

Phase 2: Visual Redesign (parallel — 4 independent agents)
  ├── page-header agent        (2a)
  ├── reviewed-shelf agent     (2b)
  ├── filter-restyle agent     (2c)
  └── section-structure agent  (2d)

Phase 3: Interaction & Cleanup (parallel — 2 independent agents)
  ├── interaction-fixes agent  (3a)  — depends on 2b, 2c
  └── tech-debt agent          (3b)  — independent

Phase 4: Visual Review & Polish (sequential — final gate)
  └── visual-review agent
```

## Phase 1 — Component Extraction

**Agent:** `component-extraction`
**Mode:** Sequential (must complete before Phase 2)
**Goal:** Break the monolithic `src/pages/books/index.astro` into shared components so that Phase 2 agents can work on separate files without merge conflicts.

**Outputs:**
- `src/components/BookCard.astro` — shared card component with variant prop
- `src/components/SectionDivider.astro` — botanical ornament divider
- `src/components/PageHeader.astro` — framed page header
- Updated `src/pages/books/index.astro` importing these components

**Acceptance criteria:**
- The page renders identically to before (no visual regression)
- `npm run build` passes
- Each component accepts documented props
- The index.astro file is shorter and imports the new components

**Commit:** `refactor: extract BookCard, SectionDivider, PageHeader components from books page`

---

## Phase 2 — Visual Redesign (parallel)

All four agents in this phase work on **different files or clearly separated sections**. They can run in parallel.

### Phase 2a — Page Header
**Agent:** `page-header`
**File scope:** `src/components/PageHeader.astro`, top of `src/pages/books/index.astro`
**Goal:** Replace the plain h1 + p header with an atmospheric framed entry.

**Commit:** `feat: add atmospheric page header with decorative frame to book diary`

### Phase 2b — Reviewed Shelf Redesign
**Agent:** `reviewed-shelf`
**File scope:** `src/components/BookCard.astro` (reviewed variant), reviewed section CSS in index.astro
**Goal:** Vertical card layout, larger covers, mood descriptor, 6 books per page.

**Commit:** `feat: redesign reviewed shelf with vertical cards and larger covers`

### Phase 2c — Filter Restyle
**Agent:** `filter-restyle`
**File scope:** Filter-related CSS and markup in the reviewed section of index.astro
**Goal:** Warmer, less SaaS-like filter controls.

**Commit:** `style: restyle book filters with warmer editorial aesthetic`

### Phase 2d — Section Structure
**Agent:** `section-structure`
**File scope:** Section ordering and dividers in index.astro
**Goal:** Reorder sections, add botanical dividers, remove dead "Browse by mood" section.

**Commit:** `feat: restructure book diary sections with botanical dividers`

---

## Phase 3 — Interaction & Cleanup (parallel)

### Phase 3a — Interaction Fixes
**Agent:** `interaction-fixes`
**Depends on:** Phase 2b (reviewed shelf) and 2c (filters) must be merged first
**File scope:** Client-side JS in index.astro, card tag markup
**Goal:** Make card tags clickable, fix dead affordances.

**Commit:** `feat: make book tags clickable to activate shelf filters`

### Phase 3b — Tech Debt
**Agent:** `tech-debt`
**File scope:** `tests/ui/`, `package.json`, client script extraction
**Goal:** Fix Playwright config, ensure `@playwright/test` in devDependencies, extract inline script.

**Commit:** `fix: resolve Playwright config path and extract reviewed shelf script`

---

## Phase 4 — Visual Review & Polish

**Agent:** `visual-review`
**Depends on:** All Phase 2 and Phase 3 work merged
**Mode:** Sequential (final gate)
**Goal:** Run full screenshot review, score against rubric, fix regressions.

**Process:**
1. Run `npm run ui:review -- --update-snapshots` to generate new baselines
2. Visually inspect every screenshot
3. Score against the UI review playbook rubric (docs/ai/ui-review-playbook.md)
4. Fix any issues found (up to 3 iterations)
5. Final commit with updated screenshot baselines

**Commit:** `style: polish book diary visual review pass`

---

## Merge strategy

- Each agent works on a feature branch forked from the uplift branch
- Phase 1 merges to the uplift branch first
- Phase 2 agents merge to uplift branch (order doesn't matter — they touch different areas)
- Phase 3 agents merge after Phase 2
- Phase 4 runs on the merged uplift branch
- Final: uplift branch merges to main via PR

**Branch naming:**
- `feature/book-uplift` (main uplift branch)
- `feature/book-uplift/component-extraction` (Phase 1)
- `feature/book-uplift/page-header` (Phase 2a)
- `feature/book-uplift/reviewed-shelf` (Phase 2b)
- `feature/book-uplift/filter-restyle` (Phase 2c)
- `feature/book-uplift/section-structure` (Phase 2d)
- `feature/book-uplift/interaction-fixes` (Phase 3a)
- `feature/book-uplift/tech-debt` (Phase 3b)
