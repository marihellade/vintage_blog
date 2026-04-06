# Agent: Tech Debt

**Phase:** 3b (parallel with 3a)
**Scope:** `tests/ui/`, `package.json`, client script extraction
**Depends on:** Phase 1 complete (for context), but does not depend on Phase 2

## Context

Several technical issues were identified during the audit:
1. The Playwright config `stylePath` references a non-existent file (path doubling bug)
2. `@playwright/test` is not in `package.json` devDependencies
3. The test specs need updating for the new layout
4. The 400-line inline `<script>` in books/index.astro should be extracted

## Task

### 1. Fix Playwright configuration

In `tests/ui/playwright.config.ts`, the `stylePath` is set to `'./tests/ui/screenshot.css'`. This resolves relative to the config file location (`tests/ui/`), producing the path `tests/ui/tests/ui/screenshot.css` — which doesn't exist.

**Fix:** Either:
- Create a minimal `tests/ui/screenshot.css` file (preferred — even if empty, it prevents the error):
  ```css
  /* Screenshot test overrides — hide animated or non-deterministic elements */
  #cursor, #cursor-dot, .cursor-trail { display: none !important; }
  ```
- Or change the stylePath to a correct relative path: `stylePath: './screenshot.css'`

Choose the first option — creating the CSS file. It's more useful because it hides the custom cursor which can cause non-deterministic screenshot diffs.

### 2. Ensure @playwright/test in devDependencies

Check `package.json`. If `@playwright/test` is not listed in `devDependencies`, add it:

```bash
npm install --save-dev @playwright/test
```

### 3. Update test specs

Update `tests/ui/specs/books.spec.ts` to cover the new layout:

```typescript
import { test, expect } from '@playwright/test';

test('books index looks stable at desktop width', async ({ page }) => {
  await page.goto('/books');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('books-index-desktop.png');
});

test('books index looks stable at mobile width', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/books');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('books-index-mobile.png');
});

test('reviewed section renders correctly', async ({ page }) => {
  await page.goto('/books');
  await page.waitForLoadState('networkidle');
  const reviewed = page.locator('.reviewed-section');
  await reviewed.scrollIntoViewIfNeeded();
  await expect(reviewed).toHaveScreenshot('books-reviewed-section.png');
});

test('books filters update without layout damage', async ({ page }) => {
  await page.goto('/books');
  await page.waitForLoadState('networkidle');
  // Click a year filter
  const yearButton = page.locator('[data-year-filter]').nth(1);
  if (await yearButton.isVisible()) {
    await yearButton.click();
    await expect(page.locator('.reviewed-section')).toHaveScreenshot('books-filtered-by-year.png');
  }
});
```

### 4. Extract reviewed shelf client script

The inline `<script>` block in books/index.astro is ~400 lines. Extract it to a separate file:

**Create:** `src/scripts/reviewed-shelf.ts`

Move the entire `initReviewedBooks` function and its setup code into this file. The file should export nothing — it's a self-executing script:

```typescript
// src/scripts/reviewed-shelf.ts

type ReviewedBook = { ... };

const initReviewedBooks = () => {
  // ... entire function body
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initReviewedBooks, { once: true });
} else {
  initReviewedBooks();
}
```

In `books/index.astro`, replace the inline script with:

```astro
<script src="../../scripts/reviewed-shelf.ts"></script>
```

The JSON data script tag (`#reviewed-books-data`) must remain inline in the Astro template since it contains server-rendered data.

**Important:** Astro processes `<script>` tags with `src` attributes — it bundles them. This is the correct default behavior. The script will be bundled and tree-shaken by Astro's build pipeline. Do NOT add `is:inline` to the src script tag (that would skip processing).

## What NOT to do

- Do not change the reviewed shelf behaviour or UI
- Do not add new test specs beyond what's listed (keep test suite focused)
- Do not modify the `renderCard()` template (that's the interaction-fixes agent's job)
- Do not restructure the Playwright config beyond fixing the stylePath

## Acceptance criteria

- [ ] `npm run ui:review -- --update-snapshots` runs without errors
- [ ] `@playwright/test` is in package.json devDependencies
- [ ] `tests/ui/screenshot.css` exists and hides the cursor
- [ ] Test specs include desktop, mobile, reviewed section, and filter tests
- [ ] The inline script is extracted to `src/scripts/reviewed-shelf.ts`
- [ ] The extracted script works correctly (filtering, sorting, pagination, animation)
- [ ] `npm run build` passes

## Gotchas

- The inline script accesses `document.querySelector('#reviewed-books-data')` to read the JSON data. This element is rendered by Astro in the template — it will exist in the DOM before the external script runs (Astro places bundled scripts at the end of the body by default). Verify this works.
- The `ReviewedBook` type is defined inside the inline script. When extracted, it can stay in the same file — it doesn't need to be shared since the server-side version uses a different (compatible) type.
- Astro's script bundling means the extracted script will be processed, minified, and given a hash-based filename in production. This is fine and expected.
- The `is:inline` attribute on the JSON data script tag (`<script id="reviewed-books-data" type="application/json" is:inline ...>`) must stay — this tells Astro not to process it as a module.
