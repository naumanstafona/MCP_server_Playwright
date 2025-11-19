import { BrowserContext, Page, expect } from '@playwright/test';

const TRACKSTACK_URL = 'https://testing.trackstack.app/auth/login';
const TRACKSTACK_EMAIL = 'nauman+autol@trackstack.app';
const GMAIL_USER = 'nauman@trackstack.app';
const GMAIL_PASS = 'BasketBall@2025';
const OTP_EMAIL_SUBJECT = 'Your sign in code';

async function fetchOtpFromGmail(page: Page): Promise<string> {
  // navigate to gmail sign-in and perform search for OTP
  await page.goto('https://accounts.google.com/signin/v2/identifier?service=mail');

  const emailInput = page.locator('input[type="email"]');
  await expect(emailInput).toBeVisible({ timeout: 15000 });
  await emailInput.fill(GMAIL_USER);
  await page.getByRole('button', { name: 'Next' }).click();

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
      // continue
    }
  }
  if (!pwFilled) throw new Error('Password field not found on Gmail login');
  await page.getByRole('button', { name: 'Next' }).click();

  await expect(page).toHaveURL(/mail\.google\.com/, { timeout: 60000 });

  const searchInput = page.locator('input[aria-label="Search mail"]');
  await expect(searchInput).toBeVisible({ timeout: 30000 });
  await searchInput.click();
  await searchInput.fill(`subject:"${OTP_EMAIL_SUBJECT}"`);
  await page.keyboard.press('Enter');

  const firstRow = page.locator('tr[role="row"]').first();
  await expect(firstRow).toBeVisible({ timeout: 30000 });
  await firstRow.click();

  const main = page.locator('div[role="main"]');
  await expect(main).toBeVisible({ timeout: 20000 });
  const bodyText = await main.innerText();
  const match = bodyText.match(/\b(\d{6})\b/);
  if (!match) throw new Error('No 6-digit OTP found in email body');
  return match[1];
}

export async function login(context: BrowserContext): Promise<Page> {
  // Create two pages: Trackstack and Gmail
  const trackstack = await context.newPage();
  const gmail = await context.newPage();

  // Open Trackstack and request OTP
  await trackstack.goto(TRACKSTACK_URL);
  const tsEmail = trackstack.getByTestId('email');
  await expect(tsEmail).toBeVisible({ timeout: 15000 });
  await tsEmail.fill(TRACKSTACK_EMAIL);
  await trackstack.getByRole('button', { name: 'Continue' }).click();
  await expect(trackstack.locator('text=Check your inbox')).toBeVisible({ timeout: 15000 });

  // Retrieve OTP from Gmail
  const otp = await fetchOtpFromGmail(gmail);

  // Fill OTP on Trackstack with resilient selectors
  await trackstack.bringToFront();
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
      // try next
    }
  }
  if (!otpFilled) throw new Error('OTP input field not found using any known selectors');

  // verify login succeeded
  await expect(trackstack).not.toHaveURL(/\/auth\//, { timeout: 30000 });

  // close gmail helper page
  try { await gmail.close(); } catch (e) { /* ignore */ }
  return trackstack;
}
