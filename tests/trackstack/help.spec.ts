import { test, expect } from '@playwright/test';
import { login } from '../../helpers/login';

// Help / Feedback
test.describe('Help & Feedback', () => {
  test('Submit feedback via help form', async ({ context }) => {
    const page = await login(context);
    await page.getByRole('link', { name: /Help|support|contact/i }).click();
    await expect(page).toHaveURL(/help|support/);

    const subjectInput = page.getByRole('textbox', { name: /subject|title/i });
    if (await subjectInput.count() === 0) { test.skip(); return; }
    await subjectInput.fill('Automation feedback');
    await page.fill('textarea[name="message"]', 'This is automated feedback from E2E test.');
    await page.getByRole('button', { name: /submit|send/i }).click();
    await expect(page.locator(/thank you|submitted|success/i)).toBeVisible({ timeout: 10000 });
  });
});
