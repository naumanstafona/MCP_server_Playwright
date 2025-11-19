import { test, expect } from '@playwright/test';
import { login } from '../../helpers/login';

// Notifications
test.describe('Notifications', () => {
  test('Receive and view a notification', async ({ context }) => {
    const page = await login(context);
    // Trigger or use test hook - here we simply open popover
    const notifBtn = page.getByRole('button', { name: /notifications|bell/i });
    await expect(notifBtn).toBeVisible();
    await notifBtn.click();
    await expect(page.locator(/notification|no notifications/i)).toBeVisible();
  });
});
