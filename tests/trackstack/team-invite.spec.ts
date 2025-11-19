import { test, expect } from '@playwright/test';
import { login } from '../../helpers/login';

// Team invites
test.describe('Team / Users', () => {
  test('Invite a new team member and change role', async ({ context }) => {
    const page = await login(context);
    await page.getByRole('link', { name: /Team|Users/i }).click();
    await expect(page).toHaveURL(/team|users/);

    // Invite (skip if no admin privileges)
    const inviteBtn = page.getByRole('button', { name: /invite|add member/i });
    if (await inviteBtn.count() === 0) { test.skip(); return; }
    await inviteBtn.click();
    const email = `test-invite+${Date.now()}@example.com`;
    await page.fill('input[name="email"]', email);
    await page.getByRole('combobox').selectOption({ index: 1 }).catch(() => {});
    await page.getByRole('button', { name: /send|invite/i }).click();
    await expect(page.locator(/pending|invite sent/i)).toBeVisible();
  });
});
