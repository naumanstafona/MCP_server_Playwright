import { test, expect } from '@playwright/test';
import { login } from '../../helpers/login';

// Edit existing track
test.describe('Tracks - Edit', () => {
  test('Edit a track and persist changes', async ({ context }) => {
    const page = await login(context);
    await page.getByRole('link', { name: /Tracks|tracks/i }).click();
    await expect(page).toHaveURL(/tracks/);

    // Open first track row
    const first = page.locator('table tbody tr').first();
    await expect(first).toBeVisible({ timeout: 10000 });
    await first.click();

    // Click edit
    await page.getByRole('button', { name: /edit/i }).click();
    const desc = `Edited by automation ${Date.now()}`;
    await page.fill('textarea[name="description"]', desc);
    await page.getByRole('button', { name: /save|update/i }).click();

    // Verify success and persist
    await expect(page.locator(/success|updated/i)).toBeVisible({ timeout: 10000 });
    await page.reload();
    await expect(page.locator(`text=${desc}`)).toBeVisible({ timeout: 10000 });
  });
});
