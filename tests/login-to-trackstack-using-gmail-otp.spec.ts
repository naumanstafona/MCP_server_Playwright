// spec: TrackstackLoginFlow.md
// seed: seed.spec.ts

import { test, expect, Page } from '@playwright/test';

const TRACKSTACK_URL = 'https://testing.trackstack.app/auth/login';
const TRACKSTACK_EMAIL = 'nauman+autol@trackstack.app';
const GMAIL_USER = 'nauman@trackstack.app';
const GMAIL_PASS = 'BasketBall@2025';
const OTP_EMAIL_SUBJECT = 'Your sign in code';

// Helper: Sign into Gmail and fetch latest OTP email matching subject
async function fetchOtpFromGmail(page: Page): Promise<string> {
  // 1. Go to Gmail sign-in
  await page.goto('https://accounts.google.com/signin/v2/identifier?service=mail');

  // 2. Enter email and continue
  const emailInput = page.locator('input[type="email"]');
  await expect(emailInput).toBeVisible({ timeout: 15000 });
  await emailInput.fill(GMAIL_USER);
  await page.getByRole('button', { name: 'Next' }).click();

  // 3. Enter password and continue (robust selectors)
  const pwSelectors = [
    'input[type="password"]',
    'input[name="password"]',
    '[name="Passwd"]',
    'input[aria-label="Enter your password"]'
  ];
  let pwFilled = false;
  for (const sel of pwSelectors) {
    const pw = page.locator(sel);
    try {
      await expect(pw).toBeVisible({ timeout: 15000 });
      await pw.fill(GMAIL_PASS);
      pwFilled = true;
      break;
    } catch (e) {
      // try next selector
    }
  }
  if (!pwFilled) throw new Error('Password field not found on Gmail login');
  await page.getByRole('button', { name: 'Next' }).click();

  // 4. Wait for Gmail inbox to load and search for OTP
  await expect(page).toHaveURL(/mail\.google\.com/, { timeout: 60000 });

  const searchInput = page.locator('input[aria-label="Search mail"]');
  await expect(searchInput).toBeVisible({ timeout: 30000 });
  await searchInput.click();
  await searchInput.fill(`subject:"${OTP_EMAIL_SUBJECT}"`);
  await page.keyboard.press('Enter');

  // 5. Open first search result
  const firstRow = page.locator('tr[role="row"]').first();
  await expect(firstRow).toBeVisible({ timeout: 30000 });
  await firstRow.click();

  // 6. Extract 6-digit OTP from email body
  const main = page.locator('div[role="main"]');
  await expect(main).toBeVisible({ timeout: 20000 });
  const bodyText = await main.innerText();
  const match = bodyText.match(/\b(\d{6})\b/);
  if (!match) throw new Error('No 6-digit OTP found in email body');
  return match[1];
}

// Single test as requested
test.describe('Trackstack Login with Gmail OTP - Single Test Flow', () => {
  test('Login to Trackstack using Gmail OTP', async ({ context }) => {
    // Create two pages: one for Trackstack, one for Gmail
    const trackstack = await context.newPage();
    const gmail = await context.newPage();

    // 1. Open Trackstack Application
    // - Navigate to https://testing.trackstack.app/auth/login
    // - Verify login page loads successfully
    // (step comment)
    await trackstack.goto(TRACKSTACK_URL);
    const tsEmail = trackstack.getByTestId('email');
    await expect(tsEmail).toBeVisible({ timeout: 15000 });

    // 2. Submit Email for OTP
    // - Enter the email address and click Continue
    // - Verify "Check your inbox" appears
    // (step comment)
    await tsEmail.fill(TRACKSTACK_EMAIL);
    await trackstack.getByRole('button', { name: 'Continue' }).click();
    const inboxMessage = trackstack.locator('text=Check your inbox');
    await expect(inboxMessage).toBeVisible({ timeout: 15000 });

    // 3. Access Gmail Account and Retrieve OTP
    // - Sign into Gmail and fetch the 6-digit code
    // (step comment)
    const otp = await fetchOtpFromGmail(gmail);

    // 4. Complete Login
    // - Return to Trackstack OTP verification page
    // - Enter the 6-digit OTP code and verify successful login
    // (step comment)
    await trackstack.bringToFront();
    // Try multiple selector strategies for the OTP input to make the test resilient
    const otpSelectors = [
      'input[type="number"][inputmode="numeric"]',
      "//div[@data-input-otp-container='true']//input[1]",
      'input[name="otp"]',
      '[data-testid="otp-input"] input',
      'input[aria-label*="code"]',
      'input[type="text"][inputmode="numeric"]'
    ];

    let otpFilled = false;
    for (const sel of otpSelectors) {
      try {
        const locator = trackstack.locator(sel);
        await expect(locator).toBeVisible({ timeout: 5000 });
        await locator.fill(otp);
        otpFilled = true;
        break;
      } catch (e) {
        // selector not found/visible within timeout, try next
      }
    }
    if (!otpFilled) {
      throw new Error('OTP input field not found using any of the tried selectors');
    }

    // Verify that the app navigates to an authenticated area (no longer contains /auth/)
    await expect(trackstack).not.toHaveURL(/\/auth\//, { timeout: 30000 });
  });
});
