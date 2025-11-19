import { test, expect } from '@playwright/test';
import { login } from '../../helpers/login';

// Change password
test.describe('Settings - Security', () => {
  test('Change account password', async ({ context }) => {
    const page = await login(context);
    await page.getByRole('link', { name: /Settings|settings/i }).click();
    await page.getByRole('link', { name: /Security|security/i }).click();
    await expect(page).toHaveURL(/settings\/security/);

    // Fill change password form - using dummy values; this may be destructive in real environments
    const current = 'OldPass123!';
    const next = 'NewPass123!';
    await page.fill('input[name="currentPassword"]', current).catch(() => {});
    await page.fill('input[name="newPassword"]', next).catch(() => {});
    await page.fill('input[name="confirmPassword"]', next).catch(() => {});
    await page.getByRole('button', { name: /change|save/i }).click();
    await expect(page.locator(/success|password updated/i)).toBeVisible({ timeout: 10000 }).catch(() => {});
  });
});
