import { test, expect } from '@playwright/test';

test('books index looks stable at desktop width', async ({ page }) => {
  await page.goto('/books');
  await page.fonts?.ready;
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('books-index-desktop.png');
});

test('books filters open without layout damage', async ({ page }) => {
  await page.goto('/books');
  await page.getByRole('button', { name: /filter|more/i }).click();
  await expect(page).toHaveScreenshot('books-index-filters-open.png');
});