# Book Uplift — Codex Orchestration

This directory contains a self-contained, parallel multi-agent orchestration for redesigning the `/books` page of Marihella's vintage blog. The design direction is called **The Collector's Cabinet**.

## What this is

A phased implementation plan that Codex can execute with parallel sub-agents. Each phase has clear inputs, outputs, and acceptance criteria. Phases are designed so that independent work streams can run in parallel, while dependent work runs sequentially.

## How to use this

1. Read this file first — it is the orchestration root.
2. Read `PLAN.md` for the full phased plan with dependency graph.
3. Each agent brief lives in `agents/<name>.md` — these are the task handoffs.
4. Each skill lives in `skills/<name>.md` — these are reusable instruction packages.
5. Run phases in order. Within each phase, run the listed agents in parallel.

## Project context

- **Stack:** Astro (static site generator), no frontend framework, no database
- **Styling:** CSS custom properties in `src/styles/tokens.css`, page-scoped `<style>` blocks
- **Content:** Astro content collections in `src/content/books/*.md`
- **Target file:** `src/pages/books/index.astro` (1491 lines — monolithic, needs decomposition)
- **Tests:** Playwright screenshot tests in `tests/ui/specs/books.spec.ts`
- **Port:** UI review runs on port 4174 via `npm run ui:review`

## Non-negotiable rules

1. **Do not change the colour palette** in `src/styles/tokens.css`.
2. **Do not change the content collection schema** in `src/content/config.ts` or any `*.md` content files.
3. **Do not add new npm dependencies** unless absolutely required (and never a CSS framework).
4. **Do not modify the site header, footer, or sidebar** components.
5. **Preserve the roman numeral pagination** — it is a signature detail.
6. **Preserve the page-flip animation** with `prefers-reduced-motion` support.
7. **Run `npm run ui:review` after visual changes** — do not rely on code reading alone.
8. **Commit after each completed phase** with a descriptive message.
9. **Desktop gets atmosphere, mobile stays clean.** Decorative framing can be reduced or hidden on mobile via media queries.
10. **No new JS frameworks.** All interactivity is vanilla JS or Astro components.

## Design direction summary

**The Collector's Cabinet:** The `/books` page becomes a warmly framed, editorially structured showcase. Covers are the visual anchor at proper display size (~130×195px desktop). The page opens with a framed header. Filters are cleaner and less chrome-heavy. Sections are separated by botanical ornaments. The reviewed shelf is the centrepiece.

Key changes:
- Extract shared components (BookCard, SectionDivider, PageHeader)
- Atmospheric page header with decorative frame
- Restructure section order (Currently Reading → Reviewed → Series → DNF → Want to Read)
- Vertical card layout with larger covers in reviewed shelf
- Restyle filter controls (warmer, less SaaS-like)
- Make card tags clickable (activate filter)
- Add mood descriptor line to reviewed cards
- Add botanical section dividers
- Remove dead "Browse by mood" bottom section
- Books per page: 4 → 6
- Fix Playwright config and tech debt

## File map

```
docs/book-uplift/
  AGENTS.md          ← you are here (orchestration root)
  PLAN.md            ← phased plan with dependency graph
  agents/
    component-extraction.md   ← Phase 1: extract shared components
    page-header.md            ← Phase 2a: atmospheric page header
    reviewed-shelf.md         ← Phase 2b: reviewed shelf redesign
    filter-restyle.md         ← Phase 2c: filter control restyle
    section-structure.md      ← Phase 2d: section reorder + dividers
    interaction-fixes.md      ← Phase 3a: clickable tags, dead UI removal
    tech-debt.md              ← Phase 3b: Playwright fix, script extraction
    visual-review.md          ← Phase 4: screenshot review and polish
  skills/
    style-guardian.md         ← reusable style-checking skill
    ui-review.md              ← reusable screenshot review skill
    book-card-spec.md         ← BookCard component specification
```
