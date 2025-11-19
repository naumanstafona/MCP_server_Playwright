import { test, expect } from '@playwright/test';
import { login } from '../../helpers/login';

// Delete track
test.describe('Tracks - Delete', () => {
  test('Delete a test track with confirmation', async ({ context }) => {
    const page = await login(context);
    await page.getByRole('link', { name: /Tracks|tracks/i }).click();
    await expect(page).toHaveURL(/tracks/);

    // Find a track row that is safe to delete (best effort: find by test prefix)
    const row = page.locator('text=test-track-').first();
    if (await row.count() === 0) {
      test.skip();
      return;
    }
    await row.locator('button[aria-label*="delete"]').click();
    await page.getByRole('button', { name: /confirm|delete/i }).click();

    // Verify deletion
    await expect(page.locator(/deleted|removed|success/i)).toBeVisible({ timeout: 10000 });
  });
});
