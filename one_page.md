# ToolLedger — OnePage

## Current authorisation and pending decisions

Current authorisation: review and correct these specification files only.
No interface, database, authentication, dependency, or deployment work is
authorised by this document update. Ask the owner to authorise the next stage.

Pending owner decisions:
- One visual reference and three reasons for choosing it.
- The approved Devign (daisyUI) component list.
- Visual drawings based on that reference. The written screen descriptions
  below already exist and define the required behaviour.
- Frontend setup, authentication provider, and saved-data technology.
  The phrase "course's approved setup" does not confirm a provider.

The reference, components, and drawings are required before interface work.
The backend/authentication choice is required before schema and integration
work; it does not block specification review or an authorised UI preview.
Do not choose Supabase, Firebase, or another provider without approval.

## What is it?

A simple tool lending tracker for workshops.

It helps workshop owners record tools they lend out,
remember who has them, and follow up when they are overdue.

## Who is it for?

David, a busy workshop carpenter who lends expensive
power tools to apprentices and neighboring artisans,
then forgets who has what.

## What one job does it do?

Help David know who has each borrowed tool and when
it should return.

## Smallest version

A workshop owner can sign up, log in, record a loan,
view outstanding and overdue loans, edit an unreturned
loan, mark a tool returned, and view returned loan history.

## The screens

### 1. Authentication

Show the ToolLedger name above a single form.

Login:
- Heading: "Log in".
- Labelled email and password fields.
- Main button: "Log in".
- Links to Sign Up and Forgot Password.

Sign Up:
- Heading: "Create an account".
- Labelled email and password fields.
- Main button: "Sign up".
- Link back to Login.

Forgot Password:
- Heading: "Reset your password".
- Labelled email field.
- Main button: "Send reset link".
- Link back to Login.

Reset Password:
- Labelled new password and confirm password fields.
- Main button: "Save new password".
- After success, direct the owner to Login.

Show validation and authentication messages near the form.
Email verification follows the course's approved setup.
Ask before implementation if that setup is unclear.

### 2. Dashboard

Show ToolLedger at the top left and Logout at the top right.

Below, show:
- Heading: "Tool Loans".
- Main button: "Add Loan".
- Status filter.
- Optional expected return date filter.
- A way to clear the date filter.

Initially show All Outstanding loans.

The status filter offers:
- All Outstanding.
- Borrowed.
- Overdue.
- Returned.

On laptops, show a table with:
- Tool name.
- Borrower name.
- Expected return date.
- Status.

On phones, show stacked cards with the same information.

Each loan has a clearly labelled way to open Loan Details.
Status always includes text, so colour is not the only indicator.

Selecting Returned shows returned loan history on this screen.

Empty states:
- "No outstanding loans."
- "No returned loans yet."
- "No loans match these filters."

When there are no loans at all, also show an Add Loan button.

### 3. Add / Edit Loan

Show a Back link, a heading, and one form.

Heading:
- "Add Loan" for a new record.
- "Edit Loan" for an existing record.

Show labelled fields in this order:
1. Tool name.
2. Borrower name.
3. Phone number.
4. Expected return date.

All four fields are required.

For editing, show borrowing date as read-only information.

Below the fields, show:
- Main button: "Save Loan" or "Save Changes".
- Secondary button: "Cancel".

Show validation errors beside the relevant fields.
Successful saving opens Loan Details.
Cancelling leaves records unchanged and returns to
the dashboard for Add Loan or Loan Details for Edit Loan.

### 4. Loan Details

Show a Back to Dashboard link above the tool name.
Show the status beside or immediately below the tool name.

Below, show clearly labelled information:
- Borrower name.
- Phone number.
- Borrowing date.
- Expected return date.
- Actual return date, when returned.

For an unreturned loan, show:
- Edit Loan.
- Mark Returned.

Mark Returned opens a confirmation dialog:
"Mark this tool as returned?"

The dialog has:
- Cancel.
- Confirm Return.

After a successful return, remain on Loan Details,
show Returned status and the actual return date,
and hide Edit Loan and Mark Returned.

Returned records are read-only.

## Userflows

1. Sign Up → Complete required verification, if any →
   Login → Dashboard.

2. Login → Dashboard → Select loan → Loan Details.

3. Dashboard → Add Loan → Save → Loan Details.

4. Loan Details → Edit Loan → Save Changes → Loan Details.

5. Loan Details → Mark Returned → Confirm Return →
   Read-only Loan Details.

6. Dashboard → Filter by status and/or expected return date →
   Select loan → Loan Details.

7. Dashboard → Select Returned → Select loan →
   Read-only Loan Details.

8. Login → Forgot Password → Request email →
   Open reset link → Set new password → Login.

9. Logout → Login.

## Rules and notes

### Ownership

- One workshop owner per account.
- Each owner can access only their own records.
- Login is required to view or change saved records.
- Access restrictions apply to direct links and data requests.
- Logout ends access to protected screens and records.
- Saved records remain available after logging in again.

### Loan records

- One loan represents one physical tool lent to one
  borrower on one occasion.
- A new loan records a tool already handed to the borrower.
- No advance reservations.
- Multiple tools lent together require separate loan records.
- Tool names are entered manually, such as "Angle Grinder 1".
- Owners should use names that distinguish physical tools.
- The app does not enforce unique tool names or prevent
  repeated tool names in outstanding loans.
- No separate inventory or borrower directory.
- Lending a returned tool again creates a new loan record.

### Inputs

- Tool name, borrower name, phone number, and expected
  return date are required.
- Text fields cannot be empty or contain only spaces.
- Phone numbers are entered manually.
- No SMS verification or strict phone-number validation.
- Trim leading and trailing spaces in tool name, borrower name, and phone number.
- Tool name: 1–100 characters after trimming.
- Borrower name: 1–100 characters after trimming.
- Phone number: 1–30 characters after trimming; use a telephone input.
- Preserve internal spaces, punctuation, and any leading + in phone numbers.
- Reject excessive lengths with a field error; do not silently truncate.

### Dates and editing

- All date rules use Africa/Lagos time.
- Loan dates are stored and displayed as dates only.
- Borrowing date is recorded automatically when creating
  a loan and cannot be edited.
- A new loan's expected return date must be today or later.
- Editing updates the same record.
- Editing may change expected return date to a past date.
- Only unreturned loans can be edited.

### Statuses

- Borrowed: unreturned, with expected return date today or later.
- Overdue: unreturned, with expected return date before today.
- Returned: the owner has confirmed the tool's return.
- A loan due today becomes overdue tomorrow.
- Borrowed and Overdue are calculated automatically
  using the current Africa/Lagos date.
- Owners do not manually select statuses.
- Returned records remain Returned regardless of due date.

### Filters and sorting

- All Outstanding includes Borrowed and Overdue.
- The date filter matches one exact expected return date.
- Both filters must match when used together.
- Outstanding loans are sorted by expected return date,
  earliest first.
- Returned loans are sorted by actual return date,
  newest first.

### Returns

- Mark Returned requires confirmation.
- Cancelling leaves the record unchanged.
- Confirming records today's Africa/Lagos date automatically.
- A successful return removes the loan from outstanding loans.
- The record appears under the Returned filter.
- Returned records cannot be edited, reopened, or deleted.

### Loading and saving

- Show a loading state while fetching records.
- Loading failures show an error and a retry option.
- Prevent repeated submissions while saving.
- Show success only after saving succeeds.
- Failed saves keep entered information and allow retry.
- Failed return actions leave the record unchanged.

### Design and technology

- The website works on phone and laptop browsers.
- Use the owner's approved Devign components.
- Choose one visual reference suited to a loan list,
  forms, and record details.
- Document three specific reasons for choosing it.
- Revise existing drawings to reflect the chosen reference.
- Final styling must follow the approved reference and drawings.
- Use the course's approved authentication and saved-data setup.
- Ask if the technology setup is unclear.
- Do not introduce another backend or a custom server.

## When is it done?

The MVP is complete when an owner can:

- Sign up, log in, reset their password, and log out.
- Record a loan and find the borrower and phone number.
- See correct Borrowed and Overdue statuses.
- Filter loans by status and expected return date.
- Edit an unreturned loan.
- Confirm a return and find its read-only history record.
- Log in again without losing saved records.
- Access only their own records.
- Use the workflow on phone and laptop browsers.
- Retry failed saves without losing entered information.

## What it will not do

- No rental marketplace or payments.
- No advance reservations.
- No separate inventory or borrower directory.
- No borrower accounts or staff roles.
- No automatic loan reminders.
- No built-in calling or messaging.
- No photos or condition reports.
- No barcode scanners, hardware integration, or GPS.
- No repair or maintenance logs.
- No native mobile app or offline use.
- No deleting, reopening, or edit history.
- No advanced search, reports, or exports.

## What is it called?

ToolLedger

## Implementation stages

1. Choose one visual reference and document three reasons.
2. Revise the drawings and approve screen descriptions.
3. Build and review the interface using sample data.
4. Document and review the database schema.
5. Connect the approved backend and authentication.
6. Connect saved loan records and verify owner access.

Complete only the stage currently authorised by the owner.

During the interface stage, authentication screens are
previews and do not create or authenticate real accounts.

## Detailed behaviour for implementation

These rules resolve the review's remaining functional ambiguities. Visual
component variants still require the approved component list and reference.

### Authentication behaviour

- Email is required, trimmed, and checked for valid email syntax.
- Passwords are not trimmed. New passwords must have 8–128 characters;
  no extra uppercase, digit, or symbol rule. The eventual provider must
  support this policy; report a conflict before integration.
- Login requires a nonempty password without applying new-password rules.
- Confirm password must exactly match the new password.
- Field errors sit immediately below their fields. Form-level success or
  failure messages sit above the main submit button.
- Required error: "This field is required." Email error:
  "Enter a valid email address." New-password error:
  "Use a password between 8 and 128 characters." Confirmation error:
  "Passwords do not match."
- Failed login: "Unable to log in. Check your details and try again."
- Failed signup: "Unable to create your account. Please try again."
- Reset request success: "If an account exists for this email, a reset link
  will be sent." Do not reveal whether an account exists.
- Invalid or expired reset link: "This reset link is invalid or has expired.
  Request a new link." Include a Forgot Password link.
- Successful reset: "Password updated. Please log in." Then open Login.
- No Remember Me option. For real authentication, retain login across reloads
  in the current browser session. Logout clears access; expired sessions
  return to Login with "Your session has expired. Please log in again."
  Browser session restoration may retain a session; do not promise that
  closing a tab or browser always logs out.
- Logged-out access to any protected page redirects to Login. Successful
  login opens Dashboard rather than automatically reopening a deep link.
- Email-verification requirements, reset-link lifetime, and provider session
  settings remain pending until the authentication setup is confirmed.

### Header, filters, and record layout

- Auth pages show the centred ToolLedger name above the form; no Logout.
- All signed-in screens show a shared header with ToolLedger left and
  Logout right. Keep both visible on phones. Page content sits below it.
- Use a labelled Status dropdown, defaulting to All Outstanding.
- Use a labelled Expected return date date input. It applies to every
  status option, including Returned, and matches expected return date,
  never actual return date.
- Put "Clear date" next to the date input; disable it when the input is empty.
  Clearing the date preserves the status filter. Filters update immediately.
- Arrange filters side by side when space allows and stack them on phones.
- Preserve filters when opening a record and returning to Dashboard.
  A full reload starts at All Outstanding with no date filter.
- Table columns: Tool name 30%, Borrower name 25%, Expected return date 20%,
  Status 15%, and Details action 10%. Long names wrap.
- Phone card order: tool name, borrower name, expected return date, status,
  then a "View Details" action. Use cards below 768px and tables otherwise.
- Loan Details order: Back to Dashboard, tool name heading, status below
  the heading, borrower name, phone number, borrowing date, expected return
  date, actual return date when returned, then available action buttons.
- Use only the approved dialog component for return confirmation.
  Cancel, Escape, or closing the dialog cancels without changing the record.
  Disable both action buttons while confirming; keep failures in the dialog
  with "Unable to mark this tool as returned. Please try again."
- The Add/Edit Back link follows the same destination as Cancel.

### Formatting and deterministic sorting

- Display dates as "06 Jul 2026"; date inputs use their browser-native format.
  Store date-only values as YYYY-MM-DD without timezone conversions.
- Display phone numbers as entered after trimming; no automatic reformatting.
- Status labels are exactly Borrowed, Overdue, and Returned. Use text plus
  the approved theme's warning, error, and success styling respectively.
  Exact colour shades come from the approved visual reference/theme.
- All unreturned views sort by expected return date ascending, then creation
  timestamp descending, then record ID ascending for a stable tie-breaker.
- Returned views sort by actual return date descending, then creation
  timestamp descending, then record ID ascending.
- Date rules always use Africa/Lagos, including on devices elsewhere.
  Refresh status when the page loads, regains focus, after changes, and
  when the Lagos date changes while the page is open.

### Loading, errors, and saving

- While loading, show "Loading loans…" in the list area. Add an approved
  loading indicator if it is on the component list; otherwise use text.
- Fetch failure: "Unable to load loans. Please try again." Place a Retry
  button immediately below it in the list area. Do not show an empty state
  while loading or after a failed fetch.
- Save failure: "Unable to save this loan. Please try again." Show above
  the submit button and preserve entered values.
- While saving, disable submit and show "Saving…". While returning, show
  "Returning…" on Confirm Return. Guard against duplicate submissions.
- Show validation beside the affected field. Length error:
  "Use no more than [limit] characters." New-loan date error:
  "Choose today or a later date." Invalid date: "Choose a valid date."
- Successful loan saves navigate to Loan Details. Return success remains
  on Loan Details and changes it to the read-only returned view.
- Missing or inaccessible record: "Loan not found or unavailable." Include
  Back to Dashboard; do not expose another owner's record information.

### Sample-data interface stage

- Clearly label the preview "Demo — sample data only".
- Login accepts no real credentials: a "Preview Dashboard" button enters
  the sample dashboard. Auth forms demonstrate validation and screen
  navigation only; never send emails or create real accounts.
- Label signup/reset submit actions as previews and show
  "Preview only. No account changes or emails were sent."
- Keep sample edits in memory only; reloading restores the initial samples.
  Logout returns to Login and resets the demo records.
- Generate dates relative to today's Africa/Lagos date so samples remain
  meaningful whenever the owner reviews the interface:

| Tool | Borrower | Sample phone | Borrowed | Expected return | Actual return | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Angle Grinder 1 | Sample Borrower A | 00000000001 | Today − 2 days | Today + 3 days | — | Borrowed |
| Cordless Drill 1 | Sample Borrower B | 00000000002 | Today − 1 day | Today | — | Borrowed |
| Circular Saw 1 | Sample Borrower C | 00000000003 | Today − 5 days | Today − 1 day | — | Overdue |
| Electric Sander 1 | Sample Borrower D | 00000000004 | Today − 7 days | Today − 2 days | Today − 3 days | Returned |

- Use stable sample IDs and creation timestamps based on each borrowing date.
- Review loading, fetch error, save error, return error, and empty states
  using development fixtures; these are not additional product screens.

### Existing marketplace prototype

The existing P2P marketplace `index.html` does not represent this MVP.
Do not extend its fees, deposits, ratings, borrower requests, or inventory
features. Before interface implementation, confirm whether to replace it
with ToolLedger or build ToolLedger separately. Preserve existing files
until that change is authorised.
