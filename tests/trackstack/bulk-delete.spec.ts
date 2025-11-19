import { test, expect } from '@playwright/test';
import { login } from '../../helpers/login';

// Bulk delete tracks
test.describe('Tracks - Bulk actions', () => {
  test('Bulk delete multiple tracks', async ({ context }) => {
    const page = await login(context);
    await page.getByRole('link', { name: /Tracks|tracks/i }).click();

    // Select multiple checkboxes if available
    const rows = page.locator('table tbody tr');
    const count = await rows.count();
    if (count < 2) {
      test.skip();
      return;
    }
    await rows.nth(0).locator('input[type="checkbox"]').check();
    await rows.nth(1).locator('input[type="checkbox"]').check();

    await page.getByRole('button', { name: /bulk|delete selected|delete/i }).click();
    await page.getByRole('button', { name: /confirm|delete/i }).click();
    await expect(page.locator(/success|deleted/i)).toBeVisible({ timeout: 10000 });
  });
});
