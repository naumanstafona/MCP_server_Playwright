import { test, expect } from '@playwright/test';
import { login } from '../../helpers/login';

// This test validates the email validation on the login page
test.describe('Authentication - Negative', () => {
  test('Invalid email format shows validation', async ({ context }) => {
    // Create a fresh page to test email validation (no login helper used)
    const page = await context.newPage();
    await page.goto('https://testing.trackstack.app/auth/login');

    // Step 1: Enter invalid email and submit
    await page.fill('input[type="email"]', 'invalid-email');
    await page.getByRole('button', { name: 'Continue' }).click();

    // Expect validation message and no navigation
    await expect(page.locator('text=Enter a valid email')).toBeVisible({ timeout: 5000 });
    await expect(page).toHaveURL(/auth\/login/);
  });
});
