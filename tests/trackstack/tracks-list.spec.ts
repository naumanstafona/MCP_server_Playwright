import { test, expect } from '@playwright/test';
import { login } from '../../helpers/login';

// Tracks list and search
test.describe('Tracks', () => {
  test('List tracks and search works', async ({ context }) => {
    const page = await login(context);
    // Navigate to Tracks
    await page.getByRole('link', { name: /Tracks|tracks/i }).click();
    await expect(page).toHaveURL(/tracks/);

    // Ensure table or empty state
    const list = page.locator('table');
    if (await list.count() > 0) {
      await expect(list).toBeVisible();
    } else {
      await expect(page.locator(/no results|no tracks/i)).toBeVisible();
    }

    // Search if search exists
    const search = page.getByRole('searchbox');
    if (await search.count() > 0) {
      await search.fill('test');
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(/search=/);
    }
  });
});
