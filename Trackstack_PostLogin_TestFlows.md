# Dashboard - Single Test Flow

## Test Scenario: Verify dashboard loads and widgets are interactive

### Preconditions
- User is logged in via Gmail OTP (reuse `tests/login-to-trackstack-using-gmail-otp.spec.ts` as the authenticated precondition)

### Step-by-Step Instructions
1. Open the application and confirm you are on the Dashboard page after successful login.
2. Verify the main dashboard header/title is visible and contains the application name.
3. Confirm primary widgets (Overview, Recent Activity, Quick Actions) are visible on the page.
4. Click a widget item (for example, a recent track or activity) that should drill down to a details page.
5. Return to the Dashboard and apply a date filter or quick filter, then confirm widgets update accordingly.

### Expected Results
- Dashboard header/title is visible and correct.
- All primary widgets load without errors and display meaningful values (counts, charts, lists).
- Clicking a widget opens the expected details page with correct heading and content.
- Applying filters updates widget contents and any visible counts reflect the filter.

### Important Notes
- If widgets rely on background API calls, allow reasonable load time (use built-in retrying assertions).

### Error Handling
- If a widget fails to load due to an API error, capture a screenshot and network log, then retry the filter operation once.


# Tracks - Single Test Flow

## Test Scenario: List and view track details

### Preconditions
- User is logged in via Gmail OTP

### Step-by-Step Instructions
1. From the dashboard or main nav, click the 'Tracks' menu item to open the tracks list.
2. Verify the tracks list/table loads and column headers are visible (e.g., Name, Owner, Status, Updated).
3. Search for an existing track using the search input and confirm results filter accordingly.
4. Click the first track in the results to open its details page.
5. Verify the track details page shows the track name, description, owner and activity history.

### Expected Results
- Tracks list/table loads and renders rows or a clear empty-state message.
- Search returns matching results and the table updates.
- Track details page displays accurate information for the selected track.

### Error Handling
- If the tracks API returns an error, show the empty state and an error banner; retry the load once.


# Create Track - Single Test Flow

## Test Scenario: Create a new track via the Tracks module

### Preconditions
- User is logged in via Gmail OTP

### Step-by-Step Instructions
1. Navigate to the 'Tracks' page and click the 'Create' or 'New Track' button.
2. Fill in the required fields (Name, Description, Owner) with valid test data.
3. Submit the form by clicking 'Save' or 'Create'.
4. Wait for success confirmation and verify a success toast or banner appears.
5. Search the tracks list for the new track and confirm it appears with correct details.

### Expected Results
- The create form validates required inputs and allows submission with valid data.
- A success message appears and the new track is visible in the tracks list.

### Important Notes
- Use unique names for test resources to avoid collisions (e.g., prefix with test- and timestamp).

### Error Handling
- If the creation API returns a 4xx error for validation, verify inline validation messages are shown and no resource is created.


# Edit Track - Single Test Flow

## Test Scenario: Edit an existing track and persist changes

### Preconditions
- User is logged in via Gmail OTP
- At least one track exists in the system

### Step-by-Step Instructions
1. Open the 'Tracks' list and select an existing track.
2. Click the 'Edit' button on the track details page.
3. Modify the track description or another editable field.
4. Click 'Save' and wait for confirmation that the edit was successful.
5. Refresh the details page and verify the updated values persist.

### Expected Results
- The edit form accepts changes and shows a success confirmation.
- Updated values are persisted and visible after a page reload.

### Error Handling
- If concurrent edits cause a conflict, verify the UI shows a conflict or merge message and provides options.


# Delete Track - Single Test Flow

## Test Scenario: Delete a track with confirmation

### Preconditions
- User is logged in via Gmail OTP
- A test track exists which is safe to delete

### Step-by-Step Instructions
1. Navigate to the 'Tracks' list and locate the test track.
2. Click the delete action for the track (trash/delete icon or action menu).
3. Confirm the delete action in the confirmation dialog.
4. Verify the track is removed from the list and a success message appears.

### Expected Results
- Confirmation dialog displays correct resource name and asks for confirmation.
- After confirming, the track no longer appears in the list and the UI shows a success message.

### Error Handling
- If the delete fails due to server error, the UI should display an error message and the resource should remain unchanged.


# Bulk Actions (Tracks) - Single Test Flow

## Test Scenario: Perform bulk delete on multiple tracks

### Preconditions
- User is logged in via Gmail OTP
- At least two test tracks exist and can be safely deleted

### Step-by-Step Instructions
1. Open the 'Tracks' list and select multiple tracks using checkboxes.
2. Click the 'Bulk Actions' or 'Delete Selected' button.
3. Confirm the bulk delete action in the modal.
4. Verify all selected tracks are removed and that a summary or success message is shown.

### Expected Results
- Multiple items can be selected and processed in one bulk action.
- After bulk deletion, selected items are removed and the UI shows a clear success summary.

### Error Handling
- If some items cannot be deleted (partial failure), the UI should list failed items and leave them intact while removing the rest.


# Posts / Feed - Single Test Flow

## Test Scenario: Create and interact with a post in the feed

### Preconditions
- User is logged in via Gmail OTP

### Step-by-Step Instructions
1. Open the 'Posts' or 'Feed' module from the main navigation.
2. Click 'Create Post' and enter a post title and body content.
3. Submit the post and wait for it to appear in the feed.
4. Click the post to open details and add a comment.
5. Like or react to the post and verify the reaction count increments.

### Expected Results
- New posts appear in the feed immediately with correct content and author name.
- Comments are added and displayed under the post.
- Reaction and like counts update in the UI.

### Important Notes
- If real-time features are enabled, other connected sessions would see the post appear without refresh.

### Error Handling
- If post creation fails, verify the UI shows an error and the form preserves typed content for retry.


# Events / Modules - Single Test Flow

## Test Scenario: Create an event/module and RSVP

### Preconditions
- User is logged in via Gmail OTP

### Step-by-Step Instructions
1. Navigate to the 'Events' or 'Modules' section.
2. Click 'Create Event' and fill in required fields (Title, Date/Time, Description).
3. Save the event and verify it appears in the upcoming events list.
4. Open the event details and click 'RSVP' or 'Join'.
5. Verify RSVP status updates to 'Attending' (or equivalent).

### Expected Results
- Event is created and visible in the list with the provided details.
- RSVP action updates the attendee status and UI reflects the change.

### Error Handling
- If date/time validation fails, the form should show clear validation errors and prevent save.


# Inbox / Messages - Single Test Flow

## Test Scenario: View and open an inbox message

### Preconditions
- User is logged in via Gmail OTP
- At least one message exists in the inbox (or use test data)

### Step-by-Step Instructions
1. Click the 'Inbox' or 'Messages' menu item.
2. Verify the message list loads and shows subject, sender, and timestamp columns.
3. Click the first message row to open the message view.
4. Verify the message body, attachments (if any), and actions (reply, archive) are visible.

### Expected Results
- Message list loads and rows are clickable.
- Message view displays full message content and available actions.

### Error Handling
- If message content fails to load, show an error placeholder and allow retry.


# Reports / Analytics - Single Test Flow

## Test Scenario: Open a report and export data

### Preconditions
- User is logged in via Gmail OTP

### Step-by-Step Instructions
1. Open the 'Reports' module from navigation.
2. Verify charts and filters load on the reports overview page.
3. Select a standard report and open it.
4. Click 'Export' and choose CSV or PDF.
5. Verify a download is triggered and the file contains expected headers.

### Expected Results
- Report charts render correctly and filters apply.
- Exported file downloads and includes report headers/rows consistent with the UI.

### Error Handling
- If export fails, the UI should present an error with an option to retry or contact support.


# Team / Users - Single Test Flow

## Test Scenario: Invite a new team member and change role

### Preconditions
- User is logged in via Gmail OTP
- User has admin privileges to invite members

### Step-by-Step Instructions
1. Navigate to the 'Team' or 'Users' section.
2. Click 'Invite Member' and enter a valid email and role.
3. Submit the invite and verify the new pending invite appears in the list.
4. Locate an existing user and change their role to a different permission level.
5. Confirm the role change reflects in the UI and the user’s permissions update accordingly.

### Expected Results
- Invites are created and listed as pending until accepted.
- Role changes are persisted and reflected in the team list.

### Error Handling
- If invite fails due to invalid email or quota, show inline error and prevent submission.


# Settings - Profile Edit - Single Test Flow

## Test Scenario: Update profile display name and avatar

### Preconditions
- User is logged in via Gmail OTP

### Step-by-Step Instructions
1. Open the 'Settings' menu and go to 'Profile'.
2. Update the display name and upload a valid avatar image.
3. Click 'Save' and wait for success confirmation.
4. Verify the header/avatar updates across the app and the profile page shows the new values.

### Expected Results
- Profile changes persist and reflect in the application header and profile page.

### Important Notes
- Ensure uploaded avatar meets size/type restrictions.

### Error Handling
- If avatar upload fails, the UI should present file type/size validation and preserve other form fields.


# Settings - Security (Change Password) - Single Test Flow

## Test Scenario: Change account password

### Preconditions
- User is logged in via Gmail OTP

### Step-by-Step Instructions
1. Go to Settings -> Security.
2. Enter current password and a new password that meets complexity rules.
3. Confirm new password and submit change.
4. Verify success message and optionally re-login to confirm password works.

### Expected Results
- Password change succeeds and user can authenticate with the new password.

### Error Handling
- If current password is incorrect, an inline error should be displayed and password not changed.


# Settings - Notifications - Single Test Flow

## Test Scenario: Update email and in-app notification preferences

### Preconditions
- User is logged in via Gmail OTP

### Step-by-Step Instructions
1. Navigate to Settings -> Notifications.
2. Toggle email and in-app notification preferences on/off.
3. Click 'Save' and verify a success message.
4. Trigger a sample notification (if available) and verify it respects the updated preference.

### Expected Results
- Notification preferences persist and UI toggles reflect saved state.

### Error Handling
- If saving fails, display an error and keep toggles in their previous state.


# Integrations - Single Test Flow

## Test Scenario: Add a third-party integration (example: Slack)

### Preconditions
- User is logged in via Gmail OTP
- Integration credentials or access are available for the test

### Step-by-Step Instructions
1. Open Integrations from the nav and choose an integration (e.g., Slack).
2. Click 'Connect' and follow the integration OAuth/connection flow.
3. Complete authorization and return to the application.
4. Verify the integration shows an active/connected status in the integrations list.

### Expected Results
- Integration is connected and active; status shows recent connection time.

### Error Handling
- If OAuth is denied, the UI should display a clear error and allow retry.


# API Keys - Single Test Flow

## Test Scenario: Create and revoke an API key

### Preconditions
- User is logged in via Gmail OTP
- User has permission to manage API keys

### Step-by-Step Instructions
1. Go to Settings -> API Keys.
2. Click 'Create API Key' and provide a name for the key.
3. Save and copy the generated key value.
4. Revoke the key and verify it no longer appears in the active keys list.

### Expected Results
- New API key is generated and visible once created; revocation removes it.

### Error Handling
- If creation fails, show a detailed error and do not leak partial key values.


# Notifications (Real-time) - Single Test Flow

## Test Scenario: Receive and view a real-time notification

### Preconditions
- User is logged in via Gmail OTP
- Notification source can be triggered in test environment

### Step-by-Step Instructions
1. Trigger an action that sends a notification to the user (or use a test hook).
2. Observe the notification count increment in the header.
3. Open the notification popover and click the newest notification.
4. Verify the related item opens and the notification is marked as read.

### Expected Results
- Notification count increments and popover lists the new notification.
- Clicking the notification navigates to the related content and marks it read.

### Error Handling
- If the real-time channel disconnects, the UI should show an offline or reconnecting state and provide a retry.


# Profile Menu & Logout - Single Test Flow

## Test Scenario: Open profile menu and log out

### Preconditions
- User is logged in via Gmail OTP

### Step-by-Step Instructions
1. Click the profile avatar in the header to open the profile menu.
2. Verify menu options (Profile, Settings, Logout) are visible.
3. Click 'Logout' and confirm if prompted.
4. Verify the application redirects to the login page and session is cleared.

### Expected Results
- Profile menu shows correct options and logout returns the user to `/auth/login`.
- Session cookies/storage are cleared.

### Error Handling
- If logout fails, show a clear error and allow retry.


# Help / Feedback - Single Test Flow

## Test Scenario: Submit feedback via the help form

### Preconditions
- User is logged in via Gmail OTP

### Step-by-Step Instructions
1. Open 'Help' or 'Contact Support' from the navigation or footer.
2. Fill in the feedback form with a subject and message.
3. Submit the form and verify a success confirmation appears.

### Expected Results
- Feedback submission returns a visible confirmation and optionally a ticket ID.

### Error Handling
- If submission fails, the UI should preserve entered text and show an error with retry guidance.


# Reports Export (Smoke) - Single Test Flow

## Test Scenario: Quick smoke check for reports export

### Preconditions
- User is logged in via Gmail OTP

### Step-by-Step Instructions
1. Navigate to Reports and open a common report.
2. Click 'Export' and choose CSV.
3. Confirm a download starts and that the file contains a header row matching report columns.

### Expected Results
- Export triggers a file download and headers match the UI columns.

### Error Handling
- If download fails due to server error, show a retry option and capture diagnostics.


# Session Expiry / Re-auth - Single Test Flow

## Test Scenario: Validate session expiry handling and re-authentication

### Preconditions
- User is logged in via Gmail OTP

### Step-by-Step Instructions
1. Simulate session expiry (test hook or shorten token TTL in test env).
2. Attempt a user action that requires auth (e.g., create a track).
3. Verify the application prompts for re-authentication and redirects to login.
4. Re-authenticate using the Gmail OTP flow and confirm the original action can be resumed or retried.

### Expected Results
- On session expiry, the user is prompted to re-authenticate and session is cleared.
- After successful re-authentication, either the action resumes or the user receives a clear next step.

### Error Handling
- If re-authentication fails (e.g., Gmail CAPTCHA), provide a clear message and fallback guidance for manual recovery.


# Accessibility Smoke - Single Test Flow

## Test Scenario: Run accessibility checks on key pages

### Preconditions
- User is logged in via Gmail OTP

### Step-by-Step Instructions
1. Open Dashboard, a Track Details page, and Settings -> Profile.
2. Run automated accessibility checks (axe-core or equivalent) for each page.
3. Record any critical or serious violations.

### Expected Results
- No critical accessibility violations are present on the tested pages.
- Any violations are logged for remediation.

### Error Handling
- Accessibility tool errors should be logged and retried once.
