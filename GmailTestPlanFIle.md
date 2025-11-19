# Create GmailLoginTestCase.md
$case = @'
# Gmail Login Test Case (Safe)

> Important: Do NOT paste real credentials or ask the test code to bypass CAPTCHA or other security controls. This test case uses placeholders and explains how to provide secrets securely at runtime.

Test Case ID: GL-001
Title: Gmail Sign-in (happy path)

Purpose
- Verify a test user can sign in to Gmail using valid credentials.

Preconditions
- Dedicated test account exists (do not use personal accounts).
- Test credentials are stored securely and made available to the test runtime (environment variables, secrets manager, CI secrets).
- Browser is started with a fresh profile (incognito/private) and no existing Gmail cookies.

Test data placeholders
- TEST_GMAIL_USER — email address (e.g., qa-account@example.com)
- TEST_GMAIL_PASSWORD — password

Steps
1. Launch a browser in private/incognito mode (or clear cookies before starting).
2. Navigate to https://accounts.google.com/.
3. In the email/phone field, enter the `TEST_GMAIL_USER` value and submit (click Next or press Enter).
4. When prompted, enter `TEST_GMAIL_PASSWORD` and submit.
5. If the account is authenticated, confirm landing in Gmail (inbox) or Google account landing page.

Expected result
- The user is authenticated and redirected to Gmail (https://mail.google.com/) or the account landing page.
- The signed-in account identity (email/avatar) is visible in the UI.$env:TEST_GMAIL_USER = 'your-test-email@example.com'
$env:TEST_GMAIL_PASSWORD = 'your-test-password'    # prefer loading from secret store
npx playwright test tests/gmail-login.spec.ts --headed

Success criteria
- Inbox or account landing page loads and shows the correct test account.

Negative/edge notes
- If CAPTCHA or risk-based verification appears, pause the automated flow and require manual completion.
- If MFA (2FA) is configured for the test account, complete the second factor manually or use a test account with a known TOTP seed if your security policy allows it.

Reporting
- Capture the steps, actual vs expected result, browser/OS, screenshots (failures only), and a short log.

How to run (manual)
- Copy this test case into your test runbook and execute the steps manually using a dedicated tester.

How to run (automated guidance)
- Supply credentials at runtime via environment variables or a secrets manager (never commit credentials).
- Detect CAPTCHA and pause for manual intervention.

Security reminder
- Do not check credentials into source control. Use CI secrets or an enterprise secret store.
'@

Set-Content -Path 'E:\MCP Server Automation\GmailLoginTestCase.md' -Value $case -Encoding UTF8

# Ensure tests directory exists
New-Item -ItemType Directory -Path 'E:\MCP Server Automation\tests' -Force | Out-Null

# Create Playwright test skeleton
$spec = @'
/*
 Playwright test skeleton for Gmail login (safe; no credentials included)
 Usage: set TEST_GMAIL_USER and TEST_GMAIL_PASSWORD in your environment (or fetch from secrets), then run with Playwright.
*/

import { test, expect } from '@playwright/test';

test.describe('Gmail Sign-in', () => {
  test('Happy path: login with valid credentials', async ({ page }) => {
    // Preconditions: TEST_GMAIL_USER and TEST_GMAIL_PASSWORD should be provided via environment variables
    const user = process.env.TEST_GMAIL_USER;
    const pass = process.env.TEST_GMAIL_PASSWORD;
    if (!user || !pass) {
      test.skip(true, 'Environment variables TEST_GMAIL_USER/TEST_GMAIL_PASSWORD not set');
      return;
    }

    // 1. Navigate to Google accounts sign-in
    await page.goto('https://accounts.google.com/');

    // 2. Fill email/phone and submit
    await page.fill('input[type="email"], input[type="text"]', user);
    await page.click('button:has-text("Next")');

    // Wait for password input to appear (give reasonable timeout)
    await page.waitForSelector('input[type="password"]', { timeout: 10000 });

    // 3. Fill password and submit
    await page.fill('input[type="password"]', pass);
    await page.click('button:has-text("Next")');

    // 4. Detect possible CAPTCHA/risk challenge
    const captchaFrame = await page.$('iframe[src*="recaptcha"], iframe[src*="captcha"]');
    const verifyText = await page.locator('text=/verify it|verify this device|challenge/i').first().count();
    if (captchaFrame || verifyText > 0) {
      // We cannot bypass CAPTCHA. Pause so a human can complete it.
      console.log('CAPTCHA or verification challenge detected. Please complete it manually to continue.');
      // page.pause() opens the Playwright inspector (works in headed mode)
      await page.pause();
    }

    // 5. Final verification: wait for Gmail to load (mail.google.com) or account landing indicators
    await page.waitForURL(/mail.google.com|myaccount.google.com|accounts.google.com\/signin\/v2\/identifier\?/, { timeout: 20000 }).catch(() => null);

    // Best-effort check: presence of Gmail main area or account avatar
    const inboxMain = await page.$('div[role="main"], div[aria-label*="Inbox"], a[title*="Inbox"]');
    const accountAvatar = await page.$('img[alt*="Account"]');

    if (inboxMain || accountAvatar) {
      expect(true).toBeTruthy();
    } else {
      // If we can't find inbox elements, fail with a helpful message
      throw new Error('Could not confirm Gmail inbox. Manual verification may be required.');
    }
  });
});
'@

Set-Content -Path 'E:\MCP Server Automation\tests\gmail-login.spec.ts' -Value $spec -Encoding UTF8

# Quick verification: list created files
Get-ChildItem -Path 'E:\MCP Server Automation' -Filter '*Gmail*' -Recurse | Format-Table -AutoSize

# Show first 30 lines of each created file (preview)
Write-Host "`n--- Preview: GmailLoginTestCase.md ---`n"
Get-Content -Path 'E:\MCP Server Automation\GmailLoginTestCase.md' -TotalCount 30
Write-Host "`n--- Preview: tests\gmail-login.spec.ts ---`n"
Get-Content -Path 'E:\MCP Server Automation\tests\gmail-login.spec.ts' -TotalCount 40