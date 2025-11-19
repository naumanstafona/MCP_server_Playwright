import { test, expect } from '@playwright/test';
import { login } from '../../helpers/login';

// Test: Full login flow using Gmail OTP
test.describe('Authentication', () => {
  test('Login via Gmail OTP (end-to-end)', async ({ context }) => {
    // Step 1: Perform login using reusable helper
    const page = await login(context);

    // Step 2: Post-login validation - header, avatar and nav
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('link', { name: /Dashboard|Home/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /profile|account/i })).toBeVisible();
  });
});
