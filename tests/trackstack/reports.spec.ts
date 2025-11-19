import { test, expect } from '@playwright/test';
import { login } from '../../helpers/login';

// Reports
test.describe('Reports', () => {
  test('Open reports overview and view a report', async ({ context }) => {
    const page = await login(context);
    await page.getByRole('link', { name: /Reports|reports/i }).click();
    await expect(page).toHaveURL(/reports/);
    await expect(page.locator('canvas, svg')).toBeVisible({ timeout: 10000 });
  });
});
