import { test, expect } from '@playwright/test';

test('books index looks stable at desktop width', async ({ page }) => {
  await page.goto('/books');
  await page.fonts?.ready;
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('books-index-desktop.png');
});

test('books index looks stable at mobile width', async ({ page }) => {
  await page.goto('/books');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.fonts?.ready;
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('books-index-mobile.png');
});

test('reviewed section renders correctly', async ({ page }) => {
  await page.goto('/books');
  await page.fonts?.ready;
  await page.waitForLoadState('networkidle');

  const reviewed = page.locator('.reviewed-section');
  await reviewed.scrollIntoViewIfNeeded();
  await expect(reviewed).toHaveScreenshot('books-reviewed-section.png');
});

test('books filters update without layout damage', async ({ page }) => {
  await page.goto('/books');
  await page.fonts?.ready;
  await page.waitForLoadState('networkidle');

  const yearButton = page.locator('[data-year-filter]').nth(1);
  if (await yearButton.isVisible()) {
    await yearButton.click();
    await expect(page.locator('.reviewed-section')).toHaveScreenshot('books-filtered-by-year.png');
  }
});
