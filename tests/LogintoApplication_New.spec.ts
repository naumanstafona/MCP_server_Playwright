// spec: TrackstackLoginFlow.md
// Test: Log into Trackstack using Gmail OTP (single test)

import { test, expect, Page } from '@playwright/test';

// Test data (from test plan)
const TRACKSTACK_URL = 'https://testing.trackstack.app/auth/login';
const TRACKSTACK_EMAIL = 'nauman+autol@trackstack.app';
const GMAIL_USER = 'nauman@trackstack.app';
const GMAIL_PASS = 'BasketBall@2025';
const OTP_EMAIL_SUBJECT = 'Your sign in code';

// Helper: Sign into Gmail and fetch latest OTP email matching subject
async function fetchOtpFromGmail(page: Page): Promise<string> {
  // 1. Go to Gmail
  await page.goto('https://accounts.google.com/signin/v2/identifier?service=mail', { waitUntil: 'domcontentloaded' });

  // 2. Enter email and continue
  await page.fill('input[type="email"]', GMAIL_USER);
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    page.click('button:has-text("Next")')
  ]);

  // 3. Enter password and continue
  // Try robust selectors for password field
  const pwSelectors = ['input[type="password"]', 'input[name="password"]', '[name="Passwd"]'];
  let pwFound = false;
  for (const sel of pwSelectors) {
    try {
      await page.waitForSelector(sel, { timeout: 5000 });
      await page.fill(sel, GMAIL_PASS);
      pwFound = true;
      break;
    } catch (e) {
      // try next selector
    }
  }
  if (!pwFound) throw new Error('Password field not found on Gmail login');

  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 60000 }),
    page.click('button:has-text("Next")')
  ]);

  // 4. Wait for inbox to load
  await page.waitForURL(/mail\.google\.com/, { timeout: 60000 });
  await page.waitForTimeout(3000); // stabilize

  // 5. Search for OTP subject
  const searchSelector = 'input[aria-label="Search mail"]';
  await page.waitForSelector(searchSelector, { timeout: 30000 });
  await page.click(searchSelector);
  await page.fill(searchSelector, `subject:"${OTP_EMAIL_SUBJECT}"`);
  await page.keyboard.press('Enter');

  // 6. Wait and open first result
  await page.waitForTimeout(3000);
  const emailRow = await page.$('tr[role="row"]');
  if (!emailRow) throw new Error('No email rows found for OTP search');
  await emailRow.click();

  // 7. Extract 6-digit OTP
  await page.waitForSelector('div[role="main"]', { timeout: 20000 });
  const bodyText = await page.locator('div[role="main"]').innerText();
  const match = bodyText.match(/\b(\d{6})\b/);
  if (!match) throw new Error('No 6-digit OTP found in email body');
  return match[1];
}

// Test
test.describe('Trackstack Login (single flow)', () => {
  test('LogintoApplication_New', async ({ context }) => {
    // Create two pages: one for Trackstack, one for Gmail
    const trackstack = await context.newPage();
    const gmail = await context.newPage();

    // Step 1: Open application and request OTP
    // Clicks and verifications use the steps from the test plan
    await test.step('Open app and request OTP', async () => {
      await trackstack.goto(TRACKSTACK_URL);
      await trackstack.waitForSelector('[data-testid="email"]', { timeout: 15000 });
      await trackstack.getByTestId('email').fill(TRACKSTACK_EMAIL);
      await trackstack.getByRole('button', { name: 'Continue' }).click();
      await expect(trackstack.locator('text=Check your inbox')).toBeVisible();
    });

    // Step 2: Get OTP from Gmail
    const otp = await test.step('Retrieve OTP from Gmail', async () => {
      return await fetchOtpFromGmail(gmail);
    });

    // Step 3: Enter OTP and verify login
    await test.step('Enter OTP and verify login', async () => {
      await trackstack.bringToFront();
      // find OTP input (first textbox)
      const otpInput = await trackstack.waitForSelector('input[type="text"]', { timeout: 15000 });
      await otpInput.fill(otp);

      // wait for redirect and verify URL changed
      await trackstack.waitForTimeout(2000);
      await expect(trackstack).not.toHaveURL(/\/auth\//, { timeout: 30000 });
      const url = trackstack.url();
      expect(url).not.toContain('/auth/');
    });

    // Cleanup
    await gmail.close();
    await trackstack.close();
  });
});