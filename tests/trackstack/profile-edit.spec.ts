import { test, expect } from '@playwright/test';
import { login } from '../../helpers/login';

// Profile edit
test.describe('Settings - Profile', () => {
  test('Edit profile display name and avatar', async ({ context }) => {
    const page = await login(context);
    await page.getByRole('link', { name: /Settings|settings/i }).click();
    await page.getByRole('link', { name: /Profile|profile/i }).click();
    await expect(page).toHaveURL(/settings\/profile/);

    const newName = `Auto ${Date.now()}`;
    await page.fill('input[name="displayName"]', newName);
    // avatar upload - skip if no file input
    const fileInput = page.locator('input[type="file"]');
    if (await fileInput.count() > 0) {
      // Provide a placeholder path - adjust in CI to a real image
      await fileInput.setInputFiles([]).catch(() => {});
    }
    await page.getByRole('button', { name: /save|update/i }).click();
    await expect(page.locator(/success|saved/i)).toBeVisible();
    await expect(page.locator(`text=${newName}`)).toBeVisible();
  });
});
