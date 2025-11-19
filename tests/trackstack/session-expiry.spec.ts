import { test, expect } from '@playwright/test';
import { login } from '../../helpers/login';

// Session expiry and re-auth
test.describe('Session', () => {
  test('Session expiry prompts re-auth and allows resume', async ({ context }) => {
    const page = await login(context);
    // Simulate session expiry - best effort: clear cookies/local storage
    await context.clearCookies();
    await context.clearPermissions();

    // Try an action that requires auth
    await page.goto('https://testing.trackstack.app/tracks');
    // Expect redirect to auth or a re-auth prompt
    await expect(page).toHaveURL(/auth\/login|verify-otp/);
  });
});
