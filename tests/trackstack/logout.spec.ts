import { test, expect } from '@playwright/test';
import { login } from '../../helpers/login';

// Logout
test.describe('Profile & Logout', () => {
  test('Open profile menu and logout', async ({ context }) => {
    const page = await login(context);
    await page.getByRole('button', { name: /profile|account|user/i }).click();
    await page.getByRole('link', { name: /logout|sign out/i }).click();
    await expect(page).toHaveURL(/auth\/login/);
  });
});
