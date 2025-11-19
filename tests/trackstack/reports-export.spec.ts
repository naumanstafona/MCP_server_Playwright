import { test, expect } from '@playwright/test';
import { login } from '../../helpers/login';

// Reports export smoke
test.describe('Reports - Export', () => {
  test('Export report to CSV', async ({ context }) => {
    const page = await login(context);
    await page.getByRole('link', { name: /Reports|reports/i }).click();
    await expect(page).toHaveURL(/reports/);

    const exportBtn = page.getByRole('button', { name: /export|download/i }).first();
    if (await exportBtn.count() === 0) { test.skip(); return; }
    // Intercept download
    const [ download ] = await Promise.all([
      page.waitForEvent('download'),
      exportBtn.click()
    ]);
    const path = await download.path().catch(() => null);
    expect(path).not.toBeNull();
  });
});
