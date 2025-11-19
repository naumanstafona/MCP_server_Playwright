import { test, expect } from '@playwright/test';
import { login } from '../../helpers/login';

// Inbox / Messages
test.describe('Inbox', () => {
  test('Open inbox and view a message', async ({ context }) => {
    const page = await login(context);
    await page.getByRole('link', { name: /Inbox|Messages/i }).click();
    await expect(page).toHaveURL(/inbox/);

    const first = page.locator('table tbody tr').first();
    if (await first.count() === 0) {
      test.skip();
      return;
    }
    await first.click();
    // Use getByRole for main landmark instead of a css locator
    await expect(page.getByRole('main')).toBeVisible();
  });
});
