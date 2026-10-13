# ToolLedger — Database Schema

Table: `loan_records`

Each row is one tool loan. The dashboard shows outstanding and
returned loans for the current user.

- `id`: uuid, primary key, automatically generated
- `owner_id`: uuid, references the user who owns the record
- `tool_name`: text, name of the tool
- `borrower_name`: text, name of the borrower
- `phone_number`: text, borrower's phone number
- `borrowing_date`: date, when the tool was lent, automatically recorded
- `expected_return_date`: date, when the tool should be returned
- `actual_return_date`: date, empty until the tool is returned
- `created_at`: timestamptz, when the record was created
- `updated_at`: timestamptz, when the record was last edited

See [schema-rules.md](schema-rules.md) for detailed rules.
