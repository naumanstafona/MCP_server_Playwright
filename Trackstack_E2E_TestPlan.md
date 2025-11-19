# Trackstack End-to-End Test Plan

This document is a comprehensive E2E test plan for the Trackstack web application. It uses the Gmail OTP login flow as a required precondition for all authenticated test cases (see `tests/login-to-trackstack-using-gmail-otp.spec.ts`).

Date: 2025-11-03
Author: Generated from workspace context

---

## Assumptions
- The Gmail OTP login test provided in `tests/login-to-trackstack-using-gmail-otp.spec.ts` is the canonical authentication flow used as a precondition for authenticated tests.
- Application routes and labels may vary across environments; replace route placeholders (e.g., `/dashboard`, `/tracks`) with the actual routes used in your deployment.
- Playwright Test is the test framework used for automation.

## Quick contract
- Inputs: authenticated user (TRACKSTACK_EMAIL), Gmail credentials for OTP, optional test data
- Outputs: pass/fail per case, screenshots/traces/HARs on failure, clear assertions
- Success: expected UI elements present, API responses OK, and navigation accurate
- Error modes: network/API failures, Gmail CAPTCHAs, slow load, role-based permission failures

## Edge cases to cover
- Empty and invalid inputs
- Slow networks and large datasets
- Permission differences (admin vs non-admin)
- Concurrency (duplicate creation/deletion)
- Expired or multiple OTP requests

---

## How to use this file
- Use the login test as a precondition or create a reusable auth fixture that returns `storageState` for faster test execution.
- Group tests into files by module: `dashboard.spec.ts`, `tracks.spec.ts`, `inbox.spec.ts`, `settings.spec.ts`, etc.
- Prioritize automating P0 flows first (see Priority column).

---

## Test Plan Table Summary (organized by module)

### Authentication (Precondition reused)

| ID | Feature / Flow | Positive scenarios | Negative scenarios | Assertions (UI & functional) | Navigation validation | Preconditions | Postconditions | Priority / Severity |
|---:|---|---|---|---|---|---|---|---|
| AUTH-01 | Login via Gmail OTP | Submit Trackstack email -> OTP via Gmail -> Enter OTP -> Successful login | Incorrect/expired OTP, Gmail CAPTCHA, blocked sign-in | "Check your inbox" visible; OTP fields visible; URL does not contain `/auth/`; user avatar visible; session storage present | /auth/login -> /auth/verify-otp -> /dashboard or /inbox | None (this test provides the authenticated state) | Authenticated session created | P0 / Critical |
| AUTH-02 | Login invalid email | Submit malformed or unknown email | Validation shown; cannot request OTP | Inline validation message; no redirect | stays on /auth/login | None | No session | P1 / High |
| AUTH-03 | OTP resend | Request OTP -> Resend -> new OTP delivered | Rate limit/resend blocked | Resend action sends new message; UI indicates send | stays on /auth/verify-otp | AUTH-01 | OTP delivered | P1 / High |


### Dashboard

| ID | Feature / Flow | Positive scenarios | Negative scenarios | Assertions | Navigation validation | Precondition | Postcondition | Priority |
|---:|---|---|---|---|---|---|---|---|
| DASH-01 | Dashboard loads and displays widgets | Login -> Dashboard shows overview widgets | Widget fails to load or API error | Page heading visible; widgets present; numeric counts >= 0; no 500 responses in network | /dashboard loads after login | AUTH-01 | Dashboard visible | P0 |
| DASH-02 | Widget drilldown | Click widget -> target page (e.g., track detail) | 404 or empty content | New page heading and details visible; URL updated to resource path | widget -> /tracks/:id | DASH-01 | Item page loaded | P1 |
| DASH-03 | Dashboard filters | Apply filters -> widgets update | Filters return no results or fail | Widget data updates; UI shows applied filters; counts change | UI or URL reflects filter | AUTH-01 | Filtered view | P1 |


### Tracks (Core module)

| ID | Feature / Flow | Positive scenarios | Negative scenarios | Assertions | Navigation validation | Precondition | Postcondition | Priority |
|---:|---|---|---|---|---|---|---|---|
| TRACKS-01 | List tracks | Open Tracks -> paginated list | API 500 or empty state | Table/grid visible; columns present; pagination or helpful empty state message | /tracks | AUTH-01 | Tracks listed or empty state | P0 |
| TRACKS-02 | Create new track | Fill form -> Save -> Visible in list | Validation errors for required fields | Success toast; new row present; API 201 | /tracks/new -> /tracks/:id | AUTH-01 | Track created | P0 |
| TRACKS-03 | Edit track | Edit fields -> Save -> Data updated | Save fails | Changes persist in UI; success toast shown | /tracks/:id -> /tracks/:id/edit | TRACKS-01 | Track updated | P1 |
| TRACKS-04 | Delete track | Delete with confirmation -> removed | Cancel or concurrent delete | Confirmation dialog; row removed after success; API 204 | /tracks/:id removed | TRACKS-01 | Track removed | P1 |
| TRACKS-05 | Bulk actions | Select multiple -> bulk delete/export | Partial failures on batch | All selected items processed; result summary shown | /tracks?bulk | TRACKS-01 | Bulk operation result | P2 |
| TRACKS-06 | Import/Export | Import CSV/JSON -> items created | Invalid format or partial import | Import summary shows success/errors; items present | /tracks/import | AUTH-01 | Items created | P2 |


### Inbox / Messages

| ID | Feature / Flow | Positive scenarios | Negative scenarios | Assertions | Navigation validation | Precondition | Postcondition | Priority |
|---:|---|---|---|---|---|---|---|---|
| INBOX-01 | View messages | Inbox lists recent messages | No messages or API error | Messages list visible; unread counts correct | /inbox | AUTH-01 | Messages displayed | P1 |
| INBOX-02 | Open message | Click message -> body loads | Body fails to render | Message content visible; attachments accessible | /inbox/:id | INBOX-01 | Message open | P1 |
| INBOX-03 | Search / filter messages | Search term -> filtered results | No results / search API error | Results match query; search input retains term | UI search state | AUTH-01 | Search results | P2 |


### Reports / Analytics

| ID | Feature / Flow | Positive scenarios | Negative scenarios | Assertions | Navigation validation | Precondition | Postcondition | Priority |
|---:|---|---|---|---|---|---|---|---|
| REPORT-01 | Reports overview | Charts and filters load | Chart errors / empty datasets | Chart elements visible; legends and axes shown; filters active | /reports | AUTH-01 | Reports loaded | P1 |
| REPORT-02 | Export report | Export to CSV/PDF -> file downloaded | Export API error | Download triggered; file format basic verification | /reports (download) | REPORT-01 | File present in downloads | P2 |


### Users / Team / Permissions

| ID | Feature / Flow | Positive scenarios | Negative scenarios | Assertions | Navigation validation | Precondition | Postcondition | Priority |
|---:|---|---|---|---|---|---|---|---|
| TEAM-01 | List team members | Admin sees team list | Permission denied for non-admin | Table visible; roles column present | /team | AUTH-01, admin | Team list | P0 (admin)
| TEAM-02 | Invite user | Send invite -> pending user row | Invalid email or invite limit | Pending invite appears; API 200 | /team/invite | TEAM-01 | Invite created | P1 |
| TEAM-03 | Role change / remove | Promote/demote/remove user | Cannot remove owner | Role updates reflected in UI; backend success | /team/:user | TEAM-01 | Role updated | P1 |


### Settings / Account

| ID | Feature / Flow | Positive scenarios | Negative scenarios | Assertions | Navigation validation | Precondition | Postcondition | Priority |
|---:|---|---|---|---|---|---|---|---|
| SETTINGS-01 | Profile edit | Update display name/avatar -> Save | Invalid avatar or validation | Changes reflected in header/profile; success toast | /settings/profile | AUTH-01 | Profile updated | P1 |
| SETTINGS-02 | Security settings | Change password / toggle 2FA | Wrong old password | Success message or re-auth flow | /settings/security | AUTH-01 | Security updated | P1 |
| SETTINGS-03 | Notification prefs | Toggle email/push -> Save | Backend error | Toggles persist; success message | /settings/notifications | AUTH-01 | Preferences saved | P2 |


### Integrations / API Keys

| ID | Feature / Flow | Positive scenarios | Negative scenarios | Assertions | Navigation validation | Precondition | Postcondition | Priority |
|---:|---|---|---|---|---|---|---|---|
| INT-01 | Add integration | Connect Slack/other -> Active | Auth denied or invalid config | Integration shows active status | /integrations | AUTH-01 | Integration active | P2 |
| INT-02 | API keys | Create/revoke keys | Key leak or permission error | New key present; revocation works | /settings/api-keys | AUTH-01 | Keys managed | P1 |


### Notifications & Real-time

| ID | Feature / Flow | Positive scenarios | Negative scenarios | Assertions | Navigation validation | Precondition | Postcondition | Priority |
|---:|---|---|---|---|---|---|---|---|
| NOTIF-01 | Notification popover | Trigger notification -> popover lists items | WebSocket disconnect | Popover opens; items clickable; unread counter updates | header/any page | AUTH-01 | Notifications shown | P1 |
| NOTIF-02 | Mark read/unread | Mark item read -> UI updates | Partial failure | Unread count decremented; state persisted | notifications UI | NOTIF-01 | State updated | P2 |


### Profile & Logout

| ID | Feature / Flow | Positive scenarios | Negative scenarios | Assertions | Navigation validation | Precondition | Postcondition | Priority |
|---:|---|---|---|---|---|---|---|---|
| PROFILE-01 | Profile menu & logout | Open profile -> logout | Logout fails | Profile menu options visible; logout clears session and navigates to /auth/login | /profile -> /auth/login | AUTH-01 | Session cleared | P0 |
| PROFILE-02 | Avatar / account switch | Switch account or multi-account | Unauthorized switch | User name/avatar updated; switch successful or error | header/profile | AUTH-01 | Account switched | P2 |


### Help, Support, Feedback

| ID | Feature / Flow | Positive scenarios | Negative scenarios | Assertions | Navigation validation | Precondition | Postcondition | Priority |
|---:|---|---|---|---|---|---|---|---|
| HELP-01 | Contact support | Submit feedback form -> success | Submission fails | Confirmation message; ticket/email recorded | /help or modal | AUTH-01 | Feedback recorded | P2 |


### Cross-cutting tests

| ID | Feature | Scenarios | Assertions | Pre/Post | Priority |
|---:|---|---|---|---|---|
| CROSS-01 | Accessibility smoke tests | Run axe/basic checks on Dashboard, track details, settings | No critical a11y failures | AUTH-01 | P1 |
| CROSS-02 | Responsive / mobile UI | Narrow viewport -> mobile nav | Menus accessible; no layout breakage | AUTH-01 | P2 |
| CROSS-03 | Session expiration / reauth | Expire session -> prompt to re-login | Re-login screen shown and session cleared | AUTH-01 | P1 |
| CROSS-04 | Multi-role auth matrix | Admin vs basic user flows | Restricted actions yield 403/disabled UI | AUTH-01 with different roles | P1 |
| CROSS-05 | Localization / i18n smoke | Basic translated strings present | Missing translations flagged | AUTH-01 | P2 |


---

## Detailed sample assertions (representative)
- After login: header shows user avatar and/or display name; URL does not contain `/auth/`.
- After create resource: success toast appears with expected text; new item present in listing; API returned 200/201.
- After delete: confirmation dialog contains correct resource name; item removed from UI after success.
- For forms: required validation appears for empty required fields; invalid values show inline error.
- Navigation: clicking nav changes URL to expected path and page heading matches label.

---

## Navigation mapping (post-login)
Click each nav item and assert the page loads and headings match:
- Dashboard -> `/dashboard` or root
- Tracks -> `/tracks`
- Inbox -> `/inbox`
- Reports -> `/reports`
- Team -> `/team`
- Integrations -> `/integrations`
- Settings -> `/settings` (subroutes: `profile`, `security`, `notifications`, `api-keys`)
- Profile -> `/profile`
- Help -> `/help`

Add smoke navigation tests that just click each nav, assert URL and heading, and take a screenshot.

---

## Priority / Severity guidance
- P0 (Critical): login, session, dashboard load, create/delete core resource, logout.
- P1 (High): user management, security settings, main CRUD operations.
- P2 (Medium): exports, integrations, accessibility, responsive checks.

---

## Automation-first recommendations (order)
1. Authentication & session (AUTH-01) — implement as a reusable fixture.
2. Dashboard load (DASH-01) + a core CRUD flow (TRACKS-02/03).
3. List + search + pagination (TRACKS-01).
4. Profile & logout (PROFILE-01).
5. Team invites & permissions (TEAM-01/02).
6. Inbox & notifications (INBOX-01/02, NOTIF-01).
7. Integrations & export (INT-01, REPORT-02).

---

## Recovery and resilience strategies for flaky network / API failures
- Implement a retry helper for transient API errors (retry POST/GET once or twice with exponential backoff).
- For Gmail OTP retrieval: attempt search/retry twice; if Gmail UI blocks due to CAPTCHA, fall back to a test mailbox API or a mocked OTP endpoint for CI.
- Use Playwright request interception to stub unreliable third-party endpoints in CI.
- Capture traces, HARs and screenshots on first retry/failure to ease debugging.

Implementation notes for retries (example pattern):
- Wrap important operations (create resource, export, OTP retrieval) in a `retry(asyncFn, {retries: 2, backoff: 500})` helper.
- Fail fast for permanent errors (400/401/403) but retry for 5xx/timeouts.

---

## Fixtures & test architecture suggestions
- Create an `authFixture` that:
  - Performs the Gmail OTP login (or loads `storageState` if already saved) and exposes an authenticated `context` or `page` for tests.
  - Optionally saves `storageState` to `test-results/dev-auth.json` to speed up tests.
- Centralize selectors in `fixtures/selectors.ts`.
- Use `helpers/gmailHelper.ts` to isolate OTP retrieval and allow replacing Gmail automation with a mailbox API in CI.
- Keep test data small and deterministic; delete created resources in teardown when safe.

---

## Missing coverage and observations
- Accessibility checks should be added (axe-core). Not currently present.
- Performance / load tests for heavy list pages are not covered.
- Offline / slow network scenarios should be tested.
- RBAC negative tests (non-admin access to admin pages) need explicit coverage.
- Gmail OTP automation is brittle due to Google bot protections — create a fallback (mock mailbox or test-only OTP endpoint).

---

## Test artifacts and recommended file layout
- `tests/` (per module): `auth.login.spec.ts`, `dashboard.spec.ts`, `tracks.spec.ts`, `inbox.spec.ts`, `team.spec.ts`, `settings.spec.ts`, `crosscutting.accessibility.spec.ts`
- `fixtures/`: `authFixture.ts`, `selectors.ts`
- `helpers/`: `gmailHelper.ts`, `apiHelpers.ts`
- `test-data/`: seeded test records
- `docs/`: human-readable test plans and runbooks

---

## Run guidance (example)
1. Generate an auth storage state once (run full login test manually in a secure environment):
```powershell
npx playwright test tests/login-to-trackstack-using-gmail-otp.spec.ts --headed
```
2. Run P0 tests using stored auth state (configure `playwright.config.ts` to use `storageState`):
```powershell
npx playwright test tests/dashboard.spec.ts --project=chromium
```

---

## Final notes
- Confirm real route paths and nav labels in the app and I will update the plan to use exact routes and recommended locators.
- Decide on Gmail OTP approach for CI: full Gmail automation (fragile) vs mocked mailbox/test-endpoint (recommended for CI).
- If you want, I can now generate the P0 test files (`auth.login.spec.ts`, `dashboard.spec.ts`, `tracks.spec.ts`) and wire an `authFixture` that reuses the Gmail OTP login or `storageState` approach. 


---

End of plan.
