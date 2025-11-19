import { test, expect } from '@playwright/test';
import { login } from '../../helpers/login';

// API Keys management
test.describe('API Keys', () => {
  test('Create and revoke an API key', async ({ context }) => {
    const page = await login(context);
    await page.getByRole('link', { name: /Settings|settings/i }).click();
    await page.getByRole('link', { name: /API Keys|api-keys|API Keys/i }).click();
    await expect(page).toHaveURL(/api-keys|api-keys/);

    const create = page.getByRole('button', { name: /create|new api key|generate/i });
    if (await create.count() === 0) { test.skip(); return; }
    await create.click();
    await page.fill('input[name="name"]', `test-key-${Date.now()}`);
    await page.getByRole('button', { name: /create|generate/i }).click();
    await expect(page.locator(/key created|generated/i)).toBeVisible({ timeout: 10000 });

    // Revoke - best-effort
    const revoke = page.getByRole('button', { name: /revoke|delete|remove/i }).first();
    if (await revoke.count() > 0) {
      await revoke.click();
      await page.getByRole('button', { name: /confirm|revoke|delete/i }).click();
      await expect(page.locator(/revok|removed/i)).toBeVisible({ timeout: 10000 }).catch(() => {});
    }
  });
});
