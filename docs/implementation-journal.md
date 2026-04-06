# Implementation Journal

## Phase 1 — Stabilise and remove drag

### Intent
Phase 1 removed a few high-impact sources of drag without changing the site's personality: slower font delivery, missing keyboard skip navigation, heading hierarchy skips, a dead cursor asset, and style documentation that no longer matched the live implementation.

### Work completed
- Moved Google Fonts loading out of `src/styles/global.css` and into the document head in `src/layouts/BaseLayout.astro` with `preconnect` links and a reduced font variant set
- Added a keyboard-accessible skip link at the top of the layout body and global styling for its hidden and focused states
- Repaired `h1` to `h2` hierarchy across the homepage, About page, travel and recipe indexes, and the book detail page panels
- Removed the unused `public/cursors/sprig.svg` asset
- Updated `docs/style-notes.md` to reflect the current dark base, warm-gold sparkle treatment, and the accepted cursor direction

### Validation
- Ran `npm run build` before changes to confirm the baseline build was green
- Ran `npm run build` after each major implementation slice and again during final acceptance
- Checked generated HTML in `dist/` for the font stylesheet link and the skip link
- Confirmed the old `section-title` and `panel-title` `h3` patterns were gone from the updated source
- Confirmed `public/cursors/sprig.svg` was removed

### Git
- Branch: `fix/phase1-stabilise`
- Key commits:
  - `7907155` `fix: move font loading into layout head`
  - `645fc9c` `fix: repair heading hierarchy across pages`
  - `7079272` `chore: remove sprig asset and sync style notes`
- Merge result: merged into `main` with `merge: complete phase 1 stabilise`

### Notes
- `npx astro check` is not yet available in the repo because `@astrojs/check` is not installed; that stays aligned with the roadmap and will be addressed in a later phase
- The working tree still contains unrelated pre-existing local edits in `.claude/settings.local.json` and `.gitignore`; they were left untouched

## Phase 2 — Content architecture completion

### Intent
Phase 2 gave the travel and recipe collections the same scalable shape as the books collection: lightweight index pages for browsing, dedicated detail routes for full entries, and documentation that explains the new authoring flow clearly.

### Work completed
- Added `src/pages/travel/[slug].astro` with a static path per travel entry and a full detail layout for destination, date, mood, highlights, tags, and markdown body
- Reworked `src/pages/travel/index.astro` from inline markdown rendering to linked summary cards with thumbnails, metadata, highlight previews, and entry links
- Added `src/pages/recipes/[slug].astro` with a static path per recipe entry and a full detail layout for source, rating, make-again status, tags, and markdown body
- Reworked `src/pages/recipes/index.astro` into linked summary cards and aligned recipe star rendering with the shared rating helper
- Updated `docs/how-to-edit-content.md` so it now explains that travel and recipe entries automatically create both an index card and an individual page

### Validation
- Ran `npm run build` after the travel slice, after the recipe slice, after the docs update, and again in the final acceptance pass
- Verified the build now generates `/travel/sample-trip/` and `/recipes/rosemary-focaccia/`
- Confirmed the travel and recipe index pages no longer call `render()` for inline entry bodies
- Confirmed the built index pages link to the new detail routes

### Git
- Branch: `feature/travel-recipe-detail-pages`
- Key commits:
  - `2211652` `feat: add travel detail pages`
  - `6e06e02` `feat: add recipe detail pages`
  - `e99fbf6` `docs: update content editing guide`
- Merge result: merged into `main` with `merge: complete phase 2 content architecture`

### Notes
- The phase intentionally kept the homepage feature cards unchanged; the roadmap only required the travel and recipe collection architecture to be completed
- The same unrelated pre-existing local edits in `.claude/settings.local.json` and `.gitignore` remain untouched

## Phase 3 — Astro upgrade

### Intent
Phase 3 moved the project onto a current Astro release while preserving the existing content authoring flow, route structure, and static output.

### Work completed
- Upgraded Astro from `4.16.0` to `6.1.3`
- Added `@astrojs/check` and `typescript` so the repo can run Astro’s type and diagnostics pass
- Enabled the official temporary `legacy.collectionsBackwardsCompat` flag so the existing `src/content/config.ts` file and collection setup continue to work during the upgrade
- Updated `src/content/config.ts` to import `z` from `astro/zod`
- Added the official Astro TypeScript `include` and `exclude` guidance to `tsconfig.json`
- Migrated collection entry usage from `entry.slug` and `entry.render()` to `render(entry)` plus clean slug generation based on entry IDs
- Added `src/utils/contentSlug.ts` to preserve the existing clean URLs after Astro 6’s path-based legacy entry IDs introduced `.md` suffixes
- Updated `README.md` and `docs/how-to-run.md` to note the new Node.js `22.12.0+` requirement

### Validation
- Ran `npx astro check` after the compatibility fixes and in the final acceptance pass; result: `0 errors`
- Ran `npm run build` after the upgrade work and in the final acceptance pass; result: passed
- Verified generated routes remained clean and extension-free:
  - `/books/...`
  - `/travel/sample-trip`
  - `/recipes/rosemary-focaccia`

### Git
- Branch: `chore/astro-upgrade`
- Key commits:
  - `22bdeaf` `chore: upgrade astro to v6`
  - `51fe7f1` `fix: adapt collection routes for astro v6`
  - `8de0632` `docs: note astro 6 node requirement`
- Merge result: merged into `main` with `merge: complete phase 3 astro upgrade`

### Notes
- Astro 6 still reports non-blocking hints in `src/pages/books/index.astro` and a deprecation hint for `z.string().url()` in `src/content/config.ts`; these did not block `astro check` or the build
- The same unrelated pre-existing local edits in `.claude/settings.local.json` and `.gitignore` remain untouched

## Phase 4 — Code organisation refactor

### Intent
Phase 4 reduced layout sprawl, made the repo easier to maintain, added the lightweight check command the roadmap called for, and centralised the repeated interface colours that were starting to drift across pages.

### Work completed
- Extracted `src/components/DecorativeTrees.astro` from `BaseLayout.astro` so the fixed page-edge illustration now lives in its own component
- Extracted `src/components/RightSidebar.astro` so the season, tea, updates, and yearly books widgets no longer live inside the base layout
- Shrunk `src/layouts/BaseLayout.astro` to a small shell component that composes the header, decorative trees, sidebars, cursor, main content, and footer
- Added `"check": "astro check"` to `package.json`
- Updated `README.md` and `docs/how-to-run.md` to document the new validation command and the new layout/component split
- Added new interface colour and gradient tokens in `src/styles/tokens.css` and replaced repeated UI hex values across the global styles, cursor, homepage, book pages, plant page, travel page, recipe page, footer, and sidebar
- Kept the books reviewed shelf server-rendered by design and added an explicit code comment explaining that the client script enhances the same data for sorting and pagination rather than replacing the no-JS render
- Reduced the Phase 3 Astro hints from the books page by adding the explicit inline JSON script hint and TypeScript annotations in the reviewed shelf client script

### Validation
- Ran `npm run check`; result: `0 errors`, `0 warnings`, `1 hint`
- Ran `npm run build`; result: passed and generated 18 static pages
- Confirmed `src/layouts/BaseLayout.astro` is now 100 lines
- Confirmed the remaining hardcoded hex values in the touched UI files now live in `src/styles/tokens.css`

### Git
- Branch: `refactor/code-organisation`
- Key commits:
  - `8ed47f2` `refactor: extract base layout side elements`
  - `70762d8` `chore: add astro check workflow`
  - `29cb69a` `refactor: centralize interface colors`
- Merge result: merged into `main` with `merge: complete phase 4 code organisation`

### Notes
- The roadmap’s “no hardcoded hex colours outside tokens.css” goal was adapted to repeated interface colours. Illustration-heavy SVG palettes in files like `src/components/DecorativeTrees.astro` and `src/components/Header.astro` remain local because they function more like artwork than reusable UI tokens
- One non-blocking Astro hint remains in `src/content/config.ts` for the deprecated `z.string().url()` helper
- The same unrelated pre-existing local edits in `.claude/settings.local.json` and `.gitignore` remain untouched

## Phase 5 — Selective delight and expansion

### Intent
Phase 5 added the roadmap’s next layer of personality and usability polish: better filtering for the book diary, lower-overhead cursor behavior, more legible secondary text, richer non-book section presentation, and new personal pages that expand the site’s sense of self.

### Work completed
- Added reviewed-book tag filtering to `src/pages/books/index.astro`, alongside the existing year and sort controls
- Slowed the cursor sparkle spawn interval in `src/components/Cursor.astro` from 35ms to 55ms to reduce DOM churn while keeping the trail visually continuous
- Brightened `--color-ink-soft` in `src/styles/tokens.css` to improve secondary text readability site-wide
- Added an `extras` content collection in `src/content/config.ts`
- Added `src/content/extras/now.md` and `src/pages/now.astro` for a content-backed Now page
- Added `src/content/extras/links.md` and `src/pages/links.astro` for a content-backed Links page
- Added the new pages to sidebar and footer navigation
- Updated `docs/how-to-edit-content.md` and `README.md` so the new pages and their editing locations are documented
- Enriched the plant, travel, and recipe index pages with atmosphere-forward stat strips, section notes, and warmer card treatments

### Validation
- Ran `npm run check` after each major Phase 5 slice and again during final acceptance; result: `0 errors`, `0 warnings`, `1 hint`
- Ran `npm run build` after each major Phase 5 slice and again during final acceptance; result: passed
- Verified the build now generates `/now/` and `/links/`
- Confirmed the final build produces 20 static pages

### Git
- Branch: `feature/phase5-delight`
- Key commits:
  - `76fbac5` `feat: add book tag filtering`
  - `ca3d0e8` `perf: tune cursor trail and secondary text`
  - `eabc34f` `feat: add now and links pages`
  - `0c773b7` `style: enrich secondary section pages`
- Merge result: merged into `main` with `merge: complete phase 5 delight`

### Notes
- The roadmap requirement for “at least 2 new pages from the spec” is satisfied by the new `Now` and `Links` pages
- A dedicated gallery / cute-things page is still a strong follow-up candidate if the site wants an additional decorative expansion later
- The same non-blocking Astro hint remains in `src/content/config.ts` for the deprecated `z.string().url()` helper
- The same unrelated pre-existing local edits in `.claude/settings.local.json` and `.gitignore` remain untouched

## Phase 6 — Book diary editorial shelf pass

### Intent
Phase 6 re-composed the Book Diary reviewed shelf so it feels more like a candlelit editorial catalogue and less like a utilitarian card grid, while preserving the page’s existing handmade literary atmosphere.

### Work completed
- Added the planning artefact at `docs/ignored/book-diary-editorial-shelf-plan.md` with the redesign council diagnosis, synthesis, risk register, and acceptance checklist
- Reworked the reviewed section in `src/pages/books/index.astro` into a framed shelf treatment with a folio-style page indicator and a more atmospheric section note
- Redesigned the reviewed cards to use smaller figurative book covers, stronger title/author hierarchy, a compact rating-and-status line, a roomier mood note, and quieter tags
- Replaced the old bottom pagination row with always-visible side-mounted previous/next shelf controls and a Roman numeral page count
- Moved mood filtering into an accessible plus-style reveal while keeping year and sort controls visible
- Preserved the existing progressive enhancement model so the first reviewed shelf still renders on the server and the client script enhances filtering, sorting, paging, and state updates

### Validation
- Ran `npm run check` after the redesign pass and after the final accessibility polish; result: `0 errors`, `0 warnings`, `1 hint`
- Ran `npm run build` after the redesign pass and after the final accessibility polish; result: passed and generated 20 static pages
- Confirmed the built `/books/` output now contains the folio indicator, side-mounted shelf controls, the plus-style mood reveal, and the updated reviewed card structure

### Git
- Branch: `feature/book-diary-editorial-shelf-pass`
- Key commits:
  - `108883d` `docs: add book diary editorial shelf redesign plan`
  - `0eca30b` `feat: redesign book diary reviewed shelf`

### Notes
- The reviewed shelf now reads more clearly as a curated catalogue without changing how book content is authored; all book edits still happen in `src/content/books/`
- The no-JS experience remains intentionally lightweight: the first reviewed page renders meaningfully on the server, while filtering and paging stay client-enhanced rather than becoming a URL/query-param system
- The same non-blocking Astro hint remains in `src/content/config.ts` for the deprecated `z.string().url()` helper
- The same unrelated pre-existing local edits in `.claude/settings.local.json` and `.gitignore` remain untouched

## Final Snapshot

### Completed phases
- Phase 1 — Stabilise and remove drag
- Phase 2 — Content architecture completion
- Phase 3 — Astro upgrade
- Phase 4 — Code organisation refactor
- Phase 5 — Selective delight and expansion
- Phase 6 — Book diary editorial shelf pass

### Repo-level impact
- The site now has clean travel and recipe detail routes, a current Astro version, a smaller and more maintainable layout structure, a built-in `npm run check` command, richer collection pages, two new personal pages, and a redesigned Book Diary shelf with editorial card hierarchy, side-mounted navigation, and a progressive mood-filter reveal

### Validation summary
- Final repo validation: `npm run check` passed with `0 errors`, `0 warnings`, `1 hint`
- Final repo validation: `npm run build` passed and generated 20 static pages

### Remaining follow-ups
- Replace the deprecated `z.string().url()` call in `src/content/config.ts` with Astro 6’s preferred URL validation helper when convenient
- Consider adding a dedicated gallery / cute-things page if the site wants another round of personality-focused expansion

### Manual review suggestions
- Give the updated Book Diary reviewed shelf a quick visual pass on desktop and mobile, especially the side controls and filter reveal
- Click through the new `/now/` and `/links/` routes to confirm the tone and content feel right for the owner
