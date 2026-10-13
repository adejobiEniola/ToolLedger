import { useState } from 'react'
import type { FormEvent } from 'react'
import AppHeader from '../components/AppHeader.tsx'
import { formatDate, isValidDateString } from '../lib/dates.ts'
import { getFixture } from '../lib/loans.ts'
import type { Loan } from '../lib/types.ts'

export interface LoanFormData {
  toolName: string
  borrowerName: string
  phone: string
  expectedReturnDate: string
}

const REQUIRED = 'This field is required.'

export default function LoanForm({
  initial,
  today,
  onSave,
  onCancel,
  onLogout,
}: {
  initial: Loan | null
  today: string
  onSave: (data: LoanFormData) => Promise<void>
  onCancel: () => void
  onLogout: () => void
}) {
  const editing = initial !== null
  const [toolName, setToolName] = useState(initial?.toolName ?? '')
  const [borrowerName, setBorrowerName] = useState(initial?.borrowerName ?? '')
  const [phone, setPhone] = useState(initial?.phone ?? '')
  const [expected, setExpected] = useState(initial?.expectedReturnDate ?? '')
  const [toolError, setToolError] = useState<string | null>(null)
  const [borrowerError, setBorrowerError] = useState<string | null>(null)
  const [phoneError, setPhoneError] = useState<string | null>(null)
  const [dateError, setDateError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (saving) return

    const tool = toolName.trim()
    const borrower = borrowerName.trim()
    const phoneValue = phone.trim()
    let valid = true

    if (!tool) {
      setToolError(REQUIRED)
      valid = false
    } else if (tool.length > 100) {
      setToolError('Use no more than 100 characters.')
      valid = false
    } else {
      setToolError(null)
    }

    if (!borrower) {
      setBorrowerError(REQUIRED)
      valid = false
    } else if (borrower.length > 100) {
      setBorrowerError('Use no more than 100 characters.')
      valid = false
    } else {
      setBorrowerError(null)
    }

    if (!phoneValue) {
      setPhoneError(REQUIRED)
      valid = false
    } else if (phoneValue.length > 30) {
      setPhoneError('Use no more than 30 characters.')
      valid = false
    } else {
      setPhoneError(null)
    }

    if (!expected) {
      setDateError(REQUIRED)
      valid = false
    } else if (!isValidDateString(expected)) {
      setDateError('Choose a valid date.')
      valid = false
    } else if (!editing && expected < today) {
      setDateError('Choose today or a later date.')
      valid = false
    } else {
      setDateError(null)
    }

    if (!valid) return

    setSaving(true)
    setSaveError(null)
    try {
      if (getFixture() === 'save-error') {
        throw new Error('fixture save error')
      }
      await onSave({
        toolName: tool,
        borrowerName: borrower,
        phone: phoneValue,
        expectedReturnDate: expected,
      })
    } catch {
      setSaving(false)
      setSaveError('Unable to save this loan. Please try again.')
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-base-200">
      <AppHeader onLogout={onLogout} />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 sm:px-6">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel}>
          ← Back
        </button>
        <h1 className="font-display mt-3 text-3xl font-extrabold">
          {editing ? 'Edit Loan' : 'Add Loan'}
        </h1>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="card mt-5 bg-base-100 p-6 shadow"
        >
          {saveError && (
            <p role="alert" className="alert alert-error mb-4 text-sm">
              {saveError}
            </p>
          )}

          <div className="flex flex-col gap-4">
            <div className="form-control">
              <label className="label" htmlFor="loan-tool">
                <span className="label-text font-semibold">Tool name</span>
              </label>
              <input
                id="loan-tool"
                type="text"
                className="input input-bordered w-full"
                value={toolName}
                onChange={(e) => {
                  setToolName(e.target.value)
                  setToolError(null)
                }}
                aria-invalid={toolError !== null}
              />
              {toolError && (
                <p className="text-error mt-1 text-sm">{toolError}</p>
              )}
            </div>

            <div className="form-control">
              <label className="label" htmlFor="loan-borrower">
                <span className="label-text font-semibold">Borrower name</span>
              </label>
              <input
                id="loan-borrower"
                type="text"
                className="input input-bordered w-full"
                value={borrowerName}
                onChange={(e) => {
                  setBorrowerName(e.target.value)
                  setBorrowerError(null)
                }}
                aria-invalid={borrowerError !== null}
              />
              {borrowerError && (
                <p className="text-error mt-1 text-sm">{borrowerError}</p>
              )}
            </div>

            <div className="form-control">
              <label className="label" htmlFor="loan-phone">
                <span className="label-text font-semibold">Phone number</span>
              </label>
              <input
                id="loan-phone"
                type="tel"
                className="input input-bordered w-full"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value)
                  setPhoneError(null)
                }}
                aria-invalid={phoneError !== null}
              />
              {phoneError && (
                <p className="text-error mt-1 text-sm">{phoneError}</p>
              )}
            </div>

            <div className="form-control">
              <label className="label" htmlFor="loan-expected">
                <span className="label-text font-semibold">
                  Expected return date
                </span>
              </label>
              <input
                id="loan-expected"
                type="date"
                className="input input-bordered w-full"
                value={expected}
                onChange={(e) => {
                  setExpected(e.target.value)
                  setDateError(null)
                }}
                aria-invalid={dateError !== null}
              />
              {dateError && (
                <p className="text-error mt-1 text-sm">{dateError}</p>
              )}
            </div>

            {editing && initial && (
              <p className="text-sm opacity-70">
                Borrowing date: {formatDate(initial.borrowedDate)}
              </p>
            )}

            <div className="mt-2 flex gap-3">
              <button
                type="submit"
                className="btn btn-primary flex-1"
                disabled={saving}
              >
                {saving ? 'Saving…' : editing ? 'Save Changes' : 'Save Loan'}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={onCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
