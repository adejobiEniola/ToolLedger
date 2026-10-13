import { useEffect, useRef, useState } from 'react'
import AppHeader from '../components/AppHeader.tsx'
import { formatDate } from '../lib/dates.ts'
import { getFixture } from '../lib/loans.ts'
import { statusOf } from '../lib/loans.ts'
import type { Loan } from '../lib/types.ts'

export default function LoanDetails({
  loan,
  today,
  onBack,
  onEdit,
  onReturned,
  onLogout,
}: {
  loan: Loan | null
  today: string
  onBack: () => void
  onEdit: () => void
  onReturned: () => Promise<void>
  onLogout: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [returnError, setReturnError] = useState<string | null>(null)

  useEffect(() => {
    if (dialogOpen) dialogRef.current?.showModal()
  }, [dialogOpen])

  function closeDialog() {
    dialogRef.current?.close()
    setDialogOpen(false)
    setConfirming(false)
    setReturnError(null)
  }

  async function handleConfirm() {
    if (confirming) return
    setConfirming(true)
    setReturnError(null)
    try {
      if (getFixture() === 'return-error') {
        throw new Error('fixture return error')
      }
      await onReturned()
      setDialogOpen(false)
      dialogRef.current?.close()
    } catch {
      setReturnError(
        'Unable to mark this tool as returned. Please try again.',
      )
    } finally {
      setConfirming(false)
    }
  }

  if (loan === null) {
    return (
      <div className="flex min-h-0 flex-1 flex-col bg-base-200">
        <AppHeader onLogout={onLogout} />
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 sm:px-6">
          <div className="card bg-base-100 p-8 text-center shadow">
            <p>Loan not found or unavailable.</p>
            <button
              type="button"
              className="btn btn-primary mt-4"
              onClick={onBack}
            >
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    )
  }

  const status = statusOf(loan, today)
  const badgeCls =
    status === 'Borrowed'
      ? 'badge-warning'
      : status === 'Overdue'
        ? 'badge-error'
        : 'badge-success'
  const returned = loan.actualReturnDate !== null

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-base-200">
      <AppHeader onLogout={onLogout} />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 sm:px-6">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onBack}>
          ← Back to Dashboard
        </button>

        <h1 className="font-display mt-3 break-words text-3xl font-extrabold">
          {loan.toolName}
        </h1>
        <p className="mt-2">
          <span className={`badge ${badgeCls}`}>{status}</span>
        </p>

        <dl className="card mt-4 bg-base-100 p-6 shadow">
          <div className="flex flex-col gap-1 border-b border-base-200 py-3">
            <dt className="text-sm font-semibold opacity-70">Borrower name</dt>
            <dd className="break-words">{loan.borrowerName}</dd>
          </div>
          <div className="flex flex-col gap-1 border-b border-base-200 py-3">
            <dt className="text-sm font-semibold opacity-70">Phone number</dt>
            <dd className="break-words">{loan.phone}</dd>
          </div>
          <div className="flex flex-col gap-1 border-b border-base-200 py-3">
            <dt className="text-sm font-semibold opacity-70">Borrowing date</dt>
            <dd>{formatDate(loan.borrowedDate)}</dd>
          </div>
          <div className="flex flex-col gap-1 border-b border-base-200 py-3">
            <dt className="text-sm font-semibold opacity-70">
              Expected return date
            </dt>
            <dd>{formatDate(loan.expectedReturnDate)}</dd>
          </div>
          {returned && loan.actualReturnDate && (
            <div className="flex flex-col gap-1 py-3">
              <dt className="text-sm font-semibold opacity-70">
                Actual return date
              </dt>
              <dd>{formatDate(loan.actualReturnDate)}</dd>
            </div>
          )}
        </dl>

        {!returned && (
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              className="btn btn-outline flex-1"
              onClick={onEdit}
            >
              Edit Loan
            </button>
            <button
              type="button"
              className="btn btn-primary flex-1"
              onClick={() => setDialogOpen(true)}
            >
              Mark Returned
            </button>
          </div>
        )}

        <dialog
          ref={dialogRef}
          className="modal"
          onClose={closeDialog}
          onClick={(e) => {
            if (e.target === dialogRef.current) closeDialog()
          }}
        >
          <div className="modal-box">
            <h2 className="font-display text-xl font-bold">
              Mark this tool as returned?
            </h2>
            {returnError && (
              <p role="alert" className="alert alert-error mt-4 text-sm">
                {returnError}
              </p>
            )}
            <div className="modal-action">
              <button
                type="button"
                className="btn btn-ghost"
                disabled={confirming}
                onClick={closeDialog}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={confirming}
                onClick={handleConfirm}
              >
                {confirming ? 'Returning…' : 'Confirm Return'}
              </button>
            </div>
          </div>
        </dialog>
      </main>
    </div>
  )
}
