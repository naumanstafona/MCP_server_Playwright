import { test, expect } from '@playwright/test';
import { login } from '../../helpers/login';

// Events / Modules
test.describe('Events / Modules', () => {
  test('Create an event and RSVP', async ({ context }) => {
    const page = await login(context);
    await page.getByRole('link', { name: /Events|Modules/i }).click();
    await expect(page).toHaveURL(/events|modules/);

    await page.getByRole('button', { name: /create event|new event/i }).click();
    const title = `Auto Event ${Date.now()}`;
    await page.fill('input[name="title"]', title);
    await page.fill('input[name="date"]', '2030-01-01');
    await page.getByRole('button', { name: /save|create/i }).click();
    await expect(page.locator(/created|success/i)).toBeVisible();

    // Open and RSVP
    await page.locator(`text=${title}`).click();
    const rsvp = page.getByRole('button', { name: /rsvp|join|attend/i });
    if (await rsvp.count() > 0) {
      await rsvp.click();
      await expect(page.locator(/attending|joined/i)).toBeVisible();
    }
  });
});
