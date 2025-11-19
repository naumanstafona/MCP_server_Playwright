import { test, expect } from '@playwright/test';
import { login } from '../../helpers/login';

// Posts / Feed
test.describe('Posts / Feed', () => {
  test('Create a post, comment and react', async ({ context }) => {
    const page = await login(context);
    await page.getByRole('link', { name: /Posts|Feed|Feed/i }).click();
    await expect(page).toHaveURL(/posts|feed/);

    // Create a post
    await page.getByRole('button', { name: /create post|new post/i }).click();
    await page.fill('input[name="title"]', `Auto post ${Date.now()}`);
    await page.fill('textarea[name="body"]', 'This is a test post created by automation.');
    await page.getByRole('button', { name: /post|publish/i }).click();
    await expect(page.locator(/posted|success/i)).toBeVisible({ timeout: 10000 });

    // Open the post and comment
    const post = page.locator('article').first();
    await post.click();
    await page.fill('textarea[name="comment"]', 'Nice post');
    await page.getByRole('button', { name: /comment/i }).click();
    await expect(page.locator('text=Nice post')).toBeVisible();

    // React/like
    const likeBtn = page.getByRole('button', { name: /like|react/i }).first();
    if (await likeBtn.count() > 0) {
      await likeBtn.click();
      await expect(post.locator(/likes|reactions/i)).toBeVisible();
    }
  });
});
