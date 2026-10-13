# ToolLedger loan records — detailed rules

Preserved from schema.md before simplification. Documentation only; no database change has been made.

Table name: loan_records

Each row is one tool lent to one borrower on one occasion.

- id: uuid text, the unique id for the row.
- owner_id: text, the owner who owns this loan.
- tool_name: text, the name of the lent tool.
- borrower_name: text, the name of the borrower.
- phone_number: text, the borrower phone number as typed.
- borrowing_date: date, the day the tool was handed out.
- expected_return_date: date, the day the tool should come back.
- actual_return_date: date or empty, the day the tool came back.
- created_at: timestamp, when the row was created.
- updated_at: timestamp, when the row was last changed.

## Rules

- Required: id, owner_id, tool_name, borrower_name, phone_number, borrowing_date, expected_return_date, created_at, updated_at. Optional: actual_return_date stays empty until return.
- Defaults: id is auto-made; borrowing_date is today; actual_return_date starts empty; created_at and updated_at start as creation time.
- Text rules: trim spaces off tool_name, borrower_name, and phone_number. They cannot be empty or only spaces. Tool and borrower names allow 1 to 100 letters after trimming. Phone allows 1 to 30 letters after trimming. Show an error if too long; never cut text short. Tool names need not be unique. Keep phone spacing, marks, and starting + as typed.
- Dates: save dates as YYYY-MM-DD only, with no time zone change. All date checks use today in Africa/Lagos.
- Ownership: each row belongs to one logged-in owner. An owner sees and changes only their own rows.
- No changes allowed: id, owner_id, borrowing_date, and created_at never change. Actual_return_date is set once on return and then never changes. A returned row cannot be edited, reopened, or deleted. Updated_at changes on each edit or return.
- Return: a new loan needs today or a later expected date. An edit may use a past expected date. Returning sets actual_return_date to today.
- Status is not saved. Returned means actual_return_date is set. Borrowed means not returned and expected date is today or later. Overdue means not returned and expected date is before today. Due today turns overdue tomorrow. All outstanding means all not returned.
- Order: outstanding by expected date oldest first, then newest created, then smallest id. Returned by actual return newest first, then newest created, then smallest id.
- Refresh: check status on page load, when the page gets focus back, after each change, and when the Lagos date changes.
- Setup: id is the main key and is indexed. Owner_id is indexed. No status column is stored. This file only describes the plan; no database change has been made.
