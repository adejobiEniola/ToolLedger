import AppHeader from '../components/AppHeader.tsx'
import { formatDate } from '../lib/dates.ts'
import { filterLoans, statusOf } from '../lib/loans.ts'
import type { Loan, StatusFilter } from '../lib/types.ts'

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all-outstanding', label: 'All Outstanding' },
  { value: 'borrowed', label: 'Borrowed' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'returned', label: 'Returned' },
]

function StatusBadge({ loan, today }: { loan: Loan; today: string }) {
  const status = statusOf(loan, today)
  const cls =
    status === 'Borrowed'
      ? 'badge-warning'
      : status === 'Overdue'
        ? 'badge-error'
        : 'badge-success'
  return <span className={`badge ${cls}`}>{status}</span>
}

export default function Dashboard({
  loans,
  today,
  status,
  date,
  loading,
  loadError,
  onRetry,
  onStatus,
  onDate,
  onAdd,
  onOpen,
  onLogout,
}: {
  loans: Loan[]
  today: string
  status: StatusFilter
  date: string
  loading: boolean
  loadError: string | null
  onRetry: () => void
  onStatus: (s: StatusFilter) => void
  onDate: (d: string) => void
  onAdd: () => void
  onOpen: (id: string) => void
  onLogout: () => void
}) {
  const list = filterLoans(loans, status, date, today)
  const hasAnyOutstanding = loans.some((l) => l.actualReturnDate === null)
  const filtersActive = status !== 'all-outstanding' || date !== ''

  function emptyState() {
    if (status === 'returned') return 'No returned loans yet.'
    if (filtersActive) return 'No loans match these filters.'
    return 'No outstanding loans.'
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-base-200">
      <AppHeader onLogout={onLogout} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-3xl font-extrabold">Tool Loans</h1>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onAdd}
          >
            Add Loan
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="form-control w-full sm:max-w-xs">
            <label className="label" htmlFor="status-filter">
              <span className="label-text font-semibold">Status</span>
            </label>
            <select
              id="status-filter"
              className="select select-bordered w-full"
              value={status}
              onChange={(e) => onStatus(e.target.value as StatusFilter)}
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-control w-full sm:max-w-xs">
            <label className="label" htmlFor="date-filter">
              <span className="label-text font-semibold">
                Expected return date
              </span>
            </label>
            <div className="flex items-center gap-2">
              <input
                id="date-filter"
                type="date"
                className="input input-bordered w-full"
                value={date}
                onChange={(e) => onDate(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-ghost btn-sm shrink-0"
                disabled={date === ''}
                onClick={() => onDate('')}
              >
                Clear date
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5">
          {loading ? (
            <div
              className="card bg-base-100 p-6 shadow"
              role="status"
              aria-label="Loading loans…"
            >
              <p className="mb-4 text-center">Loading loans…</p>
              <div className="hidden flex-col gap-3 md:flex" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="skeleton h-12 w-full motion-reduce:animate-none"
                  />
                ))}
              </div>
              <div className="flex flex-col gap-3 md:hidden" aria-hidden="true">
                {[0, 1].map((i) => (
                  <div
                    key={i}
                    className="skeleton h-28 w-full motion-reduce:animate-none"
                  />
                ))}
              </div>
            </div>
          ) : loadError !== null ? (
            <div className="card bg-base-100 p-8 text-center shadow">
              <p>{loadError}</p>
              <div>
                <button
                  type="button"
                  className="btn btn-primary mt-3"
                  onClick={onRetry}
                >
                  Retry
                </button>
              </div>
            </div>
          ) : list.length === 0 ? (
            <div className="card bg-base-100 p-8 text-center shadow">
              <p>{emptyState()}</p>
              {!hasAnyOutstanding && status !== 'returned' && (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary mt-3"
                    onClick={onAdd}
                  >
                    Add Loan
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="card hidden bg-base-100 shadow md:block">
                <table className="table">
                  <colgroup>
                    <col style={{ width: '30%' }} />
                    <col style={{ width: '25%' }} />
                    <col style={{ width: '20%' }} />
                    <col style={{ width: '15%' }} />
                    <col style={{ width: '10%' }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>Tool name</th>
                      <th>Borrower name</th>
                      <th>Expected return date</th>
                      <th>Status</th>
                      <th>
                        <span className="sr-only">Details</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((loan) => (
                      <tr key={loan.id}>
                        <td className="font-semibold break-words">
                          {loan.toolName}
                        </td>
                        <td className="break-words">{loan.borrowerName}</td>
                        <td>{formatDate(loan.expectedReturnDate)}</td>
                        <td>
                          <StatusBadge loan={loan} today={today} />
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            onClick={() => onOpen(loan.id)}
                          >
                            View details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col gap-3 md:hidden">
                {list.map((loan) => (
                  <div key={loan.id} className="card bg-base-100 p-4 shadow">
                    <p className="font-bold break-words">{loan.toolName}</p>
                    <p className="mt-1 break-words">{loan.borrowerName}</p>
                    <p className="mt-1 text-sm opacity-70">
                      {formatDate(loan.expectedReturnDate)}
                    </p>
                    <p className="mt-2">
                      <StatusBadge loan={loan} today={today} />
                    </p>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm mt-3 w-full"
                      onClick={() => onOpen(loan.id)}
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
