# Trackstack Login with Gmail OTP - Single Test Flow

## Test Scenario: Login to Trackstack using Gmail OTP

### Test Credentials
**Trackstack Application Email:**
- Email: nauman+autol@trackstack.app

**Gmail Account Credentials:**
- Email: nauman@trackstack.app
- Password: BasketBall@2025

### Test Flow Description
This is a complete end-to-end test flow for logging into Trackstack application using email OTP verification through Gmail.

### Step-by-Step Instructions

1. **Open Trackstack Application**
   - Navigate to https://testing.trackstack.app/auth/login
   - Verify login page loads successfully

2. **Submit Email for OTP**
   - Enter the email address: nauman+autol@trackstack.app
   - Click the "Continue" button
   - Wait for redirect to OTP verification page
   - Verify "Check your inbox" message appears

3. **Access Gmail Account**
   - Open Gmail (https://mail.google.com)
   - Enter Gmail email: nauman@trackstack.app
   - Click Next after email
   - Enter password: BasketBall@2025
   - Click Next after password
   - Wait for Gmail inbox to load completely

4. **Retrieve OTP**
   - Look for  the recent email with subject: "Your sign in code:"
   - Get the code written afer: "Your sign in code:"
   <!-- - Open the most recent matching email
   - Copy the 6-digit OTP code -->

5. **Complete Login**
   - Return to Trackstack OTP verification page
   - Enter the 6-digit OTP code
   - Wait for automatic verification
   - Verify successful login by checking URL change

### Expected Results
- Should successfully log into Trackstack application
- URL should no longer contain "/auth/" path
- Should have access to authenticated features

### Important Notes
- Use the OTP code immediately after receiving it
- Keep Gmail tab open until login is complete
- If CAPTCHA appears during Gmail login, complete it manually
- Make sure to copy OTP exactly as shown in email

### Error Handling
1. If Gmail security verification appears:
   - Complete the verification manually
   - Continue with the test flow

2. If OTP verification fails:
   - Verify the correct code was entered
   - Check if OTP has expired
   - Request new OTP if needed

3. If email doesn't arrive:
   - Check spam folder
   - Wait up to 2 minutes
   - Use resend OTP option if available