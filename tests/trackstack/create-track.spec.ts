import { test, expect } from '@playwright/test';
import { login } from '../../helpers/login';

// Create track
test.describe('Tracks - Create', () => {
  test('Create a new track and verify it appears in list', async ({ context }) => {
    const page = await login(context);
    await page.getByRole('link', { name: /Tracks|tracks/i }).click();
    await expect(page).toHaveURL(/tracks/);

    // Click create
    await page.getByRole('button', { name: /create|new track|new/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    const name = `test-track-${Date.now()}`;
    await page.fill('input[name="name"]', name);
    await page.fill('textarea[name="description"]', 'Automated test track');
    await page.getByRole('button', { name: /save|create/i }).click();

    // Verify success and presence
    await expect(page.locator(/success|created/i)).toBeVisible({ timeout: 10000 });
    await page.getByRole('link', { name: /Tracks|tracks/i }).click();
    await expect(page.locator(`text=${name}`)).toBeVisible({ timeout: 10000 });
  });
});
